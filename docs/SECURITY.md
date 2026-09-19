# SECURITY.md — Cozy_Crochets Security Architecture

## 1. Threat Model & Key Assets

Cozy_Crochets handles financial transactions (Stripe, UPI), customer personal identifying information (PII such as delivery addresses, phone numbers), and privileged administrative store operations.

**Protected Assets**:
1. Customer PII and order history.
2. Administrative CRUD functions (product creation, inventory changes, price overrides).
3. Payment verification integrity (preventing fraudulent mark-as-paid attacks).
4. Storage bucket media integrity.

---

## 2. Secrets Management & Environment Isolation

- **Client Code Boundaries**:
  - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for browser exposure.
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is safe for browser exposure.
- **Strict Server-Only Secrets**:
  - `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side Route Handlers or Server Actions (`import "server-only"`).
  - `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are strictly server-only.
- **Repository Rules**:
  - `.env` and `.env.local` are explicitly ignored by `.gitignore`.
  - Only `.env.example` with empty keys is permitted in version control.

---

## 3. Database Security & Row Level Security (RLS)

All Supabase PostgreSQL tables enforce RLS:

```sql
-- Enable RLS across all commerce tables
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
```

### Profile & Customer Data Isolation
Customers can only access records where `auth.uid() = user_id`.

```sql
CREATE POLICY "Users can manage own cart"
ON public.cart_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own addresses"
ON public.addresses FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);
```

### Administrative Guard
Admin authorization checks the `profiles.role` column:
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. Payment Verification Security

### 4.1 Stripe Webhook Signature Verification
All incoming Stripe webhook requests at `/api/webhooks/stripe` must verify the `stripe-signature` header against `STRIPE_WEBHOOK_SECRET` using raw request bodies before any order fulfillment is triggered.

### 4.2 Manual UPI / WhatsApp 6-Digit Code Flow
To prevent spoofing of manual UPI payments:
1. Customer initiates manual UPI transfer; order status is placed into `payment_review`.
2. A random, cryptographically secure 6-digit confirmation code (`Math.floor(100000 + Math.random() * 900000)`) is tied to the order and payment record.
3. The customer quotes this 6-digit code or transaction reference in their WhatsApp order message.
4. An authorized store admin must enter or confirm the 6-digit code in the `/admin/orders` panel after verifying receipt in their banking/UPI app.
5. Only upon valid admin confirmation does the status transition to `confirmed`.

---

## 5. Input Validation & Defense-in-Depth

- **Zod Schemas**: Every Server Action and API Route parses user inputs with Zod (`addressSchema`, `checkoutSchema`, `customRequestSchema`, `reviewSchema`).
- **Sanitization**: String inputs undergo whitespace trimming and HTML escaping to prevent XSS.
- **SQL Injection Prevention**: Supabase parameterizes all queries; no raw string interpolation in SQL queries.
- **HTTP Security Headers**: Next.js configuration enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and Content Security Policy (CSP) guidelines.
