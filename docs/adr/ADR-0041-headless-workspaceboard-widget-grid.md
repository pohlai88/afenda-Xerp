# ADR-0041 — Headless WorkspaceBoard Widget Grid

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-06 |
| **Owner** | Architecture Authority |
| **Related** | [ADR-0027](ADR-0027-frontend-presentation-reset.md), [ADR-0042](ADR-0042-workspaceboard-drag-resize-runtime.md), [PAS-006](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md), [Phase 7A](../../packages/shadcn-studio-v2/docs/slices/PHASE-7A-PAGE-AND-WIDGET-VIEWS.md) |
| **Implementation authorization** | Documentation and contract direction only |

---

## Context

Phase 7A introduces page and widget views in `packages/shadcn-studio-v2`.
The first widget work must not become fixed module dashboards or a second
runtime for ERP workspace layout.

The current ERP application already owns dashboard runtime contracts:

- `apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts`
  defines the persisted 12-column layout shape.
- `apps/erp/src/lib/workspace/dashboard-widget-bridge.registry.ts` maps
  runtime widget keys to accepted studio block identifiers and layout hints.
- ERP workspace renderer and services remain the current runtime authority for
  stored layout, permissions, tenant context, and data resolution.

ADR-0027 and PAS-006 make `@afenda/shadcn-studio` the presentation owner, not
the owner of tenant layout persistence or ERP business runtime. Phase 7A must
therefore describe widgets as render adapters that can be placed in a later
WorkspaceBoard runtime, not as static dashboards.

## Decision

Adopt **WorkspaceBoard** as the architecture name for the future board runtime
concept and define Phase 7A widgets as WorkspaceBoard-compatible render
adapters.

Core doctrine:

```txt
WorkspaceBoard = saved grid layout + widget instances + approved data bindings + render adapters
Tenant owns layout. User may own personal arrangement. System owns widget meaning.
```

Use WorkspaceBoard naming consistently for future runtime/editor concepts:

- `WorkspaceBoardViewer`
- `WorkspaceBoardEditor`
- `WorkspaceBoardRenderer`
- `WorkspaceBoardCanvasClient`
- `WorkspaceBoardWidgetFrame`

Do not introduce `DashboardCanvasClient`. The word `Dashboard` may remain in
existing ERP runtime contracts until a later ADR authorizes migration or
extraction.

## Scope

This ADR authorizes documentation and contract direction only.

`packages/shadcn-studio-v2` may define presentation-oriented widget surfaces
that are:

- typed by props
- token-safe
- accessible
- state-complete
- responsive inside grid slots
- free of tenant, auth, database, permission, and route logic

WorkspaceBoard is not limited to operational ERP dashboards. The same board
kernel may serve ERP workspaces, BI/statistical analysis boards, executive KPI
boards, audit evidence boards, and operations boards. The distinction is made
through approved widget manifests, data-source manifests, and board use-case
metadata, not separate dashboard runtimes.

## Non-goals

- This ADR does not authorize new physical packages.
- This ADR does not authorize drag/resize implementation.
- This ADR does not choose a drag/drop library.
- This ADR does not move ERP data resolution into `shadcn-studio-v2`.
- This ADR does not authorize fixed module dashboards.
- This ADR does not change database schema or persistence strategy.
- This ADR does not rename existing ERP dashboard contracts.

## Architecture Boundary

`shadcn-studio-v2` owns presentation contracts only:

- typed widget props
- visual slots and state surfaces
- token-safe classes
- responsive render behavior
- empty, loading, error, unavailable, and ready states

`shadcn-studio-v2` does not own:

- tenant layout persistence
- permission evaluation
- drag/resize behavior
- board editor state
- data-source resolution
- dashboard runtime orchestration
- raw SQL, route handlers, or auth calls

Existing ERP dashboard layout contracts remain the current runtime authority
until a later ADR promotes or extracts a formal WorkspaceBoard runtime package.

Ownership rule:

| Owner | Can control | Cannot control |
|-------|-------------|----------------|
| System | widget kind, schema, data binding rules, capabilities, state model | tenant visual arrangement |
| Tenant admin | default board layout, enabled widgets, role/team visibility | raw React, raw SQL, bypassed permissions |
| User | personal layout override, widget order/size where allowed | widget meaning, unauthorized data source |

## Widget Manifest Contract

The manifest describes what a widget kind means and what it is allowed to bind
to. This is contract direction, not implementation in this ADR.

```ts
export type WorkspaceBoardUseCase =
  | "erp-workspace"
  | "bi-analytics"
  | "executive"
  | "audit"
  | "operations";
```

```ts
export interface WorkspaceBoardWidgetManifest {
  readonly kind: string;
  readonly label: string;
  readonly description: string;
  readonly category:
    | "metric"
    | "chart"
    | "table"
    | "evidence"
    | "shortcut"
    | "approval"
    | "report";
  readonly defaultSize: WorkspaceBoardWidgetSize;
  readonly minSize: WorkspaceBoardWidgetSize;
  readonly maxSize?: WorkspaceBoardWidgetSize;
  readonly allowedDataSourceKinds: readonly string[];
  readonly requiredCapabilities: readonly string[];
}
```

Use `allowedDataSourceKinds` instead of fixed data-source IDs when the widget
can safely support a class of approved bindings. Use `requiredCapabilities`
instead of hardcoded permissions because permissions are runtime-resolved by the
ERP authority.

## Widget Instance Contract

A widget instance stores identity, approved binding references, JSON config,
and grid placement. It does not store React nodes or executable behavior.

```ts
export interface WorkspaceBoardWidgetInstance {
  readonly id: string;
  readonly kind: string;
  readonly title: string;
  readonly dataSourceId: string;
  readonly config: Record<string, unknown>;
  readonly layout: WorkspaceBoardWidgetLayout;
  readonly visibility?: WorkspaceBoardVisibilityRule;
}
```

Rule:

```txt
Widget instance config is stored as JSON, but each widget kind must validate and narrow config through a typed schema before rendering.
```

## Rendering Flow

The intended flow is:

1. Runtime resolves operating context, permissions, layout, and data bindings.
2. Runtime validates the board instance and each widget instance.
3. Runtime selects an approved render adapter by `kind`.
4. The adapter receives typed, narrowed props and state.
5. The adapter renders presentation only.

Phase 7A implements render adapters. It does not implement the runtime,
editor, persistence, or permission resolver.

## Grid Metadata

Grid layout metadata follows the existing ERP direction: zero-based `x`/`y`,
positive width and height spans, and optional min/max constraints.

```ts
export interface WorkspaceBoardWidgetLayout {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly minW?: number;
  readonly minH?: number;
  readonly maxW?: number;
  readonly maxH?: number;
}
```

Initial sizing convention:

| Widget class | Initial grid convention |
|--------------|-------------------------|
| compact metric/stat | minimum `2x2` |
| standard card | default `3x2` or `4x2` |
| chart | default `4x3` or `8x3` |
| table | default `12x4` |
| evidence/report | default `4x3` |

Grid sizes are manifest defaults. Runtime may enforce tenant or product-level
constraints, but studio widgets must remain grid-compatible and responsive
within those bounds.

## State Model

WorkspaceBoard-compatible widgets must be able to render data-adjacent states
without owning the data fetch:

- loading
- empty
- error
- unavailable
- ready

Unavailable covers authorized-but-unavailable product states such as disabled
features, disconnected data sources, or temporarily unsupported bindings.
Permission denial remains a runtime concern unless a future presentation
contract explicitly adds a forbidden state.

## Security / Permission Boundary

Widget manifests may declare required capabilities. They must not perform
permission checks inside `shadcn-studio-v2`.

Runtime authorities must:

- resolve tenant and operating context
- evaluate user permissions and capabilities
- approve data-source bindings
- validate JSON config before rendering
- prevent raw SQL, raw React, and unauthorized data source execution

Render adapters must:

- accept already-authorized data props
- expose accessible labels and state text
- avoid hidden business rules
- avoid local permission constants
- avoid tenant, auth, database, and route imports

## Alternatives Considered

### Build static dashboard components in Phase 7A

Rejected. Static dashboards create dead layouts and push tenant-specific
arrangement into the shared presentation package.

### Put drag/resize behavior inside widget components

Rejected. Drag and resize belong to a runtime/editor layer. Widgets must remain
headless render adapters that can fit any approved board shell.

### Use fixed data-source IDs in every widget manifest

Rejected as the default. Some widgets need a class of approved data bindings,
especially for BI and statistics boards. `allowedDataSourceKinds` keeps the
contract flexible without moving data resolution into the studio package.

### Create a new WorkspaceBoard package now

Rejected for this ADR. A physical package, persistence schema, editor runtime,
or drag/drop library requires a later ADR.

## Consequences

Positive:

- Phase 7A can build useful widget surfaces without locking the product into
  fixed dashboards.
- ERP runtime contracts remain authoritative.
- BI, audit, executive, operations, and ERP workspace boards can share a future
  kernel vocabulary.
- Presentation components stay testable and business-logic-free.

Negative:

- Naming remains mixed while existing ERP runtime files still use dashboard
  terms.
- A later ADR is required before implementing persistence changes or package
  extraction. **Drag/resize library and frame ownership:** [ADR-0042](ADR-0042-workspaceboard-drag-resize-runtime.md) (Accepted).
- Widget manifests and schema validation are not implemented by this ADR.

## Acceptance Criteria

- ADR-0041 exists and links to ADR-0027, PAS-006, Phase 7A, and current ERP
  dashboard layout contracts.
- WorkspaceBoard naming is used consistently for future architecture concepts.
- `DashboardCanvasClient` is not used.
- Phase 7A docs reject dead dashboards and define widgets as render adapters.
- Architecture docs preserve the studio/runtime boundary.
- Existing ERP contracts are described as current runtime authority.
- No code or package creation is required for this ADR pass.

