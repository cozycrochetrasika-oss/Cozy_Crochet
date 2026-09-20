import { test, expect } from '@playwright/test';

test.describe('Cozy_Crochets Storefront End-to-End Suite', () => {
  test('1. Homepage loads hero, exact copy, announcement bar, and store metrics', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Cozy_Crochets/i);

    // Announcement bar
    await expect(page.locator('text=Every loop carries care, warmth, and handmade magic.').first()).toBeVisible();

    // Cinematic hero exact headline, subheading, CTAs
    await expect(page.locator('text=Handmade with yarn.').first()).toBeVisible();
    await expect(page.locator('text=Made with love.').first()).toBeVisible();
    await expect(page.locator('text=Unique crochet pieces made one stitch at a time.').first()).toBeVisible();
    await expect(page.locator('text=Explore Collection').first()).toBeVisible();
    await expect(page.locator('text=Request Custom Crochet').first()).toBeVisible();

    // Store metrics with DEMO badges
    await expect(page.locator('text=1,420+').first()).toBeVisible();
    await expect(page.locator('text=DEMO').first()).toBeVisible();

    // Seeded reviews with Demo Review badge
    await expect(page.locator('text=Demo Review').first()).toBeVisible();
  });

  test('2. Product card emphasizes bold labels and values', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Item Name:').first()).toBeVisible();
    await expect(page.locator('text=Item Quantity:').first()).toBeVisible();
    await expect(page.locator('text=Item Price:').first()).toBeVisible();
  });

  test('3. Shop catalog displays products and filters by category', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.locator('h1')).toContainText('The Artisan Collection');
    await expect(page.locator('text=Crochet Bag').first()).toBeVisible();
    await expect(page.locator('text=Crochet Bouquet').first()).toBeVisible();

    // Click Flowers category filter
    await page.click('button:has-text("Flowers")');
    await expect(page.locator('text=Crochet Rose').first()).toBeVisible();
    await expect(page.locator('text=Crochet Sunflower').first()).toBeVisible();
  });

  test('4. Product detail renders modal view, 5-slot gallery, pricing in INR', async ({ page }) => {
    await page.goto('/product/crochet-bag');
    await expect(page.locator('h1#product-title')).toContainText('Crochet Bag');
    await expect(page.locator('text=₹1,499').first()).toBeVisible();
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
  });

  test('5. Multi-step checkout flow from review to confirmation receipt', async ({ page }) => {
    // 1. Log in first as demo customer
    await page.goto('/login');
    await page.click('button:has-text("Customer")');

    // 2. Add product to bag
    await page.goto('/product/crochet-bag');
    await page.click('button:has-text("Add to Bag")');
    await expect(page.locator('text=Added to Bag!')).toBeVisible();

    // 3. Go to checkout stepper
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Multi-Step Checkout');

    // Step 1 -> Step 2
    await page.click('button:has-text("Continue to Contact Info")');

    // Step 2: Fill contact details
    await page.fill('input[placeholder*="Aarti"]', 'Test Customer');
    await page.fill('input[type="tel"]', '+91 98765 43210');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button:has-text("Proceed to Address & Map")');

    // Step 3: Address & Map
    await page.fill('input[placeholder*="Flat"]', '402 Lotus Lane');
    await page.fill('input[placeholder*="Pune"]', 'Pune');
    await page.fill('input[placeholder*="Maharashtra"]', 'Maharashtra');
    await page.click('button:has-text("Proceed to Payment")');

    // Step 4: Payment
    await page.click('button:has-text("Create Demo Order")');

    // Step 5: Confirmation
    await expect(page.locator('text=Order Registered')).toBeVisible();
    await expect(page.locator('text=Manual UPI & WhatsApp Verification')).toBeVisible();
    await expect(page.locator('text=Send WhatsApp Confirmation')).toBeVisible();
  });

  test('6. Forged admin role cookie cannot authorize protected routes', async ({ page, context }) => {
    await context.addCookies([{ name: 'cozy_auth_role', value: 'admin', domain: 'localhost', path: '/' }]);
    await page.goto('/admin/orders');
    await expect(page).toHaveURL(/\/login\?.*admin_access_required/);
    const response = await page.request.post('/api/auth/admin/change-password', {
      headers: { origin: 'http://localhost:3000' },
      data: { currentPassword: 'invalid', newPassword: 'InvalidPass123!' },
    });
    expect(response.status()).toBe(401);
  });

  test('7. Custom crochet portal submits bespoke inquiries', async ({ page }) => {
    await page.goto('/customize');
    await expect(page.locator('h1')).toContainText('Bespoke Custom Crochet');

    await page.fill('input#custom-name', 'Ananya Deshmukh');
    await page.fill('input#custom-phone', '+91 98220 12345');
    await page.fill('input#custom-email', 'ananya@example.com');
    await page.fill('input#custom-colors', 'Dusty Rose and Cream');
    await page.fill('input#custom-size', '12 inch bouquet');
    await page.fill('textarea#custom-desc', 'Custom wedding anniversary bouquet with roses and sunflowers.');

    await page.click('button:has-text("Submit Bespoke Request")');
    await expect(page.locator('text=Bespoke Request Received!')).toBeVisible();
  });
});
