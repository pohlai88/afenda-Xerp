# Slice 3B Implementation Detail — Primitive Extension

## 1) Slice identity

- Slice ID: `Slice 3B`
- Slice name: `Primitive extension`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 3A verification`
- Actual completion date: `Not completed`
- Current status: `not-started`

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

## 6) Test and verification commands

- `pnpm quality:exports`
- `pnpm quality:boundaries`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm quality:boundaries` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-3B-PRIMITIVE-EXTENSION-IMPLEMENTATION.md` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| `Table` pulls in data/view behavior instead of remaining primitive | Medium / High | Review props and examples for presentation-only behavior before promotion | V2 migration squad | Active |
| `Field` creates form workflow coupling | Medium / Medium | Restrict to accessible field structure and avoid domain validation behavior | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: Slice 3A export and quarantine rules are still authoritative.
- Decision needed before verification: confirm whether `Table` requires separate accessibility evidence.

## 9) Exit checklist

- Required before verification: `Alert`, `Field`, `Table` are implemented in V2 primitive lane.
- Required before verification: 3A boundary constraints preserved.
- Required before verification: quarantine hygiene and promotion rationale documented.
