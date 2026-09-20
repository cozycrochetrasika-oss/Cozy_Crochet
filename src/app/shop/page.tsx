'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/product-card';
import { getAllProducts } from '@/data/products';
import { useProductsStore } from '@/store/products-store';
import { Sparkles } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [mounted, setMounted] = useState(false);

  const storeProducts = useProductsStore((s) => s.products);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allProducts = useMemo(() => {
    if (mounted && storeProducts && storeProducts.length > 0) {
      return storeProducts.filter((p) => p.active);
    }
    return getAllProducts();
  }, [mounted, storeProducts]);
  const categories = ['All', 'Flowers', 'Bouquets', 'Bags', 'Accessories', 'Keyrings', 'Footwear'];

  const filteredProducts = useMemo(() => {
    let result = allProducts;
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.pricePaise - b.pricePaise);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.pricePaise - a.pricePaise);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [allProducts, selectedCategory, sortBy]);

  return (
    <div className="space-y-10">
      {/* Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border/80 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-dustyRose text-white shadow-sm'
                  : 'bg-cream text-cocoa hover:bg-blush/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label htmlFor="sort-select" className="text-xs font-semibold text-cocoa">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-border bg-cream text-xs font-medium text-ink outline-none focus:border-dustyRose"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-3xl border border-border space-y-3">
          <Sparkles className="w-8 h-8 text-dustyRose mx-auto" />
          <h3 className="font-display font-bold text-xl text-ink">No items in this category yet</h3>
          <p className="text-sm text-cocoa">Try choosing another category or submitting a bespoke request.</p>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-dustyRose">
          Handcrafted In India
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink">
          The Artisan Collection
        </h1>
        <p className="text-sm sm:text-base text-cocoa/80">
          Pure organic milk cotton, shaped into everlasting botanical blossoms, cozy wearables, and vintage keepsakes.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="w-full py-16 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-dustyRose/30 border-t-dustyRose animate-spin" />
          </div>
        }
      >
        <ShopContent />
      </Suspense>
    </div>
  );
}
