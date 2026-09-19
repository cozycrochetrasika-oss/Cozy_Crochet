import React from 'react';
import Link from 'next/link';
import { Package, DollarSign, Clock, Users, ArrowUpRight, PlusCircle } from 'lucide-react';
import { formatINR, getAllProducts } from '@/data/products';

export default function AdminDashboardPage() {
  const products = getAllProducts();
  const totalInventory = products.reduce((acc, p) => acc + p.inventoryQty, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">Store Operations Overview</h1>
          <p className="text-xs sm:text-sm text-cocoa/75 mt-0.5">Live metrics for Cozy_Crochets handmade storefront.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-cream/50 border border-border/70 space-y-1">
          <span className="text-[11px] uppercase font-bold text-cocoa/60">Total Gross Revenue</span>
          <div className="font-mono font-extrabold text-2xl text-ink">{formatINR(18490000)}</div>
          <span className="text-[11px] text-sage font-semibold">+18% this festive season</span>
        </div>

        <div className="p-5 rounded-2xl bg-cream/50 border border-border/70 space-y-1">
          <span className="text-[11px] uppercase font-bold text-cocoa/60">Ready Inventory</span>
          <div className="font-mono font-extrabold text-2xl text-ink">{totalInventory} units</div>
          <span className="text-[11px] text-cocoa/70">Across 7 active collections</span>
        </div>

        <div className="p-5 rounded-2xl bg-cream/50 border border-border/70 space-y-1">
          <span className="text-[11px] uppercase font-bold text-cocoa/60">Pending UPI Reviews</span>
          <div className="font-mono font-extrabold text-2xl text-dustyRose">3 orders</div>
          <span className="text-[11px] text-dustyRose font-semibold">Requires 6-digit code check</span>
        </div>

        <div className="p-5 rounded-2xl bg-cream/50 border border-border/70 space-y-1">
          <span className="text-[11px] uppercase font-bold text-cocoa/60">Bespoke Inquiries</span>
          <div className="font-mono font-extrabold text-2xl text-ink">5 requests</div>
          <span className="text-[11px] text-sage font-semibold">2 custom bouquets quoted</span>
        </div>
      </div>

      {/* Quick Action Tables */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-ink">Recent Orders Awaiting Verification</h3>
          <Link href="/admin/orders" className="text-xs font-semibold text-dustyRose hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-cream/70 text-cocoa/70 font-semibold uppercase tracking-wider border-y border-border">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Verification Code</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-cream/30">
                <td className="py-3.5 px-4 font-mono font-bold text-ink">CC-914820</td>
                <td className="py-3.5 px-4">Ananya Sharma (Bangalore)</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-sage/20 text-cocoa font-medium">Manual UPI</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-dustyRose">841920</td>
                <td className="py-3.5 px-4 font-mono font-bold">{formatINR(199900)}</td>
                <td className="py-3.5 px-4">
                  <Link
                    href="/admin/orders"
                    className="px-3 py-1 rounded-lg bg-dustyRose text-white font-semibold text-[11px] hover:bg-dustyRose/90"
                  >
                    Verify Payment
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-cream/30">
                <td className="py-3.5 px-4 font-mono font-bold text-ink">CC-882103</td>
                <td className="py-3.5 px-4">Rohan Mehta (Mumbai)</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-blush/40 text-cocoa font-medium">Stripe Card</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-cocoa/50">Auto-Verified</td>
                <td className="py-3.5 px-4 font-mono font-bold">{formatINR(149900)}</td>
                <td className="py-3.5 px-4">
                  <span className="text-sage font-semibold">Crafting</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
