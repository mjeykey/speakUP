const SPLASH_URL=new URL('../../assets/audio/jumped-aboard-233-236.mp3?v=329',import.meta.url).href;

let players=[];
let installed=false;
let observer=null;
let timer=null;
let currentPage=null;
let hitTimers=[];

function getPlayers(){
  if(players.length)return players;
  players=[0,1,2].map(()=>{
    const audio=new Audio(SPLASH_URL);
    audio.setAttribute('playsinline','');
    audio.preload='auto';
    audio.loop=false;
    audio.muted=false;
    audio.volume=1;
    return audio;
  });
  return players;
}

function resetPlayer(player){
  try{player.pause();player.currentTime=0;}catch(_){}
}

function stopAll(){
  hitTimers.forEach(id=>window.clearTimeout(id));
  hitTimers=[];
  getPlayers().forEach(resetPlayer);
}

function playHit(index){
  const player=getPlayers()[index];
  resetPlayer(player);
  player.muted=false;
  player.loop=false;
  player.volume=1;
  player.playbackRate=1;
  try{player.currentTime=0;}catch(_){}
  void Promise.resolve(player.play()).catch(error=>console.warn('Aboard splash playback failed.',error));
}

function playSplashSequence(){
  hitTimers.forEach(id=>window.clearTimeout(id));
  hitTimers=[];
  playHit(0);
  hitTimers.push(window.setTimeout(()=>playHit(1),520));
  hitTimers.push(window.setTimeout(()=>playHit(2),1040));
}

function pageNumber(root){
  const text=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):null;
}

function prime(){
  getPlayers().forEach(player=>{
    const oldVolume=player.volume;
    player.volume=0;
    resetPlayer(player);
    void Promise.resolve(player.play()).then(()=>{
      window.setTimeout(()=>{resetPlayer(player);player.volume=oldVolume;},80);
    }).catch(()=>{player.volume=oldVolume;});
  });
}

export function installScene233236AboardSplash(root,store){
  if(installed)return;
  installed=true;
  getPlayers();
  document.addEventListener('pointerdown',prime,{capture:true});

  const target=root||document.body;
  const scan=()=>{
    const page=pageNumber(target);
    const inRange=page>=233&&page<=236;
    if(!inRange){
      currentPage=null;
      if(timer){window.clearTimeout(timer);timer=null;}
      stopAll();
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(timer)window.clearTimeout(timer);
    // Three splashes as passengers jump aboard one after another.
    timer=window.setTimeout(()=>{
      timer=null;
      if(pageNumber(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      playSplashSequence();
    },4300);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
