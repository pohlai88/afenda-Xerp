You are implementing **TIP-007 — Metadata UI Renderer Authority** for the Afenda monorepo.

Your task is to create and harden the package:

```txt
packages/metadata-ui
```

Package name:

```txt
@afenda/metadata-ui
```

Registry ID:

```txt
PKG-012
```

Architecture layer:

```txt
Metadata UI
```

Lifecycle:

```txt
Active
```

Version:

```txt
0.1.0
```

This package is the **implementation layer** for governed metadata rendering. It consumes `@afenda/metadata` contracts and renders governed metadata surfaces, layouts, sections, states, actions, diagnostics, and renderer resolution.

This package must **not** redefine metadata authority. It must not invent new surface types, layout types, section types, runtime states, presentation modes, density modes, or registry rules.

---

# 1. Enterprise Objective

Implement `@afenda/metadata-ui` as the official Afenda metadata rendering package.

It must:

* consume `@afenda/metadata`
* render governed surfaces
* render governed layouts
* render governed sections
* resolve renderers through governed registry rules
* provide server/client-safe entry points
* support readonly, loading, empty, error, forbidden, degraded, partial, invalid, and diagnostic states
* support action rendering without owning action business logic
* support metadata-driven page composition
* integrate with `@afenda/design-system`
* use `@afenda/ui` primitives where needed
* expose a stable public API
* prevent authority drift through tests

It must not become a business package, permission package, database package, AppShell package, or design-system package.

---

# 2. Required File Locations

Create this package structure:

```txt
packages/metadata-ui/
  README.md
  package.json
  tsconfig.json
  src/
    index.ts
    client.ts
    server.ts

    contracts/
      metadata-ui.contract.ts
      render-context.contract.ts
      renderer-definition.contract.ts
      action.contract.ts
      state.contract.ts
      section.contract.ts
      layout.contract.ts
      surface.contract.ts
      diagnostics.contract.ts
      action-renderer.contract.ts
      section-renderer.contract.ts
      surface-renderer.contract.ts
      layout-renderer.contract.ts

    runtime/
      index.ts
      runtime.contract.ts
      create-metadata-ui-render-context.ts
      resolve-metadata-render-state.ts
      assert-metadata-ui-boundary.ts
      metadata-ui-error.ts

    registry/
      index.ts
      registry.contract.ts
      renderer-compatibility.ts
      create-metadata-renderer-definition.ts
      metadata-renderer-registry.ts
      resolve-metadata-renderer.ts
      default-renderer-registry.ts

    presentation/
      index.ts
      presentation.contract.ts
      resolve-presentation.ts

    surfaces/
      index.tsx
      metadata-surface.tsx

    layouts/
      index.tsx
      metadata-layout.tsx
      wizard-layout.tsx
      metadata-layout.types.ts

    sections/
      index.tsx
      metadata-section.tsx

    states/
      index.tsx
      metadata-state.tsx

    actions/
      metadata-action-bar.tsx
      metadata-action-button.tsx
      metadata-action-menu.tsx
      metadata-action.types.ts

    diagnostics/
      index.ts
      create-metadata-diagnostics-snapshot.ts
      metadata-diagnostics-panel.tsx

    renderers/
      index.ts
      section-renderer.contract.ts
      create-section-renderer.tsx
      default-section-renderers.tsx

    fixtures/
      sample-page-surface.fixture.ts
      sample-dashboard-layout.fixture.ts
      sample-list-section.fixture.tsx
      sample-state.fixture.tsx
      sample-runtime-context.fixture.ts

    __tests__/
      metadata-ui-boundary.test.ts
      public-api.test.ts
      renderer-registry.test.ts
      renderer-resolution.test.ts
      governed-types-consumption.test.ts
      surface-rendering.test.tsx
      layout-rendering.test.tsx
      section-rendering.test.tsx
      state-rendering.test.tsx
      diagnostics-rendering.test.tsx
      no-authority-drift.test.ts
```

Do not place ERP business modules inside this package.

Do not place AppShell layout inside this package.

Do not place design tokens inside this package.

Do not place database access inside this package.

---

# 3. Package Configuration Requirement

Create `packages/metadata-ui/package.json` with:

```json
{
  "name": "@afenda/metadata-ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": "./dist/index.js",
    "./client": "./dist/client.js",
    "./server": "./dist/server.js"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "tsc -p tsconfig.json"
  }
}
```

Allowed dependencies:

```txt
@afenda/metadata
@afenda/design-system
@afenda/ui
react
react-dom
```

Optional only if already standardized in the monorepo:

```txt
class-variance-authority
clsx
tailwind-merge
@radix-ui/react-slot
```

Prohibited dependencies:

```txt
@afenda/database
@afenda/permissions
@afenda/appshell
@afenda/features-*
drizzle-orm
next
server-only
```

Important:

`@afenda/metadata-ui` may render permission-aware disabled/hidden states from metadata context, but it must not execute permission checks itself.

---

# 4. Entry Point Rules

Create three public entry points:

```txt
src/index.ts
src/client.ts
src/server.ts
```

## `src/index.ts`

Shared exports only:

* contracts
* types
* pure runtime helpers
* registry types
* renderer definition types
* fixtures if explicitly approved

Must not export browser-only or server-only implementation.

---

## `src/client.ts`

Client-safe exports:

* interactive metadata components
* action bar
* tabs layout
* wizard layout
* diagnostics panel
* client renderers

Must include `"use client"` only in files that need interactivity.

Do not put `"use client"` at root package index unless required.

---

## `src/server.ts`

Server-safe exports:

* server-compatible renderers
* pure surface composition helpers
* non-interactive renderer registry helpers

Must not import client-only files.

### Action handling by entry point

Surface components exported from `@afenda/metadata-ui/server` render **static action chrome** suitable for React Server Components (RSC). They use `MetadataSurfaceActionBar` internally — the same governed DOM contract (`data-slot`, `data-action-*`) as the interactive client bar, but without client event handlers.

| Entry | Action component | Button clicks | Confirm dialogs | Link navigation |
| --- | --- | --- | --- | --- |
| `@afenda/metadata-ui/server` | `MetadataSurfaceActionBar` (internal) | Renders inert buttons (no `onClick`) | Not supported | Works via `href` |
| `@afenda/metadata-ui/client` | `MetadataActionBar` | Via `onAction` callback | Via `window.confirm` when `confirm` metadata is set | Works via `href` |

**Server / RSC — static chrome**

Import surfaces from the server entry and pass governed `MetadataAction[]` on the `actions` prop. Link actions navigate; button actions appear but do not invoke handlers until a client wrapper hydrates them.

```tsx
import { MetadataPageSurface } from "@afenda/metadata-ui/server";

export function OrdersPage({ context, actions, content }) {
  return (
    <MetadataPageSurface
      actions={actions}
      context={context}
      identity={{ id: "orders", title: "Orders" }}
      slots={{ content }}
    />
  );
}
```

**Client — interactive handling**

Import `MetadataActionBar` from the client entry and wire an `onAction` callback. The package does not execute business logic, call server actions, or perform permission checks — the consumer owns handler implementation.

```tsx
"use client";

import { MetadataActionBar } from "@afenda/metadata-ui/client";
import type { MetadataActionHandler } from "@afenda/metadata-ui";

const handleAction: MetadataActionHandler = async (action, event) => {
  // Consumer-owned: route, mutate, open dialog, etc.
};

export function OrdersActionBar({ actions }) {
  return <MetadataActionBar actions={actions} onAction={handleAction} />;
}
```

To combine a server-rendered surface with interactive actions, either:

1. Pass pre-rendered action UI via `slots.toolbar` from a client child component, or
2. Render `MetadataActionBar` alongside the surface in a client boundary wrapper.

Do not import `@afenda/metadata-ui/client` from server components. Surfaces under `src/surfaces/` must not import `metadata-action-renderer.client.tsx`.

---

# 5. Required Dependency on `@afenda/metadata`

This package must consume the following from `@afenda/metadata`:

```ts
import type {
  SurfaceType,
  LayoutType,
  SectionType,
  PresentationMode,
  MetadataDensityMode,
  MetadataRuntimeState,
  MetadataRuntimeContext,
  RendererCapability,
  RendererCompatibilityRule,
  RegistryEntry,
} from "@afenda/metadata";

import {
  SURFACE_TYPES,
  LAYOUT_TYPES,
  SECTION_TYPES,
  RENDERER_CAPABILITIES,
  rendererContract,
  registryContract,
  runtimeContract,
  metadataAuthorityMap,
  crossPackageAuthority,
} from "@afenda/metadata";
```

Rules:

* Do not redefine these arrays.
* Do not copy these arrays.
* Do not create local duplicates.
* Do not introduce new section/layout/surface strings.
* Tests must fail if local duplicates are created.

---

# 6. Required Contracts

Create:

```txt
src/contracts/metadata-ui.contract.ts
```

Must export:

```ts
export const metadataUiContract = {
  packageName: "@afenda/metadata-ui",
  authority: "metadata-ui",
  consumes: "@afenda/metadata",
  owns: [
    "metadata rendering",
    "surface composition",
    "layout rendering",
    "section rendering",
    "renderer resolution",
    "metadata diagnostics presentation"
  ],
  doesNotOwn: [
    "metadata authority",
    "surface vocabulary",
    "layout vocabulary",
    "section vocabulary",
    "permission execution",
    "database schemas",
    "ERP business rules",
    "AppShell navigation",
    "design tokens"
  ]
} as const;
```

---

# 7. Render Context Contract

Create:

```txt
src/contracts/render-context.contract.ts
```

Must define:

```ts
import type { MetadataRuntimeContext } from "@afenda/metadata";

export interface MetadataUiRenderContext {
  readonly runtime: MetadataRuntimeContext;
  readonly source: "server" | "client" | "static-preview";
  readonly diagnosticsEnabled: boolean;
  readonly strict: boolean;
}
```

Rules:

* The render context wraps metadata runtime context.
* It does not replace it.
* It does not add new authority.
* It may add rendering-specific information only.

---

# 8. Renderer Definition Contract

Create:

```txt
src/contracts/renderer-definition.contract.ts
```

Must define:

```ts
import type {
  RendererCapability,
  SectionType,
  RegistryEntry,
} from "@afenda/metadata";

import type { ReactNode } from "react";
import type { MetadataUiRenderContext } from "./render-context.contract";

export interface MetadataRendererDefinition<TInput = unknown> {
  readonly key: string;
  readonly registry: RegistryEntry;
  readonly capability: RendererCapability;
  readonly sectionType: SectionType;
  readonly priority: number;
  readonly render: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => ReactNode;
  readonly supports?: (
    input: TInput,
    context: MetadataUiRenderContext
  ) => boolean;
}
```

Rules:

* `sectionType` must use `SectionType` from `@afenda/metadata`.
* `capability` must use `RendererCapability` from `@afenda/metadata`.
* `registry.authority` must use `MetadataAuthorityKey` from `@afenda/metadata`.
* Renderer definitions may render UI, but may not define metadata authority.

---

# 9. Registry Requirement

Create:

```txt
src/registry/metadata-renderer-registry.ts
```

Must implement:

```ts
export interface MetadataRendererRegistry {
  register<TInput>(
    renderer: MetadataRendererDefinition<TInput>
  ): MetadataRendererRegistry;

  get(key: string): MetadataRendererDefinition | undefined;

  resolve(input: MetadataRendererResolveInput): MetadataRendererDefinition | undefined;

  entries(): readonly MetadataRendererDefinition[];

  keys(): readonly string[];

  has(key: string): boolean;
}
```

Create:

```ts
export function createMetadataRendererRegistry(
  initialRenderers?: readonly MetadataRendererDefinition[]
): MetadataRendererRegistry
```

Registry rules:

* Duplicate renderer keys must throw in development.
* Renderer section type must be governed.
* Renderer capability must be governed.
* Renderer capability must be compatible with section type.
* Registry must not mutate external arrays.
* Registry must return readonly entries.
* Registry must not import ERP business modules.
* Registry must not import database modules.
* Registry must not import permissions modules.

---

# 10. Renderer Resolution Requirement

Create:

```txt
src/registry/resolve-metadata-renderer.ts
```

Must resolve renderers by:

1. governed `sectionType`
2. governed `capability`
3. optional `supports()` match
4. highest priority
5. stable fallback order

Required behavior:

```ts
resolveMetadataRenderer({
  registry,
  sectionType,
  capability,
  input,
  context
})
```

Acceptance:

* returns matching renderer
* rejects incompatible capability/section pair
* prefers renderer with higher priority
* ignores renderers whose `supports()` returns false
* returns undefined when no renderer matches
* never creates a new renderer automatically
* never invents a section type

---

# 11. Surface Rendering Requirement

Create:

```txt
src/surfaces/
```

Required components:

```txt
MetadataSurface
MetadataPageSurface
MetadataWorkspaceSurface
MetadataModuleSurface
```

Surface props:

```ts
import type { SurfaceType } from "@afenda/metadata";
import type { ReactNode } from "react";
import type { MetadataUiRenderContext } from "../contracts/render-context.contract";

export interface MetadataSurfaceProps {
  readonly id: string;
  readonly type: SurfaceType;
  readonly title: string;
  readonly description?: string;
  readonly context: MetadataUiRenderContext;
  readonly children: ReactNode;
}
```

Rules:

* `type` must use `SurfaceType`.
* Surface rendering must not define new surface types.
* Surface rendering must not own AppShell.
* Surface may render within AppShell but must not import AppShell.
* Surface must expose semantic regions.
* Surface must support diagnostics display when enabled.

---

# 12. Layout Rendering Requirement

Create:

```txt
src/layouts/
```

Required components:

```txt
MetadataLayout
DashboardLayout
GridLayout
PanelLayout
StackLayout
TabsLayout
WizardLayout
```

Layout props:

```ts
import type { LayoutType } from "@afenda/metadata";
import type { ReactNode } from "react";
import type { MetadataUiRenderContext } from "../contracts/render-context.contract";

export interface MetadataLayoutProps {
  readonly id: string;
  readonly type: LayoutType;
  readonly context: MetadataUiRenderContext;
  readonly children: ReactNode;
}
```

Rules:

* `type` must use `LayoutType`.
* Do not create layout types outside `LAYOUT_TYPES`.
* Layout files must not own design tokens.
* Layout files may use approved `@afenda/ui` primitives.
* Layout files may apply class names, but should avoid raw design values.
* Layout must support compact/default/comfortable density through metadata context.

---

# 13. Section Rendering Requirement

Create:

```txt
src/sections/
```

Required components:

```txt
MetadataSection
ListSection
StatSection
ChartSection
FormSection
DetailSection
AuditSection
ActionSection
```

Section props:

```ts
import type { SectionType } from "@afenda/metadata";
import type { ReactNode } from "react";
import type { MetadataUiRenderContext } from "../contracts/render-context.contract";

export interface MetadataSectionProps {
  readonly id: string;
  readonly type: SectionType;
  readonly title?: string;
  readonly description?: string;
  readonly context: MetadataUiRenderContext;
  readonly children?: ReactNode;
}
```

Rules:

* `type` must use `SectionType`.
* Section must not create business logic.
* Section must not query data.
* Section must not execute permissions.
* Section may render readonly/disabled states based on context.
* Section must support diagnostics mode.
* Section must support empty/loading/error/forbidden/invalid states.

---

# 14. State Rendering Requirement

Create:

```txt
src/states/
```

Required components:

```txt
MetadataLoadingState
MetadataEmptyState
MetadataErrorState
MetadataForbiddenState
MetadataInvalidState
MetadataDegradedState
MetadataPartialState
MetadataReadonlyState
MetadataMaintenanceState
```

Rules:

* States must use `MetadataRuntimeState` from `@afenda/metadata`.
* States must be accessible.
* Error state must not expose stack traces by default.
* Forbidden state must not reveal hidden permission internals.
* Maintenance state must be neutral and operational.
* Degraded state must show partial availability without panic.
* Diagnostic details only render when `diagnosticsEnabled` is true.

---

# 15. Action Rendering Requirement

Implementation layout:

```txt
src/actions/metadata-action-presentation.ts   # shared sort/visibility helpers (pure)
src/surfaces/metadata-surface-actions.tsx     # server-safe MetadataSurfaceActionBar
src/client/metadata-action-renderer.client.tsx # interactive MetadataActionBar (+ "use client")
```

Required **client** components (exported from `@afenda/metadata-ui/client`):

```txt
MetadataActionBar
MetadataActionButton
MetadataActionMenu
```

Server surfaces use `MetadataSurfaceActionBar` internally when the `actions` prop is set. See **Entry Point Rules → Action handling by entry point** (§4) for the server vs client split.

Action contract:

```ts
export interface MetadataAction {
  readonly key: string;
  readonly label: string;
  readonly description?: string;
  readonly kind: "button" | "destructive" | "menu" | "link";
  readonly href?: string;
  readonly disabled?: boolean;
  readonly hidden?: boolean;
  readonly reason?: string;
  readonly confirm?: {
    readonly title: string;
    readonly description: string;
    readonly confirmLabel: string;
  };
}
```

Rules:

* Action rendering does not execute business logic.
* Action rendering does not call server actions.
* Action rendering may call an injected callback.
* Destructive action must require confirmation metadata.
* Hidden actions must not render.
* Disabled actions must explain reason when available.
* Link actions must require `href`.
* Button actions on **server surfaces** render static chrome only (no handler).
* Button actions on **client surfaces** must use `MetadataActionBar` with an injected `onAction` callback.

---

# 16. Diagnostics Requirement

Create:

```txt
src/diagnostics/
```

Required components:

```txt
MetadataDiagnosticsPanel
MetadataRenderTrace
MetadataBoundaryWarning
```

Diagnostics must show:

* surface type
* layout type
* section type
* renderer key
* renderer capability
* runtime state
* density mode
* presentation mode
* readonly mode
* diagnostics flag
* correlation ID if provided

Rules:

* Diagnostics render only when `diagnosticsEnabled` is true.
* Diagnostics must not leak secrets.
* Diagnostics must not show raw tokens.
* Diagnostics must not show stack traces by default.
* Diagnostics must not show permission internals.

---

# 17. Presentation Resolution Requirement

Create:

```txt
src/presentation/
```

Required functions:

```ts
resolvePresentationMode(context)
resolveDensityMode(context)
resolveReadonlyMode(context)
resolveVisibility(input, context)
```

Rules:

* Use modes from `@afenda/metadata`.
* Do not create local presentation modes.
* Do not create local density modes.
* Visibility must respect:

  * hidden metadata
  * readonly metadata
  * diagnostics mode
  * forbidden state
  * maintenance state

---

# 18. Runtime Requirement

Create:

```txt
src/runtime/
```

Required functions:

```ts
createMetadataUiRenderContext(input)
resolveMetadataRenderState(context)
assertMetadataUiBoundary(packageName)
```

Rules:

* `createMetadataUiRenderContext()` must require a valid `MetadataRuntimeContext`.
* Runtime must not query auth.
* Runtime must not query database.
* Runtime must not execute permissions.
* Runtime must not call server actions.
* Runtime must not call route handlers.
* Runtime may normalize rendering context only.

---

# 19. Default Renderers

Create:

```txt
src/renderers/
```

Required renderers:

```txt
default-section-renderers.tsx
create-section-renderer.tsx
section-renderer.contract.ts
index.ts
```

Each renderer must:

* register one governed `sectionType`
* register one governed `RendererCapability`
* use a governed `RegistryEntry`
* render a basic accessible shell
* avoid business logic
* avoid database access
* avoid permission execution
* avoid AppShell imports

Example:

```ts
export const listRenderer = {
  key: "metadata-ui.renderer.list.default",
  registry: {
    authority: "renderer",
    id: "metadata-ui.renderer.list.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui"
  },
  capability: "render-list",
  sectionType: "list",
  priority: 100,
  render(input, context) {
    return <ListSection id="list" type="list" context={context} />;
  }
} satisfies MetadataRendererDefinition;
```

---

# 20. Enterprise Tests Required

Create tests for:

## Boundary tests

```txt
metadata-ui-boundary.test.ts
```

Must verify:

* package imports `@afenda/metadata`
* package does not redefine governed arrays
* package does not import `@afenda/database`
* package does not import `@afenda/permissions`
* package does not import `@afenda/appshell`
* package does not import ERP feature packages

---

## Public API tests

```txt
public-api.test.ts
```

Must verify:

* `src/index.ts` exports shared contracts and types
* `src/client.ts` exports client renderers/components
* `src/server.ts` exports server-safe helpers
* no private internals are exported accidentally

---

## Renderer registry tests

```txt
renderer-registry.test.ts
```

Must verify:

* renderer registration works
* duplicate renderer keys fail
* registry returns readonly entries
* registry rejects incompatible capability/section pairs
* registry does not mutate external arrays

---

## Renderer resolution tests

```txt
renderer-resolution.test.ts
```

Must verify:

* renderer resolves by section type
* renderer resolves by capability
* higher priority wins
* unsupported renderer is skipped
* no matching renderer returns undefined
* no unknown section type is accepted

---

## Governed type consumption tests

```txt
governed-types-consumption.test.ts
```

Must verify:

* all surface types come from `@afenda/metadata`
* all layout types come from `@afenda/metadata`
* all section types come from `@afenda/metadata`
* all runtime states come from `@afenda/metadata`
* all renderer capabilities come from `@afenda/metadata`

---

## Rendering tests

```txt
surface-rendering.test.tsx
layout-rendering.test.tsx
section-rendering.test.tsx
state-rendering.test.tsx
diagnostics-rendering.test.tsx
```

Must verify:

* surfaces render semantic regions
* layouts render children
* sections render title/description
* states render accessible messages
* diagnostics render only when enabled
* diagnostics hide when disabled

---

## No authority drift tests

```txt
no-authority-drift.test.ts
```

Must fail if local source files define any of:

```txt
SURFACE_TYPES
LAYOUT_TYPES
SECTION_TYPES
PRESENTATION_MODES
METADATA_DENSITY_MODES
METADATA_RUNTIME_STATES
RENDERER_CAPABILITIES
METADATA_AUTHORITY_KEYS
```

Exception:

* test files may mention them only when asserting imports from `@afenda/metadata`

---

# 21. Enterprise Feature Requirements

## FTR-MDUI-001 — Metadata Contract Consumption

`@afenda/metadata-ui` must consume governed contracts from `@afenda/metadata`.

Acceptance:

* imports governed types from `@afenda/metadata`
* does not redefine metadata authority
* tests prove no local duplicates exist

---

## FTR-MDUI-002 — Renderer Registry

The package must provide a governed renderer registry.

Acceptance:

* registry supports register/get/resolve/entries/keys/has
* duplicate keys fail
* incompatible renderer pair fails
* entries are readonly
* resolver is deterministic

---

## FTR-MDUI-003 — Surface Rendering

The package must render page, workspace, and module surfaces.

Acceptance:

* `MetadataSurface` exists
* `MetadataPageSurface` exists
* `MetadataWorkspaceSurface` exists
* `MetadataModuleSurface` exists
* surface type uses `SurfaceType`
* no AppShell import exists

---

## FTR-MDUI-004 — Layout Rendering

The package must render governed layout types.

Acceptance:

* dashboard layout exists
* grid layout exists
* panel layout exists
* stack layout exists
* tabs layout exists
* wizard layout exists
* layout type uses `LayoutType`
* no local layout vocabulary exists

---

## FTR-MDUI-005 — Section Rendering

The package must render governed section types.

Acceptance:

* list section exists
* stat section exists
* chart section exists
* form section exists
* detail section exists
* audit section exists
* action section exists
* section type uses `SectionType`
* no local section vocabulary exists

---

## FTR-MDUI-006 — Runtime State Rendering

The package must render governed runtime states.

Acceptance:

* loading state exists
* empty state exists
* error state exists
* forbidden state exists
* invalid state exists
* degraded state exists
* partial state exists
* readonly state exists
* maintenance state exists
* states use `MetadataRuntimeState`

---

## FTR-MDUI-007 — Action Rendering

The package must render metadata actions without executing business logic.

Acceptance:

* action bar exists
* action button exists
* action menu exists
* destructive action requires confirmation
* hidden actions do not render
* disabled actions explain reason
* callbacks are injected by consumer

---

## FTR-MDUI-008 — Diagnostics Rendering

The package must render safe diagnostics.

Acceptance:

* diagnostics panel exists
* render trace exists
* boundary warning exists
* diagnostics render only when enabled
* secrets are not exposed
* stack traces are not exposed by default

---

## FTR-MDUI-009 — Server/Client Boundary

The package must expose proper server/client entry points.

Acceptance:

* shared exports in `index.ts`
* client exports in `client.ts`
* server exports in `server.ts`
* server entry does not import client-only files
* client-only files use `"use client"` only when needed
* server surfaces render static action chrome via `MetadataSurfaceActionBar`
* interactive button handling requires `@afenda/metadata-ui/client` + `MetadataActionBar` with `onAction`

---

## FTR-MDUI-010 — No Authority Drift

The package must not become a second metadata authority.

Acceptance:

* no governed arrays are redefined
* no metadata authority map is redefined
* no runtime states are invented
* no layout types are invented
* no surface types are invented
* no section types are invented
* no registry rules are invented outside TIP-005

---

# 22. Do Rules

Do:

* consume `@afenda/metadata`
* render metadata from governed contracts
* use `@afenda/ui` primitives where appropriate
* use `@afenda/design-system` for design vocabulary
* keep renderer registry deterministic
* keep renderer resolution testable
* keep diagnostics safe
* keep context serializable where possible
* keep server/client boundaries explicit
* keep implementation simple
* prefer composition over abstraction
* write tests for drift prevention
* write tests for rendering behavior
* expose stable public API

---

# 23. Prohibited Rules

Do not:

* redefine `SURFACE_TYPES`
* redefine `LAYOUT_TYPES`
* redefine `SECTION_TYPES`
* redefine `RENDERER_CAPABILITIES`
* redefine runtime states
* redefine presentation modes
* redefine density modes
* redefine metadata authority map
* create business logic
* query database
* execute permissions
* import AppShell
* import ERP feature packages
* create route handlers
* create server actions
* own design tokens
* own shadcn primitive definitions
* own AppShell navigation
* own permission decisions
* leak diagnostics secrets
* expose stack traces by default
* place `"use client"` everywhere
* make registry global mutable state without control
* silently accept invalid renderer compatibility

---

# 24. Definition of Done

TIP-007 is done only when:

* `@afenda/metadata-ui` package exists
* package depends on `@afenda/metadata`
* all required files exist
* server/client/shared entry points exist
* renderer registry is implemented
* renderer resolution is implemented
* all governed surfaces render
* all governed layouts render
* all governed sections render
* all governed runtime states render
* diagnostics render safely
* actions render without owning business logic
* public API is stable
* no metadata authority is redefined
* no forbidden package imports exist
* no AppShell dependency exists
* no database dependency exists
* no permission execution exists
* all tests pass
* typecheck passes
* build passes
* monorepo quality passes

---

# 25. Acceptance Commands

Run package gates:

```bash
pnpm --filter @afenda/metadata-ui typecheck
pnpm --filter @afenda/metadata-ui test
pnpm --filter @afenda/metadata-ui build
```

Run dependency package gates:

```bash
pnpm --filter @afenda/metadata typecheck
pnpm --filter @afenda/metadata test
pnpm --filter @afenda/metadata build
```

Run monorepo gates:

```bash
pnpm typecheck
pnpm test:run
pnpm build
pnpm quality
```

All commands must pass.

---

# 26. Final Completion Report Required

After implementation, provide:

```txt
TIP-007 Metadata UI Completion Report

1. Files created
2. Files modified
3. Public symbols exported
4. Metadata contracts consumed
5. Renderer registry implemented
6. Renderer resolution implemented
7. Surfaces implemented
8. Layouts implemented
9. Sections implemented
10. States implemented
11. Actions implemented
12. Diagnostics implemented
13. Server/client boundaries verified
14. No-authority-drift checks passed
15. Acceptance commands run
16. Remaining risks
17. Ready/not ready for ERP metadata surfaces
```

Do not mark TIP-007 complete unless all acceptance commands pass.
