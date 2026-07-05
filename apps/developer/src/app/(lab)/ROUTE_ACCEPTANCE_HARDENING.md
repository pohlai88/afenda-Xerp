# Route Acceptance Hardening

## Overview

This document is the official implementation brief for the next route-lab best
practice after Governance Guard Hardening.

This is not a new route surface. It is an acceptance-hardening slice for the
existing route-lab routes.

Controlling doctrine:

```text
apps/developer proves ERP frontend shape.
apps/erp owns ERP runtime authority.
Promotion replaces data authority, not route composition.
```

## Problem

The current route lab already has:

- normalized route composition
- governance guards for route-law regressions
- smoke coverage proving route availability

That is strong, but still incomplete as acceptance evidence.

Current smoke checks prove that routes render. They do not yet strongly prove
that each route exposes stable route-level acceptance landmarks, shell
composition, and loading-boundary expectations in a way that resists accidental
UI drift.

## Goals

- strengthen route-lab runtime verification from basic availability to stable
  route acceptance proof
- verify route-level operator surfaces through stable landmarks or text owned by
  the route shell
- keep acceptance checks focused on composition and presence, not business logic
- preserve frontend-only route-lab boundaries while improving confidence in the
  rendered surfaces

## Non-Goals

- adding new routes
- introducing auth, tenant context, database access, or ERP runtime authority
- testing business calculations or ERP domain behavior
- adding mock APIs, service clients, or fake backend infrastructure
- turning smoke tests into end-to-end workflow tests
- activating `_actions`, `_queries`, or module placeholders

## Constraints

- Changes must stay within `apps/developer/**` plus the route-lab audit only if
  evidence changes.
- Tests must remain route-level and frontend-only.
- Stable route proof should use page-level landmarks, headings, or route-owned
  text rather than brittle implementation details.
- Verification must work with the existing app-local Next boot convention for
  port `3002`.
- Acceptance hardening must not require ERP runtime, BFF routes, or seeded
  business state.

## Proposed Design

Slice 3 will strengthen the existing route smoke coverage into route acceptance
hardening.

Primary targets:

- `apps/developer/src/app/__tests__/route-lab-smoke.spec.ts`
- `apps/developer/playwright.config.mts` only if the current project structure
  needs minor adjustment
- route files only if a route lacks a stable acceptance marker and needs a small
  route-owned landmark or heading refinement

Acceptance expectations to prove:

1. `/` exposes the route-lab shell doctrine clearly
2. `/dashboard/sales` proves the canonical operator route
3. `/dashboard/finance` proves the same pattern on a second dashboard route
4. `/admin/users` proves the operator-list route shape
5. `/settings/appearance` proves the operator-settings route shape

Preferred evidence types:

- page heading
- route title text
- stable route-owned section label
- route-level shell text

Avoid:

- brittle class selectors
- implementation-only DOM structure checks
- data-value assertions that pretend to be business acceptance

## Interfaces and Dependencies

Allowed touchpoints:

- `apps/developer/src/app/__tests__/route-lab-smoke.spec.ts`
- `apps/developer/playwright.config.mts` only if needed
- route files under `apps/developer/src/app/**` only if a small stable
  acceptance marker is required
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md` only if the evidence
  surface changes materially

Source-of-truth docs:

- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `apps/developer/src/app/(lab)/GOVERNANCE_GUARD_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

## Risks and Mitigations

Risk:

- route acceptance checks become brittle and fail on harmless UI refactors

Mitigation:

- assert stable headings, landmarks, and route-owned text instead of low-level
  DOM structure

Risk:

- the test scope drifts into business logic or ERP behavior

Mitigation:

- keep assertions limited to route composition, presence, and operator-surface
  identity

Risk:

- Playwright setup drifts into runtime orchestration complexity

Mitigation:

- preserve the current direct app-local Next boot convention and avoid adding
  extra services

## Rollout and Rollback

### Rollout

1. inspect current smoke spec and route text/landmarks
2. strengthen route assertions to stable acceptance-level proof
3. add or refine route-owned markers only when necessary
4. run the app-local verification set
5. update the audit only if the evidence surface changes materially

### Rollback

If acceptance checks become flaky or too brittle:

1. remove the brittle assertion
2. preserve stable route-level proof already working
3. re-run app-local verification

Rollback does not authorize weakening route-law governance or expanding runtime
authority.

## Verification

Required verification:

- `.\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit`
- `.\node_modules\.bin\biome ci apps\developer`
- `node apps\developer\scripts\check-route-lab-governance.mjs`
- route acceptance test run against the app-local developer server on port
  `3002`

## Done Means

Slice 3 is complete only when:

- the route acceptance test proves `/`, `/dashboard/sales`,
  `/dashboard/finance`, `/admin/users`, and `/settings/appearance`
- each route has stable route-level proof through headings, landmarks, or
  route-owned text
- the acceptance checks remain frontend-only and do not depend on backend
  simulation
- governance checks and app-local quality gates still pass
- the audit is updated if the verification evidence meaningfully changed

## Open Questions

- whether any current route needs a small route-owned landmark refinement before
  acceptance checks can be made stable

## Related Docs

- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `apps/developer/src/app/(lab)/GOVERNANCE_GUARD_HARDENING.md`
- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
