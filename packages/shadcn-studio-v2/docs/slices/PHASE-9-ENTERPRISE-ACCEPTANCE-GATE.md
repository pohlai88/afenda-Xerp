# Phase 9 - Enterprise Acceptance Gate Technical Specification

## Overview

This slice runs the final package and consumer acceptance gate for the current
greenfield V2 baseline.

## Problem

Without a closing acceptance slice, implementation can appear complete while one
or more package-local or consumer-level gates are still red.

## Goals

* Run the full required package gate set.
* Run the selected consumer gate set.
* Return a pass/fail acceptance decision with remaining gaps.

## Non-goals

* Implementing new functionality to make the gates pass.
* Broad migration rollout.
* Legacy deletion.

## Constraints

* Required package commands:

  * `pnpm --filter @afenda/shadcn-studio-v2 test`
  * `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
  * `pnpm --filter @afenda/shadcn-studio-v2 build`
  * `pnpm --filter @afenda/shadcn-studio-v2 check:drift`
  * `pnpm exec biome ci packages/shadcn-studio-v2`
* Consumer route proof must also pass.

## Proposed design

### Acceptance output

The slice closes with:

* commands run
* pass/fail result
* failed files if any
* DoD checklist
* explicit acceptance granted/rejected decision

### Decision rule

Enterprise acceptance is rejected if any required package or consumer gate is
red, even when the rendered output looks correct.

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * all prior slices
* Downstream slice:

  * Closing synchronization gate

## Risks and mitigations

* Risk: package-local green status hides consumer failures.

  * Mitigation: keep consumer proof inside the acceptance slice.
* Risk: acceptance is declared from partial evidence.

  * Mitigation: require the explicit output contract.
* Risk: failures get fixed ad hoc with no trace.

  * Mitigation: list remaining gaps rather than soft-passing.

## Rollout and rollback

### Rollout

1. Run all required package commands.
2. Run the selected consumer commands.
3. Record the acceptance result and remaining gaps.

### Rollback

If acceptance fails, do not widen scope. Feed the exact failing gaps back into
the smallest prior slice that owns them.

## Open questions

* Whether route smoke proof should live in the consumer app or package-owned
  verification harness long-term.

---

## Summary

Phase 9 enterprise acceptance gate executed 2026-07-06. All required package and
consumer gates are **green**. Acceptance **granted** for the current greenfield
V2 baseline.

## commands Run

| command | Result |
| --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS — 156 tests |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS |
| `pnpm --filter @afenda/shadcn-studio-v2 check:drift` | PASS |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS (after export-order fix on 20 files) |
| `pnpm --filter @afenda/developer verify:v2-proof` | PASS — typecheck, presentation-runtime, hydration-governance, 3 unit tests |
| `pnpm --filter @afenda/developer build` | PASS |

## DoD

- [x] Full required package gate set run
- [x] selected consumer gate set run (developer proof route)
- [x] Pass/fail acceptance decision recorded
- [x] Failed files resolved (Biome export sort in `packages/shadcn-studio-v2`; Vitest V2 subpath aliases in `apps/developer/vitest.config.ts`)
- [x] Remaining gaps named (see below)

## Remaining gaps (non-blocking)

| Gap | Disposition |
| --- | --- |
| `EvidenceWidget` deferred on proof route | Documented Phase 8 stand-in; not an acceptance blocker |
| ERP app not in consumer gate set | Phase 8 scoped developer proof only; ERP wiring is post-acceptance migration |
| Playwright v2-proof smoke | Covered in `verify:greenlight` production harness; optional with live dev server |

## Decision

**`ACCEPTANCE GRANTED`** — Proceed to [Closing Synchronization Gate](CLOSING-SYNCHRONIZATION-GATE.md).
