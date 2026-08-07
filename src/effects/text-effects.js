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
  { id: 'particel', label: 'particel' },
  { id: 'cascade', label: 'Cascade' }
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

function createGlyphSnapshot(character) {
  const rect = character.getBoundingClientRect();
  const style = getComputedStyle(character);
  const scale = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(rect.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(width * scale));
  canvas.height = Math.max(1, Math.ceil(height * scale));
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return null;

  context.scale(scale, scale);
  context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = style.color;
  context.fillText(character.textContent, width / 2, height / 2);

  Object.assign(canvas.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${width}px`,
    height: `${height}px`,
    pointerEvents: 'none',
    zIndex: '9999'
  });

  return { canvas, context, width, height, scale };
}

function shuffleInPlace(values) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

function dissolveGlyphAtPosition(character, startDelay, duration) {
  return new Promise(resolve => {
    const snapshot = createGlyphSnapshot(character);
    if (!snapshot) { resolve(); return; }

    const { canvas, context } = snapshot;
    let imageData;
    try {
      imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    } catch (_) {
      character.style.opacity = '0';
      resolve();
      return;
    }

    const visiblePixels = [];
    for (let offset = 3; offset < imageData.data.length; offset += 4) {
      if (imageData.data[offset] > 18) visiblePixels.push(offset);
    }
    shuffleInPlace(visiblePixels);

    document.body.appendChild(canvas);
    character.style.opacity = '0';

    const begin = performance.now() + startDelay;
    let cleared = 0;

    const frame = now => {
      if (now < begin) {
        window.requestAnimationFrame(frame);
        return;
      }

      const progress = Math.min(1, (now - begin) / duration);
      const softened = 1 - Math.pow(1 - progress, 1.35);
      const target = Math.floor(visiblePixels.length * softened);

      while (cleared < target) {
        const alphaOffset = visiblePixels[cleared];
        imageData.data[alphaOffset] = 0;
        cleared += 1;
      }

      context.putImageData(imageData, 0, 0);

      if (progress < 1) {
        window.requestAnimationFrame(frame);
      } else {
        canvas.remove();
        resolve();
      }
    };

    window.requestAnimationFrame(frame);
  });
}

async function runParticelEffect(characters, totalDuration = 3000) {
  const visibleCharacters = characters.filter(character => character.textContent.trim());
  if (!visibleCharacters.length) return;

  const count = visibleCharacters.length;
  const step = Math.max(45, Math.min(180, totalDuration * .58 / count));
  const dissolveDuration = Math.max(700, totalDuration - step * Math.max(0, count - 1));
  const tasks = visibleCharacters.map((character, index) =>
    dissolveGlyphAtPosition(character, index * step, dissolveDuration)
  );

  await Promise.race([
    Promise.all(tasks),
    new Promise(resolve => window.setTimeout(resolve, totalDuration + 900))
  ]);
}

function buildCascadeParticles(snapshot, imageData) {
  const particles = [];
  const step = Math.max(4, Math.round(snapshot.scale * 2.8));

  for (let py = 0; py < snapshot.canvas.height; py += step) {
    for (let px = 0; px < snapshot.canvas.width; px += step) {
      const offset = (py * snapshot.canvas.width + px) * 4;
      const alpha = imageData.data[offset + 3];
      if (alpha < 35) continue;

      particles.push({
        x: px,
        y: py,
        r: imageData.data[offset],
        g: imageData.data[offset + 1],
        b: imageData.data[offset + 2],
        alpha: alpha / 255,
        size: randomBetween(step * .55, step * 1.05),
        vx: randomBetween(-34, 34) * snapshot.scale,
        vy: randomBetween(26, 58) * snapshot.scale,
        sway: randomBetween(-20, 20) * snapshot.scale,
        phase: randomBetween(0, Math.PI * 2),
        rotation: randomBetween(-2.2, 2.2),
        release: Math.max(0, Math.min(.82, (py / Math.max(1, snapshot.canvas.height)) * .72 + randomBetween(0, .1)))
      });
    }
  }

  return particles;
}

function cascadeGlyph(character, startDelay, duration) {
  return new Promise(resolve => {
    const snapshot = createGlyphSnapshot(character);
    if (!snapshot) { resolve(); return; }

    const { canvas, context } = snapshot;
    let original;
    try {
      original = context.getImageData(0, 0, canvas.width, canvas.height);
    } catch (_) {
      resolve();
      return;
    }

    const particles = buildCascadeParticles(snapshot, original);
    if (!particles.length) { resolve(); return; }

    document.body.appendChild(canvas);
    character.style.opacity = '0';
    context.setTransform(1, 0, 0, 1, 0, 0);
    const begin = performance.now() + startDelay;

    const frame = now => {
      if (now < begin) {
        window.requestAnimationFrame(frame);
        return;
      }

      const progress = Math.min(1, (now - begin) / duration);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(original, 0, 0);

      const eraseFront = Math.min(canvas.height, canvas.height * Math.min(1, progress * 1.18));
      context.clearRect(0, 0, canvas.width, eraseFront);

      particles.forEach(particle => {
        if (progress < particle.release) return;
        const local = Math.min(1, (progress - particle.release) / Math.max(.18, 1 - particle.release));
        const eased = 1 - Math.pow(1 - local, 1.7);
        const horizontal = particle.vx * eased + Math.sin(local * Math.PI * 2 + particle.phase) * particle.sway * eased;
        const vertical = particle.vy * eased + 92 * snapshot.scale * eased * eased;
        const alpha = particle.alpha * Math.max(0, 1 - Math.pow(local, 1.45));

        context.save();
        context.globalAlpha = alpha;
        context.fillStyle = `rgb(${particle.r},${particle.g},${particle.b})`;
        context.translate(particle.x + horizontal, particle.y + vertical);
        context.rotate(particle.rotation * eased);
        context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        context.restore();
      });

      if (progress < 1) {
        window.requestAnimationFrame(frame);
      } else {
        canvas.remove();
        resolve();
      }
    };

    window.requestAnimationFrame(frame);
  });
}

async function runCascadeEffect(characters, totalDuration = 3000) {
  const visibleCharacters = characters.filter(character => character.textContent.trim());
  if (!visibleCharacters.length) return;

  const step = Math.max(18, Math.min(60, totalDuration * .22 / visibleCharacters.length));
  const tasks = visibleCharacters.map((character, index) =>
    cascadeGlyph(character, index * step, Math.max(1700, totalDuration - index * step))
  );

  await Promise.race([
    Promise.all(tasks),
    new Promise(resolve => window.setTimeout(resolve, totalDuration + 800))
  ]);
}

export async function explodeText(elements, effect = DEFAULT_EFFECT, options = {}) {
  const list = (Array.isArray(elements) ? elements : [elements]).filter(Boolean);
  if (!list.length) return;
  const allCharacters = list.flatMap(wrapCharacters);
  const duration = options.duration || 1750;
  const stagger = options.stagger ?? 20;

  try {
    if (effect === 'particel') {
      await runParticelEffect(allCharacters, 3000);
      return;
    }

    if (effect === 'cascade') {
      await runCascadeEffect(allCharacters, 3000);
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
  } catch (error) {
    console.warn('Text effect skipped so the learning flow can continue.', error);
  }
}
