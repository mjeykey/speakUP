import { getStorySfxSrc } from './story-sfx-clean.js?v=16';

const DOOR_SRC=getStorySfxSrc('door-creak');
let doorAudio=null;

const clampVolume=value=>Number.isFinite(value)?Math.max(0,Math.min(1,value)):.95;

export function stopStoryDoor(){
  const audio=doorAudio;
  doorAudio=null;
  if(!audio)return;
  try{audio.pause();}catch(_){}
  try{audio.currentTime=0;}catch(_){}
}

export function isStoryDoorPlaying(){
  return Boolean(doorAudio&&!doorAudio.paused&&!doorAudio.ended&&!doorAudio.muted);
}

export function playStoryDoor(volume=.95){
  stopStoryDoor();
  const audio=new Audio(DOOR_SRC);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.muted=false;
  audio.volume=clampVolume(volume);
  doorAudio=audio;
  audio.onended=()=>{if(doorAudio===audio)doorAudio=null;};
  audio.onerror=()=>{if(doorAudio===audio)doorAudio=null;};
  try{
    return Promise.resolve(audio.play()).then(()=>true).catch(error=>{
      if(doorAudio===audio)doorAudio=null;
      console.warn('Story door playback failed.',error);
      return false;
    });
  }catch(error){
    if(doorAudio===audio)doorAudio=null;
    console.warn('Story door playback failed.',error);
    return Promise.resolve(false);
  }
}
