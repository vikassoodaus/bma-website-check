# BMA Free Website Check — Phase 1

This is the first working build of the scanner backend and deterministic 100-point scoring engine.

## What is included

- SSRF-safe public URL validation
- Homepage HTML fetch with redirect limits and size/time limits
- Up to 4 additional internal pages selected from site navigation
- robots.txt + sitemap detection
- Google PageSpeed Insights mobile performance call
- 100-point rules-based score across 6 categories
- Top 3 issue prioritisation with family de-duplication
- 3 positive findings
- Marketing technology signals (not scored)
- Up to 30 sampled internal link checks
- Development tester page at `/`

## Project structure

- `api/website-check.js` — public scan API
- `lib/security.js` — URL validation / private network blocking
- `lib/fetch-site.js` — safe HTTP fetching and redirects
- `lib/analyse-page.js` — HTML detection rules
- `lib/discover-pages.js` — selects up to 4 useful internal pages
- `lib/pagespeed.js` — PageSpeed Insights integration
- `lib/scoring.js` — scoring engine
- `config/issue-library.js` — wording, points and priorities
- `config/scoring.js` — category maxima, CTA phrases and page selection rules
- `index.html` — temporary test interface

## Deploy to Vercel

1. Create a new GitHub repository or use a new folder/repository for the tool.
2. Upload all files from this package preserving the folders.
3. Import the repository into Vercel.
4. Add environment variable:

   `GOOGLE_PAGESPEED_API_KEY`

   The scanner will attempt PageSpeed without a key, but use a key for normal deployment/quota management.

5. Optional environment variables:

   `ALLOWED_ORIGIN=https://businessmarketingagency.com.au`

   During initial testing, omit this so CORS defaults to `*`.

   `EXPOSE_SCAN_DEBUG=true`

   Use only while testing. Remove or set false before public launch.

6. Deploy.
7. Open the Vercel URL and run the tester against several sites.

## Important: what is NOT in Phase 1 yet

- OpenAI report writing
- GHL lead creation
- PDF report generation
- Turnstile / rate limiting
- persistent database/history
- rendered-browser visual analysis
- Firecrawl fallback

Those come after we test this scanner against real websites and correct false positives.

## Test set recommendation

Use at least 10 varied sites:

- 2 GHL sites
- 2 WordPress sites
- 2 Shopify stores
- 1 highly JavaScript-driven site
- 1 intentionally weak/small site
- 1 strong professional local-business site
- 1 site with known SEO/tracking problems

For every scan, note anything clearly wrong in:

- overall result
- top 3 issues
- detected forms/CTAs
- reviews/trust
- GA4/GTM detection
- service/contact page discovery
- PageSpeed result

We should fix detection accuracy before building the polished public frontend.
