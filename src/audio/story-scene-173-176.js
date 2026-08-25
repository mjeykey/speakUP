import { stopStoryEffects } from './story-effects.js?v=270';
import { getBase64AudioSource } from './story-b64-source.js?v=285';

const SCENE_PAGES=new Set([173,174,175,176]);
const PART_URLS=[0,1,2,3].map(index=>new URL(`../../assets/audio/keys-173-176.part0${index}.b64?v=285`,import.meta.url).href);
let audio=null;
let requestedPage=-1;
let lastPage=-1;
let lastEnabled=null;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}
function isTargetStory(root){return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');}

async function getAudio(){
  if(audio)return audio;
  const player=new Audio(await getBase64AudioSource(PART_URLS));
  player.setAttribute('playsinline','');
  player.preload='auto';
  player.loop=false;
  player.volume=.88;
  audio=player;
  return player;
}

function stopKeys(reset=true){
  if(audio){try{audio.pause();audio.currentTime=0;}catch(_){}}
  if(reset)requestedPage=-1;
}

async function playForPage(root,store,page,{pending=false}={}){
  if(requestedPage===page)return;
  if(!SCENE_PAGES.has(page)||!store.getState().audioOn||!isTargetStory(root))return;
  requestedPage=page;
  stopStoryEffects();
  stopKeys(false);
  try{
    const player=await getAudio();
    if(!pending&&currentPage(root)!==page){requestedPage=-1;return;}
    player.muted=false;
    player.volume=.88;
    player.currentTime=0;
    await player.play();
  }catch(error){
    requestedPage=-1;
    console.warn('Keys playback failed.',error);
  }
}

function navigationTarget(root,event){
  const button=event.target?.closest?.('[data-next],[data-prev]');
  if(!button)return 0;
  const page=currentPage(root);
  return page? page+(button.matches('[data-next]')?1:-1):0;
}

export function installScene173176(root,store){
  if(root.dataset.keys173176Installed==='1')return;
  root.dataset.keys173176Installed='1';
  void getBase64AudioSource(PART_URLS).catch(()=>{});

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root)){
      stopStoryEffects();
      if(requestedPage!==page)void playForPage(root,store,page);
    }else stopKeys();
  };

  const handlePointer=event=>{
    const target=navigationTarget(root,event);
    if(target){
      if(SCENE_PAGES.has(target)&&store.getState().audioOn&&isTargetStory(root))void playForPage(root,store,target,{pending:true});
      else if(SCENE_PAGES.has(currentPage(root)))stopKeys();
      return;
    }
    const page=currentPage(root);
    if(SCENE_PAGES.has(page)&&store.getState().audioOn&&isTargetStory(root)&&(!audio||audio.paused)){
      requestedPage=-1;
      void playForPage(root,store,page,{pending:true});
    }
  };

  root.addEventListener('pointerdown',handlePointer,{capture:true});
  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
