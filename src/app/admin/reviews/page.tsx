'use client';

import React, { useState, useEffect } from 'react';
import { Star, Check, X, ShieldCheck, Trash2, RefreshCw } from 'lucide-react';

interface DisplayReview {
  id: string;
  customer: string;
  productName: string;
  rating: number;
  title: string;
  body: string;
  approved: boolean;
  date: string;
}

const DEFAULT_REVIEWS: DisplayReview[] = [
  {
    id: 'rev_1',
    customer: 'Ananya Sharma',
    productName: 'Crochet Bouquet',
    rating: 5.0,
    title: 'The bouquet brought tears of joy!',
    body: 'Ordered the everlasting crochet bouquet for my sister’s anniversary. The packaging, delicate stitching, and soft colors were beyond my expectations.',
    approved: true,
    date: 'Sep 18, 2026',
  },
  {
    id: 'rev_2',
    customer: 'Rohan Mehta',
    productName: 'Crochet Bag',
    rating: 4.9,
    title: 'Impeccable quality tote bag',
    body: 'The crochet bag is sturdy, beautifully textured, and holds everything with ease. The natural cotton finish feels so authentic and premium.',
    approved: true,
    date: 'Aug 24, 2026',
  },
  {
    id: 'rev_3',
    customer: 'Tanvi Joshi',
    productName: 'Crochet Sunflower',
    rating: 4.8,
    title: 'Bright and cheerful desk decor',
    body: 'Placed the sunflower on my study desk. Brings so much positive handmade energy every day!',
    approved: false,
    date: 'Sep 19, 2026',
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<DisplayReview[]>(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews?all=true', {
        headers: { 'Cache-Control': 'no-store' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const mapped: DisplayReview[] = data.reviews.map((r: any) => ({
            id: r.id,
            customer: r.author || 'Anonymous Patron',
            productName: r.productName || 'Crochet Item',
            rating: r.rating || 5,
            title: r.title || 'Handcrafted Review',
            body: r.body || '',
            approved: Boolean(r.approved),
            date: r.date || 'Recent',
          }));
          setReviews(mapped);
          return;
        }
      }
    } catch (err) {
      console.error('[AdminReviews] Failed to fetch reviews from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id: string, currentApproved: boolean) => {
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !currentApproved } : r))
    );

    try {
      await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action: currentApproved ? 'reject' : 'approve',
        }),
      });
    } catch (err) {
      console.error('[AdminReviews] Error toggling review approval:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    setReviews((prev) => prev.filter((r) => r.id !== id));

    try {
      await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action: 'delete',
        }),
      });
    } catch (err) {
      console.error('[AdminReviews] Error deleting review:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Customer Reviews Moderation</h1>
          <p className="text-xs text-text-secondary">
            Approve or reject customer reviews before they display on the public storefront.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchReviews}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-semibold text-pink-700 hover:bg-pink-50 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white border border-pink-100/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-pink-200 transition-colors"
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(rev.rating)
                          ? 'fill-warmGold text-warmGold'
                          : 'text-pink-100 fill-pink-100'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-ink">{rev.rating.toFixed(1)}</span>
                <span className="text-xs text-text-secondary">•</span>
                <span className="text-xs text-text-secondary font-medium">{rev.customer}</span>
                <span className="text-xs text-pink-600 font-semibold">({rev.productName})</span>
                <span className="text-[10px] text-text-secondary font-mono">{rev.date}</span>
              </div>
              <h4 className="font-display font-bold text-sm text-ink">&ldquo;{rev.title}&rdquo;</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{rev.body}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleApproval(rev.id, rev.approved)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                  rev.approved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
              >
                {rev.approved ? <Check className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{rev.approved ? 'Approved' : 'Approve Review'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(rev.id)}
                className="p-1.5 rounded-xl border border-pink-100 text-text-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Review"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
