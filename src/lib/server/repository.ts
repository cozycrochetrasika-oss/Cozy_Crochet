import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import manifestProducts from '@/data/product-manifest.json';
import type { Product } from '@/data/products';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  ctaLabel?: string;
  active: boolean;
  bannerType: 'festival' | 'announcement' | 'hero';
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  dailyCaption: string;
  announcementMessage: string;
  festivalBannerActive: boolean;
  storeName: string;
  founderName: string;
  storeWhatsapp: string;
  storeWhatsappDigits: string;
  storeWhatsappAlternate: string;
  storeWhatsappAlternateDigits: string;
  storeEmail: string;
  storePhone: string;
  instagramUrl: string;
  instagramHandle: string;
  storeUpiId: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  freeShippingThresholdPaise: number;
  updatedAt: string;
}

export interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  approved: boolean;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    pricePaise: number;
    image: string;
  }>;
  totalPaise: number;
  shippingPaise: number;
  paymentProvider: 'stripe' | 'upi_manual' | 'whatsapp';
  paymentStatus: 'initiated' | 'pending_verification' | 'verified' | 'failed' | 'payment_pending' | 'payment_review' | 'paid' | 'refunded';
  fulfilmentStatus: 'pending' | 'crafting' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  verificationCode?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomRequestItem {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  itemType: string;
  colorPreferences?: string;
  description: string;
  budgetPaise?: number;
  referenceImages: string[];
  status: 'submitted' | 'under_review' | 'quoted' | 'accepted' | 'declined' | 'completed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  products: Product[];
  banners: Banner[];
  settings: SiteSettings;
  reviews: ReviewItem[];
  orders: OrderItem[];
  customRequests: CustomRequestItem[];
}

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'primary_settings',
  storeName: 'Cozy_Crochets',
  founderName: 'Rasika',
  dailyCaption: 'Every loop carries care, warmth, and handmade magic.',
  announcementMessage: 'Every loop carries care, warmth, and handmade magic. Heirloom Handcrafted Crochet in certified milk cotton yarn.',
  festivalBannerActive: true,
  storeWhatsapp: '+91 60009 89651',
  storeWhatsappDigits: '916000989651',
  storeWhatsappAlternate: '+91 60030 16159',
  storeWhatsappAlternateDigits: '916003016159',
  storeEmail: 'cozycrochetrasika@gmail.com',
  storePhone: '+91 60009 89651',
  instagramUrl: 'https://www.instagram.com/cozystitches_byrasika?stkn=MWpuM2hwYzQyZmZ4Yg==',
  instagramHandle: '@cozystitches_byrasika',
  storeUpiId: 'cozycrochets@upi',
  heroBadge: 'The Living Yarn Store',
  heroHeadline: 'Handmade with yarn. Made with love.',
  heroSubheadline: 'Unique crochet pieces made one stitch at a time.',
  primaryCtaLabel: 'Explore Collection',
  secondaryCtaLabel: 'Request Custom Crochet',
  freeShippingThresholdPaise: 99900,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner_festive_1',
    title: 'Festive Season Handmade Bouquet Collection',
    subtitle: 'Everlasting floral bouquets crafted loop-by-loop. Never withers, forever in bloom.',
    imageUrl: '/products/Boque/Bundle.png',
    linkUrl: '/shop?category=Bouquets',
    ctaLabel: 'Shop Festive Bouquets',
    active: true,
    bannerType: 'festival',
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-11-30T23:59:59Z',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'banner_custom_2',
    title: 'Bespoke Custom Crochet Requests Open',
    subtitle: 'Looking for a personalized colorway, custom size, or unique keepsake? Collaborate directly with artisan Rasika.',
    imageUrl: '/products/Bag/Bundle.png',
    linkUrl: '/customize',
    ctaLabel: 'Request Custom Piece',
    active: true,
    bannerType: 'announcement',
    createdAt: new Date().toISOString(),
  },
];

let cachedDb: DatabaseSchema | null = null;

function ensureDirectoryExists() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function loadDatabase(): DatabaseSchema {
  if (cachedDb) {
    return cachedDb;
  }

  ensureDirectoryExists();

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDb = JSON.parse(raw) as DatabaseSchema;
      if (!Array.isArray(cachedDb.orders) || cachedDb.orders.length === 0) {
        cachedDb.orders = [
          {
            id: 'ord_seed_1',
            orderNumber: 'CC-914820',
            customerName: 'Ananya Sharma',
            customerEmail: 'ananya@example.com',
            customerPhone: '+91 98765 11223',
            shippingAddress: '42, Lavelle Road, Bangalore, Karnataka - 560001',
            items: [
              {
                productId: 'prod_crochet_bouquet',
                productName: 'Crochet Bouquet',
                quantity: 1,
                pricePaise: 199900,
                image: '/products/Boque/Single.png',
              },
            ],
            totalPaise: 199900,
            shippingPaise: 0,
            paymentProvider: 'upi_manual',
            paymentStatus: 'pending_verification',
            fulfilmentStatus: 'crafting',
            verificationCode: '841920',
            adminNotes: 'Awaiting customer 6-digit confirmation code check',
            createdAt: '2026-09-19T14:30:00.000Z',
            updatedAt: '2026-09-19T14:30:00.000Z',
          },
          {
            id: 'ord_seed_2',
            orderNumber: 'CC-882103',
            customerName: 'Rohan Mehta',
            customerEmail: 'rohan@example.com',
            customerPhone: '+91 98200 44556',
            shippingAddress: '12, Marine Drive, Mumbai, Maharashtra - 400020',
            items: [
              {
                productId: 'prod_crochet_bag',
                productName: 'Crochet Bag',
                quantity: 1,
                pricePaise: 149900,
                image: '/products/Bag/Single.png',
              },
            ],
            totalPaise: 149900,
            shippingPaise: 0,
            paymentProvider: 'stripe',
            paymentStatus: 'verified',
            fulfilmentStatus: 'shipped',
            adminNotes: 'Dispatched via BlueDart Express',
            createdAt: '2026-09-18T11:15:00.000Z',
            updatedAt: '2026-09-18T11:15:00.000Z',
          },
        ];
        saveDatabase(cachedDb);
      }
      if (!Array.isArray(cachedDb.customRequests) || cachedDb.customRequests.length === 0) {
        cachedDb.customRequests = [
          {
            id: 'req_seed_1',
            customerName: 'Kavita Sundaram',
            email: 'kavita.s@example.com',
            phone: '+91 98450 12345',
            itemType: 'Bridal Bouquet',
            colorPreferences: 'Blush pink, champagne gold, cream white',
            description: 'Bespoke bridal bouquet with heirloom pearls woven into baby breath stitches. Needed for wedding in late November.',
            budgetPaise: 350000,
            referenceImages: [],
            status: 'under_review',
            adminNotes: 'Spoke on WhatsApp, preparing yarn color samples',
            createdAt: '2026-09-17T09:30:00.000Z',
            updatedAt: '2026-09-17T09:30:00.000Z',
          },
        ];
        saveDatabase(cachedDb);
      }
      if (!Array.isArray(cachedDb.reviews)) cachedDb.reviews = [];
      return cachedDb;
    } catch (err) {
      console.error('[Repository] Failed to read db.json, falling back to defaults:', err);
    }
  }

  // Seed default database from product manifest
  const initialProducts = JSON.parse(JSON.stringify(manifestProducts)) as Product[];
  cachedDb = {
    products: initialProducts,
    banners: DEFAULT_BANNERS,
    settings: DEFAULT_SETTINGS,
    reviews: [
      {
        id: 'rev_seed_1',
        productId: 'prod_crochet_bouquet',
        productName: 'Crochet Bouquet',
        author: 'Ananya Sharma',
        city: 'Bangalore',
        rating: 5.0,
        title: 'Brought tears of joy!',
        body: 'Ordered the everlasting bouquet for my sister’s anniversary. Delicate stitching, natural colors, and heirloom presentation.',
        date: 'Sep 12, 2026',
        approved: true,
        verifiedPurchase: true,
        createdAt: '2026-09-12T10:00:00Z',
      },
      {
        id: 'rev_seed_2',
        productId: 'prod_crochet_bag',
        productName: 'Crochet Bag',
        author: 'Rohan Mehta',
        city: 'Mumbai',
        rating: 4.8,
        title: 'Impeccable quality and texture',
        body: 'The crochet bag is sturdy, holds essentials comfortably, and the pure cotton texture feels so authentic.',
        date: 'Aug 29, 2026',
        approved: true,
        verifiedPurchase: true,
        createdAt: '2026-08-29T10:00:00Z',
      },
    ],
    orders: [
      {
        id: 'ord_seed_1',
        orderNumber: 'CC-914820',
        customerName: 'Ananya Sharma',
        customerEmail: 'ananya@example.com',
        customerPhone: '+91 98765 11223',
        shippingAddress: '42, Lavelle Road, Bangalore, Karnataka - 560001',
        items: [
          {
            productId: 'prod_crochet_bouquet',
            productName: 'Crochet Bouquet',
            quantity: 1,
            pricePaise: 199900,
            image: '/products/Boque/Single.png',
          },
        ],
        totalPaise: 199900,
        shippingPaise: 0,
        paymentProvider: 'upi_manual',
        paymentStatus: 'pending_verification',
        fulfilmentStatus: 'crafting',
        verificationCode: '841920',
        adminNotes: 'Awaiting customer 6-digit confirmation code check',
        createdAt: '2026-09-19T14:30:00.000Z',
        updatedAt: '2026-09-19T14:30:00.000Z',
      },
      {
        id: 'ord_seed_2',
        orderNumber: 'CC-882103',
        customerName: 'Rohan Mehta',
        customerEmail: 'rohan@example.com',
        customerPhone: '+91 98200 44556',
        shippingAddress: '12, Marine Drive, Mumbai, Maharashtra - 400020',
        items: [
          {
            productId: 'prod_crochet_bag',
            productName: 'Crochet Bag',
            quantity: 1,
            pricePaise: 149900,
            image: '/products/Bag/Single.png',
          },
        ],
        totalPaise: 149900,
        shippingPaise: 0,
        paymentProvider: 'stripe',
        paymentStatus: 'verified',
        fulfilmentStatus: 'shipped',
        adminNotes: 'Dispatched via BlueDart Express',
        createdAt: '2026-09-18T11:15:00.000Z',
        updatedAt: '2026-09-18T11:15:00.000Z',
      },
    ],
    customRequests: [
      {
        id: 'req_seed_1',
        customerName: 'Kavita Sundaram',
        email: 'kavita.s@example.com',
        phone: '+91 98450 12345',
        itemType: 'Bridal Bouquet',
        colorPreferences: 'Blush pink, champagne gold, cream white',
        description: 'Bespoke bridal bouquet with heirloom pearls woven into baby breath stitches. Needed for wedding in late November.',
        budgetPaise: 350000,
        referenceImages: [],
        status: 'under_review',
        adminNotes: 'Spoke on WhatsApp, preparing yarn color samples',
        createdAt: '2026-09-17T09:30:00.000Z',
        updatedAt: '2026-09-17T09:30:00.000Z',
      },
    ],
  };

  saveDatabase(cachedDb);
  return cachedDb;
}

function saveDatabase(db: DatabaseSchema) {
  ensureDirectoryExists();
  cachedDb = db;
  const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_FILE);
  } catch (err) {
    console.error('[Repository] Error persisting db.json atomically:', err);
  }
}

// -------------------------------------------------------------
// Products API
// -------------------------------------------------------------
export async function getProducts(activeOnly = false): Promise<Product[]> {
  const db = loadDatabase();
  return activeOnly ? db.products.filter((p) => p.active) : db.products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const db = loadDatabase();
  return db.products.find((p) => p.id === id);
}

export async function getProductBySlug(slug: string, activeOnly = true): Promise<Product | undefined> {
  const db = loadDatabase();
  return db.products.find((p) => p.slug === slug && (!activeOnly || p.active));
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const db = loadDatabase();
  const id = `prod_${crypto.randomUUID().slice(0, 8)}`;
  const newProduct: Product = {
    ...data,
    id,
  };
  db.products = [newProduct, ...db.products];
  saveDatabase(db);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = loadDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updates,
  };
  saveDatabase(db);
  return db.products[index];
}

export async function deleteProduct(id: string, soft = true): Promise<boolean> {
  const db = loadDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  if (soft) {
    db.products[index].active = false;
  } else {
    db.products.splice(index, 1);
  }
  saveDatabase(db);
  return true;
}

export async function toggleProductActive(id: string): Promise<boolean | null> {
  const db = loadDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index].active = !db.products[index].active;
  saveDatabase(db);
  return db.products[index].active;
}

// -------------------------------------------------------------
// Banners API
// -------------------------------------------------------------
export async function getBanners(activeOnly = false): Promise<Banner[]> {
  const db = loadDatabase();
  return activeOnly ? db.banners.filter((b) => b.active) : db.banners;
}

export async function createBanner(data: Omit<Banner, 'id' | 'createdAt'>): Promise<Banner> {
  const db = loadDatabase();
  const id = `banner_${crypto.randomUUID().slice(0, 8)}`;
  const banner: Banner = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };
  db.banners = [banner, ...db.banners];
  saveDatabase(db);
  return banner;
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  const db = loadDatabase();
  const index = db.banners.findIndex((b) => b.id === id);
  if (index === -1) return null;

  db.banners[index] = { ...db.banners[index], ...updates };
  saveDatabase(db);
  return db.banners[index];
}

export async function deleteBanner(id: string): Promise<boolean> {
  const db = loadDatabase();
  const initialLength = db.banners.length;
  db.banners = db.banners.filter((b) => b.id !== id);
  if (db.banners.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// Site Settings API
// -------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const db = loadDatabase();
  return db.settings || DEFAULT_SETTINGS;
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = loadDatabase();
  db.settings = {
    ...db.settings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  return db.settings;
}

// -------------------------------------------------------------
// Reviews API
// -------------------------------------------------------------
export async function getReviews(productId?: string, approvedOnly = true): Promise<ReviewItem[]> {
  const db = loadDatabase();
  let result = db.reviews;
  if (productId) {
    result = result.filter((r) => r.productId === productId);
  }
  if (approvedOnly) {
    result = result.filter((r) => r.approved);
  }
  return result;
}

export async function createReview(data: Omit<ReviewItem, 'id' | 'createdAt'>): Promise<ReviewItem> {
  const db = loadDatabase();
  const id = `rev_${crypto.randomUUID().slice(0, 8)}`;
  const review: ReviewItem = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };
  db.reviews = [review, ...db.reviews];
  saveDatabase(db);
  return review;
}

export async function moderateReview(id: string, action: 'approve' | 'reject' | 'delete'): Promise<boolean> {
  const db = loadDatabase();
  if (action === 'delete') {
    const prev = db.reviews.length;
    db.reviews = db.reviews.filter((r) => r.id !== id);
    if (db.reviews.length !== prev) {
      saveDatabase(db);
      return true;
    }
    return false;
  }

  const review = db.reviews.find((r) => r.id === id);
  if (!review) return false;

  review.approved = action === 'approve';
  saveDatabase(db);
  return true;
}

// -------------------------------------------------------------
// Orders API
// -------------------------------------------------------------
export async function getOrders(statusFilter?: string): Promise<OrderItem[]> {
  const db = loadDatabase();
  if (!statusFilter || statusFilter === 'all') {
    return db.orders;
  }
  return db.orders.filter(
    (o) => o.paymentStatus === statusFilter || o.fulfilmentStatus === statusFilter
  );
}

export async function createOrder(data: Omit<OrderItem, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<OrderItem> {
  const db = loadDatabase();
  const id = `ord_${crypto.randomUUID().slice(0, 8)}`;
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `CC-${randomNum}`;
  const now = new Date().toISOString();

  const newOrder: OrderItem = {
    ...data,
    id,
    orderNumber,
    createdAt: now,
    updatedAt: now,
  };

  db.orders = [newOrder, ...db.orders];
  saveDatabase(db);
  return newOrder;
}

export async function verifyOrderPayment(orderId: string, verificationCode?: string): Promise<OrderItem | null> {
  const db = loadDatabase();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.paymentStatus = 'verified';
  order.fulfilmentStatus = 'crafting';
  if (verificationCode) {
    order.verificationCode = verificationCode;
  }
  order.updatedAt = new Date().toISOString();
  saveDatabase(db);
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  updates: Partial<Pick<OrderItem, 'paymentStatus' | 'fulfilmentStatus' | 'adminNotes'>>
): Promise<OrderItem | null> {
  const db = loadDatabase();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  if (updates.paymentStatus) order.paymentStatus = updates.paymentStatus;
  if (updates.fulfilmentStatus) order.fulfilmentStatus = updates.fulfilmentStatus;
  if (updates.adminNotes !== undefined) order.adminNotes = updates.adminNotes;
  order.updatedAt = new Date().toISOString();

  saveDatabase(db);
  return order;
}

// -------------------------------------------------------------
// Custom Requests API
// -------------------------------------------------------------
export async function getCustomRequests(): Promise<CustomRequestItem[]> {
  const db = loadDatabase();
  return db.customRequests;
}

export async function createCustomRequest(
  data: Omit<CustomRequestItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<CustomRequestItem> {
  const db = loadDatabase();
  const id = `req_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  const reqItem: CustomRequestItem = {
    ...data,
    id,
    status: 'submitted',
    createdAt: now,
    updatedAt: now,
  };

  db.customRequests = [reqItem, ...db.customRequests];
  saveDatabase(db);
  return reqItem;
}

export async function updateCustomRequestStatus(
  id: string,
  status: CustomRequestItem['status'],
  adminNotes?: string
): Promise<CustomRequestItem | null> {
  const db = loadDatabase();
  const item = db.customRequests.find((r) => r.id === id);
  if (!item) return null;

  item.status = status;
  if (adminNotes !== undefined) {
    item.adminNotes = adminNotes;
  }
  item.updatedAt = new Date().toISOString();
  saveDatabase(db);
  return item;
}
