'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Clock, ArrowRight } from 'lucide-react';
import { formatINR } from '@/data/products';

export default function OrdersPage() {
  const sampleOrders = [
    {
      id: 'ord_101',
      orderNumber: 'CC-914820',
      date: 'Sep 18, 2026',
      totalPaise: 199900,
      status: 'crafting',
      statusLabel: 'Being Handcrafted',
      itemCount: 1,
      firstItemName: 'Crochet Bouquet',
    },
    {
      id: 'ord_102',
      orderNumber: 'CC-882103',
      date: 'Aug 24, 2026',
      totalPaise: 149900,
      status: 'delivered',
      statusLabel: 'Delivered',
      itemCount: 1,
      firstItemName: 'Crochet Bag',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">My Handcrafted Orders</h1>
        <p className="text-sm text-cocoa/75 mt-1">Track fulfillment and crafting milestones for your orders.</p>
      </div>

      <div className="space-y-4">
        {sampleOrders.map((order) => (
          <div
            key={order.id}
            className="p-6 rounded-2xl bg-surface border border-border/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blush/30 flex items-center justify-center text-cocoa flex-shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-ink">{order.orderNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      order.status === 'delivered'
                        ? 'bg-sage/20 text-cocoa'
                        : 'bg-warmGold/20 text-cocoa'
                    }`}
                  >
                    {order.statusLabel}
                  </span>
                </div>
                <p className="text-xs text-cocoa/70 mt-0.5">
                  Ordered on {order.date} • {order.firstItemName}
                </p>
                <span className="font-mono font-bold text-sm text-ink block mt-1">
                  {formatINR(order.totalPaise)}
                </span>
              </div>
            </div>

            <Link
              href={`/orders/${order.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-dustyRose hover:underline"
            >
              <span>View Tracking & Receipt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
