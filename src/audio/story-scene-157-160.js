import { stopStoryEffects } from './story-effects.js?v=270';

const SCENE_PAGES=new Set([157,158,159,160]);
const DOOR_URL=new URL('../../assets/audio/freesound_community-wooden-door-creaking-102413.mp3?v=284',import.meta.url).href;

let lastPage=-1;
let lastEnabled=null;
let playedPage=-1;
const doorAudio=new Audio(DOOR_URL);
doorAudio.setAttribute('playsinline','');
doorAudio.preload='auto';
doorAudio.loop=false;
doorAudio.volume=.95;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function stopDoor(){
  try{
    doorAudio.pause();
    doorAudio.currentTime=0;
  }catch(_){}
}

async function playDoor(root,page,store){
  if(playedPage===page||currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
  playedPage=page;
  stopStoryEffects();
  stopDoor();
  try{
    doorAudio.volume=.95;
    await doorAudio.play();
  }catch(error){
    playedPage=-1;
    console.warn('Wooden-door playback failed.',error);
  }
}

export function stopScene157160(){
  lastPage=-1;
  lastEnabled=null;
  playedPage=-1;
  stopDoor();
}

export function installScene157160(root,store){
  if(root.dataset.woodDoor157160Installed==='1')return;
  root.dataset.woodDoor157160Installed='1';
  try{doorAudio.load();}catch(_){}

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    playedPage=-1;

    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root))void playDoor(root,page,store);
    else stopDoor();
  };

  const unlock=()=>{
    if(store.getState().audioOn&&SCENE_PAGES.has(currentPage(root)))void playDoor(root,currentPage(root),store);
  };

  root.addEventListener('pointerdown',unlock,{capture:true});
  root.addEventListener('click',unlock,{capture:true});
  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
