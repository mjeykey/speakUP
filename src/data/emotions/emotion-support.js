export const EMOTION_TIPS = {
  jealousy: [
    'Write down what you fear losing, without judging the answer.',
    'Name three qualities that belong to you and cannot be taken away by another person.',
    'Pause comparison for ten minutes and return your attention to your own next step.'
  ],
  anger: [
    'Move away from the situation for a moment before deciding what to say.',
    'Unclench your jaw and hands, then breathe out longer than you breathe in.',
    'Turn the anger into one clear boundary: “I need…” or “I am not okay with…”'
  ],
  anxiety: [
    'Name five things you see, four you feel and three you hear.',
    'Choose one fact you know right now and separate it from what you fear might happen.',
    'Reduce the next step until it feels small enough to begin.'
  ],
  stress: [
    'Choose one task that takes less than two minutes and finish only that.',
    'Write three tasks down, then circle the only one that truly needs attention now.',
    'Give yourself a ten-minute pause without using it to plan more work.'
  ],
  sadness: [
    'Choose one gentle thing: water, a shower, fresh air, music or rest.',
    'Describe one safe memory without forcing it to make the sadness disappear.',
    'Send one honest sentence to someone safe: “Today feels difficult.”'
  ],
  insecure: [
    'Remember one skill that once felt unfamiliar and is easier now.',
    'Replace “I must be good at this” with “I am allowed to practise this.”',
    'Do one imperfect version instead of waiting to feel completely ready.'
  ],
  overwhelmed: [
    'Sort everything into: now, later and not mine.',
    'Remove one task from today instead of adding another strategy.',
    'Ask: “What is the smallest useful action I can take?”'
  ],
  excited: [
    'Write down the first practical step while the energy is available.',
    'Slow your breathing enough to enjoy the moment instead of rushing through it.',
    'Describe what you are looking forward to using three concrete details.'
  ],
  lonely: [
    'Choose one low-pressure connection: a message, voice note or short walk with someone.',
    'Go somewhere where other people are present, even without needing to talk.',
    'Name the kind of connection you need: company, understanding, affection or conversation.'
  ],
  disappointed: [
    'Name exactly what you hoped would happen.',
    'Separate what is no longer possible from what may still be changed.',
    'Delay the next decision until the first wave of disappointment has softened.'
  ],
  selflove: [
    'Say one kind statement that feels believable, not exaggerated.',
    'Notice one need today and treat it as valid.',
    'Thank yourself for one small thing you handled recently.'
  ],
  spiral: [
    'Say out loud: “I notice that my mind is repeating this.”',
    'Write the thought once, then stop answering it for five minutes.',
    'Ask whether there is a real action available now. If not, return to one thing you can see.'
  ]
};

const P = (pt, de, en, es, an, hr, dal, fr) => ({
  'pt-PT': pt, 'de-DE': de, 'en-GB': en, 'es-ES': es,
  'es-AN': an, 'hr-HR': hr, 'hr-DAL': dal, 'fr-FR': fr
});

export const EMOTION_LANGUAGE_PHRASES = {
  jealousy: [
    P('Não tenho de competir com toda a gente.','Ich muss nicht mit allen konkurrieren.','I do not have to compete with everyone.','No tengo que competir con todo el mundo.','No tengo que competir con nadie.','Ne moram se natjecati sa svima.','Ne moran se sa svima natjecat.','Je ne dois pas être en compétition avec tout le monde.'),
    P('O sucesso de outra pessoa não diminui o meu valor.','Der Erfolg eines anderen mindert meinen Wert nicht.','Someone else’s success does not reduce my value.','El éxito de otra persona no reduce mi valor.','Que a otra persona le vaya bien no me quita valor.','Tuđi uspjeh ne umanjuje moju vrijednost.','Tuđi uspjeh ne smanjuje moju vridnost.','La réussite de quelqu’un d’autre ne diminue pas ma valeur.')
  ],
  anger: [
    P('Posso fazer uma pausa antes de reagir.','Ich kann eine Pause machen, bevor ich reagiere.','I can pause before I react.','Puedo parar antes de reaccionar.','Puedo parar un momento antes de responder.','Mogu zastati prije nego što reagiram.','Mogu stat prije nego reagiran.','Je peux faire une pause avant de réagir.'),
    P('Posso dizer claramente aquilo de que preciso.','Ich kann klar sagen, was ich brauche.','I can clearly say what I need.','Puedo decir claramente lo que necesito.','Puedo decir claro lo que necesito.','Mogu jasno reći što mi treba.','Mogu jasno reć šta mi triba.','Je peux dire clairement ce dont j’ai besoin.')
  ],
  anxiety: [
    P('Estou aqui, neste momento.','Ich bin jetzt hier.','I am here right now.','Estoy aquí, ahora mismo.','Estoy aquí, ahora mismo.','Ovdje sam, upravo sada.','Tu san, baš sada.','Je suis ici, maintenant.'),
    P('Não preciso de ter todas as respostas hoje.','Ich brauche heute nicht alle Antworten.','I do not need every answer today.','No necesito tener todas las respuestas hoy.','No necesito saberlo todo hoy.','Danas ne moram imati sve odgovore.','Danas ne moran imat sve odgovore.','Je n’ai pas besoin d’avoir toutes les réponses aujourd’hui.')
  ],
  stress: [
    P('Uma coisa de cada vez.','Eine Sache nach der anderen.','One thing at a time.','Una cosa cada vez.','Una cosa detrás de otra.','Jedna stvar po jedna.','Jedno po jedno.','Une chose à la fois.'),
    P('Esta tarefa chega por agora.','Diese Aufgabe reicht für jetzt.','This task is enough for now.','Esta tarea es suficiente por ahora.','Con esta tarea basta por ahora.','Ovaj zadatak je dovoljan za sada.','Ovo je dosta za sada.','Cette tâche suffit pour le moment.')
  ],
  sadness: [
    P('Posso tratar-me com carinho.','Ich darf sanft mit mir umgehen.','I can be gentle with myself.','Puedo tratarme con cariño.','Puedo cuidarme con cariño.','Mogu biti nježna prema sebi.','Mogu bit nježna prema sebi.','Je peux être douce avec moi-même.'),
    P('Não tenho de esconder a minha tristeza.','Ich muss meine Traurigkeit nicht verstecken.','I do not have to hide my sadness.','No tengo que esconder mi tristeza.','No tengo que esconder que estoy triste.','Ne moram skrivati svoju tugu.','Ne moran skrivat svoju tugu.','Je ne dois pas cacher ma tristesse.')
  ],
  insecure: [
    P('Ainda estou a aprender.','Ich lerne noch.','I am still learning.','Todavía estoy aprendiendo.','Todavía estoy aprendiendo.','Još učim.','Još učin.','Je suis encore en train d’apprendre.'),
    P('Posso começar antes de me sentir preparada.','Ich kann anfangen, bevor ich mich bereit fühle.','I can begin before I feel ready.','Puedo empezar antes de sentirme preparada.','Puedo empezar aunque todavía no me sienta lista.','Mogu početi prije nego što se osjećam spremno.','Mogu počet i prije nego se osjećan spremno.','Je peux commencer avant de me sentir prête.')
  ],
  overwhelmed: [
    P('Nem tudo é urgente.','Nicht alles ist dringend.','Not everything is urgent.','No todo es urgente.','No todo corre tanta prisa.','Nije sve hitno.','Nije sve priša.','Tout n’est pas urgent.'),
    P('Posso escolher apenas uma prioridade.','Ich kann nur eine Priorität wählen.','I can choose just one priority.','Puedo elegir una sola prioridad.','Puedo quedarme con una sola prioridad.','Mogu odabrati samo jedan prioritet.','Mogu izabrat samo jednu stvar.','Je peux choisir une seule priorité.')
  ],
  excited: [
    P('Posso aproveitar este momento.','Ich darf diesen Moment genießen.','I can enjoy this moment.','Puedo disfrutar de este momento.','Puedo disfrutar este momento.','Mogu uživati u ovom trenutku.','Mogu guštat u ovom trenutku.','Je peux profiter de ce moment.'),
    P('Posso dar uma direção a esta energia.','Ich kann dieser Energie eine Richtung geben.','I can give this energy a direction.','Puedo darle una dirección a esta energía.','Puedo aprovechar bien esta energía.','Mogu usmjeriti ovu energiju.','Mogu usmjerit ovu energiju.','Je peux donner une direction à cette énergie.')
  ],
  lonely: [
    P('Mereço uma ligação verdadeira.','Ich verdiene echte Verbundenheit.','I deserve meaningful connection.','Merezco una conexión de verdad.','Merezco sentirme conectada de verdad.','Zaslužujem iskrenu povezanost.','Zaslužujen pravu bliskost.','Je mérite une relation sincère.'),
    P('Posso aproximar-me de alguém com calma.','Ich kann mich behutsam bei jemandem melden.','I can reach out gently.','Puedo acercarme a alguien con calma.','Puedo escribirle a alguien sin presionarme.','Mogu se nekome javiti bez pritiska.','Mogu se nekome javit pomalo.','Je peux contacter quelqu’un sans me mettre la pression.')
  ],
  disappointed: [
    P('Isto era importante para mim.','Das war mir wichtig.','This mattered to me.','Esto era importante para mí.','Esto me importaba de verdad.','Ovo mi je bilo važno.','Ovo mi je bilo važno.','Cela comptait pour moi.'),
    P('Posso continuar quando estiver preparada.','Ich kann weitermachen, wenn ich bereit bin.','I can continue when I am ready.','Puedo seguir cuando esté preparada.','Puedo seguir cuando me sienta lista.','Mogu nastaviti kad budem spremna.','Mogu nastavit kad buden spremna.','Je peux continuer quand je serai prête.')
  ],
  selflove: [
    P('Mereço ser tratada com carinho.','Ich verdiene einen freundlichen Umgang mit mir selbst.','I deserve kindness.','Merezco tratarme con cariño.','Merezco cuidarme con cariño.','Zaslužujem nježnost.','Zaslužujen nježnost.','Je mérite de la douceur.'),
    P('Posso respeitar as minhas próprias necessidades.','Ich darf meine eigenen Bedürfnisse achten.','I can respect my own needs.','Puedo respetar mis propias necesidades.','Puedo hacer caso a lo que necesito.','Mogu poštovati svoje potrebe.','Mogu poštovat svoje potrebe.','Je peux respecter mes propres besoins.')
  ],
  spiral: [
    P('Um pensamento nem sempre é um facto.','Ein Gedanke ist nicht immer eine Tatsache.','A thought is not always a fact.','Un pensamiento no siempre es un hecho.','Un pensamiento no siempre es verdad.','Misao nije uvijek činjenica.','Misao nije uvik činjenica.','Une pensée n’est pas toujours un fait.'),
    P('Posso voltar a este momento.','Ich kann in diesen Moment zurückkehren.','I can return to this moment.','Puedo volver a este momento.','Puedo volver al momento presente.','Mogu se vratiti u ovaj trenutak.','Mogu se vratit u ovaj trenutak.','Je peux revenir à cet instant.')
  ]
};

export function getEmotionPhrases(emotionId, language) {
  const entries = EMOTION_LANGUAGE_PHRASES[emotionId] || EMOTION_LANGUAGE_PHRASES.selflove;
  return entries.map(entry => entry[language] || entry['en-GB']);
}
