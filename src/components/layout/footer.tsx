import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Instagram, Mail, Sparkles, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-cocoa text-cream pt-16 pb-12 border-t border-cocoa/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cream/15">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-dustyRose flex items-center justify-center text-white font-display text-lg font-bold">
                C
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-cream">
                Cozy_Crochets
              </span>
            </div>
            <p className="text-sm text-cream/75 leading-relaxed max-w-sm">
              &ldquo;The Living Yarn Store&rdquo; — Handcrafted crochet creations made with certified milk cotton yarn. Every single piece is stitched loop-by-loop with patience, love, and heirloom warmth.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/cozycrochets"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-cream/10 hover:bg-dustyRose flex items-center justify-center text-cream transition-colors"
                aria-label="Follow Cozy_Crochets on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-cream/10 hover:bg-sage flex items-center justify-center text-cream transition-colors"
                aria-label="Chat with us on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@cozycrochets.com"
                className="w-9 h-9 rounded-full bg-cream/10 hover:bg-warmGold flex items-center justify-center text-cream transition-colors"
                aria-label="Send email to Cozy_Crochets"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-display font-semibold text-base text-cream mb-4">Artisan Collections</h4>
            <ul className="space-y-2.5 text-sm text-cream/75">
              <li><Link href="/shop?category=Flowers" className="hover:text-blush transition-colors">Crochet Flowers</Link></li>
              <li><Link href="/shop?category=Bouquets" className="hover:text-blush transition-colors">Everlasting Bouquets</Link></li>
              <li><Link href="/shop?category=Bags" className="hover:text-blush transition-colors">Woven Bags</Link></li>
              <li><Link href="/shop?category=Accessories" className="hover:text-blush transition-colors">Headbands & Accents</Link></li>
              <li><Link href="/shop?category=Keyrings" className="hover:text-blush transition-colors">Miniature Charms</Link></li>
              <li><Link href="/shop?category=Footwear" className="hover:text-blush transition-colors">Kid Booties</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-display font-semibold text-base text-cream mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-cream/75">
              <li><Link href="/customize" className="hover:text-blush transition-colors">Bespoke Custom Orders</Link></li>
              <li><Link href="/orders" className="hover:text-blush transition-colors">Track Order Status</Link></li>
              <li><Link href="/shipping" className="hover:text-blush transition-colors">Shipping & Timelines</Link></li>
              <li><Link href="/returns" className="hover:text-blush transition-colors">Handmade Return Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-blush transition-colors">Privacy & Security</Link></li>
              <li><Link href="/contact" className="hover:text-blush transition-colors">Contact Artisan</Link></li>
            </ul>
          </div>

          {/* Craft Promise */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-base text-cream mb-4">The Craft Promise</h4>
            <div className="p-4 rounded-xl bg-cream/5 border border-cream/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-warmGold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-warmGold" />
                <span>100% Hand Crocheted</span>
              </div>
              <p className="text-xs text-cream/70 leading-relaxed">
                Zero automated machines. Each petal and strap is shaped by hand using pure organic milk cotton.
              </p>
            </div>
            <div className="text-xs text-cream/60 pt-1">
              Payments protected via <strong>Stripe</strong> & Instant <strong>UPI QR</strong>.
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <p>© {new Date().getFullYear()} Cozy_Crochets. All handmade rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Stitched with care</span>
            <Heart className="w-3.5 h-3.5 text-dustyRose fill-current inline" />
            <span>for cozy homes everywhere</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
