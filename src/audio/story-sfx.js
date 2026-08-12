import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=1';

let activeAudio=null;
let unlocked=false;

export async function unlockStorySfx(){
 unlocked=true;
}

export function stopStorySfx(){
 if(!activeAudio)return;
 try{activeAudio.pause();activeAudio.currentTime=0;}catch(_){}
 activeAudio=null;
}

export async function playStorySfx(name,{enabled=true}={}){
 if(!enabled||!name||name==='none')return;
 const src=STORY_SFX_ASSETS[name];
 if(!src)return;
 stopStorySfx();
 const audio=new Audio(src);
 activeAudio=audio;
 audio.preload='auto';
 audio.volume=.9;
 try{
  if(!unlocked)await unlockStorySfx();
  await audio.play();
 }catch(_){
  if(activeAudio===audio)activeAudio=null;
 }
}

if(typeof window!=='undefined'){
 const unlock=()=>unlockStorySfx();
 window.addEventListener('pointerdown',unlock,{once:true,capture:true});
 window.addEventListener('touchstart',unlock,{once:true,capture:true,passive:true});
}
