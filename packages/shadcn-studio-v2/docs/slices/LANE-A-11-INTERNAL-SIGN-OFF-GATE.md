# Lane A-11 — Internal Sign-Off Gate

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Tech lead / engineer authorizing Lane B planning
- Authority: `../MIGRATION-MAP.md`, Lane A index
- Action enabled: Record Lane A complete and unlock Lane B **planning** (not execution)

## Overview

Final acceptance gate for V2 internal stabilization. Re-runs Phase 9-style evidence
and records explicit `PROCEED` / `HOLD` / `REJECT` for Lane B entry.

## Problem

Lane B work (v1 cutover, ERP migration) must not start without a deliberate
sign-off that Lane A DoD is met.

## Goals

- Run full package gate matrix.
- Run `verify:v2-proof` and developer build.
- Publish completion report with remaining gaps.
- Update `MIGRATION-MAP.md` with Lane A sign-off date and Lane B status `approved-for-planning` or `HOLD`.

## Non-goals

- Executing Lane B migration in this slice.
- v1 deletion.

## Constraints

- Reject sign-off if any required gate is red.
- List gaps rather than soft-pass.

## Proposed design

### Sign-off output

```md
## Lane A sign-off (YYYY-MM-DD)
- Package tests: pass/fail
- Drift: pass/fail
- verify:v2-proof: pass/fail
- Primitive contract coverage: N files governed
- Remaining gaps: ...
- Decision: PROCEED | HOLD | REJECT
```

### Lane B unlock rule

Lane B slices may be **authored** after `PROCEED`. Lane B execution still requires
per-slice scope and ADRs where noted (e.g. drag library).

## Interfaces / dependencies

- Requires A-10 synchronization complete.

## Risks and mitigations

- Risk: premature Lane B start.
  - Mitigation: migration map Lane B rows stay `deferred` until per-slice execution proof.

## Rollout and rollback

1. Run gates.
2. Record decision in MIGRATION-MAP + this file.
3. Communicate remaining gaps.

Rollback: set decision `HOLD`; continue Lane A slices.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2
pnpm --filter @afenda/developer verify:v2-proof
pnpm --filter @afenda/developer build
```

## Done definition

- [x] All commands run with evidence.
- [x] Decision recorded.
- [x] Lane B rows updated per decision.
- [x] No undocumented remaining gaps.

## Lane A sign-off (2026-07-06)

| Gate | Result |
| --- | --- |
| `@afenda/shadcn-studio-v2 test` | PASS (196/196) |
| `typecheck` | PASS |
| `build` | PASS |
| `check:drift` | PASS |
| `normalize:kebab-stems --check` | PASS |
| `test:primitives` | PASS (35/35) |
| `biome ci packages/shadcn-studio-v2` | PASS (after backup artifact removal + format) |
| `verify:v2-proof` | PASS (12/12) |
| `@afenda/developer build` | PASS |

**Primitive contract coverage:** 22 governed ui files across 6 primitive test suites.

## Remaining gaps (Lane B scope — not Lane A blockers)

| Gap | Disposition |
| --- | --- |
| ERP broad surface migration | Lane B execution — rows stay `deferred` |
| v1 lab shell / package retirement | Lane B execution — ADR-0027 archive-lane |
| Workflow manifest `kind` rows for table/form | Option A HOLD until ERP board proof |
| Drag/resize board runtime | Lane B — requires drag library ADR |
| TanStack ERP table composer | Lane B consumer layer only (PAS-006D) |
| Full `components/ui/` list in TAXONOMY.md | Taxonomy snapshot + primitive doc SSOT |

## Decision

**`PROCEED`** — Lane A internal stabilization complete. Lane B **approved-for-planning**;
do not execute migration slices without per-slice gates and ADR citations.
