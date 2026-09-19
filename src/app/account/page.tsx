'use client';

import React from 'react';
import Link from 'next/link';
import { User, Package, MapPin, Heart, LogOut, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const name = user?.fullName || 'Valued Patron';
  const email = user?.email || 'patron@example.com';
  const role = user?.role || 'customer';

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Account Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-display font-bold text-2xl shadow-xs">
          {initials}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-grow">
          <h1 className="font-display font-bold text-2xl text-ink">{name}</h1>
          <p className="text-xs text-text-secondary">{email}</p>
          <span className="inline-block text-[10px] uppercase font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full mt-1">
            {role === 'admin' ? 'Store Administrator' : 'Handmade Patron Member'}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {role === 'admin' && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}
          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-text-secondary hover:text-ink text-xs font-semibold transition-colors border border-blue-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Account Grid Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/orders"
          className="p-6 rounded-2xl bg-white border border-blue-100 hover:border-blue-300 transition-all shadow-sm space-y-2 group"
        >
          <Package className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
          <h3 className="font-display font-bold text-base text-ink">Order History</h3>
          <p className="text-xs text-text-secondary">View past handmade orders, milestones, and invoices.</p>
        </Link>

        <Link
          href="/customize"
          className="p-6 rounded-2xl bg-white border border-blue-100 hover:border-blue-300 transition-all shadow-sm space-y-2 group"
        >
          <Heart className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
          <h3 className="font-display font-bold text-base text-ink">Custom Requests</h3>
          <p className="text-xs text-text-secondary">Track progress of bespoke crochet commissions.</p>
        </Link>

        <Link
          href="/account/security"
          className="p-6 rounded-2xl bg-white border border-blue-100 hover:border-blue-300 transition-all shadow-sm space-y-2 group"
        >
          <KeyRound className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
          <h3 className="font-display font-bold text-base text-ink">Password & Security</h3>
          <p className="text-xs text-text-secondary">Update account password and review credential security.</p>
        </Link>

        <div className="p-6 rounded-2xl bg-white border border-blue-100 space-y-2">
          <MapPin className="w-6 h-6 text-warmGold" />
          <h3 className="font-display font-bold text-base text-ink">Saved Addresses</h3>
          <p className="text-xs text-text-secondary">Deliveries to India addresses with speed post tracking.</p>
        </div>
      </div>
    </div>
  );
}
