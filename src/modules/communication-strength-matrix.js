import { getCommunicationStrengthMatrix } from '../data/communication-strength/matrix.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getSpeechLanguage } from '../data/language-content-matrix.js?v=1';
import { getExerciseUiCopy } from '../app/ui-language.js?v=3';

function esc(v) {
  return String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

export function renderCommunicationStrength(root, store) {
  const state = store.getState();
  const ui = getExerciseUiCopy(state.nativeLanguage);
  const items = getCommunicationStrengthMatrix(state.learningLanguage, state.nativeLanguage);
  const voice = getSpeechLanguage(state.learningLanguage);
  const nativeVoice = getSpeechLanguage(state.nativeLanguage);
  let index = Math.min(state.currentIndex || 0, Math.max(0, items.length - 1));
  let revealed = false;

  const sayLearning = text => {
    if (!store.getState().audioOn) return;
    try { speak(text, voice, { rate:.72 }); } catch (_) {}
  };
  const sayNative = text => {
    if (!store.getState().audioOn) return;
    try { speak(text, nativeVoice, { rate:.62 }); } catch (_) {}
  };

  const leave = () => {
    stopSpeech();
    store.setState({ screen:'menu', currentIndex:0 });
  };

  function draw() {
    const item = items[index];
    if (!item) { leave(); return; }
    root.innerHTML = `<section class="screen communication-strength-screen"><button class="menu-button" data-menu>${ui.menu}</button><div class="center communication-strength-view">
      <p class="kicker communication-progress">${ui.communication} · ${index + 1} / ${items.length}</p>
      <h1 class="communication-title">${ui.sayItBetter}</h1>

      <div class="communication-card communication-original">
        <p class="communication-target" data-say-original data-speech-language="${esc(voice)}">${esc(item.weak)}</p>
        <p class="communication-translation" data-say-original-native data-speech-language="${esc(nativeVoice)}">${esc(item.weakTranslation)}</p>
        <button class="secondary-button communication-listen" data-listen-original>🔊 ${ui.listen}</button>
      </div>

      ${revealed ? `<p class="communication-instead">${ui.sayInstead}</p>
      <div class="communication-card communication-strong">
        <p class="communication-target" data-say-strong data-speech-language="${esc(voice)}">${esc(item.strong)}</p>
        <p class="communication-translation" data-say-strong-native data-speech-language="${esc(nativeVoice)}">${esc(item.strongTranslation)}</p>
        <button class="secondary-button communication-listen" data-listen-strong>🔊 ${ui.listen}</button>
      </div>
      <div class="communication-actions"><button class="secondary-button" data-prev ${index === 0 ? 'disabled' : ''}>←</button><button class="primary-button" data-next>${index === items.length - 1 ? ui.again : ui.next + ' →'}</button></div>`
      : `<button class="primary-button communication-reveal" data-reveal>${ui.sayInstead} →</button>`}
    </div></section>`;

    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-listen-original]').onclick = () => sayLearning(item.weak);
    root.querySelector('[data-say-original]').onclick = () => sayLearning(item.weak);
    root.querySelector('[data-say-original-native]').onclick = () => sayNative(item.weakTranslation);
    root.querySelector('[data-reveal]')?.addEventListener('click', () => { revealed = true; draw(); window.setTimeout(() => sayLearning(item.strong), 120); });
    root.querySelector('[data-listen-strong]')?.addEventListener('click', () => sayLearning(item.strong));
    root.querySelector('[data-say-strong]')?.addEventListener('click', () => sayLearning(item.strong));
    root.querySelector('[data-say-strong-native]')?.addEventListener('click', () => sayNative(item.strongTranslation));
    root.querySelector('[data-prev]')?.addEventListener('click', () => { stopSpeech(); index = Math.max(0, index - 1); revealed = false; draw(); });
    root.querySelector('[data-next]')?.addEventListener('click', () => { stopSpeech(); index = index === items.length - 1 ? 0 : index + 1; revealed = false; draw(); });
  }

  draw();
}
