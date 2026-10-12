export function aggregateSite(home, pages = []) {
  const all = [home, ...pages];
  const boolAny = (key) => all.some((p) => Boolean(p?.[key]));
  const contactSignals = {};
  for (const key of Object.keys(home.contactSignals || {})) contactSignals[key] = all.some((p) => p?.contactSignals?.[key]);
  const marketingSignals = {};
  for (const key of Object.keys(home.marketingSignals || {})) marketingSignals[key] = all.some((p) => p?.marketingSignals?.[key]);

  return {
    formPresent: boolAny('formPresent'),
    directContact: boolAny('directContact'),
    contactPath: boolAny('contactPath'),
    servicePath: boolAny('servicePath'),
    aboutPath: boolAny('aboutPath'),
    privacyPath: boolAny('privacyPath'),
    termsPath: boolAny('termsPath'),
    thankYou: boolAny('thankYou'),
    thankYouVerified: all.length > 1,
    socialProof: boolAny('socialProof'),
    additionalProof: boolAny('additionalProof'),
    businessIdentity: boolAny('businessIdentity'),
    ga4: boolAny('ga4'),
    gtm: boolAny('gtm'),
    consentSignal: boolAny('consentSignal'),
    contactSignals,
    marketingSignals,
  };
}
