(() => {
  'use strict';

  const synth = window.speechSynthesis;
  if (!synth || synth.__speakUpWordsStableInstalled) return;
  synth.__speakUpWordsStableInstalled = true;

  const rawSpeak = synth.speak.bind(synth);
  const clean = value => String(value || '')
    .replace(/[.,!?;:…“”„”()\[\]{}]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let activeKey = '';
  let running = false;
  let completedKey = '';

  function currentPair() {
    const pair = document.querySelector('.word-pair');
    if (!pair || pair.offsetParent === null) return null;
    const portuguese = clean(pair.querySelector('.single-word')?.textContent || '');
    const english = clean(pair.querySelector('.word-translation')?.textContent || '');
    if (!portuguese || !english) return null;
    return { portuguese, english, key: `${portuguese}\u0000${english}` };
  }

  function voiceFor(lang) {
    const wanted = lang.toLowerCase();
    const prefix = wanted.split('-')[0];
    const voices = synth.getVoices();
    return voices.find(v => String(v.lang || '').toLowerCase() === wanted)
      || voices.find(v => String(v.lang || '').toLowerCase().startsWith(prefix))
      || null;
  }

  function speakOne(text, lang, rate) {
    return new Promise(resolve => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      const voice = voiceFor(lang);
      if (voice) utterance.voice = voice;

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        window.clearTimeout(watchdog);
        resolve();
      };

      utterance.onend = finish;
      utterance.onerror = finish;
      const watchdog = window.setTimeout(finish, Math.max(1600, text.length * 190));
      rawSpeak(utterance);
    });
  }

  function completeOriginal(utterance) {
    window.setTimeout(() => {
      try { utterance?.onstart?.({ type: 'start', utterance }); } catch (_) {}
      try { utterance?.onend?.({ type: 'end', utterance }); } catch (_) {}
    }, 20);
  }

  synth.speak = utterance => {
    const pair = currentPair();
    if (!pair) return rawSpeak(utterance);

    if (completedKey === pair.key) {
      completeOriginal(utterance);
      return;
    }

    if (running && activeKey === pair.key) {
      completeOriginal(utterance);
      return;
    }

    running = true;
    activeKey = pair.key;
    completedKey = '';
    synth.cancel();

    try { utterance?.onstart?.({ type: 'start', utterance }); } catch (_) {}

    (async () => {
      await speakOne(pair.portuguese, 'pt-PT', 0.84);
      await new Promise(resolve => window.setTimeout(resolve, 340));
      await speakOne(pair.english, 'en-GB', 1.0);
      await new Promise(resolve => window.setTimeout(resolve, 280));

      completedKey = pair.key;
      running = false;
      try { utterance?.onend?.({ type: 'end', utterance }); } catch (_) {}

      window.setTimeout(() => {
        if (completedKey === pair.key) completedKey = '';
        if (activeKey === pair.key) activeKey = '';
      }, 2600);
    })();
  };
})();
