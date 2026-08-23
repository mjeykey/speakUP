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
  await page.locator('[data-mode="words"]').click();
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
  await page.locator('[data-mode="memory"]').click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.memory-screen')).toBeVisible();
  await expect(page.locator('.memory-card')).toHaveCount(8);
});

test('anxiety exercise advances and returns to menu', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-mode="anxiety"]').click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.anxiety-world-screen')).toBeVisible();
  const first = await page.locator('.story-copy').first().textContent();
  await page.locator('[data-next]').click();
  await expect(page.locator('.story-copy').first()).not.toHaveText(first || '');
  await page.locator('[data-menu]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();
});

test('story starts and moves to second phase', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-mode="story"]').click();
  await page.locator('[data-stories] button').first().click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.story-screen')).toBeVisible();
  await expect(page.locator('[data-prev]')).toBeDisabled();
  await page.locator('[data-next]').click();
  await expect(page.locator('.story-progress')).toContainText('Seite 2');
});

test('emotions opens an exercise', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-mode="emotions"]').click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.emotions-screen')).toBeVisible();
  await page.locator('[data-i]').first().click();
  await expect(page.locator('[data-answer]').first()).toBeVisible();
});

test('L2 opens a selected topic and advances', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-level="l2"]').click();
  await page.locator('[data-l2-topic]').first().click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.l2-screen')).toBeVisible();
  const first = await page.locator('.knowledge-term').textContent();
  await page.locator('[data-next]').click();
  await expect(page.locator('.knowledge-term')).not.toHaveText(first || '');
});

test('L3 opens a selected topic and advances', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-level="l3"]').click();
  await page.locator('[data-l3-topic]').first().click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.l3-screen')).toBeVisible();
  const first = await page.locator('.knowledge-term').textContent();
  await page.locator('[data-next]').click();
  await expect(page.locator('.knowledge-term')).not.toHaveText(first || '');
});

test('effects settings changes a mode effect', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-effects]').click();
  await expect(page.locator('.effects-settings-screen')).toBeVisible();
  const choice = page.locator('[data-effect]').nth(1);
  await choice.click();
  await expect(choice).toHaveClass(/selected/);
});

test('story audio assets are local and diagnostic UI is absent', async ({ page }) => {
  await openMenu(page);
  const audioPaths = await page.evaluate(async () => {
    const module = await import('/src/audio/story-sfx.js');
    return ['rain', 'bell', 'door-creak'].map(name => module.getStorySfxSrc(name));
  });
  expect(audioPaths[0]).toContain('/assets/audio/rain-natural-mobile.mp3');
  expect(audioPaths[1]).toContain('/assets/audio/soundreality-tsar-bell-sound-simulation-292699.mp3');
  expect(audioPaths[2]).toContain('/assets/audio/freesound_community-heavy-metal-door-74594.mp3');
  await expect(page.locator('#speakup-door-diagnostic')).toHaveCount(0);
});
