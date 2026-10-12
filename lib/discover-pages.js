import { PAGE_WEIGHTS, DEPRIORITIZE_PATTERNS } from '../config/scoring.js';

export function discoverPages(homeAnalysis, limit = 4) {
  const home = new URL(homeAnalysis.url);
  const seen = new Map();

  for (const link of homeAnalysis.internalLinks) {
    try {
      const url = new URL(link.absolute);
      url.hash = '';
      if (url.hostname !== home.hostname) continue;
      if (!['http:', 'https:'].includes(url.protocol)) continue;
      const path = url.pathname.replace(/\/+$/, '') || '/';
      if (path === '/') continue;
      if (/\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|mp4|mp3|xml|json)$/i.test(path)) continue;
      let score = 0;
      for (const item of PAGE_WEIGHTS) if (item.pattern.test(`${path} ${link.text}`)) score = Math.max(score, item.weight);
      if (DEPRIORITIZE_PATTERNS.some((re) => re.test(path))) score -= 100;
      if (url.search) score -= 10;
      const key = `${url.origin}${path}`;
      const existing = seen.get(key);
      if (!existing || score > existing.score) seen.set(key, { url: key, score, text: link.text });
    } catch {}
  }

  return [...seen.values()]
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || a.url.length - b.url.length)
    .slice(0, limit)
    .map((x) => x.url);
}
