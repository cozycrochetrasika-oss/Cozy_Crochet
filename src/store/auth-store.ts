'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/data/products';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
}

export interface PendingCartIntent {
  product: Product;
  quantity: number;
  returnUrl?: string;
  timestamp: number;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  pendingIntent: PendingCartIntent | null;
  loginAsCustomer: (email?: string, name?: string) => void;
  loginAsAdmin: (email?: string, name?: string) => void;
  logout: () => void;
  setPendingIntent: (intent: { product: Product; quantity: number; returnUrl?: string }) => void;
  clearPendingIntent: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Default to null (unauthenticated visitor)
      user: null,
      isAuthenticated: false,
      pendingIntent: null,

      loginAsCustomer: (email = 'patron@example.com', name = 'Aarti Deshmukh') => {
        set({
          user: {
            id: 'cust_demo_01',
            email,
            fullName: name,
            role: 'customer',
          },
          isAuthenticated: true,
        });
      },

      loginAsAdmin: (email = 'admin@cozycrochets.com', name = 'Store Owner') => {
        set({
          user: {
            id: 'admin_demo_01',
            email,
            fullName: name,
            role: 'admin',
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          pendingIntent: null,
        });
      },

      setPendingIntent: ({ product, quantity, returnUrl }) => {
        set({
          pendingIntent: {
            product,
            quantity,
            returnUrl,
            timestamp: Date.now(),
          },
        });
      },

      clearPendingIntent: () => {
        set({ pendingIntent: null });
      },
    }),
    {
      name: 'cozy-crochets-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
