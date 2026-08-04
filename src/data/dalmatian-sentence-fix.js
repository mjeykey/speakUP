export function fixDalmatianSentence(levels) {
  return levels.map(level => ({
    ...level,
    items: level.items.map(item => {
      let answerIndex = 0;
      const complete = String(item.sentence || '').replace(/_____/g, () => item.answers?.[answerIndex++] || '');
      if (complete !== 'Učin dalmatinski govor.') return item;
      return {
        ...item,
        sentence: 'Učin _____.',
        answers: ['engleski'],
        options: ['engleski', 'kavu', 'doma', 'pomalo']
      };
    })
  }));
}
