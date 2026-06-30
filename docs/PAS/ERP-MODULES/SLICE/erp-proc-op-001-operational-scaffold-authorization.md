# Slice ERP-PROC-OP-001 — Operational Scaffold Authorization

> **Position:** Second procurement slice — **authorizes** operational filesystem layout only; **does not** implement business runtime

**Status:** **Delivered** 2026-06-30

**Type:** Documentation + authorization gate (handoff-first)

**Prerequisite:** [ERP-PROC-FDN-001 Delivered](erp-proc-fdn-001-runtime-authority-boundary.md) · [ADR-0031 Accepted](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md) · PAS-004D B54 attested · gap report sections A–F still open

## Purpose

Authorize the **operational filesystem scaffold path** under ERP Module Runtime Blueprint §4.5 — without creating PO posting, DB schema, permission enforcement, audit writers, or ERP production routes.

This slice is the **mandatory authorization step** before any agent may create `packages/features/erp-modules/src/procurement/**`.

## Path law (dual layer — ADR-0031 §6)

| Layer | Path | This slice |
| --- | --- | --- |
| Registry reservation | `packages/procurement` | **Still prohibited** — must not exist |
| Operational scaffold (future) | `packages/features/erp-modules/src/procurement/` | **Authorized on Delivered** — empty scaffold only |

## Handoff block

```
Handoff from: docs/PAS/ERP-MODULES/SLICE/erp-proc-op-001-operational-scaffold-authorization.md

1. Objective    — Authorize empty operational scaffold under features/erp-modules; update PKGR05 knownGaps; sync readiness report — no business logic.
2. Allowed layer— packages/features/erp-modules/src/procurement/** (scaffold only) · docs/PAS/ERP-MODULES/** · foundation-disposition PKGR05 (registry owner)
3. Files        —
   packages/features/erp-modules/src/procurement/index.ts (barrel export stub)
   packages/features/erp-modules/src/procurement/README.md (authority pointers)
   packages/features/erp-modules/package.json (export path if required)
   docs/PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md
   docs/PAS/pas-status-index.md
4. Prohibited   — packages/procurement/** · packages/database schema/migrations · apps/erp routes · PO posting · permission registry mutations · kernel erp-domain runtime
5. Authority    — ADR-0031 §6 · ERP Module Runtime Blueprint §4.5 · Procurement NS · PAS-001C · gap report PAS-PROC-FDN-AUDIT-001
6. Gates        —
   pnpm check:procurement-runtime-foundation
   pnpm check:erp-module-runtime-package-reserved
   pnpm check:erp-module-foundation
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Operational scaffold path authorized; gap report dimension "filesystem scaffold" → foundation-ready
8. Evidence     — empty scaffold paths on disk · readiness report row · registry owner PKGR05 gap update
9. Attestation  — Documentation · Architecture Authority · Registry (delegated)
```

## DoD

| # | Criterion | Gate | Evidence |
| --- | --- | --- | --- |
| 1 | Operator explicitly approves Proposed → In Progress | Manual | Issue / chat authorization |
| 2 | Scaffold exists only under features path | Manual + reserved gate | `check:erp-module-runtime-package-reserved` PASS |
| 3 | No `packages/procurement/` on disk | `check:procurement-runtime-foundation` | gate PASS |
| 4 | No DB, routes, or services in scaffold | `check:erp-module-database-boundary` | gate PASS |
| 5 | Readiness report updated | doc drift | procurement-runtime-readiness-report.md |

## Explicit deferrals (remain blocked after this slice)

- Database boundary and migrations (gap report §C)
- Permission namespace binding (gap report §D)
- Context spine consumer wiring (gap report §E)
- Audit/outbox writers (gap report §F)
- ERP production UI routes (PAS-006 handoff required)
- `@afenda/procurement` top-level package filesystem

## References

- [Procurement gap report](../PROCUREMENT/procurement-foundation-gap-report.md)
- [ERP-PROC-FDN-001](erp-proc-fdn-001-runtime-authority-boundary.md)
- [ADR-0031 §6 Path law reconciliation](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md)
- [ERP Module Runtime Blueprint §4.5](../../../BLUEPRINT/erp-module-runtime-blueprint.md)
