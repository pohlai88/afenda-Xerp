# Slice ERP-PROC-OP-003 — Database Boundary Declaration

> **Position:** Fourth procurement slice — **declares** planned database boundary before any migrations

**Status:** **Delivered** 2026-06-30

**Type:** Serializable TypeScript contract + governance gate (handoff-first)

**Prerequisite:** [ERP-PROC-OP-002 Delivered](erp-proc-op-002-runtime-ownership-contract.md) · [ADR-0031 Accepted §8](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md) · gap report F.3–F.4 database gate

## Purpose

Declare the gap report F.3 planned procurement database boundary as a serializable TypeScript contract in the features procurement scaffold — **before** any `@afenda/database` schema files, migrations, or `@afenda/procurement` filesystem work.

This slice closes the **"No procurement schema boundary"** blocker from gap report §C / F.4 without implementing persistence.

## Path law (unchanged — ADR-0031 §6)

| Layer | Path | This slice |
| --- | --- | --- |
| Registry reservation | `packages/procurement` | **Still prohibited** — must not exist |
| Operational scaffold | `packages/features/erp-modules/src/procurement/` | **Database boundary contract only** — no schema · no migrations · no services |
| Persistence | `packages/database/src/schema/*` | **Still prohibited** for procurement tables |

## Handoff block

```
Handoff from: docs/PAS/ERP-MODULES/SLICE/erp-proc-op-003-database-boundary-declaration.md

1. Objective    — Declare planned procurement database boundary as serializable TypeScript contract in features scaffold; add drift/absence gate; sync docs/evidence — NO packages/database schema/migrations, NO packages/procurement/, NO routes.
2. Allowed layer— packages/features/erp-modules/src/procurement/** · scripts/governance/check-procurement-database-boundary-contract.mts · docs/PAS/ERP-MODULES/** · docs/adr/ADR-0031 (§8 addendum) · packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts (database evidence path only) · root package.json script
3. Files        —
   docs/PAS/ERP-MODULES/SLICE/erp-proc-op-003-database-boundary-declaration.md
   packages/features/erp-modules/src/procurement/procurement.database-boundary.contract.ts
   packages/features/erp-modules/src/procurement/__tests__/procurement.database-boundary.contract.test.ts
   scripts/governance/check-procurement-database-boundary-contract.mts
   scripts/governance/__tests__/check-procurement-database-boundary-contract.test.ts
   packages/features/erp-modules/src/procurement/index.ts (database boundary exports)
   packages/features/erp-modules/src/index.ts
   docs/PAS/ERP-MODULES/SLICE/README.md
   docs/PAS/pas-status-index.md
   docs/PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md
   package.json (check:procurement-database-boundary-contract)
   packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts (database evidence paths)
   docs/adr/ADR-0031-procurement-runtime-authority-boundary.md (§8)
4. Prohibited   — packages/database/** edits · packages/procurement/** · apps/erp routes · foundation-disposition.registry.ts (delegate registry owner)
5. Authority    — ADR-0031 · gap report F.3–F.4 · PAS-001C template §3 · PROCUREMENT_OWNERSHIP_CONTRACT.databaseSchema = @afenda/database
6. Gates        —
   pnpm check:procurement-database-boundary-contract
   pnpm check:procurement-ownership-contract
   pnpm check:procurement-runtime-foundation
   pnpm check:erp-module-runtime-package-reserved
   pnpm check:erp-module-database-boundary
   pnpm check:erp-module-foundation
   pnpm check:documentation-drift
   pnpm --filter @afenda/erp-modules typecheck
   pnpm --filter @afenda/erp-modules test:run
7. Closes       — Gap report F.3–F.4 database boundary declared; migrations still deferred until RLS ADR + authorized slice
8. Evidence     — procurement.database-boundary.contract.ts · gate PASS · ADR-0031 §8 · readiness report database row
9. Attestation  — Documentation · Architecture Authority · Governance gate
```

## DoD

| # | Criterion | Gate | Evidence |
| --- | --- | --- | --- |
| 1 | Four planned tables declared with migrationStatus deferred | `check:procurement-database-boundary-contract` | gate PASS |
| 2 | schemaOwner matches ownership contract databaseSchema | unit test | procurement.database-boundary.contract.test.ts |
| 3 | Attestation declares declared ERP-PROC-OP-003 | unit test | PROCUREMENT_DATABASE_BOUNDARY_ATTESTATION |
| 4 | No procurement schema files on disk | `check:procurement-database-boundary-contract` | gate PASS |
| 5 | No `packages/procurement/` on disk | gate | gate PASS |
| 6 | Foundation bundle database evidence path updated | `check:erp-module-foundation` | build-procurement-foundation-bundle.ts |
| 7 | ADR-0031 §8 references contract path | doc drift | ADR-0031 |

## Explicit deferrals (remain blocked after this slice)

- Database migrations and Drizzle schema files (gap report §persistence)
- Permission namespace binding runtime (gap report §D)
- Context spine consumer wiring (gap report §E)
- Audit/outbox writers (gap report §F)
- ERP production UI routes (PAS-006 handoff required)
- `@afenda/procurement` top-level package filesystem

## References

- [Procurement gap report §F.3–F.4](../PROCUREMENT/procurement-foundation-gap-report.md)
- [ERP-PROC-OP-002](erp-proc-op-002-runtime-ownership-contract.md)
- [ADR-0031 §8 Database boundary declaration](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md)
- [ERP Module Runtime Blueprint §4.5](../../../BLUEPRINT/erp-module-runtime-blueprint.md)
- [PAS-001C template §3](../../KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)
