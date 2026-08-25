import { stopStoryEffects } from './story-effects.js?v=270';

const SCENE_PAGES=new Set([153,154,155,156]);
const RAIN_URL=new URL('../../assets/audio/rain-natural-mobile.mp3?v=277',import.meta.url).href;
const WIND_URL=new URL('../../assets/audio/dragon-studio-wind-blowing-sfx-06-423674-mobile.mp3?v=277',import.meta.url).href;

let lastPage=-1;
let lastEnabled=null;
let active=false;
let primed=false;
let rainMain=null;
let rainTexture=null;
let wind=null;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function stopTrack(track){
  if(!track)return;
  try{track.pause();}catch(_){}
  try{track.currentTime=0;}catch(_){}
}

function stopScene(){
  active=false;
  stopTrack(rainMain);
  stopTrack(rainTexture);
  stopTrack(wind);
  rainMain=null;
  rainTexture=null;
  wind=null;
}

function makeTrack(src,{volume=1,rate=1}={}){
  const track=new Audio(src);
  track.setAttribute('playsinline','');
  track.preload='auto';
  track.loop=true;
  track.volume=volume;
  track.playbackRate=rate;
  return track;
}

async function primeScene(){
  if(primed)return;
  const probes=[makeTrack(RAIN_URL,{volume:0}),makeTrack(WIND_URL,{volume:0})];
  probes.forEach(track=>{track.muted=true;});
  await Promise.allSettled(probes.map(track=>track.play()));
  probes.forEach(track=>{try{track.pause();track.currentTime=0;}catch(_){}});
  primed=true;
}

async function playScene(root,store){
  if(active)return;
  if(!SCENE_PAGES.has(currentPage(root))||!isTargetStory(root)||!store.getState().audioOn)return;

  stopStoryEffects();

  const main=makeTrack(RAIN_URL,{volume:.82,rate:1});
  const texture=makeTrack(RAIN_URL,{volume:.34,rate:1.035});
  const gusts=makeTrack(WIND_URL,{volume:.42,rate:1});

  rainMain=main;
  rainTexture=texture;
  wind=gusts;

  const tracks=[main,texture,gusts];
  const results=await Promise.allSettled(tracks.map(track=>track.play()));

  if(!SCENE_PAGES.has(currentPage(root))||!isTargetStory(root)||!store.getState().audioOn){
    stopScene();
    return;
  }

  active=results.some(result=>result.status==='fulfilled');
  if(!active)stopScene();
}

export function stopScene153156(){
  lastPage=-1;
  lastEnabled=null;
  stopScene();
}

export function installScene153156(root,store){
  if(root.dataset.wagonStorm153156Installed==='1')return;
  root.dataset.wagonStorm153156Installed='1';

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
