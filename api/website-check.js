import { normaliseUrl, assertPublicUrl } from '../lib/security.js';
import { safeFetch } from '../lib/fetch-site.js';
import { analysePage } from '../lib/analyse-page.js';
import { discoverPages } from '../lib/discover-pages.js';
import { runPageSpeed } from '../lib/pagespeed.js';
import { inspectRobotsAndSitemap, checkBrokenLinks, checkAlternateHost } from '../lib/auxiliary.js';
import { aggregateSite } from '../lib/aggregate.js';
import { scoreScan } from '../lib/scoring.js';

function setCors(res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });

  const startedAt = Date.now();
  try {
    const input = req.body?.url;
    const requestedUrl = normaliseUrl(input);
    await assertPublicUrl(requestedUrl);

    const [homeFetch, pageSpeed] = await Promise.all([
      safeFetch(requestedUrl, { timeoutMs: 10000 }),
      runPageSpeed(requestedUrl.toString()),
    ]);

    if (!homeFetch.body) throw new Error('We could not read usable HTML from this website.');

    const home = analysePage(homeFetch.body, homeFetch.finalUrl.toString());

    // Get sitemap intelligence before choosing the four sample pages. This is
    // especially useful for Shopify and JS-heavy navigation where the homepage
    // may expose fewer usable links to a simple HTML parser.
    const [auxBase, altHost] = await Promise.all([
      inspectRobotsAndSitemap(homeFetch.finalUrl.toString()),
      checkAlternateHost(homeFetch.finalUrl.toString()),
    ]);

    const discovery = discoverPages(home, 4, auxBase.sitemapPageUrls || []);
    const extraUrls = discovery.selected.map((item) => item.url);

    const pageResults = await Promise.all(extraUrls.map(async (url) => {
      try {
        const fetched = await safeFetch(url, { timeoutMs: 7000 });
        if (!fetched.body) return null;
        return analysePage(fetched.body, fetched.finalUrl.toString());
      } catch {
        return null;
      }
    }));

    const pages = pageResults.filter(Boolean);

    // Broken-link testing should not depend only on homepage links. Some Shopify
    // themes expose little usable navigation in the initial HTML, while sampled
    // collection/product pages contain normal internal links.
    const combinedLinkSource = {
      ...home,
      internalLinks: [
        ...(home.internalLinks || []),
        ...pages.flatMap((page) => page.internalLinks || []),
      ],
    };
    const brokenLinks = await checkBrokenLinks(combinedLinkSource, 30);
    const site = aggregateSite(home, pages);

    const rawScan = {
      requestedUrl: requestedUrl.toString(),
      finalUrl: homeFetch.finalUrl.toString(),
      httpStatus: homeFetch.response.status,
      redirectCount: homeFetch.redirects.length,
      home,
      pages,
      site,
      pageSpeed,
      discovery,
      aux: { ...auxBase, altHost, brokenLinks },
    };

    const score = scoreScan(rawScan);

    return res.status(200).json({
      success: true,
      website: {
        requestedUrl: rawScan.requestedUrl,
        finalUrl: rawScan.finalUrl,
        domain: new URL(rawScan.finalUrl).hostname,
        siteType: site.siteType,
        scannedPages: [home.url, ...pages.map((p) => p.url)],
      },
      score: {
        overall: score.overall,
        label: score.label,
        provisional: score.provisional,
        unverifiedChecks: score.unverifiedChecks,
        confirmedScore: score.confirmedScore,
        confirmedMax: score.confirmedMax,
        coverage: score.coverage,
      },
      categories: score.categories,
      topIssues: score.topIssues.map((f) => ({
        id: f.id,
        family: f.family,
        title: f.title,
        text: f.screenText,
        recommendation: f.recommendation,
        priority: f.priority,
      })),
      wins: score.wins.map((f) => ({ id: f.id, title: f.title, text: f.screenText })),
      marketingSignals: site.marketingSignals,
      technical: {
        pageSpeedAvailable: pageSpeed.available,
        pageSpeedError: pageSpeed.available ? null : pageSpeed.error || 'Unavailable',
        pageSpeedStatus: pageSpeed.status ?? null,
        pageSpeedApiKeyConfigured: Boolean(pageSpeed.apiKeyConfigured),
        imageOptimisationAdvisory: pageSpeed.imageOptimised === false
          ? 'PageSpeed identified image optimisation opportunities.'
          : null,
        brokenLinksChecked: brokenLinks.checked,
        brokenLinksVerified: brokenLinks.verified,
        brokenLinksFound: brokenLinks.broken.length,
        brokenLinks: brokenLinks.broken.slice(0, 10),
        brokenLinksUnverified: brokenLinks.unverified.slice(0, 10),
        sitemapFound: auxBase.sitemapFound,
        sitemapVerified: auxBase.sitemapVerified,
        sitemapUrl: auxBase.sitemapUrl,
        sitemapAttempts: auxBase.sitemapAttempts,
        sitemapPageCandidates: (auxBase.sitemapPageUrls || []).length,
        discovery: {
          homepageInternalLinks: discovery.discoveredInternalLinks,
          sitemapCandidates: discovery.sitemapCandidates,
          candidateCount: discovery.candidateCount,
          ecommerceMode: Boolean(discovery.ecommerce),
          selected: discovery.selected.map((item) => ({
            url: item.url,
            source: item.source,
            reason: item.reason,
            score: item.score,
          })),
        },
      },
      meta: {
        version: '2.0.0',
        durationMs: Date.now() - startedAt,
      },
      debug: process.env.EXPOSE_SCAN_DEBUG === 'true' ? {
        findings: score.findings,
        home: {
          title: home.title,
          h1s: home.h1s,
          schemaTypes: home.schemaTypes,
          ctaCount: home.ctaCount,
          wordCount: home.wordCount,
        },
      } : undefined,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error?.message || 'Website check failed.' });
  }
}
