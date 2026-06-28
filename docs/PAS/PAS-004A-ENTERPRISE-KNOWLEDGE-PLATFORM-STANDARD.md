# PAS-004A — Enterprise Knowledge Platform Standard (Post-MVP Rollout)

> **Derivation:** PAS-004A continues **enforcement and rollout** after [PAS-004 MVP Authority](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md). It does **not** amend PAS-004 chapters 1–4 (technology-free charter). It defines **Production Candidate** platform rules, data authority, kernel wire references, consumer proof, and slice sequence to **Enterprise 9.5 / 10**.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-004A |
| **Parent PAS** | PAS-004 |
| **Document class** | `derived_platform_standard` |
| **Document role** | `post_mvp_rollout` |
| **Canonical filename** | `PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md` |
| **Package** | `@afenda/enterprise-knowledge` |
| **Layer** | Platform |
| **Package role** | Production rollout of accepted meaning — JSON data authority, validated loaders, consumer proof, conformance expansion |
| **Runtime stance** | `contracts-only` |
| **Registry lane** | `PKGR04_ENTERPRISE_KNOWLEDGE` · `PKG-024` |
| **Package owner** | Enterprise Knowledge Authority |
| **Parent standard** | PAS-004 (constitutional charter + MVP platform) |
| **Agent skill** | `enterprise-knowledge` · `.cursor/skills/enterprise-knowledge/SKILL.md` |
| **Maturity** | Production Candidate (`production_candidate`) |
| **Authority status** | `accepted_for_implementation` |
| **Implementation status** | `delivered` |
| **Evidence level** | `json_authority` |
| **Runtime status** | B24–B32 delivered — 24 atoms, JSON authority, ERP consumer, glossary parity, scorecard 30/30 |
| **Remaining slices** | none |
| **Consumers** | `@afenda/ui-composition`, `@afenda/metadata-ui`, `apps/erp`, `docs/architecture/glossary.md` |
| **Change model** | `serialized-slices` (B25+) |
| **Quality target** | Enterprise **9.5 / 10** |
| **Closure registry** | [`pas-status-index.md`](pas-status-index.md) |
| **ADR prerequisites** | none |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/enterprise-knowledge typecheck` |
| 2 | `pnpm --filter @afenda/enterprise-knowledge test:run` |
| 3 | `pnpm check:knowledge-conformance` |
| 4 | `pnpm check:knowledge-json-authority` |
| 5 | `pnpm quality:boundaries` |
| 6 | `pnpm check:foundation-disposition` |
| 7 | `pnpm check:documentation-drift` |

> **Maturity is part of authority.**
> Production Candidate rollout is **closed** (B24–B32). Enterprise Accepted promotion lives in [PAS-004B](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md). Do not claim North Star ontology completion or tenant-specific knowledge — those remain out of scope.

> **Kernel wire boundary (mandatory read):** [PAS-001](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) · `.cursor/skills/kernel-authority/SKILL.md`
> **Charter (unchanged):** [PAS-004 §1–§4](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)
> **Canonical location:** `docs/PAS/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md`

---

# 0. Agent Quick Path

> Read **PAS-004 §0** for charter boundary, then this §0 for rollout. Full detail §1–§15. Session: `/afenda-coding-session` · Bundle: `/coding-consistency-bundle` · Skills: `enterprise-knowledge` + **`kernel-authority`** when touching `implementationMapping` or kernel references.

**Boundary (same as PAS-004 — do not narrow):** `@afenda/enterprise-knowledge` **owns authoritative acceptance of enterprise meaning**; it **never** owns kernel wire parsers, business master data runtime, UI rendering, accounting rule engines, database migrations, package lifecycle registries, or tenant-specific knowledge stores.

**PAS-004A adds (post-MVP):**

| Topic | B24 (MVP) | PAS-004A target |
| --- | --- | --- |
| Atom data | Hand-authored TypeScript array (~719 lines) | **JSON authority** + thin TS loader/validator |
| Coverage | 12 seed atoms | **Honest seed** + documented expansion targets |
| Consumers | Documented only | **Proven imports** in metadata and/or ERP |
| Kernel link | `implementationMapping` strings | **Validated paths** to PAS-001 contracts only |
| Maturity claim | MVP Authority | **Production Candidate → Enterprise Accepted** via slices |

**Hard stops:**

- **Prohibited:** duplicate kernel `*.parser.ts` / `*.assert.ts` / branded parsers in enterprise-knowledge
- **Prohibited:** call 12 seed atoms "North Star complete" or "enterprise ontology"
- **Prohibited:** hand-edit atoms only in `.ts` after B25 (JSON is source of truth)
- **Required:** `kernel-authority` read before any `implementationMapping` or kernel path change

**Required gates:** §13

**Closure registry:** [`pas-status-index.md`](pas-status-index.md)

**Planner / registry:** `pas-slice-planner` · disposition changes → `foundation-registry-owner` only

---

# 1. Derivation and Scope

## 1.1 What PAS-004 delivered (B24 — closed)

- Constitutional charter (PAS-004 §1–§4) — technology-free
- `@afenda/enterprise-knowledge` package scaffold, PKGR04, conformance gate
- Twelve **seed** Knowledge Atoms + knowledge edges (then named `KnowledgeRelationship`)
- Agent skill, glossary demoted to representation

## 1.2 What PAS-004A owns

PAS-004A is the **rollout standard** for turning the seed platform into **Production Candidate** and then **Enterprise Accepted** evidence:

1. **Data authority model** — JSON-serializable atom corpus with TS validation only
2. **Kernel reference discipline** — PAS-001 contract paths via `implementationMapping`; no wire duplication
3. **Consumer proof** — metadata / ERP import accepted atoms without local vocabulary forks
4. **Coverage honesty** — published atom counts, domains, and gaps vs charter intent
5. **Expanded governance** — gates, tests, and slice catalog through B30
6. **9.5 readiness scorecard** — §11; no vibe claims without `pnpm` evidence

## 1.3 What PAS-004A does not do

- Rewrite PAS-004 chapters 1–4
- Move atoms to architecture-authority or kernel
- Introduce graph DB runtime, scoring engines, or tenant wiki stores (still deferred)

---

# 2. One-Sentence Boundary

**`@afenda/enterprise-knowledge` owns the production rollout of accepted enterprise meaning — the Acceptance Graph (Accepting Authority → Acceptance Event → Knowledge Atom → Knowledge Edge → Evidence → Reasoning → Consumer), JSON-governed atoms and edges, and conformance policy — and never owns kernel wire parsers, persistence, UI rendering, accounting posting, or package registry rows.**

---

# 3. Dependency Rules

## 3.1 Allowed

| Dependency | Rule |
| --- | --- |
| Zero runtime npm dependencies | Maintained (MVP rule continues) |
| `@afenda/kernel` types | **Type-only** imports for branded IDs referenced in `implementationMapping` validation — no kernel runtime, no parsers |
| Root governance scripts | May read JSON + TS exports without import cycles |

## 3.2 Prohibited imports

Same as PAS-004 §10: `@afenda/architecture-authority`, `@afenda/database`, `@afenda/ui-composition`, `@afenda/metadata-ui`, `@afenda/ui`, `@afenda/appshell`, `apps/erp`, auth SDKs, React, Next.js, Drizzle, HTTP clients.

## 3.3 Import rule

Enterprise-knowledge **references** kernel vocabulary; kernel **never** imports enterprise-knowledge. Architecture-authority **registers** the package; prefer root scripts over cross-package runtime imports.

---

# 4. Authority Surfaces (Production Target)

## 4.1 Knowledge Atom data authority

**Authority:** PAS-004 §6–§8 · PAS-004A §6

**Current (B24):** `src/data/knowledge.registry.ts` — transitional hand-authored TS.

**Target (B25+):**

```text
packages/enterprise-knowledge/src/data/
├── atoms.json                          # authoritative atom corpus
├── edges.json                          # authoritative edge corpus (KnowledgeEdge)
├── knowledge.registry.ts               # atom loader (thin, ≤120 lines)
├── accepting-authority.registry.ts     # typed authority loader
└── knowledge-data.schema.ts            # Zod schema — validates at load time
```

**Rule:** Editors and agents mutate **JSON** (or generated JSON from approved tooling). TypeScript validates; it does not hold the long-form corpus.

## 4.2 Kernel implementation mapping (PAS-001)

**Authority:** [PAS-001 §4](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) · [kernel-authority SKILL](../../.cursor/skills/kernel-authority/SKILL.md)

Each atom `implementationMapping` entry must:

| Rule | Enforcement |
| --- | --- |
| Point to an existing kernel **contract** path under `packages/kernel/src/` | B26 gate: path existence check |
| Never point to `*.parser.ts` for ownership — parsers are kernel-internal | B26 gate |
| Never embed business decisions (currency fallback, formatting, resolvers) | `pas-prohibited-surface-scan` on touch |
| Use branded ID **names** only — no silent `as TenantId` in enterprise-knowledge | Conformance + review |

**Kernel wire context triad (reference only):** `<name>-context.{contract,assert,parser}.ts` lives in kernel. Atoms cite **contract** paths and document which kernel branded types apply.

## 4.3 Conformance and policy

**Current:** `knowledge.policy.ts`, `check-knowledge-conformance.mts`

**Target additions:**

- JSON schema / structural validation at load
- `implementationMapping` kernel path lint (B26)
- Consumer import smoke tests (B27)
- Glossary representation sync check (B28)

## 4.4 Representations

Unchanged from PAS-004 §9: registry wins over glossary. PAS-004A adds **automated drift detection** between glossary body and atom IDs (B28).

## 4.5 Accepting Authority Registry (new surface — B25)

**Authority:** PAS-004 §3.2 (amended)

**Problem:** `ACCEPTING_AUTHORITIES` is a string enum. IASB is not the same as "standard_body." Traceability requires typed authority entities.

**Target contract:**

```typescript
interface AcceptingAuthorityEntity {
  readonly authorityId: string;          // stable branded ID
  readonly name: string;                 // canonical name (e.g. "IASB")
  readonly jurisdictionScope:
    | "global" | "regional" | "national" | "organizational" | "project";
  readonly classification:
    | "regulatory_body" | "standards_body" | "legal_entity"
    | "corporate_board" | "architecture_committee" | "internal_committee";
  readonly standardBody?: string;        // e.g. "IASB", "ISO", "FASB"
  readonly url?: string;
}
```

Atoms reference `authorityId` from this registry — not a free string.

## 4.6 Knowledge Evidence (typed — B25)

**Authority:** PAS-004 §3.3 (amended)

**Problem:** `evidence: readonly string[]` is a path list. A typed evidence object is traceable and temporal.

**Target contract:**

```typescript
interface KnowledgeEvidence {
  readonly evidenceId: string;
  readonly type:
    | "standard" | "regulation" | "decision" | "sop"
    | "adr" | "resolution" | "research" | "policy";
  readonly source: string;               // authoritative name (e.g. "IAS 1")
  readonly citation?: string;            // clause or section
  readonly url?: string;
  readonly effectiveDate?: string;       // ISO 8601
  readonly expiredDate?: string;         // ISO 8601 — open if still current
}
```

## 4.7 Knowledge Reasoning (structured — B25)

**Authority:** PAS-004 §3.3 (amended) · First Principle 2 ("reasoning must be recoverable")

**Problem:** `reasoning: string` is a flat prose field. A structured Reasoning node is recoverable and auditable.

**Target contract:**

```typescript
interface KnowledgeReasoning {
  readonly premises: readonly string[];  // stated facts the argument rests on
  readonly inference: string;            // how premises lead to conclusion
  readonly rules: readonly string[];     // constitutional or domain rules applied
  readonly conclusion: string;           // the accepted meaning that results
  readonly alternatives?: readonly string[]; // considered and rejected
}
```

## 4.8 Effective Time (temporal scope — B25)

**Authority:** PAS-004 §3.4 (amended)

**Problem:** IFRS 4 and IFRS 17 cannot coexist without temporal scope. Atoms have no time dimension today.

**Target additions to KnowledgeAtom:**

```typescript
readonly effectiveFrom?: string;         // ISO 8601 — when meaning became binding
readonly effectiveUntil?: string;        // ISO 8601 — open if still current
readonly version?: string;               // human-readable version label
readonly supersededBy?: string;          // atomId of replacement
```

## 4.9 Knowledge Edge (rename + richer types — B25)

**Authority:** PAS-004 §9.1

**Rename:** `KnowledgeRelationship` → `KnowledgeEdge`. `KNOWLEDGE_RELATIONSHIPS` registry → `KNOWLEDGE_EDGES`. This opens the graph DB path without forcing it.

**Current edge types (9):** `contains`, `owns`, `operates`, `stores`, `governs`, `derives_from`, `related`, `supersedes`, `values`

**Target additions:**

```typescript
| "accepts"         // authority accepts this atom
| "evidence_for"    // atom provides evidence for another
| "evidence_against" // atom challenges another
| "governed_by"     // atom is constrained by another
| "applicable_to"   // atom applies within a scope atom
| "validated_by"    // atom is validated by another authority atom
| "explained_by"    // reasoning atom explains this atom
| "contradicts"     // atoms conflict — requires resolution slice
| "requires"        // atom depends on another for meaning
```

---

# 5. What This Package Must Never Own

Everything in PAS-004 §11, plus:

- **Authoritative atom corpus in TypeScript literals** after B25 delivery
- **Kernel parsers, asserts, or wire resolvers** (PAS-001 hard stop)
- **Production maturity claims** without §11 scorecard ≥ 28.5 / 30

---

# 6. Package Structure Standard

## 6.1 Current (B24 — honest)

See PAS-004 §10. Seed TS registry is **transitional**, not target architecture.

## 6.2 Target (PAS-004A)

```text
packages/enterprise-knowledge/
├── package.json
├── PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md
├── PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md
└── src/
    ├── index.ts
    ├── contracts/
    │   ├── knowledge-atom.contract.ts           # KnowledgeAtom + effective time (B25)
    │   ├── knowledge-edge.contract.ts           # KnowledgeEdge (rename + richer types, B25)
    │   ├── knowledge-evidence.contract.ts       # KnowledgeEvidence typed (B25)
    │   ├── knowledge-reasoning.contract.ts      # KnowledgeReasoning structured (B25)
    │   └── accepting-authority.contract.ts      # AcceptingAuthorityEntity (B25)
    ├── constants/knowledge-integrity.ts
    ├── data/
    │   ├── atoms.json                           # JSON data authority (B25)
    │   ├── edges.json                           # Knowledge edges in JSON (B25, replaces relationships.json)
    │   ├── accepting-authority.registry.ts      # typed authority loader (B25)
    │   ├── knowledge.registry.ts                # atom loader (thin, ≤120 lines post-B25)
    │   ├── knowledge-data.schema.ts             # Zod validation schema
    │   └── [knowledge-relationships.registry.ts] # superseded by edges.json + loader after B25
    ├── policy/knowledge.policy.ts
    └── __tests__/
        ├── knowledge.registry.test.ts
        ├── knowledge-json-authority.test.ts    # B25
        ├── kernel-mapping.test.ts              # B26
        ├── accepting-authority.test.ts         # B25
        └── architecture-boundary.test.ts
```

---

# 7. Decision Matrix

| Question | If yes → | In enterprise-knowledge? |
| --- | --- | --- |
| Is this accepted meaning for a term/invariant? | Knowledge Atom in JSON | **Yes** |
| Is this the authoritative storage format for atoms? | `atoms.json` + loader | **Yes** (after B25) |
| Is this a kernel wire shape or parser? | PAS-001 kernel | **No** |
| Is this a cross-package branded ID definition? | Kernel contract | **No** (reference only) |
| Is this UI label rendering? | metadata / metadata-ui | **No** |
| Is this IFRS treatment rule text? | PAS-003 accounting-standards | **No** |
| Is this package registry row? | PAS-002 architecture-authority | **No** |
| Does this require database persistence? | database package | **No** |
| Is this integrity score 0–100 computation? | Deferred product scope | **No** (MVP+004A) |
| Is this tenant-editable wiki content? | Future product | **No** |

---

# 8. Contract Rules

All PAS-004 contract rules apply, plus:

1. **JSON authority** — atom corpus must round-trip `JSON.parse(JSON.stringify())` without loss
2. **Loader-only TS** — `knowledge.registry.ts` after B25 must stay under **120 lines** (excluding re-exports); corpus lives in JSON
3. **Stable atom IDs** — renaming requires supersession edge + slice; no silent renames
4. **`implementationMapping`** — each entry `{ surface, contractPath, notes? }` with validated `contractPath`
5. **Readonly** — loaded objects treated as immutable (`as const` / `satisfies readonly KnowledgeAtom[]`)
6. **No side effects on import** — validation runs at load; no network/DB
7. **Kernel-authority Phase 0** — mandatory before changing mapping paths
8. **Typed evidence** — `evidence` must be `KnowledgeEvidence[]` not `string[]` after B25
9. **Structured reasoning** — `reasoning` must be `KnowledgeReasoning` not `string` after B25
10. **Temporal scope** — atoms with a defined lifecycle must carry `effectiveFrom`; superseded atoms must set `effectiveUntil` and `supersededBy`
11. **Authority registry reference** — `acceptanceChain[].by` must resolve to an `authorityId` in `AcceptingAuthorityRegistry` after B25; free strings are prohibited for new atoms
12. **Knowledge Edge naming** — all new edge registry entries use `KnowledgeEdge` / `edgeId` — no new `KnowledgeRelationship` / `relationshipId` after B25

---

# 9. Runtime Rules

Same as PAS-004: **contracts-only**. No runtime npm dependencies. No resolvers that load tenant data.

Approved runtime behavior: pure validation, registry lookup helpers, conformance exports.

---

# 10. Implementation Sequence (B25–B30)

Execute in order. Do not skip consumer proof before claiming Production Candidate evidence.

| Order | Slice | Delivers |
| ---: | --- | --- |
| 1 | B25 JSON data authority + new contracts | `atoms.json`, `edges.json`, `accepting-authority.registry.ts`, typed `KnowledgeEvidence`, `KnowledgeReasoning`, `effectiveFrom`/`Until`, richer edge types, rename Relationship → Edge, `check:knowledge-json-authority` | **Delivered · 2026-06-28** |
| 2 | B26 Kernel mapping gate | `implementationMapping` path lint vs `packages/kernel/src/**`; authority registry validates | **Delivered · 2026-06-28** |
| 3 | B27 Consumer proof | `@afenda/ui-composition` or `apps/erp` imports `getKnowledgeAtom` for ≥1 surface | **Delivered · 2026-06-28** |
| 4 | B28 Glossary sync gate | glossary body atom IDs ⊆ registry; header authority unchanged | **Delivered · 2026-06-28** |
| 5 | B29 Coverage expansion + quality scoring | typed corpus + quality helper | **Delivered · 2026-06-28** |
| 6 | B30 Enterprise Accepted attestation | §11 scorecard 30/30; disposition evidence | **Delivered · 2026-06-28** |
| 7 | B31 Ontology completion | 24-atom typed JSON corpus | **Delivered · 2026-06-28** |
| 8 | B32 ERP consumer integration | system-admin titles + glossary manifest parity | **Delivered · 2026-06-28** |

**Do not add in this package (correct home):**

- Fiscal period IDs, currency decisions → finance / accounting packages
- Permission evaluation → `@afenda/permissions`
- Formatting helpers → appshell / ERP presentation layer

---

# 11. Enterprise Acceptance Criteria (9.5 Scorecard)

A PAS-004A track is **Enterprise 9.5 ready** only when **≥ 28.5 / 30** on this scorecard **and** all §13 gates pass.

| # | Criterion | Points | Evidence |
| ---: | --- | ---: | --- |
| 1 | JSON is authoritative atom source (B25) | 3 | `atoms.json` + loader tests |
| 2 | No kernel parser duplication | 3 | B26 gate + boundary test |
| 3 | `check:knowledge-conformance` passing | 2 | CI output |
| 4 | Consumer proof (≥1 production import path) | 3 | B27 test or static import gate |
| 5 | Glossary representation sync | 2 | B28 gate |
| 6 | PAS-004 §1–§4 unchanged | 2 | Doc drift check |
| 7 | Slice handoffs 9-field complete for B25–B27 | 2 | [`pas-status-index.md`](pas-status-index.md) |
| 8 | Skill + bundle preflight documented | 2 | enterprise-knowledge SKILL |
| 9 | Honest coverage statement (seed vs target) | 2 | PAS-004A §12 table |
| 10 | Foundation disposition gates listed | 2 | PKGR04 row |
| 11 | No prohibited imports | 2 | `pnpm quality:boundaries` |
| 12 | Completion Report culture on slices | 2 | afenda-coding-session §11 |
| 13 | Vibe-coding hook ledger optional | 1 | `.cursor/audit/vibe-coding-violations.jsonl` |
| 14 | Documentation drift clean for PAS paths | 2 | `pnpm check:documentation-drift` |
| 15 | TypeScript strict + tests | 2 | typecheck + test:run |
| | **Total** | **30** | **Target: ≥ 28.5** |

**Honesty rule:** B24 twelve atoms score **≤ 6 / 30** alone — seed scaffold only. Do not conflate B24 closure with PAS-004A completion.

---

# 12. Coverage Targets (Honest)

| Domain | B24 seed count | Production Candidate target | Enterprise Accepted target |
| --- | ---: | ---: | ---: |
| Platform identity (tenant, legal entity, org, workspace, surface) | 5 | 8+ with acceptance chains | Full platform identity set per charter |
| Invariants (double entry, accounting equation) | 2 | 2+ validated | Same + linked evidence |
| Metadata / organization evolution | 2 | 4+ | Charter-aligned |
| External standard references (e.g. IFRS 10) | 1 | Reference atoms only — not rule engine | Cited, not executable |
| **Total atoms** | **12** | **≥ 24 documented** | Charter-defined completeness review |

**Not a target:** 719-line TypeScript registry files.

---

# 13. Required Gates

## 13.1 Required (all PAS-004A slices)

```bash
pnpm --filter @afenda/enterprise-knowledge typecheck
pnpm --filter @afenda/enterprise-knowledge test:run
pnpm check:knowledge-conformance
pnpm quality:boundaries
pnpm check:foundation-disposition
```

## 13.2 Required after B25

```bash
pnpm check:knowledge-json-authority
```

*(Registered in slice B25.)*

## 13.3 Required after B26–B28

```bash
pnpm check:knowledge-kernel-mapping
pnpm check:knowledge-consumer-proof
pnpm check:glossary-knowledge-sync
pnpm check:knowledge-typed-corpus
```

*(B26–B29 gates registered in respective slices.)*

## 13.4 Recommended

```bash
pnpm check:documentation-drift
pnpm architecture:drift
```

## 13.5 Promotion rules

- Recommended gates become **required** for slices that touch the affected surface
- Missing future gates must not block unrelated doc-only work
- **Enterprise Accepted** promotion requires registry owner + §11 scorecard evidence

---

# 14. Reusable Guardrails

Every PAS-004A slice must:

1. Copy 9-field handoff from [pas-slice-template](../../.cursor/skills/kernel-authority/reference/pas-slice-template.md)
2. Attach `/coding-consistency-bundle` + `enterprise-knowledge` + **`kernel-authority`** when mapping touches kernel
3. Post §11 Completion Report with drift table
4. Never edit `foundation-disposition.registry.ts` — delegate `foundation-registry-owner`

---

# 15. Final Doctrine

PAS-004 defines **why** knowledge becomes authoritative. PAS-004A defines **how** the platform scales without vibe coding: JSON truth, kernel references only, consumer proof, honest counts, and gates before maturity claims.

> The charter owns the principles.
> The platform owns the accepted atoms.
> The kernel owns the wire words.
> The consumers own rendering — not meaning.

When in doubt:

> **May belong in enterprise-knowledge:** accepted meaning, JSON corpus, relationships, conformance.
> **Belongs outside:** parsers, persistence, UI, posting, registry rows, tenant wiki runtime.

---

# 16. Related Standards

| Standard | Relationship |
| --- | --- |
| [PAS-004](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) | Parent charter + MVP platform — **§1–§4 immutable** |
| [PAS-001](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) | Wire contracts — **reference only** via `implementationMapping` |
| [PAS-002](PAS-002-ARCHITECTURE-AUTHORITY.md) | Package registry — lists PKG-024 |
| [PAS-003](PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) | Accounting metadata — orthogonal |
| B24 slice | MVP delivered 2026-06-28 |
| B25 slice | First PAS-004A implementation |
| [PAS-004B](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) | Enterprise Accepted rollout — B33+ kernel identity + multi-consumer proof |
| [PAS-004C](PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) | Semantic model — closed B38–B48 |
| [PAS-004D](PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md) | Operational closure — B49+ proposed |

---

# 17. Slice Catalog (PAS-004A)

| Slice | PAS § | Purpose | Status | Prerequisite |
| --- | --- | --- | --- | --- |
| b25-10-json-data-authority | §4.1–§4.9 · §10 | JSON authority + typed evidence/reasoning/edge/authority contracts + gate | **Delivered · 2026-06-28** | B24 delivered |
| b26-kernel-mapping-gate | §4.2 | `implementationMapping` path validation + authority registry lint | **Delivered · 2026-06-28** | B25 |
| b27-consumer-proof | §4.4 | metadata/erp import proof | **Delivered · 2026-06-28** | B25 |
| b28-glossary-sync-gate | §4.4 | glossary ↔ registry drift gate | **Delivered · 2026-06-28** | B25 |
| b29-coverage-expansion | §12 | Typed corpus + 16 atoms + quality helper | **Delivered · 2026-06-28** | B28 |
| b30-enterprise-accepted-attestation | §11 | 9.5 scorecard + disposition evidence | **Delivered · 2026-06-28** | B29 |
| b31-ontology-completion | §12 | 24-atom Production Candidate corpus | **Delivered · 2026-06-28** | B30 |
| b32-erp-consumer-integration | §4.4 | ERP system-admin titles + glossary manifest parity | **Delivered · 2026-06-28** | B31 |

Handoff files for B27–B32 are authored when the prior slice closes.
