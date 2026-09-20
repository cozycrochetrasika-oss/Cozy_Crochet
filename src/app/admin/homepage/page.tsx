'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import type { SiteSettings } from '@/lib/server/repository';

export default function AdminHomepageManagementPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [dailyCaption, setDailyCaption] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState('');
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState('');
  const [festivalBannerActive, setFestivalBannerActive] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        setAnnouncementMessage(data.settings.announcementMessage || '');
        setDailyCaption(data.settings.dailyCaption || '');
        setHeroBadge(data.settings.heroBadge || 'The Living Yarn Store');
        setHeroHeadline(data.settings.heroHeadline || 'Handmade with yarn. Made with love.');
        setHeroSubheadline(data.settings.heroSubheadline || 'Unique crochet pieces made one stitch at a time.');
        setPrimaryCtaLabel(data.settings.primaryCtaLabel || 'Explore Collection');
        setSecondaryCtaLabel(data.settings.secondaryCtaLabel || 'Request Custom Crochet');
        setFestivalBannerActive(Boolean(data.settings.festivalBannerActive));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setErrorMsg('Failed to load current settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcementMessage: announcementMessage.trim(),
          dailyCaption: dailyCaption.trim(),
          heroBadge: heroBadge.trim(),
          heroHeadline: heroHeadline.trim(),
          heroSubheadline: heroSubheadline.trim(),
          primaryCtaLabel: primaryCtaLabel.trim(),
          secondaryCtaLabel: secondaryCtaLabel.trim(),
          festivalBannerActive,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save settings.');
      }

      setSettings(data.settings);
      setSuccessMsg('Homepage content and announcements saved successfully! Customer storefront updated.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setErrorMsg(err.message || 'Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-pink-500 mx-auto" />
        <p className="text-xs text-textSecondary">Loading homepage configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Homepage Content Management
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-0.5">
            Instantly customize top announcements, hero headlines, badges, and call-to-action buttons.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200/70 text-red-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. TOP ANNOUNCEMENT BAR */}
        <div className="p-6 rounded-2xl bg-pink-50/40 border border-pink-200/80 space-y-4">
          <div className="flex items-center gap-2 text-pink-800 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Storefront Top Announcement Bar</span>
          </div>
          <p className="text-xs text-textSecondary">
            This caption appears at the very top of every customer page. Keep it concise, warm, and inviting.
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="announcement" className="text-xs font-semibold text-ink">
                Announcement Headline / Offer Notice
              </label>
              <span className="text-[11px] text-textSecondary">
                {announcementMessage.length} / 160 characters
              </span>
            </div>
            <input
              id="announcement"
              type="text"
              maxLength={160}
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              placeholder="e.g. Free pan-India delivery on orders above ₹999 • Festive bouquets in bloom"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white text-ink transition-colors"
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <label htmlFor="daily-caption" className="text-xs font-semibold text-ink">
                Daily Craft Caption (Footer & Story)
              </label>
              <span className="text-[11px] text-textSecondary">
                {dailyCaption.length} / 120 characters
              </span>
            </div>
            <input
              id="daily-caption"
              type="text"
              maxLength={120}
              value={dailyCaption}
              onChange={(e) => setDailyCaption(e.target.value)}
              placeholder="Every loop carries care, warmth, and handmade magic."
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white text-ink transition-colors"
            />
          </div>
        </div>

        {/* 2. CINEMATIC HERO TEXT */}
        <div className="p-6 rounded-2xl bg-white border border-pink-200 space-y-5">
          <h3 className="font-display font-bold text-base text-ink">
            Cinematic Hero Editorial Copy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="hero-badge" className="text-xs font-semibold text-ink">
                Hero Overline Badge
              </label>
              <input
                id="hero-badge"
                type="text"
                maxLength={40}
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="The Living Yarn Store"
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white text-ink transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="hero-headline" className="text-xs font-semibold text-ink">
                Main Headline
              </label>
              <input
                id="hero-headline"
                type="text"
                maxLength={80}
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                placeholder="Handmade with yarn. Made with love."
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white text-ink transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="hero-subheadline" className="text-xs font-semibold text-ink">
                Hero Subheadline / Brand Mission
              </label>
              <span className="text-[11px] text-textSecondary">
                {heroSubheadline.length} / 180 characters
              </span>
            </div>
            <textarea
              id="hero-subheadline"
              rows={2}
              maxLength={180}
              value={heroSubheadline}
              onChange={(e) => setHeroSubheadline(e.target.value)}
              placeholder="Unique crochet pieces made one stitch at a time."
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white text-ink transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="primary-cta" className="text-xs font-semibold text-ink">
                Primary Button Text
              </label>
              <input
                id="primary-cta"
                type="text"
                maxLength={30}
                value={primaryCtaLabel}
                onChange={(e) => setPrimaryCtaLabel(e.target.value)}
                placeholder="Explore Collection"
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white text-ink transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="secondary-cta" className="text-xs font-semibold text-ink">
                Secondary Button Text
              </label>
              <input
                id="secondary-cta"
                type="text"
                maxLength={30}
                value={secondaryCtaLabel}
                onChange={(e) => setSecondaryCtaLabel(e.target.value)}
                placeholder="Request Custom Crochet"
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white text-ink transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 3. LIVE PREVIEW CARD */}
        <div className="p-6 rounded-2xl bg-white border border-pink-200/80 space-y-3">
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider block">
            Live Storefront Hero Preview
          </span>
          <div className="p-6 rounded-2xl bg-pink-50/20 border border-pink-100 space-y-3 text-center sm:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-[11px] font-semibold uppercase tracking-wider">
              {heroBadge || 'The Living Yarn Store'}
            </span>
            <h2 className="font-display font-extrabold text-2xl text-ink">
              {heroHeadline || 'Handmade with yarn. Made with love.'}
            </h2>
            <p className="text-xs text-textSecondary max-w-lg">
              {heroSubheadline || 'Unique crochet pieces made one stitch at a time.'}
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="px-4 py-2 rounded-xl bg-pink-600 text-white font-semibold text-xs shadow-xs">
                {primaryCtaLabel || 'Explore Collection'}
              </span>
              <span className="px-4 py-2 rounded-xl bg-white border border-pink-200 text-ink font-semibold text-xs">
                {secondaryCtaLabel || 'Request Custom Crochet'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
