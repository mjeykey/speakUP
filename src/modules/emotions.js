import { EMOTIONS } from '../data/emotions/index.js?v=2';
import { getPortugueseEmotionPractice } from '../data/emotions/portuguese-voice.js?v=1';
import { getFrenchEmotionPractice } from '../data/emotions/french-voice.js?v=1';
import { getEmotionFlow } from '../data/emotions/emotion-flow.js?v=1';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';
import { speak, stopSpeech } from '../audio/speech.js?v=58';

const LABELS = {
  'pt-PT': {
    title: 'Como te sentes agora?', subtitle: 'Escolhe uma emoção.', listen: 'Ouvir', back: 'Voltar', another: 'Escolher outra emoção',
    choose: 'Completa a instrução para continuar.', correct: 'Certo! Agora faz o movimento.', tryAgain: 'Quase. Escolhe outra palavra.', continue: 'Continuar', finish: 'Terminar', seconds: 'segundos',
    emotions: { jealousy:'Ciúme', anger:'Raiva', anxiety:'Ansiedade', stress:'Stress', sadness:'Tristeza', insecure:'Insegurança', overwhelmed:'Sobrecarregada', excited:'Entusiasmo', lonely:'Solidão', disappointed:'Desilusão', selflove:'Amor-próprio', spiral:'Pensamentos repetitivos' }
  },
  'fr-FR': {
    title: 'Comment te sens-tu maintenant ?', subtitle: 'Choisis une émotion.', listen: 'Écouter', back: 'Retour', another: 'Choisir une autre émotion',
    choose: 'Complète l’instruction pour continuer.', correct: 'Exact ! Maintenant, fais le mouvement.', tryAgain: 'Presque. Choisis un autre mot.', continue: 'Continuer', finish: 'Terminer', seconds: 'secondes',
    emotions: { jealousy:'Jalousie', anger:'Colère', anxiety:'Anxiété', stress:'Stress', sadness:'Tristesse', insecure:'Insécurité', overwhelmed:'Débordée', excited:'Enthousiasme', lonely:'Solitude', disappointed:'Déception', selflove:'Amour de soi', spiral:'Pensées répétitives' }
  }
};

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

function selectedLanguage(language) { return language === 'fr-FR' ? 'fr-FR' : 'pt-PT'; }
function getPractice(language, emotionId) { return language === 'fr-FR' ? getFrenchEmotionPractice(emotionId) : getPortugueseEmotionPractice(emotionId); }
function shuffled(items) { return [...items].sort(() => Math.random() - .5); }

export function renderEmotions(root, store) {
  const state = store.getState();
  const learningLanguage = selectedLanguage(state.learningLanguage);
  const copy = LABELS[learningLanguage];
  const voice = getSpeechLanguage(learningLanguage);
  const languageLabel = languageName(learningLanguage);
  let selected = null;
  let stepIndex = 0;
  let phase = 'question';
  let remaining = 0;
  let timer = null;

  const clearTimer = () => { if (timer) window.clearInterval(timer); timer = null; };
  const leave = () => { clearTimer(); stopSpeech(); store.setState({ screen:'menu' }); };

  function renderPicker() {
    clearTimer(); stopSpeech();
    root.innerHTML = `<section class="screen emotions-screen"><button class="menu-button" data-menu>Menu</button><div class="emotions-shell">
      <p class="kicker">${escapeHtml(languageLabel)}</p><h1>${escapeHtml(copy.title)}</h1><p class="muted">${escapeHtml(copy.subtitle)}</p>
      <div class="emotion-grid">${EMOTIONS.map(item => `<button class="emotion-card" data-emotion="${item.id}"><span>${item.emoji}</span><strong>${escapeHtml(copy.emotions[item.id] || item.title)}</strong></button>`).join('')}</div>
    </div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelectorAll('[data-emotion]').forEach(button => button.onclick = () => { selected = EMOTIONS.find(item => item.id === button.dataset.emotion); stepIndex = 0; phase = 'question'; renderStep(); });
  }

  function getSteps() {
    const practice = getPractice(learningLanguage, selected.id);
    return getEmotionFlow(learningLanguage, selected.id, practice);
  }

  function shell(content, steps) {
    root.innerHTML = `<section class="screen emotions-screen"><button class="menu-button" data-menu>Menu</button><div class="emotions-shell emotion-journey">
      <div class="emotion-progress">${steps.map((_, i) => `<span class="${i <= stepIndex ? 'active' : ''}"></span>`).join('')}</div>
      <p class="emotion-current">${selected.emoji} ${escapeHtml(copy.emotions[selected.id] || selected.title)}</p>${content}
      <div class="emotion-controls"><button class="secondary-button" data-back>${escapeHtml(stepIndex === 0 ? copy.another : copy.back)}</button></div>
    </div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-back]').onclick = () => { clearTimer(); stopSpeech(); if (stepIndex === 0) renderPicker(); else { stepIndex -= 1; phase = 'question'; renderStep(); } };
  }

  function renderQuestion(step, steps) {
    shell(`<div class="emotion-panel emotion-learning-card"><p class="kicker">${stepIndex + 1} / ${steps.length} · ${escapeHtml(languageLabel)}</p>
      <p class="emotion-language-hint">${escapeHtml(copy.choose)}</p><p class="emotion-gap-prompt">${escapeHtml(step.prompt)}</p>
      <div class="emotion-answer-grid">${shuffled(step.options).map(option => `<button class="emotion-answer" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>
      <p class="emotion-feedback" data-feedback aria-live="polite"></p></div>`, steps);
    root.querySelectorAll('[data-answer]').forEach(button => button.onclick = () => {
      const feedback = root.querySelector('[data-feedback]');
      if (button.dataset.answer !== step.answer) { button.classList.add('wrong'); feedback.textContent = copy.tryAgain; return; }
      root.querySelectorAll('[data-answer]').forEach(item => item.disabled = true);
      button.classList.add('correct'); feedback.textContent = copy.correct;
      speak(step.instruction, voice, { enabled:store.getState().audioOn, rate:.62 });
      window.setTimeout(() => { phase = 'action'; renderStep(); }, 650);
    });
    speak(step.prompt, voice, { enabled:store.getState().audioOn, rate:.62 });
  }

  function renderAction(step, steps) {
    remaining = step.seconds || 5;
    shell(`<div class="emotion-panel emotion-action-card"><p class="kicker">${escapeHtml(copy.correct)}</p>
      <p class="emotion-body emotion-instruction">${escapeHtml(step.instruction)}</p>
      <div class="emotion-countdown"><div class="emotion-countdown-ring"><span data-count>${remaining}</span></div><small>${escapeHtml(copy.seconds)}</small></div>
      <button class="secondary-button" data-listen>${escapeHtml(copy.listen)}</button></div>`, steps);
    root.querySelector('[data-listen]').onclick = () => speak(step.instruction, voice, { enabled:store.getState().audioOn, rate:.62 });
    speak(step.instruction, voice, { enabled:store.getState().audioOn, rate:.62 });
    timer = window.setInterval(() => {
      remaining -= 1;
      const count = root.querySelector('[data-count]');
      if (count) count.textContent = remaining;
      if (remaining <= 0) { clearTimer(); phase = 'calm'; renderStep(); }
    }, 1000);
  }

  function renderCalm(step, steps) {
    const atEnd = stepIndex === steps.length - 1;
    shell(`<div class="emotion-panel emotion-calm-card"><div class="emotion-calm-icon">✦</div>
      <p class="emotion-body emotion-calm-sentence">${escapeHtml(step.calm)}</p>
      <div class="emotion-language-actions"><button class="secondary-button" data-listen>${escapeHtml(copy.listen)}</button><button class="primary-button" data-continue>${escapeHtml(atEnd ? copy.finish : copy.continue)}</button></div></div>`, steps);
    root.querySelector('[data-listen]').onclick = () => speak(step.calm, voice, { enabled:store.getState().audioOn, rate:.58 });
    root.querySelector('[data-continue]').onclick = () => { stopSpeech(); if (atEnd) renderPicker(); else { stepIndex += 1; phase = 'question'; renderStep(); } };
    speak(step.calm, voice, { enabled:store.getState().audioOn, rate:.58 });
  }

  function renderStep() {
    clearTimer(); stopSpeech();
    const steps = getSteps();
    const step = steps[stepIndex];
    if (phase === 'action') renderAction(step, steps); else if (phase === 'calm') renderCalm(step, steps); else renderQuestion(step, steps);
  }

  renderPicker();
}
