# PAS-PROC-001K — Procurement Product Bank and Supplier S2P Portal Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-PROC-001K |
| **Title** | Procurement Product Bank and Supplier S2P Portal Standard |
| **Document class** | `platform_authority_standard` |
| **Status** | **STUB** — authority accepted via Procurement NS doctrine (2026-06-30); runtime contracts pending slice handoffs |
| **Authority** | [Procurement North Star §2.0 · §3.6–§3.10 · §5.1](../../NORTHSTAR/procurement-north-star.md) |
| **Blueprint** | [Procurement Blueprint §4.1–§4.2](../../BLUEPRINT/procurement-blueprint.md) |
| **Parent PAS** | PAS-PROC-001 (planned) |
| **Derived from** | NS §3.6 · §3.7 · §3.8 · §3.9 · §2.0 · §2.8 · §2.9 |
| **Kernel wire** | KV-PROC · B80 (contracts-only) |
| **PAS-004 atoms** | B56/B57 core procurement accepted · B58 Product Bank atoms planned |
| **Authority ADR** | [ADR-0031](../../adr/ADR-0031-procurement-runtime-authority-boundary.md) · Supplier Portal ADR: **pending** |
| **Slice catalog** | [SLICE/README](../SLICE/README.md) — slices require handoff files |
| **Runtime status** | **Not ready** — documented only; Product Bank and supplier portal runtime blocked until slice handoffs authorized |
| **Runtime path** | `packages/features/erp-modules/src/procurement/product-bank/` · `packages/features/erp-modules/src/procurement/supplier-portal/` |
| **Creation gates** | §12 below |
| **Does not confer** | Runtime authority · TypeScript contracts · package scaffold rights · database schema |
| **Last updated** | 2026-06-30 |

> **One sentence:** PAS-PROC-001K defines the authority boundary, data domains, actor separation, lifecycle rules, invariants, and cross-domain handoffs governing Procurement Product Bank (buyer-reviewed sourcing truth) and the Supplier S2P Portal (governed supplier self-service for catalog, pricing, PO acknowledgment, ASN, invoice submission, and read-only match/payment status).

---

# 0. Agent Quick Path

**Read order:** [Procurement NS §3.6–§3.9](../../NORTHSTAR/procurement-north-star.md) → [Procurement Blueprint §4.1–§4.2](../../BLUEPRINT/procurement-blueprint.md) → **this document** → slice handoff → code.

**Hard stops:**

- Do not allow supplier-submitted catalog items to become requestor-browsable without Procurement review (I-CAT-001 · I-CAT-002).
- Do not allow Item Master creation from Product Bank items without BMD promotion via [ADR-0020](../../adr/ADR-0020-master-data-authority-consolidation.md).
- Do not implement supplier invoice handling in procurement runtime — supplier submits via portal; Accounting captures and validates (I-S2P-001).
- Do not show match or payment state to supplier from procurement-local data — display Accounting/Treasury feed only (I-S2P-004).
- Do not allow supplier to publish directly to requestor catalog (I-CAT-002).
- Do not allow expired price lists to back new commitments without approved exception (I-CAT-004).

---

# 1. Authority and Boundary

## 1.1 What PAS-PROC-001K authorizes

This standard governs:

- **Supplier-self-managed catalog portal** — submission, change audit, governance
- **Product Bank acceptance workflow** — buyer review, technical/QA/warehouse review, accept/reject/block
- **Catalog publication lifecycle** — private → buyer-visible → approved → requestor-browsable
- **Price list governance** — upload, parse, validity, near-expiry, expiry enforcement
- **Buying decision record** — structured capture at award/PO
- **Three-layer product truth** — boundary between supplier-offered, buyer-reviewed, and Item Master truth
- **Requestor self-service catalog** — browse/request from published approved catalog
- **Supplier S2P portal** — PO inbox, ASN, invoice submission, match/payment status display
- **Supplier accountability scorecard** — catalog freshness, PO ack SLA, invoice quality

## 1.2 What PAS-PROC-001K does not authorize

| Scope | Correct authority |
| --- | --- |
| Item Master creation | BMD · [ADR-0020](../../adr/ADR-0020-master-data-authority-consolidation.md) |
| Retail product catalog | Sales domain PAS |
| Manufacturing BOM | Manufacturing domain PAS |
| Invoice validation/matching/posting | Accounting |
| Payment execution | Treasury |
| Supplier master identity | BMD · PAS-001 SupplierId |
| Stock movement / receiving | Inventory |
| Supplier onboarding / KYB | Supplier Engagement (PAS-PROC-001H) |

## 1.3 Doctrine

```text
Supplier may submit and maintain.
Procurement must accept and publish.
Requestor may browse.
Buyer must decide.
```

Afenda Procurement does not become the supplier's data-entry department.  
Afenda Procurement becomes the acceptance, comparison, decision, and governance authority.

---

# 2. Three-Layer Product Truth Boundary

```text
┌───────────────────────────────┐
│  SUPPLIER CATALOG ITEM         │  ← supplier-offered truth
│  (submitted via portal)        │     untrusted until reviewed
└───────────┬───────────────────┘
            │ buyer review + accept
            ↓
┌───────────────────────────────┐
│  PRODUCT BANK ITEM            │  ← buyer-reviewed sourcing truth
│  (accepted by Procurement)    │     may be published to requestors
└───────────┬───────────────────┘
            │ master-data promotion request (emit)
            ↓
┌───────────────────────────────┐
│  ITEM MASTER                  │  ← operational enterprise truth
│  (BMD / Inventory per ADR-0020)│    Procurement does not own this
└───────────────────────────────┘
```

| Layer | Truth class | Authority |
| --- | --- | --- |
| Supplier Catalog Item | Supplier-offered | Supplier submits; Procurement governs acceptance |
| Product Bank Item | Buyer-reviewed | Procurement |
| Item Master | Operational | BMD / Inventory per [ADR-0020](../../adr/ADR-0020-master-data-authority-consolidation.md) |

> **LAW:** Product Bank must not become a parallel Item Master, retail catalog, or BOM. Promotion is an **emit** from Procurement to BMD — not Procurement ownership.

---

# 3. Supplier S2P Portal Modules

| Module | Surface | Governed by | Connects to |
| --- | --- | --- | --- |
| **Catalog & price list** | Submit, update, version, photos, specs | Procurement A0 | Product Bank review queue |
| **Certificates & compliance docs** | Upload, expiry tracking | Procurement A2 | Technical review queue |
| **PO inbox** | View PO lines, qty, price, delivery | Procurement B8 | PO commitment lifecycle |
| **PO acknowledgment** | Confirm/query per line | Procurement B8 | PO ack state |
| **ASN / delivery notice** | Submit advance shipment | Procurement B9 | Receipt expectation |
| **Invoice submission** | Submit invoice against PO + attachments | → Accounting capture | Invoice capture lifecycle |
| **Match status (read-only)** | Match result, exception reason codes | ← Accounting feed | Portal display only |
| **Payment status (read-only)** | Scheduled date, paid, remittance ref | ← Treasury feed | Portal display only |
| **Dispute / query** | Raise exception query; respond to AP query | Procurement + Accounting | Exception workflow |
| **Supplier accountability** | Catalog freshness, PO ack SLA, invoice quality | Procurement B12 | Scorecard display |

## 3.1 Supplier visibility rules

| Data | Supplier may see | Supplier must not see |
| --- | --- | --- |
| Own POs | Lines, qty, price, delivery date, status | Internal buyer notes, competitor awards |
| Receipt | Qty received vs ordered | Internal shrinkage write-offs |
| Invoice | Own submission status and reason | Other suppliers' invoices |
| Match | Match result + exception reason code | Internal GL accounts |
| Payment | Scheduled date, paid, remittance ref | Bank funding source, Treasury batch |
| Catalog | Own offers + publication status | Internal preferred/blocked rationale (optional redacted) |

---

# 4. Product Bank — Acceptance and Governance

## 4.1 Review workflow

```text
Supplier submitted catalog item (A0)
        ↓
Procurement screening (buyer) — duplicate, completeness, category fit
        ↓
Technical / QA / Warehouse review — spec, certificates, storage, cargo safety
        ↓
Buyer final decision — approve / reject / block
        ↓  [if approved]
Product Bank item created (buyer-reviewed sourcing truth)
        ↓  [if publication decision made]
Publication lifecycle (§4.2)
```

## 4.2 Catalog publication lifecycle states

| State | Meaning | Actor |
| --- | --- | --- |
| `private_supplier_offer` | Submitted; under review | Procurement |
| `buyer_visible` | Passed screening; visible to buyers only | Procurement |
| `approved_internal` | Full buyer + technical approval | Procurement |
| `requestor_browsable` | Published to requestor catalog | Procurement (publication authority) |
| `preferred` | Preferred product for category | Buyer |
| `contracted` | Covered by blanket/contract | Buyer |
| `restricted` | Visible but cannot be requested freely | Procurement |
| `blocked` | Removed from all sourcing paths | Procurement |
| `expired` | Product offer or price expired | System |
| `superseded` | Replaced by newer offer | Procurement |
| `retired` | No longer available | Procurement |

## 4.3 Supplier-maintained vs buyer-controlled fields

**Supplier maintains:**
- Product name / SKU · photos · documents
- Specification / grade · packaging
- MOQ · lead time · shelf life · storage requirement
- Price list · currency · price validity · incoterm · payment terms
- Country of origin · certificates (COA/COO/halal/food safety/MSDS)
- Delivery coverage · product substitutes

**Buyer controls:**
- Internal product classification · spend category
- Approved / preferred / blocked status
- Product equivalence map
- Buying decision notes · negotiated/contracted price
- True cost assumptions (freight, duty, shrinkage, FX, handling)
- Cargo safety acceptance · warehouse fit · channel fit
- Requestor visibility toggle
- Master-data promotion decision

## 4.4 Product Bank data domains

| Domain | Contents |
| --- | --- |
| **A — Identity** | Supplier, SKU, name, category, alternate IDs |
| **B — Technical** | Specification, grade, certificates, substitutes, regulatory compliance |
| **C — Supplier offer** | Price list, validity, currency, incoterms, MOQ, lead time, packaging |
| **D — True cost** | Landed cost calculation, freight, duty, shrinkage, handling |
| **E — Cargo / storage safety** | Storage type, cold chain, hazmat, fragile, shelf life, FEFO |
| **F — Warehouse / shrinkage fit** | Yield profile, write-off %, damage risk |
| **G — Channel fit** | Retail-ready, MFG input, regulatory approval, usage restriction |

---

# 5. Price List Governance

## 5.1 Price list lifecycle

```text
Uploaded (via portal or EDI import)
→ Parsed (system extracts lines, currency, validity window)
→ Buyer reviewed (price basis confirmed)
→ Active (valid for sourcing and PO)
→ Near expiry (alert: buyer notified N days before end)
→ Expired (cannot back new commitments — I-CAT-004)
→ Superseded (replaced by new version)
→ Archived (retained for audit; no sourcing use)
```

## 5.2 Required price list fields

| Field | Required | Validation |
| --- | --- | --- |
| Supplier identity | Yes | SupplierId from BMD |
| Price list version | Yes | Monotonic or date-based |
| Effective date | Yes | Must not be retroactive without exception |
| Expiry date | Yes | Required — I-CAT-003 |
| Currency | Yes | ISO 4217 |
| Incoterm | Yes | Declared trade term |
| Price lines | Yes | SKU / item reference + unit price + UOM |
| Payment terms | Conditional | Required for commercial comparison |

---

# 6. Requestor Self-Service

## 6.1 Requestor browsing — rules

1. Requestor sees only items with publication status `requestor_browsable` or `preferred` or `contracted`.
2. Requestor sees: supplier name, price validity, MOQ, lead time, approved/preferred/contracted badge, restrictions.
3. Requestor **cannot** see: blocked rationale, internal buyer notes, competitor awards.
4. Selecting an existing approved item pre-populates PR — buyer review burden reduced.

## 6.2 New product request flow

```text
Requestor cannot find approved item
→ Submit new product request
→ Buyer checks Product Bank for existing supplier offers
→ If approved offer exists → link to PR and fast-track
→ If not → sourcing event begins (B6)
```

---

# 7. Buying Decision Record

Every sourcing award or PO commitment must include:

| Field | Required | Meaning |
| --- | --- | --- |
| Selected supplier | Yes | SupplierId + name |
| Sourcing method | Yes | Catalog / RFQ / direct award / emergency / contract release |
| Product Bank item reference | Yes (if applicable) | Which approved item was used |
| Award reasoning | Yes | Why this path was chosen |
| Price basis | Yes | Sticker / negotiated / contracted / exception |
| Approved by | Yes | Approver identity |
| Exception reference | If bypass | Owner, reason, expiry |
| Commercial snapshot | If available | Price validity, landed cost, alternatives compared |

> **I-CAT-008:** Buyer decision must record why a supplier/product/price path was selected when creating sourcing award or PO commitment.

---

# 8. Entity Lifecycles

## 8.1 Supplier Catalog Item lifecycle (see NS §8.10)

```text
Supplier draft → Supplier submitted → Procurement screening →
Technical/QA/Warehouse review → Approved for sourcing →
Published to requestor catalog → Preferred / Contracted / Blocked →
Expired / Superseded / Retired
```

## 8.2 Supplier price list lifecycle (see NS §8.11)

```text
Uploaded → Parsed → Buyer reviewed → Active →
Near expiry → Expired → Superseded → Archived
```

## 8.3 Catalog publication lifecycle (see NS §8.12)

```text
Private supplier offer → Buyer-visible → Approved internal catalog →
Requestor-browsable → Restricted / Blocked / Retired
```

## 8.4 Product Bank item lifecycle (see NS §8.13)

```text
Unreviewed (from supplier) → Under review → Approved →
Preferred / Contracted → Published → Near expiry → Expired / Superseded → Archived
```

## 8.5 Supplier invoice submission lifecycle (Accounting owns truth)

```text
Supplier draft invoice (via portal)
→ Submitted (Accounting notified)
→ Accounting validation (PO reference, tax, duplicate)
→ Accepted for matching OR rejected with reason (Accounting)
→ In match queue (Accounting)
→ Matched / partial / exception (Accounting)
→ Approved for posting (Accounting)
→ Payable created (Accounting)
→ [Treasury] scheduled → paid → remittance to supplier
```

**Procurement role:** Provide PO evidence. **Never** validate tax or post.

---

# 9. Invariants (from Procurement NS §5.1)

## I-CAT catalog invariants

| ID | Rule |
| --- | --- |
| I-CAT-001 | Supplier-submitted catalog data is not accepted procurement truth until reviewed and accepted by Afenda authority. |
| I-CAT-002 | No supplier may publish directly to requestor catalog without procurement approval. |
| I-CAT-003 | Every supplier price list must carry validity period, currency, supplier identity, and version. |
| I-CAT-004 | Expired price lists must not be used for new commitments unless an exception is approved. |
| I-CAT-005 | Supplier catalog items must not become Item Master records without master-data promotion via BMD authority (ADR-0020). |
| I-CAT-006 | Product Bank items may be browsable for requestors only after publication status is approved. |
| I-CAT-007 | Any supplier catalog change must retain old value, new value, submitter, reviewer, timestamp, and reason. |
| I-CAT-008 | Buyer decision must record why a supplier/product/price path was selected when creating sourcing award or PO commitment. |
| I-CAT-009 | Product Bank may classify product suitability for sourcing decisions, but it must not become the authoritative retail sellable catalog, manufacturing BOM, inventory SKU master, or costing master. |
| I-CAT-010 | Supplier catalog visibility is earned by data completeness, validity, and acceptance status — expired, incomplete, or unreviewed offers must be hidden, restricted, or exception-only. |
| I-CAT-011 | Supplier-submitted certificates and documents must carry issuer identity, validity period, upload actor, review actor, approval date, expiry date, and affected products; expired certificates must trigger alerts before use in new commitments. |

## I-BUY buying invariants

| ID | Rule |
| --- | --- |
| I-BUY-001 | Every buying decision where sourcing comparison is required must preserve: alternatives considered, rejected options, basis for rejection, and final decision basis — not only the winner. |

## I-PORTAL surface invariants

| ID | Rule |
| --- | --- |
| I-PORTAL-001 | Supplier Portal may display cross-domain status (match result, payment status, remittance) but must not create Accounting match truth, Treasury payment truth, or Inventory stock truth; all such status must originate from the owning domain's feed. |

## I-S2P loop invariants

| ID | Rule |
| --- | --- |
| I-S2P-001 | Supplier invoice submission does not create payable until Accounting accepts. |
| I-S2P-002 | Match outcome is Accounting authority — supplier cannot self-clear exceptions. |
| I-S2P-003 | Payment execution is Treasury authority — Procurement never triggers pay. |
| I-S2P-004 | Supplier portal displays match/payment status from Accounting/Treasury feeds only — no Procurement-local payment state. |
| I-S2P-005 | Every PO→invoice→match→pay chain must be traceable to SupplierId + POId + commitment evidence. |
| I-S2P-006 | Procurement exception on receipt/variance must surface to Accounting match context — no silent drop. |

---

# 10. Cross-Domain Handoff (this PAS)

| Procurement output | Consuming domain | Procurement owns | Consumer owns |
| --- | --- | --- | --- |
| Product Bank item | BMD / Inventory | Sourcing truth, promotion request | Item Master creation |
| Catalog publication | Requestors (via portal display) | Publication approval and state | — |
| Invoice submitted (via portal) | Accounting | Portal submission channel | Capture, validate, match, post |
| Match status (feed) | Portal display ← Accounting | Portal display surface | Match result |
| Payment status (feed) | Portal display ← Treasury | Portal display surface | Payment execution |
| Price list validated | PO commitment (A3→B8) | Price validity enforcement | — |
| Buying decision record | Audit / Accounting match context | Record creation | Match evidence consumption |
| Master-data promotion request | BMD | Emit on accepted sourcing | Item Master creation |

---

# 11. PAS-004 Knowledge Atom Binding (B58 planned)

| Concept | Current status | Planned atom | Priority |
| --- | --- | --- | --- |
| `procurement_requisition` | **Accepted** (B53) | — | Done |
| `purchase_order` | **Accepted** (B56) | — | Done |
| `supplier` | **Accepted** (B56) | — | Done |
| `procurement_rfq` | **Accepted** (B56) | — | Done |
| `supplier_quote` | **Accepted** (B57) | — | Done |
| `blanket_agreement` | **Accepted** (B57) | — | Done |
| `procurement_sourcing` | **Accepted** (B57) | — | Done |
| `supplier_catalog_item` | **Planned** (B58) | `supplier_catalog_item` | P0 |
| `product_bank_item` | **Planned** (B58) | `product_bank_item` | P0 |
| `buying_decision_record` | **Planned** (B58) | `buying_decision_record` | P0 |
| `catalog_publication_state` | **Planned** (B58) | `catalog_publication_state` | P1 |
| `supplier_price_list` | **Planned** (B58) | `supplier_price_list` | P0 |
| `landed_cost_evaluation` | **Planned** (B58) | `landed_cost_evaluation` | P1 |
| `requestor_sourcing_catalog` | **Planned** (B58) | `requestor_sourcing_catalog` | P1 |
| `supplier_accountability_score` | **Planned** (B58) | `supplier_accountability_score` | P2 |
| `goods_receipt_signal` | **Missing** (cross-domain KV-INV) | — | Cross-domain ADR |
| `three_way_match` | **Missing** (ADR-gated) | — | Accounting cross-domain |
| `invoice_match_evidence` | **Planned** | `invoice_match_evidence` | P1 |

> **LAW K6:** B58 atoms must be accepted before semantic runtime in product bank or supplier portal. Slice B58 acceptance precedes runtime package scaffold.

---

# 12. Required Gates (proposed — to be confirmed in slice handoffs)

| Gate | Purpose | Tier |
| --- | --- | --- |
| `check:procurement-product-bank-boundary` | Product Bank items not created as Item Master; promotion is emit-only | Foundation |
| `check:procurement-supplier-portal-auth` | Supplier-facing routes use scoped SupplierId tenancy | Runtime |
| `check:procurement-catalog-publication-states` | Only `approved` and `requestor_browsable` states visible to requestors | Runtime |
| `check:procurement-price-list-validity` | Expired price lists blocked from commitment (I-CAT-004) | Runtime |
| `check:procurement-catalog-change-audit` | I-CAT-007 — old/new/submitter/reviewer/timestamp/reason retained | Runtime |
| `check:procurement-buying-decision-record` | I-CAT-008 — award and PO have buying decision references | Runtime |
| `check:procurement-invoice-submission-boundary` | Portal submits invoice; Accounting validation not in procurement code | Runtime |
| `check:procurement-match-payment-feed-only` | Match/payment state sourced from Accounting/Treasury feeds (I-S2P-004) | Runtime |
| `check:procurement-master-data-promotion` | Item Master not created in procurement; promotion is emit (I-CAT-005) | Runtime |

---

# 13. Presentation Notes

**UI surface (future ADR and PAS-006 binding):**

| Surface | Notes |
| --- | --- |
| Supplier portal | Supplier-facing authenticated surface — requires dedicated auth ADR (SupplierId tenancy scope) |
| Buyer review queue | Internal ERP UI — PAS-006 binding under ERP-MODULES presentation |
| Requestor catalog browse | Internal ERP UI — search + filter + request path |
| Product Bank management | Internal buyer surface — review, compare, approve, publish |
| Price list management | Internal buyer surface — validity, near-expiry, archive |
| Buying decision record UI | Inline in sourcing award / PO creation |

---

# 14. Slice Execution Plan (derived from NS §15)

| Slice ID | Scope | Prereq | Status |
| --- | --- | --- | --- |
| **B58-P0** | Promote `supplier_catalog_item` · `product_bank_item` · `buying_decision_record` · `supplier_price_list` atoms | PAS-PROC-001K stub accepted | **Planned** |
| **PROC-001K-S1** | Product Bank acceptance workflow — buyer review queue contracts | B58-P0 accepted | Planned |
| **PROC-001K-S2** | Catalog publication lifecycle state machine | PROC-001K-S1 | Planned |
| **PROC-001K-S3** | Price list upload, parse, validity enforcement gate | PROC-001K-S2 | Planned |
| **PROC-001K-S4** | Requestor self-service catalog browse surface | PROC-001K-S2 | Planned |
| **PROC-001K-S5** | Buying decision record — capture at award/PO | PROC-001K-S3 | Planned |
| **PROC-001K-S6** | Supplier portal — catalog/price submit surface | Supplier auth ADR + PROC-001K-S5 | Planned |
| **PROC-001K-S7** | Supplier portal — PO inbox, ASN, invoice channel | PROC-001K-S6 + Accounting feed contract | Planned |
| **PROC-001K-S8** | Supplier portal — match/payment status display | PROC-001K-S7 + Accounting/Treasury feed | Planned |
| **PROC-001K-S9** | Supplier accountability scorecard | PROC-001K-S8 | Planned |
| **PROC-001K-S10** | Master-data promotion request emit + gate | PROC-001K-S5 + BMD handoff contract | Planned |

---

# 16. OSS Adopt, Borrow, and Avoid

**SSOT:** [procurement-oss-benchmark-review.md](./PROCUREMENT/procurement-oss-benchmark-review.md)

When implementing slices in §14, use this PAS-local summary — full matrix and per-source notes live in the benchmark review.

## 16.1 Keep (Afenda wins — do not compromise)

| Invariant cluster | PAS-001K anchor | OSS/giant trap |
| --- | --- | --- |
| I-CAT-001…011 · three-layer truth | §4 · §8 | Item Master = supplier offer |
| I-BUY-001 · buying decision record | §6 · PROC-001K-S5 | Award without audit trail |
| I-PORTAL-001 · surface not owner | §7 · PROC-001K-S7/S8 | Local match/payment DB |
| I-S2P-001…006 · emit only | §7 · §9 | Monolithic P2P module |

## 16.2 Borrow (prioritized for slice authors)

| Priority | Implement in slice | Borrow from | Notes |
| --- | --- | --- | --- |
| **P0** | PROC-001K-S1–S3 | BetterSpend price validity · ERPNext review queue UX | Stage 1 internal Product Bank |
| **P0** | PROC-001K-S5 | OpenProcurement award evidence | I-BUY-001 |
| **P1** | PROC-001K-S4 | Coupa/ERPNext requestor catalog pattern | After publication lifecycle |
| **P2** | PROC-001K-S6 | ERPNext supplier RFQ portal | Requires Supplier Portal ADR |
| **P3** | PROC-001K-S7/S8 | BetterSpend invoice channel · Coupa status display | Accounting/Treasury feeds only |

## 16.3 Avoid (explicit non-goals)

- Do not copy BetterSpend as a single procurement app — borrow budget gate and tolerance **spec**, not architecture.
- Do not implement `ThreeWayMatch` entity in procurement — open-mercato pattern belongs in Accounting PAS (PAS-PROC-001I emits evidence).
- Do not ship supplier login before Supplier Portal ADR and Stage 3 gate (Blueprint §9).
- Do not promote Product Bank items to Item Master without BMD handoff (ADR-0020).

**Build leverage map:** [benchmark review §8](./PROCUREMENT/procurement-oss-benchmark-review.md#8-build-leverage-map-doc--slice--stage)

---

# 15. Related Documents

| Document | Role |
| --- | --- |
| [Procurement North Star §2.0 · §3.6–§3.10](../../NORTHSTAR/procurement-north-star.md) | Domain authority, invariants, lifecycles |
| [Procurement Blueprint §4.1–§4.2](../../BLUEPRINT/procurement-blueprint.md) | Box map |
| [procurement-product-bank-mvp-spec.md](./PROCUREMENT/procurement-product-bank-mvp-spec.md) | One-pager MVP specification |
| [procurement-oss-benchmark-review.md](./PROCUREMENT/procurement-oss-benchmark-review.md) | OSS wins · borrow stack · avoid list · build leverage |
| [Gap report §B.5–§B.8](./PROCUREMENT/procurement-foundation-gap-report.md) | Foundation gap assessment |
| [Readiness report](./PROCUREMENT/procurement-runtime-readiness-report.md) | Operational readiness attestation |
| [PAS-004 backlog (B58)](./PAS-004-module-foundation-promotion-backlog.md) | Atom promotion tracking |
| [ADR-0020](../../adr/ADR-0020-master-data-authority-consolidation.md) | Item Master boundary |
| [ADR-0031](../../adr/ADR-0031-procurement-runtime-authority-boundary.md) | Procurement runtime authority |

---

## Maintenance

| Event | Update |
| --- | --- |
| B58 atom batch accepted | Update §11 status; update PAS-004 backlog |
| Supplier Portal ADR accepted | Update §12 gate status; update §14 slice prereqs |
| Slice handoff closed | Update §14 slice status; update readiness report |
| Product Bank runtime authorized | Update runtime status header |

**PAS status:** `STUB` — runtime slice handoffs required to promote to `STANDARD`.  
**Last updated:** 2026-06-30 · Derived from Procurement NS 9.5 (2026-06-30)
