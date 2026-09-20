'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('cozycrochetrasika@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loginAsAdmin } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials. Please check your admin details.');
        setLoading(false);
        return;
      }

      loginAsAdmin(data.user?.email || email, data.user?.fullName || 'Rasika (Store Owner)');

      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Unable to connect to authentication server. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-pink-100 selection:text-pink-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-pink-200 shadow-xs bg-white group-hover:scale-105 transition-transform">
            <Image
              src="/brand/logo.jpg"
              alt="Cozy_Crochets Logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-ink">
            Cozy_Crochets
          </span>
        </Link>
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-2xl text-ink tracking-tight">
            Store Owner Portal
          </h1>
          <p className="text-xs text-textSecondary max-w-xs mx-auto">
            Authorized administrative dashboard for catalog, inventory, and order operations.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-pink-200/80 shadow-md shadow-pink-500/5 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200/70 text-red-700 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5" htmlFor="admin-email">
                Owner Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cozycrochetrasika@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white text-ink text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-ink" htmlFor="admin-password">
                  Security Password
                </label>
                <Link
                  href="/admin/settings/security"
                  className="text-[11px] font-medium text-pink-600 hover:text-pink-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white text-ink text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-ink p-1 rounded-md transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Owner Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-textSecondary">
            <div className="flex items-center gap-1.5 text-pink-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-pink-500" />
              <span>Encrypted Session Guard</span>
            </div>
            <Link
              href="/"
              className="text-pink-600 hover:text-pink-700 font-semibold hover:underline"
            >
              Return to Storefront →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-pink-50/40 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
