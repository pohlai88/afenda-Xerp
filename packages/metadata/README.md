# `@afenda/metadata`

**Architecture layer:** Metadata  
**Lifecycle:** Active  
**Registry ID:** PKG-011  
**TIP:** TIP-005 — Metadata Authority  
**Version:** 0.2.0

## What this package is

`@afenda/metadata` is the **governance authority** for the Afenda metadata architecture. It freezes ownership of metadata vocabulary, surface definitions, layout arrangements, section content zones, renderer resolution rules, registry governance, presentation modes, and runtime execution context before any Metadata UI implementation begins.

This package is **governance-only**. It contains no UI components, no renderers, no React code, no business logic, and no database access. It has zero runtime dependencies on other Afenda packages.

## Source layout

```txt
packages/metadata/src/
  governance/
    cross-package-authority.contract.ts   # inter-package boundaries
    metadata-authority-map.contract.ts    # authority map (derives from domain contracts)
  metadata.constants.ts                   # governed vocabulary — single source of truth
  metadata.types.ts                       # type re-export bridge (no manual unions)
  metadata.version.ts                     # package + contract version constants
  metadata.errors.ts                      # serializable governance errors
  metadata.contract.ts                    # root metadata authority
  surface.contract.ts
  layout.contract.ts
  section.contract.ts
  renderer.contract.ts
  registry.contract.ts
  presentation.contract.ts
  runtime.contract.ts
  index.ts                                # sole public export surface
  __tests__/                              # 18 governance test files (125 tests)
```

## What this package owns

| File | Exported symbol | Owns |
| --- | --- | --- |
| `metadata.contract.ts` | `metadataContract` | vocabulary, identity, lifecycle, governance, authority identity |
| `surface.contract.ts` | `surfaceContract` | surface definitions, page/workspace/module surfaces |
| `layout.contract.ts` | `layoutContract` | layout arrangements, dashboard/grid/panel/stack/tabs/wizard |
| `section.contract.ts` | `sectionContract` | section definitions, list/stat/chart/form/detail/audit/action |
| `renderer.contract.ts` | `rendererContract` | renderer identity, capability, compatibility, resolution |
| `registry.contract.ts` | `registryContract` | registration lifecycle, registry authority, deprecation/experimental governance |
| `presentation.contract.ts` | `presentationContract` | presentation modes, density, readonly rules, visibility |
| `runtime.contract.ts` | `runtimeContract` | render context shape, runtime state, diagnostics intent |
| `governance/metadata-authority-map.contract.ts` | `metadataAuthorityMap` | decision table — `owns` derived from domain contracts |
| `governance/metadata-authority-map.contract.ts` | `metadataAiGovernanceRules` | AI may / may-not / must rules |
| `governance/cross-package-authority.contract.ts` | `crossPackageAuthority` | cross-package boundary rules |
| `metadata.constants.ts` | `SURFACE_TYPES`, guards, … | governed vocabulary arrays and type guards |
| `metadata.errors.ts` | `MetadataGovernanceError` | typed, serializable governance errors |

Each domain contract also exports `*_CONTRACT_OWNERSHIPS` and `*_CONTRACT_PROHIBITIONS` arrays for CI validation.

## What this package does NOT own

- UI implementation or React components → `@afenda/metadata-ui`
- Design tokens, recipes, variants, or components → `@afenda/design-system`
- AppShell implementation → `@afenda/appshell`
- ERP business rules or database schemas → ERP domain packages
- Permission logic → `@afenda/permissions`

## Package dependency rule

`@afenda/metadata-ui` **must** depend on `@afenda/metadata` and consume its authority contracts. These two packages must never be merged. The prohibition is encoded in `metadataUiIntegrationRule` (also available on `crossPackageAuthority.metadataUiIntegrationRule`).

## Architecture dependency graph

```txt
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
  metadataUiIntegrationRule,
  LAYOUT_TYPES,
  SECTION_TYPES,
  SURFACE_TYPES,
  METADATA_RUNTIME_STATES,
  RENDERER_COMPATIBILITY_RULES,
  isSurfaceType,
  isRendererCapabilityCompatibleWithSectionType,
  getRendererCapabilityForSectionType,
  createMetadataRuntimeContext,
  createRegistryEntry,
  createMetadataGovernanceError,
  surfaceContract,
  layoutContract,
  sectionContract,
  rendererContract,
  registryContract,
  presentationContract,
  runtimeContract,
  METADATA_CONTRACT_VERSION,
} from "@afenda/metadata";

const surfaceAuthority = metadataAuthorityMap.surface;
console.log(SURFACE_TYPES);
console.log(isSurfaceType("page"));
console.log(isRendererCapabilityCompatibleWithSectionType("render-list", "list"));
console.log(metadataUiIntegrationRule);
console.log(METADATA_CONTRACT_VERSION);

const runtime = createMetadataRuntimeContext({
  density: "default",
  presentationMode: "default",
  state: "ready",
  readonlyMode: false,
});
```

## Key types

```typescript
import type {
  SurfaceType,
  LayoutType,
  SectionType,
  RendererCapability,
  RendererCompatibilityRule,
  RegistryEntry,
  MetadataAuthorityKey,
  MetadataRuntimeContext,
  CreateMetadataRuntimeContextInput,
  PresentationMode,
  MetadataDensityMode,
  MetadataLifecycle,
  MetadataRuntimeState,
  MetadataGovernanceErrorCode,
  SerializedMetadataGovernanceError,
} from "@afenda/metadata";
```

- `RendererCompatibilityRule.sectionType` is typed as `SectionType` — a non-governed section type is a compile error.
- `RegistryEntry.authority` is typed as `MetadataAuthorityKey` — phantom authority registrations are compile errors.
- `MetadataRuntimeContext.readonlyMode` carries readonly intent (not `readonly`).
- `RENDERER_CAPABILITIES` use kebab-case keys (`render-list`, not `canRenderList`).

## Renderer capability mapping

| Capability | Section type |
| --- | --- |
| `render-list` | `list` |
| `render-stat` | `stat` |
| `render-chart` | `chart` |
| `render-form` | `form` |
| `render-detail` | `detail` |
| `render-audit` | `audit` |
| `render-action` | `action` |

Use `getRendererCapabilityForSectionType(sectionType)` or `isRendererCapabilityCompatibleWithSectionType(capability, sectionType)` at resolution boundaries.

Registry entries should be created with `createRegistryEntry()` so `RegistryEntryId`, `RegistryOwnerPackage`, and `RegistryEntryVersion` stay boundary-safe while remaining JSON-serializable strings at runtime.

## Commands

```bash
pnpm --filter @afenda/metadata typecheck
pnpm --filter @afenda/metadata test:run
pnpm --filter @afenda/metadata build
```

## Governance rules

| AI may | AI may not |
| --- | --- |
| Consume approved contracts from this package | Invent new metadata authority domains |
| Generate metadata schemas from approved governed arrays | Invent layout, surface, or section types outside governed arrays |
| Implement renderers in `@afenda/metadata-ui` | Invent registry or runtime architecture |
| Create tests for metadata governance | Merge `@afenda/metadata` into `@afenda/metadata-ui` |

See `metadataAiGovernanceRules` for the full machine-readable rule set (`may`, `mayNot`, `must`).

## Mutability rule

This package may only be changed by:

1. An accepted ADR scoped to metadata governance
2. A version bump in all affected contracts (`METADATA_CONTRACT_VERSION`)
3. Updated tests that verify the new governance rules

## Further reading

- Implementation spec: `doc/TIP-005.md`
- Delivery record: `docs/delivery/tip-005-metadata-authority.md`
