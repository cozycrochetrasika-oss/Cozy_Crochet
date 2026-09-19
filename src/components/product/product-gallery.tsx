'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaItem } from '@/data/products';
import { ProductLightbox } from './product-lightbox';

export function ProductGallery({
  media,
  productName,
}: {
  media: MediaItem[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const activeMedia = media[selectedIndex] || media[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Display Stage */}
      <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-cream/40 border border-border/80 shadow-sm group">
        {activeMedia?.mediaType === 'video' ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <video
              src={activeMedia.publicUrl}
              poster={activeMedia.posterUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {/* Video Controls overlay */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-black/60 text-white backdrop-blur-sm">
                Showcase Video
              </span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={activeMedia?.publicUrl || '/products/Bag/main.png'}
              alt={activeMedia?.altText || productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            />
          </div>
        )}

        {/* Previous / Next Arrow Controls */}
        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-cocoa hover:text-ink flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-cocoa hover:text-ink flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream/90 backdrop-blur-sm text-cocoa hover:text-dustyRose flex items-center justify-center shadow-sm opacity-90 hover:opacity-100 transition-opacity z-10"
          aria-label="Enlarge media in 80% lightbox"
          title="Maximize (80% Viewport)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Slot Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-cream/90 text-cocoa backdrop-blur-sm border border-border/40">
            {activeMedia?.slot === 'main'
              ? 'Hero View'
              : activeMedia?.slot === 'video'
              ? 'Video'
              : activeMedia?.slot === 'single'
              ? 'Single Piece'
              : activeMedia?.slot === 'bundle'
              ? 'Bundle Set'
              : 'Detail View'}
          </span>
        </div>
      </div>

      {/* Horizontal Thumbnail Strip */}
      {media.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
          {media.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-18 h-22 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-dustyRose ring-2 ring-dustyRose/30 scale-105'
                    : 'border-border/60 hover:border-dustyRose/60 opacity-75 hover:opacity-100'
                }`}
                aria-label={`Select media item ${idx + 1}`}
              >
                {item.mediaType === 'video' ? (
                  <div className="relative w-full h-full bg-cocoa flex items-center justify-center">
                    {item.posterUrl && (
                      <Image
                        src={item.posterUrl}
                        alt="Video poster thumbnail"
                        fill
                        className="object-cover opacity-60"
                        sizes="80px"
                      />
                    )}
                    <Play className="w-5 h-5 text-white z-10 fill-white" />
                  </div>
                ) : (
                  <Image
                    src={item.publicUrl}
                    alt={item.altText}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <ProductLightbox
          media={media}
          currentIndex={selectedIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(index) => setSelectedIndex(index)}
          productName={productName}
        />
      )}
    </div>
  );
}
