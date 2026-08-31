import { getBase64AudioSource } from './story-b64-source.js?v=300';

const TARGET_TEXT='A claw struck the lower wall of the watchtower. Stone dust burst from the doorway.';
const TARGET_TEXT_PT='Uma garra atingiu a parede inferior da torre de vigia. Poeira de pedra explodiu pela entrada.';

const GROWL_PARTS=[new URL('../../assets/audio/monster-growl-213.b64?v=300',import.meta.url).href];
const ROCK_PARTS=[new URL('../../assets/audio/rocks-gravel-213.b64?v=300',import.meta.url).href];

let growl=null;
let rocks=null;
let growlPromise=null;
let rocksPromise=null;
let installed=false;

async function getGrowl(){
  if(growl)return growl;
  if(growlPromise)return growlPromise;
  growlPromise=(async()=>{
    const src=await getBase64AudioSource(GROWL_PARTS);
    const audio=new Audio(src);
    audio.setAttribute('playsinline','');
    audio.preload='auto';
    audio.loop=false;
    audio.volume=.9;
    growl=audio;
    return audio;
  })().catch(error=>{growlPromise=null;throw error;});
  return growlPromise;
}

async function getRocks(){
  if(rocks)return rocks;
  if(rocksPromise)return rocksPromise;
  rocksPromise=(async()=>{
    const src=await getBase64AudioSource(ROCK_PARTS);
    const audio=new Audio(src);
    audio.setAttribute('playsinline','');
    audio.preload='auto';
    audio.loop=false;
    audio.volume=.98;
    rocks=audio;
    return audio;
  })().catch(error=>{rocksPromise=null;throw error;});
  return rocksPromise;
}

function reset(audio){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){ }
}

async function playRocks(){
  let audio;
  try{audio=await getRocks();}catch(_){return;}
  reset(audio);
  audio.volume=.98;
  void Promise.resolve(audio.play()).catch(()=>{});
}

function isTarget(text=''){
  const value=String(text).trim();
  return value.includes(TARGET_TEXT)||value.includes(TARGET_TEXT_PT);
}

function strikeIndex(text=''){
  const lower=String(text).toLocaleLowerCase();
  for(const term of ['struck','atingiu']){
    const index=lower.indexOf(term);
    if(index>=0)return index;
  }
  return -1;
}

function primeAudio(){
  for(const promise of [getGrowl(),getRocks()]){
    void promise.then(audio=>{
      const oldVolume=audio.volume;
      audio.volume=0;
      reset(audio);
      void Promise.resolve(audio.play()).then(()=>{
        window.setTimeout(()=>{reset(audio);audio.volume=oldVolume;},60);
      }).catch(()=>{audio.volume=oldVolume;});
    }).catch(()=>{});
  }
}

export function installScene213ClawImpact(){
  if(installed)return;
  installed=true;
  void getGrowl().catch(()=>{});
  void getRocks().catch(()=>{});

  document.addEventListener('pointerdown',primeAudio,{once:false,capture:true});

  const synth=window.speechSynthesis;
  if(!synth||typeof synth.speak!=='function'||synth.__speakupScene213Wrapped)return;

  const originalSpeak=synth.speak.bind(synth);
  synth.speak=utterance=>{
    if(!utterance||!isTarget(utterance.text)||utterance.__speakupScene213Inserted){
      return originalSpeak(utterance);
    }

    utterance.__speakupScene213Inserted=true;
    const anchor=strikeIndex(utterance.text);
    let rocksPlayed=false;
    let fallbackTimer=0;

    const triggerRocks=()=>{
      if(rocksPlayed)return;
      rocksPlayed=true;
      if(fallbackTimer)window.clearTimeout(fallbackTimer);
      void playRocks();
    };

    utterance.addEventListener?.('boundary',event=>{
      const charIndex=Number(event.charIndex);
      if(Number.isFinite(charIndex)&&anchor>=0&&charIndex>=anchor)triggerRocks();
    });

    const originalStart=utterance.onstart;
    utterance.onstart=event=>{
      originalStart?.call(utterance,event);
      // Android/Chrome speech synthesis often does not emit word-boundary events.
      // "struck" is the third spoken word, so this timer guarantees the impact there.
      fallbackTimer=window.setTimeout(triggerRocks,760);
    };

    const originalEnd=utterance.onend;
    utterance.onend=event=>{
      if(fallbackTimer)window.clearTimeout(fallbackTimer);
      if(!rocksPlayed)triggerRocks();
      originalEnd?.call(utterance,event);
    };

    const originalError=utterance.onerror;
    utterance.onerror=event=>{
      if(fallbackTimer)window.clearTimeout(fallbackTimer);
      originalError?.call(utterance,event);
    };

    let spoken=false;
    const startNarration=()=>{
      if(spoken)return;
      spoken=true;
      originalSpeak(utterance);
    };

    void getGrowl().then(audio=>{
      reset(audio);
      audio.volume=.9;
      audio.addEventListener('ended',startNarration,{once:true});
      void Promise.resolve(audio.play()).then(()=>{
        window.setTimeout(startNarration,1800);
      }).catch(startNarration);
    }).catch(startNarration);
  };

  synth.__speakupScene213Wrapped=true;
}
