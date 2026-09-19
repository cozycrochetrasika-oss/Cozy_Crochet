// Centralized Real Business Contact & Communications Configuration
// For Cozy_Crochets by Rasika

export const BUSINESS_CONFIG = {
  name: 'Cozy_Crochets',
  tagline: 'Handmade with yarn. Made with love.',
  founder: 'Rasika',
  
  // Real Business & Customer Service Communications
  email: 'cozycrochetrasika@gmail.com',
  adminEmail: 'cozycrochetrasika@gmail.com',

  // Phone Numbers
  primaryPhone: '+91 60009 89651',
  primaryPhoneNormalized: '+916000989651',
  primaryPhoneDigits: '916000989651',

  alternatePhone: '+91 60030 16159',
  alternatePhoneNormalized: '+916003016159',
  alternatePhoneDigits: '916003016159',

  // Social Channels
  instagramUrl: 'https://www.instagram.com/cozystitches_byrasika?stkn=MWpuM2hwYzQyZmZ4Yg==',
  instagramHandle: '@cozystitches_byrasika',

  // Banking / UPI
  upiId: 'cozycrochets@upi',
} as const;

/**
 * Generates a clean, compliant wa.me link with encoded message
 */
export function getWhatsAppUrl(
  phoneDigits: string = BUSINESS_CONFIG.primaryPhoneDigits,
  message?: string
): string {
  const base = `https://wa.me/${phoneDigits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Pre-formatted message helpers */
export function getGeneralWhatsAppInquiryUrl(): string {
  return getWhatsAppUrl(
    BUSINESS_CONFIG.primaryPhoneDigits,
    "Hi Cozy Crochets, I'm interested in a crochet item."
  );
}

export function getProductWhatsAppInquiryUrl(productName: string, pricePaise: number): string {
  const priceRupees = (pricePaise / 100).toLocaleString('en-IN');
  return getWhatsAppUrl(
    BUSINESS_CONFIG.primaryPhoneDigits,
    `Hello Cozy_Crochets! 🧶 I am interested in ordering "${productName}" (Price: ₹${priceRupees}). Could you tell me more about customization options and delivery timelines?`
  );
}

export function getCustomOrderWhatsAppUrl(): string {
  return getWhatsAppUrl(
    BUSINESS_CONFIG.primaryPhoneDigits,
    "Hi Cozy Crochets, I'd like to discuss a custom crochet order."
  );
}

export function getPaymentAssistanceWhatsAppUrl(orderNumber: string): string {
  return getWhatsAppUrl(
    BUSINESS_CONFIG.primaryPhoneDigits,
    `Hi Cozy Crochets, I have submitted payment for order #${orderNumber} and would like to share the transaction reference.`
  );
}

export function getAlternateWhatsAppUrl(): string {
  return getWhatsAppUrl(
    BUSINESS_CONFIG.alternatePhoneDigits,
    "Hi Cozy Crochets, contacting on the alternate support number."
  );
}

export function getMailtoUrl(subject?: string): string {
  if (!subject) return `mailto:${BUSINESS_CONFIG.email}`;
  return `mailto:${BUSINESS_CONFIG.email}?subject=${encodeURIComponent(subject)}`;
}

export function getTelUrl(phoneNormalized: string = BUSINESS_CONFIG.primaryPhoneNormalized): string {
  return `tel:${phoneNormalized}`;
}
