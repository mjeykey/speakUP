import { speak, stopSpeech } from '../audio/speech.js?v=31';

const EXERCISES = [
  {
    sentence: 'Eu vou ao mercado.',
    english: 'I am going to the market.',
    alternative: 'Vou comprar pão.',
    alternativeEnglish: 'I am going to buy bread.'
  },
  {
    sentence: 'Hoje está um dia bonito.',
    english: 'Today is a beautiful day.',
    alternative: 'Hoje está bom tempo.',
    alternativeEnglish: 'The weather is nice today.'
  },
  {
    sentence: 'Gosto de beber café de manhã.',
    english: 'I like drinking coffee in the morning.',
    alternative: 'Bebo café de manhã.',
    alternativeEnglish: 'I drink coffee in the morning.'
  },
  {
    sentence: 'A minha casa fica perto daqui.',
    english: 'My house is near here.',
    alternative: 'Moro perto daqui.',
    alternativeEnglish: 'I live near here.'
  },
  {
    sentence: 'Estou a aprender português.',
    english: 'I am learning Portuguese.',
    alternative: 'Aprendo português todos os dias.',
    alternativeEnglish: 'I learn Portuguese every day.'
  }
];

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

function normalize(text) {
  return String(text || '')
    .toLocaleLowerCase('pt-PT')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(expected, heard) {
  const a = normalize(expected).split(' ').filter(Boolean);
  const b = normalize(heard).split(' ').filter(Boolean);
  if (!a.length || !b.length) return 0;
  const counts = new Map();
  b.forEach(word => counts.set(word, (counts.get(word) || 0) + 1));
  let matches = 0;
  a.forEach(word => {
    const amount = counts.get(word) || 0;
    if (amount > 0) {
      matches += 1;
      counts.set(word, amount - 1);
    }
  });
  const coverage = matches / a.length;
  const precision = matches / b.length;
  return (coverage * 0.72) + (precision * 0.28);
}

function rememberForLater(sentence) {
  try {
    const key = 'speakup-practice-later';
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (!saved.includes(sentence)) saved.push(sentence);
    localStorage.setItem(key, JSON.stringify(saved.slice(-30)));
  } catch (_) {}
}

export function renderSpeakPractice(root, store) {
  let index = 0;
  let attempts = 0;
  let usingAlternative = false;
  let recognition = null;
  let listening = false;
  let streak = 0;

  const current = () => EXERCISES[index % EXERCISES.length];
  const activeSentence = () => usingAlternative ? current().alternative : current().sentence;
  const activeEnglish = () => usingAlternative ? current().alternativeEnglish : current().english;

  function leave() {
    recognition?.abort?.();
    stopSpeech();
    store.setState({ screen: 'menu' });
  }

  function render(message = 'Listen first, then speak when you are ready.', tone = 'calm') {
    const supported = Boolean(Recognition);
    root.innerHTML = `<section class="screen speak-screen">
      <button class="menu-button" data-menu>Menu</button>
      <div class="center speak-view">
        <p class="kicker">Speak & Grow</p>
        <h1>Say it your way</h1>
        <p class="speak-progress">Sentence ${index + 1} · Streak ${streak}</p>
        <div class="speak-card ${usingAlternative ? 'is-alternative' : ''}">
          <p class="speak-label">Português</p>
          <p class="speak-sentence">${activeSentence()}</p>
          <p class="speak-translation">${activeEnglish()}</p>
        </div>
        <p class="speak-feedback is-${tone}" data-feedback>${message}</p>
        <p class="speak-heard" data-heard></p>
        <div class="speak-actions">
          <button class="secondary-button" data-listen>🔊 Listen</button>
          <button class="primary-button speak-mic" data-speak ${supported ? '' : 'disabled'}>${listening ? 'Listening…' : '🎙 Speak'}</button>
        </div>
        ${supported ? '' : '<p class="speak-support">Speech recognition is not available in this browser. Chrome on Android usually supports it.</p>'}
      </div>
    </section>`;

    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-listen]').onclick = () => playSentence(false);
    if (supported) root.querySelector('[data-speak]').onclick = startListening;
  }

  async function playSentence(slower) {
    stopSpeech();
    await speak(activeSentence(), 'pt-PT', {
      enabled: store.getState().audioOn,
      rate: slower ? 0.48 : 0.58
    });
  }

  async function celebrate() {
    streak += 1;
    attempts = 0;
    render(streak >= 3 ? 'Beautiful — you are finding your rhythm! ✨' : 'That was good. You did it! ✨', 'success');
    await sleep(1250);
    index = (index + 1) % EXERCISES.length;
    usingAlternative = false;
    render('Ready for the next small step.', 'calm');
    await playSentence(false);
  }

  async function softenAfterMiss(heard) {
    attempts += 1;
    streak = 0;
    if (attempts === 1) {
      render('Almost. Let us hear it once more, a little slower.', 'gentle');
      const heardNode = root.querySelector('[data-heard]');
      if (heardNode && heard) heardNode.textContent = `I heard: “${heard}”`;
      await sleep(450);
      await playSentence(true);
      return;
    }

    rememberForLater(activeSentence());
    usingAlternative = true;
    attempts = 0;
    render('Let us try the same idea in an easier way. You can do this.', 'gentle');
    await sleep(550);
    await playSentence(true);
  }

  function startListening() {
    if (listening || !Recognition) return;
    stopSpeech();
    recognition = new Recognition();
    recognition.lang = 'pt-PT';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;
    listening = true;
    render('I am listening. Take your time.', 'listening');

    recognition.onresult = async event => {
      const alternatives = Array.from(event.results?.[0] || []).map(result => result.transcript);
      const best = alternatives.reduce((winner, text) => {
        const score = similarity(activeSentence(), text);
        return score > winner.score ? { text, score } : winner;
      }, { text: '', score: 0 });
      listening = false;
      if (best.score >= 0.64) await celebrate();
      else await softenAfterMiss(best.text);
    };

    recognition.onerror = async event => {
      listening = false;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        render('Microphone access is needed for this exercise. Nothing was marked wrong.', 'gentle');
        return;
      }
      render('I could not hear that clearly. Let us simply try once more.', 'gentle');
    };

    recognition.onend = () => {
      listening = false;
      const button = root.querySelector('[data-speak]');
      if (button) button.textContent = '🎙 Speak';
    };

    try {
      recognition.start();
    } catch (_) {
      listening = false;
      render('The microphone needs a short moment. Please tap Speak again.', 'gentle');
    }
  }

  render();
  window.setTimeout(() => playSentence(false), 350);
}
