import React from 'react';
import Image from 'next/image';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-dustyRose">Our Story</span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink">
          The Living Yarn Store
        </h1>
        <p className="text-base text-cocoa/80 max-w-xl mx-auto">
          Born from a passion for timeless fiber arts, Cozy_Crochets celebrates the slow, soulful rhythm of handmade craftsmanship.
        </p>
      </div>

      <div className="relative aspect-video rounded-3xl overflow-hidden border border-border shadow-md">
        <Image
          src="/products/Boque/Bundle.png"
          alt="Artisans hand-crocheting flower petals"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
      </div>

      <div className="prose prose-stone max-w-none text-cocoa/85 space-y-6 text-sm sm:text-base leading-relaxed">
        <p>
          In a world dominated by mass assembly lines and synthetic plastic flowers that fade into landfills, Cozy_Crochets offers an everlasting alternative: blooms and keepsakes sculpted thread-by-thread from certified hypoallergenic organic milk cotton.
        </p>
        <p>
          Every bouquet, tote bag, and pair of baby booties in our store represents hours of patient hand stitching by skilled women artisans across India. We believe that true luxury lies in the human hands that formed each loop, the natural warmth of pure fiber, and the memories our pieces help you hold.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 not-prose">
          <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-2">
            <Heart className="w-6 h-6 text-dustyRose mx-auto" />
            <h4 className="font-display font-bold text-ink">Zero Machines</h4>
            <p className="text-xs text-cocoa/70">100% human-crocheted from organic milk cotton.</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-2">
            <Sparkles className="w-6 h-6 text-warmGold mx-auto" />
            <h4 className="font-display font-bold text-ink">Everlasting Blooms</h4>
            <p className="text-xs text-cocoa/70">Flowers that never wilt, maintaining vivid color for decades.</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-2">
            <ShieldCheck className="w-6 h-6 text-sage mx-auto" />
            <h4 className="font-display font-bold text-ink">Artisan Empowerment</h4>
            <p className="text-xs text-cocoa/70">Direct, fair-wage livelihoods for traditional craftswomen.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
