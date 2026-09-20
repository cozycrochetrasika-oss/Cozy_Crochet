'use client';

import { create } from 'zustand';
import { PRODUCTS, type Product } from '@/data/products';

interface ProductsState {
  products: Product[];
  loadedFromServer: boolean;
  isLoading: boolean;
  error: string | null;

  // Selectors
  getAllProducts: () => Product[];
  getActiveProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;

  // Server-Synchronized Actions
  fetchProducts: (includeAll?: boolean) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  addProduct: (product: Omit<Product, 'id'> | Product) => Promise<Product | null>;
  deleteProduct: (id: string, hard?: boolean) => Promise<boolean>;
  toggleProductActive: (id: string) => Promise<boolean>;
  resetToDefault: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: PRODUCTS,
  loadedFromServer: false,
  isLoading: false,
  error: null,

  getAllProducts: () => get().products,

  getActiveProducts: () => get().products.filter((p) => p.active),

  getFeaturedProducts: () => get().products.filter((p) => p.active && p.featured),

  getProductBySlug: (slug: string) =>
    get().products.find((p) => p.slug === slug && p.active),

  getProductById: (id: string) => get().products.find((p) => p.id === id),

  fetchProducts: async (includeAll = true) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/products${includeAll ? '?all=true' : ''}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          set({ products: data.products, loadedFromServer: true, isLoading: false });
          return;
        }
      }
      set({ isLoading: false });
    } catch (err: any) {
      console.error('[ProductsStore] Failed to fetch server products:', err);
      set({ isLoading: false, error: err.message });
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    // 1. Optimistic local update
    const previousProducts = get().products;
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));

    // 2. Persist to authoritative server repository
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        // Rollback on failure
        set({ products: previousProducts });
        return false;
      }
      const data = await res.json();
      if (data.success && data.product) {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? data.product : p)),
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('[ProductsStore] Server update failed, rolling back:', err);
      set({ products: previousProducts });
      return false;
    }
  },

  addProduct: async (newProd) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          set((state) => ({
            products: [data.product, ...state.products],
          }));
          return data.product;
        }
      }
      return null;
    } catch (err) {
      console.error('[ProductsStore] Failed to create product on server:', err);
      return null;
    }
  },

  deleteProduct: async (id: string, hard = false) => {
    const previousProducts = get().products;
    if (hard) {
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } else {
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? { ...p, active: false } : p)),
      }));
    }

    try {
      const res = await fetch(`/api/products/${id}${hard ? '?hard=true' : ''}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        set({ products: previousProducts });
        return false;
      }
      return true;
    } catch (err) {
      console.error('[ProductsStore] Failed to delete product on server:', err);
      set({ products: previousProducts });
      return false;
    }
  },

  toggleProductActive: async (id: string) => {
    const prod = get().products.find((p) => p.id === id);
    if (!prod) return false;
    return get().updateProduct(id, { active: !prod.active });
  },

  resetToDefault: () => {
    set({ products: PRODUCTS });
  },
}));
