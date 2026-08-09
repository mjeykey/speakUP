import {
  TEXT_EFFECTS,
  EFFECT_MODES,
  getModeTextEffect,
  setModeTextEffect,
  getTextEffect,
  setTextEffect,
  explodeText as baseExplodeText
} from './text-effects.js?v=16';

export { TEXT_EFFECTS, EFFECT_MODES, getModeTextEffect, setModeTextEffect, getTextEffect, setTextEffect };

const CLASSIC_EFFECTS = new Set(['scatter', 'burst', 'float', 'glow', 'collapse']);
const COLORS = ['#65e8ff', '#a875ff', '#ff5fd7', '#dffbff'];
const rand = (min, max) => min + Math.random() * (max - min);

function wrapCharacters(element) {
  if (!element) return [];
  const text = element.textContent || '';
  element.textContent = '';
  element.setAttribute('aria-label', text);
  const fragment = document.createDocumentFragment();
  const characters = [];

  Array.from(text).forEach((value, index) => {
    const span = document.createElement('span');
    span.className = 'text-effect-character';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = value === ' ' ? '\u00a0' : value;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform,opacity,filter,color,text-shadow';
    span.style.setProperty('--effect-color', COLORS[index % COLORS.length]);
    fragment.appendChild(span);
    characters.push(span);
  });

  element.appendChild(fragment);
  return characters;
}

function scatterFrames(index) {
  const color = COLORS[index % COLORS.length];
  const angle = rand(0, Math.PI * 2);
  const distance = rand(180, 360);
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const bendX = rand(-90, 90);
  const bendY = rand(-70, 70);
  const rotation = rand(-520, 520);

  return [
    { opacity: 1, color, transform: 'translate(0,0) rotate(0deg) scale(1)', filter: 'blur(0)', textShadow: `0 0 8px ${color}` },
    { opacity: .98, color, transform: `translate(${bendX * .35}px,${bendY * .35}px) rotate(${rotation * .08}deg) scale(1.06)`, textShadow: `0 0 18px ${color}`, offset: .24 },
    { opacity: .78, color, transform: `translate(${x * .42 + bendX}px,${y * .38 + bendY}px) rotate(${rotation * .46}deg) scale(.88)`, filter: 'blur(.8px)', textShadow: `0 0 24px ${color}`, offset: .58 },
    { opacity: .35, color, transform: `translate(${x * .78 - bendX * .25}px,${y * .78 - bendY * .2}px) rotate(${rotation * .78}deg) scale(.48)`, filter: 'blur(3px)', offset: .84 },
    { opacity: 0, color, transform: `translate(${x}px,${y}px) rotate(${rotation}deg) scale(.12)`, filter: 'blur(10px)', textShadow: `0 0 34px ${color}` }
  ];
}

function burstFrames(index, total) {
  const color = COLORS[index % COLORS.length];
  const center = Math.max(1, total - 1) / 2;
  const normalized = (index - center) / Math.max(1, center);
  const side = normalized < 0 ? -1 : 1;
  const horizontal = side * (300 + Math.abs(normalized) * 220);
  const vertical = normalized * 120 + rand(-28, 28);
  const rotation = side * rand(50, 130);

  return [
    { opacity: 1, color: '#ffffff', transform: 'translate(0,0) scale(1)', filter: 'brightness(1)', textShadow: '0 0 0 transparent' },
    { opacity: 1, color: '#dffbff', transform: 'translate(0,0) scale(.84)', filter: 'brightness(1.28)', textShadow: '0 0 10px #65e8ff', offset: .16 },
    { opacity: 1, color, transform: 'translate(0,0) scale(1.48)', filter: 'brightness(2.8)', textShadow: `0 0 46px ${color}`, offset: .32 },
    { opacity: .96, color, transform: `translate(${horizontal * .22}px,${vertical * .22}px) rotate(${rotation * .16}deg) scale(1.1)`, filter: 'brightness(2)', textShadow: `0 0 34px ${color}`, offset: .5 },
    { opacity: .5, color, transform: `translate(${horizontal * .72}px,${vertical * .72}px) rotate(${rotation * .7}deg) scale(.5)`, filter: 'brightness(1.45) blur(2px)', offset: .78 },
    { opacity: 0, color, transform: `translate(${horizontal}px,${vertical}px) rotate(${rotation}deg) scale(.04)`, filter: 'blur(9px)', textShadow: `0 0 42px ${color}` }
  ];
}

function floatFrames(index) {
  const drift = rand(-55, 55);
  const rise = rand(-260, -390);
  const rotation = rand(-18, 18);
  const color = COLORS[index % COLORS.length];
  return [
    { opacity: 1, color, transform: 'translate(0,0) rotate(0deg) scale(1)', filter: 'blur(0)', textShadow: `0 0 8px ${color}` },
    { opacity: .98, color, transform: `translate(${drift * .08}px,-18px) rotate(${rotation * .08}deg) scale(1.04)`, textShadow: `0 0 18px ${color}`, offset: .24 },
    { opacity: .82, color, transform: `translate(${drift * .38}px,${rise * .42}px) rotate(${rotation * .35}deg) scale(.96)`, filter: 'blur(.4px)', textShadow: `0 0 24px ${color}`, offset: .62 },
    { opacity: 0, color, transform: `translate(${drift}px,${rise}px) rotate(${rotation}deg) scale(.72)`, filter: 'blur(8px)', textShadow: `0 0 34px ${color}` }
  ];
}

function glowFrames(index) {
  const color = COLORS[index % COLORS.length];
  return [
    { opacity: 1, color: '#ffffff', transform: 'scale(1)', filter: 'brightness(1) blur(0)', textShadow: '0 0 0 transparent' },
    { opacity: 1, color, transform: 'scale(1.08)', filter: 'brightness(1.65)', textShadow: `0 0 22px ${color}`, offset: .24 },
    { opacity: 1, color, transform: 'scale(1.2)', filter: 'brightness(2.8)', textShadow: `0 0 58px ${color}`, offset: .55 },
    { opacity: .6, color, transform: 'scale(1.08)', filter: 'brightness(2.25) blur(3px)', textShadow: `0 0 88px ${color}`, offset: .82 },
    { opacity: 0, color, transform: 'scale(.94)', filter: 'brightness(3) blur(18px)', textShadow: `0 0 104px ${color}` }
  ];
}

function collapseFrames(index, total) {
  const center = (total - 1) / 2;
  const direction = center - index;
  const inwardX = direction * 18;
  const color = COLORS[index % COLORS.length];
  return [
    { opacity: 1, color, transform: 'translate(0,0) scale(1,1)', filter: 'blur(0)', textShadow: `0 0 7px ${color}` },
    { opacity: 1, color, transform: `translate(${Math.sign(direction || 1) * -12}px,0) scale(1.06,.98)`, textShadow: `0 0 18px ${color}`, offset: .24 },
    { opacity: .95, color, transform: `translate(${inwardX * .52}px,2px) scale(.7,.86)`, filter: 'blur(.5px)', textShadow: `0 0 24px ${color}`, offset: .56 },
    { opacity: .55, color, transform: `translate(${inwardX}px,5px) scale(.24,.58)`, filter: 'blur(2px)', offset: .8 },
    { opacity: 0, color, transform: `translate(${inwardX * 1.12}px,8px) scale(.015,.28)`, filter: 'blur(10px)', textShadow: `0 0 38px ${color}` }
  ];
}

function framesFor(effect, index, total) {
  if (effect === 'burst') return burstFrames(index, total);
  if (effect === 'float') return floatFrames(index);
  if (effect === 'glow') return glowFrames(index);
  if (effect === 'collapse') return collapseFrames(index, total);
  return scatterFrames(index);
}

function timingFor(effect, requestedDuration) {
  if (effect === 'burst') return { duration: Math.max(2400, requestedDuration * 1.38), easing: 'cubic-bezier(.2,.55,.2,1)' };
  if (effect === 'float') return { duration: Math.max(3900, requestedDuration * 2.1), easing: 'cubic-bezier(.22,.5,.3,1)' };
  if (effect === 'glow') return { duration: Math.max(3500, requestedDuration * 1.9), easing: 'cubic-bezier(.2,.48,.3,1)' };
  if (effect === 'collapse') return { duration: Math.max(3400, requestedDuration * 1.82), easing: 'cubic-bezier(.45,.08,.65,.38)' };
  return { duration: Math.max(3200, requestedDuration * 1.72), easing: 'cubic-bezier(.22,.5,.28,1)' };
}

function delayFor(effect, index, stagger) {
  if (effect === 'burst') return Math.min(index * 6, 80);
  if (effect === 'scatter') return index * Math.max(32, stagger * 1.5) + rand(0, 180);
  return index * Math.max(26, stagger * 1.25);
}

export async function explodeText(elements, effect = 'scatter', options = {}) {
  if (!CLASSIC_EFFECTS.has(effect)) {
    return baseExplodeText(elements, effect, options);
  }

  const list = (Array.isArray(elements) ? elements : [elements]).filter(Boolean);
  if (!list.length) return;
  const characters = list.flatMap(wrapCharacters);
  const requestedDuration = options.duration || 1750;
  const stagger = options.stagger ?? 20;
  const timing = timingFor(effect, requestedDuration);

  try {
    await Promise.all(characters.map((character, index) => character.animate(
      framesFor(effect, index, characters.length),
      {
        duration: timing.duration,
        delay: delayFor(effect, index, stagger),
        easing: timing.easing,
        fill: 'forwards'
      }
    ).finished.catch(() => {})));
  } catch (error) {
    console.warn('Distinct text effect skipped so the learning flow can continue.', error);
  }
}
