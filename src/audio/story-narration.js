const synth=window.speechSynthesis;
let storySpeechRunId=0;
let cachedVoices=[];

const isMobileSpeechDevice=(()=>{
  const coarsePointer=window.matchMedia?.('(pointer: coarse)')?.matches;
  const mobileUserAgent=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||'');
  return Boolean(coarsePointer||mobileUserAgent);
})();

const BELL_HEADSTART_MS=1800;
const DOOR_HEADSTART_MS=950;
const sleep=ms=>new Promise(resolve=>window.setTimeout(resolve,ms));

function refreshVoices(){
  cachedVoices=synth?.getVoices?.()||[];
  return cachedVoices;
}

if(synth){
  refreshVoices();
  synth.addEventListener?.('voiceschanged',refreshVoices);
}

async function ensureVoices(runId,timeoutMs=900){
  if(!synth||runId!==storySpeechRunId)return[];
  let voices=synth.getVoices?.()||[];
  if(voices.length){cachedVoices=voices;return voices;}
  await new Promise(resolve=>{
    let done=false;
    const finish=()=>{
      if(done)return;
      done=true;
      synth.removeEventListener?.('voiceschanged',onVoicesChanged);
      window.clearTimeout(timer);
      resolve();
    };
    const onVoicesChanged=()=>finish();
    const timer=window.setTimeout(finish,timeoutMs);
    synth.addEventListener?.('voiceschanged',onVoicesChanged);
  });
  if(runId!==storySpeechRunId)return[];
  voices=synth.getVoices?.()||[];
  if(voices.length)cachedVoices=voices;
  return voices;
}

function pickVoice(language,voices){
  const requested=String(language||'').toLowerCase();
  const base=requested.split('-')[0];
  const list=voices?.length?voices:cachedVoices;
  return list.find(voice=>String(voice.lang||'').toLowerCase()===requested)
    ||list.find(voice=>{
      const lang=String(voice.lang||'').toLowerCase();
      return lang===base||lang.startsWith(`${base}-`);
    })
    ||null;
}

function headstartForSound(sound){
  if(sound==='bell')return BELL_HEADSTART_MS;
  if(sound==='door-creak')return DOOR_HEADSTART_MS;
  return 0;
}

function cancelActiveStorySpeech(){
  storySpeechRunId+=1;
  if(synth&&(synth.speaking||synth.pending||synth.paused))synth.cancel?.();
  return storySpeechRunId;
}

export function stopStoryNarration(){
  cancelActiveStorySpeech();
}

export async function narrateStory({text,voice,enabled=true,rate=.82,sound='none',isCurrent=()=>true,onStart=null,onBoundary=null}={}){
  const value=String(text||'').replace(/\s+/g,' ').trim();
  if(!enabled||!value||!synth||!isCurrent())return false;

  const runId=cancelActiveStorySpeech();
  const headstart=headstartForSound(sound);
  if(headstart>0){
    await sleep(headstart);
    if(runId!==storySpeechRunId||!isCurrent())return false;
  }

  const voices=await ensureVoices(runId);
  if(runId!==storySpeechRunId||!isCurrent())return false;

  if(isMobileSpeechDevice){
    await sleep(20);
    if(runId!==storySpeechRunId||!isCurrent())return false;
    synth.resume?.();
  }

  const utterance=new SpeechSynthesisUtterance(value);
  utterance.lang=voice||'en-GB';
  utterance.rate=String(utterance.lang).toLowerCase().startsWith('pt')?Math.min(Number(rate)||.82,.62):(Number(rate)||.82);
  utterance.pitch=1;
  const selectedVoice=pickVoice(utterance.lang,voices);
  if(selectedVoice)utterance.voice=selectedVoice;

  return await new Promise(resolve=>{
    if(runId!==storySpeechRunId||!isCurrent())return resolve(false);
    let settled=false;
    const finish=()=>{
      if(settled)return;
      settled=true;
      resolve(runId===storySpeechRunId&&isCurrent());
    };
    utterance.onstart=()=>{
      if(runId!==storySpeechRunId||!isCurrent())return;
      try{onStart?.({text:value,rate:utterance.rate,voice:utterance.lang});}catch(error){console.warn('Story narration start hook failed.',error);}
    };
    utterance.onboundary=event=>{
      if(runId!==storySpeechRunId||!isCurrent())return;
      try{onBoundary?.({charIndex:Number(event.charIndex)||0,name:event.name||'',elapsedTime:Number(event.elapsedTime)||0});}catch(error){console.warn('Story narration boundary hook failed.',error);}
    };
    utterance.onend=finish;
    utterance.onerror=finish;
    synth.resume?.();
    synth.speak(utterance);
  });
}
