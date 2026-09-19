'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  MapPin,
  User,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useSiteSettingsStore } from '@/store/site-settings-store';
import { useAuthStore } from '@/store/auth-store';
import { LocationDrawer } from '@/components/location/location-drawer';
import { CartDrawer } from '@/components/commerce/cart-drawer';

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [pincode, setPincode] = useState('110001');

  // Zustand stores
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const {
    dailyCaption,
    festivalBannerActive,
    festivalMessage,
    announcementDismissed,
    dismissAnnouncement,
  } = useSiteSettingsStore();

  const { user, isAuthenticated, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Customize', href: '/customize' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* 1. ADMIN-CONTROLLED ANNOUNCEMENT BAR (Closable) */}
      {mounted && !announcementDismissed && (
        <div className="bg-cocoa text-cream text-xs py-2 px-4 text-center tracking-wide flex items-center justify-between gap-3 border-b border-border/40 relative z-50">
          <div className="flex-1 flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-warmGold flex-shrink-0 animate-pulse" />
            <span className="font-medium">{dailyCaption}</span>
            {festivalBannerActive && festivalMessage && (
              <>
                <span className="hidden sm:inline text-cream/40">•</span>
                <span className="text-blush font-semibold">{festivalMessage}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={dismissAnnouncement}
            className="p-1 rounded text-cream/70 hover:text-cream hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Dismiss announcement"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MAIN NAVIGATION HEADER (Sticky Glass & Blur) */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-cocoa hover:bg-blush/30 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-dustyRose flex items-center justify-center text-white font-display text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-ink group-hover:text-dustyRose transition-colors">
              Cozy_Crochets
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition-colors ${
                    isActive ? 'text-dustyRose font-semibold' : 'text-cocoa hover:text-ink'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-dustyRose rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Location Selector Trigger */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs text-cocoa hover:text-ink py-1.5 px-3 rounded-full border border-border/60 hover:border-dustyRose bg-surface/80 transition-colors"
              title="Select Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-dustyRose" />
              <span>Deliver to: <strong className="font-semibold text-ink">{pincode}</strong></span>
            </button>

            {/* Search Link */}
            <Link
              href="/search"
              className="p-2 text-cocoa hover:text-dustyRose rounded-full hover:bg-blush/20 transition-colors"
              aria-label="Search crochet products"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Account / Login Trigger */}
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-full bg-dustyRose/10 text-xs font-semibold text-cocoa hover:bg-dustyRose/20 transition-colors"
                  aria-label="View account profile"
                >
                  <User className="w-4 h-4 text-dustyRose" />
                  <span className="hidden xl:inline">{user?.fullName.split(' ')[0]}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-cocoa hover:text-dustyRose rounded-full hover:bg-blush/20 transition-colors"
                aria-label="Sign in"
                title="Login"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Shopping Bag Trigger with Animated Badge */}
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-cocoa hover:text-dustyRose rounded-full hover:bg-blush/20 transition-colors"
              aria-label={`Shopping bag with ${totalCartItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-dustyRose text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Admin Portal Entry (shown always in demo or when isAdmin) */}
            {mounted && (isAdmin || true) && (
              <Link
                href="/admin"
                className={`flex items-center gap-1 text-xs py-1 px-2.5 rounded-md font-semibold transition-colors border ${
                  isAdmin
                    ? 'bg-cocoa text-cream border-cocoa hover:bg-cocoa/90'
                    : 'bg-cocoa/5 hover:bg-cocoa/10 text-cocoa border-border/50'
                }`}
                title="Admin Control Center"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-dustyRose" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-cream px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center justify-between ${
                    pathname === link.href
                      ? 'bg-dustyRose/15 text-dustyRose font-semibold'
                      : 'text-cocoa hover:bg-blush/20'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}

              <div className="pt-3 border-t border-border/60 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLocationModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-cocoa hover:text-ink w-full"
                >
                  <MapPin className="w-4 h-4 text-dustyRose" />
                  <span>Deliver to: <strong>{pincode}</strong></span>
                </button>

                {isAuthenticated ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-ink"
                    >
                      Account ({user?.fullName})
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs text-dustyRose font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-cocoa hover:text-ink"
                  >
                    <User className="w-4 h-4 text-cocoa" />
                    <span>Sign In / Create Account</span>
                  </Link>
                )}

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-cocoa hover:text-ink"
                >
                  <ShieldAlert className="w-4 h-4 text-dustyRose" />
                  <span>Admin Control Center</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Interactive Location Drawer with MapLibre GL JS */}
      <LocationDrawer
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        currentPincode={pincode}
        onUpdatePincode={(newPincode) => setPincode(newPincode)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </>
  );
}
