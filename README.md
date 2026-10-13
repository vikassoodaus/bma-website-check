# BMA Free Website Check — V1.6

Final engine stabilisation pass before the public UI.

## V1.6 changes

- Balanced sitemap-index sampling so Shopify product URLs cannot be crowded out by a large pages sitemap.
- Product and collection sitemap children are prioritised for eCommerce discovery.
- Up to 180 sitemap page candidates can be considered while still sampling only 5 pages in the free scan.
- PageSpeed timeout increased to 45 seconds with a clear timeout diagnostic.
- eCommerce homepage action scoring now recognises detected product/cart actions consistently.
- eCommerce warning copy no longer contradicts a detected purchase action.
- Existing Skippy progress animation and V1.5 eCommerce scoring are preserved.

## Expected Shopify sample

Homepage + Collection + Product + Contact + About, where those page types are available.
