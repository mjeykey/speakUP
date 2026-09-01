import { getBase64AudioSource } from './story-b64-source.js?v=324';

const LIGHTNING_PARTS=[new URL('../../assets/audio/lightning-strike-225-228.b64?v=324',import.meta.url).href];
let installed=false;
let observer=null;
let timer=null;
let currentPage=null;
let audio=null;
let sourcePromise=null;

function pageNumber(root){
  const text=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):null;
}

async function getAudio(){
  if(audio)return audio;
  if(!sourcePromise)sourcePromise=getBase64AudioSource(LIGHTNING_PARTS,'audio/mpeg');
  const src=await sourcePromise;
  if(!audio){
    audio=new Audio(src);
    audio.setAttribute('playsinline','');
    audio.preload='auto';
    audio.loop=false;
    audio.volume=1;
  }
  return audio;
}

function reset(){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){}
}

async function playLightning(){
  try{
    const player=await getAudio();
    reset();
    player.muted=false;
    player.volume=1;
    player.playbackRate=1;
    await player.play();
  }catch(error){
    console.warn('Lightning strike playback failed.',error);
  }
}

function prime(){
  void getAudio().then(player=>{
    const old=player.volume;
    player.volume=0;
    reset();
    return Promise.resolve(player.play()).then(()=>{
      window.setTimeout(()=>{reset();player.volume=old;},70);
    }).catch(()=>{player.volume=old;});
  }).catch(()=>{});
}

export function installScene225228Lightning(root,store){
  if(installed)return;
  installed=true;
  document.addEventListener('pointerdown',prime,{capture:true});
  const target=root||document.body;

  const scan=()=>{
    const page=pageNumber(target);
    const inRange=page>=225&&page<=228;
    if(!inRange){
      currentPage=null;
      if(timer){window.clearTimeout(timer);timer=null;}
      reset();
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(timer)window.clearTimeout(timer);
    // Cue the strike at “a pulse of light burst across the stones”.
    timer=window.setTimeout(()=>{
      timer=null;
      if(pageNumber(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      void playLightning();
    },3150);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
