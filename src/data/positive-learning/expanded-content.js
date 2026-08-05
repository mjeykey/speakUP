import { getPositiveContent } from './content.js?v=1';
import { POSITIVE_EXPANSION_V13 } from './expansion-v1-3.js?v=1';

export function getExpandedPositiveContent(languageCode) {
  const base = getPositiveContent(languageCode);
  const expansionCode = languageCode === 'hr-DAL'
    ? 'hr-HR'
    : languageCode === 'es-AN'
      ? 'es-ES'
      : languageCode;
  const expansion = POSITIVE_EXPANSION_V13[expansionCode] || POSITIVE_EXPANSION_V13['en-GB'];

  return {
    ...base,
    sentences: [...(base.sentences || []), ...(expansion.sentences || [])],
    words: [...(base.words || []), ...(expansion.words || [])],
    stories: [...(base.stories || []), ...(expansion.stories || [])],
    memory: [...(base.memory || []), ...(expansion.memory || [])]
  };
}
