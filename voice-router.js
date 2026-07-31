(() => {
  'use strict';

  const synth = window.speechSynthesis;
  if (!synth || synth.__speakUpVoiceRouterInstalled) return;
  synth.__speakUpVoiceRouterInstalled = true;

  const originalSpeak = synth.speak.bind(synth);
  let voices = [];

  const languageCodes = {
    english: 'en-GB', en: 'en-GB', 'en-gb': 'en-GB', 'en-us': 'en-US',
    portuguese: 'pt-PT', português: 'pt-PT', portugues: 'pt-PT', pt: 'pt-PT', 'pt-pt': 'pt-PT', 'pt-br': 'pt-BR',
    german: 'de-DE', deutsch: 'de-DE', de: 'de-DE', 'de-de': 'de-DE',
    spanish: 'es-ES', español: 'es-ES', espanol: 'es-ES', es: 'es-ES', 'es-es': 'es-ES',
    french: 'fr-FR', français: 'fr-FR', francais: 'fr-FR', fr: 'fr-FR', 'fr-fr': 'fr-FR',
    italian: 'it-IT', italiano: 'it-IT', it: 'it-IT', 'it-it': 'it-IT',
    dutch: 'nl-NL', nederlands: 'nl-NL', nl: 'nl-NL',
    polish: 'pl-PL', polski: 'pl-PL', pl: 'pl-PL',
    croatian: 'hr-HR', hrvatski: 'hr-HR', hr: 'hr-HR',
    greek: 'el-GR', ελληνικά: 'el-GR', el: 'el-GR',
    turkish: 'tr-TR', türkçe: 'tr-TR', turkce: 'tr-TR', tr: 'tr-TR',
    russian: 'ru-RU', русский: 'ru-RU', ru: 'ru-RU',
    arabic: 'ar-SA', العربية: 'ar-SA', ar: 'ar-SA',
    japanese: 'ja-JP', 日本語: 'ja-JP', ja: 'ja-JP',
    korean: 'ko-KR', 한국어: 'ko-KR', ko: 'ko-KR',
    chinese: 'zh-CN', 中文: 'zh-CN', mandarin: 'zh-CN', zh: 'zh-CN'
  };

  const preferredNames = ['Google', 'Microsoft', 'Natural', 'Online', 'Premium'];
  const commonEnglishWords = new Set([
    'a','an','and','are','as','at','be','but','by','for','from','he','her','his','i','in','is','it','its','my','not','of','on','or','our','she','so','that','the','their','there','they','this','to','was','we','were','with','you','your'
  ]);

  function refreshVoices() {
    voices = synth.getVoices() || [];
  }

  function normalizeLanguage(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const key = raw.toLowerCase().replace(/_/g, '-');
    if (languageCodes[key]) return languageCodes[key];
    if (/^[a-z]{2,3}(-[a-z]{2})?$/i.test(key)) {
      const parts = key.split('-');
      return parts.length === 1 ? parts[0].toLowerCase() : `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
    }
    return raw;
  }

  function languageMatches(voiceLang, requestedLang) {
    const voice = String(voiceLang || '').toLowerCase();
    const requested = String(requestedLang || '').toLowerCase();
    if (!voice || !requested) return false;
    return voice === requested || voice.split('-')[0] === requested.split('-')[0];
  }

  function looksLikeEnglishStoryText(text) {
    const words = String(text || '').toLowerCase().match(/[a-z']+/g) || [];
    if (words.length < 6) return false;
    const matches = words.filter(word => commonEnglishWords.has(word)).length;
    return matches >= 2 && matches / words.length >= 0.12;
  }

  function bestVoice(lang, currentVoice) {
    refreshVoices();
    if (!voices.length || !lang) return currentVoice || null;
    if (currentVoice && languageMatches(currentVoice.lang, lang)) return currentVoice;

    const normalized = lang.toLowerCase();
    const base = normalized.split('-')[0];
    const exact = voices.filter(voice => String(voice.lang).toLowerCase() === normalized);
    const sameLanguage = voices.filter(voice => String(voice.lang).toLowerCase().split('-')[0] === base);
    const preferred = list => list.find(voice => preferredNames.some(name => voice.name.includes(name)));

    return preferred(exact) || exact[0] || preferred(sameLanguage) || sameLanguage[0] || currentVoice || null;
  }

  function copyCallbacks(source, target) {
    ['onstart', 'onend', 'onerror', 'onpause', 'onresume', 'onmark', 'onboundary'].forEach(name => {
      try { target[name] = source[name]; } catch (_) {}
    });
  }

  synth.addEventListener?.('voiceschanged', refreshVoices);
  const previousVoicesChanged = synth.onvoiceschanged;
  synth.onvoiceschanged = event => {
    refreshVoices();
    if (typeof previousVoicesChanged === 'function') previousVoicesChanged.call(synth, event);
  };
  refreshVoices();

  synth.speak = utterance => {
    try {
      const override = window.__speakUpPortugueseOverride;
      if (utterance && override && !override.consumed && override.expires > Date.now() && override.text) {
        override.consumed = true;
        const replacement = new SpeechSynthesisUtterance(String(override.text));
        replacement.lang = 'pt-PT';
        replacement.rate = Number.isFinite(utterance.rate) ? utterance.rate : 0.9;
        replacement.pitch = Number.isFinite(utterance.pitch) ? utterance.pitch : 1;
        replacement.volume = Number.isFinite(utterance.volume) ? utterance.volume : 1;
        replacement.voice = bestVoice('pt-PT', null);
        copyCallbacks(utterance, replacement);
        return originalSpeak(replacement);
      }

      if (utterance) {
        let normalizedLang = normalizeLanguage(utterance.lang);
        if (normalizedLang.toLowerCase().startsWith('pt') && looksLikeEnglishStoryText(utterance.text)) {
          normalizedLang = 'en-GB';
        }
        if (normalizedLang) {
          utterance.lang = normalizedLang;
          const voice = bestVoice(normalizedLang, utterance.voice);
          if (voice) utterance.voice = voice;
        }
      }
    } catch (error) {
      console.warn('SpeakUP voice routing fallback:', error);
    }
    return originalSpeak(utterance);
  };
})();
