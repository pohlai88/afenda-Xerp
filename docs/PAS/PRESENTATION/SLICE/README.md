# Presentation slice handoffs (PAS-006 family)

| Field | Value |
| --- | --- |
| **Catalog (full table)** | [presentation-slice-catalog.md](./presentation-slice-catalog.md) |
| **Closure registry** | [pas-status-index.md](../../pas-status-index.md) |
| **Lane boundaries** | [DEVELOPMENT-LANE-BOUNDARIES.md](../../DEVELOPMENT-LANE-BOUNDARIES.md) |
| **Last reviewed** | 2026-07-01 |

> **Hard stop:** Do not execute PAS-005 CSS slices for ERP — use this lane only.

---

## Sequence (delivered)

| Slice | Handoff | PAS | Status |
| --- | --- | --- | --- |
| P06-001 | [p06-001-product-baseline-attestation.md](./p06-001-product-baseline-attestation.md) | 006A | **Delivered** |
| P06-002 | [p06-002-relational-inventory-scaffold.md](./p06-002-relational-inventory-scaffold.md) | 006B | **Delivered** |
| P06-003 | [p06-003-block-slot-data-contracts.md](./p06-003-block-slot-data-contracts.md) | 006B | **Delivered** |
| P06-004 | [p06-004-block-lifecycle-registry.md](./p06-004-block-lifecycle-registry.md) | 006B | **Delivered** |
| P06-005 | [p06-005-acceptance-record-contract.md](./p06-005-acceptance-record-contract.md) | 006C | **Delivered** |
| P06-006 | [p06-006-acpa-acceptance-gates.md](./p06-006-acpa-acceptance-gates.md) | 006C | **Delivered** |
| P06-007 | [p06-007-auth-wcag-aa-pack.md](./p06-007-auth-wcag-aa-pack.md) | 006C | **Delivered** |
| P06-008 | [p06-008-metadata-binding-contract.md](./p06-008-metadata-binding-contract.md) | 006D | **Delivered** |
| P06-008-R1 | [p06-008-r1-metadata-binding-enforcement.md](./p06-008-r1-metadata-binding-enforcement.md) | 006D | **Delivered** |
| P06-008-R2 | [p06-008-r2-dom-slot-markers.md](./p06-008-r2-dom-slot-markers.md) | 006D | **Delivered** |
| P06-009 | [p06-009-surface-template-registry.md](./p06-009-surface-template-registry.md) | 006D | **Delivered** |
| P06-010 | [p06-010-enterprise-accepted-attestation.md](./p06-010-enterprise-accepted-attestation.md) | 006 family | **Delivered** — PKGR05A promotion via foundation-registry-owner |
| P06-011 | [p06-011-src-structure-clarity.md](./p06-011-src-structure-clarity.md) | 006A | **Delivered** — [ADR-0037](../../../adr/ADR-0037-shadcn-studio-src-layered-structure.md) |

---

## Next work (outside this folder)

| Track | Where | Notes |
| --- | --- | --- |
| Source structure clarity | [P06-011](./p06-011-src-structure-clarity.md) | **Delivered** — ADR-0037 + lab barrel |
| ERP runtime hydration | [PAS-001A-R1](../../KERNEL/SLICE/pas-001a-r1c-metadata-consumer-pas006.md) | IS-003 consumer wiring in `apps/erp` |
| Operator-surface routes | PAS-006D + ERP | Expand accepted blocks to production routes |
| Optional gate | Root `package.json` | Register `check:erp-metadata-pas006-consumer` if not yet wired |

---

## Legacy mapping

| Legacy | Maps to |
| --- | --- |
| B38–B42f | P06-001 |
| B42k | P06-006 (partial pattern) |
| B42i–B42m | **Obsolete** — appshell strangler retired (ADR-0027) |

---

## Related

- [PRESENTATION README](../README.md)
- [PAS-006 charter](../PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md)
- [KERNEL PAS-001A](../../KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) — spine touchpoint for metadata consumer
