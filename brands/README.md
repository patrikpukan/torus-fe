# Whitelabel brands

Each folder here is a customer brand. A deployment is built with one brand
baked in via the `VITE_BRAND` env var (default: `torus`); other brands are
never bundled.

```
brands/<id>/
  brand.tsx    # BrandConfig: name, logos, theme overrides, landing copy
  meta.json    # build-time meta: tab title, favicon path, Netlify site id
  Logo.tsx     # logo mark component (collapsed sidebar, hero)
  LogoText.tsx # full wordmark component (expanded sidebar)
  hero.*       # landing hero background image
```

Favicons live in `public/favicons/<id>.svg` (referenced from `meta.json`).

## Local development

```bash
npm run dev                    # default torus brand
VITE_BRAND=acme npm run dev    # any other brand
```

## Onboarding a new customer

1. Copy `brands/torus/` to `brands/<id>/`; edit `brand.tsx` (name, copy,
   theme hsl overrides — light AND dark), swap the logo components, hero
   image, and add `public/favicons/<id>.svg`. Update `meta.json` title and
   favicon path.
2. Create their Netlify site:
   `npm run deploy:brand -- <id> --create`
   Paste the printed Project ID into `brands/<id>/meta.json` → `netlifySiteId`.
3. Allow the new origin on the backend: append the site URL (no trailing
   slash) to the `CORS_ORIGINS` env var on the Render `torus-be` service.
4. Deploy: `npm run deploy:brand -- <id>`
   (with the production `VITE_GRAPHQL_API`/`VITE_*` vars in the environment).
5. Optional: attach the customer's custom domain in Netlify site settings and
   add that origin to `CORS_ORIGINS` too.

## Theme overrides

`brand.tsx` → `theme.light` / `theme.dark` override a fixed set of CSS
variables (see `src/branding/types.ts`). Values are hsl triplets matching
`src/index.css`, e.g. `"166 76% 32%"`. Anything omitted keeps the stock
theme; the torus brand overrides nothing.

## Future: org binding

`defaultInviteCode` pre-fills the register form for a deployment (invite
codes rotate — keep it fresh). `orgCode` is reserved: locking a deployment
to an organization needs a backend "resolve org code" feature first.
