# LooksFacts

**Skincare, without the guesswork.** LooksFacts helps people discover skincare
products, understand their key ingredients, build morning and evening routines,
and find more affordable alternatives.

This is the front-end MVP: a React single-page app with a curated local product
dataset. There is no backend or user accounts yet.

## Features

- **SkinFacts catalogue** — 110 well-known products across 8 categories, with
  search (product, brand or ingredient), category and skin-type filters,
  sorting, and shareable URLs.
- **Product pages** — key ingredients with plain-language notes, cheaper
  alternatives, related products, and an interactive **3D product viewer**
  (rotate, zoom, front/side/back views).
- **Routine Builder** — morning and evening routines saved in the browser,
  step guidance, reordering, cost breakdown and general ingredient caution
  notes (e.g. retinoids with exfoliating acids).
- **Budget Finder** — budget and price-range filtering, cheaper alternatives
  that share key ingredients, and side-by-side comparison of up to 4 products.
- **Multi-currency** — prices are stored in AUD; NZD, USD, GBP, EUR and CAD are
  shown as approximate conversions.

## Tech stack

- React 19 + Vite 8, JavaScript/JSX
- Tailwind CSS v4 (design tokens in `src/index.css`)
- React Router 7
- Three.js via React Three Fiber + drei (3D viewer, lazy-loaded on product pages only)
- Oxlint for linting; playwright-core for end-to-end smoke tests

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script             | What it does                                                      |
| ------------------ | ----------------------------------------------------------------- |
| `npm run dev`      | Start the dev server                                              |
| `npm run build`    | Production build to `dist/`                                       |
| `npm run preview`  | Serve the production build                                        |
| `npm run lint`     | Run Oxlint                                                        |
| `npm run test:e2e` | End-to-end smoke tests against a running dev server (see below)   |

### End-to-end tests

`tests/e2e.mjs` drives your installed Microsoft Edge (or Chrome) — no browser
download needed. Start the dev server, then in another terminal:

```bash
npm run test:e2e
# options: BASE_URL=http://localhost:4173  BROWSER_CHANNEL=chrome  HEADED=1
```

It covers navigation and links, search, catalogue filters and URL state,
product pages and 3D controls, the Routine Builder, the Budget Finder,
currency switching, horizontal overflow at 375–1440px, one `h1` per page and
console errors.

## Project structure

```
src/
  pages/               Route-level pages (Home, SkinFacts, ProductDetail, …)
  components/
    layout/            Navbar, Footer, search overlay, page shell
    product/           Product image, card, price, data-status notice
    product3d/         3D viewer, procedural packaging models, label textures
    routine/           Routine product picker
    ui/                Buttons, icons, logo, page header, currency selector
  data/                products.js, categories.js, ingredients.js, articles.js
  hooks/               useLocalStorage, useCurrency, useRoutine, useDialog
  context/             Currency provider
  utils/               Currency, catalogue search/filter/alternatives,
                       routine rules, shared packaging colours
  assets/
    products/          Drop-in product photos (see README inside)
    models/            Drop-in GLB 3D models (see README inside)
tests/e2e.mjs          End-to-end smoke tests
```

## Adding product photos

Save a photo as `src/assets/products/<product-id>.webp` (or `.jpg`, `.png`,
`.avif`). It is picked up automatically everywhere the product appears and
becomes the default view on its product page. The full list of product IDs is
in [`src/assets/products/README.md`](src/assets/products/README.md).

Use square images (800×800 or larger) on a white or transparent background.
**Only add images you have the rights to use** — brand press/media kits,
retailer or affiliate product feeds, or your own photography.

## Adding 3D models

By default each product uses a procedurally generated packaging model based on
its category. To use a real model, add `src/assets/models/<product-id>.glb`.
See [`src/assets/models/README.md`](src/assets/models/README.md) for size and
compression guidance.

## Data caveats

The product catalogue is a manually curated MVP dataset:

- **Prices** are indicative Australian RRPs. They are not live and vary by
  retailer.
- **Key ingredients** are those the brand promotes — not full ingredient (INCI)
  lists — and have not been independently verified.
- Entries marked **Sample data** have incomplete or uncertain details.
- **Skin types** are only listed where the brand positions the product for them.
- Currency conversions use fixed approximate rates (`src/utils/currency.js`).
- Routine caution notes are general guidance, not a safety assessment or
  medical advice.

These caveats are also shown to users on the site.

## Roadmap

- User accounts and a database (sync routines across devices)
- Verified retailer links and live pricing
- Licensed product photography and 3D models
- Evidence-based ingredient pages and fact-checks of viral skincare claims
- More products and regional (non-AUD) pricing
