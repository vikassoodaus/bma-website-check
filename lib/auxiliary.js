import { safeFetch, safeStatus } from './fetch-site.js';

function isBlockedStatus(status) {
  return [401, 403, 429].includes(status);
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
  };
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
      .filter(Boolean),
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
