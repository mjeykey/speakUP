export const EMOTION_PORTUGUESE = {
  jealousy: {
    intro: 'O ciúme não faz de ti uma má pessoa. Muitas vezes aparece quando tens medo de perder alguém ou de não ser suficiente.',
    verbs: ['sentir','comparar','confiar','valorizar','escolher'],
    sentences: [
      'Eu sinto ciúme e posso reconhecer esse sentimento.',
      'Eu não tenho de me comparar com toda a gente.',
      'Posso valorizar o que existe em mim.',
      'O sucesso de outra pessoa não diminui o meu valor.',
      'Posso escolher agir com calma, mesmo sentindo ciúme.'
    ]
  },
  anger: {
    intro: 'A raiva pode mostrar que um limite foi ultrapassado. Não precisas de a apagar para escolheres o que fazer a seguir.',
    verbs: ['sentir','parar','respirar','proteger','falar'],
    sentences: [
      'Eu sinto raiva e posso fazer uma pausa.',
      'Posso respirar antes de responder.',
      'Tenho o direito de proteger os meus limites.',
      'Posso falar com firmeza sem me abandonar.',
      'A minha raiva existe, mas não precisa de decidir tudo por mim.'
    ]
  },
  anxiety: {
    intro: 'É compreensível sentires ansiedade. A tua mente pode estar a tentar preparar-te para tudo ao mesmo tempo.',
    verbs: ['sentir','respirar','observar','aceitar','continuar'],
    sentences: [
      'Eu sinto ansiedade e continuo aqui.',
      'Posso respirar devagar sem fingir que está tudo bem.',
      'Posso observar o que está à minha volta.',
      'Aceito que ainda não tenho todas as respostas.',
      'Posso continuar com um passo pequeno.'
    ]
  },
  stress: {
    intro: 'O stress pode aparecer quando há coisas demais a pedir a tua atenção. Isso não significa que estás a falhar.',
    verbs: ['parar','escolher','organizar','descansar','continuar'],
    sentences: [
      'Posso parar por um momento.',
      'Posso escolher apenas uma prioridade.',
      'Não tenho de organizar tudo agora.',
      'Descansar também faz parte do caminho.',
      'Posso continuar sem fazer tudo ao mesmo tempo.'
    ]
  },
  sadness: {
    intro: 'A tristeza não precisa de ser resolvida imediatamente. Às vezes, mostra apenas que algo foi importante para ti.',
    verbs: ['sentir','aceitar','descansar','lembrar','cuidar'],
    sentences: [
      'Eu sinto tristeza e não preciso de a esconder.',
      'Posso aceitar que hoje está a ser difícil.',
      'Tenho o direito de descansar.',
      'Posso lembrar-me do que foi importante para mim.',
      'Hoje posso cuidar de mim com mais delicadeza.'
    ]
  },
  insecure: {
    intro: 'Sentires-te insegura não significa que não és capaz. Muitas vezes, significa apenas que isto é importante ou novo para ti.',
    verbs: ['aprender','tentar','começar','praticar','crescer'],
    sentences: [
      'Ainda estou a aprender.',
      'Posso tentar sem ter a certeza de tudo.',
      'Posso começar antes de me sentir preparada.',
      'Cada vez que pratico, compreendo um pouco mais.',
      'Posso crescer sem ser perfeita.'
    ]
  },
  overwhelmed: {
    intro: 'Quando tudo parece urgente, é normal perderes a sensação de ordem. Não tens de carregar tudo de uma vez.',
    verbs: ['separar','escolher','adiar','pedir','reduzir'],
    sentences: [
      'Posso separar o que é para agora do que pode esperar.',
      'Posso escolher uma coisa de cada vez.',
      'Posso adiar o que não é urgente.',
      'Posso pedir ajuda sem me sentir menos capaz.',
      'Posso reduzir este momento a um passo pequeno.'
    ]
  },
  excited: {
    intro: 'A excitação pode trazer muita energia ao corpo. Não precisas de a diminuir; podes dar-lhe uma direção.',
    verbs: ['sentir','imaginar','aproveitar','partilhar','avançar'],
    sentences: [
      'Eu sinto-me entusiasmada com o que vem aí.',
      'Posso imaginar este momento com calma.',
      'Quero aproveitar esta energia sem me apressar.',
      'Posso partilhar a minha alegria.',
      'Posso avançar e continuar presente.'
    ]
  },
  lonely: {
    intro: 'A solidão pode doer mesmo quando há pessoas por perto. Querer ligação é uma necessidade humana, não uma fraqueza.',
    verbs: ['sentir','procurar','ligar','partilhar','aproximar'],
    sentences: [
      'Eu sinto-me só e isso merece atenção.',
      'Posso procurar uma ligação que me faça bem.',
      'Posso ligar a alguém sem ter de explicar tudo.',
      'Posso partilhar uma parte pequena do que sinto.',
      'Posso aproximar-me devagar e continuar a proteger-me.'
    ]
  },
  disappointed: {
    intro: 'A desilusão dói porque esperavas algo que era importante para ti. Não precisas de fingir que não te afetou.',
    verbs: ['esperar','sentir','aceitar','recomeçar','imaginar'],
    sentences: [
      'Eu esperava que fosse diferente.',
      'Posso sentir esta desilusão sem me julgar.',
      'Posso aceitar que a história mudou.',
      'Posso recomeçar quando estiver preparada.',
      'Ainda posso imaginar outro caminho.'
    ]
  },
  selflove: {
    intro: 'O amor-próprio não exige confiança constante. Pode começar com respeito, honestidade e uma frase gentil.',
    verbs: ['respeitar','aceitar','cuidar','reconhecer','valorizar'],
    sentences: [
      'Posso respeitar as minhas necessidades.',
      'Posso aceitar-me neste momento.',
      'Quero cuidar de mim sem ter de merecer isso primeiro.',
      'Posso reconhecer uma coisa boa em mim.',
      'O meu valor não desaparece nos dias difíceis.'
    ]
  },
  spiral: {
    intro: 'Os pensamentos repetidos podem parecer verdade só porque voltam muitas vezes. Não tens de acreditar em todos eles.',
    verbs: ['notar','questionar','parar','voltar','descansar'],
    sentences: [
      'Eu noto que o pensamento voltou.',
      'Posso questionar este pensamento sem lutar com ele.',
      'Posso parar de procurar a mesma resposta por agora.',
      'Posso voltar ao que está mesmo à minha frente.',
      'A minha mente também pode descansar.'
    ]
  }
};

export function getPortugueseEmotionPractice(emotionId) {
  return EMOTION_PORTUGUESE[emotionId] || EMOTION_PORTUGUESE.anxiety;
}
