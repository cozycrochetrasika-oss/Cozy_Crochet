'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Edit3, Trash2, Check, X } from 'lucide-react';
import { getAllProducts, formatINR } from '@/data/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(getAllProducts());

  const toggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Product Catalog Management</h1>
          <p className="text-xs text-cocoa/75">Manage active products, price overrides (in paise), and inventory.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 rounded-xl bg-dustyRose hover:bg-dustyRose/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Product</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-cream/70 text-cocoa font-semibold uppercase tracking-wider border-y border-border">
            <tr>
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price (Paise / INR)</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Sold</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {products.map((p) => {
              const mainMedia = p.media.find((m) => m.slot === 'main') || p.media[0];
              return (
                <tr key={p.id} className="hover:bg-cream/20">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                        {mainMedia && (
                          <Image src={mainMedia.publicUrl} alt={p.name} fill className="object-cover" sizes="50px" />
                        )}
                      </div>
                      <div>
                        <span className="font-display font-bold text-sm text-ink block">{p.name}</span>
                        <span className="text-[10px] text-cocoa/60 font-mono">slug: {p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-cocoa">{p.category}</td>
                  <td className="py-3 px-4 font-mono font-bold text-ink">
                    {formatINR(p.pricePaise)} ({p.pricePaise} paise)
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-cocoa">{p.inventoryQty}</td>
                  <td className="py-3 px-4 font-mono text-sage font-semibold">{p.soldCount}</td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => toggleActive(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        p.active ? 'bg-sage/20 text-cocoa' : 'bg-danger/20 text-danger'
                      }`}
                    >
                      {p.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{p.active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 rounded-lg hover:bg-cream text-cocoa hover:text-dustyRose transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
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
