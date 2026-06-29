# Procurement Domain North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Procurement — source-to-pay and supplier engagement |
| **Domain type** | Line-of-business business domain |
| **Constitutional question** | *How does Afenda govern requisitioning, sourcing, ordering, and supplier accountability from intent through auditable commitment?* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Foundation consumer** | [ERP Module Runtime North Star](erp-module-runtime-north-star.md) — delivery proof only |
| **Cross-domain laws** | [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) · [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) — K6 |
| **Derived document** | [Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) — **Procurement** box (planned) · [Gap report](../PAS/KERNEL/audit/procurement-foundation-gap-report.md) |
| **Authority ADR** | [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) · [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) · runtime ADR *(planned — ERP-PROC-FDN-001)* |
| **Wire anchor** | KV-PROC · [B80](../PAS/KERNEL/SLICE/b80-procurement-domain-vocabulary.md) Delivered (contracts-only) |
| **Maturity** | Draft → Production Candidate (2026-06-30) |
| **Quality target** | Enterprise **9.5 / 10** after runtime ADR + PAS-004 P0 atoms + readiness report |
| **Runtime stance** | Documentation only — wire vocabulary live; business runtime blocked |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation |
| **Last reviewed** | 2026-06-30 |
| **Next document** | ERP-PROC-FDN-001 ADR · Procurement Blueprint box |

> **One sentence:** Procurement permanently governs how enterprise spend intent becomes governed supplier commitment — through classified requisitions, competitive or directed sourcing, purchase orders, receipts, and supplier master accountability — without conflating inventory movement, ledger posting, or module foundation delivery proof.

> **Separation:** [Module Foundation NS](erp-module-runtime-north-star.md) owns *how any LoB module enters production*. This document owns *what procurement means* in enterprise language.

---

# 0. Agent Quick Path

**Read order:** Platform NS → [Module Foundation NS](erp-module-runtime-north-star.md) §9.4 → this §1–§12 → Blueprint Procurement box → PAS → Slice → Code.

**Hard stops (business scope):**

- Do not treat wire labels (KV-PROC) as accepted business definitions — LAW K6.
- Do not implement PO posting, GR-IR, or 3-way match before Accounting ADR gates clear cross-domain dependencies.
- Do not build procurement runtime inside `packages/kernel` — kernel owns words only.
- Do not skip module foundation readiness — consume [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) pattern under path law.

---

# 1. Domain Philosophy

Enterprise procurement fails when requisitions, orders, and supplier records exist as anonymous features — untraceable to authority, meaning, and audit replay. Afenda procurement exists because **spend commitment must be provable before payment and inventory consequences** — independent of how module folders or wire contracts are shaped.

| Source | Reasoning |
| --- | --- |
| [T0 ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) | **Because** supplier master authority is consolidated · **Therefore** procurement consumes supplier identity — does not fork ID families |
| [T5 B80 KV-PROC](../PAS/KERNEL/SLICE/b80-procurement-domain-vocabulary.md) | **Because** wire vocabulary is delivered contracts-only · **Therefore** business runtime awaits foundation + knowledge promotion |
| [T1 Module Foundation NS §9.4](erp-module-runtime-north-star.md) | **Because** delivery proof is orthogonal · **Therefore** procurement NS never replaces foundation gates |

---

# 2. Domain Identity

## Mission

Permanently govern requisition-to-commitment procurement behavior — sourcing discipline, supplier accountability, order lifecycle, and audit-ready spend authorization — consumable by Inventory, Accounting, and Workflow domains through declared dependencies only.

## Definition

| Field | Definition |
| --- | --- |
| **Scope** | Requisition · RFQ/sourcing · purchase order · supplier engagement · blanket/contract release · procurement policy vocabulary · spend authorization events |
| **Out of scope** | Stock movement (Inventory) · ledger posting (Accounting) · payment execution (Treasury) · module foundation delivery (Module Foundation NS) · wire shape amendment (PAS-001B) |

**Procurement is:** the business domain of governed spend intent through supplier commitment.

**Procurement is not:** module scaffold authority, kernel wire catalog editing, or generic workflow engine ownership.

## Success

Teams can authorize spend through classified documents with accepted business meaning, supplier master alignment, and cross-domain hooks declared — replayable under audit without ad-hoc strings or local tenant scope.

---

# 3. Enterprise Vocabulary

| Term | Business meaning | Not confused with | Source | Knowledge atom |
| --- | --- | --- | --- | --- |
| **Purchase requisition** | Internal request to buy goods/services before commitment | Expense report | Gap report · B80 | partial — promote |
| **Purchase order** | External commitment to supplier with terms and lines | Sales order | B80 wire | wire_only |
| **RFQ** | Request for supplier quotation | PO | B80 wire | wire_only |
| **Supplier** | Party providing goods/services — master data subject | Customer | ADR-0020 · PAS-001 SupplierId | missing — BMD |
| **Blanket agreement** | Framework terms enabling release POs | Contract legal doc | B80 wire | wire_only |
| **Goods receipt** | Confirmation of supplier fulfillment | Inventory adjustment alone | Cross-domain | missing |
| **Three-way match** | PO · receipt · invoice alignment | Payment | Accounting cross-domain | missing — ADR-gated |
| **Sourcing event** | Competitive or directed supplier selection | RFQ wire label only | Planned NS event | planned |

**Promotion backlog:** [PAS-004-module-foundation-promotion-backlog.md](../PAS/ERP-MODULES/PAS-004-module-foundation-promotion-backlog.md) §Procurement.

---

# 4. Domain Capability Model (EFR)

| Capability | Tier | Maturity target | Source | Review by |
| --- | --- | --- | --- | --- |
| **Governed requisition lifecycle** | Core | Enterprise | Gap report | Enterprise |
| **Supplier master consumption** | Core | Enterprise | ADR-0020 | Enterprise |
| **Purchase order commitment** | Core | Enterprise | B80 wire | Production |
| **Sourcing / RFQ discipline** | Advanced | Production | Industry ERP | Production |
| **Blanket / contract release** | Advanced | Production | B80 wire | Production |
| **Receipt signal to Inventory** | Core | Enterprise | Cross-domain | Enterprise |
| **Procurement audit vocabulary binding** | Core | Enterprise | Module Foundation NS | Enterprise |
| **Cross-domain dependency declaration** | Core | Enterprise | ADR-0010 · ADR-0020 | Enterprise |

---

# 5. Domain Principles

| # | Principle | Reasoning |
| --- | --- | --- |
| P1 | **Meaning before PO behavior** | wire_only terms block semantic posting |
| P2 | **Supplier identity is master data** | ADR-0020 — no duplicate SupplierId semantics |
| P3 | **Commitment ≠ payment ≠ receipt** | Separate domains own consequences |
| P4 | **Foundation before runtime** | Module Foundation NS — identity before folders |
| P5 | **No silent Accounting coupling** | ADR-0010 — 3-way match ADR-gated |

## 5.1 Invariants

| # | Invariant |
| --- | --- |
| I1 | No PO posting without accepted purchase_order meaning (PAS-004). |
| I2 | No supplier master fork — consume PAS-001 / BMD authority. |
| I3 | No inventory stock movement inside procurement runtime — emit signals only. |
| I4 | No ledger posting inside procurement — Accounting owns posting runtime. |
| I5 | All procurement mutations map to governed audit vocabulary. |

---

# 6. Enterprise Outcomes and KPIs

| Outcome | Target | Measures |
| --- | --- | --- |
| **Spend authorization traceability** | 100% committed spend linked to requisition or policy exception | Audit replay |
| **Supplier master singularity** | Zero duplicate supplier identity semantics | BMD + PAS-001 gates |
| **Knowledge alignment** | Zero `wire_only` terms driving posting | Knowledge map gate |
| **Cross-domain safety** | Zero silent Accounting/Inventory coupling | Runtime contract + ADR |

---

# 7. Business Events (procurement domain)

| Event | Business meaning | Related vocabulary |
| --- | --- | --- |
| **Requisition submitted** | Internal spend intent recorded | Purchase requisition |
| **RFQ issued** | Suppliers invited to quote | RFQ |
| **Purchase order approved** | Commitment authorized | Purchase order |
| **Purchase order sent** | Supplier notified of commitment | Purchase order |
| **Goods receipt recorded** | Fulfillment confirmed — Inventory consumes | Goods receipt |

Dispatch mechanics belong to Execution domain.

---

# 8. Entity Lifecycles

### 8.1 Purchase requisition

```text
Draft → Submitted → Approved → Converted → Closed / Cancelled
```

### 8.2 Purchase order

```text
Draft → Approved → Sent → Partially received → Closed / Cancelled
```

### 8.3 Procurement runtime (platform view)

```text
Wire only (B80) → Foundation authorized → Integration attested → Readiness attested → Operational
```

See [Module Foundation NS §8.1](erp-module-runtime-north-star.md) for foundation lifecycle vocabulary.

---

# 9. Domain Boundary

## 9.1 Owns (business)

- Requisition, RFQ, PO, blanket business meaning and lifecycles
- Procurement policy vocabulary (who may requisition, approve, send)
- Spend authorization events (§7)
- Cross-domain dependency declarations for receipt and match

## 9.2 Never owns

- Module foundation delivery proof (Module Foundation NS)
- Wire catalog shapes (PAS-001B)
- Inventory stock ledger · Accounting journals · Payment rails
- Permission evaluation · UI rendering · HTTP transport

## 9.3 Cross-domain dependencies

| Depends on | Required for |
| --- | --- |
| Enterprise Knowledge | Accepted terms before semantic runtime |
| Module Foundation | Readiness before operational promotion |
| Inventory | Goods receipt consequences |
| Accounting | Invoice match and posting — ADR-gated |
| Master data / BMD | Supplier records |

## 9.4 Orthogonal separation

| Layer | Question |
| --- | --- |
| Module foundation | *How is procurement authorized as a module?* |
| **Procurement (this NS)** | *What do requisition, PO, and supplier mean?* |
| Kernel wire | *What words exist on the wire?* |

---

# 10. Enterprise Risks

| Risk | Mitigation | Handoff |
| --- | --- | --- |
| Semantic runtime on wire_only PO | P1 · PAS-004 promotion | EK slices |
| Supplier master fork | P2 · ADR-0020 | BMD |
| Silent 3-way match | P5 · I4 | Accounting ADR |
| Runtime before foundation | P4 | PAS-001C gates |

---

# 11. Quality Attributes

| Attribute | Expectation |
| --- | --- |
| Auditability | Every commitment mutation mapped |
| Traceability | Requisition → PO → receipt chain |
| Modularity | Inventory/Accounting via declared hooks only |

---

# 12. Domain Evidence

| ID | Claim | Tier | Reference |
| --- | --- | --- | --- |
| E1 | KV-PROC wire delivered | T5 | B80 |
| E2 | Runtime explicitly blocked | T5 | Gap report |
| E3 | Foundation bundle wire-phase | T5 | PROCUREMENT_FOUNDATION_BUNDLE |
| E4 | SupplierId on PAS-001 authority | T0 | ADR-0020 · ADR-0021 |

## 12.4 Maturity status

| Item | Status |
| --- | --- |
| Business NS authored | Production Candidate (this document) |
| Runtime ADR | Planned — ERP-PROC-FDN-001 |
| Operational readiness | **Not ready** — [readiness report](../PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md) |

---

# 13. Capability → Blueprint Traceability

| §4 Capability | Blueprint box |
| --- | --- |
| All procurement EFR rows | **Procurement** (planned) |
| Audit / permission binding | **Procurement** · Module Foundation (consumer) |
| Cross-domain hooks | **Procurement** · **Inventory** · **Accounting** |

---

# 14–19. Governance (summary)

| Topic | Authority |
| --- | --- |
| Business meaning change | This NS §1–§12 |
| Runtime package | ADR + Blueprint + PAS after FDN-001 |
| Wire vocabulary | PAS-001B only |
| Foundation gates | PAS-001C |
| Knowledge atoms | PAS-004 |

**Sync:** Amend this NS when procurement business meaning changes; amend Blueprint/PAS for paths and contracts only.

**Covenant:** Procurement business truth lives here and in Enterprise Knowledge. Module foundation proves integration. Kernel owns wire words. Runtime ships only after both.
