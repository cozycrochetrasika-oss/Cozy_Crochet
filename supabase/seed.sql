-- Seed: supabase/seed.sql
-- Description: Initial Catalog Seed for Cozy_Crochets 7 Handmade Products & Initial Site Settings

-- 1. Insert Initial Products
INSERT INTO public.products (id, slug, name, category, short_description, description, price_paise, inventory_qty, active, featured, best_seller, sold_count)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'crochet-bag',
    'Crochet Bag',
    'Bags',
    'Handcrafted woven crochet tote bag with durable stitch design and natural texture.',
    'An artisanal handmade crochet shoulder bag woven from resilient, premium cotton yarn. Features a reinforced base, comfortable drop handles, and an intricate open-weave texture suited for everyday elegance, farmers markets, or seaside strolls.',
    149900,
    14,
    true,
    true,
    true,
    142
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'crochet-bouquet',
    'Crochet Bouquet',
    'Bouquets',
    'Everlasting floral bouquet handmade with soft milk cotton yarn and botanical stems.',
    'A breathtaking everlasting floral bouquet crafted by hand with premium milk cotton yarn. Composed of delicate crochet roses, daisies, and lavender foliage wrapped in vintage craft paper with a satin ribbon. Never withers, forever in bloom.',
    199900,
    8,
    true,
    true,
    true,
    96
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'crochet-headbands',
    'Crochet Headbands',
    'Accessories',
    'Delicate and elastic crochet headbands made for comfort, softness, and vintage charm.',
    'Soft, stretchable, and gentle on the scalp, our handmade crochet headbands provide effortless vintage aesthetic and snug all-day comfort. Crocheted from breathable organic yarn in seasonal earthy pastels.',
    49900,
    24,
    true,
    false,
    false,
    215
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'crochet-key-ring',
    'Crochet Key Ring',
    'Keyrings',
    'Cute miniature crochet charms and keychains handmade with delightful detail.',
    'Miniature crochet treasures handcrafted with micro-stitch precision. Equipped with a sturdy antique brass clasp, ideal for keys, backpacks, or handbags. Lightweight, tactile, and heartwarming.',
    29900,
    45,
    true,
    false,
    true,
    420
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'crochet-kid-shoes',
    'Crochet Kid Shoes',
    'Footwear',
    'Ultra-soft baby booties crafted with hypoallergenic organic baby yarn for tiny toes.',
    'Tender handmade crochet booties for newborns and toddlers. Crafted with certified hypoallergenic baby-grade yarn, flexible ribbing to stay securely on active feet, and seamless toe boxes to prevent irritation.',
    89900,
    18,
    true,
    true,
    false,
    110
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    'crochet-rose',
    'Crochet Rose',
    'Flowers',
    'Timeless single stem crochet red rose with detailed leaf and sculpted petals.',
    'A romantic, everlasting crochet red rose featuring velvety petals, green calyx, and a flexible wrapped wire stem. Perfect for keepsakes, anniversaries, or bedside decor.',
    34900,
    32,
    true,
    true,
    true,
    350
  ),
  (
    '00000000-0000-0000-0000-000000000007',
    'crochet-sunflower',
    'Crochet Sunflower',
    'Flowers',
    'Radiant crochet sunflower bringing everlasting warmth and sunshine to any space.',
    'Bright and cheerful handcrafted sunflower with rich cocoa-hued center disk and vibrant golden petals. Made with durable colorfast yarn to maintain warmth and brightness across seasons.',
    39900,
    26,
    true,
    true,
    false,
    280
  )
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Initial Product Media
INSERT INTO public.product_media (product_id, media_type, slot, storage_path, alt_text, poster_path, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'image', 'main', 'Bag/main.png', 'Crochet Bag - Front view', NULL, 1),
  ('00000000-0000-0000-0000-000000000001', 'video', 'video', 'Bag/Video.mp4', 'Crochet Bag - Product showcase video', 'Bag/main.png', 2),
  ('00000000-0000-0000-0000-000000000001', 'image', 'single', 'Bag/Single.png', 'Crochet Bag - Single piece detail', NULL, 3),
  ('00000000-0000-0000-0000-000000000001', 'image', 'bundle', 'Bag/Bundle.png', 'Crochet Bag - Set bundle presentation', NULL, 4),

  ('00000000-0000-0000-0000-000000000002', 'image', 'main', 'Boque/main.png', 'Crochet Bouquet - Front view', NULL, 1),
  ('00000000-0000-0000-0000-000000000002', 'video', 'video', 'Boque/Video.mp4', 'Crochet Bouquet - Video', 'Boque/main.png', 2),
  ('00000000-0000-0000-0000-000000000002', 'image', 'single', 'Boque/Single.png', 'Crochet Bouquet - Single piece', NULL, 3),
  ('00000000-0000-0000-0000-000000000002', 'image', 'bundle', 'Boque/Bundle.png', 'Crochet Bouquet - Bundle', NULL, 4),

  ('00000000-0000-0000-0000-000000000003', 'image', 'main', 'HeadBands/main.jpeg', 'Crochet Headbands - Main', NULL, 1),
  ('00000000-0000-0000-0000-000000000003', 'video', 'video', 'HeadBands/Video.mp4', 'Crochet Headbands - Video', 'HeadBands/main.jpeg', 2),
  ('00000000-0000-0000-0000-000000000003', 'image', 'single', 'HeadBands/Single.jpeg', 'Crochet Headbands - Single', NULL, 3),
  ('00000000-0000-0000-0000-000000000003', 'image', 'bundle', 'HeadBands/Bundle.jpeg', 'Crochet Headbands - Bundle', NULL, 4),

  ('00000000-0000-0000-0000-000000000004', 'image', 'main', 'Key_Ring/main.png', 'Crochet Key Ring - Main', NULL, 1),
  ('00000000-0000-0000-0000-000000000004', 'video', 'video', 'Key_Ring/Video.mp4', 'Crochet Key Ring - Video', 'Key_Ring/main.png', 2),
  ('00000000-0000-0000-0000-000000000004', 'image', 'single', 'Key_Ring/Single.png', 'Crochet Key Ring - Single', NULL, 3),
  ('00000000-0000-0000-0000-000000000004', 'image', 'bundle', 'Key_Ring/Bundle.png', 'Crochet Key Ring - Bundle', NULL, 4),

  ('00000000-0000-0000-0000-000000000005', 'image', 'main', 'Kid_Shoe/main.jpeg', 'Crochet Kid Shoes - Main', NULL, 1),
  ('00000000-0000-0000-0000-000000000005', 'video', 'video', 'Kid_Shoe/Video.mp4', 'Crochet Kid Shoes - Video', 'Kid_Shoe/main.jpeg', 2),
  ('00000000-0000-0000-0000-000000000005', 'image', 'single', 'Kid_Shoe/Single.jpeg', 'Crochet Kid Shoes - Single', NULL, 3),
  ('00000000-0000-0000-0000-000000000005', 'image', 'bundle', 'Kid_Shoe/Bundle.jpeg', 'Crochet Kid Shoes - Bundle', NULL, 4),

  ('00000000-0000-0000-0000-000000000006', 'image', 'main', 'Rose/main.png', 'Crochet Rose - Main', NULL, 1),
  ('00000000-0000-0000-0000-000000000006', 'video', 'video', 'Rose/Video.mp4', 'Crochet Rose - Video', 'Rose/main.png', 2),
  ('00000000-0000-0000-0000-000000000006', 'image', 'single', 'Rose/Single.jpeg', 'Crochet Rose - Single', NULL, 3),
  ('00000000-0000-0000-0000-000000000006', 'image', 'bundle', 'Rose/Bundle.png', 'Crochet Rose - Bundle', NULL, 4),

  ('00000000-0000-0000-0000-000000000007', 'image', 'main', 'Sunflower/main.png', 'Crochet Sunflower - Main', NULL, 1),
  ('00000000-0000-0000-0000-000000000007', 'video', 'video', 'Sunflower/Video.mp4', 'Crochet Sunflower - Video', 'Sunflower/main.png', 2),
  ('00000000-0000-0000-0000-000000000007', 'image', 'single', 'Sunflower/Single.png', 'Crochet Sunflower - Single', NULL, 3),
  ('00000000-0000-0000-0000-000000000007', 'image', 'bundle', 'Sunflower/Bundle.png', 'Crochet Sunflower - Bundle', NULL, 4);

-- 3. Insert Initial Site Settings
INSERT INTO public.site_settings (id, daily_caption, festival_banner_active, store_whatsapp, store_upi_id, store_email, free_shipping_threshold_paise)
VALUES (
  'primary_settings',
  'Every loop carries care, warmth, and handmade magic.',
  false,
  '+919876543210',
  'cozycrochets@upi',
  'hello@cozycrochets.com',
  99900
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Initial Festival / Welcome Banner
INSERT INTO public.banners (id, title, subtitle, image_url, link_url, active, banner_type)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Handmade with Love, Thread by Thread',
  'Enjoy complimentary gift packaging on all bespoke orders this season.',
  '/products/Boque/main.png',
  '/shop',
  true,
  'festival'
)
ON CONFLICT (id) DO NOTHING;
