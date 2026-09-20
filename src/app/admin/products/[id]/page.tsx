'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import { useProductsStore } from '@/store/products-store';

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const { products, updateProduct } = useProductsStore();
  const product = products.find((p) => p.id === productId) || products[0];

  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    pricePaise: product?.pricePaise || 0,
    inventoryQty: product?.inventoryQty || 0,
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    active: product?.active ?? true,
    featured: product?.featured ?? false,
  });

  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        pricePaise: product.pricePaise,
        inventoryQty: product.inventoryQty,
        shortDescription: product.shortDescription,
        description: product.description,
        active: product.active,
        featured: product.featured,
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-text-secondary">Product not found.</p>
        <Link href="/admin/products" className="text-xs text-blue-600 font-semibold">
          ← Return to Products Catalog
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(product.id, formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      router.push('/admin/products');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Product details successfully updated in live store!</span>
        </div>
      )}

      <div className="pb-4 border-b border-blue-100">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink">Edit Product: {product.name}</h1>
        <span className="font-mono text-xs text-text-secondary">ID: {product.id}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-3xl bg-white border border-blue-100 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
            Product Title
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/20 text-ink text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/20 text-ink text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
              Price in Paise (e.g. 149900 = ₹1,499)
            </label>
            <input
              type="number"
              required
              value={formData.pricePaise}
              onChange={(e) => setFormData({ ...formData, pricePaise: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/20 text-ink text-sm font-mono outline-none focus:border-blue-500 transition-colors"
            />
            <span className="text-[11px] text-blue-600 font-mono mt-1 block">
              Storefront Price: ₹{(formData.pricePaise / 100).toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
              Stock Inventory (Units)
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.inventoryQty}
              onChange={(e) => setFormData({ ...formData, inventoryQty: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/20 text-ink text-sm font-mono outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
            Short Tagline / Teaser
          </label>
          <input
            type="text"
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/20 text-ink text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
            Full Craft Description
          </label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/20 text-ink text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600"
            />
            <span>Active on Storefront</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600"
            />
            <span>Featured Product</span>
          </label>
        </div>

        <div className="pt-4 border-t border-blue-50 flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-blue-200 text-xs font-semibold text-text-secondary hover:bg-blue-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save Product Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
