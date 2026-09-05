const FAMILY_BY_CODE={
  'pt-PT':'pt','de-DE':'de','en-GB':'en','es-ES':'es','es-AN':'es',
  'hr-HR':'hr','hr-DAL':'hr','fr-FR':'fr'
};

const TOPICS=[
  {id:'meet',emoji:'👋',title:{en:'Getting to know you',de:'Kennenlernen',pt:'Conhecer alguém',es:'Conocerse',hr:'Upoznavanje',fr:'Faire connaissance'},turns:[
    {q:{en:'What is your name?',de:'Wie heißt du?',pt:'Como te chamas?',es:'¿Cómo te llamas?',hr:'Kako se zoveš?',fr:'Comment tu t’appelles ?'},a:{en:'My name is Marina.',de:'Ich heiße Marina.',pt:'Chamo-me Marina.',es:'Me llamo Marina.',hr:'Zovem se Marina.',fr:'Je m’appelle Marina.'}},
    {q:{en:'Where are you from?',de:'Woher kommst du?',pt:'De onde és?',es:'¿De dónde eres?',hr:'Odakle si?',fr:'D’où viens-tu ?'},a:{en:'I am from Germany.',de:'Ich komme aus Deutschland.',pt:'Sou da Alemanha.',es:'Soy de Alemania.',hr:'Iz Njemačke sam.',fr:'Je viens d’Allemagne.'}},
    {q:{en:'Where do you live now?',de:'Wo wohnst du jetzt?',pt:'Onde moras agora?',es:'¿Dónde vives ahora?',hr:'Gdje sada živiš?',fr:'Où habites-tu maintenant ?'},a:{en:'I live in Lisbon.',de:'Ich wohne in Lissabon.',pt:'Moro em Lisboa.',es:'Vivo en Lisboa.',hr:'Živim u Lisabonu.',fr:'J’habite à Lisbonne.'}}
  ]},
  {id:'cafe',emoji:'☕',title:{en:'At the café',de:'Im Café',pt:'No café',es:'En la cafetería',hr:'U kafiću',fr:'Au café'},turns:[
    {q:{en:'What would you like to drink?',de:'Was möchtest du trinken?',pt:'O que gostarias de beber?',es:'¿Qué te gustaría beber?',hr:'Što želiš popiti?',fr:'Qu’aimerais-tu boire ?'},a:{en:'I would like a coffee, please.',de:'Ich hätte gern einen Kaffee, bitte.',pt:'Queria um café, por favor.',es:'Quisiera un café, por favor.',hr:'Molim jednu kavu.',fr:'Je voudrais un café, s’il vous plaît.'}},
    {q:{en:'Would you like milk or sugar?',de:'Möchtest du Milch oder Zucker?',pt:'Queres leite ou açúcar?',es:'¿Quieres leche o azúcar?',hr:'Želiš li mlijeko ili šećer?',fr:'Tu veux du lait ou du sucre ?'},a:{en:'With milk, but without sugar.',de:'Mit Milch, aber ohne Zucker.',pt:'Com leite, mas sem açúcar.',es:'Con leche, pero sin azúcar.',hr:'S mlijekom, ali bez šećera.',fr:'Avec du lait, mais sans sucre.'}},
    {q:{en:'Would you like something to eat?',de:'Möchtest du etwas essen?',pt:'Queres comer alguma coisa?',es:'¿Quieres comer algo?',hr:'Želiš li nešto pojesti?',fr:'Tu veux manger quelque chose ?'},a:{en:'Yes, I would like a sandwich.',de:'Ja, ich hätte gern ein Sandwich.',pt:'Sim, queria uma sandes.',es:'Sí, quisiera un bocadillo.',hr:'Da, želim sendvič.',fr:'Oui, je voudrais un sandwich.'}}
  ]},
  {id:'shopping',emoji:'🛍️',title:{en:'Shopping',de:'Einkaufen',pt:'Compras',es:'Compras',hr:'Kupovina',fr:'Faire les courses'},turns:[
    {q:{en:'Can I help you?',de:'Kann ich dir helfen?',pt:'Posso ajudar?',es:'¿Puedo ayudarte?',hr:'Mogu li pomoći?',fr:'Je peux vous aider ?'},a:{en:'Yes, I am looking for a blue shirt.',de:'Ja, ich suche ein blaues Hemd.',pt:'Sim, procuro uma camisa azul.',es:'Sí, busco una camisa azul.',hr:'Da, tražim plavu košulju.',fr:'Oui, je cherche une chemise bleue.'}},
    {q:{en:'What size do you need?',de:'Welche Größe brauchst du?',pt:'De que tamanho precisas?',es:'¿Qué talla necesitas?',hr:'Koju veličinu trebaš?',fr:'Quelle taille vous faut-il ?'},a:{en:'I need a medium.',de:'Ich brauche Größe M.',pt:'Preciso do tamanho M.',es:'Necesito una talla M.',hr:'Trebam veličinu M.',fr:'Il me faut une taille M.'}},
    {q:{en:'Would you like to try it on?',de:'Möchtest du es anprobieren?',pt:'Queres experimentar?',es:'¿Quieres probártela?',hr:'Želiš li je probati?',fr:'Vous voulez l’essayer ?'},a:{en:'Yes, where is the fitting room?',de:'Ja, wo ist die Umkleidekabine?',pt:'Sim, onde fica o provador?',es:'Sí, ¿dónde está el probador?',hr:'Da, gdje je kabina?',fr:'Oui, où est la cabine d’essayage ?'}}
  ]},
  {id:'directions',emoji:'🧭',title:{en:'Asking the way',de:'Nach dem Weg fragen',pt:'Pedir direções',es:'Preguntar el camino',hr:'Pitati za put',fr:'Demander son chemin'},turns:[
    {q:{en:'Where would you like to go?',de:'Wohin möchtest du?',pt:'Onde queres ir?',es:'¿Adónde quieres ir?',hr:'Kamo želiš ići?',fr:'Où voulez-vous aller ?'},a:{en:'I would like to go to the train station.',de:'Ich möchte zum Bahnhof.',pt:'Quero ir para a estação de comboios.',es:'Quiero ir a la estación de tren.',hr:'Želim ići do željezničke stanice.',fr:'Je voudrais aller à la gare.'}},
    {q:{en:'Are you going on foot?',de:'Gehst du zu Fuß?',pt:'Vais a pé?',es:'¿Vas a pie?',hr:'Ideš li pješice?',fr:'Vous y allez à pied ?'},a:{en:'Yes, I am going on foot.',de:'Ja, ich gehe zu Fuß.',pt:'Sim, vou a pé.',es:'Sí, voy a pie.',hr:'Da, idem pješice.',fr:'Oui, j’y vais à pied.'}},
    {q:{en:'Do you need me to show you on the map?',de:'Soll ich es dir auf der Karte zeigen?',pt:'Queres que te mostre no mapa?',es:'¿Quieres que te lo muestre en el mapa?',hr:'Želiš li da ti pokažem na karti?',fr:'Vous voulez que je vous montre sur la carte ?'},a:{en:'Yes, that would help me.',de:'Ja, das würde mir helfen.',pt:'Sim, isso ajudava-me.',es:'Sí, eso me ayudaría.',hr:'Da, to bi mi pomoglo.',fr:'Oui, cela m’aiderait.'}}
  ]},
  {id:'work',emoji:'💼',title:{en:'At work',de:'Bei der Arbeit',pt:'No trabalho',es:'En el trabajo',hr:'Na poslu',fr:'Au travail'},turns:[
    {q:{en:'What do you do for work?',de:'Was arbeitest du?',pt:'O que fazes profissionalmente?',es:'¿A qué te dedicas?',hr:'Čime se baviš?',fr:'Quel est ton travail ?'},a:{en:'I work in customer support.',de:'Ich arbeite im Kundensupport.',pt:'Trabalho no apoio ao cliente.',es:'Trabajo en atención al cliente.',hr:'Radim u korisničkoj podršci.',fr:'Je travaille dans le service client.'}},
    {q:{en:'Do you work from home?',de:'Arbeitest du von zu Hause?',pt:'Trabalhas a partir de casa?',es:'¿Trabajas desde casa?',hr:'Radiš li od kuće?',fr:'Tu travailles à la maison ?'},a:{en:'I work from home twice a week.',de:'Ich arbeite zweimal pro Woche von zu Hause.',pt:'Trabalho a partir de casa duas vezes por semana.',es:'Trabajo desde casa dos veces por semana.',hr:'Radim od kuće dva puta tjedno.',fr:'Je travaille à la maison deux fois par semaine.'}},
    {q:{en:'What do you like about your work?',de:'Was gefällt dir an deiner Arbeit?',pt:'Do que gostas no teu trabalho?',es:'¿Qué te gusta de tu trabajo?',hr:'Što voliš u svom poslu?',fr:'Qu’est-ce que tu aimes dans ton travail ?'},a:{en:'I like helping people.',de:'Ich helfe Menschen gern.',pt:'Gosto de ajudar pessoas.',es:'Me gusta ayudar a la gente.',hr:'Volim pomagati ljudima.',fr:'J’aime aider les gens.'}}
  ]},
  {id:'feelings',emoji:'💛',title:{en:'Feelings',de:'Gefühle',pt:'Sentimentos',es:'Sentimientos',hr:'Osjećaji',fr:'Émotions'},turns:[
    {q:{en:'How are you feeling today?',de:'Wie fühlst du dich heute?',pt:'Como te sentes hoje?',es:'¿Cómo te sientes hoy?',hr:'Kako se danas osjećaš?',fr:'Comment te sens-tu aujourd’hui ?'},a:{en:'I feel calm today.',de:'Ich fühle mich heute ruhig.',pt:'Hoje sinto-me calma.',es:'Hoy me siento tranquila.',hr:'Danas se osjećam mirno.',fr:'Aujourd’hui, je me sens calme.'}},
    {q:{en:'What made you feel that way?',de:'Warum fühlst du dich so?',pt:'O que te fez sentir assim?',es:'¿Qué te hizo sentir así?',hr:'Zbog čega se tako osjećaš?',fr:'Qu’est-ce qui t’a fait te sentir comme ça ?'},a:{en:'I had a peaceful morning.',de:'Ich hatte einen ruhigen Morgen.',pt:'Tive uma manhã tranquila.',es:'Tuve una mañana tranquila.',hr:'Imala sam mirno jutro.',fr:'J’ai passé une matinée tranquille.'}},
    {q:{en:'What would help you now?',de:'Was würde dir jetzt helfen?',pt:'O que te ajudaria agora?',es:'¿Qué te ayudaría ahora?',hr:'Što bi ti sada pomoglo?',fr:'Qu’est-ce qui t’aiderait maintenant ?'},a:{en:'A short break would help me.',de:'Eine kurze Pause würde mir helfen.',pt:'Uma pequena pausa ajudava-me.',es:'Un pequeño descanso me ayudaría.',hr:'Kratka pauza bi mi pomogla.',fr:'Une petite pause m’aiderait.'}}
  ]},
  {id:'everyday',emoji:'🏠',title:{en:'Everyday life',de:'Alltag',pt:'Dia a dia',es:'Vida cotidiana',hr:'Svakodnevica',fr:'Vie quotidienne'},turns:[
    {q:{en:'What do you usually do in the morning?',de:'Was machst du normalerweise morgens?',pt:'O que costumas fazer de manhã?',es:'¿Qué sueles hacer por la mañana?',hr:'Što obično radiš ujutro?',fr:'Que fais-tu habituellement le matin ?'},a:{en:'I drink coffee and get ready for work.',de:'Ich trinke Kaffee und mache mich für die Arbeit fertig.',pt:'Bebo café e preparo-me para o trabalho.',es:'Tomo café y me preparo para el trabajo.',hr:'Pijem kavu i spremam se za posao.',fr:'Je bois un café et je me prépare pour le travail.'}},
    {q:{en:'What do you like doing after work?',de:'Was machst du nach der Arbeit gern?',pt:'O que gostas de fazer depois do trabalho?',es:'¿Qué te gusta hacer después del trabajo?',hr:'Što voliš raditi nakon posla?',fr:'Qu’aimes-tu faire après le travail ?'},a:{en:'I like going for a walk.',de:'Ich gehe gern spazieren.',pt:'Gosto de dar um passeio.',es:'Me gusta salir a caminar.',hr:'Volim ići u šetnju.',fr:'J’aime aller me promener.'}},
    {q:{en:'What are you doing this evening?',de:'Was machst du heute Abend?',pt:'O que vais fazer esta noite?',es:'¿Qué vas a hacer esta noche?',hr:'Što radiš večeras?',fr:'Que vas-tu faire ce soir ?'},a:{en:'I am cooking dinner at home.',de:'Ich koche zu Hause Abendessen.',pt:'Vou preparar o jantar em casa.',es:'Voy a preparar la cena en casa.',hr:'Kuham večeru kod kuće.',fr:'Je vais préparer le dîner à la maison.'}}
  ]}
];

export function speakingFamily(code){return FAMILY_BY_CODE[code]||'en';}
export function getSpeakingTopics(learningLanguage,nativeLanguage){
  const learning=speakingFamily(learningLanguage);
  const native=speakingFamily(nativeLanguage);
  return TOPICS.map(topic=>({
    id:topic.id,emoji:topic.emoji,title:topic.title[native]||topic.title.en,
    turns:topic.turns.map(turn=>({question:turn.q[learning]||turn.q.en,translation:turn.q[native]||turn.q.en,example:turn.a[learning]||turn.a.en,exampleTranslation:turn.a[native]||turn.a.en}))
  }));
}
