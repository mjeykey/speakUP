import { speak, stopSpeech } from '../audio/speech.js?v=22';

const MESSAGES = [
  { emoji: '🌤️', pt: 'esperança', en: 'hope', ptSentence: 'Amanhã traz uma nova oportunidade.', enSentence: 'Tomorrow brings a new opportunity.' },
  { emoji: '🌤️', pt: 'esperança', en: 'hope', ptSentence: 'Mesmo um passo pequeno leva-te mais longe.', enSentence: 'Even a small step takes you further.' },
  { emoji: '🤍', pt: 'amor-próprio', en: 'self-love', ptSentence: 'Fala contigo como falarias com alguém de quem gostas.', enSentence: 'Speak to yourself as you would to someone you love.' },
  { emoji: '🤍', pt: 'amor-próprio', en: 'self-love', ptSentence: 'Não tens de ser perfeita para merecer carinho.', enSentence: 'You do not have to be perfect to deserve kindness.' },
  { emoji: '🫂', pt: 'abraço', en: 'hug', ptSentence: 'Respira. Está tudo bem neste momento.', enSentence: 'Breathe. Everything is okay in this moment.' },
  { emoji: '🫂', pt: 'abraço', en: 'hug', ptSentence: 'Imagina um abraço quente à tua volta.', enSentence: 'Imagine a warm hug around you.' },
  { emoji: '🌱', pt: 'começo', en: 'beginning', ptSentence: 'Toda a gente faz tudo pela primeira vez.', enSentence: 'Everyone does everything for the first time.' },
  { emoji: '🌱', pt: 'começo', en: 'beginning', ptSentence: 'Não precisas de saber tudo para começar.', enSentence: 'You do not need to know everything to begin.' },
  { emoji: '⭐', pt: 'coragem', en: 'courage', ptSentence: 'Tentar já é um ato de coragem.', enSentence: 'Trying is already an act of courage.' },
  { emoji: '⭐', pt: 'coragem', en: 'courage', ptSentence: 'O primeiro passo também conta.', enSentence: 'The first step counts too.' },
  { emoji: '🌿', pt: 'perdão', en: 'forgiveness', ptSentence: 'Podes perdoar-te e seguir em frente.', enSentence: 'You can forgive yourself and move forward.' },
  { emoji: '🌿', pt: 'perdão', en: 'forgiveness', ptSentence: 'Um erro não define quem tu és.', enSentence: 'A mistake does not define who you are.' },
  { emoji: '🌼', pt: 'gentileza', en: 'kindness', ptSentence: 'A gentileza contigo também é importante.', enSentence: 'Kindness toward yourself matters too.' },
  { emoji: '🌼', pt: 'gentileza', en: 'kindness', ptSentence: 'Uma palavra gentil pode mudar o teu dia.', enSentence: 'One kind word can change your day.' },
  { emoji: '🌙', pt: 'calma', en: 'calm', ptSentence: 'Não há pressa. Vai ao teu ritmo.', enSentence: 'There is no rush. Go at your own pace.' },
  { emoji: '🌙', pt: 'calma', en: 'calm', ptSentence: 'Solta os ombros e respira devagar.', enSentence: 'Relax your shoulders and breathe slowly.' },
  { emoji: '💛', pt: 'paciência', en: 'patience', ptSentence: 'Aprender leva tempo, e isso é normal.', enSentence: 'Learning takes time, and that is normal.' },
  { emoji: '💛', pt: 'paciência', en: 'patience', ptSentence: 'Um passo de cada vez é suficiente.', enSentence: 'One step at a time is enough.' },
  { emoji: '✨', pt: 'confiança', en: 'confidence', ptSentence: 'Tu consegues aprender coisas novas.', enSentence: 'You can learn new things.' },
  { emoji: '✨', pt: 'confiança', en: 'confidence', ptSentence: 'Confia no caminho que já percorreste.', enSentence: 'Trust the path you have already walked.' },
  { emoji: '🌈', pt: 'aceitação', en: 'acceptance', ptSentence: 'Hoje podes ser exatamente quem és.', enSentence: 'Today you can be exactly who you are.' },
  { emoji: '🌈', pt: 'aceitação', en: 'acceptance', ptSentence: 'É normal não estar bem todos os dias.', enSentence: 'It is normal not to feel okay every day.' },
  { emoji: '☀️', pt: 'alegria', en: 'joy', ptSentence: 'Uma coisa pequena também pode trazer alegria.', enSentence: 'A small thing can bring joy too.' },
  { emoji: '☀️', pt: 'alegria', en: 'joy', ptSentence: 'Guarda um momento bonito para ti hoje.', enSentence: 'Keep one beautiful moment for yourself today.' },
  { emoji: '🕊️', pt: 'liberdade', en: 'freedom', ptSentence: 'Podes libertar-te da obrigação de ser perfeita.', enSentence: 'You can let go of the need to be perfect.' },
  { emoji: '🕊️', pt: 'liberdade', en: 'freedom', ptSentence: 'Também tens o direito de mudar de ideia.', enSentence: 'You also have the right to change your mind.' },
  { emoji: '🌸', pt: 'cuidado', en: 'care', ptSentence: 'Cuidar de ti não é egoísmo.', enSentence: 'Taking care of yourself is not selfish.' },
  { emoji: '🌸', pt: 'cuidado', en: 'care', ptSentence: 'Descansar também faz parte do caminho.', enSentence: 'Resting is part of the journey too.' },
  { emoji: '🌊', pt: 'presença', en: 'presence', ptSentence: 'Agora, só precisas deste momento.', enSentence: 'Right now, you only need this moment.' },
  { emoji: '🌊', pt: 'presença', en: 'presence', ptSentence: 'Volta ao teu corpo e sente a respiração.', enSentence: 'Return to your body and feel your breath.' }
];

const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));
const shuffle = items => [...items].sort(() => Math.random() - 0.5);

async function dissolve(element) {
  if (!element) return;
  const animation = element.animate([
    { opacity: 1, filter: 'blur(0)', transform: 'translateY(0) scale(1)' },
    { opacity: .9, offset: .35 },
    { opacity: 0, filter: 'blur(12px)', transform: 'translateY(-20px) scale(.95)' }
  ], { duration: 2100, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
  await animation.finished.catch(() => {});
}

export function renderMemory(root, store) {
  const pairs = shuffle(MESSAGES).slice(0, 2).map((item, pair) => ({ ...item, pair }));
  const cards = shuffle(pairs.flatMap(item => [
    { id: `${item.pair}-pt`, pair: item.pair, text: item.pt, language: 'pt-PT', item },
    { id: `${item.pair}-en`, pair: item.pair, text: item.en, language: 'en-GB', item }
  ]));

  let first = null;
  let locked = false;
  const matched = new Set();

  root.innerHTML = `<section class="screen memory-screen">
    <button class="menu-button" data-menu>Menu</button>
    <div class="center memory-view">
      <p class="kicker">memORy</p>
      <h1>A little kindness for today</h1>
      <p class="memory-intro">Find two English–Portuguese pairs and discover today’s messages.</p>
      <div class="memory-grid positive-memory-grid" data-grid></div>
      <div class="memory-message-stage" data-stage aria-live="polite"></div>
      <div class="memory-actions" data-actions hidden>
        <button class="primary-button" data-next-round>New messages</button>
      </div>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => {
    stopSpeech();
    store.setState({ screen: 'menu' });
  };

  const grid = root.querySelector('[data-grid]');
  const stage = root.querySelector('[data-stage]');

  const showMessage = async item => {
    locked = true;
    stage.innerHTML = `<div class="memory-message-card">
      <div class="memory-message-icon">${item.emoji}</div>
      <p class="memory-message-topic">${item.pt} · ${item.en}</p>
      <p class="memory-message-text" data-message-text>${item.ptSentence}</p>
    </div>`;
    await speak(item.ptSentence, 'pt-PT', { enabled: store.getState().audioOn, rate: .62 });
    await sleep(500);
    await dissolve(stage.querySelector('[data-message-text]'));
    stage.innerHTML = `<div class="memory-message-card">
      <div class="memory-message-icon">${item.emoji}</div>
      <p class="memory-message-topic">${item.pt} · ${item.en}</p>
      <p class="memory-message-text memory-message-english" data-message-text>${item.enSentence}</p>
    </div>`;
    await speak(item.enSentence, 'en-GB', { enabled: store.getState().audioOn, rate: .96 });
    await sleep(500);
    await dissolve(stage.querySelector('[data-message-text]'));
    stage.innerHTML = '';
    locked = false;

    if (matched.size === pairs.length) {
      root.querySelector('[data-actions]').hidden = false;
    }
  };

  cards.forEach(card => {
    const button = document.createElement('button');
    button.className = 'memory-card positive-memory-card';
    button.innerHTML = '<span class="memory-card-back">✦</span>';

    button.onclick = async () => {
      if (locked || matched.has(card.pair) || button.classList.contains('open')) return;
      button.classList.add('open');
      button.innerHTML = `<span class="memory-card-emoji">${card.item.emoji}</span><span class="memory-card-word">${card.text}</span>`;
      await speak(card.text, card.language, {
        enabled: store.getState().audioOn,
        rate: card.language.startsWith('pt') ? .68 : .92
      });

      if (!first) {
        first = { card, button };
        return;
      }

      if (first.card.pair === card.pair) {
        matched.add(card.pair);
        first.button.classList.add('matched');
        button.classList.add('matched');
        const item = card.item;
        first = null;
        await sleep(350);
        await showMessage(item);
        return;
      }

      locked = true;
      window.setTimeout(() => {
        first.button.classList.remove('open');
        first.button.innerHTML = '<span class="memory-card-back">✦</span>';
        button.classList.remove('open');
        button.innerHTML = '<span class="memory-card-back">✦</span>';
        first = null;
        locked = false;
      }, 800);
    };

    grid.appendChild(button);
  });

  root.querySelector('[data-next-round]').onclick = () => {
    stopSpeech();
    renderMemory(root, store);
  };
}
