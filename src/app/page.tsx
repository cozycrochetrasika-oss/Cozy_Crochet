'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Star,
  MessageCircle,
  Package,
  Clock,
  CheckCircle,
  Sparkle,
} from 'lucide-react';
import { HeroSlideshow } from '@/components/hero/hero-slideshow';
import { ProductCard } from '@/components/product/product-card';
import { getAllProducts, getFeaturedProducts } from '@/data/products';
import { useProductsStore } from '@/store/products-store';
import { getGeneralWhatsAppInquiryUrl } from '@/lib/config/business';

export default function HomePage() {
  const storeProducts = useProductsStore((s) => s.products);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const featuredProducts = (mounted && storeProducts && storeProducts.length > 0)
    ? storeProducts.filter((p) => p.active && p.featured)
    : getFeaturedProducts();
  const allProducts = (mounted && storeProducts && storeProducts.length > 0)
    ? storeProducts.filter((p) => p.active)
    : getAllProducts();

  const reviews = [
    {
      id: '1',
      name: 'Ananya Sharma',
      city: 'Bangalore',
      rating: 5.0,
      title: 'The bouquet brought tears of joy!',
      body: 'Ordered the everlasting crochet bouquet for my sister’s anniversary. The packaging, delicate stitching, and soft colors were beyond my expectations. Truly an heirloom.',
      item: 'Crochet Bouquet',
    },
    {
      id: '2',
      name: 'Rohan Mehta',
      city: 'Mumbai',
      rating: 4.9,
      title: 'Impeccable quality tote bag',
      body: 'The crochet bag is sturdy, beautifully textured, and holds everything with ease. The natural cotton finish feels so authentic and premium.',
      item: 'Crochet Bag',
    },
    {
      id: '3',
      name: 'Pooja Iyer',
      city: 'Chennai',
      rating: 4.8,
      title: 'So gentle for my baby’s feet',
      body: 'The baby booties are incredibly soft and don’t slip off tiny feet. You can feel the warmth and care in every stitch. Highly recommended!',
      item: 'Crochet Kid Shoes',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. CINEMATIC HERO SECTION ("The Living Yarn Store") */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy & Explicit CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>The Living Yarn Store</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-ink tracking-tight leading-[1.08]">
              Handmade with yarn. <br className="hidden sm:inline" />
              <span className="text-blue-500 italic">Made with love.</span>
            </h1>

            <p className="text-base sm:text-lg text-textSecondary leading-relaxed max-w-xl mx-auto lg:mx-0">
              Unique crochet pieces made one stitch at a time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base shadow-md shadow-blue-500/20 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/customize"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-blue-50/70 text-ink font-semibold text-base border border-blue-200 hover:border-blue-400 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Request Custom Crochet</span>
              </Link>
            </div>

            {/* Micro Craft Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-blue-100 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="block font-display font-bold text-2xl text-ink">100%</span>
                <span className="text-xs text-textSecondary">Organic Cotton</span>
              </div>
              <div>
                <span className="block font-display font-bold text-2xl text-ink">4.9 ★</span>
                <span className="text-xs text-textSecondary">Craft Rating</span>
              </div>
              <div>
                <span className="block font-display font-bold text-2xl text-ink">Zero</span>
                <span className="text-xs text-textSecondary">Machine Waste</span>
              </div>
            </div>
          </div>

          {/* Hero Artisan Slideshow (Local Optimized Showcase) */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <HeroSlideshow />
          </div>
        </div>
      </section>

      {/* 2. STORE METRICS (With Explicit [DEMO] Badging) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white border border-blue-100 hover:border-blue-200 shadow-xs space-y-2 relative overflow-hidden transition-all">
            <div className="flex items-center justify-between">
              <Package className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/50">
                DEMO
              </span>
            </div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ink tabular-nums">
              1,420+
            </div>
            <p className="text-xs sm:text-sm font-medium text-textSecondary">Handcrafted Items Sold</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-blue-100 hover:border-blue-200 shadow-xs space-y-2 relative overflow-hidden transition-all">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-5 h-5 text-mint" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/50">
                DEMO
              </span>
            </div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ink tabular-nums">
              980+
            </div>
            <p className="text-xs sm:text-sm font-medium text-textSecondary">Orders Delivered</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-blue-100 hover:border-blue-200 shadow-xs space-y-2 relative overflow-hidden transition-all">
            <div className="flex items-center justify-between">
              <Clock className="w-5 h-5 text-warmGold" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/50">
                DEMO
              </span>
            </div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ink tabular-nums">
              14
            </div>
            <p className="text-xs sm:text-sm font-medium text-textSecondary">Orders in Progress</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-blue-100 hover:border-blue-200 shadow-xs space-y-2 relative overflow-hidden transition-all">
            <div className="flex items-center justify-between">
              <Star className="w-5 h-5 fill-warmGold text-warmGold" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/50">
                DEMO
              </span>
            </div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ink tabular-nums">
              320+
            </div>
            <p className="text-xs sm:text-sm font-medium text-textSecondary">Customer Reviews (4.9 ★)</p>
          </div>
        </div>
      </section>

      {/* 3. FESTIVAL / PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-skyBlue text-white p-8 sm:p-12 shadow-md shadow-blue-500/15">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm tracking-wider uppercase">
              Festival Season Offering
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl leading-tight text-white">
              Gift Everlasting Blooms to Those Who Warm Your Heart
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Every festive order includes our signature hand-wrapped craft gift packaging and a personalized handwritten calligraphy note card.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=Bouquets"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-ink font-semibold text-sm hover:bg-blue-50 transition-colors shadow-xs"
              >
                <span>Browse Gift Bouquets</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED ARTISAN PIECES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
              Curated Masterpieces
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mt-1">
              Featured Creations
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-textSecondary hover:text-blue-600 transition-colors group"
          >
            <span>View All 7 Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. CRAFT STORYTELLING SECTION (Generic Craft Language) */}
      <section className="bg-surface-muted/60 py-18 sm:py-24 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-dustyRose">
              The Artisan Process
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink">
              How a Crochet Flower is Born
            </h2>
            <p className="text-sm sm:text-base text-cocoa/80 leading-relaxed">
              Every creation begins as a humble spool of milk cotton and transforms through dozens of meticulous hand-stitches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-blush flex items-center justify-center font-display font-bold text-xl text-cocoa">
                01
              </div>
              <h3 className="font-display font-bold text-xl text-ink">Pure Organic Fiber Selection</h3>
              <p className="text-sm text-cocoa/75 leading-relaxed">
                We select hypoallergenic organic milk cotton yarn dyed with gentle mineral dyes for lasting color depth and cloud-like softness.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-dustyRose/20 flex items-center justify-center font-display font-bold text-xl text-dustyRose">
                02
              </div>
              <h3 className="font-display font-bold text-xl text-ink">Loop-by-Loop Sculpting</h3>
              <p className="text-sm text-cocoa/75 leading-relaxed">
                Using fine ergonomic bamboo hooks, each petal is crocheted with varied tension to form natural curves and organic botanical contours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-sage/30 flex items-center justify-center font-display font-bold text-xl text-cocoa">
                03
              </div>
              <h3 className="font-display font-bold text-xl text-ink">Heirloom Finishing & Care</h3>
              <p className="text-sm text-cocoa/75 leading-relaxed">
                Wire stems are securely wrapped, calyxes reinforced, and edges steamed so your heirloom piece remains radiant for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ALL COLLECTIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-dustyRose">
              Complete Storefront
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mt-1">
              All Handcrafted Items
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. VERIFIED CUSTOMER REVIEWS (Explicitly tagged Demo Review) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-dustyRose">
            Patron Love
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink">
            What Our Patrons Say
          </h2>
          <p className="text-sm text-cocoa/80">Average rating of 4.9 ★ across handcrafted orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-surface border border-border/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warmGold text-warmGold" />
                    ))}
                    <span className="ml-1 text-xs font-bold text-ink">{rev.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blush/60 text-cocoa">
                    Demo Review
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-ink">&ldquo;{rev.title}&rdquo;</h4>
                <p className="text-sm text-cocoa/80 leading-relaxed">{rev.body}</p>
              </div>
              <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-cocoa/60">
                <span className="font-semibold text-cocoa">{rev.name} ({rev.city})</span>
                <span className="text-dustyRose font-medium">{rev.item}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. ARTISAN WHATSAPP & BESPOKE CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-blue-200/80 shadow-md shadow-blue-500/5 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-ink">
              Dreaming of a custom colorway or bridal bouquet?
            </h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Our master craftswomen work directly with you to match wedding palettes, nursery themes, and anniversary milestones.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <a
              href={getGeneralWhatsAppInquiryUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              href="/customize"
              className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Submit Custom Form</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
