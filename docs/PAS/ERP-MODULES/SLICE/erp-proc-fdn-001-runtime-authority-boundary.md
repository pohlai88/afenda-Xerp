# Slice ERP-PROC-FDN-001 — Procurement Runtime Authority Boundary

> **Position:** First LoB foundation slice after PAS-001C platform closure

**Status:** Planned

**Type:** Documentation + disposition (ADR-first)

**Prerequisite:** PAS-001C Delivered · [Procurement North Star](../../../NORTHSTAR/procurement-north-star.md) drafted · B80 wire Delivered

## Purpose

Authorize procurement **runtime** package disposition (PKG-R05), domain ADR, and ownership boundary — without implementing PO posting, DB schema, or ERP routes.

## Handoff block (planned — do not implement until approved)

```
Handoff from: docs/PAS/ERP-MODULES/SLICE/erp-proc-fdn-001-runtime-authority-boundary.md

1. Objective    — Record procurement runtime authority boundary ADR + PKG-R05 disposition path.
2. Allowed layer— docs/adr/** · docs/NORTHSTAR/procurement-north-star.md · foundation-disposition (via registry owner)
3. Files        — ADR draft · procurement NS sync · gap report status row
4. Prohibited   — packages/procurement/** · packages/kernel/src/erp-domain/procurement runtime · DB migrations
5. Authority    — Procurement NS · PAS-001C · gap report PAS-PROC-FDN-AUDIT-001
6. Gates        — pnpm check:documentation-drift · manual ADR acceptance
7. Closes       — Unblocks ERP-PROC-FDN-002 ownership model
8. Evidence     — Accepted ADR · registry disposition row
9. Attestation  — Documentation · Architecture Authority
```

## DoD (planned)

| # | Criterion | Gate | Traces to |
| --- | --- | --- | --- |
| 1 | Procurement runtime ADR accepted | ADR status Accepted | Gap report blocker #1 |
| 2 | PKG-R05 disposition recorded | registry owner | Gap report §ownership |
| 3 | NS §9 boundary aligned with module foundation | Manual review | Orthogonal separation §9.4 |
| 4 | No runtime code shipped in this slice | File scan | kernel I7 |

## References

- [Procurement gap report](../../KERNEL/audit/procurement-foundation-gap-report.md)
- [PAS-001C](../../KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)
- [Procurement NS](../../../NORTHSTAR/procurement-north-star.md)
