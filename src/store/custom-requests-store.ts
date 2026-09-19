'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CustomRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  colors: string;
  size: string;
  quantity: number;
  desiredDate: string;
  budgetRange: string;
  description: string;
  contactMethod: 'WhatsApp' | 'Instagram' | 'Email' | 'Phone';
  status: 'submitted' | 'under_review' | 'quoted' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

interface CustomRequestsState {
  requests: CustomRequest[];
  addRequest: (req: Omit<CustomRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateStatus: (id: string, status: CustomRequest['status']) => void;
}

export const useCustomRequestsStore = create<CustomRequestsState>()(
  persist(
    (set) => ({
      requests: [
        {
          id: 'req_seed_1',
          name: 'Kavita Menon',
          phone: '+91 98201 12345',
          email: 'kavita.m@example.com',
          category: 'Bouquet',
          colors: 'Dusty Rose, Blush Pink & Eucalyptus Sage',
          size: 'Standard Bridal Bouquet (10 inch diameter)',
          quantity: 1,
          desiredDate: '2026-11-15',
          budgetRange: '₹5,000 - ₹10,000',
          description: 'Need a matching bridal bouquet with delicate crochet roses and peonies.',
          contactMethod: 'WhatsApp',
          status: 'under_review',
          createdAt: 'Sep 19, 2026',
        },
        {
          id: 'req_seed_2',
          name: 'Simran Walia',
          phone: '+91 98111 54321',
          email: 'simran.w@example.com',
          category: 'Shoes',
          colors: 'Warm Ivory & Soft Lavender',
          size: '0-3 Months Booties',
          quantity: 2,
          desiredDate: '2026-10-01',
          budgetRange: '₹2,500 - ₹5,000',
          description: 'Organic baby booties with matching heirloom lace border for baby shower.',
          contactMethod: 'Phone',
          status: 'quoted',
          createdAt: 'Sep 18, 2026',
        },
      ],

      addRequest: (req) => {
        const newReq: CustomRequest = {
          ...req,
          id: `req_${Date.now()}`,
          status: 'submitted',
          createdAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        };
        set((state) => ({ requests: [newReq, ...state.requests] }));
      },

      updateStatus: (id, status) => {
        set((state) => ({
          requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)),
        }));
      },
    }),
    {
      name: 'cozy-crochets-custom-requests',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
