'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatINR } from '@/data/products';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPaise, getTotalItems } = useCartStore();

  const totalItems = getTotalItems();
  const subtotalPaise = getTotalPaise();
  const freeShippingThreshold = 99900; // ₹999.00
  const isFreeShipping = subtotalPaise >= freeShippingThreshold || subtotalPaise === 0;
  const shippingPaise = isFreeShipping ? 0 : 9900; // ₹99.00
  const grandTotalPaise = subtotalPaise + shippingPaise;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">Your Shopping Bag</h1>
        <p className="text-sm text-cocoa/75 mt-1">
          {totalItems === 0
            ? 'Your bag is empty.'
            : `You have ${totalItems} handcrafted ${totalItems === 1 ? 'item' : 'items'} in your bag.`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-border space-y-5">
          <div className="w-16 h-16 rounded-full bg-blush/40 flex items-center justify-center mx-auto text-cocoa">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="font-display font-bold text-xl text-ink">Your bag is as light as air</h3>
            <p className="text-sm text-cocoa">Explore our artisanal collection and bring home everlasting warmth.</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-dustyRose text-white font-semibold text-sm shadow-sm hover:bg-dustyRose/90 transition-colors"
          >
            <span>Browse Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ product, quantity }) => {
              const mainMedia = product.media.find((m) => m.slot === 'main') || product.media[0];
              return (
                <div
                  key={product.id}
                  className="p-4 sm:p-6 rounded-2xl bg-surface border border-border/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                      {mainMedia && (
                        <Image
                          src={mainMedia.publicUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-dustyRose">
                        {product.category}
                      </span>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-display font-bold text-base text-ink hover:text-dustyRose transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <span className="font-mono font-bold text-sm text-ink block mt-1">
                        {formatINR(product.pricePaise)} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    {/* Stepper */}
                    <div className="flex items-center rounded-xl border border-border bg-cream/40 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-3 py-1.5 text-cocoa hover:bg-cream transition-colors font-bold text-sm"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3.5 py-1.5 text-xs font-mono font-bold text-ink">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-3 py-1.5 text-cocoa hover:bg-cream transition-colors font-bold text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Total for item */}
                    <span className="font-mono font-bold text-base text-ink w-24 text-right">
                      {formatINR(product.pricePaise * quantity)}
                    </span>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-cocoa/50 hover:text-danger p-2 transition-colors"
                      aria-label="Remove product from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cocoa hover:text-dustyRose transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Browsing Items</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-6 sticky top-24">
              <h2 className="font-display font-bold text-xl text-ink">Order Summary</h2>

              <div className="space-y-3 text-sm text-cocoa/80 border-b border-border/60 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-ink">{formatINR(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping & Packaging</span>
                  <span className="font-mono font-bold text-ink">
                    {isFreeShipping ? (
                      <span className="text-sage font-semibold uppercase text-xs">Free</span>
                    ) : (
                      formatINR(shippingPaise)
                    )}
                  </span>
                </div>
                {!isFreeShipping && (
                  <p className="text-[11px] text-dustyRose">
                    Add {formatINR(freeShippingThreshold - subtotalPaise)} more to unlock free shipping!
                  </p>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-display font-bold text-lg text-ink">Grand Total</span>
                <span className="font-mono font-extrabold text-2xl text-ink">
                  {formatINR(grandTotalPaise)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="p-3.5 rounded-xl bg-cream/60 border border-border/50 text-[11px] text-cocoa/75 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-warmGold flex-shrink-0" />
                <span>Secure SSL checkout via Stripe Card & Instant UPI QR payment.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
