import { stopStoryEffects } from './story-effects.js?v=270';

const SCENE_PAGES=new Set([161,162,163,164]);
const FLOOR_URL=new URL('../../assets/audio/floorcracking-161-164.mp3?v=285',import.meta.url).href;
const player=new Audio(FLOOR_URL);
player.setAttribute('playsinline','');
player.preload='auto';
player.loop=false;
player.volume=.72;

let requestedPage=-1;
let lastPage=-1;
let lastEnabled=null;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function stopFloor(reset=true){
  try{player.pause();player.currentTime=0;}catch(_){}
  if(reset)requestedPage=-1;
}

async function playForPage(root,store,page,{pending=false}={}){
  if(requestedPage===page)return;
  if(!SCENE_PAGES.has(page)||!store.getState().audioOn||!isTargetStory(root))return;
  requestedPage=page;
  stopStoryEffects();
  stopFloor(false);
  try{
    if(!pending&&currentPage(root)!==page){requestedPage=-1;return;}
    player.muted=false;
    player.volume=.72;
    player.currentTime=0;
    await player.play();
  }catch(error){
    requestedPage=-1;
    console.warn('Floor-cracking playback failed.',error);
  }
}

function navigationTarget(root,event){
  const button=event.target?.closest?.('[data-next],[data-prev]');
  if(!button)return 0;
  const page=currentPage(root);
  return page? page+(button.matches('[data-next]')?1:-1):0;
}

export function installScene161164(root,store){
  if(root.dataset.floorCrack161164Installed==='1')return;
  root.dataset.floorCrack161164Installed='1';
  try{player.load();}catch(_){}

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root)){
      // stop generic wind/effects only; the separate story rain keeps running.
      stopStoryEffects();
      if(requestedPage!==page)void playForPage(root,store,page);
    }else stopFloor();
  };

  const handlePointer=event=>{
    const target=navigationTarget(root,event);
    if(target){
      if(SCENE_PAGES.has(target)&&store.getState().audioOn&&isTargetStory(root))void playForPage(root,store,target,{pending:true});
      else if(SCENE_PAGES.has(currentPage(root)))stopFloor();
      return;
    }
    const page=currentPage(root);
    if(SCENE_PAGES.has(page)&&store.getState().audioOn&&isTargetStory(root)&&player.paused){
      requestedPage=-1;
      void playForPage(root,store,page,{pending:true});
    }
  };

  root.addEventListener('pointerdown',handlePointer,{capture:true});
  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
