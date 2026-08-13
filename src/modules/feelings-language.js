import { EMOTIONS } from '../data/emotions/index.js?v=2';
import { getEmotionLabels, resolveEmotionLanguage } from '../data/emotions/language-packs.js?v=1';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';
import { stopSpeech, speak } from '../audio/speech.js?v=60';

function esc(value) {
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

const CONTENT = {
  'en-GB': {
    anger: { words:['angry','annoyed','furious'], phrases:['I am angry right now.','I need a minute before I answer.','That was not okay with me.'], fun:'Imagine their trousers sliding down in the middle of the argument.' },
    jealousy: { words:['jealous','comparison','insecure'], phrases:['I feel jealous.','I am comparing myself right now.','Someone else doing well does not erase me.'], fun:'Imagine the comparison wearing a ridiculously tiny crown.' },
    insecure: { words:['unsure','hesitant','capable'], phrases:['I am not sure yet.','I can still ask the question.','I belong in this conversation too.'], fun:'Say it as if your chair already has your name on it.' },
    excited: { words:['excited','thrilled','eager'], phrases:['I am really excited.','I cannot wait to tell you.','This is such good news.'], fun:'Give the excitement a sentence you would shout to your best friend.' }
  },
  'de-DE': {
    anger: { words:['wütend','genervt','sauer'], phrases:['Ich bin gerade wütend.','Ich brauche einen Moment, bevor ich antworte.','Das war für mich nicht in Ordnung.'], fun:'Stell dir vor, mitten im Streit rutscht der Person die Hose runter.' },
    jealousy: { words:['eifersüchtig','Vergleich','unsicher'], phrases:['Ich bin gerade eifersüchtig.','Ich vergleiche mich gerade.','Der Erfolg eines anderen macht mich nicht kleiner.'], fun:'Stell dir den Vergleich mit einer lächerlich kleinen Krone vor.' },
    insecure: { words:['unsicher','zögerlich','fähig'], phrases:['Ich bin mir noch nicht sicher.','Ich kann die Frage trotzdem stellen.','Ich gehöre auch in dieses Gespräch.'], fun:'Sag es so, als würde auf deinem Stuhl schon dein Name stehen.' },
    excited: { words:['aufgeregt','begeistert','gespannt'], phrases:['Ich bin richtig aufgeregt.','Ich kann es kaum erwarten, dir davon zu erzählen.','Das sind so gute Neuigkeiten.'], fun:'Mach daraus einen Satz, den du deiner besten Freundin zurufen würdest.' }
  },
  'pt-PT': {
    anger: { words:['zangado','irritado','furioso'], phrases:['Estou mesmo zangada.','Preciso de um minuto antes de responder.','Isto não foi aceitável para mim.'], fun:'Imagina que, a meio da discussão, as calças da pessoa começam a cair.' },
    jealousy: { words:['ciúme','comparação','insegurança'], phrases:['Estou com ciúmes.','Estou a comparar-me neste momento.','O sucesso de outra pessoa não me torna menor.'], fun:'Imagina a comparação com uma coroa minúscula e ridícula.' },
    insecure: { words:['inseguro','hesitante','capaz'], phrases:['Ainda não tenho a certeza.','Posso fazer a pergunta na mesma.','Eu também pertenço a esta conversa.'], fun:'Diz a frase como se a cadeira já tivesse o teu nome.' },
    excited: { words:['entusiasmado','animado','ansioso por'], phrases:['Estou mesmo entusiasmada.','Mal posso esperar para te contar.','São notícias mesmo boas.'], fun:'Transforma isso numa frase que gritarias à tua melhor amiga.' }
  },
  'es-ES': {
    anger: { words:['enfadado','molesto','furioso'], phrases:['Estoy muy enfadada ahora mismo.','Necesito un minuto antes de responder.','Eso no me ha parecido bien.'], fun:'Imagina que, en plena discusión, se le empiezan a caer los pantalones.' },
    jealousy: { words:['celos','comparación','inseguridad'], phrases:['Siento celos.','Ahora mismo me estoy comparando.','El éxito de otra persona no me hace más pequeña.'], fun:'Imagina la comparación con una corona diminuta y ridícula.' },
    insecure: { words:['inseguro','dudoso','capaz'], phrases:['Todavía no estoy segura.','Aun así puedo hacer la pregunta.','Yo también pertenezco a esta conversación.'], fun:'Dilo como si tu silla ya tuviera tu nombre.' },
    excited: { words:['emocionado','entusiasmado','ilusionado'], phrases:['Estoy superemocionada.','No puedo esperar para contártelo.','Son noticias buenísimas.'], fun:'Conviértelo en una frase que le gritarías a tu mejor amiga.' }
  },
  'fr-FR': {
    anger: { words:['en colère','agacé','furieux'], phrases:['Je suis vraiment en colère.','J’ai besoin d’une minute avant de répondre.','Pour moi, ce n’était pas acceptable.'], fun:'Imagine que son pantalon commence à tomber en pleine dispute.' },
    jealousy: { words:['jaloux','comparaison','insécurité'], phrases:['Je suis jalouse.','Je suis en train de me comparer.','La réussite de quelqu’un d’autre ne me diminue pas.'], fun:'Imagine la comparaison avec une minuscule couronne ridicule.' },
    insecure: { words:['incertain','hésitant','capable'], phrases:['Je ne suis pas encore sûre.','Je peux quand même poser la question.','J’ai aussi ma place dans cette conversation.'], fun:'Dis-le comme si ta chaise portait déjà ton nom.' },
    excited: { words:['enthousiaste','ravi','impatient'], phrases:['Je suis vraiment enthousiaste.','J’ai tellement hâte de te raconter.','C’est une super nouvelle.'], fun:'Transforme ça en phrase que tu crierais à ta meilleure amie.' }
  },
  'hr-HR': {
    anger: { words:['ljut','iznerviran','bijesan'], phrases:['Sada sam stvarno ljuta.','Treba mi minuta prije nego odgovorim.','To mi nije bilo u redu.'], fun:'Zamisli da toj osobi usred svađe počnu padati hlače.' },
    jealousy: { words:['ljubomora','usporedba','nesigurnost'], phrases:['Osjećam ljubomoru.','Trenutno se uspoređujem.','Tuđi uspjeh ne umanjuje mene.'], fun:'Zamisli usporedbu s malom smiješnom krunom.' },
    insecure: { words:['nesiguran','neodlučan','sposoban'], phrases:['Još nisam sigurna.','Svejedno mogu postaviti pitanje.','I ja pripadam ovom razgovoru.'], fun:'Reci to kao da na stolici već piše tvoje ime.' },
    excited: { words:['uzbuđen','oduševljen','nestrpljiv'], phrases:['Baš sam uzbuđena.','Jedva čekam da ti ispričam.','Ovo su odlične vijesti.'], fun:'Pretvori to u rečenicu koju bi viknula najboljoj prijateljici.' }
  }
};

function pack(language, emotionId, label) {
  const base = CONTENT[language] || CONTENT['en-GB'];
  return base[emotionId] || { words:[label], phrases:[label], fun:'' };
}

export function renderEmotions(root, store) {
  const state = store.getState();
  const lang = resolveEmotionLanguage(state.learningLanguage);
  const labels = getEmotionLabels(lang);
  const voice = getSpeechLanguage(state.learningLanguage);
  const languageLabel = languageName(state.learningLanguage);
  let selected = null;

  const say = text => speak(text, voice, { enabled: store.getState().audioOn, rate:.72 });
  const leave = () => { stopSpeech(); store.setState({ screen:'menu' }); };

  function picker() {
    root.innerHTML = `<section class="screen emotions-screen"><button class="menu-button" data-menu>Menu</button><div class="emotions-shell"><p class="kicker">${esc(languageLabel)}</p><h1>${esc(labels.title)}</h1><p class="muted">Words, expressions and a little humour — no lectures.</p><div class="emotion-grid">${EMOTIONS.map(item => `<button class="emotion-card" data-emotion="${item.id}"><span>${item.emoji}</span><strong>${esc(labels.emotions[item.id] || item.title)}</strong></button>`).join('')}</div></div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelectorAll('[data-emotion]').forEach(button => button.onclick = () => { selected = EMOTIONS.find(item => item.id === button.dataset.emotion); detail(); });
  }

  function detail() {
    const label = labels.emotions[selected.id] || selected.title;
    const item = pack(lang, selected.id, label);
    root.innerHTML = `<section class="screen emotions-screen"><button class="menu-button" data-menu>Menu</button><div class="emotions-shell emotion-journey"><p class="emotion-current">${selected.emoji} ${esc(label)}</p><div class="emotion-panel emotion-learning-card"><p class="kicker">Words</p><div class="emotion-answer-grid">${item.words.map(word => `<button class="emotion-answer" data-say="${esc(word)}">${esc(word)}</button>`).join('')}</div></div><div class="emotion-panel emotion-learning-card"><p class="kicker">What you can say</p>${item.phrases.map(sentence => `<button class="menu-card" data-say="${esc(sentence)}"><span>${esc(sentence)}</span><small>Tap to hear it.</small></button>`).join('')}</div>${item.fun ? `<div class="emotion-panel emotion-calm-card"><div class="emotion-calm-icon">😄</div><p class="kicker">Just for fun</p><p class="emotion-body emotion-calm-sentence">${esc(item.fun)}</p><button class="secondary-button" data-say="${esc(item.fun)}">${esc(labels.listen)}</button></div>` : ''}<div class="emotion-controls"><button class="secondary-button" data-back>${esc(labels.another)}</button></div></div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-back]').onclick = picker;
    root.querySelectorAll('[data-say]').forEach(button => button.onclick = () => say(button.dataset.say));
  }

  picker();
}
