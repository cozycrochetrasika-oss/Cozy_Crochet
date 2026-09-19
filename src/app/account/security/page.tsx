'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { PasswordSecurityForm } from '@/components/auth/password-security-form';

export default function AccountSecurityPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header with Back button */}
      <div className="flex items-center justify-between pb-4 border-b border-blue-100">
        <div className="space-y-1">
          <Link
            href="/account"
            className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account</span>
          </Link>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            Account & Password Security
          </h1>
          <p className="text-xs text-text-secondary">
            Manage your credentials, change your login password, and secure your patron account.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-blue-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-ink">Change Login Password</h2>
            <p className="text-xs text-text-secondary">Enter your current password to set a new secure credential.</p>
          </div>
        </div>

        <PasswordSecurityForm mode="account" />
      </div>
    </div>
  );
}
