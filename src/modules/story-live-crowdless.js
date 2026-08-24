import { fantasyStory } from '../data/stories/fantasy.js?v=3';
import { renderStory as renderBaseStory } from './story-live.js?v=256';

function removeCrowdEffects(){
  fantasyStory.pages.forEach(page=>{
    if(page.sound==='crowd')page.sound='none';
  });
}

export function renderStory(root,store){
  removeCrowdEffects();
  return renderBaseStory(root,store);
}
