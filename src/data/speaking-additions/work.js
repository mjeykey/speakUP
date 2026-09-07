const s=(en,de,pt,es,hr,fr)=>({en,de,pt,es,hr,fr});
const slots=[
  s('training','Schulung','formação','formación','obuci','formation'),
  s('your work schedule','deinen Arbeitsplan','o teu horário de trabalho','tu horario de trabajo','svom radnom rasporedu','ton emploi du temps de travail'),
  s('setting priorities','Prioritäten setzen','definir prioridades','establecer prioridades','postavljanju prioriteta','définition des priorités'),
  s('a difficult customer','einen schwierigen Kunden','um cliente difícil','un cliente difícil','teškom korisniku','un client difficile'),
  s('email communication','E-Mail-Kommunikation','comunicação por e-mail','comunicación por correo electrónico','komunikaciji e-poštom','communication par e-mail'),
  s('phone calls','Telefonate','chamadas telefónicas','llamadas telefónicas','telefonskim pozivima','appels téléphoniques'),
  s('planning tasks','Aufgabenplanung','planeamento de tarefas','planificación de tareas','planiranju zadataka','planification des tâches'),
  s('asking for help','um Hilfe bitten','pedir ajuda','pedir ayuda','traženju pomoći','demande d’aide'),
  s('sharing knowledge','Wissen teilen','partilhar conhecimento','compartir conocimientos','dijeljenju znanja','partage des connaissances'),
  s('handling stress','mit Stress umgehen','lidar com o stress','manejar el estrés','nošenju sa stresom','gestion du stress'),
  s('giving feedback','Feedback geben','dar feedback','dar comentarios','davanju povratnih informacija','retour constructif'),
  s('receiving feedback','Feedback erhalten','receber feedback','recibir comentarios','primanju povratnih informacija','réception de retours'),
  s('time management','Zeitmanagement','gestão do tempo','gestión del tiempo','upravljanju vremenom','gestion du temps'),
  s('staying focused','konzentriert bleiben','manter a concentração','mantener la concentración','održavanju fokusa','maintien de la concentration'),
  s('documentation','Dokumentation','documentação','documentación','dokumentaciji','documentation'),
  s('learning new software','neue Software lernen','aprender novo software','aprender un nuevo programa','učenju novog softvera','apprentissage d’un nouveau logiciel'),
  s('dealing with mistakes','mit Fehlern umgehen','lidar com erros','manejar los errores','nošenju s pogreškama','gestion des erreurs'),
  s('celebrating achievements','Erfolge feiern','celebrar conquistas','celebrar logros','slavljenju uspjeha','célébration des réussites'),
  s('career growth','berufliche Entwicklung','crescimento profissional','crecimiento profesional','karijernom razvoju','évolution professionnelle'),
  s('team communication','Teamkommunikation','comunicação na equipa','comunicación del equipo','timskoj komunikaciji','communication d’équipe')
];
const q=s('What do you think about {x} at work?','Was denkst du bei der Arbeit über {x}?','O que pensas sobre {x} no trabalho?','¿Qué piensas de {x} en el trabajo?','Što misliš o {x} na poslu?','Que penses-tu de {x} au travail ?');
const a=s('I think it can make work clearer and easier.','Ich denke, das kann die Arbeit klarer und einfacher machen.','Acho que pode tornar o trabalho mais claro e mais fácil.','Creo que puede hacer el trabajo más claro y fácil.','Mislim da to može učiniti posao jasnijim i lakšim.','Je pense que cela peut rendre le travail plus clair et plus facile.');
const fill=(t,x)=>t.replace('{x}',x);
export function getWorkAdditions(learning,native){return slots.map(slot=>({intent:'extra-work',signals:Object.values(slot),question:fill(q[learning]||q.en,slot[learning]||slot.en),translation:fill(q[native]||q.en,slot[native]||slot.en),example:a[learning]||a.en,exampleTranslation:a[native]||a.en}));}
