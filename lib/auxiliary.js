import { safeFetch, safeStatus } from './fetch-site.js';

function isBlockedStatus(status) {
  return [401, 403, 429].includes(status);
}

function decodeXml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();
}

function extractLocs(xml = '') {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((m) => decodeXml(m[1]))
    .filter(Boolean);
}

function sitemapChildScore(url = '') {
  const value = url.toLowerCase();
  if (/pages?|page-sitemap/.test(value)) return 100;
  if (/collections?|categories?/.test(value)) return 90;
  if (/products?|product-sitemap/.test(value)) return 80;
  if (/services?|service-sitemap/.test(value)) return 75;
  if (/post|blog|article|news/.test(value)) return 10;
  return 50;
}

async function readSitemapPageUrls(body, finalUrl) {
  const urls = [];
  const rootLocs = extractLocs(body);

  if (/<urlset\b/i.test(body || '')) {
    return rootLocs.slice(0, 100);
  }

  if (!/<sitemapindex\b/i.test(body || '')) return urls;

  const children = rootLocs
    .map((value) => {
      try { return new URL(value, finalUrl).toString(); } catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => sitemapChildScore(b) - sitemapChildScore(a))
    .slice(0, 3);

  for (const child of children) {
    try {
      const result = await safeFetch(child, {
        timeoutMs: 5000,
        maxBytes: 900_000,
      });
      if (!result.response.ok) continue;
      urls.push(...extractLocs(result.body));
      if (urls.length >= 100) break;
    } catch {}
  }

  return [...new Set(urls)].slice(0, 100);
}

export async function inspectRobotsAndSitemap(homeUrl) {
  const base = new URL(homeUrl);
  const robotsUrl = new URL('/robots.txt', base);

  let robotsText = '';
  let robotsVerified = false;
  let sitemapUrls = [];

  try {
    const robots = await safeFetch(robotsUrl, {
      timeoutMs: 5000,
      maxBytes: 200_000,
    });

    if (!isBlockedStatus(robots.response.status)) {
      robotsVerified = true;
    }

    if (robots.response.ok) {
      robotsText = robots.body;
      sitemapUrls = [...robotsText.matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
    }
  } catch {}

  const commonCandidates = [
    new URL('/sitemap.xml', base).toString(),
    new URL('/sitemap_index.xml', base).toString(),
    new URL('/sitemap-index.xml', base).toString(),
  ];

  const candidates = [...new Set([...sitemapUrls, ...commonCandidates])].slice(0, 6);

  let sitemapFound = false;
  let sitemapUrl = null;
  let sitemapVerified = false;
  let sitemapPageUrls = [];
  const sitemapAttempts = [];

  for (const candidate of candidates) {
    try {
      const result = await safeFetch(candidate, {
        timeoutMs: 5000,
        maxBytes: 1_000_000,
      });

      const status = result.response.status;
      const bodyLooksXml = /<urlset\b|<sitemapindex\b|<\?xml\b/i.test(result.body || '');
      const typeLooksXml = /application\/xml|text\/xml|application\/xhtml\+xml/i.test(result.contentType || '');

      sitemapAttempts.push({
        url: candidate,
        status,
        contentType: result.contentType || '',
        bodyLooksXml,
      });

      if (!isBlockedStatus(status) && status > 0) {
        sitemapVerified = true;
      }

      if (result.response.ok && (bodyLooksXml || typeLooksXml) && /<urlset\b|<sitemapindex\b/i.test(result.body || '')) {
        sitemapFound = true;
        sitemapUrl = result.finalUrl.toString();
        sitemapPageUrls = await readSitemapPageUrls(result.body, sitemapUrl);
        break;
      }
    } catch {
      sitemapAttempts.push({
        url: candidate,
        status: 0,
        contentType: '',
        bodyLooksXml: false,
      });
    }
  }

  return {
    robotsText,
    robotsVerified,
    sitemapFound,
    sitemapVerified,
    sitemapUrl,
    sitemapAttempts,
    sitemapPageUrls,
  };
}

function shouldIgnoreInternalUrl(url) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();

    // Infrastructure/helper URLs are not visitor-facing pages and may
    // intentionally return non-200 responses when probed directly.
    if (path.startsWith('/cdn-cgi/')) return true;

    return false;
  } catch {
    return true;
  }
}

function normaliseInternalUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

export async function checkBrokenLinks(homeAnalysis, maxLinks = 30) {
  const unique = [...new Set(
    homeAnalysis.internalLinks
      .map((l) => normaliseInternalUrl(l.absolute))
      .filter(Boolean)
      .filter((url) => !shouldIgnoreInternalUrl(url)),
  )].slice(0, maxLinks);

  const results = [];
  const concurrency = 5;

  for (let i = 0; i < unique.length; i += concurrency) {
    const batch = unique.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (url) => ({
        url,
        ...(await safeStatus(url)),
      })),
    );
    results.push(...batchResults);
  }

  const verified = results.filter((r) => r.verifiable);
  const broken = verified.filter((r) => r.status >= 400);
  const unverified = results.filter((r) => !r.verifiable);

  return {
    checked: results.length,
    verified: verified.length,
    broken,
    unverified,
  };
}

export async function checkAlternateHost(homeUrl) {
  try {
    const current = new URL(homeUrl);
    const altHost = current.hostname.startsWith('www.')
      ? current.hostname.slice(4)
      : `www.${current.hostname}`;

    const alt = new URL(current);
    alt.hostname = altHost;

    const status = await safeStatus(alt, 5000);

    if (!status.status || !status.verifiable) {
      return { verified: false, status };
    }

    const finalHost = new URL(status.finalUrl).hostname.replace(/^www\./, '');
    const currentHost = current.hostname.replace(/^www\./, '');

    return {
      verified: true,
      consistent: finalHost === currentHost,
      status,
    };
  } catch {
    return { verified: false };
  }
}
