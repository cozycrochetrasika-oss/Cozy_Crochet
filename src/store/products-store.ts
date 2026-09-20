'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PRODUCTS, type Product } from '@/data/products';

interface ProductsState {
  products: Product[];
  getAllProducts: () => Product[];
  getActiveProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  resetToDefault: () => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,

      getAllProducts: () => get().products,

      getActiveProducts: () => get().products.filter((p) => p.active),

      getFeaturedProducts: () => get().products.filter((p) => p.active && p.featured),

      getProductBySlug: (slug: string) =>
        get().products.find((p) => p.slug === slug && p.active),

      getProductById: (id: string) => get().products.find((p) => p.id === id),

      updateProduct: (id: string, updates: Partial<Product>) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      addProduct: (newProd: Product) => {
        set((state) => ({
          products: [newProd, ...state.products],
        }));
      },

      deleteProduct: (id: string) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      toggleProductActive: (id: string) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, active: !p.active } : p
          ),
        }));
      },

      resetToDefault: () => {
        set({ products: PRODUCTS });
      },
    }),
    {
      name: 'cozy-crochets-products-catalog',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
