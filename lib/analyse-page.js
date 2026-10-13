import * as cheerio from 'cheerio';
import { CTA_PHRASES, ECOMMERCE_CTA_PHRASES } from '../config/scoring.js';

function cleanText(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function meaningfulImages($) {
  return $('img').toArray().filter((el) => {
    const node = $(el);
    const width = Number(node.attr('width') || 0);
    const height = Number(node.attr('height') || 0);
    const src = node.attr('src') || node.attr('data-src') || '';
    if (!src) return false;
    if ((width && width <= 24) || (height && height <= 24)) return false;
    if (/pixel|tracking|spacer|1x1/i.test(src)) return false;
    return true;
  });
}

function hasPhrase(text, phrases) {
  const lower = text.toLowerCase();
  return phrases.some((phrase) => lower.includes(phrase));
}

export function analysePage(html, pageUrl) {
  const $ = cheerio.load(html || '');
  const url = new URL(pageUrl);

  const title = cleanText($('title').first().text());
  const metaDescription = cleanText($('meta[name="description"]').attr('content') || '');
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const robots = cleanText($('meta[name="robots"]').attr('content') || '').toLowerCase();
  const h1s = $('h1').toArray().map((el) => cleanText($(el).text())).filter(Boolean);
  const headings = $('h1,h2,h3,h4,h5,h6').toArray().map((el) => ({
    level: Number(el.tagName.slice(1)),
    text: cleanText($(el).text()),
  })).filter((h) => h.text);

  let headingSkip = false;
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i].level - headings[i - 1].level > 1) headingSkip = true;
  }

  const links = $('a[href]').toArray().map((el, index) => {
    const node = $(el);
    const href = node.attr('href') || '';
    let absolute = '';
    try { absolute = new URL(href, url).toString(); } catch {}
    return { href, absolute, text: cleanText(node.text()), index };
  }).filter((x) => x.absolute || /^(tel:|mailto:|https?:)/i.test(x.href));

  const buttons = $('button,a[role="button"],input[type="submit"],input[type="button"]').toArray().map((el, index) => {
    const node = $(el);
    return cleanText(node.text() || node.attr('value') || node.attr('aria-label') || node.attr('title') || '') || `button-${index}`;
  });

  const ctaElements = [...links.map((l) => l.text), ...buttons].filter((text) => text && hasPhrase(text, CTA_PHRASES));
  const ecommerceCtaElements = [...links.map((l) => l.text), ...buttons].filter((text) => text && hasPhrase(text, ECOMMERCE_CTA_PHRASES));
  const earlyLinks = links.slice(0, Math.max(8, Math.ceil(links.length * 0.25)));
  const earlyCta = [...earlyLinks.map((l) => l.text), ...buttons.slice(0, 5)].some((text) => text && hasPhrase(text, CTA_PHRASES));
  const earlyEcommerceCta = [...earlyLinks.map((l) => l.text), ...buttons.slice(0, 5)].some((text) => text && hasPhrase(text, ECOMMERCE_CTA_PHRASES));

  const bodyText = cleanText($('body').text());
  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;
  const forms = $('form').length;
  const formEmbed = /widget\/form|hubspot|gravityforms|gform|typeform|formstack|jotform|leadconnector|highlevel|hs-form/i.test(html || '');
  const directContact = links.some((l) => /^(tel:|mailto:)/i.test(l.href)) || /wa\.me|whatsapp|calendly|calendar|booking/i.test(html || '');

  const normaliseHost = (value = '') => value.toLowerCase().replace(/^www\./, '');
  const internalLinks = links.filter((l) => {
    try { return normaliseHost(new URL(l.absolute).hostname) === normaliseHost(url.hostname); } catch { return false; }
  });

  const pathTexts = internalLinks.map((l) => `${new URL(l.absolute).pathname} ${l.text}`.toLowerCase());
  const currentPath = url.pathname.toLowerCase();
  const hasPath = (re) => pathTexts.some((value) => re.test(value));
  const hasCurrentOrLinkedPath = (re) => re.test(currentPath) || hasPath(re);

  const imgs = meaningfulImages($);
  const withAlt = imgs.filter((el) => typeof $(el).attr('alt') === 'string' && $(el).attr('alt').trim().length > 0).length;
  const altCoverage = imgs.length ? withAlt / imgs.length : 1;

  const jsonLd = $('script[type="application/ld+json"]').toArray().map((el) => $(el).html() || '').filter(Boolean);
  const schemaTypes = [];
  for (const block of jsonLd) {
    try {
      const parsed = JSON.parse(block);
      const queue = Array.isArray(parsed) ? [...parsed] : [parsed];
      while (queue.length) {
        const item = queue.shift();
        if (!item || typeof item !== 'object') continue;
        if (item['@type']) schemaTypes.push(...(Array.isArray(item['@type']) ? item['@type'] : [item['@type']]));
        if (Array.isArray(item['@graph'])) queue.push(...item['@graph']);
      }
    } catch {}
  }

  const resources = $('[src],[href]').toArray().map((el) => $(el).attr('src') || $(el).attr('href') || '');
  const mixedContent = url.protocol === 'https:' && resources.some((src) => /^http:\/\//i.test(src));

  const inputs = $('input:not([type="hidden"]),textarea,select').toArray();
  let labelledInputs = 0;
  for (const el of inputs) {
    const node = $(el);
    const id = node.attr('id');
    const hasLabel = (id && $(`label[for="${id.replace(/"/g, '\\"')}"]`).length) || node.closest('label').length || node.attr('aria-label') || node.attr('aria-labelledby');
    if (hasLabel) labelledInputs += 1;
  }
  const formLabelCoverage = inputs.length ? labelledInputs / inputs.length : 1;

  const htmlLang = $('html').attr('lang') || '';
  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content') || '';
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  const favicon = $('link[rel*="icon"]').attr('href') || '';
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDescription = $('meta[property="og:description"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';

  const scriptsText = $('script').toArray().map((el) => $(el).html() || '').join('\n');
  const fullSource = `${html || ''}\n${scriptsText}`;
  const ga4 = /G-[A-Z0-9]{6,}/i.test(fullSource) || /googletagmanager\.com\/gtag|google-analytics\.com/i.test(fullSource);
  const gtm = /GTM-[A-Z0-9]+/i.test(fullSource);


  const ecommerceText = `${bodyText}
${buttons.join(' ')}`;
  const productPath = hasCurrentOrLinkedPath(/\/(products?|product)(\/|$)/i);
  const collectionPath = hasCurrentOrLinkedPath(/\/(collections?|categories?|category|shop|store)(\/|$)/i);
  const cartPath = hasCurrentOrLinkedPath(/\/(cart|basket|bag)(\/|$)/i) || /action=["'][^"']*\/cart\/add|\/cart\/add|data-add-to-cart|name=["']add["']/i.test(fullSource);
  const checkoutPath = hasCurrentOrLinkedPath(/\/(checkout|check-out)(\/|$)/i) || /name=["']checkout["']|\/checkout|Shopify\.Checkout/i.test(fullSource);
  const productCta = /add to cart|add to basket|add to bag|buy now|quick add|choose options|select options|order now|purchase/i.test(ecommerceText);
  const ecommerceHint = /cdn\.shopify\.com|Shopify\.theme/i.test(fullSource)
    || productPath
    || collectionPath
    || cartPath
    || checkoutPath
    || schemaTypes.some((type) => /Product|Offer/i.test(String(type)))
    || productCta;

  const consentSignal = /privacy|consent|cookie|gdpr|agree to|terms/i.test(html || '');
  const socialProof = /testimonial|review|what (our )?(clients|customers|families) say|google review|trustpilot|aggregateRating|\bstars?\b/i.test(html || '');
  const additionalProof = /portfolio|case stud|our work|clients?|team|award|certif|before.{0,8}after|results|projects|partners/i.test(html || '');
  const businessIdentity = /copyright|©|pty ltd|llc|ltd|inc\.|business marketing agency|company/i.test(bodyText) && (directContact || hasPath(/contact|about|location|service area/));

  const thankYou = hasPath(/thank[-_ ]?you|thankyou|success|confirmation|submitted/) || /thank[-_ ]?you|confirmation page|form submitted/i.test(html || '');

  return {
    url: url.toString(), title, metaDescription, canonical, robots, h1s, headings, headingSkip,
    links, internalLinks, buttons, ctaCount: ctaElements.length, earlyCta, wordCount,
    ecommerceCtaCount: ecommerceCtaElements.length, earlyEcommerceCta, ecommerceHint,
    productPath, collectionPath, cartPath, checkoutPath, productCta,
    formPresent: forms > 0 || formEmbed, directContact,
    contactPath: hasPath(/contact|book|booking|appointment|enquir|quote/),
    servicePath: hasPath(/service|solution|what-we-do|program|collection|category|product|shop|store/),
    aboutPath: hasPath(/about|our-story|team/),
    privacyPath: hasPath(/privacy/), termsPath: hasPath(/terms|conditions/), thankYou,
    socialProof, additionalProof, businessIdentity,
    altCoverage, imageCount: imgs.length, schemaTypes,
    mixedContent, formLabelCoverage, inputCount: inputs.length,
    htmlLang, charset, viewport, favicon,
    openGraphComplete: Boolean(ogTitle && ogDescription && ogImage),
    ga4, gtm, consentSignal,
    contactSignals: {
      tel: links.some((l) => /^tel:/i.test(l.href)),
      mailto: links.some((l) => /^mailto:/i.test(l.href)),
      contactPath: hasPath(/contact|enquir|quote/),
      booking: hasPath(/book|booking|appointment/) || /calendly|calendar/i.test(html || ''),
      addressLike: /\b(street|st\.|road|rd\.|avenue|ave\.|suite|level|victoria|melbourne|australia|usa|united states|uk|united kingdom)\b/i.test(bodyText),
    },
    marketingSignals: {
      metaPixel: /connect\.facebook\.net|fbq\(/i.test(fullSource),
      googleAds: /AW-[0-9]+/i.test(fullSource),
      tiktokPixel: /analytics\.tiktok\.com|ttq\./i.test(fullSource),
      linkedinInsight: /snap\.licdn\.com|linkedin.*insight/i.test(fullSource),
      hotjar: /hotjar\.com|hj\(/i.test(fullSource),
      clarity: /clarity\.ms/i.test(fullSource),
      ghl: /leadconnector|highlevel|msgsndr|filesafe\.space/i.test(fullSource),
      shopify: /cdn\.shopify\.com|Shopify\.theme/i.test(fullSource),
      wordpress: /wp-content|wp-includes/i.test(fullSource),
    },
  };
}
