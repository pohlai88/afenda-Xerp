# Closing - Synchronization Gate Technical Specification

## Overview

This closing slice synchronizes the package after the implementation phases and
the acceptance gate.

Its purpose is to prevent the final state from splitting across architecture,
taxonomy, exports, tests, proof route, and migration ledger.

## Problem

A design-system sequence can finish with locally correct pieces that are still
out of sync:

* active docs say one thing
* tests enforce another
* exports expose more or less than intended
* consumer proof uses a different surface
* migration or retirement docs lag behind actual proof

## Goals

* Reconcile active docs with executable package reality.
* Confirm the final public and CSS surfaces match the proven implementation.
* Confirm the proof route, migration ledger, and quality bar describe the same
  package state.

## Non-goals

* New implementation work.
* New architecture decisions.
* Legacy deletion.

## Constraints

* Only active docs may be synchronized:

  * `README.md`
  * `TAXONOMY.md`
  * `DESIGN-SYSTEM-ARCHITECTURE.md`
  * `DEVELOPMENT-ROADMAP.md`
  * `MIGRATION-MAP.md`
  * `DESIGN-SYSTEM-GUIDELINE.md`
  * `PRIMITIVE-API-CONSISTENCY.md`
  * `LEGACY-RETIREMENT-PLAN.md`
  * `docs/slices/*`
* Synchronization must reflect executable proof, not preferred narrative.

## Proposed design

### Synchronization checklist

Confirm these surfaces agree:

1. `TAXONOMY.md` and actual `src/` structure
2. package exports and public import law
3. CSS exports and active style files
4. primitive API consistency doc and primitive tests
5. migration map statuses and real proof route evidence
6. docs/slices quality bar and actual gate set

### Closing output

The slice closes with:

* synchronized files
* commands re-run if any sync edits changed proof-relevant surfaces
* remaining unsynchronized gaps
* recommendation: hold / proceed

## Interfaces / dependencies

* Source docs:

  * all active package docs
  * all completed slices
* Proof surfaces:

  * package tests
  * drift guard
  * package exports
  * consumer proof route

## Risks and mitigations

* Risk: docs are updated optimistically instead of from proof.

  * Mitigation: synchronize from tests, exports, and route evidence only.
* Risk: migration statuses overstate readiness.

  * Mitigation: require status updates to cite the bounded proof route and gate
    results.
* Risk: slice closure leaves stale acceptance assumptions behind.

  * Mitigation: use this slice as the explicit final reconciliation point.

## Rollout and rollback

### Rollout

1. Review active docs against package and consumer proof.
2. Update only the docs that are out of sync with proven reality.
3. Re-run any commands needed to confirm synchronization-sensitive changes.

### Rollback

If synchronization reveals a contract mismatch, do not rewrite the docs around
the mismatch. Reopen the owning implementation slice or acceptance slice and fix
the underlying proof first.

## Open questions

* Whether the synchronization gate should later become one dedicated docs test
  plus a short maintainer checklist instead of a full slice spec.

---

## Summary

Closing synchronization executed **2026-07-06** after Phase 9 acceptance.
Active docs now match package exports, CSS surfaces, proof route evidence, and
gate commands.

## Synchronized files

| File | Change |
| --- | --- |
| `docs/MIGRATION-MAP.md` | **Created** — ledger with proof-route rows and status vocabulary |
| `README.md` | Install/import/verify commands; Phase 9 status; `MIGRATION-MAP` authority |
| `docs/TAXONOMY.md` | Added `afenda-brand.css` to approved `styles/` list |
| `docs/DEVELOPMENT-ROADMAP.md` | Phase H/I status blocks; final acceptance verified date |
| `docs/slices/PHASE-8-*.md` | Already signed off (prior turn) |
| `docs/slices/PHASE-9-*.md` | Already signed off (prior turn) |

## Checklist

- [x] `TAXONOMY.md` matches `src/` (including `afenda-brand.css`)
- [x] Package exports match `package.json` and `public-exports.test.ts`
- [x] CSS exports match drift guard and consumer `globals.css`
- [x] Migration map cites `/design-system/v2-proof` and Phase 9 gates
- [x] Slice index + architecture list same package gate commands

## Commands re-run

| Command | Result |
| --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS (includes `roadmap-doc-alignment.test.ts`) |
| `pnpm --filter @afenda/developer verify:v2-proof` | PASS |

## Remaining unsynchronized gaps

| Gap | Disposition |
| --- | --- |
| `DESIGN-SYSTEM-GUIDELINE.md` | Not created — gates live in tests + drift scripts per architecture retirement policy |
| `PRIMITIVE-API-CONSISTENCY.md` | Not on disk — enforced by `primitive-api-consistency.test.ts` |
| `LEGACY-RETIREMENT-PLAN.md` | Not on disk — tracked in `MIGRATION-MAP.md` legacy section |
| ERP broad migration | Out of closing scope — row remains `pending` in ledger |

## Decision

**`PROCEED`** — Greenfield V2 baseline documentation synchronized. Safe to plan
ERP surface migration from `MIGRATION-MAP.md` without reopening Phases 1–9.
