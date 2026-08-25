import { stopStoryEffects } from './story-effects.js?v=270';

const SCENE_PAGES=new Set([153,154,155,156]);
const DIRECT_RAIN_URL=new URL('../../assets/audio/rain-natural-mobile.mp3?v=279',import.meta.url).href;
const WIND_URL=new URL('../../assets/audio/dragon-studio-wind-blowing-sfx-06-423674-mobile.mp3?v=279',import.meta.url).href;
const RAIN_PART_URLS=[
  new URL('../../assets/audio/rain-wagon-roof-loop.part0.b64?v=279',import.meta.url).href,
  new URL('../../assets/audio/rain-wagon-roof-loop.part1.b64?v=279',import.meta.url).href,
  new URL('../../assets/audio/rain-wagon-roof-loop.part2.b64?v=279',import.meta.url).href
];

let lastPage=-1;
let lastEnabled=null;
let active=false;
let primed=false;
let roofRain=null;
let objectUrl='';
let loadPromise=null;

function makeLoop(src,volume){
  const track=new Audio(src);
  track.setAttribute('playsinline','');
  track.preload='auto';
  track.loop=true;
  track.volume=volume;
  return track;
}

const directRain=makeLoop(DIRECT_RAIN_URL,.96);
const wind=makeLoop(WIND_URL,.28);

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

async function roofRainSrc(){
  if(objectUrl)return objectUrl;
  if(loadPromise)return loadPromise;

  loadPromise=(async()=>{
    const responses=await Promise.all(
      RAIN_PART_URLS.map(url=>fetch(url,{cache:'force-cache'}))
    );
    const failed=responses.find(response=>!response.ok);
    if(failed)throw new Error(`HTTP ${failed.status}`);

    const encoded=(await Promise.all(responses.map(response=>response.text())))
      .join('')
      .replace(/\s+/g,'');
    const binary=atob(encoded);
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);

    objectUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
    return objectUrl;
  })().catch(error=>{
    loadPromise=null;
    throw error;
  });

  return loadPromise;
}

async function ensureRoofRain(){
  if(roofRain)return roofRain;
  roofRain=makeLoop(await roofRainSrc(),.82);
  return roofRain;
}

function resetTrack(track){
  if(!track)return;
  try{track.pause();}catch(_){}
  try{track.currentTime=0;}catch(_){}
}

function stopScene(){
  active=false;
  resetTrack(directRain);
  resetTrack(wind);
  resetTrack(roofRain);
}

function primeTrack(track){
  const oldMuted=track.muted;
  const oldVolume=track.volume;
  track.muted=true;
  track.volume=0;
  const promise=track.play();
  if(!promise||typeof promise.then!=='function'){
    track.muted=oldMuted;
    track.volume=oldVolume;
    return;
  }
  promise.then(()=>{
    track.pause();
    track.currentTime=0;
    track.muted=oldMuted;
    track.volume=oldVolume;
  }).catch(()=>{
    track.muted=oldMuted;
    track.volume=oldVolume;
  });
}

function primeScene(){
  if(primed)return;
  primeTrack(directRain);
  primeTrack(wind);
  primed=true;
  void ensureRoofRain().then(track=>primeTrack(track)).catch(()=>{});
}

async function playScene(root,store){
  if(active)return;
  if(!SCENE_PAGES.has(currentPage(root))||!isTargetStory(root)||!store.getState().audioOn)return;

  stopStoryEffects();

  directRain.volume=.96;
  wind.volume=.28;
  directRain.currentTime=0;
  wind.currentTime=0;

  const immediate=await Promise.allSettled([
    directRain.play(),
    wind.play()
  ]);

  if(!SCENE_PAGES.has(currentPage(root))||!isTargetStory(root)||!store.getState().audioOn){
    stopScene();
    return;
  }

  active=immediate.some(result=>result.status==='fulfilled');

  try{
    const roof=await ensureRoofRain();
    if(!SCENE_PAGES.has(currentPage(root))||!isTargetStory(root)||!store.getState().audioOn)return;
    roof.volume=.82;
    roof.currentTime=0;
    await roof.play();
    active=true;
  }catch(error){
    console.warn('Wagon-roof rain layer failed.',error);
  }

  if(!active)stopScene();
}

export function stopScene153156(){
  lastPage=-1;
  lastEnabled=null;
  stopScene();
}

export function installScene153156(root,store){
  if(root.dataset.wagonRoofRain153156Installed==='1')return;
  root.dataset.wagonRoofRain153156Installed='1';
  try{directRain.load();wind.load();}catch(_){}
  void ensureRoofRain().catch(()=>{});

  const unlock=()=>{
    if(store.getState().audioOn)primeScene();
  };

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;

    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root))void playScene(root,store);
    else stopScene();
  };

  root.addEventListener('pointerdown',unlock,{capture:true});
  root.addEventListener('click',unlock,{capture:true});

  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
