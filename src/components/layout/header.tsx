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
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { LocationDrawer } from '@/components/location/location-drawer';
import { CartDrawer } from '@/components/commerce/cart-drawer';
import type { SiteSettings } from '@/lib/server/repository';

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [pincode, setPincode] = useState('110001');
  const [scrolled, setScrolled] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  // Live Settings
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Zustand stores
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fetch live site settings & announcements
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error('Failed to load settings in header:', err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Customize', href: '/customize' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const announcement =
    settings?.announcementMessage ||
    'Every loop carries care, warmth, and handmade magic. Heirloom Handcrafted Crochet in certified milk cotton yarn.';

  return (
    <>
      {/* 1. ADMIN-CONTROLLED ANNOUNCEMENT BAR (Soft Pink / Rose Surface) */}
      {mounted && !announcementDismissed && (
        <div className="bg-gradient-to-r from-pink-50 via-white to-pink-50 text-ink text-xs py-2 px-4 text-center tracking-wide flex items-center justify-between gap-3 border-b border-pink-200/80 relative z-50">
          <div className="flex-1 flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-pink-600 flex-shrink-0 animate-pulse" />
            <span className="font-medium text-ink">{announcement}</span>
          </div>
          <button
            type="button"
            onClick={() => setAnnouncementDismissed(true)}
            className="p-1 rounded-md text-textSecondary hover:text-ink hover:bg-pink-100/60 transition-colors flex-shrink-0"
            aria-label="Dismiss announcement"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MAIN NAVIGATION HEADER (Sticky Glass & Subtle Blur) */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 transition-all duration-200 ${
          scrolled ? 'shadow-xs shadow-pink-900/5' : ''
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
            className="md:hidden p-2 rounded-xl text-textSecondary hover:bg-pink-50 hover:text-pink-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-pink-200 shadow-xs group-hover:scale-105 transition-transform flex-shrink-0 bg-white">
              <Image
                src="/brand/logo.jpg"
                alt="Cozy_Crochets Logo"
                fill
                priority
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-ink group-hover:text-pink-600 transition-colors">
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
                    isActive ? 'text-pink-600 font-semibold' : 'text-textSecondary hover:text-ink'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-full" />
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
              className="hidden lg:flex items-center gap-1.5 text-xs text-textSecondary hover:text-ink py-1.5 px-3 rounded-full border border-pink-200/80 hover:border-pink-400 bg-pink-50/40 transition-colors"
              title="Select Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-pink-500" />
              <span>
                Deliver to: <strong className="font-semibold text-ink">{pincode}</strong>
              </span>
            </button>

            {/* Search Link */}
            <Link
              href="/search"
              className="p-2 text-textSecondary hover:text-pink-600 rounded-full hover:bg-pink-50 transition-colors"
              aria-label="Search crochet products"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Account / Login Trigger */}
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-full bg-pink-50 text-xs font-semibold text-pink-700 hover:bg-pink-100 transition-colors border border-pink-200/60"
                  aria-label="View account profile"
                >
                  <User className="w-4 h-4 text-pink-600" />
                  <span className="hidden xl:inline">{user?.fullName.split(' ')[0]}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-textSecondary hover:text-pink-600 rounded-full hover:bg-pink-50 transition-colors"
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
              className="relative p-2 text-textSecondary hover:text-pink-600 rounded-full hover:bg-pink-50 transition-colors"
              aria-label={`Shopping bag with ${totalCartItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-pink-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Admin Portal Indicator ONLY when Authenticated as Admin */}
            {mounted && isAdmin && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-xl font-semibold transition-colors bg-pink-600 hover:bg-pink-700 text-white shadow-xs border border-pink-700"
                title="Store Owner Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-pink-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg shadow-pink-900/5">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-base font-medium transition-colors flex items-center justify-between ${
                    pathname === link.href
                      ? 'bg-pink-50 text-pink-700 font-semibold'
                      : 'text-textSecondary hover:bg-pink-50/60'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}

              <div className="pt-3 border-t border-pink-100 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLocationModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-textSecondary hover:text-ink w-full"
                >
                  <MapPin className="w-4 h-4 text-pink-500" />
                  <span>
                    Deliver to: <strong className="font-semibold text-ink">{pincode}</strong>
                  </span>
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
                      className="text-xs text-pink-600 font-semibold hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-textSecondary hover:text-ink"
                  >
                    <User className="w-4 h-4 text-pink-400" />
                    <span>Sign In / Create Account</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-pink-700 bg-pink-50 rounded-xl"
                  >
                    <ShieldCheck className="w-4 h-4 text-pink-600" />
                    <span>Owner Admin Portal</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Interactive Location Drawer */}
      <LocationDrawer
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        currentPincode={pincode}
        onUpdatePincode={(newPincode) => setPincode(newPincode)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
}
