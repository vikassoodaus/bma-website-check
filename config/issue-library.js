export const ISSUE_LIBRARY = {
  PERF_MOBILE_SCORE: {
    category: 'performance', family: 'performance', points: 8, impact: 'high', confidence: 'high',
    failTitle: 'Mobile performance needs attention',
    failText: 'Your website is taking longer than ideal to load and become usable on mobile.',
    recommendation: 'Start with the largest images, scripts and third-party tools identified by the performance test.',
    passTitle: 'Strong mobile performance',
    passText: 'Your mobile performance result is in a healthy range.'
  },
  PERF_LCP: {
    category: 'performance', family: 'performance', points: 4, impact: 'high', confidence: 'high',
    failTitle: 'Main content loads slowly',
    failText: 'Visitors may wait too long before the most important part of the page appears.',
    recommendation: 'Review the largest visible content element, image delivery, server response time and render-blocking assets.',
    passTitle: 'Main content loads quickly',
    passText: 'The largest visible content appears within the recommended range.'
  },
  PERF_CLS: {
    category: 'performance', family: 'performance', points: 3, impact: 'normal', confidence: 'high',
    failTitle: 'Page elements move while loading',
    failText: 'Unexpected layout shifts can make a website feel unstable or harder to use.',
    recommendation: 'Reserve space for images, embeds and dynamic elements so the layout stays stable while loading.',
    passTitle: 'Stable page layout',
    passText: 'The page shows low visual movement while loading.'
  },
  PERF_TBT: {
    category: 'performance', family: 'performance', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'The page may feel slow to respond',
    failText: 'Heavy script execution can delay interaction on slower devices.',
    recommendation: 'Reduce unnecessary JavaScript, third-party scripts and long-running main-thread tasks.',
    passTitle: 'Good interaction readiness',
    passText: 'Blocking time is within a healthy range.'
  },
  MOBILE_VIEWPORT: {
    category: 'performance', family: 'mobile', points: 3, impact: 'critical', confidence: 'high',
    failTitle: 'Mobile setup needs attention',
    failText: 'We could not verify a standard responsive viewport configuration.',
    recommendation: 'Add a responsive viewport meta tag and confirm the site reflows correctly on small screens.',
    passTitle: 'Responsive viewport detected',
    passText: 'The page includes a standard mobile viewport configuration.'
  },
  IMAGE_BLOAT: {
    category: 'performance', family: 'performance', points: 0, impact: 'low', confidence: 'medium',
    failTitle: 'Images could be lighter',
    failText: 'The performance test found opportunities to reduce image payload.',
    recommendation: 'Compress oversized images, use modern formats where appropriate and serve responsive image sizes.',
    passTitle: 'Image delivery looks efficient',
    passText: 'No major image optimisation warning was detected.'
  },

  CTA_PRIMARY: {
    category: 'conversion', family: 'conversion', points: 4, impact: 'critical', confidence: 'medium',
    failTitle: "The next step isn't obvious",
    failText: 'We could not find a strong primary action telling visitors what to do next.',
    recommendation: 'Choose one main action such as Book, Call, Enquire or Get a Quote and make it visually obvious.',
    passTitle: 'Clear next step detected',
    passText: 'Your website gives visitors an obvious action to take.'
  },
  CTA_EARLY: {
    category: 'conversion', family: 'conversion', points: 3, impact: 'high', confidence: 'medium',
    failTitle: 'Your main action appears late',
    failText: 'Visitors may need to scroll before they understand what to do next.',
    recommendation: 'Move the primary action earlier in the homepage structure and reinforce it near the main offer.',
    passTitle: 'Primary action appears early',
    passText: 'A meaningful call to action appears early in the homepage structure.'
  },
  FORM_PRESENT: {
    category: 'conversion', family: 'lead_capture', points: 3, impact: 'critical', confidence: 'high',
    failTitle: 'No clear enquiry form detected',
    failText: 'Visitors may have fewer ways to become a lead directly from the website.',
    recommendation: 'Add a short enquiry, booking or quote form that is easy to find and use.',
    passTitle: 'Lead form detected',
    passText: 'Visitors have a direct form-based path to enquire.'
  },
  DIRECT_CONTACT: {
    category: 'conversion', family: 'lead_capture', points: 2, impact: 'high', confidence: 'high',
    failTitle: 'Direct contact options are limited',
    failText: 'We could not detect a clear phone, email, booking or messaging action.',
    recommendation: 'Add at least one direct contact option such as click-to-call, email, booking or WhatsApp.',
    passTitle: 'Direct contact path detected',
    passText: 'Visitors have at least one direct way to contact or book.'
  },
  CONTACT_PATH: {
    category: 'conversion', family: 'lead_capture', points: 2, impact: 'high', confidence: 'high',
    failTitle: 'Contact or booking path is hard to find',
    failText: 'We could not find a clear contact, booking or enquiry page in the site structure.',
    recommendation: 'Add a dedicated contact, booking or quote page and include it in the main navigation.',
    passTitle: 'Contact path detected',
    passText: 'A dedicated contact or booking path is available.'
  },
  CTA_REPEAT: {
    category: 'conversion', family: 'conversion', points: 2, impact: 'normal', confidence: 'medium',
    failTitle: 'The main action may need reinforcement',
    failText: 'On a longer homepage, the primary call to action appears only once.',
    recommendation: 'Repeat the main action at natural decision points on longer pages.',
    passTitle: 'Primary action is reinforced',
    passText: 'The main call to action is repeated appropriately.'
  },
  SERVICE_PATH: {
    category: 'conversion', family: 'site_structure', points: 2, impact: 'high', confidence: 'high',
    failTitle: 'Your main services are difficult to find',
    failText: 'We could not detect an obvious service, solution, program or product path.',
    recommendation: 'Create clear service or product pages and make them easy to reach from navigation.',
    passTitle: 'Service path detected',
    passText: 'Visitors can reach service, solution or product information from the site structure.'
  },
  THANKYOU_PATH: {
    category: 'conversion', family: 'lead_capture', points: 2, impact: 'high', confidence: 'low',
    failTitle: 'A confirmation path was not found',
    failText: 'We could not verify a thank-you or confirmation path after lead capture.',
    recommendation: 'Use a dedicated confirmation step or thank-you page so enquiries can be measured more reliably.',
    passTitle: 'Confirmation path detected',
    passText: 'A likely thank-you or confirmation path was detected.'
  },


  ECOM_PRIMARY_ACTION: {
    category: 'conversion', family: 'ecommerce_action', points: 4, impact: 'critical', confidence: 'medium',
    failTitle: 'The shopping action is not obvious',
    failText: 'We could not detect a strong shopping action such as Shop Now, Buy Now or Add to Cart.',
    recommendation: 'Make the main shopping action visually obvious and use clear purchase-focused button language.',
    passTitle: 'Clear shopping action detected',
    passText: 'Visitors are given an obvious path to browse or buy.'
  },
  ECOM_ACTION_EARLY: {
    category: 'conversion', family: 'ecommerce_action', points: 3, impact: 'high', confidence: 'medium',
    failTitle: 'The shopping action appears late',
    failText: 'Visitors may need to move too far through the homepage before reaching a clear shopping action.',
    recommendation: 'Bring a Shop, Collection or Product action closer to the main offer near the start of the homepage.',
    passTitle: 'Shopping action appears early',
    passText: 'A purchase-focused action appears early in the homepage structure.'
  },
  ECOM_PRODUCT_PATH: {
    category: 'conversion', family: 'ecommerce_structure', points: 3, impact: 'critical', confidence: 'high',
    failTitle: 'Product pages are difficult to reach',
    failText: 'We could not verify a clear path to individual product pages.',
    recommendation: 'Make individual products easy to reach from collections, navigation and key homepage sections.',
    passTitle: 'Product path detected',
    passText: 'Visitors can reach individual product pages.'
  },
  ECOM_COLLECTION_PATH: {
    category: 'conversion', family: 'ecommerce_structure', points: 2, impact: 'high', confidence: 'high',
    failTitle: 'Product browsing could be clearer',
    failText: 'We could not verify a clear collection, category or shop browsing path.',
    recommendation: 'Create clear collection or category routes so shoppers can browse relevant products quickly.',
    passTitle: 'Collection path detected',
    passText: 'Visitors can browse products through a collection, category or shop path.'
  },
  ECOM_CART_SIGNAL: {
    category: 'conversion', family: 'ecommerce_purchase', points: 3, impact: 'critical', confidence: 'high',
    failTitle: 'Cart functionality was not clearly detected',
    failText: 'We could not verify an Add to Cart or equivalent cart action in the sampled shopping pages.',
    recommendation: 'Make the Add to Cart action clear on product pages and confirm the cart flow works reliably.',
    passTitle: 'Cart action detected',
    passText: 'A clear cart action was detected in the shopping journey.'
  },
  ECOM_PRODUCT_CTA: {
    category: 'conversion', family: 'ecommerce_purchase', points: 3, impact: 'critical', confidence: 'high',
    failTitle: 'Product purchase action is unclear',
    failText: 'The sampled product experience did not expose a clear Buy, Add to Cart or option-selection action.',
    recommendation: 'Use a prominent product purchase action and make variant or option selection straightforward.',
    passTitle: 'Product purchase action detected',
    passText: 'The sampled product experience includes a clear purchase action.'
  },
  ECOM_CHECKOUT_SIGNAL: {
    category: 'conversion', family: 'ecommerce_checkout', points: 2, impact: 'high', confidence: 'medium',
    failTitle: 'Checkout path was not clearly verified',
    failText: 'We could not verify a cart or checkout path from the sampled site structure.',
    recommendation: 'Confirm shoppers can move cleanly from product selection to cart and checkout without unnecessary friction.',
    passTitle: 'Checkout path detected',
    passText: 'A cart or checkout path is available in the shopping journey.'
  },


  TRACK_ECOM_CONVERSION: {
    category: 'tracking', family: 'tracking', points: 2, impact: 'high', confidence: 'high',
    failTitle: 'Trackable commerce action was not detected',
    failText: 'We could not verify a clear product-to-cart conversion action in the sampled shopping flow.',
    recommendation: 'Make sure product and cart actions are measurable so analytics can distinguish browsing from buying intent.',
    passTitle: 'Trackable commerce path detected',
    passText: 'A product-to-cart conversion path is present and can be measured.'
  },
  TRACK_ECOM_CHECKOUT: {
    category: 'tracking', family: 'tracking', points: 2, impact: 'high', confidence: 'medium',
    failTitle: 'Checkout measurement path is unclear',
    failText: 'We could not verify a cart or checkout step that can support purchase-funnel measurement.',
    recommendation: 'Confirm cart and checkout events are available to your analytics and advertising platforms.',
    passTitle: 'Cart or checkout measurement path detected',
    passText: 'A cart or checkout stage is present for purchase-funnel measurement.'
  },

  ABOUT_PAGE: {
    category: 'trust', family: 'trust', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'Visitors have limited information about the business',
    failText: 'We could not find an About, Team or Our Story page.',
    recommendation: 'Add a concise About page that explains who is behind the business and why customers should trust it.',
    passTitle: 'About information detected',
    passText: 'Visitors can learn more about the business or team.'
  },
  CONTACT_DETAILS: {
    category: 'trust', family: 'trust', points: 3, impact: 'high', confidence: 'high',
    failTitle: 'Business contact details are limited',
    failText: 'The site provides few visible contact or location signals.',
    recommendation: 'Make key business contact information easy to verify in the footer or contact page.',
    passTitle: 'Business contact details detected',
    passText: 'The site provides multiple useful contact or location signals.'
  },
  SOCIAL_PROOF: {
    category: 'trust', family: 'trust', points: 3, impact: 'high', confidence: 'medium',
    failTitle: 'Limited social proof detected',
    failText: 'Reviews and testimonials can reduce uncertainty before someone contacts you.',
    recommendation: 'Add genuine reviews, testimonials, ratings or case-study evidence where visitors make decisions.',
    passTitle: 'Trust signals detected',
    passText: 'Reviews or testimonials are helping support credibility.'
  },
  PRIVACY_POLICY: {
    category: 'trust', family: 'compliance', points: 1.5, impact: 'normal', confidence: 'high',
    failTitle: 'Privacy policy not found',
    failText: 'We could not find an obvious privacy policy link.',
    recommendation: 'Add a privacy policy and link it from the footer and relevant forms.',
    passTitle: 'Privacy policy detected',
    passText: 'A privacy policy link is available.'
  },
  TERMS_PAGE: {
    category: 'trust', family: 'compliance', points: 1.5, impact: 'low', confidence: 'high',
    failTitle: 'Terms page not found',
    failText: 'We could not find an obvious terms or terms-of-service page.',
    recommendation: 'Add appropriate business terms and make them accessible from the site footer.',
    passTitle: 'Terms page detected',
    passText: 'A terms page is available.'
  },
  BUSINESS_IDENTITY: {
    category: 'trust', family: 'trust', points: 2, impact: 'normal', confidence: 'medium',
    failTitle: 'Business identity could be clearer',
    failText: 'We found limited company identity information in the homepage or footer.',
    recommendation: 'Clearly show the business name and useful contact or location information in a consistent site-wide area.',
    passTitle: 'Business identity is clear',
    passText: 'The site presents a clear business identity.'
  },
  ADDITIONAL_PROOF: {
    category: 'trust', family: 'trust', points: 2, impact: 'normal', confidence: 'medium',
    failTitle: 'Additional proof is limited',
    failText: 'We could not detect portfolio, case-study, team, award or similar credibility content.',
    recommendation: 'Add real proof such as portfolio work, case studies, team profiles, awards or before-and-after examples.',
    passTitle: 'Additional proof detected',
    passText: 'The site includes credibility content beyond basic contact information.'
  },

  SEO_TITLE: {
    category: 'seo', family: 'seo_metadata', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'Page title needs attention',
    failText: 'The homepage title is missing or not in a useful range.',
    recommendation: 'Write a concise title that clearly describes the business and primary offer.',
    passTitle: 'Useful page title detected',
    passText: 'The homepage has a clear title element.'
  },
  SEO_META: {
    category: 'seo', family: 'seo_metadata', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'Meta description needs attention',
    failText: 'The homepage meta description is missing or unusually short/long.',
    recommendation: 'Add a clear meta description that summarises the page and gives searchers a reason to visit.',
    passTitle: 'Meta description detected',
    passText: 'The homepage includes a useful meta description.'
  },
  SEO_H1: {
    category: 'seo', family: 'seo_structure', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'Heading structure could be clearer',
    failText: 'We could not verify one clear primary H1 heading on the homepage.',
    recommendation: 'Use one clear primary heading that explains the main page topic or offer.',
    passTitle: 'Primary heading detected',
    passText: 'The homepage has one clear H1 heading.'
  },
  SEO_CANONICAL: {
    category: 'seo', family: 'seo_metadata', points: 1, impact: 'low', confidence: 'high',
    failTitle: 'Canonical URL not detected',
    failText: 'The homepage does not appear to declare a canonical URL.',
    recommendation: 'Add a canonical tag that points to the preferred homepage URL.',
    passTitle: 'Canonical URL detected',
    passText: 'The homepage declares a canonical URL.'
  },
  SEO_INDEXABLE: {
    category: 'seo', family: 'indexability', points: 2, impact: 'critical', confidence: 'high',
    failTitle: 'Homepage may be blocked from search',
    failText: 'We detected a noindex directive or another signal that may prevent indexing.',
    recommendation: 'Review robots directives immediately if the homepage is intended to appear in search.',
    passTitle: 'Homepage appears indexable',
    passText: 'No obvious noindex directive was detected.'
  },
  SEO_SITEMAP: {
    category: 'seo', family: 'indexability', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'XML sitemap not found',
    failText: 'We could not locate a sitemap from the usual path or robots.txt.',
    recommendation: 'Publish an XML sitemap and reference it in robots.txt or submit it through Search Console.',
    passTitle: 'XML sitemap detected',
    passText: 'A sitemap is available to help search engines discover pages.'
  },
  SEO_SCHEMA: {
    category: 'seo', family: 'seo_structure', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'Structured data was not detected',
    failText: 'Schema can help search engines better understand the business and page content.',
    recommendation: 'Add relevant JSON-LD such as Organization, LocalBusiness, Service, Product or Breadcrumb schema.',
    passTitle: 'Structured data detected',
    passText: 'JSON-LD structured data is present on the homepage.'
  },
  SEO_OG: {
    category: 'seo', family: 'social_sharing', points: 1, impact: 'low', confidence: 'high',
    failTitle: 'Social sharing metadata is incomplete',
    failText: 'Open Graph metadata was not fully detected.',
    recommendation: 'Add Open Graph title, description and image tags so shared links display more professionally.',
    passTitle: 'Social sharing metadata detected',
    passText: 'Open Graph metadata is present.'
  },
  SEO_ALT: {
    category: 'seo', family: 'seo_structure', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'Image alt text coverage is limited',
    failText: 'A significant share of meaningful images appear to be missing alt text.',
    recommendation: 'Add concise descriptive alt text to meaningful images and leave decorative images appropriately empty.',
    passTitle: 'Good image alt text coverage',
    passText: 'Most meaningful images include alt attributes.'
  },
  SEO_SITE_STRUCTURE: {
    category: 'seo', family: 'site_structure', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'Core page structure is limited',
    failText: 'We could not identify enough core business pages such as services, about and contact.',
    recommendation: 'Build clear core pages around the services, business information and enquiry journey.',
    passTitle: 'Core site structure detected',
    passText: 'The site includes a useful set of core business pages.'
  },
  SEO_HEADINGS: {
    category: 'seo', family: 'seo_structure', points: 2, impact: 'normal', confidence: 'medium',
    failTitle: 'Heading hierarchy could be improved',
    failText: 'The heading structure shows skipped levels or other hierarchy issues.',
    recommendation: 'Use headings in a logical order so page sections are easy for users and search engines to understand.',
    passTitle: 'Heading hierarchy looks logical',
    passText: 'No obvious heading-order problem was detected.'
  },

  TECH_HTTPS: {
    category: 'technical', family: 'security', points: 2, impact: 'critical', confidence: 'high',
    failTitle: 'Your website is not securely served over HTTPS',
    failText: 'Visitors and browsers expect websites to use a secure HTTPS connection.',
    recommendation: 'Install and enforce SSL/HTTPS across the entire website.',
    passTitle: 'Secure connection detected',
    passText: 'Your website is being served over HTTPS.'
  },
  TECH_STATUS: {
    category: 'technical', family: 'availability', points: 2, impact: 'critical', confidence: 'high',
    failTitle: 'Homepage response needs attention',
    failText: 'The final homepage response did not return a healthy success status.',
    recommendation: 'Fix the homepage server response so visitors and search engines receive a successful 200 response.',
    passTitle: 'Homepage responds normally',
    passText: 'The homepage returns a healthy success response.'
  },
  TECH_REDIRECTS: {
    category: 'technical', family: 'availability', points: 1, impact: 'low', confidence: 'high',
    failTitle: 'Too many redirects detected',
    failText: 'The homepage passes through multiple redirects before loading.',
    recommendation: 'Reduce unnecessary redirect hops and point links directly to the preferred URL.',
    passTitle: 'Redirect path looks clean',
    passText: 'The homepage reaches its final URL with minimal redirecting.'
  },
  TECH_MIXED_CONTENT: {
    category: 'technical', family: 'security', points: 2, impact: 'high', confidence: 'high',
    failTitle: 'Some page resources may be loading insecurely',
    failText: 'We found HTTP resource URLs on an HTTPS page.',
    recommendation: 'Update insecure resource URLs so all page assets load over HTTPS.',
    passTitle: 'No obvious mixed content detected',
    passText: 'The homepage does not show obvious insecure resource references.'
  },
  TECH_BROKEN_LINKS: {
    category: 'technical', family: 'site_quality', points: 3, impact: 'high', confidence: 'high',
    failTitle: 'Broken internal links detected',
    failText: 'Some sampled internal links returned error responses.',
    recommendation: 'Fix or redirect broken internal links so visitors do not reach dead ends.',
    passTitle: 'Sampled internal links look healthy',
    passText: 'No broken links were found in the sampled internal links.'
  },
  TECH_FORM_LABELS: {
    category: 'technical', family: 'accessibility', points: 2, impact: 'normal', confidence: 'medium',
    failTitle: 'Some form fields may be harder to use with assistive technology',
    failText: 'We found fields without an obvious label or accessible name.',
    recommendation: 'Associate form inputs with labels or accessible naming attributes.',
    passTitle: 'Form labelling looks healthy',
    passText: 'Sampled form fields include labels or accessible names.'
  },
  TECH_HTML_BASICS: {
    category: 'technical', family: 'site_quality', points: 1, impact: 'normal', confidence: 'high',
    failTitle: 'Basic HTML setup is incomplete',
    failText: 'One or more basic document signals such as language, charset or viewport are missing.',
    recommendation: 'Add standard HTML language, charset and viewport declarations.',
    passTitle: 'Basic HTML setup detected',
    passText: 'Language, charset and viewport basics are in place.'
  },
  TECH_FAVICON: {
    category: 'technical', family: 'cosmetic', points: 1, impact: 'cosmetic', confidence: 'high',
    failTitle: 'Site icon not detected',
    failText: 'A favicon or site icon was not found in the homepage markup.',
    recommendation: 'Add a favicon so the brand is recognisable in browser tabs and bookmarks.',
    passTitle: 'Site icon detected',
    passText: 'A favicon or site icon is present.'
  },
  TECH_HOST_CANONICAL: {
    category: 'technical', family: 'availability', points: 1, impact: 'low', confidence: 'medium',
    failTitle: 'WWW and non-WWW versions may be inconsistent',
    failText: 'The alternate hostname did not clearly resolve to the same preferred website.',
    recommendation: 'Choose one preferred hostname and redirect the alternate version consistently.',
    passTitle: 'Hostname handling looks consistent',
    passText: 'WWW and non-WWW handling appears consistent.'
  },

  TRACK_GA4: {
    category: 'tracking', family: 'tracking', points: 3, impact: 'high', confidence: 'medium',
    failTitle: 'Google Analytics was not detected',
    failText: 'Without analytics, it is harder to understand how visitors find and use the website.',
    recommendation: 'Install GA4 directly or through a tag-management setup and confirm data is being collected.',
    passTitle: 'Analytics detected',
    passText: 'Google Analytics appears to be installed.'
  },
  TRACK_GTM: {
    category: 'tracking', family: 'tracking', points: 2, impact: 'normal', confidence: 'high',
    failTitle: 'Analytics tag setup could be improved',
    failText: 'We could not detect Google Analytics or a Google Tag Manager container.',
    recommendation: 'Install GA4 directly or use Google Tag Manager when the business needs flexible marketing and conversion tracking.',
    passTitle: 'Analytics tagging detected',
    passText: 'A Google Analytics or Google Tag Manager setup appears to be present.'
  },
  TRACK_FORM: {
    category: 'tracking', family: 'lead_capture', points: 2, impact: 'high', confidence: 'medium',
    failTitle: 'A trackable lead path is limited',
    failText: 'We could not verify a clear form or lead-capture path on the sampled pages.',
    recommendation: 'Use a clear enquiry or booking path that can be measured as a conversion.',
    passTitle: 'Trackable lead path detected',
    passText: 'A form or lead-capture path is available.'
  },
  TRACK_THANKYOU: {
    category: 'tracking', family: 'lead_capture', points: 2, impact: 'high', confidence: 'low',
    failTitle: 'Confirmation tracking may be missing',
    failText: 'We could not verify a thank-you or confirmation route for completed enquiries.',
    recommendation: 'Use a measurable success event or dedicated confirmation page after form submission.',
    passTitle: 'Confirmation path detected',
    passText: 'A likely confirmation or thank-you route was detected.'
  },
  TRACK_CONSENT: {
    category: 'tracking', family: 'compliance', points: 1, impact: 'normal', confidence: 'medium',
    failTitle: 'Privacy or consent signals are limited',
    failText: 'We could not detect clear privacy or consent information around lead capture.',
    recommendation: 'Make privacy information easy to find and use appropriate consent language where required.',
    passTitle: 'Privacy or consent signal detected',
    passText: 'The site includes a privacy or consent signal around lead capture.'
  },
};
