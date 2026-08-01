(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveWordsMode = function improveWordsMode(source) {
    let html = String(source || '');

    const oldSequence = `                    const audioItems = [];
                    if (settings.translationAudioOn)
                        audioItems.push({ text: translation, language: settings.nativeLanguage, afterPause: 260 });
                    if (settings.sentenceAudioOn)
                        audioItems.push({ text: item.word, language: settings.language, afterPause: 260 });
                    if (settings.translationAudioOn)
                        audioItems.push({ text: translation, language: settings.nativeLanguage });
                    await speakSequence(audioItems);`;

    const newSequence = `                    const audioItems = settings.audioOn ? [
                        { text: item.word, language: 'pt-PT', afterPause: 320 },
                        { text: translation, language: 'en-GB' }
                    ] : [];
                    await speakSequence(audioItems);`;

    return html.replace(oldSequence, newSequence);
  };
})();
