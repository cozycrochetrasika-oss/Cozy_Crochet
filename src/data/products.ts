// Auto-generated product manifest helper
import manifestJson from './product-manifest.json';

export interface MediaItem {
  id: string;
  mediaType: 'image' | 'video';
  slot: 'main' | 'video' | 'single' | 'bundle' | 'extra';
  filename: string;
  relativePath: string;
  publicUrl: string;
  altText: string;
  posterUrl?: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  folderName: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  pricePaise: number;
  inventoryQty: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  active: boolean;
  featured: boolean;
  bestSeller: boolean;
  media: MediaItem[];
}

export const PRODUCTS: Product[] = manifestJson as Product[];

export function getAllProducts(): Product[] {
  return PRODUCTS.filter(p => p.active);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.active && p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug && p.active);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.active && p.category.toLowerCase() === category.toLowerCase());
}

export function formatINR(pricePaise: number): string {
  const rupees = pricePaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}
