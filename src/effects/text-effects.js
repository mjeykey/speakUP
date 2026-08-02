const DEFAULT_EFFECT = 'scatter';
const LEGACY_EFFECT_KEY = 'speakup-text-effect';
const MODE_EFFECT_PREFIX = 'speakup-text-effect:';
const EFFECT_COLORS = ['#65e8ff','#a875ff','#ff5fd7','#dffbff'];

export const TEXT_EFFECTS = [
  { id: 'scatter', label: 'Scatter' },
  { id: 'burst', label: 'Burst' },
  { id: 'float', label: 'Float' },
  { id: 'glow', label: 'Glow' }
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
    return localStorage.getItem(`${MODE_EFFECT_PREFIX}${mode}`)
      || localStorage.getItem(LEGACY_EFFECT_KEY)
      || DEFAULT_EFFECT;
  } catch (_) {
    return DEFAULT_EFFECT;
  }
}

export function setModeTextEffect(mode, effect) {
  try { localStorage.setItem(`${MODE_EFFECT_PREFIX}${mode}`, effect); }
  catch (_) {}
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
    const color = EFFECT_COLORS[index % EFFECT_COLORS.length];
    span.style.setProperty('--effect-color', color);
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

  if (effect === 'burst') {
    const centered = progress - 0.5;
    return [
      { opacity: 1, color: 'currentColor', transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
      { opacity: 1, color, textShadow: `0 0 18px ${color}`, transform: `translate(${centered * 24}px,-10px) scale(1.16)`, offset: 0.18 },
      { opacity: 0, color, textShadow: `0 0 34px ${color}`, transform: `translate(${centered * 390}px,${randomBetween(-220,220)}px) rotate(${rotation}deg) scale(.45)`, filter: 'blur(8px)' }
    ];
  }

  if (effect === 'float') {
    return [
      { opacity: 1, color: 'currentColor', transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
      { opacity: .96, color, textShadow: `0 0 18px ${color}`, transform: `translate(${randomBetween(-18,18)}px,-32px) scale(1.07)`, offset: .22 },
      { opacity: 0, color, textShadow: `0 0 34px ${color}`, transform: `translate(${randomBetween(-110,110)}px,${randomBetween(-240,-135)}px) rotate(${rotation * .5}deg) scale(.62)`, filter: 'blur(10px)' }
    ];
  }

  if (effect === 'glow') {
    return [
      { opacity: 1, color: 'currentColor', transform: 'translate(0,0) scale(1)', filter: 'brightness(1) blur(0)', textShadow: '0 0 0 transparent' },
      { opacity: 1, color, transform: 'translate(0,-7px) scale(1.2)', filter: 'brightness(2.3)', textShadow: `0 0 32px ${color}`, offset: .28 },
      { opacity: 0, color, transform: `translate(${x * .7}px,${y * .7}px) rotate(${rotation * .45}deg) scale(.25)`, filter: 'brightness(2.8) blur(14px)', textShadow: `0 0 54px ${color}` }
    ];
  }

  return [
    { opacity: 1, color: 'currentColor', transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
    { opacity: .96, color, textShadow: `0 0 17px ${color}`, transform: `translate(${x * .14}px,${y * .14}px) scale(1.08)`, offset: .18 },
    { opacity: 0, color, textShadow: `0 0 34px ${color}`, transform: `translate(${x}px,${y}px) rotate(${rotation}deg) scale(.32)`, filter: 'blur(9px)' }
  ];
}

export async function explodeText(elements, effect = DEFAULT_EFFECT, options = {}) {
  const list = (Array.isArray(elements) ? elements : [elements]).filter(Boolean);
  if (!list.length) return;

  const allCharacters = list.flatMap(wrapCharacters);
  const duration = options.duration || 1750;
  const stagger = options.stagger ?? 20;
  const animations = allCharacters.map((character, index) => {
    character.style.display = 'inline-block';
    character.style.willChange = 'transform, opacity, filter, color, text-shadow';
    return character.animate(framesFor(effect, index, allCharacters.length), {
      duration,
      delay: index * stagger,
      easing: 'cubic-bezier(.16,.78,.2,1)',
      fill: 'forwards'
    }).finished.catch(() => {});
  });

  await Promise.all(animations);
}
