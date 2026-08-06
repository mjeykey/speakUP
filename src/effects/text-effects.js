const DEFAULT_EFFECT = 'scatter';
const LEGACY_EFFECT_KEY = 'speakup-text-effect';
const MODE_EFFECT_PREFIX = 'speakup-text-effect:';
const EFFECT_COLORS = ['#65e8ff','#a875ff','#ff5fd7','#dffbff'];

export const TEXT_EFFECTS = [
  { id: 'scatter', label: 'Scatter' },
  { id: 'burst', label: 'Burst' },
  { id: 'float', label: 'Float' },
  { id: 'glow', label: 'Glow' },
  { id: 'collapse', label: 'Push & Collapse' },
  { id: 'particel', label: 'particel' }
];

export const EFFECT_MODES = [
  { id: 'words', label: 'Words', preview: 'palavra' },
  { id: 'sentences', label: 'Sentences', preview: 'Eu consigo aprender.' },
  { id: 'story', label: 'Story', preview: 'A história continua.' },
  { id: 'memory', label: 'Memory', preview: 'esperança' },
  { id: 'speak-practice', label: 'Speak & Grow', preview: 'Confio em mim.' }
];

export function getModeTextEffect(mode) {
  try {
    return localStorage.getItem(`${MODE_EFFECT_PREFIX}${mode}`) || localStorage.getItem(LEGACY_EFFECT_KEY) || DEFAULT_EFFECT;
  } catch (_) { return DEFAULT_EFFECT; }
}

export function setModeTextEffect(mode, effect) {
  try { localStorage.setItem(`${MODE_EFFECT_PREFIX}${mode}`, effect); } catch (_) {}
}

export function getTextEffect() { return getModeTextEffect('words'); }
export function setTextEffect(effect) { setModeTextEffect('words', effect); }

function randomBetween(min, max) { return min + Math.random() * (max - min); }

function wrapCharacters(element) {
  if (!element) return [];
  const text = element.textContent || '';
  element.textContent = '';
  element.setAttribute('aria-label', text);
  const fragment = document.createDocumentFragment();
  const characters = [];
  Array.from(text).forEach((character, index) => {
    const span = document.createElement('span');
    span.className = 'text-effect-character';
    span.setAttribute('aria-hidden', 'true');
    span.dataset.characterIndex = String(index);
    span.textContent = character === ' ' ? '\u00a0' : character;
    span.style.setProperty('--effect-color', EFFECT_COLORS[index % EFFECT_COLORS.length]);
    fragment.appendChild(span);
    characters.push(span);
  });
  element.appendChild(fragment);
  return characters;
}

function framesFor(effect, index, total) {
  const progress = total > 1 ? index / (total - 1) : 0.5;
  const angle = randomBetween(0, Math.PI * 2);
  const distance = randomBetween(115, 270);
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const rotation = randomBetween(-190, 190);
  const color = EFFECT_COLORS[index % EFFECT_COLORS.length];

  if (effect === 'collapse') {
    const centered = progress - .5;
    const shove = centered < 0 ? 1 : -1;
    const inwardX = centered * -240;
    return [
      { opacity: 1, transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
      { opacity: 1, color, textShadow: `0 0 16px ${color}`, transform: `translate(${shove * 22}px,${randomBetween(-8,8)}px) scale(1.08)`, offset: .2 },
      { opacity: .9, color, transform: `translate(${inwardX * .62}px,${randomBetween(-10,10)}px) rotate(${rotation * .08}deg) scale(.72,.92)`, filter: 'blur(1px)', offset: .58 },
      { opacity: 0, color, textShadow: `0 0 38px ${color}`, transform: `translate(${inwardX}px,${randomBetween(-5,5)}px) rotate(${rotation * .14}deg) scale(.04,.45)`, filter: 'blur(12px)' }
    ];
  }

  if (effect === 'burst') return [
    { opacity: 1, transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
    { opacity: 1, color, textShadow: `0 0 18px ${color}`, transform: `translate(${(progress-.5)*24}px,-10px) scale(1.16)`, offset: .18 },
    { opacity: 0, color, textShadow: `0 0 34px ${color}`, transform: `translate(${(progress-.5)*390}px,${randomBetween(-220,220)}px) rotate(${rotation}deg) scale(.45)`, filter: 'blur(8px)' }
  ];

  if (effect === 'float') return [
    { opacity: 1, transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
    { opacity: .96, color, textShadow: `0 0 18px ${color}`, transform: `translate(${randomBetween(-18,18)}px,-32px) scale(1.07)`, offset: .22 },
    { opacity: 0, color, textShadow: `0 0 34px ${color}`, transform: `translate(${randomBetween(-110,110)}px,${randomBetween(-240,-135)}px) rotate(${rotation*.5}deg) scale(.62)`, filter: 'blur(10px)' }
  ];

  if (effect === 'glow') return [
    { opacity: 1, transform: 'translate(0,0) scale(1)', filter: 'brightness(1) blur(0)', textShadow: '0 0 0 transparent' },
    { opacity: 1, color, transform: 'translate(0,-7px) scale(1.2)', filter: 'brightness(2.3)', textShadow: `0 0 32px ${color}`, offset: .28 },
    { opacity: 0, color, transform: `translate(${x*.7}px,${y*.7}px) rotate(${rotation*.45}deg) scale(.25)`, filter: 'brightness(2.8) blur(14px)', textShadow: `0 0 54px ${color}` }
  ];

  return [
    { opacity: 1, transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
    { opacity: .96, color, textShadow: `0 0 17px ${color}`, transform: `translate(${x*.14}px,${y*.14}px) scale(1.08)`, offset: .18 },
    { opacity: 0, color, textShadow: `0 0 34px ${color}`, transform: `translate(${x}px,${y}px) rotate(${rotation}deg) scale(.32)`, filter: 'blur(9px)' }
  ];
}

function createFragment(character, fragmentIndex, duration, delay) {
  const rect = character.getBoundingClientRect();
  const fragment = document.createElement('span');
  const width = randomBetween(2.5, Math.max(4, rect.width * .22));
  const height = randomBetween(2.5, Math.max(4, rect.height * .18));
  const startX = rect.left + randomBetween(rect.width * .12, rect.width * .88);
  const startY = rect.top + randomBetween(rect.height * .12, rect.height * .88);
  const driftX = randomBetween(-34, 34);
  const fallY = randomBetween(34, 105);
  const rotation = randomBetween(-170, 170);
  const color = getComputedStyle(character).color || EFFECT_COLORS[fragmentIndex % EFFECT_COLORS.length];

  fragment.setAttribute('aria-hidden', 'true');
  Object.assign(fragment.style, {
    position: 'fixed',
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${width}px`,
    height: `${height}px`,
    background: color,
    clipPath: `polygon(${randomBetween(0,18)}% 0,100% ${randomBetween(0,28)}%,${randomBetween(72,100)}% 100%,0 ${randomBetween(68,100)}%)`,
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '9999',
    transformOrigin: 'center'
  });
  document.body.appendChild(fragment);

  const animation = fragment.animate([
    { opacity: 0, transform: 'translate(-50%,-50%) rotate(0deg) scale(.45)' },
    { opacity: .86, transform: `translate(calc(-50% + ${driftX * .08}px),calc(-50% + ${fallY * .04}px)) rotate(${rotation * .08}deg) scale(1)`, offset: .18 },
    { opacity: .78, transform: `translate(calc(-50% + ${driftX * .38}px),calc(-50% + ${fallY * .28}px)) rotate(${rotation * .38}deg) scale(.84)`, offset: .55 },
    { opacity: 0, transform: `translate(calc(-50% + ${driftX}px),calc(-50% + ${fallY}px)) rotate(${rotation}deg) scale(.18)`, filter: 'blur(1.5px)' }
  ], {
    duration,
    delay,
    easing: 'cubic-bezier(.22,.61,.36,1)',
    fill: 'forwards'
  });

  return animation.finished.catch(() => {}).finally(() => fragment.remove());
}

async function runParticelEffect(characters, duration, stagger) {
  const fragmentAnimations = [];
  const characterAnimations = [];

  characters.forEach((character, index) => {
    character.style.display = 'inline-block';
    character.style.willChange = 'transform, opacity, filter';
    const delay = index * Math.max(12, stagger * .7);
    const tilt = randomBetween(-2.2, 2.2);
    const drop = randomBetween(4, 11);

    characterAnimations.push(character.animate([
      { opacity: 1, transform: 'translate(0,0) rotate(0deg) scale(1)', filter: 'blur(0)' },
      { opacity: 1, transform: `translate(${randomBetween(-1.5,1.5)}px,1px) rotate(${tilt * .25}deg) scale(1.01)`, filter: 'blur(0)', offset: .2 },
      { opacity: .9, transform: `translate(${randomBetween(-2,2)}px,${drop * .35}px) rotate(${tilt * .6}deg) scale(.97,.94)`, filter: 'blur(.3px)', offset: .5 },
      { opacity: .42, transform: `translate(${randomBetween(-3,3)}px,${drop}px) rotate(${tilt}deg) scale(.84,.7)`, filter: 'blur(1.8px)', offset: .78 },
      { opacity: 0, transform: `translate(${randomBetween(-5,5)}px,${drop + 12}px) rotate(${tilt * 1.4}deg) scale(.55,.35)`, filter: 'blur(6px)' }
    ], {
      duration,
      delay,
      easing: 'cubic-bezier(.25,.46,.45,.94)',
      fill: 'forwards'
    }).finished.catch(() => {}));

    if (character.textContent.trim()) {
      const fragmentCount = Math.max(12, Math.min(24, Math.round(character.getBoundingClientRect().width * .55)));
      for (let i = 0; i < fragmentCount; i += 1) {
        const fractureDelay = delay + duration * randomBetween(.28, .62);
        fragmentAnimations.push(createFragment(character, index + i, duration * randomBetween(.44, .68), fractureDelay));
      }
    }
  });

  await Promise.all([...characterAnimations, ...fragmentAnimations]);
}

export async function explodeText(elements, effect = DEFAULT_EFFECT, options = {}) {
  const list = (Array.isArray(elements) ? elements : [elements]).filter(Boolean);
  if (!list.length) return;
  const allCharacters = list.flatMap(wrapCharacters);
  const duration = options.duration || 1750;
  const stagger = options.stagger ?? 20;

  if (effect === 'particel') {
    await runParticelEffect(allCharacters, 3000, stagger);
    return;
  }

  const animations = allCharacters.map((character, index) => {
    character.style.display = 'inline-block';
    character.style.willChange = 'transform, opacity, filter, color, text-shadow';
    return character.animate(framesFor(effect, index, allCharacters.length), {
      duration,
      delay: index * stagger,
      easing: effect === 'collapse' ? 'cubic-bezier(.55,.02,.72,.38)' : 'cubic-bezier(.16,.78,.2,1)',
      fill: 'forwards'
    }).finished.catch(() => {});
  });
  await Promise.all(animations);
}
