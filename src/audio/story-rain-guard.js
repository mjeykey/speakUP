const RAIN_MARKER='rain-natural-mobile.mp3';
let installed=false;
let originalPlay=null;

function tracks(){
  if(!(window.__speakupRainTracks instanceof Set))window.__speakupRainTracks=new Set();
  return window.__speakupRainTracks;
}

function isRainMedia(media){
  const src=String(media?.currentSrc||media?.src||'');
  return src.includes(RAIN_MARKER);
}

export function stopAllRainTracks(){
  tracks().forEach(media=>{
    try{media.pause();}catch(_){}
    try{media.currentTime=0;}catch(_){}
  });
  tracks().clear();
}

export function setRainAllowed(allowed){
  window.__speakupRainAllowed=Boolean(allowed);
  if(!window.__speakupRainAllowed)stopAllRainTracks();
}

export function installRainGuard(){
  if(installed)return;
  installed=true;
  setRainAllowed(false);

  originalPlay=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(...args){
    if(isRainMedia(this)){
      tracks().add(this);
      if(window.__speakupRainAllowed!==true){
        try{this.pause();}catch(_){}
        try{this.currentTime=0;}catch(_){}
        return Promise.resolve();
      }
    }
    return originalPlay.apply(this,args);
  };
}
