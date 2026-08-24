import { stopStoryRainSfx } from './story-sfx-smooth.js?v=258';

// Zero-based source paragraphs where the characters are genuinely outside
// and exposed to the storm. Every source paragraph is rendered as 4 visible pages.
// Rain is forced OFF everywhere else: stables, inside the wagon, inside the watchtower,
// and after the mountain gate.
const OUTDOOR_SOURCE_PAGES=new Set([
  2,
  26,27,28,29,30,31,
  40,
  45,46,
  51,52,53,54,55,56,57
]);

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function sourcePageIndex(displayPage){
  return displayPage>0?Math.floor((displayPage-1)/4):-1;
}

function isOutdoorPage(displayPage){
  return OUTDOOR_SOURCE_PAGES.has(sourcePageIndex(displayPage));
}

function enforceRainContext(root){
  if(!isTargetStory(root))return;
  const page=currentPage(root);
  if(page>0&&!isOutdoorPage(page))stopStoryRainSfx();
}

export function installRainContext(root){
  if(root.dataset.rainContextInstalled==='1')return;
  root.dataset.rainContextInstalled='1';

  const observer=new MutationObserver(()=>enforceRainContext(root));
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  root.addEventListener('pointerdown',()=>enforceRainContext(root),{capture:true});
  root.addEventListener('click',()=>enforceRainContext(root),{capture:true});
  enforceRainContext(root);
}
