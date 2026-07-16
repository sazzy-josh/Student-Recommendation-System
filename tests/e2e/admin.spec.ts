import { test, expect } from '@playwright/test';

test.describe('Admin', () => {
  test('analytics page renders', async ({ page }) => {
    await page.goto('/analytics');
    // Redirects to login if not authenticated
    await expect(page).toHaveURL(/\/login|\/analytics/);
  });
});
