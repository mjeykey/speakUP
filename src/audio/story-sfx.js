import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=1';

let audioContext=null;
let activeSource=null;
const buffers=new Map();
const loading=new Map();

function getContext(){
 if(!audioContext){
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return null;
  audioContext=new AudioContextClass();
 }
 return audioContext;
}

async function loadBuffer(name){
 if(buffers.has(name))return buffers.get(name);
 if(loading.has(name))return loading.get(name);
 const src=STORY_SFX_ASSETS[name];
 if(!src)return null;
 const ctx=getContext();
 if(!ctx)return null;
 const promise=(async()=>{
  try{
   const response=await fetch(src);
   const bytes=await response.arrayBuffer();
   const decoded=await ctx.decodeAudioData(bytes.slice(0));
   buffers.set(name,decoded);
   return decoded;
  }catch(_){return null;}
  finally{loading.delete(name);}
 })();
 loading.set(name,promise);
 return promise;
}

export async function unlockStorySfx(){
 const ctx=getContext();
 if(!ctx)return;
 if(ctx.state==='suspended')try{await ctx.resume();}catch(_){}
 Object.keys(STORY_SFX_ASSETS).forEach(name=>{loadBuffer(name);});
}

export function stopStorySfx(){
 if(activeSource){
  try{activeSource.stop();}catch(_){}
  try{activeSource.disconnect();}catch(_){}
 }
 activeSource=null;
}

export async function playStorySfx(name,{enabled=true}={}){
 if(!enabled||!name||name==='none')return false;
 const ctx=getContext();
 if(!ctx)return false;
 if(ctx.state==='suspended'){
  try{await ctx.resume();}catch(_){return false;}
 }
 const buffer=await loadBuffer(name);
 if(!buffer)return false;
 stopStorySfx();
 const source=ctx.createBufferSource();
 const gain=ctx.createGain();
 gain.gain.value=.95;
 source.buffer=buffer;
 source.connect(gain);
 gain.connect(ctx.destination);
 source.onended=()=>{if(activeSource===source)activeSource=null;};
 activeSource=source;
 try{source.start(0);return true;}catch(_){activeSource=null;return false;}
}

if(typeof window!=='undefined'){
 const unlock=()=>{unlockStorySfx();};
 window.addEventListener('pointerdown',unlock,{once:true,capture:true});
 window.addEventListener('touchstart',unlock,{once:true,capture:true,passive:true});
}
