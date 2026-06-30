# Slice ERP-PROC-OP-002 — Runtime Ownership Contract

> **Position:** Third procurement slice — **ADR-locks** split ownership matrix before database boundary work

**Status:** **Delivered** 2026-06-30

**Type:** Serializable TypeScript contract + governance gate (handoff-first)

**Prerequisite:** [ERP-PROC-OP-001 Delivered](erp-proc-op-001-operational-scaffold-authorization.md) · [ADR-0031 Accepted §7](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md) · gap report F.2 ownership gate

## Purpose

Serialize the gap report F.2 split ownership matrix as an ADR-locked TypeScript contract in the features procurement scaffold — **before** any database schema, routes, or `@afenda/procurement` filesystem work.

This slice closes the **"No runtime ownership decision"** blocker from the gap report without implementing business runtime.

## Path law (unchanged — ADR-0031 §6)

| Layer | Path | This slice |
| --- | --- | --- |
| Registry reservation | `packages/procurement` | **Still prohibited** — must not exist |
| Operational scaffold | `packages/features/erp-modules/src/procurement/` | **Ownership contract only** — no DB · no routes · no services |

## Handoff block

```
Handoff from: docs/PAS/ERP-MODULES/SLICE/erp-proc-op-002-runtime-ownership-contract.md

1. Objective    — ADR-lock split ownership matrix as serializable TypeScript contract in features procurement scaffold; add governance gate; sync docs/evidence — NO database, routes, kernel runtime, packages/procurement/.
2. Allowed layer— packages/features/erp-modules/src/procurement/** · scripts/governance/check-procurement-ownership-contract.mts · docs/PAS/ERP-MODULES/** · docs/adr/ADR-0031 (§7 addendum only) · packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts (ownership evidence path only)
3. Files        —
   docs/PAS/ERP-MODULES/SLICE/erp-proc-op-002-runtime-ownership-contract.md
   packages/features/erp-modules/src/procurement/procurement.ownership.contract.ts
   packages/features/erp-modules/src/procurement/__tests__/procurement.ownership.contract.test.ts
   scripts/governance/check-procurement-ownership-contract.mts
   scripts/governance/__tests__/check-procurement-ownership-contract.test.ts
   packages/features/erp-modules/src/procurement/index.ts (ownership exports)
   packages/features/erp-modules/src/index.ts
   docs/PAS/ERP-MODULES/SLICE/README.md
   docs/PAS/pas-status-index.md
   docs/PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md
   package.json (check:procurement-ownership-contract)
   packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts (evidence paths)
   docs/adr/ADR-0031-procurement-runtime-authority-boundary.md (§7)
4. Prohibited   — packages/procurement/** · packages/database schema/migrations · apps/erp routes · foundation-disposition.registry.ts (delegate registry owner)
5. Authority    — ADR-0031 · gap report F.2 · PAS-001C template §3.3 · ERP Module Runtime Blueprint §4.5
6. Gates        —
   pnpm check:procurement-ownership-contract
   pnpm check:erp-module-ownership
   pnpm check:procurement-runtime-foundation
   pnpm check:erp-module-runtime-package-reserved
   pnpm check:erp-module-foundation
   pnpm check:documentation-drift
   pnpm --filter @afenda/erp-modules typecheck
   pnpm test:run
7. Closes       — Gap report F.2 ownership matrix ADR-locked; database boundary still deferred
8. Evidence     — procurement.ownership.contract.ts · gate PASS · ADR-0031 §7 · readiness report ownership row
9. Attestation  — Documentation · Architecture Authority · Governance gate
```

## DoD

| # | Criterion | Gate | Evidence |
| --- | --- | --- | --- |
| 1 | Ownership contract matches bundle on 8 surfaces | `check:procurement-ownership-contract` | gate PASS |
| 2 | Matrix includes PAS-001 supplierIdentity row | unit test | procurement.ownership.contract.test.ts |
| 3 | Attestation declares adr_locked ERP-PROC-OP-002 | unit test | PROCUREMENT_OWNERSHIP_ATTESTATION |
| 4 | No `packages/procurement/` on disk | `check:procurement-runtime-foundation` | gate PASS |
| 5 | Foundation bundle evidence paths updated | `check:erp-module-foundation` | build-procurement-foundation-bundle.ts |
| 6 | ADR-0031 §7 references contract path | doc drift | ADR-0031 |

## Explicit deferrals (remain blocked after this slice)

- Database boundary and migrations (gap report §C) — **requires separate slice after this ownership ADR-lock**
- Permission namespace binding runtime (gap report §D)
- Context spine consumer wiring (gap report §E)
- Audit/outbox writers (gap report §F)
- ERP production UI routes (PAS-006 handoff required)
- `@afenda/procurement` top-level package filesystem

## References

- [Procurement gap report §F.2](../PROCUREMENT/procurement-foundation-gap-report.md)
- [ERP-PROC-OP-001](erp-proc-op-001-operational-scaffold-authorization.md)
- [ADR-0031 §7 Serialized ownership contract](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md)
- [ERP Module Runtime Blueprint §4.5](../../../BLUEPRINT/erp-module-runtime-blueprint.md)
- [PAS-001C template §3.3](../../KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)
