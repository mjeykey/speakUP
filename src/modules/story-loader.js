import { STORIES as cachedStories } from '../data/content.js?v=7';
import { STORIES as currentStories } from '../data/content.js?v=27';
import { renderStory } from './story.js?v=27';

// story.js may still hold the older cached array reference.
// Replace its contents in place so every story receives the current bilingual pages.
cachedStories.splice(0, cachedStories.length, ...currentStories);

export { renderStory };
