import { getCommunicationStrengthPack } from '../data/communication-strength.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=61';
import { getSpeechLanguage } from '../data/language-content-extended.js?v=2';

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

export function renderCommunicationStrength(root, store) {
  const state = store.getState();
  const items = getCommunicationStrengthPack(state.learningLanguage, state.nativeLanguage);
  const voice = getSpeechLanguage(state.learningLanguage);
  const progressKey = `${state.learningLanguage}|${state.nativeLanguage}`;
  const saved = state.progress?.communicationStrength?.[progressKey];
  let index = Math.min(Math.max(Number(saved?.currentIndex) || 0, 0), Math.max(items.length - 1, 0));
  let revealed = false;
  let pendingSpeechTimer = null;

  const save = () => store.saveProgress?.('communicationStrength', progressKey, { currentIndex: index, total: items.length });
  const clearPendingSpeech = () => {
    if (pendingSpeechTimer !== null) {
      window.clearTimeout(pendingSpeechTimer);
      pendingSpeechTimer = null;
    }
  };

  const say = text => {
    if (!store.getState().audioOn) return;
    try { speak(text, voice); } catch (_) { /* audio must never block learning */ }
  };

  function leave() {
    clearPendingSpeech();
    stopSpeech();
    save();
    store.setState({ screen: 'menu' });
  }

  function render() {
    const item = items[index];
    if (!item) { leave(); return; }
    root.innerHTML = `<section class="screen communication-strength-screen"><button class="menu-button" data-menu>Menu</button><div class="center communication-strength-view">
      <p class="kicker">Speak Strong · ${index + 1} / ${items.length}</p>
      <h1>Say it stronger.</h1>
      <div class="communication-card communication-original">
        <p class="communication-target">${escapeHtml(item.weak)}</p>
        <p class="communication-translation">${escapeHtml(item.weakTranslation)}</p>
        <button class="secondary-button" data-listen-original>🔊 Listen</button>
      </div>
      ${revealed ? `<p class="communication-instead">Say instead:</p>
      <div class="communication-card communication-strong">
        <p class="communication-target">${escapeHtml(item.strong)}</p>
        <p class="communication-translation">${escapeHtml(item.strongTranslation)}</p>
        <button class="secondary-button" data-listen-strong>🔊 Listen</button>
      </div>
      <div class="communication-actions"><button class="secondary-button" data-prev ${index === 0 ? 'disabled' : ''}>←</button><button class="primary-button" data-next>${index === items.length - 1 ? 'Again' : 'Next →'}</button></div>` : `<button class="primary-button" data-reveal>Say instead →</button>`}
    </div></section>`;

    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-listen-original]').onclick = () => say(item.weak);
    const reveal = root.querySelector('[data-reveal]');
    if (reveal) reveal.onclick = () => {
      revealed = true;
      render();
      clearPendingSpeech();
      pendingSpeechTimer = window.setTimeout(() => {
        pendingSpeechTimer = null;
        if (store.getState().screen === 'communication-strength') say(item.strong);
      }, 120);
    };
    const listenStrong = root.querySelector('[data-listen-strong]');
    if (listenStrong) listenStrong.onclick = () => say(item.strong);
    const prev = root.querySelector('[data-prev]');
    if (prev) prev.onclick = () => {
      clearPendingSpeech();
      stopSpeech();
      index = Math.max(0, index - 1);
      revealed = false;
      save();
      render();
    };
    const next = root.querySelector('[data-next]');
    if (next) next.onclick = () => {
      clearPendingSpeech();
      stopSpeech();
      index = index === items.length - 1 ? 0 : index + 1;
      revealed = false;
      save();
      render();
    };
  }

  render();
}
