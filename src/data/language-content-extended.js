import {
  LANGUAGE_OPTIONS as BASE_LANGUAGE_OPTIONS,
  languageName as baseLanguageName,
  getSpeechLanguage as baseGetSpeechLanguage,
  getWords as baseGetWords,
  getSentenceLevels as baseGetSentenceLevels
} from './language-content.js?v=4';

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
  'Me tomo un café todas las mañanas.',
  'Hoy vamos en bus.',
  'Está leyendo un libro nuevo.',
  'Vive en Sevilla.',
  'Estoy aprendiendo a hablar como se habla por aquí.',
  'Por la mañana me tomo un café y leo las noticias.',
  'Vamos a la estación y pillamos el tren.',
  'Abre la ventana y disfruta del aire fresquito.',
  'Se queda en casa y curra con el ordenador.',
  'Preparo la cena y luego dejo la cocina recogida.',
  'Antes de irme a currar, me tomo un café y abro la ventana.',
  'Cuando llegamos a la estación, miramos el panel y buscamos el andén.',
  'Aunque está cansada, tira para adelante y mantiene la calma.',
  'Después de preparar la cena, pone la mesa y escucha música.',
  'Me imagino mi objetivo, doy un pasito y tengo paciencia.'
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

function replaceWordSide(items, side) {
  return items.map((item, index) => ({
    ...item,
    [side]: ANDALUSIAN_WORDS[index] || item[side]
  }));
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
    return baseLevels.map((level, levelIndex) => ({
      ...level,
      items: level.items.map((item, itemIndex) => {
        const absolute = levelIndex * 5 + itemIndex;
        const exercise = ANDALUSIAN_EXERCISES[absolute];
        return {
          ...item,
          sentence: exercise[0],
          answers: exercise[1],
          options: exercise[2]
        };
      })
    }));
  }

  if (nativeLanguage === 'es-AN') {
    const baseLevels = baseGetSentenceLevels(learningLanguage, 'es-ES');
    return baseLevels.map((level, levelIndex) => ({
      ...level,
      items: level.items.map((item, itemIndex) => ({
        ...item,
        translation: ANDALUSIAN_COMPLETE[levelIndex * 5 + itemIndex]
      }))
    }));
  }

  return baseGetSentenceLevels(learningLanguage, nativeLanguage);
}
