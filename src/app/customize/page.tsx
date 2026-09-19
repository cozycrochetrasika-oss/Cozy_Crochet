'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Send,
  CheckCircle2,
  Upload,
  Calendar,
  Layers,
  Palette,
} from 'lucide-react';
import { useCustomRequestsStore } from '@/store/custom-requests-store';
import {
  BUSINESS_CONFIG,
  getWhatsAppUrl,
  getAlternateWhatsAppUrl,
  getMailtoUrl,
  getTelUrl,
} from '@/lib/config/business';

export default function CustomizePage() {
  const addRequest = useCustomRequestsStore((state) => state.addRequest);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Bouquets',
    colors: 'Sky Blue, Pearl White & Soft Lavender',
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

  const summaryMessage = `Hello Cozy_Crochets Artisan! 🧶\n\nI just submitted a bespoke request:\n- Name: ${formData.name}\n- Category: ${formData.category}\n- Colors: ${formData.colors}\n- Size: ${formData.size}\n- Quantity: ${formData.quantity}\n- Desired Date: ${formData.desiredDate || 'Flexible'}\n- Budget: ${formData.budgetRange}\n- Contact via: ${formData.contactMethod}\n- Details: ${formData.description}\n\nLooking forward to discussing the design with you!`;

  const primaryWhatsAppUrl = getWhatsAppUrl(
    BUSINESS_CONFIG.primaryPhoneDigits,
    summaryMessage
  );

  const alternateWhatsAppUrl = getWhatsAppUrl(
    BUSINESS_CONFIG.alternatePhoneDigits,
    summaryMessage
  );

  const emailUrl = getMailtoUrl(`Bespoke Custom Crochet Request - ${formData.name}`);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          One-of-a-Kind Artistry
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink">
          Bespoke Custom Crochet
        </h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto">
          Collaborate directly with founder {BUSINESS_CONFIG.founder} and our master craftswomen. Whether matching a bridal bouquet, customizing nursery booties, or creating a bespoke handbag, we bring your vision to life stitch-by-stitch.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-blue-100 shadow-md text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink">Bespoke Request Received!</h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Thank you, <strong className="text-ink">{formData.name}</strong>! Your bespoke design brief has been recorded. {BUSINESS_CONFIG.founder} will review your request and reach out via {formData.contactMethod} within 24 hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/40 border border-blue-100 text-left max-w-lg mx-auto space-y-2 text-xs text-text-secondary">
            <div className="font-bold text-ink text-sm pb-1 border-b border-blue-100">Order Brief Summary</div>
            <div className="flex justify-between"><span>Category:</span> <strong className="text-ink">{formData.category}</strong></div>
            <div className="flex justify-between"><span>Colors:</span> <strong className="text-ink">{formData.colors}</strong></div>
            <div className="flex justify-between"><span>Quantity:</span> <strong className="text-ink">{formData.quantity}</strong></div>
            <div className="flex justify-between"><span>Budget:</span> <strong className="text-ink">{formData.budgetRange}</strong></div>
          </div>

          <div className="space-y-3 pt-2 max-w-md mx-auto">
            <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Fast-Track Direct Communication
            </span>

            {/* 1. Primary WhatsApp Button */}
            <a
              href={primaryWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Summary to Primary WhatsApp ({BUSINESS_CONFIG.primaryPhone})</span>
            </a>

            {/* 2. Alternate WhatsApp Button */}
            <a
              href={alternateWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Alternate WhatsApp Support ({BUSINESS_CONFIG.alternatePhone})</span>
            </a>

            {/* 3. Direct Call Button */}
            <a
              href={getTelUrl(BUSINESS_CONFIG.primaryPhoneNormalized)}
              className="w-full py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Direct Call to Rasika ({BUSINESS_CONFIG.primaryPhone})</span>
            </a>

            {/* 4. Direct Email */}
            <a
              href={emailUrl}
              className="w-full py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Artisan ({BUSINESS_CONFIG.email})</span>
            </a>

            {/* 5. Instagram */}
            <a
              href={BUSINESS_CONFIG.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>View & DM on Instagram ({BUSINESS_CONFIG.instagramHandle})</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="custom-name" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                id="custom-name"
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Priya Nair"
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-phone" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                id="custom-phone"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-email" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                id="custom-email"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="priya@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Category & Contact Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="custom-category" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Category *
              </label>
              <select
                id="custom-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              >
                <option value="Flowers">Flowers (Single stems, Roses, Sunflowers, Daisies)</option>
                <option value="Bouquets">Bouquets (Bridal, Celebration, Everlasting arrangements)</option>
                <option value="Bags">Bags (Tote, Shoulder bag, Clutch, Handbag)</option>
                <option value="Accessories">Accessories (Headbands, Hair ties, Accents)</option>
                <option value="Keyrings">Keyrings (Miniature charms, Car key fobs)</option>
                <option value="Footwear">Footwear (Baby booties, Cozy kid slippers)</option>
                <option value="Other">Other Bespoke Handcrafted Piece</option>
              </select>
            </div>

            <div>
              <label htmlFor="custom-contact-method" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
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
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              >
                <option value="WhatsApp">WhatsApp Message ({BUSINESS_CONFIG.primaryPhone})</option>
                <option value="Instagram">Instagram Direct Message</option>
                <option value="Email">Email ({BUSINESS_CONFIG.email})</option>
                <option value="Phone">Phone Call</option>
              </select>
            </div>
          </div>

          {/* Color & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="custom-colors" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Color Preferences *
              </label>
              <input
                id="custom-colors"
                required
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="e.g. Sky Blue, White, Lavender & Soft Mint"
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-size" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Size / Dimensions *
              </label>
              <input
                id="custom-size"
                required
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g. 12x14 inch tote, or 0-6 month bootie"
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Quantity, Date & Budget Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="custom-qty" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
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
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-date" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Desired Delivery Date
              </label>
              <input
                id="custom-date"
                type="date"
                value={formData.desiredDate}
                onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              />
            </div>

            <div>
              <label htmlFor="custom-budget" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
                Budget Range *
              </label>
              <select
                id="custom-budget"
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
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
            <label htmlFor="custom-desc" className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
              Detailed Description & Occasion *
            </label>
            <textarea
              id="custom-desc"
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about specific flower types, custom tags, recipient details, and any inspiration..."
              className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-ink outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Reference Upload Placeholder */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wider">
              Reference Image / Color Swatch (Optional)
            </label>
            <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-4 text-center bg-blue-50/20 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <span className="text-xs text-text-secondary block">
                Attach inspiration photo (PNG, JPG up to 10MB) or share directly on WhatsApp
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-text-secondary">
              * Bespoke creations require 4–7 business days crafting time.
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
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
