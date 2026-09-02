import {
  EFFECT_MODES,
  TEXT_EFFECTS,
  explodeText,
  getModeTextEffect,
  setModeTextEffect
} from '../effects/distinct-text-effects.js?v=6';
import { getEffectUiCopy, getExerciseUiCopy } from '../app/ui-language.js?v=4';

export function renderEffectsSettings(root, store) {
  const state = store.getState();
  const ui = getExerciseUiCopy(state.nativeLanguage);
  const effectUi = getEffectUiCopy(state.nativeLanguage);
  root.innerHTML = `<section class="screen effects-settings-screen">
    <button class="menu-button" data-menu>${ui.menu}</button>
    <div class="center effects-settings-view">
      <p class="kicker">${ui.effects}</p><h1>${ui.chooseEffects}</h1>
      <p class="muted">${ui.effectsHelp}</p>
      <div class="effects-mode-list">${EFFECT_MODES.map(mode => {
        const selected = getModeTextEffect(mode.id);
        return `<article class="effects-mode-card" data-mode-card="${mode.id}"><div class="effects-mode-heading"><div><h2>${effectUi.modes[mode.id]}</h2><p>${mode.preview}</p></div><button class="secondary-button effects-preview-button" data-preview="${mode.id}">${ui.preview}</button></div><div class="effects-preview-text" data-preview-text="${mode.id}">${mode.preview}</div><div class="effects-choice-grid">${TEXT_EFFECTS.map(effect => `<button class="effects-choice ${selected === effect.id ? 'selected' : ''}" data-mode="${mode.id}" data-effect="${effect.id}">${effectUi.effects[effect.id]}</button>`).join('')}</div></article>`;
      }).join('')}</div>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => store.setState({ screen: 'menu' });
  root.querySelectorAll('[data-effect]').forEach(button => {
    button.onclick = () => {
      const mode = button.dataset.mode;
      setModeTextEffect(mode, button.dataset.effect);
      root.querySelectorAll(`[data-mode="${mode}"]`).forEach(option => option.classList.toggle('selected', option === button));
    };
  });
  root.querySelectorAll('[data-preview]').forEach(button => {
    button.onclick = async () => {
      const mode = button.dataset.preview;
      const source = EFFECT_MODES.find(item => item.id === mode)?.preview || 'SpeakUP';
      const target = root.querySelector(`[data-preview-text="${mode}"]`);
      if (!target || button.disabled) return;
      button.disabled = true;
      try {
        await explodeText(target, getModeTextEffect(mode), { duration: 1750, stagger: 24 });
      } catch (error) {
        console.warn('Effect preview failed.', error);
      } finally {
        target.textContent = source;
        button.disabled = false;
      }
    };
  });
}
