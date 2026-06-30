# Procurement Product Bank — MVP Specification

| Field | Value |
| --- | --- |
| **Document class** | `mvp_specification` |
| **Authority** | [PAS-PROC-001K](../PAS-PROC-001K-PROCUREMENT-PRODUCT-BANK-AND-SUPPLIER-PORTAL-STANDARD.md) · [Procurement NS §2.0 · §3.6](../../../NORTHSTAR/procurement-north-star.md) |
| **Scope** | Minimum viable Product Bank + supplier catalog portal + requestor self-service |
| **Runtime stance** | **Not implemented** — spec only; slice handoffs required |
| **Last updated** | 2026-06-30 |

> **One sentence:** The Product Bank MVP delivers supplier-submitted catalog items with buyer review and publication, requestor self-service browse, buying decision records, and a supplier portal for catalog/price/certificate maintenance — without requiring supplier invoice/match/payment features in phase 1.

---

# Phase 1 — Product Bank Core (minimal viable)

## Roles

| Role | MVP capability |
| --- | --- |
| **Supplier** | Submit catalog items, price lists, certificates; view own submission status |
| **Buyer** | Review queue; accept/reject/block; publish to requestors |
| **Technical/QA reviewer** | Approve/reject spec, certificate, cargo safety, storage |
| **Requestor** | Browse approved/preferred/contracted catalog; submit catalog PR |
| **Procurement governance** | View catalog publication state, blocked items, audit trail |

## Events

| # | Event | Actor | Output |
| --- | --- | --- | --- |
| 1 | Supplier submits catalog item | Supplier | Catalog item in review queue |
| 2 | Buyer screens submission | Buyer | Pass to technical review or reject |
| 3 | Technical reviewer approves spec | Technical | Approved for sourcing |
| 4 | Buyer publishes to requestor catalog | Buyer | Catalog item becomes requestor-browsable |
| 5 | Requestor browses catalog | Requestor | PR pre-populated with approved item |
| 6 | Buyer creates buying decision record at award | Buyer | Buying decision record linked to PO |
| 7 | Price list uploaded and validated | Supplier/Buyer | Active price list with validity window |
| 8 | Price list near-expiry alert | System | Buyer notified |
| 9 | Price list expired | System | Blocked from new commitments (I-CAT-004) |
| 10 | Supplier catalog item change | Supplier | Old value retained; audit record created (I-CAT-007) |

## Minimal API / signal contracts (reference only — runtime pending)

| Contract | Direction | Owned by |
| --- | --- | --- |
| `SupplierCatalogItemSubmitted` | Supplier portal → Product Bank queue | Procurement |
| `ProductBankItemApproved` | Product Bank → Catalog publication | Procurement |
| `CatalogItemPublished` | Product Bank → Requestor catalog | Procurement |
| `PriceListUploaded` | Supplier portal → A3 governance | Procurement |
| `PriceListExpired` | System → PO gate | Procurement |
| `BuyingDecisionRecordCreated` | Award/PO → Audit trail | Procurement |
| `MasterDataPromotionRequested` | Procurement → BMD | Procurement emits · BMD acts |

## Acceptance criteria (Phase 1)

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Supplier-submitted item not visible to requestors until buyer approves | I-CAT-001 + I-CAT-002 |
| 2 | Expired price list blocked from new PO commitments | I-CAT-004 + price validity gate |
| 3 | Every catalog change retains old/new/submitter/reviewer/timestamp/reason | I-CAT-007 |
| 4 | Buying decision record required at sourcing award or PO | I-CAT-008 |
| 5 | Product Bank item never creates Item Master directly | I-CAT-005 — promotion emit only |
| 6 | Publication state enforced — only `requestor_browsable` visible to requestors | I-CAT-006 |
| 7 | B58-P0 atoms accepted before semantic runtime | LAW K6 |

---

# Phase 2 — Supplier S2P Portal Extensions (next)

| Feature | Prereq | Notes |
| --- | --- | --- |
| PO inbox and acknowledgment | Phase 1 complete · PO commitment runtime | B8 PO lifecycle |
| ASN / delivery notice submission | Phase 2 PO | B9 receipt signal |
| Invoice submission channel | Accounting invoice capture contract | → Accounting; not procurement |
| Match status display | Accounting feed contract | I-S2P-004 — feed only |
| Payment status display | Treasury feed contract | I-S2P-003/004 |
| Supplier accountability scorecard | Phase 2 | catalog freshness + PO ack + invoice quality |

## Cross-references (Phase 2 dependencies)

| Dependency | Owner | Status |
| --- | --- | --- |
| Accounting invoice capture API contract | Accounting PAS | Pending |
| Treasury payment status feed | Treasury PAS | Pending |
| Supplier-facing auth + SupplierId tenancy scoping | Supplier Portal ADR | Pending |
| Accounting match status feed contract | Accounting PAS | Pending |

---

# Atom → Feature Acceptance Checklist (B58)

Before implementing any Phase 1 feature, the following B58 P0 atoms must be accepted via PAS-004:

| Atom | Feature dependency | Acceptance required before |
| --- | --- | --- |
| `supplier_catalog_item` | Event 1 — catalog submission | Phase 1 start |
| `product_bank_item` | Event 2/3/4 — review and publish | Phase 1 start |
| `buying_decision_record` | Event 6 — buying decision | Phase 1 start |
| `supplier_price_list` | Event 7/8/9 — price list | Phase 1 start |
| `catalog_publication_state` | Event 4/5 — publication lifecycle | Phase 1 |
| `landed_cost_evaluation` | Buyer comparison in review | Phase 1 (if true cost included) |
| `requestor_sourcing_catalog` | Event 5 — requestor browse | Phase 1 |

---

# Risk Log

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Supplier portal auth/tenancy ADR not ready | Blocks Phase 2 portal login | Phase 1 can use buyer-side entry only initially |
| Accounting invoice feed contract not available | Blocks Phase 2 invoice submission | Phase 1 ships without invoice; supplier contacts AP directly |
| B58 atoms not accepted in time | Runtime blocked by LAW K6 | Submit B58 slice immediately after PAS-PROC-001K acceptance |
| Product Bank confused with Item Master | Data integrity | I-CAT-005 gate + promotion-emit-only boundary |
| Supplier submits; buyer ignores queue | Catalog staleness | SLA governance in B12 accountability |

---

# Build Leverage (OSS and Industry Patterns)

**SSOT:** [procurement-oss-benchmark-review.md](./procurement-oss-benchmark-review.md)

| Phase | Borrow (pattern only) | Avoid |
| --- | --- | --- |
| **Phase 1** | BetterSpend price validity gate · ERPNext review-queue UX · OpenProcurement buying-decision evidence | Item Master from catalog · supplier login without ADR |
| **Phase 2** | ERPNext PO inbox · Coupa match/payment **display** feeds | Local match state · invoice capture in procurement |

**P0 borrow for Phase 1:** price validity (I-CAT-004) · buyer review lifecycle (PROC-001K-S1) · buying decision record (PROC-001K-S5) · promotion emit only (I-CAT-005).

Full stack: [benchmark review §4](./procurement-oss-benchmark-review.md#4-what-to-borrow-prioritized-build-leverage-stack).

---

# Related Documents

| Document | Role |
| --- | --- |
| [PAS-PROC-001K](../PAS-PROC-001K-PROCUREMENT-PRODUCT-BANK-AND-SUPPLIER-PORTAL-STANDARD.md) | Full authority standard |
| [Procurement NS §3.6–§3.9](../../../NORTHSTAR/procurement-north-star.md) | Domain doctrine |
| [Procurement Blueprint §4.1–§4.2](../../../BLUEPRINT/procurement-blueprint.md) | Box map |
| [PAS-004 backlog](../PAS-004-module-foundation-promotion-backlog.md) | B58 atom tracking |
| [Gap report §B.5–§B.8](./procurement-foundation-gap-report.md) | Gap assessment |
| [procurement-oss-benchmark-review.md](./procurement-oss-benchmark-review.md) | Wins · borrow stack · avoid list |
