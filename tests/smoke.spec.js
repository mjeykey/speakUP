import { test, expect } from '@playwright/test';

test('SpeakUP opens welcome screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.welcome-screen')).toBeVisible();
});
