'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Star, ShoppingBag, Eye, Sparkles, Check, ArrowRight } from 'lucide-react';
import type { Product } from '@/data/products';
import { formatINR } from '@/data/products';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated, setPendingIntent } = useAuthStore();

  const mainMedia = product.media.find((m) => m.slot === 'main') || product.media[0];
  const secondaryMedia = product.media.find((m) => m.slot === 'single' || m.slot === 'bundle') || mainMedia;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated; if not, preserve intent and prompt login
    if (!isAuthenticated) {
      setPendingIntent({
        product,
        quantity: 1,
        returnUrl: pathname || '/shop',
      });
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/shop')}&intent=add-to-cart`);
      return;
    }

    const result = addItem(product, 1);
    if (result.success) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1200);
    } else {
      alert(result.message);
    }
  };

  return (
    <div
      className="group relative bg-surface rounded-2xl border border-border/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-cream/30">
        {/* Main Image */}
        {mainMedia && (
          <Image
            src={mainMedia.publicUrl}
            alt={mainMedia.altText}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 ease-out ${
              isHovered && secondaryMedia ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
        )}

        {/* Secondary Hover Image */}
        {secondaryMedia && secondaryMedia !== mainMedia && (
          <Image
            src={secondaryMedia.publicUrl}
            alt={secondaryMedia.altText}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ease-out absolute inset-0 ${
              isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
            }`}
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestSeller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cocoa text-cream shadow-sm">
              <Sparkles className="w-3 h-3 text-warmGold" />
              Best Seller
            </span>
          )}
          {product.soldCount > 100 && (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-sage/90 text-cocoa shadow-sm">
              {product.soldCount}+ handcrafted
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="w-9 h-9 rounded-full bg-cream/90 backdrop-blur-sm text-cocoa hover:text-dustyRose flex items-center justify-center shadow-md">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-2 text-cocoa/75">
            <span className="uppercase tracking-wider font-semibold text-dustyRose">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-warmGold text-warmGold" />
              <span className="font-semibold text-ink">{product.rating.toFixed(1)}</span>
              <span className="text-cocoa/50">({product.reviewCount})</span>
            </div>
          </div>

          {/* EXACT BOLD VISUAL EMPHASIS FOR 3 LABELS & VALUES */}
          <div className="space-y-1 py-1.5 px-3 rounded-xl bg-cream/50 border border-border/50 text-xs">
            <div className="flex items-baseline justify-between gap-1">
              <span className="font-bold text-ink">Item Name:</span>
              <span className="font-semibold text-cocoa text-right truncate">{product.name}</span>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <span className="font-bold text-ink">Item Quantity:</span>
              <span className={`font-semibold ${product.inventoryQty > 0 ? 'text-sage' : 'text-danger'}`}>
                {product.inventoryQty > 0 ? `${product.inventoryQty} in stock` : 'Out of stock'}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-1">
              <span className="font-bold text-ink">Item Price:</span>
              <span className="font-mono font-bold text-ink">{formatINR(product.pricePaise)}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-cocoa/80 mt-2 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Action Controls: View Details + Add to Bag */}
        <div className="pt-3 border-t border-border/60 flex items-center gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 py-2 px-3 rounded-xl border border-border/80 hover:border-dustyRose bg-surface hover:bg-cream/40 text-cocoa text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 text-dustyRose" />
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.inventoryQty <= 0}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              product.inventoryQty <= 0
                ? 'bg-cocoa/10 text-cocoa/40 cursor-not-allowed'
                : addedAnimation
                ? 'bg-sage text-cocoa scale-95'
                : 'bg-dustyRose hover:bg-dustyRose/90 text-white shadow-sm'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
