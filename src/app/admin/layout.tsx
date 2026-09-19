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
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders & Payments', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Custom Requests', href: '/admin/custom-requests', icon: MessageSquare },
    { name: 'Banners & Captions', href: '/admin/banners', icon: ImageIcon },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-[85vh] bg-surface-muted/40 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-cocoa">
                <ShieldAlert className="w-5 h-5 text-dustyRose" />
                <span className="font-display font-bold text-base text-ink">Admin Control</span>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-dustyRose text-white shadow-sm'
                          : 'text-cocoa hover:bg-cream hover:text-ink'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-border/60">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs font-semibold text-cocoa hover:text-dustyRose transition-colors px-3 py-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Storefront</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Admin Main View */}
          <main className="flex-grow">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
