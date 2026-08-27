import { stopStoryEffects } from './story-effects.js?v=270';

const SCENE_PAGES=new Set([161,162,163,164]);
const WOOD_CREAK_URL=new URL('../../assets/audio/voicebosch-creaking-wood-199971-mobile.mp3?v=287',import.meta.url).href;
const player=new Audio(WOOD_CREAK_URL);
player.setAttribute('playsinline','');
player.preload='auto';
player.loop=false;
player.volume=1;

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

function stopWoodCreak(reset=true){
  try{player.pause();player.currentTime=0;}catch(_){}
  if(reset)requestedPage=-1;
}

async function playForPage(root,store,page,{pending=false}={}){
  if(requestedPage===page)return;
  if(!SCENE_PAGES.has(page)||!store.getState().audioOn||!isTargetStory(root))return;
  requestedPage=page;
  stopStoryEffects();
  stopWoodCreak(false);
  try{
    if(!pending&&currentPage(root)!==page){requestedPage=-1;return;}
    player.muted=false;
    player.volume=1;
    player.currentTime=0;
    await player.play();
  }catch(error){
    requestedPage=-1;
    console.warn('Wood-creaking playback failed.',error);
  }
}

function navigationTarget(root,event){
  const button=event.target?.closest?.('[data-next],[data-prev]');
  if(!button)return 0;
  const page=currentPage(root);
  return page? page+(button.matches('[data-next]')?1:-1):0;
}

export function installScene161164(root,store){
  if(root.dataset.woodCreak161164Installed==='1')return;
  root.dataset.woodCreak161164Installed='1';
  try{player.load();}catch(_){}

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root)){
      stopStoryEffects();
      if(requestedPage!==page)void playForPage(root,store,page);
    }else stopWoodCreak();
  };

  const handlePointer=event=>{
    const target=navigationTarget(root,event);
    if(target){
      if(SCENE_PAGES.has(target)&&store.getState().audioOn&&isTargetStory(root))void playForPage(root,store,target,{pending:true});
      else if(SCENE_PAGES.has(currentPage(root)))stopWoodCreak();
      return;
    }
    const page=currentPage(root);
    if(SCENE_PAGES.has(page)&&store.getState().audioOn&&isTargetStory(root)&&player.paused){
      requestedPage=-1;
      void playForPage(root,store,page,{pending:true});
    }
  };

  root.addEventListener('pointerdown',handlePointer,{capture:true});
  root.addEventListener('click',handlePointer,{capture:true});
  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
