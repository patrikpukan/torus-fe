# Design polish — working notes

Living backlog for the frontend design pass. Survives across sessions.

**Workflow:** commit changes as they land, but **do not deploy** automatically.
Deploys are batched — Claude recommends a deploy once a meaningful batch has
accumulated; Erik gives the go-ahead (or says "deploy" directly).

**Deploy command** (when authorized):
```bash
cd torus-fe
export VITE_GRAPHQL_API="https://torus-be.onrender.com/graphql" \
  VITE_GRAPHQL_WS_API="wss://torus-be.onrender.com/graphql" \
  VITE_SUPABASE_URL="https://kxmbesmkijwuutknrlar.supabase.co" \
  VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_xYTomcJlCbw0hOqIok5sQg_8JvuWpWF" \
  VITE_APP_URL="https://torus-fe.netlify.app"
npm run build && netlify deploy --prod --dir dist \
  --site 62c434a0-89ac-4f6f-a637-57c42f26989f --message "<msg>"
git push origin main
```

---

## Done (shipped to prod)

- [x] Dashboard → command-center layout (B): main column + right rail (`HomePage`)
- [x] App-wide card elevation — `.shadow-elevated` / `.shadow-elevated-lg` utilities (`index.css`), base `Card` uses them
- [x] App shell: translucent top bar with section title + org; removed heavy gray wrapper around page content (`BaseLayout`)
- [x] Active-pairing hero polish — ringed avatar, status eyebrow, meta, primary action (`PairingActiveState`)
- [x] Branded auth split layout — `AuthLayout` (brand panel + form); login/register/reset moved to top-level routes; login form polish
- [x] Landing hero — top nav, dual CTAs, gradient overlay, display font (`HeroSection`)
- [x] Reusable `EmptyState` component (icon medallion + title + description + action)
- [x] EmptyState applied: pairings detail, chat detail, departments, achievements (profile + user-profile), organizations list
- [x] Copy fix: removed leftover "Fico's" placeholder in pairings header
- [x] Base `Table` refinement — header band, softer borders/hover (`table.tsx`)

## Committed, NOT yet deployed

- [x] **Heading consistency** — standardized page `h1`/section `h2` titles to `font-heading font-bold` across pages (admin home, maintainer home, users, reports, orgs, profile, calendar, register-org, invite history, achievements, access-denied). Left stat values / avatar initials / `text-lg` subsection labels alone.
- [x] **EmptyState** applied to `DepartmentDistributionChart` (statistics). Ratings panel left as-is (compact inline, medallion would be too heavy).
- [x] **Phase 1 — Landing marketing sections** (verified light, public): Features (numbered primary medallions + display font + hover lift), Benefits (theme tokens instead of hardcoded green, refactored to data array), Pricing (primary-token checks, `shadow-elevated-lg`+ring for popular, display font), CTA (`gradient-primary` card + display font), HowItWorks (display font, consistent step medallions). All headings → display font.

## Roadmap (phased)

Ordered by leverage. Each phase = one or more commits; deploy in batches.

### Phase 1 — Landing marketing sections  ✅ done (committed, not deployed)
- [x] Section headings → `font-heading`
- [x] `FeaturesSection` — numbered medallions, hover lift, display-font titles
- [x] `BenefitsSection` — theme tokens (brand-safe), hover, display font
- [x] `PricingSection` — tokens, `shadow-elevated-lg`+ring popular, display font
- [x] `CTASection` — `gradient-primary`, display font
- [x] `HowItWorksSection` — display font, consistent step medallions
- [ ] (later) Landing footer + smooth-scroll anchors from hero nav

### Phase 2 — Shared primitives & patterns  ✅ done (committed, not deployed)
- [x] `PageHeader` component extracted; 14 pages migrated
- [x] Warning token added (light + dark, index.css + tailwind config)
- [x] Hardcoded colors → semantic tokens: 131 instances across 32 files
      (success/destructive/warning/primary). Left: star-rating gold,
      shadcn toast primitive. Badge variants migrated.
- [x] Buttons/inputs: shadcn primitives already consistent — no changes needed

### Phase 3 — Other-role dashboards  ✅ done (committed, not deployed)
- [x] `MaintainerHomePage` — command-center: org hero + action tiles + stats rail
- [x] `AdminHomePage` — deduped directory cards; shortcuts + stats rail + register-org card

### Phase 4 — Data screens  ✅ done (committed, not deployed)
- [x] Table loading/empty cells: spinner + icon treatment (users, paired, reports)
- [x] Tables themselves already refined at component level (header band, borders)
- [ ] (deferred) Row density/avatars-in-rows — needs admin login to evaluate with data
- [ ] (deferred) Chart categorical palette — intentional "happy" palette; revisit only if brands complain

### Phase 5 — Cross-cutting QA  ✅ done within current access
- [x] Acme brand QA: auth split (teal panel, own copy/logo), landing hero, all token
      surfaces verified live with VITE_BRAND=acme; both brand builds pass
- [x] Dark mode: token-driven by construction post-migration; dashboard/pairings/
      profile/auth verified in earlier rounds
- [x] Mobile: auth collapse verified; landing/hero verified earlier
- [ ] (deferred, needs admin login) dark + responsive on admin tables with data
- [ ] (deferred) `GoogleCalendarSelection` / `TagSelector` inline empties — low value

## Needs a login to verify (blocked on access)

- [ ] Admin tables with data — **Users** (`AdminUserTable`, `PairedUserTable`), **Reports** (`ReportsView`): need an org-admin/super-admin login to screenshot
- [ ] Org-admin pages: department management empty/filled states
- [ ] Dark-mode pass across all new surfaces (verified: dashboard, pairings, profile, auth)
- [ ] Acme brand visual check (auth panel + landing pick up brand config)

## Notes / constraints

- Verifying authed pages needs pointing dev `.env` at the Render backend + a demo login. Creating/elevating production users is gated by the permission classifier — ask Erik before relying on it.
- Claude cannot self-grant standing deploy permissions. To stop deploy prompts, Erik adds to `.claude/settings.local.json` allow list: `Bash(git commit:*)`, `Bash(git push:*)`, `Bash(npm run build:*)`, `Bash(netlify deploy:*)`.
