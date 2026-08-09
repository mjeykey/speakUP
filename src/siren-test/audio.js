let stormAudio=null,sirenAudio=null,voiceAudio=null,voiceTimer=null,flashTimer=null,rumbleCtx=null,voiceCtx=null,voiceGain=null;
const STORM='https://assets.mixkit.co/active_storage/sfx/2402/2402-preview.mp3';
const SIREN=new URL('../../assets/audio/alesiadavina-a-sirenx27s-song-207057%20(1).mp3?v=3',import.meta.url).href;
const VOICE=new URL('../../assets/siren_voice_final.mp3?v=3',import.meta.url).href;

function makeImpulse(ctx,duration=7.2,decay=2.1){const rate=ctx.sampleRate,length=Math.floor(rate*duration),impulse=ctx.createBuffer(2,length,rate);for(let c=0;c<2;c++){const data=impulse.getChannelData(c);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/length,decay)}return impulse}

function setupVoiceFx(){try{voiceCtx=new (window.AudioContext||window.webkitAudioContext)();const src=voiceCtx.createMediaElementSource(voiceAudio);const dry=voiceCtx.createGain();dry.gain.value=.025;const conv=voiceCtx.createConvolver();conv.buffer=makeImpulse(voiceCtx,7.2,2.1);const wet=voiceCtx.createGain();wet.gain.value=.92;const delay1=voiceCtx.createDelay(2);delay1.delayTime.value=.58;const delay2=voiceCtx.createDelay(3);delay2.delayTime.value=1.18;const echo1=voiceCtx.createGain();echo1.gain.value=.30;const echo2=voiceCtx.createGain();echo2.gain.value=.16;voiceGain=voiceCtx.createGain();voiceGain.gain.value=.055;src.connect(dry).connect(voiceGain);src.connect(conv).connect(wet).connect(voiceGain);src.connect(delay1).connect(echo1).connect(voiceGain);src.connect(delay2).connect(echo2).connect(voiceGain);voiceGain.connect(voiceCtx.destination)}catch(e){console.warn('Voice reverb unavailable',e)}}

export async function startAudio(){
  if(stormAudio||sirenAudio)return;
  stormAudio=new Audio(STORM);stormAudio.loop=true;stormAudio.preload='auto';stormAudio.volume=.30;
  sirenAudio=new Audio(SIREN);sirenAudio.loop=true;sirenAudio.preload='auto';sirenAudio.volume=1;
  voiceAudio=new Audio(VOICE);voiceAudio.loop=false;voiceAudio.preload='auto';voiceAudio.volume=1;
  setupVoiceFx();

  try{sirenAudio.currentTime=0}catch(e){}
  const starts=[];
  try{starts.push(sirenAudio.play())}catch(e){console.warn('Siren audio unavailable',e)}
  try{starts.push(stormAudio.play())}catch(e){console.warn('Storm audio unavailable',e)}
  if(voiceCtx?.state==='suspended'){try{await voiceCtx.resume()}catch(e){}}
  await Promise.allSettled(starts);

  // Earlier invitation; do not keep a third HTML audio element silently playing on mobile.
  clearTimeout(voiceTimer);
  voiceTimer=setTimeout(()=>{
    if(!voiceAudio)return;
    try{voiceAudio.currentTime=0}catch(e){}
    voiceAudio.play().catch(e=>console.warn('Voice audio unavailable',e));
  },5000);

  scheduleLightning();
}

function scheduleLightning(){clearTimeout(flashTimer);flashTimer=setTimeout(()=>{const f=document.getElementById('flash');if(f){f.classList.remove('go');void f.offsetWidth;f.classList.add('go')}thunderRumble();scheduleLightning()},5200+Math.random()*7600)}
function thunderRumble(){try{if(!rumbleCtx)rumbleCtx=new (window.AudioContext||window.webkitAudioContext)();if(rumbleCtx.state==='suspended')rumbleCtx.resume();const now=rumbleCtx.currentTime,gain=rumbleCtx.createGain();gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.15,now+.18);gain.gain.exponentialRampToValueAtTime(.04,now+1.4);gain.gain.exponentialRampToValueAtTime(.001,now+4.2);gain.connect(rumbleCtx.destination);[44,56].forEach((hz,n)=>{const o=rumbleCtx.createOscillator();o.type='sine';o.frequency.setValueAtTime(hz,now);o.frequency.exponentialRampToValueAtTime(hz*.7,now+3.8);const og=rumbleCtx.createGain();og.gain.value=.25/(n+1);o.connect(og).connect(gain);o.start(now+n*.05);o.stop(now+4.3)})}catch(e){}}
export function softenAudio(){if(stormAudio)stormAudio.volume=.10;if(sirenAudio)sirenAudio.volume=.18;if(voiceGain&&voiceCtx)voiceGain.gain.setTargetAtTime(.012,voiceCtx.currentTime,.3)}
export function stopAudio(){clearTimeout(flashTimer);clearTimeout(voiceTimer);if(stormAudio){stormAudio.pause();stormAudio.currentTime=0;stormAudio=null}if(sirenAudio){sirenAudio.pause();sirenAudio.currentTime=0;sirenAudio=null}if(voiceAudio){voiceAudio.pause();voiceAudio.currentTime=0;voiceAudio=null}if(rumbleCtx){rumbleCtx.close();rumbleCtx=null}if(voiceCtx){voiceCtx.close();voiceCtx=null}voiceGain=null}