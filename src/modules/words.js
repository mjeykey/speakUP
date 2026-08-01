import { WORDS } from '../data/content.js?v=6';
import { speakPair, stopSpeech } from '../audio/speech.js?v=35';

const EFFECTS = [
  { id: 'dissolve', label: 'Dissolve' },
  { id: 'float', label: 'Float' },
  { id: 'scatter', label: 'Scatter' },
  { id: 'glow', label: 'Glow' }
];

function savedEffect() {
  try { return localStorage.getItem('speakup-word-effect') || 'dissolve'; }
  catch (_) { return 'dissolve'; }
}

function saveEffect(effect) {
  try { localStorage.setItem('speakup-word-effect', effect); }
  catch (_) {}
}

async function animateOut(stage, effect) {
  if (!stage) return;
  const animations = {
    dissolve: [
      { opacity: 1, filter: 'blur(0)', transform: 'scale(1)' },
      { opacity: .72, offset: .32 },
      { opacity: 0, filter: 'blur(14px)', transform: 'scale(.92)' }
    ],
    float: [
      { opacity: 1, filter: 'blur(0)', transform: 'translateY(0) scale(1)' },
      { opacity: 0, filter: 'blur(8px)', transform: 'translateY(-72px) scale(.96)' }
    ],
    scatter: [
      { opacity: 1, filter: 'blur(0)', transform: 'rotate(0) scale(1)' },
      { opacity: .68, offset: .3, transform: 'rotate(-2deg) scale(1.04)' },
      { opacity: 0, filter: 'blur(11px)', transform: 'rotate(7deg) translate(54px,-38px) scale(.82)' }
    ],
    glow: [
      { opacity: 1, filter: 'brightness(1) blur(0)', transform: 'scale(1)' },
      { opacity: 1, filter: 'brightness(1.8) blur(1px)', transform: 'scale(1.06)', offset: .42 },
      { opacity: 0, filter: 'brightness(2.2) blur(18px)', transform: 'scale(1.14)' }
    ]
  };
  const animation = stage.animate(animations[effect] || animations.dissolve, {
    duration: 1250,
    easing: 'cubic-bezier(.22,.61,.36,1)',
    fill: 'forwards'
  });
  await animation.finished.catch(() => {});
}

export function renderWords(root, store) {
  const state = store.getState();
  const item = WORDS[state.currentIndex % WORDS.length];
  let effect = savedEffect();
  let moving = false;

  root.innerHTML = `<section class="screen words-screen">
    <button class="menu-button" data-menu>Menu</button>
    <div class="center words-view">
      <p class="kicker">Words</p>
      <div class="words-stage" data-stage>
        <div class="single-word">${item.pt}</div>
        <div class="translation">${item.en}</div>
      </div>
      <div class="word-effect-picker" aria-label="Word dissolve effect">
        <span>Effect</span>
        <div class="word-effect-options">
          ${EFFECTS.map(option => `<button class="word-effect-option ${option.id === effect ? 'selected' : ''}" data-effect="${option.id}">${option.label}</button>`).join('')}
        </div>
      </div>
      <button class="primary-button" data-next>Next</button>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => {
    stopSpeech();
    store.setState({ screen: 'menu', currentIndex: 0 });
  };

  root.querySelectorAll('[data-effect]').forEach(button => {
    button.onclick = () => {
      effect = button.dataset.effect;
      saveEffect(effect);
      root.querySelectorAll('[data-effect]').forEach(itemButton => itemButton.classList.toggle('selected', itemButton === button));
    };
  });

  root.querySelector('[data-next]').onclick = async () => {
    if (moving) return;
    moving = true;
    stopSpeech();
    await animateOut(root.querySelector('[data-stage]'), effect);
    store.setState({ currentIndex: state.currentIndex + 1 });
  };

  speakPair(
    { text: item.pt, language: 'pt-PT', rate: 0.76 },
    { text: item.en, language: 'en-GB', rate: 0.9 },
    { enabled: state.audioOn, pause: 320 }
  );
}
