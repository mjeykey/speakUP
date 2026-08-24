import { renderStory as renderBaseStory } from './story-live.js?v=232';
import { installScene7376 } from '../audio/story-scene-73-76.js?v=242';
import { installScene7780 } from '../audio/story-scene-77-80.js?v=246';

export function renderStory(root,store){
  installScene7376(root,store);
  installScene7780(root,store);
  return renderBaseStory(root,store);
}
