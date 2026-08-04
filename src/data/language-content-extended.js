import {
  LANGUAGE_OPTIONS as BASE_LANGUAGE_OPTIONS,
  languageName as baseLanguageName,
  getSpeechLanguage as baseGetSpeechLanguage,
  getWords as baseGetWords,
  getSentenceLevels as baseGetSentenceLevels
} from './language-registry.js?v=2';
import { getEveryday50Level } from './sentence-pack-everyday-50.js?v=1';
import { fixDalmatianSentence } from './dalmatian-sentence-fix.js?v=2';

export const LANGUAGE_OPTIONS = [
  ...BASE_LANGUAGE_OPTIONS,
  { code: 'es-AN', label: '☀️ Español (Andalucía) — coloquial', short: 'Andalucía' }
];

const ANDALUSIAN_WORDS = [
  'casa','calle','amiga','amigo','café','agua','mañana','noche','curro','cole',
  'libro','mesa','silla','puerta','ventana','pan','manzana','verduras','tren','bus',
  'móvil','cariño','esperanza','calma','valor','aprender','hablar','ir','venir','ver',
  'escuchar','comer','beber','dormir','currar','contento','cansado','apañado','rápido','despacito'
];

const ANDALUSIAN_COMPLETE = [
  'Me tomo un café todas las mañanas.','Hoy vamos en bus.','Está leyendo un libro nuevo.','Vive en Sevilla.','Estoy aprendiendo a hablar como se habla por aquí.',
  'Por la mañana me tomo un café y leo las noticias.','Vamos a la estación y pillamos el tren.','Abre la ventana y disfruta del aire fresquito.','Se queda en casa y curra con el ordenador.','Preparo la cena y luego dejo la cocina recogida.',
  'Antes de irme a currar, me tomo un café y abro la ventana.','Cuando llegamos a la estación, miramos el panel y buscamos el andén.','Aunque está cansada, tira para adelante y mantiene la calma.','Después de preparar la cena, pone la mesa y escucha música.','Me imagino mi objetivo, doy un pasito y tengo paciencia.'
];

const ANDALUSIAN_EXERCISES = [
  ['Me _____ un café todas las mañanas.',['tomo'],['tomo','veo','duermo','vengo']],
  ['Hoy _____ en bus.',['vamos'],['vamos','comemos','aprendemos','oímos']],
  ['Está _____ un libro nuevo.',['leyendo'],['leyendo','bebiendo','yendo','currando']],
  ['_____ en Sevilla.',['Vive'],['Vive','Habla','Compra','Abre']],
  ['Estoy _____ a hablar como se habla por aquí.',['aprendiendo'],['aprendiendo','esperando','cocinando','buscando']],
  ['Por la mañana me _____ un café y _____ las noticias.',['tomo','leo'],['tomo','leo','duermo','compro','escucho']],
  ['Vamos a la estación y _____ el tren.',['pillamos'],['pillamos','comemos','vemos','abrimos','pagamos']],
  ['_____ la ventana y _____ del aire fresquito.',['Abre','disfruta'],['Abre','disfruta','escribe','paga','espera']],
  ['Se _____ en casa y _____ con el ordenador.',['queda','curra'],['queda','curra','conduce','baila','compra']],
  ['_____ la cena y luego _____ la cocina recogida.',['Preparo','dejo'],['Preparo','dejo','leo','duermo','conduzco']],
  ['Antes de _____ a currar, me _____ un café y _____ la ventana.',['irme','tomo','abro'],['irme','tomo','abro','duermo','compro','escucho']],
  ['Cuando _____ a la estación, _____ el panel y _____ el andén.',['llegamos','miramos','buscamos'],['llegamos','miramos','buscamos','comemos','dormimos','pagamos']],
  ['Aunque _____ cansada, _____ para adelante y _____ la calma.',['está','tira','mantiene'],['está','tira','mantiene','conduce','compra','abre']],
  ['Después de _____ la cena, _____ la mesa y _____ música.',['preparar','pone','escucha'],['preparar','pone','escucha','duerme','coge','lee']],
  ['Me _____ mi objetivo, _____ un pasito y _____ paciencia.',['imagino','doy','tengo'],['imagino','doy','tengo','bebo','abro','conduzco']]
];

const CITY_BY_LEARNING = {
  'pt-PT':'Lisboa','de-DE':'Berlin','en-GB':'London','es-ES':'Madrid',
  'es-AN':'Sevilla','fr-FR':'Paris','hr-HR':'Zagreb','hr-DAL':'Split'
};

const LANGUAGE_BY_LEARNING = {
  'pt-PT':{de:'Portugiesisch',en:'Portuguese',es:'portugués',fr:'le portugais',hr:'portugalski',dal:'portugalski'},
  'de-DE':{de:'Deutsch',en:'German',es:'alemán',fr:'l’allemand',hr:'njemački',dal:'njemački'},
  'en-GB':{de:'Englisch',en:'English',es:'inglés',fr:'l’anglais',hr:'engleski',dal:'engleski'},
  'es-ES':{de:'Spanisch',en:'Spanish',es:'español',fr:'l’espagnol',hr:'španjolski',dal:'španjolski'},
  'es-AN':{de:'Andalusisches Spanisch',en:'Andalusian Spanish',es:'andaluz',fr:'l’espagnol andalou',hr:'andaluzijski španjolski',dal:'andaluzijski španjolski'},
  'fr-FR':{de:'Französisch',en:'French',es:'francés',fr:'le français',hr:'francuski',dal:'francuski'},
  'hr-HR':{de:'Kroatisch',en:'Croatian',es:'croata',fr:'le croate',hr:'hrvatski',dal:'hrvatski'},
  'hr-DAL':{de:'Dalmatinisch',en:'Dalmatian',es:'dálmata',fr:'le dalmate',hr:'dalmatinski',dal:'dalmatinski'}
};

function nativeKey(code) {
  if (code === 'de-DE') return 'de';
  if (code === 'en-GB') return 'en';
  if (code === 'fr-FR') return 'fr';
  if (code === 'hr-DAL') return 'dal';
  if (code === 'hr-HR') return 'hr';
  return 'es';
}

function cityTranslation(nativeLanguage, city) {
  if (nativeLanguage === 'de-DE') return `Er wohnt in ${city}.`;
  if (nativeLanguage === 'en-GB') return `He lives in ${city}.`;
  if (nativeLanguage === 'fr-FR') return `Il habite à ${city}.`;
  if (nativeLanguage === 'pt-PT') return `Ele mora em ${city}.`;
  if (nativeLanguage === 'hr-HR') return `On živi u ${city}.`;
  if (nativeLanguage === 'hr-DAL') return `On živi u ${city}.`;
  return `Vive en ${city}.`;
}

function learningTranslation(nativeLanguage, learningLanguage) {
  const name = LANGUAGE_BY_LEARNING[learningLanguage]?.[nativeKey(nativeLanguage)];
  if (!name) return null;
  if (nativeLanguage === 'de-DE') return `Ich lerne ${name}.`;
  if (nativeLanguage === 'en-GB') return `I am learning ${name}.`;
  if (nativeLanguage === 'fr-FR') return `J’apprends ${name}.`;
  if (nativeLanguage === 'pt-PT') return `Estou a aprender ${name}.`;
  if (nativeLanguage === 'hr-HR') return `Učim ${name}.`;
  if (nativeLanguage === 'hr-DAL') return `Učin ${name}.`;
  if (learningLanguage === 'es-AN') return 'Estoy aprendiendo a hablar andaluz.';
  return `Estoy aprendiendo ${name}.`;
}

function normalizeCoreTranslations(levels, learningLanguage, nativeLanguage) {
  const city = CITY_BY_LEARNING[learningLanguage];
  const learningLine = learningTranslation(nativeLanguage, learningLanguage);
  let absoluteIndex = 0;
  return levels.map(level => ({
    ...level,
    items: level.items.map(item => {
      let translation = item.translation;
      if (absoluteIndex === 3 && city) translation = cityTranslation(nativeLanguage, city);
      if (absoluteIndex === 4 && learningLine) translation = learningLine;
      absoluteIndex += 1;
      return { ...item, translation };
    })
  }));
}

function replaceWordSide(items, side) {
  return items.map((item, index) => ({ ...item, [side]: ANDALUSIAN_WORDS[index] || item[side] }));
}

function appendEveryday(levels, learningLanguage, nativeLanguage) {
  const extra = getEveryday50Level(learningLanguage, nativeLanguage);
  return extra ? [...levels, extra] : levels;
}

export function languageName(code) {
  return code === 'es-AN' ? 'Andalucía' : baseLanguageName(code);
}

export function getSpeechLanguage(code) {
  return code === 'es-AN' ? 'es-ES' : baseGetSpeechLanguage(code);
}

export function getWords(learningLanguage, nativeLanguage) {
  if (learningLanguage === 'es-AN') {
    return replaceWordSide(baseGetWords('es-ES', nativeLanguage === 'es-AN' ? 'es-ES' : nativeLanguage), 'target');
  }
  if (nativeLanguage === 'es-AN') {
    return replaceWordSide(baseGetWords(learningLanguage, 'es-ES'), 'translation');
  }
  return baseGetWords(learningLanguage, nativeLanguage);
}

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  if (learningLanguage === 'es-AN') {
    const supportLanguage = nativeLanguage === 'es-AN' ? 'es-ES' : nativeLanguage;
    const baseLevels = baseGetSentenceLevels('es-ES', supportLanguage);
    let levels = baseLevels.map((level, levelIndex) => ({
      ...level,
      items: level.items.map((item, itemIndex) => {
        const exercise = ANDALUSIAN_EXERCISES[levelIndex * 5 + itemIndex];
        return { ...item, sentence: exercise[0], answers: exercise[1], options: exercise[2] };
      })
    }));
    levels = normalizeCoreTranslations(levels, learningLanguage, nativeLanguage);
    return appendEveryday(levels, learningLanguage, nativeLanguage);
  }

  if (nativeLanguage === 'es-AN') {
    const baseLevels = baseGetSentenceLevels(learningLanguage, 'es-ES');
    let levels = baseLevels.map((level, levelIndex) => ({
      ...level,
      items: level.items.map((item, itemIndex) => ({ ...item, translation: ANDALUSIAN_COMPLETE[levelIndex * 5 + itemIndex] }))
    }));
    if (learningLanguage === 'hr-DAL') levels = fixDalmatianSentence(levels);
    levels = normalizeCoreTranslations(levels, learningLanguage, nativeLanguage);
    return appendEveryday(levels, learningLanguage, nativeLanguage);
  }

  let levels = baseGetSentenceLevels(learningLanguage, nativeLanguage);
  if (learningLanguage === 'hr-DAL') levels = fixDalmatianSentence(levels);
  levels = normalizeCoreTranslations(levels, learningLanguage, nativeLanguage);
  return appendEveryday(levels, learningLanguage, nativeLanguage);
}
