const FLOW = {
  'pt-PT': {
    anxiety: [
      { prompt: 'R_____ devagar.', answer: 'Respira', options: ['Respira','Corre','Grita'], instruction: 'Respira devagar durante cinco segundos.', calm: 'Estás aqui. Um passo de cada vez.', seconds: 5 },
      { prompt: 'O_____ à tua volta.', answer: 'Observa', options: ['Observa','Esconde','Empurra'], instruction: 'Observa três coisas à tua volta.', calm: 'Não precisas de resolver tudo agora.', seconds: 5 },
      { prompt: 'T_____ no teu peito.', answer: 'Toca', options: ['Toca','Parte','Fecha'], instruction: 'Toca no teu peito e sente a respiração.', calm: 'Este sentimento pode passar sem te controlar.', seconds: 5 }
    ],
    anger: [
      { prompt: 'A_____ as mãos.', answer: 'Abre', options: ['Abre','Bate','Atira'], instruction: 'Abre as mãos lentamente.', calm: 'Não tens de reagir neste segundo.', seconds: 5 },
      { prompt: 'R_____ antes de responder.', answer: 'Respira', options: ['Respira','Grita','Corre'], instruction: 'Respira lentamente durante cinco segundos.', calm: 'Podes proteger os teus limites com calma.', seconds: 5 },
      { prompt: 'R_____ os ombros.', answer: 'Relaxa', options: ['Relaxa','Levanta','Prende'], instruction: 'Relaxa os ombros e o maxilar.', calm: 'A raiva informa-te, mas não decide por ti.', seconds: 5 }
    ],
    stress: [
      { prompt: 'P_____ por um momento.', answer: 'Para', options: ['Para','Corre','Acelera'], instruction: 'Para e fica imóvel durante cinco segundos.', calm: 'Só uma coisa precisa da tua atenção agora.', seconds: 5 },
      { prompt: 'B_____ os ombros.', answer: 'Baixa', options: ['Baixa','Fecha','Empurra'], instruction: 'Baixa os ombros devagar.', calm: 'Descansar também faz parte do caminho.', seconds: 5 },
      { prompt: 'E_____ uma prioridade.', answer: 'Escolhe', options: ['Escolhe','Esconde','Esquece'], instruction: 'Escolhe mentalmente apenas uma prioridade.', calm: 'Não tens de fazer tudo ao mesmo tempo.', seconds: 5 }
    ],
    sadness: [
      { prompt: 'A_____ uma mão no peito.', answer: 'Apoia', options: ['Apoia','Afasta','Atira'], instruction: 'Apoia uma mão no peito durante cinco segundos.', calm: 'Não precisas de esconder o que sentes.', seconds: 5 },
      { prompt: 'O_____ para algo bonito.', answer: 'Olha', options: ['Olha','Fecha','Parte'], instruction: 'Olha para uma coisa bonita perto de ti.', calm: 'As pequenas coisas também contam.', seconds: 5 },
      { prompt: 'R_____ o teu corpo.', answer: 'Descansa', options: ['Descansa','Acelera','Prende'], instruction: 'Descansa o corpo por cinco segundos.', calm: 'Hoje podes tratar-te com delicadeza.', seconds: 5 }
    ],
    insecure: [
      { prompt: 'E_____ as costas.', answer: 'Endireita', options: ['Endireita','Esconde','Encolhe'], instruction: 'Endireita as costas com suavidade.', calm: 'Não precisas de ser perfeita para começar.', seconds: 5 },
      { prompt: 'D_____ “eu posso tentar”.', answer: 'Diz', options: ['Diz','Nega','Esconde'], instruction: 'Diz em voz alta: “Eu posso tentar.”', calm: 'Aprender inclui não saber ainda.', seconds: 5 },
      { prompt: 'D_____ um pequeno passo.', answer: 'Dá', options: ['Dá','Evita','Apaga'], instruction: 'Dá um pequeno passo em frente.', calm: 'A confiança também cresce com a prática.', seconds: 5 }
    ],
    overwhelmed: [
      { prompt: 'P_____ os pés no chão.', answer: 'Põe', options: ['Põe','Levanta','Esconde'], instruction: 'Põe os dois pés firmemente no chão.', calm: 'Não tens de carregar tudo de uma vez.', seconds: 5 },
      { prompt: 'S_____ uma coisa de cada vez.', answer: 'Separa', options: ['Separa','Mistura','Acelera'], instruction: 'Separa mentalmente o urgente do que pode esperar.', calm: 'Uma tarefa pequena já é suficiente.', seconds: 5 },
      { prompt: 'R_____ este momento.', answer: 'Reduz', options: ['Reduz','Complica','Duplica'], instruction: 'Reduz este momento a um único próximo passo.', calm: 'Pedir ajuda não diminui a tua capacidade.', seconds: 5 }
    ],
    excited: [
      { prompt: 'S_____ esta energia.', answer: 'Sente', options: ['Sente','Esconde','Trava'], instruction: 'Sente a energia no corpo durante cinco segundos.', calm: 'Podes aproveitar isto sem te apressares.', seconds: 5 },
      { prompt: 'S_____ devagar.', answer: 'Sorri', options: ['Sorri','Grita','Corre'], instruction: 'Sorri e respira devagar.', calm: 'A alegria também pode ser calma.', seconds: 5 },
      { prompt: 'A_____ com presença.', answer: 'Avança', options: ['Avança','Foge','Para'], instruction: 'Dá um passo em frente com presença.', calm: 'Leva esta energia contigo.', seconds: 5 }
    ],
    lonely: [
      { prompt: 'A_____ os braços à tua volta.', answer: 'Abraça', options: ['Abraça','Afasta','Cruza'], instruction: 'Abraça-te durante cinco segundos.', calm: 'Querer ligação não é fraqueza.', seconds: 5 },
      { prompt: 'P_____ numa pessoa segura.', answer: 'Pensa', options: ['Pensa','Esquece','Evita'], instruction: 'Pensa numa pessoa com quem te sentes segura.', calm: 'Podes aproximar-te devagar.', seconds: 5 },
      { prompt: 'E_____ uma mensagem simples.', answer: 'Escreve', options: ['Escreve','Apaga','Esconde'], instruction: 'Imagina uma mensagem simples: “Olá, como estás?”', calm: 'Uma ligação pequena também conta.', seconds: 5 }
    ],
    disappointed: [
      { prompt: 'S_____ o que aconteceu.', answer: 'Sente', options: ['Sente','Nega','Esconde'], instruction: 'Reconhece o que sentes durante cinco segundos.', calm: 'Era importante para ti. Por isso dói.', seconds: 5 },
      { prompt: 'L_____ as mãos.', answer: 'Liberta', options: ['Liberta','Fecha','Prende'], instruction: 'Abre as mãos e liberta a tensão.', calm: 'A história mudou, mas tu continuas aqui.', seconds: 5 },
      { prompt: 'I_____ outro caminho.', answer: 'Imagina', options: ['Imagina','Apaga','Recusa'], instruction: 'Imagina um pequeno caminho alternativo.', calm: 'Podes recomeçar quando estiveres preparada.', seconds: 5 }
    ],
    selflove: [
      { prompt: 'T_____ no teu coração.', answer: 'Toca', options: ['Toca','Esconde','Fecha'], instruction: 'Toca no teu coração durante cinco segundos.', calm: 'O teu valor não desaparece nos dias difíceis.', seconds: 5 },
      { prompt: 'D_____ algo gentil.', answer: 'Diz', options: ['Diz','Nega','Critica'], instruction: 'Diz: “Eu mereço respeito.”', calm: 'Não tens de merecer cuidado primeiro.', seconds: 5 },
      { prompt: 'R_____ uma qualidade tua.', answer: 'Reconhece', options: ['Reconhece','Esconde','Diminui'], instruction: 'Reconhece uma qualidade tua.', calm: 'Podes estar do teu próprio lado.', seconds: 5 }
    ],
    spiral: [
      { prompt: 'N_____ o pensamento.', answer: 'Nota', options: ['Nota','Segue','Acredita'], instruction: 'Nota o pensamento sem o seguir.', calm: 'Um pensamento repetido não é automaticamente verdade.', seconds: 5 },
      { prompt: 'V_____ ao presente.', answer: 'Volta', options: ['Volta','Foge','Acelera'], instruction: 'Volta a atenção para os teus pés no chão.', calm: 'Não precisas de encontrar a resposta agora.', seconds: 5 },
      { prompt: 'D_____ a mente.', answer: 'Descansa', options: ['Descansa','Força','Prende'], instruction: 'Descansa a mente durante cinco segundos.', calm: 'Podes deixar esta pergunta para depois.', seconds: 5 }
    ],
    jealousy: [
      { prompt: 'R_____ o que sentes.', answer: 'Reconhece', options: ['Reconhece','Esconde','Nega'], instruction: 'Reconhece o ciúme sem te julgares.', calm: 'Este sentimento não faz de ti uma má pessoa.', seconds: 5 },
      { prompt: 'V_____ ao teu próprio valor.', answer: 'Volta', options: ['Volta','Foge','Compara'], instruction: 'Pensa numa qualidade que existe em ti.', calm: 'O valor de outra pessoa não reduz o teu.', seconds: 5 },
      { prompt: 'E_____ agir com calma.', answer: 'Escolhe', options: ['Escolhe','Evita','Explode'], instruction: 'Escolhe uma resposta calma antes de agir.', calm: 'Podes sentir ciúme sem obedecer ao ciúme.', seconds: 5 }
    ]
  },
  'fr-FR': {
    anxiety: [
      { prompt: 'R_____ lentement.', answer: 'Respire', options: ['Respire','Cours','Crie'], instruction: 'Respire lentement pendant cinq secondes.', calm: 'Tu es ici. Une étape à la fois.', seconds: 5 },
      { prompt: 'O_____ autour de toi.', answer: 'Observe', options: ['Observe','Cache','Pousse'], instruction: 'Observe trois choses autour de toi.', calm: 'Tu n’as pas besoin de tout résoudre maintenant.', seconds: 5 },
      { prompt: 'T_____ ton cœur.', answer: 'Touche', options: ['Touche','Ferme','Jette'], instruction: 'Touche ton cœur et sens ta respiration.', calm: 'Ce sentiment peut passer sans te contrôler.', seconds: 5 }
    ],
    anger: [
      { prompt: 'O_____ les mains.', answer: 'Ouvre', options: ['Ouvre','Frappe','Jette'], instruction: 'Ouvre les mains lentement.', calm: 'Tu n’as pas besoin de réagir tout de suite.', seconds: 5 },
      { prompt: 'R_____ avant de répondre.', answer: 'Respire', options: ['Respire','Crie','Cours'], instruction: 'Respire lentement pendant cinq secondes.', calm: 'Tu peux protéger tes limites avec calme.', seconds: 5 },
      { prompt: 'R_____ les épaules.', answer: 'Relâche', options: ['Relâche','Lève','Bloque'], instruction: 'Relâche les épaules et la mâchoire.', calm: 'La colère t’informe, mais ne décide pas pour toi.', seconds: 5 }
    ]
  }
};

function fallbackFromPractice(practice, language) {
  const verbs = practice.verbs || [];
  const sentences = practice.sentences || [];
  return sentences.slice(0, 3).map((sentence, index) => {
    const verb = verbs[index] || verbs[0] || (language === 'fr-FR' ? 'Respire' : 'Respira');
    const first = verb.charAt(0).toUpperCase() + verb.slice(1);
    return {
      prompt: `${first.charAt(0)}_____ · ${sentence}`,
      answer: first,
      options: [first, language === 'fr-FR' ? 'Attends' : 'Espera', language === 'fr-FR' ? 'Évite' : 'Evita'],
      instruction: sentence,
      calm: language === 'fr-FR' ? 'Continue doucement. Tu fais de ton mieux.' : 'Continua devagar. Estás a fazer o teu melhor.',
      seconds: 5
    };
  });
}

export function getEmotionFlow(language, emotionId, practice) {
  const exact = FLOW[language]?.[emotionId];
  return exact?.length ? exact : fallbackFromPractice(practice, language);
}
