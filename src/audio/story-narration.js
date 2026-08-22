import { speak, stopSpeech } from './speech.js?v=63';

const BELL_HEADSTART_MS=1800;
const DOOR_HEADSTART_MS=950;
const sleep=ms=>new Promise(resolve=>window.setTimeout(resolve,ms));

function headstartForSound(sound){
  if(sound==='bell')return BELL_HEADSTART_MS;
  if(sound==='door-creak')return DOOR_HEADSTART_MS;
  return 0;
}

export function stopStoryNarration(){
  stopSpeech();
}

export async function narrateStory({text,voice,enabled=true,rate=.82,sound='none',isCurrent=()=>true}={}){
  if(!enabled||!text||!isCurrent())return false;
  const headstart=headstartForSound(sound);
  if(headstart>0){
    await sleep(headstart);
    if(!isCurrent())return false;
  }
  await speak(text,voice,{enabled:true,rate});
  return isCurrent();
}
