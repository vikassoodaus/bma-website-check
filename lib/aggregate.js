function normaliseHost(hostname = '') {
  return hostname.toLowerCase().replace(/^www\./, '');
}

function pagePathMatches(pageUrl, re) {
  try {
    const u = new URL(pageUrl);
    return re.test(u.pathname.toLowerCase());
  } catch {
    return false;
  }
}

export function aggregateSite(home, pages = []) {
  const all = [home, ...pages];
  const boolAny = (key) => all.some((p) => Boolean(p?.[key]));
  const scannedUrls = all.map((p) => p?.url).filter(Boolean);

  const contactSignals = {};
  for (const key of Object.keys(home.contactSignals || {})) {
    contactSignals[key] = all.some((p) => p?.contactSignals?.[key]);
  }

  const marketingSignals = {};
  for (const key of Object.keys(home.marketingSignals || {})) {
    marketingSignals[key] = all.some((p) => p?.marketingSignals?.[key]);
  }

  const scannedContactPath = scannedUrls.some((url) => pagePathMatches(url, /\/(contact|contact-us|enquir|quote|book|booking|appointment)(\/|$)/));
  const scannedServicePath = scannedUrls.some((url) => pagePathMatches(url, /\/(services?|solutions?|what-we-do|programs?|collections?|categories?|products?|shop|store)(\/|$)/));
  const scannedAboutPath = scannedUrls.some((url) => pagePathMatches(url, /\/(about|about-us|our-story|team)(\/|$)/));
  const scannedPrivacyPath = scannedUrls.some((url) => pagePathMatches(url, /\/privacy(\/|$|-)/));
  const scannedTermsPath = scannedUrls.some((url) => pagePathMatches(url, /\/(terms|conditions)(\/|$|-)/));
  const scannedThankYou = scannedUrls.some((url) => pagePathMatches(url, /\/(thank[-_ ]?you|thankyou|success|confirmation|submitted)(\/|$|-)/));

  contactSignals.contactPath = Boolean(contactSignals.contactPath || scannedContactPath);

  return {
    formPresent: boolAny('formPresent'),
    directContact: boolAny('directContact'),
    contactPath: boolAny('contactPath') || scannedContactPath,
    servicePath: boolAny('servicePath') || scannedServicePath,
    aboutPath: boolAny('aboutPath') || scannedAboutPath,
    privacyPath: boolAny('privacyPath') || scannedPrivacyPath,
    termsPath: boolAny('termsPath') || scannedTermsPath,
    thankYou: boolAny('thankYou') || scannedThankYou,
    thankYouVerified: all.length > 1,
    socialProof: boolAny('socialProof'),
    additionalProof: boolAny('additionalProof'),
    businessIdentity: boolAny('businessIdentity'),
    ga4: boolAny('ga4'),
    gtm: boolAny('gtm'),
    consentSignal: boolAny('consentSignal'),
    contactSignals,
    marketingSignals,
    scannedHostsConsistent: scannedUrls.every((value) => {
      try { return normaliseHost(new URL(value).hostname) === normaliseHost(new URL(home.url).hostname); } catch { return true; }
    }),
  };
}
