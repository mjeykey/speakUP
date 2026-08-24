import { fantasyStory } from '../data/stories/fantasy.js?v=3';
import { renderStory as renderBaseStory } from './story-live.js?v=267';

function applyStorySoundOverrides(){
  fantasyStory.pages.forEach(page=>{
    if(page.sound==='crowd')page.sound='none';
  });

  // Visible pages 97–100 = source paragraph 25 (zero-based index 24).
  // Use the same engine-start sound as the earlier engine scene.
  if(fantasyStory.pages[24])fantasyStory.pages[24].sound='engine-start';
}

export function renderStory(root,store){
  applyStorySoundOverrides();
  return renderBaseStory(root,store);
}
