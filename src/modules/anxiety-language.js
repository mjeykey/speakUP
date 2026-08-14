import { speak, stopSpeech } from '../audio/speech.js?v=61';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=3';

const EXERCISES = {
  'en-GB': [
    ['I need a moment.','I need ___ moment.',['a','the','very'],'a'],
    ['Please speak slowly.','Please speak ___.',['slowly','angry','yesterday'],'slowly'],
    ['Can you say that again?','Can you say that ___?',['again','never','outside'],'again'],
    ['I do not understand.','I do not ___.',['understand','running','window'],'understand'],
    ['I am safe right now.','I am ___ right now.',['safe','table','late'],'safe']
  ],
  'de-DE': [
    ['Ich brauche einen Moment.','Ich brauche ___ Moment.',['einen','schnell','gestern'],'einen'],
    ['Bitte sprich langsam.','Bitte sprich ___.',['langsam','Fenster','gestern'],'langsam'],
    ['Kannst du das noch einmal sagen?','Kannst du das noch einmal ___?',['sagen','laufen','Tür'],'sagen'],
    ['Ich verstehe das nicht.','Ich ___ das nicht.',['verstehe','schlafe','öffne'],'verstehe'],
    ['Ich bin gerade sicher.','Ich bin gerade ___.',['sicher','Tisch','spät'],'sicher']
  ],
  'pt-PT': [
    ['Preciso de um momento.','Preciso de um ___.',['momento','ontem','rápido'],'momento'],
    ['Por favor, fale devagar.','Por favor, fale ___.',['devagar','janela','ontem'],'devagar'],
    ['Pode dizer isso outra vez?','Pode dizer isso outra ___?',['vez','porta','cedo'],'vez'],
    ['Não compreendo.','Não ___.',['compreendo','corro','mesa'],'compreendo'],
    ['Estou segura agora.','Estou ___ agora.',['segura','tarde','cadeira'],'segura']
  ],
  'es-ES': [
    ['Necesito un momento.','Necesito un ___.',['momento','ayer','rápido'],'momento'],
    ['Por favor, habla despacio.','Por favor, habla ___.',['despacio','ventana','ayer'],'despacio'],
    ['¿Puedes decirlo otra vez?','¿Puedes decirlo otra ___?',['vez','mesa','pronto'],'vez'],
    ['No entiendo.','No ___.',['entiendo','corro','puerta'],'entiendo'],
    ['Estoy segura ahora mismo.','Estoy ___ ahora mismo.',['segura','tarde','silla'],'segura']
  ],
  'fr-FR': [
    ["J’ai besoin d’un moment.","J’ai besoin d’un ___.",['moment','hier','vite'],'moment'],
    ['Parlez lentement, s’il vous plaît.','Parlez ___, s’il vous plaît.',['lentement','fenêtre','hier'],'lentement'],
    ['Pouvez-vous répéter ?','Pouvez-vous ___ ?',['répéter','courir','table'],'répéter'],
    ['Je ne comprends pas.','Je ne ___ pas.',['comprends','dors','ouvre'],'comprends'],
    ['Je suis en sécurité maintenant.','Je suis en ___ maintenant.',['sécurité','retard','chaise'],'sécurité']
  ],
  'hr-HR': [
    ['Treba mi trenutak.','Treba mi ___.',['trenutak','jučer','brzo'],'trenutak'],
    ['Molim vas, govorite polako.','Molim vas, govorite ___.',['polako','prozor','jučer'],'polako'],
    ['Možete li to ponoviti?','Možete li to ___?',['ponoviti','trčati','stol'],'ponoviti'],
    ['Ne razumijem.','Ne ___.',['razumijem','spavam','otvaram'],'razumijem'],
    ['Sada sam sigurna.','Sada sam ___.',['sigurna','kasno','stolica'],'sigurna']
  ],
  'it-IT': [
    ['Ho bisogno di un momento.','Ho bisogno di un ___.',['momento','ieri','veloce'],'momento'],
    ['Per favore, parla lentamente.','Per favore, parla ___.',['lentamente','finestra','ieri'],'lentamente'],
    ['Puoi ripeterlo?','Puoi ___?',['ripeterlo','correre','tavolo'],'ripeterlo'],
    ['Non capisco.','Non ___.',['capisco','dormo','apro'],'capisco'],
    ['Sono al sicuro adesso.','Sono al ___ adesso.',['sicuro','tardi','sedia'],'sicuro']
  ]
};

function canonical(code){ if(code==='es-AN')return 'es-ES'; if(code==='hr-DAL')return 'hr-HR'; return code; }
function shuffle(items){ return [...items].sort(()=>Math.random()-.5); }
function esc(v){ return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }

export function renderAnxiety(root,store){
  const state=store.getState();
  const code=canonical(state.learningLanguage);
  const items=EXERCISES[code]||EXERCISES['en-GB'];
  const voice=getSpeechLanguage(state.learningLanguage);
  let index=0;
  let feedback='';

  function draw(){
    const [sentence,gap,options,answer]=items[index];
    root.innerHTML=`<section class="screen anxiety-world-screen"><button class="menu-button" data-menu>Menu</button><div class="center emotion-journey"><p class="kicker">Anxiety · ${esc(languageName(state.learningLanguage))}</p><h1>Sprache für den Moment</h1><p class="muted">Hören, nachsprechen, dann ergänzen.</p><div class="emotion-panel"><p class="story-copy">${esc(sentence)}</p><button class="secondary-button" data-listen>🔊 Anhören</button></div><div class="emotion-panel"><p class="kicker">Lückensatz</p><p class="story-copy">${esc(gap)}</p><div class="emotion-answer-grid">${shuffle(options).map(x=>`<button class="emotion-answer" data-answer="${esc(x)}">${esc(x)}</button>`).join('')}</div><p class="feedback">${esc(feedback)}</p></div><div class="memory-actions"><button class="secondary-button" data-prev ${index===0?'disabled':''}>←</button><button class="primary-button" data-next>${index===items.length-1?'Neu starten':'Nächster Satz'}</button></div></div></section>`;
    root.querySelector('[data-menu]').onclick=()=>{stopSpeech();store.setState({screen:'menu'});};
    root.querySelector('[data-listen]').onclick=()=>speak(sentence,voice,{enabled:state.audioOn,rate:.7}).catch(()=>{});
    root.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{feedback=b.dataset.answer===answer?'✓ Richtig':'Noch einmal versuchen.';draw();});
    root.querySelector('[data-prev]').onclick=()=>{index=Math.max(0,index-1);feedback='';draw();};
    root.querySelector('[data-next]').onclick=()=>{index=index===items.length-1?0:index+1;feedback='';draw();};
  }
  draw();
}
