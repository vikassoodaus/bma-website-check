export const CATEGORY_MAX = {
  performance: 20,
  conversion: 20,
  trust: 15,
  seo: 20,
  technical: 15,
  tracking: 10,
};

export const IMPACT_MULTIPLIER = {
  critical: 1.5,
  high: 1.25,
  normal: 1,
  low: 0.5,
  cosmetic: 0.2,
};

export const CTA_PHRASES = [
  'book', 'call', 'contact', 'enquire', 'enquiry', 'get quote', 'request quote',
  'schedule', 'start', 'get started', 'buy', 'shop', 'talk', 'consultation',
  'free assessment', 'get estimate', 'learn more', 'request information',
];

export const ECOMMERCE_CTA_PHRASES = [
  'shop now', 'shop', 'buy now', 'add to cart', 'add to basket', 'add to bag',
  'quick add', 'choose options', 'select options', 'view product', 'view products',
  'view collection', 'browse collection', 'browse products', 'checkout', 'check out',
  'order now', 'purchase', 'buy',
];

export const PAGE_WEIGHTS = [
  { pattern: /(^|\/)(contact|contact-us|enquire|enquiry|request-quote|book|booking|appointment)(\/|$)/i, weight: 110 },
  { pattern: /(^|\/)(pages\/)?(contact|contact-us|enquire|enquiry|request-quote|book|booking|appointment)(\/|$)/i, weight: 108 },
  { pattern: /(^|\/)(services?|solutions?|what-we-do|programs?)(\/|$)/i, weight: 100 },
  { pattern: /(^|\/)(pages\/)?(about|about-us|our-story|team)(\/|$)/i, weight: 95 },
  { pattern: /(^|\/)(collections?|categories?)(\/|$)/i, weight: 94 },
  { pattern: /(^|\/)(product|products)(\/|$)/i, weight: 92 },
  { pattern: /(^|\/)(shop|store)(\/|$)/i, weight: 88 },
  { pattern: /service|solution|program|collection|category|product/i, weight: 65 },
  { pattern: /\/pages\//i, weight: 58 },
];

export const DEPRIORITIZE_PATTERNS = [
  /\/blog\/?/i,
  /\/tag\//i,
  /\/category\//i,
  /\/author\//i,
  /\/login\/?/i,
  /\/account\/?/i,
  /\/cart\/?/i,
  /\/privacy/i,
  /\/terms/i,
  /\/archive/i,
];
