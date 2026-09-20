'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, KeyRound, Lock } from 'lucide-react';
import { PasswordSecurityForm } from '@/components/auth/password-security-form';

export default function AdminSecuritySettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-4 border-b border-pink-100 flex items-center justify-between">
        <div>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-pink-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store Settings</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-ink">
            Admin Credential & Password Security
          </h1>
          <p className="text-xs text-text-secondary">
            Update master store admin credentials. All changes are cryptographically salted and hashed.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-pink-100">
          <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-ink">Update Store Owner Password</h2>
            <p className="text-xs text-text-secondary">
              Must be at least 8 characters and contain uppercase, lowercase, and numbers/symbols.
            </p>
          </div>
        </div>

        <PasswordSecurityForm mode="admin" />
      </div>
    </div>
  );
}
