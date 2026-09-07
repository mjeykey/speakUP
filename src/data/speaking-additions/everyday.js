const s=(en,de,pt,es,hr,fr)=>({en,de,pt,es,hr,fr});
const slots=[
  s('taking a shower','Duschen','tomar banho','ducharte','tuširanje','douche'),
  s('brushing your teeth','Zähneputzen','lavar os dentes','cepillarte los dientes','pranje zubi','brossage des dents'),
  s('making the bed','Bettmachen','fazer a cama','hacer la cama','namještanje kreveta','faire le lit'),
  s('commuting to work','den Arbeitsweg','ir para o trabalho','ir al trabajo','putovanje na posao','trajet vers le travail'),
  s('checking email','E-Mails prüfen','ver o e-mail','revisar el correo','provjeravanje e-pošte','consultation des e-mails'),
  s('cooking dinner','Abendessen kochen','cozinhar o jantar','cocinar la cena','kuhanje večere','préparation du dîner'),
  s('washing dishes','Geschirrspülen','lavar a loiça','lavar los platos','pranje posuđa','vaisselle'),
  s('taking out the rubbish','den Müll rausbringen','levar o lixo','sacar la basura','iznošenje smeća','sortir les poubelles'),
  s('vacuuming','Staubsaugen','aspirar a casa','pasar la aspiradora','usisavanje','passer l’aspirateur'),
  s('stretching','Dehnen','alongar','estirar','istezanje','étirements'),
  s('charging your phone','dein Handy laden','carregar o telemóvel','cargar el móvil','punjenje mobitela','recharger ton téléphone'),
  s('packing your bag','deine Tasche packen','preparar a mala','preparar tu bolso','pakiranje torbe','préparer ton sac'),
  s('choosing clothes for tomorrow','Kleidung für morgen auswählen','escolher a roupa para amanhã','elegir la ropa para mañana','biranje odjeće za sutra','choisir les vêtements pour demain'),
  s('opening the windows','die Fenster öffnen','abrir as janelas','abrir las ventanas','otvaranje prozora','ouvrir les fenêtres'),
  s('making tea','Tee machen','fazer chá','hacer té','pripremu čaja','préparer du thé'),
  s('locking the door','die Tür abschließen','trancar a porta','cerrar la puerta con llave','zaključavanje vrata','fermer la porte à clé'),
  s('calling a friend','einen Freund anrufen','telefonar a um amigo','llamar a un amigo','poziv prijatelju','appeler un ami'),
  s('studying for half an hour','eine halbe Stunde lernen','estudar meia hora','estudiar media hora','učenje pola sata','étudier pendant une demi-heure'),
  s('writing in a journal','in ein Tagebuch schreiben','escrever num diário','escribir en un diario','pisanje dnevnika','écrire dans un journal'),
  s('preparing for the next morning','den nächsten Morgen vorbereiten','preparar a manhã seguinte','preparar la mañana siguiente','pripremu za sljedeće jutro','préparer le lendemain matin')
];
const q=s('When do you usually make time for {x}?','Wann nimmst du dir normalerweise Zeit für {x}?','Quando costumas reservar tempo para {x}?','¿Cuándo sueles dedicar tiempo a {x}?','Kada obično odvojiš vrijeme za {x}?','Quand prends-tu généralement du temps pour {x} ?');
const a=s('I usually fit it into my normal daily routine.','Normalerweise baue ich es in meinen Alltag ein.','Normalmente encaixo isso na minha rotina diária.','Normalmente lo incluyo en mi rutina diaria.','Obično to uklopim u svoju dnevnu rutinu.','Je l’intègre généralement à ma routine quotidienne.');
const fill=(t,x)=>t.replace('{x}',x);
export function getEverydayAdditions(learning,native){return slots.map(slot=>({intent:'extra-everyday',signals:Object.values(slot),question:fill(q[learning]||q.en,slot[learning]||slot.en),translation:fill(q[native]||q.en,slot[native]||slot.en),example:a[learning]||a.en,exampleTranslation:a[native]||a.en}));}
