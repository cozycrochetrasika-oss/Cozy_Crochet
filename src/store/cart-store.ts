'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => { success: boolean; addedCount: number; message: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; clampedQuantity: number };
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPaise: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const inventory = product.inventoryQty;
        if (inventory <= 0) {
          return { success: false, addedCount: 0, message: 'Item is currently out of stock.' };
        }

        let actualAdded = 0;
        let success = true;
        let message = 'Item added to shopping bag.';

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.product.id === product.id);
          if (existingIndex > -1) {
            const currentQty = state.items[existingIndex].quantity;
            const newTotalQty = Math.min(inventory, currentQty + quantity);
            actualAdded = newTotalQty - currentQty;

            if (actualAdded <= 0) {
              success = false;
              message = `Cannot add more. Inventory limit of ${inventory} reached.`;
              return state;
            }

            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: newTotalQty,
            };
            return { items: updated };
          } else {
            const clampedQty = Math.min(inventory, Math.max(1, quantity));
            actualAdded = clampedQty;
            return { items: [...state.items, { product, quantity: clampedQty }] };
          }
        });

        return { success, addedCount: actualAdded, message };
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return { success: true, clampedQuantity: 0 };
        }

        let clamped = quantity;
        set((state) => {
          const item = state.items.find((i) => i.product.id === productId);
          if (!item) return state;

          clamped = Math.min(item.product.inventoryQty, Math.max(1, quantity));
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity: clamped } : i
            ),
          };
        });

        return { success: true, clampedQuantity: clamped };
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPaise: () => {
        return get().items.reduce(
          (total, item) => total + item.product.pricePaise * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cozy-crochets-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
