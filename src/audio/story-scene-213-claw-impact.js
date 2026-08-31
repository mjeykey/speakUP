const TARGET_TEXT='A claw struck the lower wall of the watchtower. Stone dust burst from the doorway.';
const TARGET_TEXT_PT='Uma garra atingiu a parede inferior da torre de vigia. Poeira de pedra explodiu pela entrada.';

const GROWL_URL=new URL('../../assets/audio/monster-growl-213.mp3?v=299',import.meta.url).href;
const ROCK_URL=new URL('../../assets/audio/rocks-gravel-213.mp3?v=299',import.meta.url).href;

let growl=null;
let rocks=null;
let installed=false;

function makeAudio(url,volume=1){
  const audio=new Audio(url);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.volume=volume;
  return audio;
}

function ensureAudio(){
  if(!growl)growl=makeAudio(GROWL_URL,.9);
  if(!rocks)rocks=makeAudio(ROCK_URL,.95);
}

function reset(audio){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){ }
}

function play(audio){
  if(!audio)return Promise.resolve();
  reset(audio);
  return Promise.resolve(audio.play()).catch(()=>{});
}

function isTarget(text=''){
  const value=String(text).trim();
  return value.includes(TARGET_TEXT)||value.includes(TARGET_TEXT_PT);
}

function strikeIndex(text=''){
  const value=String(text);
  const lower=value.toLocaleLowerCase();
  for(const term of ['struck','atingiu']){
    const index=lower.indexOf(term);
    if(index>=0)return index;
  }
  return -1;
}

export function installScene213ClawImpact(){
  if(installed)return;
  installed=true;
  ensureAudio();

  document.addEventListener('pointerdown',event=>{
    if(!event.target.closest('[data-next],[data-prev],[data-start]'))return;
    ensureAudio();
    for(const audio of [growl,rocks]){
      const oldVolume=audio.volume;
      audio.volume=0;
      void Promise.resolve(audio.play()).then(()=>{
        window.setTimeout(()=>{reset(audio);audio.volume=oldVolume;},60);
      }).catch(()=>{audio.volume=oldVolume;});
    }
  },true);

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

    const triggerRocks=()=>{
      if(rocksPlayed)return;
      rocksPlayed=true;
      ensureAudio();
      void play(rocks);
    };

    utterance.addEventListener?.('boundary',event=>{
      const charIndex=Number(event.charIndex);
      if(Number.isFinite(charIndex)&&anchor>=0&&charIndex>=anchor)triggerRocks();
    });

    const originalEnd=utterance.onend;
    utterance.onend=event=>{
      if(!rocksPlayed)triggerRocks();
      originalEnd?.call(utterance,event);
    };

    ensureAudio();
    reset(growl);
    growl.volume=.9;

    let spoken=false;
    const startNarration=()=>{
      if(spoken)return;
      spoken=true;
      originalSpeak(utterance);
    };

    growl.addEventListener('ended',startNarration,{once:true});
    void Promise.resolve(growl.play()).then(()=>{
      window.setTimeout(startNarration,1800);
    }).catch(startNarration);
  };

  synth.__speakupScene213Wrapped=true;
}
