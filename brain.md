# AUREN Website Brain

## What this website is

AUREN is a responsive fragrance storefront for presenting and selling AUREN
perfumes in Pakistan. It gives visitors a home page, a fragrance catalogue,
individual product details, a collection page, a brand story, and an order
flow that sends the customer’s order to AUREN on WhatsApp.

The visual direction is editorial and premium: navy navigation and footer,
warm gold accents, ivory content backgrounds, serif display typography, and
fragrance photography. The home-page hero uses the local lifestyle image
`src/assets/bg.png`.

## Current application capabilities

- Browse and filter the fragrance catalogue.
- Open a detail page for each fragrance.
- Add individual fragrances or the featured Open + Desire pair to the bag.
- Calculate a limited-time pair price of Rs499 for each two items.
- Review and remove items in the animated bag drawer.
- Enter delivery details and prepare an order message for WhatsApp.
- Navigate between pages using client-side routes.
- Display route-specific title, description, social metadata, and product
  structured data.
- Show responsive navigation, animations, and newsletter form feedback.

The bag is held in React state in the browser and is not persisted to a server
or local storage. The newsletter currently shows a local success state; it
does not submit an email to a mailing-list service.

## Application entry and routing

- `index.html` — HTML document, favicon, verification, and initial SEO metadata.
- `src/main.jsx` — mounts React and imports the global stylesheet.
- `src/App.jsx` — app root, browser router, and app stylesheet.
- `src/layout/Storefront.jsx` — shared site shell, route declarations, bag state,
  pair offer actions, toast, bag drawer, WhatsApp contact shortcut, and
  scroll-to-top behavior.
- `src/components/PageSEO.jsx` — updates page metadata and product/home
  structured data when the route changes.

### Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `src/pages/Home.jsx` | Hero, featured offer, signature products, brand story teaser, and newsletter |
| `/shop` | `src/pages/Shop.jsx` | Product catalogue and category filter |
| `/shop/:productId` | `src/pages/Product.jsx` | Product details and add-to-bag action |
| `/collections` | `src/pages/Collections.jsx` | Curated fragrance collection and pair offer |
| `/story` | `src/pages/Story.jsx` | Brand story and fragrance philosophy |
| `/checkout` | `src/pages/Checkout.jsx` | Customer delivery form and WhatsApp order handoff |
| Any unmatched route | `src/components/NotFound.jsx` | Not-found page |

## Source tree guide

### Pages — `src/pages/`

Each route has its own page component:

- `Home.jsx` — home page and GSAP hero/scroll animations.
- `Shop.jsx` — catalogue display and client-side fragrance filtering.
- `Product.jsx` — resolves a product from the route parameter and displays its
  details.
- `Collections.jsx` — collection cards and featured pair content.
- `Story.jsx` — brand story.
- `Checkout.jsx` — bag summary, delivery form, pricing, and WhatsApp message.

Pages should compose shared UI from `src/components/` rather than reimplement
common elements.

### Shared UI — `src/components/`

- `Navbar.jsx` — offer announcement, brand link, responsive navigation, and
  bag button.
- `ProductCard.jsx` — reusable fragrance listing card.
- `CoupleOffer.jsx` — featured Open + Desire offer and add-to-bag actions.
- `PairOfferBanner.jsx` — reusable pair-deal announcement.
- `PageIntro.jsx` — shared intro banner used by interior pages.
- `Newsletter.jsx` — newsletter form UI (currently local-only behavior).
- `Footer.jsx` — site footer and navigation.
- `NotFound.jsx` — fallback page for unknown routes or product IDs.
- `PageSEO.jsx` — route-based metadata and structured data.
- `WhatsAppIcon.jsx` — reusable inline WhatsApp mark.

### Data — `src/data/`

- `fragrances.js` — current local product catalogue. Product records include
  `id`, `name`, `note`, `description`, `price`, `image`, `notes`, and `category`.
  Image imports are local files from `src/assets/`.
- `pageContent.js` — home, shop, collection, story, and newsletter display copy.

The current product records are local seed data, not a live API response.
`src/lib/fragrance.js` is a compatibility re-export of the fragrance list;
prefer importing the canonical data from `src/data/fragrances.js`.

### Business logic — `src/lib/`

- `promotions.js` — `pairOfferPrice` and `getOrderPricing`, used to calculate
  subtotal, discount, total, and pair count. Keep price calculations in this
  module rather than duplicating them in components.
- `fragrance.js` — compatibility re-export; see the data note above.

### Styling and assets

- `src/index.css` — CSS reset, font loading, global defaults, and color/font
  variables.
- `src/App.css` — storefront layout, component styles, responsive breakpoints,
  and reduced-motion preferences.
- `src/assets/` — logo, home hero background, and fragrance images. Prefer
  referencing these local assets from the data module for product images.
- `public/` — static public assets such as the favicon.

## Technologies in use

| Technology | Use |
| --- | --- |
| React 19 | UI components, hooks, and local interactive state |
| Vite | Local development server and production build |
| React Router | Client-side page navigation and product URL parameters |
| GSAP + ScrollTrigger | Home hero entrance and signature-card scroll reveals |
| Framer Motion | Route transitions, product-card hover, toast, and bag drawer |
| Lucide React | Navigation, shopping, and decorative interface icons |
| Tailwind CSS 4 / Vite plugin | Available styling utility framework; most current site styling is in `src/App.css` |
| Oxlint | Source linting |

## API integration guide

There is no API client, backend, or database configured yet. For future API
integration:

1. Add a focused service module, for example `src/services/fragranceService.js`,
   to fetch and validate products. Keep network requests out of presentational
   components.
2. Map API products into the shape used by `src/data/fragrances.js`, or define
   and adopt a shared product schema. Keep stable product IDs because product
   pages use `/shop/:productId` and the featured offer selects Open and Desire
   by ID.
3. Move catalogue loading and loading/error UI into the page or a data hook.
   Do not silently substitute empty products when a request fails; show an
   explicit loading or error state.
4. Move page copy to a content endpoint only if the content needs to be edited
   independently. `src/data/pageContent.js` is the current local content source.
5. Use a backend checkout/order endpoint for real order creation. The current
   WhatsApp checkout only opens a prefilled message; it does not confirm or
   persist an order.
6. Connect the newsletter form to a consent-aware subscription endpoint. Its
   current success message is only local UI feedback.
7. Keep promotions authoritative on the server when introducing real payments
   or order creation; the browser-side calculation is for display only.

Do not put private API keys or secrets in Vite client environment variables:
values exposed to browser code are public.

## Local development and checks

Run these commands from the `Auren` app directory:

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

The production build currently emits a bundle-size warning. It is a warning,
not a build failure.
