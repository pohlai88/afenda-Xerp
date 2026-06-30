# Procurement OSS and Industry Benchmark Review

| Field | Value |
| --- | --- |
| **Document class** | `benchmark_review` |
| **Authority** | [Procurement North Star §2.4](../../../NORTHSTAR/procurement-north-star.md) · [Procurement Blueprint §17](../../../BLUEPRINT/procurement-blueprint.md) |
| **Scope** | Directional comparison — OSS, giants, Afenda doctrine; **not** product-market ranking |
| **Last reviewed** | 2026-06-30 |
| **Research sources** | GitHub (BetterSpend, ERPNext, Odoo, open-mercato, OpenProcurement, Nexus, Procuman, Shillinq) · Context7 ERPNext docs · SAP Ariba / Oracle Fusion / Coupa pattern-fit (NS §2.4.1) |
| **Runtime stance** | Review only — does not authorize implementation |

> **One sentence:** Records where Afenda Procurement **wins on architecture**, what to **borrow from OSS and giants**, what to **avoid copying**, and the **prioritized build leverage stack** so Stage 1–7 runtime does not repeat monolithic P2P mistakes.

> **Scoring caveat:** Scores measure **maturity in each dimension today** (1–10), not architectural fit alone. Afenda doc rows score **doctrine + specification**; Afenda runtime row scores **what ships** (~2/10). Giant scores in NS §2.4.1 are **pattern-fit for Afenda doctrine**, not market share.

---

# 0. Agent Quick Path

**Use this document when:**

- Planning PAS slices or PROC-BP-* implementation
- Deciding what to build in Stage 1 vs defer to Stage 6–7
- Writing ADRs for supplier portal auth or Accounting/Treasury feeds
- Answering "why not copy ERPNext/Odoo/BetterSpend wholesale?"

**Do not use this document for:** TypeScript contracts, OpenAPI shapes, or runtime completion claims.

---

# 1. Executive summary

| Layer | Score | Meaning |
| --- | ---: | --- |
| **Afenda doctrine (NS + Blueprint)** | **9.1–9.5** | Best-in-class S2P boundary + Product Bank three-layer truth |
| **Afenda runnable procurement** | **2.0** | Wire + foundation only; no Product Bank / portal runtime |
| **OSS leaders (ERPNext, Odoo, BetterSpend)** | **5.4–5.8** avg on 12-dimension matrix | Strong P2P surfaces; weak domain boundaries |
| **Giants (Ariba, Oracle, Coupa)** | **8–10** runnable · **6–7** boundary clarity | Feature-rich; monolithic S2P mental models |

**Strategic position:**

```text
Afenda wins on WHAT to build and WHO owns WHAT.
OSS/giants win on WHAT already runs.
Build leverage = borrow patterns, not architectures.
```

---

# 2. Twelve-dimension comparison matrix

Scores = **implementation maturity today** (1–10). † = spec-only or niche category.

| Dimension | BetterSpend | ERPNext | Odoo | open-mercato† | OpenProc. | **Afenda doc** | **Afenda runtime** |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1. Supplier catalog self-service** | 4 | 3 | 2 (7 w/ addons) | 1 | 7‡ | **6** | **0** |
| **2. Product intelligence / punch-out** | 7 | 4 | 5 | 2 | 3 | **5** | **0** |
| **3. Requestor catalog** | 6 | 5 | 4 | 2 | 1 | **5** | **0** |
| **4. RFQ / sourcing** | 6 | **7** | 6 | 1 | **9** | **6** | **0** |
| **5. PO commitment** | 8 | **8** | **8** | 3 | 2 | **6** | **0** |
| **6. 3-way match boundary** | 3 | 4 | 5 | 6 | 1 | **9** | **0**§ |
| **7. Supplier portal invoice** | 7 | 6 | 3 | 1 | 1 | **5** | **0** |
| **8. Payment visibility** | 5 | 6 | 7 | 1 | 1 | **5** | **0** |
| **9. Cross-domain modularity** | 4 | 3 | 6 | **8** | 6 | **9** | **7**¶ |
| **10. Audit trail** | 8 | 6 | 6 | 5 | **9** | **8** | **3**¶ |
| **11. Multi-tenant enterprise** | 5 | 7 | 8 | 8 | 5 | **6** | **5**¶ |
| **12. Implementation maturity** | 5 | **9** | **9** | 2 | 8‖ | **5** | **2** |
| **Average** | **5.4** | **5.8** | **5.5** | **3.3** | **4.2** | **6.4** | **1.4** |

‡ OpenProcurement: public e-catalog / tender pools — not B2B Product Bank  
§ Afenda **doctrine** correct; Accounting owns execution — no runtime yet  
¶ Foundation bundle + wire + gates only  
‖ Mature for **public tender**, not internal ERP P2P

---

# 3. Where Afenda wins (keep — do not compromise at build time)

| # | Afenda advantage | Evidence | OSS/giant gap |
| --- | --- | --- | --- |
| **W1** | **S2P ownership matrix** — Procurement emits evidence; Accounting matches; Treasury pays | NS §3.9 · I-S2P · I-PORTAL-001 | BetterSpend, Shillinq, ERPNext run match/AP/pay inside one app |
| **W2** | **Three-layer product truth** — Supplier claim → Product Bank → Item Master | NS §2.8 · I-CAT-005/009 | ERPNext/Odoo conflate supplier offer with Item Master |
| **W3** | **Meaning before behavior (K6)** — PAS-004 atoms before semantic runtime | NS M1 · B58 gate | Giants ship features before vocabulary governance |
| **W4** | **Buying decision record + alternatives (I-BUY-001)** | NS §3.7 · §5.1 | OSS often records winner only |
| **W5** | **Supplier maintains; Procurement accepts; Requestor browses; Buyer decides** | NS §2.0 covenant | No OSS cleanly separates all four actors |
| **W6** | **Portal as surface, not truth owner** — match/payment from feeds only | Blueprint §5.1 · I-PORTAL-001 | Portals often own local payment/match state |
| **W7** | **Staged MVP** — internal Product Bank before supplier login | Blueprint §9–§10 | OSS builds portal + P2P monolith early |
| **W8** | **20-box Blueprint + PAS handoff** — every box maps to PAS and stage | Blueprint §8 · §11 | Ad-hoc module growth in OSS |
| **W9** | **Audit replay minimum** — spend intent through downstream consumers | NS §3.5 | Partial in OSS; strongest in OpenProcurement (public tender) |
| **W10** | **Anti-pattern block** — explicit forbidden monolith patterns | Blueprint §12 · NS invariants | Rare in OSS docs |

---

# 4. What to borrow (prioritized build leverage stack)

Map each borrowed pattern to **Afenda home** — never copy source architecture wholesale.

## P0 — Stage 1 (internal Product Bank — build first)

| Pattern | Best source | Afenda home | Invariant / gate |
| --- | --- | --- | --- |
| Price list validity + expiry block | BetterSpend · NS I-CAT-004 | A3 · PROC-BP-002 | `check:procurement-price-list-validity` |
| Buyer review lifecycle | Afenda NS §8.10–8.13 | A1 · PROC-BP-003 | I-CAT-001 |
| Buying decision record + alternatives | OpenProcurement award evidence · I-BUY-001 | A1 · B6 · PROC-BP-005 | I-CAT-008 |
| Master-data promotion emit (not create) | ADR-0020 | A1 · PROC-BP-006 | I-CAT-005 |
| Side-by-side quote comparison UI | ERPNext Supplier Quotation compare | B6 sourcing | I-BUY-001 |

## P1 — Stage 1–2 (policy + requestor)

| Pattern | Best source | Afenda home | Notes |
| --- | --- | --- | --- |
| Budget gate before PO | BetterSpend | B3 policy + Accounting encumbrance consumer | Procurement blocks; Accounting owns encumbrance |
| Material request → PR flow | ERPNext Material Request | B1 → B2 | Afenda uses spend intent + requisition vocabulary |
| Requestor catalog browse | Coupa (giant pattern-fit) | A1 publication · Stage 2 · PROC-BP-004 | After internal Product Bank stable |
| Configurable approval chains | BetterSpend JSONB rules | B3 · PAS-PROC-001G | Workflow engine evaluates; Procurement declares policy |
| Procurement tracker report | ERPNext Buying Reports | B12 audit | Read-only analytics — not commitment authority |

## P2 — Stage 3–5 (supplier-facing — ADR-gated)

| Pattern | Best source | Afenda home | Gate |
| --- | --- | --- | --- |
| Supplier RFQ response via portal | ERPNext Supplier Portal | A0 (extend to catalog) | Supplier auth ADR |
| Tokenized / scoped supplier access | BetterSpend vendor portal | A0 · PROC-BP-007 | SupplierId tenancy ADR |
| PO inbox + acknowledgment | Coupa · ERPNext | A0 · B8 · Stage 4 | PO commitment runtime |
| ASN + delivery notice | open-mercato spec · Coupa | A0 · B9 · Stage 5 | Inventory handoff contract |
| Punch-out cXML (optional channel) | BetterSpend | Optional integration | **Not** Product Bank replacement |

## P3 — Stage 6–7 (Accounting/Treasury feeds required)

| Pattern | Best source | Afenda home | Gate |
| --- | --- | --- | --- |
| Supplier invoice submission channel | BetterSpend · ERPNext PI | A0 → Accounting capture | Accounting invoice API |
| Line-level match **tolerance spec** | BetterSpend · open-mercato `ThreeWayMatch` | **Accounting-owned** document | PAS-PROC-001I + Accounting PAS |
| Match status read-only feed | Coupa portal pattern | A0 display · I-PORTAL-001 | Accounting feed contract |
| Payment / remittance visibility | Odoo · Coupa | A0 display · I-S2P-004 | Treasury feed contract |

## P4 — Later (overlay — never commitment authority)

| Pattern | Best source | Afenda home | Risk if misused |
| --- | --- | --- | --- |
| AI intake / quote-to-order agents | ProcureAI (commercial) | Workflow overlay on B1/B2 | Agent as award authority without I-CAT-008 |
| Maverick spend anomaly alerts | Nexus · BetterSpend roadmap | B12 · B4 | Must not bypass exception model |
| Public tender immutable timeline | OpenProcurement | B6 public-sector sourcing path | Wrong product for private ERP default |

---

# 5. What to avoid copying (OSS anti-patterns)

| Anti-pattern | Where seen | Afenda rule |
| --- | --- | --- |
| Monolithic P2P (match + pay in Procurement) | BetterSpend, Shillinq, Procuman, ERPNext | I4 · I-S2P-003 · Accounting owns match/post |
| Item Master = supplier catalog | ERPNext, Odoo | I-CAT-005/009 · three-layer truth |
| Thin portal = full S2P portal | Odoo native | Blueprint §5.1 portal ownership table |
| Public tender platform as internal runtime | OpenProcurement | B6 for public sector only; not default ERP |
| Supplier portal before auth ADR | Early OSS deployments | Blueprint Stage 3 gate |
| Local payment/match state in Procurement | Many OSS portals | I-PORTAL-001 |
| Match engine inside procurement package | Nexus, open-mercato spec | PAS-PROC-001I — evidence emit only |
| AI as award/match authority | ProcureAI risk | I-CAT-008 · human/exception owner |
| Building Stage 6–7 before Stage 1 | Common OSS "big bang" | Blueprint §9 staging |

---

# 6. Per-source reference (problem · adopt · avoid)

## 6.1 BetterSpend (`AsyncronousVentures/betterspend`)

| | |
|---|---|
| **Problem solved** | Self-hosted MIT Coupa/Procurify alternative — full P2P without per-seat SaaS |
| **Adopt** | Budget gate · approval engine · line-level match tolerance · tokenized vendor portal · immutable audit · cXML punch-out |
| **Avoid** | Single NestJS app owning match + GRN + AP + GL; inventory on roadmap inside same app |
| **Maturity** | **5/10** — credible 2026 stack, early but feature-rich |

## 6.2 ERPNext / Frappe (`frappe/erpnext`)

| | |
|---|---|
| **Problem solved** | Full OSS ERP — MR → RFQ → SQ → PO → receipt → invoice → payment |
| **Adopt** | Supplier portal RFQ quotes · quotation comparison · buying settings as 3-way policy knobs · procurement tracker |
| **Avoid** | Item master = supplier offer; payment entry as "procurement"; no Product Bank layer |
| **Maturity** | **8/10** buying module |

## 6.3 Odoo Purchase (`odoo/odoo`)

| | |
|---|---|
| **Problem solved** | Modular ERP purchasing — tenders, blankets, replenishment, bill control |
| **Adopt** | Purchase tenders · blanket/recurring · replenishment rules · explicit bill vs PO/receipt control |
| **Avoid** | Native supplier portal thin; paid addons for real S2P; one-instance coupling |
| **Maturity** | **8/10** core PO; **3/10** native supplier S2P portal |

## 6.4 open-mercato (Issue #390 spec)

| | |
|---|---|
| **Problem solved** | AI-native ERP framework — procurement module specified, not shipped |
| **Adopt** | FK-only cross-module links · `ThreeWayMatch` entity · ASN · `DeliveryTolerance` · `PurchaseOrderVariance` events |
| **Avoid** | Match execution still inside procurement in spec; no Product Bank |
| **Maturity** | **2/10** runtime · **7/10** modular spec quality |

## 6.5 OpenProcurement (`openprocurement/openprocurement.api`)

| | |
|---|---|
| **Problem solved** | Public-sector e-procurement — tenders, reverse auctions, electronic catalog frameworks |
| **Adopt** | Immutable tender timeline · open award evidence · qualified supplier pools |
| **Avoid** | Using as internal ERP P2P runtime |
| **Maturity** | **9/10** public sourcing · **1/10** internal S2P |

## 6.6 Nexus procurement (`azaharizaman/nexus-procurement`)

| | |
|---|---|
| **Problem solved** | Modular PHP packages — PR, PO, GRN, match with explicit Payable/Inventory/Finance deps |
| **Adopt** | Package boundary naming · tolerance config keys · performance targets for match |
| **Avoid** | `performThreeWayMatch` inside procurement package |
| **Maturity** | **3/10** — early monorepo packages |

## 6.7 Procuman CE · Shillinq

| | |
|---|---|
| **Procuman** | Supplier catalog + pricing in CE — validates A0 direction; CRM bolt-on, immature (**3/10**) |
| **Shillinq** | "Control spend before purchase, match after" — good slogan; **bad** boundary (proc + accounting + pay in one app) (**5/10** SMB) |

## 6.8 Giants (pattern-fit — NS §2.4.1–§2.4.4)

| Platform | Adopt conceptually | Do not copy |
| --- | --- | --- |
| **SAP Ariba** | Supplier lifecycle · category mgmt · intake/maverick front door · award→PO traceability | Global network as requirement · SAP-only identity |
| **Oracle Fusion** | S2P matrix · contract price validity · supplier risk taxonomy · AI exception routing (Accounting owns outcome) | Fusion UX · unified data model ownership |
| **Coupa** | Requestor catalog · portal PO/invoice/status · buying decision + approval chains · "fix the front door" | Per-seat SaaS · expense/treasury inside Procurement NS |

---

# 7. Afenda differentiation (moat when runtime ships)

No major OSS project combines all of:

1. Three-layer product truth (Supplier Catalog → Product Bank → Item Master)
2. Procurement-led portal **without** owning match/payment truth (I-PORTAL-001)
3. PAS-004 meaning-before-behavior (K6) + B58 atom gate
4. Staged MVP: internal Product Bank **before** supplier login (Blueprint §9–§10)
5. Full 20-box PAS handoff with PROC-BP slice catalog

```text
Supplier maintains → Procurement accepts (Product Bank) → Requestor browses →
Buyer decides (record + alternatives) → PO → Receipt signal →
Match evidence [Accounting] → Pay [Treasury]
```

---

# 8. Build leverage map (doc → slice → stage)

| When building | Read first | Then implement | Do not skip |
| --- | --- | --- | --- |
| **Stage 1 Product Bank** | This doc §4 P0 · Blueprint §10 · PAS-001K §4–§7 | PROC-BP-001…006 · B58-P0 | Supplier portal |
| **Stage 2 Requestor catalog** | NS §3.6.3 · Blueprint Stage 2 | PROC-BP-004 | External supplier auth |
| **Stage 3 Supplier catalog portal** | Blueprint §5.1 · PROC-BP-007 ADR | PROC-001K-S6 | Invoice/status feeds |
| **Stage 4–5 PO/ASN** | NS §3.9 · Blueprint §5.16–§5.17 | B8 · B9 runtime | Match in Procurement |
| **Stage 6–7 Invoice/status** | This doc §4 P3 · PAS-PROC-001I | PROC-BP-008 feed contracts | Local match/pay state |
| **Cross-domain handoff** | open-mercato FK pattern · NS §9.5 | PAS-PROC-001I before deep portal | Monolithic P2P |

---

# 9. Axis health check (module review)

| Axis | Score | Comment |
| --- | ---: | --- |
| North Star ambition | **9.6** | Product Bank + portal breakthrough |
| Blueprint bridge | **9.5** | NS→PAS→slice→stage chain complete |
| Boundary discipline | **9.4** | Best vs OSS; portal table + I-PORTAL-001 |
| Vocabulary / K6 | **8.5** | B53–B57 done; B58 planned |
| Capability model (EFR) | **9.5** | Tier A + B complete |
| Evidence discipline | **9.0** | T0/T1¹/T5/T6 in NS §12 |
| Runtime honesty | **9.5** | Availability + readiness Fail rows |
| OSS feature parity (runnable) | **2.0** | Expected at this phase |
| Giant parity (runnable) | **2.0** | Expected |
| Implementation handoff | **9.2** | PROC-BP-001…008 + Stage 0–7 |
| **Overall vision + docs** | **9.2** | |
| **Overall operational ERP** | **2.0** | |

---

# 10. Gaps to close (benchmark → runtime score lift)

| Gap | Lifts dimension(s) | Next artifact |
| --- | --- | --- |
| B58 P0 atoms | 1, 2, 3 | B58 slice |
| PAS-PROC-001 root | PAS family | Author standard |
| PAS-PROC-001K acceptance | Stage 1 | Promote stub |
| Stage 1 runtime (PROC-BP-001…006) | 12 | Internal Product Bank |
| Supplier Portal ADR | 1, 7 (Stage 3+) | New ADR |
| Accounting invoice + match feed | 6, 7 (Stage 6+) | Accounting PAS |
| Treasury payment feed | 8 (Stage 7) | Treasury PAS |
| PAS-PROC-001I cross-domain | 6, 9 | Before portal depth |

---

# 11. Related documents

| Document | Role |
| --- | --- |
| [Procurement North Star §2.4–§2.9](../../../NORTHSTAR/procurement-north-star.md) | Doctrine + pattern-fit summary |
| [Procurement Blueprint §17](../../../BLUEPRINT/procurement-blueprint.md) | Build leverage integration |
| [PAS-PROC-001K §16](../PAS-PROC-001K-PROCUREMENT-PRODUCT-BANK-AND-SUPPLIER-PORTAL-STANDARD.md) | Adopt/borrow reference for Product Bank slices |
| [procurement-product-bank-mvp-spec.md](./procurement-product-bank-mvp-spec.md) | Phase 1 MVP scoped to P0 borrow stack |
| [procurement-foundation-gap-report.md](./procurement-foundation-gap-report.md) | Foundation gaps |
| [PAS-004 backlog](../PAS-004-module-foundation-promotion-backlog.md) | B58 atoms |

---

## Maintenance

| Event | Update |
| --- | --- |
| New OSS project evaluated | Add §6 entry + matrix column if material |
| Stage N runtime delivered | Update §2 Afenda runtime column + §9 gaps |
| Accounting/Treasury feed ADR accepted | Update §4 P3 gates + §10 |
| Annual review | Refresh giant pattern-fit via NS §2.4 only — no competitive ranking claims |

**Last updated:** 2026-06-30
