import {
  TEXT_EFFECTS,
  EFFECT_MODES,
  getModeTextEffect,
  setModeTextEffect,
  getTextEffect,
  setTextEffect,
  explodeText as baseExplodeText
} from './text-effects.js?v=13';

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
  const angle = rand(0, Math.PI * 2);
  const distance = rand(190, 390);
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const rotation = rand(-420, 420);
  const color = COLORS[index % COLORS.length];
  return [
    { opacity: 1, transform: 'translate(0,0) rotate(0deg) scale(1)', filter: 'blur(0)' },
    { opacity: 1, transform: `translate(${x * .08}px,${y * .08}px) rotate(${rotation * .04}deg) scale(1.12)`, textShadow: `0 0 12px ${color}`, offset: .14 },
    { opacity: .72, transform: `translate(${x * .45}px,${y * .45}px) rotate(${rotation * .42}deg) scale(.82)`, filter: 'blur(1px)', offset: .52 },
    { opacity: 0, transform: `translate(${x}px,${y}px) rotate(${rotation}deg) scale(.18)`, filter: 'blur(9px)' }
  ];
}

function burstFrames(index, total) {
  const center = (total - 1) / 2;
  const side = index < center ? -1 : 1;
  const horizontal = side * rand(240, 470);
  const vertical = rand(-170, 170);
  const rotation = rand(-220, 220);
  const color = COLORS[index % COLORS.length];
  return [
    { opacity: 1, transform: 'translate(0,0) scale(1)', filter: 'brightness(1)' },
    { opacity: 1, transform: 'translate(0,-3px) scale(1.38)', filter: 'brightness(2.2)', textShadow: `0 0 30px ${color}`, offset: .16 },
    { opacity: .92, transform: `translate(${horizontal * .18}px,${vertical * .12}px) scale(1.02)`, filter: 'brightness(1.7)', offset: .3 },
    { opacity: 0, transform: `translate(${horizontal}px,${vertical}px) rotate(${rotation}deg) scale(.08)`, filter: 'blur(7px)' }
  ];
}

function floatFrames(index) {
  const drift = rand(-55, 55);
  const rise = rand(-260, -390);
  const rotation = rand(-18, 18);
  const color = COLORS[index % COLORS.length];
  return [
    { opacity: 1, transform: 'translate(0,0) rotate(0deg) scale(1)', filter: 'blur(0)' },
    { opacity: .98, transform: `translate(${drift * .08}px,-18px) rotate(${rotation * .08}deg) scale(1.04)`, textShadow: `0 0 10px ${color}`, offset: .18 },
    { opacity: .82, transform: `translate(${drift * .38}px,${rise * .42}px) rotate(${rotation * .35}deg) scale(.96)`, filter: 'blur(.4px)', offset: .58 },
    { opacity: 0, transform: `translate(${drift}px,${rise}px) rotate(${rotation}deg) scale(.72)`, filter: 'blur(8px)' }
  ];
}

function glowFrames(index) {
  const color = COLORS[index % COLORS.length];
  return [
    { opacity: 1, transform: 'scale(1)', filter: 'brightness(1) blur(0)', textShadow: '0 0 0 transparent' },
    { opacity: 1, color, transform: 'scale(1.08)', filter: 'brightness(1.7)', textShadow: `0 0 18px ${color}`, offset: .2 },
    { opacity: 1, color, transform: 'scale(1.22)', filter: 'brightness(3)', textShadow: `0 0 54px ${color}`, offset: .5 },
    { opacity: .6, color, transform: 'scale(1.08)', filter: 'brightness(2.4) blur(3px)', textShadow: `0 0 80px ${color}`, offset: .76 },
    { opacity: 0, color, transform: 'scale(.94)', filter: 'brightness(3.2) blur(18px)', textShadow: `0 0 96px ${color}` }
  ];
}

function collapseFrames(index, total) {
  const center = (total - 1) / 2;
  const direction = center - index;
  const inwardX = direction * 18;
  const color = COLORS[index % COLORS.length];
  return [
    { opacity: 1, transform: 'translate(0,0) scale(1,1)', filter: 'blur(0)' },
    { opacity: 1, transform: `translate(${Math.sign(direction || 1) * -12}px,0) scale(1.06,.98)`, textShadow: `0 0 12px ${color}`, offset: .18 },
    { opacity: .95, transform: `translate(${inwardX * .52}px,2px) scale(.7,.86)`, filter: 'blur(.5px)', offset: .48 },
    { opacity: .55, transform: `translate(${inwardX}px,5px) scale(.24,.58)`, filter: 'blur(2px)', offset: .74 },
    { opacity: 0, transform: `translate(${inwardX * 1.12}px,8px) scale(.015,.28)`, filter: 'blur(10px)' }
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
  if (effect === 'burst') return { duration: Math.max(1050, requestedDuration * .78), easing: 'cubic-bezier(.12,.78,.2,1)' };
  if (effect === 'float') return { duration: Math.max(2550, requestedDuration * 1.42), easing: 'cubic-bezier(.22,.58,.3,1)' };
  if (effect === 'glow') return { duration: Math.max(2200, requestedDuration * 1.24), easing: 'cubic-bezier(.2,.55,.3,1)' };
  if (effect === 'collapse') return { duration: Math.max(2050, requestedDuration * 1.12), easing: 'cubic-bezier(.62,.02,.78,.34)' };
  return { duration: Math.max(1750, requestedDuration), easing: 'cubic-bezier(.12,.7,.18,1)' };
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
        delay: index * stagger,
        easing: timing.easing,
        fill: 'forwards'
      }
    ).finished.catch(() => {})));
  } catch (error) {
    console.warn('Distinct text effect skipped so the learning flow can continue.', error);
  }
}
