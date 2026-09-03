import { test, expect } from '@playwright/test';

test('repeat practice shrinks from full sentence to 3, 2, then 1 word and celebrates success', async ({ page }) => {
  await page.addInitScript(() => {
    let attempt = 0;
    window.SpeechRecognition = class {
      abort() {}
      start() {
        attempt += 1;
        window.setTimeout(() => {
          if (attempt <= 3) {
            this.onerror?.({ error:'no-speech' });
            return;
          }
          this.onresult?.({ results:[[{ transcript:'myself' }]] });
          this.onend?.();
        }, 10);
      }
    };
    localStorage.setItem('speakup-progress-v1', JSON.stringify({
      learningLanguage:'en-GB', nativeLanguage:'pt-PT', audioOn:false,
      sentenceAudioOn:false, translationAudioOn:false,
      learningLevel:'l1', mode:'words', progress:{}
    }));
  });

  await page.goto('./');
  await expect(page.locator('.welcome-screen')).toBeVisible();
  await page.locator('[data-start]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();
  await page.locator('[data-mode="repeat-practice"]').click();
  await page.locator('[data-start]').click();
  await page.locator('[data-repeat-category]').first().click();

  const full = await page.locator('[data-repeat-learning]').textContent();
  expect((full || '').trim().split(/\s+/).length).toBeGreaterThan(3);

  await page.locator('[data-speak]').click();
  await expect(page.locator('[data-repeat-learning]')).toHaveText('I accept myself');
  await expect(page.locator('.speak-feedback')).toContainText('três palavras');

  await page.locator('[data-speak]').click();
  await expect(page.locator('[data-repeat-learning]')).toHaveText('accept myself');
  await expect(page.locator('.speak-feedback')).toContainText('duas palavras');

  await page.locator('[data-speak]').click();
  await expect(page.locator('[data-repeat-learning]')).toHaveText('myself');
  await expect(page.locator('.speak-feedback')).toContainText('só esta palavra');

  await page.locator('[data-speak]').click();
  await expect(page.locator('.speak-feedback')).toContainText('Conseguiste');

  await expect(page.locator('[data-repeat-learning]')).not.toHaveText('myself', { timeout:4000 });
});
