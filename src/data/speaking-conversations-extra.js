const LANGS=['en','de','pt','es','hr','fr'];
const s=(en,de,pt,es,hr,fr)=>({en,de,pt,es,hr,fr});

const SLOTS={
  meet:[
    s('family','Familie','família','familia','obitelj','famille'),s('best friend','besten Freundin oder deinem besten Freund','melhor amigo ou amiga','mejor amigo o amiga','najboljem prijatelju ili prijateljici','meilleur ami ou ta meilleure amie'),
    s('hobbies','Hobbys','passatempos','aficiones','hobijima','loisirs'),s('favourite music','Lieblingsmusik','música preferida','música favorita','omiljenoj glazbi','musique préférée'),
    s('favourite film','Lieblingsfilm','filme preferido','película favorita','omiljenom filmu','film préféré'),s('favourite book','Lieblingsbuch','livro preferido','libro favorito','omiljenoj knjizi','livre préféré'),
    s('pets','Haustiere','animais de estimação','mascotas','kućnim ljubimcima','animaux de compagnie'),s('languages','Sprachen','línguas','idiomas','jezicima','langues'),
    s('home town','Heimatstadt','cidade natal','ciudad natal','rodnom gradu','ville natale'),s('birthday','Geburtstag','aniversário','cumpleaños','rođendanu','anniversaire'),
    s('weekend','Wochenende','fim de semana','fin de semana','vikendu','week-end'),s('something you are proud of','etwas, auf das du stolz bist','algo de que te orgulhas','algo de lo que te sientes orgulloso','nečemu na što si ponosan','quelque chose dont tu es fier')
  ],
  cafe:[
    s('coffee','Kaffee','café','café','kavu','café'),s('tea','Tee','chá','té','čaj','thé'),s('fresh juice','frischen Saft','sumo natural','zumo natural','svježi sok','jus frais'),
    s('hot chocolate','heiße Schokolade','chocolate quente','chocolate caliente','vruću čokoladu','chocolat chaud'),s('a sandwich','ein Sandwich','uma sandes','un bocadillo','sendvič','un sandwich'),
    s('a salad','einen Salat','uma salada','una ensalada','salatu','une salade'),s('soup','Suppe','sopa','sopa','juhu','une soupe'),s('a piece of cake','ein Stück Kuchen','uma fatia de bolo','un trozo de tarta','komad kolača','une part de gâteau'),
    s('breakfast','Frühstück','pequeno-almoço','desayuno','doručak','le petit-déjeuner'),s('a vegetarian meal','ein vegetarisches Gericht','uma refeição vegetariana','una comida vegetariana','vegetarijanski obrok','un repas végétarien'),
    s('the bill','die Rechnung','a conta','la cuenta','račun','l’addition'),s('a table outside','einen Tisch draußen','uma mesa no exterior','una mesa fuera','stol vani','une table en terrasse')
  ],
  shopping:[
    s('a jacket','eine Jacke','um casaco','una chaqueta','jaknu','une veste'),s('comfortable shoes','bequeme Schuhe','sapatos confortáveis','zapatos cómodos','udobne cipele','des chaussures confortables'),
    s('a birthday present','ein Geburtstagsgeschenk','um presente de aniversário','un regalo de cumpleaños','rođendanski poklon','un cadeau d’anniversaire'),s('fresh vegetables','frisches Gemüse','legumes frescos','verduras frescas','svježe povrće','des légumes frais'),
    s('a phone charger','ein Handyladegerät','um carregador de telemóvel','un cargador de móvil','punjač za mobitel','un chargeur de téléphone'),s('a train ticket','eine Zugfahrkarte','um bilhete de comboio','un billete de tren','kartu za vlak','un billet de train'),
    s('something on sale','etwas im Angebot','algo em promoção','algo de oferta','nešto na sniženju','quelque chose en promotion'),s('a different colour','eine andere Farbe','outra cor','otro color','drugu boju','une autre couleur'),
    s('a smaller size','eine kleinere Größe','um tamanho mais pequeno','una talla más pequeña','manju veličinu','une taille plus petite'),s('a receipt','einen Kassenbon','um recibo','un recibo','račun','un reçu'),
    s('a reusable bag','eine wiederverwendbare Tasche','um saco reutilizável','una bolsa reutilizable','višekratnu vrećicu','un sac réutilisable')
  ],
  directions:[
    s('train station','Bahnhof','estação de comboios','estación de tren','željezničke stanice','gare'),s('airport','Flughafen','aeroporto','aeropuerto','zračne luke','aéroport'),
    s('beach','Strand','praia','playa','plaže','plage'),s('city centre','Stadtzentrum','centro da cidade','centro de la ciudad','centra grada','centre-ville'),
    s('hospital','Krankenhaus','hospital','hospital','bolnice','hôpital'),s('pharmacy','Apotheke','farmácia','farmacia','ljekarne','pharmacie'),
    s('museum','Museum','museu','museo','muzeja','musée'),s('bus stop','Bushaltestelle','paragem de autocarro','parada de autobús','autobusne stanice','arrêt de bus'),
    s('hotel','Hotel','hotel','hotel','hotela','hôtel'),s('nearest supermarket','nächsten Supermarkt','supermercado mais próximo','supermercado más cercano','najbližeg supermarketa','supermarché le plus proche'),
    s('park','Park','parque','parque','parka','parc')
  ],
  work:[
    s('teamwork','Teamarbeit','trabalho em equipa','trabajo en equipo','timskom radu','travail en équipe'),s('helping customers','Kundenbetreuung','apoio aos clientes','atención al cliente','pomaganju korisnicima','aide aux clients'),
    s('working from home','Arbeiten von zu Hause','teletrabalho','trabajo desde casa','radu od kuće','télétravail'),s('learning new skills','Lernen neuer Fähigkeiten','aprendizagem de novas competências','aprendizaje de nuevas habilidades','učenju novih vještina','apprentissage de nouvelles compétences'),
    s('a busy day','einen arbeitsreichen Tag','um dia ocupado','un día ajetreado','napornom danu','une journée chargée'),s('a good manager','eine gute Führungskraft','um bom responsável','un buen responsable','dobrom voditelju','un bon responsable'),
    s('taking a break','Pausen','fazer uma pausa','hacer una pausa','uzimanju pauze','une pause'),s('solving a problem','Lösen eines Problems','resolver um problema','resolver un problema','rješavanju problema','résolution d’un problème'),
    s('starting a new job','Beginn eines neuen Jobs','começar um novo emprego','empezar un nuevo trabajo','početku novog posla','début d’un nouvel emploi'),s('work-life balance','Work-Life-Balance','equilíbrio entre trabalho e vida pessoal','equilibrio entre trabajo y vida personal','ravnoteži između posla i života','équilibre entre travail et vie privée'),
    s('your ideal workplace','deinen idealen Arbeitsplatz','teu local de trabalho ideal','tu lugar de trabajo ideal','idealnom radnom mjestu','lieu de travail idéal')
  ],
  feelings:[
    s('you receive good news','du gute Nachrichten bekommst','recebes boas notícias','recibes buenas noticias','dobiješ dobre vijesti','tu reçois une bonne nouvelle'),s('a plan changes suddenly','sich ein Plan plötzlich ändert','um plano muda de repente','un plan cambia de repente','se plan naglo promijeni','un projet change soudainement'),
    s('you need some rest','du etwas Ruhe brauchst','precisas de descansar','necesitas descansar','trebaš odmor','tu as besoin de repos'),s('someone listens to you','dir jemand zuhört','alguém te ouve','alguien te escucha','te netko sluša','quelqu’un t’écoute'),
    s('you finish a difficult task','du eine schwierige Aufgabe beendest','terminas uma tarefa difícil','terminas una tarea difícil','završiš težak zadatak','tu termines une tâche difficile'),s('you make a mistake','du einen Fehler machst','cometes um erro','cometes un error','pogriješiš','tu fais une erreur'),
    s('you spend time by the sea','du Zeit am Meer verbringst','passas tempo junto ao mar','pasas tiempo junto al mar','provodiš vrijeme uz more','tu passes du temps au bord de la mer'),s('you meet a close friend','du einen engen Freund triffst','encontras um amigo próximo','ves a un amigo cercano','sretneš bliskog prijatelja','tu vois un ami proche'),
    s('you have too much to do','du zu viel zu tun hast','tens demasiadas coisas para fazer','tienes demasiadas cosas que hacer','imaš previše obaveza','tu as trop de choses à faire'),s('you try something new','du etwas Neues ausprobierst','experimentas algo novo','pruebas algo nuevo','isprobaš nešto novo','tu essaies quelque chose de nouveau'),
    s('you have a quiet evening','du einen ruhigen Abend hast','tens uma noite tranquila','tienes una noche tranquila','imaš mirnu večer','tu passes une soirée calme')
  ],
  everyday:[
    s('cooking','Kochen','cozinhar','cocinar','kuhanje','cuisine'),s('exercise','Bewegung','exercício','ejercicio','vježbanje','sport'),s('reading','Lesen','leitura','lectura','čitanje','lecture'),
    s('learning a language','Sprachenlernen','aprender uma língua','aprender un idioma','učenje jezika','apprentissage d’une langue'),s('calling family','Anrufen bei der Familie','telefonar à família','llamar a la familia','poziv obitelji','appel à la famille'),
    s('meeting friends','Treffen mit Freunden','encontrar amigos','quedar con amigos','druženje s prijateljima','rencontre avec des amis'),s('cleaning','Aufräumen','arrumar a casa','limpiar','pospremanje','ménage'),
    s('grocery shopping','Lebensmitteleinkauf','compras de supermercado','compras del supermercado','kupovinu namirnica','courses'),s('listening to music','Musikhören','ouvir música','escuchar música','slušanje glazbe','écoute de musique'),
    s('planning the next day','Planen des nächsten Tages','planear o dia seguinte','planificar el día siguiente','planiranje sljedećeg dana','préparation du lendemain'),s('rest','Erholung','descansar','descansar','odmor','repos')
  ]
};

const MORE_SLOTS={
  meet:[
    s('dream job','Traumberuf','emprego de sonho','trabajo ideal','poslu iz snova','métier de rêve'),s('favourite food','Lieblingsessen','comida preferida','comida favorita','omiljenoj hrani','plat préféré'),
    s('last holiday','letzten Urlaub','últimas férias','últimas vacaciones','posljednjem odmoru','dernières vacances'),s('morning routine','Morgenroutine','rotina matinal','rutina matutina','jutarnjoj rutini','routine du matin'),
    s('favourite season','Lieblingsjahreszeit','estação do ano preferida','estación favorita','omiljenom godišnjem dobu','saison préférée'),s('childhood','Kindheit','infância','infancia','djetinjstvu','enfance'),
    s('neighbourhood','Wohnviertel','bairro','barrio','susjedstvu','quartier'),s('travel plans','Reisepläne','planos de viagem','planes de viaje','planovima putovanja','projets de voyage'),
    s('favourite place','Lieblingsort','lugar preferido','lugar favorito','omiljenom mjestu','endroit préféré'),s('daily life','Alltag','dia a dia','vida cotidiana','svakodnevnom životu','vie quotidienne'),
    s('a person you admire','eine Person, die du bewunderst','uma pessoa que admiras','una persona que admiras','osobi kojoj se diviš','une personne que tu admires'),s('something that makes you laugh','etwas, das dich zum Lachen bringt','algo que te faz rir','algo que te hace reír','nečemu što te nasmijava','quelque chose qui te fait rire'),
    s('a skill you want to learn','eine Fähigkeit, die du lernen möchtest','uma habilidade que queres aprender','una habilidad que quieres aprender','vještini koju želiš naučiti','une compétence que tu veux apprendre'),s('your perfect day','deinen perfekten Tag','teu dia perfeito','tu día perfecto','svom savršenom danu','journée parfaite'),
    s('future goals','Zukunftsziele','objetivos futuros','metas futuras','budućim ciljevima','objectifs futurs')
  ],
  cafe:[
    s('sparkling water','Mineralwasser mit Kohlensäure','água com gás','agua con gas','gaziranu vodu','eau gazeuse'),s('lemon tea','Zitronentee','chá de limão','té de limón','čaj od limuna','thé au citron'),
    s('an espresso','einen Espresso','um café expresso','un café expreso','espresso','un expresso'),s('a cappuccino','einen Cappuccino','um cappuccino','un capuchino','cappuccino','un cappuccino'),
    s('toast with cheese','Käsetoast','tosta com queijo','tostada con queso','tost sa sirom','toast au fromage'),s('a croissant','ein Croissant','um croissant','un cruasán','kroasan','un croissant'),
    s('fruit salad','Obstsalat','salada de fruta','ensalada de frutas','voćnu salatu','salade de fruits'),s('an omelette','ein Omelett','uma omelete','una tortilla','omlet','une omelette'),
    s('a vegan snack','einen veganen Snack','um lanche vegano','un tentempié vegano','veganski zalogaj','un encas végétalien'),s('a glass of milk','ein Glas Milch','um copo de leite','un vaso de leche','čašu mlijeka','un verre de lait'),
    s('a decaffeinated coffee','einen koffeinfreien Kaffee','um café descafeinado','un café descafeinado','kavu bez kofeina','un café décaféiné'),s('a takeaway drink','ein Getränk zum Mitnehmen','uma bebida para levar','una bebida para llevar','piće za van','une boisson à emporter'),
    s('today’s special','das Tagesgericht','o prato do dia','el plato del día','današnje posebno jelo','le plat du jour'),s('a table by the window','einen Tisch am Fenster','uma mesa junto à janela','una mesa junto a la ventana','stol uz prozor','une table près de la fenêtre'),
    s('something without sugar','etwas ohne Zucker','algo sem açúcar','algo sin azúcar','nešto bez šećera','quelque chose sans sucre')
  ],
  shopping:[
    s('a warm sweater','einen warmen Pullover','uma camisola quente','un jersey abrigado','topli džemper','un pull chaud'),s('a bottle of water','eine Flasche Wasser','uma garrafa de água','una botella de agua','bocu vode','une bouteille d’eau'),
    s('a notebook','ein Notizbuch','um caderno','un cuaderno','bilježnicu','un carnet'),s('a pair of sunglasses','eine Sonnenbrille','uns óculos de sol','unas gafas de sol','sunčane naočale','des lunettes de soleil'),
    s('a travel bag','eine Reisetasche','um saco de viagem','una bolsa de viaje','putnu torbu','un sac de voyage'),s('a kitchen knife','ein Küchenmesser','uma faca de cozinha','un cuchillo de cocina','kuhinjski nož','un couteau de cuisine'),
    s('a bus pass','eine Busfahrkarte','um passe de autocarro','un abono de autobús','autobusnu kartu','un abonnement de bus'),s('a gift card','eine Geschenkkarte','um cartão-presente','una tarjeta regalo','poklon karticu','une carte-cadeau'),
    s('a phone case','eine Handyhülle','uma capa de telemóvel','una funda de móvil','maskicu za mobitel','une coque de téléphone'),s('a local souvenir','ein lokales Souvenir','uma lembrança local','un recuerdo local','lokalni suvenir','un souvenir local'),
    s('a raincoat','einen Regenmantel','um impermeável','un chubasquero','kišni ogrtač','un imperméable'),s('a pack of batteries','eine Packung Batterien','um pacote de pilhas','un paquete de pilas','paket baterija','un paquet de piles'),
    s('a comfortable chair','einen bequemen Stuhl','uma cadeira confortável','una silla cómoda','udobnu stolicu','une chaise confortable'),s('a birthday card','eine Geburtstagskarte','um cartão de aniversário','una tarjeta de cumpleaños','rođendansku čestitku','une carte d’anniversaire'),
    s('a second-hand book','ein gebrauchtes Buch','um livro em segunda mão','un libro de segunda mano','rabljenu knjigu','un livre d’occasion')
  ],
  directions:[
    s('police station','Polizeiwache','esquadra de polícia','comisaría','policijske postaje','commissariat'),s('post office','Post','estação dos correios','oficina de correos','pošte','bureau de poste'),
    s('library','Bibliothek','biblioteca','biblioteca','knjižnice','bibliothèque'),s('market','Markt','mercado','mercado','tržnice','marché'),
    s('bank','Bank','banco','banco','banke','banque'),s('public toilet','öffentlichen Toilette','casa de banho pública','baño público','javnog toaleta','toilettes publiques'),
    s('taxi rank','Taxistand','praça de táxis','parada de taxis','stajališta taksija','station de taxis'),s('old town','Altstadt','zona histórica','casco antiguo','starog grada','vieille ville'),
    s('university','Universität','universidade','universidad','sveučilišta','université'),s('sports centre','Sportzentrum','centro desportivo','centro deportivo','sportskog centra','centre sportif'),
    s('cinema','Kino','cinema','cine','kina','cinéma'),s('restaurant','Restaurant','restaurante','restaurante','restorana','restaurant'),
    s('main square','Hauptplatz','praça principal','plaza principal','glavnog trga','place principale'),s('ferry terminal','Fährterminal','terminal de ferry','terminal de ferris','trajektnog terminala','terminal des ferries'),
    s('tourist information office','Touristeninformation','posto de turismo','oficina de turismo','turističkog ureda','office de tourisme')
  ],
  work:[
    s('meeting deadlines','Einhalten von Fristen','cumprir prazos','cumplir plazos','poštivanju rokova','respect des délais'),s('clear communication','klare Kommunikation','comunicação clara','comunicación clara','jasnoj komunikaciji','communication claire'),
    s('giving feedback','Feedbackgeben','dar feedback','dar retroalimentación','davanju povratnih informacija','retour constructif'),s('asking for help','Bitten um Hilfe','pedir ajuda','pedir ayuda','traženju pomoći','demande d’aide'),
    s('organising tasks','Organisieren von Aufgaben','organizar tarefas','organizar tareas','organiziranju zadataka','organisation des tâches'),s('training new colleagues','Einarbeiten neuer Kollegen','formar novos colegas','formar a nuevos compañeros','obuci novih kolega','formation des nouveaux collègues'),
    s('handling stress','Umgang mit Stress','lidar com o stress','manejar el estrés','nošenju sa stresom','gestion du stress'),s('sharing ideas','Teilen von Ideen','partilhar ideias','compartir ideas','dijeljenju ideja','partage des idées'),
    s('flexible hours','flexible Arbeitszeiten','horários flexíveis','horarios flexibles','fleksibilnom radnom vremenu','horaires flexibles'),s('a quiet workspace','einen ruhigen Arbeitsplatz','um espaço de trabalho tranquilo','un espacio de trabajo tranquilo','mirnom radnom prostoru','espace de travail calme'),
    s('professional development','berufliche Weiterentwicklung','desenvolvimento profissional','desarrollo profesional','profesionalnom razvoju','développement professionnel'),s('customer feedback','Kundenfeedback','opiniões dos clientes','comentarios de clientes','povratnim informacijama korisnika','avis des clients'),
    s('daily planning','Tagesplanung','planeamento diário','planificación diaria','dnevnom planiranju','planification quotidienne'),s('respectful leadership','respektvolle Führung','liderança respeitosa','liderazgo respetuoso','vodstvu s poštovanjem','leadership respectueux'),
    s('celebrating success','Feiern von Erfolgen','celebrar o sucesso','celebrar el éxito','slavljenju uspjeha','célébration des réussites')
  ],
  feelings:[
    s('someone surprises you','dich jemand überrascht','alguém te surpreende','alguien te sorprende','te netko iznenadi','quelqu’un te surprend'),s('you miss the bus','du den Bus verpasst','perdes o autocarro','pierdes el autobús','propustiš autobus','tu rates le bus'),
    s('you help another person','du einer anderen Person hilfst','ajudas outra pessoa','ayudas a otra persona','pomogneš drugoj osobi','tu aides une autre personne'),s('you learn good news about a friend','du gute Nachrichten über einen Freund erfährst','recebes boas notícias sobre um amigo','recibes buenas noticias sobre un amigo','čuješ dobre vijesti o prijatelju','tu apprends une bonne nouvelle sur un ami'),
    s('you feel misunderstood','du dich missverstanden fühlst','te sentes incompreendido','te sientes incomprendido','se osjećaš neshvaćeno','tu te sens incompris'),s('you complete an important goal','du ein wichtiges Ziel erreichst','alcanças um objetivo importante','alcanzas una meta importante','ostvariš važan cilj','tu atteins un objectif important'),
    s('you are waiting for an answer','du auf eine Antwort wartest','esperas por uma resposta','esperas una respuesta','čekaš odgovor','tu attends une réponse'),s('you enter a new place','du einen neuen Ort betrittst','entras num lugar novo','entras en un lugar nuevo','uđeš na novo mjesto','tu entres dans un nouvel endroit'),
    s('someone thanks you','dir jemand dankt','alguém te agradece','alguien te da las gracias','ti netko zahvali','quelqu’un te remercie'),s('you have an argument','du einen Streit hast','tens uma discussão','tienes una discusión','se posvađaš','tu te disputes'),
    s('you wake up early','du früh aufwachst','acordas cedo','te despiertas temprano','se rano probudiš','tu te réveilles tôt'),s('you hear your favourite song','du dein Lieblingslied hörst','ouves a tua música preferida','escuchas tu canción favorita','čuješ omiljenu pjesmu','tu entends ta chanson préférée'),
    s('you need to make a decision','du eine Entscheidung treffen musst','precisas de tomar uma decisão','necesitas tomar una decisión','moraš donijeti odluku','tu dois prendre une décision'),s('someone cancels a meeting','jemand ein Treffen absagt','alguém cancela um encontro','alguien cancela una cita','netko otkaže susret','quelqu’un annule un rendez-vous'),
    s('you finally understand something','du endlich etwas verstehst','finalmente compreendes algo','por fin entiendes algo','napokon nešto razumiješ','tu comprends enfin quelque chose')
  ],
  everyday:[
    s('walking','Spazierengehen','caminhar','caminar','šetnju','marche'),s('washing clothes','Wäschewaschen','lavar a roupa','lavar la ropa','pranje rublja','lessive'),
    s('answering messages','Beantworten von Nachrichten','responder a mensagens','responder mensajes','odgovaranje na poruke','réponse aux messages'),s('drinking water','Wassertrinken','beber água','beber agua','pijenje vode','hydratation'),
    s('preparing breakfast','Frühstückmachen','preparar o pequeno-almoço','preparar el desayuno','pripremu doručka','préparation du petit-déjeuner'),s('taking the bus','Busfahren','andar de autocarro','tomar el autobús','vožnju autobusom','trajet en bus'),
    s('practising pronunciation','Ausspracheüben','praticar a pronúncia','practicar la pronunciación','vježbanje izgovora','pratique de la prononciation'),s('checking the weather','Prüfen des Wetters','ver a previsão do tempo','consultar el tiempo','provjeru vremena','consultation de la météo'),
    s('feeding a pet','Füttern eines Haustiers','alimentar um animal de estimação','alimentar a una mascota','hranjenje kućnog ljubimca','repas d’un animal'),s('watering plants','Pflanzengießen','regar as plantas','regar las plantas','zalijevanje biljaka','arrosage des plantes'),
    s('writing a list','Schreiben einer Liste','escrever uma lista','escribir una lista','pisanje popisa','écriture d’une liste'),s('tidying your desk','Aufräumen deines Schreibtischs','arrumar a secretária','ordenar el escritorio','pospremanje stola','rangement du bureau'),
    s('having lunch','Mittagessen','almoçar','almorzar','ručak','déjeuner'),s('going to bed','Schlafengehen','ir dormir','irse a dormir','odlazak na spavanje','coucher'),
    s('taking a short break','Machen einer kurzen Pause','fazer uma pequena pausa','tomar un breve descanso','kratku pauzu','petite pause')
  ]
};

const allSlots=topicId=>[...(SLOTS[topicId]||[]),...(MORE_SLOTS[topicId]||[])];

const TEMPLATES={
  meet:{intent:'profile',q:s('Tell me about your {x}.','Erzähl mir etwas über deine {x}.','Fala-me sobre a tua {x}.','Háblame de tu {x}.','Reci mi nešto o svojim {x}.','Parle-moi de tes {x}.'),a:s('My {x} is an important part of my life.','Meine {x} ist ein wichtiger Teil meines Lebens.','A minha {x} é uma parte importante da minha vida.','Mi {x} es una parte importante de mi vida.','Moja {x} važan je dio mog života.','Ma {x} est une partie importante de ma vie.')},
  cafe:{intent:'cafe-choice',q:s('Would you order {x}?','Würdest du {x} bestellen?','Pedirias {x}?','¿Pedirías {x}?','Bi li naručio {x}?','Commanderais-tu {x} ?'),a:s('Yes, I would order {x}.','Ja, ich würde {x} bestellen.','Sim, pediria {x}.','Sí, pediría {x}.','Da, naručio bih {x}.','Oui, je commanderais {x}.')},
  shopping:{intent:'shopping-choice',q:s('When would you buy {x}?','Wann würdest du {x} kaufen?','Quando comprarias {x}?','¿Cuándo comprarías {x}?','Kada bi kupio {x}?','Quand achèterais-tu {x} ?'),a:s('I would buy {x} when I need it.','Ich würde {x} kaufen, wenn ich es brauche.','Compraria {x} quando precisasse.','Compraría {x} cuando lo necesitara.','Kupio bih {x} kada mi zatreba.','J’achèterais {x} quand j’en aurais besoin.')},
  directions:{intent:'destination',q:s('How would you get to the {x}?','Wie würdest du zum {x} kommen?','Como irias até à {x}?','¿Cómo irías hasta la {x}?','Kako bi došao do {x}?','Comment irais-tu à la {x} ?'),a:s('I would go to the {x} by bus.','Ich würde mit dem Bus zum {x} fahren.','Iria de autocarro até à {x}.','Iría en autobús hasta la {x}.','Do {x} bih išao autobusom.','J’irais à la {x} en bus.')},
  work:{intent:'work-topic',q:s('What do you think about {x} at work?','Was denkst du bei der Arbeit über {x}?','O que pensas sobre {x} no trabalho?','¿Qué piensas de {x} en el trabajo?','Što misliš o {x} na poslu?','Que penses-tu de {x} au travail ?'),a:s('I think {x} is important at work.','Ich finde {x} bei der Arbeit wichtig.','Acho que {x} é importante no trabalho.','Creo que {x} es importante en el trabajo.','Mislim da je {x} važno na poslu.','Je pense que {x} est important au travail.')},
  feelings:{intent:'feeling',q:s('How do you feel when {x}?','Wie fühlst du dich, wenn {x}?','Como te sentes quando {x}?','¿Cómo te sientes cuando {x}?','Kako se osjećaš kada {x}?','Comment te sens-tu quand {x} ?'),a:s('I try to notice how I feel when {x}.','Ich versuche wahrzunehmen, wie ich mich fühle, wenn {x}.','Tento perceber como me sinto quando {x}.','Intento notar cómo me siento cuando {x}.','Pokušavam primijetiti kako se osjećam kada {x}.','J’essaie de remarquer ce que je ressens quand {x}.')},
  everyday:{intent:'routine',q:s('When do you usually make time for {x}?','Wann nimmst du dir normalerweise Zeit für {x}?','Quando costumas reservar tempo para {x}?','¿Cuándo sueles dedicar tiempo a {x}?','Kada obično odvojiš vrijeme za {x}?','Quand prends-tu généralement du temps pour {x} ?'),a:s('I usually make time for {x} after work.','Normalerweise nehme ich mir nach der Arbeit Zeit für {x}.','Normalmente reservo tempo para {x} depois do trabalho.','Normalmente dedico tiempo a {x} después del trabajo.','Obično odvojim vrijeme za {x} nakon posla.','Je prends généralement du temps pour {x} après le travail.')}
};

const fill=(template,slot)=>template.replace('{x}',slot);
export function getExtraSpeakingTurns(topicId,learning,native){
  const template=TEMPLATES[topicId];
  return allSlots(topicId).map(slot=>({
    intent:template.intent,
    signals:Object.values(slot),
    question:fill(template.q[learning]||template.q.en,slot[learning]||slot.en),
    translation:fill(template.q[native]||template.q.en,slot[native]||slot.en),
    example:fill(template.a[learning]||template.a.en,slot[learning]||slot.en),
    exampleTranslation:fill(template.a[native]||template.a.en,slot[native]||slot.en)
  }));
}

export const EXTRA_SPEAKING_TURN_COUNT=[...Object.values(SLOTS),...Object.values(MORE_SLOTS)].reduce((sum,items)=>sum+items.length,0);
