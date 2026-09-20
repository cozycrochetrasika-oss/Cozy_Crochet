export type PaymentProviderType = 'stripe' | 'upi_manual' | 'whatsapp';

export interface PaymentInitiationPayload {
  orderId: string;
  orderNumber: string;
  amountPaise: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    pricePaise: number;
  }[];
}

export interface PaymentInitiationResult {
  provider: PaymentProviderType;
  success: boolean;
  paymentId?: string;
  clientSecret?: string; // For Stripe PaymentIntent
  upiIntentUrl?: string; // For UPI deep link
  upiQrData?: string;    // UPI payload for QR code
  whatsappUrl?: string;  // WhatsApp pre-formatted checkout link
  verificationCode?: string; // 6-digit confirmation code
  instructions?: string;
  error?: string;
}

export interface PaymentVerificationPayload {
  orderId: string;
  paymentId?: string;
  verificationCode?: string;
  adminNotes?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: 'verified' | 'pending_verification' | 'failed';
  message: string;
}

// Helper to generate cryptographically safe 6-digit verification code
export function generateVerificationCode(): string {
  const buffer = new Uint32Array(1);
  do { crypto.getRandomValues(buffer); } while (buffer[0] >= 4294800000);
  return String(100000 + buffer[0] % 900000);
}

// Generate UPI Intent URL
export function generateUpiIntentUrl(params: {
  upiId: string;
  payeeName: string;
  amountPaise: number;
  orderNumber: string;
}): string {
  const amountRupees = (params.amountPaise / 100).toFixed(2);
  const note = `Order ${params.orderNumber} Cozy Crochets`;
  const encodedName = encodeURIComponent(params.payeeName);
  const encodedNote = encodeURIComponent(note);

  return `upi://pay?pa=${encodeURIComponent(params.upiId)}&pn=${encodedName}&am=${amountRupees}&cu=INR&tn=${encodedNote}`;
}

// Generate pre-formatted WhatsApp order message URL
export function generateWhatsAppOrderUrl(params: {
  whatsappNumber: string;
  orderNumber: string;
  customerName: string;
  amountPaise: number;
  verificationCode: string;
  itemsSummary: string;
}): string {
  const amountFormatted = `₹${(params.amountPaise / 100).toLocaleString('en-IN')}`;
  const cleanNumber = params.whatsappNumber.replace(/[^0-9]/g, '');

  const text = `🌸 *New Cozy_Crochets Order Confirmation* 🌸\n\n` +
    `*Order Number:* ${params.orderNumber}\n` +
    `*Customer:* ${params.customerName}\n` +
    `*Amount:* ${amountFormatted}\n` +
    `*Items:* ${params.itemsSummary}\n` +
    `*Verification Code:* ${params.verificationCode}\n\n` +
    `I have initiated payment via UPI. Please confirm my handmade order! 🧶`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
