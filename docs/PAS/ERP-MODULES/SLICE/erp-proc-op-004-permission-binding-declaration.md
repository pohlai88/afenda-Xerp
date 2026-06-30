# Slice ERP-PROC-OP-004 — Permission Binding Declaration

> **Position:** Fifth procurement slice — **declares** kernel permission binding before PERMISSION_REGISTRY wiring

**Status:** **Delivered** 2026-06-30

**Type:** Serializable TypeScript contract + governance gate (handoff-first)

**Prerequisite:** [ERP-PROC-OP-003 Delivered](erp-proc-op-003-database-boundary-declaration.md) · [ADR-0031 Accepted §9](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md) · gap report §D permissions gate

## Purpose

Declare the gap report §D / F.4 permission binding as a serializable TypeScript contract in the features procurement scaffold — **before** any `@afenda/permissions` PERMISSION_REGISTRY wiring, seeds, or enforcement runtime.

This slice closes the **"No permission registry wiring"** wire-phase declaration without implementing enforcement.

## Path law (unchanged — ADR-0031 §6)

| Layer | Path | This slice |
| --- | --- | --- |
| Wire vocabulary | `packages/kernel/src/erp-domain/procurement/` | **Authority** — 18 keys in `PROCUREMENT_PERMISSION_KEY_VOCABULARY` |
| Operational declaration | `packages/features/erp-modules/src/procurement/` | **Permission binding contract only** — no registry · no enforcement |
| Permission evaluation | `packages/permissions/**` | **Still prohibited** for procurement namespace |

## Handoff block

```
Handoff from: docs/PAS/ERP-MODULES/SLICE/erp-proc-op-004-permission-binding-declaration.md

1. Objective    — Declare procurement permission binding (18 kernel keys, parity deferred) as serializable contract in features scaffold; add drift/absence gate; sync docs/evidence — NO packages/permissions edits, NO packages/procurement/, NO routes.
2. Allowed layer— packages/features/erp-modules/src/procurement/** · scripts/governance/check-procurement-permission-binding-contract.mts · docs/PAS/ERP-MODULES/** · docs/adr/ADR-0031 (§9 addendum) · packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts (permission evidence + full 18-key bundle) · root package.json script
3. Files        —
   docs/PAS/ERP-MODULES/SLICE/erp-proc-op-004-permission-binding-declaration.md
   packages/features/erp-modules/src/procurement/procurement.permission-binding.contract.ts
   packages/features/erp-modules/src/procurement/__tests__/procurement.permission-binding.contract.test.ts
   scripts/governance/check-procurement-permission-binding-contract.mts
   scripts/governance/__tests__/check-procurement-permission-binding-contract.test.ts
   packages/features/erp-modules/src/procurement/index.ts (permission binding exports)
   packages/features/erp-modules/src/index.ts
   docs/PAS/ERP-MODULES/SLICE/README.md
   docs/PAS/pas-status-index.md
   docs/PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md
   package.json (check:procurement-permission-binding-contract)
   packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts
   docs/adr/ADR-0031-procurement-runtime-authority-boundary.md (§9)
4. Prohibited   — packages/permissions/** edits · packages/procurement/** · apps/erp routes · foundation-disposition.registry.ts (delegate registry owner)
5. Authority    — ADR-0031 · gap report §D · PAS-001C template §3.5 · PROCUREMENT_OWNERSHIP_CONTRACT.permissionRegistry = @afenda/permissions
6. Gates        —
   pnpm check:procurement-permission-binding-contract
   pnpm check:procurement-ownership-contract
   pnpm check:procurement-database-boundary-contract
   pnpm check:procurement-runtime-foundation
   pnpm check:erp-module-runtime-package-reserved
   pnpm check:erp-module-permission-binding
   pnpm check:erp-module-foundation
   pnpm check:documentation-drift
   pnpm --filter @afenda/erp-modules typecheck
   pnpm --filter @afenda/erp-modules test:run
7. Closes       — Gap report §D permission binding declared; PERMISSION_REGISTRY wiring still deferred until authorized enforcement slice
8. Evidence     — procurement.permission-binding.contract.ts · gate PASS · ADR-0031 §9 · readiness report permissions row
9. Attestation  — Documentation · Architecture Authority · Governance gate
```

## DoD

| # | Criterion | Gate | Evidence |
| --- | --- | --- | --- |
| 1 | Eighteen kernel keys declared with permissionParity deferred | `check:procurement-permission-binding-contract` | gate PASS |
| 2 | Keys match kernel PROCUREMENT_PERMISSION_KEY_VOCABULARY | gate | kernel parity |
| 3 | permissionRegistryOwner matches ownership contract | unit test | procurement.permission-binding.contract.test.ts |
| 4 | Attestation declares ERP-PROC-OP-004 | unit test | PROCUREMENT_PERMISSION_BINDING_ATTESTATION |
| 5 | No procurement PERMISSION_REGISTRY namespace on disk | gate | gate PASS |
| 6 | Foundation bundle permissionBinding uses full 18 keys | `check:erp-module-permission-binding` | build-procurement-foundation-bundle.ts |
| 7 | ADR-0031 §9 references contract path | doc drift | ADR-0031 |

## Explicit deferrals (remain blocked after this slice)

- PERMISSION_REGISTRY wiring and seed catalog (gap report §permissions enforcement)
- Permission evaluation runtime in apps/erp
- Context spine consumer wiring (gap report §E)
- Audit/outbox writers (gap report §F)
- Database migrations (ERP-PROC-OP-003 declaration only)
- ERP production UI routes (PAS-006 handoff required)
- `@afenda/procurement` top-level package filesystem

## References

- [Procurement gap report §D](../PROCUREMENT/procurement-foundation-gap-report.md)
- [ERP-PROC-OP-003](erp-proc-op-003-database-boundary-declaration.md)
- [ADR-0031 §9 Permission binding declaration](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md)
- [ERP Module Runtime Blueprint §4.5](../../../BLUEPRINT/erp-module-runtime-blueprint.md)
- [PAS-001C template §3.5](../../KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)
