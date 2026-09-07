const s=(en,de,pt,es,hr,fr)=>({en,de,pt,es,hr,fr});
const slots=[
  s('someone cancels plans','jemand Pläne absagt','alguém cancela planos','alguien cancela planes','netko otkaže planove','quelqu’un annule des projets'),
  s('you win something','du etwas gewinnst','ganhas alguma coisa','ganas algo','nešto osvojiš','tu gagnes quelque chose'),
  s('you lose something important','du etwas Wichtiges verlierst','perdes algo importante','pierdes algo importante','izgubiš nešto važno','tu perds quelque chose d’important'),
  s('someone gives you a compliment','dir jemand ein Kompliment macht','alguém te faz um elogio','alguien te hace un cumplido','ti netko udijeli kompliment','quelqu’un te fait un compliment'),
  s('someone criticises you','dich jemand kritisiert','alguém te critica','alguien te critica','te netko kritizira','quelqu’un te critique'),
  s('you have to wait a long time','du lange warten musst','tens de esperar muito tempo','tienes que esperar mucho tiempo','moraš dugo čekati','tu dois attendre longtemps'),
  s('you are in a crowded place','du an einem überfüllten Ort bist','estás num lugar cheio de gente','estás en un lugar lleno de gente','si na prepunom mjestu','tu es dans un endroit bondé'),
  s('you spend time alone','du Zeit allein verbringst','passas tempo sozinho','pasas tiempo a solas','provodiš vrijeme sam','tu passes du temps seul'),
  s('you hear your favourite song','du dein Lieblingslied hörst','ouves a tua música preferida','escuchas tu canción favorita','čuješ svoju omiljenu pjesmu','tu entends ta chanson préférée'),
  s('you sleep very well','du sehr gut schläfst','dormes muito bem','duermes muy bien','jako dobro spavaš','tu dors très bien'),
  s('you have an argument','du einen Streit hast','tens uma discussão','tienes una discusión','se posvađaš','tu te disputes'),
  s('it rains all day','es den ganzen Tag regnet','chove o dia inteiro','llueve todo el día','cijeli dan pada kiša','il pleut toute la journée'),
  s('the sun comes out','die Sonne herauskommt','o sol aparece','sale el sol','izađe sunce','le soleil apparaît'),
  s('you miss someone','du jemanden vermisst','tens saudades de alguém','echas de menos a alguien','ti netko nedostaje','quelqu’un te manque'),
  s('you help a stranger','du einem Fremden hilfst','ajudas um desconhecido','ayudas a un desconocido','pomogneš nepoznatoj osobi','tu aides un inconnu'),
  s('you get a surprise','du überrascht wirst','recebes uma surpresa','recibes una sorpresa','dobiješ iznenađenje','tu reçois une surprise'),
  s('you finish a trip','du eine Reise beendest','terminas uma viagem','terminas un viaje','završiš putovanje','tu termines un voyage'),
  s('you hear bad news','du schlechte Nachrichten hörst','ouves más notícias','escuchas malas noticias','čuješ loše vijesti','tu apprends une mauvaise nouvelle'),
  s('you have a completely free day','du einen völlig freien Tag hast','tens um dia completamente livre','tienes un día completamente libre','imaš potpuno slobodan dan','tu as une journée complètement libre'),
  s('you make a difficult decision','du eine schwierige Entscheidung triffst','tomas uma decisão difícil','tomas una decisión difícil','doneseš tešku odluku','tu prends une décision difficile')
];
const q=s('How do you feel when {x}?','Wie fühlst du dich, wenn {x}?','Como te sentes quando {x}?','¿Cómo te sientes cuando {x}?','Kako se osjećaš kada {x}?','Comment te sens-tu quand {x} ?');
const a=s('I try to notice my first reaction and name the feeling.','Ich versuche, meine erste Reaktion wahrzunehmen und das Gefühl zu benennen.','Tento perceber a minha primeira reação e dar um nome ao sentimento.','Intento notar mi primera reacción y poner nombre al sentimiento.','Pokušavam primijetiti svoju prvu reakciju i imenovati osjećaj.','J’essaie de remarquer ma première réaction et de nommer l’émotion.');
const fill=(t,x)=>t.replace('{x}',x);
export function getFeelingsAdditions(learning,native){return slots.map(slot=>({intent:'extra-feelings',signals:Object.values(slot),question:fill(q[learning]||q.en,slot[learning]||slot.en),translation:fill(q[native]||q.en,slot[native]||slot.en),example:a[learning]||a.en,exampleTranslation:a[native]||a.en}));}
