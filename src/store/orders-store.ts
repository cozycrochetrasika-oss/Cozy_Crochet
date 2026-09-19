'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { hashVerificationCode } from '@/lib/payments/security';

export type PaymentStatus = 'payment_pending' | 'payment_review' | 'paid' | 'refunded';
export type FulfilmentStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItemRecord {
  productId: string;
  name: string;
  quantity: number;
  pricePaise: number;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  addressLine1: string;
  state: string;
  postalCode: string;
  items: OrderItemRecord[];
  totalPaise: number;
  paymentProvider: 'upi_manual' | 'stripe';
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  verificationCodeHash?: string;
  rawCodeForDemo?: string; // stored for convenience in demo mode so admin can see what code to test
  verificationAttempts: number;
  createdAt: string;
}

interface OrdersState {
  orders: StoreOrder[];
  addOrder: (order: Omit<StoreOrder, 'id' | 'createdAt' | 'verificationAttempts'>) => Promise<string>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  updateFulfilmentStatus: (orderId: string, status: FulfilmentStatus) => void;
  recordVerificationAttempt: (orderId: string) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: 'ord_demo_1',
          orderNumber: 'CC-914820',
          customerName: 'Ananya Sharma',
          email: 'ananya@example.com',
          phone: '+91 98765 11223',
          city: 'Bangalore',
          addressLine1: '42, Lavelle Road',
          state: 'Karnataka',
          postalCode: '560001',
          items: [{ productId: 'boque_01', name: 'Crochet Bouquet', quantity: 1, pricePaise: 199900 }],
          totalPaise: 199900,
          paymentProvider: 'upi_manual',
          paymentStatus: 'payment_review',
          fulfilmentStatus: 'processing',
          rawCodeForDemo: '841920',
          verificationCodeHash: '9d343beee3a85b98f2f2beab7612c6a46cd20e0d0246a4bb013f9c62959828d9', // SHA-256 for 841920
          verificationAttempts: 0,
          createdAt: 'Sep 19, 2026',
        },
        {
          id: 'ord_demo_2',
          orderNumber: 'CC-882103',
          customerName: 'Rohan Mehta',
          email: 'rohan@example.com',
          phone: '+91 98200 44556',
          city: 'Mumbai',
          addressLine1: '12, Marine Drive',
          state: 'Maharashtra',
          postalCode: '400020',
          items: [{ productId: 'bag_01', name: 'Crochet Bag', quantity: 1, pricePaise: 149900 }],
          totalPaise: 149900,
          paymentProvider: 'stripe',
          paymentStatus: 'paid',
          fulfilmentStatus: 'shipped',
          verificationAttempts: 0,
          createdAt: 'Sep 18, 2026',
        },
      ],

      addOrder: async (orderData) => {
        const id = `ord_${Date.now()}`;
        const newOrder: StoreOrder = {
          ...orderData,
          id,
          verificationAttempts: 0,
          createdAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        };

        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return id;
      },

      updatePaymentStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o)),
        }));
      },

      updateFulfilmentStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, fulfilmentStatus: status } : o)),
        }));
      },

      recordVerificationAttempt: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, verificationAttempts: o.verificationAttempts + 1 } : o
          ),
        }));
      },
    }),
    {
      name: 'cozy-crochets-orders',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
