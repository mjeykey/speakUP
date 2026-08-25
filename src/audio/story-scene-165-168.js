const MUFFLED_TALKING_URL=new URL('../../assets/audio/muffled-talking-165-168-mobile.mp3?v=283',import.meta.url).href;
const FIRST_PAGE=165;
const LAST_PAGE=168;
const VOLUME=.28;

let audio=null;
let observer=null;

function displayedPage(){
  const label=document.querySelector('.story-progress');
  const match=label?.textContent?.match(/\b(\d+)\b/);
  return match?Number(match[1]):0;
}

function eligible(store,page=displayedPage()){
  const state=store.getState();
  const storyId=state.selectedStory||'everyday';
  return state.screen==='story'
    && storyId==='fantasy-1'
    && Boolean(state.audioOn)
    && page>=FIRST_PAGE
    && page<=LAST_PAGE;
}

function getAudio(){
  if(audio)return audio;
  audio=new Audio(MUFFLED_TALKING_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=true;
  audio.volume=VOLUME;
  audio.onerror=()=>console.warn('Muffled talking ambience failed to load.');
  return audio;
}

function stop(){
  if(!audio)return;
  try{audio.pause();}catch(_){}
  try{audio.currentTime=0;}catch(_){}
}

function start(){
  const player=getAudio();
  player.muted=false;
  player.loop=true;
  player.volume=VOLUME;
  if(!player.paused&&!player.ended)return;
  void Promise.resolve(player.play()).catch(error=>{
    console.warn('Muffled talking ambience playback failed.',error);
  });
}

function sync(store){
  if(eligible(store))start();
  else stop();
}

export function installMuffledTalkingScene(store){
  if(!store||observer)return;
  const root=document.getElementById('app');
  const syncNow=()=>sync(store);

  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('[data-next],[data-prev]');
    if(!button)return;
    const current=displayedPage();
    if(!current)return;
    const target=current+(button.matches('[data-next]')?1:-1);
    if(eligible(store,target))start();
    else stop();
  },true);

  if(root){
    observer=new MutationObserver(syncNow);
    observer.observe(root,{childList:true,subtree:true,characterData:true});
  }

  store.subscribe(syncNow);
  syncNow();
}
