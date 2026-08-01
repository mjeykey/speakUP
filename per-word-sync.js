(() => {
  'use strict';

  const synth = window.speechSynthesis;
  if (!synth || synth.__speakUpPerWordSyncInstalled) return;
  synth.__speakUpPerWordSyncInstalled = true;

  const routedSpeak = synth.speak.bind(synth);
  const clean = value => String(value || '')
    .replace(/[.,!?;:…“”„”()\[\]{}]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  function visibleReview() {
    const review = document.querySelector('.fill-gap-review');
    if (!review || review.offsetParent === null) return null;
    const spans = [...review.querySelectorAll('.fill-gap-review-word')];
    if (!spans.length) return null;
    return { review, spans };
  }

  function setActive(spans, index) {
    spans.forEach((span, i) => span.classList.toggle('active', i === index));
  }

  synth.speak = utterance => {
    const target = visibleReview();
    const spoken = clean(utterance?.text);
    if (!target || !spoken) return routedSpeak(utterance);

    const displayed = clean(target.spans.map(span => span.textContent || '').join(' '));
    if (displayed.toLowerCase() !== spoken.toLowerCase()) return routedSpeak(utterance);

    const words = spoken.split(/\s+/).filter(Boolean);
    if (!words.length) return routedSpeak(utterance);

    const lang = utterance.lang || 'pt-PT';
    const isPortuguese = lang.toLowerCase().startsWith('pt');
    const rate = isPortuguese
      ? Math.min(Number.isFinite(utterance.rate) ? utterance.rate : 0.64, 0.64)
      : 1.0;
    const pitch = Number.isFinite(utterance.pitch) ? utterance.pitch : 1;
    const volume = Number.isFinite(utterance.volume) ? utterance.volume : 1;
    const voice = utterance.voice || null;
    const gap = isPortuguese ? 95 : 20;

    synth.cancel();
    try { utterance.onstart?.({ type: 'start', utterance }); } catch (_) {}

    let index = 0;
    let finished = false;

    const finish = error => {
      if (finished) return;
      finished = true;
      setActive(target.spans, words.length - 1);
      window.setTimeout(() => {
        if (error) {
          try { utterance.onerror?.(error); } catch (_) {}
        } else {
          try { utterance.onend?.({ type: 'end', utterance }); } catch (_) {}
        }
      }, 260);
    };

    const speakNext = () => {
      if (index >= words.length) {
        finish(null);
        return;
      }

      const wordIndex = index;
      const wordUtterance = new SpeechSynthesisUtterance(words[wordIndex]);
      wordUtterance.__speakUpFlowPreview = true;
      wordUtterance.lang = lang;
      wordUtterance.rate = rate;
      wordUtterance.pitch = pitch;
      wordUtterance.volume = volume;
      if (voice) wordUtterance.voice = voice;

      wordUtterance.onstart = () => setActive(target.spans, wordIndex);
      wordUtterance.onend = () => {
        index += 1;
        window.setTimeout(speakNext, gap);
      };
      wordUtterance.onerror = event => finish(event);
      routedSpeak(wordUtterance);
    };

    speakNext();
  };
})();