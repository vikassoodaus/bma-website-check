# BMA Free Website Check — V1.4.1

This build adds Skippy as an animated progress mascot. Skippy travels along the six-colour scan bar as the percentage increases and performs a final hop at 100%. The mascot is served from `/assets/skippy.webp`.

# BMA Free Website Check — V1.4

V1.4 stabilises the scoring model and improves page discovery before the public-facing design is built.

## What changed

- A result is no longer labelled provisional when at least 98% of the scoring model is verified.
- Image optimisation is now advisory rather than score-critical.
- Performance remains a full 20-point category by moving the responsive viewport check from 2 to 3 points.
- Minor unverified checks no longer trigger the confusing PARTIAL DATA badge.
- If no high-priority problems are found, the tester shows a clear positive message instead of an empty section.
- Internal-link matching now treats `www.example.com` and `example.com` as the same site.
- Shopify/eCommerce discovery now recognises `/collections/`, `/products/`, `/shop/`, `/store/`, and Shopify-style `/pages/...` routes.
- Sitemap URLs can be used as discovery fallback when the homepage HTML exposes too few useful navigation links.
- Sitemap indexes are sampled intelligently, prioritising page, collection/category, product and service sitemaps over blog/post sitemaps.
- Developer diagnostics now show homepage link count, sitemap discovery count, usable candidates and the exact sample pages selected with source/reason.
- Version metadata updated to 1.4.0.

## Deployment

Upload all files and folders from this V1.4 folder to the existing `bma-website-check` GitHub repository, replacing the previous versions. Commit the changes and let Vercel redeploy automatically.

Required Vercel environment variable:

`GOOGLE_PAGESPEED_API_KEY`
