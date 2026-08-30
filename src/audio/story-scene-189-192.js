import { stopStoryEffects } from './story-effects.js?v=270';
import { getStorySfxSrc } from './story-sfx.js?v=268';

const SCENE_PAGES=new Set([189,190,191,192]);
const CROWD_URL=getStorySfxSrc('crowd');
const VOLUME=.36;

let audio=null;
let lastPage=-1;
let lastEnabled=null;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function getAudio(){
  if(audio)return audio;
  const player=new Audio(CROWD_URL);
  player.setAttribute('playsinline','');
  player.preload='auto';
  player.loop=true;
  player.volume=VOLUME;
  player.onerror=()=>console.warn('Fight crowd ambience failed to load.');
  audio=player;
  return player;
}

function stopCrowd(){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){}
}

function startCrowd(root,store){
  if(!store.getState().audioOn||!isTargetStory(root))return;
  stopStoryEffects();
  const player=getAudio();
  player.muted=false;
  player.loop=true;
  player.volume=VOLUME;
  if(!player.paused&&!player.ended)return;
  try{player.currentTime=0;}catch(_){}
  void Promise.resolve(player.play()).catch(error=>{
    console.warn('Fight crowd ambience playback failed.',error);
  });
}

function navigationTarget(root,event){
  const button=event.target?.closest?.('[data-next],[data-prev]');
  if(!button)return 0;
  const page=currentPage(root);
  return page?page+(button.matches('[data-next]')?1:-1):0;
}

export function installScene189192(root,store){
  if(root.dataset.fightCrowd189192Installed==='1')return;
  root.dataset.fightCrowd189192Installed='1';

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root))startCrowd(root,store);
    else stopCrowd();
  };

  root.addEventListener('pointerdown',event=>{
    const target=navigationTarget(root,event);
    if(target){
      if(SCENE_PAGES.has(target)&&store.getState().audioOn&&isTargetStory(root))startCrowd(root,store);
      else if(SCENE_PAGES.has(currentPage(root)))stopCrowd();
      return;
    }
    if(SCENE_PAGES.has(currentPage(root))&&store.getState().audioOn&&isTargetStory(root))startCrowd(root,store);
  },{capture:true});

  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
