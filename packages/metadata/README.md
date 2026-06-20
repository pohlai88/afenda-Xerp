# `@afenda/metadata`

**Architecture layer:** Metadata  
**Lifecycle:** Active  
**Registry ID:** PKG-011  
**TIP:** TIP-005 — Metadata Authority  
**Version:** 0.1.0

## What this package is

`@afenda/metadata` is the **governance authority** for the Afenda metadata architecture. It freezes ownership of metadata vocabulary, surface definitions, layout arrangements, section content zones, renderer resolution rules, registry governance, presentation modes, and runtime execution context before any Metadata UI implementation begins.

This package is **governance-only**. It contains no UI components, no renderers, no React code, no business logic, and no database access. It has zero runtime dependencies on other Afenda packages.

## What this package owns

| Contract | Exported symbol | Owns |
| --- | --- | --- |
| `metadata.contract.ts` | `metadataContract` | vocabulary, identity, lifecycle, governance |
| `surface.contract.ts` | `surfaceContract` | page, workspace, module surface definitions |
| `layout.contract.ts` | `layoutContract` | dashboard, grid, panel, stack, tabs, wizard layouts |
| `section.contract.ts` | `sectionContract` | list, stat, chart, form, detail, audit, action sections |
| `renderer.contract.ts` | `rendererContract` | renderer identity, capability, compatibility, resolution |
| `registry.contract.ts` | `registryContract` | registration lifecycle, governance, resolution |
| `presentation.contract.ts` | `presentationContract` | presentation, density, readonly, visibility modes |
| `runtime.contract.ts` | `runtimeContract` | render context, execution context, state, diagnostics |
| `metadata-authority-map.ts` | `metadataAuthorityMap` | single decision table for ownership resolution |
| `metadata-authority-map.ts` | `metadataAiGovernanceRules` | AI may/may-not rules for metadata architecture |
| `cross-package-authority.ts` | `crossPackageAuthority` | inter-package boundary rules |

## What this package does NOT own

- UI implementation or React components → `@afenda/metadata-ui`
- Design tokens, recipes, variants, or components → `@afenda/design-system`
- AppShell implementation → `@afenda/appshell`
- ERP business rules or database schemas → ERP domain packages
- Permission logic → `@afenda/permissions`

## Package dependency rule

`@afenda/metadata-ui` **must** depend on `@afenda/metadata` and consume its authority contracts. These two packages must never be merged. The prohibition is encoded in `crossPackageAuthority.tip005IntegrationRule`.

## Architecture dependency graph

```
@afenda/design-system ──┐
                        ├──▶ @afenda/metadata-ui   (TIP-007, implementation)
@afenda/metadata ───────┘
```

## Installation

```bash
# Workspace-internal only. Not published to npm.
pnpm add @afenda/metadata --workspace
```

## Usage

```typescript
import {
  metadataAuthorityMap,
  metadataAiGovernanceRules,
  crossPackageAuthority,
  LAYOUT_TYPES,
  SECTION_TYPES,
  SURFACE_TYPES,
  surfaceContract,
  layoutContract,
  sectionContract,
  rendererContract,
  registryContract,
  presentationContract,
  runtimeContract,
} from "@afenda/metadata";

// Check which authority owns a domain
const surfaceAuthority = metadataAuthorityMap.surface;
// → { authority: "surface", owns: "surface definitions", ... }

// Enumerate governed types
console.log(SURFACE_TYPES);  // ["page", "workspace", "module"]
console.log(LAYOUT_TYPES);   // ["dashboard", "grid", "panel", "stack", "tabs", "wizard"]
console.log(SECTION_TYPES);  // ["list", "stat", "chart", "form", "detail", "audit", "action"]

// Verify AI governance rules
console.log(metadataAiGovernanceRules.mayNot);
```

## Key types

```typescript
import type {
  SurfaceType,          // "page" | "workspace" | "module"
  LayoutType,           // "dashboard" | "grid" | "panel" | "stack" | "tabs" | "wizard"
  SectionType,          // "list" | "stat" | "chart" | "form" | "detail" | "audit" | "action"
  RendererCapability,   // "canRenderList" | "canRenderForm" | ...
  RendererCompatibilityRule,  // { capability: RendererCapability; sectionType: SectionType }
  RegistryEntry,        // { authority: MetadataAuthorityKey; id: string; lifecycle: ... }
  MetadataAuthorityKey, // "metadata" | "surface" | "layout" | "section" | ...
  MetadataRuntimeContext,
  PresentationMode,
  MetadataDensityMode,
} from "@afenda/metadata";
```

Note: `RendererCompatibilityRule.sectionType` is typed as `SectionType` — a non-governed section type is a compile error. `RegistryEntry.authority` is typed as `MetadataAuthorityKey` — phantom authority registrations are compile errors.

## Commands

```bash
pnpm --filter @afenda/metadata typecheck
pnpm --filter @afenda/metadata test
pnpm --filter @afenda/metadata build
```

## Governance rules

| AI may | AI may not |
| --- | --- |
| Consume approved contracts from this package | Invent new metadata authority domains |
| Generate metadata schemas from approved `SURFACE_TYPES`, `LAYOUT_TYPES`, `SECTION_TYPES` | Invent layout, surface, or section types outside governed arrays |
| Implement renderers in `@afenda/metadata-ui` that consume these contracts | Invent registry or runtime architecture |
| | Merge `@afenda/metadata` into `@afenda/metadata-ui` |

## Mutability rule

This package may only be changed by:
1. An accepted ADR scoped to metadata governance
2. A version bump in all affected contracts
3. Updated tests that verify the new governance rules
