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
  await page.goto('./');
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

test('menu and language selectors follow the selected native language', async ({ page }) => {
  await openMenu(page);
  const panel = page.locator('.menu-panel');

  await expect(panel).toContainText('Exercício');
  await expect(page.locator('[data-learning] option[value="en-GB"]')).toContainText('Inglês');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');

  await page.locator('[data-native]').selectOption('de-DE');
  await expect(panel).toContainText('Übung');
  await expect(panel).toContainText('Einstellungen');
  await expect(page.locator('[data-learning] option[value="en-GB"]')).toContainText('Englisch');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de-DE');

  await page.locator('[data-native]').selectOption('fr-FR');
  await expect(panel).toContainText('Exercice');
  await expect(panel).toContainText('Paramètres');
  await expect(page.locator('[data-learning] option[value="de-DE"]')).toContainText('Allemand');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr-FR');
});

test('words advances and returns to menu', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-mode="words"]').click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.words-screen')).toBeVisible();
  await expect(page.locator('.words-screen')).toContainText('Palavras');
  await expect(page.locator('[data-next]')).toHaveText('Seguinte');
  const first = await page.locator('.single-word').textContent();
  await page.locator('[data-next]').click();
  await expect(page.locator('.single-word')).not.toHaveText(first || '');
  await page.locator('[data-menu]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();
});

test('sentences opens localized level selection and exercise', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-mode="fill-gap"]').click();
  await expect(page.locator('.sentence-level-view')).toBeVisible();
  await expect(page.locator('.sentence-level-view')).toContainText('Escolhe o teu nível');
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
  await expect(page.locator('.anxiety-world-screen')).toContainText('Linguagem para o momento');
  await expect(page.locator('.anxiety-world-screen')).toContainText('Ouve, repete e depois completa.');
  await expect(page.locator('[data-listen]')).toContainText('Ouvir');
  await expect(page.locator('[data-next]')).toContainText('Próxima frase');
  const first = await page.locator('.story-copy').first().textContent();
  await page.locator('[data-next]').click();
  await expect(page.locator('.story-copy').first()).not.toHaveText(first || '');
  await page.locator('[data-menu]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();
});

test('story starts at beginning, resumes, and offers a Beginning button', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-mode="story"]').click();
  await page.locator('[data-stories] button').first().click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.story-screen')).toBeVisible();
  await expect(page.locator('.story-progress')).toContainText('Seite 1');
  await expect(page.locator('[data-prev]')).toBeDisabled();
  await expect(page.locator('[data-beginning]')).toContainText('Beginning');

  await page.locator('[data-next]').click();
  await expect(page.locator('.story-progress')).toContainText('Seite 2');
  await page.locator('[data-menu]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();

  await page.locator('[data-start]').click();
  await expect(page.locator('.story-screen')).toBeVisible();
  await expect(page.locator('.story-progress')).toContainText('Seite 2');

  await page.locator('[data-beginning]').click();
  await expect(page.locator('.story-progress')).toContainText('Seite 1');
  await expect(page.locator('[data-prev]')).toBeDisabled();
});

test('emotions opens an exercise', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-mode="emotions"]').click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.emotions-screen')).toBeVisible();
  await page.locator('[data-i]').first().click();
  await expect(page.locator('[data-answer]').first()).toBeVisible();
  await expect(page.locator('.emotion-journey')).toContainText('Palavras');
  await expect(page.locator('.emotion-journey')).toContainText('Repetir');
  await expect(page.locator('.emotion-journey')).toContainText('Mini-exercício');
  await expect(page.locator('[data-next]')).toHaveText('Próxima frase');
});

test('L2 opens a selected topic and advances', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-level="l2"]').click();
  await page.locator('[data-l2-topic]').first().click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.l2-screen')).toBeVisible();
  await expect(page.locator('.knowledge-level')).toContainText('Aprende através do que gostas');
  await expect(page.locator('[data-next]')).toHaveText('Seguinte');
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
  await expect(page.locator('.knowledge-level')).toContainText('Aprende sobre o mundo');
  await expect(page.locator('.knowledge-explanation-label')).toContainText('O que significa exatamente?');
  await expect(page.locator('[data-next]')).toHaveText('Seguinte');
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
    const module = await import(new URL('src/audio/story-sfx.js', window.location.href).href);
    return ['rain', 'bell', 'door-creak', 'glass-break', 'engine-start'].map(name => module.getStorySfxSrc(name));
  });
  expect(audioPaths[0]).toContain('/assets/audio/rain-natural-mobile.mp3');
  expect(audioPaths[1]).toContain('/assets/audio/soundreality-tsar-bell-sound-simulation-292699.mp3');
  expect(audioPaths[2]).toContain('/assets/audio/freesound_community-heavy-metal-door-74594.mp3');
  expect(audioPaths[3]).toContain('/assets/audio/universfield-broken-glass-impact-454859.mp3');
  expect(audioPaths[4]).toContain('/assets/audio/freesound_community-electric-motor-engine-start-stop-98304.mp3');
  await expect(page.locator('#speakup-door-diagnostic')).toHaveCount(0);
});
