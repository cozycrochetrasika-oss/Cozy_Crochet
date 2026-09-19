'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SiteSettings {
  dailyCaption: string;
  festivalBannerActive: boolean;
  festivalMessage: string;
  storeWhatsapp: string;
  storeUpiId: string;
  storeEmail: string;
  freeShippingThresholdPaise: number;
  announcementDismissed: boolean;
}

interface SiteSettingsState extends SiteSettings {
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  dismissAnnouncement: () => void;
  resetAnnouncement: () => void;
}

export const useSiteSettingsStore = create<SiteSettingsState>()(
  persist(
    (set) => ({
      dailyCaption: 'Every loop carries care, warmth, and handmade magic.',
      festivalBannerActive: true,
      festivalMessage: 'Festival Season: Complimentary hand-wrapped gift packaging on all orders!',
      storeWhatsapp: '+919876543210',
      storeUpiId: 'cozycrochets@upi',
      storeEmail: 'hello@cozycrochets.com',
      freeShippingThresholdPaise: 99900,
      announcementDismissed: false,

      updateSettings: (newSettings) =>
        set((state) => ({ ...state, ...newSettings })),

      dismissAnnouncement: () =>
        set({ announcementDismissed: true }),

      resetAnnouncement: () =>
        set({ announcementDismissed: false }),
    }),
    {
      name: 'cozy-crochets-site-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
