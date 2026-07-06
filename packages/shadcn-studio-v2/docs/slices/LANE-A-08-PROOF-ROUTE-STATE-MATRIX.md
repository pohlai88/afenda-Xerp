# Lane A-08 — Proof Route State Matrix

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers expanding developer proof coverage
- Authority: `PHASE-8-VERIFICATION-APP-AND-PROOF-ROUTE.md`, Lane A index
- Action enabled: Prove non-ready states and auth on v2-proof

## Overview

Expand `/design-system/v2-proof` from happy-path fixtures to a **state matrix**
that exercises loading, empty, error, and unavailable presentation for key surfaces.

## Problem

Happy-path proof hides state-regression bugs in composed views and widgets.

## Goals

- Add non-ready state fixtures for at least: `PageSurface`, `MetricWidget`, `EvidenceWidget`, `DataTableSurface`, `FormSurface`, `AuthShell` (after A-03).
- Proof test asserts `data-state` or role markers for one non-ready case per surface family.
- Keep route import-boundary clean.

## Non-goals

- Interactive drag/resize board demo.
- ERP routes.

## Constraints

- Static fixtures only; no fetch.
- Use slot constants from neutral export where tests reference slots.

## Proposed design

### UI approach

Option A (preferred): collapsible sections per surface with tab or subheading for states.

Extend `apps/developer/src/lib/v2-proof/surface-visibility.ts` (Lane A-03) with
additional surface keys rather than ad hoc toggles per section.

Option B: dedicated `/design-system/v2-proof/states` sub-route (only if main route becomes unreadable).

### Minimum matrix

| Surface | States to prove |
| --- | --- |
| Page | loading, error |
| Metric widget | empty, unavailable |
| Evidence widget | loading, error |
| Data table | empty |
| Form | unavailable |
| Auth shell | loading (after A-03) |

## Interfaces / dependencies

- Depends on A-03 for auth section.
- Uses `@afenda/shadcn-studio-v2` public exports only.

## Risks and mitigations

- Risk: proof route becomes unmaintainable.
  - Mitigation: fixtures in `fixtures.ts`; one test file.

## Rollout and rollback

1. Extend fixtures.
2. Update client route component.
3. Extend `v2-proof-route.test.tsx`.
4. Run `verify:v2-proof`.

Rollback: revert to happy-path only.

## Required gates

```bash
pnpm --filter @afenda/developer verify:v2-proof
pnpm --filter @afenda/shadcn-studio-v2 test
```

## Done definition

- [x] State matrix documented in proof route UI or fixtures file header.
- [x] Tests assert at least six non-ready markers (`v2-proof-route.state-matrix.test.tsx` — nine markers).
- [x] Import boundary test still passes.

## Evidence

- `apps/developer/src/lib/v2-proof/fixtures.ts` — matrix table header + static fixture copy
- `apps/developer/src/app/design-system/v2-proof/_components/v2-proof-state-matrix.client.tsx`
- `apps/developer/src/app/design-system/v2-proof/__tests__/v2-proof-route.state-matrix.test.tsx`

## Decision

Always-on state matrix section on the main proof route (Option A subheadings); auth loading proved separately from optional auth preview toggle.
