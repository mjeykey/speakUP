export const LANGUAGE_OPTIONS = [
  { code: 'pt-PT', label: 'Português (Portugal)', short: 'Português' },
  { code: 'de-DE', label: 'Deutsch', short: 'Deutsch' },
  { code: 'en-GB', label: 'English', short: 'English' },
  { code: 'es-ES', label: 'Español (España)', short: 'Español' }
];

const WORDS = [
  ['casa','Haus','house','casa'],['rua','Straße','street','calle'],['amiga','Freundin','female friend','amiga'],['amigo','Freund','male friend','amigo'],
  ['café','Kaffee','coffee','café'],['água','Wasser','water','agua'],['manhã','Morgen','morning','mañana'],['noite','Abend','evening','noche'],
  ['trabalho','Arbeit','work','trabajo'],['escola','Schule','school','colegio'],['livro','Buch','book','libro'],['mesa','Tisch','table','mesa'],
  ['cadeira','Stuhl','chair','silla'],['porta','Tür','door','puerta'],['janela','Fenster','window','ventana'],['pão','Brot','bread','pan'],
  ['maçã','Apfel','apple','manzana'],['legumes','Gemüse','vegetables','verduras'],['comboio','Zug','train','tren'],['autocarro','Bus','bus','autobús'],
  ['telemóvel','Handy','mobile phone','móvil'],['amor','Liebe','love','amor'],['esperança','Hoffnung','hope','esperanza'],['calma','Ruhe','calm','calma'],
  ['coragem','Mut','courage','valor'],['aprender','lernen','to learn','aprender'],['falar','sprechen','to speak','hablar'],['ir','gehen','to go','ir'],
  ['vir','kommen','to come','venir'],['ver','sehen','to see','ver'],['ouvir','hören','to hear','oír'],['comer','essen','to eat','comer'],
  ['beber','trinken','to drink','beber'],['dormir','schlafen','to sleep','dormir'],['trabalhar','arbeiten','to work','trabajar'],['feliz','glücklich','happy','feliz'],
  ['cansado','müde','tired','cansado'],['simpático','freundlich','kind','majo'],['rápido','schnell','fast','rápido'],['devagar','langsam','slow','despacio']
].map(([pt,de,en,es]) => ({ 'pt-PT': pt, 'de-DE': de, 'en-GB': en, 'es-ES': es }));

const LEVEL_META = [
  { id:'beginner', title:'Beginner', emoji:'🌱', description:'One gap with full support.', englishClass:'' },
  { id:'survivor', title:'Survivor', emoji:'🔥', description:'Two gaps with full support.', englishClass:'' },
  { id:'explorer', title:'Explorer', emoji:'🧭', description:'Three gaps with softer support.', englishClass:'is-subtle' }
];

const T = (pt,de,en,es) => ({ 'pt-PT':pt, 'de-DE':de, 'en-GB':en, 'es-ES':es });

const SENTENCES = {
  'pt-PT': {
    beginner: [
      { sentence:'Eu _____ café todas as manhãs.', answers:['bebo'], options:['bebo','vejo','durmo','venho'], translations:T('', 'Ich trinke jeden Morgen Kaffee.', 'I drink coffee every morning.', 'Bebo café todas las mañanas.') },
      { sentence:'Nós _____ hoje de autocarro.', answers:['vamos'], options:['vamos','comemos','aprendemos','ouvimos'], translations:T('', 'Wir fahren heute mit dem Bus.', 'We are taking the bus today.', 'Hoy vamos en autobús.') },
      { sentence:'Ela _____ um livro novo.', answers:['lê'], options:['lê','bebe','vai','trabalha'], translations:T('', 'Sie liest ein neues Buch.', 'She is reading a new book.', 'Está leyendo un libro nuevo.') },
      { sentence:'Ele _____ em Lisboa.', answers:['mora'], options:['mora','fala','compra','abre'], translations:T('', 'Er wohnt in Lissabon.', 'He lives in Lisbon.', 'Vive en Lisboa.') },
      { sentence:'Eu _____ português.', answers:['aprendo'], options:['aprendo','espero','cozinho','encontro'], translations:T('', 'Ich lerne Portugiesisch.', 'I am learning Portuguese.', 'Estoy aprendiendo portugués.') }
    ],
    survivor: [
      { sentence:'Eu _____ café e _____ as notícias de manhã.', answers:['bebo','leio'], options:['bebo','leio','durmo','compro','ouço'], translations:T('', 'Ich trinke morgens Kaffee und lese die Nachrichten.', 'I drink coffee and read the news in the morning.', 'Por la mañana tomo café y leo las noticias.') },
      { sentence:'Nós _____ até à estação e _____ o comboio.', answers:['vamos','apanhamos'], options:['vamos','apanhamos','comemos','vemos','abrimos'], translations:T('', 'Wir gehen zum Bahnhof und nehmen den Zug.', 'We go to the station and take the train.', 'Vamos a la estación y cogemos el tren.') },
      { sentence:'Ela _____ a janela e _____ o ar fresco.', answers:['abre','aproveita'], options:['abre','aproveita','escreve','paga','espera'], translations:T('', 'Sie öffnet das Fenster und genießt die frische Luft.', 'She opens the window and enjoys the fresh air.', 'Abre la ventana y disfruta del aire fresco.') },
      { sentence:'Ele _____ em casa e _____ ao computador.', answers:['fica','trabalha'], options:['fica','trabalha','conduz','dança','compra'], translations:T('', 'Er bleibt zu Hause und arbeitet am Computer.', 'He stays at home and works on the computer.', 'Se queda en casa y trabaja con el ordenador.') },
      { sentence:'Eu _____ o jantar e _____ a cozinha depois.', answers:['cozinho','arrumo'], options:['cozinho','arrumo','leio','durmo','conduzo'], translations:T('', 'Ich koche das Abendessen und räume danach die Küche auf.', 'I cook dinner and clean the kitchen afterwards.', 'Preparo la cena y luego recojo la cocina.') }
    ],
    explorer: [
      { sentence:'Antes de _____ para o trabalho, _____ café e _____ a janela.', answers:['ir','bebo','abro'], options:['ir','bebo','abro','durmo','compro','ouço'], translations:T('', 'Bevor ich zur Arbeit gehe, trinke ich Kaffee und öffne das Fenster.', 'Before I go to work, I drink coffee and open the window.', 'Antes de ir a trabajar, tomo café y abro la ventana.') },
      { sentence:'Quando _____ à estação, _____ o painel e _____ a plataforma.', answers:['chegamos','verificamos','procuramos'], options:['chegamos','verificamos','procuramos','comemos','dormimos','pagamos'], translations:T('', 'Wenn wir am Bahnhof ankommen, prüfen wir die Anzeige und suchen das Gleis.', 'When we arrive at the station, we check the board and look for the platform.', 'Cuando llegamos a la estación, miramos el panel y buscamos el andén.') },
      { sentence:'Embora ela _____ cansada, _____ e _____ calma.', answers:['esteja','continua','fica'], options:['esteja','continua','fica','conduz','compra','abre'], translations:T('', 'Obwohl sie müde ist, macht sie weiter und bleibt ruhig.', 'Although she is tired, she keeps going and stays calm.', 'Aunque está cansada, sigue adelante y mantiene la calma.') },
      { sentence:'Depois de _____ o jantar, _____ a mesa e _____ música.', answers:['cozinhar','põe','ouve'], options:['cozinhar','põe','ouve','dorme','apanha','lê'], translations:T('', 'Nachdem er das Essen kocht, deckt er den Tisch und hört Musik.', 'After cooking dinner, he sets the table and listens to music.', 'Después de preparar la cena, pone la mesa y escucha música.') },
      { sentence:'Eu _____ o meu objetivo, _____ um passo e _____ paciente.', answers:['imagino','dou','fico'], options:['imagino','dou','fico','bebo','abro','conduzo'], translations:T('', 'Ich stelle mir mein Ziel vor, mache einen Schritt und bleibe geduldig.', 'I picture my goal, take one step and remain patient.', 'Me imagino mi objetivo, doy un paso y tengo paciencia.') }
    ]
  },
  'de-DE': {
    beginner: [
      { sentence:'Ich _____ jeden Morgen Kaffee.', answers:['trinke'], options:['trinke','sehe','schlafe','komme'], translations:T('Eu bebo café todas as manhãs.','', 'I drink coffee every morning.', 'Bebo café todas las mañanas.') },
      { sentence:'Wir _____ heute mit dem Bus.', answers:['fahren'], options:['fahren','essen','lernen','hören'], translations:T('Nós vamos hoje de autocarro.','', 'We are taking the bus today.', 'Hoy vamos en autobús.') },
      { sentence:'Sie _____ ein neues Buch.', answers:['liest'], options:['liest','trinkt','geht','arbeitet'], translations:T('Ela lê um livro novo.','', 'She is reading a new book.', 'Está leyendo un libro nuevo.') },
      { sentence:'Er _____ in Berlin.', answers:['wohnt'], options:['wohnt','spricht','kauft','öffnet'], translations:T('Ele mora em Berlim.','', 'He lives in Berlin.', 'Vive en Berlín.') },
      { sentence:'Ich _____ Deutsch.', answers:['lerne'], options:['lerne','warte','koche','finde'], translations:T('Eu aprendo alemão.','', 'I am learning German.', 'Estoy aprendiendo alemán.') }
    ],
    survivor: [
      { sentence:'Ich _____ morgens Kaffee und _____ die Nachrichten.', answers:['trinke','lese'], options:['trinke','lese','schlafe','kaufe','höre'], translations:T('Eu bebo café e leio as notícias de manhã.','', 'I drink coffee and read the news in the morning.', 'Por la mañana tomo café y leo las noticias.') },
      { sentence:'Wir _____ zum Bahnhof und _____ den Zug.', answers:['gehen','nehmen'], options:['gehen','nehmen','essen','sehen','öffnen'], translations:T('Nós vamos até à estação e apanhamos o comboio.','', 'We go to the station and take the train.', 'Vamos a la estación y cogemos el tren.') },
      { sentence:'Sie _____ das Fenster und _____ die frische Luft.', answers:['öffnet','genießt'], options:['öffnet','genießt','schreibt','bezahlt','wartet'], translations:T('Ela abre a janela e aproveita o ar fresco.','', 'She opens the window and enjoys the fresh air.', 'Abre la ventana y disfruta del aire fresco.') },
      { sentence:'Er _____ zu Hause und _____ am Computer.', answers:['bleibt','arbeitet'], options:['bleibt','arbeitet','fährt','tanzt','kauft'], translations:T('Ele fica em casa e trabalha ao computador.','', 'He stays at home and works on the computer.', 'Se queda en casa y trabaja con el ordenador.') },
      { sentence:'Ich _____ das Abendessen und _____ danach die Küche.', answers:['koche','räume auf'], options:['koche','räume auf','lese','schlafe','fahre'], translations:T('Eu cozinho o jantar e arrumo a cozinha depois.','', 'I cook dinner and clean the kitchen afterwards.', 'Preparo la cena y luego recojo la cocina.') }
    ],
    explorer: [
      { sentence:'Bevor ich zur Arbeit _____, _____ ich Kaffee und _____ das Fenster.', answers:['gehe','trinke','öffne'], options:['gehe','trinke','öffne','schlafe','kaufe','höre'], translations:T('Antes de ir para o trabalho, bebo café e abro a janela.','', 'Before I go to work, I drink coffee and open the window.', 'Antes de ir a trabajar, tomo café y abro la ventana.') },
      { sentence:'Wenn wir am Bahnhof _____, _____ wir die Anzeige und _____ das Gleis.', answers:['ankommen','prüfen','suchen'], options:['ankommen','prüfen','suchen','essen','schlafen','bezahlen'], translations:T('Quando chegamos à estação, verificamos o painel e procuramos a plataforma.','', 'When we arrive at the station, we check the board and look for the platform.', 'Cuando llegamos a la estación, miramos el panel y buscamos el andén.') },
      { sentence:'Obwohl sie müde _____, _____ sie weiter und _____ ruhig.', answers:['ist','macht','bleibt'], options:['ist','macht','bleibt','fährt','kauft','öffnet'], translations:T('Embora esteja cansada, continua e fica calma.','', 'Although she is tired, she keeps going and stays calm.', 'Aunque está cansada, sigue adelante y mantiene la calma.') },
      { sentence:'Nachdem er das Essen _____, _____ er den Tisch und _____ Musik.', answers:['gekocht hat','deckt','hört'], options:['gekocht hat','deckt','hört','schläft','nimmt','liest'], translations:T('Depois de cozinhar o jantar, põe a mesa e ouve música.','', 'After cooking dinner, he sets the table and listens to music.', 'Después de preparar la cena, pone la mesa y escucha música.') },
      { sentence:'Ich _____ mir mein Ziel vor, _____ einen Schritt und _____ geduldig.', answers:['stelle','mache','bleibe'], options:['stelle','mache','bleibe','trinke','öffne','fahre'], translations:T('Eu imagino o meu objetivo, dou um passo e fico paciente.','', 'I picture my goal, take one step and remain patient.', 'Me imagino mi objetivo, doy un paso y tengo paciencia.') }
    ]
  },
  'en-GB': {
    beginner: [
      { sentence:'I _____ coffee every morning.', answers:['drink'], options:['drink','see','sleep','come'], translations:T('Eu bebo café todas as manhãs.','Ich trinke jeden Morgen Kaffee.','', 'Bebo café todas las mañanas.') },
      { sentence:'We _____ the bus today.', answers:['take'], options:['take','eat','learn','hear'], translations:T('Nós vamos hoje de autocarro.','Wir nehmen heute den Bus.','', 'Hoy vamos en autobús.') },
      { sentence:'She _____ a new book.', answers:['reads'], options:['reads','drinks','goes','works'], translations:T('Ela lê um livro novo.','Sie liest ein neues Buch.','', 'Está leyendo un libro nuevo.') },
      { sentence:'He _____ in London.', answers:['lives'], options:['lives','speaks','buys','opens'], translations:T('Ele mora em Londres.','Er wohnt in London.','', 'Vive en Londres.') },
      { sentence:'I _____ English.', answers:['learn'], options:['learn','wait','cook','find'], translations:T('Eu aprendo inglês.','Ich lerne Englisch.','', 'Estoy aprendiendo inglés.') }
    ],
    survivor: [
      { sentence:'I _____ coffee and _____ the news in the morning.', answers:['drink','read'], options:['drink','read','sleep','buy','hear'], translations:T('Eu bebo café e leio as notícias de manhã.','Ich trinke morgens Kaffee und lese die Nachrichten.','', 'Por la mañana tomo café y leo las noticias.') },
      { sentence:'We _____ to the station and _____ the train.', answers:['go','take'], options:['go','take','eat','see','open'], translations:T('Nós vamos até à estação e apanhamos o comboio.','Wir gehen zum Bahnhof und nehmen den Zug.','', 'Vamos a la estación y cogemos el tren.') },
      { sentence:'She _____ the window and _____ the fresh air.', answers:['opens','enjoys'], options:['opens','enjoys','writes','pays','waits'], translations:T('Ela abre a janela e aproveita o ar fresco.','Sie öffnet das Fenster und genießt die frische Luft.','', 'Abre la ventana y disfruta del aire fresco.') },
      { sentence:'He _____ at home and _____ on the computer.', answers:['stays','works'], options:['stays','works','drives','dances','buys'], translations:T('Ele fica em casa e trabalha ao computador.','Er bleibt zu Hause und arbeitet am Computer.','', 'Se queda en casa y trabaja con el ordenador.') },
      { sentence:'I _____ dinner and _____ the kitchen afterwards.', answers:['cook','clean'], options:['cook','clean','read','sleep','drive'], translations:T('Eu cozinho o jantar e arrumo a cozinha depois.','Ich koche das Abendessen und räume danach die Küche auf.','', 'Preparo la cena y luego recojo la cocina.') }
    ],
    explorer: [
      { sentence:'Before I _____ to work, I _____ coffee and _____ the window.', answers:['go','drink','open'], options:['go','drink','open','sleep','buy','hear'], translations:T('Antes de ir para o trabalho, bebo café e abro a janela.','Bevor ich zur Arbeit gehe, trinke ich Kaffee und öffne das Fenster.','', 'Antes de ir a trabajar, tomo café y abro la ventana.') },
      { sentence:'When we _____ at the station, we _____ the board and _____ the platform.', answers:['arrive','check','find'], options:['arrive','check','find','eat','sleep','pay'], translations:T('Quando chegamos à estação, verificamos o painel e procuramos a plataforma.','Wenn wir am Bahnhof ankommen, prüfen wir die Anzeige und suchen das Gleis.','', 'Cuando llegamos a la estación, miramos el panel y buscamos el andén.') },
      { sentence:'Although she _____ tired, she _____ going and _____ calm.', answers:['is','keeps','stays'], options:['is','keeps','stays','drives','buys','opens'], translations:T('Embora esteja cansada, continua e fica calma.','Obwohl sie müde ist, macht sie weiter und bleibt ruhig.','', 'Aunque está cansada, sigue adelante y mantiene la calma.') },
      { sentence:'After he _____ dinner, he _____ the table and _____ to music.', answers:['cooks','sets','listens'], options:['cooks','sets','listens','sleeps','takes','reads'], translations:T('Depois de cozinhar o jantar, põe a mesa e ouve música.','Nachdem er das Essen kocht, deckt er den Tisch und hört Musik.','', 'Después de preparar la cena, pone la mesa y escucha música.') },
      { sentence:'I _____ my goal, _____ one step and _____ patient.', answers:['picture','take','remain'], options:['picture','take','remain','drink','open','drive'], translations:T('Eu imagino o meu objetivo, dou um passo e fico paciente.','Ich stelle mir mein Ziel vor, mache einen Schritt und bleibe geduldig.','', 'Me imagino mi objetivo, doy un paso y tengo paciencia.') }
    ]
  },
  'es-ES': {
    beginner: [
      { sentence:'Yo _____ café todas las mañanas.', answers:['tomo'], options:['tomo','veo','duermo','vengo'], translations:T('Eu bebo café todas as manhãs.','Ich trinke jeden Morgen Kaffee.','I drink coffee every morning.','') },
      { sentence:'Hoy _____ en autobús.', answers:['vamos'], options:['vamos','comemos','aprendemos','oímos'], translations:T('Nós vamos hoje de autocarro.','Wir fahren heute mit dem Bus.','We are taking the bus today.','') },
      { sentence:'Ella _____ un libro nuevo.', answers:['lee'], options:['lee','bebe','va','trabaja'], translations:T('Ela lê um livro novo.','Sie liest ein neues Buch.','She is reading a new book.','') },
      { sentence:'Él _____ en Madrid.', answers:['vive'], options:['vive','habla','compra','abre'], translations:T('Ele mora em Madrid.','Er wohnt in Madrid.','He lives in Madrid.','') },
      { sentence:'Estoy _____ español.', answers:['aprendiendo'], options:['aprendiendo','esperando','cocinando','buscando'], translations:T('Estou a aprender espanhol.','Ich lerne Spanisch.','I am learning Spanish.','') }
    ],
    survivor: [
      { sentence:'Por la mañana _____ café y _____ las noticias.', answers:['tomo','leo'], options:['tomo','leo','duermo','compro','oigo'], translations:T('De manhã bebo café e leio as notícias.','Ich trinke morgens Kaffee und lese die Nachrichten.','I drink coffee and read the news in the morning.','') },
      { sentence:'_____ a la estación y _____ el tren.', answers:['vamos','cogemos'], options:['vamos','cogemos','comemos','vemos','abrimos'], translations:T('Vamos até à estação e apanhamos o comboio.','Wir gehen zum Bahnhof und nehmen den Zug.','We go to the station and take the train.','') },
      { sentence:'Ella _____ la ventana y _____ del aire fresco.', answers:['abre','disfruta'], options:['abre','disfruta','escribe','paga','espera'], translations:T('Ela abre a janela e aproveita o ar fresco.','Sie öffnet das Fenster und genießt die frische Luft.','She opens the window and enjoys the fresh air.','') },
      { sentence:'Él se _____ en casa y _____ con el ordenador.', answers:['queda','trabaja'], options:['queda','trabaja','conduce','baila','compra'], translations:T('Ele fica em casa e trabalha ao computador.','Er bleibt zu Hause und arbeitet am Computer.','He stays at home and works on the computer.','') },
      { sentence:'_____ la cena y luego _____ la cocina.', answers:['preparo','recojo'], options:['preparo','recojo','leo','duermo','conduzco'], translations:T('Cozinho o jantar e depois arrumo a cozinha.','Ich koche das Abendessen und räume danach die Küche auf.','I cook dinner and clean the kitchen afterwards.','') }
    ],
    explorer: [
      { sentence:'Antes de _____ a trabajar, _____ café y _____ la ventana.', answers:['ir','tomo','abro'], options:['ir','tomo','abro','duermo','compro','oigo'], translations:T('Antes de ir trabalhar, bebo café e abro a janela.','Bevor ich zur Arbeit gehe, trinke ich Kaffee und öffne das Fenster.','Before I go to work, I drink coffee and open the window.','') },
      { sentence:'Cuando _____ a la estación, _____ el panel y _____ el andén.', answers:['llegamos','miramos','buscamos'], options:['llegamos','miramos','buscamos','comemos','dormimos','pagamos'], translations:T('Quando chegamos à estação, vemos o painel e procuramos a plataforma.','Wenn wir am Bahnhof ankommen, prüfen wir die Anzeige und suchen das Gleis.','When we arrive at the station, we check the board and look for the platform.','') },
      { sentence:'Aunque _____ cansada, _____ adelante y _____ la calma.', answers:['está','sigue','mantiene'], options:['está','sigue','mantiene','conduce','compra','abre'], translations:T('Embora esteja cansada, continua e mantém a calma.','Obwohl sie müde ist, macht sie weiter und bleibt ruhig.','Although she is tired, she keeps going and stays calm.','') },
      { sentence:'Después de _____ la cena, _____ la mesa y _____ música.', answers:['preparar','pone','escucha'], options:['preparar','pone','escucha','duerme','coge','lee'], translations:T('Depois de preparar o jantar, põe a mesa e ouve música.','Nachdem er das Essen kocht, deckt er den Tisch und hört Musik.','After cooking dinner, he sets the table and listens to music.','') },
      { sentence:'Me _____ mi objetivo, _____ un paso y _____ paciencia.', answers:['imagino','doy','tengo'], options:['imagino','doy','tengo','bebo','abro','conduzco'], translations:T('Imagino o meu objetivo, dou um passo e tenho paciência.','Ich stelle mir mein Ziel vor, mache einen Schritt und bleibe geduldig.','I picture my goal, take one step and remain patient.','') }
    ]
  }
};

export function languageName(code) {
  return LANGUAGE_OPTIONS.find(item => item.code === code)?.short || code;
}

export function getSpeechLanguage(code) {
  return code || 'pt-PT';
}

export function getWords(learningLanguage, nativeLanguage) {
  return WORDS.map(item => ({
    target: item[learningLanguage],
    translation: item[nativeLanguage]
  }));
}

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  const languageSet = SENTENCES[learningLanguage] || SENTENCES['pt-PT'];
  return LEVEL_META.map(meta => ({
    ...meta,
    items: languageSet[meta.id].map(item => ({
      ...item,
      translation: item.translations[nativeLanguage]
    }))
  }));
}
