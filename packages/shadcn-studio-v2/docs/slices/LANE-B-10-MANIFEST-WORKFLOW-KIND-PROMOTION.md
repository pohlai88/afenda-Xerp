# Lane B-10 — Manifest Workflow Kind Promotion

## Document status

- Status: **Complete** (2026-07-06 — after B-09 board proof)
- Audience: Presentation + ERP engineers
- Authority: `LANE-A-09-MANIFEST-WORKFLOW-KINDS.md`, `workflow-board-host-mapping.ts`
- Action enabled: B-14 synchronization gate

## Overview

Lane A-09 chose **Option A HOLD**: reuse table/chart categories via host mapping until
ERP board proof exists. After B-09, this slice promotes dedicated `kind` rows for
workflow-hosted surfaces (`workflow-table`, `workflow-approval`).

## Problem

Category reuse works for proof route but obscures board layout defaults and ERP bridge
typing at scale.

## Goals

- [x] Add manifest registry rows for workflow-hosted kinds.
- [x] Update `workflow-board-host-mapping.ts` to reference canonical kinds.
- [x] Extend `workspace-board-manifest-registry.test.ts`.
- [x] Update PHASE-7B resolution note from HOLD → **LIFTED**.

## Non-goals

- Changing V2 view component APIs.
- Board frame implementation (B-09).

## Constraints

- Registry remains SSOT in `@afenda/shadcn-studio-v2/metadata`.
- ERP bridge imports manifest defaults — no duplicate layout hints.

## Proposed design

### Registry additions (delivered)

| Surface | New kind row | Host category |
| --- | --- | --- |
| `data-table-surface` | `workflow-table` | table |
| `form-surface` | `workflow-approval` | approval |

### Dual-read bridge (transitional)

ERP `workspace-board-manifest.bridge.ts` resolves layout hints from manifest `kind`
first, with category shim fallback via `resolveWorkflowBoardLayoutHint`.

### Proof

- `lane-b-10-manifest-workflow-kind-promotion.test.ts`
- `workspace-board-manifest-registry.test.ts`
- `apps/erp/src/lib/workspace/__tests__/workspace-board-manifest.bridge.test.ts`

## Interfaces / dependencies

- Upstream: B-09 board proof
- Downstream: B-14 sync

## Risks and mitigations

- Risk: breaking ERP bridge expecting category-only mapping.
  - Mitigation: transitional dual-read in bridge one release; documented above.

## Rollout and rollback

1. Add kind rows + tests.
2. Update ERP bridge imports.
3. Mark A-09 HOLD lifted in Lane A-09 doc (historical note).

Rollback: revert registry rows; restore category-only mapping.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test -- workspace-board-manifest lane-b-10
pnpm --filter @afenda/shadcn-studio-v2 typecheck && pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/erp test:run -- workspace dashboard-widget
```

## Done definition

- [x] Dedicated kind rows exist with tests
- [x] A-09 HOLD formally lifted
- [x] ERP bridge uses canonical kinds
- [x] Proof route manifest tests PASS

## Decision

**LIFTED** — B-09 board proof complete; canonical kinds `workflow-table` and
`workflow-approval` are SSOT via `workspace-board-manifest-registry.ts`.
