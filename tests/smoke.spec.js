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

test('selecting the same language swaps the pair instead of creating an invalid pair', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-native]').selectOption('en-GB');
  await page.locator('[data-learning]').selectOption('en-GB');
  await expect(page.locator('[data-learning]')).toHaveValue('en-GB');
  await expect(page.locator('[data-native]')).toHaveValue('pt-PT');
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

test('sentences fills the word, glows, and dissolves with the selected sentence effect', async ({ page }) => {
  await openMenu(page);
  await page.evaluate(() => localStorage.setItem('speakup-text-effect:sentences', 'glow'));
  await page.locator('[data-mode="fill-gap"]').click();
  await expect(page.locator('.sentence-level-view')).toBeVisible();
  await expect(page.locator('.sentence-level-view')).toContainText('Escolhe o teu nível');
  await page.locator('[data-level="beginner"]').click();
  await expect(page.locator('.sentence-mode-view')).toBeVisible();
  const correct = page.locator('.choice').filter({ hasText: 'drink' });
  await expect(correct).toBeVisible();
  await correct.click();
  await expect(page.locator('[data-filled-answer]')).toHaveText('drink');
  await expect(page.locator('[data-filled-answer]')).toHaveClass(/sentence-filled-answer-glow/);
  await expect(page.locator('[data-sentence]')).toHaveAttribute('data-effect','glow');
  await expect(page.locator('[data-sentence]')).toContainText('I drink coffee every morning.');
  await expect(page.locator('[data-sentence]')).not.toContainText('I drink coffee every morning.', { timeout: 10000 });
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
  await expect(page.locator('.anxiety-world-screen .translation')).not.toBeEmpty();
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
  await expect(page.locator('.story-progress')).toContainText('Página 1');
  await expect(page.locator('[data-prev]')).toBeDisabled();
  await expect(page.locator('[data-beginning]')).toContainText('Início');

  await page.locator('[data-next]').click();
  await expect(page.locator('.story-progress')).toContainText('Página 2');
  await page.locator('[data-menu]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();

  await page.locator('[data-start]').click();
  await expect(page.locator('.story-screen')).toBeVisible();
  await expect(page.locator('.story-progress')).toContainText('Página 2');

  await page.locator('[data-beginning]').click();
  await expect(page.locator('.story-progress')).toContainText('Página 1');
  await expect(page.locator('[data-prev]')).toBeDisabled();
});

test('emotions fills the correct word, glows, then dissolves with the selected effect', async ({ page }) => {
  await openMenu(page);
  await page.evaluate(() => localStorage.setItem('speakup-text-effect:emotions', 'glow'));
  await page.locator('[data-mode="emotions"]').click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.emotions-screen')).toBeVisible();
  await expect(page.locator('[data-i]').first()).toContainText('zanga');
  await expect(page.locator('[data-i]').first()).toHaveAttribute('data-speech-language','en-GB');
  await expect(page.locator('[data-i]').first().locator('.emotion-card-support')).toHaveAttribute('data-speech-language','pt-PT');
  await page.locator('[data-i]').first().click();
  await expect(page.locator('[data-answer]').first()).toBeVisible();
  await expect(page.locator('.emotion-journey')).toContainText('Palavras');
  await expect(page.locator('.emotion-journey')).toContainText('Repetir');
  await expect(page.locator('.emotion-journey')).toContainText('Mini-exercício');
  await expect(page.locator('.emotion-current-translation')).toContainText('zanga');
  await expect(page.locator('.emotion-current')).toHaveAttribute('data-speech-language','en-GB');
  await expect(page.locator('.emotion-current-translation')).toHaveAttribute('data-speech-language','pt-PT');
  await expect(page.locator('.emotion-word-support').first()).toContainText('zangado');
  await expect(page.locator('.emotion-gap-support')).not.toBeEmpty();
  await expect(page.locator('.emotion-repeat-card')).toHaveAttribute('data-speech-language','en-GB');
  await expect(page.locator('.emotion-repeat-card .emotion-support-sentence')).toHaveAttribute('data-speech-language','pt-PT');
  await expect(page.locator('.emotion-gap-support')).toHaveAttribute('data-speech-language','pt-PT');
  await expect(page.locator('[data-answer="am"]')).toContainText('sou / estou');
  await expect(page.locator('[data-answer="am"]')).toHaveAttribute('data-speech-language','en-GB');
  await expect(page.locator('[data-answer="am"] .emotion-word-support')).toHaveAttribute('data-speech-language','pt-PT');
  await page.locator('[data-answer="am"] .emotion-word-support').click();
  await expect(page.locator('[data-emotion-gap-sentence]')).toContainText('I ___ angry right now.');
  await page.locator('[data-answer="am"]').click();
  await expect(page.locator('[data-filled-answer]')).toHaveText('am');
  await expect(page.locator('[data-filled-answer]')).toHaveClass(/emotion-filled-answer-glow/);
  await expect(page.locator('[data-emotion-gap-sentence]')).toHaveAttribute('data-effect','glow');
  await expect(page.locator('[data-emotion-gap-sentence]')).toContainText('I am angry right now.');
  await expect(page.locator('[data-emotion-gap-sentence]')).toContainText('I ___ a minute before I answer.', { timeout: 10000 });
  await expect(page.locator('.emotion-gap-support')).toContainText('Preciso de um minuto antes de responder.');
  await expect(page.locator('[data-answer="need"]')).toContainText('preciso');
  await expect(page.locator('[data-next]')).toHaveText('Próxima frase');
});

test('repeat practice retries, then simplifies, then uses a very different phrasing', async ({ page }) => {
  await page.addInitScript(() => {
    window.SpeechRecognition = class {
      abort() {}
      start() { window.setTimeout(() => this.onerror?.({ error:'no-speech' }), 10); }
    };
  });
  await openMenu(page);
  await expect(page.locator('[data-mode="repeat-practice"]')).toContainText('Repetir');
  await page.locator('[data-mode="repeat-practice"]').click();
  await page.locator('[data-start]').click();
  await page.locator('[data-repeat-category]').first().click();

  const original = await page.locator('[data-repeat-learning]').textContent();

  await page.locator('[data-speak]').click();
  await expect(page.locator('[data-repeat-learning]')).toHaveText(original || '');
  await expect(page.locator('.speak-feedback')).toContainText('exatamente a mesma frase');

  await page.locator('[data-speak]').click();
  const simple = await page.locator('[data-repeat-learning]').textContent();
  expect(simple).not.toBe(original);
  await expect(page.locator('.speak-feedback')).toContainText('um pouco diferente');

  await page.locator('[data-speak]').click();
  const different = await page.locator('[data-repeat-learning]').textContent();
  expect(different).not.toBe(simple);
  await expect(page.locator('[data-repeat-learning]')).toContainText('What I mean is:');
  await expect(page.locator('.speak-feedback')).toContainText('completamente diferente');
});

test('communication shows large original and alternative sentences with both audio languages', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-mode="communication-strength"]').click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.communication-strength-screen')).toBeVisible();
  await expect(page.locator('[data-say-original]')).toBeVisible();
  await expect(page.locator('[data-say-original]')).toHaveAttribute('data-speech-language','en-GB');
  await expect(page.locator('[data-say-original-native]')).toHaveAttribute('data-speech-language','pt-PT');
  await page.locator('[data-reveal]').click();
  await expect(page.locator('[data-say-strong]')).toBeVisible();
  await expect(page.locator('[data-say-strong]')).toHaveAttribute('data-speech-language','en-GB');
  await expect(page.locator('[data-say-strong-native]')).toHaveAttribute('data-speech-language','pt-PT');
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
  await expect(page.locator('.knowledge-term')).toHaveAttribute('data-speech-language','en-GB');
  await expect(page.locator('.knowledge-translation')).toHaveAttribute('data-speech-language','pt-PT');
  await expect(page.locator('.knowledge-fact')).toHaveAttribute('data-speech-language','en-GB');
  await expect(page.locator('.knowledge-fact-translation')).toHaveAttribute('data-speech-language','pt-PT');
  await expect(page.locator('.knowledge-explanation')).toHaveAttribute('data-speech-language','en-GB');
  await expect(page.locator('.knowledge-explanation-translation')).toHaveAttribute('data-speech-language','pt-PT');
  await expect(page.locator('[data-next]')).toHaveText('Seguinte');
  const first = await page.locator('.knowledge-term').textContent();
  await page.locator('[data-next]').click();
  await expect(page.locator('.knowledge-term')).not.toHaveText(first || '');
});

test('effects settings changes a mode effect', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-effects]').click();
  await expect(page.locator('.effects-settings-screen')).toBeVisible();
  await expect(page.locator('.effects-settings-screen')).toContainText('Efeitos');
  await expect(page.locator('.effects-settings-screen')).toContainText('Pré-visualizar');
  await expect(page.locator('[data-mode-card="emotions"]')).toContainText('Emoções');
  const choice = page.locator('[data-effect]').nth(1);
  await choice.click();
  await expect(choice).toHaveClass(/selected/);
});

test('future screen follows the native language', async ({ page }) => {
  await openMenu(page);
  await page.locator('[data-future]').click();
  await expect(page.locator('.future-screen')).toBeVisible();
  await expect(page.locator('.future-screen')).toContainText('Mais tarde');
  await expect(page.locator('.future-screen')).toContainText('Simulação de conversa');
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


test('rain-marked fantasy scenes are enabled for rain', async ({ page }) => {
  await openMenu(page);
  const source = await page.evaluate(async () => {
    const response = await fetch(new URL('src/modules/story-live.js?v=299', window.location.href));
    return response.text();
  });
  expect(source).toContain("story.pages[sourcePage]?.sound==='rain'");
  expect(source).toContain("sourcePage<=2");
});
