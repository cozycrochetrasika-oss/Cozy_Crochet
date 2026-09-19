'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Save, Sparkles } from 'lucide-react';

export default function AdminBannersPage() {
  const [dailyCaption, setDailyCaption] = useState(
    'Every loop carries care, warmth, and handmade magic.'
  );
  const [festivalBannerTitle, setFestivalBannerTitle] = useState(
    'Gift Everlasting Blooms to Those Who Warm Your Heart'
  );
  const [festivalBannerActive, setFestivalBannerActive] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Banners and daily caption updated!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display font-bold text-2xl text-ink">Banners & Daily Caption Settings</h1>
        <p className="text-xs text-cocoa/75">Update the homepage announcement banner and artisan daily caption.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Daily Caption */}
        <div className="p-5 rounded-2xl bg-cream/40 border border-border/70 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-warmGold" />
            <h3 className="font-display font-bold text-sm text-ink">Artisan Daily Caption</h3>
          </div>
          <p className="text-xs text-cocoa/70">Appears in header alerts and community footer notes.</p>
          <input
            type="text"
            required
            value={dailyCaption}
            onChange={(e) => setDailyCaption(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm outline-none focus:border-dustyRose"
          />
        </div>

        {/* Festival Banner */}
        <div className="p-5 rounded-2xl bg-cream/40 border border-border/70 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-dustyRose" />
              <h3 className="font-display font-bold text-sm text-ink">Festival Promo Banner</h3>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-cocoa cursor-pointer">
              <input
                type="checkbox"
                checked={festivalBannerActive}
                onChange={(e) => setFestivalBannerActive(e.target.checked)}
                className="rounded text-dustyRose"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1">Headline Text</label>
            <input
              type="text"
              required
              value={festivalBannerTitle}
              onChange={(e) => setFestivalBannerTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm outline-none focus:border-dustyRose"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Banner Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}
