import { renderStory as renderBaseStory } from './story-live-crowdless.js?v=290';
import { installScene7376 } from '../audio/story-scene-73-76.js?v=275';
import { installScene7780 } from '../audio/story-scene-77-80.js?v=246';
import { installScene8184 } from '../audio/story-scene-81-84.js?v=276';
import { installScene8992Direct } from '../audio/story-scene-89-92-direct.js?v=254';
import { installScene153156 } from '../audio/story-scene-153-156.js?v=283';
import { installScene157160 } from '../audio/story-scene-157-160.js?v=285';
import { installScene169172 } from '../audio/story-scene-169-172.js?v=285';
import { installScene173176 } from '../audio/story-scene-173-176.js?v=285';

export function renderStory(root,store){
  installScene7376(root,store);
  installScene7780(root,store);
  installScene8184(root,store);
  installScene8992Direct(root,store);
  installScene153156(root,store);
  installScene157160(root,store);
  installScene169172(root,store);
  installScene173176(root,store);
  return renderBaseStory(root,store);
}
