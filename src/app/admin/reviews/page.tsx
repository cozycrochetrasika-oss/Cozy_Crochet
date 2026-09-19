'use client';

import React, { useState } from 'react';
import { Star, Check, X, ShieldCheck } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([
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
  ]);

  const toggleApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display font-bold text-2xl text-ink">Customer Reviews Moderation</h1>
        <p className="text-xs text-cocoa/75">Approve or reject customer reviews before they display on the public storefront.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-cream/40 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warmGold text-warmGold" />
                  ))}
                </div>
                <span className="text-xs font-bold text-ink">{rev.rating.toFixed(1)}</span>
                <span className="text-xs text-cocoa/50">•</span>
                <span className="text-xs text-cocoa font-medium">{rev.customer}</span>
                <span className="text-xs text-dustyRose font-semibold">({rev.productName})</span>
              </div>
              <h4 className="font-display font-bold text-sm text-ink">&ldquo;{rev.title}&rdquo;</h4>
              <p className="text-xs text-cocoa/80 leading-relaxed">{rev.body}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleApproval(rev.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  rev.approved
                    ? 'bg-sage/20 text-cocoa hover:bg-sage/30'
                    : 'bg-dustyRose text-white hover:bg-dustyRose/90'
                }`}
              >
                {rev.approved ? <Check className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{rev.approved ? 'Approved' : 'Approve Review'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
