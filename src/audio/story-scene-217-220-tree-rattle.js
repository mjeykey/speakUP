import { getBase64AudioSource } from './story-b64-source.js?v=314';

const PARTS=[new URL('../../assets/audio/tree-rattle-217-220.b64?v=314',import.meta.url).href];
const EN='the tree rolled away from the road';
const PT='a árvore rolou para fora da estrada';

let audio=null;
let audioPromise=null;
let installed=false;
let observer=null;
let timer=null;
let armed=false;

async function getAudio(){
  if(audio)return audio;
  if(audioPromise)return audioPromise;
  audioPromise=(async()=>{
    const src=await getBase64AudioSource(PARTS);
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

async function playOnce(){
  let player;
  try{player=await getAudio();}catch(_){return;}
  reset(player);
  player.loop=false;
  player.playbackRate=1;
  player.volume=1;
  try{await player.play();}catch(error){console.warn('Tree rattle playback failed.',error);}
}

function prime(){
  void getAudio().then(player=>{
    const oldVolume=player.volume;
    player.volume=0;
    reset(player);
    void Promise.resolve(player.play()).then(()=>{
      window.setTimeout(()=>{reset(player);player.volume=oldVolume;},80);
    }).catch(()=>{player.volume=oldVolume;});
  }).catch(()=>{});
}

function targetVisible(root=document){
  const value=String(root?.textContent||'').toLocaleLowerCase();
  return value.includes(EN)||value.includes(PT);
}

export function installScene217220TreeRattle(root,store){
  if(installed)return;
  installed=true;
  void getAudio().catch(()=>{});
  document.addEventListener('pointerdown',prime,{capture:true});

  const target=root||document.body;
  const scan=()=>{
    const visible=targetVisible(target);
    if(!visible){
      armed=false;
      if(timer){window.clearTimeout(timer);timer=null;}
      return;
    }
    if(armed)return;
    armed=true;
    timer=window.setTimeout(()=>{
      timer=null;
      if(!targetVisible(target))return;
      if(store?.getState&&store.getState().audioOn===false)return;
      void playOnce();
    },3000);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
