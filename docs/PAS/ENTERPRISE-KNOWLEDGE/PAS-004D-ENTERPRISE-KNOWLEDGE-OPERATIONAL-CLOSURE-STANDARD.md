# PAS-004D — Enterprise Knowledge Operational Closure Standard

> **Derivation:** PAS-004D continues **operational closure** after [PAS-004C semantic model delivery](PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) (B38–B48, scorecard 58/58). It does **not** amend PAS-004 chapters **§1–§4** (technology-free charter). It closes **documentation mirror drift**, **legacy API surfaces**, and **honest corpus depth** gaps identified at PAS-004C closure audit — without becoming a graph platform, ontology engine, or tenant wiki.
>
> **Scope lock (do not expand):** authority mirror sync, legacy shape retirement, semantic corpus depth gates, synonym vocabulary, PAS-001B meaning bridge atoms, operational attestation. **Not** integrity scoring 0–100, RDF/OWL, graph DB, or horizontal “enterprise ontology complete” claims.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-004D |
| **Parent PAS** | PAS-004 · PAS-004A · PAS-004B · PAS-004C |
| **Document class** | `derived_operational_closure_standard` |
| **Document role** | `operational_closure_rollout` |
| **Canonical filename** | `PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md` |
| **Package** | `@afenda/enterprise-knowledge` |
| **Layer** | Platform |
| **Package role** | Operational closure — mirror sync gates, legacy API retirement, corpus depth honesty, ERP-domain meaning bridge, attestation |
| **Runtime stance** | `contracts-only` |
| **Registry lane** | `PKGR04_ENTERPRISE_KNOWLEDGE` · `PKG-024` |
| **Package owner** | Enterprise Knowledge Authority |
| **Parent standards** | PAS-004 (charter) · PAS-004A (platform) · PAS-004B (Enterprise Accepted) · PAS-004C (semantic model) |
| **Agent skills** | `enterprise-knowledge` · **`kernel-authority`** (mandatory for B53 kernel `realizationMapping` refs) |
| **Maturity** | Idea → **Production Candidate** on B54 attestation (`production_candidate`) |
| **Authority status** | `approved_for_implementation` |
| **Implementation status** | `partial` — B50 delivered; B51–B54 queued |
| **Evidence level** | `pas_document` + `check:knowledge-authority-mirror` + `check:knowledge-legacy-surface-retirement` |
| **Runtime status** | B50 legacy surface retirement delivered; B51 corpus depth next |
| **Remaining slices** | B51 corpus depth (next) · B52 vocabulary richness · B53 ERP-domain bridge · B54 attestation |
| **Consumers** | `@afenda/ui-composition`, `@afenda/metadata-ui`, `apps/erp`, `apps/docs`, `docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md` |
| **Change model** | `serialized-slices` (one slice per session) |
| **Quality target** | Enterprise **9.5 / 10** |
| **Closure registry** | [`pas-status-index.md`](../pas-status-index.md) |
| **ADR prerequisites** | ADR-0021 (Accepted) · PAS-001B inventory/procurement contracts (read-only for B53 refs) |

#### Required gates (inherit from PAS-004C — always)

| # | Gate command |
| --- | --- |
| 1–12 | All PAS-004C §13.1 gates (see [PAS-004C](PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md)) |

#### Required gates (PAS-004D — wired on slice close)

| # | Gate command | First slice |
| --- | --- | --- |
| 13 | `pnpm check:knowledge-authority-mirror` | B49 |
| 14 | `pnpm check:knowledge-legacy-surface-retirement` | B50 |
| 15 | `pnpm check:knowledge-corpus-depth` | B51 |
| 16 | `pnpm check:knowledge-vocabulary-richness` | B52 |
| 17 | `pnpm check:knowledge-erp-domain-bridge` | B53 |
| 18 | `pnpm check:documentation-drift` | B49+ |

> **Maturity is part of authority.**
> PAS-004C semantic model (58/58) is **closed**. Do not claim **operational closure** or **corpus honesty complete** until B54 attestation closes and `foundation-registry-owner` promotes `PKGR04` authority to PAS-004D.

> **Charter (unchanged):** [PAS-004 §1–§4](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)
> **Semantic baseline (closed):** [PAS-004C](PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md)
> **Canonical location:** `docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md`

---

# 0. Agent Quick Path

> Read **PAS-004 §0** (charter), **PAS-004C §0** (semantic baseline), then this §0. Session: `/afenda-coding-session` · Bundle: `/coding-consistency-bundle` · Skills: **`enterprise-knowledge`** · **`kernel-authority`** on B53 only.

**Boundary (unchanged):** `@afenda/enterprise-knowledge` **owns authoritative acceptance of enterprise meaning**; it **never** owns kernel wire parsers, UI rendering, accounting rule engines, database migrations, or tenant-specific knowledge stores.

**PAS-004D closes (audit-identical gaps):**

| Gap class | PAS-004C state | PAS-004D target |
| --- | --- | --- |
| Doc mirror drift | SKILL 56/58; PAS-004B duplicate catalog; B47/B48 missing from PAS-004C §17 | **B49** automated mirror gate |
| Registry evidence | B47/B48 slice paths absent from PKGR04 evidence | **B54** registry delegation |
| Legacy API | `implementationMapping` stripped at loader; `KNOWLEDGE_RELATIONSHIPS` adapter inlined | **B50 delivered** |
| Corpus depth | 3 perspectives (legal_entity only); 3 contextualValidity; 3 semantic edges; 1:1 terms | **B51–B52** minimum thresholds |
| Cross-PAS meaning | PAS-001B inventory/procurement wire vocab without knowledge atoms | **B53** bridge atoms (meaning only) |
| Agent trap | PAS-004 header still says 12 seed MVP | **B49** charter pointer block |

**Hard stops:**

- **Prohibited:** graph DB, ontology engine, integrity scoring engine, tenant wiki, RDF/OWL
- **Prohibited:** batch B50–B54 with B49 — mirror gate must be green first
- **Prohibited:** duplicate PAS-001B wire contracts in atoms — reference via `realizationMapping` only
- **Prohibited:** edit `foundation-disposition.registry.ts` in implementer slices — delegate **B54** to `foundation-registry-owner`
- **Required:** serialized slices B49 → B50 → B51 → B52 → B53 → B54

**First slice:** b49-pas004d-authority-mirror-sync.md

---

# 1. Derivation and Scope

## 1.1 What PAS-004C delivered (B38–B48 — closed)

- KnowledgeConcept, KnowledgeTerm, KnowledgePerspective, consumer profiles, realizationMapping
- Semantic edges + lifecycle transition governance
- Scorecard **58/58**; ERP/metadata/docs consumer projection adoption (B47–B48)

## 1.2 What PAS-004D owns (exactly six — no expansion)

| # | Deliverable | Slice |
| ---: | --- | --- |
| 1 | Authority mirror sync gate (PAS headers, skill, pas-status-index, scorecard 58/58) | B49 |
| 2 | Legacy surface retirement (`implementationMapping` export path; `knowledge-relationships.registry.ts`) | B50 |
| 3 | Semantic corpus depth thresholds (perspectives, contextualValidity, semantic edges) | B51 |
| 4 | Vocabulary synonym richness (≥2 terms where charter synonyms apply) | B52 |
| 5 | PAS-001B ERP-domain meaning bridge atoms (inventory + procurement seed) | B53 |
| 6 | Operational closure attestation + PKGR04 → PAS-004D promotion | B54 |

## 1.3 What PAS-004D does not do

- Amend PAS-004 §1–§4
- Claim enterprise ontology complete from seed corpus
- Add integrity scoring 0–100 (still deferred)
- Add tenant-editable knowledge stores (still deferred)

---

# 2. One-Sentence Boundary

**`@afenda/enterprise-knowledge` owns operational closure of the knowledge platform — mirror-synced authority surfaces, retired legacy shapes, honest corpus depth, and ERP-domain meaning bridge atoms — and never owns kernel parsers, graph engines, or UI rendering.**

---

# 3. Dependency Rules

Same as PAS-004C §3 — zero runtime npm dependencies; type-only kernel refs for B53 validation; enterprise-knowledge never imports consumers.

---

# 4. Authority Surfaces (Operational Closure Target)

## 4.1 Authority mirror sync (B49)

**Problem:** PAS authority metadata, skill mirror, and pas-status-index can drift after attestation slices (scorecard, slice catalog, active-slice pointers).

**Target gate:** `pnpm check:knowledge-authority-mirror`

Enforces:

| Surface | Rule |
| --- | --- |
| `enterprise-knowledge` SKILL | Scorecard **58/58** until B54 extends; no stale “active slice B38” |
| PAS-004B §17 | No duplicate Proposed/Delivered rows |
| PAS-004C §17 | Includes B47–B48 |
| PAS-004 header | Blockquote points agents to PAS-004C/D for runtime truth |
| pas-status-index | PAS-004C **Next sequence item** → PAS-004D B49 |

## 4.2 Legacy surface retirement (B50)

**Problem:** Dual `implementationMapping` + `realizationMapping`; deprecated `KNOWLEDGE_RELATIONSHIPS` adapter.

**Target:**

- Loaders normalize atoms to `realizationMapping` only at public boundary
- `implementationMapping` retained in JSON for one release; deprecated in TypeScript exports with migration note
- Remove `knowledge-relationships.registry.ts` after consumer grep clean
- Gate: `pnpm check:knowledge-legacy-surface-retirement`

## 4.3 Corpus depth thresholds (B51)

**Problem:** Semantic model contracts exist but corpus is thin (3 perspectives, 3 contextualValidity, 3 semantic edges).

**Minimum targets (24-atom baseline — no horizontal expansion required):**

| Metric | Current (PAS-004C) | PAS-004D target |
| --- | ---: | ---: |
| Platform identity perspectives | 3 (legal_entity only) | **≥3 contexts each** for tenant, legal_entity, organization_unit |
| Atoms with `contextualValidity` | 3 | **≥6** (all multi-domain accounting/regulatory atoms) |
| Semantic edges in corpus | 3 | **≥8** |
| Atoms with `realizationMapping` only (post-B50) | partial | **100%** platform identity + accounting invariant atoms |

Gate: `pnpm check:knowledge-corpus-depth`

## 4.4 Vocabulary richness (B52)

**Problem:** 24 concepts : 24 terms (1:1) — synonym model untested.

**Target:** ≥2 `KnowledgeTerm` rows per concept where PAS-004 charter lists synonyms (e.g. Customer/Client/Buyer pattern applied to platform identity where honest).

Gate: `pnpm check:knowledge-vocabulary-richness`

## 4.5 ERP-domain meaning bridge (B53)

**Problem:** PAS-001B delivers kernel wire vocabulary for inventory/procurement; no accepted meaning atoms — drift risk if domains define local glossaries.

**Target:** Seed atoms (minimum):

- `inventory_item` (concept + atom) — **`KV-INV`** wire authority; references `packages/kernel/src/erp-domain/inventory/` **contract paths only**
- `purchase_order` or `procurement_requisition` — **`KV-PROC`** wire authority; references `packages/kernel/src/erp-domain/procurement/` **contract paths only**

**Rule:** Atoms cite kernel erp-domain **contracts** with **KV-*** module ids at trust boundaries; never duplicate parsers or permission vocab registries.

Gate: `pnpm check:knowledge-erp-domain-bridge`

## 4.6 Operational closure scorecard (B54)

Extends PAS-004C scorecard:

| # | Criterion | Points |
| ---: | --- | ---: |
| 30 | Authority mirror gate (B49) | 2 |
| 31 | Legacy surface retirement (B50) | 2 |
| 32 | Corpus depth thresholds (B51) | 2 |
| 33 | Vocabulary richness (B52) | 2 |
| 34 | ERP-domain bridge atoms (B53) | 2 |
| 35 | PKGR04 authority promoted to PAS-004D | 2 |
| | **PAS-004D extension** | **12** |
| | **Combined target (004C + 004D)** | **70** · threshold **≥ 66 / 70** |

---

# 5. What This Package Must Never Own

Everything in PAS-004 §11 through PAS-004C §5, plus:

- **Automated doc editing without mirror gate** — B49 must pass after any PAS-004* header change
- **Wire vocabulary ownership** — PAS-001 / PAS-001B remain wire authority

---

# 6. Package Structure Standard

## 6.1 Target additions (PAS-004D)

```text
scripts/governance/
├── check-knowledge-authority-mirror.mts           # B49
├── check-knowledge-legacy-surface-retirement.mts  # B50
├── check-knowledge-corpus-depth.mts               # B51
├── check-knowledge-vocabulary-richness.mts        # B52
└── check-knowledge-erp-domain-bridge.mts          # B53
```

No new package modules unless B50 requires a thin normalization helper under `src/policy/`.

---

# 7. Implementation Sequence (B49–B54)

| Order | Slice | Delivers | Status |
| ---: | --- | --- | --- |
| 1 | B49 Authority mirror sync | Mirror gate + doc hygiene | **Delivered** |
| 2 | B50 Legacy retirement | Loader strip + adapter inline | **Delivered** |
| 3 | B51 Corpus depth | (proposed) | Not started |
| 4 | B52 Vocabulary richness | (proposed) | Not started |
| 5 | B53 ERP-domain bridge | **Delivered** | B52 |
| 6 | B54 Operational attestation | (proposed) | Not started |

---

# 8. Required Gates

## 8.1 Inherit PAS-004C §13.1 (always)

All twelve PAS-004C baseline gates remain required.

## 8.2 PAS-004D slices

See metadata table §Required gates (PAS-004D).

## 8.3 Promotion rules

- B54 requires all §8.1 + §8.2 gates green
- Registry promotion **delegated** to `foundation-registry-owner` with B47–B54 evidence paths

---

# 9. Related Standards

| Standard | Relationship |
| --- | --- |
| [PAS-004](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) | Parent charter — **§1–§4 immutable** |
| [PAS-004C](PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) | Semantic baseline — **closed B38–B48** |
| [PAS-001B](../KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | Wire vocabulary — **reference only** in B53 |
| [PAS-003](../ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) | Treatment metadata — orthogonal; atoms may cite, not duplicate |

---

# 10. Slice Catalog (PAS-004D)

| Slice | PAS § | Purpose | Status | Prerequisite |
| --- | --- | --- | --- | --- |
| b49-pas004d-authority-mirror-sync.md | §4.1 | Mirror gate + doc hygiene | Delivered | B48 closed |
| b50-pas004d-legacy-surface-retirement.md | §4.2 | Legacy API retirement | Delivered | B49 |
| b51-pas004d-corpus-depth.md | §4.3 | (proposed) | Not started | B50 |
| b52-pas004d-vocabulary-richness.md | §4.4 | (proposed) | Not started | B51 |
| b53-pas004d-erp-domain-bridge.md | §4.5 | Delivered | 2026-06-30 | B52 |
| b54-pas004d-operational-closure-attestation.md | §4.6 | (proposed) | Not started | B53 |
