# Lane B-01 — Consumer Import Inventory

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers executing Lane B cutover
- Authority: `LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md`, `../MIGRATION-MAP.md`
- Action enabled: Ratchet baseline down only in the same PR as v1 import removal

## Overview

Read-only audit and executable baseline of every `@afenda/shadcn-studio` import
across workspace consumers. B-01 produces the shrink target for B-04 through B-13.

## Problem

Lane B execution without a baseline invites silent regressions — new v1 imports
can land while migration claims progress.

## Goals

- Enumerate v1 imports by app, path, and symbol category (shell, block, metadata, theme).
- Add a Vitest or governance test that fails when v1 import count exceeds baseline.
- Publish inventory table in this slice's completion report and `MIGRATION-MAP.md` notes.

## Non-goals

- Removing any v1 import (B-04 onward).
- Changing V2 package source.
- Duplicating B-13 CI freeze (B-13 delegates to `check:v1-consumer-imports`).

## Constraints

- Inventory must exclude `packages/shadcn-studio/**` self-imports.
- Test uses exact baseline snapshot (quarantine pattern) — lowering requires explicit PR.
- Scanner SSOT: `scripts/scan-v1-consumer-imports.ts` (do not re-scan in governance).

## Proposed design

### Tooling

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:v1-consumer-imports
pnpm --filter @afenda/shadcn-studio-v2 sync:v1-consumer-import-baseline -- --write
```

### Baseline artifact

`scripts/lane-b/v1-consumer-import.baseline.json`

### Per-app totals (2026-07-06)

| App | Import statements | Primary categories |
| --- | --- | --- |
| `apps/developer/src` | 19 | shell, block, theme, type-only |
| `apps/erp/src` | 48 | block, metadata, shell, type-only |
| `apps/storybook` | 2 | lab |
| **Total** | **69** | |

### Category → target slice

| Category | Examples | Target slice |
| --- | --- | --- |
| Shell / layout | `AdmincnShell`, nav wires | B-04, B-06 |
| Blocks / datatables | `DatatableUserBlock`, procurement tables | B-05, B-07, B-08 |
| Metadata | `resolveStudioBlockComponent`, `/metadata` | B-08 |
| Theme | `SettingsProvider`, `/theme` | B-03, B-04 |
| Lab | `/lab` storybook parameters | B-11 |

### Executable proof

- `src/__tests__/lane-b-v1-import-baseline.test.ts`
- `pnpm check:v1-consumer-imports`

### Overlap boundaries

| Mechanism | Scope |
| --- | --- |
| `check:drift` legacy import rules | **v2 package `src/` only** — not consumer apps |
| B-01 scanner | **consumer apps** — baseline ratchet |
| B-13 (planned) | CI at **zero** imports — calls `check:v1-consumer-imports` |

## Interfaces / dependencies

- Upstream: Lane A-11 **PROCEED**
- Downstream: all Lane B execution slices

## Risks and mitigations

- Risk: baseline stale after partial migration.
  - Mitigation: exact snapshot match; use `sync:v1-consumer-import-baseline --write` in migration PR.

## Rollout and rollback

1. Run inventory scan; record counts per app. **Done.**
2. Commit baseline test with current count. **Done.**
3. Update `MIGRATION-MAP.md` consumer notes. **Done.**

Rollback: remove baseline test and JSON if inventory approach rejected.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 check:v1-consumer-imports
pnpm exec biome ci packages/shadcn-studio-v2
```

## Done definition

- [x] Per-app import table published
- [x] Baseline executable test committed
- [x] `MIGRATION-MAP.md` references B-01 baseline date
- [x] No v1 imports removed

## commands Run

| command | Result |
| --- | --- |
| `pnpm sync:v1-consumer-import-baseline --write` | 69 imports recorded |
| `pnpm test` | 201/201 PASS |
| `pnpm check:v1-consumer-imports` | PASS |
| `biome ci packages/shadcn-studio-v2` | PASS |

## Decision

**`PROCEED`** — B-02 may start (ADR) in parallel with B-03 planning; no v1 removal until authorized slices.
