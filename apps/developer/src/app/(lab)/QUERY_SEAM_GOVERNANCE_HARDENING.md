# Query Seam Governance Hardening

## Objective

Harden the route-lab `_queries` seam so `apps/developer` can reserve
route-local read-shaping topology without drifting into fake backend readers,
ORM-like helpers, or speculative BFF behavior.

## Why

The route lab now has:

- active route-policy enforcement for `_actions`
- a governed dynamic module document route
- route-level smoke and governance proof

The remaining high-ROI placeholder seam is `_queries`.

Next.js and ERP production may later justify route-local read-shaping helpers,
but the route lab must not create pseudo-runtime infrastructure before a real
frontend need exists. This slice turns that rule into executable governance.

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
- activating real `_queries`
- activating `_actions`

## Constraints

- Do not introduce runtime authority.
- Do not add query helpers that simulate ERP readers.
- `_queries` stays placeholder-only until a governed route-lab need is
  documented explicitly.
- Any future query activation must be explicit in route metadata, not inferred
  from folder presence.
- Governance must fail when placeholder-only `_queries` gains runtime files.

## Required Deliverables

- one official route-lab query-seam hardening document
- one route-policy field that states `_queries` posture explicitly
- one governance-script hardening that verifies `_queries` contents against
  policy
- one audit evidence update if the executable guard meaningfully changes

## Proposed Implementation

1. Add explicit query-seam metadata to route policy.
2. Mark all current active route-lab surfaces as placeholder-only for
   `_queries`.
3. Extend the governance script so:
   - placeholder-only routes fail if `_queries` contains runtime files
   - only `.gitkeep` is allowed in placeholder-only `_queries`
   - future governed activation would require a matching route-policy change
4. Keep module document route parity with the same placeholder-only query law.

## Verification

- `.\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit`
- `.\node_modules\.bin\biome ci apps\developer`
- `node apps\developer\scripts\check-route-lab-governance.mjs`
- `apps\developer\node_modules\.bin\playwright test --config apps\developer\playwright.config.mts --project=chromium-smoke`

## Done Means

- route policy states the `_queries` posture explicitly
- governance fails when a placeholder-only `_queries` folder gains runtime files
- current active routes still pass app-local verification
- the audit reflects the stronger executable protection

## Related Docs

- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/ACTION_SEAM_GOVERNANCE_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
