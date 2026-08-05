export const POSITIVE_SECTIONS = [
  ['sentences','Sätze'],
  ['words','Wörter'],
  ['dialogues','Dialoge'],
  ['pronunciation','Aussprache'],
  ['writing','Schreiben'],
  ['listening','Hören'],
  ['memory','Memory']
];

export function getPositiveItem(section, index, data) {
  const sentence = data.sentences[index % data.sentences.length];
  const word = data.words[index % data.words.length];

  if (section === 'words' || section === 'memory') return word;
  if (section === 'dialogues') return `${sentence} — Ja, ich mache weiter.`;
  if (section === 'writing') return `Schreibe weiter: ${sentence}`;
  return sentence;
}
