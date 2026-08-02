export const LANGUAGE_OPTIONS = [
  { code: 'pt-PT', label: 'Português (Portugal)', short: 'Português' },
  { code: 'de-DE', label: 'Deutsch', short: 'Deutsch' },
  { code: 'en-GB', label: 'English', short: 'English' }
];

const WORDS = [
  ['casa','Haus','house'],['rua','Straße','street'],['amiga','Freundin','female friend'],['amigo','Freund','male friend'],
  ['café','Kaffee','coffee'],['água','Wasser','water'],['manhã','Morgen','morning'],['noite','Abend','evening'],
  ['trabalho','Arbeit','work'],['escola','Schule','school'],['livro','Buch','book'],['mesa','Tisch','table'],
  ['cadeira','Stuhl','chair'],['porta','Tür','door'],['janela','Fenster','window'],['pão','Brot','bread'],
  ['maçã','Apfel','apple'],['legumes','Gemüse','vegetables'],['comboio','Zug','train'],['autocarro','Bus','bus'],
  ['telemóvel','Handy','mobile phone'],['amor','Liebe','love'],['esperança','Hoffnung','hope'],['calma','Ruhe','calm'],
  ['coragem','Mut','courage'],['aprender','lernen','to learn'],['falar','sprechen','to speak'],['ir','gehen','to go'],
  ['vir','kommen','to come'],['ver','sehen','to see'],['ouvir','hören','to hear'],['comer','essen','to eat'],
  ['beber','trinken','to drink'],['dormir','schlafen','to sleep'],['trabalhar','arbeiten','to work'],['feliz','glücklich','happy'],
  ['cansado','müde','tired'],['simpático','freundlich','kind'],['rápido','schnell','fast'],['devagar','langsam','slow']
].map(([pt,de,en]) => ({ 'pt-PT': pt, 'de-DE': de, 'en-GB': en }));

const LEVEL_META = [
  { id:'beginner', title:'Beginner', emoji:'🌱', description:'One gap with full support.', englishClass:'' },
  { id:'survivor', title:'Survivor', emoji:'🔥', description:'Two gaps with full support.', englishClass:'' },
  { id:'explorer', title:'Explorer', emoji:'🧭', description:'Three gaps with softer support.', englishClass:'is-subtle' }
];

const SENTENCES = {
  'pt-PT': {
    beginner: [
      { sentence:'Eu _____ café todas as manhãs.', answers:['bebo'], options:['bebo','vejo','durmo','venho'], translations:{'de-DE':'Ich trinke jeden Morgen Kaffee.','en-GB':'I drink coffee every morning.'} },
      { sentence:'Nós _____ hoje de autocarro.', answers:['vamos'], options:['vamos','comemos','aprendemos','ouvimos'], translations:{'de-DE':'Wir fahren heute mit dem Bus.','en-GB':'We are taking the bus today.'} },
      { sentence:'Ela _____ um livro novo.', answers:['lê'], options:['lê','bebe','vai','trabalha'], translations:{'de-DE':'Sie liest ein neues Buch.','en-GB':'She is reading a new book.'} },
      { sentence:'Ele _____ em Lisboa.', answers:['mora'], options:['mora','fala','compra','abre'], translations:{'de-DE':'Er wohnt in Lissabon.','en-GB':'He lives in Lisbon.'} },
      { sentence:'Eu _____ português.', answers:['aprendo'], options:['aprendo','espero','cozinho','encontro'], translations:{'de-DE':'Ich lerne Portugiesisch.','en-GB':'I am learning Portuguese.'} }
    ],
    survivor: [
      { sentence:'Eu _____ café e _____ as notícias de manhã.', answers:['bebo','leio'], options:['bebo','leio','durmo','compro','ouço'], translations:{'de-DE':'Ich trinke morgens Kaffee und lese die Nachrichten.','en-GB':'I drink coffee and read the news in the morning.'} },
      { sentence:'Nós _____ até à estação e _____ o comboio.', answers:['vamos','apanhamos'], options:['vamos','apanhamos','comemos','vemos','abrimos'], translations:{'de-DE':'Wir gehen zum Bahnhof und nehmen den Zug.','en-GB':'We go to the station and take the train.'} },
      { sentence:'Ela _____ a janela e _____ o ar fresco.', answers:['abre','aproveita'], options:['abre','aproveita','escreve','paga','espera'], translations:{'de-DE':'Sie öffnet das Fenster und genießt die frische Luft.','en-GB':'She opens the window and enjoys the fresh air.'} },
      { sentence:'Ele _____ em casa e _____ ao computador.', answers:['fica','trabalha'], options:['fica','trabalha','conduz','dança','compra'], translations:{'de-DE':'Er bleibt zu Hause und arbeitet am Computer.','en-GB':'He stays at home and works on the computer.'} },
      { sentence:'Eu _____ o jantar e _____ a cozinha depois.', answers:['cozinho','arrumo'], options:['cozinho','arrumo','leio','durmo','conduzo'], translations:{'de-DE':'Ich koche das Abendessen und räume danach die Küche auf.','en-GB':'I cook dinner and clean the kitchen afterwards.'} }
    ],
    explorer: [
      { sentence:'Antes de _____ para o trabalho, _____ café e _____ a janela.', answers:['ir','bebo','abro'], options:['ir','bebo','abro','durmo','compro','ouço'], translations:{'de-DE':'Bevor ich zur Arbeit gehe, trinke ich Kaffee und öffne das Fenster.','en-GB':'Before I go to work, I drink coffee and open the window.'} },
      { sentence:'Quando _____ à estação, _____ o painel e _____ a plataforma.', answers:['chegamos','verificamos','procuramos'], options:['chegamos','verificamos','procuramos','comemos','dormimos','pagamos'], translations:{'de-DE':'Wenn wir am Bahnhof ankommen, prüfen wir die Anzeige und suchen das Gleis.','en-GB':'When we arrive at the station, we check the board and look for the platform.'} },
      { sentence:'Embora ela _____ cansada, _____ e _____ calma.', answers:['esteja','continua','fica'], options:['esteja','continua','fica','conduz','compra','abre'], translations:{'de-DE':'Obwohl sie müde ist, macht sie weiter und bleibt ruhig.','en-GB':'Although she is tired, she keeps going and stays calm.'} },
      { sentence:'Depois de _____ o jantar, _____ a mesa e _____ música.', answers:['cozinhar','põe','ouve'], options:['cozinhar','põe','ouve','dorme','apanha','lê'], translations:{'de-DE':'Nachdem er das Essen kocht, deckt er den Tisch und hört Musik.','en-GB':'After cooking dinner, he sets the table and listens to music.'} },
      { sentence:'Eu _____ o meu objetivo, _____ um passo e _____ paciente.', answers:['imagino','dou','fico'], options:['imagino','dou','fico','bebo','abro','conduzo'], translations:{'de-DE':'Ich stelle mir mein Ziel vor, mache einen Schritt und bleibe geduldig.','en-GB':'I picture my goal, take one step and remain patient.'} }
    ]
  },
  'de-DE': {
    beginner: [
      { sentence:'Ich _____ jeden Morgen Kaffee.', answers:['trinke'], options:['trinke','sehe','schlafe','komme'], translations:{'pt-PT':'Eu bebo café todas as manhãs.','en-GB':'I drink coffee every morning.'} },
      { sentence:'Wir _____ heute mit dem Bus.', answers:['fahren'], options:['fahren','essen','lernen','hören'], translations:{'pt-PT':'Nós vamos hoje de autocarro.','en-GB':'We are taking the bus today.'} },
      { sentence:'Sie _____ ein neues Buch.', answers:['liest'], options:['liest','trinkt','geht','arbeitet'], translations:{'pt-PT':'Ela lê um livro novo.','en-GB':'She is reading a new book.'} },
      { sentence:'Er _____ in Berlin.', answers:['wohnt'], options:['wohnt','spricht','kauft','öffnet'], translations:{'pt-PT':'Ele mora em Berlim.','en-GB':'He lives in Berlin.'} },
      { sentence:'Ich _____ Deutsch.', answers:['lerne'], options:['lerne','warte','koche','finde'], translations:{'pt-PT':'Eu aprendo alemão.','en-GB':'I am learning German.'} }
    ],
    survivor: [
      { sentence:'Ich _____ morgens Kaffee und _____ die Nachrichten.', answers:['trinke','lese'], options:['trinke','lese','schlafe','kaufe','höre'], translations:{'pt-PT':'Eu bebo café e leio as notícias de manhã.','en-GB':'I drink coffee and read the news in the morning.'} },
      { sentence:'Wir _____ zum Bahnhof und _____ den Zug.', answers:['gehen','nehmen'], options:['gehen','nehmen','essen','sehen','öffnen'], translations:{'pt-PT':'Nós vamos até à estação e apanhamos o comboio.','en-GB':'We go to the station and take the train.'} },
      { sentence:'Sie _____ das Fenster und _____ die frische Luft.', answers:['öffnet','genießt'], options:['öffnet','genießt','schreibt','bezahlt','wartet'], translations:{'pt-PT':'Ela abre a janela e aproveita o ar fresco.','en-GB':'She opens the window and enjoys the fresh air.'} },
      { sentence:'Er _____ zu Hause und _____ am Computer.', answers:['bleibt','arbeitet'], options:['bleibt','arbeitet','fährt','tanzt','kauft'], translations:{'pt-PT':'Ele fica em casa e trabalha ao computador.','en-GB':'He stays at home and works on the computer.'} },
      { sentence:'Ich _____ das Abendessen und _____ danach die Küche.', answers:['koche','räume auf'], options:['koche','räume auf','lese','schlafe','fahre'], translations:{'pt-PT':'Eu cozinho o jantar e arrumo a cozinha depois.','en-GB':'I cook dinner and clean the kitchen afterwards.'} }
    ],
    explorer: [
      { sentence:'Bevor ich zur Arbeit _____, _____ ich Kaffee und _____ das Fenster.', answers:['gehe','trinke','öffne'], options:['gehe','trinke','öffne','schlafe','kaufe','höre'], translations:{'pt-PT':'Antes de ir para o trabalho, bebo café e abro a janela.','en-GB':'Before I go to work, I drink coffee and open the window.'} },
      { sentence:'Wenn wir am Bahnhof _____, _____ wir die Anzeige und _____ das Gleis.', answers:['ankommen','prüfen','suchen'], options:['ankommen','prüfen','suchen','essen','schlafen','bezahlen'], translations:{'pt-PT':'Quando chegamos à estação, verificamos o painel e procuramos a plataforma.','en-GB':'When we arrive at the station, we check the board and look for the platform.'} },
      { sentence:'Obwohl sie müde _____, _____ sie weiter und _____ ruhig.', answers:['ist','macht','bleibt'], options:['ist','macht','bleibt','fährt','kauft','öffnet'], translations:{'pt-PT':'Embora esteja cansada, continua e fica calma.','en-GB':'Although she is tired, she keeps going and stays calm.'} },
      { sentence:'Nachdem er das Essen _____, _____ er den Tisch und _____ Musik.', answers:['gekocht hat','deckt','hört'], options:['gekocht hat','deckt','hört','schläft','nimmt','liest'], translations:{'pt-PT':'Depois de cozinhar o jantar, põe a mesa e ouve música.','en-GB':'After cooking dinner, he sets the table and listens to music.'} },
      { sentence:'Ich _____ mir mein Ziel vor, _____ einen Schritt und _____ geduldig.', answers:['stelle','mache','bleibe'], options:['stelle','mache','bleibe','trinke','öffne','fahre'], translations:{'pt-PT':'Eu imagino o meu objetivo, dou um passo e fico paciente.','en-GB':'I picture my goal, take one step and remain patient.'} }
    ]
  },
  'en-GB': {
    beginner: [
      { sentence:'I _____ coffee every morning.', answers:['drink'], options:['drink','see','sleep','come'], translations:{'pt-PT':'Eu bebo café todas as manhãs.','de-DE':'Ich trinke jeden Morgen Kaffee.'} },
      { sentence:'We _____ the bus today.', answers:['take'], options:['take','eat','learn','hear'], translations:{'pt-PT':'Nós vamos hoje de autocarro.','de-DE':'Wir nehmen heute den Bus.'} },
      { sentence:'She _____ a new book.', answers:['reads'], options:['reads','drinks','goes','works'], translations:{'pt-PT':'Ela lê um livro novo.','de-DE':'Sie liest ein neues Buch.'} },
      { sentence:'He _____ in London.', answers:['lives'], options:['lives','speaks','buys','opens'], translations:{'pt-PT':'Ele mora em Londres.','de-DE':'Er wohnt in London.'} },
      { sentence:'I _____ English.', answers:['learn'], options:['learn','wait','cook','find'], translations:{'pt-PT':'Eu aprendo inglês.','de-DE':'Ich lerne Englisch.'} }
    ],
    survivor: [
      { sentence:'I _____ coffee and _____ the news in the morning.', answers:['drink','read'], options:['drink','read','sleep','buy','hear'], translations:{'pt-PT':'Eu bebo café e leio as notícias de manhã.','de-DE':'Ich trinke morgens Kaffee und lese die Nachrichten.'} },
      { sentence:'We _____ to the station and _____ the train.', answers:['go','take'], options:['go','take','eat','see','open'], translations:{'pt-PT':'Nós vamos até à estação e apanhamos o comboio.','de-DE':'Wir gehen zum Bahnhof und nehmen den Zug.'} },
      { sentence:'She _____ the window and _____ the fresh air.', answers:['opens','enjoys'], options:['opens','enjoys','writes','pays','waits'], translations:{'pt-PT':'Ela abre a janela e aproveita o ar fresco.','de-DE':'Sie öffnet das Fenster und genießt die frische Luft.'} },
      { sentence:'He _____ at home and _____ on the computer.', answers:['stays','works'], options:['stays','works','drives','dances','buys'], translations:{'pt-PT':'Ele fica em casa e trabalha ao computador.','de-DE':'Er bleibt zu Hause und arbeitet am Computer.'} },
      { sentence:'I _____ dinner and _____ the kitchen afterwards.', answers:['cook','clean'], options:['cook','clean','read','sleep','drive'], translations:{'pt-PT':'Eu cozinho o jantar e arrumo a cozinha depois.','de-DE':'Ich koche das Abendessen und räume danach die Küche auf.'} }
    ],
    explorer: [
      { sentence:'Before I _____ to work, I _____ coffee and _____ the window.', answers:['go','drink','open'], options:['go','drink','open','sleep','buy','hear'], translations:{'pt-PT':'Antes de ir para o trabalho, bebo café e abro a janela.','de-DE':'Bevor ich zur Arbeit gehe, trinke ich Kaffee und öffne das Fenster.'} },
      { sentence:'When we _____ at the station, we _____ the board and _____ the platform.', answers:['arrive','check','find'], options:['arrive','check','find','eat','sleep','pay'], translations:{'pt-PT':'Quando chegamos à estação, verificamos o painel e procuramos a plataforma.','de-DE':'Wenn wir am Bahnhof ankommen, prüfen wir die Anzeige und suchen das Gleis.'} },
      { sentence:'Although she _____ tired, she _____ going and _____ calm.', answers:['is','keeps','stays'], options:['is','keeps','stays','drives','buys','opens'], translations:{'pt-PT':'Embora esteja cansada, continua e fica calma.','de-DE':'Obwohl sie müde ist, macht sie weiter und bleibt ruhig.'} },
      { sentence:'After he _____ dinner, he _____ the table and _____ to music.', answers:['cooks','sets','listens'], options:['cooks','sets','listens','sleeps','takes','reads'], translations:{'pt-PT':'Depois de cozinhar o jantar, põe a mesa e ouve música.','de-DE':'Nachdem er das Essen kocht, deckt er den Tisch und hört Musik.'} },
      { sentence:'I _____ my goal, _____ one step and _____ patient.', answers:['picture','take','remain'], options:['picture','take','remain','drink','open','drive'], translations:{'pt-PT':'Eu imagino o meu objetivo, dou um passo e fico paciente.','de-DE':'Ich stelle mir mein Ziel vor, mache einen Schritt und bleibe geduldig.'} }
    ]
  }
};

export function languageName(code) {
  return LANGUAGE_OPTIONS.find(item => item.code === code)?.short || code;
}

export function getSpeechLanguage(code) {
  return LANGUAGE_OPTIONS.some(item => item.code === code) ? code : 'pt-PT';
}

export function getWords(learningLanguage, nativeLanguage) {
  return WORDS.map(item => ({
    target: item[learningLanguage],
    translation: item[nativeLanguage]
  })).filter(item => item.target && item.translation);
}

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  const source = SENTENCES[learningLanguage] || SENTENCES['pt-PT'];
  return LEVEL_META.map(meta => ({
    ...meta,
    items: (source[meta.id] || []).map(item => ({
      ...item,
      translation: item.translations[nativeLanguage] || ''
    }))
  }));
}
