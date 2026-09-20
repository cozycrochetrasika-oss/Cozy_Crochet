-- Totals, settlement, moderation, and administrative fields are server-owned.
ALTER FUNCTION public.is_admin() SET search_path = '';
DROP POLICY "Users can create their own order" ON public.orders;
DROP POLICY "Users can insert order items for their own orders" ON public.order_items;
DROP POLICY "Users can insert payments for their own orders" ON public.payments;
DROP POLICY "Authenticated users can submit reviews" ON public.reviews;
CREATE POLICY "Customers submit unmoderated reviews" ON public.reviews FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND approved = false AND verified_purchase = false);
DROP POLICY "Anyone or logged in user can insert custom request" ON public.custom_requests;
CREATE POLICY "Customers submit their own requests" ON public.custom_requests FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'submitted' AND admin_notes IS NULL);
ALTER TABLE public.payments RENAME COLUMN verification_code TO verification_code_hash;
ALTER TABLE public.payments ADD COLUMN verification_expires_at timestamptz;
ALTER TABLE public.payments ADD COLUMN verification_attempts integer NOT NULL DEFAULT 0 CHECK (verification_attempts >= 0);
-- Codes are handled by the server, not exposed by the customer payment view.
REVOKE SELECT ON public.payments FROM anon, authenticated;
GRANT SELECT (id, order_id, provider, provider_payment_id, status, amount_paise, verified_at, created_at) ON public.payments TO authenticated;
ALTER TABLE public.site_settings ALTER COLUMN store_whatsapp DROP DEFAULT;
ALTER TABLE public.site_settings ALTER COLUMN store_upi_id DROP DEFAULT;
ALTER TABLE public.site_settings ALTER COLUMN store_email DROP DEFAULT;
