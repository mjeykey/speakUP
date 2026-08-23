import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { LANGUAGE_OPTIONS, getWords, getSentenceLevels, getSpeechLanguage } from './src/data/language-content-matrix.js';
import { ANXIETY_WORLD_PAGES, ANXIETY_WORLD_PAGE_COUNT } from './src/data/anxiety-world.js';
import { getCommunicationStrengthMatrix } from './src/data/communication-strength/matrix.js';

const codes = LANGUAGE_OPTIONS.map(language => language.code);
const failures = [];
let checks = 0;

function check(name, fn) {
  checks += 1;
  try { fn(); console.log(`✓ ${name}`); }
  catch (error) { failures.push({ name, error }); console.error(`✗ ${name}: ${error.message}`); }
}

const nonEmptyText = value => typeof value === 'string' && value.trim().length > 0;

check('language codes are unique', () => assert.equal(new Set(codes).size, codes.length));
for (const code of codes) check(`speech language ${code}`, () => assert.ok(nonEmptyText(getSpeechLanguage(code))));
for (const learningLanguage of codes) {
  for (const nativeLanguage of codes) {
    if (learningLanguage === nativeLanguage) continue;
    check(`words ${learningLanguage} -> ${nativeLanguage}`, () => {
      const words = getWords(learningLanguage, nativeLanguage);
      assert.ok(Array.isArray(words) && words.length > 0);
      words.forEach(item => { assert.ok(nonEmptyText(item.target)); assert.ok(nonEmptyText(item.translation)); });
    });
    check(`sentences ${learningLanguage} -> ${nativeLanguage}`, () => {
      const levels = getSentenceLevels(learningLanguage, nativeLanguage);
      const items = levels.flatMap(level => level.items || []);
      assert.ok(items.length > 0);
      items.forEach(item => {
        assert.ok(nonEmptyText(item.sentence));
        assert.ok(nonEmptyText(item.translation));
        assert.ok(Array.isArray(item.answers) && item.answers.length > 0);
        assert.ok(Array.isArray(item.options) && item.options.length > 0);
      });
    });
  }
}
check('Anxiety page count', () => { assert.equal(ANXIETY_WORLD_PAGE_COUNT, 300); assert.equal(ANXIETY_WORLD_PAGES.length, 300); });
check('Anxiety ids and text', () => ANXIETY_WORLD_PAGES.forEach((page, index) => { assert.equal(page.id, index + 1); assert.ok(nonEmptyText(page.text)); }));
check('Andalusian communication alias', () => assert.deepEqual(getCommunicationStrengthMatrix('es-AN','de-DE'), getCommunicationStrengthMatrix('es-ES','de-DE')));
check('Dalmatian communication alias', () => assert.deepEqual(getCommunicationStrengthMatrix('hr-DAL','de-DE'), getCommunicationStrengthMatrix('hr-HR','de-DE')));
check('Story audio uses one local engine', () => {
  const menu = readFileSync('./src/modules/menu.js', 'utf8');
  const effects = readFileSync('./src/audio/story-effects.js', 'utf8');
  assert.match(menu, /audio\/story-sfx\.js/);
  assert.match(effects, /\.\/story-sfx\.js/);
  assert.doesNotMatch(`${menu}\n${effects}`, /story-sfx-(?:simple|clean|web)/);
});
check('Story rain is a natural local MP3', () => {
  const audio = readFileSync('./src/audio/story-sfx.js', 'utf8');
  assert.match(audio, /assets\/audio\/rain-natural-mobile\.mp3/);
  assert.doesNotMatch(audio, /rain-natural-20s\.ogg|rain-mobile-loop\.mp3|raw\.githubusercontent\.com/);
  assert.ok(statSync('./assets/audio/rain-natural-mobile.mp3').size > 300_000);
});

check('Story door uses the verified uploaded MP3', () => {
  const audio = readFileSync('./src/audio/story-sfx.js', 'utf8');
  const story = readFileSync('./src/modules/story-live.js', 'utf8');
  assert.match(audio, /assets\/audio\/freesound_community-heavy-metal-door-74594\.mp3/);
  assert.match(story, /assets\/audio\/freesound_community-heavy-metal-door-74594\.mp3/);
  assert.doesNotMatch(audio, /DOOR_MP3_URL|data:audio\/mpeg;base64/);
  assert.ok(statSync('./assets/audio/freesound_community-heavy-metal-door-74594.mp3').size > 400_000);
});
check('Broken glass uses the uploaded local MP3', () => {
  const audio = readFileSync('./src/audio/story-sfx.js', 'utf8');
  assert.match(audio, /assets\/audio\/universfield-broken-glass-impact-454859\.mp3/);
  assert.ok(statSync('./assets/audio/universfield-broken-glass-impact-454859.mp3').size > 80_000);
});
check('Engine start uses the uploaded local MP3', () => {
  const audio = readFileSync('./src/audio/story-sfx.js', 'utf8');
  assert.match(audio, /assets\/audio\/freesound_community-electric-motor-engine-start-stop-98304\.mp3/);
  assert.ok(statSync('./assets/audio/freesound_community-electric-motor-engine-start-stop-98304.mp3').size > 120_000);
});
check('Story audio import chain uses build 208', () => {
  assert.match(readFileSync('./src/app/main.js', 'utf8'), /story-loader\.js\?v=208/);
  assert.match(readFileSync('./src/modules/story-loader.js', 'utf8'), /story-live\.js\?v=208/);
});

console.log(`\n${checks - failures.length}/${checks} QA checks passed.`);
if (failures.length) process.exitCode = 1;
