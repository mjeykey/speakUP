const CONTEXTS = [
  { pt: '', en: '' },
  { pt: 'Hoje, ', en: 'Today, ' },
  { pt: 'Neste momento, ', en: 'In this moment, ' },
  { pt: 'Com calma, ', en: 'Calmly, ' },
  { pt: 'Passo a passo, ', en: 'Step by step, ' }
];

const CORE = {
  'self-love': [
    ['aceito-me como sou.','I accept myself as I am.','Aceito-me.','I accept myself.'],
    ['trato-me com carinho.','I treat myself with kindness.','Mereço carinho.','I deserve kindness.'],
    ['respeito os meus limites.','I respect my limits.','Respeito-me.','I respect myself.'],
    ['reconheço o meu valor.','I recognise my worth.','Tenho valor.','I have worth.'],
    ['dou espaço às minhas necessidades.','I make room for my needs.','As minhas necessidades importam.','My needs matter.'],
    ['tenho orgulho no meu caminho.','I am proud of my journey.','Tenho orgulho em mim.','I am proud of myself.'],
    ['posso ser imperfeita e inteira.','I can be imperfect and whole.','Posso ser imperfeita.','I can be imperfect.'],
    ['falo comigo com respeito.','I speak to myself with respect.','Falo comigo com carinho.','I speak kindly to myself.'],
    ['mereço descanso e cuidado.','I deserve rest and care.','Mereço cuidado.','I deserve care.'],
    ['não preciso de provar o meu valor.','I do not need to prove my worth.','O meu valor já existe.','My worth already exists.']
  ],
  confidence: [
    ['confio na minha capacidade de aprender.','I trust my ability to learn.','Eu consigo aprender.','I can learn.'],
    ['posso começar antes de me sentir pronta.','I can begin before I feel ready.','Posso começar.','I can begin.'],
    ['a minha voz merece espaço.','My voice deserves space.','A minha voz importa.','My voice matters.'],
    ['aprendo com cada tentativa.','I learn from every attempt.','Cada tentativa ensina-me.','Every attempt teaches me.'],
    ['posso falar mesmo com algum nervosismo.','I can speak even with some nerves.','Posso falar.','I can speak.'],
    ['tenho coragem para tentar outra vez.','I have the courage to try again.','Tento outra vez.','I try again.'],
    ['não preciso de ser perfeita para avançar.','I do not need to be perfect to move forward.','Posso avançar.','I can move forward.'],
    ['reconheço aquilo que já sei.','I recognise what I already know.','Eu já sei muita coisa.','I already know a lot.'],
    ['posso ocupar o meu lugar.','I can take my place.','Este lugar também é meu.','This place is mine too.'],
    ['cresço cada vez que pratico.','I grow every time I practise.','A prática ajuda-me.','Practice helps me.']
  ],
  kindness: [
    ['escolho falar com gentileza.','I choose to speak kindly.','Escolho gentileza.','I choose kindness.'],
    ['posso ouvir antes de responder.','I can listen before replying.','Posso ouvir.','I can listen.'],
    ['um gesto pequeno pode ajudar.','A small gesture can help.','Um gesto ajuda.','A gesture helps.'],
    ['trato os outros com respeito.','I treat others with respect.','Mostro respeito.','I show respect.'],
    ['também mereço a minha própria bondade.','I deserve my own kindness too.','Sou gentil comigo.','I am kind to myself.'],
    ['posso discordar sem magoar.','I can disagree without hurting.','Posso falar com respeito.','I can speak respectfully.'],
    ['dou espaço a quem precisa.','I give space to those who need it.','Dou espaço.','I give space.'],
    ['as minhas palavras podem acalmar.','My words can soothe.','Falo com calma.','I speak calmly.'],
    ['posso pedir desculpa com sinceridade.','I can apologise sincerely.','Posso pedir desculpa.','I can apologise.'],
    ['a gentileza não me torna fraca.','Kindness does not make me weak.','A gentileza é força.','Kindness is strength.']
  ],
  gratitude: [
    ['reparo numa coisa boa deste dia.','I notice one good thing about this day.','Vejo algo bom.','I see something good.'],
    ['agradeço o que me apoiou hoje.','I appreciate what supported me today.','Sinto gratidão.','I feel gratitude.'],
    ['dou valor aos pequenos momentos.','I value small moments.','Os pequenos momentos importam.','Small moments matter.'],
    ['reconheço o esforço que fiz.','I acknowledge the effort I made.','Reconheço o meu esforço.','I acknowledge my effort.'],
    ['agradeço ao meu corpo por me acompanhar.','I thank my body for carrying me.','Agradeço ao meu corpo.','I thank my body.'],
    ['guardo uma memória que me faz bem.','I keep a memory that comforts me.','Guardo uma boa memória.','I keep a good memory.'],
    ['posso agradecer sem ignorar o que dói.','I can be grateful without ignoring pain.','A gratidão não apaga a dor.','Gratitude does not erase pain.'],
    ['reparo em quem esteve presente.','I notice who was present for me.','Vejo quem esteve comigo.','I see who was with me.'],
    ['há algo simples que me dá conforto.','Something simple gives me comfort.','Algo simples ajuda-me.','Something simple helps me.'],
    ['permito-me apreciar este instante.','I allow myself to appreciate this moment.','Aprecio este instante.','I appreciate this moment.']
  ],
  calm: [
    ['respiro devagar e fico aqui.','I breathe slowly and stay here.','Respiro devagar.','I breathe slowly.'],
    ['posso abrandar por um momento.','I can slow down for a moment.','Posso abrandar.','I can slow down.'],
    ['relaxo os ombros e as mãos.','I relax my shoulders and hands.','Relaxo o corpo.','I relax my body.'],
    ['não preciso de resolver tudo agora.','I do not need to solve everything now.','Agora não preciso de resolver tudo.','I do not need to solve everything now.'],
    ['volto ao que está à minha frente.','I return to what is in front of me.','Volto ao presente.','I return to the present.'],
    ['dou um passo de cada vez.','I take one step at a time.','Um passo de cada vez.','One step at a time.'],
    ['posso fazer uma pausa sem culpa.','I can pause without guilt.','Posso fazer uma pausa.','I can pause.'],
    ['deixo o silêncio criar espaço.','I let silence create space.','O silêncio ajuda-me.','Silence helps me.'],
    ['o meu corpo pode desacelerar.','My body can slow down.','Posso desacelerar.','I can slow down.'],
    ['este momento não precisa de pressa.','This moment does not need urgency.','Não há pressa.','There is no rush.']
  ],
  forgiveness: [
    ['posso reconhecer a dor sem ficar presa nela.','I can acknowledge the pain without staying trapped in it.','Reconheço a dor.','I acknowledge the pain.'],
    ['perdoar não significa esquecer.','Forgiving does not mean forgetting.','Não preciso de esquecer.','I do not need to forget.'],
    ['posso proteger-me e ainda assim seguir em frente.','I can protect myself and still move forward.','Posso proteger-me.','I can protect myself.'],
    ['liberto o peso aos poucos.','I release the weight little by little.','Liberto um pouco do peso.','I release some of the weight.'],
    ['não preciso de apressar o perdão.','I do not need to rush forgiveness.','Posso levar o meu tempo.','I can take my time.'],
    ['posso perdoar-me por não ter sabido melhor.','I can forgive myself for not knowing better.','Posso perdoar-me.','I can forgive myself.'],
    ['aprendo sem me castigar.','I learn without punishing myself.','Posso aprender com isto.','I can learn from this.'],
    ['uma fronteira também pode ser amor.','A boundary can also be love.','Posso criar uma fronteira.','I can set a boundary.'],
    ['o meu coração pode sarar no seu ritmo.','My heart can heal at its own pace.','Posso sarar devagar.','I can heal slowly.'],
    ['seguir em frente não apaga o que aconteceu.','Moving forward does not erase what happened.','Posso seguir em frente.','I can move forward.']
  ],
  hope: [
    ['ainda pode existir uma possibilidade.','A possibility may still exist.','Ainda há uma possibilidade.','There is still a possibility.'],
    ['um pequeno passo pode mudar o caminho.','A small step can change the path.','Um passo pode ajudar.','One step can help.'],
    ['não preciso de ver o caminho inteiro.','I do not need to see the whole path.','Só preciso do próximo passo.','I only need the next step.'],
    ['posso deixar espaço para uma surpresa boa.','I can leave room for a good surprise.','Algo bom ainda pode acontecer.','Something good can still happen.'],
    ['a minha história ainda está a continuar.','My story is still continuing.','A minha história continua.','My story continues.'],
    ['há dias que começam de novo.','Some days begin again.','Posso recomeçar.','I can begin again.'],
    ['uma dificuldade não decide tudo.','One difficulty does not decide everything.','Isto não decide tudo.','This does not decide everything.'],
    ['posso procurar uma pequena luz.','I can look for a small light.','Procuro uma pequena luz.','I look for a small light.'],
    ['o futuro ainda não está fechado.','The future is not closed yet.','O futuro está aberto.','The future is open.'],
    ['continuo mesmo sem ter todas as respostas.','I continue without having every answer.','Posso continuar.','I can continue.']
  ],
  courage: [
    ['posso agir mesmo com medo.','I can act even with fear.','Posso agir.','I can act.'],
    ['a coragem pode ser silenciosa.','Courage can be quiet.','A minha coragem conta.','My courage counts.'],
    ['dou o próximo passo com cuidado.','I take the next step carefully.','Dou o próximo passo.','I take the next step.'],
    ['posso dizer aquilo de que preciso.','I can say what I need.','Posso falar.','I can speak.'],
    ['protejo aquilo que é importante para mim.','I protect what matters to me.','Protejo o que importa.','I protect what matters.'],
    ['posso tentar mesmo sem garantias.','I can try without guarantees.','Posso tentar.','I can try.'],
    ['levanto-me depois de uma queda.','I rise after a fall.','Posso levantar-me.','I can get up.'],
    ['a minha presença já é uma forma de coragem.','My presence is already a form of courage.','Estou aqui.','I am here.'],
    ['posso escolher uma resposta diferente.','I can choose a different response.','Posso escolher.','I can choose.'],
    ['não preciso de ser destemida para ser corajosa.','I do not need to be fearless to be brave.','Posso sentir medo e avançar.','I can feel fear and move forward.']
  ],
  'stoic-wisdom': [
    ['concentro-me no que posso controlar.','I focus on what I can control.','Escolho o que posso controlar.','I choose what I can control.'],
    ['deixo passar aquilo que não depende de mim.','I let go of what is not up to me.','Isto não depende de mim.','This is not up to me.'],
    ['a minha resposta ainda é uma escolha.','My response is still a choice.','Posso escolher a minha resposta.','I can choose my response.'],
    ['não preciso de discutir com cada pensamento.','I do not need to argue with every thought.','Deixo o pensamento passar.','I let the thought pass.'],
    ['aceito o momento antes de decidir o próximo passo.','I accept the moment before deciding the next step.','Primeiro aceito este momento.','First I accept this moment.'],
    ['uma dificuldade pode ensinar-me alguma coisa.','A difficulty can teach me something.','Posso aprender com isto.','I can learn from this.'],
    ['o desconforto não decide quem sou.','Discomfort does not decide who I am.','Eu sou mais do que este desconforto.','I am more than this discomfort.'],
    ['posso manter os meus valores num dia difícil.','I can keep my values on a difficult day.','Os meus valores guiam-me.','My values guide me.'],
    ['faço bem a próxima coisa simples.','I do the next simple thing well.','Faço a próxima coisa.','I do the next thing.'],
    ['a paz cresce quando largo o impossível.','Peace grows when I release the impossible.','Largo o que não controlo.','I release what I cannot control.']
  ],
  'spiral-thoughts': [
    ['reparo que o pensamento está a repetir-se.','I notice the thought is repeating.','Reparo no ciclo.','I notice the loop.'],
    ['um pensamento não é sempre um facto.','A thought is not always a fact.','Isto é um pensamento.','This is a thought.'],
    ['posso voltar ao que vejo agora.','I can return to what I see now.','Volto ao presente.','I return to the present.'],
    ['não preciso de responder à mesma pergunta outra vez.','I do not need to answer the same question again.','Posso parar esta pergunta.','I can pause this question.'],
    ['deixo o pensamento passar sem o seguir.','I let the thought pass without following it.','Deixo-o passar.','I let it pass.'],
    ['se houver uma ação, posso anotá-la.','If there is an action, I can write it down.','Anoto o próximo passo.','I write down the next step.'],
    ['se não houver ação, posso descansar.','If there is no action, I can rest.','Agora posso descansar.','I can rest now.'],
    ['o meu cérebro está cansado, não quebrado.','My brain is tired, not broken.','O meu cérebro precisa de pausa.','My brain needs a pause.'],
    ['posso mudar a atenção para o meu corpo.','I can shift attention to my body.','Sinto os meus pés no chão.','I feel my feet on the ground.'],
    ['a resposta pode aparecer depois do descanso.','The answer may appear after rest.','Posso esperar.','I can wait.']
  ],
  visualisation: [
    ['imagino um lugar onde me sinto segura.','I imagine a place where I feel safe.','Vejo um lugar seguro.','I see a safe place.'],
    ['vejo o próximo passo com clareza.','I see the next step clearly.','Vejo o próximo passo.','I see the next step.'],
    ['imagino-me a terminar uma pequena tarefa.','I imagine myself finishing a small task.','Vejo-me a terminar.','I see myself finishing.'],
    ['crio uma imagem simples do meu objetivo.','I create a simple image of my goal.','Vejo o meu objetivo.','I see my goal.'],
    ['reparo nas cores e nos sons da imagem.','I notice the colours and sounds in the image.','Reparo nos detalhes.','I notice the details.'],
    ['imagino como quero sentir-me amanhã.','I imagine how I want to feel tomorrow.','Vejo o amanhã.','I see tomorrow.'],
    ['vejo-me a falar com calma.','I see myself speaking calmly.','Falo com calma.','I speak calmly.'],
    ['imagino uma porta a abrir-se.','I imagine a door opening.','Vejo uma porta aberta.','I see an open door.'],
    ['posso construir a imagem aos poucos.','I can build the image little by little.','A imagem pode ser simples.','The image can be simple.'],
    ['não preciso de ver tudo com perfeição.','I do not need to see everything perfectly.','Uma pequena imagem chega.','A small image is enough.']
  ],
  meditation: [
    ['observo a minha respiração sem a mudar.','I observe my breathing without changing it.','Observo a respiração.','I observe my breathing.'],
    ['sinto o peso do meu corpo.','I feel the weight of my body.','Sinto o meu corpo.','I feel my body.'],
    ['deixo os sons chegar e partir.','I let sounds come and go.','Ouço sem seguir.','I listen without following.'],
    ['volto com gentileza quando me distraio.','I return gently when I get distracted.','Volto com gentileza.','I return gently.'],
    ['não preciso de esvaziar a mente.','I do not need to empty my mind.','A mente pode ter pensamentos.','The mind can have thoughts.'],
    ['fico presente durante mais uma respiração.','I stay present for one more breath.','Fico aqui.','I stay here.'],
    ['relaxo a testa e o maxilar.','I relax my forehead and jaw.','Relaxo o rosto.','I relax my face.'],
    ['reparo no espaço entre dois pensamentos.','I notice the space between two thoughts.','Reparo no espaço.','I notice the space.'],
    ['posso meditar por apenas um minuto.','I can meditate for just one minute.','Um minuto chega.','One minute is enough.'],
    ['termino devagar e volto ao quarto.','I finish slowly and return to the room.','Volto devagar.','I return slowly.']
  ],
  nature: [
    ['ouço o vento e deixo o corpo abrandar.','I hear the wind and let my body slow down.','Ouço o vento.','I hear the wind.'],
    ['reparo na luz sobre as folhas.','I notice the light on the leaves.','Vejo a luz.','I see the light.'],
    ['sinto o chão debaixo dos meus pés.','I feel the ground beneath my feet.','Sinto o chão.','I feel the ground.'],
    ['respiro como as ondas, devagar.','I breathe like the waves, slowly.','Respiro como as ondas.','I breathe like the waves.'],
    ['uma árvore não apressa o crescimento.','A tree does not rush its growth.','Posso crescer devagar.','I can grow slowly.'],
    ['o céu muda sem deixar de ser céu.','The sky changes without ceasing to be sky.','Posso mudar e continuar a ser eu.','I can change and remain myself.'],
    ['deixo a chuva levar um pouco do peso.','I let the rain carry some of the weight.','A chuva leva o peso.','The rain carries the weight.'],
    ['reparo numa cor da natureza.','I notice one colour in nature.','Vejo uma cor.','I see a colour.'],
    ['o ar fresco ajuda-me a voltar ao presente.','Fresh air helps me return to the present.','O ar ajuda-me.','The air helps me.'],
    ['a natureza lembra-me que tudo tem ciclos.','Nature reminds me that everything has cycles.','Tudo tem ciclos.','Everything has cycles.']
  ]
};

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function expandVoiceCategory(category) {
  const core = CORE[category.id];
  if (!core) return category;
  const exercises = CONTEXTS.flatMap(context => core.map(([pt,en,altPt,altEn]) => ({
    sentence: context.pt ? `${context.pt}${pt}` : capitalise(pt),
    english: context.en ? `${context.en}${en.charAt(0).toLowerCase()}${en.slice(1)}` : en,
    alternative: altPt,
    alternativeEnglish: altEn
  })));
  return { ...category, exercises };
}
