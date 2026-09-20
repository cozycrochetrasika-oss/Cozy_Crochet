'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, UserCheck, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get('redirect') || '/account';
  const redirectUrl = /^\/(?![\/\\])/.test(requestedRedirect) && !requestedRedirect.includes('\\') ? requestedRedirect : '/account';
  const intent = searchParams.get('intent');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { loginAsCustomer, loginAsAdmin, pendingIntent, clearPendingIntent } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);

  const processPendingIntentAndRedirect = (role: 'customer' | 'admin') => {
    if (intent === 'add-to-cart' && pendingIntent) {
      addItem(pendingIntent.product, pendingIntent.quantity);
      setToastMessage(
        `Added ${pendingIntent.quantity}x "${pendingIntent.product.name}" to your shopping bag!`
      );
      clearPendingIntent();
      setTimeout(() => {
        router.push(redirectUrl || '/cart');
      }, 800);
      return;
    }

    if (role === 'admin' && redirectUrl === '/account') {
      router.push('/admin');
    } else {
      router.push(redirectUrl);
    }
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsCustomer(email, email.split('@')[0]);
    processPendingIntentAndRedirect('customer');
  };

  const handleQuickCustomer = () => {
    loginAsCustomer('patron@example.com', 'Aarti Deshmukh');
    processPendingIntentAndRedirect('customer');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" className="mb-6 p-4 rounded-2xl bg-pink-50 border border-pink-200 text-pink-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <ShoppingBag className="w-4 h-4 text-pink-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-8 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-pink-200 shadow-xs mx-auto bg-white">
            <Image
              src="/brand/logo.jpg"
              alt="Cozy Stitches by Rasika Logo"
              fill
              sizes="64px"
              priority
              className="object-cover"
            />
          </div>
          <h1 className="font-display font-bold text-2xl text-ink">Sign in to Cozy_Crochets</h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            {intent === 'add-to-cart'
              ? 'Please sign in to add your handcrafted item to bag and complete checkout.'
              : 'Access your order history, delivery tracking, and saved craft preferences.'}
          </p>
        </div>

        {/* Quick Customer Access Button */}
        <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 space-y-2.5">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary/70 text-center">
            Instant Customer Demo Access
          </span>
          <button
            type="button"
            onClick={handleQuickCustomer}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-ink text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-pink-600" />
            <span>Continue as Customer (Aarti Deshmukh)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-text-secondary/50 z-10">
            or enter account details
          </span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-pink-100" />
          </div>
        </div>

        {/* Standard Email/Password Form */}
        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-ink mb-1">Email Address</label>
            <div className="relative">
              <input
                id="login-email"
                autoComplete="username"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 bg-white text-ink text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
              />
              <Mail className="w-4 h-4 text-text-secondary/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-ink mb-1">Password</label>
            <div className="relative">
              <input
                id="login-password"
                autoComplete="current-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 bg-white text-ink text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
              />
              <Lock className="w-4 h-4 text-text-secondary/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-text-secondary pt-2 border-t border-pink-100">
          <span>Store owner / artisan? </span>
          <Link href="/admin/login" className="text-pink-600 font-semibold hover:underline">
            Go to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-20 text-center text-cocoa text-sm font-medium">
          Loading authentication portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
