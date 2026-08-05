import { getSentenceLevels as getLevelsWithMotivation } from './motivational-sentence-pack.js?v=1';

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

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  const levels = getLevelsWithMotivation(learningLanguage, nativeLanguage);
  const motivation = levels.find(level => level.id === 'motivation');
  const visibleLevels = levels.filter(level => level.id !== 'motivation');

  if (!motivation?.items?.length || !visibleLevels.length) return visibleLevels;

  return visibleLevels.map((level, levelIndex) => {
    const additions = motivation.items.filter((_, itemIndex) => itemIndex % visibleLevels.length === levelIndex);
    return {
      ...level,
      items: interleave(level.items, additions)
    };
  });
}
