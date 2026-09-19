'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatINR } from '@/data/products';

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, getTotalPaise, getTotalItems } = useCartStore();

  const totalItems = getTotalItems();
  const subtotalPaise = getTotalPaise();
  const freeShippingThreshold = 99900;
  const isFreeShipping = subtotalPaise >= freeShippingThreshold || subtotalPaise === 0;
  const progressPercent = Math.min(100, (subtotalPaise / freeShippingThreshold) * 100);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/80 bg-cream/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-dustyRose" />
            <h3 className="font-display font-bold text-lg text-ink">
              Shopping Bag ({totalItems})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-cream text-cocoa hover:text-ink transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-6 py-3 bg-blush/20 border-b border-border/50 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-medium text-cocoa">
            <span>
              {isFreeShipping && subtotalPaise > 0 ? (
                <strong className="text-sage flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlocked Free Handcrafted Shipping!
                </strong>
              ) : (
                <>Add {formatINR(freeShippingThreshold - subtotalPaise)} more for Free Shipping</>
              )}
            </span>
            <span className="font-mono text-[11px] font-semibold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-cream overflow-hidden">
            <div
              className="h-full bg-dustyRose rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-12 h-12 text-cocoa/30 mx-auto" />
              <div className="space-y-1">
                <p className="font-display font-bold text-base text-ink">Your bag is empty</p>
                <p className="text-xs text-cocoa/70">Add lovely handcrafted crochet pieces to get started.</p>
              </div>
            </div>
          ) : (
            items.map(({ product, quantity }) => {
              const mainMedia = product.media.find((m) => m.slot === 'main') || product.media[0];
              return (
                <div
                  key={product.id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-cream/30 border border-border/60"
                >
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    {mainMedia && (
                      <Image
                        src={mainMedia.publicUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="70px"
                      />
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="font-display font-bold text-sm text-ink hover:text-dustyRose transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="text-cocoa/40 hover:text-danger p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-mono font-bold text-xs text-ink block mt-0.5">
                        {formatINR(product.pricePaise)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-lg border border-border bg-surface overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-0.5 text-xs text-cocoa hover:bg-cream"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-mono font-bold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-xs text-cocoa hover:bg-cream"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono font-bold text-xs text-ink">
                        {formatINR(product.pricePaise * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-cream/20 space-y-4">
            <div className="space-y-1.5 text-xs text-cocoa">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-ink text-sm">{formatINR(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono font-bold text-ink">
                  {isFreeShipping ? <span className="text-sage">FREE</span> : formatINR(9900)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Checkout Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-border hover:bg-surface text-cocoa font-medium text-xs text-center transition-colors"
              >
                View Full Bag Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
