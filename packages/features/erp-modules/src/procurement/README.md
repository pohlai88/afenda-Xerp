# Procurement operational scaffold (ERP-PROC-OP-001 · ERP-PROC-OP-002)

Operational filesystem under features/erp-modules — **scaffold + ownership contract only**, no business runtime.

## Authority

| Document | Role |
| --- | --- |
| [ADR-0031 — Procurement runtime authority boundary](../../../../docs/adr/ADR-0031-procurement-runtime-authority-boundary.md) | Path law §6 · serialized ownership §7 |
| [Procurement foundation gap report](../../../../docs/PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md) | Sections A–F — operational blockers remain |
| [ERP-PROC-OP-001 slice handoff](../../../../docs/PAS/ERP-MODULES/SLICE/erp-proc-op-001-operational-scaffold-authorization.md) | Scaffold authorization |
| [ERP-PROC-OP-002 slice handoff](../../../../docs/PAS/ERP-MODULES/SLICE/erp-proc-op-002-runtime-ownership-contract.md) | Ownership contract ADR-lock |

## Path law

| Layer | Path | Status |
| --- | --- | --- |
| Registry reservation | `packages/procurement` | **Prohibited** — must not exist |
| Operational scaffold | `packages/features/erp-modules/src/procurement/` | **Authorized** — stub + ownership contract |

## Ownership contract (ERP-PROC-OP-002)

`procurement.ownership.contract.ts` exports:

- `PROCUREMENT_OWNERSHIP_CONTRACT` — eight `defineModuleOwnership` surfaces (gate-compared to foundation bundle)
- `PROCUREMENT_OWNERSHIP_MATRIX` — extended matrix with PAS-001 `supplierIdentity`
- `PROCUREMENT_OWNERSHIP_ATTESTATION` — slice `ERP-PROC-OP-002` · status `adr_locked`

Gate: `pnpm check:procurement-ownership-contract`

## Explicit deferrals

Database schema, permission enforcement, context spine consumers, audit/outbox writers, and ERP production routes remain blocked until separate authorized slice handoffs.
