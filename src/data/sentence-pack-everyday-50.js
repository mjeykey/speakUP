const ROWS = [
  {en:'I [wake] up at seven.',de:'Ich [wache] um sieben auf.',pt:'Eu [acordo] às sete.',es:'Me [despierto] a las siete.',an:'Me [despierto] a las siete.',fr:'Je me [réveille] à sept heures.',dal:'[Budin] se u sedan.'},
  {en:'I [open] the window.',de:'Ich [öffne] das Fenster.',pt:'Eu [abro] a janela.',es:'[Abro] la ventana.',an:'[Abro] la ventana.',fr:'J’[ouvre] la fenêtre.',dal:'[Otvaran] ponistru.'},
  {en:'I [make] breakfast.',de:'Ich [mache] Frühstück.',pt:'Eu [preparo] o pequeno-almoço.',es:'[Preparo] el desayuno.',an:'[Preparo] el desayuno.',fr:'Je [prépare] le petit-déjeuner.',dal:'[Spreman] doručak.'},
  {en:'I [drink] a glass of water.',de:'Ich [trinke] ein Glas Wasser.',pt:'Eu [bebo] um copo de água.',es:'[Bebo] un vaso de agua.',an:'[Bebo] un vaso de agua.',fr:'Je [bois] un verre d’eau.',dal:'[Pijen] čašu vode.'},
  {en:'The coffee is [hot].',de:'Der Kaffee ist [heiß].',pt:'O café está [quente].',es:'El café está [caliente].',an:'El café está [calentito].',fr:'Le café est [chaud].',dal:'Kava je [vruća].'},
  {en:'I [leave] the house at eight.',de:'Ich [verlasse] das Haus um acht.',pt:'Eu [saio] de casa às oito.',es:'[Salgo] de casa a las ocho.',an:'[Salgo] de casa a las ocho.',fr:'Je [quitte] la maison à huit heures.',dal:'[Izlazin] iz kuće u osan.'},
  {en:'I [wait] for the bus.',de:'Ich [warte] auf den Bus.',pt:'Eu [espero] pelo autocarro.',es:'[Espero] el autobús.',an:'[Espero] el autobús.',fr:'J’[attends] le bus.',dal:'[Čekan] bus.'},
  {en:'The train [arrives] on time.',de:'Der Zug [kommt] pünktlich an.',pt:'O comboio [chega] a horas.',es:'El tren [llega] a tiempo.',an:'El tren [llega] a su hora.',fr:'Le train [arrive] à l’heure.',dal:'Vlak [stiže] na vrime.'},
  {en:'I [sit] near the door.',de:'Ich [sitze] neben der Tür.',pt:'Eu [sento-me] perto da porta.',es:'Me [siento] cerca de la puerta.',an:'Me [siento] cerquita de la puerta.',fr:'Je m’[assieds] près de la porte.',dal:'[Siden] kraj vrata.'},
  {en:'I [start] work at nine.',de:'Ich [beginne] um neun zu arbeiten.',pt:'Eu [começo] a trabalhar às nove.',es:'[Empiezo] a trabajar a las nueve.',an:'[Empiezo] a currar a las nueve.',fr:'Je [commence] à travailler à neuf heures.',dal:'[Počinjen] radit u devet.'},
  {en:'I [read] my messages.',de:'Ich [lese] meine Nachrichten.',pt:'Eu [leio] as minhas mensagens.',es:'[Leo] mis mensajes.',an:'[Miro] mis mensajes.',fr:'Je [lis] mes messages.',dal:'[Čitan] poruke.'},
  {en:'I [answer] an email.',de:'Ich [beantworte] eine E-Mail.',pt:'Eu [respondo] a um e-mail.',es:'[Respondo] a un correo.',an:'[Contesto] un correo.',fr:'Je [réponds] à un e-mail.',dal:'[Odgovaran] na mejl.'},
  {en:'We [have] a short meeting.',de:'Wir [haben] eine kurze Besprechung.',pt:'Nós [temos] uma reunião curta.',es:'[Tenemos] una reunión breve.',an:'[Tenemos] una reunión cortita.',fr:'Nous [avons] une courte réunion.',dal:'[Imamo] kratki sastanak.'},
  {en:'I [need] more time.',de:'Ich [brauche] mehr Zeit.',pt:'Eu [preciso] de mais tempo.',es:'[Necesito] más tiempo.',an:'Me [hace falta] más tiempo.',fr:'J’[ai besoin] de plus de temps.',dal:'[Triba] mi još vrimena.'},
  {en:'Can you [help] me?',de:'Kannst du mir [helfen]?',pt:'Podes [ajudar-me]?',es:'¿Puedes [ayudarme]?',an:'¿Me puedes [echar una mano]?',fr:'Tu peux m’[aider] ?',dal:'Možeš li mi [pomoć]?'},
  {en:'I [understand] the question.',de:'Ich [verstehe] die Frage.',pt:'Eu [compreendo] a pergunta.',es:'[Entiendo] la pregunta.',an:'[Entiendo] la pregunta.',fr:'Je [comprends] la question.',dal:'[Razumin] pitanje.'},
  {en:'Please [repeat] that slowly.',de:'Bitte [wiederhole] das langsam.',pt:'Por favor, [repete] isso devagar.',es:'Por favor, [repite] eso despacio.',an:'Porfa, [repítelo] más despacito.',fr:'S’il te plaît, [répète] lentement.',dal:'Molim te, [ponovi] pomalo.'},
  {en:'I [write] it down.',de:'Ich [schreibe] es auf.',pt:'Eu [anoto] isso.',es:'Lo [apunto].',an:'Lo [apunto].',fr:'Je le [note].',dal:'[Zapišen] to.'},
  {en:'The answer is [correct].',de:'Die Antwort ist [richtig].',pt:'A resposta está [certa].',es:'La respuesta es [correcta].',an:'La respuesta está [bien].',fr:'La réponse est [correcte].',dal:'Odgovor je [točan].'},
  {en:'We [finish] at five.',de:'Wir [hören] um fünf auf.',pt:'Nós [terminamos] às cinco.',es:'[Terminamos] a las cinco.',an:'[Acabamos] a las cinco.',fr:'Nous [finissons] à cinq heures.',dal:'[Završavamo] u pet.'},
  {en:'I [buy] some bread.',de:'Ich [kaufe] Brot.',pt:'Eu [compro] pão.',es:'[Compro] pan.',an:'[Compro] pan.',fr:'J’[achète] du pain.',dal:'[Kupujen] kruh.'},
  {en:'The shop is [closed].',de:'Das Geschäft ist [geschlossen].',pt:'A loja está [fechada].',es:'La tienda está [cerrada].',an:'La tienda está [cerrá].',fr:'Le magasin est [fermé].',dal:'Dućan je [zatvoren].'},
  {en:'I [choose] the red apples.',de:'Ich [wähle] die roten Äpfel.',pt:'Eu [escolho] as maçãs vermelhas.',es:'[Elijo] las manzanas rojas.',an:'[Cojo] las manzanas rojas.',fr:'Je [choisis] les pommes rouges.',dal:'[Biran] crvene jabuke.'},
  {en:'How much does this [cost]?',de:'Wie viel [kostet] das?',pt:'Quanto [custa] isto?',es:'¿Cuánto [cuesta] esto?',an:'¿Cuánto [sale] esto?',fr:'Combien ça [coûte] ?',dal:'Koliko ovo [košta]?'},
  {en:'I [pay] by card.',de:'Ich [bezahle] mit Karte.',pt:'Eu [pago] com cartão.',es:'[Pago] con tarjeta.',an:'[Pago] con tarjeta.',fr:'Je [paie] par carte.',dal:'[Plaćan] karticon.'},
  {en:'We [cook] dinner together.',de:'Wir [kochen] zusammen Abendessen.',pt:'Nós [cozinhamos] o jantar juntos.',es:'[Cocinamos] la cena juntos.',an:'[Preparamos] la cena juntos.',fr:'Nous [préparons] le dîner ensemble.',dal:'[Kuvamo] večeru skupa.'},
  {en:'I [cut] the vegetables.',de:'Ich [schneide] das Gemüse.',pt:'Eu [corto] os legumes.',es:'[Corto] las verduras.',an:'[Corto] la verdura.',fr:'Je [coupe] les légumes.',dal:'[Rižen] povrće.'},
  {en:'The soup [smells] good.',de:'Die Suppe [riecht] gut.',pt:'A sopa [cheira] bem.',es:'La sopa [huele] bien.',an:'La sopa [huele] de lujo.',fr:'La soupe [sent] bon.',dal:'Juha [miriše] lipo.'},
  {en:'Please [set] the table.',de:'Bitte [deck] den Tisch.',pt:'Por favor, [põe] a mesa.',es:'Por favor, [pon] la mesa.',an:'Porfa, [pon] la mesa.',fr:'S’il te plaît, [mets] la table.',dal:'Molim te, [postavi] stol.'},
  {en:'The food is [delicious].',de:'Das Essen ist [lecker].',pt:'A comida está [deliciosa].',es:'La comida está [deliciosa].',an:'La comida está [riquísima].',fr:'Le repas est [délicieux].',dal:'Spiza je [odlična].'},
  {en:'I [wash] the dishes.',de:'Ich [spüle] das Geschirr.',pt:'Eu [lavo] a loiça.',es:'[Lavo] los platos.',an:'[Friego] los platos.',fr:'Je [fais] la vaisselle.',dal:'[Peren] suđe.'},
  {en:'I [call] my friend.',de:'Ich [rufe] meine Freundin an.',pt:'Eu [telefono] à minha amiga.',es:'[Llamo] a mi amiga.',an:'[Llamo] a mi amiga.',fr:'J’[appelle] mon amie.',dal:'[Zoven] prijateljicu.'},
  {en:'We [talk] for an hour.',de:'Wir [reden] eine Stunde lang.',pt:'Nós [falamos] durante uma hora.',es:'[Hablamos] durante una hora.',an:'Nos [quedamos hablando] una hora.',fr:'Nous [parlons] pendant une heure.',dal:'[Pričamo] uru vrimena.'},
  {en:'I [miss] you.',de:'Du [fehlst] mir.',pt:'Tenho [saudades] tuas.',es:'Te [echo de menos].',an:'Te [echo de menos].',fr:'Tu me [manques].',dal:'[Fališ] mi.'},
  {en:'Let us [meet] tomorrow.',de:'Lass uns morgen [treffen].',pt:'Vamos [encontrar-nos] amanhã.',es:'Vamos a [vernos] mañana.',an:'Nos [vemos] mañana.',fr:'On se [voit] demain.',dal:'[Vidimo] se sutra.'},
  {en:'The weather is [nice] today.',de:'Das Wetter ist heute [schön].',pt:'Hoje está [bom] tempo.',es:'Hoy hace [buen] tiempo.',an:'Hoy hace un día [estupendo].',fr:'Il fait [beau] aujourd’hui.',dal:'Danas je [lipo] vrime.'},
  {en:'We [walk] by the sea.',de:'Wir [spazieren] am Meer.',pt:'Nós [passeamos] junto ao mar.',es:'[Paseamos] junto al mar.',an:'Nos [damos una vuelta] por la playa.',fr:'Nous [marchons] au bord de la mer.',dal:'[Šetamo] uz more.'},
  {en:'The water is [cold].',de:'Das Wasser ist [kalt].',pt:'A água está [fria].',es:'El agua está [fría].',an:'El agua está [fresquita].',fr:'L’eau est [froide].',dal:'More je [ladno].'},
  {en:'I [take] a photo.',de:'Ich [mache] ein Foto.',pt:'Eu [tiro] uma fotografia.',es:'[Hago] una foto.',an:'[Echo] una foto.',fr:'Je [prends] une photo.',dal:'[Slikan] fotografiju.'},
  {en:'We [watch] the sunset.',de:'Wir [sehen] den Sonnenuntergang an.',pt:'Nós [vemos] o pôr do sol.',es:'[Miramos] la puesta de sol.',an:'[Vemos] cómo se pone el sol.',fr:'Nous [regardons] le coucher du soleil.',dal:'[Gledamo] zalazak sunca.'},
  {en:'I [feel] calm here.',de:'Ich [fühle] mich hier ruhig.',pt:'Eu [sinto-me] calma aqui.',es:'Me [siento] tranquila aquí.',an:'Aquí me [quedo] muy tranquila.',fr:'Je me [sens] calme ici.',dal:'Ovde se [osjećan] mirno.'},
  {en:'I [return] home before dark.',de:'Ich [kehre] vor Einbruch der Dunkelheit nach Hause zurück.',pt:'Eu [volto] para casa antes de escurecer.',es:'[Vuelvo] a casa antes de que anochezca.',an:'Me [vuelvo] a casa antes de que anochezca.',fr:'Je [rentre] avant la nuit.',dal:'[Vraćan] se doma prije mraka.'},
  {en:'I [take] a shower.',de:'Ich [dusche].',pt:'Eu [tomo] banho.',es:'Me [ducho].',an:'Me [doy] una ducha.',fr:'Je [prends] une douche.',dal:'[Tuširan] se.'},
  {en:'I [put on] comfortable clothes.',de:'Ich [ziehe] bequeme Kleidung an.',pt:'Eu [visto] roupa confortável.',es:'Me [pongo] ropa cómoda.',an:'Me [pongo] ropa cómoda.',fr:'Je [mets] des vêtements confortables.',dal:'[Oblačin] udobnu robu.'},
  {en:'I [listen] to music.',de:'Ich [höre] Musik.',pt:'Eu [ouço] música.',es:'[Escucho] música.',an:'[Pongo] música.',fr:'J’[écoute] de la musique.',dal:'[Slušan] muziku.'},
  {en:'This song [makes] me happy.',de:'Dieses Lied [macht] mich glücklich.',pt:'Esta canção [deixa-me] feliz.',es:'Esta canción me [hace] feliz.',an:'Esta canción me [alegra].',fr:'Cette chanson me [rend] heureuse.',dal:'Ova pisma me [veseli].'},
  {en:'I [read] a few pages.',de:'Ich [lese] ein paar Seiten.',pt:'Eu [leio] algumas páginas.',es:'[Leo] unas páginas.',an:'Me [leo] unas paginillas.',fr:'Je [lis] quelques pages.',dal:'[Pročitan] par stranica.'},
  {en:'I [set] the alarm.',de:'Ich [stelle] den Wecker.',pt:'Eu [ponho] o despertador.',es:'[Pongo] la alarma.',an:'[Pongo] la alarma.',fr:'Je [mets] le réveil.',dal:'[Navijen] alarm.'},
  {en:'I am [tired] but happy.',de:'Ich bin [müde], aber glücklich.',pt:'Estou [cansada], mas feliz.',es:'Estoy [cansada], pero feliz.',an:'Estoy [reventá], pero contenta.',fr:'Je suis [fatiguée], mais heureuse.',dal:'[Umorna] san, ali sritna.'},
  {en:'I [learn] something every day.',de:'Ich [lerne] jeden Tag etwas.',pt:'Eu [aprendo] alguma coisa todos os dias.',es:'[Aprendo] algo cada día.',an:'[Aprendo] algo to los días.',fr:'J’[apprends] quelque chose chaque jour.',dal:'Svaki dan nešto [naučin].'}
];

const KEY = {'en-GB':'en','de-DE':'de','pt-PT':'pt','es-ES':'es','es-AN':'an','fr-FR':'fr','hr-DAL':'dal'};
const LABEL = {id:'everyday-50',title:'Everyday 50',emoji:'✨',description:'Fifty useful everyday sentences.',englishClass:''};

function parse(marked) {
  const match = String(marked).match(/\[([^\]]+)\]/);
  const answer = match?.[1] || '';
  return { full: String(marked).replace('[','').replace(']',''), sentence: String(marked).replace(/\[[^\]]+\]/,'_____'), answer };
}

function optionsFor(code, index, answer) {
  const key = KEY[code];
  const pool = [answer];
  for (let step = 1; pool.length < 4 && step < ROWS.length; step += 1) {
    const candidate = parse(ROWS[(index + step * 11) % ROWS.length][key]).answer;
    if (candidate && !pool.includes(candidate)) pool.push(candidate);
  }
  return pool.sort((a,b) => ((a.length + index) % 7) - ((b.length + index) % 7));
}

export function getEveryday50Level(learningLanguage, nativeLanguage) {
  const learningKey = KEY[learningLanguage];
  if (!learningKey) return null;
  const supportKey = KEY[nativeLanguage] || 'en';
  return {
    ...LABEL,
    items: ROWS.map((row,index) => {
      const target = parse(row[learningKey]);
      return {
        sentence: target.sentence,
        answers: [target.answer],
        options: optionsFor(learningLanguage,index,target.answer),
        translation: parse(row[supportKey]).full
      };
    })
  };
}

export function correctedDalmatianLevels(levels) {
  return levels.map(level => ({
    ...level,
    items: level.items.map(item => {
      if (item.translation === 'I am learning English.' || item.translation === 'Ich lerne Englisch.') {
        return item;
      }
      const complete = String(item.sentence || '').replace(/_____/g, () => item.answers?.[0] || '');
      if (complete === 'Učin dalmatinski govor.') {
        return { ...item, sentence:'Učin _____.' , answers:['engleski'], options:['engleski','kavu','doma','pomalo'] };
      }
      return item;
    })
  }));
}
