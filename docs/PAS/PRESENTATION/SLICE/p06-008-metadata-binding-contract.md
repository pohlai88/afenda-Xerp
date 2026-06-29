# Slice P06-008 — Metadata Binding Contract (PAS-006D)

> **Position:** Slice `8 of 10` in PAS-006 family · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-004 Delivered (or waived with Architecture approval for contract-only slice)

**Status:** Delivered (2026-06-29)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→B — introduces cross-package wire contract consumed by ERP metadata layer

## Purpose

Deliver wire-safe metadata binding contract (field → block slot mapping descriptor) and ERP projection bridge per PAS-006D §2 — core metadata-driven UI path.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-008-metadata-binding-contract.md

1. Objective    — Deliver metadata binding wire contract in shadcn-studio and ERP render bridge projection.
2. Allowed layer— packages/shadcn-studio · apps/erp/src/lib/metadata (consumer bridge only)
3. Files        —
   packages/shadcn-studio/src/contracts/metadata-binding.contract.ts
   packages/shadcn-studio/src/__tests__/metadata-binding.contract.test.ts
   packages/shadcn-studio/src/index.ts
   apps/erp/src/lib/metadata/metadata-ui-binding.projection.ts
   apps/erp/src/lib/metadata/__tests__/metadata-ui-binding.projection.test.ts
4. Prohibited   — @afenda/kernel in shadcn-studio · metadata schema DB · permission evaluation in contracts · retired metadata-ui package
5. Authority    — PAS-006D §2 · PAS-001A metadata spine (ERP consumer) · shadcn-studio skill
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm quality:boundaries
7. Closes       — Closes DoD #1–#4 · PAS-006D P06-008 · NS §3.5 metadata path (contract phase)
8. Evidence     —
   packages/shadcn-studio/src/contracts/metadata-binding.contract.ts
   apps/erp/src/lib/metadata/metadata-ui-binding.projection.ts
   apps/erp/src/lib/metadata/__tests__/metadata-ui-binding.projection.test.ts
   packages/shadcn-studio/src/index.ts
9. Attestation  — Contract · Test · Integration
```

## Rules frozen

1. Binding contract uses string wire ids only inside shadcn-studio — no kernel import.
2. ERP bridge may use kernel tenant wire normalization at trust boundary only.
3. Labels reference Knowledge atom ids — presentation does not invent business meaning.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Metadata binding contract JSON-serializable | `metadata-binding.contract.test.ts` | PAS-006D §2 |
| 2 | ERP projects MetadataRuntimeContext to binding wire | `metadata-ui-binding.projection.test.ts` | PAS-001A B111 |
| 3 | Public barrel exports binding types | `pnpm --filter @afenda/shadcn-studio typecheck` | PAS-006A |
| 4 | No kernel import in shadcn-studio contracts | `pnpm quality:boundaries` | ADR-0027 |

**Field 8 evidence map:**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/shadcn-studio/src/contracts/metadata-binding.contract.ts |
| 2 | apps/erp/src/lib/metadata/metadata-ui-binding.projection.ts |
| 3 | packages/shadcn-studio/src/index.ts |
| 4 | packages/shadcn-studio/src/contracts/metadata-binding.contract.ts |
