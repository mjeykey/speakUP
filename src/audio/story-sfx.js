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
  const seconds=loop?4:1.2;
  const length=Math.max(1,Math.floor(ctx.sampleRate*seconds));
  const buffer=ctx.createBuffer(1,length,ctx.sampleRate);
  const data=buffer.getChannelData(0);
  const strength=name==='rain'?0.34:0.24;
  for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*strength;
  const source=ctx.createBufferSource();
  const filter=ctx.createBiquadFilter();
  filter.type=name==='water-crash'?'lowpass':'bandpass';
  filter.frequency.value=name==='rain'?1800:700;
  filter.Q.value=name==='rain'?0.45:0.7;
  source.buffer=buffer;
  source.loop=loop;
  source.connect(filter);
  filter.connect(gain);
  gain.gain.setValueAtTime(0.0001,now);
  gain.gain.exponentialRampToValueAtTime(loop?0.16:0.55,now+0.08);
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

  // Rain is ambience, not a one-shot effect. Use a generated seamless loop so
  // mobile browsers do not turn a very short asset/fallback into a loud burst.
  if(name==='rain'&&loop)return playFallback(name,ctx,{loop:true});

  const buffer=await getBuffer(name);
  if(!buffer)return playFallback(name,ctx,{loop});
  stopStorySfx();
  const source=ctx.createBufferSource();
  const gain=ctx.createGain();
  gain.gain.value=loop?0.22:1;
  source.buffer=buffer;
  source.loop=loop;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.onended=()=>{if(activeSource===source)activeSource=null;};
  activeSource=source;
  source.start(0);
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
