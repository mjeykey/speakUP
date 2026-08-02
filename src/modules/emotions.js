import { EMOTIONS, PHRASE_TRANSLATIONS } from '../data/emotions/index.js?v=1';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';
import { speak, stopSpeech } from '../audio/speech.js?v=44';

const STEPS = ['validation','reflection','exercise','language','closing'];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

export function renderEmotions(root, store) {
  const state = store.getState();
  let selected = null;
  let stepIndex = 0;
  let phraseIndex = 0;

  const leave = () => {
    stopSpeech();
    store.setState({ screen:'menu', currentIndex:0 });
  };

  function renderPicker() {
    stopSpeech();
    root.innerHTML = `<section class="screen emotions-screen">
      <button class="menu-button" data-menu>Menu</button>
      <div class="emotions-shell">
        <p class="kicker">Emotions</p>
        <h1>How are you feeling right now?</h1>
        <p class="muted">Choose what feels closest. You can skip any step.</p>
        <div class="emotion-grid">
          ${EMOTIONS.map(item => `<button class="emotion-card" data-emotion="${item.id}"><span>${item.emoji}</span><strong>${item.title}</strong></button>`).join('')}
        </div>
      </div>
    </section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelectorAll('[data-emotion]').forEach(button => {
      button.onclick = () => {
        selected = EMOTIONS.find(item => item.id === button.dataset.emotion);
        stepIndex = 0;
        phraseIndex = 0;
        renderStep();
      };
    });
  }

  function renderStep() {
    const step = STEPS[stepIndex];
    const phrases = PHRASE_TRANSLATIONS[state.learningLanguage] || PHRASE_TRANSLATIONS['en-GB'];
    let title = '';
    let body = '';
    let extra = '';

    if (step === 'validation') {
      title = 'Your feeling makes sense';
      body = selected.validation;
    } else if (step === 'reflection') {
      title = 'A gentle question';
      body = selected.reflection;
      extra = '<textarea class="emotion-note" data-note rows="3" placeholder="You can write something, or leave this empty."></textarea>';
    } else if (step === 'exercise') {
      title = 'A small reset';
      body = selected.exercise;
      extra = '<div class="emotion-breath" aria-hidden="true"><span></span></div>';
    } else if (step === 'language') {
      title = `Speak in ${languageName(state.learningLanguage)}`;
      body = phrases[phraseIndex % phrases.length];
      extra = `<p class="emotion-language-hint">Read it, listen, then say it in your own voice.</p>
        <div class="emotion-language-actions">
          <button class="secondary-button" data-listen>Listen</button>
          <button class="secondary-button" data-next-phrase>Another sentence</button>
        </div>`;
    } else {
      title = 'A quiet finish';
      body = selected.closing;
      extra = '<p class="emotion-language-hint">You do not have to feel completely different. You took one caring step.</p>';
    }

    root.innerHTML = `<section class="screen emotions-screen">
      <button class="menu-button" data-menu>Menu</button>
      <div class="emotions-shell emotion-journey">
        <div class="emotion-progress">${STEPS.map((_,index) => `<span class="${index <= stepIndex ? 'active' : ''}"></span>`).join('')}</div>
        <p class="emotion-current">${selected.emoji} ${selected.title}</p>
        <div class="emotion-panel">
          <p class="kicker">${stepIndex + 1} / ${STEPS.length}</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="emotion-body">${escapeHtml(body)}</p>
          ${extra}
        </div>
        <div class="emotion-controls">
          <button class="secondary-button" data-back>${stepIndex === 0 ? 'Choose another feeling' : 'Back'}</button>
          <button class="secondary-button" data-skip>Skip</button>
          <button class="primary-button" data-next>${stepIndex === STEPS.length - 1 ? 'Finish' : 'Continue'}</button>
        </div>
      </div>
    </section>`;

    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-back]').onclick = () => {
      stopSpeech();
      if (stepIndex === 0) renderPicker();
      else { stepIndex -= 1; renderStep(); }
    };
    root.querySelector('[data-skip]').onclick = () => {
      stopSpeech();
      if (stepIndex < STEPS.length - 1) { stepIndex += 1; renderStep(); }
      else renderPicker();
    };
    root.querySelector('[data-next]').onclick = () => {
      stopSpeech();
      if (stepIndex < STEPS.length - 1) { stepIndex += 1; renderStep(); }
      else renderPicker();
    };

    const listen = root.querySelector('[data-listen]');
    if (listen) listen.onclick = () => speak(body, getSpeechLanguage(state.learningLanguage), { enabled:state.audioOn, rate:0.62 });
    const nextPhrase = root.querySelector('[data-next-phrase]');
    if (nextPhrase) nextPhrase.onclick = () => { phraseIndex = (phraseIndex + 1) % phrases.length; renderStep(); };
  }

  renderPicker();
}
