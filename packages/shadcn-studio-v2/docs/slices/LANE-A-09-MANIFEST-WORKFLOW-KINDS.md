# Lane A-09 — Manifest Workflow Kinds

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers extending workspace board manifest metadata
- Authority: `LANE-A-02-WIDGET-MANIFEST-AND-EVIDENCE-ADAPTER.md`, Phase 7B open questions
- Action enabled: Decide and implement optional manifest rows for workflow surfaces on boards

## Overview

Resolve Phase 7B open question: whether workflow surfaces hosted on boards need
distinct manifest `kind` rows, or reuse existing categories only.

## Problem

Without a decision, ERP bridge authors may invent parallel layout hint registries
when tables/forms appear on boards.

## Goals

- Document decision in this slice completion note.
- If approved: add manifest rows + metadata builders for bounded kinds (e.g. `table`, `form`).
- If deferred: add explicit `HOLD` record and drift test ensuring no duplicate registries.

## Non-goals

- ERP bridge implementation (Lane B).
- Drag/resize.

## Constraints

- Registry remains JSON-serializable.
- Kinds must map to existing exported views or widgets only.

## Proposed design

### Decision options

| Option | Action |
| --- | --- |
| A — Reuse widget categories only | No new rows; document mapping table in manifest registry file |
| B — Add workflow kinds | Add rows with ADR grid defaults + `define*Metadata` helpers |

Default recommendation: **Option A** until ERP board hosts a workflow surface in proof.

## Interfaces / dependencies

- `workspace-board-manifest-registry.ts`
- `@afenda/shadcn-studio-v2/metadata` export surface

## Risks and mitigations

- Risk: manifest explosion.
  - Mitigation: max two new kinds per slice; require ADR grid citation.

## Rollout and rollback

1. Record decision in slice summary.
2. Implement minimal registry/test diff.
3. Update Phase 7B open questions section.

Rollback: remove new kinds; restore metric/evidence only.

## Required gates

Standard Lane A package gates.

## Done definition

- [x] Decision recorded (**Option A — HOLD**; no new manifest kind rows).
- [x] Registry tests updated (`workspace-board-manifest-registry.test.ts`).
- [x] No ERP files changed.

## Evidence

- `src/metadata/registries/workflow-board-host-mapping.ts` — category reuse mapping + HOLD record
- `src/metadata/registries/workspace-board-manifest-registry.ts` — metric/evidence only (comment cross-ref)
- `@afenda/shadcn-studio-v2/metadata` exports mapping helpers

## Decision

**Option A (HOLD lifted — Lane B-10)** — after B-09 ERP board proof, dedicated manifest
`kind` rows `workflow-table` and `workflow-approval` are canonical SSOT.
`workflowBoardHostMappingRegistry` wires `data-table-surface` → `workflow-table` and
`form-surface` → `workflow-approval`. Category values remain for transitional dual-read
in `resolveWorkflowBoardLayoutHint` until B-14 synchronization.

### Historical note (A-09 original)

Until B-09, bridge authors reused `WorkspaceBoardWidgetCategory` via host mapping only
(`data-table-surface` → `table`, `form-surface` → `approval`) with `status: HOLD`.
