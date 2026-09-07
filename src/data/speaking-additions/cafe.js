const s=(en,de,pt,es,hr,fr)=>({en,de,pt,es,hr,fr});
const slots=[
  s('herbal tea','Kräutertee','chá de ervas','té de hierbas','biljni čaj','tisane'),
  s('iced coffee','Eiskaffee','café gelado','café con hielo','ledenu kavu','café glacé'),
  s('lemonade','Limonade','limonada','limonada','limunadu','limonade'),
  s('sparkling lemonade','sprudelnde Limonade','limonada com gás','limonada con gas','gaziranu limunadu','limonade pétillante'),
  s('a cheese pastry','ein Käsegebäck','um folhado de queijo','un pastel de queso','pecivo sa sirom','une pâtisserie au fromage'),
  s('yoghurt','Joghurt','iogurte','yogur','jogurt','yaourt'),
  s('a bowl of fruit','eine Schale Obst','uma taça de fruta','un bol de fruta','zdjelu voća','un bol de fruits'),
  s('avocado toast','Avocado-Toast','tosta de abacate','tostada de aguacate','tost s avokadom','toast à l’avocat'),
  s('the soup of the day','die Tagessuppe','a sopa do dia','la sopa del día','juhu dana','la soupe du jour'),
  s('a pasta dish','ein Nudelgericht','um prato de massa','un plato de pasta','jelo od tjestenine','un plat de pâtes'),
  s('a rice dish','ein Reisgericht','um prato de arroz','un plato de arroz','jelo od riže','un plat de riz'),
  s('grilled vegetables','gegrilltes Gemüse','legumes grelhados','verduras a la parrilla','grilano povrće','légumes grillés'),
  s('a vegan cake','einen veganen Kuchen','um bolo vegano','un pastel vegano','veganski kolač','un gâteau végan'),
  s('a gluten-free option','eine glutenfreie Option','uma opção sem glúten','una opción sin gluten','bezglutensku opciju','une option sans gluten'),
  s('tap water','Leitungswasser','água da torneira','agua del grifo','vodu iz slavine','eau du robinet'),
  s('an extra napkin','eine zusätzliche Serviette','um guardanapo extra','una servilleta extra','dodatnu salvetu','une serviette en plus'),
  s('a takeaway cup','einen Becher zum Mitnehmen','um copo para levar','un vaso para llevar','čašu za van','un gobelet à emporter'),
  s('a table by the window','einen Tisch am Fenster','uma mesa junto à janela','una mesa junto a la ventana','stol kraj prozora','une table près de la fenêtre'),
  s('a quiet table','einen ruhigen Tisch','uma mesa tranquila','una mesa tranquila','miran stol','une table au calme'),
  s('a menu in English','eine Speisekarte auf Englisch','um menu em inglês','un menú en inglés','jelovnik na engleskom','un menu en anglais')
];
const q=s('Would you choose {x} at a café?','Würdest du im Café {x} wählen?','Escolherias {x} num café?','¿Elegirías {x} en una cafetería?','Bi li u kafiću odabrao {x}?','Choisirais-tu {x} dans un café ?');
const a=s('Yes, I would choose that today.','Ja, das würde ich heute wählen.','Sim, escolheria isso hoje.','Sí, elegiría eso hoy.','Da, danas bih to odabrao.','Oui, je choisirais ça aujourd’hui.');
const fill=(t,x)=>t.replace('{x}',x);
export function getCafeAdditions(learning,native){return slots.map(slot=>({intent:'extra-cafe',signals:Object.values(slot),question:fill(q[learning]||q.en,slot[learning]||slot.en),translation:fill(q[native]||q.en,slot[native]||slot.en),example:a[learning]||a.en,exampleTranslation:a[native]||a.en}));}
