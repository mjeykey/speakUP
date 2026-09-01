const HAMMER_DATA='data:audio/mpeg;base64,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';

let installed=false;
let observer=null;
let timer=null;
let currentPage=null;
let players=[];
let hitTimers=[];

function getPlayers(){
  if(players.length)return players;
  players=[0,1,2].map(()=>{
    const a=new Audio(HAMMER_DATA);
    a.setAttribute('playsinline','');
    a.preload='auto';
    a.loop=false;
    a.muted=false;
    a.volume=1;
    return a;
  });
  return players;
}

function resetPlayer(player){
  try{player.pause();player.currentTime=0;}catch(_){}
}

function playHit(index){
  const player=getPlayers()[index];
  resetPlayer(player);
  player.muted=false;
  player.volume=1;
  player.playbackRate=1;
  void Promise.resolve(player.play()).catch(error=>console.warn('Hammer sound playback failed.',error));
}

function playThreeHits(){
  hitTimers.forEach(id=>window.clearTimeout(id));
  hitTimers=[];
  playHit(0);
  hitTimers.push(window.setTimeout(()=>playHit(1),360));
  hitTimers.push(window.setTimeout(()=>playHit(2),720));
}

function pageNumber(root){
  const text=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):null;
}

function prime(){
  getPlayers().forEach(player=>{
    const old=player.volume;
    player.volume=0;
    resetPlayer(player);
    void Promise.resolve(player.play()).then(()=>{
      window.setTimeout(()=>{resetPlayer(player);player.volume=old;},70);
    }).catch(()=>{player.volume=old;});
  });
}

export function installScene221223Hammer(root,store){
  if(installed)return;
  installed=true;
  getPlayers();
  document.addEventListener('pointerdown',prime,{capture:true});

  const target=root||document.body;
  const scan=()=>{
    const page=pageNumber(target);
    const inRange=page>=221&&page<=223;
    if(!inRange){
      currentPage=null;
      if(timer){window.clearTimeout(timer);timer=null;}
      hitTimers.forEach(id=>window.clearTimeout(id));
      hitTimers=[];
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(timer)window.clearTimeout(timer);
    // The word “hammered” is early in the second sentence; fire before the phase can advance.
    timer=window.setTimeout(()=>{
      timer=null;
      if(pageNumber(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      playThreeHits();
    },2200);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
