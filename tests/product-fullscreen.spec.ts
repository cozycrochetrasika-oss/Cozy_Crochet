import { test, expect } from '@playwright/test';

const DESKTOP_VIEWPORTS = [
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

const MOBILE_TABLET_VIEWPORTS = [
  { name: '768x1024 (Tablet)', width: 768, height: 1024 },
  { name: '375x812 (Mobile)', width: 375, height: 812 },
  { name: '390x844 (Mobile)', width: 390, height: 844 },
  { name: '430x932 (Mobile)', width: 430, height: 932 },
];

test.describe('Full-Screen Product Detail View & Scroll Verification', () => {
  // Test across all desktop viewports
  for (const vp of DESKTOP_VIEWPORTS) {
    test(`Desktop ${vp.name}: Full-screen dimensions, sticky toolbar, wheel scroll & reviews`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // 1. Direct URL load
      await page.goto('/product/crochet-bouquet');
      await expect(page.locator('h1#product-title')).toHaveText('Crochet Bouquet');

      // 2. Full-screen validation: overlay covers 100% of viewport
      const dialog = page.locator('div[role="dialog"]');
      await expect(dialog).toBeVisible();
      const box = await dialog.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.x).toBe(0);
        expect(box.y).toBe(0);
        expect(box.width).toBe(vp.width);
        expect(box.height).toBe(vp.height);
      }

      // 3. Body scroll locking
      const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
      expect(bodyOverflow).toBe('hidden');

      // 4. Sticky top toolbar elements
      await expect(page.locator('button[aria-label="Back to catalogue"]')).toBeVisible();
      await expect(page.locator('text=Home').first()).toBeVisible();
      await expect(page.locator('text=Shop').first()).toBeVisible();
      await expect(page.locator('button[aria-label="Minimize full-screen product view"]')).toBeVisible();
      await expect(page.locator('button[aria-label="Close product view (Escape)"]')).toBeVisible();

      // 5. Scroll container properties (data-lenis-prevent)
      const scrollContainer = page.locator('div[data-lenis-prevent]');
      await expect(scrollContainer).toBeVisible();

      // Initial scroll position should be 0
      const initialScroll = await scrollContainer.evaluate((el) => el.scrollTop);
      expect(initialScroll).toBe(0);

      // 6. Wheel scrolling anywhere over product content
      // Hover over the product gallery (left side) and trigger wheel scroll
      await page.mouse.move(vp.width * 0.3, vp.height * 0.5);
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(400);

      const scrolledPos = await scrollContainer.evaluate((el) => el.scrollTop);
      expect(scrolledPos).toBeGreaterThan(100);

      // 7. Normal vertical scrolling reaches Reviews section
      const reviewsHeading = page.locator('h2:has-text("Customer Reviews")');
      await reviewsHeading.scrollIntoViewIfNeeded();
      await expect(reviewsHeading).toBeVisible();

      // Verify review stars and form exist
      await expect(page.locator('text=Write a Review')).toBeVisible();

      // 8. Reaches Related Products section
      const relatedSection = page.locator('h2:has-text("You May Also Love")');
      await expect(relatedSection).toBeVisible();

      // 9. Zero console errors
      const criticalErrors = consoleErrors.filter(
        (err) => !err.includes('favicon') && !err.includes('WebGL')
      );
      expect(criticalErrors).toHaveLength(0);
    });
  }

  // Test mobile and tablet viewports
  for (const vp of MOBILE_TABLET_VIEWPORTS) {
    test(`Mobile/Tablet ${vp.name}: Full-screen responsiveness and touch scrolling`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      await page.goto('/product/crochet-bouquet');
      await expect(page.locator('h1#product-title')).toHaveText('Crochet Bouquet');

      const dialog = page.locator('div[role="dialog"]');
      const box = await dialog.boundingBox();
      expect(box).not.toBeNull();
      const win = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
      if (box) {
        expect(Math.abs(box.width - win.w)).toBeLessThanOrEqual(25);
        expect(Math.abs(box.height - win.h)).toBeLessThanOrEqual(25);
      }

      // Verify scroll container
      const scrollContainer = page.locator('div[data-lenis-prevent]');
      await expect(scrollContainer).toBeVisible();

      // Scroll container down
      await scrollContainer.evaluate((el) => {
        el.scrollTop = 500;
      });
      await page.waitForTimeout(200);

      const scrollTop = await scrollContainer.evaluate((el) => el.scrollTop);
      expect(scrollTop).toBeGreaterThan(0);

      // Verify action buttons
      await expect(page.locator('button:has-text("Add to Bag")').first()).toBeVisible();
      await expect(page.locator('a:has-text("Ask Artisan via WhatsApp")').first()).toBeVisible();
    });
  }

  test('Escape key closes product view and restores body scroll', async ({ page }) => {
    // Start at /shop so history has a previous page
    await page.goto('/shop');
    await page.locator('a[href="/product/crochet-bouquet"]').first().click();
    await page.waitForURL('**/product/crochet-bouquet');

    // Body should be locked
    let bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('hidden');

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    // Should navigate back or close
    expect(page.url()).toContain('/shop');

    // Body scroll restored
    bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('Back button in toolbar returns to shop and restores body scroll', async ({ page }) => {
    await page.goto('/shop');
    await page.locator('a[href="/product/crochet-bouquet"]').first().click();
    await page.waitForURL('**/product/crochet-bouquet');

    await page.click('button[aria-label="Back to catalogue"]');
    await page.waitForTimeout(400);

    expect(page.url()).toContain('/shop');
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('Close (X) button closes overlay and restores body scroll', async ({ page }) => {
    await page.goto('/shop');
    await page.locator('a[href="/product/crochet-bouquet"]').first().click();
    await page.waitForURL('**/product/crochet-bouquet');

    await page.click('button[aria-label="Close product view (Escape)"]');
    await page.waitForTimeout(400);

    expect(page.url()).toContain('/shop');
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('Minimize button closes overlay gracefully', async ({ page }) => {
    await page.goto('/shop');
    await page.locator('a[href="/product/crochet-bouquet"]').first().click();
    await page.waitForURL('**/product/crochet-bouquet');

    await page.click('button[aria-label="Minimize full-screen product view"]');
    await page.waitForTimeout(400);

    expect(page.url()).toContain('/shop');
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('5-slot media gallery and product features work seamlessly', async ({ page }) => {
    // Log in as demo customer to allow add-to-bag without auth redirect
    await page.goto('/login');
    await page.click('button:has-text("Customer")');

    await page.goto('/product/crochet-bouquet');

    // 1. Gallery thumbs exist
    const thumbs = page.locator('button[aria-label^="Select media item"]');
    const thumbCount = await thumbs.count();
    expect(thumbCount).toBeGreaterThanOrEqual(1);

    // 2. Rupee price formatted in INR
    await expect(page.locator('text=₹1,999').first()).toBeVisible();

    // 3. Stock badge
    await expect(page.locator('text=In Stock').first()).toBeVisible();

    // 4. Quantity stepper works
    const qtySpan = page.locator('span.tabular-nums').first();
    await expect(qtySpan).toHaveText('1');
    await page.click('button[aria-label="Increase quantity"]');
    await expect(qtySpan).toHaveText('2');
    await page.click('button[aria-label="Decrease quantity"]');
    await expect(qtySpan).toHaveText('1');

    // 5. Add to Bag button works
    await page.click('button:has-text("Add to Bag")');
    await expect(page.locator('text=Added to Bag!')).toBeVisible();

    // 6. WhatsApp Inquiry link has correct phone and message
    const whatsappLink = page.locator('a:has-text("Ask Artisan via WhatsApp")');
    await expect(whatsappLink).toBeVisible();
    const href = await whatsappLink.getAttribute('href');
    expect(href).toContain('https://wa.me/916000989651');
    expect(href).toContain('Crochet%20Bouquet');

    // 7. Specifications table exists
    await expect(page.locator('text=Artisan Specifications & Yarn Care')).toBeVisible();
    await expect(page.locator('text=100% Certified Organic Milk Cotton Yarn')).toBeVisible();
  });
});
