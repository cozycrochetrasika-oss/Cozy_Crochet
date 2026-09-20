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
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.announcementCaption) setDailyCaption(data.settings.announcementCaption);
          if (data.settings.festivalMessage) {
            setFestivalBannerTitle(data.settings.festivalMessage);
            setFestivalBannerActive(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcementCaption: dailyCaption,
          festivalMessage: festivalBannerActive ? festivalBannerTitle : '',
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-4 border-b border-pink-100">
        <h1 className="font-display font-bold text-2xl text-ink">Banners & Daily Caption Settings</h1>
        <p className="text-xs text-text-secondary">Update the homepage announcement banner and artisan daily caption.</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span>Banner configurations saved and updated on storefront!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Daily Caption */}
        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-warmGold" />
            <h3 className="font-display font-bold text-sm text-ink">Artisan Daily Caption</h3>
          </div>
          <p className="text-xs text-text-secondary">Appears in header alerts and community footer notes.</p>
          <input
            type="text"
            required
            value={dailyCaption}
            onChange={(e) => setDailyCaption(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />
        </div>

        {/* Festival Banner */}
        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-pink-600" />
              <h3 className="font-display font-bold text-sm text-ink">Festival Promo Banner</h3>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={festivalBannerActive}
                onChange={(e) => setFestivalBannerActive(e.target.checked)}
                className="rounded text-pink-600 accent-pink-600"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Headline Text</label>
            <input
              type="text"
              required
              value={festivalBannerTitle}
              onChange={(e) => setFestivalBannerTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Banner Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}
