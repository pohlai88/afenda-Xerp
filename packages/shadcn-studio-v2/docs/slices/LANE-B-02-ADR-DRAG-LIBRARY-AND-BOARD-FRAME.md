# Lane B-02 — ADR: Drag Library And Board Frame Ownership

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Architecture + ERP engineers
- Authority: `PHASE-7B-WORKFLOW-VIEWS.md`, Lane B index
- Action enabled: Implement B-09 board runtime per ADR-0042

## Overview

Architecture decision record selecting drag/resize library and defining
`WorkspaceBoardWidgetFrame` ownership boundaries. V2 widget adapters stay
presentation-only; frame interaction lives in ERP (or approved consumer package).

## Problem

Phase 7B deferred ERP drag/resize. Lane A-09 held dedicated manifest kinds until
board proof. Implementation without an ADR risks drag logic leaking into V2 adapters.

## Goals

- Record library choice (e.g. `@dnd-kit/*`, `react-grid-layout`, or other) with rationale.
- Define frame vs adapter vs manifest responsibilities.
- Specify test forbidding `draggable` / resize handles in V2 adapter TSX.
- Unblock B-09 and B-10.

## Non-goals

- Implementing the frame (B-09).
- Adding drag to V2 package exports.
- Duplicating ADR-0041 headless vocabulary (extended by ADR-0042).

## Constraints

- ADR must live in `docs/adr/` (not package docs alone).
- Must align with `DESIGN-SYSTEM-ARCHITECTURE.md` migration law.
- Kernel must not import presentation drag code.

## Decision (Lane B-02)

| Topic | Choice |
| --- | --- |
| ADR | [ADR-0042](../../../../docs/adr/ADR-0042-workspaceboard-drag-resize-runtime.md) **Accepted** |
| Grid drag/resize library | `react-grid-layout` in `apps/erp` only |
| Frame owner | `apps/erp/src/components/workspace/` |
| Components | `WorkspaceBoardCanvasClient`, `WorkspaceBoardWidgetFrame` |
| V2 boundary | Layout hints only; no drag libraries in `@afenda/shadcn-studio-v2` |
| dnd-kit | Kanban/sortable only — not WorkspaceBoard grid engine |

ADR-0041 remains the headless vocabulary ADR; ADR-0042 closes the drag deferral.

## Executable proof

- `src/__tests__/lane-b-board-frame-boundary.test.ts`
- Existing `composed-views.test.tsx` widget drag guards (unchanged)

## Interfaces / dependencies

- Upstream: B-01 inventory (awareness)
- Downstream: B-09, B-10

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm exec biome ci packages/shadcn-studio-v2
```

## Done definition

- [x] ADR merged with Accepted status
- [x] PHASE-7B open question on drag library closed
- [x] B-09 slice references ADR id
- [x] V2 view drag boundary test committed

## commands Run

| command | Result |
| --- | --- |
| `pnpm test` | PASS (includes lane-b-board-frame-boundary) |
| `biome ci packages/shadcn-studio-v2` | PASS |

## Decision

**`PROCEED`** — B-09 authorized to implement ERP frame per ADR-0042.
