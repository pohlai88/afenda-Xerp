# Slice ERP-PROC-OP-006 — Audit / Outbox Declaration

> **Position:** Seventh procurement slice — **declares** audit map and outbox catalog before runtime writers

**Status:** **Delivered** 2026-06-30

**Type:** Serializable TypeScript contract + governance gate (handoff-first)

**Prerequisite:** [ERP-PROC-OP-005 Delivered](erp-proc-op-005-context-spine-consumer.md) · [ADR-0031 Accepted §11](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md) · gap report audit/outbox gate

## Purpose

Declare the gap report audit/outbox foundation as a serializable TypeScript contract in the features procurement scaffold — **before** any durable audit writers, outbox publishers, or `@afenda/procurement` service runtime.

This slice closes the **"No audit/outbox writer"** wire-phase declaration without implementing persistence or dispatch.

## Path law (unchanged — ADR-0031 §6)

| Layer | Path | This slice |
| --- | --- | --- |
| Wire audit vocabulary | `packages/kernel/src/erp-domain/procurement/procurement-audit-actions.contract.ts` | **Authority** — 13 PAS-001B wire actions |
| Operational declaration | `packages/features/erp-modules/src/procurement/` | **Audit/outbox contract only** — no writers |
| Platform infra | `packages/database/src/schema/audit.schema.ts`, `outbox.schema.ts` | **Existing** — procurement writers still prohibited |

## Handoff block

```
Handoff from: docs/PAS/ERP-MODULES/SLICE/erp-proc-op-006-audit-outbox-declaration.md

1. Objective    — Declare full procurement audit map (13 wire actions → module-prefixed) and deferred outbox catalog; add drift/absence gate; sync docs/evidence — NO audit/outbox writers, NO packages/procurement/, NO business routes.
2. Allowed layer— packages/features/erp-modules/src/procurement/** · scripts/governance/check-procurement-audit-outbox-contract.mts · docs/PAS/ERP-MODULES/** · docs/adr/ADR-0031 (§11) · packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts · root package.json script · apps/erp/src/lib/procurement/load-procurement-foundation-readiness-page.server.ts (attestation row only)
3. Files        —
   docs/PAS/ERP-MODULES/SLICE/erp-proc-op-006-audit-outbox-declaration.md
   packages/features/erp-modules/src/procurement/procurement.audit-outbox.contract.ts
   packages/features/erp-modules/src/procurement/__tests__/procurement.audit-outbox.contract.test.ts
   scripts/governance/check-procurement-audit-outbox-contract.mts
   scripts/governance/__tests__/check-procurement-audit-outbox-contract.test.ts
   packages/features/erp-modules/src/procurement/index.ts
   packages/features/erp-modules/src/index.ts
   docs/PAS/ERP-MODULES/SLICE/README.md
   docs/PAS/pas-status-index.md
   docs/PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md
   package.json (check:procurement-audit-outbox-contract)
   packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts
   docs/adr/ADR-0031-procurement-runtime-authority-boundary.md (§11)
   apps/erp/src/lib/procurement/load-procurement-foundation-readiness-page.server.ts
4. Prohibited   — packages/procurement/** · audit/outbox writer services · PERMISSION_REGISTRY seed · PAS-006 production UI · foundation-disposition.registry.ts (delegate registry owner)
5. Authority    — ADR-0031 · gap report §F audit/outbox · PAS-001C template §3.7–3.9 · kernel PROCUREMENT_AUDIT_ACTIONS
6. Gates        —
   pnpm check:procurement-audit-outbox-contract
   pnpm check:procurement-ownership-contract
   pnpm check:procurement-context-spine-consumer
   pnpm check:procurement-runtime-foundation
   pnpm check:erp-module-audit-outbox
   pnpm check:erp-module-foundation
   pnpm check:documentation-drift
   pnpm --filter @afenda/erp-modules typecheck
   pnpm --filter @afenda/erp-modules test:run
7. Closes       — Gap report audit/outbox catalog declared; durable writers still deferred until authorized runtime slice
8. Evidence     — procurement.audit-outbox.contract.ts · gate PASS · ADR-0031 §11 · readiness report audit/outbox rows
9. Attestation  — Documentation · Architecture Authority · Governance gate
```

## DoD

| # | Criterion | Gate | Evidence |
| --- | --- | --- | --- |
| 1 | Thirteen wire audit actions declared with module-prefixed map | `check:procurement-audit-outbox-contract` | gate PASS |
| 2 | Wire actions match kernel PROCUREMENT_AUDIT_ACTIONS | gate | kernel parity |
| 3 | Thirteen deferred outbox entries match event catalog | `check:erp-module-audit-outbox` | bundle sync |
| 4 | auditWriterStatus and outboxWriterStatus deferred | unit test | procurement.audit-outbox.contract.test.ts |
| 5 | No premature writer patterns in features procurement | gate | gate PASS |
| 6 | Foundation bundle audit/outbox evidence paths updated | `check:erp-module-foundation` | build-procurement-foundation-bundle.ts |
| 7 | ADR-0031 §11 references contract path | doc drift | ADR-0031 |

## Explicit deferrals (remain blocked after this slice)

- Durable audit writers and outbox publishers in services
- PERMISSION_REGISTRY enforcement runtime
- PAS-006 production procurement operator surfaces
- Business procurement routes beyond foundation readiness
- `@afenda/procurement` top-level package filesystem

## References

- [Procurement gap report §F](../PROCUREMENT/procurement-foundation-gap-report.md)
- [ERP-PROC-OP-005](erp-proc-op-005-context-spine-consumer.md)
- [ADR-0031 §11 Audit/outbox declaration](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md)
- [PAS-001C template §3.7–3.9](../../KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)
