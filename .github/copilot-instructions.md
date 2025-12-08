# Copilot Project Instructions

## Stack Overview

- React 19 with Vite and TypeScript; prefer modern React patterns (hooks, suspense ready components) and keep components as server agnostic as possible.
- shadcn with Emotion; rely on the design system components, the sx prop, and theme overrides instead of ad hoc CSS.
- React Router 7; use nested routes with layout components and `Outlet`, and favor `NavLink` for navigation elements that need active styling.
- TanStack Query 5 for data fetching, caching, and background refetching; colocate query hooks with the feature that consumes the data.
- Schedule-X calendar utilities and React Table are available for scheduling and tabular displays; keep adapters in feature folders.
- Temporal polyfill is installed; use Temporal APIs for new date and time logic rather than Date.

## Coding Patterns

- Author functional components; define `Props` types right above the component and export components as the default unless multiple exports are required.
- Keep files focused: components in `src/features/*`, route-level views in `src/pages/*`, and shared layout or config in `src/app/*`.
- Use named folders with index barrels sparingly; prefer explicit imports to help tree shaking and readability.
- Write TypeScript types for API models and reuse them in TanStack Query hooks, form state, and UI props to avoid `any`.
- Prefer `const` and immutability; derive view state from query data and URL params rather than manual stores when practical.

## Styling And Theming

- Wrap new layout trees in shadcn primitives (Box, Stack, Container, Grid) and compose with the sx prop.
- Keep spacing and sizing aligned to the theme spacing scale; avoid hard coded pixel values unless necessary.
- Favor variant driven typography (`Typography` component) and keep colors within theme palette keys.
- When custom styling is complex, extract an Emotion styled component but keep theme awareness via the callback API.

## Data Fetching With TanStack Query

- Instantiate feature hooks with `useQuery` and `useMutation`; declare query keys in a local `queryKeys` map to avoid collisions.
- Wrap `App` in a `QueryClientProvider` when initializing new data flows; configure sensible defaults (retry count, stale time, refetch on window focus) in one place.
- Use `select` to derive lightweight view models inside `useQuery` to keep components simple.
- Prefer `async` functions that call a typed API client; throw domain errors so TanStack Query can surface them via `error` and `onError` handlers.
- Example pattern:

```tsx
const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => api.profile.get(userId),
    staleTime: 5 * 60 * 1000,
  });
};
```

## Routing

- Keep route registration inside `src/app/App.tsx` or a dedicated router file; group related children under layout routes to share headers and shells.
- Use loader like hooks or TanStack Query prefetching to ensure data exists before rendering detail routes.
- Favor relative links inside nested routes (`to="."`, `to=".."`) to keep navigation resilient to path changes.

## Forms And User Input

- Build forms with shadcn inputs (TextField, Select, DatePicker) and align labels with their inputs using htmlFor
- Adopt react-hook-form with TanStack Query mutations when adding complex forms; integrate via Controller for shadcn compatibility.
- Include inline validation messaging and disable submit buttons while pending to reflect mutation state.

## Dates And Scheduling

- Use the Temporal polyfill for calculations, conversions, and formatting; wrap legacy Date interactions in helpers that return Temporal objects.
- When integrating Schedule-X calendars, isolate configuration objects (views, event adapters, localization) inside the feature folder and keep them typed.

## Testing And Quality

- Add unit and integration tests with Vitest and React Testing Library (install when needed); colocate tests beside the component with `.test.tsx` suffix.
- Mock network requests via MSW for deterministic TanStack Query tests.
- Run `npm run lint` before committing; keep JSX accessible and follow hook rules to satisfy the lint configuration.

## Accessibility And UX

- Ensure interactive elements expose aria attributes or semantic HTML equivalents; shadcn components should receive the correct role automatically when used as intended.
- Maintain keyboard navigation support by respecting focus order and using `Button`, `Link`, and form components appropriately.
- Provide loading and empty states for all query backed views and handle error surfaces with inline alerts or snackbars.

## Documentation Expectations

- Document non obvious utilities with short JSDoc comments; for components, annotate props when behavior is complex.
- Update `README.md` or feature level docs when adding new flows, especially those that affect routing, API contracts, or environment variables.

## GraphQL Type Generation

- On the frontend (`./torus-fe`), we run `npm run regenerate` to generate GraphQL types from the backend (`./torus-be`) using the shared GraphQL configuration.
- Keep types up to date by re-running this command whenever the backend schema changes.
