# Procurement operational scaffold (ERP-PROC-OP-001)

Empty operational filesystem authorized by slice **ERP-PROC-OP-001** — **scaffold only**, no business runtime.

## Authority

| Document | Role |
| --- | --- |
| [ADR-0031 — Procurement runtime authority boundary](../../../../docs/adr/ADR-0031-procurement-runtime-authority-boundary.md) | Path law §6 — registry vs features scaffold |
| [Procurement foundation gap report](../../../../docs/PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md) | Sections A–F — operational blockers remain |
| [ERP-PROC-OP-001 slice handoff](../../../../docs/PAS/ERP-MODULES/SLICE/erp-proc-op-001-operational-scaffold-authorization.md) | Scaffold authorization |

## Path law

| Layer | Path | Status |
| --- | --- | --- |
| Registry reservation | `packages/procurement` | **Prohibited** — must not exist |
| Operational scaffold | `packages/features/erp-modules/src/procurement/` | **Authorized** — stub constants only |

## Explicit deferrals

Database schema, permission enforcement, context spine consumers, audit/outbox writers, and ERP production routes remain blocked until separate authorized slice handoffs.
