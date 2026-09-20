'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
  Settings,
  ArrowLeft,
  ShieldAlert,
  Lock,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Exclude login page from admin frame
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products Catalog', href: '/admin/products', icon: Package },
    { name: 'Homepage Content', href: '/admin/homepage', icon: Sparkles },
    { name: 'Festival Banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'Orders & Payments', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Review Moderation', href: '/admin/reviews', icon: Star },
    { name: 'Custom Requests', href: '/admin/custom-requests', icon: MessageSquare },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
    { name: 'Security & Password', href: '/admin/settings/security', icon: Lock },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network failure on logout
    }
    logout();
    router.push('/admin/login');
  };

  // Client-side role validation barrier
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-pink-50/30">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-pink-200 shadow-md text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-bold text-2xl text-ink">Admin Authorization Required</h1>
            <p className="text-xs text-textSecondary leading-relaxed">
              This portal is restricted to authorized Cozy_Crochets store administrators. Please log in to proceed.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href={`/admin/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Owner Portal</span>
            </Link>
            <div className="pt-2">
              <Link
                href="/"
                className="text-xs text-textSecondary hover:text-pink-600 transition-colors"
              >
                ← Return to Public Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50/20 border-t border-pink-100/80">
      {/* Top Admin Sub-Bar */}
      <div className="bg-white border-b border-pink-100 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-textSecondary hover:bg-pink-50 hover:text-pink-600 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-pink-200 shadow-xs bg-white">
                <Image
                  src="/brand/logo.jpg"
                  alt="Cozy_Crochets Logo"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-display font-bold text-base text-ink block leading-none">
                  Cozy_Crochets
                </span>
                <span className="text-[10px] text-pink-600 font-semibold uppercase tracking-wider">
                  Store Owner CMS
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-pink-200 text-ink hover:bg-pink-50 hover:text-pink-700 transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 hover:text-pink-800 transition-colors border border-pink-200/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Sidebar for Desktop & Collapsible Mobile Menu */}
          <aside
            className={`w-full lg:w-64 flex-shrink-0 space-y-6 ${
              mobileNavOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="p-5 rounded-2xl bg-white border border-pink-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-pink-100 text-ink">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-display font-bold text-xs text-ink block truncate">
                    Rasika (Store Owner)
                  </span>
                  <span className="text-[10px] text-textSecondary truncate block">
                    {user.email}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin/dashboard' &&
                      item.href !== '/admin/settings' &&
                      pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-pink-600 text-white shadow-xs'
                          : 'text-textSecondary hover:bg-pink-50 hover:text-pink-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-pink-100">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs font-semibold text-textSecondary hover:text-pink-600 transition-colors px-3 py-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Public Store</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Admin Main Workspace View */}
          <main className="flex-grow">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-200/80 shadow-xs">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
