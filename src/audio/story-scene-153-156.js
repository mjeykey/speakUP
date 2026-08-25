import { stopStoryEffects } from './story-effects.js?v=270';

const SCENE_PAGES=new Set([153,154,155,156]);
const RAIN_PART_URLS=[
  new URL('../../assets/audio/rain-wagon-roof-loop.part0.b64?v=278',import.meta.url).href,
  new URL('../../assets/audio/rain-wagon-roof-loop.part1.b64?v=278',import.meta.url).href,
  new URL('../../assets/audio/rain-wagon-roof-loop.part2.b64?v=278',import.meta.url).href
];

let lastPage=-1;
let lastEnabled=null;
let active=false;
let primed=false;
let rain=null;
let objectUrl='';
let loadPromise=null;

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

function stopScene(){
  active=false;
  if(!rain)return;
  try{
    rain.pause();
    rain.currentTime=0;
  }catch(_){}
  rain=null;
}

function makeTrack(src,{volume=.46}={}){
  const track=new Audio(src);
  track.setAttribute('playsinline','');
  track.preload='auto';
  track.loop=true;
  track.volume=volume;
  return track;
}

async function primeScene(){
  if(primed)return;
  try{
    const probe=makeTrack(await roofRainSrc(),{volume:0});
    probe.muted=true;
    await probe.play();
    probe.pause();
    probe.currentTime=0;
    primed=true;
  }catch(_){}
}

async function playScene(root,store){
  if(active)return;
  if(!SCENE_PAGES.has(currentPage(root))||!isTargetStory(root)||!store.getState().audioOn)return;

  stopStoryEffects();

  try{
    const track=makeTrack(await roofRainSrc(),{volume:.46});
    if(!SCENE_PAGES.has(currentPage(root))||!isTargetStory(root)||!store.getState().audioOn)return;

    rain=track;
    await track.play();
    active=true;
    track.onerror=()=>{
      if(rain===track)stopScene();
    };
  }catch(error){
    active=false;
    console.warn('Wagon-roof rain playback failed.',error);
  }
}

export function stopScene153156(){
  lastPage=-1;
  lastEnabled=null;
  stopScene();
}

export function installScene153156(root,store){
  if(root.dataset.wagonRoofRain153156Installed==='1')return;
  root.dataset.wagonRoofRain153156Installed='1';
  void roofRainSrc().catch(()=>{});

  const unlock=()=>{
    if(store.getState().audioOn)void primeScene();
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
