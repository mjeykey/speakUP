import { isStorySfxPlaying, playStorySfx, setStorySfxVolume } from './story-sfx.js?v=217';

const SCENE_PAGES=new Set([77,78,79,80]);
const RAIN_VOLUME=.04;
let lastPage=-1;
let lastEnabled=null;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function ensureRain(root,store){
  const page=currentPage(root);
  const enabled=Boolean(store.getState().audioOn);

  if(isStorySfxPlaying('rain'))setStorySfxVolume('rain',RAIN_VOLUME);

  if(page===lastPage&&enabled===lastEnabled)return;
  lastPage=page;
  lastEnabled=enabled;
  if(!enabled||!SCENE_PAGES.has(page)||!isTargetStory(root))return;
  if(!isStorySfxPlaying('rain')){
    void playStorySfx('rain',{enabled:true,loop:true,volume:RAIN_VOLUME});
  }else{
    setStorySfxVolume('rain',RAIN_VOLUME);
  }
}

export function installRain7780(root,store){
  if(root.dataset.rain7780Installed==='1')return;
  root.dataset.rain7780Installed='1';
  const observer=new MutationObserver(()=>ensureRain(root,store));
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  root.addEventListener('pointerdown',()=>ensureRain(root,store),{capture:true});
  root.addEventListener('click',()=>ensureRain(root,store),{capture:true});
  ensureRain(root,store);
}
