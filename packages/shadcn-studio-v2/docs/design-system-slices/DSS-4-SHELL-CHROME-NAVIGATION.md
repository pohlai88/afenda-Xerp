# DSS-4 — Shell Chrome and Navigation Ergonomics

## Slice metadata

| Field | Value |
| --- | --- |
| Slice ID | `DSS-4` |
| Name | Shell chrome and navigation ergonomics |
| Primary owner | V2 shell maintainer |
| Claim target | `component-ready` for reusable shell chrome |
| Depends on | `DSS-2`, `DSS-3`, migration-map shell rows |
| Output status | shell components prove AdminCN-grade ergonomics without copied runtime |

## Purpose

Implement enterprise shell behavior using V2-owned layout components: navigation landmarks, active state, collapsible ergonomics, theme affordances, and compact scan order.

This slice borrows AdminCN shell concepts but not AdminCN app runtime.

## In scope

- `components/layout/AppShell.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/Topbar.tsx`
- Approved shell replacements such as `AdmincnShell.tsx` and `AdmincnNav.tsx` when already registered.
- Shared shell helpers such as theme controls.

## Out of scope

- App routing authority.
- Auth/session authority.
- Permission policy.
- ERP module navigation ownership.
- Deep consumer imports.

## Required inputs

- `docs/TAXONOMY.md`
- `docs/MIGRATION-MAP.md`
- `docs/DESIGN-SYSTEM-GUIDELINE.md`
- Current shell component tests.
- One controlled consumer proof target if claiming `consumer-ready`.

## Implementation tasks

1. Confirm shell files live only in approved taxonomy locations.
2. Confirm navigation data is typed and does not import app-only runtime state.
3. Confirm shell landmarks and active route semantics are present.
4. Confirm keyboard traversal and focus visibility through navigation controls.
5. Confirm collapsed and expanded states.
6. Confirm theme toggle behavior does not define new token authority.
7. Confirm public exports match migration-map export intent.

## Evidence required

- Layout/shared test proof.
- Accessibility proof for landmarks, labels, and active state.
- Consumer import proof only when claiming beyond package readiness.
- Rollback note if replacing a legacy shell unit.

## Acceptance gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

For consumer proof, add the selected route-lab or app gates from `../PHASE-R-CONSUMER-CUTOVER-GUIDE.md`.

## Failure modes

- Shell imports app router state directly.
- Nav labels become permission constants.
- Collapsible behavior lacks keyboard support.
- Theme controls mutate token authority.
- Consumer imports shell internals instead of public V2 exports.

## Completion handoff

Record:

- Shell files reviewed:
- Navigation data boundary:
- Accessibility proof:
- Theme behavior proof:
- Export proof:
- Consumer proof if applicable:
- Commands run:
- Claim level reached:
- Remaining blockers:
