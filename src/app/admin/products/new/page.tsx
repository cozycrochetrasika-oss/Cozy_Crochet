'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { useProductsStore } from '@/store/products-store';
import type { Product, MediaItem } from '@/data/products';

export default function AdminNewProductPage() {
  const router = useRouter();
  const addProduct = useProductsStore((s) => s.addProduct);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Flowers',
    shortDescription: '',
    description: '',
    pricePaise: 49900,
    inventoryQty: 10,
    featured: false,
    bestSeller: false,
    imageUrl: '/products/Sunflower/main.png',
  });

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `prod_${Date.now()}`;
    const media: MediaItem[] = [
      {
        id: `${id}-main`,
        mediaType: 'image',
        slot: 'main',
        filename: formData.imageUrl.split('/').pop() || 'main.png',
        relativePath: formData.imageUrl.replace(/^\/products\//, ''),
        publicUrl: formData.imageUrl,
        altText: `${formData.name} - Main view`,
        sortOrder: 1,
      },
    ];

    const newProd: Product = {
      id,
      slug: formData.slug || `product-${Date.now()}`,
      folderName: formData.category,
      name: formData.name,
      category: formData.category,
      shortDescription: formData.shortDescription,
      description: formData.description,
      pricePaise: Number(formData.pricePaise),
      inventoryQty: Number(formData.inventoryQty),
      rating: 5.0,
      reviewCount: 1,
      soldCount: 0,
      active: true,
      featured: formData.featured,
      bestSeller: formData.bestSeller,
      media,
    };

    addProduct(newProd);
    setSaved(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs text-cocoa hover:text-dustyRose mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink">Add New Handcrafted Product</h1>
        <p className="text-xs text-cocoa/75">Create a new item line and specify pricing in integer paise.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">Product Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Crochet Daisy Stem"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">URL Slug</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm font-mono outline-none focus:border-dustyRose"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
            >
              <option value="Flowers">Flowers</option>
              <option value="Bouquets">Bouquets</option>
              <option value="Bags">Bags</option>
              <option value="Accessories">Accessories</option>
              <option value="Keyrings">Keyrings</option>
              <option value="Footwear">Footwear</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">
              Price in Paise (e.g. 49900 = ₹499.00) *
            </label>
            <input
              type="number"
              required
              value={formData.pricePaise}
              onChange={(e) => setFormData({ ...formData, pricePaise: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm font-mono outline-none focus:border-dustyRose"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">
              Inventory Stock Ready *
            </label>
            <input
              type="number"
              required
              value={formData.inventoryQty}
              onChange={(e) => setFormData({ ...formData, inventoryQty: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm font-mono outline-none focus:border-dustyRose"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">Short Teaser Description</label>
          <input
            type="text"
            required
            placeholder="Single-line summary for cards and search..."
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">Detailed Description</label>
          <textarea
            rows={4}
            required
            placeholder="Artisan crafting technique, fiber specifications, dimensions..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">Product Showcase Image</label>
          <select
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
          >
            <option value="/products/Sunflower/main.png">Sunflower Main (/products/Sunflower/main.png)</option>
            <option value="/products/Rose/main.png">Rose Main (/products/Rose/main.png)</option>
            <option value="/products/Bag/main.png">Bag Main (/products/Bag/main.png)</option>
            <option value="/products/Boque/main.png">Bouquet Main (/products/Boque/main.png)</option>
            <option value="/products/HeadBands/main.jpeg">Headbands Main (/products/HeadBands/main.jpeg)</option>
            <option value="/products/Key_Ring/main.png">Keyring Main (/products/Key_Ring/main.png)</option>
            <option value="/products/Kid_Shoe/main.jpeg">Kid Shoes Main (/products/Kid_Shoe/main.jpeg)</option>
          </select>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Product successfully saved and added to live catalog! Redirecting...</span>
          </div>
        )}

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-cocoa">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded text-dustyRose"
            />
            <span>Feature on Homepage</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-cocoa">
            <input
              type="checkbox"
              checked={formData.bestSeller}
              onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
              className="rounded text-dustyRose"
            />
            <span>Mark as Best Seller</span>
          </label>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-xs font-semibold text-cocoa hover:text-ink rounded-lg"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Product</span>
          </button>
        </div>
      </form>
    </div>
  );
}
