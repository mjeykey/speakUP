import { stopStoryRainSfx } from './story-sfx-smooth.js?v=257';

const OUTDOOR_PAGE_RANGES=[
  [105,128],
  [161,164],
  [181,188],
  [209,232]
];

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function isOutdoorPage(page){
  return OUTDOOR_PAGE_RANGES.some(([start,end])=>page>=start&&page<=end);
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
