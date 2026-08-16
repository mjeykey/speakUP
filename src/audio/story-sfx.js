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

function playFallback(name,ctx,{loop=false}={}){
 stopStorySfx();
 const now=ctx.currentTime;
 const gain=ctx.createGain();
 gain.connect(ctx.destination);

 if(name==='rain'||name==='wind'||name==='soft-wind'||name==='dawn-wind'||name==='water'||name==='water-crash'){
  const seconds=loop?6:1.2;
  const length=Math.max(1,Math.floor(ctx.sampleRate*seconds));
  const buffer=ctx.createBuffer(1,length,ctx.sampleRate);
  const data=buffer.getChannelData(0);
  let smooth=0;
  for(let i=0;i<length;i++){
   const white=Math.random()*2-1;
   smooth=(smooth*0.965)+(white*0.035);
   const drop=Math.random()<0.0018?(Math.random()*0.55):0;
   data[i]=(smooth*0.42)+(white*0.055)+drop;
  }
  const source=ctx.createBufferSource();
  const low=ctx.createBiquadFilter();
  const high=ctx.createBiquadFilter();
  low.type='lowpass';
  low.frequency.value=name==='rain'?5200:1800;
  high.type='highpass';
  high.frequency.value=name==='rain'?220:80;
  source.buffer=buffer;
  source.loop=loop;
  source.connect(low);
  low.connect(high);
  high.connect(gain);
  gain.gain.setValueAtTime(0.0001,now);
  gain.gain.exponentialRampToValueAtTime(loop?0.075:0.42,now+0.75);
  if(!loop)gain.gain.exponentialRampToValueAtTime(0.0001,now+1.15);
  source.start(now);
  activeSource=source;
  source.onended=()=>{if(activeSource===source)activeSource=null;};
  return true;
 }

 gain.gain.setValueAtTime(0.0001,now);
 gain.gain.exponentialRampToValueAtTime(0.7,now+0.02);
 gain.gain.exponentialRampToValueAtTime(0.0001,now+1.15);
 const osc=ctx.createOscillator();
 osc.type=name==='heartbeat'?'sine':name==='magic-hum'?'triangle':'sawtooth';
 const freq=name==='heartbeat'?85:name==='thunder'?55:name==='engine-start'?95:name==='magic-hum'?140:220;
 osc.frequency.setValueAtTime(freq,now);
 if(name==='engine-start')osc.frequency.exponentialRampToValueAtTime(170,now+0.9);
 if(name==='thunder')osc.frequency.exponentialRampToValueAtTime(38,now+1.0);
 if(name==='key-turn'||name==='metal-scrape'||name==='door-creak')osc.frequency.exponentialRampToValueAtTime(480,now+0.45);
 osc.connect(gain);
 osc.start(now);
 osc.stop(now+1.15);
 activeSource=osc;
 osc.onended=()=>{if(activeSource===osc)activeSource=null;};
 return true;
}

export async function playStorySfx(name,{enabled=true,loop=false}={}){
 if(!enabled||!name||name==='none')return false;
 const ctx=ensureContext();
 if(!ctx)return false;
 try{
  if(ctx.state==='suspended')await ctx.resume();
  if(ctx.state!=='running')return false;

  const buffer=await getBuffer(name);
  if(!buffer)return playFallback(name,ctx,{loop});

  stopStorySfx();
  const source=ctx.createBufferSource();
  const gain=ctx.createGain();
  const now=ctx.currentTime;
  source.buffer=buffer;
  source.loop=loop;

  // Real rain is ambience. Keep it quiet, fade it in, and avoid any hard
  // transient at the very beginning of a short source clip.
  if(name==='rain'&&loop){
   const safeStart=Math.min(0.18,Math.max(0,buffer.duration*0.08));
   const safeEnd=Math.max(safeStart+0.35,buffer.duration-Math.min(0.12,buffer.duration*0.05));
   if(safeEnd>safeStart+0.2){
    source.loopStart=safeStart;
    source.loopEnd=safeEnd;
   }
   gain.gain.setValueAtTime(0.0001,now);
   gain.gain.exponentialRampToValueAtTime(0.085,now+0.9);
  }else{
   gain.gain.value=loop?0.18:0.85;
  }

  source.connect(gain);
  gain.connect(ctx.destination);
  source.onended=()=>{if(activeSource===source)activeSource=null;};
  activeSource=source;
  source.start(0,name==='rain'&&loop?Math.min(0.18,Math.max(0,buffer.duration*0.08)):0);
  return true;
 }catch(error){
  console.warn('Story SFX playback blocked or failed.',error);
  try{return playFallback(name,ctx,{loop});}catch(_){return false;}
 }
}

if(typeof window!=='undefined'){
 const prime=()=>{void unlockStorySfx();};
 window.addEventListener('pointerdown',prime,{once:true,capture:true});
 window.addEventListener('touchstart',prime,{once:true,capture:true,passive:true});
}
