'use client';

import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useSiteSettingsStore } from '@/store/site-settings-store';

export default function AdminSettingsPage() {
  const {
    dailyCaption,
    festivalBannerActive,
    festivalMessage,
    storeWhatsapp,
    storeUpiId,
    storeEmail,
    freeShippingThresholdPaise,
    updateSettings,
    resetAnnouncement,
  } = useSiteSettingsStore();

  const [form, setForm] = useState({
    dailyCaption,
    festivalBannerActive,
    festivalMessage,
    storeWhatsapp,
    storeUpiId,
    storeEmail,
    freeShippingThresholdPaise,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    resetAnnouncement(); // allow user to re-see announcement if updated
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display font-bold text-2xl text-ink">Storefront Operational Settings</h1>
        <p className="text-xs text-cocoa/75">
          Configure live announcement bar, payment rails, WhatsApp routing, and fulfillment thresholds.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-sage/20 border border-sage text-cocoa text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-sage" />
          <span>Operational settings saved and applied to storefront header!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Announcement Bar Settings */}
        <div className="p-5 rounded-2xl bg-cream/40 border border-border/70 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-dustyRose" />
            <h3 className="font-display font-bold text-sm text-ink">Admin-Controlled Top Announcement Bar</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">
              Daily Caption (Store Motto) *
            </label>
            <input
              type="text"
              required
              value={form.dailyCaption}
              onChange={(e) => setForm({ ...form, dailyCaption: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm outline-none focus:border-dustyRose"
            />
            <span className="text-[10px] text-cocoa/60 mt-0.5 block">
              Shown in the closable announcement bar at the top of every page.
            </span>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-cocoa cursor-pointer">
              <input
                type="checkbox"
                checked={form.festivalBannerActive}
                onChange={(e) => setForm({ ...form, festivalBannerActive: e.target.checked })}
                className="rounded text-dustyRose focus:ring-dustyRose"
              />
              <span>Enable Festival / Seasonal Sale Message</span>
            </label>
          </div>

          {form.festivalBannerActive && (
            <div>
              <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">
                Festival Message Promo Text
              </label>
              <input
                type="text"
                value={form.festivalMessage}
                onChange={(e) => setForm({ ...form, festivalMessage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm outline-none focus:border-dustyRose"
              />
            </div>
          )}
        </div>

        {/* Payment & Contact Rails */}
        <div className="p-5 rounded-2xl bg-cream/40 border border-border/70 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-dustyRose" />
            <h3 className="font-display font-bold text-sm text-ink">Payment & Communication Rails</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">
              Store Manual UPI ID *
            </label>
            <input
              type="text"
              required
              value={form.storeUpiId}
              onChange={(e) => setForm({ ...form, storeUpiId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm font-mono outline-none focus:border-dustyRose"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">
              Official WhatsApp Number *
            </label>
            <input
              type="text"
              required
              value={form.storeWhatsapp}
              onChange={(e) => setForm({ ...form, storeWhatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm font-mono outline-none focus:border-dustyRose"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">
              Free Shipping Threshold (in Paise) *
            </label>
            <input
              type="number"
              required
              value={form.freeShippingThresholdPaise}
              onChange={(e) =>
                setForm({ ...form, freeShippingThresholdPaise: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm font-mono outline-none focus:border-dustyRose"
            />
            <span className="text-[10px] text-cocoa/60 mt-0.5 block">
              Currently ₹{form.freeShippingThresholdPaise / 100}. Orders equal or above this qualify for free shipping.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">
              Support Email
            </label>
            <input
              type="email"
              required
              value={form.storeEmail}
              onChange={(e) => setForm({ ...form, storeEmail: e.target.value })}
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
            <span>Save Operational Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
