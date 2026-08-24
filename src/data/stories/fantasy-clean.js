import { fantasyStory as sourceFantasyStory } from './fantasy.js?v=3';

export const fantasyStory={
  ...sourceFantasyStory,
  pages:sourceFantasyStory.pages.map(page=>page.sound==='crowd'?{...page,sound:'none'}:page)
};
