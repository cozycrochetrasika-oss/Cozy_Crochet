import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Instagram, Mail, Phone, ShieldCheck } from 'lucide-react';
import {
  BUSINESS_CONFIG,
  getGeneralWhatsAppInquiryUrl,
  getAlternateWhatsAppUrl,
  getMailtoUrl,
  getTelUrl,
} from '@/lib/config/business';

export function Footer() {
  return (
    <footer className="bg-white text-ink pt-16 pb-12 border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-pink-100">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-pink-200 shadow-xs flex-shrink-0 bg-white">
                <Image
                  src="/brand/logo.jpg"
                  alt="Cozy Stitches by Rasika Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-ink">
                Cozy_Crochets
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              &ldquo;The Living Yarn Store&rdquo; by {BUSINESS_CONFIG.founder} — Handcrafted crochet creations made with certified milk cotton yarn. Every single piece is stitched loop-by-loop with patience, love, and heirloom warmth.
            </p>
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-600 hover:text-white flex items-center justify-center text-pink-600 transition-colors border border-pink-100"
                aria-label={`Follow ${BUSINESS_CONFIG.name} on Instagram (${BUSINESS_CONFIG.instagramHandle})`}
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={getGeneralWhatsAppInquiryUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-600 hover:text-white flex items-center justify-center text-pink-600 transition-colors border border-pink-100"
                aria-label={`Primary WhatsApp Support: ${BUSINESS_CONFIG.primaryPhone}`}
                title={`Primary WhatsApp (${BUSINESS_CONFIG.primaryPhone})`}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={getAlternateWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-600 hover:text-white flex items-center justify-center text-pink-600 transition-colors border border-pink-100"
                aria-label={`Alternate WhatsApp Support: ${BUSINESS_CONFIG.alternatePhone}`}
                title={`Alternate WhatsApp (${BUSINESS_CONFIG.alternatePhone})`}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={getTelUrl(BUSINESS_CONFIG.primaryPhoneNormalized)}
                className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-600 hover:text-white flex items-center justify-center text-pink-600 transition-colors border border-pink-100"
                aria-label={`Call direct: ${BUSINESS_CONFIG.primaryPhone}`}
                title={`Call ${BUSINESS_CONFIG.primaryPhone}`}
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={getMailtoUrl()}
                className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-600 hover:text-white flex items-center justify-center text-pink-600 transition-colors border border-pink-100"
                aria-label={`Email ${BUSINESS_CONFIG.email}`}
                title={`Email: ${BUSINESS_CONFIG.email}`}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-display font-semibold text-base text-ink mb-4">Artisan Collections</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li><Link href="/shop?category=Flowers" className="hover:text-pink-600 transition-colors">Crochet Flowers</Link></li>
              <li><Link href="/shop?category=Bouquets" className="hover:text-pink-600 transition-colors">Everlasting Bouquets</Link></li>
              <li><Link href="/shop?category=Bags" className="hover:text-pink-600 transition-colors">Woven Bags</Link></li>
              <li><Link href="/shop?category=Accessories" className="hover:text-pink-600 transition-colors">Headbands & Accents</Link></li>
              <li><Link href="/shop?category=Keyrings" className="hover:text-pink-600 transition-colors">Miniature Charms</Link></li>
              <li><Link href="/shop?category=Footwear" className="hover:text-pink-600 transition-colors">Kid Booties</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-display font-semibold text-base text-ink mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li><Link href="/customize" className="hover:text-pink-600 transition-colors">Bespoke Custom Orders</Link></li>
              <li><Link href="/orders" className="hover:text-pink-600 transition-colors">Track Order Status</Link></li>
              <li><Link href="/shipping" className="hover:text-pink-600 transition-colors">Shipping & Timelines</Link></li>
              <li><Link href="/returns" className="hover:text-pink-600 transition-colors">Handmade Return Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-pink-600 transition-colors">Privacy & Security</Link></li>
              <li><Link href="/contact" className="hover:text-pink-600 transition-colors">Contact Artisan</Link></li>
            </ul>
          </div>

          {/* Craft Promise & Direct Contact */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-base text-ink mb-4">The Craft Promise</h4>
            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-pink-700 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-warmGold" />
                <span>100% Hand Crocheted</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Zero automated machines. Each petal and strap is shaped by hand using pure organic milk cotton.
              </p>
            </div>
            <div className="text-xs text-text-secondary pt-1 space-y-1">
              <div>WhatsApp: <strong className="text-ink">{BUSINESS_CONFIG.primaryPhone}</strong></div>
              <div>Email: <strong className="text-ink">{BUSINESS_CONFIG.email}</strong></div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} {BUSINESS_CONFIG.name} by {BUSINESS_CONFIG.founder}. All handmade rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Stitched with care</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-current inline" />
            <span>for cozy homes everywhere</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
