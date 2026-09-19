'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaItem } from '@/data/products';

export function ProductLightbox({
  media,
  currentIndex,
  onClose,
  onNavigate,
  productName,
}: {
  media: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  productName: string;
}) {
  const currentItem = media[currentIndex] || media[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % media.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + media.length) % media.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, media.length, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Lightbox Container - Sized to ~80% of Viewport */}
      <div
        className="relative w-full max-w-5xl h-[80vh] bg-surface rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 bg-cream/30">
          <div>
            <h4 className="font-display font-bold text-base text-ink">{productName}</h4>
            <span className="text-xs text-cocoa/70">
              {currentIndex + 1} of {media.length} • {currentItem.slot.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-blush/20 text-cocoa hover:text-ink transition-colors"
              title="Minimize (Esc)"
              aria-label="Minimize lightbox"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-blush/20 text-cocoa hover:text-ink transition-colors"
              title="Close (Esc)"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Canvas Stage */}
        <div className="relative flex-grow flex items-center justify-center bg-cream/20 p-4 overflow-hidden">
          {currentItem.mediaType === 'video' ? (
            <video
              src={currentItem.publicUrl}
              autoPlay
              controls
              playsInline
              loop
              className="max-h-full max-w-full rounded-xl object-contain shadow-md"
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={currentItem.publicUrl}
                alt={currentItem.altText}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1280px) 90vw, 1200px"
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onNavigate((currentIndex - 1 + media.length) % media.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-cream/90 text-cocoa hover:text-ink hover:bg-cream flex items-center justify-center shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate((currentIndex + 1) % media.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-cream/90 text-cocoa hover:text-ink hover:bg-cream flex items-center justify-center shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
