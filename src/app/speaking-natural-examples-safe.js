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
  ['Reci mi nešto o svom rodnom gradu.',e('U mom rodnom gradu imam puno lijepih uspomena.','I have many good memories from my home town.','Mit meiner Heimatstadt verbinde ich viele schöne Erinnerungen.','Tenho muitas boas memórias da minha cidade natal.','Tengo muchos buenos recuerdos de mi ciudad natal.','J’ai beaucoup de bons souvenirs de ma ville natale.')],
  ['Reci mi nešto o svom rođendanu.',e('Rođendan obično slavim s ljudima koje volim.','I usually celebrate my birthday with people I love.','Meinen Geburtstag feiere ich normalerweise mit Menschen, die ich liebe.','Normalmente celebro o meu aniversário com pessoas de quem gosto.','Normalmente celebro mi cumpleaños con la gente que quiero.','Je fête généralement mon anniversaire avec les gens que j’aime.')],
  ['Reci mi nešto o svom vikendu.',e('Vikendom volim dugo doručkovati i otići u šetnju.','At weekends I like having a long breakfast and going for a walk.','Am Wochenende frühstücke ich gern ausgiebig und gehe spazieren.','Ao fim de semana gosto de tomar um pequeno-almoço demorado e passear.','Los fines de semana me gusta desayunar sin prisa y salir a caminar.','Le week-end, j’aime prendre un long petit-déjeuner et aller me promener.')],
  ['Reci mi nešto o svojoj omiljenoj hrani.',e('Najviše volim svježu hranu punu okusa.','I like fresh food with lots of flavour most.','Am liebsten mag ich frisches Essen mit viel Geschmack.','Gosto mais de comida fresca e cheia de sabor.','Lo que más me gusta es la comida fresca y con mucho sabor.','J’aime surtout les plats frais et pleins de saveur.')],
  ['Reci mi nešto o svom posljednjem odmoru.',e('Na posljednjem odmoru puno sam hodao i istraživao nova mjesta.','On my last holiday I walked a lot and explored new places.','In meinem letzten Urlaub bin ich viel gelaufen und habe neue Orte entdeckt.','Nas últimas férias caminhei muito e explorei lugares novos.','En mis últimas vacaciones caminé mucho y descubrí lugares nuevos.','Pendant mes dernières vacances, j’ai beaucoup marché et découvert de nouveaux endroits.')],
  ['Reci mi nešto o svojoj jutarnjoj rutini.',e('Ujutro prvo popijem vodu i polako se razbudim.','In the morning I first drink some water and wake up slowly.','Morgens trinke ich zuerst Wasser und werde langsam wach.','De manhã bebo primeiro água e acordo devagar.','Por la mañana primero bebo agua y me despierto poco a poco.','Le matin, je bois d’abord de l’eau et je me réveille doucement.')],
  ['Reci mi nešto o svom omiljenom godišnjem dobu.',e('Najviše volim proljeće jer su dani topliji.','I like spring most because the days are warmer.','Am liebsten mag ich den Frühling, weil die Tage wärmer sind.','Gosto mais da primavera porque os dias são mais quentes.','Mi estación favorita es la primavera porque los días son más cálidos.','Je préfère le printemps parce que les journées sont plus chaudes.')]
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
  const native=FAMILY_BY_CODE[state.nativeLanguage]||'en';
  const learningText=example.hr;
  const translationText=example[native]||example.en;
  if(learning&&learning.textContent!==learningText)learning.textContent=learningText;
  if(translation&&translation.textContent!==translationText)translation.textContent=translationText;
}

apply();
const timer=window.setInterval(apply,180);
window.addEventListener('pagehide',()=>window.clearInterval(timer),{once:true});
