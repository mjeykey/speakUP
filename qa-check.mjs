import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { LANGUAGE_OPTIONS, getWords, getSentenceLevels, getSpeechLanguage } from './src/data/language-content-matrix.js';
import { ANXIETY_WORLD_PAGES, ANXIETY_WORLD_PAGE_COUNT } from './src/data/anxiety-world.js';
import { getCommunicationStrengthMatrix } from './src/data/communication-strength/matrix.js';
import { UI_COPY, getLanguageOptionLabel, getMenuCopy, getStoryUiCopy, getWelcomeCopy } from './src/app/ui-language.js';
import { NAVIGATION_COPY } from './src/app/navigation-language.js';
import { normalizeLanguagePair } from './src/app/state.js';
import { STORIES } from './src/data/content.js';
import { L2_TOPICS } from './src/data/l2/index.js';
import { L3_TOPIC_GROUPS } from './src/data/l3/index.js';
import { fantasyStory } from './src/data/stories/fantasy.js';
import { FANTASY_TRANSLATIONS, getFantasyTranslation } from './src/data/stories/fantasy-translations.js';

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
check('all selectable languages have localized option labels', () => {
  for (const nativeLanguage of codes) {
    for (const language of LANGUAGE_OPTIONS) {
      assert.ok(nonEmptyText(getLanguageOptionLabel(language,nativeLanguage)), `${nativeLanguage}: ${language.code}`);
    }
  }
});
check('every UI dictionary has matching locale and key coverage', () => {
  const families = ['en','de','pt','es','hr','fr'];
  for (const dictionary of Object.values(UI_COPY)) {
    assert.deepEqual(Object.keys(dictionary).sort(), families.slice().sort());
    const expected = Object.keys(dictionary.en).sort();
    for (const family of families) assert.deepEqual(Object.keys(dictionary[family]).sort(), expected, family);
  }
});
check('menu, welcome and story UI follow the native language', () => {
  assert.equal(getMenuCopy('de-DE').nativeLanguage, 'Muttersprache / Übersetzung');
  assert.equal(getMenuCopy('fr-FR').settingsHeading, 'Paramètres');
  assert.equal(getWelcomeCopy('pt-PT').tagline, 'Aprende com calma. Fala com coragem.');
  assert.equal(getStoryUiCopy('hr-DAL').beginning, 'Početak');
});
check('every selectable topic and story has complete navigation copy', () => {
  const topicIds = [...L2_TOPICS,...L3_TOPIC_GROUPS.flatMap(group=>group.topics)].map(topic=>topic.id).sort();
  assert.deepEqual(Object.keys(NAVIGATION_COPY.TOPICS).sort(), topicIds);
  assert.deepEqual(Object.keys(NAVIGATION_COPY.STORIES).sort(), STORIES.map(story=>story.id).sort());
  for (const collection of Object.values(NAVIGATION_COPY)) {
    for (const entry of Object.values(collection)) {
      for (const family of ['en','de','pt','es','hr','fr']) {
        assert.ok(Array.isArray(entry[family]) && entry[family].every(nonEmptyText), `${family} navigation copy`);
      }
    }
  }
});
check('invalid or identical stored language pairs are repaired', () => {
  assert.deepEqual(normalizeLanguagePair({learningLanguage:'it-IT',nativeLanguage:'it-IT'}), {learningLanguage:'pt-PT',nativeLanguage:'en-GB'});
  assert.deepEqual(normalizeLanguagePair({learningLanguage:'fr-FR',nativeLanguage:'fr-FR'}), {learningLanguage:'fr-FR',nativeLanguage:'en-GB'});
});
check('fantasy has a real translation for all 72 source pages', () => {
  assert.equal(fantasyStory.pages.length,72);
  for (const [code,translations] of Object.entries(FANTASY_TRANSLATIONS)) {
    assert.equal(translations.length,72,code);
    translations.forEach((translation,index)=>{
      assert.ok(nonEmptyText(translation), `${code} page ${index+1}`);
      assert.notEqual(translation,fantasyStory.pages[index].english, `${code} page ${index+1}`);
      assert.equal(getFantasyTranslation(fantasyStory.pages[index],index,code),translation);
    });
  }
});
check('fantasy dialect aliases use their complete base translations', () => {
  fantasyStory.pages.forEach((page,index)=>{
    assert.equal(getFantasyTranslation(page,index,'es-AN'),FANTASY_TRANSLATIONS['es-ES'][index]);
    assert.equal(getFantasyTranslation(page,index,'hr-DAL'),FANTASY_TRANSLATIONS['hr-HR'][index]);
  });
});
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
  const effects = readFileSync('./src/audio/story-effects.js', 'utf8');
  const sfx = readFileSync('./src/audio/story-sfx.js', 'utf8');
  assert.match(effects, /\.\/story-sfx\.js/);
  assert.doesNotMatch(`${effects}\n${sfx}`, /story-sfx-(?:simple|clean|smooth|web)/);
});
check('every live screen uses the shared UI language layer', () => {
  const modules = ['welcome','menu','words-matrix','memory-matrix','fill-gap-matrix','speak-practice-matrix','communication-strength-matrix','emotions-expanded','anxiety-language','sentence-level-select','effects-settings','future','l2-learning','l3-learning','story-live'];
  modules.forEach(name=>assert.match(readFileSync(`./src/modules/${name}.js`,'utf8'), /ui-language\.js\?v=\d+/, name));
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
check('Story audio import chain is cache-versioned', () => {
  assert.match(readFileSync('./src/app/main.js', 'utf8'), /story-loader\.js\?v=\d+/);
  assert.match(readFileSync('./src/modules/story-loader.js', 'utf8'), /story-live(?:-crowdless)?\.js\?v=\d+/);
});

console.log(`\n${checks - failures.length}/${checks} QA checks passed.`);
if (failures.length) process.exitCode = 1;
