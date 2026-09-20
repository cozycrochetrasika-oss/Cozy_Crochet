'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Edit3, Trash2, Check, X, Sparkles } from 'lucide-react';
import { formatINR } from '@/data/products';
import { useProductsStore } from '@/store/products-store';

export default function AdminProductsPage() {
  const { products, toggleProductActive, deleteProduct } = useProductsStore();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Product Catalog Management</h1>
          <p className="text-xs text-text-secondary">
            Manage live products, pricing overrides, inventory stock, and availability.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-blue-50/50 text-ink font-semibold uppercase tracking-wider border-b border-blue-100">
            <tr>
              <th className="py-3.5 px-4">Item</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price (INR)</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Sold</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {products.map((p) => {
              const mainMedia = p.media.find((m) => m.slot === 'main') || p.media[0];
              return (
                <tr key={p.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-blue-50/50 border border-blue-100 flex-shrink-0">
                        {mainMedia && (
                          <Image src={mainMedia.publicUrl} alt={p.name} fill className="object-cover" sizes="60px" />
                        )}
                      </div>
                      <div>
                        <span className="font-display font-bold text-sm text-ink block">{p.name}</span>
                        <span className="text-[10px] text-text-secondary font-mono">slug: {p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-text-secondary">{p.category}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-ink">
                    {formatINR(p.pricePaise)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-ink">
                    <span className={p.inventoryQty <= 3 ? 'text-amber-600 font-bold' : ''}>
                      {p.inventoryQty} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-blue-600 font-semibold">{p.soldCount}</td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleProductActive(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                        p.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {p.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{p.active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-text-secondary hover:text-blue-600 transition-colors"
                        title="Edit Product Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-text-secondary hover:text-rose-600 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
