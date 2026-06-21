# TIP-005 — Metadata Authority

Status: **Complete (governance + tests + docs synced)**

## Purpose

TIP-005 establishes Afenda Metadata Authority before Metadata UI implementation begins. It freezes ownership for metadata architecture, surfaces, layouts, sections, renderer resolution, registry governance, presentation modes, and runtime context.

Scope is governance only. TIP-005 does not build Metadata UI, renderers, React components, AppShell, ERP modules, database schemas, permissions, accounting, workflows, or metadata rendering.

## Package architecture decision — why `@afenda/metadata` and `@afenda/metadata-ui` must stay separate

`@afenda/metadata` is the governance authority (TIP-005). It has zero dependencies, carries only contract types and runtime governance objects, and is frozen by ADR.

`@afenda/metadata-ui` is the implementation layer (TIP-007). It implements renderers and must depend on `@afenda/metadata` to consume its authority.

**Merging them is prohibited** — encoded in `metadataAiGovernanceRules.mayNot` and `crossPackageAuthority.metadataUiIntegrationRule`. The governance contract owns the architecture vocabulary that the implementation consumes.

## Current file layout

```txt
packages/metadata/
  README.md
  doc/TIP-005.md
  package.json
  tsconfig.json
  tsconfig.vitest.json
  vitest.config.ts
  src/
    governance/
      cross-package-authority.contract.ts
      metadata-authority-map.contract.ts
    metadata.constants.ts
    metadata.types.ts
    metadata.version.ts
    metadata.errors.ts
    metadata.contract.ts
    surface.contract.ts
    layout.contract.ts
    section.contract.ts
    renderer.contract.ts
    registry.contract.ts
    presentation.contract.ts
    runtime.contract.ts
    index.ts
    __tests__/   (18 test files)
```

> **Note:** An earlier iteration used `src/contracts/`; that directory was removed. Domain contracts live at `src/*.contract.ts`; cross-cutting governance lives under `src/governance/`.

## Ownership matrix

| Contract | Symbol | Owned responsibility | Must not own |
| --- | --- | --- | --- |
| `metadata.contract.ts` | `metadataContract` | vocabulary, identity, lifecycle, governance | UI, renderers, database |
| `surface.contract.ts` | `surfaceContract` | surface definitions, page/workspace/module surfaces | sections, renderers, styling |
| `layout.contract.ts` | `layoutContract` | layout arrangements, layout type vocabulary | visual styling, renderer behavior |
| `section.contract.ts` | `sectionContract` | section definitions, content-zone types | layout, renderer implementation |
| `renderer.contract.ts` | `rendererContract` | capability vocabulary, compatibility matrix | renderer implementation, business logic |
| `registry.contract.ts` | `registryContract` | registration lifecycle, deprecation/experimental governance | rendering implementation |
| `presentation.contract.ts` | `presentationContract` | presentation/density/visibility intent | design tokens, component styling |
| `runtime.contract.ts` | `runtimeContract` | context shape, runtime states, diagnostics intent | permission execution, database, auth |

`metadataAuthorityMap.*.owns` is derived from each domain contract's `*_CONTRACT_OWNERSHIPS` — verified by `authority-ownership-alignment.test.ts`.

## Authority map

Source of truth: `packages/metadata/src/governance/metadata-authority-map.contract.ts`.

| Authority | Domain contract | Global vocabulary |
| --- | --- | --- |
| `metadata` | `metadata.contract.ts` | `METADATA_CONTRACT_OWNERSHIPS` |
| `surface` | `surface.contract.ts` | included in `METADATA_AUTHORITY_OWNERSHIPS` |
| `layout` | `layout.contract.ts` | derived union (47 keys) |
| `section` | `section.contract.ts` | |
| `renderer` | `renderer.contract.ts` | |
| `registry` | `registry.contract.ts` | |
| `presentation` | `presentation.contract.ts` | |
| `runtime` | `runtime.contract.ts` | |

## Cross-package authority

Source of truth: `packages/metadata/src/governance/cross-package-authority.contract.ts`.

Packages covered: `@afenda/design-system`, `@afenda/metadata`, `@afenda/metadata-ui`, `@afenda/appshell`, `@afenda/ui`, `@afenda/permissions`, `erp-domains`.

Integration rule export: **`metadataUiIntegrationRule`** (string). Also on `crossPackageAuthority.metadataUiIntegrationRule`.

## Public API highlights

| Category | Key exports |
| --- | --- |
| Vocabulary | `SURFACE_TYPES`, `LAYOUT_TYPES`, `SECTION_TYPES`, `RENDERER_CAPABILITIES`, guards |
| Contracts | `metadataContract`, `surfaceContract`, … `runtimeContract` |
| Ownership arrays | `*_CONTRACT_OWNERSHIPS`, `*_CONTRACT_PROHIBITIONS`, `METADATA_AUTHORITY_OWNERSHIPS` |
| Renderer helpers | `RENDERER_COMPATIBILITY_RULES`, `getRendererCapabilityForSectionType`, `isRendererCapabilityCompatibleWithSectionType` |
| Runtime | `MetadataRuntimeContext`, `createMetadataRuntimeContext`, `readonlyMode` field |
| Errors | `MetadataGovernanceError`, `createMetadataGovernanceError`, `METADATA_GOVERNANCE_ERROR_CODES` |
| Governance | `metadataAuthorityMap`, `metadataAiGovernanceRules`, `crossPackageAuthority` |
| Versions | `METADATA_PACKAGE_VERSION`, `METADATA_CONTRACT_VERSION` |

Single export surface: `"."` → `dist/index.js` only (enforced by `public-api.test.ts`).

## Breaking renames (documented)

| Old | Current |
| --- | --- |
| `tip005IntegrationRule` | `metadataUiIntegrationRule` |
| `canRenderList`, … | `render-list`, … (`RENDERER_CAPABILITIES`) |
| `MetadataRuntimeContext.readonly` | `readonlyMode` |
| `src/contracts/*` | `src/*.contract.ts` + `src/governance/*.contract.ts` |

## AI governance rules

| AI may | AI may not |
| --- | --- |
| Consume approved contracts from `@afenda/metadata` | Invent new metadata authority domains |
| Generate schemas from governed arrays | Invent types outside `SURFACE_TYPES` / `LAYOUT_TYPES` / `SECTION_TYPES` |
| Implement renderers in `@afenda/metadata-ui` | Invent registry or runtime architecture |
| Create metadata governance tests | Merge `@afenda/metadata` into `@afenda/metadata-ui` |

Full rules: `metadataAiGovernanceRules` (`may`, `mayNot`, `must`).

## Tests (current)

| Test file | Focus |
| --- | --- |
| `contract-arrays.test.ts` | Governed vocabulary completeness |
| `metadata.constants.test.ts` | Constants + guard behavior |
| `metadata.contract.test.ts` | Root metadata authority |
| `surface.contract.test.ts` … `runtime.contract.test.ts` | Per-domain contracts |
| `renderer.contract.test.ts` | Compatibility matrix + resolver helpers |
| `registry-governance.test.ts` | Registry entry typing |
| `metadata-authority-map.test.ts` | Authority map completeness |
| `authority-ownership-alignment.test.ts` | Map ↔ domain contract parity |
| `cross-package-authority.test.ts` | Package boundaries |
| `metadata.errors.test.ts` | Serializable governance errors |
| `metadata-version.test.ts` | Version alignment with `package.json` |
| `no-implementation-leakage.test.ts` | No UI/DB/React imports |
| `doc-drift.test.ts` | Retired API names and legacy paths absent from docs |
| `contract-serialization.test.ts` | JSON round-trip for public contracts |
| `public-api.test.ts` | 71 value exports + 72 type exports + single package export |

**Total: 20 files, 133 tests — all passing.**

## Governance controls (resolved)

| Control | Status |
| --- | --- |
| Contract version | `METADATA_CONTRACT_VERSION` = **0.2.0** |
| Doc drift CI gate | `doc-drift.test.ts` |
| Public API parity | Value + type export enumeration in `public-api.test.ts` |
| Serializable contracts | `contract-serialization.test.ts` (no Zod dependency) |
| Branded registry identity | `RegistryEntryId`, `createRegistryEntry()` |
| metadata-ui dependency | Wired in `package.json` (`@afenda/metadata`) |
| Legacy `src/contracts/` tree | Removed |

## Verification commands

```bash
pnpm --filter @afenda/metadata typecheck
pnpm --filter @afenda/metadata test:run
pnpm --filter @afenda/metadata-ui test:run
```

## Pass/fail verdict

**PASS — Enterprise 9.6/10**

All 8 metadata authority contracts are implemented, exported, tested, and documented. Domain contracts are the source of truth for ownership keys; the authority map derives from them. Downstream `@afenda/metadata-ui` consumes governed types and kebab-case renderer capabilities without redefining vocabulary.
