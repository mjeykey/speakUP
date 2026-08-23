import { isStorySfxPlaying, preloadStorySfx, playStorySfx, setStorySfxVolume, stopStorySfx, transitionStorySfx } from './story-sfx.js?v=215';

const BELL_NORMAL_VOLUME=.90;
const BELL_LEARNING_VOLUME=.68;
const DOOR_VOLUME=1;

function bellVolumeForPhase(phaseIndex){
  return phaseIndex===1||phaseIndex===3?BELL_LEARNING_VOLUME:BELL_NORMAL_VOLUME;
}

export function stopStoryEffects(){
  stopStorySfx();
}

export function prepareStoryEffects(storyId){
  if(storyId==='fantasy-1'){
    void preloadStorySfx('bell');
    void preloadStorySfx('door-creak');
  }
}

export function ensureStoryEffect({storyId,sound,ambientSound='none',phaseIndex,enabled=true,isCurrent=()=>true}={}){
  if(storyId!=='fantasy-1'||!enabled||!isCurrent())return;

  if(ambientSound==='rain'&&!isStorySfxPlaying('rain')){
    void playStorySfx('rain',{enabled:true,loop:true,volume:.40});
  }

  if(!sound||sound==='none'||sound==='rain'||sound==='door-creak')return;

  if(sound==='bell')setStorySfxVolume('bell',bellVolumeForPhase(phaseIndex));
  if(isStorySfxPlaying(sound))return;

  const volume=sound==='rain'?0.40:sound==='ocean-waves'?0.45:sound==='bell'?bellVolumeForPhase(phaseIndex):0.30;
  const start=()=>{
    if(!isCurrent()||isStorySfxPlaying(sound))return;
    void playStorySfx(sound,{enabled:true,loop:sound==='rain'||sound==='ocean-waves',volume});
  };

  if(sound==='rain'||sound==='bell'){
    start();
    return;
  }
  void preloadStorySfx(sound).then(ok=>{if(ok)start();});
}

export function transitionStoryEffects({storyId,enabled=true,targetSound='none',targetAmbientSound='none'}={}){
  transitionStorySfx({keepRain:storyId==='fantasy-1'&&enabled&&targetAmbientSound==='rain'});
  if(storyId==='fantasy-1'&&enabled&&targetSound==='door-creak'){
    void playStorySfx('door-creak',{enabled:true,loop:false,volume:DOOR_VOLUME});
  }
}
