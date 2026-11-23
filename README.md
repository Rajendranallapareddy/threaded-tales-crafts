# Threaded Tales Crafts - Frontend

React + TypeScript + Vite storefront (light and dark theme, mobile first).

## Run locally
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in dist/
    npm run preview    # serve the production build

Requires Node.js 18+.

## Optional
- Create `.env` with `VITE_WHATSAPP_NUMBER=91XXXXXXXXXX` to enable WhatsApp enquiries and bag enquiries.
- Start the backend (`../backend`) to serve `/api/products` (proxied in `vite.config.ts`). Without it the site shows the built-in products.
- The 3D virtual gallery is untouched at `public/gallery/index.html` (served at `/gallery/`).
- Product photos are transparent WebP files in `public/products/`.
