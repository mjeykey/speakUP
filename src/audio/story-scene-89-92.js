import { stopStoryEffects } from './story-effects.js?v=250';

const SCENE_PAGES=new Set([89,90,91,92]);
const CRACK_DELAY_BY_PAGE=new Map([[89,450],[90,650],[91,700],[92,650]]);
const CRACK_B64_PART_URLS=[
  new URL('../../assets/audio/stone-floor-crack-fast.part0?v=252',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack-fast.part1?v=252',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack-fast.part2?v=252',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack-fast.part3?v=252',import.meta.url).href
];

let timer=0;
let silenceTimers=[];
let audio=null;
let objectUrl='';
let loadPromise=null;
let lastPage=-1;
let lastEnabled=null;
let scheduledPage=-1;
let playedPage=-1;
let primed=false;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  const title=root.querySelector('h1')?.textContent||'';
  const subtitle=root.querySelector('.story-subtitle')?.textContent||'';
  return /Last Wagon of Avarin/i.test(`${title} ${subtitle}`);
}

async function crackSrc(){
  if(objectUrl)return objectUrl;
  if(loadPromise)return loadPromise;

  loadPromise=(async()=>{
    const responses=await Promise.all(
      CRACK_B64_PART_URLS.map(url=>fetch(url,{cache:'force-cache'}))
    );
    const failed=responses.find(response=>!response.ok);
    if(failed)throw new Error(`HTTP ${failed.status}`);
    const encoded=(await Promise.all(responses.map(response=>response.text())))
      .join('')
      .replace(/\s+/g,'');
    const binary=atob(encoded);
    const bytes=new Uint8Array(binary.length);
    for(let index=0;index<binary.length;index+=1)bytes[index]=binary.charCodeAt(index);
    objectUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
    return objectUrl;
  })().catch(error=>{
    loadPromise=null;
    throw error;
  });

  return loadPromise;
}

function stopTrack(track){
  if(!track)return;
  try{track.pause();}catch(_){}
  try{track.currentTime=0;}catch(_){}
}

function clearSilenceTimers(){
  silenceTimers.forEach(id=>clearTimeout(id));
  silenceTimers=[];
}

function silenceLegacyThunder(){
  clearSilenceTimers();
  stopStoryEffects();
  silenceTimers=[0,80,300].map(delay=>window.setTimeout(stopStoryEffects,delay));
}

function stopCrack(){
  clearTimeout(timer);
  timer=0;
  scheduledPage=-1;
  stopTrack(audio);
  audio=null;
}

async function primeCrack(){
  if(primed)return;
  try{
    const probe=new Audio(await crackSrc());
    probe.setAttribute('playsinline','');
    probe.muted=true;
    probe.volume=0;
    await probe.play();
    probe.pause();
    probe.currentTime=0;
    primed=true;
  }catch(_){}
}

async function playCrack(root,page,store){
  scheduledPage=-1;
  if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;

  try{
    const track=new Audio(await crackSrc());
    if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
    stopTrack(audio);
    track.setAttribute('playsinline','');
    track.preload='auto';
    track.loop=false;
    track.volume=.48;
    audio=track;
    track.onended=()=>{if(audio===track)audio=null;};
    track.onerror=()=>{if(audio===track)audio=null;playedPage=-1;};
    await track.play();
    playedPage=page;
  }catch(error){
    playedPage=-1;
    console.warn('Stone-floor crack playback failed.',error);
  }
}

function sync(root,store){
  const page=currentPage(root);
  const enabled=Boolean(store.getState().audioOn);
  const target=enabled&&SCENE_PAGES.has(page)&&isTargetStory(root);

  if(page!==lastPage||enabled!==lastEnabled){
    stopCrack();
    clearSilenceTimers();
    playedPage=-1;
    lastPage=page;
    lastEnabled=enabled;
  }

  if(!target)return;
  silenceLegacyThunder();
  if(playedPage===page||scheduledPage===page)return;

  scheduledPage=page;
  const delay=CRACK_DELAY_BY_PAGE.get(page)??600;
  timer=window.setTimeout(()=>{
    timer=0;
    void playCrack(root,page,store);
  },delay);
}

export function installScene8992(root,store){
  if(root.dataset.scene8992Installed==='1')return;
  root.dataset.scene8992Installed='1';

  void crackSrc().catch(()=>{});
  const unlock=()=>{
    if(store.getState().audioOn)void primeCrack();
  };

  const observer=new MutationObserver(()=>sync(root,store));
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  root.addEventListener('pointerdown',unlock,{capture:true});
  root.addEventListener('click',unlock,{capture:true});
  root.addEventListener('pointerdown',()=>sync(root,store),{capture:true});
  root.addEventListener('click',()=>sync(root,store),{capture:true});
  sync(root,store);
}
