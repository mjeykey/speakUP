const s=(en,de,pt,es,hr,fr)=>({en,de,pt,es,hr,fr});
const slots=[
  s('your siblings','deine Geschwister','os teus irmãos','tus hermanos','svojoj braći i sestrama','tes frères et sœurs'),
  s('your favourite sport','deinen Lieblingssport','o teu desporto preferido','tu deporte favorito','svom omiljenom sportu','ton sport préféré'),
  s('your favourite animal','dein Lieblingstier','o teu animal preferido','tu animal favorito','svojoj omiljenoj životinji','ton animal préféré'),
  s('a school memory','eine Erinnerung aus der Schule','uma memória da escola','un recuerdo de la escuela','jednoj uspomeni iz škole','un souvenir d’école'),
  s('your first job','deinen ersten Job','o teu primeiro emprego','tu primer trabajo','svom prvom poslu','ton premier travail'),
  s('your weekend breakfast','dein Wochenendfrühstück','o teu pequeno-almoço de fim de semana','tu desayuno de fin de semana','svom vikend-doručku','ton petit-déjeuner du week-end'),
  s('a city you want to visit','eine Stadt, die du besuchen möchtest','uma cidade que queres visitar','una ciudad que quieres visitar','gradu koji želiš posjetiti','une ville que tu veux visiter'),
  s('your comfort food','dein Wohlfühlessen','a tua comida de conforto','tu comida reconfortante','hrani koja te tješi','ton plat réconfortant'),
  s('your favourite smell','deinen Lieblingsduft','o teu cheiro preferido','tu olor favorito','svom omiljenom mirisu','ton odeur préférée'),
  s('a talent you have','ein Talent, das du hast','um talento que tens','un talento que tienes','talentu koji imaš','un talent que tu as'),
  s('a habit you want to keep','eine Gewohnheit, die du behalten möchtest','um hábito que queres manter','un hábito que quieres mantener','navici koju želiš zadržati','une habitude que tu veux garder'),
  s('someone who taught you something important','jemanden, der dir etwas Wichtiges beigebracht hat','alguém que te ensinou algo importante','alguien que te enseñó algo importante','osobi koja te naučila nečemu važnom','quelqu’un qui t’a appris quelque chose d’important'),
  s('a challenge you are proud of','eine Herausforderung, auf die du stolz bist','um desafio de que te orgulhas','un reto del que te sientes orgulloso','izazovu na koji si ponosan','un défi dont tu es fier'),
  s('your favourite celebration','dein Lieblingsfest','a tua celebração preferida','tu celebración favorita','svom omiljenom slavlju','ta fête préférée'),
  s('your dream home','dein Traumzuhause','a tua casa de sonho','la casa de tus sueños','svom domu iz snova','la maison de tes rêves'),
  s('your favourite app','deine Lieblings-App','a tua aplicação preferida','tu aplicación favorita','svojoj omiljenoj aplikaciji','ton application préférée'),
  s('your favourite kind of weather','dein Lieblingswetter','o teu tempo preferido','tu tipo de clima favorito','svom omiljenom vremenu','ton type de météo préféré'),
  s('an object that means a lot to you','einen Gegenstand, der dir viel bedeutet','um objeto que significa muito para ti','un objeto que significa mucho para ti','predmetu koji ti puno znači','un objet qui compte beaucoup pour toi'),
  s('what helps you relax','was dir beim Entspannen hilft','o que te ajuda a relaxar','lo que te ayuda a relajarte','onome što ti pomaže da se opustiš','ce qui t’aide à te détendre'),
  s('a family tradition','eine Familientradition','uma tradição familiar','una tradición familiar','obiteljskoj tradiciji','une tradition familiale')
];
const q=s('Tell me about {x}.','Erzähl mir etwas über {x}.','Fala-me sobre {x}.','Háblame de {x}.','Reci mi nešto o {x}.','Parle-moi de {x}.');
const a=s('It is an interesting part of my life.','Das ist ein interessanter Teil meines Lebens.','É uma parte interessante da minha vida.','Es una parte interesante de mi vida.','To je zanimljiv dio mog života.','C’est une partie intéressante de ma vie.');
const fill=(t,x)=>t.replace('{x}',x);
export function getMeetAdditions(learning,native){return slots.map(slot=>({intent:'extra-meet',signals:Object.values(slot),question:fill(q[learning]||q.en,slot[learning]||slot.en),translation:fill(q[native]||q.en,slot[native]||slot.en),example:a[learning]||a.en,exampleTranslation:a[native]||a.en}));}
