const s=(en,de,pt,es,hr,fr)=>({en,de,pt,es,hr,fr});
const slots=[
  s('library','Bibliothek','biblioteca','biblioteca','knjižnice','bibliothèque'),
  s('police station','Polizeistation','esquadra de polícia','comisaría de policía','policijske postaje','commissariat de police'),
  s('post office','Post','correios','oficina de correos','pošte','bureau de poste'),
  s('market','Markt','mercado','mercado','tržnice','marché'),
  s('bank','Bank','banco','banco','banke','banque'),
  s('ATM','Geldautomaten','multibanco','cajero automático','bankomata','distributeur automatique'),
  s('university','Universität','universidade','universidad','sveučilišta','université'),
  s('cinema','Kino','cinema','cine','kina','cinéma'),
  s('theatre','Theater','teatro','teatro','kazališta','théâtre'),
  s('stadium','Stadion','estádio','estadio','stadiona','stade'),
  s('ferry terminal','Fährterminal','terminal de ferry','terminal de ferry','trajektnog terminala','terminal de ferry'),
  s('metro station','U-Bahn-Station','estação de metro','estación de metro','stanice metroa','station de métro'),
  s('taxi rank','Taxistand','praça de táxis','parada de taxis','stajališta za taksi','station de taxis'),
  s('old town','Altstadt','centro histórico','casco antiguo','starog grada','vieille ville'),
  s('viewpoint','Aussichtspunkt','miradouro','mirador','vidikovca','belvédère'),
  s('public toilet','öffentliche Toilette','casa de banho pública','baño público','javnog toaleta','toilettes publiques'),
  s('tourist office','Touristeninformation','posto de turismo','oficina de turismo','turističkog ureda','office de tourisme'),
  s('parking garage','Parkhaus','parque de estacionamento','aparcamiento','garaže','parking'),
  s('castle','Schloss','castelo','castillo','dvorca','château'),
  s('church','Kirche','igreja','iglesia','crkve','église')
];
const q=s('How would you ask for the way to the {x}?','Wie würdest du nach dem Weg zur/zum {x} fragen?','Como perguntarias o caminho para {x}?','¿Cómo preguntarías el camino a {x}?','Kako bi pitao za put do {x}?','Comment demanderais-tu le chemin vers {x} ?');
const a=s('I would politely ask someone nearby for directions.','Ich würde höflich jemanden in der Nähe nach dem Weg fragen.','Perguntaria educadamente a alguém próximo pelo caminho.','Preguntaría educadamente a alguien cercano por el camino.','Ljubazno bih pitao nekoga u blizini za smjer.','Je demanderais poliment le chemin à quelqu’un près de moi.');
const fill=(t,x)=>t.replace('{x}',x);
export function getDirectionsAdditions(learning,native){return slots.map(slot=>({intent:'extra-directions',signals:Object.values(slot),question:fill(q[learning]||q.en,slot[learning]||slot.en),translation:fill(q[native]||q.en,slot[native]||slot.en),example:a[learning]||a.en,exampleTranslation:a[native]||a.en}));}
