import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=1';

let activeAudio=null;

function ensureAudio(){
 if(activeAudio && activeAudio.isConnected) return activeAudio;
 const audio=document.createElement('audio');
 audio.setAttribute('playsinline','');
 audio.preload='auto';
 audio.volume=1;
 audio.style.position='fixed';
 audio.style.width='1px';
 audio.style.height='1px';
 audio.style.opacity='0';
 audio.style.pointerEvents='none';
 audio.style.left='-9999px';
 document.body.appendChild(audio);
 activeAudio=audio;
 return audio;
}

export async function unlockStorySfx(){
 ensureAudio();
}

export function stopStorySfx(){
 if(!activeAudio)return;
 try{activeAudio.pause();activeAudio.currentTime=0;}catch(_){}
}

export async function playStorySfx(name,{enabled=true}={}){
 if(!enabled||!name||name==='none')return false;
 const src=STORY_SFX_ASSETS[name];
 if(!src)return false;
 const audio=ensureAudio();
 try{
  audio.pause();
  audio.currentTime=0;
  if(audio.src!==src)audio.src=src;
  audio.load();
  const result=audio.play();
  if(result && typeof result.then==='function')await result;
  return true;
 }catch(error){
  console.warn('Story SFX playback blocked or failed.',error);
  return false;
 }
}

if(typeof window!=='undefined'){
 const prime=()=>{ensureAudio();};
 window.addEventListener('pointerdown',prime,{capture:true});
 window.addEventListener('touchstart',prime,{capture:true,passive:true});
}
