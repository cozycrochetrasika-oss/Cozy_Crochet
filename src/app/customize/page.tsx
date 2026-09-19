'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  MessageCircle,
  Send,
  CheckCircle2,
  Upload,
  Calendar,
  Layers,
  Palette,
} from 'lucide-react';
import { useCustomRequestsStore } from '@/store/custom-requests-store';

export default function CustomizePage() {
  const addRequest = useCustomRequestsStore((state) => state.addRequest);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Bouquet',
    colors: 'Dusty Rose, Blush Pink & Warm Cream',
    size: 'Standard 10-inch diameter',
    quantity: 1,
    desiredDate: '',
    budgetRange: '₹1,500 - ₹3,000',
    description: '',
    contactMethod: 'WhatsApp' as 'WhatsApp' | 'Instagram' | 'Email' | 'Phone',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addRequest({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      category: formData.category,
      colors: formData.colors,
      size: formData.size,
      quantity: formData.quantity,
      desiredDate: formData.desiredDate || 'Flexible',
      budgetRange: formData.budgetRange,
      description: formData.description,
      contactMethod: formData.contactMethod,
    });

    setSubmitted(true);
  };

  const whatsappDirectUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello Cozy_Crochets Artisan! 🧶\n\nI just submitted a bespoke request:\n- Name: ${formData.name}\n- Category: ${formData.category}\n- Colors: ${formData.colors}\n- Size: ${formData.size}\n- Quantity: ${formData.quantity}\n- Desired Date: ${formData.desiredDate || 'Flexible'}\n- Budget: ${formData.budgetRange}\n- Contact via: ${formData.contactMethod}\n- Details: ${formData.description}\n\nLooking forward to hearing from you!`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-dustyRose">
          One-of-a-Kind Artistry
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink">
          Bespoke Custom Crochet
        </h1>
        <p className="text-sm sm:text-base text-cocoa/80 max-w-xl mx-auto">
          Collaborate directly with our master craftswomen. Whether matching a bridal bouquet, customizing nursery booties, or creating a bespoke handbag, we bring your vision to life stitch-by-stitch.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-sage/40 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-sage/20 text-sage flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-ink">Bespoke Request Received!</h2>
            <p className="text-sm text-cocoa max-w-md mx-auto">
              Thank you, {formData.name}! Our lead artisan has received your custom inquiry and will reach out via {formData.contactMethod} within 24 hours.
            </p>
          </div>
          <div className="pt-2">
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sage text-cocoa font-semibold text-sm shadow-sm hover:bg-sage/90 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp for Immediate Priority</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="custom-name" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                id="custom-name"
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Priya Nair"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-phone" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                id="custom-phone"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-email" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                id="custom-email"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="priya@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              />
            </div>
          </div>

          {/* Category & Contact Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="custom-category" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Category *
              </label>
              <select
                id="custom-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              >
                <option value="Bag">Bag (Tote, Shoulder bag, Handbag)</option>
                <option value="Flower">Flower (Single stems, Roses, Sunflowers)</option>
                <option value="Bouquet">Bouquet (Bridal, Celebration bouquet)</option>
                <option value="Shoes">Shoes (Kid shoes, Baby booties)</option>
                <option value="Headband">Headband (Floral crown, Hair accessory)</option>
                <option value="Key Ring">Key Ring (Crochet charm, Car key fob)</option>
                <option value="Other">Other Bespoke Piece</option>
              </select>
            </div>

            <div>
              <label htmlFor="custom-contact-method" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Preferred Contact Channel *
              </label>
              <select
                id="custom-contact-method"
                value={formData.contactMethod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactMethod: e.target.value as 'WhatsApp' | 'Instagram' | 'Email' | 'Phone',
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              >
                <option value="WhatsApp">WhatsApp Message</option>
                <option value="Instagram">Instagram Direct Message</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone Call</option>
              </select>
            </div>
          </div>

          {/* Color & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="custom-colors" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Color Preferences *
              </label>
              <input
                id="custom-colors"
                required
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="e.g. Sage Green, Lavender, Warm Cream"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-size" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Size / Dimensions *
              </label>
              <input
                id="custom-size"
                required
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g. 12x14 inch tote, or 0-6 month bootie"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              />
            </div>
          </div>

          {/* Quantity, Date & Budget Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="custom-qty" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Quantity *
              </label>
              <input
                id="custom-qty"
                required
                type="number"
                min={1}
                max={50}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-date" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Desired Delivery Date
              </label>
              <input
                id="custom-date"
                type="date"
                value={formData.desiredDate}
                onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-budget" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
                Budget Range *
              </label>
              <select
                id="custom-budget"
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
              >
                <option value="Under ₹1,000">Under ₹1,000</option>
                <option value="₹1,000 - ₹2,500">₹1,000 - ₹2,500</option>
                <option value="₹2,500 - ₹5,000">₹2,500 - ₹5,000</option>
                <option value="₹5,000+">₹5,000+ (Bridal / Bulk)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="custom-desc" className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
              Detailed Description & Occasion *
            </label>
            <textarea
              id="custom-desc"
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about specific flower types, custom tags, recipient details, and any inspiration..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink outline-none focus:border-dustyRose text-sm"
            />
          </div>

          {/* Reference Upload Placeholder */}
          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1.5 uppercase tracking-wider">
              Reference Image / Color Swatch (Optional)
            </label>
            <div className="border-2 border-dashed border-border/80 hover:border-dustyRose/60 rounded-2xl p-4 text-center bg-cream/20 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-cocoa/50 mx-auto mb-1" />
              <span className="text-xs text-cocoa/70 block">
                Click to attach inspiration photo (PNG, JPG up to 10MB) or share via WhatsApp
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-cocoa/70">
              * Bespoke creations require 4–7 business days crafting time.
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Bespoke Request</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
