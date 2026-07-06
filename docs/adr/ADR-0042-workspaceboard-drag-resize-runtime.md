# ADR-0042 — WorkspaceBoard Drag And Resize Runtime

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-06 |
| **Owner** | Architecture Authority |
| **Related** | [ADR-0041](ADR-0041-headless-workspaceboard-widget-grid.md), [ADR-0027](ADR-0027-frontend-presentation-reset.md), [Lane B-02](../../packages/shadcn-studio-v2/docs/slices/LANE-B-02-ADR-DRAG-LIBRARY-AND-BOARD-FRAME.md) |
| **Implementation authorization** | Lane B-09 (`apps/erp` consumer runtime only) |

---

## Context

[ADR-0041](ADR-0041-headless-workspaceboard-widget-grid.md) defines WorkspaceBoard as a
headless vocabulary: manifest, widget instances, grid layout metadata, and V2 render
adapters. It explicitly deferred drag/resize library selection and runtime ownership.

The ERP app already persists a **12-column grid** compatible with mainstream dashboard
layout engines:

- `apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts` — `x`,
  `y`, `w`, `h`, optional `minW`/`minH`, fixed `columns: 12`
- `apps/erp/src/app/(protected)/workspace/_components/dashboard-layout-renderer.client.tsx`
  — static CSS grid placement (read-only today)
- `apps/erp/src/lib/workspace/dashboard-widget-bridge.registry.ts` — widget key → block
  adapter mapping

Lane A-09 held dedicated manifest `kind` rows until ERP board proof. Lane B-09
implements the interactive frame. This ADR authorizes **library choice**, **ownership
paths**, and **boundary tests** so drag logic does not leak into
`@afenda/shadcn-studio-v2`.

---

## Decision

### 1. Drag and resize library

Adopt **`react-grid-layout`** (current stable major compatible with React 19 in
`apps/erp`) as the **sole** drag-and-resize engine for WorkspaceBoard grid editing
and interactive viewer modes.

Rationale:

- Item shape (`i`, `x`, `y`, `w`, `h`, `minW`, `minH`) matches the persisted ERP API
  contract without an adapter translation layer.
- Static `DashboardLayoutRenderer` already uses equivalent CSS grid semantics; B-09
  replaces/enhances the client shell—not the contract.
- Mature resize handles, collision compaction, and responsive breakpoints fit operator
  dashboard boards.

Install scope: **`apps/erp` dependency only**. Do not add to `@afenda/shadcn-studio-v2`
or `@afenda/shadcn-studio` (v1).

### 2. Runtime ownership (Lane B-09)

Interactive board runtime lives in **`apps/erp`** under:

```txt
apps/erp/src/components/workspace/
  workspace-board-canvas.client.tsx      # RGL wrapper (WorkspaceBoardCanvasClient)
  workspace-board-widget-frame.client.tsx # per-widget chrome + drag handle slot
```

Naming aligns with [ADR-0041](ADR-0041-headless-workspaceboard-widget-grid.md). Do not
introduce `DashboardCanvasClient`.

**Deferred:** extracting `@afenda/erp-workspace-*` requires a **new ADR** after B-09
pilot proof. B-09 stays in `apps/erp`.

### 3. Presentation boundary (`@afenda/shadcn-studio-v2`)

V2 widget and workflow adapters remain **presentation-only**:

| V2 may | V2 must not |
| --- | --- |
| Export typed adapter props and layout metadata | Import `react-grid-layout` or `@dnd-kit/*` |
| Emit `data-workspace-board-layout` hints (read-only) | Set `draggable`, `onDrag*`, resize handles |
| Render inside a frame-provided slot | Own board editor state or persistence |

Manifest SSOT stays in `@afenda/shadcn-studio-v2/metadata`. ERP bridge consumes layout
defaults; the frame applies geometry via RGL.

### 4. Kanban / sortable surfaces

`@dnd-kit/*` remains valid for **1D sortable** surfaces (e.g. kanban columns) in v1 or
future ERP features. It is **not** the WorkspaceBoard grid engine. Do not use dnd-kit as
a substitute for RGL on the 12-column dashboard contract.

### 5. Accessibility (B-09 obligation)

RGL pointer interaction alone is insufficient for ERP operator boards. B-09 must document
and implement at minimum:

- Named drag handles on `WorkspaceBoardWidgetFrame` (`aria-grabbed` / keyboard path or
  documented editor-only mode with non-drag alternative)
- Visible focus rings on handles and resize affordances
- `prefers-reduced-motion` — disable animated layout transitions when set

Exact keyboard strategy is an implementation detail of B-09; this ADR requires **a
documented a11y approach** in the slice completion report.

### 6. Persistence and permissions

Unchanged from ADR-0041:

- Layout read/write stays in ERP server contracts and RBAC (`workspace.dashboard_*`).
- RGL `onLayoutChange` debounces to existing PUT `/workspace/dashboard-layout` — no new
  persistence schema in B-09 unless a separate ADR amends the API contract.

---

## Alternatives considered

### `@dnd-kit/core` + `@dnd-kit/sortable` (already in v1 for kanban)

**Rejected** as the primary WorkspaceBoard grid engine. dnd-kit excels at sortable lists
and kanban lanes (`packages/shadcn-studio/src/components-ui/kanban.tsx`) but does not
provide first-class 2D grid resize/collision for `x`/`y`/`w`/`h` boards. Using it would
require a custom grid snap layer duplicating RGL.

### CSS grid only (current `DashboardLayoutRenderer`)

**Rejected** for interactive mode. Sufficient for read-only render; insufficient for
drag/resize editor without reimplementing RGL.

### New `@afenda/erp-workspace` package in B-02/B-09

**Rejected** for this ADR. Keeps Lane B-09 bounded to consumer app proof. Extraction is
a follow-on ADR after pilot.

---

## Consequences

### Positive

- B-09 has a single library target and explicit file ownership.
- V2 adapters stay testable without mocking drag contexts.
- ERP API contract and RGL share one grid vocabulary.

### Negative / trade-offs

- `react-grid-layout` adds a client bundle cost to `apps/erp` only.
- Mixed terminology persists (`dashboard-*` API names vs `WorkspaceBoard*` components)
  until a future contract-rename ADR.
- RGL keyboard support requires explicit B-09 supplementation.

---

## Acceptance gate

| Criterion | Evidence |
| --- | --- |
| ADR-0042 **Accepted** in `docs/adr/` | This file |
| ADR-0041 cross-links drag deferral to ADR-0042 | ADR-0041 update |
| PHASE-7B open question closed | Slice doc + test |
| V2 views/adapters free of drag imports | `lane-b-board-frame-boundary.test.ts`, existing `composed-views` guards |
| B-09 authorized to implement | B-09 slice cites ADR-0042 |

---

## References

- [ADR-0041 — Headless WorkspaceBoard Widget Grid](ADR-0041-headless-workspaceboard-widget-grid.md)
- [PHASE-7B — Workflow Views](../../packages/shadcn-studio-v2/docs/slices/PHASE-7B-WORKFLOW-VIEWS.md)
- [Lane B-09 — Workflow board runtime](../../packages/shadcn-studio-v2/docs/slices/LANE-B-09-WORKFLOW-BOARD-RUNTIME.md)
- ERP layout contract: `apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts`
