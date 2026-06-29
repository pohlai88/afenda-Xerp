# PAS-004 Module Foundation & Procurement Knowledge Promotion Backlog

| Field | Value |
| --- | --- |
| **Document class** | `promotion_backlog` |
| **Authority** | [Module Foundation NS §3.1](../../NORTHSTAR/erp-module-runtime-north-star.md) · [Procurement gap report §B.2](../PROCUREMENT/procurement-foundation-gap-report.md) |
| **Registry** | `packages/enterprise-knowledge/src/data/knowledge.registry.ts` |
| **Last updated** | 2026-06-30 |

> **One sentence:** Tracks PAS-004 Knowledge Atom promotion for module foundation delivery vocabulary (EK-MOD-FDN) and procurement business terms (KV-PROC) — wire-only and missing rows remain honest until accepted.

---

## Module foundation promotion (EK-MOD-FDN)

Mirrors [Module Foundation NS §3.1](../../NORTHSTAR/erp-module-runtime-north-star.md#31-pas-004-promotion-backlog).

| Term | Promotion priority | Status | Atom ID | Slice |
| --- | --- | --- | --- | --- |
| Module runtime identity | P0 | **Done** | `module_runtime_identity` | EK-MOD-FDN-001 |
| Wire catalog key | P0 | **Done** | `wire_catalog_key` | EK-MOD-FDN-001 |
| Module ownership contract | P0 | **Done** | `module_ownership_contract` | EK-MOD-FDN-001 |
| Knowledge map status | P0 | **Done** | `knowledge_map_status` | EK-MOD-FDN-002 |
| Operating context consumption | P0 | **Done** | `operating_context_consumption` | EK-MOD-FDN-002 |
| Permission binding | P0 | **Done** | `permission_binding` | EK-MOD-FDN-002 |
| Audit action map | P0 | **Done** | `audit_action_map` | EK-MOD-FDN-002 |
| Metadata surface binding | P0 | **Done** | `metadata_surface_binding` | EK-MOD-FDN-002 |
| Module readiness dimension | P0 | **Done** | `module_readiness_dimension` | EK-MOD-FDN-003 |
| Foundation lifecycle phase | P0 | **Done** | `foundation_lifecycle_phase` | EK-MOD-FDN-003 |
| Module ingress | P0 | **Done** | `module_ingress` | EK-MOD-FDN-003 |
| Readiness report | P0 | **Done** | `readiness_report` | EK-MOD-FDN-003 |
| Module policy declaration | P1 | **Done** | `module_policy_declaration` | EK-MOD-FDN-004 |
| Module event catalog | P1 | **Done** | `module_event_catalog` | EK-MOD-FDN-004 |
| Outbox requirement classification | P1 | **Done** | `outbox_requirement_classification` | EK-MOD-FDN-004 |

**P0 closure:** 12 atoms in `B54_MODULE_FOUNDATION_ATOM_IDS` (2026-06-30).  
**P1 closure:** 3 atoms in `B55_MODULE_FOUNDATION_P1_ATOM_IDS` (2026-06-30).

---

## Procurement business promotion (KV-PROC P0)

Mirrors [gap report §B.2](../PROCUREMENT/procurement-foundation-gap-report.md#b2-procurement-knowledge-register).

| Term | PAS-004 status | Wire (KV-PROC) | Status | Atom ID |
| --- | --- | --- | --- | --- |
| Procurement requisition | Accepted | Yes | **Done** (B53) | `procurement_requisition` |
| Purchase order | Accepted | Yes | **Done** (B56 P0) | `purchase_order` |
| Supplier | Accepted | PAS-001 identity | **Done** (B56 P0) | `supplier` |
| RFQ | Accepted | Yes | **Done** (B56 P0) | `procurement_rfq` |

**P0 closure:** 3 atoms in `B56_PROCUREMENT_P0_ATOM_IDS` (2026-06-30).

---

## Procurement backlog (wire-only / missing / ambiguous)

Remaining rows from gap report §B.2 — **not** promoted in this batch. Knowledge map in `PROCUREMENT_FOUNDATION_BUNDLE` retains `wire_only` rows for LAW K6 honesty.

| Term | Gap report status | Wire | Required action | Knowledge map status |
| --- | --- | --- | --- | --- |
| Sourcing | Wire-only | Yes (`SOURCING_METHODS`) | Add atom — process vs method enum | `wire_only` |
| Blanket agreement | Wire-only | Yes (doc type) | Add enterprise meaning atom | `wire_only` |
| Supplier quote | Wire-only | Yes (permission domain) | Add enterprise meaning atom | `wire_only` |
| Approval (requisition) | Ambiguous | Partial wire | Decide workflow vs procurement-scoped atom | — |
| Purchasing group | Ambiguous | Team analog | Perspective or atom linking Team ↔ procurement org | — |
| Goods receipt | Missing | Prohibited surface name | Cross-domain KV-INV + atom | — |
| Supplier invoice | Missing | — | Cross-domain KV-ACCT + atom | — |
| Three-way match | Missing | Prohibited surface name | Cross-domain ADR (PROC + INV + ACCT) | — |
| Incoterms / landed cost / RTV / analytics | Missing | — | Future PAS-004 + domain ADR | — |

---

## Corpus totals

| Group | Constant | Count |
| --- | --- | --- |
| B24 MVP | `B24_KNOWLEDGE_ATOM_IDS` | 12 |
| B29 platform | `B29_PLATFORM_ATOM_IDS` | 4 |
| B31 context | `B31_CONTEXT_ATOM_IDS` | 8 |
| B53 ERP-domain bridge | `B53_ERP_DOMAIN_BRIDGE_ATOM_IDS` | 2 |
| B54 module foundation P0 | `B54_MODULE_FOUNDATION_ATOM_IDS` | 12 |
| B55 module foundation P1 | `B55_MODULE_FOUNDATION_P1_ATOM_IDS` | 3 |
| B56 procurement P0 | `B56_PROCUREMENT_P0_ATOM_IDS` | 3 |
| **Total** | `KNOWLEDGE_ATOM_IDS` | **44** |

**Fingerprint:** `ENTERPRISE-KNOWLEDGE-2026-06-30-v3`

---

## Related

| Artifact | Path |
| --- | --- |
| Procurement readiness report | [procurement-runtime-readiness-report.md](./PROCUREMENT/procurement-runtime-readiness-report.md) |
| Foundation bundle | `packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts` |
| Alignment gate | `pnpm check:erp-module-knowledge-alignment` |
