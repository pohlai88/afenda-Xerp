# Slice 3B Implementation Detail — Primitive Extension

## 1) Slice identity

- Slice ID: `Slice 3B`
- Slice name: `Primitive extension`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists
- Expand primitive set with accessibility and composition complexity while preserving lane discipline.

### Slice-level acceptance criteria
- `Alert`, `Field`, `Table` added under `components/ui/`.
- Slice gate discipline mirrors 3A (no API confusion across boundaries).

## 3) Scope boundaries

### In scope
- primitive additions only
- shared support assets required by primitives only

### Out of scope
- layout primitives
- composed views
- migration map execution

### Anti-goals
- Do not collapse primitive boundaries by moving view/layout behavior into these components.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 3A`
- Dependencies:
  - 3A verified with no boundary violations
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate B: naming`
  - `Gate D: export boundary`
  - `Gate E: typecheck and config resolution`

## 5) Implementation plan

### Structure changes
- Translate `Alert`, `Field`, `Table` into the existing primitive architecture.
- Keep any unstable implementation in quarantine first.
- Promote only after explicit review and passing checks.
- Serialize primitive slot ownership with stable `data-slot` markers.
- Keep `Field` and `Table` presentational only.

## 6) Test and verification commands

- `pnpm quality:exports`
- `pnpm quality:boundaries`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: 6 files / 27 tests | `packages/shadcn-studio-v2/src/__tests__/primitive-extension.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS | `packages/shadcn-studio-v2/package.json` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS: 30 files checked | `packages/shadcn-studio-v2` |
| `pnpm check:documentation-drift` | PASS | `scripts/governance/check-documentation-drift.mts` |
| `pnpm quality:exports` | PASS: 23 packages checked | `scripts/quality/check-public-exports.mjs` |
| `pnpm quality:boundaries` | PASS: 24 workspaces checked | `scripts/quality/check-package-boundaries.mjs` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| `Table` pulls in data/view behavior instead of remaining primitive | Medium / High | Review props and examples for presentation-only behavior before promotion | V2 migration squad | Active |
| `Field` creates form workflow coupling | Medium / Medium | Restrict to accessible field structure and avoid domain validation behavior | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: Slice 3A export and quarantine rules are still authoritative.
- Decision needed before verification: confirm whether `Table` requires separate accessibility evidence.
- Decision: `Field` starts as an accessible structural wrapper only; it does not own validation workflow or domain rules.
- Decision: `Table` starts as a presentational table primitive only; it does not own fetching, sorting, pagination, or selection state.

## 9) Entry readiness review

- Slice 3A handoff: `PASS`
- Entry decision: `READY FOR IMPLEMENTATION`
- Required implementation set:
  - `components/ui/Alert.tsx`
  - `components/ui/Field.tsx`
  - `components/ui/Table.tsx`
- Required support:
  - Primitive extension governance tests.
  - Taxonomy snapshot update.
  - Explicit public exports.
  - No quarantine exports.
  - No page, route, database, permission, entitlement, or metadata logic.

## 10) Exit checklist

- Implemented: `Alert`, `Field`, `Table` are in the V2 primitive lane.
- Implemented: 3A boundary constraints are preserved.
- Implemented: quarantine is not referenced by public exports.
- Verified: scoped package tests, typecheck, build, and Biome CI pass.
- Verified: documentation drift, public export, and package boundary gates pass.

## 11) Implementation summary

- Added `Alert`, `AlertTitle`, and `AlertDescription`.
- Added `Field`, `FieldLabel`, `FieldControl`, `FieldDescription`, and `FieldMessage`.
- Added `TableContainer`, `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, and `TableCaption`.
- Exported Slice 3B primitives through neutral and client public surfaces only.
- Kept server public surface free of React primitive exports.
- Added primitive extension governance tests for lane placement, token usage, slot serialization, and server export isolation.

## 12) Handoff summary

- Completion recommendation: `Go for Slice 4 development kickoff`
- Blocker: `None`
- Next slice dependency to start: `Slice 4`

## 13) Post-implementation Stabilization Review

- Review result: `PASS`
- Default informational alerts use the polite `status` role unless a caller supplies an explicit role.
- Destructive alerts default to the urgent `alert` role.
- Invalid field messages default to the urgent `alert` role without owning validation workflow logic.
- `FieldLabel` keeps `requiredIndicator` as a string-only API to avoid unnecessary public React node typing.
- `TableHead` defaults `scope` to `col` for baseline table accessibility.
- Slice 3B primitives remain presentational and do not own runtime state hooks.
- Slice 4 is unblocked for development kickoff.

## 14) Slice 4 Preparation Note

- Slice 4 may consume Slice 3A/3B primitives as stable inputs after verification.
- Slice 4 must not redefine primitive behavior for button, card, badge, alert, field, or table.
- Slice 4 implementation should start with reusable layout chrome and shared runtime-adjacent parts only.
- Slice 4 should add layout/shared governance tests before expanding exports.
