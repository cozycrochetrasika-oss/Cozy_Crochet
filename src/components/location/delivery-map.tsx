'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface HubMarker {
  name: string;
  coords: [number, number]; // [lng, lat]
  type: 'workshop' | 'hub';
  transitDays: string;
}

const ARTISAN_HUBS: HubMarker[] = [
  { name: 'Pune (Main Artisan Studio)', coords: [73.8567, 18.5204], type: 'workshop', transitDays: '1-2 Days' },
  { name: 'Mumbai Fulfillment', coords: [72.8777, 19.0760], type: 'hub', transitDays: '1-2 Days' },
  { name: 'Bangalore Hub', coords: [77.5946, 12.9716], type: 'hub', transitDays: '2-3 Days' },
  { name: 'Delhi NCR Hub', coords: [77.1025, 28.7041], type: 'hub', transitDays: '2-3 Days' },
  { name: 'Chennai Hub', coords: [80.2707, 13.0827], type: 'hub', transitDays: '3-4 Days' },
];

export function DeliveryMap({ selectedPincode }: { selectedPincode: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      const tileUrl = process.env.NEXT_PUBLIC_MAPLIBRE_TILE_URL || 'https://demotiles.maplibre.org/style.json';

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: tileUrl,
        center: [78.9629, 20.5937], // Center of India
        zoom: 3.8,
        attributionControl: false,
      });

      map.on('load', () => {
        setMapLoaded(true);

        // Add markers for artisan hubs
        ARTISAN_HUBS.forEach((hub) => {
          const el = document.createElement('div');
          el.className = 'w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md cursor-pointer transition-transform hover:scale-110';
          if (hub.type === 'workshop') {
            el.style.backgroundColor = '#DFA7AD'; // Dusty Rose
            el.style.color = '#FFFFFF';
            el.innerHTML = '🧶';
          } else {
            el.style.backgroundColor = '#B8D1BF'; // Sage
            el.style.color = '#241D1A';
            el.innerHTML = '📦';
          }

          const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: sans-serif; padding: 4px;">
              <strong style="color: #241D1A; font-size: 12px; display: block;">${hub.name}</strong>
              <span style="color: #493630; font-size: 11px;">Handmade Dispatch Transit: <strong>${hub.transitDays}</strong></span>
            </div>
          `);

          new maplibregl.Marker({ element: el })
            .setLngLat(hub.coords)
            .setPopup(popup)
            .addTo(map);
        });
      });

      map.on('error', () => {
        // Fallback gracefully without breaking UI if tiles are blocked by network
        setMapError(true);
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.warn('MapLibre init error:', err);
      setMapError(true);
    }
  }, []);

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-border/80 bg-cream/40 shadow-inner">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Overlay Information Chip */}
      <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/60 shadow-sm text-xs text-cocoa flex items-center gap-2 pointer-events-none z-10">
        <span className="w-2 h-2 rounded-full bg-sage animate-ping" />
        <span>Nationwide Artisan Delivery Active</span>
      </div>

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream/80 p-4 text-center text-xs text-cocoa">
          <span>Artisan shipping network active across all Indian postal zones. Standard delivery: 3–5 business days.</span>
        </div>
      )}
    </div>
  );
}
