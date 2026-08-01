(() => {
  'use strict';

  const ptPtTerms = new Map([
    ['breakfast', 'pequeno-almoço'],
    ['lunch', 'almoço'],
    ['dinner', 'jantar'],
    ['snack', 'lanche'],
    ['bus', 'autocarro'],
    ['cell phone', 'telemóvel'],
    ['mobile phone', 'telemóvel'],
    ['phone', 'telemóvel'],
    ['train station', 'estação de comboios'],
    ['subway', 'metro'],
    ['sidewalk', 'passeio'],
    ['apartment', 'apartamento'],
    ['vacation', 'férias'],
    ['bathroom', 'casa de banho'],
    ['restroom', 'casa de banho'],
    ['cup', 'chávena'],
    ['ice cream', 'gelado'],
    ['juice', 'sumo'],
    ['store', 'loja'],
    ['grocery store', 'mercearia'],
    ['bakery', 'padaria'],
    ['neighborhood', 'bairro'],
    ['downtown', 'centro da cidade'],
    ['line', 'fila'],
    ['crosswalk', 'passadeira'],
    ['sweater', 'camisola'],
    ['sneakers', 'ténis'],
    ['trash', 'lixo'],
    ['garbage', 'lixo'],
    ['movie', 'filme'],
    ['movie theater', 'cinema'],
    ['soccer', 'futebol'],
    ['takeout', 'comida para levar'],
    ['cookie', 'bolacha'],
    ['cookies', 'bolachas'],
    ['refrigerator', 'frigorífico'],
    ['fridge', 'frigorífico'],
    ['yard', 'quintal'],
    ['mailbox', 'caixa do correio']
  ]);

  const ptBrToPtPt = new Map([
    ['café da manhã', 'pequeno-almoço'],
    ['ônibus', 'autocarro'],
    ['celular', 'telemóvel'],
    ['trem', 'comboio'],
    ['metrô', 'metro'],
    ['banheiro', 'casa de banho'],
    ['suco', 'sumo'],
    ['sorvete', 'gelado'],
    ['xícara', 'chávena'],
    ['fila de espera', 'fila'],
    ['calçada', 'passeio'],
    ['geladeira', 'frigorífico'],
    ['gramado', 'relvado'],
    ['time', 'equipa']
  ]);

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function followingText(element) {
    let node = element.nextSibling;
    let text = '';
    while (node && text.length < 80) {
      text += node.textContent || '';
      node = node.nextSibling;
    }
    return normalize(text);
  }

  function precedingText(element) {
    let node = element.previousSibling;
    let text = '';
    while (node && text.length < 80) {
      text = `${node.textContent || ''}${text}`;
      node = node.previousSibling;
    }
    return normalize(text);
  }

  function polishPortuguese(value) {
    let result = String(value || '').trim();
    for (const [brazilian, european] of ptBrToPtPt) {
      if (normalize(result) === brazilian) return european;
    }
    return result;
  }

  function contextualPortuguese(element) {
    const english = normalize(element.dataset.speakupEnglish);
    const current = polishPortuguese(element.dataset.speakupPortuguese || element.textContent || '');
    const after = followingText(element);
    const before = precedingText(element);

    if (english === 'with') {
      if (/^\s*her\b/.test(after)) return 'com ela';
      if (/^\s*him\b/.test(after)) return 'com ele';
      if (/^\s*them\b/.test(after)) return 'com eles';
      if (/^\s*us\b/.test(after)) return 'connosco';
      if (/^\s*you\b/.test(after)) return 'contigo';
    }

    if (english === 'for') {
      if (/^\s*lunch\b/.test(after)) return 'para o almoço';
      if (/^\s*dinner\b/.test(after)) return 'para o jantar';
      if (/^\s*breakfast\b/.test(after)) return 'para o pequeno-almoço';
    }

    if (english === 'at') {
      if (/^\s*home\b/.test(after)) return 'em casa';
      if (/^\s*work\b/.test(after)) return 'no trabalho';
      if (/^\s*school\b/.test(after)) return 'na escola';
    }

    if (english === 'go') {
      if (/\bto the market\b/.test(after)) return 'ir ao mercado';
      if (/\bhome\b/.test(after)) return 'ir para casa';
    }

    if (english === 'have') {
      if (/\bbreakfast\b/.test(after)) return 'tomar o pequeno-almoço';
      if (/\blunch\b/.test(after)) return 'almoçar';
      if (/\bdinner\b/.test(after)) return 'jantar';
    }

    if (english === 'make') {
      if (/\bsoup\b/.test(after)) return 'fazer sopa';
      if (/\bcoffee\b/.test(after)) return 'fazer café';
    }

    if (english === 'take' && /\bthe bus\b/.test(after)) return 'apanhar o autocarro';
    if (english === 'get' && /\bhome\b/.test(after)) return 'chegar a casa';
    if (english === 'wait' && /\bfor\b/.test(after)) return 'esperar por';
    if (english === 'meet' && /\bfriend\b/.test(after)) return 'encontrar-se com';
    if (english === 'invite' && /\bto eat\b/.test(after)) return 'convidar para comer';

    if (english === 'home' && /\bgo|walk|return|arrive|get\b/.test(before)) return 'casa';

    return ptPtTerms.get(english) || current;
  }

  function improve(element) {
    if (!(element instanceof HTMLElement)) return;
    if (!element.matches('.story-choice, .story-correct, .story-gap:not(:empty)')) return;
    if (!element.dataset.speakupEnglish) return;

    const improved = contextualPortuguese(element);
    if (!improved || improved === element.textContent?.trim()) return;

    element.textContent = improved;
    element.dataset.speakupPortuguese = improved;
    element.dataset.speakupLanguage = 'pt-PT';
    element.setAttribute('lang', 'pt-PT');
    element.setAttribute('aria-label', `${improved}, português europeu`);
  }

  function scan(root = document) {
    if (root instanceof HTMLElement) improve(root);
    root.querySelectorAll?.('.story-choice, .story-correct, .story-gap:not(:empty)').forEach(improve);
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      });
      if (record.type === 'characterData' && record.target.parentElement) {
        improve(record.target.parentElement);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.setInterval(() => scan(), 700);
  scan();
})();
