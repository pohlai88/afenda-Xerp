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

## Procurement business promotion (KV-PROC)

Mirrors [gap report §B.2](../PROCUREMENT/procurement-foundation-gap-report.md#b2-procurement-knowledge-register).

### P0 (B56 — 2026-06-30)

| Term | Wire (KV-PROC) | Status | Atom ID |
| --- | --- | --- | --- |
| Purchase order | Yes | **Done** | `purchase_order` |
| Supplier | PAS-001 identity | **Done** | `supplier` |
| RFQ | Yes | **Done** | `procurement_rfq` |

### P1 (B57 — 2026-06-30)

| Term | Wire (KV-PROC) | Status | Atom ID |
| --- | --- | --- | --- |
| Sourcing method | `SOURCING_METHODS` | **Done** | `procurement_sourcing` |
| Blanket agreement | doc type | **Done** | `blanket_agreement` |
| Supplier quote | supplierQuote domain | **Done** | `supplier_quote` |

### Bridge (B53)

| Term | Status | Atom ID |
| --- | --- | --- |
| Procurement requisition | **Done** | `procurement_requisition` |

---

## Product Bank and Supplier Portal promotion (B58 planned — PAS-PROC-001K)

Derived from [PAS-PROC-001K §11](./PAS-PROC-001K-PROCUREMENT-PRODUCT-BANK-AND-SUPPLIER-PORTAL-STANDARD.md). Atoms required before semantic runtime.

### B58 P0 — Core Product Bank atoms (promote before Phase 1 runtime)

| Term | Status | Planned Atom ID | Slice |
| --- | --- | --- | --- |
| Supplier catalog item | **Planned** | `supplier_catalog_item` | B58-P0 |
| Product Bank item | **Planned** | `product_bank_item` | B58-P0 |
| Buying decision record | **Planned** | `buying_decision_record` | B58-P0 |
| Supplier price list | **Planned** | `supplier_price_list` | B58-P0 |

### B58 P1 — Supporting Product Bank atoms

| Term | Status | Planned Atom ID | Slice |
| --- | --- | --- | --- |
| Catalog publication state | **Planned** | `catalog_publication_state` | B58-P1 |
| Landed cost evaluation | **Planned** | `landed_cost_evaluation` | B58-P1 |
| Requestor sourcing catalog | **Planned** | `requestor_sourcing_catalog` | B58-P1 |
| Invoice match evidence | **Planned** | `invoice_match_evidence` | B58-P1 |

### B58 P2 — Accountability

| Term | Status | Planned Atom ID | Slice |
| --- | --- | --- | --- |
| Supplier accountability score | **Planned** | `supplier_accountability_score` | B58-P2 |

---

## Procurement backlog (missing / ambiguous / cross-domain)

Remaining rows from gap report §B.2 and [Procurement NS §3](../../NORTHSTAR/procurement-north-star.md). Knowledge map retains `missing` rows for LAW K6 honesty.

| Term | Gap report status | Wire | Required action | Knowledge map status |
| --- | --- | --- | --- | --- |
| Goods receipt signal | Missing | Cross-domain KV-INV | Atom — signal not stock movement | `missing` |
| Three-way match | Missing | ADR-gated | Cross-domain PROC + INV + ACCT | `missing` |
| Approval (requisition) | Ambiguous | Partial wire | Decide workflow vs procurement-scoped atom | — |
| Purchasing group | Ambiguous | Team analog | Perspective or atom linking Team ↔ procurement org | — |
| Supplier invoice | Missing | — | Cross-domain KV-ACCT + atom | — |
| Award decision | Planned | — | PAS-PROC-001C | — |
| Procurement exception | Planned | — | PAS-PROC-001G | — |
| Spend intent | Planned | — | Procurement NS P2 vocabulary | — |
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
| B57 procurement P1 | `B57_PROCUREMENT_P1_ATOM_IDS` | 3 |
| **Total (current)** | `KNOWLEDGE_ATOM_IDS` | **47** |
| B58 Product Bank P0 (planned) | `B58_PRODUCT_BANK_P0_ATOM_IDS` | 4 |
| B58 Product Bank P1 (planned) | `B58_PRODUCT_BANK_P1_ATOM_IDS` | 4 |
| B58 Product Bank P2 (planned) | `B58_PRODUCT_BANK_P2_ATOM_IDS` | 1 |
| **Total after B58** | — | **56** |

**Fingerprint:** `ENTERPRISE-KNOWLEDGE-2026-06-30-v4` (B58 pending — not yet promoted)

> **B58 prerequisite:** PAS-PROC-001K stub accepted → B58 slice authored with 9-field handoff → atoms promoted to `packages/enterprise-knowledge/src/data/` — documentation only until slice executed.

---

## Related

| Artifact | Path |
| --- | --- |
| Procurement North Star | [procurement-north-star.md](../../NORTHSTAR/procurement-north-star.md) |
| Procurement readiness report | [procurement-runtime-readiness-report.md](./PROCUREMENT/procurement-runtime-readiness-report.md) |
| Foundation bundle | `packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts` |
| Alignment gate | `pnpm check:erp-module-knowledge-alignment` |
