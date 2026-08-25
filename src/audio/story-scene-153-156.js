import { stopStoryEffects } from './story-effects.js?v=270';

const SCENE_PAGES=new Set([153,154,155,156]);
const RAIN_URL=new URL('../../assets/audio/juliush-rain-on-a-car-roof-nature-sounds-8448.mp3?v=281',import.meta.url).href;

let lastPage=-1;
let lastEnabled=null;
let active=false;
let primed=false;

const rain=new Audio(RAIN_URL);
rain.setAttribute('playsinline','');
rain.preload='auto';
rain.loop=true;
rain.volume=.32;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function stopScene(){
  active=false;
  try{
    rain.pause();
    rain.currentTime=0;
    rain.muted=false;
    rain.volume=.32;
  }catch(_){}
}

function primeScene(){
  if(primed)return;
  const oldVolume=rain.volume;
  rain.muted=true;
  rain.volume=0;
  const promise=rain.play();
  if(!promise||typeof promise.then!=='function'){
    rain.muted=false;
    rain.volume=oldVolume;
    return;
  }
  promise.then(()=>{
    rain.pause();
    rain.currentTime=0;
    rain.muted=false;
    rain.volume=oldVolume;
    primed=true;
  }).catch(()=>{
    rain.muted=false;
    rain.volume=oldVolume;
  });
}

async function playScene(root,store){
  if(active)return;
  if(!SCENE_PAGES.has(currentPage(root))||!isTargetStory(root)||!store.getState().audioOn)return;

  stopStoryEffects();

  try{
    rain.pause();
    rain.currentTime=0;
    rain.muted=false;
    rain.volume=.32;
    await rain.play();
    if(!SCENE_PAGES.has(currentPage(root))||!isTargetStory(root)||!store.getState().audioOn){
      stopScene();
      return;
    }
    active=true;
  }catch(error){
    active=false;
    console.warn('Car-roof rain playback failed.',error);
  }
}

export function stopScene153156(){
  lastPage=-1;
  lastEnabled=null;
  stopScene();
}

export function installScene153156(root,store){
  if(root.dataset.carRoofRain153156Installed==='1')return;
  root.dataset.carRoofRain153156Installed='1';
  try{rain.load();}catch(_){}

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
