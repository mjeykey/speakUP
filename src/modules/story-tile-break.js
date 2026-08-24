import { renderStory as renderBaseStory } from './story-live.js?v=219';

const TILE_BREAK_DELAY_MS=5000;
const EFFECT_PAGES=new Set([73,74,75,76]);
const TILE_BREAK_B64_URL=new URL('../../assets/audio/tile-break.b64?v=221',import.meta.url).href;
const WIND_URL=new URL('../../assets/audio/dragon-studio-wind-blowing-sfx-06-423674-mobile.mp3?v=222',import.meta.url).href;
const WIND_VOLUME=.28;
let tileBreakTimer=0;
let tileBreakAudio=null;
let tileBreakBlobUrl='';
let tileBreakLoadPromise=null;
let windAudio=null;

function stopTileBreak(){
  clearTimeout(tileBreakTimer);
  tileBreakTimer=0;
  if(tileBreakAudio){
    try{tileBreakAudio.pause();tileBreakAudio.currentTime=0;}catch(_){}
    tileBreakAudio=null;
  }
}

function stopWind(){
  if(!windAudio)return;
  try{windAudio.pause();windAudio.currentTime=0;}catch(_){}
  windAudio=null;
}

function ensureWind(){
  if(windAudio&&!windAudio.paused&&!windAudio.ended)return;
  stopWind();
  const audio=new Audio(WIND_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=true;
  audio.volume=WIND_VOLUME;
  windAudio=audio;
  audio.onerror=()=>{if(windAudio===audio)windAudio=null;};
  void audio.play().catch(error=>{
    if(windAudio===audio)windAudio=null;
    console.warn('Wind ambience playback failed.',error);
  });
}

async function tileBreakSrc(){
  if(tileBreakBlobUrl)return tileBreakBlobUrl;
  if(tileBreakLoadPromise)return tileBreakLoadPromise;
  tileBreakLoadPromise=(async()=>{
    const response=await fetch(TILE_BREAK_B64_URL,{cache:'force-cache'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const encoded=(await response.text()).replace(/\s+/g,'');
    const binary=atob(encoded);
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i+=1)bytes[i]=binary.charCodeAt(i);
    tileBreakBlobUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
    return tileBreakBlobUrl;
  })().finally(()=>{tileBreakLoadPromise=null;});
  return tileBreakLoadPromise;
}

function currentDisplayPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function scheduleTileBreak(root,scheduledPage){
  stopTileBreak();
  tileBreakTimer=window.setTimeout(async()=>{
    tileBreakTimer=0;
    if(currentDisplayPage(root)!==scheduledPage)return;
    try{
      const audio=new Audio(await tileBreakSrc());
      audio.setAttribute('playsinline','');
      audio.preload='auto';
      audio.loop=false;
      audio.volume=.9;
      tileBreakAudio=audio;
      audio.onended=()=>{if(tileBreakAudio===audio)tileBreakAudio=null;};
      audio.onerror=()=>{if(tileBreakAudio===audio)tileBreakAudio=null;};
      await audio.play();
    }catch(error){
      console.warn('Tile-break playback failed.',error);
    }
  },TILE_BREAK_DELAY_MS);
}

export function renderStory(root,store){
  renderBaseStory(root,store);
  let lastPage=-1;

  const syncEffects=()=>{
    const page=currentDisplayPage(root);
    const audioEnabled=Boolean(store.getState().audioOn);
    if(!audioEnabled||!EFFECT_PAGES.has(page)){
      stopTileBreak();
      stopWind();
      lastPage=page;
      return;
    }

    ensureWind();
    if(page!==lastPage)scheduleTileBreak(root,page);
    lastPage=page;
  };

  syncEffects();
  const observer=new MutationObserver(syncEffects);
  observer.observe(root,{childList:true,subtree:true});
}
