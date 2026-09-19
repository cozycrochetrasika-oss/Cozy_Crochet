'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [scrolled, setScrolled] = useState(false);

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      {/* 1. ADMIN-CONTROLLED ANNOUNCEMENT BAR (Soft Blue Surface) */}
      {mounted && !announcementDismissed && (
        <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 text-ink text-xs py-2 px-4 text-center tracking-wide flex items-center justify-between gap-3 border-b border-blue-100/80 relative z-50">
          <div className="flex-1 flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 animate-pulse" />
            <span className="font-medium text-ink">{dailyCaption}</span>
            {festivalBannerActive && festivalMessage && (
              <>
                <span className="hidden sm:inline text-blue-200">•</span>
                <span className="text-blue-600 font-semibold">{festivalMessage}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={dismissAnnouncement}
            className="p-1 rounded-md text-textSecondary hover:text-ink hover:bg-blue-100/50 transition-colors flex-shrink-0"
            aria-label="Dismiss announcement"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MAIN NAVIGATION HEADER (Sticky Glass & Subtle Blur) */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100/70 transition-all duration-200 ${
          scrolled ? 'shadow-xs' : ''
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-200 ${
            scrolled ? 'h-16' : 'h-18'
          }`}
        >
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-textSecondary hover:bg-blue-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-blue-200 shadow-xs group-hover:scale-105 transition-transform flex-shrink-0 bg-white">
              <Image
                src="/brand/logo.jpg"
                alt="Cozy Stitches by Rasika Logo"
                fill
                priority
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-ink group-hover:text-blue-600 transition-colors">
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
                  className={`relative py-1.5 transition-colors ${
                    isActive ? 'text-blue-600 font-semibold' : 'text-textSecondary hover:text-ink'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
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
              className="hidden lg:flex items-center gap-1.5 text-xs text-textSecondary hover:text-ink py-1.5 px-3 rounded-full border border-blue-100 hover:border-blue-300 bg-blue-50/40 transition-colors"
              title="Select Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Deliver to: <strong className="font-semibold text-ink">{pincode}</strong></span>
            </button>

            {/* Search Link */}
            <Link
              href="/search"
              className="p-2 text-textSecondary hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
              aria-label="Search crochet products"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Account / Login Trigger */}
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-full bg-blue-50 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100"
                  aria-label="View account profile"
                >
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="hidden xl:inline">{user?.fullName.split(' ')[0]}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-textSecondary hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
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
              className="relative p-2 text-textSecondary hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
              aria-label={`Shopping bag with ${totalCartItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Admin Portal Entry (shown always in demo or when isAdmin) */}
            {mounted && (isAdmin || true) && (
              <Link
                href="/admin"
                className={`flex items-center gap-1 text-xs py-1.5 px-3 rounded-lg font-semibold transition-colors border ${
                  isAdmin
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-xs'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                }`}
                title="Admin Control Center"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-100 bg-white px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-base font-medium transition-colors flex items-center justify-between ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-textSecondary hover:bg-blue-50/60'
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
