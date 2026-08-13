import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';

const DATA = {
  'en-GB': [
    ['😤','anger',['angry','annoyed','furious'],['I am angry right now.','I need a minute before I answer.','That was not okay with me.'],'Imagine their trousers sliding down in the middle of the argument.'],
    ['💚','jealousy',['jealous','comparison','insecure'],['I feel jealous.','I am comparing myself right now.','Someone else doing well does not erase me.'],'Imagine the comparison wearing a ridiculously tiny crown.'],
    ['🌱','insecurity',['unsure','hesitant','capable'],['I am not sure yet.','I can still ask the question.','I belong in this conversation too.'],'Say it as if your chair already has your name on it.'],
    ['✨','excitement',['excited','thrilled','eager'],['I am really excited.','I cannot wait to tell you.','This is such good news.'],'Say it like you are calling your best friend with the news.']
  ],
  'de-DE': [
    ['😤','Wut',['wütend','genervt','sauer'],['Ich bin gerade wütend.','Ich brauche einen Moment, bevor ich antworte.','Das war für mich nicht in Ordnung.'],'Stell dir vor, mitten im Streit rutscht der Person die Hose runter.'],
    ['💚','Eifersucht',['eifersüchtig','Vergleich','unsicher'],['Ich bin gerade eifersüchtig.','Ich vergleiche mich gerade.','Der Erfolg eines anderen macht mich nicht kleiner.'],'Stell dir den Vergleich mit einer lächerlich kleinen Krone vor.'],
    ['🌱','Unsicherheit',['unsicher','zögerlich','fähig'],['Ich bin mir noch nicht sicher.','Ich kann die Frage trotzdem stellen.','Ich gehöre auch in dieses Gespräch.'],'Sag es so, als würde auf deinem Stuhl schon dein Name stehen.'],
    ['✨','Aufregung',['aufgeregt','begeistert','gespannt'],['Ich bin richtig aufgeregt.','Ich kann es kaum erwarten, dir davon zu erzählen.','Das sind richtig gute Neuigkeiten.'],'Sag es so, als würdest du gerade deine beste Freundin anrufen.']
  ],
  'pt-PT': [
    ['😤','zanga',['zangado','irritado','furioso'],['Estou mesmo zangada.','Preciso de um minuto antes de responder.','Isto não foi aceitável para mim.'],'Imagina que, a meio da discussão, as calças da pessoa começam a cair.'],
    ['💚','ciúmes',['ciúme','comparação','insegurança'],['Estou com ciúmes.','Estou a comparar-me neste momento.','O sucesso de outra pessoa não me torna menor.'],'Imagina a comparação com uma coroa minúscula e ridícula.'],
    ['🌱','insegurança',['inseguro','hesitante','capaz'],['Ainda não tenho a certeza.','Posso fazer a pergunta na mesma.','Eu também pertenço a esta conversa.'],'Diz a frase como se a cadeira já tivesse o teu nome.'],
    ['✨','entusiasmo',['entusiasmado','animado','ansioso'],['Estou mesmo entusiasmada.','Mal posso esperar para te contar.','São notícias mesmo boas.'],'Diz como se estivesses a ligar à tua melhor amiga para contar a novidade.']
  ],
  'es-ES': [
    ['😤','enfado',['enfadado','molesto','furioso'],['Estoy muy enfadada ahora mismo.','Necesito un minuto antes de responder.','Eso no me ha parecido bien.'],'Imagina que, en plena discusión, se le empiezan a caer los pantalones.'],
    ['💚','celos',['celos','comparación','inseguridad'],['Siento celos.','Ahora mismo me estoy comparando.','El éxito de otra persona no me hace más pequeña.'],'Imagina la comparación con una corona diminuta y ridícula.'],
    ['🌱','inseguridad',['inseguro','dudoso','capaz'],['Todavía no estoy segura.','Aun así puedo hacer la pregunta.','Yo también pertenezco a esta conversación.'],'Dilo como si tu silla ya tuviera tu nombre.'],
    ['✨','ilusión',['emocionado','entusiasmado','ilusionado'],['Estoy superemocionada.','No puedo esperar para contártelo.','Son noticias buenísimas.'],'Dilo como si estuvieras llamando a tu mejor amiga con la noticia.']
  ],
  'fr-FR': [
    ['😤','colère',['en colère','agacé','furieux'],['Je suis vraiment en colère.','J’ai besoin d’une minute avant de répondre.','Pour moi, ce n’était pas acceptable.'],'Imagine que son pantalon commence à tomber en pleine dispute.'],
    ['💚','jalousie',['jaloux','comparaison','insécurité'],['Je suis jalouse.','Je suis en train de me comparer.','La réussite de quelqu’un d’autre ne me diminue pas.'],'Imagine la comparaison avec une minuscule couronne ridicule.'],
    ['🌱','incertitude',['incertain','hésitant','capable'],['Je ne suis pas encore sûre.','Je peux quand même poser la question.','J’ai aussi ma place dans cette conversation.'],'Dis-le comme si ta chaise portait déjà ton nom.'],
    ['✨','enthousiasme',['enthousiaste','ravi','impatient'],['Je suis vraiment enthousiaste.','J’ai tellement hâte de te raconter.','C’est une super nouvelle.'],'Dis-le comme si tu appelais ta meilleure amie pour lui annoncer la nouvelle.']
  ],
  'hr-HR': [
    ['😤','ljutnja',['ljut','iznerviran','bijesan'],['Sada sam stvarno ljuta.','Treba mi minuta prije nego odgovorim.','To mi nije bilo u redu.'],'Zamisli da toj osobi usred svađe počnu padati hlače.'],
    ['💚','ljubomora',['ljubomora','usporedba','nesigurnost'],['Osjećam ljubomoru.','Trenutno se uspoređujem.','Tuđi uspjeh ne umanjuje mene.'],'Zamisli usporedbu s malom smiješnom krunom.'],
    ['🌱','nesigurnost',['nesiguran','neodlučan','sposoban'],['Još nisam sigurna.','Svejedno mogu postaviti pitanje.','I ja pripadam ovom razgovoru.'],'Reci to kao da na stolici već piše tvoje ime.'],
    ['✨','uzbuđenje',['uzbuđen','oduševljen','nestrpljiv'],['Baš sam uzbuđena.','Jedva čekam da ti ispričam.','Ovo su odlične vijesti.'],'Reci to kao da upravo zoveš najbolju prijateljicu s novostima.']
  ],
  'it-IT': [
    ['😤','rabbia',['arrabbiato','infastidito','furioso'],['Sono davvero arrabbiata.','Ho bisogno di un minuto prima di rispondere.','Per me questo non andava bene.'],'Immagina che nel mezzo della discussione gli scivolino giù i pantaloni.'],
    ['💚','gelosia',['geloso','confronto','insicurezza'],['Sono gelosa.','In questo momento mi sto confrontando.','Il successo di un’altra persona non mi rende meno importante.'],'Immagina il confronto con una corona minuscola e ridicola.'],
    ['🌱','insicurezza',['insicuro','esitante','capace'],['Non sono ancora sicura.','Posso comunque fare la domanda.','Anch’io ho il mio posto in questa conversazione.'],'Dillo come se sulla sedia ci fosse già il tuo nome.'],
    ['✨','entusiasmo',['entusiasta','emozionato','impaziente'],['Sono davvero entusiasta.','Non vedo l’ora di raccontartelo.','È una bellissima notizia.'],'Dillo come se stessi chiamando la tua migliore amica per darle la notizia.']
  ]
};

function canonical(code) { if (code === 'es-AN') return 'es-ES'; if (code === 'hr-DAL') return 'hr-HR'; return code; }
function esc(v) { return String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }

export function renderEmotions(root, store) {
  const state = store.getState();
  const code = canonical(state.learningLanguage);
  const items = DATA[code] || DATA['en-GB'];
  const voice = getSpeechLanguage(state.learningLanguage);
  let selected = null;
  const say = text => speak(text, voice, { enabled:state.audioOn, rate:.72 }).catch(() => {});
  const leave = () => { stopSpeech(); store.setState({ screen:'menu' }); };

  function picker() {
    root.innerHTML = `<section class="screen emotions-screen"><button class="menu-button" data-menu>Menu</button><div class="emotions-shell"><p class="kicker">${esc(languageName(state.learningLanguage))}</p><h1>Emotionen</h1><div class="emotion-grid">${items.map((item,i) => `<button class="emotion-card" data-i="${i}"><span>${item[0]}</span><strong>${esc(item[1])}</strong></button>`).join('')}</div></div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelectorAll('[data-i]').forEach(button => button.onclick = () => { selected = items[Number(button.dataset.i)]; detail(); });
  }

  function detail() {
    root.innerHTML = `<section class="screen emotions-screen"><button class="menu-button" data-menu>Menu</button><div class="emotions-shell emotion-journey"><p class="emotion-current">${selected[0]} ${esc(selected[1])}</p><div class="emotion-panel"><p class="kicker">Wörter</p><div class="emotion-answer-grid">${selected[2].map(x => `<button class="emotion-answer" data-say="${esc(x)}">${esc(x)}</button>`).join('')}</div></div><div class="emotion-panel"><p class="kicker">Was du sagen kannst</p>${selected[3].map(x => `<button class="menu-card" data-say="${esc(x)}"><span>${esc(x)}</span></button>`).join('')}</div><div class="emotion-panel"><p class="kicker">😄</p><p>${esc(selected[4])}</p><button class="secondary-button" data-say="${esc(selected[4])}">🔊</button></div><button class="secondary-button" data-back>←</button></div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-back]').onclick = picker;
    root.querySelectorAll('[data-say]').forEach(button => button.onclick = () => say(button.dataset.say));
  }
  picker();
}
