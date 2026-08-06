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

function createParticle(character, index, duration, delay) {
  const rect = character.getBoundingClientRect();
  const particle = document.createElement('span');
  const size = randomBetween(2, 5);
  const color = EFFECT_COLORS[index % EFFECT_COLORS.length];
  particle.setAttribute('aria-hidden', 'true');
  Object.assign(particle.style, {
    position: 'fixed',
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top + rect.height / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 ${size * 2}px ${color}`,
    pointerEvents: 'none',
    zIndex: '9999'
  });
  document.body.appendChild(particle);
  const angle = randomBetween(0, Math.PI * 2);
  const distance = randomBetween(35, 125);
  const animation = particle.animate([
    { opacity: 0, transform: 'translate(-50%,-50%) scale(.2)' },
    { opacity: 1, transform: `translate(calc(-50% + ${Math.cos(angle) * distance * .25}px),calc(-50% + ${Math.sin(angle) * distance * .25}px)) scale(1)`, offset: .25 },
    { opacity: 0, transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px),calc(-50% + ${Math.sin(angle) * distance}px)) scale(.1)`, filter: 'blur(2px)' }
  ], { duration, delay, easing: 'cubic-bezier(.18,.72,.24,1)', fill: 'forwards' });
  return animation.finished.catch(() => {}).finally(() => particle.remove());
}

async function runParticelEffect(characters, duration, stagger) {
  const particles = [];
  characters.forEach((character, index) => {
    character.style.display = 'inline-block';
    character.style.willChange = 'transform, opacity, filter';
    const delay = index * stagger;
    character.animate([
      { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' },
      { opacity: .75, transform: 'scale(1.06)', filter: 'blur(.5px)', offset: .2 },
      { opacity: 0, transform: 'scale(.55)', filter: 'blur(7px)' }
    ], { duration: duration * .62, delay, easing: 'ease-out', fill: 'forwards' });
    if (character.textContent.trim()) {
      for (let i = 0; i < 9; i += 1) particles.push(createParticle(character, index + i, duration, delay + i * 18));
    }
  });
  await Promise.all(particles);
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
