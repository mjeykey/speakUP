const TREE_URL=new URL('../../assets/audio/wood-creak-161-164-core.mp3?v=289',import.meta.url).href;

let audio=null;
let installed=false;
let observer=null;
let timer=null;
let currentPage=null;

function getAudio(){
  if(audio)return audio;
  const player=new Audio(TREE_URL);
  player.setAttribute('playsinline','');
  player.preload='auto';
  player.loop=false;
  player.muted=false;
  player.volume=1;
  audio=player;
  return player;
}

function reset(){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){}
}

function playOnce(){
  const player=getAudio();
  reset();
  player.muted=false;
  player.loop=false;
  player.volume=1;
  player.playbackRate=.72;
  try{player.preservesPitch=true;}catch(_){}
  try{player.webkitPreservesPitch=true;}catch(_){}
  try{player.currentTime=0;}catch(_){}
  void Promise.resolve(player.play()).catch(error=>console.warn('Tree sound playback failed.',error));
}

function visibleStoryPage(root){
  const progress=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=progress.match(/(\d+)/);
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

export function installScene217220TreeRattle(root,store){
  if(installed)return;
  installed=true;
  getAudio();
  document.addEventListener('pointerdown',prime,{capture:true,once:true});

  const target=root||document.body;
  const scan=()=>{
    const page=visibleStoryPage(target);
    const inRange=page>=217&&page<=220;
    if(!inRange){
      currentPage=null;
      if(timer){window.clearTimeout(timer);timer=null;}
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(timer)window.clearTimeout(timer);
    // The narration reaches “the tree” near the end of this line. Keep the
    // reliable page-based trigger, but place the effect later at that word.
    timer=window.setTimeout(()=>{
      timer=null;
      if(visibleStoryPage(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      playOnce();
    },3900);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
