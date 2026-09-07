const s=(en,de,pt,es,hr,fr)=>({en,de,pt,es,hr,fr});
const slots=[
  s('an umbrella','einen Regenschirm','um guarda-chuva','un paraguas','kišobran','un parapluie'),
  s('a backpack','einen Rucksack','uma mochila','una mochila','ruksak','un sac à dos'),
  s('headphones','Kopfhörer','auscultadores','auriculares','slušalice','des écouteurs'),
  s('a notebook','ein Notizbuch','um caderno','un cuaderno','bilježnicu','un carnet'),
  s('sunscreen','Sonnencreme','protetor solar','protector solar','kremu za sunčanje','de la crème solaire'),
  s('a reusable water bottle','eine wiederverwendbare Wasserflasche','uma garrafa de água reutilizável','una botella de agua reutilizable','višekratnu bocu za vodu','une gourde réutilisable'),
  s('warm socks','warme Socken','meias quentes','calcetines calientes','tople čarape','des chaussettes chaudes'),
  s('a scarf','einen Schal','um cachecol','una bufanda','šal','une écharpe'),
  s('sunglasses','eine Sonnenbrille','óculos de sol','gafas de sol','sunčane naočale','des lunettes de soleil'),
  s('shampoo','Shampoo','champô','champú','šampon','du shampoing'),
  s('a toothbrush','eine Zahnbürste','uma escova de dentes','un cepillo de dientes','četkicu za zube','une brosse à dents'),
  s('fresh fruit','frisches Obst','fruta fresca','fruta fresca','svježe voće','des fruits frais'),
  s('fresh bread','frisches Brot','pão fresco','pan fresco','svježi kruh','du pain frais'),
  s('coffee beans','Kaffeebohnen','grãos de café','granos de café','zrna kave','des grains de café'),
  s('batteries','Batterien','pilhas','pilas','baterije','des piles'),
  s('a gift card','einen Geschenkgutschein','um cartão-presente','una tarjeta regalo','poklon-bon','une carte cadeau'),
  s('a charging cable','ein Ladekabel','um cabo de carregamento','un cable de carga','kabel za punjenje','un câble de recharge'),
  s('a winter coat','einen Wintermantel','um casaco de inverno','un abrigo de invierno','zimski kaput','un manteau d’hiver'),
  s('a swimsuit','einen Badeanzug','um fato de banho','un traje de baño','kupaći kostim','un maillot de bain'),
  s('a frying pan','eine Bratpfanne','uma frigideira','una sartén','tavu','une poêle')
];
const q=s('Would you buy {x} if you needed it?','Würdest du {x} kaufen, wenn du es brauchst?','Comprarias {x} se precisasses?','¿Comprarías {x} si lo necesitaras?','Bi li kupio {x} ako ti zatreba?','Achèterais-tu {x} si tu en avais besoin ?');
const a=s('Yes, I would compare the options first.','Ja, ich würde zuerst die Möglichkeiten vergleichen.','Sim, primeiro compararia as opções.','Sí, primero compararía las opciones.','Da, prvo bih usporedio mogućnosti.','Oui, je comparerais d’abord les options.');
const fill=(t,x)=>t.replace('{x}',x);
export function getShoppingAdditions(learning,native){return slots.map(slot=>({intent:'extra-shopping',signals:Object.values(slot),question:fill(q[learning]||q.en,slot[learning]||slot.en),translation:fill(q[native]||q.en,slot[native]||slot.en),example:a[learning]||a.en,exampleTranslation:a[native]||a.en}));}
