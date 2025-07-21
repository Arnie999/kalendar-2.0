import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display main heading and features', async ({ page }) => {
    await page.goto('/');

    // Check main heading
    await expect(page.locator('h1')).toContainText('Edward-Kalendář');

    // Check feature cards
    await expect(page.locator('text=Kalendář')).toBeVisible();
    await expect(page.locator('text=Týmy')).toBeVisible();
    await expect(page.locator('text=Časové zóny')).toBeVisible();
    await expect(page.locator('text=Analytika')).toBeVisible();

    // Check buttons
    await expect(page.locator('text=Začít používat')).toBeVisible();
    await expect(page.locator('text=Více informací')).toBeVisible();
  });

  test('should have proper meta information', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Edward-Kalendář/);
  });
}); 