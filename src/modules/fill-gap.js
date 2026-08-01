import { GAPS } from '../data/content.js?v=5';
import { speak, stopSpeech } from '../audio/speech.js?v=32';

const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));
const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function dissolve(element) {
  if (!element) return;
  await nextFrame();
  const animation = element.animate([
    { opacity: 1, filter: 'blur(0)', transform: 'translateY(0) scale(1)' },
    { opacity: .86, offset: .28 },
    { opacity: 0, filter: 'blur(12px)', transform: 'translateY(-18px) scale(.96)' }
  ], {
    duration: 1750,
    easing: 'cubic-bezier(.22,.61,.36,1)',
    fill: 'forwards'
  });
  await animation.finished.catch(() => {});
}

export function renderFillGap(root, store) {
  const state = store.getState();
  const item = GAPS[state.currentIndex % GAPS.length];
  const completeSentence = item.sentence.replace('_____', item.answer);
  let solved = false;

  root.innerHTML = `<section class="screen sentence-mode-screen">
    <button class="menu-button" data-menu>Menu</button>
    <div class="center sentence-mode-view">
      <p class="kicker">Sentences · Beginner</p>
      <div class="sentence-mode-stage" data-stage>
        <p class="sentence-mode-label">Português</p>
        <p class="sentence sentence-mode-portuguese" data-portuguese>${escapeHtml(item.sentence)}</p>
        <p class="sentence-mode-label sentence-mode-english-label">English</p>
        <p class="sentence-mode-english" data-english>${escapeHtml(item.english)}</p>
      </div>
      <div class="choices" data-choices></div>
      <p class="feedback sentence-mode-feedback" data-feedback></p>
    </div>
  </section>`;

  const leave = () => {
    stopSpeech();
    store.setState({ screen: 'menu', currentIndex: 0 });
  };

  root.querySelector('[data-menu]').onclick = leave;
  const choices = root.querySelector('[data-choices]');

  item.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.textContent = option;
    button.onclick = async () => {
      if (solved) return;

      if (option !== item.answer) {
        button.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(0)' }
        ], { duration: 340, easing: 'ease' });
        root.querySelector('[data-feedback]').textContent = 'Almost — try another word.';
        return;
      }

      solved = true;
      choices.querySelectorAll('button').forEach(choice => { choice.disabled = true; });
      root.querySelector('[data-portuguese]').textContent = completeSentence;
      root.querySelector('[data-feedback]').textContent = 'Beautiful — now hear the whole sentence.';

      await speak(completeSentence, 'pt-PT', {
        enabled: state.audioOn,
        rate: 0.58
      });

      await sleep(500);
      await Promise.all([
        dissolve(root.querySelector('[data-portuguese]')),
        dissolve(root.querySelector('[data-english]'))
      ]);

      await sleep(260);
      store.setState({ currentIndex: state.currentIndex + 1 });
    };
    choices.appendChild(button);
  });

  const spokenGapSentence = item.sentence.replace('_____', '...');
  window.setTimeout(() => {
    if (!solved) {
      speak(spokenGapSentence, 'pt-PT', {
        enabled: state.audioOn,
        rate: 0.56
      });
    }
  }, 350);
}
