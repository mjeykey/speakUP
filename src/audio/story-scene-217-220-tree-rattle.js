import { getBase64AudioSource } from './story-b64-source.js?v=317';

const TREE_PARTS=[new URL('../../assets/audio/tree-rattle-217-220.b64?v=317',import.meta.url).href];

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
    const src=await getBase64AudioSource(TREE_PARTS);
    const player=new Audio(src);
    player.setAttribute('playsinline','');
    player.preload='auto';
    player.loop=false;
    player.muted=false;
    player.volume=1;
    audio=player;
    return player;
  })().catch(error=>{audioPromise=null;throw error;});
  return audioPromise;
}

function reset(){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){}
}

async function playOnce(){
  let player;
  try{player=await getAudio();}catch(error){console.warn('Tree sound load failed.',error);return;}
  reset();
  player.muted=false;
  player.loop=false;
  player.volume=1;
  player.playbackRate=.82;
  try{player.preservesPitch=true;}catch(_){}
  try{player.webkitPreservesPitch=true;}catch(_){}
  try{player.currentTime=0;}catch(_){}
  void Promise.resolve(player.play()).catch(error=>console.warn('Tree sound playback failed.',error));
}

function visibleStoryPage(root){
  const progress=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=progress.match(/(\d+)/);
  return match?Number(match[1]):null;
}

function prime(){
  void getAudio().then(player=>{
    const oldVolume=player.volume;
    player.volume=0;
    reset();
    void Promise.resolve(player.play()).then(()=>{
      window.setTimeout(()=>{reset();player.volume=oldVolume;},80);
    }).catch(()=>{player.volume=oldVolume;});
  }).catch(()=>{});
}

export function installScene217220TreeRattle(root,store){
  if(installed)return;
  installed=true;
  void getAudio().catch(()=>{});
  document.addEventListener('pointerdown',prime,{capture:true,once:true});

  const target=root||document.body;
  const scan=()=>{
    const page=visibleStoryPage(target);
    const inRange=page>=217&&page<=220;
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
      if(visibleStoryPage(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      void playOnce();
    },3900);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
