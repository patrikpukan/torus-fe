# Torus Frontend

React 19 + Vite + TypeScript with Tailwind/shadcn UI, Supabase auth, and GraphQL (Apollo).

## Quickstart

- Install: `npm install`
- Run dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Required environment

Create `.env` in the repo root:

```
VITE_APP_URL=http://localhost:3000        # required, used in all auth emails
VITE_SUPABASE_URL=...                     # required
VITE_SUPABASE_PUBLISHABLE_KEY=...         # required
VITE_GRAPHQL_API=http://localhost:4000/graphql
VITE_GRAPHQL_WS_API=ws://localhost:4000/graphql   # optional, falls back to VITE_GRAPHQL_API
VITE_API_BASE=http://localhost:4000               # optional, used for asset URLs
```

`src/lib/appUrl.ts` throws at startup if `VITE_APP_URL` is missing.

## Project layout

- `src/app` – app shell, router, layouts, nav config
- `src/features` – feature slices (auth, organization, pairings, etc.)
- `src/pages` – routed pages composed from features
- `src/components` – shared UI primitives (shadcn)
- `src/lib` – clients (Apollo, Supabase) and utilities

## Auth + GraphQL notes

- Supabase client: `src/lib/supabaseClient.ts` (session managed by `AuthProvider`).
- Apollo client: `src/lib/apolloClient.ts` attaches Supabase JWT to `Authorization`.
- Auth routes:
  - `/auth/callback` – email confirmation callback
  - `/reset-password` – request reset email
  - `/reset-password/confirm` – set new password
- In Supabase Dashboard (Authentication), set `Site URL` and `Redirect URLs` to match `VITE_APP_URL` origin.
