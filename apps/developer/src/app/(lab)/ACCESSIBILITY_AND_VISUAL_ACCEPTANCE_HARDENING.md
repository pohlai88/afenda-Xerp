# Accessibility and Visual Acceptance Hardening

## Status

This hardening slice is implemented.

## Objective

Strengthen `@afenda/developer` route-lab proof so every governed route surface
has executable accessibility and visual layout acceptance checks.

## Why

The route lab currently proves route law, metadata, image/font usage, loading
and error boundaries, root unmatched-route handling, and green-light execution.
The intentionally deferred runtime capabilities remain inactive by doctrine.

The highest remaining risk is presentation drift:

- a route can still render while losing a usable landmark structure
- links and controls can lose accessible names
- images can lose alt text
- responsive layouts can develop horizontal overflow
- keyboard focus can become unreachable or invisible

This slice keeps the route lab aligned with ERP frontend quality without
introducing runtime authority.

## Allowed Scope

- `apps/developer/src/app/__tests__/route-lab-smoke.spec.ts`
- `apps/developer/src/app/(lab)/ACCESSIBILITY_AND_VISUAL_ACCEPTANCE_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

## Out of Scope

- `apps/developer/src/app/api/**`
- live Route Handlers
- live Server Actions
- `cacheComponents` or shared operator-route cache strategy
- middleware or request-policy runtime surfaces
- auth
- tenant runtime
- database
- kernel imports
- ERP runtime imports
- `_actions` or `_queries` activation

## Constraints

- Keep the proof frontend-only.
- Do not add a new test framework.
- Prefer existing Playwright route-lab smoke coverage.
- Use stable semantic checks before screenshot baselines.
- Keep assertions focused on route usability and layout integrity, not ERP
  business behavior.

## Required Deliverables

- route-level accessibility acceptance coverage for all governed route-lab
  routes
- responsive visual-layout acceptance coverage for desktop and mobile viewports
- audit update recording the new proof surface
- green-light verification passing after the new assertions are added

## Verification

- `node apps/developer/scripts/check-route-lab-governance.mjs`
- `node scripts/governance/check-developer-route-lab-greenlight.mjs`

## Done Means

- each governed route has at least one visible `main` landmark
- each governed route has exactly one visible level-one heading
- route links and buttons expose accessible names
- route images provide explicit `alt` attributes
- keyboard tabbing reaches a visible focus target
- desktop and mobile route layouts do not create horizontal document overflow
- the route-lab green-light command still passes

## Completion Evidence

The implemented proof now exists in:

- `apps/developer/src/app/__tests__/route-lab-smoke.spec.ts`
- `packages/shadcn-studio/src/components-layouts/menu-trigger.tsx`
- `apps/developer/src/app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/page.tsx`
- `apps/developer/src/app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/_components/module-document-proof-panel.tsx`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

The slice found and closed two concrete issues:

- the shared shell sidebar trigger lacked an accessible name in the built app
- the module document route allowed long route strings to overflow on mobile

## Related Docs

- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `apps/developer/src/app/(lab)/ROOT_METADATA_AND_NOT_FOUND_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
