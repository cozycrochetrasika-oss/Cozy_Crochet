'use client';

import React from 'react';
import Link from 'next/link';
import { User, Package, MapPin, Heart, LogOut, ShieldAlert } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Account Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center text-cocoa font-display font-bold text-2xl">
          AD
        </div>
        <div className="space-y-1 text-center sm:text-left flex-grow">
          <h1 className="font-display font-bold text-2xl text-ink">Aarti Deshmukh</h1>
          <p className="text-xs text-cocoa/75">aarti@example.com • +91 98765 43210</p>
          <span className="inline-block text-[10px] uppercase font-semibold bg-sage/20 text-cocoa px-2 py-0.5 rounded-full mt-1">
            Handmade Patron Member
          </span>
        </div>
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cocoa/5 hover:bg-cocoa/10 text-cocoa text-xs font-semibold border border-border/60 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-cocoa" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

      {/* Account Grid Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/orders"
          className="p-6 rounded-2xl bg-surface border border-border hover:border-dustyRose/60 transition-all shadow-sm space-y-2 group"
        >
          <Package className="w-6 h-6 text-dustyRose group-hover:scale-110 transition-transform" />
          <h3 className="font-display font-bold text-base text-ink">Order History</h3>
          <p className="text-xs text-cocoa/70">View past handmade orders, milestones, and invoices.</p>
        </Link>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
          <MapPin className="w-6 h-6 text-warmGold" />
          <h3 className="font-display font-bold text-base text-ink">Saved Addresses</h3>
          <p className="text-xs text-cocoa/70">Default: Flat 402, Lotus Heights, Pune 411038</p>
        </div>

        <Link
          href="/customize"
          className="p-6 rounded-2xl bg-surface border border-border hover:border-dustyRose/60 transition-all shadow-sm space-y-2 group"
        >
          <Heart className="w-6 h-6 text-sage group-hover:scale-110 transition-transform" />
          <h3 className="font-display font-bold text-base text-ink">Custom Requests</h3>
          <p className="text-xs text-cocoa/70">Track progress of bespoke crochet commissions.</p>
        </Link>
      </div>
    </div>
  );
}
