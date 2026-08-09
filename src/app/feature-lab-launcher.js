import { renderWhatsAroundYouTest } from '../modules/whats-around-you-test.js?v=1';
import { renderSirenProjectTest } from '../modules/siren-project-test.js?v=1';

function makeTestStore(close) {
  return {
    getState() { return { screen: 'feature-test' }; },
    setState(next) {
      if (next && next.screen === 'menu') close();
    }
  };
}

function openFeature(renderer) {
  const previous = document.querySelector('[data-feature-lab-overlay]');
  if (previous) previous.remove();

  const overlay = document.createElement('div');
  overlay.dataset.featureLabOverlay = 'true';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '99999';
  overlay.style.background = '#02060b';
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  renderer(overlay, makeTestStore(close));
}

function mountLauncher() {
  if (document.querySelector('[data-feature-lab-launcher]')) return;

  const launcher = document.createElement('div');
  launcher.dataset.featureLabLauncher = 'true';
  launcher.setAttribute('aria-label', 'Temporary feature tests');
  launcher.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:99990;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;max-width:calc(100vw - 28px);font-family:system-ui,sans-serif';
  launcher.innerHTML = `
    <button type="button" data-around-test style="border:1px solid rgba(255,255,255,.18);background:#132336;color:white;padding:10px 13px;border-radius:999px;box-shadow:0 8px 30px rgba(0,0,0,.3);cursor:pointer">🌍 What's Around You · TEST</button>
    <button type="button" data-siren-test style="border:1px solid rgba(255,255,255,.18);background:#071019;color:white;padding:10px 13px;border-radius:999px;box-shadow:0 8px 30px rgba(0,0,0,.3);cursor:pointer">🧜‍♀️ Siren Project · TEST</button>`;

  launcher.querySelector('[data-around-test]').onclick = () => openFeature(renderWhatsAroundYouTest);
  launcher.querySelector('[data-siren-test]').onclick = () => openFeature(renderSirenProjectTest);
  document.body.appendChild(launcher);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountLauncher, { once: true });
} else {
  mountLauncher();
}
