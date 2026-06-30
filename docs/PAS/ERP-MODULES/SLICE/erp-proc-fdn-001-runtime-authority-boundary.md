# Slice ERP-PROC-FDN-001 — Procurement Runtime Authority Boundary

> **Position:** First LoB foundation slice after PAS-001C platform closure

**Status:** **Delivered** 2026-06-30

**Type:** Documentation + disposition (ADR-first)

**Prerequisite:** PAS-001C Delivered · [Procurement North Star](../../../NORTHSTAR/procurement-north-star.md) drafted · B80 wire Delivered

## Purpose

Authorize procurement **runtime** package disposition (PKG-R05), domain ADR, and ownership boundary — without implementing PO posting, DB schema, or ERP routes.

## Handoff block

```
Handoff from: docs/PAS/ERP-MODULES/SLICE/erp-proc-fdn-001-runtime-authority-boundary.md

1. Objective    — Record procurement runtime authority boundary ADR + PKG-R05 disposition path.
2. Allowed layer— docs/adr/** · docs/NORTHSTAR/procurement-north-star.md · foundation-disposition (PKGR05_PROCUREMENT)
3. Files        — ADR · procurement NS sync · gap report · slice status · pas-status-index · readiness report · bundle authority evidence
4. Prohibited   — packages/procurement/** · kernel procurement runtime · DB migrations · ERP routes
5. Authority    — Procurement NS · PAS-001C · gap report PAS-PROC-FDN-AUDIT-001 · ADR-0020 contract-first model
6. Gates        — pnpm check:documentation-drift · pnpm check:foundation-disposition · pnpm check:erp-module-foundation · pnpm check:erp-module-runtime-package-reserved · pnpm check:procurement-domain-contracts · pnpm check:procurement-runtime-foundation
7. Closes       — Records PKG-R05 authority boundary; next slice [ERP-PROC-OP-001 Proposed](erp-proc-op-001-operational-scaffold-authorization.md)
8. Evidence     — Accepted ADR · registry disposition row · updated bundle authority path
9. Attestation  — Documentation · Architecture Authority
```

## DoD

| # | Criterion | Gate | Traces to | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Procurement runtime ADR accepted | ADR status Accepted | Gap report blocker #1 | [ADR-0031](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md) · `pnpm check:procurement-runtime-foundation` |
| 2 | PKG-R05 disposition recorded | `pnpm check:foundation-disposition` | Gap report §ownership | `PKGR05_PROCUREMENT` in foundation-disposition.registry.ts |
| 3 | NS §9 boundary aligned with module foundation | Manual review | Orthogonal separation §9.4 | procurement-north-star.md §9.4 · §12.4 |
| 4 | No runtime code shipped in this slice | `pnpm check:erp-module-runtime-package-reserved` | kernel I7 | No `packages/procurement/` · PKG-R05 lifecycle `planned` |

## References

- [Procurement gap report](../PROCUREMENT/procurement-foundation-gap-report.md)
- [PAS-001C](../../KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)
- [Procurement NS](../../../NORTHSTAR/procurement-north-star.md)
- [ADR-0031](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md)
