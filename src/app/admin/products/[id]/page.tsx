'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { getAllProducts } from '@/data/products';

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const products = getAllProducts();
  const product = products.find((p) => p.id === productId) || products[0];

  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    pricePaise: product.pricePaise,
    inventoryQty: product.inventoryQty,
    shortDescription: product.shortDescription,
    description: product.description,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Product details updated successfully!');
    router.push('/admin/products');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs text-cocoa hover:text-dustyRose mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink">Edit Product: {product.name}</h1>
        <span className="font-mono text-xs text-cocoa/70">ID: {product.id}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">Product Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">
              Price in Paise (e.g. 149900 = ₹1,499.00)
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
              Stock Units Ready
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
          <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">Short Description</label>
          <input
            type="text"
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-cocoa mb-1 uppercase tracking-wider">Full Description</label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream/30 text-sm outline-none focus:border-dustyRose"
          />
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
            <span>Update Product</span>
          </button>
        </div>
      </form>
    </div>
  );
}
