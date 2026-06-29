# Enterprise Knowledge North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Enterprise Knowledge — how accepted meaning becomes platform truth |
| **Domain type** | Platform meaning substrate *(epistemology — not wire shapes, structure, or external standards)* |
| **Constitutional question** | *How does something become accepted truth?* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Constitutional laws** | [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) — K1–K8 |
| **Derived document** | [Enterprise Knowledge Blueprint](../BLUEPRINT/enterprise-knowledge-blueprint.md) · [Platform Blueprint rollup](../BLUEPRINT/kernel-blueprint.md) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Maturity** | Production Candidate — peer-reviewed 2026-06-29 (9.95/10) |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** (Enterprise Accepted blocked on §16 exit criteria) |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-29 (§4 maturity alignment — runtime truth sync) |
| **Package / PAS inventory** | See [Architecture Blueprint](../BLUEPRINT/kernel-blueprint.md) — not declared here |
| **Next document** | [Enterprise Knowledge Blueprint](../BLUEPRINT/enterprise-knowledge-blueprint.md) |

> **One sentence:** Every contested enterprise term, invariant, and business rule must have discoverable, accepted meaning with evidence, reasoning, and lineage — consumable by humans, agents, and product surfaces without re-deriving truth locally.

> **Epistemology, not technology:** This domain governs **how the platform knows** — acceptance, evidence, conflict, and representation — independent of databases, UI frameworks, or AI models.

---

# 0. Agent Quick Path

**Read order:** [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) → Platform NS → this document §1–§12 → [Enterprise Knowledge Blueprint](../BLUEPRINT/enterprise-knowledge-blueprint.md) → Enterprise Knowledge PAS family → Slice → Code.

**This document answers:** how meaning becomes authoritative; how concepts, atoms, terms, and representations relate; where meaning binds (applicability); how evidence conflicts resolve; how agents and stewards consume vocabulary safely.

**This document never answers:** atom registry paths, conformance gate commands, or wire type definitions.

**Chain rule:** Constitutional Laws → Platform NS → Enterprise Knowledge North Star → Enterprise Knowledge Blueprint → PAS → Slice → Code

**Hard stops (business scope):**

- Existence of text does not create authority — **acceptance** creates authority ([LAW K1](../CONSTITUTION/knowledge-constitutional-laws.md)).
- Representations consume meaning — they do not own it ([LAW K2](../CONSTITUTION/knowledge-constitutional-laws.md)).
- Kernel owns shape; Knowledge owns meaning ([LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md)).
- Terms promote from Domain NS §3 — not invented in PAS or glossary alone.

---

# 1. Domain Philosophy

Enterprises drown in documentation but starve for **authoritative meaning**. Wikis, glossaries, and chat answers multiply faster than teams can agree on definitions. When software modules each invent local definitions for the same term, integrations fail silently, audits cannot explain decisions, and AI assistants hallucinate policy.

Knowledge is not authoritative because someone wrote it down. Knowledge **becomes authoritative through acceptance**: an accepted authority ratifies meaning, reasoning is recorded, evidence is cited, relationships are explicit, and evolution is traceable.

The Enterprise Knowledge domain exists because **accepted business meaning must be a governed platform asset** — the constitutional answer to *how the platform knows* — independent of any UI surface, package registry, wire contract, or external standard citation chain.

**Source:** [LAW K1](../CONSTITUTION/knowledge-constitutional-laws.md) · Platform NS §2 · Enterprise Knowledge charter PAS §1–§2 (T5)

---

# 2. Domain Identity

| Field | Definition |
| --- | --- |
| **Mission** | Govern how enterprise meaning becomes authoritative, discoverable, and consumable — through acceptance graphs, epistemic status, evidence precedence, and representation sync. |
| **Success definition** | Every contested term has a Knowledge Atom (or explicit non-binding proposal) with complete acceptance metadata; all glossaries and UI labels derive from atoms — never the reverse. |
| **Scope** | Knowledge hierarchy · classification · epistemic status · semantic stability · acceptance graph · evidence precedence · conflict resolution · promotion pipeline · integrity dimensions · applicability · knowledge terms · exposure policy · stewardship · discovery · conformance. |
| **Out of scope** | Wire shapes · package topology · external standard citation engines · journal posting · UI rendering · tenant-editable stores · master data record ownership · numeric integrity scoring (deferred). |

---

# 3. Enterprise Vocabulary

| Term | Enterprise meaning |
| --- | --- |
| **Knowledge Concept** | Abstract enterprise idea before acceptance (e.g. "Customer") — may anchor multiple atoms over time. |
| **Knowledge Atom** | Smallest composable unit of **accepted** enterprise meaning — concept made binding through acceptance. |
| **Knowledge Term** | Label, synonym, or locale variant linked to one atom — derived, never authoritative alone. |
| **Preferred term** | The canonical label for an atom within a locale or audience — one preferred per scope. |
| **Synonym** | Alternate label mapping to the same atom — must not become a parallel atom. |
| **Representation** | Derived view (glossary, UI label, AI context) importing atoms — never authoritative. |
| **Acceptance event** | Primary asset — who accepted, when, why, with which evidence. |
| **Accepting authority** | Typed entity (standards body, board, architecture committee) — not a string label. |
| **Acceptance chain** | Origin → review → accepted → ratified → implemented → superseded. |
| **Epistemic status** | Truth binding state — hypothesis through rejected (§3.3) — orthogonal to implementation lifecycle. |
| **Semantic stability** | How likely meaning is to change — constitutional through historical (§3.5). |
| **Evidence precedence** | Ordered source hierarchy when evidence conflicts (§3.4). |
| **Knowledge classification** | Kind of knowledge — definition, principle, rule, policy, standard, decision, fact (§3.2). |
| **Integrity profile** | Presence across ten constitutional dimensions — not a single score. |
| **Knowledge domain** | Declared scope bucket (Platform, Accounting, HRM, …) — not a package or layer. |
| **Applicability scope** | Where an atom binds: global, domain, legal-entity class, jurisdiction overlay. |
| **Applicability exception** | Explicit carve-out when a rule or definition does not apply. |
| **Exposure tier** | Audience and automation safety for an atom — public platform through restricted (§3.7). |
| **Misconception** | Common wrong interpretation explicitly rejected on an atom — anti-pattern registry. |
| **Glossary steward** | Domain role accountable for triage, review, and representation sync — not HR master data. |

## 3.1 Knowledge hierarchy

Four layers — do not collapse:

```text
Knowledge Concept          (abstract — enterprise idea)
        │
        ▼
Knowledge Atom             (accepted meaning — binding when epistemic status permits)
        │
        ├─► Knowledge Term(s)  (labels · synonyms · locale variants — derived, non-authoritative)
        │
        ▼
Representation             (glossary · UI · AI · docs — derived, never authoritative)
```

**Rule:** One concept may have many atoms over time (supersession). One atom may have many terms and many representations simultaneously ([LAW K7](../CONSTITUTION/knowledge-constitutional-laws.md)). Synonyms attach as terms — never as parallel atoms (P13).

## 3.2 Knowledge classification

Not all atoms are the same **kind**. Classification drives conformance rules and consumer expectations:

| Class | Example | Typical binding |
| --- | --- | --- |
| **Definition** | Customer, Legal entity | Mandatory vocabulary |
| **Principle** | Separation of duties | Mandatory governance |
| **Rule** | Invoice must balance | Mandatory validation input |
| **Policy** | Password rotation period | Recommended or mandatory |
| **Standard** | IFRS 10 (as accepted meaning) | Mandatory when ratified |
| **Decision** | Platform documentation hierarchy | Mandatory architectural |
| **Fact** | Malaysia timezone | Stable reference |

**Rule:** External accounting **citation** chains live in Accounting Standards Authority — Enterprise Knowledge owns **accepted meaning** of terms and decisions, not paragraph-level IFRS consumption.

## 3.3 Epistemic status (truth binding)

**Orthogonal to implementation lifecycle.** Answers *"Is this platform truth?"* — not *"Is this shipped in code?"*

| Epistemic status | Meaning |
| --- | --- |
| **Hypothesis** | Observed claim — not yet reviewed |
| **Candidate** | Under review by accepting authority |
| **Accepted** | Binding platform truth for declared scope |
| **Superseded** | Replaced — lineage preserved; historical queries only |
| **Rejected** | Explicitly rejected — must not be applied to new work |

Lifecycle (`proposed → ratified → implemented`) tracks **delivery honesty**. Epistemic status tracks **truth binding**. An atom may be `Accepted` epistemically but not yet `Implemented` in runtime.

## 3.4 Evidence precedence hierarchy

When evidence sources conflict, apply precedence unless jurisdiction mandates otherwise:

```text
Law
        │
        ▼
Regulation
        │
        ▼
External standard (IFRS, ISO, …)
        │
        ▼
ADR (architectural decision)
        │
        ▼
Board / corporate decision
        │
        ▼
Internal policy
        │
        ▼
Working draft / advisory guidance
```

**Rule:** Lower precedence cannot override higher without explicit supersession atom citing the conflict resolution decision. Unresolved conflict → remain `Candidate` or escalate — never silent acceptance.

## 3.5 Semantic stability

Consumers need to know **how likely meaning is to change**:

| Stability | Meaning | Consumer expectation |
| --- | --- | --- |
| **Constitutional** | Rarely changes — platform laws, core principles | Amend only via ADR + domain owner |
| **Stable** | Production binding — safe for automation | Conformance gates enforce |
| **Evolutionary** | Active refinement — may supersede | Monitor lineage |
| **Experimental** | MVP / pilot — not production-automation safe | Explicit exposure policy |
| **Historical** | Frozen — query only | Must not drive new work |

## 3.6 Applicability and scope

Enterprises operate under **concurrent contexts**. Applicability sits between epistemic acceptance and consumer binding:

```text
Knowledge Atom (Accepted)
        │
        ▼
Applicability scope        (global · domain · legal-entity class · jurisdiction overlay)
        │
        ├─► Applicability exception(s)
        │
        ▼
Consumer binding           (validation · UI · agent · docs)
```

| Scope type | Example | Binding |
| --- | --- | --- |
| **Global platform** | Tenant, Legal entity | All consumers unless excepted |
| **Domain** | Accounting-only term | LoB modules in scope only |
| **Legal-entity class** | Holding vs subsidiary meaning | Entity routing |
| **Jurisdiction overlay** | Malaysia statutory wording | Concurrent with group policy |

**Rule:** Global promotion of a Rule or Policy atom at Production+ without declared scope is forbidden (I9). Jurisdiction for **external accounting citation** defers to Accounting Standards Authority — Knowledge resolves **accepted meaning** scope only.

## 3.7 Exposure and automation trust

Consumers and agents need to know **who may see** and **who may enforce** meaning:

| Exposure tier | Meaning | Automation |
| --- | --- | --- |
| **Public platform** | Safe for docs, UI, all agents | Cite atom ID + epistemic status + stability |
| **Engineering only** | Internal architecture vocabulary | Implement-mode agents only |
| **Advisory** | May appear in suggestions — not mandatory | Never auto-enforce |
| **Restricted** | Human-only; excluded from agent context | Hard stop |

**Rule:** Experimental semantic stability requires explicit exposure tier — never default to public platform (§3.5).

## 3.8 Stewardship roles

Operational governance — distinct from **accepting authority** (who ratifies truth):

| Role | Accountability |
| --- | --- |
| **Glossary owner** | End-to-end vocabulary health for a knowledge domain |
| **Glossary steward** | Triage proposals · assign review · sync representations |
| **Subject matter expert** | Domain correctness during Candidate review |
| **Proposal submitter** | Any practitioner surfacing contested or missing meaning |

**Rule:** Stewardship roles govern **process** — only accepting authorities create binding truth.

## 3.9 Localization

Platform atoms remain **locale-neutral** in meaning. Localization is representation — not a new atom:

```text
Knowledge Atom (locale-neutral accepted meaning)
        │
        ├─► Knowledge Term (en · preferred)
        ├─► Knowledge Term (ms-MY · preferred)
        └─► Representation (glossary page per locale)
```

**Rule:** Translation does not create binding meaning — it surfaces accepted meaning in another locale. Locale parity is a representation quality target (§6).

## 3.10 Knowledge registry taxonomy

*Registry* is not one concept. Enterprise Knowledge owns **five distinct registry classes** at business level — each with one purpose:

| Registry class | Purpose | Answers |
| --- | --- | --- |
| **Concept registry** | Abstract anchors for supersession chains | What enterprise idea persists across atoms? |
| **Atom registry** | Authoritative accepted meaning | What is binding platform truth? |
| **Relationship registry** | Typed semantic edges | How do meanings connect? |
| **Term registry** | Labels, synonyms, locales | How is meaning labeled — not redefined? |
| **Representation registry** | Published consumer views | What do glossaries/UI show? |

**Rule:** Composite consumers may read multiple registries — SSOT remains per class. Do not collapse atom and term registries in prose (analogous to Architecture Authority §3.1).

**Source:** Enterprise Knowledge charter PAS §3 · §5 · §8 · semantic model peer review · gap closure 2026-06-29 (T5/T6)

---

# 4. Capability Model

> **Maturity legend (read before the table):** This document is **documentation only** — it does not confer runtime authority. **Domain spec** = business model defined in §3–§5. **Runtime** = `@afenda/enterprise-knowledge` + PAS-004 family gates (authority: PAS-004C delivered · PAS-004D partial). Do not treat **Domain spec: Documented** as **Runtime: Delivered**. §12 Evidence IDs (E8–E11 · E14–E16) remain △ until runtime rows reach **Delivered** and §16 exit criteria close.

| Runtime label | Meaning |
| --- | --- |
| **Delivered** | Contract/corpus/gates live in package (PAS-004A–C baseline) |
| **Partial** | Facet or gate exists but incomplete vs this NS or △ evidence |
| **Target** | △ in §12 — PAS slice required before Production+ claims |
| **Domain only** | Constitutional/domain model — spans PAS family; not one gate |

| Capability | Domain spec | Runtime | EFR summary | Source | Evidence |
| --- | --- | --- | --- | --- | --- |
| **Knowledge hierarchy** | Documented | Delivered | Concept → Atom → Term → Representation | §3.1 · LAW K7 | E7 · E13 |
| **Knowledge classification** | Documented | Partial | Seven NS classes · runtime `kind` facet differs | §3.2 | E5 |
| **Epistemic status model** | Documented | Delivered | Truth binding facet on all atoms + consumer projections | §3.3 | E8 |
| **Evidence precedence** | Documented | Partial | IFRS/GAAP contextual validity only — not full §3.4 ladder | §3.4 · §5.2 | E9 △ |
| **Semantic stability levels** | Documented | Delivered | Stability facet on all atoms + metadata/ai projections | §3.5 | E11 |
| **Acceptance graph model** | Documented | Delivered | Authority → evidence → reasoning → atom | Charter PAS §3.1 | E3 |
| **Accepting authority taxonomy** | Documented | Delivered | Typed authorities with jurisdiction | Charter PAS §3.2 | E2 |
| **Temporal scope** | Documented | Delivered | effectiveFrom / effectiveUntil / supersededBy | Charter PAS §3.4 | E4 |
| **Promotion pipeline** | Documented | Partial | Domain NS §3 → atom path exists · not proven end-to-end (§16 #6) | §8.5 · LAW K7 | E12 |
| **Relationship preservation** | Documented | Delivered | Typed edges — governs, supersedes, derives_from | Charter PAS §9.1 | E4 |
| **Integrity dimensions (10)** | Documented | Delivered | Multidimensional presence — numeric scoring deferred (§2 · §15) | Charter PAS §8 | E5 |
| **Conflict resolution engine** | Documented | Partial | Framework-basis conflict policy — not full §5.2 escalation engine | §5.2 | E10 △ |
| **Conformance enforcement** | Documented | Delivered | Gates reject incomplete acceptance metadata | Platform extension PAS | E4 |
| **Kernel consumer alignment** | Documented | Delivered | Shape ≠ meaning — mapping only | Kernel consumer PAS | D2 |
| **Applicability resolution** | Documented | Partial | `applicability` on atoms · conformance incomplete (§16 #9) | §3.6 · P4 | E14 △ |
| **Knowledge term model** | Documented | Delivered | Synonyms and locale labels — not parallel atoms | §3.1 · §3.9 · P13 | E13 |
| **Exposure and agent grounding** | Documented | Partial | `exposure.audience` (3 values) — not full §3.7 four-tier model | §3.7 | E15 △ |
| **Stewardship workflow** | Documented | Target | Roles defined — no runtime intake/registry workflow | §3.8 · §8.6 | E16 △ |
| **Vocabulary discovery** | Documented | Partial | Graph query helpers — no steward discovery index | §3.10 | E4 |
| **Misconception coverage** | Documented | Delivered | Rejected anti-patterns on registry atoms | §3 · charter PAS | E4 |
| **Trust certification** | Documented | Target | Automation attestation beyond Accepted — deferred | §3.7 · §6 | — |

**Enterprise Accepted blockers (open — §16):** Runtime **Target** or **Partial** rows above · evidence precedence operational (§16 #2) · conflict resolution in conformance (#3) · promotion pipeline proven for one domain glossary (#6) · applicability gates on Rule/Policy (#9) · exposure tier on all Production+ atoms (#10) · zero △ on E9–E10 (#7) and E14–E16 (#12).

---

# 5. Domain Principles

| # | Principle | Because | Therefore |
| --- | --- | --- | --- |
| P1 | **Acceptance creates authority** | Text without acceptance is opinion | [LAW K1](../CONSTITUTION/knowledge-constitutional-laws.md) |
| P2 | **Reasoning must be recoverable** | Audits ask "why accepted?" | [LAW K4](../CONSTITUTION/knowledge-constitutional-laws.md) |
| P3 | **Evidence must be citable** | Memory is not proof | [LAW K3](../CONSTITUTION/knowledge-constitutional-laws.md) |
| P4 | **Domains bound applicability** | Global terms break locally | Applicability + exceptions explicit |
| P5 | **Relationships preserve context** | Isolation breeds drift | Edges are first-class |
| P6 | **Representations are not authority** | Wikis become false SSOT | [LAW K2](../CONSTITUTION/knowledge-constitutional-laws.md) |
| P7 | **Integrity is multidimensional** | One score hides gaps | Ten dimensions |
| P8 | **Honesty over aspiration** | Ratified ≠ implemented | Separate epistemic vs lifecycle |
| P9 | **Shape ≠ meaning** | Types are not definitions | [LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md) |
| P10 | **Topology ≠ semantics** | Registries are not glossaries | Architecture Authority lists packages only |
| P11 | **Concept precedes atom** | Abstract ideas outlive single acceptance | Concept anchors supersession chain |
| P12 | **Promotion is constitutional** | Glossary-first breaks epistemology | Domain NS §3 → atom → representation only |
| P13 | **One meaning, many terms** | Synonym atoms fork truth | Terms attach to atoms — never parallel atoms |

## 5.1 Domain invariants

| # | Invariant |
| --- | --- |
| I1 | No glossary, UI label, or PAS term invents binding meaning without atom or explicit `Hypothesis`/`Candidate` status. |
| I2 | Registry wins over every representation until sync slice completes. |
| I3 | Supersession preserves lineage — history is never overwritten ([LAW K8](../CONSTITUTION/knowledge-constitutional-laws.md)). |
| I4 | Kernel wire types do not imply accepted business meaning. |
| I5 | Tenant-editable stores cannot become platform knowledge authority. |
| I6 | AI-generated prose without acceptance metadata is never mandatory-binding. |
| I7 | Epistemic status and implementation lifecycle are recorded separately. |
| I8 | Evidence conflicts escalate — never silent merge of incompatible sources. |
| I9 | Production+ Rule or Policy atoms declare applicability scope — global binding without scope is forbidden. |
| I10 | Knowledge atoms define **what an entity means**; Architecture Authority reservation registry defines **who owns entity identifiers** — never conflated ([ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md)). |

## 5.2 Knowledge conflict resolution

When sources disagree (IFRS vs corporate policy, ADR vs developer guide, glossary vs registry):

| Step | Action |
| --- | --- |
| 1 | Apply evidence precedence (§3.4) |
| 2 | If same precedence level conflicts, require **Knowledge Decision** atom citing both sources |
| 3 | If unresolved, epistemic status remains `Candidate` — not `Accepted` |
| 4 | Representations must not publish `Accepted` wording until conflict closed |
| 5 | Accounting Standards **citation** conflicts defer to Accounting Standards Authority precedence model — Knowledge resolves **meaning** conflicts only |

**Example:** Corporate policy stricter than IFRS may be `Accepted` as company policy atom — it does not amend IFRS; it adds a mandatory overlay with explicit precedence declaration.

---

# 6. Enterprise Outcomes and KPIs

| Outcome | Target | Measures |
| --- | --- | --- |
| **Meaning singularity** | Zero contested production terms without atom or explicit non-binding status | Conformance gates |
| **Constitutional promotion** | 100% glossary terms trace to Domain NS §3 or atom | Promotion pipeline audit |
| **Acceptance completeness** | Mandatory atoms have full chains at Production+ | Integrity profile |
| **Conflict honesty** | Zero silent merges of conflicting sources | Conflict resolution log |
| **Representation sync** | Glossary/UI match registry or cite divergence | Drift checks |
| **Agent-safe vocabulary** | Copilots cite atom ID + epistemic status + exposure tier | Exposure policy · §3.7 |
| **Steward responsiveness** | Proposal triage within agreed SLA | Steward workflow log |
| **Locale parity** | Production+ atoms have approved preferred terms per supported locale | Term registry audit |
| **Discovery coverage** | Zero contested Production terms unreachable by domain browse | Discovery index |
| **Applicability honesty** | 100% Production+ Rule/Policy atoms declare scope | Applicability facet audit |

---

# 7. Business Events

| Event (business vocabulary) | Meaning |
| --- | --- |
| **Concept identified** | Abstract enterprise idea named — pre-acceptance |
| **Meaning proposed** | Atom entered review — epistemic `Candidate` |
| **Meaning accepted** | Accepting authority recorded binding truth |
| **Meaning rejected** | Explicit rejection with reasoning preserved |
| **Meaning superseded** | New atom replaced prior with lineage |
| **Evidence conflict detected** | Precedence or escalation required |
| **Conflict resolved** | Knowledge Decision atom closes disagreement |
| **Representation synced** | Glossary/UI updated from registry |
| **Promotion completed** | Domain NS §3 term became atom |
| **Meaning proposal submitted** | Practitioner surfaced missing or contested meaning — pre-Candidate |
| **Steward review assigned** | Proposal routed to domain steward |
| **Term proposed** | Synonym or locale label submitted — atom must exist |
| **Synonym conflict detected** | Two labels claim preferred status for same scope |
| **Preferred term changed** | Canonical label updated — lineage preserved |
| **Representation drift detected** | Glossary/UI diverged from atom registry |
| **Quarterly vocabulary review completed** | Steward attestation of domain health |

---

# 8. Entity Lifecycles

## 8.1 Knowledge Atom — implementation lifecycle

```text
Observed → Proposed → Under review → Accepted → Ratified → Implemented → Superseded → Historical
```

## 8.2 Knowledge Atom — epistemic status (parallel track)

```text
Hypothesis → Candidate → Accepted → Superseded / Rejected
```

**Rule:** Track both. An atom may be lifecycle `Implemented` and epistemic `Superseded` simultaneously during transition windows.

## 8.3 Representation (glossary, UI, AI)

```text
Derived from atom → Published → Drift detected → Resynced from registry
```

## 8.4 Knowledge Concept (abstract anchor)

```text
Identified → Referenced by atom(s) → Superseded atoms chain under same concept → Concept retired when no active atoms
```

## 8.5 Constitutional promotion pipeline

**Parent of every future glossary** — mandatory chain:

```text
Domain North Star §3 (vocabulary row + Source ✓)
        │
        ▼
Knowledge Promotion (SYNC slice — pas-004 / enterprise-knowledge)
        │
        ▼
Knowledge Concept (optional abstract anchor)
        │
        ▼
Knowledge Atom (accepted meaning + epistemic status + stability)
        │
        ├─► Glossary representation
        ├─► UI / metadata labels
        ├─► AI / copilot context
        └─► Documentation views
```

**Rule:** Reverse flow is forbidden — glossary → atom without Domain NS §3 row requires new NS amendment first.

## 8.6 Proposal intake lifecycle

Practitioner-driven intake — upstream of §8.1 atom lifecycle:

```text
Observed need → Proposal submitted → Steward triage → Under review (Candidate) → Accepted / Rejected
```

**Rule:** **Meaning proposal submitted** is pre-Candidate intake. **Meaning proposed** (§7) means the atom is already in formal review.

---

# 9. Boundary and Dependencies

## 9.1 This domain owns (business)

- How meaning becomes authoritative (epistemology)
- Concept → Atom → Term → Representation hierarchy
- Epistemic status, classification, semantic stability
- Evidence precedence and knowledge conflict resolution
- Promotion pipeline from Domain NS §3
- Acceptance graph, integrity dimensions, conformance policy
- Applicability scope, knowledge terms, exposure policy, stewardship workflow

## 9.2 This domain never owns (business)

- Wire contract shapes (Platform Kernel — shape)
- Package/layer registries (Platform Architecture Authority — structure)
- External standard citation chains (Accounting Standards Authority — external authority)
- Business master data **records** and entity identifier **ownership** (LoB runtime · reservation registry)
- Journal posting · UI rendering · tenant-editable stores
- AI-generated binding truth without acceptance

## 9.3 Cross-domain dependencies

| Depends on | Required for |
| --- | --- |
| **Knowledge Constitutional Laws** | K1–K8 |
| **Domain North Stars §3** | Vocabulary promotion upstream |
| **Platform Kernel** | Implementation mapping — shape only |
| **All ERP domains** | Consume meaning — must not fork |
| **Architecture Authority reservation map** | Meaning alignment for entity names — not ownership of records (I10) |

| Provides to (domain) | What flows |
| --- | --- |
| **All domains** | Accepted terminology and decisions |
| **Architecture Authority reservation map** | Vocabulary for entity labels — runtime MDM stays in domain packages |
| **Platform Kernel ERP wire catalog** | Meaning alignment for wire labels |
| **Presentation / Metadata UX** | Authoritative labels |
| **Agent orchestration** | Citable atoms + epistemic status |

## 9.4 Four orthogonal platform domains

Enterprise Knowledge is **Platform Meaning** — one of four non-overlapping constitutional domains:

```text
                    Platform North Star
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 Platform Language    Platform Meaning    Platform Structure
    (Kernel)         (Enterprise Knowledge)  (Architecture Authority)
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                  External Authority Consumption
              (Accounting Standards Authority)
```

| Domain | Question |
| --- | --- |
| **Kernel** | *What does the platform say?* (wire shape) |
| **Architecture Authority** | *What is allowed?* (structure) |
| **Enterprise Knowledge** | *How does truth become accepted?* (meaning) |
| **Accounting Standards Authority** | *Which external accounting authority applies?* (citation) |

**Rule:** No domain absorbs another's question. Shape ≠ meaning ≠ structure ≠ external citation.

---

# 10. Enterprise Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Wiki authority** | Informal docs as binding truth | LAW K1 · acceptance chain |
| **Glossary-first epistemology** | UI labels define meaning | §8.5 promotion pipeline · I1 |
| **Vocabulary fork** | Parallel definitions in modules | Conformance · promotion |
| **Representation drift** | Glossary contradicts registry | LAW K2 · registry wins |
| **AI hallucination** | Ungrounded mandatory advice | I6 · epistemic status in exposure |
| **Shape/meaning collapse** | Kernel types as definitions | LAW K6 |
| **Silent evidence conflict** | Wrong precedence applied | §5.2 · I8 |
| **Lifecycle/epistemic confusion** | "Implemented" mistaken for "true" | §3.3 · §8.2 |
| **Historical overwrite** | Audit cannot replay past meaning | LAW K8 · supersession lineage |
| **Synonym atom fork** | Parallel atoms for same meaning | P13 · term registry |
| **Over-exposure** | Restricted terms in agent context | §3.7 · exposure tier |
| **Scope collapse** | Global binding breaks local modules | §3.6 · I9 |
| **Meaning/MDM conflation** | Entity ownership disputes | I10 · ADR-0020 |
| **Locale drift** | Translations redefine meaning | §3.9 · atoms locale-neutral |

---

# 11. Quality Attributes

| Attribute | Expectation |
| --- | --- |
| **Epistemic honesty** | Status reflects truth binding — not delivery marketing |
| **Traceability** | Acceptance chain end-to-end recoverable |
| **Precedence clarity** | Evidence conflicts resolved or escalated |
| **Stability signaling** | Consumers know change likelihood |
| **Multidimensional integrity** | Ten dimensions — not one score |
| **Promotion discipline** | Domain NS §3 upstream of all glossaries |
| **AI-readiness** | Atoms citeable with status + stability + exposure |
| **Discoverability** | Contested terms reachable in one hop from domain vocabulary |
| **Locale neutrality** | Atoms carry meaning; terms carry locale |
| **Registry class separation** | Five registry classes — never collapsed in prose |

---

# 12. Domain Evidence

## 12.1 Evidence Register

| ID | Claim | Source class | Tier | Reference |
| --- | --- | --- | --- | --- |
| E1 | Platform requires accepted business meaning | ✓ | T1 | Platform NS §2 |
| E2 | Constitutional acceptance rules | ✓ | T5 | Charter PAS §1–§4 |
| E3 | Acceptance graph epistemology | ✓ | T5 | Charter PAS §3 |
| E4 | Semantic model delivery | ✓ | T5 | Semantic model PAS · 58/58 |
| E5 | Ten integrity dimensions | ✓ | T5 | Charter PAS §8 |
| E6 | Knowledge constitutional laws | ✓ | T1 | [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) |
| E7 | Knowledge hierarchy Concept → Atom → Representation | ✓ | T6 | Peer review 2026-06-29 · §3.1 |
| E8 | Epistemic status model | ✓ | T6 | `epistemicStatus` facet · `check:knowledge-epistemic-facets` · §3.3 |
| E9 | Evidence precedence hierarchy | △ | T6 | Peer review · §3.4 — implement in PAS |
| E10 | Conflict resolution model | △ | T6 | Peer review · §5.2 — implement in PAS |
| E11 | Semantic stability levels | ✓ | T6 | `semanticStability` facet · `check:knowledge-epistemic-facets` · §3.5 |
| E12 | Constitutional promotion pipeline | ✓ | T1 | §8.5 · LAW K7 |
| E13 | Knowledge term layer (synonyms not atoms) | ✓ | T5 | Semantic model PAS · peer review §3.1 |
| E14 | Applicability and scope model | △ | T6 | Gap closure §3.6 — implement in PAS conformance |
| E15 | Exposure and agent grounding tiers | △ | T6 | Gap closure §3.7 — implement in PAS |
| E16 | Stewardship and proposal intake | △ | T6 | Gap closure §3.8 · §8.6 |
| E17 | Five registry classes at business level | ✓ | T6 | Gap closure §3.10 |
| E18 | Meaning vs MDM reservation boundary | ✓ | T0 | [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) · I10 |
| D1 | Representations not authority | ✓ | T5 | LAW K2 |
| D2 | Shape ≠ meaning | ✓ | T5 | LAW K6 |

**Provenance:** Production Candidate — peer-reviewed 9.95/10 (2026-06-29); gap closure amendment 2026-06-29. Enterprise Accepted requires §16 exit criteria.

## 12.2 Decision log

| Date | Decision | Rationale | Evidence |
| --- | --- | --- | --- |
| 2026-06-29 | Add Knowledge Term layer between Atom and Representation | Runtime semantic model already separates terms; NS must not lag PAS | E13 |
| 2026-06-29 | Add §3.6 applicability — mirror Accounting NS jurisdiction pattern for meaning scope | Global terms break in concurrent ERP contexts | E14 |
| 2026-06-29 | Add §3.7 exposure tiers for agent grounding | OpenMetadata/DataHub context-layer pattern; atoms already carry exposure in registry | E15 |
| 2026-06-29 | Add §3.8 stewardship roles + §8.6 proposal intake | SAPterm / industry glossary governance best practices | E16 |
| 2026-06-29 | Add §3.10 five registry classes | Prevent atom/term/representation collapse — Architecture Authority §3.1 analogue | E17 |
| 2026-06-29 | I10 meaning vs reservation boundary | ADR-0020 master data authority — Knowledge owns meaning not record ownership | E18 |
| 2026-06-29 | §4 maturity alignment — domain spec vs runtime columns | §4 overstated Production while §12 △ and package lacked facets — agents skipped PAS work | §4 legend · E8–E16 |

---

# 13. Blueprint Mapping

Capability → Blueprint box names only. Detail: [Enterprise Knowledge Blueprint](../BLUEPRINT/enterprise-knowledge-blueprint.md) §4 · [Platform Blueprint rollup](../BLUEPRINT/kernel-blueprint.md).

| §4 Capability | Blueprint box |
| --- | --- |
| Knowledge hierarchy | **Enterprise knowledge** |
| Knowledge classification | **Enterprise knowledge** |
| Epistemic status model | **Enterprise knowledge** |
| Evidence precedence | **Enterprise knowledge** |
| Semantic stability levels | **Enterprise knowledge** |
| Acceptance graph model | **Enterprise knowledge** |
| Accepting authority taxonomy | **Enterprise knowledge** |
| Temporal scope | **Enterprise knowledge** |
| Promotion pipeline | **Enterprise knowledge** |
| Relationship preservation | **Enterprise knowledge** |
| Conflict resolution engine | **Enterprise knowledge** |
| Integrity dimensions | **Enterprise knowledge** |
| Conformance enforcement | **Enterprise knowledge** |
| Kernel consumer alignment | **Enterprise knowledge** |
| Applicability resolution | **Enterprise knowledge** |
| Knowledge term model | **Enterprise knowledge** |
| Exposure and agent grounding | **Enterprise knowledge** |
| Stewardship workflow | **Enterprise knowledge** |
| Vocabulary discovery | **Enterprise knowledge** |
| Misconception coverage | **Enterprise knowledge** |
| Trust certification | **Enterprise knowledge** |

---

# 14. Governance

| Question | Authority |
| --- | --- |
| Change knowledge constitutional laws | [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) + ADR |
| Promote Domain NS §3 term to atom | SYNC slice · §8.5 pipeline |
| Add atom or relationship | Platform PAS slice + conformance |
| Resolve evidence conflict | §5.2 · Knowledge Decision atom |
| Sync glossary/UI | Representation consumer — registry wins |
| Add synonym or locale term | Term registry — atom must exist |
| Promote to Enterprise Accepted | §16 exit criteria |

## 14.5 Knowledge governance decision matrix

| Question / change | Authority owner |
| --- | --- |
| New **business term meaning** | Domain North Star §3 → promotion → atom |
| New **architectural decision meaning** | ADR + Decision-class atom |
| **Glossary / UI label** | Representation only — atom must exist |
| **Synonym / locale label** | Term registry — atom must exist · P13 |
| **Applicability scope change** | Accepting authority + §3.6 facet |
| **Exposure tier change** | Accepting authority + §3.7 |
| **Wire shape / branded ID** | Platform Kernel — not Knowledge |
| **Package allowed / layer** | Platform Architecture Authority |
| **Entity identifier ownership** | Architecture Authority reservation registry — not Knowledge (I10) |
| **IFRS paragraph citation** | Accounting Standards Authority |
| **Evidence conflict** | §3.4 precedence → §5.2 escalation |
| **Epistemic promotion** | Accepting authority + integrity profile |
| **Tenant-specific wording** | Not platform knowledge — customer config |

---

# 15. Domain Evolution

**May evolve here:** new §4 capabilities · §6 outcome targets · §7 events · vocabulary (§3) · exposure tiers · locale support matrix

**Must not evolve here:** runtime rules (PAS) · slice order (PAS §10) · registry file paths · PAS inventory (Blueprint §10)

**Long-term direction:**

- **Core → Advanced:** numeric integrity scoring (deferred) · trust certification automation · federated domain glossaries under one atom spine
- **Representation expansion:** additional consumer projections (email, PDF, native) — same atoms, new representations
- **Tenant overlay (gated):** customer-specific wording as representation only — never platform atom authority without ADR

---

# 16. Enterprise Accepted path

## Enterprise Accepted exit criteria

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | Epistemic status on all Production+ atoms | PAS registry + gates |
| 2 | Evidence precedence operational | §3.4 in conformance |
| 3 | Conflict resolution operational | §5.2 in validation |
| 4 | Semantic stability on all Production+ atoms | §3.5 facet |
| 5 | Classification on all Production+ atoms | §3.2 kind |
| 6 | Promotion pipeline proven for one domain | Domain NS §3 → glossary sync |
| 7 | Zero △ peer-review items (E9–E10) | Evidence register ✓ |
| 8 | Knowledge Laws K1–K8 referenced in PAS charter | Doc cross-links |
| 9 | Applicability scope on all Production+ Rule/Policy atoms | §3.6 facet |
| 10 | Exposure tier on all Production+ atoms | §3.7 facet |
| 11 | Knowledge Term layer operational for Production+ atoms | §3.1 · term registry |
| 12 | Zero △ gap-closure items (E14–E16) | Evidence register ✓ |

**Last synced with PAS:** Charter MVP · semantic model closed (PAS-004C) · operational closure partial (PAS-004D B50) · §4 runtime column synced 2026-06-29 · **Maturity:** Production Candidate (Enterprise Accepted blocked — criteria above remain open)

---

# 17. Sync

| Downstream | Sync rule |
| --- | --- |
| Enterprise Knowledge Blueprint §4 | Every §13 row maps to Enterprise knowledge box · §5.1 runtime labels follow NS §4 **Runtime** column |
| Platform Blueprint | Knowledge family row references this domain NS · rollup |
| Domain North Stars §3 | Upstream of promotion pipeline — constitutional |
| All glossaries | Must derive from atoms — §8.5 |
| Enterprise Knowledge PAS family | Implement △ items E9–E10 · E14–E16 |
