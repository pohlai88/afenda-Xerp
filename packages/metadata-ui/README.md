# `@afenda/metadata-ui`

**Architecture layer:** Metadata  
**Lifecycle:** Active  
**Registry ID:** PKG-012  
**TIP:** Post-TIP-005 — Metadata UI Implementation  
**Depends on:** `@afenda/metadata`, `@afenda/design-system`, `@afenda/ui`

## What this package is

`@afenda/metadata-ui` is the **Metadata UI implementation layer**. It implements the renderer system, section types, schemas, and permission-aware visibility that turn metadata surface definitions (governed by `@afenda/metadata`) into renderable UI contracts.

This package is **implementation**, not authority. It owns renderer implementation. It does not own metadata architecture — that is owned by `@afenda/metadata`.

## Ownership boundary

| This package owns | This package does NOT own |
| --- | --- |
| Renderer implementation | Metadata architecture |
| Section type schemas | Design tokens or recipes |
| Permission-aware visibility resolution | ERP business rules |
| Renderer registry and resolution | AppShell implementation |
| Governed surface examples | Permission authority |

## Relationship to `@afenda/metadata`

`@afenda/metadata` owns the **architecture vocabulary** (what surface types, layout types, and section types exist). This package **implements** against that vocabulary. The two must remain separate packages — see `metadataUiIntegrationRule` (or `crossPackageAuthority.metadataUiIntegrationRule`) in `@afenda/metadata`.

`@afenda/metadata-ui` declares a workspace dependency on `@afenda/metadata` in `package.json` and must consume governed contracts rather than redefining vocabulary arrays.

```
@afenda/metadata ───────────▶ @afenda/metadata-ui
  (governance, authority)       (implementation)

@afenda/design-system ─────▶ @afenda/metadata-ui
  (tokens, recipes, components)
```

## Public API

### Contracts

```typescript
import type {
  MetadataSurfaceContract,   // Full surface definition with layout, sections, state, actions
  MetadataSectionContract,   // Section with type, fields, columns, state, permissions
  MetadataSectionType,       // "page-header" | "action-bar" | "list" | "form" | "stat" | ...
  MetadataLayoutContract,    // Layout regions and density
  MetadataRendererContract,  // Renderer id, priority, recipe, sectionTypes, stable flag
  MetadataRendererResolution,// Resolution result: renderer | null + reason
  MetadataStateContract,     // Surface state definition
  MetadataActionContract,    // Action definition with execution mode and audit
  MetadataPermissionRequirement, // Permission check definition
  MetadataRegistryContract,  // Registry snapshot
} from "@afenda/metadata-ui";
```

### Renderer registry

```typescript
import {
  createMetadataRendererRegistry,
  type MetadataRendererRegistry,
} from "@afenda/metadata-ui";

const registry = createMetadataRendererRegistry();
registry.register(myRenderer);
const resolution = registry.resolve("list");
```

### Default renderers

```typescript
import { defaultMetadataRenderers } from "@afenda/metadata-ui";

// Array of stable renderer definitions covering all governed section types
```

### State presentation

```typescript
import {
  resolveMetadataStatePresentation,
  type MetadataStatePresentation,
} from "@afenda/metadata-ui";
```

### Permission-aware visibility

```typescript
import {
  resolveMetadataVisibility,
  resolveMetadataActions,
} from "@afenda/metadata-ui";
```

### Schema validation

```typescript
import {
  validateMetadataSurface,
  validateMetadataSection,
  validateMetadataAction,
  metadataSectionSchemas,
} from "@afenda/metadata-ui";
```

### Section types

```typescript
import {
  governedMetadataSectionTypes,
  METADATA_SECTION_TYPES,
} from "@afenda/metadata-ui";

// METADATA_SECTION_TYPES:
// "page-header" | "action-bar" | "list" | "form" | "stat" |
// "chart" | "kanban" | "detail-tabs" | "audit-panel" | "empty-state" | "surface-chrome"
```

### Governed examples (AI imitation patterns)

```typescript
import {
  governedMetadataSurfaceExample,
  exampleRendererRegistration,
  createExampleRendererRegistry,
} from "@afenda/metadata-ui";
```

## Installation

```bash
# Workspace-internal only. Not published to npm.
pnpm add @afenda/metadata-ui --workspace
```

## Commands

```bash
pnpm --filter @afenda/metadata-ui typecheck
pnpm --filter @afenda/metadata-ui test
pnpm --filter @afenda/metadata-ui build
pnpm --filter @afenda/metadata-ui check:governance
```

## Governance rules

| AI may | AI may not |
| --- | --- |
| Implement renderers by consuming `@afenda/metadata` contracts | Define new metadata authority domains |
| Add section types to `METADATA_SECTION_TYPES` with a governed schema | Invent layout arrangements outside `@afenda/metadata` governance |
| Register renderers via `createMetadataRendererRegistry` | Create parallel metadata governance contracts in this package |
| Generate examples that follow `GovernedExample.imitationOnly: true` | Bypass `@afenda/design-system` tokens in renderer recipes |
