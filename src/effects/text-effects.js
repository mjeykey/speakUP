const EFFECT_KEY = 'speakup-text-effect';

export const TEXT_EFFECTS = [
  { id: 'scatter', label: 'Scatter' },
  { id: 'burst', label: 'Burst' },
  { id: 'float', label: 'Float' },
  { id: 'glow', label: 'Glow' }
];

export function getTextEffect() {
  try { return localStorage.getItem(EFFECT_KEY) || 'scatter'; }
  catch (_) { return 'scatter'; }
}

export function setTextEffect(effect) {
  try { localStorage.setItem(EFFECT_KEY, effect); }
  catch (_) {}
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

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
    fragment.appendChild(span);
    characters.push(span);
  });

  element.appendChild(fragment);
  return characters;
}

function framesFor(effect, index, total) {
  const progress = total > 1 ? index / (total - 1) : 0.5;
  const angle = randomBetween(0, Math.PI * 2);
  const distance = randomBetween(95, 230);
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const rotation = randomBetween(-160, 160);

  if (effect === 'burst') {
    const centered = progress - 0.5;
    return [
      { opacity: 1, transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
      { opacity: 1, transform: `translate(${centered * 18}px,-8px) scale(1.12)`, offset: 0.2 },
      { opacity: 0, transform: `translate(${centered * 310}px,${randomBetween(-180,180)}px) rotate(${rotation}deg) scale(.55)`, filter: 'blur(7px)' }
    ];
  }

  if (effect === 'float') {
    return [
      { opacity: 1, transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
      { opacity: .95, transform: `translate(${randomBetween(-12,12)}px,-24px) scale(1.04)`, offset: .25 },
      { opacity: 0, transform: `translate(${randomBetween(-85,85)}px,${randomBetween(-190,-105)}px) rotate(${rotation * .45}deg) scale(.72)`, filter: 'blur(9px)' }
    ];
  }

  if (effect === 'glow') {
    return [
      { opacity: 1, transform: 'translate(0,0) scale(1)', filter: 'brightness(1) blur(0)', textShadow: '0 0 0 transparent' },
      { opacity: 1, transform: 'translate(0,-5px) scale(1.14)', filter: 'brightness(2)', textShadow: '0 0 26px #65e8ff', offset: .32 },
      { opacity: 0, transform: `translate(${x * .55}px,${y * .55}px) rotate(${rotation * .35}deg) scale(.35)`, filter: 'brightness(2.4) blur(12px)', textShadow: '0 0 42px #ff5fd7' }
    ];
  }

  return [
    { opacity: 1, transform: 'translate(0,0) rotate(0) scale(1)', filter: 'blur(0)' },
    { opacity: .92, transform: `translate(${x * .12}px,${y * .12}px) scale(1.06)`, offset: .2 },
    { opacity: 0, transform: `translate(${x}px,${y}px) rotate(${rotation}deg) scale(.42)`, filter: 'blur(8px)' }
  ];
}

export async function explodeText(elements, effect = getTextEffect(), options = {}) {
  const list = (Array.isArray(elements) ? elements : [elements]).filter(Boolean);
  if (!list.length) return;

  const allCharacters = list.flatMap(wrapCharacters);
  const duration = options.duration || 1500;
  const stagger = options.stagger ?? 18;
  const animations = allCharacters.map((character, index) => {
    character.style.display = 'inline-block';
    character.style.willChange = 'transform, opacity, filter';
    return character.animate(framesFor(effect, index, allCharacters.length), {
      duration,
      delay: index * stagger,
      easing: 'cubic-bezier(.18,.72,.22,1)',
      fill: 'forwards'
    }).finished.catch(() => {});
  });

  await Promise.all(animations);
}
