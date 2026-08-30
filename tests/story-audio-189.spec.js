import { test, expect } from '@playwright/test';

test('page 189 plays the fight crowd audio', async ({ page }) => {
  await page.addInitScript(() => {
    window.__speakupAudioPlays = [];
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__speakupAudioPlays.push(this.src || this.currentSrc || '');
      try {
        this.dispatchEvent(new Event('playing'));
      } catch (_) {}
      return Promise.resolve();
    };
    window.__speakupOriginalMediaPlay = originalPlay;

    localStorage.setItem('speakup-progress-v1', JSON.stringify({
      learningLanguage:'en-GB',
      nativeLanguage:'pt-PT',
      audioOn:true,
      sentenceAudioOn:false,
      translationAudioOn:false,
      learningLevel:'l1',
      mode:'story',
      selectedStory:'fantasy-1',
      progress:{
        story:{
          'fantasy-1|en-GB|pt-PT':{
            storyId:'fantasy-1',
            learningLanguage:'en-GB',
            nativeLanguage:'pt-PT',
            pageIndex:47,
            phaseIndex:0,
            solved:0
          }
        }
      }
    }));
  });

  await page.goto('/');
  await page.locator('[data-start]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();
  await page.locator('[data-start]').click();

  await expect(page.locator('.story-screen')).toBeVisible();
  await expect(page.locator('.story-progress')).toContainText('Seite 189');

  const crowdSrc = await page.evaluate(async () => {
    const module = await import('/src/audio/story-sfx.js?v=test-189');
    return module.getStorySfxSrc('crowd');
  });

  await expect.poll(async () => {
    return page.evaluate(src => window.__speakupAudioPlays.some(value => value === src), crowdSrc);
  }).toBe(true);
});
