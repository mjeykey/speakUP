import { getSentenceLevels as getLevelsWithMotivation } from './extended-motivational-sentence-pack.js?v=3';

const TARGET_PER_LEVEL = 50;

function interleave(existingItems, addedItems) {
  if (!addedItems.length) return existingItems;

  const result = [];
  const interval = Math.max(1, Math.ceil(existingItems.length / addedItems.length));
  let addedIndex = 0;

  existingItems.forEach((item, index) => {
    result.push(item);
    if ((index + 1) % interval === 0 && addedIndex < addedItems.length) {
      result.push(addedItems[addedIndex]);
      addedIndex += 1;
    }
  });

  return [...result, ...addedItems.slice(addedIndex)];
}

function fillToTarget(items, source, target) {
  const needed = Math.max(0, target - items.length);
  if (!needed || !source.length) return items.slice(0, target);

  const additions = Array.from({ length: needed }, (_, index) => source[index % source.length]);
  return interleave(items, additions).slice(0, target);
}

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  const levels = getLevelsWithMotivation(learningLanguage, nativeLanguage);
  const motivation = levels.find(level => level.id === 'motivation');
  const visibleLevels = levels.filter(level => ['beginner', 'survivor', 'explorer'].includes(level.id));
  const motivationalItems = motivation?.items || [];

  return visibleLevels.map(level => ({
    ...level,
    items: fillToTarget(level.items || [], motivationalItems, TARGET_PER_LEVEL)
  }));
}
