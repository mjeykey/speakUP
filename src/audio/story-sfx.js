import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let audioContext=null;
let activeSource=null;
const bufferCache=new Map();

export function getStorySfxSrc(name){
 return STORY_SFX_ASSETS[name]||'';
}

function ensureContext(){
 if(audioContext)return audioContext;
 const AudioContextClass=window.AudioContext||window.webkitAudioContext;
 if(!AudioContextClass)return null;
 audioContext=new AudioContextClass();
 return audioContext;
}

export async function unlockStorySfx(){
 const ctx=ensureContext();
 if(!ctx)return false;
 try{
  if(ctx.state==='suspended')await ctx.resume();
  return ctx.state==='running';
 }catch(_){
  return false;
 }
}

export function stopStorySfx(){
 if(!activeSource)return;
 try{activeSource.stop();}catch(_){}
 try{activeSource.disconnect();}catch(_){}
 activeSource=null;
}

async function getBuffer(name){
 if(bufferCache.has(name))return bufferCache.get(name);
 const src=getStorySfxSrc(name);
 if(!src)return null;
 const ctx=ensureContext();
 if(!ctx)return null;
 try{
  const response=await fetch(src);
  const bytes=await response.arrayBuffer();
  const buffer=await ctx.decodeAudioData(bytes.slice(0));
  bufferCache.set(name,buffer);
  return buffer;
 }catch(error){
  console.warn('Story SFX decode failed.',name,error);
  return null;
 }
}

export async function playStorySfx(name,{enabled=true}={}){
 if(!enabled||!name||name==='none')return false;
 const ctx=ensureContext();
 if(!ctx)return false;
 try{
  if(ctx.state==='suspended')await ctx.resume();
  if(ctx.state!=='running')return false;
  const buffer=await getBuffer(name);
  if(!buffer)return false;
  stopStorySfx();
  const source=ctx.createBufferSource();
  const gain=ctx.createGain();
  gain.gain.value=1;
  source.buffer=buffer;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.onended=()=>{if(activeSource===source)activeSource=null;};
  activeSource=source;
  source.start(0);
  return true;
 }catch(error){
  console.warn('Story SFX playback blocked or failed.',error);
  return false;
 }
}

if(typeof window!=='undefined'){
 const prime=()=>{void unlockStorySfx();};
 window.addEventListener('pointerdown',prime,{once:true,capture:true});
 window.addEventListener('touchstart',prime,{once:true,capture:true,passive:true});
}
