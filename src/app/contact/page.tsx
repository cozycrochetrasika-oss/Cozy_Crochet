'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Instagram, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import {
  BUSINESS_CONFIG,
  getGeneralWhatsAppInquiryUrl,
  getAlternateWhatsAppUrl,
  getMailtoUrl,
  getTelUrl,
} from '@/lib/config/business';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-pink-600">Get In Touch</span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink">
          Connect with Our Artisans
        </h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-lg mx-auto">
          Have a question about yarn fibers, custom wedding bouquets, or bespoke orders? We are delighted to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Channels */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg text-ink">Verified Direct Channels</h3>

            <div className="space-y-3.5 text-xs">
              {/* Primary WhatsApp */}
              <a
                href={getGeneralWhatsAppInquiryUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-pink-50/50 hover:bg-pink-100/70 border border-pink-100/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-ink block text-sm">Primary WhatsApp Chat</span>
                  <span className="text-text-secondary">{BUSINESS_CONFIG.primaryPhone} (Instant response)</span>
                </div>
              </a>

              {/* Alternate WhatsApp / Support */}
              <a
                href={getAlternateWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-pink-50/50 hover:bg-pink-100/70 border border-pink-100/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-ink block text-sm">Alternate WhatsApp</span>
                  <span className="text-text-secondary">{BUSINESS_CONFIG.alternatePhone} (Backup support)</span>
                </div>
              </a>

              {/* Direct Call */}
              <a
                href={getTelUrl(BUSINESS_CONFIG.primaryPhoneNormalized)}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-pink-50/50 hover:bg-pink-100/70 border border-pink-100/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-ink block text-sm">Phone Call</span>
                  <span className="text-text-secondary">{BUSINESS_CONFIG.primaryPhone}</span>
                </div>
              </a>

              {/* Email */}
              <a
                href={getMailtoUrl()}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-pink-50/50 hover:bg-pink-100/70 border border-pink-100/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-ink block text-sm">Direct Email</span>
                  <span className="text-text-secondary">{BUSINESS_CONFIG.email}</span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-pink-50/50 hover:bg-pink-100/70 border border-pink-100/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-ink block text-sm">Instagram Showcase</span>
                  <span className="text-text-secondary">{BUSINESS_CONFIG.instagramHandle}</span>
                </div>
              </a>
            </div>

            <div className="pt-2 border-t border-pink-100 flex items-center gap-2 text-xs text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-pink-600 flex-shrink-0" />
              <span>Founded & hand-curated by {BUSINESS_CONFIG.founder}</span>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-100 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-pink-600 mx-auto" />
                <h3 className="font-display font-bold text-2xl text-ink">Message Sent!</h3>
                <p className="text-sm text-text-secondary max-w-sm mx-auto">
                  Thank you for writing to us. Rasika and the Cozy_Crochets team will respond to you within 24 hours.
                </p>
                <div className="pt-4">
                  <a
                    href={getGeneralWhatsAppInquiryUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white font-semibold text-xs shadow-sm hover:bg-pink-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp for Faster Reply</span>
                  </a>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <h3 className="font-display font-bold text-xl text-ink mb-2">Send an Inquiry</h3>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Sen"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="meera@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Phone / WhatsApp Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our crochet artisans help you?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-ink"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
