import {
  isStorySfxPlaying as baseIsStorySfxPlaying,
  preloadStorySfx as basePreloadStorySfx,
  playStorySfx as basePlayStorySfx,
  setStorySfxVolume as baseSetStorySfxVolume,
  stopStorySfx as baseStopStorySfx,
  transitionStorySfx as baseTransitionStorySfx,
  getStorySfxSrc
} from './story-sfx-clean.js?v=258';

let rainAudio=null;

const clamp=value=>Number.isFinite(value)?Math.max(0,Math.min(1,value)):0.04;

function stopRain(){
  if(!rainAudio)return;
  try{rainAudio.pause();}catch(_){}
  try{rainAudio.currentTime=0;}catch(_){}
  rainAudio=null;
}

function playRain({enabled=true,loop=true,volume=.04}={}){
  if(!enabled)return Promise.resolve(false);
  const v=clamp(volume);

  if(rainAudio&&!rainAudio.paused&&!rainAudio.ended){
    rainAudio.volume=v;
    rainAudio.loop=Boolean(loop);
    return Promise.resolve(true);
  }

  stopRain();
  const audio=new Audio(getStorySfxSrc('rain'));
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=Boolean(loop);
  audio.volume=v;
  rainAudio=audio;
  audio.onended=()=>{if(rainAudio===audio)rainAudio=null;};
  audio.onerror=()=>{if(rainAudio===audio)rainAudio=null;};

  return Promise.resolve(audio.play()).then(()=>true).catch(error=>{
    if(rainAudio===audio)rainAudio=null;
    console.warn('Smooth rain playback failed.',error);
    return false;
  });
}

export function playStorySfx(name,options={}){
  if(name==='rain')return playRain(options);
  return basePlayStorySfx(name,options);
}

export function isStorySfxPlaying(name){
  if(name==='rain'){
    const smoothPlaying=Boolean(rainAudio&&!rainAudio.paused&&!rainAudio.ended&&!rainAudio.muted);
    return smoothPlaying||baseIsStorySfxPlaying('rain');
  }
  return baseIsStorySfxPlaying(name);
}

export function setStorySfxVolume(name,volume){
  if(name==='rain'&&rainAudio){
    rainAudio.volume=clamp(volume);
    return true;
  }
  return baseSetStorySfxVolume(name,volume);
}

export function preloadStorySfx(name){
  if(name==='rain')return Promise.resolve(true);
  return basePreloadStorySfx(name);
}

export function stopStoryRainSfx(){
  if(baseIsStorySfxPlaying('rain'))baseTransitionStorySfx({keepRain:false});
  stopRain();
}

export function transitionStorySfx({keepRain=false}={}){
  baseTransitionStorySfx({keepRain:false});
  if(!keepRain)stopRain();
}

export function stopStorySfx(){
  baseStopStorySfx();
  stopRain();
}
