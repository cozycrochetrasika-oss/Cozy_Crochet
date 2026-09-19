'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { getAllProducts } from '@/data/products';
import { ProductCard } from '@/components/product/product-card';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const allProducts = getAllProducts();

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProducts;

    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [allProducts, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink">
          Search Handcrafted Creations
        </h1>
        <p className="text-sm text-cocoa/75">
          Find your dream bouquet, rose stem, bag, baby booties, or keychain.
        </p>

        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search by flower, accessory, color, or style..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border/80 bg-surface shadow-sm focus:border-dustyRose focus:ring-2 focus:ring-dustyRose/20 outline-none text-base text-ink"
            autoFocus
          />
          <Search className="w-5 h-5 text-cocoa/60 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-cocoa/70 border-b border-border pb-3">
        <span>
          Showing {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'}
          {query ? ` for "${query}"` : ''}
        </span>
      </div>

      {/* Results Grid */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-3xl border border-border space-y-3">
          <Sparkles className="w-8 h-8 text-dustyRose mx-auto" />
          <h3 className="font-display font-bold text-xl text-ink">No matching creations found</h3>
          <p className="text-sm text-cocoa max-w-sm mx-auto">
            Can&apos;t find what you are looking for? Our artisans can crochet custom designs to order.
          </p>
        </div>
      )}
    </div>
  );
}
