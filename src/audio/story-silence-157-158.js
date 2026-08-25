import { stopStoryEffects, syncStoryLocationAmbience } from './story-effects.js?v=270';

const SILENT_PAGES=new Set([157,158]);
let lastPage=-1;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function sync(root){
  const page=currentPage(root);
  if(page===lastPage)return;
  lastPage=page;
  if(SILENT_PAGES.has(page)&&isTargetStory(root)){
    stopStoryEffects();
    syncStoryLocationAmbience('none',{enabled:false,volume:0});
  }
}

export function installSilence157158(root){
  if(root.dataset.silence157158Installed==='1')return;
  root.dataset.silence157158Installed='1';
  const observer=new MutationObserver(()=>sync(root));
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync(root);
}
