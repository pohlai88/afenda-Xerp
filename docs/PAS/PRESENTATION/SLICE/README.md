# Presentation slice SSOT (PAS-006 family)

| Field | Value |
| --- | --- |
| **Authority** | [Presentation PAS family](../README.md) |
| **Catalog** | [presentation-slice-catalog.md](presentation-slice-catalog.md) |
| **Status index** | [pas-status-index.md](../../pas-status-index.md#pas-006-shadcnstudio-frontend-standard--active) |
| **Legacy (retired path)** | B38–B42p under `docs/PAS/CSS-AUTHORITY/SLICE/` — archived; mapped to P06-001 only |

---

## Naming

| Pattern | Meaning |
| --- | --- |
| `P06-NNN` | Presentation PAS-006 family slice |
| `p06-NNN-*.md` | Handoff filename (lowercase) |

Do not execute legacy PAS-005A slices for ERP frontend — ADR-0027 retired that chain.

---

## Handoff index

| Slice | Handoff | Status |
| --- | --- | --- |
| P06-001 | [p06-001-product-baseline-attestation.md](p06-001-product-baseline-attestation.md) | Delivered |
| P06-002 | [p06-002-relational-inventory-scaffold.md](p06-002-relational-inventory-scaffold.md) | Delivered |
| P06-003 | [p06-003-block-slot-data-contracts.md](p06-003-block-slot-data-contracts.md) | Not started |
| P06-004 | [p06-004-block-lifecycle-registry.md](p06-004-block-lifecycle-registry.md) | Not started |
| P06-005 | [p06-005-acceptance-record-contract.md](p06-005-acceptance-record-contract.md) | Not started |
| P06-006 | [p06-006-acpa-acceptance-gates.md](p06-006-acpa-acceptance-gates.md) | Not started |
| P06-007 | [p06-007-auth-wcag-aa-pack.md](p06-007-auth-wcag-aa-pack.md) | Not started |
| P06-008 | [p06-008-metadata-binding-contract.md](p06-008-metadata-binding-contract.md) | Not started |
| P06-009 | [p06-009-surface-template-registry.md](p06-009-surface-template-registry.md) | Not started |
| P06-010 | [p06-010-enterprise-accepted-attestation.md](p06-010-enterprise-accepted-attestation.md) | Blocked |

---

## Read order

1. [Presentation Blueprint §10](../../../BLUEPRINT/shadcn-studio-presentation-blueprint.md#10-pas-inventory) — PAS + slice counts
2. [presentation-slice-catalog.md](presentation-slice-catalog.md) — sequence and prerequisites
3. Target PAS §12 (slice catalog mirror)
4. Individual `p06-*.md` handoff
