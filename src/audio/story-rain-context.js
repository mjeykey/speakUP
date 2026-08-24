import { isStorySfxPlaying, playStorySfx, setStorySfxVolume, stopStoryRainSfx } from './story-sfx-smooth.js?v=258';

const RAIN_VOLUME=.04;

// Zero-based source paragraphs where the characters are genuinely outside.
// Every source paragraph is rendered as 4 visible pages.
// Everywhere else the rain is forced OFF: stables, inside the wagon,
// inside the watchtower, and after the mountain gate.
const OUTDOOR_SOURCE_PAGES=new Set([
  2,
  26,27,28,29,30,31,32,
  40,
  45,46,
  51,52,53,54,55,56,57,58
]);

let syncToken=0;

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

function applyRainContext(root,store){
  if(!isTargetStory(root)){
    stopStoryRainSfx();
    return;
  }

  const page=currentPage(root);
  const audioEnabled=Boolean(store?.getState?.().audioOn);
  const shouldRain=page>0&&audioEnabled&&isOutdoorPage(page);

  if(!shouldRain){
    stopStoryRainSfx();
    return;
  }

  if(isStorySfxPlaying('rain')){
    setStorySfxVolume('rain',RAIN_VOLUME);
  }else{
    void playStorySfx('rain',{enabled:true,loop:true,volume:RAIN_VOLUME});
  }
}

function syncRain(root,store){
  const token=++syncToken;
  applyRainContext(root,store);

  // Catch any delayed rain playback started by another scene transition.
  [80,250].forEach(delay=>{
    window.setTimeout(()=>{
      if(token===syncToken)applyRainContext(root,store);
    },delay);
  });
}

export function installRainContext(root,store){
  if(root.dataset.rainContextInstalled==='1')return;
  root.dataset.rainContextInstalled='1';

  const sync=()=>syncRain(root,store);
  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  root.addEventListener('pointerdown',sync,{capture:true});
  root.addEventListener('click',sync,{capture:true});
  sync();
}
