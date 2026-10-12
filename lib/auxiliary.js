import { safeFetch, safeStatus } from './fetch-site.js';

export async function inspectRobotsAndSitemap(homeUrl) {
  const base = new URL(homeUrl);
  const robotsUrl = new URL('/robots.txt', base);
  let robotsText = '';
  let sitemapUrls = [];
  try {
    const robots = await safeFetch(robotsUrl, { timeoutMs: 5000, maxBytes: 200_000 });
    if (robots.response.ok) {
      robotsText = robots.body;
      sitemapUrls = [...robotsText.matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
    }
  } catch {}

  const candidates = [...sitemapUrls, new URL('/sitemap.xml', base).toString()];
  let sitemapFound = false;
  let sitemapUrl = null;
  for (const candidate of [...new Set(candidates)].slice(0, 3)) {
    try {
      const result = await safeFetch(candidate, { timeoutMs: 5000, maxBytes: 500_000 });
      if (result.response.ok && /<urlset|<sitemapindex|<\?xml/i.test(result.body)) {
        sitemapFound = true;
        sitemapUrl = candidate;
        break;
      }
    } catch {}
  }
  return { robotsText, sitemapFound, sitemapUrl };
}

export async function checkBrokenLinks(homeAnalysis, maxLinks = 30) {
  const unique = [...new Set(homeAnalysis.internalLinks.map((l) => l.absolute))]
    .filter(Boolean)
    .slice(0, maxLinks);
  const results = [];
  const concurrency = 5;
  for (let i = 0; i < unique.length; i += concurrency) {
    const batch = unique.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(async (url) => ({ url, ...(await safeStatus(url)) })));
    results.push(...batchResults);
  }
  const broken = results.filter((r) => r.status === 0 || r.status >= 400);
  return { checked: results.length, broken };
}

export async function checkAlternateHost(homeUrl) {
  try {
    const current = new URL(homeUrl);
    const altHost = current.hostname.startsWith('www.') ? current.hostname.slice(4) : `www.${current.hostname}`;
    const alt = new URL(current);
    alt.hostname = altHost;
    const status = await safeStatus(alt, 5000);
    if (!status.status) return { verified: false };
    const finalHost = new URL(status.finalUrl).hostname.replace(/^www\./, '');
    const currentHost = current.hostname.replace(/^www\./, '');
    return { verified: true, consistent: finalHost === currentHost, status };
  } catch {
    return { verified: false };
  }
}
