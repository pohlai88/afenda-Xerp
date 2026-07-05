# Boundary State Hardening

## Objective

Harden `apps/developer` route-boundary states so `loading.tsx` and
route-lab error surfaces follow stable, accessible Next.js App Router
best practice instead of relying on anonymous skeleton blocks.

## Why

The route lab already proves thin async pages, route-local composition,
governance enforcement, and runtime route acceptance. The next highest-ROI
hardening step is boundary semantics.

Right now, the active operator routes have `loading.tsx`, but those loading
states are visually present without strong route-owned meaning. That weakens
the purpose of the route lab: if a route exists to prove best practice, then
its loading and recovery boundaries should also demonstrate the pattern.

## Allowed Scope

- `apps/developer/**`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

## Out of Scope

- `apps/erp/**`
- `apps/developer/src/app/api/**`
- auth
- tenant runtime
- database
- kernel imports
- mock backend infrastructure
- placeholder activation under `_actions`, `_queries`, or `modules/**`

## Constraints

- Do not introduce runtime authority.
- Do not add new routes.
- Keep `page.tsx` thin and server-first.
- Route-boundary hardening must remain frontend-only and route-law aligned.
- Shared boundary helpers may live only where the route lab already owns
  segment-level composition, such as `app/(lab)/_components/`.
- Loading states should expose stable route-owned meaning, not business data.
- Error surfaces must remain client-safe and must not import
  `@afenda/shadcn-studio` barrel exports.

## Required Deliverables

- one official route-lab hardening document for boundary states
- one shared route-lab boundary helper or equivalent implementation if it
  improves consistency
- improved `loading.tsx` surfaces for active operator routes
- improved route-lab error semantics if the current recovery surfaces are too
  weak
- audit evidence update only if the best-practice status meaningfully changes

## Proposed Implementation

Focus on the active operator surfaces only:

- `/dashboard/sales`
- `/dashboard/finance`
- `/admin/users`
- `/settings/appearance`

Expected hardening:

1. `loading.tsx` exposes a stable heading or label that identifies the route
   surface being composed
2. loading boundaries expose accessible status semantics such as
   `role="status"`, `aria-live`, or equivalent route-level meaning
3. skeleton layout remains route-shaped, not generic
4. route-lab error boundaries keep stable recovery text and route-lab doctrine
   tone
5. internal recovery navigation uses Next.js-safe frontend navigation patterns
   where appropriate

## Verification

- `.\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit`
- `.\node_modules\.bin\biome ci apps\developer`
- `node apps\developer\scripts\check-route-lab-governance.mjs`
- `apps\developer\node_modules\.bin\playwright test --config apps\developer\playwright.config.mts --project=chromium-smoke`

## Done Means

- each active operator `loading.tsx` exposes stable route-owned loading meaning
- route-lab error surfaces remain client-safe and have clear recovery actions
- no runtime authority or placeholder drift is introduced
- app-local verification passes
- the audit is updated if the boundary-state evidence materially changes

## Related Docs

- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `apps/developer/src/app/(lab)/GOVERNANCE_GUARD_HARDENING.md`
- `apps/developer/src/app/(lab)/ROUTE_ACCEPTANCE_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
