# Governance Guard Hardening

## Overview

This document is the official implementation brief for the next route-lab best
practice after Slice 1.

This is not a new route surface. It is a governance-hardening slice.

Controlling doctrine:

```text
apps/developer proves ERP frontend shape.
apps/erp owns ERP runtime authority.
Promotion replaces data authority, not route composition.
```

## Problem

Slice 1 already completed the applicable route-lab best-practice baseline, but
some of the strongest rules still rely on audit interpretation and manual
review.

That is not the highest-quality steady state.

The current route lab needs stronger executable protection against regression
 in these areas:

- client-only drift in `page.tsx` or `layout.tsx`
- accidental reintroduction of `generateStaticParams` under lab routes
- accidental loss of `(lab)` request-dynamic rendering law

## Goals

- turn the strongest route-law rules into executable governance checks
- keep the current Slice 1 baseline true over time
- reduce reliance on manual architecture review for obvious drift
- preserve the current route-lab boundary without adding runtime authority

## Non-Goals

- adding new routes
- adding `app/api/**`
- activating `_actions` or `_queries`
- introducing auth, tenant context, database access, or ERP runtime imports
- expanding the module placeholder tree
- redesigning already-correct route files

## Constraints

- Changes must stay within `apps/developer/**` plus the route-lab audit if evidence changes.
- The route lab must remain frontend-only.
- Existing route-law terminology must stay aligned with the audit.
- Stable route files should not be rewritten unless a tiny compliance fix is required.
- Any verification must remain app-local and not depend on ERP runtime authority.

## Proposed Design

This slice will harden the existing route-lab governance checker.

Primary target:

- `apps/developer/scripts/check-route-lab-governance.mjs`

Required checks to add or strengthen:

1. fail if any `page.tsx` or `layout.tsx` under `apps/developer/src/app` contains `"use client"`
2. fail if `generateStaticParams` appears anywhere under `apps/developer/src/app/(lab)/**`
3. fail if `apps/developer/src/app/(lab)/layout.tsx` no longer exports `dynamic = "force-dynamic"`

Documentation update rule:

- if the script’s effective enforcement surface changes, update `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md` so the audit remains evidence-true

## Interfaces and Dependencies

Allowed touchpoints:

- `apps/developer/scripts/check-route-lab-governance.mjs`
- `apps/developer/package.json` only if script wiring needs adjustment
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md` only if governance evidence changes

Source-of-truth docs:

- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

## Risks and Mitigations

Risk:

- the checker becomes too loose and fails to catch real drift

Mitigation:

- encode direct file-pattern checks for the exact route-law invariants

Risk:

- the checker becomes noisy and flags allowed placeholder structure

Mitigation:

- scope new checks only to `page.tsx`, `layout.tsx`, and `(lab)` rendering law

Risk:

- audit language drifts away from executable verification

Mitigation:

- update the audit only when the checker meaningfully changes what is enforced

## Rollout and Rollback

### Rollout

1. update the governance script
2. run app-local verification
3. update the audit if evidence changed
4. confirm the route-lab baseline still reports no open gaps

### Rollback

If the checker introduces false positives:

1. revert the problematic rule addition
2. preserve already-correct guard logic
3. re-run the app-local verification set

Rollback does not authorize weakening established route-lab doctrine. It only
removes incorrect checker behavior.

## Verification

Required verification:

- `.\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit`
- `.\node_modules\.bin\biome ci apps\developer`
- `node apps\developer\scripts\check-route-lab-governance.mjs`

## Done Means

This hardening slice is complete only when:

- the governance check fails on `"use client"` in any `page.tsx` or `layout.tsx`
- the governance check fails when `generateStaticParams` exists under `app/(lab)/**`
- the governance check fails when `(lab)/layout.tsx` loses `dynamic = "force-dynamic"`
- the audit reflects the stronger executable guard if the enforcement surface changed

## Open Questions

- none at the route-law level; this is a hardening slice, not a design-discovery slice

## Related Docs

- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `apps/developer/src/app/(lab)/ROUTE_ACCEPTANCE_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
