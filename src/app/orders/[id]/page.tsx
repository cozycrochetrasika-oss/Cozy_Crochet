'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, PackageCheck, Truck, Sparkles, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { formatINR } from '@/data/products';
import { useOrdersStore } from '@/store/orders-store';

export default function OrderReceiptPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const orders = useOrdersStore((state) => state.orders);

  const matchedOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  const orderNumber = matchedOrder?.orderNumber || (orderId ? `CC-${orderId.slice(-6)}` : 'CC-914820');
  const customerName = matchedOrder?.customerName || 'Aarti Deshmukh';
  const paymentStatus = matchedOrder?.paymentStatus || 'payment_review';
  const fulfilmentStatus = matchedOrder?.fulfilmentStatus || 'processing';
  const totalPaise = matchedOrder?.totalPaise || 199900;
  const items = matchedOrder?.items || [
    { productId: 'boque_01', name: 'Crochet Bouquet', quantity: 1, pricePaise: 199900 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs font-medium text-cocoa hover:text-dustyRose mb-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
        <h1 className="font-display font-extrabold text-3xl text-ink">Order Receipt & Tracking</h1>
        <span className="font-mono text-xs text-cocoa/70 block mt-1">
          Order Reference: <strong className="text-ink">{orderNumber}</strong> ({customerName})
        </span>
      </div>

      {/* Crafting Milestone Progress based on Decoupled Statuses */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="font-display font-bold text-lg text-ink">Workshop Progress</h2>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                paymentStatus === 'paid'
                  ? 'bg-sage/20 text-cocoa'
                  : 'bg-warmGold/20 text-cocoa'
              }`}
            >
              Payment: {paymentStatus === 'paid' ? 'Paid' : 'Review'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blush/50 text-cocoa">
              Fulfillment: {fulfilmentStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                paymentStatus === 'paid' ? 'bg-sage text-white' : 'bg-warmGold text-white'
              }`}
            >
              ✓
            </div>
            <span className="font-semibold text-ink block">
              {paymentStatus === 'paid' ? 'Payment Verified' : 'Payment Review'}
            </span>
          </div>

          <div className="space-y-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                fulfilmentStatus === 'processing' || fulfilmentStatus === 'shipped' || fulfilmentStatus === 'delivered'
                  ? 'bg-dustyRose text-white'
                  : 'bg-cream border border-border text-cocoa'
              }`}
            >
              🧶
            </div>
            <span className="font-semibold text-dustyRose block">Stitching</span>
          </div>

          <div className="space-y-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                fulfilmentStatus === 'shipped' || fulfilmentStatus === 'delivered'
                  ? 'bg-lavender text-white'
                  : 'bg-cream border border-border text-cocoa/50'
              }`}
            >
              📦
            </div>
            <span
              className={`block ${
                fulfilmentStatus === 'shipped' || fulfilmentStatus === 'delivered'
                  ? 'font-semibold text-ink'
                  : 'font-medium text-cocoa/50'
              }`}
            >
              Dispatched
            </span>
          </div>

          <div className="space-y-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                fulfilmentStatus === 'delivered'
                  ? 'bg-sage text-white'
                  : 'bg-cream border border-border text-cocoa/50'
              }`}
            >
              🏠
            </div>
            <span
              className={`block ${
                fulfilmentStatus === 'delivered' ? 'font-semibold text-ink' : 'font-medium text-cocoa/50'
              }`}
            >
              Delivered
            </span>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-4 text-sm text-cocoa">
        <h3 className="font-display font-bold text-base text-ink">Items in this Delivery</h3>
        <div className="space-y-2 divide-y divide-border/50">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between py-2">
              <span className="text-ink font-medium">
                {item.quantity}x {item.name}
              </span>
              <span className="font-mono font-bold text-ink">
                {formatINR(item.pricePaise * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between py-1 border-t border-border/50">
          <span>Artisan Dispatch & Signature Gift Box</span>
          <span className="font-semibold text-sage">FREE</span>
        </div>
        <div className="flex justify-between items-baseline pt-3 border-t border-border font-bold text-base text-ink">
          <span>Total Order Value</span>
          <span className="font-mono text-2xl text-ink">{formatINR(totalPaise)}</span>
        </div>
      </div>
    </div>
  );
}
