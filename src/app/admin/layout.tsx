'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  ArrowLeft,
  ShieldAlert,
  Lock,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, loginAsAdmin } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders & Payments', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Custom Requests', href: '/admin/custom-requests', icon: MessageSquare },
    { name: 'Banners & Captions', href: '/admin/banners', icon: ImageIcon },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
    { name: 'Security & Password', href: '/admin/settings/security', icon: Lock },
  ];

  // Client-side role validation barrier
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-white">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-blue-100 shadow-md text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-bold text-2xl text-ink">Admin Authorization Required</h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              This portal is restricted to authorized Cozy_Crochets store owners. Please sign in with admin privileges.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Admin Portal</span>
            </Link>
            <button
              type="button"
              onClick={() => loginAsAdmin()}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Quick Authenticate as Store Owner</span>
            </button>
            <div className="pt-2">
              <Link
                href="/"
                className="text-xs text-text-secondary hover:text-blue-600 transition-colors"
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
    <div className="min-h-[85vh] bg-blue-50/20 border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-ink">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-ink block">Admin Control</span>
                  <span className="text-[10px] text-text-secondary truncate block max-w-[150px]">
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
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-text-secondary hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-blue-100">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-blue-600 transition-colors px-3 py-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Storefront</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Admin Main View */}
          <main className="flex-grow">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
