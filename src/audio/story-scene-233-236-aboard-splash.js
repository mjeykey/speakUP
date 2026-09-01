const SPLASH_URL=new URL('../../assets/audio/jumped-aboard-233-236.mp3?v=328',import.meta.url).href;

let audio=null;
let installed=false;
let observer=null;
let timer=null;
let currentPage=null;

function getAudio(){
  if(audio)return audio;
  audio=new Audio(SPLASH_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.muted=false;
  audio.volume=1;
  return audio;
}

function reset(){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){}
}

function playSplash(){
  const player=getAudio();
  reset();
  player.muted=false;
  player.loop=false;
  player.volume=1;
  player.playbackRate=1;
  try{player.currentTime=0;}catch(_){}
  void Promise.resolve(player.play()).catch(error=>console.warn('Aboard splash playback failed.',error));
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

export function installScene233236AboardSplash(root,store){
  if(installed)return;
  installed=true;
  getAudio();
  document.addEventListener('pointerdown',prime,{capture:true});

  const target=root||document.body;
  const scan=()=>{
    const page=pageNumber(target);
    const inRange=page>=233&&page<=236;
    if(!inRange){
      currentPage=null;
      if(timer){window.clearTimeout(timer);timer=null;}
      reset();
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(timer)window.clearTimeout(timer);
    // "jumped aboard" comes late in the paragraph after the engine restart.
    timer=window.setTimeout(()=>{
      timer=null;
      if(pageNumber(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      playSplash();
    },4300);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
