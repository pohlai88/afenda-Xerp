# Slice P06-008-R1 — Metadata Binding Registry Enforcement (PAS-006D)

> **Position:** Slice `8-R1` in PAS-006 family · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-008 Delivered · P06-003 block slot/data contracts Delivered

**Status:** Delivered

**Type:** Implementation (enforcement hardening)

**Risk class:** Medium

**Clean Core impact:** A→A — inventory governance only; no TSX or ERP runtime rendering changes

## Authority decision

P06-008-R1 enforces metadata binding coverage at the presentation inventory layer.

It does not require TSX components to import metadata contracts.

The enforceable unit is the MCP seed `blockId`, not the React source file. A block is compliant only when the MCP seed manifest proves exactly one of:

1. a metadata binding exists; or
2. a metadata binding waiver exists.

Primitive components under `components/ui/*` are excluded by design because they are metadata-agnostic. ERP route rendering and DOM slot markers are deferred to later slices.

## Purpose

Enforce Presentation NS I7 and PAS-006D — 100% MCP seed block coverage with exactly one outcome per `blockId` (YES binding XOR NO waiver). Registry-first; no TSX import enforcement.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-008-r1-metadata-binding-enforcement.md

1. Objective    — Enforce metadata binding coverage for every MCP seed blockId via registry + waiver matrix + governance gate.
2. Allowed layer— packages/shadcn-studio/src/contracts · registry · __tests__ · index.ts · scripts/governance · docs/PAS/PRESENTATION
3. Files        —
   packages/shadcn-studio/src/contracts/metadata-binding-waiver.contract.ts
   packages/shadcn-studio/src/registry/metadata-binding-waiver.registry.ts
   packages/shadcn-studio/src/registry/metadata-binding-module-assignment.ts
   packages/shadcn-studio/src/registry/metadata-binding-overrides.registry.ts
   packages/shadcn-studio/src/registry/build-metadata-binding-from-data-contracts.ts
   packages/shadcn-studio/src/registry/assert-metadata-binding-coverage.ts
   packages/shadcn-studio/src/registry/metadata-binding.registry.ts
   packages/shadcn-studio/src/__tests__/metadata-binding-coverage.test.ts
   packages/shadcn-studio/src/__tests__/metadata-binding-waiver.registry.test.ts
   packages/shadcn-studio/src/__tests__/metadata-binding.registry.test.ts
   scripts/governance/check-studio-metadata-binding.mjs
   package.json
   docs/PAS/PRESENTATION/SLICE/p06-008-r1-metadata-binding-enforcement.md
   docs/PAS/PRESENTATION/PAS-006D-METADATA-DRIVEN-SURFACES-STANDARD.md
   docs/PAS/PRESENTATION/SLICE/presentation-slice-catalog.md
   docs/PAS/pas-status-index.md
4. Prohibited   — @afenda/kernel in shadcn-studio · TSX contract imports · components/ui scan · ERP route rendering · foundation-disposition.registry.ts · DOM slot markers (R2)
5. Authority    — PAS-006D · Presentation NS I7 · P06-008-R1 plan · kernel-authority (ERP projection boundary only)
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm check:studio-metadata-binding
   pnpm quality:boundaries
7. Closes       — Closes DoD #1–#4 · PAS-006D enforcement phase · NS I7 inventory gate
8. Evidence     —
   packages/shadcn-studio/src/registry/assert-metadata-binding-coverage.ts
   packages/shadcn-studio/src/__tests__/metadata-binding-coverage.test.ts
   scripts/governance/check-studio-metadata-binding.mjs
   packages/shadcn-studio/src/registry/metadata-binding.registry.ts
9. Attestation  — Contract · Test · Governance
```

## P06-008-R1 MUST rules

1. Every `blockId` in `MCP_SEED_BLOCK_MANIFEST` has exactly one coverage outcome: metadata binding **or** metadata binding waiver.
2. A `blockId` MUST NOT appear in both `METADATA_BINDING_REGISTRY` and `METADATA_BINDING_WAIVER_REGISTRY`.
3. A metadata binding MUST reference only slot IDs declared for the same block in `BLOCK_SLOT_REGISTRY`.
4. A metadata binding field MUST originate from `BLOCK_DATA_CONTRACT_REGISTRY`, not from TSX source scanning.
5. A metadata binding field MUST include `labelAtomRef`.
6. A metadata binding field MUST include a valid presentation kind.
7. A waiver MUST include: `blockId`, `waiverId`, approved reason enum, short `notes`.
8. No duplicate `blockId` (binding), duplicate `blockId` (waiver), duplicate `metadataBindingId`, or duplicate `waiverId`.
9. `components/ui/*` primitives MUST NOT be scanned for metadata binding coverage.
10. `@afenda/kernel` MUST NOT be imported by `@afenda/shadcn-studio`.
11. ERP may validate `erpDomainModuleSlug` only at `apps/erp/src/lib/metadata/metadata-ui-binding.projection.ts`.
12. The gate fails when manifest coverage is not 100%.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | 100% MCP block coverage (binding XOR waiver) | `metadata-binding-coverage.test.ts` |
| 2 | Governance gate executable and green | `pnpm check:studio-metadata-binding` |
| 3 | Generated bindings from data contracts + auditable overrides | `metadata-binding.registry.test.ts` |
| 4 | No kernel import in shadcn-studio | `pnpm quality:boundaries` |

**Field 8 evidence map:**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/shadcn-studio/src/__tests__/metadata-binding-coverage.test.ts |
| 2 | scripts/governance/check-studio-metadata-binding.mjs |
| 3 | packages/shadcn-studio/src/registry/build-metadata-binding-from-data-contracts.ts |
| 4 | packages/shadcn-studio/src/contracts/metadata-binding-waiver.contract.ts |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Metadata binding enforcement | Yes — P06-008-R1 | `packages/shadcn-studio/src/registry/assert-metadata-binding-coverage.ts` |
| MCP YES/NO matrix | Yes — 41/41 | `metadata-binding-coverage.test.ts` |
