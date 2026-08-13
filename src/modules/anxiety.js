import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';

const L = {
  profile: {
    'en-GB': "I'm Anxiety. What did you expect? I'm delusional. I listen to useless panic, I have no idea what boundaries are, and I still don't understand what the word stop means. So hell yeah... I'm definitely not therapy. If I stay too long, you might actually need one. Anyway. Come in. You have to see this...",
    'de-DE': 'Ich bin Anxiety. Was hast du erwartet? Ich bin völlig delusional. Ich höre auf nutzlose Panik, habe keine Ahnung, was Grenzen sind, und verstehe immer noch nicht, was das Wort Stopp bedeutet. Also ja ... Therapie bin ich definitiv nicht. Wenn ich zu lange bleibe, brauchst du am Ende vielleicht wirklich eine. Egal. Komm rein. Du musst das sehen ...',
    'pt-PT': 'Eu sou a Anxiety. O que estavas à espera? Sou completamente delirante. Dou ouvidos a pânico inútil, não faço ideia do que são limites e ainda não percebi o que significa a palavra parar. Por isso, sim... terapia eu definitivamente não sou. Se eu ficar demasiado tempo, talvez acabes mesmo por precisar de uma. Enfim. Entra. Tens de ver isto...',
    'es-ES': 'Soy Anxiety. ¿Qué esperabas? Estoy completamente delirante. Escucho al pánico inútil, no tengo ni idea de lo que son los límites y todavía no entiendo qué significa la palabra parar. Así que sí... terapia desde luego no soy. Si me quedo demasiado tiempo, quizá acabes necesitando una de verdad. En fin. Entra. Tienes que ver esto...',
    'fr-FR': "Je suis Anxiety. Tu t'attendais à quoi ? Je suis complètement délirante. J'écoute la panique inutile, je ne sais même pas ce que sont les limites et je n'ai toujours pas compris le mot stop. Donc oui... je ne suis clairement pas une thérapie. Si je reste trop longtemps, tu risques vraiment d'en avoir besoin d'une. Bref. Entre. Il faut que tu voies ça...",
    'hr-HR': 'Ja sam Anxiety. Što si očekivala? Totalno sam deluzionalna. Slušam beskorisnu paniku, nemam pojma što su granice i još uvijek ne razumijem što znači riječ stop. Tako da da... definitivno nisam terapija. Ako ostanem predugo, možda će ti stvarno trebati jedna. Uglavnom. Uđi. Ovo moraš vidjeti...',
    'it-IT': "Sono Anxiety. Cosa ti aspettavi? Sono completamente delirante. Ascolto il panico inutile, non ho idea di cosa siano i confini e non ho ancora capito cosa significhi la parola stop. Quindi sì... non sono decisamente una terapia. Se resto troppo a lungo, potresti davvero averne bisogno di una. Comunque. Entra. Devi vedere questa cosa..."
  },
  intro: {
    'en-GB': "Hi. I'm Anxiety. I like worrying about futures that haven't happened yet.",
    'de-DE': 'Hi. Ich bin Anxiety. Ich mache mir gern Sorgen über Zukünfte, die noch gar nicht passiert sind.',
    'pt-PT': 'Olá. Eu sou a Anxiety. Gosto de me preocupar com futuros que ainda nem aconteceram.',
    'es-ES': 'Hola. Soy Anxiety. Me gusta preocuparme por futuros que todavía no han ocurrido.',
    'fr-FR': "Salut. Je suis Anxiety. J'aime m'inquiéter de futurs qui ne sont pas encore arrivés.",
    'hr-HR': 'Bok. Ja sam Anxiety. Volim brinuti o budućnostima koje se još nisu dogodile.',
    'it-IT': 'Ciao. Sono Anxiety. Mi piace preoccuparmi di futuri che non sono ancora accaduti.'
  },
  hate1: {
    'en-GB': "You know what I hate? Distractions. And your ugly little friends cheering you up. Absolutely disgusting.",
    'de-DE': 'Weißt du, was ich hasse? Ablenkung. Und deine hässlichen kleinen Freunde, die dich aufmuntern. Absolut widerlich.',
    'pt-PT': 'Sabes o que eu odeio? Distrações. E os teus amiguinhos feios a animarem-te. Absolutamente nojento.',
    'es-ES': '¿Sabes qué odio? Las distracciones. Y a tus amiguitos feos animándote. Absolutamente asqueroso.',
    'fr-FR': "Tu sais ce que je déteste ? Les distractions. Et tes petits amis moches qui te remontent le moral. Absolument dégoûtant.",
    'hr-HR': 'Znaš što mrzim? Ometanja. I tvoje ružne male prijatelje koji te bodre. Apsolutno odvratno.',
    'it-IT': 'Sai cosa odio? Le distrazioni. E i tuoi brutti amichetti che ti tirano su. Assolutamente disgustoso.'
  },
  hate2: {
    'en-GB': "You're laughing. You're doing something. You're talking to people. How am I supposed to catastrophize under these working conditions?",
    'de-DE': 'Du lachst. Du machst irgendwas. Du redest mit Menschen. Wie soll ich unter diesen Arbeitsbedingungen bitte katastrophisieren?',
    'pt-PT': 'Estás a rir. Estás a fazer alguma coisa. Estás a falar com pessoas. Como é que eu hei de catastrofizar nestas condições de trabalho?',
    'es-ES': 'Te estás riendo. Estás haciendo algo. Estás hablando con gente. ¿Cómo se supone que voy a catastrofizar con estas condiciones de trabajo?',
    'fr-FR': "Tu ris. Tu fais quelque chose. Tu parles aux gens. Comment veux-tu que je catastrophise dans ces conditions de travail ?",
    'hr-HR': 'Smiješ se. Nešto radiš. Razgovaraš s ljudima. Kako bih ja trebala katastrofizirati u ovakvim radnim uvjetima?',
    'it-IT': 'Stai ridendo. Stai facendo qualcosa. Stai parlando con le persone. Come dovrei catastrofizzare in queste condizioni di lavoro?'
  },
  evidence: {
    'en-GB': "I also hate evidence. You keep asking, 'But did that actually happen?' Please stop fact-checking me. I'm trying to panic.",
    'de-DE': 'Ich hasse übrigens auch Beweise. Du fragst ständig: „Aber ist das wirklich passiert?“ Bitte hör auf, mich zu fact-checken. Ich versuche hier gerade, Panik zu machen.',
    'pt-PT': 'Também odeio provas. Estás sempre a perguntar: “Mas isso aconteceu mesmo?” Por favor, para de verificar os meus factos. Estou a tentar entrar em pânico.',
    'es-ES': 'También odio las pruebas. Sigues preguntando: “¿Pero eso pasó de verdad?” Por favor, deja de comprobar mis datos. Estoy intentando entrar en pánico.',
    'fr-FR': "Je déteste aussi les preuves. Tu n'arrêtes pas de demander : « Mais est-ce que c'est vraiment arrivé ? » Arrête de vérifier mes faits, s'il te plaît. J'essaie de paniquer.",
    'hr-HR': 'Mrzim i dokaze. Stalno pitaš: „Ali je li se to stvarno dogodilo?“ Molim te, prestani provjeravati moje činjenice. Pokušavam paničariti.',
    'it-IT': 'Odio anche le prove. Continui a chiedere: “Ma è successo davvero?” Per favore, smettila di verificare i miei fatti. Sto cercando di andare nel panico.'
  },
  future: {
    'en-GB': "The future is simply what hasn't happened yet.", 'de-DE': 'Die Zukunft ist einfach das, was noch nicht passiert ist.', 'pt-PT': 'O futuro é simplesmente aquilo que ainda não aconteceu.', 'es-ES': 'El futuro es simplemente lo que todavía no ha ocurrido.', 'fr-FR': "Le futur, c'est simplement ce qui ne s'est pas encore produit.", 'hr-HR': 'Budućnost je jednostavno ono što se još nije dogodilo.', 'it-IT': 'Il futuro è semplicemente ciò che non è ancora successo.'
  },
  come: {'en-GB':'Come with me. Just one step.','de-DE':'Komm mit. Nur ein Schritt.','pt-PT':'Vem comigo. Só um passo.','es-ES':'Ven conmigo. Solo un paso.','fr-FR':'Viens avec moi. Juste un pas.','hr-HR':'Pođi sa mnom. Samo jedan korak.','it-IT':'Vieni con me. Solo un passo.'},
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

const STORY = ['intro','hate1','hate2','evidence','future','come','step','stepTo','grave','wait','push','forgot','see','moments','handle','joke1','joke2'];
function c(code){ if(code==='es-AN') return 'es-ES'; if(code==='hr-DAL') return 'hr-HR'; return code; }
function t(key,code){ return L[key]?.[c(code)] || L[key]?.['en-GB'] || ''; }

export function renderAnxiety(root, store) {
  const state = store.getState();
  const learning = state.learningLanguage;
  const support = state.nativeLanguage;
  let index = -1;
  const voice = getSpeechLanguage(learning);
  function draw(){
    const isProfile = index === -1;
    const key = isProfile ? 'profile' : STORY[index];
    const target = t(key,learning);
    const translation = t(key,support);
    root.innerHTML = `<section class="screen anxiety-screen"><button class="menu-button" data-menu>Menu</button><div class="center"><p class="kicker">Anxiety · ${languageName(learning)}</p><div class="communication-card"><p class="communication-target">${target}</p>${c(learning)!==c(support)?`<p class="communication-translation">${translation}</p>`:''}</div><div class="communication-actions"><button class="secondary-button" data-listen>🔊</button><button class="primary-button" data-next>${index===STORY.length-1?'Again':isProfile?'Come in →':'Next →'}</button></div></div></section>`;
    root.querySelector('[data-menu]').onclick=()=>{stopSpeech();store.setState({screen:'menu'});};
    root.querySelector('[data-listen]').onclick=()=>speak(target,voice,{enabled:store.getState().audioOn,rate:.76}).catch(()=>{});
    root.querySelector('[data-next]').onclick=()=>{stopSpeech();index=index===STORY.length-1?-1:index+1;draw();};
  }
  draw();
}
