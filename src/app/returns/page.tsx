import React from 'react';

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">Handmade Returns Policy</h1>
        <p className="text-xs text-cocoa/70">Artisan assurance & craftsmanship guarantee</p>
      </div>

      <div className="prose prose-stone text-cocoa/85 space-y-6 text-sm leading-relaxed">
        <h3 className="font-display font-bold text-lg text-ink">Artisan Nature of Our Products</h3>
        <p>
          Each Cozy_Crochets item is an individual work of textile art. Subtle stitch tension nuances, petal curves, and thread variations are the hallmark of authentic human crafting and not manufacturing defects.
        </p>

        <h3 className="font-display font-bold text-lg text-ink">Damaged in Transit Guarantee</h3>
        <p>
          If your creation arrives crushed or damaged during transit, notify us on WhatsApp or email within <strong>48 hours of delivery</strong> with unboxing photos. We will immediately arrange a replacement handcrafted piece at no cost to you.
        </p>

        <h3 className="font-display font-bold text-lg text-ink">Custom Commission Policy</h3>
        <p>
          Personalized and custom bespoke items made with custom names or specific non-catalog color choices cannot be returned once approved and crafted.
        </p>
      </div>
    </div>
  );
}
