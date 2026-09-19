'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, X, Truck, Check, ShieldCheck } from 'lucide-react';

const DynamicDeliveryMap = dynamic(
  () => import('./delivery-map').then((mod) => mod.DeliveryMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 rounded-2xl bg-cream/50 flex items-center justify-center border border-border">
        <span className="text-xs text-cocoa/60 animate-pulse">Loading artisan logistics map...</span>
      </div>
    ),
  }
);

export function LocationDrawer({
  isOpen,
  onClose,
  currentPincode,
  onUpdatePincode,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentPincode: string;
  onUpdatePincode: (pincode: string) => void;
}) {
  const [inputVal, setInputVal] = useState(currentPincode);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim().length === 6) {
      onUpdatePincode(inputVal.trim());
      setConfirmed(true);
      setTimeout(() => {
        setConfirmed(false);
        onClose();
      }, 800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-border relative space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-cocoa/70 hover:text-ink p-1 rounded-full hover:bg-cream transition-colors"
          aria-label="Close location drawer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-dustyRose" />
            <h3 className="font-display font-bold text-xl text-ink">Delivery Location & Hubs</h3>
          </div>
          <p className="text-xs text-cocoa/80">
            Check shipping availability and estimated transit from our artisan workshop to your doorstep.
          </p>
        </div>

        {/* MapLibre Interactive Map */}
        <DynamicDeliveryMap selectedPincode={currentPincode} />

        {/* Pincode Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-cocoa/70 uppercase tracking-wider mb-1.5">
              Enter Indian Postal Pincode (6 Digits)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 411038"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 text-ink font-mono font-bold text-base outline-none focus:border-dustyRose focus:ring-1 focus:ring-dustyRose"
                autoFocus
              />
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  confirmed
                    ? 'bg-sage text-cocoa'
                    : 'bg-dustyRose hover:bg-dustyRose/90 text-white shadow-sm'
                }`}
              >
                {confirmed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <span>Apply</span>
                )}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cream/50 border border-border/60 flex items-center justify-between text-xs text-cocoa">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-dustyRose" />
              <span>Standard Transit: <strong>3-5 Days</strong></span>
            </div>
            <span className="font-semibold text-sage">Free above ₹999</span>
          </div>
        </form>
      </div>
    </div>
  );
}
