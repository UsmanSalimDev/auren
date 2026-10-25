# AUREN

A responsive fragrance storefront built with React and Vite, styled around an
ivory, navy, and warm-gold palette.

## Run locally

```sh
npm install
npm run dev
```

## Frontend structure

- `src/pages/` contains one component per route: home, shop, collections, story,
  product details, and checkout.
- `src/components/` contains shared storefront UI such as the navigation,
  product card, offer panels, newsletter, footer, and page metadata.
- `src/layout/Storefront.jsx` connects the routes and shared shopping-bag state.
- `src/data/fragrances.js` contains the local fragrance catalog and product copy.
- `src/data/pageContent.js` contains page headings and editorial copy.
- `src/lib/promotions.js` contains pair-offer pricing rules.

Catalog and page copy are kept out of the page components so they can later be
loaded from an API and mapped to the same data shape without reorganizing the
routes or presentation components. `src/lib/fragrance.js` remains as a
compatibility re-export for older imports.

## Routes

- `/` — home and signature collection
- `/shop` — fragrance catalogue
- `/shop/:productId` — fragrance details
- `/collections` — curated collection
- `/story` — brand story
- `/checkout` — order details and WhatsApp checkout

The mobile menu, fragrance filters, shopping bag, and newsletter form are
client-side interactions. GSAP powers the hero and scroll reveals; Framer Motion
handles page, card, toast, and shopping-bag transitions.
