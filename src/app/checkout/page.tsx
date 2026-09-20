'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  MapPin,
  ShoppingBag,
  User,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatINR } from '@/data/products';
import {
  generateVerificationCode,
  generateUpiIntentUrl,
  generateWhatsAppOrderUrl,
} from '@/lib/payments/types';
import { hashVerificationCode } from '@/lib/payments/security';
import { useOrdersStore } from '@/store/orders-store';

type StepNumber = 1 | 2 | 3 | 4 | 5;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPaise, clearCart } = useCartStore();
  const addOrder = useOrdersStore((state) => state.addOrder);

  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  // Form State
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '110001',
    latitude: 28.6139,
    longitude: 77.2090,
  });

  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'upi_manual' | 'stripe'>('upi_manual');

  // Confirmation Order State
  const [orderSummary, setOrderSummary] = useState<{
    id: string;
    orderNumber: string;
    verificationCode: string;
    totalPaise: number;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // MapLibre Ref for Step 3
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markerInstance = useRef<maplibregl.Marker | null>(null);

  const subtotalPaise = getTotalPaise();
  const isFreeShipping = subtotalPaise >= 99900 || subtotalPaise === 0;
  const shippingPaise = isFreeShipping ? 0 : 9900;
  const grandTotalPaise = subtotalPaise + shippingPaise;

  const initialCoordsRef = useRef({ lng: address.longitude, lat: address.latitude });

  // Initialize MapLibre on Step 3
  useEffect(() => {
    if (currentStep !== 3 || !mapContainer.current) return;

    try {
      const tileUrl = process.env.NEXT_PUBLIC_MAPLIBRE_TILE_URL || 'https://demotiles.maplibre.org/style.json';
      const { lng, lat } = initialCoordsRef.current;

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: tileUrl,
        center: [lng, lat],
        zoom: 12,
        attributionControl: { compact: true },
      });

      const marker = new maplibregl.Marker({
        draggable: true,
        color: '#DFA7AD',
      })
        .setLngLat([lng, lat])
        .addTo(map);

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        setAddress((prev) => ({
          ...prev,
          longitude: lngLat.lng,
          latitude: lngLat.lat,
        }));
      });

      mapInstance.current = map;
      markerInstance.current = marker;

      return () => {
        map.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      };
    } catch (e) {
      console.warn('MapLibre init notice:', e);
    }
  }, [currentStep]);

  // Handle explicit "Use My Location" click (only on user gesture)
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationStatus('Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAddress((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        if (mapInstance.current && markerInstance.current) {
          mapInstance.current.flyTo({ center: [longitude, latitude], zoom: 14 });
          markerInstance.current.setLngLat([longitude, latitude]);
        }

        setLocating(false);
        setLocationStatus('Location pinned on map! Adjust pin if needed.');
      },
      (error) => {
        setLocating(false);
        setLocationStatus('Location permission denied or unavailable. Please fill address manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Final Order Placement
  const handleFinalOrder = async () => {
    const newOrderNum = `CC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCode = generateVerificationCode();
    const codeHash = await hashVerificationCode(newCode);

    const orderRecordId = await addOrder({
      orderNumber: newOrderNum,
      customerName: customerInfo.fullName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      city: address.city,
      addressLine1: address.addressLine1,
      state: address.state,
      postalCode: address.postalCode,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        pricePaise: i.product.pricePaise,
      })),
      totalPaise: grandTotalPaise,
      paymentProvider: paymentMethod,
      paymentStatus: 'payment_pending',
      fulfilmentStatus: 'processing',
      verificationCodeHash: codeHash,
      rawCodeForDemo: newCode,
    });

    setOrderSummary({
      id: orderRecordId,
      orderNumber: newOrderNum,
      verificationCode: newCode,
      totalPaise: grandTotalPaise,
    });

    clearCart();
    setCurrentStep(5);
  };

  const copyCode = () => {
    if (!orderSummary) return;
    navigator.clipboard.writeText(orderSummary.verificationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // ==========================================
  // STEP 5: ORDER CONFIRMATION & RECEIPT
  // ==========================================
  if (currentStep === 5 && orderSummary) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border shadow-sm space-y-8 text-center">
          <div className="w-16 h-16 rounded-full bg-sage/20 text-sage flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-dustyRose">Order Registered</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink">
              Thank You for Supporting Handcrafted Art!
            </h1>
            <p className="text-sm text-cocoa max-w-md mx-auto">
              Your order <strong className="text-ink font-mono">{orderSummary.orderNumber}</strong> is a local demo. It has not been sent to the workshop.
            </p>
          </div>

          {paymentMethod === 'upi_manual' ? (
            <div className="p-6 rounded-2xl bg-cream/60 border border-border/80 text-left space-y-5 max-w-lg mx-auto">
              <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                <QrCode className="w-5 h-5 text-dustyRose" />
                <h3 className="font-display font-bold text-base text-ink">Manual UPI & WhatsApp Verification</h3>
              </div>

              <div className="space-y-3 text-xs text-cocoa/90 leading-relaxed">
                <p>
                  Payment preview only. Do not send money.
                </p>
                <div className="p-3 bg-surface rounded-xl border border-border font-mono font-bold text-sm text-ink flex items-center justify-between">
                  <span>Payment recipient not configured</span>
                  <span className="text-[10px] uppercase font-semibold text-sage bg-sage/20 px-2 py-0.5 rounded">Demo only</span>
                </div>

                <p>
                  Sample six-digit order reference:
                </p>
                <div className="p-3.5 bg-surface rounded-xl border border-dustyRose/60 font-mono font-extrabold text-xl text-dustyRose flex items-center justify-between shadow-xs">
                  <span>{orderSummary.verificationCode}</span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="flex items-center gap-1 text-xs font-sans font-medium text-cocoa hover:text-ink px-2 py-1 rounded bg-cream/70"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-sage" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="block text-[11px] text-cocoa/65 italic">
                  * Note: This code serves as a verification reference for our artisan. Payment will be confirmed once checked against banking records.
                </span>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <a
                  aria-disabled="true"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-sage hover:bg-sage/90 text-cocoa font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Confirmation</span>
                </a>

                <a
                  aria-disabled="true"
                  className="w-full py-2.5 px-4 rounded-xl border border-border hover:bg-surface text-cocoa font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Open UPI App Directly</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-cream/60 border border-border text-center space-y-3 max-w-md mx-auto">
              <CreditCard className="w-6 h-6 text-dustyRose mx-auto" />
              <h3 className="font-display font-bold text-base text-ink">Stripe Payment Preview</h3>
              <p className="text-xs text-cocoa">
                Stripe is not connected. No payment was authorized and no receipt was sent.
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-center gap-4 text-xs font-semibold">
            <Link href={`/orders/${orderSummary.id}`} className="text-dustyRose hover:underline">
              View Order Receipt →
            </Link>
            <span className="text-cocoa/40">•</span>
            <Link href="/" className="text-cocoa hover:text-ink">
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header & Breadcrumb */}
      <div>
        <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-medium text-cocoa hover:text-dustyRose mb-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Bag</span>
        </Link>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">Multi-Step Checkout</h1>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {[
          { step: 1, label: 'Review Bag' },
          { step: 2, label: 'Contact' },
          { step: 3, label: 'Address & Map' },
          { step: 4, label: 'Payment' },
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            disabled={s.step > currentStep}
            onClick={() => s.step < currentStep && setCurrentStep(s.step as StepNumber)}
            className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 transition-colors ${
              currentStep === s.step
                ? 'bg-dustyRose text-white border-dustyRose shadow-sm'
                : currentStep > s.step
                ? 'bg-sage/20 text-cocoa border-sage/40 hover:bg-sage/30 cursor-pointer'
                : 'bg-surface text-cocoa/40 border-border cursor-not-allowed'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold bg-white/20">
              {s.step}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Step Form */}
        <div className="lg:col-span-7">
          {/* STEP 1: CART REVIEW */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="font-display font-bold text-xl text-ink">Step 1: Review Shopping Bag</h2>
                <span className="text-xs text-cocoa font-medium">{items.length} item(s)</span>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <ShoppingBag className="w-10 h-10 text-cocoa/30 mx-auto" />
                  <p className="text-sm text-cocoa">Your shopping bag is empty.</p>
                  <Link
                    href="/shop"
                    className="inline-block px-6 py-2.5 rounded-xl bg-dustyRose text-white text-xs font-semibold"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-border/50 max-h-80 overflow-y-auto pr-1">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-ink">{product.name}</h4>
                          <span className="text-xs text-cocoa/70">
                            Quantity: <strong className="text-ink">{quantity}</strong> × {formatINR(product.pricePaise)}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-sm text-ink">
                          {formatINR(product.pricePaise * quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border/60 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3.5 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all"
                    >
                      <span>Continue to Contact Info</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: DELIVERY CONTACT INFO */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-6">
              <div className="border-b border-border/60 pb-3">
                <h2 className="font-display font-bold text-xl text-ink">Step 2: Delivery Contact Details</h2>
                <p className="text-xs text-cocoa/75">We will use this to send dispatch updates and delivery confirmation.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-cocoa mb-1">Full Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarti Deshmukh"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cocoa mb-1">Phone (WhatsApp preferred) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cocoa mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="aarti@example.com"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cocoa mb-1">Special Gift Note / Delivery Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please leave package at front security desk. Include happy anniversary note!"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                  />
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-cocoa hover:text-ink px-3 py-2"
                  >
                    ← Back to Review
                  </button>
                  <button
                    type="button"
                    disabled={!customerInfo.fullName || !customerInfo.phone || !customerInfo.email}
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3.5 rounded-xl bg-dustyRose hover:bg-dustyRose/90 disabled:opacity-50 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all"
                  >
                    <span>Proceed to Address & Map</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ADDRESS + MAPLIBRE PINPOINT */}
          {currentStep === 3 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div>
                  <h2 className="font-display font-bold text-xl text-ink">Step 3: Delivery Address & Map</h2>
                  <p className="text-xs text-cocoa/75">Pin your exact delivery location on MapLibre vector map.</p>
                </div>

                {/* Explicit Browser Geolocation Request Button */}
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blush/60 hover:bg-blush text-cocoa text-xs font-semibold transition-colors border border-dustyRose/30"
                >
                  <MapPin className="w-3.5 h-3.5 text-dustyRose" />
                  <span>{locating ? 'Detecting...' : 'Use My Location'}</span>
                </button>
              </div>

              {locationStatus && (
                <div className="p-3 rounded-xl bg-cream text-xs text-cocoa border border-border/80">
                  {locationStatus}
                </div>
              )}

              {/* MapLibre Interactive Map View */}
              <div className="space-y-1">
                <span className="block text-[11px] font-semibold text-cocoa/70">
                  Interactive Pin Location (Draggable)
                </span>
                <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-border/80 bg-cream/40 shadow-inner">
                  <div ref={mapContainer} className="w-full h-full" />
                </div>
              </div>

              {/* Address Form Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-cocoa mb-1">Street Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat / House No., Apartment, Street"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cocoa mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Pune"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cocoa mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="Maharashtra"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cocoa mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="411001"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm font-mono outline-none focus:border-dustyRose"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-cocoa hover:text-ink px-3 py-2"
                  >
                    ← Back to Contact
                  </button>
                  <button
                    type="button"
                    disabled={!address.addressLine1 || !address.city || !address.state || !address.postalCode}
                    onClick={() => setCurrentStep(4)}
                    className="px-8 py-3.5 rounded-xl bg-dustyRose hover:bg-dustyRose/90 disabled:opacity-50 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT METHOD & FINAL AUTHORIZATION */}
          {currentStep === 4 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-6">
              <div className="border-b border-border/60 pb-3">
                <h2 className="font-display font-bold text-xl text-ink">Step 4: Select Payment Rail</h2>
                <p className="text-xs text-cocoa/75">Choose between zero-fee direct UPI with WhatsApp code or Stripe card.</p>
              </div>

              <div className="space-y-3">
                {/* Manual UPI Rail */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-colors ${
                    paymentMethod === 'upi_manual'
                      ? 'border-dustyRose bg-blush/10'
                      : 'border-border/80 hover:border-dustyRose/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi_manual"
                    checked={paymentMethod === 'upi_manual'}
                    onChange={() => setPaymentMethod('upi_manual')}
                    className="mt-1 text-dustyRose focus:ring-dustyRose"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-ink">Manual UPI QR & WhatsApp Verification</span>
                      <span className="text-[10px] font-bold bg-sage/30 text-cocoa px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-cocoa/80 leading-relaxed">
                      Zero convenience fees. Generates a secure 6-digit confirmation code. Admin verifies directly in banking app.
                    </p>
                  </div>
                </label>

                {/* Stripe Rail */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-colors ${
                    paymentMethod === 'stripe'
                      ? 'border-dustyRose bg-blush/10'
                      : 'border-border/80 hover:border-dustyRose/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    className="mt-1 text-dustyRose focus:ring-dustyRose"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-cocoa" />
                      <span className="font-semibold text-sm text-ink">Credit / Debit Card (Stripe PCI)</span>
                    </div>
                    <p className="text-xs text-cocoa/80 leading-relaxed">
                      Instant card settlement supporting Visa, Mastercard, RuPay, and American Express.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-semibold text-cocoa hover:text-ink px-3 py-2"
                >
                  ← Back to Address
                </button>
                <button
                  type="button"
                  onClick={handleFinalOrder}
                  className="px-8 py-4 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Demo Order ({formatINR(grandTotalPaise)})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Order Summary */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-sm space-y-6 sticky top-24">
            <h3 className="font-display font-bold text-lg text-ink">Order Summary</h3>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-xs text-cocoa py-1 border-b border-border/40">
                  <span className="font-medium text-ink">
                    {quantity}x {product.name}
                  </span>
                  <span className="font-mono font-bold text-ink">
                    {formatINR(product.pricePaise * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60 text-sm text-cocoa/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-ink">{formatINR(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Artisan Shipping</span>
                <span className="font-mono font-bold text-ink">
                  {isFreeShipping ? 'FREE' : formatINR(shippingPaise)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-border font-bold text-base text-ink">
                <span>Grand Total</span>
                <span className="font-mono text-2xl text-ink">{formatINR(grandTotalPaise)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream/60 border border-border/70 space-y-1.5 text-xs text-cocoa/80">
              <div className="flex items-center gap-1.5 font-semibold text-ink">
                <Truck className="w-3.5 h-3.5 text-dustyRose" />
                <span>Handmade Delivery Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Handcrafted with care in small batches. Free shipping applied on orders exceeding ₹999.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
