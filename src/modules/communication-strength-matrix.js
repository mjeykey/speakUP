import { getCommunicationStrengthMatrix } from '../data/communication-strength/matrix.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getSpeechLanguage } from '../data/language-content-matrix.js?v=1';

function esc(v) {
  return String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

export function renderCommunicationStrength(root, store) {
  const state = store.getState();
  const items = getCommunicationStrengthMatrix(state.learningLanguage, state.nativeLanguage);
  const voice = getSpeechLanguage(state.learningLanguage);
  let index = Math.min(state.currentIndex || 0, Math.max(0, items.length - 1));
  let revealed = false;

  const say = text => {
    if (!store.getState().audioOn) return;
    try { speak(text, voice); } catch (_) {}
  };

  const leave = () => {
    stopSpeech();
    store.setState({ screen:'menu', currentIndex:0 });
  };

  function draw() {
    const item = items[index];
    if (!item) { leave(); return; }
    root.innerHTML = `<section class="screen communication-strength-screen"><button class="menu-button" data-menu>Menu</button><div class="center communication-strength-view">
      <p class="kicker">Communication · ${index + 1} / ${items.length}</p>
      <h1>Say it better.</h1>
      <div class="communication-card communication-original"><p class="communication-target">${esc(item.weak)}</p><p class="communication-translation">${esc(item.weakTranslation)}</p><button class="secondary-button" data-listen-original>🔊 Listen</button></div>
      ${revealed ? `<p class="communication-instead">Say instead:</p><div class="communication-card communication-strong"><p class="communication-target">${esc(item.strong)}</p><p class="communication-translation">${esc(item.strongTranslation)}</p><button class="secondary-button" data-listen-strong>🔊 Listen</button></div><div class="communication-actions"><button class="secondary-button" data-prev ${index === 0 ? 'disabled' : ''}>←</button><button class="primary-button" data-next>${index === items.length - 1 ? 'Again' : 'Next →'}</button></div>` : `<button class="primary-button" data-reveal>Say instead →</button>`}
    </div></section>`;

    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-listen-original]').onclick = () => say(item.weak);
    root.querySelector('[data-reveal]')?.addEventListener('click', () => { revealed = true; draw(); window.setTimeout(() => say(item.strong), 120); });
    root.querySelector('[data-listen-strong]')?.addEventListener('click', () => say(item.strong));
    root.querySelector('[data-prev]')?.addEventListener('click', () => { stopSpeech(); index = Math.max(0, index - 1); revealed = false; draw(); });
    root.querySelector('[data-next]')?.addEventListener('click', () => { stopSpeech(); index = index === items.length - 1 ? 0 : index + 1; revealed = false; draw(); });
  }

  draw();
}
