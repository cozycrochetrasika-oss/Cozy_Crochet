'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-dustyRose">Get In Touch</span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink">
          Connect with Our Artisans
        </h1>
        <p className="text-sm sm:text-base text-cocoa/80 max-w-lg mx-auto">
          Have a question about sizing, custom wedding bouquets, or wholesale orders? We are delighted to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info Channels */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg text-ink">Direct Channels</h3>

            <div className="space-y-4 text-xs text-cocoa">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-cream hover:bg-blush/30 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-sage" />
                <div>
                  <span className="font-bold text-ink block">WhatsApp Chat</span>
                  <span>+91 98765 43210 (Instant response)</span>
                </div>
              </a>

              <a
                href="mailto:hello@cozycrochets.com"
                className="flex items-center gap-3 p-3 rounded-xl bg-cream hover:bg-blush/30 transition-colors"
              >
                <Mail className="w-5 h-5 text-dustyRose" />
                <div>
                  <span className="font-bold text-ink block">Email Inquiries</span>
                  <span>hello@cozycrochets.com</span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-cream">
                <MapPin className="w-5 h-5 text-warmGold" />
                <div>
                  <span className="font-bold text-ink block">Studio Workshop</span>
                  <span>Artisan Lane, Pune, Maharashtra, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="w-10 h-10 text-sage mx-auto" />
                <h3 className="font-display font-bold text-xl text-ink">Message Sent!</h3>
                <p className="text-xs text-cocoa">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-cocoa mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Sen"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cocoa mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="meera@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cocoa mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our crochet artisans help you?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
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
