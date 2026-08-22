let doorContext = null;
let activeDoorNodes = [];

function getDoorContext() {
  if (doorContext) return doorContext;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  doorContext = new AudioContextClass({ latencyHint: 'interactive' });
  return doorContext;
}

function clearDoorNodes() {
  activeDoorNodes.forEach(node => {
    try { node.stop?.(0); } catch (_) {}
    try { node.disconnect?.(); } catch (_) {}
  });
  activeDoorNodes = [];
}

function startDoorCreak(volume = 0.95) {
  const ctx = getDoorContext();
  if (!ctx || ctx.state !== 'running') return false;

  clearDoorNodes();
  const now = ctx.currentTime + 0.01;
  const master = ctx.createGain();
  master.gain.setValueAtTime(Math.max(0.35, Math.min(1, volume)), now);
  master.connect(ctx.destination);

  const hinge = ctx.createOscillator();
  const hingeGain = ctx.createGain();
  hinge.type = 'sawtooth';
  hinge.frequency.setValueAtTime(520, now);
  hinge.frequency.exponentialRampToValueAtTime(145, now + 1.45);
  hingeGain.gain.setValueAtTime(0.0001, now);
  hingeGain.gain.exponentialRampToValueAtTime(0.22, now + 0.06);
  hingeGain.gain.exponentialRampToValueAtTime(0.045, now + 0.34);
  hingeGain.gain.exponentialRampToValueAtTime(0.19, now + 0.58);
  hingeGain.gain.exponentialRampToValueAtTime(0.035, now + 0.88);
  hingeGain.gain.exponentialRampToValueAtTime(0.14, now + 1.08);
  hingeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
  hinge.connect(hingeGain);
  hingeGain.connect(master);

  const metal = ctx.createOscillator();
  const metalGain = ctx.createGain();
  metal.type = 'triangle';
  metal.frequency.setValueAtTime(1180, now);
  metal.frequency.exponentialRampToValueAtTime(310, now + 1.25);
  metalGain.gain.setValueAtTime(0.0001, now);
  metalGain.gain.exponentialRampToValueAtTime(0.10, now + 0.03);
  metalGain.gain.exponentialRampToValueAtTime(0.018, now + 0.25);
  metalGain.gain.exponentialRampToValueAtTime(0.08, now + 0.48);
  metalGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
  metal.connect(metalGain);
  metalGain.connect(master);

  const noiseBuffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 1.45), ctx.sampleRate);
  const noise = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noise.length; i += 1) {
    const decay = 1 - i / noise.length;
    noise[i] = (Math.random() * 2 - 1) * decay;
  }
  const noiseSource = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();
  noiseSource.buffer = noiseBuffer;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1450, now);
  filter.frequency.exponentialRampToValueAtTime(420, now + 1.35);
  filter.Q.value = 3.2;
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.11, now + 0.04);
  noiseGain.gain.exponentialRampToValueAtTime(0.025, now + 0.72);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
  noiseSource.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(master);

  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thud.type = 'sine';
  thud.frequency.setValueAtTime(105, now + 1.28);
  thud.frequency.exponentialRampToValueAtTime(48, now + 1.68);
  thudGain.gain.setValueAtTime(0.0001, now);
  thudGain.gain.setValueAtTime(0.0001, now + 1.26);
  thudGain.gain.exponentialRampToValueAtTime(0.34, now + 1.31);
  thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.72);
  thud.connect(thudGain);
  thudGain.connect(master);

  hinge.start(now);
  hinge.stop(now + 1.52);
  metal.start(now);
  metal.stop(now + 1.32);
  noiseSource.start(now);
  noiseSource.stop(now + 1.45);
  thud.start(now + 1.26);
  thud.stop(now + 1.74);

  activeDoorNodes = [hinge, hingeGain, metal, metalGain, noiseSource, filter, noiseGain, thud, thudGain, master];
  window.setTimeout(() => {
    if (!activeDoorNodes.includes(master)) return;
    clearDoorNodes();
  }, 1900);
  return true;
}

export function unlockDoorCreak() {
  const ctx = getDoorContext();
  if (!ctx) return Promise.resolve(false);
  if (ctx.state === 'running') return Promise.resolve(true);
  return ctx.resume().then(() => ctx.state === 'running').catch(() => false);
}

export function playDoorCreak(volume = 0.95) {
  const ctx = getDoorContext();
  if (!ctx) return Promise.resolve(false);
  if (ctx.state === 'running') return Promise.resolve(startDoorCreak(volume));
  return ctx.resume().then(() => startDoorCreak(volume)).catch(() => false);
}

export function stopDoorCreak() {
  clearDoorNodes();
}

if (typeof window !== 'undefined') {
  const prime = () => { void unlockDoorCreak(); };
  window.addEventListener('pointerdown', prime, { capture: true });
  window.addEventListener('touchstart', prime, { capture: true, passive: true });
}
