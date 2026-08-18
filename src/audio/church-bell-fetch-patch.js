(() => {
  const originalFetch = window.fetch.bind(window);
  const oldBellPattern = /raw\.githubusercontent\.com\/mjeykey\/speakUP\/main\/\.bell-upload\/part0([0-3])\.b64$/;
  const verifiedGroups = {
    0: [0, 1, 2, 3, 4],
    1: [5, 6, 7, 8],
    2: [9, 10, 11, 12],
    3: [13, 14, 15, 16]
  };

  const verifiedPartUrl = index =>
    `https://raw.githubusercontent.com/mjeykey/speakUP/main/.bell-tsar/p${String(index).padStart(2, '0')}.b64`;

  window.fetch = async (input, init) => {
    const requestedUrl = typeof input === 'string' ? input : input?.url;
    const match = typeof requestedUrl === 'string' ? requestedUrl.match(oldBellPattern) : null;

    if (!match) return originalFetch(input, init);

    const group = verifiedGroups[Number(match[1])];
    const parts = await Promise.all(group.map(async index => {
      const response = await originalFetch(verifiedPartUrl(index), { cache: 'force-cache' });
      if (!response.ok) throw new Error(`Verified church bell part ${index} HTTP ${response.status}`);
      return (await response.text()).trim();
    }));

    return new Response(parts.join(''), {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  };
})();
