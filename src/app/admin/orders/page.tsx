'use client';

import React, { useState } from 'react';
import { Check, Clock, QrCode, Search, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { formatINR } from '@/data/products';
import {
  useOrdersStore,
  StoreOrder,
  PaymentStatus,
  FulfilmentStatus,
} from '@/store/orders-store';
import { verifyPaymentCode } from '@/lib/payments/security';

export default function AdminOrdersPage() {
  const { orders, updatePaymentStatus, updateFulfilmentStatus, recordVerificationAttempt } =
    useOrdersStore();

  const [verifyModalOrder, setVerifyModalOrder] = useState<StoreOrder | null>(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

  const handleOpenVerifyModal = (order: StoreOrder) => {
    setVerifyModalOrder(order);
    setEnteredCode('');
    setVerifyError(null);
    setVerifySuccess(null);
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyModalOrder) return;

    recordVerificationAttempt(verifyModalOrder.id);

    // If order has a stored hash, verify against it
    if (verifyModalOrder.verificationCodeHash) {
      const result = await verifyPaymentCode(
        enteredCode,
        verifyModalOrder.verificationCodeHash,
        verifyModalOrder.verificationAttempts
      );

      if (result.valid) {
        updatePaymentStatus(verifyModalOrder.id, 'paid');
        setVerifySuccess(result.message);
        setTimeout(() => {
          setVerifyModalOrder(null);
        }, 1200);
      } else {
        setVerifyError(result.message);
      }
    } else {
      // Fallback for demo orders
      if (enteredCode.trim() === verifyModalOrder.rawCodeForDemo) {
        updatePaymentStatus(verifyModalOrder.id, 'paid');
        setVerifySuccess('Payment marked as verified and paid!');
        setTimeout(() => {
          setVerifyModalOrder(null);
        }, 1200);
      } else {
        setVerifyError('Verification code does not match bank record.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display font-bold text-2xl text-ink">Orders & Fulfillment Management</h1>
        <p className="text-xs text-cocoa/75">
          Independent controls for payment authorization and artisan workshop fulfillment.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-cream/70 text-cocoa font-semibold uppercase tracking-wider border-y border-border">
            <tr>
              <th className="py-3 px-3">Order #</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Provider</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Payment Status</th>
              <th className="py-3 px-3">Fulfilment Status</th>
              <th className="py-3 px-3 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-cream/20">
                <td className="py-3.5 px-3 font-mono font-bold text-ink">
                  <div>{order.orderNumber}</div>
                  <div className="text-[10px] text-cocoa/50 font-normal">{order.createdAt}</div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="font-semibold text-ink block">{order.customerName}</span>
                  <span className="text-cocoa/60">{order.city} • {order.phone}</span>
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      order.paymentProvider === 'upi_manual'
                        ? 'bg-sage/20 text-cocoa'
                        : 'bg-blush/40 text-cocoa'
                    }`}
                  >
                    {order.paymentProvider === 'upi_manual' ? 'Manual UPI' : 'Stripe Card'}
                  </span>
                  {order.rawCodeForDemo && (
                    <div className="text-[10px] font-mono text-cocoa/60 mt-0.5">
                      Code: {order.rawCodeForDemo}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-ink">
                  {formatINR(order.totalPaise)}
                </td>

                {/* Independent Payment Status Dropdown */}
                <td className="py-3.5 px-3">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      updatePaymentStatus(order.id, e.target.value as PaymentStatus)
                    }
                    className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border outline-none ${
                      order.paymentStatus === 'paid'
                        ? 'bg-sage/20 text-cocoa border-sage/40'
                        : order.paymentStatus === 'payment_review'
                        ? 'bg-warmGold/25 text-cocoa border-warmGold/40'
                        : order.paymentStatus === 'refunded'
                        ? 'bg-danger/20 text-danger border-danger/30'
                        : 'bg-blush/40 text-cocoa border-blush'
                    }`}
                  >
                    <option value="payment_pending">Pending</option>
                    <option value="payment_review">Review</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>

                {/* Independent Fulfilment Status Dropdown */}
                <td className="py-3.5 px-3">
                  <select
                    value={order.fulfilmentStatus}
                    onChange={(e) =>
                      updateFulfilmentStatus(order.id, e.target.value as FulfilmentStatus)
                    }
                    className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border outline-none ${
                      order.fulfilmentStatus === 'delivered'
                        ? 'bg-sage/20 text-cocoa border-sage/40'
                        : order.fulfilmentStatus === 'shipped'
                        ? 'bg-lavender/30 text-cocoa border-lavender/40'
                        : order.fulfilmentStatus === 'cancelled'
                        ? 'bg-danger/15 text-danger border-danger/30'
                        : 'bg-cream text-cocoa border-border'
                    }`}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                {/* Verification Modal Action */}
                <td className="py-3.5 px-3 text-right">
                  {order.paymentStatus !== 'paid' && order.paymentProvider === 'upi_manual' ? (
                    <button
                      type="button"
                      onClick={() => handleOpenVerifyModal(order)}
                      className="px-3 py-1.5 rounded-lg bg-dustyRose hover:bg-dustyRose/90 text-white font-semibold text-[11px] transition-colors shadow-xs"
                    >
                      Verify Code
                    </button>
                  ) : order.paymentStatus === 'paid' ? (
                    <span className="text-sage font-semibold text-[11px] inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Paid
                    </span>
                  ) : (
                    <span className="text-cocoa/50 text-[11px]">Authorized</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cryptographic Payment Verification Modal */}
      {verifyModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/50 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-ink">
                  Verify UPI Code ({verifyModalOrder.orderNumber})
                </h3>
                <span className="text-xs text-cocoa/70">{verifyModalOrder.customerName}</span>
              </div>
              <span className="font-mono font-bold text-sm text-ink">
                {formatINR(verifyModalOrder.totalPaise)}
              </span>
            </div>

            <p className="text-xs text-cocoa leading-relaxed">
              Check your business UPI / bank statement for this amount. Then enter the 6-digit confirmation code provided by the customer:
            </p>

            {verifyModalOrder.rawCodeForDemo && (
              <div className="p-2.5 rounded-xl bg-cream/70 border border-border/70 text-xs text-cocoa flex items-center justify-between">
                <span>Customer Code (Demo Preview):</span>
                <strong className="font-mono font-bold text-dustyRose">
                  {verifyModalOrder.rawCodeForDemo}
                </strong>
              </div>
            )}

            {verifyError && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            {verifySuccess && (
              <div className="p-3 rounded-xl bg-sage/20 border border-sage text-cocoa text-xs flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0 text-sage" />
                <span>{verifySuccess}</span>
              </div>
            )}

            <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="6-digit code"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-cream/30 text-center font-mono font-extrabold text-2xl tracking-widest outline-none focus:border-dustyRose"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setVerifyModalOrder(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-cocoa hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-dustyRose text-white text-xs font-semibold hover:bg-dustyRose/90 shadow-sm"
                >
                  Confirm & Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
