import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">Privacy & Data Policy</h1>
        <p className="text-xs text-cocoa/70">Last updated: September 2026</p>
      </div>

      <div className="prose prose-stone text-cocoa/85 space-y-6 text-sm leading-relaxed">
        <p>
          At <strong>Cozy_Crochets</strong>, we respect and safeguard the personal privacy of our patrons. We only collect details essential for fulfilling your handmade orders (such as delivery addresses, phone numbers for courier delivery, and email for transaction receipts).
        </p>
        <h3 className="font-display font-bold text-lg text-ink">Payment Security</h3>
        <p>
          We never store raw debit/credit card numbers or CVVs. All card processing is encrypted and conducted directly by Stripe. For UPI payments, transactions occur directly within your certified UPI application.
        </p>
        <h3 className="font-display font-bold text-lg text-ink">Cookies & Analytics</h3>
        <p>
          We use minimal local storage cookies strictly required to keep your shopping bag intact between visits and manage authenticated sessions.
        </p>
      </div>
    </div>
  );
}
