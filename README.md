# 📁 Project Structure

src/
app/
assets/
features/
pages/
shared/
main.tsx

### `app/`
Globálna inicializácia aplikácie — providery, router, layout, globálne štýly.

### `assets/`
Statické súbory (obrázky, SVG, fonty). Pre skutočne statické → `public/`.

### `features/`
Samostatné funkčné celky (napr. `auth`, `cart`).  
Každá feature má vlastné `api/`, `components/`, `hooks/`, `lib/`.

### `pages/`
Route-level stránky.  
Každá má vlastný priečinok s `Page.tsx` a lokálnymi sekciami/hookmi.

### `shared/`
Zdieľané UI a utility naprieč projektom:
- `ui/` – generické komponenty (Button, Modal…)
- `hooks/` – znovupoužiteľné hooky
- `lib/` – helpers, formátovanie, http
- `assets/` – globálne ikony/ilustrácie
- `styles/` – globálne CSS, tokens


## Supabase Authentication & GraphQL

- Konfiguruj `.env` s hodnotami:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_GRAPHQL_API` (GraphQL endpoint backendu)
  - `VITE_APP_URL` (origin FE, používa sa v e-mailových odkazoch – napr. `http://localhost:3000`)
- Supabase klient žije v `src/lib/supabaseClient.ts`, session spravuje `AuthProvider`.
- `ApolloClient` (`src/lib/apolloClient.ts`) posiela Supabase JWT v hlavičke `Authorization`, takže backend vie uplatniť RLS.
- Emailové flow sú celé v Supabase – potvrdenie registrácie, reset hesla a magic linky. V Supabase Dashboard ➜ Authentication nastav `Site URL` + `Redirect URLs` (napr. `/auth/callback`, `/reset-password/confirm`).
- Routing pre callbacky:
  - `/auth/callback` – spracuje potvrdenie e-mailu po registrácii
  - `/reset-password` – pošle reset email
  - `/reset-password/confirm` – nastaví nové heslo po kliknutí na odkaz
- `UserListPage` už číta dáta z GraphQL a zobrazuje chyby, ak RLS request odmietne.
- `useAuth` hook poskytuje `signIn`, `signOut` a aktuálnu session pre komponenty; komponenty pre registráciu a reset pracujú priamo so Supabase SDK.

# React + TypeScript + Vite + Pato

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
