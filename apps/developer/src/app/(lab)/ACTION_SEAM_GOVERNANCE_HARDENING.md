# Action Seam Governance Hardening

## Objective

Harden the route-lab `_actions` seam so `apps/developer` can reserve
Next.js Server Action topology without accidentally turning placeholder
directories into unauthorized mutation runtime.

## Why

The route lab now proves:

- thin async route pages
- route-local component composition
- boundary-state semantics
- a canonical dynamic module document route

The highest-ROI next step is to protect the remaining `_actions` placeholder
surface before it drifts.

Next.js App Router supports Server Actions, and ERP production may later need
route-local mutation seams. But the route lab must not grow fake mutation
infrastructure or speculative server actions just because the folder exists.

This slice turns that rule into executable governance.

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
- activating real Server Actions
- activating `_queries`

## Constraints

- Do not introduce runtime authority.
- Do not add mock mutation flows.
- `_actions` folders remain reserved until a documented route-lab need exists.
- Any future action activation must be explicit in route metadata, not inferred
  from filesystem presence.
- Route-lab governance must fail fast when `_actions` contains runtime files
  without an explicit policy allowance.

## Required Deliverables

- one official route-lab action-seam hardening document
- one route-policy field that makes `_actions` status explicit
- one governance-script hardening that verifies `_actions` contents against
  policy
- one audit evidence update if the executable guard meaningfully changes

## Proposed Implementation

1. Add explicit action-seam metadata to route policy.
2. Mark all current active route-lab surfaces as placeholder-only.
3. Extend the governance script so:
   - placeholder-only routes fail if `_actions` contains runtime files
   - only `.gitkeep` is allowed in placeholder-only `_actions`
   - future governed activation would require a matching route-policy change
4. Keep module document route parity with the same placeholder-only action law.

## Verification

- `.\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit`
- `.\node_modules\.bin\biome ci apps\developer`
- `node apps\developer\scripts\check-route-lab-governance.mjs`
- `apps\developer\node_modules\.bin\playwright test --config apps\developer\playwright.config.mts --project=chromium-smoke`

## Done Means

- route policy states the `_actions` posture explicitly
- governance fails when a placeholder-only `_actions` folder gains runtime files
- current active routes still pass app-local verification
- the audit reflects the stronger executable protection

## Related Docs

- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/MODULE_DOCUMENT_ROUTE_SLICE.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
