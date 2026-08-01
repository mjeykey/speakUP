(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveMemoryMode = function improveMemoryMode(source) {
    let html = String(source || '');

    html = html.replace(
      "{ id: 'friend_f', en: 'friend', de: 'Freundin', pt: 'amiga'",
      "{ id: 'friend_f', en: 'friend female', de: 'Freundin', pt: 'amiga'"
    );

    html = html.replace(
      "{ id: 'friend_m', en: 'friend', de: 'Freund', pt: 'amigo'",
      "{ id: 'friend_m', en: 'friend male', de: 'Freund', pt: 'amigo'"
    );

    html = html.replace(
      /(\/\/ Chrome and some Android browsers need a short beat after cancel\(\)\.[\s\S]*?startTimer\s*=\s*window\.setTimeout\(\(\)\s*=>\s*\{[\s\S]*?speakQueueItem\(queue,\s*0,\s*lang,\s*language,\s*token,\s*options\);\s*\},\s*)\d+(\s*\);)/,
      '$120$2'
    );

    return html;
  };
})();
