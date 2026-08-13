const PACKS = {
  'en-US': [
    { weak: 'Sorry to bother you, but could I maybe ask something?', strong: 'I have a question.', translations: { 'de-DE': ['Entschuldige, dass ich störe, aber könnte ich vielleicht etwas fragen?', 'Ich habe eine Frage.'], 'pt-PT': ['Desculpa incomodar, mas será que posso fazer uma pergunta?', 'Tenho uma pergunta.'] } },
    { weak: "I don't know if this makes sense, but...", strong: "Here's how I see it.", translations: { 'de-DE': ['Ich weiß nicht, ob das Sinn ergibt, aber …', 'So sehe ich das.'], 'pt-PT': ['Não sei se isto faz sentido, mas…', 'É assim que eu vejo a situação.'] } },
    { weak: "I'm sorry, but I can't do that.", strong: "I can't do that.", translations: { 'de-DE': ['Tut mir leid, aber ich kann das nicht machen.', 'Das kann ich nicht machen.'], 'pt-PT': ['Desculpa, mas não posso fazer isso.', 'Não posso fazer isso.'] } },
    { weak: 'Maybe we could possibly try another option?', strong: "Let's try another option.", translations: { 'de-DE': ['Vielleicht könnten wir eventuell eine andere Möglichkeit versuchen?', 'Lass uns eine andere Möglichkeit versuchen.'], 'pt-PT': ['Talvez pudéssemos tentar outra opção?', 'Vamos tentar outra opção.'] } },
    { weak: "It's fine. Don't worry about it.", strong: "Actually, that didn't feel okay to me.", translations: { 'de-DE': ['Ist schon okay. Mach dir keine Gedanken.', 'Eigentlich war das für mich nicht in Ordnung.'], 'pt-PT': ['Está tudo bem. Não te preocupes.', 'Na verdade, isso não foi confortável para mim.'] } },
    { weak: "I don't want to sound rude, but I disagree.", strong: 'I see it differently.', translations: { 'de-DE': ['Ich möchte nicht unhöflich klingen, aber ich bin anderer Meinung.', 'Ich sehe das anders.'], 'pt-PT': ['Não quero parecer indelicada, mas discordo.', 'Eu vejo isso de outra forma.'] } },
    { weak: 'If it is not too much trouble, could you send it today?', strong: 'Please send it today.', translations: { 'de-DE': ['Falls es nicht zu viele Umstände macht, könntest du es heute schicken?', 'Bitte schick es heute.'], 'pt-PT': ['Se não der muito trabalho, podes enviar hoje?', 'Por favor, envia hoje.'] } },
    { weak: 'I might be wrong, but I think we need more time.', strong: 'I think we need more time.', translations: { 'de-DE': ['Vielleicht liege ich falsch, aber ich denke, wir brauchen mehr Zeit.', 'Ich denke, wir brauchen mehr Zeit.'], 'pt-PT': ['Posso estar errada, mas acho que precisamos de mais tempo.', 'Acho que precisamos de mais tempo.'] } }
  ]
};

function normalizeSupport(code) {
  if (code?.startsWith('de')) return 'de-DE';
  if (code?.startsWith('pt')) return 'pt-PT';
  return 'de-DE';
}

export function getCommunicationStrengthPack(learningLanguage, nativeLanguage) {
  const learning = learningLanguage?.startsWith('en') ? 'en-US' : 'en-US';
  const support = normalizeSupport(nativeLanguage);
  return PACKS[learning].map(item => ({
    weak: item.weak,
    strong: item.strong,
    weakTranslation: item.translations[support]?.[0] || item.translations['de-DE'][0],
    strongTranslation: item.translations[support]?.[1] || item.translations['de-DE'][1]
  }));
}
