# Module Document Route Slice

## Objective

Activate one canonical module/surface/document route in `apps/developer` so the
route lab proves dynamic App Router document composition without introducing
ERP runtime authority.

## Why

The current route lab already proves static operator surfaces. The remaining
major reserved shape is the dynamic module family under:

```text
app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/**
```

If that family stays placeholder-only, the route lab still lacks proof for the
dynamic document-route pattern that ERP modules will eventually need.

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
- Do not simulate backend clients or service layers.
- The dynamic route must stay a thin async page boundary.
- The route must await one loader and pass typed serializable props downward.
- Dynamic path support must be formalized in route policy and governance
  checks, not hidden as a one-off exception.
- Module-level `_actions` and `_queries` stay sterile placeholders.

## Required Deliverables

- one official module-route slice document
- one canonical dynamic document route under
  `app/(lab)/modules/[moduleSlug]/[surface]/[documentId]`
- one typed loader and page-data contract for that route
- route policy and route-lab navigation updates if the route becomes active
- smoke coverage and audit evidence updates if the active route surface changes

## Proposed Route

Canonical proving route:

```text
/modules/procurement/requisition/REQ-1001
```

Filesystem route boundary:

```text
app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/page.tsx
```

This route should prove:

1. dynamic param resolution at the route boundary
2. a single typed loader with route params
3. route-local document panels under `[documentId]/_components/`
4. stable loading and acceptance markers
5. promotion notes that point to future ERP document authority

## Verification

- `.\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit`
- `.\node_modules\.bin\biome ci apps\developer`
- `node apps\developer\scripts\check-route-lab-governance.mjs`
- `apps\developer\node_modules\.bin\playwright test --config apps\developer\playwright.config.mts --project=chromium-smoke`

## Done Means

- the canonical module document route renders through the route-lab shell
- route policy and governance checks understand the dynamic route family
- smoke coverage proves the new active route without backend dependency
- the audit reflects that the module document family is no longer placeholder-only

## Related Docs

- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/BOUNDARY_STATE_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
