import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';
import * as base from './story-sfx.js?v=217';

// Remove the old noisy crowd asset from the active asset map entirely.
delete STORY_SFX_ASSETS.crowd;

export const getStorySfxStatus=base.getStorySfxStatus;
export const transitionStorySfx=base.transitionStorySfx;
export const stopStorySfx=base.stopStorySfx;
export const unlockStorySfx=base.unlockStorySfx;

export function playStorySfx(name,options={}){
  if(name==='crowd')return Promise.resolve(false);
  return base.playStorySfx(name,options);
}

export function preloadStorySfx(name){
  if(name==='crowd')return Promise.resolve(false);
  return base.preloadStorySfx(name);
}

export function isStorySfxReady(name){
  if(name==='crowd')return false;
  return base.isStorySfxReady(name);
}

export function isStorySfxPlaying(name){
  if(name==='crowd')return false;
  return base.isStorySfxPlaying(name);
}

export function setStorySfxVolume(name,volume){
  if(name==='crowd')return false;
  return base.setStorySfxVolume(name,volume);
}

export function getStorySfxSrc(name){
  if(name==='crowd')return'';
  return base.getStorySfxSrc(name);
}
