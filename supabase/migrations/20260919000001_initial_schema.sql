-- Migration: 20260919000001_initial_schema.sql
-- Description: Core Schema for Cozy_Crochets E-Commerce Platform with RLS & Integer Paise Currency

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price_paise BIGINT NOT NULL CHECK (price_paise >= 0),
    inventory_qty INTEGER NOT NULL DEFAULT 0 CHECK (inventory_qty >= 0),
    active BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    best_seller BOOLEAN NOT NULL DEFAULT false,
    sold_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. PRODUCT MEDIA
CREATE TABLE IF NOT EXISTS public.product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    slot TEXT NOT NULL CHECK (slot IN ('main', 'video', 'single', 'bundle', 'extra')),
    storage_path TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    poster_path TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON public.product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_slot ON public.product_media(slot);

-- 4. CART ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(user_id, product_id)
);

CREATE TRIGGER set_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'payment_review',
        'confirmed',
        'crafting',
        'shipped',
        'delivered',
        'cancelled'
    )),
    total_paise BIGINT NOT NULL CHECK (total_paise >= 0),
    shipping_paise BIGINT NOT NULL DEFAULT 0 CHECK (shipping_paise >= 0),
    address_id UUID REFERENCES public.addresses(id),
    customer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 7. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_paise BIGINT NOT NULL CHECK (price_paise >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 8. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'upi_manual', 'whatsapp')),
    provider_payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN (
        'initiated',
        'pending_verification',
        'verified',
        'failed',
        'refunded'
    )),
    amount_paise BIGINT NOT NULL CHECK (amount_paise >= 0),
    verification_code TEXT, -- 6-digit administrative verification code
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);

-- 9. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    approved BOOLEAN NOT NULL DEFAULT false,
    verified_purchase BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- 10. CUSTOM REQUESTS
CREATE TABLE IF NOT EXISTS public.custom_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    item_type TEXT NOT NULL,
    color_preferences TEXT,
    description TEXT NOT NULL,
    reference_images TEXT[] DEFAULT '{}',
    budget_paise BIGINT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN (
        'submitted',
        'under_review',
        'quoted',
        'accepted',
        'declined',
        'completed'
    )),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER set_custom_requests_updated_at
BEFORE UPDATE ON public.custom_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    banner_type TEXT NOT NULL DEFAULT 'festival' CHECK (banner_type IN ('festival', 'announcement', 'hero')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 12. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary_settings',
    daily_caption TEXT NOT NULL DEFAULT 'Every loop carries care, warmth, and handmade magic.',
    festival_banner_active BOOLEAN NOT NULL DEFAULT false,
    store_whatsapp TEXT NOT NULL DEFAULT '+919876543210',
    store_upi_id TEXT NOT NULL DEFAULT 'cozycrochets@upi',
    store_email TEXT NOT NULL DEFAULT 'hello@cozycrochets.com',
    free_shipping_threshold_paise BIGINT NOT NULL DEFAULT 99900,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 13. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by owner or admin"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = 'customer');

CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
USING (public.is_admin());

-- Products Policies
CREATE POLICY "Active products are viewable by anyone"
ON public.products FOR SELECT
USING (active = true OR public.is_admin());

CREATE POLICY "Admins have full CRUD on products"
ON public.products FOR ALL
USING (public.is_admin());

-- Product Media Policies
CREATE POLICY "Product media viewable for viewable products"
ON public.product_media FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.products
    WHERE id = product_media.product_id AND (active = true OR public.is_admin())
));

CREATE POLICY "Admins have full CRUD on product media"
ON public.product_media FOR ALL
USING (public.is_admin());

-- Cart Items Policies
CREATE POLICY "Users can manage their own cart"
ON public.cart_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Addresses Policies
CREATE POLICY "Users can manage their own addresses"
ON public.addresses FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view order addresses"
ON public.addresses FOR SELECT
USING (public.is_admin());

-- Orders Policies
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own order"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full access to orders"
ON public.orders FOR ALL
USING (public.is_admin());

-- Order Items Policies
CREATE POLICY "Users can view their own order items"
ON public.order_items FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = order_items.order_id AND user_id = auth.uid()
));

CREATE POLICY "Users can insert order items for their own orders"
ON public.order_items FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = order_items.order_id AND user_id = auth.uid()
));

CREATE POLICY "Admins have full access to order items"
ON public.order_items FOR ALL
USING (public.is_admin());

-- Payments Policies
CREATE POLICY "Users can view payments for their own orders"
ON public.payments FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = payments.order_id AND user_id = auth.uid()
));

CREATE POLICY "Users can insert payments for their own orders"
ON public.payments FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = payments.order_id AND user_id = auth.uid()
));

CREATE POLICY "Admins have full access to payments"
ON public.payments FOR ALL
USING (public.is_admin());

-- Reviews Policies
CREATE POLICY "Approved reviews are viewable by anyone"
ON public.reviews FOR SELECT
USING (approved = true OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full CRUD on reviews"
ON public.reviews FOR ALL
USING (public.is_admin());

-- Custom Requests Policies
CREATE POLICY "Users can view and create their own custom requests"
ON public.custom_requests FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Anyone or logged in user can insert custom request"
ON public.custom_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins have full CRUD on custom requests"
ON public.custom_requests FOR ALL
USING (public.is_admin());

-- Banners Policies
CREATE POLICY "Active banners are viewable by everyone"
ON public.banners FOR SELECT
USING (active = true OR public.is_admin());

CREATE POLICY "Admins have full CRUD on banners"
ON public.banners FOR ALL
USING (public.is_admin());

-- Site Settings Policies
CREATE POLICY "Site settings are viewable by everyone"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update site settings"
ON public.site_settings FOR UPDATE
USING (public.is_admin());

-- Audit Logs Policies
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_admin());
