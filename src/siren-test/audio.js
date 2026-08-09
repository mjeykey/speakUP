let stormAudio=null,flashTimer=null,rumbleCtx=null,sirenCtx=null,sirenTimer=null,sirenNodes=[];
const STORM='https://assets.mixkit.co/active_storage/sfx/2402/2402-preview.mp3';

export async function startAudio(){
  if(stormAudio)return;

  // Create/resume WebAudio synchronously inside the user's click gesture.
  // Mobile Safari may keep a context silent if it is created after an await.
  try{
    sirenCtx=new (window.AudioContext||window.webkitAudioContext)();
    await sirenCtx.resume();
    startSirenSong();
  }catch(e){console.warn('Siren audio unavailable',e)}

  stormAudio=new Audio(STORM);
  stormAudio.loop=true;
  stormAudio.preload='auto';
  stormAudio.volume=.68;
  try{await stormAudio.play()}catch(e){console.warn('Storm audio unavailable',e)}
  scheduleLightning();
}

function scheduleLightning(){
  clearTimeout(flashTimer);
  flashTimer=setTimeout(()=>{
    const f=document.getElementById('flash');
    if(f){f.classList.remove('go');void f.offsetWidth;f.classList.add('go')}
    thunderRumble();
    scheduleLightning();
  },5200+Math.random()*7600);
}

function thunderRumble(){
  try{
    if(!rumbleCtx)rumbleCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(rumbleCtx.state==='suspended')rumbleCtx.resume();
    const now=rumbleCtx.currentTime;
    const gain=rumbleCtx.createGain();
    gain.gain.setValueAtTime(.001,now);
    gain.gain.exponentialRampToValueAtTime(.25,now+.18);
    gain.gain.exponentialRampToValueAtTime(.07,now+1.4);
    gain.gain.exponentialRampToValueAtTime(.001,now+4.6);
    gain.connect(rumbleCtx.destination);
    [44,56,67].forEach((hz,n)=>{
      const o=rumbleCtx.createOscillator();
      o.type='sine';
      o.frequency.setValueAtTime(hz,now);
      o.frequency.exponentialRampToValueAtTime(hz*.64,now+4);
      const og=rumbleCtx.createGain();
      og.gain.value=.42/(n+1);
      o.connect(og).connect(gain);
      o.start(now+n*.04);
      o.stop(now+4.8);
    });
  }catch(e){}
}

function startSirenSong(){
  if(!sirenCtx)return;
  try{
    const master=sirenCtx.createGain();
    // Intentionally obvious for this test; we'll lower it once you approve the sound.
    master.gain.value=.34;
    const convolver=sirenCtx.createConvolver();
    convolver.buffer=makeImpulse(sirenCtx,3.6,2.5);
    const wet=sirenCtx.createGain();wet.gain.value=.48;
    const dry=sirenCtx.createGain();dry.gain.value=.72;
    master.connect(dry).connect(sirenCtx.destination);
    master.connect(convolver).connect(wet).connect(sirenCtx.destination);
    sirenNodes=[master,convolver,wet,dry];

    // Slow human-vocal-like melody, kept in a comfortable female vocal register.
    const melody=[392,440,493.88,523.25,493.88,440,392,349.23,392,440,523.25,587.33,523.25,493.88,440];
    let step=0;
    const singNote=()=>{
      if(!sirenCtx)return;
      const now=sirenCtx.currentTime;
      const f=melody[step%melody.length];
      step++;

      const env=sirenCtx.createGain();
      env.gain.setValueAtTime(.0001,now);
      env.gain.exponentialRampToValueAtTime(.75,now+.45);
      env.gain.exponentialRampToValueAtTime(.32,now+2.1);
      env.gain.exponentialRampToValueAtTime(.0001,now+3.8);
      env.connect(master);

      const fundamental=sirenCtx.createOscillator();
      fundamental.type='sine';
      fundamental.frequency.setValueAtTime(f,now);
      fundamental.frequency.linearRampToValueAtTime(f*1.015,now+1.6);
      fundamental.frequency.linearRampToValueAtTime(f*.995,now+3.5);
      const fg=sirenCtx.createGain();fg.gain.value=.66;
      fundamental.connect(fg).connect(env);
      fundamental.start(now);fundamental.stop(now+3.9);

      const harmonic=sirenCtx.createOscillator();
      harmonic.type='sine';
      harmonic.frequency.value=f*2;
      const hg=sirenCtx.createGain();hg.gain.value=.11;
      harmonic.connect(hg).connect(env);
      harmonic.start(now);harmonic.stop(now+3.9);

      const alto=sirenCtx.createOscillator();
      alto.type='triangle';
      alto.frequency.value=f*.5;
      const ag=sirenCtx.createGain();ag.gain.value=.07;
      alto.connect(ag).connect(env);
      alto.start(now);alto.stop(now+3.9);

      clearTimeout(sirenTimer);
      sirenTimer=setTimeout(singNote,2600);
    };

    // Start immediately so mobile users can confirm it is working.
    singNote();
  }catch(e){console.warn('Siren melody failed',e)}
}

function makeImpulse(ctx,duration,decay){
  const rate=ctx.sampleRate,length=Math.floor(rate*duration),impulse=ctx.createBuffer(2,length,rate);
  for(let c=0;c<2;c++){
    const data=impulse.getChannelData(c);
    for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/length,decay);
  }
  return impulse;
}

export function softenAudio(){
  if(stormAudio)stormAudio.volume=.14;
  if(sirenNodes[0]&&sirenCtx)sirenNodes[0].gain.setTargetAtTime(.02,sirenCtx.currentTime,.6);
}

export function stopAudio(){
  clearTimeout(flashTimer);clearTimeout(sirenTimer);
  if(stormAudio){stormAudio.pause();stormAudio.currentTime=0;stormAudio=null}
  if(rumbleCtx){rumbleCtx.close();rumbleCtx=null}
  if(sirenCtx){sirenCtx.close();sirenCtx=null}
  sirenNodes=[];
}