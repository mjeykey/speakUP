import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';

const L = {
  intro: {
    'en-GB': "Hi. I'm Anxiety. I like worrying about futures that haven't happened yet.",
    'de-DE': 'Hi. Ich bin Anxiety. Ich mache mir gern Sorgen über Zukünfte, die noch gar nicht passiert sind.',
    'pt-PT': 'Olá. Eu sou a Anxiety. Gosto de me preocupar com futuros que ainda nem aconteceram.',
    'es-ES': 'Hola. Soy Anxiety. Me gusta preocuparme por futuros que todavía no han ocurrido.',
    'fr-FR': "Salut. Je suis Anxiety. J'aime m'inquiéter de futurs qui ne sont pas encore arrivés.",
    'hr-HR': 'Bok. Ja sam Anxiety. Volim brinuti o budućnostima koje se još nisu dogodile.',
    'it-IT': 'Ciao. Sono Anxiety. Mi piace preoccuparmi di futuri che non sono ancora accaduti.'
  },
  future: {
    'en-GB': "The future is simply what hasn't happened yet.",
    'de-DE': 'Die Zukunft ist einfach das, was noch nicht passiert ist.',
    'pt-PT': 'O futuro é simplesmente aquilo que ainda não aconteceu.',
    'es-ES': 'El futuro es simplemente lo que todavía no ha ocurrido.',
    'fr-FR': "Le futur, c'est simplement ce qui ne s'est pas encore produit.",
    'hr-HR': 'Budućnost je jednostavno ono što se još nije dogodilo.',
    'it-IT': 'Il futuro è semplicemente ciò che non è ancora successo.'
  },
  come: {
    'en-GB': 'Come with me. Just one step.', 'de-DE': 'Komm mit. Nur ein Schritt.', 'pt-PT': 'Vem comigo. Só um passo.', 'es-ES': 'Ven conmigo. Solo un paso.', 'fr-FR': 'Viens avec moi. Juste un pas.', 'hr-HR': 'Pođi sa mnom. Samo jedan korak.', 'it-IT': 'Vieni con me. Solo un passo.'
  },
  step: {'en-GB':'STEP','de-DE':'SCHRITT','pt-PT':'PASSO','es-ES':'PASO','fr-FR':'PAS','hr-HR':'KORAK','it-IT':'PASSO'},
  stepTo: {'en-GB':'STEP TO...','de-DE':'SCHRITT ZUM...','pt-PT':'PASSO PARA...','es-ES':'PASO HACIA...','fr-FR':'PAS VERS...','hr-HR':'KORAK PREMA...','it-IT':'PASSO VERSO...'},
  grave: {'en-GB':'THE GRAVE','de-DE':'DAS GRAB','pt-PT':'A SEPULTURA','es-ES':'LA TUMBA','fr-FR':'LA TOMBE','hr-HR':'GROB','it-IT':'LA TOMBA'},
  wait: {'en-GB':'Wait. WHAT?','de-DE':'Warte. WAS?','pt-PT':'Espera. O QUÊ?','es-ES':'Espera. ¿QUÉ?','fr-FR':'Attends. QUOI ?','hr-HR':'Čekaj. ŠTO?','it-IT':'Aspetta. COSA?'},
  push: {'en-GB':'Then Lisa pushed him.','de-DE':'Dann schubste Lisa ihn.','pt-PT':'Então a Lisa empurrou-o.','es-ES':'Entonces Lisa lo empujó.','fr-FR':'Puis Lisa le poussa.','hr-HR':'Onda ga je Lisa gurnula.','it-IT':'Poi Lisa lo spinse.'},
  forgot: {'en-GB':'For three seconds, he forgot everything he had been worrying about.','de-DE':'Drei Sekunden lang vergaß er alles, worüber er sich Sorgen gemacht hatte.','pt-PT':'Durante três segundos, esqueceu tudo aquilo com que se tinha preocupado.','es-ES':'Durante tres segundos, olvidó todo aquello que le preocupaba.','fr-FR':'Pendant trois secondes, il oublia tout ce qui l’inquiétait.','hr-HR':'Na tri sekunde zaboravio je sve o čemu je brinuo.','it-IT':'Per tre secondi dimenticò tutto ciò di cui si era preoccupato.'},
  see: {'en-GB':'See? That moment was the future a few seconds ago.','de-DE':'Siehst du? Dieser Moment war vor ein paar Sekunden noch die Zukunft.','pt-PT':'Vês? Há poucos segundos, este momento ainda era o futuro.','es-ES':'¿Ves? Hace unos segundos, este momento todavía era el futuro.','fr-FR':'Tu vois ? Il y a quelques secondes, ce moment était encore le futur.','hr-HR':'Vidiš? Prije nekoliko sekundi ovaj je trenutak još bio budućnost.','it-IT':'Vedi? Pochi secondi fa questo momento era ancora il futuro.'},
  moments: {'en-GB':'The future usually arrives in small moments. One moment. Then another.','de-DE':'Die Zukunft kommt meistens in kleinen Momenten. Ein Moment. Dann der nächste.','pt-PT':'O futuro costuma chegar em pequenos momentos. Um momento. Depois outro.','es-ES':'El futuro suele llegar en pequeños momentos. Un momento. Luego otro.','fr-FR':'Le futur arrive généralement par petits moments. Un moment. Puis un autre.','hr-HR':'Budućnost obično dolazi u malim trenucima. Jedan trenutak. Pa drugi.','it-IT':'Il futuro di solito arriva in piccoli momenti. Un momento. Poi un altro.'},
  handle: {'en-GB':'We can handle one moment.','de-DE':'Einen Moment schaffen wir.','pt-PT':'Conseguimos lidar com um momento.','es-ES':'Podemos con un momento.','fr-FR':'On peut gérer un moment.','hr-HR':'Možemo se nositi s jednim trenutkom.','it-IT':'Possiamo affrontare un momento.'},
  joke1: {'en-GB':"So... we're not solving the entire future today?",'de-DE':'Also ... lösen wir heute nicht die komplette Zukunft?','pt-PT':'Então... hoje não vamos resolver o futuro inteiro?','es-ES':'Entonces... ¿hoy no vamos a resolver todo el futuro?','fr-FR':"Alors... on ne va pas résoudre tout le futur aujourd'hui ?",'hr-HR':'Dakle... danas ne rješavamo cijelu budućnost?','it-IT':'Quindi... oggi non risolviamo tutto il futuro?'},
  joke2: {'en-GB':'Excellent. I was extremely underqualified.','de-DE':'Ausgezeichnet. Dafür war ich sowieso völlig unterqualifiziert.','pt-PT':'Excelente. Eu não tinha qualificação nenhuma para isso.','es-ES':'Excelente. No estaba nada cualificada para eso.','fr-FR':"Excellent. Je n'étais vraiment pas qualifiée pour ça.",'hr-HR':'Odlično. Ionako sam bila potpuno nekvalificirana za to.','it-IT':'Eccellente. Ero decisamente poco qualificata per quello.'}
};

const STORY = ['intro','future','come','step','stepTo','grave','wait','push','forgot','see','moments','handle','joke1','joke2'];
function c(code){ if(code==='es-AN') return 'es-ES'; if(code==='hr-DAL') return 'hr-HR'; return code; }
function t(key,code){ return L[key]?.[c(code)] || L[key]?.['en-GB'] || ''; }

export function renderAnxiety(root, store) {
  const state = store.getState();
  const learning = state.learningLanguage;
  const support = state.nativeLanguage;
  let index = 0;
  const voice = getSpeechLanguage(learning);

  function draw(){
    const key = STORY[index];
    const target = t(key,learning);
    const translation = t(key,support);
    root.innerHTML = `<section class="screen anxiety-screen"><button class="menu-button" data-menu>Menu</button><div class="center"><p class="kicker">Anxiety · ${languageName(learning)}</p><p class="muted">Language story about anxious thoughts — not treatment.</p><div class="communication-card"><p class="communication-target">${target}</p>${c(learning)!==c(support)?`<p class="communication-translation">${translation}</p>`:''}</div><div class="communication-actions"><button class="secondary-button" data-listen>🔊</button><button class="primary-button" data-next>${index===STORY.length-1?'Again':'Next →'}</button></div></div></section>`;
    root.querySelector('[data-menu]').onclick=()=>{stopSpeech();store.setState({screen:'menu'});};
    root.querySelector('[data-listen]').onclick=()=>speak(target,voice,{enabled:store.getState().audioOn,rate:.76}).catch(()=>{});
    root.querySelector('[data-next]').onclick=()=>{stopSpeech();index=index===STORY.length-1?0:index+1;draw();};
  }
  draw();
}
