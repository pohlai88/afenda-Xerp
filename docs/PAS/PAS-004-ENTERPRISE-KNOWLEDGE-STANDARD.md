# PAS-004 — Enterprise Knowledge Standard

> **Document class vs role:** Registered as a **Package Authority Standard (PAS)** — filename and index follow PAS-001…PAS-003 convention (`PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md`). **Semantic role:** Afenda's **constitutional charter** for enterprise knowledge (technology-free §1–§4). Do not rename the file to `*-CHARTER.md`; "charter" describes what the document *is*, not the PAS naming pattern.

> **Constitutional sentence:** Enterprise knowledge exists when meaning is accepted, reasoning is understood, evidence is trusted, relationships are preserved, decisions are explainable, and evolution is traceable.

> **One sentence:** PAS-004 is Afenda's constitutional charter for enterprise knowledge governance. It defines how knowledge **becomes authoritative through acceptance** — by an accepted authority, supported by evidence, within a defined domain — independent of any technology or platform.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-004 |
| **Document class** | `package_authority_standard` |
| **Document role** | `constitutional_charter` |
| **Canonical filename** | `PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md` |
| **Package** | `@afenda/enterprise-knowledge` |
| **Layer** | Platform |
| **Package role** | Owns accepted enterprise meaning — Knowledge Atoms, domains, acceptance chains, relationships, integrity dimensions, and conformance policy |
| **Runtime stance** | `contracts-only` |
| **Registry lane** | `PKGR04_ENTERPRISE_KNOWLEDGE` |
| **Package owner** | Enterprise Knowledge Authority |
| **Agent skill** | `enterprise-knowledge` · `.cursor/skills/enterprise-knowledge/SKILL.md` |
| **Maturity** | MVP Authority (`mvp_authority`) |
| **Authority status** | `accepted_for_implementation` |
| **Implementation status** | `partial` |
| **Evidence level** | `registry` |
| **Runtime status** | Charter MVP delivered — 12 seed atoms, `check:knowledge-conformance`; platform rollout in PAS-004A; Enterprise Accepted in PAS-004B |
| **Remaining slices** | none — see [PAS-004A](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) · [PAS-004B](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) |
| **Consumers** | `@afenda/metadata`, `@afenda/metadata-ui`, `apps/erp`, `docs/architecture/glossary.md` |
| **Change model** | `serialized-slices` |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **ADR prerequisites** | none |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/enterprise-knowledge typecheck` |
| 2 | `pnpm --filter @afenda/enterprise-knowledge test:run` |
| 3 | `pnpm check:knowledge-conformance` |
| 4 | `pnpm quality:boundaries` |

> **Maturity is part of authority.**
> Charter MVP is delivered; Production Candidate rollout lives in [PAS-004A](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md). Do not claim Enterprise Accepted from this document alone.

> **Canonical location:** `docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md`
> **Package-local pointer:** [`packages/enterprise-knowledge/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md`](../../packages/enterprise-knowledge/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)
> **Kernel wire boundary (do not duplicate):** [PAS-001 §4](PAS-001-KERNEL-AUTHORITY-STANDARD.md) · `.cursor/skills/kernel-authority/SKILL.md`
> **Package map boundary (do not duplicate):** [PAS-002 §0](PAS-002-ARCHITECTURE-AUTHORITY.md) · `.cursor/skills/architecture-authority/SKILL.md`

---

# 0. Agent Quick Path

> Read this section first for IDE/agent work. Full detail in §1–§13. Execution adapter: `.cursor/skills/enterprise-knowledge/SKILL.md`

**Boundary:** `@afenda/enterprise-knowledge` **owns the enterprise knowledge platform — authoritative acceptance, Knowledge Atoms, domains, relationships, integrity dimensions, and conformance; it never owns kernel wire contracts, business master data runtime, UI rendering, accounting-standard rules, database migrations, package lifecycle registries, external learning portals, scoring algorithms, or tenant-specific knowledge.**

**Hard stops summary:**

* **Prohibited imports:** `@afenda/architecture-authority`, `@afenda/database`, `@afenda/metadata`, `@afenda/metadata-ui`, `@afenda/ui`, `@afenda/appshell`, `apps/erp`, auth SDKs, UI frameworks.
* **Must never own:** kernel wire/parser behavior, journal posting, ledger persistence, UI components, DB migrations, package registry rows, tenant-editable knowledge stores, graph databases, scoring engines.

**Required gates:** see §13.

**Slice entrypoint:** `docs/PAS/slice/b24-knowledge-charter-mvp.md` · Planner: `pas-slice-planner` · Session: `/afenda-coding-session`

**Registry:** `PKGR04_ENTERPRISE_KNOWLEDGE` · `PKG-024` in `packages/architecture-authority/src/data/package-registry.data.ts`

**Related PAS boundaries:**

* **Kernel (PAS-001):** wire shapes and branded IDs only — atoms **reference** kernel contracts via implementation mapping; never duplicate parsers.
* **Architecture authority (PAS-002):** lists this package in registries; does **not** store Knowledge Atoms.
* **Accounting standards (PAS-003):** versioned IFRS/MFRS treatment metadata — orthogonal to enterprise vocabulary acceptance.

---

## Three layers (charter · platform · representations)

| Layer | Name | Home | Authority |
| --- | --- | --- | --- |
| Charter | PAS-004 (this document) | `docs/PAS/` only — §1–§4 technology-free | Constitutional acceptance rules |
| Platform | Afenda Knowledge Platform | `@afenda/enterprise-knowledge` | Knowledge Atoms, relationships, conformance |
| Representations | Glossary, metadata labels, AI context, API copy | Consumers import from platform | Synced views — not authoritative |

---

# 1. North Star

Afenda treats enterprise knowledge as a **governed asset**, not informal documentation.

Knowledge is not authoritative because someone wrote it down. Knowledge **becomes authoritative through acceptance**: an accepted authority ratifies meaning, reasoning is recorded, evidence is cited, relationships are explicit, and evolution is traceable.

The North Star outcome:

> Every contested term, invariant, or business rule has a discoverable Knowledge Atom with an acceptance chain, domain, lifecycle, and evidence — consumable by humans, agents, and product surfaces without re-deriving meaning locally.

---

# 2. First Principles

These principles are technology-free and durable across platforms.

1. **Acceptance creates authority** — existence of text does not create truth; accepted authority does.
2. **Reasoning must be recoverable** — acceptance without recorded reasoning is incomplete.
3. **Evidence must be citable** — authority claims point to durable artifacts, not memory.
4. **Domains bound applicability** — knowledge applies within declared scope, with explicit exceptions.
5. **Relationships preserve context** — meaning is networked; isolation breeds drift.
6. **Decisions are explainable** — Knowledge Decisions record why acceptance occurred.
7. **Evolution is traceable** — supersession and lineage are first-class, not footnotes.
8. **Representations are not authority** — glossaries, labels, and UI copy consume atoms; they do not own them.
9. **Integrity is multidimensional** — completeness is assessed across constitutional dimensions; numeric scoring is deferred to platform evolution.
10. **Honesty over aspiration** — lifecycle and implementation mapping must not overstate delivery.

---

# 3. Epistemology

## 3.1 How knowledge becomes authoritative

Afenda uses an **Acceptance Graph** model. The primary asset is the **acceptance event** — not the atom.

```
Accepting Authority   (who has the right to accept)
        ↓
Acceptance Event      (who accepted, when, why, which evidence)
        ↓
Knowledge Atom        (the meaning that became authoritative)
        ↓
Knowledge Edge        (how atoms relate and support each other)
        ↓
Evidence              (cited artifacts that prove the acceptance)
        ↓
Reasoning             (why the evidence justifies the accepted meaning)
        ↓
Consumer              (metadata, UI, AI, audit — representations only)
```

**Acceptance is primary.** A Knowledge Atom without a complete acceptance chain is not authoritative — it is `proposed` at best. The acceptance graph is the traversal of authority from the accepting body to the accepted meaning. Atoms are nodes; edges are relationships; evidence and reasoning are the proof layer beneath both.

Acceptance steps (conceptual lifecycle):

| Step | Meaning |
| --- | --- |
| Origin | Where the claim was first observed or proposed |
| Under Review | An accepting authority is evaluating; not yet binding |
| Accepted | An accepting authority records meaning and reasoning |
| Ratified | A higher or constitutional authority confirms binding scope |
| Implemented | Runtime or documentation evidence exists |
| Superseded | Replaced by a newer atom with explicit lineage |
| Historical | Archived; lineage preserved; must not be applied to new work |

Authority is expressed on three **orthogonal axes** (never collapsed into one label):

| Axis | Role |
| --- | --- |
| `authorityType` | What kind of authority speaks (standard, regulatory, legal, corporate, architectural, operational, engineering, informative) |
| `binding` | How strongly consumers must obey (mandatory, recommended, optional, historical) |
| `confidence` | How certain the acceptance is (0–100 with stated basis) |

## 3.2 Accepting Authority

An accepting authority is **not** a string label. It is a typed entity with:

- **Identity** — a stable identifier and canonical name
- **Jurisdiction scope** — global, regional, national, organizational, project
- **Classification** — regulatory body, standards body, legal entity, corporate board, architecture committee
- **Standard affiliation** — e.g. IASB, ISO, FASB, GAAP board, internal SOP committee

Examples: IASB accepted IFRS 10 — not "standard_body" accepted it. That distinction is traceable. A string enum is not.

## 3.3 Evidence and Reasoning

Evidence and Reasoning are **first-class** in the acceptance graph:

**Evidence** — a typed record citing what proves the acceptance:
- Source document (regulation, ISO standard, ADR, board resolution, SOP)
- Clause / section reference
- Effective date and expiry date (knowledge has temporal validity)

**Reasoning** — a structured argument, not a prose field:
- Premises: stated facts on which the argument rests
- Inference: how the premises lead to the conclusion
- Rules applied: constitutional or domain rules invoked
- Conclusion: the accepted meaning that results

A flat `reasoning: string` does not satisfy "reasoning must be recoverable" (First Principle 2). A structured Reasoning node does.

## 3.4 Effective Time

Knowledge is not timeless. IFRS 4 and IFRS 17 cannot coexist without temporal scope. Every atom should carry:

- `effectiveFrom` — when this meaning became binding
- `effectiveUntil` — when it was superseded or expired (open if still current)
- `supersededBy` — atom ID of the replacement

This allows consumers to ask: *"What was the accepted meaning of concept X on date Y?"*

## 3.5 What Enterprise Knowledge Is Not

* Not a wiki page without acceptance metadata
* Not a kernel wire type (shape ≠ meaning)
* Not a package registry row (topology ≠ semantics)
* Not tenant-specific configuration
* Not AI-generated prose without evidence and acceptance chain
* Not a Knowledge Atom that exists without a complete acceptance graph

---

# 4. Governance Charter — Six Questions

Before accepting or changing enterprise knowledge, answer:

1. **Who accepts?** — Which accepting authority and authority type?
2. **Why now?** — What Knowledge Decision and reasoning justify acceptance?
3. **Where does it apply?** — Knowledge Domain and applicability (including exceptions)?
4. **What evidence?** — Cited artifacts and integrity profile completeness?
5. **What changed?** — Lineage: origin, evolution, current authority, future direction?
6. **What must not drift?** — Relationships, misconceptions, and exposure audience?

If any answer is missing, the atom remains `proposed` — not `accepted` or `ratified`.

---

# 5. Knowledge Atom

The **Knowledge Atom** is the smallest composable unit of accepted enterprise meaning.

Required facets (MVP registry):

| Facet | Purpose |
| --- | --- |
| `atomId` | Stable identifier (snake_case) |
| `fqn` | Stable fully qualified name (`afenda.enterprise.<domain>.<id>`) |
| `kind` | `concept` · `vocabulary` · `principle` · `rule` · `decision` · `pattern` · `standard` · `relationship` |
| `meaning` | `canonical`, `business`, `engineering` wordings |
| `acceptanceChain` | Origin → accepted → ratified steps with actors and timestamps |
| `authorityType` | Authority kind axis (standard, regulatory, legal, …) |
| `binding` | Consumer obligation axis (mandatory, recommended, optional, historical) |
| `confidence` | Certainty axis (`score` 0–100 + `basis[]`) |
| `reasoning` | Why this meaning was accepted |
| `knowledgeDomain` | One or more domain tags |
| `applicability` | `applicable` / `notApplicable` / `exceptions[]` |
| `lifecycle` | observed → proposed → accepted → ratified → implemented → superseded → historical |
| `knowledgeDecision` | Decision record (not ADR — ADRs are architectural decisions) |
| `lineage` | Origin, evolution, current authority, future direction |
| `misconceptions` | Common confusions explicitly rejected |
| `exposure` | Audience and preferred wording policy |
| `integrity` | Presence across ten machine dimensions (see §8) |
| `implementationMapping` | Optional link to kernel/schema/runtime class (honest persistence class) |
| `evidence` | Repo-relative or external citation paths |
| `ownedByPas` | Always `"PAS-004"` for atoms in this registry |

Relationship edges live in `knowledge-relationships.registry.ts` (not embedded on each atom).

Canonical TypeScript contracts: `packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.ts` — see §12.

---

# 6. Acceptance, Authority, and Binding

Accepting authorities are enumerated in the platform registry (`ACCEPTING_AUTHORITIES`). Each atom records:

* **Acceptance chain entries** with step, actor, rationale, and ISO timestamp
* **Authority type** separate from **binding** separate from **confidence**
* **Knowledge Decision** identifier linking to human-readable decision text

Binding levels:

| Level | Consumer obligation |
| --- | --- |
| mandatory | Must conform; violations are defects |
| recommended | Should conform unless documented exception |
| optional | May adopt; no conformance gate |
| historical | Read-only reference; must not be applied to new work |

---

# 7. Domain, Applicability, and Lifecycle

## 7.1 Knowledge Domains

Domains group atoms by concern (platform identity, organization structure, accounting principle, regulatory standard, …). A domain is not a package and not a database schema.

## 7.2 Applicability

| Status | Meaning |
| --- | --- |
| applicable | Default applies within domain |
| notApplicable | Explicitly out of scope |
| exceptions | Applies with listed exception cases |

## 7.3 Lifecycle

Ratified is a distinct state between accepted and implemented — constitutional acceptance without overstating runtime delivery.

Policy helpers (`isAcceptedOrLaterLifecycle`, `isRatifiedOrLaterLifecycle`) enforce honest promotion in gates and tests.

---

# 8. Knowledge Integrity

Integrity is assessed across **ten constitutional dimensions** (presence in MVP; numeric scoring deferred).

Machine keys in `KNOWLEDGE_INTEGRITY_DIMENSIONS` / `KnowledgeIntegrityProfile`:

| Machine key | Constitutional meaning |
| --- | --- |
| `correctness` | Meaning clarity |
| `completeness` | Acceptance completeness |
| `consistency` | Internal consistency of facets |
| `authority` | Accepting authority recorded |
| `acceptance` | Acceptance chain present |
| `evidence` | Evidence trust |
| `reasoning` | Decision explainability |
| `applicability` | Applicability honesty |
| `evolution` | Evolution traceability |
| `relationship` | Relationship preservation |

Exposure appropriateness, misconception coverage, and implementation honesty are enforced via `exposure`, `misconceptions`, and `implementationMapping` facets plus registry tests — not separate boolean keys in MVP.

`COMPLETE_INTEGRITY_PROFILE` marks all ten machine dimensions `true` for MVP seed atoms. Future platform work may add numeric scoring without amending chapters 1–4.

---

# 9. Relationships and Representations

## 9.1 Relationships

Atoms connect via typed edges in `KNOWLEDGE_RELATIONSHIPS`. MVP types: `contains` · `owns` · `operates` · `stores` · `governs` · `derives_from` · `related` · `supersedes` · `values`. Graph storage is an implementation choice; the charter requires **preserved relationships**, not a specific database.

## 9.2 Representations (consumers)

| Representation | Authority |
| --- | --- |
| `@afenda/enterprise-knowledge` registry | **Authoritative** for accepted meaning |
| `docs/architecture/glossary.md` | Synced view — demoted representation |
| `@afenda/metadata` labels | Rendering — imports meaning, does not own it |
| AI / copilot context | Must cite atom IDs and acceptance state |

When glossary and registry diverge, **registry wins** until a slice updates the representation.

---

# 10. Implementation (Platform Package)

MVP implementation lives in `packages/enterprise-knowledge/`:

```text
packages/enterprise-knowledge/
├── package.json              # zero runtime dependencies
├── tsconfig.json
├── tsconfig.vitest.json
├── vitest.config.ts
├── PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md   # tombstone pointer only
└── src/
    ├── index.ts
    ├── contracts/knowledge-atom.contract.ts   # all vocabulary types (single contract module)
    ├── constants/knowledge-integrity.ts
    ├── data/knowledge.registry.ts
    ├── data/knowledge-relationships.registry.ts
    ├── policy/knowledge.policy.ts
    └── __tests__/
        ├── knowledge.registry.test.ts
        └── architecture-boundary.test.ts
```

Root conformance gate: `scripts/governance/check-knowledge-conformance.mts` → `pnpm check:knowledge-conformance`

**Seed scope (MVP):** twelve fully-authored atoms covering platform identity (legal entity, organization unit, workspace, surface), invariants (double entry, accounting equation), contracts, metadata, organization split evolution, and IFRS 10 reference — plus relationship edges.

**Dependency rules:**

| Allowed | Prohibited |
| --- | --- |
| Zero runtime dependencies (MVP) | architecture-authority, database, metadata, UI, erp, auth SDKs |

Architecture-authority **registers** the package; prefer root governance scripts over import cycles.

---

# 11. Prohibited Ownership

`@afenda/enterprise-knowledge` must never own:

* Kernel wire contracts or branded ID parsers
* Database schemas or migrations
* Journal posting or ledger mutation
* UI rendering or component behavior
* Package/layer/dependency registry rows (PAS-002)
* Versioned IFRS rule engines (PAS-003)
* Tenant-editable knowledge stores (future product scope)
* Integrity scoring algorithms (deferred)

---

# 12. Public API

Export surface (`packages/enterprise-knowledge/src/index.ts`):

* Contract types and policy constants
* `ENTERPRISE_KNOWLEDGE_ATOMS`, `KNOWLEDGE_RELATIONSHIPS`
* `getKnowledgeAtom`, `validateKnowledgeRegistry`, lifecycle helpers

All public contracts must remain **JSON-serializable** at boundaries.

---

# 13. Required Gates

## 13.1 Package gates

```bash
pnpm --filter @afenda/enterprise-knowledge typecheck
pnpm --filter @afenda/enterprise-knowledge test:run
pnpm check:knowledge-conformance
pnpm quality:boundaries
```

## 13.2 Registry gates (foundation disposition)

```bash
pnpm check:foundation-disposition
pnpm quality:architecture
```

## 13.3 Documentation gates

```bash
pnpm check:documentation-drift
```

---

# 14. Slice Catalog (MVP)

| Slice | Purpose | Status |
| --- | --- | --- |
| [b24-knowledge-charter-mvp](slice/b24-knowledge-charter-mvp.md) | Charter doc, package scaffold, PKGR04, seed registry, gates, skill | Delivered (2026-06-28) |

**Post-MVP rollout:** [PAS-004A](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) (B25–B32 closed) · [PAS-004B](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) (B33+ Enterprise Accepted) · first slice [B25 JSON data authority](slice/b25-10-json-data-authority.md)

---

# 15. Success Criteria (MVP)

- [x] Knowledge Atoms live in `@afenda/enterprise-knowledge`, not architecture-authority or kernel
- [x] `PKGR04_ENTERPRISE_KNOWLEDGE` in foundation disposition with gates
- [x] Twelve seed atoms + relationships pass `validateKnowledgeRegistry()`
- [x] Glossary demoted to representation with registry authority callout
- [x] `pnpm check:knowledge-conformance` registered and passing
- [x] Chapters 1–4 remain technology-free

**Not yet Enterprise Accepted:** consumer workflow proof (metadata/erp imports), glossary body sync, integrity scoring engine, tenant-editable knowledge.

---

# 16. Related Standards

| Standard | Relationship |
| --- | --- |
| [PAS-004A](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) | Production Candidate rollout — JSON authority, ERP consumer, 9.5 scorecard (derived; does not amend §1–§4) |
| [PAS-004B](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) | Enterprise Accepted rollout — kernel identity bridge, metadata/docs consumers, graph queries (derived) |
| PAS-001 | Kernel wire shapes — referenced, not duplicated |
| PAS-002 | Package registry listing — atoms not stored here |
| PAS-003 | Accounting standards metadata — orthogonal authority |
| ADR-0001 | Platform entity vocabulary — atoms may reference, honesty via implementation mapping |
