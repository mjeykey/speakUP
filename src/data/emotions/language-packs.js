import { getPortugueseEmotionPractice } from './portuguese-voice.js?v=1';
import { getFrenchEmotionPractice } from './french-voice.js?v=1';

const EMOTION_NAMES = {
  'de-DE': { jealousy:'Eifersucht', anger:'Wut', anxiety:'Angst', stress:'Stress', sadness:'Traurigkeit', insecure:'Unsicherheit', overwhelmed:'Überforderung', excited:'Aufregung', lonely:'Einsamkeit', disappointed:'Enttäuschung', selflove:'Selbstliebe', spiral:'Gedankenkreisen' },
  'en-GB': { jealousy:'Jealousy', anger:'Anger', anxiety:'Anxiety', stress:'Stress', sadness:'Sadness', insecure:'Insecurity', overwhelmed:'Overwhelm', excited:'Excitement', lonely:'Loneliness', disappointed:'Disappointment', selflove:'Self-love', spiral:'Spiralling thoughts' },
  'es-ES': { jealousy:'Celos', anger:'Enfado', anxiety:'Ansiedad', stress:'Estrés', sadness:'Tristeza', insecure:'Inseguridad', overwhelmed:'Agobio', excited:'Entusiasmo', lonely:'Soledad', disappointed:'Decepción', selflove:'Amor propio', spiral:'Pensamientos repetitivos' },
  'hr-HR': { jealousy:'Ljubomora', anger:'Ljutnja', anxiety:'Tjeskoba', stress:'Stres', sadness:'Tuga', insecure:'Nesigurnost', overwhelmed:'Preopterećenost', excited:'Uzbuđenje', lonely:'Usamljenost', disappointed:'Razočaranje', selflove:'Ljubav prema sebi', spiral:'Ponavljajuće misli' }
};

export const EMOTION_LABELS = {
  'pt-PT': { title:'Como te sentes agora?', subtitle:'Escolhe uma emoção.', listen:'Ouvir', back:'Voltar', another:'Escolher outra emoção', choose:'Completa a instrução para continuar.', correct:'Certo! Agora faz o movimento.', tryAgain:'Quase. Escolhe outra palavra.', continue:'Continuar', finish:'Terminar', seconds:'segundos', emotions:{ jealousy:'Ciúme', anger:'Raiva', anxiety:'Ansiedade', stress:'Stress', sadness:'Tristeza', insecure:'Insegurança', overwhelmed:'Sobrecarregada', excited:'Entusiasmo', lonely:'Solidão', disappointed:'Desilusão', selflove:'Amor-próprio', spiral:'Pensamentos repetitivos' } },
  'fr-FR': { title:'Comment te sens-tu maintenant ?', subtitle:'Choisis une émotion.', listen:'Écouter', back:'Retour', another:'Choisir une autre émotion', choose:'Complète l’instruction pour continuer.', correct:'Exact ! Maintenant, fais le mouvement.', tryAgain:'Presque. Choisis un autre mot.', continue:'Continuer', finish:'Terminer', seconds:'secondes', emotions:{ jealousy:'Jalousie', anger:'Colère', anxiety:'Anxiété', stress:'Stress', sadness:'Tristesse', insecure:'Insécurité', overwhelmed:'Débordée', excited:'Enthousiasme', lonely:'Solitude', disappointed:'Déception', selflove:'Amour de soi', spiral:'Pensées répétitives' } },
  'de-DE': { title:'Wie fühlst du dich gerade?', subtitle:'Wähle ein Gefühl.', listen:'Anhören', back:'Zurück', another:'Anderes Gefühl wählen', choose:'Vervollständige die Anweisung.', correct:'Richtig! Führe jetzt die Bewegung aus.', tryAgain:'Fast. Wähle ein anderes Wort.', continue:'Weiter', finish:'Beenden', seconds:'Sekunden', emotions:EMOTION_NAMES['de-DE'] },
  'en-GB': { title:'How do you feel right now?', subtitle:'Choose an emotion.', listen:'Listen', back:'Back', another:'Choose another emotion', choose:'Complete the instruction to continue.', correct:'Correct! Now do the movement.', tryAgain:'Almost. Choose another word.', continue:'Continue', finish:'Finish', seconds:'seconds', emotions:EMOTION_NAMES['en-GB'] },
  'es-ES': { title:'¿Cómo te sientes ahora?', subtitle:'Elige una emoción.', listen:'Escuchar', back:'Volver', another:'Elegir otra emoción', choose:'Completa la instrucción para continuar.', correct:'¡Correcto! Ahora haz el movimiento.', tryAgain:'Casi. Elige otra palabra.', continue:'Continuar', finish:'Terminar', seconds:'segundos', emotions:EMOTION_NAMES['es-ES'] },
  'hr-HR': { title:'Kako se sada osjećaš?', subtitle:'Odaberi emociju.', listen:'Poslušaj', back:'Natrag', another:'Odaberi drugu emociju', choose:'Dovrši uputu za nastavak.', correct:'Točno! Sada napravi pokret.', tryAgain:'Skoro. Odaberi drugu riječ.', continue:'Nastavi', finish:'Završi', seconds:'sekundi', emotions:EMOTION_NAMES['hr-HR'] }
};

const PRACTICE = {
  'de-DE': {
    jealousy:['Eifersucht macht dich nicht zu einem schlechten Menschen.','anerkennen','vergleichen','vertrauen','Ich erkenne meine Eifersucht an.','Ich muss mich nicht vergleichen.','Ich kann meinem eigenen Wert vertrauen.'],
    anger:['Wut kann zeigen, dass eine Grenze überschritten wurde.','atmen','pausieren','schützen','Ich atme, bevor ich antworte.','Ich darf eine Pause machen.','Ich kann meine Grenzen ruhig schützen.'],
    anxiety:['Angst ist verständlich, wenn dein Kopf alles gleichzeitig lösen will.','atmen','beobachten','weitergehen','Ich atme langsam.','Ich beobachte meine Umgebung.','Ich gehe einen kleinen Schritt weiter.'],
    stress:['Stress entsteht oft, wenn zu viel gleichzeitig Aufmerksamkeit verlangt.','stoppen','wählen','ausruhen','Ich stoppe für einen Moment.','Ich wähle eine Priorität.','Ich darf mich ausruhen.'],
    sadness:['Traurigkeit zeigt oft, dass etwas wichtig war.','fühlen','annehmen','trösten','Ich darf Traurigkeit fühlen.','Ich nehme diesen schweren Tag an.','Ich tröste mich freundlich.'],
    insecure:['Unsicherheit bedeutet nicht, dass du unfähig bist.','versuchen','lernen','wachsen','Ich darf es versuchen.','Ich lerne Schritt für Schritt.','Ich kann wachsen, ohne perfekt zu sein.'],
    overwhelmed:['Du musst nicht alles auf einmal tragen.','trennen','wählen','bitten','Ich trenne dringend von später.','Ich wähle nur eine Aufgabe.','Ich darf um Hilfe bitten.'],
    excited:['Aufregung ist Energie, die du bewusst lenken kannst.','spüren','genießen','teilen','Ich spüre meine Freude.','Ich genieße diesen Moment.','Ich teile meine Begeisterung.'],
    lonely:['Der Wunsch nach Verbindung ist menschlich.','fühlen','kontaktieren','annähern','Ich erkenne meine Einsamkeit an.','Ich kann jemanden kontaktieren.','Ich darf mich langsam annähern.'],
    disappointed:['Enttäuschung tut weh, weil dir etwas wichtig war.','fühlen','akzeptieren','neu beginnen','Ich darf enttäuscht sein.','Ich akzeptiere, dass sich etwas geändert hat.','Ich kann neu beginnen.'],
    selflove:['Selbstliebe kann mit Respekt und Freundlichkeit beginnen.','respektieren','pflegen','wertschätzen','Ich respektiere meine Bedürfnisse.','Ich kümmere mich um mich.','Ich erkenne meinen Wert an.'],
    spiral:['Ein wiederkehrender Gedanke ist nicht automatisch wahr.','bemerken','hinterfragen','zurückkehren','Ich bemerke den Gedanken.','Ich darf ihn hinterfragen.','Ich kehre in den Moment zurück.']
  },
  'en-GB': {
    jealousy:['Jealousy does not make you a bad person.','notice','compare','trust','I notice my jealousy without judging it.','I do not need to compare myself.','I can trust my own value.'],
    anger:['Anger can show that a boundary was crossed.','breathe','pause','protect','I breathe before I respond.','I can pause for a moment.','I can protect my boundaries calmly.'],
    anxiety:['Anxiety is understandable when your mind tries to solve everything.','breathe','observe','continue','I breathe slowly.','I observe what is around me.','I continue with one small step.'],
    stress:['Stress often appears when too many things need attention.','stop','choose','rest','I stop for a moment.','I choose one priority.','I am allowed to rest.'],
    sadness:['Sadness often means that something mattered.','feel','accept','comfort','I can feel sadness.','I accept that today is difficult.','I comfort myself gently.'],
    insecure:['Feeling insecure does not mean you are incapable.','try','learn','grow','I can try before I feel ready.','I learn step by step.','I can grow without being perfect.'],
    overwhelmed:['You do not have to carry everything at once.','separate','choose','ask','I separate now from later.','I choose one task.','I can ask for help.'],
    excited:['Excitement is energy you can guide with care.','feel','enjoy','share','I feel this joyful energy.','I enjoy this moment calmly.','I can share my excitement.'],
    lonely:['Wanting connection is a human need.','feel','contact','approach','I acknowledge my loneliness.','I can contact someone safe.','I can approach connection slowly.'],
    disappointed:['Disappointment hurts because something mattered to you.','feel','accept','restart','I can feel disappointed.','I accept that the story changed.','I can begin again.'],
    selflove:['Self-love can begin with respect and kindness.','respect','care','value','I respect my needs.','I care for myself gently.','I recognise my value.'],
    spiral:['A repeated thought is not automatically true.','notice','question','return','I notice the thought.','I can question it.','I return to the present moment.']
  },
  'es-ES': {
    jealousy:['Los celos no te convierten en una mala persona.','reconocer','comparar','confiar','Reconozco mis celos sin juzgarme.','No necesito compararme.','Puedo confiar en mi propio valor.'],
    anger:['El enfado puede mostrar que se ha cruzado un límite.','respirar','parar','proteger','Respiro antes de responder.','Puedo parar un momento.','Puedo proteger mis límites con calma.'],
    anxiety:['La ansiedad es comprensible cuando tu mente intenta resolverlo todo.','respirar','observar','continuar','Respiro despacio.','Observo lo que hay a mi alrededor.','Continúo con un paso pequeño.'],
    stress:['El estrés aparece cuando demasiadas cosas piden atención.','parar','elegir','descansar','Paro un momento.','Elijo una prioridad.','Tengo derecho a descansar.'],
    sadness:['La tristeza puede mostrar que algo era importante.','sentir','aceptar','cuidar','Puedo sentir tristeza.','Acepto que hoy es difícil.','Me cuido con suavidad.'],
    insecure:['Sentirte insegura no significa que no seas capaz.','intentar','aprender','crecer','Puedo intentarlo.','Aprendo paso a paso.','Puedo crecer sin ser perfecta.'],
    overwhelmed:['No tienes que cargar con todo a la vez.','separar','elegir','pedir','Separo lo urgente de lo que puede esperar.','Elijo una sola tarea.','Puedo pedir ayuda.'],
    excited:['El entusiasmo es energía que puedes dirigir con calma.','sentir','disfrutar','compartir','Siento esta energía alegre.','Disfruto este momento.','Puedo compartir mi entusiasmo.'],
    lonely:['Querer conexión es una necesidad humana.','sentir','contactar','acercar','Reconozco mi soledad.','Puedo contactar con alguien seguro.','Puedo acercarme poco a poco.'],
    disappointed:['La decepción duele porque algo te importaba.','sentir','aceptar','recomenzar','Puedo sentir decepción.','Acepto que la historia cambió.','Puedo volver a empezar.'],
    selflove:['El amor propio puede empezar con respeto y amabilidad.','respetar','cuidar','valorar','Respeto mis necesidades.','Me cuido con cariño.','Reconozco mi valor.'],
    spiral:['Un pensamiento repetido no es automáticamente verdad.','notar','cuestionar','volver','Noto el pensamiento.','Puedo cuestionarlo.','Vuelvo al momento presente.']
  },
  'hr-HR': {
    jealousy:['Ljubomora te ne čini lošom osobom.','prepoznati','usporediti','vjerovati','Prepoznajem ljubomoru bez osuđivanja.','Ne moram se uspoređivati.','Mogu vjerovati u svoju vrijednost.'],
    anger:['Ljutnja može pokazati da je granica prijeđena.','disati','zastati','zaštititi','Dišem prije nego odgovorim.','Mogu zastati na trenutak.','Mogu mirno zaštititi svoje granice.'],
    anxiety:['Tjeskoba je razumljiva kada um pokušava riješiti sve odjednom.','disati','promatrati','nastaviti','Dišem polako.','Promatram što je oko mene.','Nastavljam jednim malim korakom.'],
    stress:['Stres se javlja kada previše stvari traži pažnju.','stati','odabrati','odmoriti','Stajem na trenutak.','Odabirem jedan prioritet.','Smijem se odmoriti.'],
    sadness:['Tuga često znači da je nešto bilo važno.','osjetiti','prihvatiti','utješiti','Smijem osjećati tugu.','Prihvaćam da je danas teško.','Nježno se tješim.'],
    insecure:['Nesigurnost ne znači da nisi sposobna.','pokušati','učiti','rasti','Mogu pokušati.','Učim korak po korak.','Mogu rasti bez savršenstva.'],
    overwhelmed:['Ne moraš nositi sve odjednom.','odvojiti','odabrati','pitati','Odvajam hitno od onoga što može čekati.','Odabirem jedan zadatak.','Mogu tražiti pomoć.'],
    excited:['Uzbuđenje je energija koju možeš usmjeriti.','osjetiti','uživati','podijeliti','Osjećam ovu radosnu energiju.','Uživam u ovom trenutku.','Mogu podijeliti svoje uzbuđenje.'],
    lonely:['Želja za povezanošću je ljudska potreba.','osjetiti','kontaktirati','približiti','Prepoznajem svoju usamljenost.','Mogu kontaktirati sigurnu osobu.','Mogu se polako približiti.'],
    disappointed:['Razočaranje boli jer ti je nešto bilo važno.','osjetiti','prihvatiti','početi','Smijem biti razočarana.','Prihvaćam da se priča promijenila.','Mogu početi ponovno.'],
    selflove:['Ljubav prema sebi može početi poštovanjem i nježnošću.','poštovati','brinuti','cijeniti','Poštujem svoje potrebe.','Brinem o sebi nježno.','Prepoznajem svoju vrijednost.'],
    spiral:['Ponavljajuća misao nije automatski istinita.','primijetiti','preispitati','vratiti','Primjećujem misao.','Mogu je preispitati.','Vraćam se u sadašnji trenutak.']
  }
};

const ALIASES = { 'es-AN':'es-ES', 'hr-DAL':'hr-HR' };
export function resolveEmotionLanguage(code) { return EMOTION_LABELS[code] ? code : (ALIASES[code] || 'en-GB'); }
export function getEmotionLabels(code) { return EMOTION_LABELS[resolveEmotionLanguage(code)]; }
export function getEmotionPractice(code, emotionId) {
  const language = resolveEmotionLanguage(code);
  if (language === 'pt-PT') return getPortugueseEmotionPractice(emotionId);
  if (language === 'fr-FR') return getFrenchEmotionPractice(emotionId);
  const row = PRACTICE[language]?.[emotionId] || PRACTICE[language]?.anxiety || PRACTICE['en-GB'].anxiety;
  return { intro:row[0], verbs:row.slice(1,4), sentences:row.slice(4) };
}
