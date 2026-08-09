let stormAudio=null,flashTimer=null,rumbleCtx=null,sirenCtx=null,sirenTimer=null,sirenNodes=[];
const STORM='https://assets.mixkit.co/active_storage/sfx/2402/2402-preview.mp3';

export async function startAudio(){
  if(stormAudio)return;
  stormAudio=new Audio(STORM);
  stormAudio.loop=true;
  stormAudio.preload='auto';
  stormAudio.volume=.78;
  await stormAudio.play();
  startSirenSong();
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
    const now=rumbleCtx.currentTime;
    const gain=rumbleCtx.createGain();
    gain.gain.setValueAtTime(.001,now);
    gain.gain.exponentialRampToValueAtTime(.21,now+.18);
    gain.gain.exponentialRampToValueAtTime(.06,now+1.4);
    gain.gain.exponentialRampToValueAtTime(.001,now+4.6);
    gain.connect(rumbleCtx.destination);
    [44,56,67].forEach((hz,n)=>{
      const o=rumbleCtx.createOscillator();
      o.type='sine';
      o.frequency.setValueAtTime(hz,now);
      o.frequency.exponentialRampToValueAtTime(hz*.64,now+4);
      const og=rumbleCtx.createGain();
      og.gain.value=.38/(n+1);
      o.connect(og).connect(gain);
      o.start(now+n*.04);
      o.stop(now+4.8);
    });
  }catch(e){}
}

function startSirenSong(){
  try{
    sirenCtx=new (window.AudioContext||window.webkitAudioContext)();
    const master=sirenCtx.createGain();
    master.gain.value=.10;
    const convolver=sirenCtx.createConvolver();
    convolver.buffer=makeImpulse(sirenCtx,3.4,2.4);
    const wet=sirenCtx.createGain();wet.gain.value=.78;
    const dry=sirenCtx.createGain();dry.gain.value=.18;
    master.connect(dry).connect(sirenCtx.destination);
    master.connect(convolver).connect(wet).connect(sirenCtx.destination);
    sirenNodes=[master,convolver,wet,dry];
    const melody=[220,246.94,261.63,293.66,261.63,246.94,220,196,220,261.63,329.63,293.66,261.63,220];
    let step=0;
    const singNote=()=>{
      if(!sirenCtx)return;
      const now=sirenCtx.currentTime;
      const f=melody[step%melody.length];
      step++;
      const env=sirenCtx.createGain();
      env.gain.setValueAtTime(.0001,now);
      env.gain.exponentialRampToValueAtTime(.8,now+.7);
      env.gain.exponentialRampToValueAtTime(.12,now+2.8);
      env.gain.exponentialRampToValueAtTime(.0001,now+4.2);
      env.connect(master);
      [1,.5,2].forEach((ratio,idx)=>{
        const o=sirenCtx.createOscillator();
        o.type=idx===0?'sine':'triangle';
        o.frequency.setValueAtTime(f*ratio,now);
        o.detune.value=(idx-1)*5;
        const og=sirenCtx.createGain();
        og.gain.value=idx===0?.58:idx===1?.16:.08;
        o.connect(og).connect(env);
        o.start(now);
        o.stop(now+4.3);
      });
      const form1=sirenCtx.createBiquadFilter();form1.type='bandpass';form1.frequency.value=800;form1.Q.value=5;
      const form2=sirenCtx.createBiquadFilter();form2.type='bandpass';form2.frequency.value=1200;form2.Q.value=7;
      const breath=sirenCtx.createOscillator();breath.type='sine';breath.frequency.value=f*1.005;
      const bg=sirenCtx.createGain();bg.gain.value=.07;
      breath.connect(form1).connect(bg).connect(env);
      breath.connect(form2).connect(bg);
      breath.start(now);breath.stop(now+4.3);
      clearTimeout(sirenTimer);
      sirenTimer=setTimeout(singNote,2500+Math.random()*1600);
    };
    setTimeout(singNote,2600);
  }catch(e){}
}

function makeImpulse(ctx,duration,decay){
  const rate=ctx.sampleRate,length=rate*duration,impulse=ctx.createBuffer(2,length,rate);
  for(let c=0;c<2;c++){
    const data=impulse.getChannelData(c);
    for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/length,decay);
  }
  return impulse;
}

export function softenAudio(){
  if(stormAudio)stormAudio.volume=.14;
  if(sirenNodes[0])sirenNodes[0].gain.setTargetAtTime(.02,sirenCtx.currentTime,.6);
}

export function stopAudio(){
  clearTimeout(flashTimer);clearTimeout(sirenTimer);
  if(stormAudio){stormAudio.pause();stormAudio.currentTime=0;stormAudio=null}
  if(rumbleCtx){rumbleCtx.close();rumbleCtx=null}
  if(sirenCtx){sirenCtx.close();sirenCtx=null}
  sirenNodes=[];
}