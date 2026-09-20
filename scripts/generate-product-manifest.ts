import * as fs from 'fs';
import * as path from 'path';

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

export interface ProductDefinition {
  id: string;
  slug: string;
  folderName: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  pricePaise: number; // Integer paise (e.g. 149900 = ₹1,499.00)
  inventoryQty: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  active: boolean;
  featured: boolean;
  bestSeller: boolean;
  media: MediaItem[];
}

const PRODUCT_FOLDERS: Record<string, {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  pricePaise: number;
  inventoryQty: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  featured: boolean;
  bestSeller: boolean;
}> = {
  Bag: {
    name: 'Crochet Bag',
    slug: 'crochet-bag',
    category: 'Bags',
    shortDescription: 'Handcrafted woven crochet tote bag with durable stitch design and natural texture.',
    description: 'An artisanal handmade crochet shoulder bag woven from resilient, premium cotton yarn. Features a reinforced base, comfortable drop handles, and an intricate open-weave texture suited for everyday elegance, farmers markets, or seaside strolls.',
    pricePaise: 149900, // ₹1,499.00
    inventoryQty: 14,
    rating: 4.8,
    reviewCount: 38,
    soldCount: 142,
    featured: true,
    bestSeller: true,
  },
  Boque: {
    name: 'Crochet Bouquet',
    slug: 'crochet-bouquet',
    category: 'Bouquets',
    shortDescription: 'Everlasting floral bouquet handmade with soft milk cotton yarn and botanical stems.',
    description: 'A breathtaking everlasting floral bouquet crafted by hand with premium milk cotton yarn. Composed of delicate crochet roses, daisies, and lavender foliage wrapped in vintage craft paper with a satin ribbon. Never withers, forever in bloom.',
    pricePaise: 199900, // ₹1,999.00
    inventoryQty: 8,
    rating: 4.9,
    reviewCount: 52,
    soldCount: 96,
    featured: true,
    bestSeller: true,
  },
  HeadBands: {
    name: 'Crochet Headbands',
    slug: 'crochet-headbands',
    category: 'Accessories',
    shortDescription: 'Delicate and elastic crochet headbands made for comfort, softness, and vintage charm.',
    description: 'Soft, stretchable, and gentle on the scalp, our handmade crochet headbands provide effortless vintage aesthetic and snug all-day comfort. Crocheted from breathable organic yarn in seasonal earthy pastels.',
    pricePaise: 49900, // ₹499.00
    inventoryQty: 24,
    rating: 4.7,
    reviewCount: 29,
    soldCount: 215,
    featured: false,
    bestSeller: false,
  },
  Key_Ring: {
    name: 'Crochet Key Ring',
    slug: 'crochet-key-ring',
    category: 'Keyrings',
    shortDescription: 'Cute miniature crochet charms and keychains handmade with delightful detail.',
    description: 'Miniature crochet treasures handcrafted with micro-stitch precision. Equipped with a sturdy antique brass clasp, ideal for keys, backpacks, or handbags. Lightweight, tactile, and heartwarming.',
    pricePaise: 29900, // ₹299.00
    inventoryQty: 45,
    rating: 4.9,
    reviewCount: 64,
    soldCount: 420,
    featured: false,
    bestSeller: true,
  },
  Kid_Shoe: {
    name: 'Crochet Kid Shoes',
    slug: 'crochet-kid-shoes',
    category: 'Footwear',
    shortDescription: 'Handmade crochet baby booties. Materials and sizing await owner confirmation.',
    description: 'Crochet baby booties shown using the supplied product photography. Fiber composition, sizing, care instructions, and suitability must be confirmed before sale.',
    pricePaise: 89900, // ₹899.00
    inventoryQty: 18,
    rating: 4.8,
    reviewCount: 33,
    soldCount: 110,
    featured: true,
    bestSeller: false,
  },
  Rose: {
    name: 'Crochet Rose',
    slug: 'crochet-rose',
    category: 'Flowers',
    shortDescription: 'Timeless single stem crochet red rose with detailed leaf and sculpted petals.',
    description: 'A romantic, everlasting crochet red rose featuring velvety petals, green calyx, and a flexible wrapped wire stem. Perfect for keepsakes, anniversaries, or bedside decor.',
    pricePaise: 34900, // ₹349.00
    inventoryQty: 32,
    rating: 4.9,
    reviewCount: 78,
    soldCount: 350,
    featured: true,
    bestSeller: true,
  },
  Sunflower: {
    name: 'Crochet Sunflower',
    slug: 'crochet-sunflower',
    category: 'Flowers',
    shortDescription: 'Radiant crochet sunflower bringing everlasting warmth and sunshine to any space.',
    description: 'Bright and cheerful handcrafted sunflower with rich cocoa-hued center disk and vibrant golden petals. Made with durable colorfast yarn to maintain warmth and brightness across seasons.',
    pricePaise: 39900, // ₹399.00
    inventoryQty: 26,
    rating: 4.9,
    reviewCount: 45,
    soldCount: 280,
    featured: true,
    bestSeller: false,
  },
};

const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.mp4']);

function getMediaType(filename: string): 'image' | 'video' {
  return path.extname(filename).toLowerCase() === '.mp4' ? 'video' : 'image';
}

export function generateManifest(rootDir: string = process.cwd()): ProductDefinition[] {
  const products: ProductDefinition[] = [];
  const publicProductsDir = path.join(rootDir, 'public', 'products');

  // Ensure public/products exists
  if (!fs.existsSync(publicProductsDir)) {
    fs.mkdirSync(publicProductsDir, { recursive: true });
  }

  for (const [folderName, meta] of Object.entries(PRODUCT_FOLDERS)) {
    const folderPath = path.join(rootDir, folderName);
    if (!fs.existsSync(folderPath)) {
      console.warn(`[Manifest Warning] Directory "${folderName}" not found at ${folderPath}. Skipping.`);
      continue;
    }

    // Set up symlink in public/products/<folderName> if not existing
    const symlinkTarget = path.join(publicProductsDir, folderName);
    try {
      if (!fs.existsSync(symlinkTarget)) {
        // Use relative symlink: ../../<folderName>
        const relativeTarget = path.join('..', '..', folderName);
        fs.symlinkSync(relativeTarget, symlinkTarget, 'dir');
        console.log(`[Media Link] Created symlink for "${folderName}" -> "${relativeTarget}"`);
      }
    } catch (symlinkErr) {
      console.warn(`[Media Link] Symlink failed for ${folderName}, copying files instead:`, symlinkErr);
      // Fallback to directory copy if symlinks are disallowed by OS/permissions
      if (!fs.existsSync(symlinkTarget)) {
        fs.cpSync(folderPath, symlinkTarget, { recursive: true });
      }
    }

    // Read all files in folder
    const allFiles = fs.readdirSync(folderPath).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.has(ext) && fs.statSync(path.join(folderPath, file)).isFile();
    });

    // 5-Slot Strategy
    // 1. exact main image
    // 2. exact Video.mp4
    // 3. exact Single image
    // 4. exact Bundle image
    // 5. all remaining media using natural filename sorting

    const usedFiles = new Set<string>();

    const findExact = (prefix: string, isVideo = false): string | null => {
      const found = allFiles.find(f => {
        if (usedFiles.has(f)) return false;
        const base = path.parse(f).name;
        const ext = path.extname(f).toLowerCase();
        if (isVideo) {
          return f === 'Video.mp4';
        }
        return base === prefix && ext !== '.mp4';
      });
      if (found) usedFiles.add(found);
      return found || null;
    };

    const mainFile = findExact('main');
    const videoFile = findExact('Video', true);
    const singleFile = findExact('Single');
    const bundleFile = findExact('Bundle');

    // Remaining media with natural filename sorting
    const remainingFiles = allFiles
      .filter(f => !usedFiles.has(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    const mediaList: MediaItem[] = [];
    let sortOrder = 1;

    const makeMediaItem = (filename: string, slot: MediaItem['slot']): MediaItem => {
      const type = getMediaType(filename);
      const encodedFilename = encodeURIComponent(filename);
      const publicUrl = `/products/${folderName}/${encodedFilename}`;
      const mainPosterUrl = mainFile ? `/products/${folderName}/${encodeURIComponent(mainFile)}` : undefined;

      return {
        id: `${meta.slug}-${slot}-${sortOrder}`,
        mediaType: type,
        slot,
        filename,
        relativePath: `${folderName}/${filename}`,
        publicUrl,
        altText: `${meta.name} - ${slot === 'main' ? 'Front view' : slot === 'video' ? 'Product showcase video' : slot === 'single' ? 'Single piece detail' : slot === 'bundle' ? 'Set bundle presentation' : 'Handcrafted detail'}`,
        posterUrl: type === 'video' ? mainPosterUrl : undefined,
        sortOrder: sortOrder++,
      };
    };

    if (mainFile) mediaList.push(makeMediaItem(mainFile, 'main'));
    if (videoFile) mediaList.push(makeMediaItem(videoFile, 'video'));
    if (singleFile) mediaList.push(makeMediaItem(singleFile, 'single'));
    if (bundleFile) mediaList.push(makeMediaItem(bundleFile, 'bundle'));

    for (const extraFile of remainingFiles) {
      mediaList.push(makeMediaItem(extraFile, 'extra'));
    }

    products.push({
      id: `prod_${meta.slug.replace(/-/g, '_')}`,
      slug: meta.slug,
      folderName,
      name: meta.name,
      category: meta.category,
      shortDescription: meta.shortDescription,
      description: meta.description,
      pricePaise: meta.pricePaise,
      inventoryQty: meta.inventoryQty,
      rating: meta.rating,
      reviewCount: meta.reviewCount,
      soldCount: meta.soldCount,
      active: true,
      featured: meta.featured,
      bestSeller: meta.bestSeller,
      media: mediaList,
    });
  }

  return products;
}

// Script entrypoint
if (require.main === module || process.argv[1]?.endsWith('generate-product-manifest.ts')) {
  console.log('--- Generating Cozy_Crochets Product Media Manifest ---');
  const rootDir = path.resolve(__dirname, '..');
  const products = generateManifest(rootDir);

  const dataDir = path.join(rootDir, 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const jsonOutputPath = path.join(dataDir, 'product-manifest.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`[Success] Written manifest to ${jsonOutputPath} with ${products.length} products.`);

  // Write TypeScript accessor
  const tsOutputPath = path.join(dataDir, 'products.ts');
  const tsContent = `// Auto-generated product manifest helper
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
`;

  fs.writeFileSync(tsOutputPath, tsContent, 'utf-8');
  console.log(`[Success] Written typed helper to ${tsOutputPath}`);
}
