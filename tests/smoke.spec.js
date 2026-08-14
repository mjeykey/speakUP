import { test, expect } from '@playwright/test';

async function seed(page) {
  await page.addInitScript(() => {
    localStorage.setItem('speakup-progress-v1', JSON.stringify({
      learningLanguage:'en-GB', nativeLanguage:'pt-PT', audioOn:false,
      sentenceAudioOn:false, translationAudioOn:false,
      learningLevel:'l1', mode:'words', progress:{}
    }));
  });
}

async function openMenu(page) {
  await page.goto('/');
  await expect(page.locator('.welcome-screen')).toBeVisible();
  await page.locator('[data-start]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();
}

test.beforeEach(async ({ page }) => { await seed(page); });

test('menu exposes supported languages only', async ({ page }) => {
  await openMenu(page);
  await expect(page.locator('[data-learning] option')).toHaveCount(8);
  await expect(page.locator('[data-learning] option[value="it-IT"]')).toHaveCount(0);
});

test('words advances and returns to menu', async ({ page }) => {
  await openMenu(page);
  await page.getByRole('button', { name:/^Wörter$/i }).click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.words-screen')).toBeVisible();
  const first = await page.locator('.single-word').textContent();
  await page.locator('[data-next]').click();
  await expect(page.locator('.single-word')).not.toHaveText(first || '');
  await page.locator('[data-menu]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();
});

test('sentences opens level selection and exercise', async ({ page }) => {
  await openMenu(page);
  await page.getByRole('button', { name:/^Sätze/i }).click();
  await expect(page.locator('.sentence-level-view')).toBeVisible();
  await page.locator('[data-level="beginner"]').click();
  await expect(page.locator('.sentence-mode-view')).toBeVisible();
  await expect(page.locator('.choice').first()).toBeVisible();
});

test('memory renders complete board', async ({ page }) => {
  await openMenu(page);
  await page.getByRole('button', { name:/^Memory$/i }).click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.memory-screen')).toBeVisible();
  await expect(page.locator('.memory-card')).toHaveCount(8);
});

test('anxiety progress persists after returning to menu', async ({ page }) => {
  await openMenu(page);
  await page.getByRole('button', { name:/^Anxiety$/i }).click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.anxiety-world-progress')).toHaveText('1 / 300');
  await page.locator('[data-next]').click();
  await expect(page.locator('.anxiety-world-progress')).toHaveText('2 / 300');
  await page.locator('[data-menu]').click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.anxiety-world-progress')).toHaveText('2 / 300');
});

test('story starts and moves to second phase', async ({ page }) => {
  await openMenu(page);
  await page.getByRole('button', { name:/^Geschichten$/i }).click();
  await page.locator('[data-stories] button').first().click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.story-screen')).toBeVisible();
  await expect(page.locator('[data-prev]')).toBeDisabled();
  await page.locator('[data-next]').click();
  await expect(page.locator('.story-progress')).toContainText('Step 2');
});
