import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';

const PAIRS = [
  { a:{'en-GB':'self-love','de-DE':'Selbstliebe','pt-PT':'amor-próprio','es-ES':'amor propio','fr-FR':'amour de soi','hr-HR':'ljubav prema sebi','it-IT':'amor proprio'}, b:{'en-GB':'saying no','de-DE':'Nein sagen','pt-PT':'dizer não','es-ES':'decir no','fr-FR':'dire non','hr-HR':'reći ne','it-IT':'dire di no'} },
  { a:{'en-GB':'forgiveness','de-DE':'Vergebung','pt-PT':'perdão','es-ES':'perdón','fr-FR':'pardon','hr-HR':'oprost','it-IT':'perdono'}, b:{'en-GB':'letting go','de-DE':'loslassen','pt-PT':'deixar ir','es-ES':'soltar','fr-FR':'lâcher prise','hr-HR':'pustiti','it-IT':'lasciare andare'} },
  { a:{'en-GB':'anger','de-DE':'Wut','pt-PT':'raiva','es-ES':'ira','fr-FR':'colère','hr-HR':'ljutnja','it-IT':'rabbia'}, b:{'en-GB':'pause before reacting','de-DE':'vor dem Reagieren kurz stoppen','pt-PT':'parar antes de reagir','es-ES':'parar antes de reaccionar','fr-FR':'faire une pause avant de réagir','hr-HR':'zastati prije reakcije','it-IT':'fermarsi prima di reagire'} },
  { a:{'en-GB':'boundary','de-DE':'Grenze','pt-PT':'limite','es-ES':'límite','fr-FR':'limite','hr-HR':'granica','it-IT':'limite'}, b:{'en-GB':'respect','de-DE':'Respekt','pt-PT':'respeito','es-ES':'respeto','fr-FR':'respect','hr-HR':'poštovanje','it-IT':'rispetto'} },
  { a:{'en-GB':'mistake','de-DE':'Fehler','pt-PT':'erro','es-ES':'error','fr-FR':'erreur','hr-HR':'pogreška','it-IT':'errore'}, b:{'en-GB':'learning','de-DE':'lernen','pt-PT':'aprendizagem','es-ES':'aprendizaje','fr-FR':'apprentissage','hr-HR':'učenje','it-IT':'apprendimento'} },
  { a:{'en-GB':'fear','de-DE':'Angst','pt-PT':'medo','es-ES':'miedo','fr-FR':'peur','hr-HR':'strah','it-IT':'paura'}, b:{'en-GB':'courage','de-DE':'Mut','pt-PT':'coragem','es-ES':'valor','fr-FR':'courage','hr-HR':'hrabrost','it-IT':'coraggio'} }
];

function canonical(code){ if(code==='es-AN') return 'es-ES'; if(code==='hr-DAL') return 'hr-HR'; return code; }
function text(map,code){ return map[canonical(code)] || map['en-GB']; }
function shuffle(items){ return [...items].sort(() => Math.random() - 0.5); }

export function renderMemory(root, store) {
  const state = store.getState();
  const learning = state.learningLanguage;
  const support = state.nativeLanguage;
  const selectedPairs = shuffle(PAIRS).slice(0,4);
  const cards = shuffle(selectedPairs.flatMap((pair,index) => [
    { id:`${index}-a`, pair:index, target:text(pair.a,learning), support:text(pair.a,support) },
    { id:`${index}-b`, pair:index, target:text(pair.b,learning), support:text(pair.b,support) }
  ]));
  let open = [];
  const matched = new Set();
  const voice = getSpeechLanguage(learning);

  function draw() {
    root.innerHTML = `<section class="screen memory-screen"><button class="menu-button" data-menu>Menu</button><div class="center"><p class="kicker">Memory · ${languageName(learning)}</p><div class="memory-grid">${cards.map(card => `<button class="memory-card ${matched.has(card.pair)?'matched':''}" data-id="${card.id}" ${matched.has(card.pair)?'disabled':''}><span>${card.target}</span><small>${card.support}</small></button>`).join('')}</div><p class="feedback" data-feedback>${matched.size===4?'Geschafft.':''}</p></div></section>`;
    root.querySelector('[data-menu]').onclick = () => { stopSpeech(); store.setState({screen:'menu'}); };
    root.querySelectorAll('[data-id]').forEach(button => button.onclick = async () => {
      if (open.includes(button.dataset.id)) return;
      open.push(button.dataset.id);
      const card = cards.find(x => x.id === button.dataset.id);
      await speak(card.target, voice, {enabled:state.audioOn,rate:.72}).catch(() => {});
      if (open.length < 2) return;
      const first = cards.find(x => x.id === open[0]);
      const second = cards.find(x => x.id === open[1]);
      if (first.pair === second.pair) {
        matched.add(first.pair);
        open = [];
        draw();
      } else {
        root.querySelector('[data-feedback]').textContent = 'Nicht dieses Paar.';
        window.setTimeout(() => { open=[]; draw(); }, 650);
      }
    });
  }
  draw();
}
