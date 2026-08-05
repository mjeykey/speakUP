export const POSITIVE_SECTIONS = [
  ['sentences','Sätze'],
  ['words','Wörter'],
  ['stories','Geschichten'],
  ['dialogues','Dialoge'],
  ['pronunciation','Aussprache'],
  ['writing','Schreiben'],
  ['listening','Hören'],
  ['memory','Memory']
];

export function getPositiveCollection(section, data) {
  if (section === 'words') return data.words || [];
  if (section === 'stories') return data.stories || [];
  if (section === 'memory') return data.memory || [];
  return data.sentences || [];
}

export function getPositiveItem(section, index, data) {
  const collection = getPositiveCollection(section, data);
  const item = collection[index % Math.max(collection.length, 1)] || '';

  if (section === 'dialogues') return `${item} — Ja, ich mache weiter.`;
  if (section === 'writing') return `Schreibe weiter: ${item}`;
  return item;
}
