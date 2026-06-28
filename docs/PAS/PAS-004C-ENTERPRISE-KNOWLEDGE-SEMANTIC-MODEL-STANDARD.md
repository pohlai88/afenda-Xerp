# PAS-004C — Enterprise Knowledge Semantic Model Standard (North Star Hardening)

> **Derivation:** PAS-004C continues **semantic model hardening** after [PAS-004B Enterprise Accepted closure](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) (B33–B37, scorecard 40/40). It does **not** amend PAS-004 chapters **§1–§4** (technology-free charter). It defines how Afenda separates **concept, accepted contextual meaning, vocabulary, and representation** — the North Star semantic layer.
>
> **Scope lock (do not expand):** semantic model contracts, consumer projection profiles, broadened realization references, governed lifecycle transitions, and derived semantic edges. **Not** a graph platform, ontology engine, RDF/OWL stack, triple store, or tenant wiki.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-004C |
| **Parent PAS** | PAS-004 · PAS-004A · PAS-004B |
| **Document class** | `derived_semantic_model_standard` |
| **Document role** | `semantic_hardening_rollout` |
| **Canonical filename** | `PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md` |
| **Package** | `@afenda/enterprise-knowledge` |
| **Layer** | Platform |
| **Package role** | North Star semantic model — KnowledgeConcept, contextual meaning, KnowledgeTerm vocabulary, consumer profiles, realization mapping, transition governance |
| **Runtime stance** | `contracts-only` |
| **Registry lane** | `PKGR04_ENTERPRISE_KNOWLEDGE` · `PKG-024` |
| **Package owner** | Enterprise Knowledge Authority |
| **Parent standards** | PAS-004 (charter) · PAS-004A (platform) · PAS-004B (Enterprise Accepted) |
| **Agent skills** | `enterprise-knowledge` · **`kernel-authority`** (mandatory for `realizationMapping` kernel paths) |
| **Maturity** | Production Candidate (`production_candidate`) — **56/58 scorecard** |
| **Authority status** | `approved_for_implementation` |
| **Implementation status** | `delivered` — B38–B46 complete; PKGR04 authority PAS-004C (registry delegated) |
| **Evidence level** | `pas_document` + B38–B45 governance gates + B46 attestation |
| **Runtime status** | B38–B46 closed — scorecard 56/58; PKGR04 authority PAS-004C |
| **Remaining slices** | none |
| **Consumers** | `@afenda/ui-composition`, `@afenda/metadata-ui`, `apps/erp`, `apps/docs`, `docs/architecture/glossary.md` |
| **Change model** | `serialized-slices` (one slice per session) |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **ADR prerequisites** | ADR-0021 (Accepted) — read-only for kernel realization refs |

#### Required gates (inherit from PAS-004B — always)

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/enterprise-knowledge typecheck` |
| 2 | `pnpm --filter @afenda/enterprise-knowledge test:run` |
| 3 | `pnpm check:knowledge-conformance` |
| 4 | `pnpm check:knowledge-json-authority` |
| 5 | `pnpm check:knowledge-kernel-mapping` |
| 6 | `pnpm check:knowledge-kernel-identity-mapping` |
| 7 | `pnpm check:knowledge-consumer-proof` |
| 8 | `pnpm check:glossary-knowledge-sync` |
| 9 | `pnpm check:knowledge-typed-corpus` |
| 10 | `pnpm quality:boundaries` |
| 11 | `pnpm check:foundation-disposition` |
| 12 | `pnpm check:documentation-drift` |

> **Maturity is part of authority.**
> PAS-004B Enterprise Accepted (40/40) is **closed**. Do not claim **North Star semantic model complete** until B46 attestation closes. Do not expand atom corpus horizontally until Phase 1 (B38–B41) lands.

> **Kernel wire boundary (mandatory read):** [PAS-001](PAS-001-KERNEL-AUTHORITY-STANDARD.md) · [kernel-authority SKILL](../../.cursor/skills/kernel-authority/SKILL.md)
> **Charter (unchanged):** [PAS-004 §1–§4](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)
> **Platform baseline (closed):** [PAS-004A](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) · [PAS-004B](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md)
> **Canonical location:** `docs/PAS/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md`

---

# 0. Agent Quick Path

> Read **PAS-004 §0** (charter), **PAS-004A §0** (platform), **PAS-004B §0** (Enterprise Accepted baseline), then this §0. Session: `/afenda-coding-session` · Bundle: `/coding-consistency-bundle` · Skills: **`enterprise-knowledge` + `kernel-authority`** on B44 and any kernel realization path.

**Boundary (unchanged):** `@afenda/enterprise-knowledge` **owns authoritative acceptance of enterprise meaning**; it **never** owns kernel wire parsers, business master data runtime, UI rendering, accounting rule engines, database migrations, package lifecycle registries, or tenant-specific knowledge stores.

**PAS-004C adds (post–Enterprise Accepted):**

| Topic | PAS-004B (closed) | PAS-004C target |
| --- | --- | --- |
| Meaning model | Flat `meaning.{canonical,business,engineering}` on atom | **Concept → Perspective → Accepted contextual meaning** |
| Vocabulary | `kind: vocabulary` atoms duplicate concepts | **KnowledgeTerm** registry linked to **KnowledgeConcept** |
| Domains | Single flat `KNOWLEDGE_DOMAINS` list | **domainClass** axis: `business` / `architecture` / `knowledge` |
| Truth vs acceptance | `applicability` present but under-emphasized | **Accepted ≠ universally applicable** (GAAP vs IFRS) |
| Consumers | Import proof only | **KnowledgeConsumerProfile** projection (ERP, AI, docs, metadata) |
| Realization | `implementationMapping` kernel/schema only | **realizationMapping** + `realizationKind` (SOP, policy, regulation, training, API, UI, report) |
| Edges | 18 types; structural bias | **Semantic edges** after consumer/realization need is known |
| Lifecycle | States exist; transitions implicit | **KnowledgeTransitionRule** governance |

**Hard stops:**

- **Prohibited:** RDF, OWL, SPARQL, triple stores, Neo4j, graph DB runtime, ontology engine, MCP graph traversal
- **Prohibited:** duplicate kernel `*.parser.ts` / `*.assert.ts` / branded parsers in enterprise-knowledge
- **Prohibited:** enterprise-knowledge → consumer runtime imports (consumers import atoms; package never imports consumers)
- **Prohibited:** batching Phase 2 before Phase 1 closes — B39/B40/B41 inherit wrong meaning if B38 concept layer is wrong
- **Prohibited:** batching B42 before B43/B44 — edge vocabulary must follow consumer/realization need
- **Prohibited:** horizontal corpus expansion (more atoms) before Phase 1 semantic core lands
- **Prohibited:** amend PAS-004 §1–§4 charter chapters
- **Required:** read `kernel-authority` Phase 0 before any `realizationMapping` kernel path change (B44)

**Execution rule:** one slice at a time, in order:

```text
Phase 1 — Semantic Core:     B38 → B39 → B40 → B41
Phase 2 — Consumption Layer: B43 → B44
Phase 3 — Governance:        B42 → B45 → B46
```

**Planner / registry:** `pas-slice-planner` · disposition changes → `foundation-registry-owner` only

---

# 1. Derivation and Scope

## 1.1 What PAS-004B delivered (B33–B37 — closed)

- Kernel identity mapping gate (ADR-0021 paths)
- Metadata + docs consumer proof
- Four acceptance-graph query helpers (pure, no graph DB)
- Enterprise Accepted scorecard **40/40**
- 24 atoms, JSON authority, ERP/metadata/docs consumers proven

## 1.2 What PAS-004C owns

PAS-004C is the **North Star semantic model rollout**. It answers: *how does Afenda separate concept, accepted contextual meaning, vocabulary, and representation?*

| # | Deliverable | Slice |
| ---: | --- | --- |
| 1 | KnowledgeConcept + KnowledgeTerm vocabulary layer | B38 |
| 2 | Contextual meaning (Concept × Domain → accepted meaning) | B39 |
| 3 | Domain-axis split (`domainClass`) | B40 |
| 4 | Accepted vs applicable (contextual validity) | B41 |
| 5 | KnowledgeConsumerProfile + projection helpers | B43 |
| 6 | Realization mapping (broadened beyond kernel/schema) | B44 |
| 7 | Semantic edge vocabulary (derived, not invented early) | B42 |
| 8 | Lifecycle transition governance | B45 |
| 9 | Semantic model attestation + scorecard | B46 |

> **Accepted meaning + contextual perspectives + vocabulary + consumer projection + realization references.** Nothing else.

## 1.3 What PAS-004C does not do

- Rewrite PAS-004 §1–§4 or PAS-004A/004B platform rules
- Move atoms to kernel or architecture-authority
- Become a graph platform, ontology engine, or semantic web stack
- Add kernel parsers, graph DB, scoring engines, or tenant wiki stores
- Rename `@afenda/enterprise-knowledge` (scope note in §5 only)
- Expand atom corpus until Phase 1 semantic contracts land

## 1.4 Biggest risk

Turning PAS-004C into a **mini ontology platform**. The standard defines only the separation of concept, contextual meaning, vocabulary, and representation. That is enough.

---

# 2. One-Sentence Boundary

**`@afenda/enterprise-knowledge` owns the North Star semantic model for accepted enterprise meaning — KnowledgeConcept, contextual accepted meaning, KnowledgeTerm vocabulary, consumer projection profiles, realization references, and transition governance — and never owns kernel wire parsers, persistence, UI rendering, accounting posting, or package registry rows.**

---

# 3. Dependency Rules

## 3.1 Allowed

| Dependency | Rule |
| --- | --- |
| Zero runtime npm dependencies | Maintained from PAS-004B |
| `@afenda/kernel` types | **Type-only** imports for branded ID names in realization validation — no kernel runtime, no parsers |
| Root governance scripts | May read JSON + consumer packages without import cycles |

## 3.2 Prohibited imports

Same as PAS-004 / PAS-004A / PAS-004B: `@afenda/architecture-authority`, `@afenda/database`, `@afenda/ui-composition`, `@afenda/metadata-ui`, `@afenda/ui`, `@afenda/appshell`, `apps/erp`, auth SDKs, React, Next.js, Drizzle, HTTP clients.

## 3.3 Consumer import rule

Consumers **may** import `@afenda/enterprise-knowledge` for vocabulary and projection. Enterprise-knowledge **must not** import consumers.

**Kernel rule (unchanged):** kernel **never** imports enterprise-knowledge. Atoms **reference** kernel; kernel does not reference atoms.

---

# 4. Authority Surfaces (Semantic Model Target)

## 4.1 KnowledgeConcept + KnowledgeTerm (B38)

**Authority:** PAS-004 §5 (amended platform layer only) · PAS-004C §4.1

**Problem:** Today `Customer` is both concept and vocabulary. Synonyms (`Client`, `Buyer`, `Account`) become duplicate atoms.

**Target model:**

```text
KnowledgeConcept (stable idea: customer)
        │
        ├── KnowledgeTerm (Customer, Client, Buyer, Account) — vocabulary registry
        │
        └── KnowledgeAtom (accepted contextual meaning — see §4.2)
```

**Target contracts:**

```typescript
interface KnowledgeConcept {
  readonly conceptId: string;           // stable snake_case
  readonly fqn: string;                 // afenda.enterprise.concept.<id>
  readonly label: string;               // primary human label
  readonly description: string;         // concept-level (not domain-specific)
  readonly ownedByPas: "PAS-004C";
}

interface KnowledgeTerm {
  readonly termId: string;
  readonly conceptId: string;           // FK to KnowledgeConcept
  readonly label: string;               // surface form (Customer, Client, …)
  readonly locale?: string;             // optional BCP-47 for i18n path
  readonly preferred: boolean;          // Afenda preferred surface form
  readonly ownedByPas: "PAS-004C";
}
```

**Atom linkage:** every `KnowledgeAtom` gains optional `conceptId` (required for new atoms after B38). Existing 24 atoms backfilled in B38 migration slice.

**JSON authority:** `concepts.json` + `terms.json` alongside `atoms.json`.

**Edge:** `equivalent` links terms to the same concept; `specializes` / `generalizes` reserved for B42.

## 4.2 Contextual Meaning — Perspective Model (B39)

**Authority:** PAS-004C §4.2 · First Principle 4 (domains bound applicability)

**Problem:** Flat `meaning.{canonical,business,engineering}` is presentation-oriented, not contextual.

**Target model:**

```text
Concept (Customer)
  × Domain (Accounting)  → Accepted meaning: Trade Receivable
  × Domain (CRM)         → Accepted meaning: Contact
  × Domain (Legal)       → Accepted meaning: Contracting Party
```

**Target contract:**

```typescript
interface KnowledgePerspective {
  readonly perspectiveId: string;
  readonly conceptId: string;
  readonly domain: KnowledgeDomain;
  readonly domainClass: KnowledgeDomainClass;  // from §4.5
  readonly atomId: string;                      // accepted meaning atom for this perspective
  readonly contextualLabel: string;
  readonly ownedByPas: "PAS-004C";
}
```

**Rule:** perspectives are not conflicting truths — they are **contextual accepted meanings** within declared domains.

## 4.3 KnowledgeConsumerProfile (B43)

**Authority:** PAS-004 §9.2 (representations) · PAS-004C §4.3

**Problem:** ERP, docs, metadata, and AI each re-decide which atom facets to expose.

**Target profiles:**

| Profile | Facets projected |
| --- | --- |
| `erp` | canonical label, short description, binding |
| `metadata` | short label, preferred wording |
| `docs` | long explanation, lineage summary |
| `ai` | examples, misconceptions, structured reasoning, evidence citations |
| `report` | canonical label, domain, binding |

**Target export:** `projectKnowledgeAtom(atomId, profile): Readonly<Record<string, unknown>>` — pure, JSON-serializable.

## 4.4 Realization Mapping (B44)

**Authority:** PAS-004 §5 `implementationMapping` (extended) · PAS-001 kernel boundary

**Problem:** `implementationMapping` is software-centric (kernel, schema, contracts only).

**Target:** rename/extend to **`realizationMapping`** array on atoms:

```typescript
type RealizationKind =
  | "kernel" | "schema" | "contract"
  | "sop" | "policy" | "regulation" | "training"
  | "api" | "ui" | "report";

interface KnowledgeRealizationMapping {
  readonly realizationKind: RealizationKind;
  readonly reference: string;           // repo-relative path or external citation
  readonly notes?: string;
  readonly brandedId?: string;          // kernel only — ADR-0021 names
  readonly contractPath?: string;       // kernel only — *.contract.ts
}
```

**Kernel rule (unchanged):** `realizationKind: "kernel"` entries cite `packages/kernel/src/**/*.contract.ts` only — never parsers. Read `kernel-authority` before B44.

**Backward compat:** existing `implementationMapping` preserved as alias until B46; loaders normalize both shapes.

## 4.5 Domain-Axis Split (B40)

**Authority:** PAS-004 §7.1 (amended platform layer)

**Problem:** `accounting`, `hr`, `crm` (business) share a flat list with `platform`, `architecture`, `engineering`, `api` (architecture).

**Target:**

```typescript
type KnowledgeDomainClass = "business" | "architecture" | "knowledge";

// Each domain tag carries class metadata in domains.registry.ts (not on every atom)
interface KnowledgeDomainEntry {
  readonly domain: KnowledgeDomain;
  readonly domainClass: KnowledgeDomainClass;
  readonly label: string;
}
```

**Migration:** existing atoms retain domain tags; B40 adds registry metadata and query helpers filter by class.

## 4.6 Accepted vs Applicable (B41)

**Authority:** PAS-004 §3.1 · §7.2 · First Principle 4

**Problem:** `accepted` implies universal truth. GAAP, IFRS, and tax law can all be accepted yet disagree.

**Target distinction:**

| Term | Meaning |
| --- | --- |
| **Accepted** | An accepting authority recorded meaning with evidence and reasoning |
| **Applicable** | Meaning applies within a declared jurisdiction/domain/context |

**Target additions:**

```typescript
interface ContextualValidity {
  readonly accepted: true;              // always true for ratified+ atoms
  readonly applicableIn: readonly string[];  // jurisdiction/domain scopes
  readonly notApplicableIn: readonly string[];
  readonly conflictingWith?: readonly string[];  // atomIds — requires resolution edge
}
```

Promote `applicability` + new `contextualValidity` facet on atoms where multi-framework coexistence applies.

## 4.7 Semantic Edge Vocabulary (B42 — Phase 3)

**Authority:** PAS-004 §9.1 · PAS-004A §4.9

**Timing:** B42 runs **after** B43/B44 so edge types reflect actual consumer/realization need.

**Target additions to `KNOWLEDGE_EDGE_TYPES`:**

```typescript
| "specializes" | "generalizes" | "equivalent"
| "implements" | "realizes" | "constrains"
| "depends_on" | "references"
```

Existing 18 edge types preserved. Additive only.

## 4.8 Lifecycle Transition Governance (B45)

**Authority:** PAS-004 §7.3 · PAS-004C §4.8

**Problem:** lifecycle states exist; transition rules are implicit.

**Target:** `KnowledgeTransitionRule` registry:

```typescript
interface KnowledgeTransitionRule {
  readonly from: KnowledgeLifecycleStatus;
  readonly to: KnowledgeLifecycleStatus;
  readonly requiredAuthority: readonly AcceptingAuthorityClassification[];
  readonly minChainSteps: number;
  readonly requiredEvidence: boolean;
  readonly requiredReview: boolean;
  readonly notes: string;
}
```

**Policy:** `canTransitionLifecycle(atom, toStatus): { allowed: boolean; reasons: string[] }`

## 4.9 Semantic Model Scorecard (B46)

**Authority:** PAS-004B §4.4 pattern · enterprise-erp-standards §9

Extends Enterprise Accepted scorecard with semantic model rows:

| # | Criterion | Points |
| ---: | --- | ---: |
| 21 | Concept + vocabulary layer (B38) | 2 |
| 22 | Contextual meaning perspectives (B39) | 2 |
| 23 | Domain-axis split (B40) | 2 |
| 24 | Accepted vs applicable (B41) | 2 |
| 25 | Consumer profiles (B43) | 2 |
| 26 | Realization mapping (B44) | 2 |
| 27 | Semantic edges (B42) | 2 |
| 28 | Lifecycle transition governance (B45) | 2 |
| 29 | PKGR04 authority promoted to PAS-004C | 2 |
| | **PAS-004C extension total** | **18** |
| | **Combined target (004B + 004C)** | **58** · threshold **≥ 55 / 58** |

---

# 5. What This Package Must Never Own

Everything in PAS-004 §11, PAS-004A §5, PAS-004B §5, plus:

- **RDF, OWL, SPARQL, triple stores, Neo4j, or graph DB runtime**
- **Ontology engine or MCP graph traversal service**
- **Mini ontology platform scope creep** — if it needs OWL reasoning, it is out of scope
- **Tenant-editable wiki stores** (still deferred)
- **Integrity scoring engine 0–100** (still deferred)
- **Package rename** — `@afenda/enterprise-knowledge` remains; accepted scope expands to semantic platform **within this package**, not a new package name

---

# 6. Package Structure Standard

## 6.1 Current (PAS-004B — honest)

See PAS-004B §6.1. B33–B37 structure is live baseline.

## 6.2 Target additions (PAS-004C)

```text
packages/enterprise-knowledge/
└── src/
    ├── contracts/
    │   ├── knowledge-concept.contract.ts          # B38
    │   ├── knowledge-term.contract.ts             # B38
    │   ├── knowledge-perspective.contract.ts      # B39
    │   ├── knowledge-consumer-profile.contract.ts # B43
    │   ├── knowledge-realization.contract.ts      # B44
    │   ├── knowledge-domain-registry.contract.ts  # B40
    │   └── knowledge-transition.contract.ts       # B45
    ├── data/
    │   ├── concepts.json                          # B38
    │   ├── terms.json                             # B38
    │   ├── perspectives.json                      # B39
    │   ├── domains.registry.ts                    # B40
    │   └── transition-rules.registry.ts           # B45
    ├── policy/
    │   ├── knowledge-concept-vocabulary.policy.ts # B38
    │   ├── knowledge-perspective.policy.ts        # B39
    │   ├── knowledge-consumer-projection.policy.ts# B43
    │   ├── knowledge-realization.policy.ts        # B44
    │   └── knowledge-transition.policy.ts         # B45
    ├── projection/
    │   └── knowledge-consumer.projection.ts       # B43
    └── __tests__/
        └── (per-slice test files)

scripts/governance/
├── check-knowledge-concept-vocabulary.mts         # B38
├── check-knowledge-perspective.mts                # B39
├── check-knowledge-domain-axis.mts                # B40
├── check-knowledge-contextual-validity.mts        # B41
├── check-knowledge-consumer-profiles.mts          # B43
├── check-knowledge-realization-mapping.mts        # B44
├── check-knowledge-semantic-edges.mts             # B42
└── check-knowledge-lifecycle-transitions.mts      # B45
```

---

# 7. Decision Matrix

| Question | If yes → | In enterprise-knowledge? |
| --- | --- | --- |
| Is this a stable enterprise idea (Customer, Legal Entity)? | KnowledgeConcept | **Yes** (B38) |
| Is this a surface vocabulary form (Client, Buyer)? | KnowledgeTerm linked to concept | **Yes** (B38) |
| Is this accepted meaning in a domain context? | KnowledgeAtom + KnowledgePerspective | **Yes** (B39) |
| Is this how ERP/docs/AI should project an atom? | Consumer profile | **Yes** (B43) |
| Is this where meaning is realized (SOP, kernel, UI)? | realizationMapping reference | **Yes** (B44) |
| Is this a kernel parser or wire assert? | PAS-001 kernel | **No** |
| Is this RDF/OWL/SPARQL reasoning? | Out of scope | **No** |
| Is this UI label rendering? | metadata / metadata-ui | **No** (import projection) |
| Is this a graph DB or ontology engine? | Out of scope | **No** |

---

# 8. Contract Rules

All PAS-004 / PAS-004A / PAS-004B contract rules apply, plus:

1. **Concept before vocabulary** — every `KnowledgeTerm` must resolve to a `KnowledgeConcept`
2. **Atom linkage** — every atom after B38 must carry `conceptId`; B38 backfills existing 24 atoms
3. **Perspective honesty** — contextual meanings are not universal truths; document domain scope
4. **Consumer projection purity** — projection helpers are pure; no side effects on import
5. **Realization kernel discipline** — `realizationKind: "kernel"` cites contract paths only (B44 + kernel-authority)
6. **Edge timing** — no new semantic edge types before B42 closes
7. **Transition governance** — lifecycle promotions must pass `canTransitionLifecycle` after B45
8. **JSON authority** — concepts, terms, perspectives live in JSON; TS validates only
9. **Backward compat** — `implementationMapping` alias preserved until B46; no breaking public export removals without deprecation slice
10. **No corpus expansion** — B38–B45 do not add new business atoms unless required for contract proof

---

# 9. Runtime Rules

Same as PAS-004B: **contracts-only**. No runtime npm dependencies. All helpers read immutable loaded registries only.

---

# 10. Implementation Sequence (B38–B46 — 3 Phases)

**Serialized execution only.** One slice per session. Do not skip Phase 1 before Phase 2.

### Phase 1 — Semantic Core

| Order | Slice | Delivers |
| ---: | --- | --- |
| 1 | [B38 Concept + Vocabulary](slice/b38-pas004c-concept-vocabulary.md) | KnowledgeConcept, KnowledgeTerm, concepts.json, terms.json, conceptId on atoms |
| 2 | [B39 Contextual Meaning](slice/b39-pas004c-contextual-meaning.md) | KnowledgePerspective, perspectives.json |
| 3 | [B40 Domain Axis Split](slice/b40-pas004c-domain-axis-split.md) | domainClass registry, query by class |
| 4 | [B41 Accepted vs Applicable](slice/b41-pas004c-accepted-vs-applicable.md) | contextualValidity facet, multi-framework coexistence |

### Phase 2 — Consumption Layer

| Order | Slice | Delivers |
| ---: | --- | --- |
| 5 | [B43 Consumer Profiles](slice/b43-pas004c-consumer-profiles.md) | KnowledgeConsumerProfile, projection helpers |
| 6 | [B44 Realization Mapping](slice/b44-pas004c-realization-mapping.md) | realizationMapping kinds, kernel refs (kernel-authority) |

### Phase 3 — Governance Hardening

| Order | Slice | Delivers |
| ---: | --- | --- |
| 7 | [B42 Semantic Edges](slice/b42-pas004c-semantic-edges.md) | expanded edge vocabulary (after B43/B44) |
| 8 | [B45 Lifecycle Transitions](slice/b45-pas004c-lifecycle-transition-governance.md) | KnowledgeTransitionRule, canTransitionLifecycle |
| 9 | [B46 Semantic Attestation](slice/b46-pas004c-semantic-attestation.md) | scorecard ≥55/58; PKGR04 → PAS-004C |

---

# 11. Enterprise Acceptance Criteria (Combined Scorecard)

**North Star semantic model complete** requires:

1. All PAS-004B §13 gates passing (baseline)
2. All PAS-004C slice gates passing (B38–B45)
3. Combined scorecard **≥ 55 / 58** (PAS-004B 40 + PAS-004C 18)
4. `foundation-registry-owner` promotes `PKGR04` authority field to `PAS-004C` with B38–B46 evidence

**Honesty rule:** PAS-004B 40/40 alone is **Enterprise Accepted** — not North Star semantic complete.

---

# 12. Coverage Targets (Honest)

| Domain | PAS-004B (closed) | PAS-004C target |
| --- | ---: | ---: |
| Atoms with conceptId | 0 | **24/24** backfilled (B38) |
| Concepts registry | none | **≥ platform identity concepts** (B38) |
| Terms registry | none | **≥ preferred terms per concept** (B38) |
| Perspectives | none | **≥ 3 domain contexts for platform identity** (B39) |
| Consumer profiles | import proof only | **5 profiles + projection gate** (B43) |
| Realization kinds | kernel/schema only | **≥ 3 kinds cited** (B44) |
| Total atoms | 24 | 24 (no horizontal expansion in PAS-004C) |

---

# 13. Required Gates

## 13.1 Required (inherit from PAS-004B — always)

See metadata table above (gates 1–12).

## 13.2 Required after B38

```bash
pnpm check:knowledge-concept-vocabulary
```

## 13.3 Required after B39–B45

```bash
pnpm check:knowledge-perspective              # B39
pnpm check:knowledge-domain-axis              # B40
pnpm check:knowledge-contextual-validity      # B41
pnpm check:knowledge-consumer-profiles        # B43
pnpm check:knowledge-realization-mapping      # B44
pnpm check:knowledge-semantic-edges           # B42
pnpm check:knowledge-lifecycle-transitions    # B45
```

## 13.4 Promotion rules

- Each slice gate becomes **required** for slices touching the affected surface
- B46 requires **all** §13.1–§13.3 gates green
- Missing future gates must not block PAS-004C doc-only maintenance

---

# 14. Reusable Guardrails

Every PAS-004C slice must:

1. Copy 9-field handoff from slice doc under `docs/PAS/slice/`
2. Attach `/coding-consistency-bundle` + `enterprise-knowledge` + **`kernel-authority`** when realization touches kernel
3. Post §11 Completion Report with drift table
4. Never edit `foundation-disposition.registry.ts` — delegate `foundation-registry-owner` (B46)

---

# 15. Final Doctrine

PAS-004 defines **why** knowledge becomes authoritative. PAS-004A defined **how** the platform stores it. PAS-004B closed Enterprise Accepted with kernel and consumer proof. PAS-004C defines **what the semantic model is** — the North Star layer.

```text
KnowledgeConcept
        │
        ▼
Accepted Contextual Meaning (KnowledgeAtom + Perspective)
        │
        ▼
KnowledgeTerm (Vocabulary)
        │
        ▼
Representation (Consumer Profile Projection)
        │
        ▼
Realization (kernel, SOP, policy, UI, …)
```

> The charter owns the principles.
> The semantic model owns concept, vocabulary, and contextual meaning.
> The kernel owns the wire words.
> The consumers own rendering — not meaning.

When in doubt:

> **May belong in enterprise-knowledge:** concepts, terms, perspectives, consumer projections, realization references, transition rules.
> **Belongs outside:** parsers, graph engines, ontology engines, RDF/OWL, persistence, UI, posting, registry rows, tenant wiki runtime.

---

# 16. Related Standards

| Standard | Relationship |
| --- | --- |
| [PAS-004](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) | Parent charter — **§1–§4 immutable** |
| [PAS-004A](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) | Production Candidate platform — **closed B24–B32** |
| [PAS-004B](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) | Enterprise Accepted — **closed B33–B37** |
| [PAS-001](PAS-001-KERNEL-AUTHORITY-STANDARD.md) | Wire + identity — **reference only** |
| [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) | Identity realization validation (B44) |

---

# 17. Slice Catalog (PAS-004C)

| Slice | PAS § | Purpose | Status | Prerequisite |
| --- | --- | --- | --- | --- |
| [b38-pas004c-concept-vocabulary](slice/b38-pas004c-concept-vocabulary.md) | §4.1 | KnowledgeConcept + KnowledgeTerm + conceptId backfill | Delivered | B37 closed |
| [b39-pas004c-contextual-meaning](slice/b39-pas004c-contextual-meaning.md) | §4.2 | KnowledgePerspective registry | Delivered | B38 |
| [b40-pas004c-domain-axis-split](slice/b40-pas004c-domain-axis-split.md) | §4.5 | domainClass axis | Delivered | B39 |
| [b41-pas004c-accepted-vs-applicable](slice/b41-pas004c-accepted-vs-applicable.md) | §4.6 | contextualValidity | Delivered | B40 |
| [b43-pas004c-consumer-profiles](slice/b43-pas004c-consumer-profiles.md) | §4.3 | Consumer projection profiles | Delivered | B41 |
| [b44-pas004c-realization-mapping](slice/b44-pas004c-realization-mapping.md) | §4.4 | Broadened realization kinds | Delivered | B43 |
| [b42-pas004c-semantic-edges](slice/b42-pas004c-semantic-edges.md) | §4.7 | Semantic edge vocabulary | Delivered | B44 |
| [b45-pas004c-lifecycle-transition-governance](slice/b45-pas004c-lifecycle-transition-governance.md) | §4.8 | Transition rules | Delivered | B42 |
| [b46-pas004c-semantic-attestation](slice/b46-pas004c-semantic-attestation.md) | §4.9 · §11 | Scorecard ≥55/58 + registry promotion | Delivered | B45 |

Handoff files authored at PAS-004C publication; implementation one slice at a time.
