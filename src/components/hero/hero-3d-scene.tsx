'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import the heavy R3F Canvas with ssr: false
const DynamicHeroCanvas = dynamic(
  () => import('./hero-canvas').then((mod) => mod.HeroCanvasInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-dustyRose/30 border-t-dustyRose animate-spin-slow" />
      </div>
    ),
  }
);

export function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setWebGlSupported(false);
      }
    } catch {
      setWebGlSupported(false);
    }

    // IntersectionObserver to pause rendering when offscreen
    if (containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
        motionQuery.removeEventListener('change', handleMotionChange);
      };
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Graceful Static Fallback for reduced motion or unsupported WebGL
  if (prefersReducedMotion || !webGlSupported) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full relative flex items-center justify-center p-6"
        aria-label="Handcrafted crochet bouquet showcase"
      >
        <div className="relative w-72 sm:w-96 aspect-square rounded-3xl overflow-hidden shadow-yarn border border-border/40">
          <Image
            src="/products/Boque/main.png"
            alt="Artisanal Crochet Bouquet Handcrafted with Love"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isInView && <DynamicHeroCanvas />}
    </div>
  );
}
