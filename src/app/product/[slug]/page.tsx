'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Send,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { getProductBySlug, getAllProducts, formatINR } from '@/data/products';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductCard } from '@/components/product/product-card';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { getProductWhatsAppInquiryUrl } from '@/lib/config/business';

interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  isDemo?: boolean;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Seeded Customer Reviews for this Product
  const [reviewsList, setReviewsList] = useState<ProductReview[]>([
    {
      id: 'rev_1',
      author: 'Ananya Sharma',
      city: 'Bangalore',
      rating: 5,
      date: 'Sep 12, 2026',
      title: 'Beyond expectations in softness and detail',
      comment:
        'The milk cotton texture feels incredible. The stitches are perfectly uniform and tight with zero loose threads. You can instantly feel the artisan love poured into every petal.',
      verified: true,
      isDemo: true,
    },
    {
      id: 'rev_2',
      author: 'Rohan Mehta',
      city: 'Mumbai',
      rating: 4.8,
      date: 'Aug 29, 2026',
      title: 'Heirloom craft quality gift packaging',
      comment:
        'Arrived in signature craft box with a handwritten note card. Ordered this as an anniversary gift and it was the highlight of the celebration.',
      verified: true,
      isDemo: true,
    },
    {
      id: 'rev_3',
      author: 'Priya Iyer',
      city: 'Chennai',
      rating: 5,
      date: 'Aug 14, 2026',
      title: 'Stunning centerpiece that will never wilt',
      comment:
        'Colors match the photography perfectly. The wire stems hold their shape while feeling delicate and natural. Highly recommended!',
      verified: true,
      isDemo: true,
    },
  ]);

  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated, setPendingIntent } = useAuthStore();

  // Smart Back / Exit Navigation
  const handleBackOrClose = useCallback(() => {
    // If opened from an internal page, navigate back to restore scroll position
    if (
      typeof window !== 'undefined' &&
      window.history.length > 1 &&
      document.referrer &&
      document.referrer.includes(window.location.host)
    ) {
      router.back();
    } else {
      router.push('/shop');
    }
  }, [router]);

  // Body Scroll Lock & Lenis Suspension while Full-Screen Overlay is Open
  useEffect(() => {
    // 1. Lock document & body scrolling
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // 2. Pause Lenis smooth scroll engine if running on background window
    const win = window as any;
    if (win.__lenis) {
      try {
        win.__lenis.stop();
      } catch (e) {
        console.warn('Lenis stop warning:', e);
      }
    }

    // 3. Register ESC key listener for dismissal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBackOrClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 4. Focus scroll container for immediate mouse-wheel & keyboard readiness
    if (scrollContainerRef.current) {
      scrollContainerRef.current.focus({ preventScroll: true });
    }

    // Cleanup: restore body scroll, restart Lenis, and remove listener
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;

      if (win.__lenis) {
        try {
          win.__lenis.start();
        } catch (e) {
          console.warn('Lenis start warning:', e);
        }
      }

      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleBackOrClose]);

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
      router.push(
        `/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}&intent=add-to-cart`
      );
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newReview: ProductReview = {
      id: `rev_${Date.now()}`,
      author: reviewAuthor.trim(),
      city: 'India',
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle.trim() || 'Handcrafted treasure',
      comment: reviewComment.trim(),
      verified: true,
      isDemo: true,
    };

    setReviewsList((prev) => [newReview, ...prev]);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const whatsappInquiryUrl = getProductWhatsAppInquiryUrl(product.name, product.pricePaise);

  return (
    /* 1. FULL-SCREEN PRODUCT DETAIL OVERLAY
       - Fixed to viewport: fixed inset-0 w-full h-[100dvh]
       - High overlay z-index: z-50
       - Background: #FFFFFF / bg-white
       - ARIA dialog semantics
    */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-title"
      className="fixed inset-0 z-50 w-full max-w-full min-w-0 h-[100dvh] bg-white flex flex-col overflow-hidden select-text"
    >
      {/* 2. STICKY TOP PRODUCT TOOLBAR */}
      <header className="sticky top-0 z-30 flex-shrink-0 w-full bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LEFT: Back Button + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackOrClose}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink/80 hover:text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition-colors"
            aria-label="Back to catalogue"
            title="Back to previous page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <nav className="hidden md:flex items-center gap-2 text-xs font-medium text-text-secondary pl-3 border-l border-blue-100">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-blue-600 transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">{product.category}</span>
          </nav>
        </div>

        {/* RIGHT: Minimize & Close Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleBackOrClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/80 hover:text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition-colors"
            aria-label="Minimize full-screen product view"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Minimize</span>
          </button>

          <button
            type="button"
            onClick={handleBackOrClose}
            className="p-2 rounded-xl text-ink/70 hover:text-ink hover:bg-blue-50 transition-colors"
            aria-label="Close product view (Escape)"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 3. PRIMARY SINGLE VERTICAL SCROLL CONTAINER
          - Holds entire product content
          - Native mouse wheel & trackpad scroll works everywhere
          - data-lenis-prevent prevents Lenis interference
          - overscroll-contain & touch-pan-y
      */}
      <div
        ref={scrollContainerRef}
        data-lenis-prevent
        tabIndex={-1}
        className="flex-1 w-full max-w-full min-w-0 h-full overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y outline-none"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: '#7BC9EE transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-16">
          {/* SECTION A: PRODUCT HERO (Gallery + Info) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column (~58%): 5-Slot Media Gallery & Showcase Video */}
            <div className="lg:col-span-7 w-full">
              <ProductGallery media={product.media} productName={product.name} />
            </div>

            {/* Right Column (~42%): Product Information */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {product.category} • Handcrafted Masterpiece
                </span>
                <h1
                  id="product-title"
                  className="font-display font-extrabold text-3xl sm:text-4xl text-ink leading-tight"
                >
                  {product.name}
                </h1>

                {/* Ratings & Social Proof */}
                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warmGold text-warmGold" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-ink">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-text-secondary">
                    ({product.reviewCount} customer reviews)
                  </span>
                  <span className="text-xs text-border">•</span>
                  <span className="text-xs font-medium text-blue-600">
                    {product.soldCount} crafted & delivered
                  </span>
                </div>
              </div>

              {/* Price & Stock Badge */}
              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 flex items-baseline justify-between shadow-xs">
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-text-secondary tracking-wider">
                    Price (Inclusive of all taxes)
                  </span>
                  <span className="font-mono font-extrabold text-3xl text-ink">
                    {formatINR(product.pricePaise)}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      maxInventory > 0 ? 'bg-mint/30 text-ink' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {maxInventory > 0 ? `In Stock (${maxInventory} ready)` : 'Made to Order'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
                <p className="font-medium text-ink">{product.shortDescription}</p>
                <p>{product.description}</p>
              </div>

              {/* Quantity Stepper & Add to Bag */}
              <div className="space-y-4 pt-4 border-t border-blue-100">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Clamped Quantity Selector */}
                  <div className="flex items-center justify-between sm:justify-start rounded-xl border border-blue-100 bg-white overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-3.5 py-2.5 text-ink hover:bg-blue-50 transition-colors font-bold disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2.5 text-sm font-mono font-bold text-ink tabular-nums text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(maxInventory, q + 1))}
                      disabled={quantity >= maxInventory}
                      className="px-3.5 py-2.5 text-ink hover:bg-blue-50 transition-colors font-bold disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={maxInventory <= 0}
                    className={`flex-grow py-3 px-5 sm:px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                      maxInventory <= 0
                        ? 'bg-blue-100 text-text-secondary/40 cursor-not-allowed'
                        : added
                        ? 'bg-mint/40 text-ink scale-95'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow'
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

                {/* Direct WhatsApp Customization Inquiry */}
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-blue-200 hover:border-blue-300 bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span>Ask Artisan via WhatsApp / Inquire Custom Color</span>
                </a>
              </div>

              {/* Artisan Guarantees */}
              <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-text-secondary">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-blue-100">
                  <ShieldCheck className="w-4 h-4 text-warmGold" />
                  <span>100% Hand Crocheted</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-blue-100">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Ships in 3-5 Days</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-blue-100">
                  <Sparkles className="w-4 h-4 text-lavender" />
                  <span>Free Gift Packaging</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-blue-100">
                  <RotateCcw className="w-4 h-4 text-mint" />
                  <span>Safe Delivery Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: ARTISAN SPECIFICATIONS & YARN CARE */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-xl text-ink">
              Artisan Specifications & Yarn Care
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <span className="font-semibold text-ink">Fiber Material:</span>
                <p className="text-text-secondary leading-relaxed">
                  100% Certified Organic Milk Cotton Yarn. Soft to the touch, hypoallergenic, and
                  naturally colorfast.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-ink">Washing & Care:</span>
                <p className="text-text-secondary leading-relaxed">
                  Gently spot clean with a damp cloth or hand-wash in cold water with mild detergent.
                  Lay flat to dry away from direct heat.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-ink">Artisan Provenance:</span>
                <p className="text-text-secondary leading-relaxed">
                  Handcrafted loop-by-loop in small batches by master women craftswomen across our
                  Indian workshops.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION C: CUSTOMER REVIEWS (Seamlessly scrollable) */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Verified Patron Feedback
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink mt-0.5">
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-2 pt-1 text-sm text-text-secondary">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warmGold text-warmGold" />
                    ))}
                  </div>
                  <strong className="font-bold text-ink">{product.rating.toFixed(1)} out of 5</strong>
                  <span className="text-text-secondary/70">({reviewsList.length} reviews)</span>
                </div>
              </div>

              <a
                href="#write-review"
                className="px-5 py-2.5 rounded-xl border border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-xs font-semibold text-ink inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Write a Review</span>
              </a>
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-blue-50/30 border border-blue-100 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(rev.rating)
                                ? 'fill-warmGold text-warmGold'
                                : 'text-blue-100 fill-blue-100'
                            }`}
                          />
                        ))}
                      </div>
                      {rev.isDemo && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100/70 text-blue-700">
                          Demo Review
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm text-ink">&ldquo;{rev.title}&rdquo;</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{rev.comment}</p>
                  </div>

                  <div className="pt-3 border-t border-blue-100/70 flex items-center justify-between text-xs text-text-secondary">
                    <span className="font-semibold text-ink">
                      {rev.author} ({rev.city})
                    </span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Submission Form */}
            <div id="write-review" className="pt-6 border-t border-blue-100">
              <h4 className="font-display font-bold text-lg text-ink mb-4">
                Share Your Handmade Experience
              </h4>

              {reviewSubmitted ? (
                <div className="p-4 rounded-2xl bg-mint/30 border border-mint text-ink text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-mint" />
                  <span>Thank you for your feedback! Your review has been submitted for display.</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kavita Shah"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">Rating *</label>
                      <div className="flex items-center gap-1 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-warmGold"
                            aria-label={`Rate ${star} star`}
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating ? 'fill-warmGold text-warmGold' : 'text-blue-100'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Review Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Beautiful craft and exquisite texture"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Your Review *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share what you loved about the yarn, stitches, or gift packaging..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* SECTION D: RELATED PRODUCTS */}
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
    </div>
  );
}
