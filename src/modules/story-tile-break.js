import { renderStory as renderBaseStory } from './story-live.js?v=226';
import { stopStoryEffects } from '../audio/story-effects.js?v=218';

const TILE_BREAK_DELAY_BY_PAGE=new Map([[73,7200],[74,9200],[75,7600],[76,9200]]);
const WAGON_IMPACT_DELAY_SECONDS=6;
const EFFECT_PAGES=new Set([73,74,75,76]);
const TILE_BREAK_B64_URL=new URL('../../assets/audio/tile-break.b64?v=221',import.meta.url).href;
const WAGON_IMPACT_URL=new URL('../../assets/audio/dragon-studio-hammer-smash-effect-382731-mobile.mp3?v=229',import.meta.url).href;
let tileBreakTimer=0;
let tileBreakAudio=null;
let tileBreakBlobUrl='';
let tileBreakLoadPromise=null;
let wagonContext=null;
let wagonBufferPromise=null;
let wagonSource=null;
let wagonScheduledPage=0;

function stopTileBreak(){
  clearTimeout(tileBreakTimer);
  tileBreakTimer=0;
  if(tileBreakAudio){
    try{tileBreakAudio.pause();tileBreakAudio.currentTime=0;}catch(_){}
    tileBreakAudio=null;
  }
}

function getWagonContext(){
  if(wagonContext)return wagonContext;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return null;
  wagonContext=new AudioContextClass();
  return wagonContext;
}

async function wagonBuffer(){
  if(wagonBufferPromise)return wagonBufferPromise;
  const context=getWagonContext();
  if(!context)throw new Error('Web Audio is unavailable');
  wagonBufferPromise=(async()=>{
    const response=await fetch(WAGON_IMPACT_URL,{cache:'force-cache'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const bytes=await response.arrayBuffer();
    return context.decodeAudioData(bytes.slice(0));
  })().catch(error=>{
    wagonBufferPromise=null;
    throw error;
  });
  return wagonBufferPromise;
}

function stopWagonTrack(){
  wagonScheduledPage=0;
  if(!wagonSource)return;
  try{wagonSource.stop();}catch(_){}
  try{wagonSource.disconnect();}catch(_){}
  wagonSource=null;
}

async function scheduleWagonTrack(root,scheduledPage){
  if(!EFFECT_PAGES.has(scheduledPage))return;
  stopWagonTrack();
  wagonScheduledPage=scheduledPage;
  try{
    const context=getWagonContext();
    if(!context)return;
    if(context.state!=='running')await context.resume();
    const buffer=await wagonBuffer();
    if(wagonScheduledPage!==scheduledPage)return;
    const source=context.createBufferSource();
    const gain=context.createGain();
    source.buffer=buffer;
    gain.gain.value=.82;
    source.connect(gain);
    gain.connect(context.destination);
    wagonSource=source;
    source.onended=()=>{
      if(wagonSource===source)wagonSource=null;
      try{source.disconnect();gain.disconnect();}catch(_){}
    };
    const startAt=context.currentTime+WAGON_IMPACT_DELAY_SECONDS;
    source.start(startAt);
    window.setTimeout(()=>{
      if(currentDisplayPage(root)!==scheduledPage&&wagonSource===source)stopWagonTrack();
    },WAGON_IMPACT_DELAY_SECONDS*1000+150);
  }catch(error){
    console.warn('Dedicated wagon Web Audio playback failed.',error);
  }
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
  const delay=TILE_BREAK_DELAY_BY_PAGE.get(scheduledPage)??8000;
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
  },delay);
}

export function renderStory(root,store){
  renderBaseStory(root,store);
  let lastPage=-1;

  void wagonBuffer().catch(()=>{});

  const armWagonFromGesture=event=>{
    if(!store.getState().audioOn)return;
    const current=currentDisplayPage(root);
    const nextButton=event.target.closest?.('[data-next]');
    const prevButton=event.target.closest?.('[data-prev]');
    const targetPage=nextButton?current+1:prevButton?current-1:current;
    if(EFFECT_PAGES.has(targetPage))void scheduleWagonTrack(root,targetPage);
  };
  root.addEventListener('pointerdown',armWagonFromGesture,{capture:true});

  const syncEffects=()=>{
    const page=currentDisplayPage(root);
    const audioEnabled=Boolean(store.getState().audioOn);

    if(!audioEnabled||!EFFECT_PAGES.has(page)){
      stopTileBreak();
      if(wagonScheduledPage&&page!==wagonScheduledPage)stopWagonTrack();
      lastPage=page;
      return;
    }

    stopStoryEffects();
    if(page!==lastPage)scheduleTileBreak(root,page);
    lastPage=page;
  };

  syncEffects();
  const observer=new MutationObserver(syncEffects);
  observer.observe(root,{childList:true,subtree:true});
}
