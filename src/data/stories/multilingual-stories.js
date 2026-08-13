const META={
 everyday:{emoji:'🏠',title:'Everyday Life',subtitle:'A calm day in the neighbourhood'},
 romance:{emoji:'💞',title:'Romance',subtitle:'A small meeting that matters'},
 travel:{emoji:'✈️',title:'Travel',subtitle:'A new place, one step at a time'},
 horror:{emoji:'🌙',title:'Horror',subtitle:'A strange sound after midnight'}
};

const TEXTS={
 everyday:{
  'en-GB':[
   ['Leonor leaves home in the morning and walks to the bakery.','leave','walk','bakery'],
   ['She meets Sofia, buys fresh bread and smiles.','meet','buy','smile'],
   ['Later they share lunch and talk about the weekend.','share','talk','weekend']],
  'pt-PT':[
   ['A Leonor sai de casa de manhã e vai a pé até à padaria.','sai','vai','padaria'],
   ['Encontra a Sofia, compra pão fresco e sorri.','encontra','compra','sorri'],
   ['Mais tarde, almoçam juntas e falam sobre o fim de semana.','almoçam','falam','fim de semana']],
  'de-DE':[
   ['Leonor verlässt morgens das Haus und geht zur Bäckerei.','verlässt','geht','Bäckerei'],
   ['Sie trifft Sofia, kauft frisches Brot und lächelt.','trifft','kauft','lächelt'],
   ['Später essen sie zusammen und sprechen über das Wochenende.','essen','sprechen','Wochenende']],
  'es-ES':[
   ['Leonor sale de casa por la mañana y va andando a la panadería.','sale','va','panadería'],
   ['Se encuentra con Sofía, compra pan fresco y sonríe.','encuentra','compra','sonríe'],
   ['Más tarde comen juntas y hablan del fin de semana.','comen','hablan','fin de semana']],
  'es-AN':[
   ['Leonor sale de casa por la mañana y tira andando para la panadería.','sale','tira','panadería'],
   ['Se encuentra con Sofía, pilla pan fresco y sonríe.','encuentra','pilla','sonríe'],
   ['Luego comen juntas y charlan del finde.','comen','charlan','finde']],
  'hr-HR':[
   ['Leonor ujutro izlazi iz kuće i ide do pekare.','izlazi','ide','pekare'],
   ['Susreće Sofiju, kupuje svježi kruh i smiješi se.','susreće','kupuje','smiješi'],
   ['Kasnije zajedno ručaju i razgovaraju o vikendu.','ručaju','razgovaraju','vikendu']],
  'hr-DAL':[
   ['Leonor ujutro izlazi iz kuće i ide do pekare.','izlazi','ide','pekare'],
   ['Sretne Sofiju, kupi friški kruv i nasmije se.','sretne','kupi','nasmije'],
   ['Posli zajedno ručaju i pričaju o vikendu.','ručaju','pričaju','vikendu']],
  'fr-FR':[
   ['Leonor sort de chez elle le matin et va à la boulangerie à pied.','sort','va','boulangerie'],
   ['Elle retrouve Sofia, achète du pain frais et sourit.','retrouve','achète','sourit'],
   ['Plus tard, elles déjeunent ensemble et parlent du week-end.','déjeunent','parlent','week-end']],
  'it-IT':[
   ['Leonor esce di casa al mattino e va a piedi fino al panificio.','esce','va','panificio'],
   ['Incontra Sofia, compra del pane fresco e sorride.','incontra','compra','sorride'],
   ['Più tardi pranzano insieme e parlano del fine settimana.','pranzano','parlano','fine settimana']]},
 romance:{
  'en-GB':[['Mia enters a quiet café and notices someone reading by the window.','enters','notices','window'],['They start talking because they both love the same book.','start','talking','book'],['Before leaving, they exchange numbers and promise to meet again.','leaving','exchange','meet']],
  'pt-PT':[['A Mia entra num café sossegado e repara em alguém a ler junto à janela.','entra','repara','janela'],['Começam a falar porque os dois adoram o mesmo livro.','começam','falar','livro'],['Antes de sair, trocam números e prometem voltar a encontrar-se.','sair','trocam','encontrar']],
  'de-DE':[['Mia betritt ein ruhiges Café und bemerkt jemanden, der am Fenster liest.','betritt','bemerkt','Fenster'],['Sie beginnen zu reden, weil beide dasselbe Buch lieben.','beginnen','reden','Buch'],['Bevor sie gehen, tauschen sie Nummern aus und versprechen ein Wiedersehen.','gehen','tauschen','Wiedersehen']],
  'es-ES':[['Mia entra en una cafetería tranquila y ve a alguien leyendo junto a la ventana.','entra','ve','ventana'],['Empiezan a hablar porque a los dos les encanta el mismo libro.','empiezan','hablar','libro'],['Antes de irse, intercambian números y prometen volver a verse.','irse','intercambian','verse']],
  'es-AN':[['Mia entra en una cafetería tranquila y se fija en alguien leyendo junto a la ventana.','entra','fija','ventana'],['Se ponen a charlar porque a los dos les flipa el mismo libro.','ponen','charlar','libro'],['Antes de irse, se pasan los números y quedan para verse otra vez.','irse','pasan','verse']],
  'hr-HR':[['Mia ulazi u miran kafić i primjećuje nekoga tko čita kraj prozora.','ulazi','primjećuje','prozora'],['Počinju razgovarati jer oboje vole istu knjigu.','počinju','razgovarati','knjigu'],['Prije odlaska razmijene brojeve i obećaju da će se opet vidjeti.','odlaska','razmijene','vidjeti']],
  'hr-DAL':[['Mia ulazi u miran kafić i primijeti nekoga kako čita kraj ponistre.','ulazi','primijeti','ponistre'],['Počnu pričati jer oboje vole istu knjigu.','počnu','pričati','knjigu'],['Prije nego odu, razmijene brojeve i dogovore se opet vidit.','odu','razmijene','vidit']],
  'fr-FR':[['Mia entre dans un café calme et remarque quelqu’un qui lit près de la fenêtre.','entre','remarque','fenêtre'],['Ils commencent à parler parce qu’ils aiment le même livre.','commencent','parler','livre'],['Avant de partir, ils échangent leurs numéros et promettent de se revoir.','partir','échangent','revoir']],
  'it-IT':[['Mia entra in un caffè tranquillo e nota qualcuno che legge vicino alla finestra.','entra','nota','finestra'],['Cominciano a parlare perché amano entrambi lo stesso libro.','cominciano','parlare','libro'],['Prima di andare via, si scambiano i numeri e promettono di rivedersi.','andare','scambiano','rivedersi']]},
 travel:{
  'en-GB':[['Noah arrives at the station with a small suitcase and checks his ticket.','arrives','checks','ticket'],['He takes the train to a coastal town and watches the sea appear.','takes','watches','sea'],['At the hotel, he leaves his bag and goes out to explore.','leaves','goes','explore']],
  'pt-PT':[['O Noah chega à estação com uma mala pequena e verifica o bilhete.','chega','verifica','bilhete'],['Apanha o comboio para uma vila costeira e vê o mar aparecer.','apanha','vê','mar'],['No hotel, deixa a mala e sai para explorar.','deixa','sai','explorar']],
  'de-DE':[['Noah kommt mit einem kleinen Koffer am Bahnhof an und prüft sein Ticket.','kommt','prüft','Ticket'],['Er nimmt den Zug in eine Küstenstadt und sieht das Meer auftauchen.','nimmt','sieht','Meer'],['Im Hotel lässt er seine Tasche und geht die Umgebung erkunden.','lässt','geht','erkunden']],
  'es-ES':[['Noah llega a la estación con una maleta pequeña y revisa el billete.','llega','revisa','billete'],['Coge el tren hacia un pueblo costero y ve aparecer el mar.','coge','ve','mar'],['En el hotel deja la maleta y sale a explorar.','deja','sale','explorar']],
  'es-AN':[['Noah llega a la estación con una maleta pequeña y mira el billete.','llega','mira','billete'],['Pilla el tren para un pueblo de costa y ve aparecer el mar.','pilla','ve','mar'],['En el hotel deja la maleta y tira a explorar.','deja','tira','explorar']],
  'hr-HR':[['Noah stiže na kolodvor s malim kovčegom i provjerava kartu.','stiže','provjerava','kartu'],['Ulazi u vlak za obalni grad i gleda kako se pojavljuje more.','ulazi','gleda','more'],['U hotelu ostavlja torbu i izlazi istraživati.','ostavlja','izlazi','istraživati']],
  'hr-DAL':[['Noah stiže na kolodvor s malom valižom i provjeri kartu.','stiže','provjeri','kartu'],['Uđe u vlak za misto uz more i gleda kako se more pojavljuje.','uđe','gleda','more'],['U hotelu ostavi torbu i ide malo istražit.','ostavi','ide','istražit']],
  'fr-FR':[['Noah arrive à la gare avec une petite valise et vérifie son billet.','arrive','vérifie','billet'],['Il prend le train pour une ville côtière et regarde la mer apparaître.','prend','regarde','mer'],['À l’hôtel, il laisse son sac et sort explorer.','laisse','sort','explorer']],
  'it-IT':[['Noah arriva alla stazione con una piccola valigia e controlla il biglietto.','arriva','controlla','biglietto'],['Prende il treno per una città costiera e guarda il mare comparire.','prende','guarda','mare'],['In hotel lascia la borsa ed esce a esplorare.','lascia','esce','esplorare']]},
 horror:{
  'en-GB':[['After midnight, Eva hears a slow knock at the front door.','hears','knock','door'],['She opens the curtain, but the street is completely empty.','opens','street','empty'],['Then her phone rings, and a voice whispers her name.','rings','voice','name']],
  'pt-PT':[['Depois da meia-noite, a Eva ouve uma pancada lenta na porta de entrada.','ouve','pancada','porta'],['Abre a cortina, mas a rua está completamente vazia.','abre','rua','vazia'],['Depois, o telemóvel toca e uma voz sussurra o nome dela.','toca','voz','nome']],
  'de-DE':[['Nach Mitternacht hört Eva ein langsames Klopfen an der Haustür.','hört','Klopfen','Haustür'],['Sie öffnet den Vorhang, aber die Straße ist völlig leer.','öffnet','Straße','leer'],['Dann klingelt ihr Handy und eine Stimme flüstert ihren Namen.','klingelt','Stimme','Namen']],
  'es-ES':[['Después de medianoche, Eva oye unos golpes lentos en la puerta.','oye','golpes','puerta'],['Abre la cortina, pero la calle está completamente vacía.','abre','calle','vacía'],['Entonces suena su móvil y una voz susurra su nombre.','suena','voz','nombre']],
  'es-AN':[['Después de medianoche, Eva escucha unos golpes lentos en la puerta.','escucha','golpes','puerta'],['Abre la cortina, pero la calle está totalmente vacía.','abre','calle','vacía'],['Entonces suena el móvil y una voz le susurra el nombre.','suena','voz','nombre']],
  'hr-HR':[['Nakon ponoći Eva čuje sporo kucanje na ulaznim vratima.','čuje','kucanje','vratima'],['Otvara zavjesu, ali ulica je potpuno prazna.','otvara','ulica','prazna'],['Zatim zazvoni mobitel i glas šapne njezino ime.','zazvoni','glas','ime']],
  'hr-DAL':[['Posli ponoći Eva čuje sporo kucanje na ulaznim vratima.','čuje','kucanje','vratima'],['Otvori zavjesu, ali ulica je skroz prazna.','otvori','ulica','prazna'],['Onda zazvoni mobitel i neki glas šapne njezino ime.','zazvoni','glas','ime']],
  'fr-FR':[['Après minuit, Eva entend frapper lentement à la porte d’entrée.','entend','frapper','porte'],['Elle ouvre le rideau, mais la rue est complètement vide.','ouvre','rue','vide'],['Puis son portable sonne et une voix murmure son prénom.','sonne','voix','prénom']],
  'it-IT':[['Dopo mezzanotte, Eva sente bussare lentamente alla porta d’ingresso.','sente','bussare','porta'],['Apre la tenda, ma la strada è completamente vuota.','apre','strada','vuota'],['Poi il suo telefono squilla e una voce sussurra il suo nome.','squilla','voce','nome']]}
};

const FALLBACK='en-GB';
export function getMultilingualStory(id,learningLanguage,nativeLanguage){
 const meta=META[id]||META.everyday;
 const learning=TEXTS[id]?.[learningLanguage]||TEXTS[id]?.[FALLBACK]||[];
 const native=TEXTS[id]?.[nativeLanguage]||TEXTS[id]?.[FALLBACK]||[];
 return {...meta,id,pages:learning.map((row,index)=>({learning:row[0],native:native[index]?.[0]||'',items:[{answer:row[1],hint:native[index]?.[1]||row[1]},{answer:row[2],hint:native[index]?.[2]||row[2]},{answer:row[3],hint:native[index]?.[3]||row[3]}]}))};
}
