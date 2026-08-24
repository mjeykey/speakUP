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
const rainAllowed=()=>typeof window==='undefined'||window.__speakupRainAllowed===true;
const rainTracks=()=>{
  if(typeof window==='undefined')return new Set();
  if(!(window.__speakupRainTracks instanceof Set))window.__speakupRainTracks=new Set();
  return window.__speakupRainTracks;
};

function stopTrack(track){
  if(!track)return;
  try{track.pause();}catch(_){}
  try{track.currentTime=0;}catch(_){}
}

function unregister(track){
  try{rainTracks().delete(track);}catch(_){}
}

function stopAllRain(){
  const tracks=rainTracks();
  tracks.forEach(track=>stopTrack(track));
  tracks.clear();
  stopTrack(rainAudio);
  rainAudio=null;
}

function playRain({enabled=true,loop=true,volume=.04}={}){
  if(!enabled||!rainAllowed()){
    stopAllRain();
    return Promise.resolve(false);
  }

  const v=clamp(volume);

  if(rainAudio&&!rainAudio.paused&&!rainAudio.ended){
    rainAudio.volume=v;
    rainAudio.loop=Boolean(loop);
    rainTracks().add(rainAudio);
    return Promise.resolve(true);
  }

  stopAllRain();
  const audio=new Audio(getStorySfxSrc('rain'));
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=Boolean(loop);
  audio.volume=v;
  rainAudio=audio;
  rainTracks().add(audio);
  audio.onended=()=>{
    unregister(audio);
    if(rainAudio===audio)rainAudio=null;
  };
  audio.onerror=()=>{
    unregister(audio);
    if(rainAudio===audio)rainAudio=null;
  };

  return Promise.resolve(audio.play()).then(()=>true).catch(error=>{
    unregister(audio);
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
    const registeredPlaying=[...rainTracks()].some(track=>track&&!track.paused&&!track.ended&&!track.muted);
    return smoothPlaying||registeredPlaying||baseIsStorySfxPlaying('rain');
  }
  return baseIsStorySfxPlaying(name);
}

export function setStorySfxVolume(name,volume){
  if(name==='rain'){
    const v=clamp(volume);
    let changed=false;
    if(rainAudio){rainAudio.volume=v;changed=true;}
    rainTracks().forEach(track=>{try{track.volume=v;changed=true;}catch(_){}});
    if(changed)return true;
  }
  return baseSetStorySfxVolume(name,volume);
}

export function preloadStorySfx(name){
  if(name==='rain')return Promise.resolve(true);
  return basePreloadStorySfx(name);
}

export function stopStoryRainSfx(){
  baseTransitionStorySfx({keepRain:false});
  stopAllRain();
}

export function transitionStorySfx({keepRain=false}={}){
  const allowRain=Boolean(keepRain&&rainAllowed());
  baseTransitionStorySfx({keepRain:false});
  if(!allowRain)stopAllRain();
}

export function stopStorySfx(){
  baseStopStorySfx();
  stopAllRain();
}
