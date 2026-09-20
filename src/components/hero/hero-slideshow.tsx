'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Star, ArrowUpRight, Play, Image as ImageIcon } from 'lucide-react';

interface Slide {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: string;
  badge: string;
  badgeColor: string;
  image: string;
  video: string;
  slug: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    name: 'Crochet Sunflower',
    category: 'Botanical & Flora',
    price: '₹799',
    rating: '4.9',
    badge: 'Solar Glow Edition',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    image: '/products/Sunflower/main.png',
    video: '/products/Sunflower/Video.mp4',
    slug: 'crochet-sunflower',
  },
  {
    id: '2',
    name: 'Crochet Bouquet',
    category: 'Botanical & Flora',
    price: '₹2,499',
    rating: '5.0',
    badge: 'Heirloom Everlasting',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    image: '/products/Boque/main.png',
    video: '/products/Boque/Video.mp4',
    slug: 'crochet-bouquet',
  },
  {
    id: '3',
    name: 'Artisan Crochet Bag',
    category: 'Wearables & Bags',
    price: '₹1,499',
    rating: '4.8',
    badge: 'Reinforced Organic Cotton',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    image: '/products/Bag/main.png',
    video: '/products/Bag/Video.mp4',
    slug: 'crochet-bag',
  },
  {
    id: '4',
    name: 'Crochet Kid Booties',
    category: 'Baby & Kids',
    price: '₹899',
    rating: '4.9',
    badge: 'Ultra-Soft Milk Yarn',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    image: '/products/Kid_Shoe/main.jpeg',
    video: '/products/Kid_Shoe/Video.mp4',
    slug: 'crochet-kid-shoes',
  },
  {
    id: '5',
    name: 'Crimson Crochet Rose',
    category: 'Botanical & Flora',
    price: '₹599',
    rating: '4.9',
    badge: 'Individual Stem Craft',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    image: '/products/Rose/main.png',
    video: '/products/Rose/Video.mp4',
    slug: 'crochet-rose',
  },
  {
    id: '6',
    name: 'Pastel Headband Set',
    category: 'Accessories',
    price: '₹699',
    rating: '4.8',
    badge: 'Flexible Heirloom Weave',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    image: '/products/HeadBands/main.jpeg',
    video: '/products/HeadBands/Video.mp4',
    slug: 'crochet-headbands',
  },
];

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [viewMode, setViewMode] = useState<'image' | 'video'>('image');

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const current = SLIDES[currentIndex];

  return (
    <div
      className="relative w-full max-w-lg mx-auto lg:max-w-none h-full flex flex-col justify-center items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Ambient Floating Yarn Particles (Pure CSS / Lightweight) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-6 -left-6 w-48 h-48 rounded-full bg-blue-100/50 blur-3xl animate-pulse" />
        <div className="absolute -bottom-6 -right-6 w-56 h-56 rounded-full bg-sky-100/60 blur-3xl" />
        
        {/* Animated motes */}
        <span className="absolute top-1/4 left-1/12 w-2 h-2 rounded-full bg-blue-400/40 animate-bounce delay-100" />
        <span className="absolute bottom-1/3 right-1/12 w-2.5 h-2.5 rounded-full bg-sky-300/50 animate-ping delay-500" />
        <span className="absolute top-2/3 left-1/6 w-1.5 h-1.5 rounded-full bg-indigo-300/40 animate-pulse delay-700" />
      </div>

      {/* Main Slideshow Card */}
      <div className="relative w-full aspect-square max-w-[380px] sm:max-w-[440px] lg:max-w-[480px] rounded-3xl bg-white/90 backdrop-blur-sm border border-blue-100 shadow-xl shadow-blue-500/5 p-4 sm:p-5 flex flex-col justify-between">
        
        {/* Top Badges & Media Toggle */}
        <div className="flex items-center justify-between z-20 gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border shadow-2xs ${current.badgeColor}`}>
            <Sparkles className="w-3 h-3" />
            <span>{current.badge}</span>
          </span>

          <div className="flex items-center gap-2">
            {/* Mode Toggle: Photos vs Video */}
            <div className="flex items-center gap-1 bg-blue-50/80 p-0.5 rounded-full border border-blue-200/60 text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode('image')}
                className={`px-2.5 py-0.5 rounded-full font-semibold transition-all ${
                  viewMode === 'image'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Slides
              </button>
              <button
                type="button"
                onClick={() => setViewMode('video')}
                className={`px-2 py-0.5 rounded-full font-semibold transition-all flex items-center gap-1 ${
                  viewMode === 'video'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Video</span>
              </button>
            </div>

            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 border border-blue-100 text-ink text-xs font-semibold shadow-2xs">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{current.rating}</span>
            </div>
          </div>
        </div>

        {/* Media Stage (Photos Slideshow or Video Reel) */}
        <div className="relative flex-1 my-3 overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50/40 to-white flex items-center justify-center min-h-[260px]">
          {viewMode === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center p-1">
              <video
                key={current.video}
                src={current.video}
                poster={current.image}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-xl shadow-inner max-h-[320px]"
              />
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                initial={{ opacity: 0, scale: 0.95, x: direction * 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: direction * -40 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 p-4 sm:p-6 flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    priority={currentIndex === 0}
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 420px, 460px"
                    className="object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Navigation Controls */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-ink hover:text-blue-600 border border-blue-100 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-ink hover:text-blue-600 border border-blue-100 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Slide Info & Quick Link */}
        <div className="flex items-center justify-between pt-2 border-t border-blue-50 z-20">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block">
              {current.category}
            </span>
            <span className="font-display font-bold text-base sm:text-lg text-ink block leading-tight">
              {current.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-display font-extrabold text-base sm:text-lg text-ink">
              {current.price}
            </span>
            <Link
              href={`/product/${current.slug}`}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 transition-all flex items-center justify-center group"
              title="View Product Details"
            >
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Dots / Indicator Pills */}
      <div className="flex items-center justify-center gap-1.5 mt-4 z-20">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}: ${slide.name}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-6 bg-blue-600'
                : 'w-2 bg-blue-200 hover:bg-blue-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
