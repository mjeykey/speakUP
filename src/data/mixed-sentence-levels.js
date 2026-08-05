import { getSentenceLevels as getLevelsWithMotivation } from './extended-motivational-sentence-pack.js?v=2';

const TARGET_TOTAL = 50;

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

  if (!visibleLevels.length) return [];

  const existingTotal = visibleLevels.reduce((sum, level) => sum + level.items.length, 0);
  const needed = Math.max(0, TARGET_TOTAL - existingTotal);
  const additions = (motivation?.items || []).slice(0, needed);

  return visibleLevels.map((level, levelIndex) => {
    const levelAdditions = additions.filter((_, itemIndex) => itemIndex % visibleLevels.length === levelIndex);
    return {
      ...level,
      items: interleave(level.items, levelAdditions)
    };
  });
}
