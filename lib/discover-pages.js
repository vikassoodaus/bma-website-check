import { PAGE_WEIGHTS, DEPRIORITIZE_PATTERNS } from '../config/scoring.js';

function normaliseHost(hostname = '') {
  return hostname.toLowerCase().replace(/^www\./, '');
}

function sameSite(a, b) {
  return normaliseHost(a) === normaliseHost(b);
}

function classify(pathAndText = '') {
  const value = pathAndText.toLowerCase();
  if (/contact|contact-us|enquir|quote|book|booking|appointment/.test(value)) return 'contact / booking';
  if (/services?|solutions?|what-we-do|programs?/.test(value)) return 'service / solution';
  if (/about|about-us|our-story|team/.test(value)) return 'about / team';
  if (/collections?|categories?/.test(value)) return 'collection / category';
  if (/products?/.test(value)) return 'product';
  if (/shop|store/.test(value)) return 'shop / store';
  if (/\/pages\//.test(value)) return 'business page';
  return 'internal page';
}

function scoreCandidate(path, text = '', source = 'navigation') {
  const combined = `${path} ${text}`.trim();
  let score = 0;
  for (const item of PAGE_WEIGHTS) {
    if (item.pattern.test(path) || item.pattern.test(text) || item.pattern.test(combined)) {
      score = Math.max(score, item.weight);
    }
  }

  if (DEPRIORITIZE_PATTERNS.some((re) => re.test(path))) score -= 100;
  if (source === 'navigation') score += 8;
  if (source === 'sitemap') score += 2;
  if (/\/(pages\/)?(contact|about|about-us|services?|shop|store)(\/|$)/i.test(path)) score += 4;

  return score;
}

function addCandidate(seen, rawUrl, home, { text = '', source = 'navigation' } = {}) {
  try {
    const url = new URL(rawUrl, home);
    url.hash = '';
    if (!['http:', 'https:'].includes(url.protocol)) return;
    if (!sameSite(url.hostname, home.hostname)) return;

    const path = url.pathname.replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/';
    if (path === '/') return;
    if (/\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|mp4|mp3|xml|json|css|js)$/i.test(path)) return;

    const score = scoreCandidate(path, text, source) - (url.search ? 10 : 0);
    const canonicalHost = normaliseHost(home.hostname);
    const key = `${url.protocol}//${canonicalHost}${path}`;
    const candidate = {
      url: `${url.protocol}//${url.hostname}${path}`,
      score,
      text,
      source,
      reason: classify(`${path} ${text}`),
    };

    const existing = seen.get(key);
    if (!existing || candidate.score > existing.score || (candidate.score === existing.score && source === 'navigation')) {
      seen.set(key, candidate);
    }
  } catch {}
}

export function discoverPages(homeAnalysis, limit = 4, sitemapPageUrls = []) {
  const home = new URL(homeAnalysis.url);
  const seen = new Map();

  for (const link of homeAnalysis.internalLinks) {
    addCandidate(seen, link.absolute, home, { text: link.text, source: 'navigation' });
  }

  for (const url of sitemapPageUrls || []) {
    addCandidate(seen, url, home, { source: 'sitemap' });
  }

  const candidates = [...seen.values()]
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || (a.source === 'navigation' ? -1 : 1) || a.url.length - b.url.length);

  // Prefer a useful mix instead of four near-identical product URLs.
  const selected = [];
  const usedReasons = new Set();
  for (const candidate of candidates) {
    if (selected.length >= limit) break;
    if (!usedReasons.has(candidate.reason) || ['contact / booking', 'service / solution', 'about / team'].includes(candidate.reason)) {
      selected.push(candidate);
      usedReasons.add(candidate.reason);
    }
  }

  if (selected.length < limit) {
    for (const candidate of candidates) {
      if (selected.length >= limit) break;
      if (!selected.some((x) => x.url === candidate.url)) selected.push(candidate);
    }
  }

  return {
    discoveredInternalLinks: homeAnalysis.internalLinks.length,
    sitemapCandidates: (sitemapPageUrls || []).length,
    candidateCount: candidates.length,
    selected,
  };
}
