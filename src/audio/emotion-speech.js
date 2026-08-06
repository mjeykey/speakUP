import { speak } from './speech.js?v=58';

export function cleanEmotionSpeech(value) {
  return String(value || '')
    .replace(/_+/g, ' ')
    .replace(/[.,;:!?¿¡“”„"'’‘()[\]{}<>/\\|@#$%^&*+=~`…—–-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function speakEmotion(text, language, options = {}) {
  return speak(cleanEmotionSpeech(text), language, options);
}
