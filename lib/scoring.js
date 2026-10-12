import { CATEGORY_MAX, IMPACT_MULTIPLIER } from '../config/scoring.js';
import { ISSUE_LIBRARY } from '../config/issue-library.js';

function result(id, status, pointsEarned, details = {}) {
  const def = ISSUE_LIBRARY[id];
  const max = def.points;
  const earned = status === 'unverified' ? null : Math.max(0, Math.min(max, pointsEarned));
  const lost = earned === null ? 0 : max - earned;
  const impact = IMPACT_MULTIPLIER[def.impact] ?? 1;
  return {
    id,
    family: def.family,
    category: def.category,
    status,
    pointsEarned: earned,
    pointsAvailable: max,
    impact: def.impact,
    priority: Number((lost * impact).toFixed(2)),
    confidence: def.confidence,
    title: status === 'pass' ? def.passTitle : def.failTitle,
    screenText: status === 'pass' ? def.passText : def.failText,
    recommendation: def.recommendation,
    details,
  };
}

function band(overall) {
  if (overall >= 85) return 'Strong Foundation';
  if (overall >= 70) return 'Good, with opportunities';
  if (overall >= 50) return 'Needs Attention';
  return 'Significant Gaps';
}

export function scoreScan(scan) {
  const h = scan.home;
  const ps = scan.pageSpeed;
  const findings = [];

  if (ps?.available && typeof ps.performanceScore === 'number') {
    const s = ps.performanceScore;
    findings.push(result('PERF_MOBILE_SCORE', s >= 90 ? 'pass' : s >= 60 ? 'warning' : 'fail', s >= 90 ? 8 : s >= 75 ? 6 : s >= 60 ? 4 : s >= 40 ? 2 : 0, { score: s }));
  } else findings.push(result('PERF_MOBILE_SCORE', 'unverified', 0));

  if (ps?.available && typeof ps.lcpMs === 'number') {
    const v = ps.lcpMs / 1000;
    findings.push(result('PERF_LCP', v <= 2.5 ? 'pass' : v <= 4 ? 'warning' : 'fail', v <= 2.5 ? 4 : v <= 4 ? 2 : 0, { seconds: Number(v.toFixed(2)) }));
  } else findings.push(result('PERF_LCP', 'unverified', 0));

  if (ps?.available && typeof ps.cls === 'number') {
    const v = ps.cls;
    findings.push(result('PERF_CLS', v <= 0.1 ? 'pass' : v <= 0.25 ? 'warning' : 'fail', v <= 0.1 ? 3 : v <= 0.25 ? 1.5 : 0, { cls: Number(v.toFixed(3)) }));
  } else findings.push(result('PERF_CLS', 'unverified', 0));

  if (ps?.available && typeof ps.tbtMs === 'number') {
    const v = ps.tbtMs;
    findings.push(result('PERF_TBT', v <= 200 ? 'pass' : v <= 600 ? 'warning' : 'fail', v <= 200 ? 2 : v <= 600 ? 1 : 0, { ms: Math.round(v) }));
  } else findings.push(result('PERF_TBT', 'unverified', 0));

  findings.push(result('MOBILE_VIEWPORT', h.viewport ? 'pass' : 'fail', h.viewport ? 2 : 0));
  if (typeof ps?.imageOptimised === 'boolean') findings.push(result('IMAGE_BLOAT', ps.imageOptimised ? 'pass' : 'warning', ps.imageOptimised ? 1 : 0.5));
  else findings.push(result('IMAGE_BLOAT', 'unverified', 0));

  findings.push(result('CTA_PRIMARY', h.ctaCount > 0 ? 'pass' : 'fail', h.ctaCount > 0 ? 4 : 0, { ctaCount: h.ctaCount }));
  findings.push(result('CTA_EARLY', h.earlyCta ? 'pass' : 'warning', h.earlyCta ? 3 : 1));
  findings.push(result('FORM_PRESENT', scan.site.formPresent ? 'pass' : 'fail', scan.site.formPresent ? 3 : 0));
  findings.push(result('DIRECT_CONTACT', scan.site.directContact ? 'pass' : 'fail', scan.site.directContact ? 2 : 0));
  findings.push(result('CONTACT_PATH', scan.site.contactPath ? 'pass' : 'fail', scan.site.contactPath ? 2 : 0));
  if (h.wordCount > 1200) findings.push(result('CTA_REPEAT', h.ctaCount >= 2 ? 'pass' : 'warning', h.ctaCount >= 2 ? 2 : 1));
  else findings.push(result('CTA_REPEAT', 'pass', 2, { notRequired: true }));
  findings.push(result('SERVICE_PATH', scan.site.servicePath ? 'pass' : 'fail', scan.site.servicePath ? 2 : 0));
  findings.push(scan.site.thankYouVerified ? result('THANKYOU_PATH', scan.site.thankYou ? 'pass' : 'warning', scan.site.thankYou ? 2 : 1) : result('THANKYOU_PATH', 'unverified', 0));

  findings.push(result('ABOUT_PAGE', scan.site.aboutPath ? 'pass' : 'fail', scan.site.aboutPath ? 2 : 0));
  const contactSignals = Object.values(scan.site.contactSignals).filter(Boolean).length;
  findings.push(result('CONTACT_DETAILS', contactSignals >= 2 ? 'pass' : contactSignals === 1 ? 'warning' : 'fail', contactSignals >= 2 ? 3 : contactSignals === 1 ? 1.5 : 0, { signals: contactSignals }));
  findings.push(result('SOCIAL_PROOF', scan.site.socialProof ? 'pass' : 'fail', scan.site.socialProof ? 3 : 0));
  findings.push(result('PRIVACY_POLICY', scan.site.privacyPath ? 'pass' : 'fail', scan.site.privacyPath ? 1.5 : 0));
  findings.push(result('TERMS_PAGE', scan.site.termsPath ? 'pass' : 'fail', scan.site.termsPath ? 1.5 : 0));
  findings.push(result('BUSINESS_IDENTITY', scan.site.businessIdentity ? 'pass' : 'warning', scan.site.businessIdentity ? 2 : 1));
  findings.push(result('ADDITIONAL_PROOF', scan.site.additionalProof ? 'pass' : 'fail', scan.site.additionalProof ? 2 : 0));

  const titleLen = h.title.length;
  findings.push(result('SEO_TITLE', titleLen >= 30 && titleLen <= 65 ? 'pass' : titleLen ? 'warning' : 'fail', titleLen >= 30 && titleLen <= 65 ? 2 : titleLen ? 1 : 0, { length: titleLen }));
  const metaLen = h.metaDescription.length;
  findings.push(result('SEO_META', metaLen >= 70 && metaLen <= 180 ? 'pass' : metaLen ? 'warning' : 'fail', metaLen >= 70 && metaLen <= 180 ? 2 : metaLen ? 1 : 0, { length: metaLen }));
  findings.push(result('SEO_H1', h.h1s.length === 1 ? 'pass' : h.h1s.length ? 'warning' : 'fail', h.h1s.length === 1 ? 2 : h.h1s.length ? 1 : 0, { count: h.h1s.length }));
  findings.push(result('SEO_CANONICAL', h.canonical ? 'pass' : 'fail', h.canonical ? 1 : 0));
  const noindex = /\bnoindex\b/.test(h.robots) || /\bnone\b/.test(h.robots);
  findings.push(result('SEO_INDEXABLE', noindex ? 'fail' : 'pass', noindex ? 0 : 2, { robots: h.robots }));
  findings.push(result('SEO_SITEMAP', scan.aux.sitemapFound ? 'pass' : 'fail', scan.aux.sitemapFound ? 2 : 0));
  findings.push(result('SEO_SCHEMA', h.schemaTypes.length ? 'pass' : 'fail', h.schemaTypes.length ? 2 : 0, { types: h.schemaTypes }));
  findings.push(result('SEO_OG', h.openGraphComplete ? 'pass' : 'warning', h.openGraphComplete ? 1 : 0.5));
  findings.push(result('SEO_ALT', h.altCoverage >= 0.9 ? 'pass' : h.altCoverage >= 0.6 ? 'warning' : 'fail', h.altCoverage >= 0.9 ? 2 : h.altCoverage >= 0.6 ? 1 : 0, { coverage: Number(h.altCoverage.toFixed(2)), images: h.imageCount }));
  const corePages = [scan.site.servicePath, scan.site.aboutPath, scan.site.contactPath].filter(Boolean).length;
  findings.push(result('SEO_SITE_STRUCTURE', corePages >= 2 ? 'pass' : corePages === 1 ? 'warning' : 'fail', corePages >= 2 ? 2 : corePages === 1 ? 1 : 0, { corePages }));
  findings.push(result('SEO_HEADINGS', h.headingSkip ? 'warning' : 'pass', h.headingSkip ? 1 : 2));

  findings.push(result('TECH_HTTPS', scan.finalUrl.startsWith('https://') ? 'pass' : 'fail', scan.finalUrl.startsWith('https://') ? 2 : 0));
  findings.push(result('TECH_STATUS', scan.httpStatus >= 200 && scan.httpStatus < 300 ? 'pass' : 'fail', scan.httpStatus >= 200 && scan.httpStatus < 300 ? 2 : 0, { status: scan.httpStatus }));
  findings.push(result('TECH_REDIRECTS', scan.redirectCount <= 1 ? 'pass' : scan.redirectCount === 2 ? 'warning' : 'fail', scan.redirectCount <= 1 ? 1 : scan.redirectCount === 2 ? 0.5 : 0, { redirects: scan.redirectCount }));
  findings.push(result('TECH_MIXED_CONTENT', h.mixedContent ? 'fail' : 'pass', h.mixedContent ? 0 : 2));
  const brokenCount = scan.aux.brokenLinks.broken.length;
  findings.push(result('TECH_BROKEN_LINKS', brokenCount === 0 ? 'pass' : brokenCount <= 2 ? 'warning' : 'fail', brokenCount === 0 ? 3 : brokenCount <= 2 ? 2 : brokenCount <= 5 ? 1 : 0, { checked: scan.aux.brokenLinks.checked, broken: scan.aux.brokenLinks.broken.slice(0, 5) }));
  findings.push(result('TECH_FORM_LABELS', h.formLabelCoverage >= 0.9 ? 'pass' : h.formLabelCoverage >= 0.6 ? 'warning' : 'fail', h.formLabelCoverage >= 0.9 ? 2 : h.formLabelCoverage >= 0.6 ? 1 : 0, { coverage: Number(h.formLabelCoverage.toFixed(2)), inputs: h.inputCount }));
  const htmlBasics = [h.htmlLang, h.charset, h.viewport].filter(Boolean).length;
  findings.push(result('TECH_HTML_BASICS', htmlBasics === 3 ? 'pass' : htmlBasics === 2 ? 'warning' : 'fail', htmlBasics === 3 ? 1 : htmlBasics === 2 ? 0.5 : 0, { signals: htmlBasics }));
  findings.push(result('TECH_FAVICON', h.favicon ? 'pass' : 'fail', h.favicon ? 1 : 0));
  findings.push(scan.aux.altHost.verified ? result('TECH_HOST_CANONICAL', scan.aux.altHost.consistent ? 'pass' : 'warning', scan.aux.altHost.consistent ? 1 : 0.5) : result('TECH_HOST_CANONICAL', 'unverified', 0));

  if (scan.site.ga4) findings.push(result('TRACK_GA4', 'pass', 3));
  else if (scan.site.gtm) findings.push(result('TRACK_GA4', 'unverified', 0));
  else findings.push(result('TRACK_GA4', 'fail', 0));
  findings.push(result('TRACK_GTM', scan.site.gtm ? 'pass' : 'warning', scan.site.gtm ? 2 : 1));
  findings.push(result('TRACK_FORM', scan.site.formPresent ? 'pass' : 'fail', scan.site.formPresent ? 2 : 0));
  findings.push(scan.site.thankYouVerified ? result('TRACK_THANKYOU', scan.site.thankYou ? 'pass' : 'warning', scan.site.thankYou ? 2 : 1) : result('TRACK_THANKYOU', 'unverified', 0));
  findings.push(result('TRACK_CONSENT', scan.site.consentSignal || scan.site.privacyPath ? 'pass' : 'warning', scan.site.consentSignal || scan.site.privacyPath ? 1 : 0.5));

  const categories = {};
  for (const category of Object.keys(CATEGORY_MAX)) {
    const items = findings.filter((f) => f.category === category);
    const verifiedAvailable = items.filter((f) => f.status !== 'unverified').reduce((sum, f) => sum + f.pointsAvailable, 0);
    const verifiedEarned = items.filter((f) => f.status !== 'unverified').reduce((sum, f) => sum + (f.pointsEarned ?? 0), 0);
    const nominalMax = CATEGORY_MAX[category];
    const normalised = verifiedAvailable ? (verifiedEarned / verifiedAvailable) * nominalMax : 0;
    categories[category] = {
      score: Number(normalised.toFixed(1)),
      max: nominalMax,
      verifiedPoints: Number(verifiedAvailable.toFixed(1)),
      availablePoints: items.reduce((sum, f) => sum + f.pointsAvailable, 0),
    };
  }

  const overall = Number(Object.values(categories).reduce((sum, c) => sum + c.score, 0).toFixed(1));
  const unverified = findings.filter((f) => f.status === 'unverified').length;
  const provisional = unverified > 0;

  const candidates = findings.filter((f) => ['fail', 'warning'].includes(f.status) && f.priority > 0).sort((a, b) => b.priority - a.priority);
  const topIssues = [];
  const usedFamilies = new Set();
  for (const item of candidates) {
    if (!usedFamilies.has(item.family) || topIssues.length >= 2) {
      topIssues.push(item);
      usedFamilies.add(item.family);
    }
    if (topIssues.length === 3) break;
  }
  if (topIssues.length < 3) {
    for (const item of candidates) {
      if (!topIssues.includes(item)) topIssues.push(item);
      if (topIssues.length === 3) break;
    }
  }

  const wins = findings.filter((f) => f.status === 'pass').sort((a, b) => b.pointsAvailable - a.pointsAvailable).slice(0, 3);

  return {
    overall,
    label: band(overall),
    provisional,
    unverifiedChecks: unverified,
    categories,
    findings,
    topIssues,
    wins,
  };
}
