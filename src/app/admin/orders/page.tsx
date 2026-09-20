'use client';

import React, { useState, useEffect } from 'react';
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
  const { orders: storeOrders, updatePaymentStatus: storeUpdatePayment, updateFulfilmentStatus: storeUpdateFulfilment } =
    useOrdersStore();

  const [orders, setOrders] = useState<StoreOrder[]>(storeOrders);
  const [loading, setLoading] = useState(true);
  const [verifyModalOrder, setVerifyModalOrder] = useState<StoreOrder | null>(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders', {
        headers: { 'Cache-Control': 'no-store' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          const mapped: StoreOrder[] = data.orders.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.customerName,
            email: o.customerEmail || '',
            phone: o.customerPhone,
            city: o.shippingAddress?.split(',')[1]?.trim() || 'India',
            addressLine1: o.shippingAddress || '',
            state: 'India',
            postalCode: '',
            items: o.items.map((it: any) => ({
              productId: it.productId,
              name: it.productName || it.name,
              quantity: it.quantity,
              pricePaise: it.pricePaise,
            })),
            totalPaise: o.totalPaise,
            paymentProvider: o.paymentProvider === 'stripe' ? 'stripe' : 'upi_manual',
            paymentStatus: o.paymentStatus === 'verified' ? 'paid' : (o.paymentStatus || 'payment_pending'),
            fulfilmentStatus: o.fulfilmentStatus === 'crafting' ? 'processing' : (o.fulfilmentStatus || 'processing'),
            rawCodeForDemo: o.verificationCode,
            verificationAttempts: 0,
            createdAt: new Date(o.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          }));
          setOrders(mapped);
          return;
        }
      }
      setOrders(storeOrders);
    } catch (err) {
      console.error('[AdminOrders] Error fetching orders from server:', err);
      setOrders(storeOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdatePaymentStatus = async (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    storeUpdatePayment(orderId, status);

    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: status === 'paid' ? 'verified' : status,
        }),
      });
    } catch (err) {
      console.error('[AdminOrders] Error updating payment status on server:', err);
    }
  };

  const handleUpdateFulfilmentStatus = async (orderId: string, status: FulfilmentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fulfilmentStatus: status } : o))
    );
    storeUpdateFulfilment(orderId, status);

    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          fulfilmentStatus: status,
        }),
      });
    } catch (err) {
      console.error('[AdminOrders] Error updating fulfilment status on server:', err);
    }
  };

  const handleOpenVerifyModal = (order: StoreOrder) => {
    setVerifyModalOrder(order);
    setEnteredCode('');
    setVerifyError(null);
    setVerifySuccess(null);
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyModalOrder) return;

    const matchesDemo = enteredCode.trim() === verifyModalOrder.rawCodeForDemo;
    let valid = matchesDemo;

    if (verifyModalOrder.verificationCodeHash) {
      const result = await verifyPaymentCode(
        enteredCode,
        verifyModalOrder.verificationCodeHash,
        verifyModalOrder.verificationAttempts
      );
      valid = result.valid;
    }

    if (valid || matchesDemo) {
      handleUpdatePaymentStatus(verifyModalOrder.id, 'paid');
      setVerifySuccess('Payment successfully verified and marked as Paid!');

      try {
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: verifyModalOrder.id,
            action: 'verify_payment',
            verificationCode: enteredCode.trim(),
          }),
        });
      } catch (err) {
        console.error('[AdminOrders] Server verification notification failed:', err);
      }

      setTimeout(() => {
        setVerifyModalOrder(null);
      }, 1200);
    } else {
      setVerifyError('Verification code does not match customer transaction record.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Orders & Fulfillment Management</h1>
          <p className="text-xs text-text-secondary">
            Independent controls for UPI payment authorization and artisan workshop fulfillment.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-semibold text-pink-700 hover:bg-pink-50 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-pink-100 bg-white shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-pink-50/50 text-ink font-semibold uppercase tracking-wider border-b border-pink-100">
            <tr>
              <th className="py-3.5 px-4">Order #</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Provider</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Payment Status</th>
              <th className="py-3.5 px-4">Fulfilment Status</th>
              <th className="py-3.5 px-4 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-pink-50/20 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-ink">
                  <div>{order.orderNumber}</div>
                  <div className="text-[10px] text-text-secondary font-normal">{order.createdAt}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-ink block">{order.customerName}</span>
                  <span className="text-text-secondary">{order.city} • {order.phone}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      order.paymentProvider === 'upi_manual'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-pink-50 text-pink-700 border border-pink-200'
                    }`}
                  >
                    {order.paymentProvider === 'upi_manual' ? 'Manual UPI' : 'Stripe Card'}
                  </span>
                  {order.rawCodeForDemo && (
                    <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                      Code: {order.rawCodeForDemo}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-ink">
                  {formatINR(order.totalPaise)}
                </td>

                {/* Independent Payment Status Dropdown */}
                <td className="py-3.5 px-4">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      handleUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border outline-none ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : order.paymentStatus === 'payment_review'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : order.paymentStatus === 'refunded'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-pink-50/70 text-pink-700 border-pink-200'
                    }`}
                  >
                    <option value="payment_pending">Pending</option>
                    <option value="payment_review">Review</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>

                {/* Independent Fulfilment Status Dropdown */}
                <td className="py-3.5 px-4">
                  <select
                    value={order.fulfilmentStatus}
                    onChange={(e) =>
                      handleUpdateFulfilmentStatus(order.id, e.target.value as FulfilmentStatus)
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border outline-none ${
                      order.fulfilmentStatus === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : order.fulfilmentStatus === 'shipped'
                        ? 'bg-purple-50 text-purple-700 border-purple-300'
                        : order.fulfilmentStatus === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-pink-50/70 text-pink-700 border-pink-200'
                    }`}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                {/* Verification Modal Action */}
                <td className="py-3.5 px-4 text-right">
                  {order.paymentStatus !== 'paid' && order.paymentProvider === 'upi_manual' ? (
                    <button
                      type="button"
                      onClick={() => handleOpenVerifyModal(order)}
                      className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-[11px] transition-colors shadow-xs"
                    >
                      Verify Code
                    </button>
                  ) : order.paymentStatus === 'paid' ? (
                    <span className="text-emerald-600 font-semibold text-[11px] inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Paid
                    </span>
                  ) : (
                    <span className="text-text-secondary text-[11px]">Authorized</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cryptographic Payment Verification Modal */}
      {verifyModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-pink-200 space-y-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-ink">
                  Verify UPI Code ({verifyModalOrder.orderNumber})
                </h3>
                <span className="text-xs text-text-secondary">{verifyModalOrder.customerName}</span>
              </div>
              <span className="font-mono font-bold text-sm text-pink-600">
                {formatINR(verifyModalOrder.totalPaise)}
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Check your business UPI / bank statement for this payment amount. Then enter the 6-digit confirmation code provided by the customer:
            </p>

            {verifyModalOrder.rawCodeForDemo && (
              <div className="p-3 rounded-xl bg-pink-50/60 border border-pink-200 text-xs text-ink flex items-center justify-between">
                <span className="text-text-secondary">Customer Code (Demo Record):</span>
                <strong className="font-mono font-bold text-pink-700 tracking-wider">
                  {verifyModalOrder.rawCodeForDemo}
                </strong>
              </div>
            )}

            {verifyError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            {verifySuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
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
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/20 text-center font-mono font-extrabold text-2xl tracking-widest outline-none focus:border-pink-500 text-ink"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setVerifyModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 shadow-xs transition-colors"
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
