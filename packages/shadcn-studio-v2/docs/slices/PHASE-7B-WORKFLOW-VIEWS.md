# Phase 7B - Workflow Views Technical Specification

## Document Status

- Status: **Complete** (2026-07-06) — workflow surfaces proven on `/design-system/v2-proof`
- Audience: Engineers implementing workflow presentation surfaces and follow-on board widgets
- Authority: `../DESIGN-SYSTEM-ARCHITECTURE.md`, `../TAXONOMY.md`, ADR-0041
- Action enabled: Extend workflow/board surfaces via metadata-governed adapters, not inline drag/resize logic

## Overview

This slice built workflow-oriented composed views under `src/views`. Follow-on
work for grid-hosted widgets (including evidence and drag/resize framing) must
stay metadata-governed and runtime-owned per ADR-0041.

## Problem

Workflow surfaces are the easiest place to smuggle business rules into a shared
presentation package. tables, forms, dialogs, and settings screens need strong
boundaries so the package owns reusable presentation, not ERP behavior.

A second failure mode is duplicating board concerns inside widget components:
drag handles, resize logic, layout persistence, and bridge registries scattered
across ERP and studio increase maintenance without adding presentation value.

## Goals

- Implement datatable, form, dialog, and settings presentation surfaces.
- Keep workflow views typed, accessible, and token-safe.
- Provide state coverage for empty, loading, error, unavailable, and ready
  presentation states where applicable.
- Establish metadata-governed extension path for board widgets (including
  deferred `EvidenceWidget`) without embedding drag/resize in adapters.

## Non-goals

- ERP business rules.
- Server actions.
- Database calls.
- Auth provider calls.
- Consumer app routes.
- Real form submission behavior.
- Drag, resize, layout persistence, or board editor state inside package views.
- Choosing a drag/drop library (requires a later ADR).

## Constraints

- Views compose primitives and layout only.
- inputs are typed and fixture-shaped.
- State is presentational only.
- Controls must be keyboard reachable.
- tables must expose accessible labels and empty states.
- Widget adapters must remain grid-compatible; board chrome is runtime-owned.

## Proposed design

### Workflow surfaces (delivered)

Implemented and exported:

- `src/views/datatables/data-table-surface.tsx`
- `src/views/forms/form-surface.tsx`
- `src/views/dialogs/confirm-dialog-surface.tsx`
- `src/views/settings/settings-surface.tsx`

Proof: `composed-views.test.tsx`, developer `/design-system/v2-proof`.

### Responsibility split

| Layer | Owns | Does not own |
| --- | --- | --- |
| Package views | Layout, labels, state visuals, typed props, slots | Data fetch, permissions, persistence, routing, mutations |
| `metadata/` lane | Declarative view/widget descriptors, gates, registries | React rendering, layout mutation |
| ERP / future WorkspaceBoard runtime | Layout JSON, drag/resize, editor state, bridge to adapters | Widget presentation markup, token styling |

### Metadata-governed extension (recommended)

Minimize maintenance by keeping **one declarative contract** and **one runtime frame** instead of per-widget drag/resize copies.

#### Layer 1 — Manifest registry (package `metadata/`)

Add a single SSOT registry aligned with ADR-0041 `WorkspaceBoardWidgetManifest`:

```txt
src/metadata/registries/workspace-board-manifest-registry.ts
```

Each row declares:

- `kind` (stable adapter key, e.g. `metric`, `evidence`, `table-surface`)
- `category` (`metric` | `chart` | `table` | `evidence` | …)
- `defaultSize`, `minSize`, `maxSize` (grid spans — no x/y; placement is instance-owned)
- `allowedDataSourceKinds`, `requiredCapabilities`

**Maintenance win:** ERP `dashboard-widget-bridge.registry.ts` imports default/min
sizes from this registry instead of duplicating `{ w, h, minW, minH }` blocks.

#### Layer 2 — Metadata builders + gates (extend existing pattern)

Extend `metadata/contracts/view-metadata.ts` with discriminated widget metadata,
mirroring `StudioMetricWidgetMetadata`:

```ts
// direction only — implement in a bounded follow-on slice
defineEvidenceWidgetMetadata({ kind: "widget", widget: "evidence", ... })
defineWorkflowViewMetadata({ kind: "workflow", surface: "datatable", ... })
```

Keep validation centralized in `metadata/gates/view-metadata-gates.ts` (`assertStudioViewMetadata`).
Add tests in `metadata-lane.test.ts` for each new discriminant.

**Maintenance win:** Storybook fixtures, proof routes, and ERP seed data compose
from builders — no ad-hoc JSON shapes in consumers.

#### Layer 3 — Render adapters (package `views/widgets/`)

Thin presentation components only:

- Shared shell: `widget-board-adapter.ts` exports
  `workspaceBoardWidgetAdapterClassName`.
- Adapters emit `data-adapter-kind`, `data-workspace-board-adapter="true"`, optional
  read-only `data-workspace-board-layout` (serialized layout for a11y/debug — not mutation).
- **No** `draggable`, resize handles, or pointer-driven layout inside adapters
  (locked by `composed-views.test.tsx`).

Delivered adapters (registered file stems):

- `widget-metric.tsx` — exports `MetricWidget`
- `widget-evidence.tsx` — exports `EvidenceWidget`

#### Layer 4 — Drag/resize frame (runtime only — not Phase 7B)

Implement once outside `shadcn-studio-v2`:

```txt
WorkspaceBoardWidgetFrame   # resize handles, drag affordances, focus ring
WorkspaceBoardCanvasClient  # grid host, layout read/write
WorkspaceBoardEditor        # edit mode orchestration
```

Frame responsibilities:

- Wrap adapter by `kind` lookup from manifest registry + bridge map
- Read/write `WorkspaceBoardWidgetInstance.layout` (x, y, w, h, min/max)
- Emit layout deltas to ERP persistence — never import studio internals

**Maintenance win:** One frame component serves metric, evidence, table, chart,
and workflow-hosted widgets; adapters stay stable when drag library changes.

### Rendering flow (target)

```txt
1. Runtime loads board instance + manifest registry row by kind
2. Runtime resolves permissions + data binding
3. Frame applies grid placement + drag/resize chrome
4. Adapter receives narrowed props + optional layout metadata (read-only)
5. Adapter renders presentation only
```

### Verification posture

Delivered (Phase 7B):

- workflow views render
- state variants present
- keyboard and label semantics covered
- no app or server dependency

Follow-on slice must additionally prove:

- manifest registry row exists for each exported adapter kind
- `data-adapter-kind` matches registry `kind`
- adapters still exclude drag/resize markup
- ERP bridge default sizes match registry (test or drift script)

## Interfaces / dependencies

- Source docs:
  - `../DESIGN-SYSTEM-ARCHITECTURE.md`
  - `../TAXONOMY.md`
  - `../../../../docs/adr/ADR-0041-headless-workspaceboard-widget-grid.md`
- Source dependencies:
  - `src/components/ui/**`
  - `src/components/layout/**`
  - `src/metadata/**` (builders, gates, registries)
  - `src/types/views.ts` (`WorkspaceBoardWidgetManifest`, layout types)
- Current ERP runtime authority:
  - `apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts`
  - `apps/erp/src/lib/workspace/dashboard-widget-bridge.registry.ts`
- Downstream:
  - EvidenceWidget export + manifest registry slice
  - ERP WorkspaceBoard frame (separate ADR for drag library)

## Risks and mitigations

- Risk: form surfaces become data mutation APIs.
  - Mitigation: expose callbacks and state props only; no server actions.
- Risk: table views assume ERP schemas.
  - Mitigation: keep columns and rows generic or fixture-shaped.
- Risk: settings views become configuration owners.
  - Mitigation: represent settings UI only; consumers own persistence.
- Risk: drag/resize copied into each widget.
  - Mitigation: frame owns interaction; adapters stay presentation-only; tests forbid `draggable`/`resize` in adapter markup.
- Risk: duplicate layout hints (ERP bridge vs studio manifest).
  - Mitigation: single manifest registry exported from `@afenda/shadcn-studio-v2/metadata`; bridge consumes it.

## Rollout and rollback

### Rollout (completed)

1. Implemented workflow view components.
2. Added render, state, and accessibility tests.
3. Ran package gates and proof route.

### Follow-on rollout (metadata + evidence + frame)

1. Add `workspace-board-manifest-registry.ts` + tests.
2. Export `EvidenceWidget` adapter + `defineEvidenceWidgetMetadata`.
3. Promote shared `workspaceBoardWidgetAdapterClassName` helper.
4. Wire ERP bridge to import manifest defaults (narrow scope: layout hints only).
5. Implement `WorkspaceBoardWidgetFrame` in ERP under new ADR authorization.

### Rollback

If a view cannot function without ERP-specific behavior, remove that behavior
from the package and defer it to the consumer proof route. If drag/resize lands
inside a studio adapter, revert — violates architecture boundary.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2
```

## Done definition

- [x] Workflow views exist.
- [x] Typed props exist.
- [x] State coverage exists.
- [x] Accessibility tests pass.
- [x] No app-specific logic in workflow views.
- [x] Manifest registry SSOT for widget kinds (follow-on).
- [x] `EvidenceWidget` adapter exported (follow-on).
- [x] ERP drag/resize frame under ADR-0042 (implementation: Lane B-09).

## Open questions

- ~~Whether workflow surfaces (`data-table-surface`, etc.) get distinct manifest
  `kind` rows when hosted on boards, or reuse table/chart categories only.~~
  **Resolved (Lane B-10):** Dedicated kinds `workflow-table` and `workflow-approval`
  promoted after B-09 board proof; A-09 HOLD lifted via `WORKFLOW_BOARD_MANIFEST_DECISION.status: LIFTED`.
- ~~Which ADR authorizes drag library selection and `WorkspaceBoardCanvasClient`
  extraction from ERP into a dedicated package.~~
  **Resolved (Lane B-02):** [ADR-0042](../../../../docs/adr/ADR-0042-workspaceboard-drag-resize-runtime.md)
  — `react-grid-layout` in `apps/erp`; `WorkspaceBoardCanvasClient` /
  `WorkspaceBoardWidgetFrame` under `apps/erp/src/components/workspace/`. Package
  extraction deferred to a future ADR after B-09 pilot.
