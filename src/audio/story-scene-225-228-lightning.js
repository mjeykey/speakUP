const LIGHTNING_URL=new URL('../../assets/audio/gregorquendel-lightning-strike-fx-i-175724.mp3?v=327',import.meta.url).href;

let audio=null;
let installed=false;
let observer=null;
let timer=null;
let currentPage=null;

function getAudio(){
  if(audio)return audio;
  audio=new Audio(LIGHTNING_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.volume=1;
  return audio;
}

function reset(){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){}
}

function playLightning(){
  const player=getAudio();
  reset();
  player.muted=false;
  player.loop=false;
  player.volume=1;
  player.playbackRate=1;
  try{player.currentTime=0;}catch(_){}
  void Promise.resolve(player.play()).catch(error=>console.warn('Lightning strike playback failed.',error));
}

function pageNumber(root){
  const text=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):null;
}

function prime(){
  const player=getAudio();
  const oldVolume=player.volume;
  player.volume=0;
  reset();
  void Promise.resolve(player.play()).then(()=>{
    window.setTimeout(()=>{reset();player.volume=oldVolume;},80);
  }).catch(()=>{player.volume=oldVolume;});
}

export function installScene225228Lightning(root,store){
  if(installed)return;
  installed=true;
  getAudio();
  document.addEventListener('pointerdown',prime,{capture:true});

  const target=root||document.body;
  const scan=()=>{
    const page=pageNumber(target);
    const inRange=page>=225&&page<=228;
    if(!inRange){
      currentPage=null;
      if(timer){window.clearTimeout(timer);timer=null;}
      // Do not stop the lightning here: let the complete strike and thunder tail finish naturally.
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(timer)window.clearTimeout(timer);
    timer=window.setTimeout(()=>{
      timer=null;
      if(pageNumber(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      playLightning();
    },2800);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
