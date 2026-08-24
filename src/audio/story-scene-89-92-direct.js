import { stopStoryEffects } from './story-effects.js?v=254';

const SCENE_PAGES=new Set([89,90,91,92]);
const CRACK_B64_PART_URLS=[
  new URL('../../assets/audio/stone-floor-crack-fast.part0?v=253',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack-fast.part1?v=253',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack-fast.part2?v=253',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack-tail0.bin?v=253',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack-tail1.bin?v=253',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack-tail2.bin?v=253',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack-tail3.bin?v=253',import.meta.url).href
];

let objectUrl='';
let sourcePromise=null;
let audio=null;
let lastPage=-1;
let lastEnabled=null;
let playedPage=-1;
let primed=false;
let thunderStopTimer=0;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

async function crackSrc(){
  if(objectUrl)return objectUrl;
  if(sourcePromise)return sourcePromise;

  sourcePromise=(async()=>{
    const responses=await Promise.all(CRACK_B64_PART_URLS.map(url=>fetch(url,{cache:'force-cache'})));
    const failed=responses.find(response=>!response.ok);
    if(failed)throw new Error(`HTTP ${failed.status}`);
    const encodedParts=await Promise.all(responses.map(response=>response.text()));
    const byteParts=encodedParts.map(encoded=>{
      const binary=atob(encoded.replace(/\s+/g,''));
      const bytes=new Uint8Array(binary.length);
      for(let i=0;i<binary.length;i+=1)bytes[i]=binary.charCodeAt(i);
      return bytes;
    });
    objectUrl=URL.createObjectURL(new Blob(byteParts,{type:'audio/mpeg'}));
    return objectUrl;
  })().catch(error=>{
    sourcePromise=null;
    throw error;
  });

  return sourcePromise;
}

async function ensureAudio(){
  if(audio)return audio;
  const track=new Audio(await crackSrc());
  track.setAttribute('playsinline','');
  track.preload='auto';
  track.loop=false;
  track.volume=.62;
  audio=track;
  return track;
}

function resetAudio(){
  if(!audio)return;
  try{audio.pause();}catch(_){}
  try{audio.currentTime=0;}catch(_){}
  audio.muted=false;
  audio.volume=.62;
}

function killThunder(){
  clearTimeout(thunderStopTimer);
  stopStoryEffects();
  thunderStopTimer=window.setTimeout(stopStoryEffects,80);
}

async function prime(){
  if(primed)return;
  try{
    const track=await ensureAudio();
    track.muted=true;
    track.volume=0;
    track.currentTime=0;
    await track.play();
    track.pause();
    track.currentTime=0;
    track.muted=false;
    track.volume=.62;
    primed=true;
  }catch(_){}
}

async function playCrack(root,page,store){
  if(currentPage(root)!==page||!SCENE_PAGES.has(page)||!isTargetStory(root)||!store.getState().audioOn)return;
  try{
    const track=await ensureAudio();
    if(currentPage(root)!==page||!store.getState().audioOn)return;
    resetAudio();
    track.muted=false;
    track.volume=.62;
    await track.play();
    playedPage=page;
  }catch(error){
    playedPage=-1;
    console.warn('Direct stone crack playback failed.',error);
  }
}

function sync(root,store){
  const page=currentPage(root);
  const enabled=Boolean(store.getState().audioOn);
  const target=enabled&&SCENE_PAGES.has(page)&&isTargetStory(root);

  if(page!==lastPage||enabled!==lastEnabled){
    clearTimeout(thunderStopTimer);
    resetAudio();
    playedPage=-1;
    lastPage=page;
    lastEnabled=enabled;
  }

  if(!target)return;
  killThunder();
  if(playedPage!==page)void playCrack(root,page,store);
}

export function installScene8992Direct(root,store){
  if(root.dataset.scene8992DirectInstalled==='1')return;
  root.dataset.scene8992DirectInstalled='1';

  void ensureAudio().catch(()=>{});

  const retry=()=>{
    if(store.getState().audioOn)void prime();
    const page=currentPage(root);
    if(SCENE_PAGES.has(page)&&playedPage!==page)void playCrack(root,page,store);
  };

  const observer=new MutationObserver(()=>sync(root,store));
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  root.addEventListener('pointerdown',retry,{capture:true});
  root.addEventListener('click',retry,{capture:true});
  sync(root,store);
}
