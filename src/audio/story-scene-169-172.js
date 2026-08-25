import { stopStoryEffects } from './story-effects.js?v=270';
import { getBase64AudioSource } from './story-b64-source.js?v=285';

const SCENE_PAGES=new Set([169,170,171,172]);
const PART_URLS=[0,1,2,3,4,5].map(index=>new URL(`../../assets/audio/haunted-169-172.part0${index}.b64?v=285`,import.meta.url).href);
let audio=null;
let wanted=false;
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
  player.loop=true;
  player.volume=.27;
  audio=player;
  return player;
}

function stopHaunted(){
  wanted=false;
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){}
}

async function startHaunted(root,store,{pending=false}={}){
  wanted=true;
  stopStoryEffects();
  try{
    const player=await getAudio();
    if(!wanted||!store.getState().audioOn||!isTargetStory(root))return;
    if(!pending&&!SCENE_PAGES.has(currentPage(root)))return;
    player.muted=false;
    player.loop=true;
    player.volume=.27;
    if(player.paused||player.ended){player.currentTime=0;await player.play();}
  }catch(error){
    wanted=false;
    console.warn('Haunted ambience playback failed.',error);
  }
}

function navigationTarget(root,event){
  const button=event.target?.closest?.('[data-next],[data-prev]');
  if(!button)return 0;
  const page=currentPage(root);
  return page? page+(button.matches('[data-next]')?1:-1):0;
}

export function installScene169172(root,store){
  if(root.dataset.haunted169172Installed==='1')return;
  root.dataset.haunted169172Installed='1';
  void getBase64AudioSource(PART_URLS).catch(()=>{});

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root)){
      stopStoryEffects();
      void startHaunted(root,store);
    }else stopHaunted();
  };

  const handlePointer=event=>{
    const target=navigationTarget(root,event);
    if(target){
      if(SCENE_PAGES.has(target)&&store.getState().audioOn&&isTargetStory(root))void startHaunted(root,store,{pending:true});
      else if(SCENE_PAGES.has(currentPage(root)))stopHaunted();
      return;
    }
    if(SCENE_PAGES.has(currentPage(root))&&store.getState().audioOn&&isTargetStory(root))void startHaunted(root,store,{pending:true});
  };

  root.addEventListener('pointerdown',handlePointer,{capture:true});
  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
