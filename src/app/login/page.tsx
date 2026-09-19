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
  const redirectUrl = searchParams.get('redirect') || '/account';
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

  const handleQuickAdmin = () => {
    loginAsAdmin('cozycrochetrasika@gmail.com', 'Rasika (Store Owner)');
    processPendingIntentAndRedirect('admin');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <ShoppingBag className="w-4 h-4 text-blue-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-blue-200 shadow-xs mx-auto bg-white">
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

        {/* Quick Demo Switcher */}
        <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-2.5">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary/70 text-center">
            Demo Quick Login
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-blue-50 border border-blue-100 text-ink text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Store Owner</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-text-secondary/50 z-10">
            or sign in with email
          </span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-100" />
          </div>
        </div>

        {/* Standard Email/Password Form */}
        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              <Mail className="w-4 h-4 text-text-secondary/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              <Lock className="w-4 h-4 text-text-secondary/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-text-secondary pt-2 border-t border-blue-100">
          <span>Store administrator? </span>
          <Link href="/admin" className="text-blue-600 font-semibold hover:underline">
            Go to Admin Center
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
