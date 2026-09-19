import React from 'react';

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">Shipping & Delivery</h1>
        <p className="text-xs text-cocoa/70">Crafted with patience, packaged with care</p>
      </div>

      <div className="prose prose-stone text-cocoa/85 space-y-6 text-sm leading-relaxed">
        <h3 className="font-display font-bold text-lg text-ink">Crafting Lead Times</h3>
        <p>
          Because all Cozy_Crochets items are hand-stitched by independent artisans, in-stock items dispatch within <strong>2-3 business days</strong>. Bespoke and custom colorway commissions typically require <strong>4-7 business days</strong> to craft before dispatch.
        </p>

        <h3 className="font-display font-bold text-lg text-ink">Delivery Rates & Free Shipping</h3>
        <p>
          We offer <strong>Free Standard Delivery</strong> across all serviceable pincodes in India for orders totaling ₹999 or more. For orders below ₹999, a flat shipping fee of ₹99 is applied to cover specialized protective rigid gift packaging.
        </p>

        <h3 className="font-display font-bold text-lg text-ink">Courier Partners & Tracking</h3>
        <p>
          Orders are dispatched via trusted courier partners with tracking numbers provided via WhatsApp and SMS upon shipment.
        </p>
      </div>
    </div>
  );
}
