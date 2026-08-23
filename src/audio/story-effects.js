import { isStorySfxPlaying, preloadStorySfx, playStorySfx, setStorySfxVolume, stopStorySfx } from './story-sfx.js?v=204';
import { isDoorCreakPlaying, playDoorCreak, stopDoorCreak, unlockDoorCreak } from './story-door.js?v=2';

const BELL_NORMAL_VOLUME=.90;
const BELL_LEARNING_VOLUME=.68;
const DOOR_VOLUME=1;

function bellVolumeForPhase(phaseIndex){
  return phaseIndex===1||phaseIndex===3?BELL_LEARNING_VOLUME:BELL_NORMAL_VOLUME;
}

export function stopStoryEffects(){
  stopStorySfx();
  stopDoorCreak();
}

export function prepareStoryEffects(storyId){
  if(storyId==='fantasy-1'){
    void preloadStorySfx('bell');
    void unlockDoorCreak();
  }
}

export function ensureStoryEffect({storyId,sound,phaseIndex,enabled=true,isCurrent=()=>true}={}){
  if(storyId!=='fantasy-1'||!enabled||!sound||sound==='none'||!isCurrent())return;
  if(sound==='door-creak')return;

  if(sound==='bell')setStorySfxVolume('bell',bellVolumeForPhase(phaseIndex));
  if(isStorySfxPlaying(sound))return;

  const volume=sound==='rain'?0.40:sound==='bell'?bellVolumeForPhase(phaseIndex):0.30;
  const start=()=>{
    if(!isCurrent()||isStorySfxPlaying(sound))return;
    void playStorySfx(sound,{enabled:true,loop:sound==='rain',volume});
  };

  if(sound==='rain'||sound==='bell'){
    start();
    return;
  }
  void preloadStorySfx(sound).then(ok=>{if(ok)start();});
}

export function transitionStoryEffects({storyId,enabled=true,currentSound='none',targetSound='none',sameSourcePage=false}={}){
  if(storyId!=='fantasy-1'||!enabled){
    stopStoryEffects();
    return;
  }

  if(targetSound==='door-creak'){
    stopStorySfx();
    if(!(sameSourcePage&&currentSound==='door-creak'&&isDoorCreakPlaying())){
      void playDoorCreak(DOOR_VOLUME);
    }
    return;
  }

  stopDoorCreak();
  const preserveContinuous=Boolean(
    sameSourcePage&&
    currentSound===targetSound&&
    (currentSound==='rain'||currentSound==='bell')
  );
  if(!preserveContinuous)stopStorySfx();
}
