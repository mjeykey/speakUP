import { getSentenceLevels, getSpeechLanguage } from '../data/language-content-matrix.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=60';

function esc(value) {
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

function fillAnswers(sentence, answers, solvedCount = answers.length) {
  let index = 0;
  return String(sentence).replace(/_____/g, () => {
    const answer = answers[index];
    const visible = index < solvedCount ? answer : '_____';
    index += 1;
    return visible;
  });
}

export function renderFillGap(root, store) {
  const state = store.getState();
  const levels = getSentenceLevels(state.learningLanguage, state.nativeLanguage);
  const level = levels.find(item => item.id === state.sentenceLevel) || levels[0];
  const speechLanguage = getSpeechLanguage(state.learningLanguage);
  let sentenceIndex = 0;
  let solvedCount = 0;

  const leave = () => { stopSpeech(); store.setState({ screen:'menu' }); };

  function draw() {
    const item = level.items[sentenceIndex % level.items.length];
    const expected = item.answers[solvedCount];
    root.innerHTML = `<section class="screen sentence-mode-screen">
      <button class="speakup-home-button" data-menu>SpeakUP</button>
      <div class="center sentence-mode-view">
        <div class="sentence-mode-stage">
          <p class="sentence sentence-mode-portuguese" data-sentence>${esc(fillAnswers(item.sentence,item.answers,solvedCount))}</p>
          <p class="sentence-mode-english">${esc(item.translation)}</p>
        </div>
        <div class="choices" data-choices></div><p class="feedback" data-feedback></p>
      </div>
    </section>`;

    root.querySelector('[data-menu]').onclick = leave;
    const choices = root.querySelector('[data-choices]');
    item.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.textContent = option;
      button.onclick = async () => {
        if (option !== expected) {
          root.querySelector('[data-feedback]').textContent = 'Noch einmal.';
          return;
        }
        solvedCount += 1;
        await speak(option, speechLanguage, { enabled:state.audioOn, rate:.65 }).catch(() => {});
        if (solvedCount < item.answers.length) { draw(); return; }
        const full = fillAnswers(item.sentence,item.answers);
        root.querySelector('[data-sentence]').textContent = full;
        root.querySelector('[data-feedback]').textContent = 'Richtig.';
        await speak(full, speechLanguage, { enabled:state.audioOn, rate:.65 }).catch(() => {});
        window.setTimeout(() => { solvedCount = 0; sentenceIndex = (sentenceIndex + 1) % level.items.length; draw(); }, 650);
      };
      choices.appendChild(button);
    });
  }
  draw();
}
