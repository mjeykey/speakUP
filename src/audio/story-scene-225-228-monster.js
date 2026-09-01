import { getBase64AudioSource } from './story-b64-source.js?v=323';

const MONSTER_PARTS=[new URL('../../assets/audio/monster-growl-213.b64?v=323',import.meta.url).href];

let audio=null;
let audioPromise=null;
let installed=false;
let observer=null;
let timer=null;
let currentPage=null;

async function getAudio(){
  if(audio)return audio;
  if(audioPromise)return audioPromise;
  audioPromise=(async()=>{
    const src=await getBase64AudioSource(MONSTER_PARTS);
    const player=new Audio(src);
    player.setAttribute('playsinline','');
    player.preload='auto';
    player.loop=false;
    player.volume=1;
    audio=player;
    return player;
  })().catch(error=>{audioPromise=null;throw error;});
  return audioPromise;
}

function reset(player=audio){
  if(!player)return;
  try{player.pause();player.currentTime=0;}catch(_){}
}

async function playMonster(){
  let player;
  try{player=await getAudio();}catch(error){console.warn('Monster growl load failed.',error);return;}
  reset(player);
  player.muted=false;
  player.loop=false;
  player.volume=1;
  player.playbackRate=1;
  try{player.currentTime=0;}catch(_){}
  void Promise.resolve(player.play()).catch(error=>console.warn('Monster growl playback failed.',error));
}

function pageNumber(root){
  const text=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):null;
}

function prime(){
  void getAudio().then(player=>{
    const oldVolume=player.volume;
    player.volume=0;
    reset(player);
    void Promise.resolve(player.play()).then(()=>{
      window.setTimeout(()=>{reset(player);player.volume=oldVolume;},70);
    }).catch(()=>{player.volume=oldVolume;});
  }).catch(()=>{});
}

export function installScene225228Monster(root,store){
  if(installed)return;
  installed=true;
  void getAudio().catch(()=>{});
  document.addEventListener('pointerdown',prime,{capture:true});

  const target=root||document.body;
  const scan=()=>{
    const page=pageNumber(target);
    const inRange=page>=225&&page<=228;
    if(!inRange){
      currentPage=null;
      if(timer){window.clearTimeout(timer);timer=null;}
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(timer)window.clearTimeout(timer);
    timer=window.setTimeout(()=>{
      timer=null;
      if(pageNumber(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      void playMonster();
    },650);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
