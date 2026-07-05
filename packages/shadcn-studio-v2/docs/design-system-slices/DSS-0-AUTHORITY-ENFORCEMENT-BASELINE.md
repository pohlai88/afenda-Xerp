# DSS-0 — Authority and Enforcement Baseline

## Slice metadata

| Field | Value |
| --- | --- |
| Slice ID | `DSS-0` |
| Name | Authority and enforcement baseline |
| Primary owner | V2 design-system maintainer |
| Claim target | `package-ready` |
| Depends on | Active `DESIGN-SYSTEM-GUIDELINE.md`, `TAXONOMY.md`, `check:drift` |
| Output status | guideline executable and indexed |

## Purpose

Freeze the design-system rulebook and make sure enforcement exists before more design-system implementation starts.

This slice prevents the most common failure mode: adding more prose while leaving agents free to create new themes, tokens, folders, or imports that the guideline forbids.

## In scope

- Confirm `DESIGN-SYSTEM-GUIDELINE.md` is linked from the docs index.
- Confirm `check:drift` exists and is wired in `package.json`.
- Confirm `TAXONOMY.md`, `MIGRATION-MAP.md`, and `COMPONENT-PRE-MIGRATION.md` reference the drift guard.
- Confirm no new active theme names are introduced.

## Out of scope

- Runtime component edits.
- CSS token changes.
- New theme files.
- Storybook visual proof.
- Consumer app cutover.

## Required inputs

- `docs/DESIGN-SYSTEM-GUIDELINE.md`
- `docs/TAXONOMY.md`
- `docs/MIGRATION-MAP.md`
- `docs/COMPONENT-PRE-MIGRATION.md`
- `package.json`
- `scripts/check-design-system-drift.ts`

## Implementation tasks

1. Verify the guideline states the design-system law.
2. Verify the docs index links the guideline and this slice index.
3. Verify the package exposes `check:drift`.
4. Verify `check:drift` blocks forbidden token names, forbidden theme files, forbidden runtime imports, forbidden consumer V2 internals, restored legacy folders, and hardcoded component/view hex colors.
5. Verify the active CSS names remain exactly `shadcn-default.css`, `swiss-noir.css`, and `verdant-noir.css`.
6. Record any missing enforcement as a blocker before allowing later design-system slices.

## Evidence required

- `package.json` contains `check:drift`.
- `scripts/check-design-system-drift.ts` exists.
- Docs index contains `DESIGN-SYSTEM-GUIDELINE.md` and `design-system-slices/README.md`.
- `TAXONOMY.md`, `MIGRATION-MAP.md`, and `COMPONENT-PRE-MIGRATION.md` reference the drift guard.
- `pnpm --filter @afenda/shadcn-studio-v2 check:drift` passes.

## Acceptance gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm exec biome ci packages/shadcn-studio-v2
```

## Failure modes

- The guideline is edited instead of enforced.
- Drift guard exists but is not wired to a package script.
- A new theme name appears without taxonomy and export proof.
- Docs mention the guard but do not provide the command.

## Completion handoff

Record:

- Guideline link proof:
- Drift guard script proof:
- Package script proof:
- Authority docs synchronized:
- Commands run:
- Violations found:
- Violations fixed:
- Remaining blockers:
