const SCENE_PAGES=new Set([73,74,75,76]);
const WAGON_DELAY_BY_PAGE=new Map([[73,2200],[74,2800],[75,2200],[76,2800]]);
const WAGON_URL=new URL('../../assets/audio/dragon-studio-hammer-smash-effect-382731-mobile.mp3?v=236',import.meta.url).href;

let timer=0;
let track=null;
let lastPage=-1;
let primed=false;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function ensureTrack(){
  if(track)return track;
  track=document.createElement('audio');
  track.src=WAGON_URL;
  track.preload='auto';
  track.loop=false;
  track.volume=1;
  track.setAttribute('playsinline','');
  track.style.display='none';
  track.dataset.storyTrack='wagon-impact';
  document.body.appendChild(track);
  track.load();
  return track;
}

async function primeTrack(){
  if(primed)return;
  const audio=ensureTrack();
  const previousMuted=audio.muted;
  try{
    audio.muted=true;
    audio.currentTime=0;
    await audio.play();
    audio.pause();
    audio.currentTime=0;
    audio.muted=previousMuted;
    primed=true;
  }catch(_){
    audio.muted=previousMuted;
  }
}

function stopWagon(){
  clearTimeout(timer);
  timer=0;
  if(!track)return;
  try{
    track.pause();
    track.currentTime=0;
  }catch(_){}
}

function scheduleWagon(root,page){
  stopWagon();
  const delay=WAGON_DELAY_BY_PAGE.get(page)??2400;
  const audio=ensureTrack();
  timer=window.setTimeout(async()=>{
    timer=0;
    if(currentPage(root)!==page)return;
    try{
      audio.pause();
      audio.currentTime=0;
      audio.muted=false;
      audio.volume=1;
      await audio.play();
    }catch(error){
      console.warn('Wagon sound playback failed.',error);
    }
  },delay);
}

export function stopScene7376(){
  lastPage=-1;
  stopWagon();
}

export function installScene7376(root,store){
  if(root.dataset.wagonOnlyInstalled==='1')return;
  root.dataset.wagonOnlyInstalled='1';
  ensureTrack();

  const unlock=()=>{
    if(store.getState().audioOn)void primeTrack();
  };

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage)return;
    lastPage=page;
    if(enabled&&SCENE_PAGES.has(page))scheduleWagon(root,page);
    else stopWagon();
  };

  root.addEventListener('pointerdown',unlock,{capture:true});
  root.addEventListener('click',unlock,{capture:true});

  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
