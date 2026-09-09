const FAMILY_BY_CODE={
  'de-DE':'de','pt-PT':'pt','en-GB':'en','es-ES':'es','es-AN':'es','hr-HR':'hr','hr-DAL':'hr','fr-FR':'fr'
};

const e=(hr,en,de,pt,es,fr)=>({hr,en,de,pt,es,fr});

const EXAMPLES=new Map([
  ['Reci mi nešto o svojoj obitelji.',e('Moja obitelj živi blizu mene.','My family lives near me.','Meine Familie wohnt in meiner Nähe.','A minha família vive perto de mim.','Mi familia vive cerca de mí.','Ma famille habite près de chez moi.')],
  ['Reci mi nešto o svom najboljem prijatelju ili prijateljici.',e('Moj najbolji prijatelj uvijek me nasmije.','My best friend always makes me laugh.','Mein bester Freund bringt mich immer zum Lachen.','O meu melhor amigo faz-me sempre rir.','Mi mejor amigo siempre me hace reír.','Mon meilleur ami me fait toujours rire.')],
  ['Reci mi nešto o svojim hobijima.',e('Moji hobiji su crtanje i vježbanje.','My hobbies are drawing and exercising.','Meine Hobbys sind Zeichnen und Sport.','Os meus passatempos são desenhar e fazer exercício.','Mis aficiones son dibujar y hacer ejercicio.','Mes loisirs sont le dessin et le sport.')],
  ['Reci mi nešto o svojoj omiljenoj glazbi.',e('Najviše volim slušati pop i soul.','I like listening to pop and soul most.','Am liebsten höre ich Pop und Soul.','Gosto mais de ouvir pop e soul.','Lo que más me gusta escuchar es pop y soul.','J’aime surtout écouter de la pop et de la soul.')],
  ['Reci mi nešto o svom omiljenom filmu.',e('Moj omiljeni film je Interstellar.','My favourite film is Interstellar.','Mein Lieblingsfilm ist Interstellar.','O meu filme preferido é Interstellar.','Mi película favorita es Interstellar.','Mon film préféré est Interstellar.')],
  ['Reci mi nešto o svojoj omiljenoj knjizi.',e('Najviše volim knjige koje me potpuno uvuku u priču.','I like books that completely pull me into the story.','Ich mag Bücher, die mich völlig in die Geschichte hineinziehen.','Gosto de livros que me prendem completamente à história.','Me gustan los libros que me meten por completo en la historia.','J’aime les livres qui m’absorbent complètement dans l’histoire.')],
  ['Reci mi nešto o svojim kućnim ljubimcima.',e('Imam mačku koja je vrlo znatiželjna.','I have a cat that is very curious.','Ich habe eine Katze, die sehr neugierig ist.','Tenho uma gata que é muito curiosa.','Tengo una gata que es muy curiosa.','J’ai une chatte qui est très curieuse.')],
  ['Reci mi nešto o jezicima koje govoriš.',e('Govorim dva jezika i učim još jedan.','I speak two languages and I am learning another one.','Ich spreche zwei Sprachen und lerne noch eine.','Falo duas línguas e estou a aprender outra.','Hablo dos idiomas y estoy aprendiendo otro.','Je parle deux langues et j’en apprends une autre.')],
  ['Reci mi nešto o svom rodnom gradu.',e('Moj rodni grad ima mjesta kojih se rado sjećam.','My home town has places I remember fondly.','In meiner Heimatstadt gibt es Orte, an die ich mich gern erinnere.','A minha cidade natal tem lugares de que me lembro com carinho.','Mi ciudad natal tiene lugares que recuerdo con cariño.','Ma ville natale a des endroits dont je garde de bons souvenirs.')],
  ['Reci mi nešto o svom rođendanu.',e('Rođendan obično slavim s ljudima koje volim.','I usually celebrate my birthday with people I love.','Meinen Geburtstag feiere ich normalerweise mit Menschen, die ich liebe.','Normalmente celebro o meu aniversário com pessoas de quem gosto.','Normalmente celebro mi cumpleaños con la gente que quiero.','Je fête généralement mon anniversaire avec les gens que j’aime.')],
  ['Reci mi nešto o svom vikendu.',e('Vikendom volim dugo doručkovati i otići u šetnju.','At weekends I like having a long breakfast and going for a walk.','Am Wochenende frühstücke ich gern ausgiebig und gehe spazieren.','Ao fim de semana gosto de tomar um pequeno-almoço demorado e passear.','Los fines de semana me gusta desayunar sin prisa y salir a caminar.','Le week-end, j’aime prendre un long petit-déjeuner et aller me promener.')],
  ['Reci mi nešto o nečemu na što si ponosan.',e('Ponosim se svojim napretkom.','I am proud of my progress.','Ich bin stolz auf meine Fortschritte.','Tenho orgulho no meu progresso.','Estoy orgulloso de mi progreso.','Je suis fier de mes progrès.')],
  ['Reci mi nešto o svom poslu iz snova.',e('Moj posao iz snova daje mi slobodu i zanimljive izazove.','My dream job gives me freedom and interesting challenges.','Mein Traumjob gibt mir Freiheit und interessante Herausforderungen.','O meu emprego de sonho dá-me liberdade e desafios interessantes.','Mi trabajo ideal me da libertad y retos interesantes.','Mon métier de rêve me donne de la liberté et des défis intéressants.')],
  ['Reci mi nešto o svojoj omiljenoj hrani.',e('Najviše volim svježu hranu punu okusa.','I like fresh food with lots of flavour most.','Am liebsten mag ich frisches Essen mit viel Geschmack.','Gosto mais de comida fresca e cheia de sabor.','Lo que más me gusta es la comida fresca y con mucho sabor.','J’aime surtout les plats frais et pleins de saveur.')],
  ['Reci mi nešto o svom posljednjem odmoru.',e('Na posljednjem odmoru puno sam hodao i istraživao nova mjesta.','On my last holiday I walked a lot and explored new places.','In meinem letzten Urlaub bin ich viel gelaufen und habe neue Orte entdeckt.','Nas últimas férias caminhei muito e explorei lugares novos.','En mis últimas vacaciones caminé mucho y descubrí lugares nuevos.','Pendant mes dernières vacances, j’ai beaucoup marché et découvert de nouveaux endroits.')],
  ['Reci mi nešto o svojoj jutarnjoj rutini.',e('Ujutro prvo popijem vodu i polako se razbudim.','In the morning I first drink some water and wake up slowly.','Morgens trinke ich zuerst Wasser und werde langsam wach.','De manhã bebo primeiro água e acordo devagar.','Por la mañana primero bebo agua y me despierto poco a poco.','Le matin, je bois d’abord de l’eau et je me réveille doucement.')],
  ['Reci mi nešto o svom omiljenom godišnjem dobu.',e('Najviše volim proljeće jer su dani topliji.','I like spring most because the days are warmer.','Am liebsten mag ich den Frühling, weil die Tage wärmer sind.','Gosto mais da primavera porque os dias são mais quentes.','Mi estación favorita es la primavera porque los días son más cálidos.','Je préfère le printemps parce que les journées sont plus chaudes.')],
  ['Reci mi nešto o svom djetinjstvu.',e('Iz djetinjstva se najviše sjećam igre s prijateljima.','What I remember most from childhood is playing with friends.','Aus meiner Kindheit erinnere ich mich besonders ans Spielen mit Freunden.','Da infância lembro-me sobretudo de brincar com amigos.','De mi infancia recuerdo sobre todo jugar con amigos.','De mon enfance, je me souviens surtout des jeux avec mes amis.')],
  ['Reci mi nešto o svom susjedstvu.',e('U mom susjedstvu ima nekoliko lijepih mjesta za šetnju.','There are several nice places to walk in my neighbourhood.','In meinem Viertel gibt es einige schöne Orte zum Spazierengehen.','No meu bairro há vários lugares agradáveis para passear.','En mi barrio hay varios sitios bonitos para pasear.','Dans mon quartier, il y a plusieurs endroits agréables pour se promener.')],
  ['Reci mi nešto o svojim planovima putovanja.',e('Volio bih uskoro posjetiti grad u kojem još nisam bio.','I would like to visit a city I have never been to soon.','Ich würde bald gern eine Stadt besuchen, in der ich noch nie war.','Gostava de visitar em breve uma cidade onde ainda nunca estive.','Me gustaría visitar pronto una ciudad en la que nunca he estado.','J’aimerais bientôt visiter une ville où je ne suis encore jamais allé.')],
  ['Reci mi nešto o svom omiljenom mjestu.',e('Moje omiljeno mjesto je negdje gdje mogu biti blizu mora.','My favourite place is somewhere I can be close to the sea.','Mein Lieblingsort ist irgendwo, wo ich nah am Meer sein kann.','O meu lugar preferido é um sítio onde posso estar perto do mar.','Mi lugar favorito es un sitio donde puedo estar cerca del mar.','Mon endroit préféré est un lieu où je peux être près de la mer.')],
  ['Reci mi nešto o svom svakodnevnom životu.',e('Moj dan obično uključuje posao, kretanje i malo vremena za sebe.','My day usually includes work, movement and a little time for myself.','Mein Alltag besteht meist aus Arbeit, Bewegung und etwas Zeit für mich.','O meu dia costuma incluir trabalho, movimento e algum tempo para mim.','Mi día suele incluir trabajo, movimiento y un poco de tiempo para mí.','Ma journée comprend généralement du travail, du mouvement et un peu de temps pour moi.')],
  ['Reci mi nešto o osobi kojoj se diviš.',e('Divim se ljudima koji ostanu mirni i hrabri u teškim trenucima.','I admire people who stay calm and brave in difficult moments.','Ich bewundere Menschen, die in schwierigen Momenten ruhig und mutig bleiben.','Admiro pessoas que mantêm a calma e a coragem em momentos difíceis.','Admiro a las personas que mantienen la calma y el valor en momentos difíciles.','J’admire les personnes qui restent calmes et courageuses dans les moments difficiles.')],
  ['Reci mi nešto o nečemu što te nasmijava.',e('Najviše me nasmijavaju spontane i neočekivane stvari.','Spontaneous and unexpected things make me laugh most.','Spontane und unerwartete Dinge bringen mich am meisten zum Lachen.','As coisas espontâneas e inesperadas fazem-me rir mais.','Las cosas espontáneas e inesperadas son las que más me hacen reír.','Ce sont les choses spontanées et inattendues qui me font le plus rire.')],
  ['Reci mi nešto o vještini koju želiš naučiti.',e('Volio bih naučiti nešto što mogu koristiti u stvarnom životu.','I would like to learn something I can use in real life.','Ich würde gern etwas lernen, das ich im echten Leben nutzen kann.','Gostava de aprender algo que possa usar na vida real.','Me gustaría aprender algo que pueda usar en la vida real.','J’aimerais apprendre quelque chose que je peux utiliser dans la vie réelle.')],
  ['Reci mi nešto o svom savršenom danu.',e('Moj savršen dan počinje bez žurbe i završava dobrim razgovorom.','My perfect day starts without rushing and ends with a good conversation.','Mein perfekter Tag beginnt ohne Hektik und endet mit einem guten Gespräch.','O meu dia perfeito começa sem pressa e termina com uma boa conversa.','Mi día perfecto empieza sin prisas y termina con una buena conversación.','Ma journée parfaite commence sans stress et se termine par une bonne conversation.')],
  ['Reci mi nešto o svojim budućim ciljevima.',e('Želim nastaviti učiti i napraviti nekoliko velikih promjena.','I want to keep learning and make a few big changes.','Ich möchte weiterlernen und ein paar große Veränderungen machen.','Quero continuar a aprender e fazer algumas mudanças importantes.','Quiero seguir aprendiendo y hacer algunos cambios grandes.','Je veux continuer à apprendre et faire quelques grands changements.')]
]);

const getState=()=>{
  try{return JSON.parse(localStorage.getItem('speakup-progress-v1')||'{}');}catch{return {};}
};

function apply(){
  const state=getState();
  if(!String(state.learningLanguage||'').toLowerCase().startsWith('hr'))return;
  const question=document.querySelector('.free-speak-question')?.textContent?.trim();
  if(!question)return;
  const example=EXAMPLES.get(question);
  if(!example)return;
  const card=document.querySelector('.free-speak-example-card');
  if(!card)return;
  const learning=card.querySelector('.free-speak-example');
  const translation=card.querySelector('.speak-translation');
  if(learning)learning.textContent=example.hr;
  const native=FAMILY_BY_CODE[state.nativeLanguage]||'en';
  if(translation)translation.textContent=example[native]||example.en;
}

const observer=new MutationObserver(()=>apply());
const app=document.getElementById('app');
if(app){observer.observe(app,{subtree:true,childList:true});apply();}
