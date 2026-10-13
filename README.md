# BMA Free Website Check — V1.5

V1.5 is the final scanner-engine tuning pass before the public-facing experience.

## What changed

- Automatically identifies likely eCommerce/Shopify stores and switches to a commerce-specific conversion model.
- eCommerce conversion scoring now rewards shopping actions, collection/product discovery, Add to Cart and cart/checkout paths instead of expecting enquiry forms.
- Store sampling now deliberately prioritises: Collection → Product → Contact → About (the homepage is already scanned separately).
- Sitemap fallback remains available for Shopify themes or JS-heavy navigation.
- Broken-link checks now use links from the homepage plus sampled pages, improving technical verification when a homepage exposes few crawlable links.
- eCommerce tracking checks use product/cart/checkout paths rather than lead-form/thank-you rules.
- A single low-confidence/unverified check no longer marks an otherwise well-verified scan as provisional; provisional status now starts below 95% model coverage.
- Developer diagnostics identify eCommerce discovery mode.
- Keeps the six-colour progress bar and hopping Skippy mascot.
- Version metadata updated to 1.5.0.

## Deploy

Upload all files and folders from this V1.5 folder to the existing `bma-website-check` GitHub repository, replacing the previous versions. Commit the changes and let Vercel redeploy automatically.

Your existing `GOOGLE_PAGESPEED_API_KEY` environment variable remains unchanged.
