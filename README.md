# BMA Free Website Check — Phase 1 — V1.3 — V1.1

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

## Important: what is NOT in Phase 1 — V1.3 yet

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


## V1.1 scanner corrections

- XML sitemap responses are now accepted when served as `application/xml` or `text/xml`.
- Common sitemap paths now include `/sitemap.xml`, `/sitemap_index.xml`, and `/sitemap-index.xml`.
- Broken-link checks no longer mark large pages as broken simply because a GET fallback body exceeded the old debug limit.
- Blocked or timed-out link checks are classified as unverified instead of broken.
- Missing Google Tag Manager no longer creates a false problem when GA4 is already detected directly.
- Categories with too little verified data are shown as `Not fully verified` instead of being scaled to a misleading perfect score.
- A 0–100 overall result is only published when at least 90% of the scoring model has been verified.
- Development diagnostics now expose PageSpeed status, sitemap status, broken links, and unverified links.


## V1.3 changes

- Ignores Cloudflare `/cdn-cgi/` helper links in broken-link checks. These are not visitor-facing pages and can return 404 when probed directly.
- Improves PageSpeed 429 diagnostics.
- Reports whether `GOOGLE_PAGESPEED_API_KEY` is configured.

### Recommended Vercel environment variable

Add `GOOGLE_PAGESPEED_API_KEY` after enabling the PageSpeed Insights API in Google Cloud. Redeploy after saving the variable.


## V1.3
- Added animated scan percentage and progress bar in the tester status area.
- Progress advances through scan stages and caps below 100% until the real API response completes.
- On completion it moves to 100% and shows “Scan complete.”
