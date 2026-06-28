# Enterprise Knowledge Blueprint

| Field | Value |
| --- | --- |
| **Document class** | `architecture_blueprint` |
| **Document role** | `domain_architecture_box_map` |
| **Architectural identity** | **Blueprint Box name** (§4) — permanent |
| **Workspace mapping** | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) — `@afenda/*` npm name |
| **Scope** | Enterprise Knowledge — how accepted meaning becomes platform truth |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) · [Enterprise Knowledge North Star](../NORTHSTAR/enterprise-knowledge-north-star.md) |
| **Platform rollup** | [Afenda Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) § Knowledge family |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Constitutional laws** | [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) — K1–K8 |
| **Derived documents** | PAS-004 family · `@afenda/enterprise-knowledge` package |
| **Maturity** | Production Candidate |
| **Runtime stance** | Documentation only — references registries; does not duplicate PKG or atom tables |
| **Total PAS at maturity** | `5` (PAS-004 charter · PAS-004A platform · PAS-004B kernel consumer · PAS-004C semantic model · PAS-004D operational closure) |
| **Live PAS today** | `5` (004D proposed — B49+ in progress) |
| **Planned PAS** | `0` |
| **Does not confer** | Business domain meaning without acceptance, contracts, slice handoffs, gate execution |
| **Machine registry** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) · `PKGR04_ENTERPRISE_KNOWLEDGE` |
| **Quality target** | Enterprise **10 / 10** (Enterprise Accepted blocked on Domain NS §15) |
| **Evidence standard** | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| **Last reviewed** | 2026-06-29 |
| **Next document** | [PAS-004](../PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) · [PAS-004C](../PAS/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) (runtime truth) |

> **One sentence:** One Platform-layer **Enterprise knowledge** box owns Concept → Atom → Representation epistemology, acceptance graphs, and conformance — wired end-to-end from Knowledge Constitutional Laws through Domain North Star, the PAS-004 family, JSON authority, consumer projections, and every surface that must cite meaning instead of inventing it.

---

# 0. Agent Quick Path

**Read order:** [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) → [Platform NS](../architecture/afenda-platform-north-star.md) → [Domain NS §1–§12](../NORTHSTAR/enterprise-knowledge-north-star.md) → **this document** → [PAS-004](../PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) → [PAS-004C](../PAS/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) (runtime) → Slice → Code.

**This document answers:**

- What **Blueprint box** owns platform **meaning** (not shape, structure, or external citation)
- Why meaning is **one box** separate from Kernel, Architecture Authority, Accounting Standards, and representations (§3.1)
- How **Concept → Atom → Representation** and promotion pipeline compose (§5.1 · §5.5)
- **Full-stack integration** from laws → atoms → gates → consumer projections (§5.2–§5.4)
- Box **owns / never owns** (§4.2) · four orthogonal domains (§5.2)

**This document never answers:**

- Atom JSON schemas · gate commands · acceptance chain field specs (PAS family)
- Domain philosophy or epistemic prose (Domain NS §1–§12)
- Glossary prose as authority (representations only)

**Hard stops:**

- Existence of text ≠ authority — **acceptance** creates authority ([LAW K1](../CONSTITUTION/knowledge-constitutional-laws.md))
- Representations consume atoms — never own meaning ([LAW K2](../CONSTITUTION/knowledge-constitutional-laws.md))
- Kernel owns shape; Knowledge owns meaning ([LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md))
- Terms promote from Domain NS §3 — not invented in PAS or glossary alone
- Do not implement from Blueprint alone — read target PAS + slice handoff

**Chain rule:** Constitutional Laws → Platform NS → Domain NS → **Domain Blueprint (this doc)** → Platform Blueprint rollup → PAS-004 family → Slice → Code

---

# 1. Blueprint Purpose

Before authoring or extending Enterprise Knowledge PAS slices, answer from **this document only**:

1. **What** Blueprint box? → **Enterprise knowledge** (§4)
2. **Why separate** from Kernel, Architecture Authority, Accounting Standards, UI glossaries? → §3.1 · §4 Reasoning
3. **Which layer**? → Platform (§3)
4. **What does the box own / never owns**? → §4.2
5. **Who consumes** accepted meaning? → §5 · §5.3
6. **Which PAS**? → PAS-004 (charter) · PAS-004A–004D (derived extensions — same box)
7. **Registry PKG**? → `PKG-024` → `@afenda/enterprise-knowledge`

Business **why acceptance creates authority:** [Domain NS §1](../NORTHSTAR/enterprise-knowledge-north-star.md) — do not copy here.

---

# 2. Upstream Traceability

| Upstream | Link | This Blueprint uses |
| --- | --- | --- |
| Knowledge Constitutional Laws | K1–K8 | Acceptance · representations · shape≠meaning |
| Platform North Star | §2 · §4 Knowledge | Parent capability |
| Domain North Star | §4 · §13 · §9.4 · §8.5 · §12 D1–D2 | Box parent · promotion pipeline |
| Platform Blueprint | Knowledge family row | Rollup |
| Domain North Stars §3 | Vocabulary promotion upstream | §5.5 pipeline |
| ADR-0026 | Platform decomposition | Box legitimacy |

| Domain NS §4 capability | Blueprint §4 box | Domain NS Decision ID |
| --- | --- | --- |
| Knowledge hierarchy | **Enterprise knowledge** | D1 |
| Knowledge classification | **Enterprise knowledge** | D1 |
| Epistemic status model | **Enterprise knowledge** | D1 |
| Evidence precedence | **Enterprise knowledge** | D1 |
| Semantic stability levels | **Enterprise knowledge** | D1 |
| Acceptance graph model | **Enterprise knowledge** | D1 |
| Accepting authority taxonomy | **Enterprise knowledge** | D1 |
| Temporal scope | **Enterprise knowledge** | D1 |
| Promotion pipeline | **Enterprise knowledge** | D1 |
| Relationship preservation | **Enterprise knowledge** | D1 |
| Integrity dimensions (10) | **Enterprise knowledge** | D1 |
| Conflict resolution engine | **Enterprise knowledge** | D1 |
| Conformance enforcement | **Enterprise knowledge** | D1 |
| Kernel consumer alignment | **Enterprise knowledge** | D2 |

---

# 3. Layer Map

| Layer | Blueprint intent for this domain |
| --- | --- |
| **Platform** | **Enterprise knowledge** — meaning authority; contracts-only |
| **Platform** | **Kernel** (sibling) — wire shape only; maps to atoms — never defines meaning |
| **Platform** | **Architecture authority** (sibling) — lists package; never stores atoms |
| **Foundation** | **Accounting standards authority** (sibling) — external citation — not accepted vocabulary |
| **Application** | **apps/erp** · **apps/docs** — representation consumers |

**Dependency rule:** `@afenda/enterprise-knowledge` has no compile-time imports from consumers. Consumers import knowledge — never the reverse (PAS-004B consumer proof).

Machine assignments: [`layer-registry.data.ts`](../../packages/architecture-authority/src/data/layer-registry.data.ts).

---

# 3.1 Architecture Decision Matrix

> Run **before** adding or splitting §4 rows. Outcome in §4 Reasoning.

| Question | Enterprise knowledge | Result |
| --- | --- | --- |
| Different **business capability** (Domain NS §4)? | All fourteen capabilities serve one epistemology domain | **Single box** |
| Different **lifecycle**? | Epistemic vs implementation lifecycles are **parallel tracks inside one box** (NS §8.1–§8.2) | **Single box** |
| Different **ownership**? | Enterprise Knowledge Authority owns meaning | **Single box** |
| **Independent deployment**? | One `@afenda/enterprise-knowledge` package | **Single box** |
| Same as **Kernel wire vocabulary**? | Shape ≠ meaning (LAW K6) | **Separate box** — Kernel |
| Same as **package registries**? | Topology ≠ semantics (P10) | **Separate box** — Architecture authority |
| Same as **IFRS citation chains**? | External citation ≠ accepted term meaning | **Separate box** — Accounting standards |
| Same as **glossary / UI labels**? | Representations consume — not own (LAW K2) | **Separate consumer layer** — not a box |
| Different **PAS maturity** train? | PAS-004A–004D extend charter — same box | **Single box** · five PAS docs |
| §3.1 passes but only **technical** split (JSON vs TS loader)? | PAS §4 surfaces — not boxes | **Insufficient alone** |

**Workflow:** Domain NS EFR → matrix → **one §4 row** → §4.2 · §5.1 internal surfaces → PAS-004 family.

---

# 3.2 Canonical Dependency Categories

| Category | Enterprise knowledge usage |
| --- | --- |
| **Compile-time** | Consumers import `@afenda/enterprise-knowledge` for atoms, projections, queries |
| **Runtime** | Read-only meaning resolution in consumer workflows — package never imports consumer runtime |
| **Metadata** | Acceptance chains · epistemic status · stability facets on atoms |
| **Configuration** | Domain applicability · perspective — static registry data |
| **Knowledge** | Self-referential — this box **is** the knowledge SSOT for platform meaning |

---

# 4. Blueprint Boxes

### Box → workspace authority chain

```text
Blueprint Box: Enterprise knowledge (this document §4)
        ↓
package-registry.data.ts — PKG-024 → @afenda/enterprise-knowledge
        ↓
foundation-disposition.registry.ts — PKGR04_ENTERPRISE_KNOWLEDGE
        ↓
packages/enterprise-knowledge/
```

| Blueprint box | Layer | Registry PKG | Why separate | Source | Reasoning (Because → Therefore) | Status | Governing PAS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Enterprise knowledge** | Platform | `PKG-024` → `@afenda/enterprise-knowledge` | Accepted business meaning must not duplicate in Kernel types, architecture registries, accounting citation engines, or UI glossaries as parallel SSOT | [T1 Platform NS §2] [T1 Knowledge Laws K1–K8] [T1 Domain NS §4] [T1 Domain NS §12 D1] ✓ | **Because** enterprises starve for authoritative meaning while wikis and modules fork vocabulary (Domain NS §1). **Because** shape (Kernel), structure (Architecture Authority), external citation (Accounting Standards), and meaning (this box) answer four orthogonal questions (NS §9.4). **Therefore** one Platform box owns acceptance epistemology; PAS-004 family governs implementation; representations derive downstream. | **live** | PAS-004 · PAS-004A · PAS-004B · PAS-004C · PAS-004D |

**Sibling boxes (four orthogonal platform domains — NS §9.4):**

| Blueprint box | Question | Relationship |
| --- | --- | --- |
| **Kernel** | *What does the platform say?* (wire shape) | Upstream mapping target — `knowledge-kernel-mapping` |
| **Architecture authority** | *What is allowed?* (structure) | Lists PKG-024 — never stores atoms |
| **Accounting standards authority** | *Which external accounting authority applies?* (citation) | Orthogonal — meaning vs paragraph citation |
| **Enterprise knowledge** | *How does truth become accepted?* (meaning) | **This box** |

---

# 4.1 Blueprint Evidence Register

| ID | Source | Tier | Justifies | Link |
| --- | --- | --- | --- | --- |
| B1 | ADR-0026 | T0 | Platform knowledge capability | [`docs/adr/ADR-0026`](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| B2 | Knowledge Laws K1–K8 | T1 | Acceptance · representations · shape≠meaning | [`knowledge-constitutional-laws.md`](../CONSTITUTION/knowledge-constitutional-laws.md) |
| B3 | Domain NS §12 D1–D2 | T1 | Capability → box | [`enterprise-knowledge-north-star.md`](../NORTHSTAR/enterprise-knowledge-north-star.md) |
| B4 | PAS-004C 58/58 | T5 | Semantic model delivered | [`PAS-004C`](../PAS/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) |
| B5 | PKG-024 · PKGR04 | T4 | Live · green-lane · authority PAS-004C | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) |
| B6 | Peer review 9.95/10 | T6 | Production Candidate NS | Domain NS §12 provenance |

---

# 4.2 Box Responsibility Matrix

| Blueprint box | Owns (architectural) | Never owns (explicit exclusions) | Domain NS trace |
| --- | --- | --- | --- |
| **Enterprise knowledge** | Knowledge Concept · Knowledge Atom · acceptance graph · epistemic status · classification · semantic stability · evidence precedence · conflict resolution · integrity dimensions · JSON/TS registry authority · consumer projection profiles · kernel meaning mapping (not wire) · conformance policy · promotion pipeline enforcement | Wire contract shapes · package/layer registries · IFRS paragraph citation chains · journal posting · UI rendering · tenant-editable stores · AI binding truth without acceptance · graph DB / ontology engine runtime | §4 · §9.1 · §9.2 |

**Never-owns targets:** **Kernel** (shape) · **Architecture authority** (structure) · **Accounting standards authority** (external citation) · **Representations** (glossary, UI, docs — consumers) · all **LoB runtimes**.

---

# 4.3 Change Impact Matrix

| If this box changes… | PAS impacted | Domain NS | Registry PKG | Primary gates / tests | ADR required |
| --- | --- | --- | --- | --- | --- |
| **Enterprise knowledge** | PAS-004 family · §12 slices | §4 · §13 · §12 | `PKG-024` | `pnpm check:knowledge-conformance` · `check:knowledge-json-authority` · family gates | Yes if split/merge |
| New atom / concept | PAS-004C+ slice | §8.5 if Domain NS §3 promotion | Unchanged | JSON authority + conformance | No |
| New consumer projection | PAS-004B/C consumer proof slice | — | Unchanged | `check:knowledge-consumer-proof` | No |
| Epistemic model change | Charter amendment rare | §3.3 · §12 register | Unchanged | Full knowledge gate suite | Yes if charter |
| Box split (hypothetical) | PAS migration | Amend §13 | New PKG | Full regression | **Yes** |

---

# 5. Composition and Consumers

```text
Domain North Star §3 (vocabulary + Source ✓)
        │
        ▼
Enterprise knowledge (this box)
        │
        ├──► @afenda/kernel (implementation mapping · shape reference only)
        ├──► @afenda/ui-composition · @afenda/metadata-ui (labels · projections)
        ├──► apps/erp (vocabulary server · workflow context)
        ├──► apps/docs (docs vocabulary · atom blocks)
        └──► docs/architecture/glossary.md (representation — synced from registry)
```

| Blueprint box | Declared consumers | Dependency category | Notes |
| --- | --- | --- | --- |
| **Enterprise knowledge** | `@afenda/ui-composition` · `@afenda/metadata-ui` · `apps/erp` · `apps/docs` · `docs/architecture/glossary.md` | Compile-time · Knowledge | PAS **Consumers** ⊆ this list · all ERP domains may consume — must not fork |

---

# 5.1 Cross-box Composition — Meaning Surfaces (Internal)

> Maps Domain NS §3.1–§3.5 to PAS-004 family surfaces inside **Enterprise knowledge**. Not separate Blueprint boxes.

```text
Enterprise knowledge (one box)
        │
        ├─ Charter epistemology (NS §3) ───── PAS-004 §1–§4 (technology-free)
        ├─ JSON atom authority ────────────── PAS-004A · atoms.json · edges.json
        ├─ Kernel consumer alignment ──────── PAS-004B · kernel-mapping gates
        ├─ Knowledge Concept ──────────────── PAS-004C · concepts.json
        ├─ Contextual meaning / Perspective ─ PAS-004C · perspectives.json
        ├─ KnowledgeTerm vocabulary ───────── PAS-004C · terms.json
        ├─ Classification (NS §3.2) ───────── atom kind facet
        ├─ Epistemic status (NS §3.3) ─────── truth binding facet
        ├─ Evidence precedence (NS §3.4) ──── conformance + conflict (△ → slices)
        ├─ Semantic stability (NS §3.5) ───── stability facet
        ├─ Acceptance graph ───────────────── PAS-004B · acceptance-graph queries
        ├─ Consumer profiles ──────────────── PAS-004C · knowledge-consumer.projection
        ├─ Realization mapping ────────────── PAS-004C · kernel paths (read-only)
        ├─ Transition governance ──────────── PAS-004C · transition-rules.registry
        └─ Operational closure ────────────── PAS-004D · mirror sync · corpus depth (proposed)
```

| Upstream surface | Downstream surface | Relationship | Domain NS §7 event | Category |
| --- | --- | --- | --- | --- |
| Domain NS §3 row | Knowledge Concept | promotion upstream | Promotion completed | Knowledge |
| Knowledge Concept | Knowledge Atom | concept anchors atoms | Meaning proposed | Metadata |
| Accepting authority | Knowledge Atom | acceptance chain | Meaning accepted | Metadata |
| Knowledge Atom | Consumer projection | atom → ERP/docs/metadata view | Representation synced | Compile-time |
| Knowledge Atom | Glossary representation | atom → human-readable | Representation synced | Knowledge |
| Conflicting evidence | Conflict resolution | precedence → Candidate or Decision atom | Evidence conflict detected · Conflict resolved | Metadata |
| Kernel wire type | Implementation mapping | shape reference — not definition | — | Compile-time |

---

# 5.2 Full-Stack End-to-End Integration Chain

> **Mandatory integration path** — meaning flows acceptance-first; representations never lead.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONSTITUTION                                                                 │
│ Knowledge Constitutional Laws K1–K8 · Platform Constitutional Laws           │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ BUSINESS AUTHORITY                                                           │
│ Domain North Star §1–§12 (epistemology · hierarchy · promotion §8.5)         │
│ All Domain North Stars §3 (vocabulary promotion upstream)                    │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ARCHITECTURAL MAP                                                            │
│ Domain Blueprint (this doc) §4 · §5.1 · four orthogonal domains §9.4         │
│ Platform Blueprint — Knowledge family rollup                                 │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PACKAGE AUTHORITY (single box · five PAS docs)                               │
│ PAS-004 charter → PAS-004A platform → PAS-004B Enterprise Accepted           │
│ → PAS-004C semantic model (58/58) → PAS-004D operational closure             │
│ Skill: .cursor/skills/enterprise-knowledge/SKILL.md                          │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ IMPLEMENTATION                                                               │
│ packages/enterprise-knowledge/src/                                           │
│   data/*.json · knowledge.registry.ts · projection/ · query/ · policy/       │
│ Slices B24–B48 delivered · B49+ (PAS-004D) in progress                       │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ CI / CONFORMANCE PLANE                                                       │
│ pnpm check:knowledge-conformance · check:knowledge-json-authority            │
│ check:knowledge-kernel-mapping · check:knowledge-consumer-proof              │
│ check:glossary-knowledge-sync · check:knowledge-* (PAS-004B/C family)        │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ REPRESENTATIONS (derived — not authoritative)                                │
│ glossary.md · metadata-ui · ui-composition · apps/erp · apps/docs            │
│ Agents cite atom ID + epistemic status — never invent binding meaning        │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Four orthogonal domains (integration context):**

```text
                    Platform North Star
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
     Kernel          Enterprise Knowledge    Architecture Authority
   (wire shape)         (meaning)              (structure)
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
              Accounting Standards Authority
                 (external citation)
```

**Integration invariants (E2E):**

| # | Invariant | Enforced at |
| --- | --- | --- |
| E1 | Acceptance creates authority — text alone does not | LAW K1 · conformance gates |
| E2 | Registry wins over representations until sync | LAW K2 · glossary-knowledge-sync |
| E3 | Kernel wire types ≠ accepted business meaning | LAW K6 · kernel-mapping gates |
| E4 | Architecture authority lists package — no atoms | PAS-002 boundary |
| E5 | Promotion: Domain NS §3 → atom → representation only | §5.5 · Domain NS I1 |
| E6 | Supersession preserves lineage | LAW K8 · transition governance |
| E7 | Evidence conflicts escalate — no silent merge | Domain NS I8 · §5.2 conflict model |
| E8 | AI prose without acceptance ≠ mandatory binding | Domain NS I6 · exposure policy |

---

# 5.3 Consumer Integration Map

| Consumer | Integration surface | Import rule | Proof gate |
| --- | --- | --- | --- |
| **@afenda/ui-composition** | `platform-identity-vocabulary.ts` | Compile-time atom projection | B34 metadata consumer proof |
| **@afenda/metadata-ui** | Metadata labels from projections | No local binding definitions | consumer proof |
| **apps/erp** | `enterprise-knowledge-vocabulary.server.ts` | Server-side vocabulary resolution | B32 · B27 consumer proof |
| **apps/docs** | `docs-vocabulary.ts` · atom blocks | Representation only | B35 · B48 docs proof |
| **docs/architecture/glossary.md** | Synced representation | Registry wins (I2) | `check:glossary-knowledge-sync` |
| **@afenda/kernel** | `implementationMapping` / realization refs | Read-only path validation | `check:knowledge-kernel-mapping` |
| **All ERP domains** | Terminology at boundaries | Must not fork atoms locally | conformance + domain PAS |
| **Agent orchestration** | Skill + atom ID + epistemic status | Cite — do not invent | enterprise-knowledge skill |

---

# 5.4 Documentation and Registry Sync Chain

```text
Knowledge Laws K1–K8
        ↓
Domain NS §3.1–§3.5 · §8.5 promotion pipeline
        ↓
Domain Blueprint §5.1 (this doc)
        ↓
PAS-004 (charter) · PAS-004A–004D (platform rollout)
        ↓
packages/enterprise-knowledge/src/data/*.json (machine SSOT)
        ↓
Consumer projections + glossary.md (derived)
        ↓
pnpm check:knowledge-* · pnpm check:documentation-drift
```

| Event | Update order |
| --- | --- |
| New Domain NS §3 term | NS amendment → promotion SYNC slice → concept/atom → representations |
| New atom | PAS-004C slice → atoms.json → conformance gates → consumer resync |
| New consumer | Platform Blueprint §5 → PAS metadata → consumer proof gate |
| Slice delivered | PAS §12 → pas-status-index → Platform Blueprint §10 counts |
| Charter change | Rare — ADR + PAS-004 §1–§4 amendment only |

---

# 5.5 Constitutional Promotion Pipeline (E2E)

> Domain NS §8.5 — mandatory for every glossary and UI label.

```text
Domain North Star §3 (vocabulary row + Source ✓)
        │
        ▼
Knowledge Promotion (SYNC — enterprise-knowledge skill)
        │
        ▼
Knowledge Concept (optional abstract anchor)     ← PAS-004C concepts.json
        │
        ▼
Knowledge Atom (accepted meaning + epistemic status + stability)
        │
        ├─► Glossary representation              ← docs/architecture/glossary.md
        ├─► UI / metadata labels                  ← ui-composition · metadata-ui
        ├─► AI / copilot context                  ← atom ID + status in prompts
        └─► Documentation views                   ← apps/docs
```

**Reverse flow forbidden:** glossary → atom without Domain NS §3 row requires NS amendment first (Domain NS §8.5 · I1).

---

# 6. Domain Grouping

### Platform meaning family

```text
Platform layer
├── Enterprise knowledge     ← this domain blueprint (live)
├── Kernel                   ← wire shape (adjacent — mapping only)
├── Architecture authority   ← structure (lists PKG-024)
└── (Foundation) Accounting standards authority ← external citation (orthogonal)
```

**Domain gate:** None for this box — **live** · `PKGR04` green-lane · runtime authority **PAS-004C** (semantic model 58/58 closed).

Rollup: [Platform Blueprint — Knowledge family](../architecture/afenda-architecture-blueprint.md).

---

# 7. PAS Creation Gate

PAS-004 family **satisfies** all conditions:

1. Box **Enterprise knowledge** in §4 ✓
2. §3.1 matrix in §4 Reasoning ✓
3. §4.2 responsibility row ✓
4. Layer Platform ✓
5. **Why separate** documented ✓
6. Registry PKG `PKG-024` linked ✓
7. Status **live** ✓
8. PAS-004 … PAS-004D assigned ✓
9. ADR-0026 ✓
10. §4.3 impact row ✓

No new PAS until a **new Blueprint box** passes §3.1 (none planned).

---

# 8. Blocked and Retired Boxes

| Blueprint box | Status | Blocker | Notes |
| --- | --- | --- | --- |
| — | — | None in this domain scope | — |

Tenant-specific knowledge stores and graph-database ontology engines are **out of scope** — not blocked boxes, prohibited surfaces (PAS-004C hard stops).

---

# 9. Blueprint → PAS Handoff Contract

| §4 field | Pre-fills PAS |
| --- | --- |
| **Blueprint box** | `Enterprise knowledge` |
| Registry PKG | `@afenda/enterprise-knowledge` · `PKG-024` |
| Layer | Platform |
| Why separate | §4 Reasoning → PAS-004 §1–§2 |
| §4.2 Owns / never owns | PAS-004 §0 boundary · §5 prohibited |
| Status | live · Production Candidate ceiling until Domain NS §15 |
| Governing PAS | PAS-004 charter · PAS-004A–004D derived |
| §5 consumers | PAS metadata `Consumers` |
| §5.1 surfaces | PAS-004A–004C implementation map |
| §5.5 promotion | SYNC workflow · enterprise-knowledge skill |
| NS §15 exit criteria | PAS §11 Enterprise Accepted attestation |

**PAS family roles:**

| PAS | Role | Runtime truth |
| --- | --- | --- |
| PAS-004 | Constitutional charter §1–§4 | Immutable epistemology |
| PAS-004A | Platform JSON authority · B24–B32 | Delivered |
| PAS-004B | Kernel consumer · Enterprise Accepted 40/40 | Delivered |
| PAS-004C | Semantic model · 58/58 scorecard | **Current authority** on PKGR04 |
| PAS-004D | Operational closure · B49–B54 | Proposed |

---

# 10. PAS Inventory

**Total PAS at maturity: 5**

| PAS | Title | Blueprint box | Live / Total slices | Status |
| --- | --- | --- | --- | --- |
| PAS-004 | Enterprise Knowledge Standard (charter) | **Enterprise knowledge** | MVP closed | Charter — §1–§4 SSOT |
| PAS-004A | Enterprise Knowledge Platform | **Enterprise knowledge** | 9 / 9 | Production Candidate — closed |
| PAS-004B | Kernel & Consumer | **Enterprise knowledge** | 5 / 5 | Enterprise Accepted — closed |
| PAS-004C | Semantic Model | **Enterprise knowledge** | 11 / 11 | Production Candidate — 58/58 closed |
| PAS-004D | Operational Closure | **Enterprise knowledge** | 0 / 6 | Proposed — B49 in progress |

> Sync from [`pas-status-index.md`](../PAS/pas-status-index.md) on every slice close. **Disposition authority:** PAS-004C on `PKGR04`.

---

# 11. PAS Maturity Rollup (read-only)

| Blueprint box | Registry PKG | PAS | Maturity |
| --- | --- | --- | --- |
| **Enterprise knowledge** | `PKG-024` | PAS-004 | MVP Authority (charter) |
| **Enterprise knowledge** | `PKG-024` | PAS-004A | Production Candidate (closed) |
| **Enterprise knowledge** | `PKG-024` | PAS-004B | Enterprise Accepted (40/40) |
| **Enterprise knowledge** | `PKG-024` | PAS-004C | Production Candidate (58/58) — **runtime authority** |
| **Enterprise knowledge** | `PKG-024` | PAS-004D | Proposed |

---

# 12. How to Add a Blueprint Box (This Domain)

This domain is **closed at one box** for platform meaning.

To extend meaning (not split box):

1. Confirm capability in Domain NS §4 or promote from Domain NS §3
2. Add PAS-004C/004D slice + JSON authority row
3. Update §5.1 composition
4. Run knowledge conformance gate suite
5. Sync representations (glossary · consumers)

Future authority domains (tax meaning, ESG, ISO) should reuse **Domain NS §9.4 pattern** — new Domain NS + new Blueprint box — not expand this box's epistemology scope.

---

# 13. Agent Execution Rules

## Vibe-coding entry checklist

- [ ] Target box **Enterprise knowledge** in §4
- [ ] §3.1 matrix outcome recorded
- [ ] §4.2 responsibility row exists
- [ ] Box status **live**
- [ ] §10 lists correct PAS-004 extension for slice
- [ ] Read PAS-004 §0 + PAS-004C for runtime truth before coding
- [ ] Slice handoff with 9 fields
- [ ] `/afenda-coding-session` Phase 0 from slice
- [ ] `enterprise-knowledge` skill loaded; `kernel-authority` on mapping/realization slices

## Runtime chain (implement mode)

```text
§4 Enterprise knowledge + live
        ↓
§10 PAS-004C (or 004D for closure slices)
        ↓
Slice 9-field handoff → Phase 0
        ↓
Edit packages/enterprise-knowledge/src/data/*.json + loaders
        ↓
Knowledge gate suite → Delivered
        ↓
Sync glossary · consumer projections · pas-status-index
```

## E2E integration checklist (before claiming slice delivery)

- [ ] Domain NS §4 capability or §8.5 promotion path traced
- [ ] §5.1 surface maps to PAS row
- [ ] JSON authority updated (not hand-only TS after B25)
- [ ] Epistemic status + classification on Production+ atoms
- [ ] No kernel parser duplication
- [ ] No consumer package imports in enterprise-knowledge
- [ ] Consumer proof gates pass if projections changed
- [ ] Glossary sync if representation-affecting

---

# 14. Required Reviews and References

## Before accepting

- [ ] §4 box traces to Domain NS §4 + §13
- [ ] §3.1 explains separation from Kernel · Architecture · Accounting Standards
- [ ] §4.2 complete · §4.3 present
- [ ] §5.1 maps NS §3.1–§3.5 to PAS family
- [ ] §5.2 full-stack + four-domain diagram
- [ ] §5.3 consumers match Platform Blueprint
- [ ] §5.4 · §5.5 promotion pipeline documented
- [ ] No Domain NS prose duplicated
- [ ] [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) passes

## References

| Document | Role |
| --- | --- |
| Domain North Star | [`enterprise-knowledge-north-star.md`](../NORTHSTAR/enterprise-knowledge-north-star.md) |
| Knowledge Laws | [`knowledge-constitutional-laws.md`](../CONSTITUTION/knowledge-constitutional-laws.md) |
| Platform Blueprint | [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) |
| PAS-004 charter | [`PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md`](../PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) |
| PAS-004C runtime | [`PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md`](../PAS/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) |
| Architecture Authority Blueprint | [`architecture-authority-blueprint.md`](architecture-authority-blueprint.md) |
| Accounting Standards Blueprint | [`accounting-standards-blueprint.md`](accounting-standards-blueprint.md) |

---

# 15. Final Doctrine

This Blueprint owns **one Platform box — Enterprise knowledge** — the constitutional answer to *how accepted meaning becomes platform truth*, its internal semantic surfaces (§5.1), **full-stack integration** from laws to representations (§5.2–§5.5), and the PAS-004 family.

| Identity | Owner | Changes when |
| --- | --- | --- |
| **Blueprint Box name** | This document §4 | ADR + §4.3 split/merge only |
| **`@afenda/enterprise-knowledge`** | `package-registry.data.ts` | Registry update — box unchanged |
| **`PKGR04` disposition** | `foundation-disposition.registry.ts` | `foundation-registry-owner` |

Domain North Star owns **epistemology and promotion rules**. PAS-004 §1–§4 owns **immutable charter**. PAS-004C owns **current runtime semantic truth**. Representations **never** own meaning.

Business meaning change → Domain NS §3 first → promotion pipeline §5.5. New atom → PAS slice + JSON authority. Wire shape → **Kernel** — not here.

**Shape ≠ meaning ≠ structure ≠ external citation** — four questions, four domains, one box each.
