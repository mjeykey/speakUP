import { fantasyStory } from '../data/stories/fantasy.js?v=3';
import { renderStory as renderBaseStory } from './story-live.js?v=290';

function applyStorySoundOverrides(){
  fantasyStory.pages.forEach(page=>{
    if(page.sound==='crowd')page.sound='none';
  });

  // Visible pages 189–192 = source paragraph 48 (zero-based index 47).
  // This is the fight in the aisle, where passengers are shouting.
  // Keep the crowd effect on this one scene while older crowd markers remain muted.
  if(fantasyStory.pages[47])fantasyStory.pages[47].sound='crowd';

  // Visible pages 81–84 = source paragraph 21 (zero-based index 20).
  // A dedicated continuous water-stream scene handles this range.
  if(fantasyStory.pages[20])fantasyStory.pages[20].sound='none';

  // Visible pages 97–100 = source paragraph 25 (zero-based index 24).
  // Use the same engine-start sound as the earlier engine scene.
  if(fantasyStory.pages[24])fantasyStory.pages[24].sound='engine-start';

  // Visible pages 153–156 = source paragraph 39 (zero-based index 38).
  // Dedicated rain-on-wagon-roof scene handles this range.
  if(fantasyStory.pages[38])fantasyStory.pages[38].sound='none';

  // Visible pages 157–176 = source paragraphs 40–44 (zero-based 39–43).
  // Dedicated scene modules own these sounds. Rain on 161–164 still comes
  // from OUTDOOR_RAIN_PAGES in story-live.js and therefore keeps running.
  [39,40,41,42,43].forEach(index=>{
    if(fantasyStory.pages[index])fantasyStory.pages[index].sound='none';
  });
}

export function renderStory(root,store){
  applyStorySoundOverrides();
  return renderBaseStory(root,store);
}
