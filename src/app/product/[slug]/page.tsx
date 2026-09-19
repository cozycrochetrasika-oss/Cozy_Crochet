'use client';

import React, { useState, useEffect, useRef } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  ShoppingBag,
  Heart,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Check,
  X,
  ArrowLeft,
  Minimize2,
} from 'lucide-react';
import { getProductBySlug, getAllProducts, formatINR } from '@/data/products';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductCard } from '@/components/product/product-card';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated, setPendingIntent } = useAuthStore();

  const handleDismiss = React.useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/shop');
    }
  }, [router]);

  // Handle ESC key for desktop modal dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDismiss]);

  if (!product) {
    return notFound();
  }

  const allProducts = getAllProducts();
  const relatedProducts = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);
  const maxInventory = product.inventoryQty;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setPendingIntent({
        product,
        quantity,
        returnUrl: `/product/${product.slug}`,
      });
      router.push(`/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}&intent=add-to-cart`);
      return;
    }

    const result = addItem(product, quantity);
    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } else {
      alert(result.message);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello Cozy_Crochets! 🧶 I am interested in ordering the "${product.name}" (Price: ${formatINR(
      product.pricePaise
    )}). Could you tell me more about customization and delivery timelines?`
  )}`;

  return (
    /* Responsive Viewport Wrapper:
       - On lg+: modal container ~80vw max-width, ~88vh max-height with backdrop and focus trap
       - On mobile/tablet: standard full-screen responsive layout
    */
    <div className="lg:fixed lg:inset-0 lg:z-50 lg:flex lg:items-center lg:justify-center lg:bg-cocoa/40 lg:backdrop-blur-sm lg:p-6 overflow-y-auto">
      {/* Click outside to close (desktop only) */}
      <div
        className="hidden lg:block fixed inset-0"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 lg:max-w-[80vw] lg:max-h-[88vh] lg:overflow-y-auto lg:rounded-3xl lg:bg-surface lg:shadow-2xl lg:border lg:border-border lg:p-10 z-10"
      >
        {/* Modal Header Controls (Desktop Back & Close) */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          {/* Breadcrumb Navigation / Back Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa hover:text-dustyRose p-1.5 rounded-lg hover:bg-blush/20 transition-colors"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <nav className="hidden sm:flex text-xs font-medium text-cocoa/70 items-center gap-2 pl-2 border-l border-border/60">
              <Link href="/" className="hover:text-dustyRose">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-dustyRose">Shop</Link>
              <span>/</span>
              <span className="text-cocoa/50">{product.category}</span>
            </nav>
          </div>

          {/* Minimize / Close Button */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDismiss}
              className="p-2 rounded-full text-cocoa hover:text-ink hover:bg-cream/80 transition-colors"
              aria-label="Close product modal (Escape)"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: 5-Slot Media Gallery & Showcase Video */}
          <div className="lg:col-span-7">
            <ProductGallery media={product.media} productName={product.name} />
          </div>

          {/* Right Column: Details & Purchase Options */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-dustyRose">
                {product.category} • Handcrafted Masterpiece
              </span>
              <h1 id="product-title" className="font-display font-extrabold text-3xl sm:text-4xl text-ink">
                {product.name}
              </h1>

              {/* Ratings & Social Proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warmGold text-warmGold" />
                  ))}
                </div>
                <span className="text-xs font-bold text-ink">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-cocoa/60">({product.reviewCount} customer reviews)</span>
                <span className="text-xs text-cocoa/40">•</span>
                <span className="text-xs font-medium text-sage">{product.soldCount} crafted & delivered</span>
              </div>
            </div>

            {/* Price Tag Highlight */}
            <div className="p-4 rounded-2xl bg-cream/40 border border-border/80 flex items-baseline justify-between">
              <div>
                <span className="block text-[10px] uppercase font-semibold text-cocoa/60 tracking-wider">
                  Price (Inclusive of all taxes)
                </span>
                <span className="font-mono font-extrabold text-3xl text-ink">
                  {formatINR(product.pricePaise)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                    maxInventory > 0 ? 'bg-sage/20 text-cocoa' : 'bg-blush/60 text-cocoa'
                  }`}
                >
                  {maxInventory > 0 ? `In Stock (${maxInventory} ready)` : 'Made to Order'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 text-sm text-cocoa/85 leading-relaxed">
              <p className="font-medium text-ink">{product.shortDescription}</p>
              <p>{product.description}</p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4 border-t border-border/60">
              <div className="flex items-center gap-4">
                {/* Clamped Quantity Selector */}
                <div className="flex items-center rounded-xl border border-border bg-surface overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-cocoa hover:bg-cream transition-colors font-bold disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-mono font-bold text-ink tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxInventory, q + 1))}
                    disabled={quantity >= maxInventory}
                    className="px-3 py-2 text-cocoa hover:bg-cream transition-colors font-bold disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={maxInventory <= 0}
                  className={`flex-grow py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                    maxInventory <= 0
                      ? 'bg-cocoa/10 text-cocoa/40 cursor-not-allowed'
                      : added
                      ? 'bg-sage text-cocoa scale-95'
                      : 'bg-dustyRose hover:bg-dustyRose/90 text-white hover:shadow'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag ({formatINR(product.pricePaise * quantity)})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct WhatsApp Ordering */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl border border-sage/60 hover:border-sage bg-sage/10 text-cocoa font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-cocoa" />
                <span>Ask Artisan via WhatsApp / Inquire Custom Color</span>
              </a>
            </div>

            {/* Artisan Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-cocoa/80">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cream/60 border border-border/50">
                <ShieldCheck className="w-4 h-4 text-warmGold" />
                <span>100% Hand Crocheted</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cream/60 border border-border/50">
                <Truck className="w-4 h-4 text-dustyRose" />
                <span>Ships in 3-5 Days</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cream/60 border border-border/50">
                <Sparkles className="w-4 h-4 text-lavender" />
                <span>Free Gift Packaging</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cream/60 border border-border/50">
                <RotateCcw className="w-4 h-4 text-sage" />
                <span>Safe Delivery Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Yarn Care Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-cream/30 border border-border space-y-4">
          <h3 className="font-display font-bold text-xl text-ink">Artisan Specifications & Yarn Care</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <span className="font-semibold text-cocoa">Fiber Material:</span>
              <p className="text-cocoa/80">100% Certified Organic Milk Cotton Yarn (Hypoallergenic & Colorfast).</p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-cocoa">Washing & Care:</span>
              <p className="text-cocoa/80">Gently spot clean with damp cloth or hand-wash in cold water. Lay flat to dry.</p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-cocoa">Origin & Artisan:</span>
              <p className="text-cocoa/80">Handcrafted in small batches by women artisans in India.</p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="space-y-6 pt-4 border-t border-border/60">
          <h2 className="font-display font-bold text-2xl text-ink">You May Also Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
