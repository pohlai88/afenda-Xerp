# Module Surface Registry Hardening

## Objective

Create one explicit route-lab surface registry so active route families are
declared once and consumed consistently by route policy, navigation, smoke
coverage, and governance checks.

## Why

The route lab now has:

- normalized route policy
- explicit `_actions` and `_queries` seam governance
- a canonical dynamic module document route
- deterministic smoke verification

The next highest-ROI gap is metadata drift.

Today, active route information is repeated across:

- `route-policy.ts`
- `nav-config.ts`
- `route-lab-smoke.spec.ts`

That duplication is manageable while the route set is small, but it is the
wrong steady state for a governed route lab. A module-family route should have
one registry declaration, then every other layer should derive from it or be
checked against it.

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
- fake backend infrastructure
- activating `_actions` or `_queries`

## Constraints

- Do not introduce runtime authority.
- The registry is frontend-governance metadata only, not a runtime manifest.
- Route metadata must remain promotion-ready and route-family aware.
- Navigation, smoke coverage, and policy must not drift from the registry.
- The dynamic module document route must be represented in the same registry as
  static operator routes.

## Required Deliverables

- one official module surface registry hardening document
- one route-lab surface registry source of truth
- route policy derived from or aligned to that registry
- navigation derived from or aligned to that registry
- smoke coverage derived from or aligned to that registry
- governance checks that fail on registry drift
- audit evidence update if the executable guard meaningfully changes

## Proposed Implementation

1. Add a route-lab surface registry under `src/lib/lab/`.
2. Include, per active route family:
   - route identity
   - concrete `href`
   - route contract path
   - rendering and seam policy
   - nav grouping
   - smoke heading and acceptance marker
3. Refactor `route-policy.ts`, `nav-config.ts`, and route smoke coverage to
   consume registry-backed metadata.
4. Extend governance checks so registry drift fails when:
   - a policy row is missing from the registry
   - a nav item is missing for a registered navigable route
   - smoke expectations do not cover registered routable surfaces

## Verification

- `.\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit`
- `.\node_modules\.bin\biome ci apps\developer`
- `node apps\developer\scripts\check-route-lab-governance.mjs`
- `apps\developer\node_modules\.bin\playwright test --config apps\developer\playwright.config.mts --project=chromium-smoke`

## Done Means

- active route families are declared in one route-lab registry
- route policy, navigation, and smoke coverage align to that registry
- governance fails when the registry drifts from those surfaces
- app-local verification passes
- the audit reflects the stronger registry-backed control

## Related Docs

- `apps/developer/src/app/(lab)/MODULE_DOCUMENT_ROUTE_SLICE.md`
- `apps/developer/src/app/(lab)/ACTION_SEAM_GOVERNANCE_HARDENING.md`
- `apps/developer/src/app/(lab)/QUERY_SEAM_GOVERNANCE_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
