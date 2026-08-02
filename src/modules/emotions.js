import { EMOTIONS } from '../data/emotions/index.js?v=2';
import { getEmotionPickerCopy } from '../data/emotions/picker-copy.js?v=1';
import { EMOTION_TIPS, getEmotionPhrases } from '../data/emotions/emotion-support.js?v=1';
import { getEmotionClosing } from '../data/emotions/emotion-closings.js?v=1';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';
import { speak, stopSpeech } from '../audio/speech.js?v=44';

const STEPS = ['validation','reflection','exercise','language','closing'];

const VALIDATION_TITLES = {
  jealousy: ['This feeling says something matters', 'You are not bad for feeling this'],
  anger: ['Something in you is asking for a boundary', 'Your anger did not appear from nowhere'],
  anxiety: ['Your mind is trying to protect you', 'Uncertainty can feel heavy'],
  stress: ['There is a lot asking for your attention', 'Your mind may be carrying too much at once'],
  sadness: ['You do not have to rush through this', 'Sadness deserves a little room'],
  insecure: ['New things can shake our confidence', 'Uncertainty does not mean incapability'],
  overwhelmed: ['You were never meant to hold everything at once', 'This moment may simply be too full'],
  excited: ['This energy is allowed to be here', 'Excitement can feel big in the body'],
  lonely: ['Wanting connection is deeply human', 'Loneliness can hurt quietly'],
  disappointed: ['This hurts because it mattered', 'You were hoping for something real'],
  selflove: ['You can begin with simple kindness', 'You do not have to earn your own care'],
  spiral: ['A repeated thought is still only a thought', 'Your mind may be stuck, not broken']
};

const REFLECTION_TITLES = {
  jealousy: 'What is the fear underneath comparison?',
  anger: 'What is underneath the anger?',
  anxiety: 'What feels uncertain?',
  stress: 'What needs less pressure?',
  sadness: 'What would feel gentle?',
  insecure: 'What would you allow a beginner to do?',
  overwhelmed: 'What can become smaller?',
  excited: 'Where would you like this energy to go?',
  lonely: 'What kind of connection do you need?',
  disappointed: 'What were you hoping for?',
  selflove: 'What would basic kindness look like today?',
  spiral: 'Is there an action, or only a loop?'
};

const EXERCISE_TITLES = {
  jealousy: 'Return to your own value',
  anger: 'Create space before action',
  anxiety: 'Come back to what is here',
  stress: 'Reduce the load for one moment',
  sadness: 'Choose something gentle',
  insecure: 'Make room for being a beginner',
  overwhelmed: 'Make the moment smaller',
  excited: 'Give the energy a direction',
  lonely: 'Move one step toward connection',
  disappointed: 'Separate the loss from what remains',
  selflove: 'Practise believable kindness',
  spiral: 'Create distance from the loop'
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

function pickTitle(options, fallback) {
  if (!Array.isArray(options) || options.length === 0) return fallback;
  return options[Math.floor(Math.random() * options.length)];
}

export function renderEmotions(root, store) {
  const state = store.getState();
  let selected = null;
  let stepIndex = 0;
  let phraseIndex = 0;
  let validationTitle = '';
  let selectedTipIndex = 0;
  let closing = null;

  const leave = () => {
    stopSpeech();
    store.setState({ screen:'menu', currentIndex:0 });
  };

  function renderPicker() {
    stopSpeech();
    const copy = getEmotionPickerCopy();
    root.innerHTML = `<section class="screen emotions-screen">
      <button class="menu-button" data-menu>Menu</button>
      <div class="emotions-shell">
        <p class="kicker">${escapeHtml(copy.kicker)}</p>
        <h1>${escapeHtml(copy.title)}</h1>
        <p class="muted">${escapeHtml(copy.subtitle)}</p>
        <div class="emotion-grid">
          ${EMOTIONS.map(item => `<button class="emotion-card" data-emotion="${item.id}" aria-label="Choose ${item.title}"><span>${item.emoji}</span><strong>${item.title}</strong></button>`).join('')}
        </div>
        <button class="emotion-refresh" data-refresh type="button">Show me another welcome</button>
      </div>
    </section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-refresh]').onclick = renderPicker;
    root.querySelectorAll('[data-emotion]').forEach(button => {
      button.onclick = () => {
        selected = EMOTIONS.find(item => item.id === button.dataset.emotion);
        validationTitle = pickTitle(VALIDATION_TITLES[selected.id], 'Your feeling deserves attention');
        closing = getEmotionClosing(selected.id);
        stepIndex = 0;
        phraseIndex = 0;
        selectedTipIndex = 0;
        renderStep();
      };
    });
  }

  function renderStep() {
    const step = STEPS[stepIndex];
    const phrases = getEmotionPhrases(selected.id, state.learningLanguage);
    const tips = EMOTION_TIPS[selected.id] || [selected.exercise];
    let title = '';
    let body = '';
    let extra = '';

    if (step === 'validation') {
      title = validationTitle;
      body = selected.validation;
    } else if (step === 'reflection') {
      title = REFLECTION_TITLES[selected.id] || 'A question to understand the feeling';
      body = selected.reflection;
      extra = '<textarea class="emotion-note" data-note rows="3" placeholder="You can write something, or leave this empty."></textarea>';
    } else if (step === 'exercise') {
      title = EXERCISE_TITLES[selected.id] || 'Let us make a little space';
      body = tips[selectedTipIndex % tips.length];
      extra = `<div class="emotion-tip-picker">
          <p class="emotion-language-hint">Choose the option that feels easiest. You do not need to do all of them.</p>
          <div class="emotion-tip-dots">${tips.map((_, index) => `<button class="${index === selectedTipIndex ? 'active' : ''}" data-tip="${index}" aria-label="Tip ${index + 1}"></button>`).join('')}</div>
          <button class="secondary-button emotion-another-tip" data-another-tip>Another option</button>
        </div>
        <div class="emotion-breath" aria-hidden="true"><span></span></div>`;
    } else if (step === 'language') {
      title = `Put this feeling into ${languageName(state.learningLanguage)}`;
      body = phrases[phraseIndex % phrases.length];
      extra = `<p class="emotion-language-hint">This sentence belongs to the feeling you selected. Read it, listen, then say it in your own voice.</p>
        <div class="emotion-language-actions">
          <button class="secondary-button" data-listen>Listen</button>
          <button class="secondary-button" data-next-phrase>Another sentence</button>
        </div>`;
    } else {
      title = closing.title;
      body = closing.body;
      extra = `<div class="emotion-spark"><span aria-hidden="true">✦</span><p>${escapeHtml(closing.spark)}</p></div>
        <p class="emotion-language-hint">Nothing has to be solved before you leave this page.</p>`;
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

    root.querySelectorAll('[data-tip]').forEach(button => {
      button.onclick = () => {
        selectedTipIndex = Number(button.dataset.tip) || 0;
        renderStep();
      };
    });
    const anotherTip = root.querySelector('[data-another-tip]');
    if (anotherTip) anotherTip.onclick = () => {
      selectedTipIndex = (selectedTipIndex + 1) % tips.length;
      renderStep();
    };

    const listen = root.querySelector('[data-listen]');
    if (listen) listen.onclick = () => speak(body, getSpeechLanguage(state.learningLanguage), { enabled:state.audioOn, rate:0.62 });
    const nextPhrase = root.querySelector('[data-next-phrase]');
    if (nextPhrase) nextPhrase.onclick = () => { phraseIndex = (phraseIndex + 1) % phrases.length; renderStep(); };
  }

  renderPicker();
}
