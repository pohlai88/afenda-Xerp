# Phase 7A - Page And Widget Views Technical Specification

## Document Status

- Status: Planned implementation slice
- Audience: Engineers implementing first composed views
- Authority: `../DESIGN-SYSTEM-ARCHITECTURE.md` and `../TAXONOMY.md`
- Action enabled: Build page and widget surfaces without workflow or auth scope

## Overview

This slice builds the first composed presentation surfaces under `src/views`.

Phase 7A does not build dashboards. It builds widget render adapters that can
be placed inside a future WorkspaceBoard runtime.

## Problem

The view layer is where primitive composition becomes product-shaped. Without a
bounded first view slice, business logic, app routes, and data fetching can leak
into package presentation components.

## Goals

- Implement `PageSurface`.
- Implement `MetricWidget`.
- Keep Phase 7A widget implementation limited to the first generic
  `MetricWidget` render adapter.
- Prove empty, loading, error, and unavailable states where applicable.

## Non-goals

- Workflow views such as forms, tables, dialogs, or settings.
- Auth presentation.
- Consumer app integration.
- Database, auth, permission, or route logic.
- Fixed module dashboards.
- Drag, resize, layout persistence, or board editor runtime.
- Data-source resolution or BI query execution.

## Constraints

- Views compose primitives and layout only.
- Views expose typed props.
- Views do not own ERP business logic.
- Views do not call databases, auth services, or app routes.
- Views remain token-safe and accessible.
- Widget views must be grid-compatible and responsive inside externally owned
  layout slots.
- Widget views must not encode tenant, user, permission, or data-source
  authority.

## Proposed design

### View responsibilities

- `PageSurface` owns page-level presentation structure.
- `MetricWidget` owns compact metric presentation as a render adapter.
- Additional chart, table, evidence, shortcut, approval, report, or statistics
  widgets require separate adapter contracts and are deferred from Phase 7A.
- Revenue/statistics dashboard blocks are not part of this slice.
- Widget views expose presentation contracts only: typed props, slots, state
  visuals, accessible labels, and responsive rendering.
- Future WorkspaceBoard runtime concepts are named `WorkspaceBoardViewer`,
  `WorkspaceBoardEditor`, `WorkspaceBoardRenderer`,
  `WorkspaceBoardCanvasClient`, and `WorkspaceBoardWidgetFrame`.
- `DashboardCanvasClient` is not an approved Phase 7A name.

### WorkspaceBoard compatibility

Phase 7A widget surfaces must be compatible with the doctrine in
`../../../../docs/adr/ADR-0041-headless-workspaceboard-widget-grid.md`:

```txt
WorkspaceBoard = saved grid layout + widget instances + approved data bindings + render adapters
Tenant owns layout. User may own personal arrangement. System owns widget meaning.
```

Widget surfaces may model metric, chart, table, evidence, shortcut, approval,
or report presentation, but they must not become fixed dashboards. Existing ERP
dashboard layout contracts remain the current runtime authority until a later
ADR promotes or extracts a formal WorkspaceBoard runtime package.

Grid compatibility requirements:

- render correctly in compact and expanded grid cells
- avoid fixed widths that assume a full dashboard page
- keep state surfaces stable at minimum widget sizes
- expose enough label and state props for runtime-owned frames to remain
  accessible
- avoid internal drag, resize, persistence, permission, or data-source logic

### State posture

Data-driven views must represent:

- loading
- empty
- error
- unavailable
- ready

State completeness applies to widget render adapters even when data is supplied
by an external runtime. `unavailable` covers disabled features, disconnected
data sources, unsupported bindings, or temporarily unavailable runtime
capabilities.

### Verification posture

The slice must prove:

- views render with typed props
- state variants are accessible
- no business logic exists in views
- no raw hex or forbidden imports exist
- widget render adapters remain grid-compatible
- no fixed module dashboard is introduced
- no `DashboardCanvasClient` naming is introduced

## Interfaces / dependencies

- Source docs:
  - `../DESIGN-SYSTEM-ARCHITECTURE.md`
  - `../TAXONOMY.md`
  - `../../../../docs/adr/ADR-0041-headless-workspaceboard-widget-grid.md`
- Source dependencies:
  - `src/components/ui/**`
  - `src/components/layout/**`
- Current runtime authority:
  - `../../../../apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts`
  - `../../../../apps/erp/src/lib/workspace/dashboard-widget-bridge.registry.ts`
- Downstream slices:
  - Phase 8 proof route

## Risks and mitigations

- Risk: views become ERP business components.
  - Mitigation: accept data through typed props only.
- Risk: state coverage is deferred.
  - Mitigation: make state variants part of render tests.
- Risk: widgets hardcode visual values.
  - Mitigation: enforce drift guard and token-only styling.
- Risk: widget views become dead dashboards.
  - Mitigation: define widgets as render adapters only and leave layout
    persistence, drag/resize, data bindings, and board orchestration to runtime.
- Risk: BI and ERP board needs fork into separate presentation models.
  - Mitigation: keep widgets data-source-kind compatible and free of
    ERP-specific runtime assumptions.

## Rollout and rollback

### Rollout

1. Implement page and widget views.
2. Add view render and state tests.
3. Run package gates.

### Rollback

If a view requires app data or business logic to work, remove that logic from
the package view and expose a typed prop instead.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2
```

## Done definition

- Page and widget views exist.
- `PageSurface` and `MetricWidget` are the only Phase 7A implementation
  surfaces.
- Typed props exist.
- State coverage exists.
- Widget render adapters are grid-compatible.
- Accessibility labels exist where needed.
- Views contain no business logic.
- No fixed module dashboard is introduced.

## Open questions

- None for Phase 7A. Revenue/statistics blocks were removed from this slice;
  future non-metric widgets require explicit render-adapter contracts.
