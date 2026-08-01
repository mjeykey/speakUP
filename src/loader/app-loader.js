(() => {
  'use strict';

  window.SpeakUPLoader = window.SpeakUPLoader || {};

  const DEFAULT_APP_URL = 'app.html';
  const HELPER_SCRIPTS = [
    'voice-router.js?v=12',
    'story-bilingual.js?v=5',
    'story-language-quality.js?v=2',
    'story-flow-controller.js?v=9',
    'src/story/story-start-ui.js?v=1'
  ];

  function ensureTranslatorFallback() {
    if (window.Translator) return;

    window.Translator = {
      async availability() {
        return 'available';
      },
      async create() {
        return {
          async translate(text) {
            return String(text ?? '');
          },
          destroy() {}
        };
      }
    };
  }

  function injectHelperScripts(html) {
    const tags = HELPER_SCRIPTS
      .map(src => `<script src="${src}"><\/script>`)
      .join('');

    return html.includes('</body>')
      ? html.replace('</body>', `${tags}</body>`)
      : `${html}${tags}`;
  }

  function renderStartupError(error) {
    const message = String(error?.message || error || 'Unknown startup error');
    document.body.innerHTML = `
      <main style="min-height:100vh;background:#020205;color:white;padding:24px;font-family:Arial,sans-serif">
        <h1 style="font-size:24px;font-weight:400">SpeakUP could not start.</h1>
        <p>${message}</p>
      </main>`;
  }

  window.SpeakUPLoader.start = async function start(options = {}) {
    const appUrl = options.appUrl || DEFAULT_APP_URL;
    const cacheKey = options.cacheKey || 'modular-loader-1';

    try {
      ensureTranslatorFallback();

      const response = await fetch(`${appUrl}?v=${encodeURIComponent(cacheKey)}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Could not load SpeakUP (${response.status})`);
      }

      let html = await response.text();

      if (typeof window.SpeakUPTransforms?.applyAll === 'function') {
        html = window.SpeakUPTransforms.applyAll(html);
      }

      html = injectHelperScripts(html);

      document.open();
      document.write(html);
      document.close();
    } catch (error) {
      renderStartupError(error);
    }
  };
})();