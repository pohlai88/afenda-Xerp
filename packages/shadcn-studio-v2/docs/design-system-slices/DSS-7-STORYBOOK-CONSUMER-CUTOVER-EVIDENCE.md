# DSS-7 — Storybook, Consumer Cutover, and Release Evidence

## Slice metadata

| Field | Value |
| --- | --- |
| Slice ID | `DSS-7` |
| Name | Storybook, consumer cutover, and release evidence |
| Primary owner | V2 release owner |
| Claim target | `production-ready` only for the bounded route that proves it |
| Depends on | `DSS-0` through `DSS-6`, `PHASE-R-CONSUMER-CUTOVER-GUIDE.md` |
| Output status | bounded consumer proof and release handoff |

## Purpose

Prove that package-ready design-system work survives a real consumer route with rollback, accessibility, visual/state proof, and import-boundary proof.

This slice is the only design-system slice that can support a production-ready claim, and only for the bounded consumer route it verifies.

## In scope

- Storybook or equivalent visual proof for changed surfaces.
- One real consumer route or bounded route-lab surface.
- Consumer import path verification.
- CSS loading order verification.
- Accessibility and state proof.
- Rollback note.
- Release-owner acceptance record.

## Out of scope

- ERP-wide cutover.
- Legacy package deletion.
- Broad search-and-replace imports.
- New design-system capabilities.
- Retirement claims outside the bounded route.

## Required inputs

- `docs/PHASE-R-CONSUMER-CUTOVER-GUIDE.md`
- `docs/MIGRATION-MAP.md`
- `docs/bridging-r/evidence/README.md` when Bridging-R evidence is involved.
- The bounded consumer route and its tests.
- Package proof from earlier DSS slices.

## Implementation tasks

1. Select exactly one bounded consumer surface.
2. Confirm every consumed V2 surface is publicly exported.
3. Confirm consumer CSS imports use package-exported entrypoints only.
4. Confirm no consumer imports V2 internals.
5. Capture visual/state proof for default, dense/content-heavy, loading, empty, error, disabled, and theme states where applicable.
6. Verify accessibility baseline for the route.
7. Record rollback path.
8. Record release-owner approval before using production-ready language.

## Evidence required

- Package proof: drift, test, typecheck, build, Biome.
- Consumer proof: route renders through public V2 imports.
- Import proof: no deep V2 internals.
- CSS proof: stable import order.
- Visual/state proof.
- Accessibility proof.
- Rollback proof.
- Release-owner approval.

## Acceptance gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

Add the selected consumer gates from `../PHASE-R-CONSUMER-CUTOVER-GUIDE.md`, such as the relevant cutover smoke, e2e, typecheck, and build commands.

## Failure modes

- Claiming production readiness after package proof only.
- Treating route-lab proof as ERP-wide authorization.
- Removing legacy rollback before release-owner acceptance.
- Accepting screenshots without interaction/state proof.
- Importing from V2 internals to make the route work.

## Completion handoff

Record:

- Bounded consumer route:
- Public V2 imports:
- CSS import proof:
- Visual/state proof:
- Accessibility proof:
- Consumer gates:
- Rollback proof:
- Release owner:
- Production-ready scope:
- Remaining blockers:
