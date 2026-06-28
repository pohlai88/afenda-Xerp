# PAS-004B — Enterprise Knowledge Kernel & Consumer Standard (Enterprise Accepted Rollout)

> **Derivation:** PAS-004B continues **Enterprise Accepted** promotion after [PAS-004A Production Candidate closure](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) (B24–B32, scorecard 30/30). It does **not** amend PAS-004 chapters 1–§4 (technology-free charter).
>
> **Scope lock (do not expand):** exactly five deliverables — (1) kernel identity mapping, (2) metadata consumer proof, (3) docs consumer proof, (4) acceptance graph query helpers, (5) Enterprise Accepted attestation. Not a graph platform, ontology engine, or UI ownership package.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-004B |
| **Parent PAS** | PAS-004 · PAS-004A |
| **Document class** | `derived_consumer_kernel_standard` |
| **Document role** | `enterprise_accepted_rollout` |
| **Canonical filename** | `PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md` |
| **Package** | `@afenda/enterprise-knowledge` |
| **Layer** | Platform |
| **Package role** | Enterprise Accepted evidence — kernel identity mapping, metadata/docs consumer proof, acceptance-graph queries, formal maturity attestation |
| **Runtime stance** | `contracts-only` |
| **Registry lane** | `PKGR04_ENTERPRISE_KNOWLEDGE` · `PKG-024` |
| **Package owner** | Enterprise Knowledge Authority |
| **Parent standards** | PAS-004 (charter) · PAS-004A (Production Candidate platform) |
| **Agent skills** | `enterprise-knowledge` · **`kernel-authority`** (mandatory for `implementationMapping` / identity paths) |
| **Maturity** | Enterprise Accepted (`enterprise_accepted`) — **40/40 scorecard** |
| **Authority status** | `approved_for_implementation` |
| **Implementation status** | `delivered` — B33–B37 complete; PKGR04 authority PAS-004B |
| **Evidence level** | `pas_document` + B33–B36 governance gates + registry promotion |
| **Runtime status** | B33–B37 closed — scorecard 40/40; PKGR04 authority PAS-004B |
| **Remaining slices** | none |
| **Consumers** | `@afenda/ui-composition`, `@afenda/metadata-ui`, `apps/erp`, `apps/docs`, `docs/architecture/glossary.md` |
| **Change model** | `serialized-slices` (B33+) |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **ADR prerequisites** | ADR-0021 (Accepted) · ADR-0022 · ADR-0023 (identity constitution — read-only for mapping validation) |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/enterprise-knowledge typecheck` |
| 2 | `pnpm --filter @afenda/enterprise-knowledge test:run` |
| 3 | `pnpm check:knowledge-conformance` |
| 4 | `pnpm check:knowledge-json-authority` |
| 5 | `pnpm check:knowledge-kernel-mapping` |
| 6 | `pnpm check:knowledge-consumer-proof` |
| 7 | `pnpm check:glossary-knowledge-sync` |
| 8 | `pnpm check:knowledge-typed-corpus` |
| 9 | `pnpm quality:boundaries` |
| 10 | `pnpm check:foundation-disposition` |
| 11 | `pnpm check:documentation-drift` |

#### Required gates (PAS-004B — wired on slice close)

| # | Gate command | First slice |
| --- | --- | --- |
| 12 | `pnpm check:knowledge-kernel-identity-mapping` | B33 |
| 13 | `pnpm check:knowledge-metadata-consumer-proof` | B34 |
| 14 | `pnpm check:knowledge-docs-consumer-proof` | B35 |
| 15 | `pnpm check:knowledge-acceptance-graph` | B36 |

> **Maturity is part of authority.**
> PAS-004A Production Candidate evidence (24 atoms, ERP consumer, 30/30 scorecard) is **closed**. Do not claim **Enterprise Accepted** until B37 attestation closes and `foundation-registry-owner` promotes `PKGR04` authority to PAS-004B.

> **Kernel wire boundary (mandatory read):** [PAS-001](PAS-001-KERNEL-AUTHORITY-STANDARD.md) · [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) · `.cursor/skills/kernel-authority/SKILL.md`
> **Charter (unchanged):** [PAS-004 §1–§4](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)
> **Platform baseline (closed):** [PAS-004A](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md)
> **Canonical location:** `docs/PAS/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md`

---

# 0. Agent Quick Path

> Read **PAS-004 §0** (charter), **PAS-004A §0** (platform baseline), then this §0. Session: `/afenda-coding-session` · Bundle: `/coding-consistency-bundle` · Skills: **`enterprise-knowledge` + `kernel-authority`** on every B33–B37 slice.

**Boundary (unchanged):** `@afenda/enterprise-knowledge` **owns authoritative acceptance of enterprise meaning**; it **never** owns kernel wire parsers, business master data runtime, UI rendering, accounting rule engines, database migrations, package lifecycle registries, or tenant-specific knowledge stores.

**PAS-004B adds (post–Production Candidate):**

| Topic | PAS-004A (closed) | PAS-004B target |
| --- | --- | --- |
| Kernel link | Contract path lint (B26) | **Identity constitution bridge** — ADR-0021 branded IDs, `packages/kernel/src/identity/**` contract paths, platform entity registry cross-refs |
| Consumers | ERP import proof (B27, B32) | **Metadata + docs** import proof without local vocabulary forks |
| Query surface | `getKnowledgeAtom`, lifecycle helpers | **Acceptance graph traversal** — domain/edge/authority queries (pure, no graph DB) |
| Maturity claim | Production Candidate (30/30 scorecard) | **Enterprise Accepted** via B37 attestation + registry promotion |
| Glossary | Full 24-atom manifest parity (B28, B32) | **Docs MDX** representation sync for identity vocabulary blocks |

**Hard stops:**

- **Prohibited:** duplicate kernel `*.parser.ts` / `*.assert.ts` / branded parsers in enterprise-knowledge
- **Prohibited:** enterprise-knowledge → metadata / erp / kernel runtime imports (consumers import atoms; package never imports consumers)
- **Prohibited:** graph DB, graph engine, ontology engine, integrity scoring, tenant wiki runtime
- **Prohibited:** batching B34–B37 with B33 — if B33 mapping is wrong, B34/B35 inherit wrong meaning
- **Prohibited:** claim Enterprise Accepted before B37; PAS-004A 30/30 is **Production Candidate only**
- **Required:** read `kernel-authority` Phase 0 before any `implementationMapping`, identity path, or kernel cross-ref change

**Execution rule:** one slice at a time, in order. **PAS-004B B33–B36 delivered.** B37 attestation closed; **delegate `foundation-registry-owner`** for PKGR04 promotion (scorecard row #20).

**Planner / registry:** `pas-slice-planner` · disposition changes → `foundation-registry-owner` only

---

# 1. Derivation and Scope

## 1.1 What PAS-004A delivered (B24–B32 — closed)

- JSON data authority (`atoms.json`, `edges.json`) with typed evidence, reasoning, accepting-authority registry
- Kernel mapping gate (B26) — contract paths under `packages/kernel/src/`, no parser citations
- ERP consumer proof — `enterprise-knowledge-vocabulary.server.ts`, system-admin section titles
- Glossary full manifest parity (24 atoms)
- Production Candidate scorecard **30/30** (B30 attestation)

## 1.2 What PAS-004B owns (exactly five — no expansion)

| # | Deliverable | Slice |
| ---: | --- | --- |
| 1 | Kernel identity mapping gate | B33 |
| 2 | Metadata consumer proof | B34 |
| 3 | Docs consumer proof (includes docs atom-ID drift gate) | B35 |
| 4 | Acceptance graph query helpers — **four exports only** | B36 |
| 5 | Enterprise Accepted attestation + registry promotion | B37 |

> **Accepted meaning + kernel references + consumer proof + simple query helpers.** Nothing else.

## 1.3 What PAS-004B does not do

- Rewrite PAS-004 chapters 1–§4 or PAS-004A platform rules
- Move atoms to kernel or architecture-authority
- Become a graph platform, ontology engine, or UI/metadata ownership layer
- Add kernel parsers, asserts, resolvers, graph DB, scoring engines, or tenant wiki stores
- Expand atom corpus beyond honest PAS-004A baseline unless a future PAS says so

---

# 2. One-Sentence Boundary

**`@afenda/enterprise-knowledge` owns Enterprise Accepted evidence for accepted enterprise meaning — JSON-governed atoms, kernel **identity constitution references only**, multi-consumer import proof, and acceptance-graph query policy — and never owns kernel wire parsers, persistence, UI rendering, accounting posting, or package registry rows.**

---

# 3. Dependency Rules

## 3.1 Allowed

| Dependency | Rule |
| --- | --- |
| Zero runtime npm dependencies | Maintained from PAS-004A |
| `@afenda/kernel` types | **Type-only** imports for branded ID names in mapping validation tests — no kernel runtime, no parsers |
| Root governance scripts | May read JSON + consumer packages without import cycles |

## 3.2 Prohibited imports

Same as PAS-004 / PAS-004A: `@afenda/architecture-authority`, `@afenda/database`, `@afenda/ui-composition`, `@afenda/metadata-ui`, `@afenda/ui`, `@afenda/appshell`, `apps/erp`, auth SDKs, React, Next.js, Drizzle, HTTP clients.

## 3.3 Consumer import rule

Consumers **may** import `@afenda/enterprise-knowledge` for vocabulary resolution. Enterprise-knowledge **must not** import consumers. Prefer:

- ERP: direct import (proven B27/B32)
- Metadata: governance gate proving static import or approved indirection (B34 — no runtime cycle)
- Docs: server/build-time import for MDX vocabulary helpers (B35)

**Kernel rule (unchanged):** kernel **never** imports enterprise-knowledge. Atoms **reference** kernel; kernel does not reference atoms.

---

# 4. Authority Surfaces (Enterprise Accepted Target)

## 4.1 Kernel identity constitution bridge

**Authority:** [PAS-001 §4.1](PAS-001-KERNEL-AUTHORITY-STANDARD.md) · [kernel-authority SKILL](../../.cursor/skills/kernel-authority/SKILL.md) · [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md)

**Problem:** B26 validates generic kernel contract paths. Platform identity atoms (tenant, legal entity, organization unit, workspace) must cite **identity constitution** surfaces — not ad-hoc legacy paths.

**Target rules:**

| Rule | Enforcement |
| --- | --- |
| Platform identity atoms cite paths under `packages/kernel/src/identity/` or documented platform-id registry entries | B33 gate |
| `implementationMapping.contractPath` resolves to `*.contract.ts` only — never `*.parser.ts` or `*.assert.ts` | B26 + B33 |
| Branded ID **names** in mapping notes match ADR-0021 vocabulary (`TenantId`, `LegalEntityId`, …) | B33 conformance test |
| Atoms do not encode ID parse rules, prefix tables, or persistence split logic | `pas-prohibited-surface-scan` on touch |

**Wire context triad (reference only):** When an atom documents kernel context, cite the **contract** module and name the branded types — never duplicate assert/parser behavior.

## 4.2 Multi-consumer proof

**Authority:** PAS-004 §9.2 · PAS-004A §4.4

**Current:** ERP consumer proven (`apps/erp/src/lib/knowledge/`).

**Target:**

| Consumer | Proof | Slice |
| --- | --- | --- |
| `apps/erp` | Existing — extend only via new slices | B32 (closed) |
| `@afenda/ui-composition` | Static gate: metadata resolves ≥3 platform identity labels from atoms | B34 |
| `apps/docs` | Docs vocabulary helper + MDX identity blocks cite atom IDs | B35 |

**Rule:** Operational copy stays in consumer contracts; **accepted meaning** (titles, canonical definitions) comes from atoms.

## 4.3 Acceptance graph query helpers (B36 — fixed surface)

**Authority:** PAS-004 §3.1 · PAS-004A §4.9

**Not a graph engine.** B36 adds exactly **four** pure functions over loaded JSON registries — no new modules beyond one query file + tests:

```typescript
getKnowledgeAtomsByDomain(domain: KnowledgeDomain): readonly KnowledgeAtom[];
getKnowledgeEdgesFrom(atomId: string, type?: KnowledgeEdgeType): readonly KnowledgeEdge[];
getSupersessionChain(atomId: string): readonly KnowledgeAtom[];
resolveAcceptanceGraphRoots(): readonly KnowledgeAtom[];
```

No graph DB. No MCP server. No traversal runtime. No fifth export without a new PAS slice.

## 4.4 Enterprise Accepted scorecard (B37)

**Authority:** PAS-004A §11 pattern · enterprise-erp-standards §9

Extends Production Candidate scorecard with Enterprise Accepted rows:

| # | Criterion | Points |
| ---: | --- | ---: |
| 16 | Kernel identity mapping gate (B33) | 2 |
| 17 | Metadata consumer proof (B34) | 2 |
| 18 | Docs consumer proof (B35) | 2 |
| 19 | Acceptance graph query surface (B36) | 2 |
| 20 | PKGR04 authority promoted to PAS-004B | 2 |
| | **PAS-004B extension total** | **10** |
| | **Combined target (004A + 004B)** | **40** · threshold **≥ 38 / 40** |

---

# 5. What This Package Must Never Own

Everything in PAS-004 §11 and PAS-004A §5, plus:

- **Kernel identity parsers, prefix registries, or wire asserts** (PAS-001 / ADR-0021)
- **Metadata section/action rendering** (`@afenda/ui-composition`)
- **Docs editorial CSS or MDX layout** (`apps/docs`)
- **Enterprise Accepted maturity claims** without B37 scorecard ≥ 38/40
- **Graph engines, ontology engines, or “knowledge platform v2”** scope creep

---

# 6. Package Structure Standard

## 6.1 Current (PAS-004A — honest)

See PAS-004A §6.2. B24–B32 structure is live baseline.

## 6.2 Target additions (PAS-004B)

```text
packages/enterprise-knowledge/
└── src/
    ├── policy/
    │   └── knowledge-kernel-identity-mapping.policy.ts   # B33
    ├── query/
    │   └── knowledge-graph.query.ts                      # B36 — four helpers only
    └── __tests__/
        ├── knowledge-kernel-identity-mapping.test.ts     # B33
        └── knowledge-graph.query.test.ts                 # B36

scripts/governance/
├── check-knowledge-kernel-identity-mapping.mts           # B33
├── check-knowledge-metadata-consumer-proof.mts           # B34
├── check-knowledge-docs-consumer-proof.mts               # B35
└── check-knowledge-acceptance-graph.mts                  # B36
```

---

# 7. Decision Matrix

| Question | If yes → | In enterprise-knowledge? |
| --- | --- | --- |
| Is this accepted meaning for a term/invariant? | Knowledge Atom in JSON | **Yes** |
| Is this a kernel identity parser or prefix rule? | PAS-001 kernel | **No** |
| Is this a kernel branded ID **name** for mapping notes? | Reference in atom | **Yes** (text only) |
| Is this metadata label rendering? | metadata / metadata-ui | **No** (import atoms) |
| Is this docs MDX layout/CSS? | apps/docs | **No** (import atom meaning) |
| Is this one of the four B36 query helpers over loaded JSON? | query module | **Yes** (B36 only) |
| Is this a graph DB, engine, or MCP traversal service? | Out of scope | **No** |
| Is this integrity score 0–100 computation? | Deferred | **No** |
| Is this tenant-editable wiki content? | Future product | **No** |

---

# 8. Contract Rules

All PAS-004 / PAS-004A contract rules apply, plus:

1. **Kernel-authority Phase 0** — mandatory before B33–B37 implementation touching mapping or identity paths
2. **Identity path prefix** — new or updated platform identity `implementationMapping` entries must use `packages/kernel/src/identity/` or platform-id registry documented paths (B33)
3. **Consumer proof gates** — each consumer package listed in §4.2 must have a root governance script before B37
4. **Query purity** — B36 exports are exactly four pure functions; no side effects on import; no graph engine
5. **No new deprecated types** — use `KnowledgeEdge` / typed evidence / structured reasoning only
6. **Supersession honesty** — query helpers must respect `effectiveFrom` / `effectiveUntil` / `supersededBy` when present

---

# 9. Runtime Rules

Same as PAS-004A: **contracts-only**. No runtime npm dependencies. Query helpers read immutable loaded registries only.

---

# 10. Implementation Sequence (B33–B37)

**Serialized execution only.** Implement **one slice per session**. Do not start B34–B37 until the prior slice closes and its handoff is updated. B33 wrong → B34/B35 inherit wrong meaning.

Execute in order. Do not skip consumer proof before B37 attestation.

| Order | Slice | Delivers | Status |
| ---: | --- | --- | --- |
| 1 | [B33 Kernel identity mapping gate](slice/b33-kernel-identity-mapping-gate.md) | `knowledge-kernel-identity-mapping.policy.ts` + `check:knowledge-kernel-identity-mapping` | **Delivered** |
| 2 | [B34 Metadata consumer proof](slice/b34-metadata-consumer-proof.md) | metadata vocabulary gate (≥3 identity labels) | **Delivered** |
| 3 | [B35 Docs consumer proof](slice/b35-docs-consumer-proof.md) | docs vocabulary helper + `check:knowledge-docs-consumer-proof` | **Delivered** |
| 4 | [B36 Acceptance graph queries](slice/b36-acceptance-graph-queries.md) | `knowledge-graph.query.ts` + gate | **Delivered** |
| 5 | [B37 Enterprise Accepted attestation](slice/b37-enterprise-accepted-attestation.md) | Combined scorecard ≥38/40; PKGR04 → PAS-004B | **Attested** (registry delegated) |

**Do not add in this package (correct home):**

- ID parse/prefix implementation → `packages/kernel/src/identity/`
- Metadata section registry rows → `@afenda/ui-composition`
- Docs editorial tokens → `apps/docs` CSS layers (PAS-005)

---

# 11. Enterprise Acceptance Criteria (Combined Scorecard)

**Enterprise Accepted** requires:

1. All PAS-004A §13 gates passing (baseline)
2. All PAS-004B §13 gates passing (B33–B36)
3. Combined scorecard **≥ 38 / 40** (PAS-004A 30 + PAS-004B 10)
4. `foundation-registry-owner` promotes `PKGR04` authority field to `PAS-004B` with B33–B37 evidence paths

**Honesty rule:** PAS-004A 30/30 alone is **Production Candidate** — not Enterprise Accepted. Registry maturity, doc headers, and agent skills must not say Enterprise Accepted until B37 closes and `foundation-registry-owner` promotes `PKGR04`.

---

# 12. Coverage Targets (Honest)

| Domain | PAS-004A (closed) | PAS-004B target | Enterprise Accepted |
| --- | ---: | ---: | --- |
| Platform identity atoms with kernel identity mapping | partial (B26 generic) | **100%** of identity atoms cite ADR-0021 paths | Validated by B33 gate |
| Consumer packages with import proof | ERP only | **ERP + metadata + docs** | B34–B35 gates |
| Acceptance graph query helpers | none | **exactly 4** pure exports | B36 tests |
| Total atoms | 24 | 24 (no corpus expansion in PAS-004B) | Charter review — not North Star complete |

**Not a target:** duplicating `packages/kernel/src/identity/**` source into atoms.

---

# 13. Required Gates

## 13.1 Required (inherit from PAS-004A — always)

```bash
pnpm --filter @afenda/enterprise-knowledge typecheck
pnpm --filter @afenda/enterprise-knowledge test:run
pnpm check:knowledge-conformance
pnpm check:knowledge-json-authority
pnpm check:knowledge-kernel-mapping
pnpm check:knowledge-consumer-proof
pnpm check:glossary-knowledge-sync
pnpm check:knowledge-typed-corpus
pnpm quality:boundaries
pnpm check:foundation-disposition
```

## 13.2 Required after B33

```bash
pnpm check:knowledge-kernel-identity-mapping
```

## 13.3 Required after B34–B36

```bash
pnpm check:knowledge-metadata-consumer-proof   # B34
pnpm check:knowledge-docs-consumer-proof       # B35
pnpm check:knowledge-acceptance-graph          # B36
```

## 13.4 Recommended

```bash
pnpm check:documentation-drift
pnpm architecture:drift
```

## 13.5 Promotion rules

- B33–B36 gates become **required** for slices touching the affected surface
- B37 requires **all** §13.1–§13.3 gates green
- Missing future gates must not block PAS-004B doc-only maintenance

---

# 14. Reusable Guardrails

Every PAS-004B slice must:

1. Copy 9-field handoff from [pas-slice-template](../../.cursor/skills/kernel-authority/reference/pas-slice-template.md)
2. Attach `/coding-consistency-bundle` + `enterprise-knowledge` + **`kernel-authority`** when mapping touches kernel or identity
3. Post §11 Completion Report with drift table
4. Never edit `foundation-disposition.registry.ts` — delegate `foundation-registry-owner` (B37)

---

# 15. Final Doctrine

PAS-004 defines **why** knowledge becomes authoritative. PAS-004A defined **how** the platform stores and validates it at Production Candidate. PAS-004B closes Enterprise Accepted with **five bounded deliverables** — nothing more.

> The charter owns the principles.
> The platform owns the accepted atoms.
> The kernel owns the wire words and identity constitution.
> The consumers own rendering — not meaning.

When in doubt:

> **May belong in enterprise-knowledge:** accepted meaning, JSON corpus, four query helpers, conformance, kernel **references**.
> **Belongs outside:** parsers, graph engines, ontology engines, persistence, UI, posting, registry rows, tenant wiki runtime.

---

# 16. Related Standards

| Standard | Relationship |
| --- | --- |
| [PAS-004](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) | Parent charter — **§1–§4 immutable** |
| [PAS-004A](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) | Production Candidate platform — **closed B24–B32** |
| [PAS-004C](PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) | Semantic model — **closed B38–B48** |
| [PAS-004D](PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md) | Operational closure — **B49+ proposed** |
| [PAS-001](PAS-001-KERNEL-AUTHORITY-STANDARD.md) | Wire + identity constitution — **reference only** |
| [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) | Identity mapping validation authority (B33) |
| [PAS-002](PAS-002-ARCHITECTURE-AUTHORITY.md) | Package registry — lists PKG-024 |
| [B32 slice](slice/b32-erp-consumer-integration.md) | ERP consumer baseline |

---

# 17. Slice Catalog (PAS-004B)

| Slice | PAS § | Purpose | Status | Prerequisite |
| --- | --- | --- | --- | --- |
| [b33-kernel-identity-mapping-gate](slice/b33-kernel-identity-mapping-gate.md) | §4.1 | ADR-0021 identity path validation + gate | **Delivered** | 2026-06-28 |
| [b34-metadata-consumer-proof](slice/b34-metadata-consumer-proof.md) | §4.2 | Metadata vocabulary import proof | **Delivered** | 2026-06-28 |
| [b35-docs-consumer-proof](slice/b35-docs-consumer-proof.md) | §4.2 | Docs atom citation + gate | **Delivered** | 2026-06-28 |
| [b36-acceptance-graph-queries](slice/b36-acceptance-graph-queries.md) | §4.3 | Four query helpers + gate | **Delivered** | 2026-06-28 |
| [b37-enterprise-accepted-attestation](slice/b37-enterprise-accepted-attestation.md) | §4.4 | Scorecard ≥38/40 attestation | **Attested** | registry delegated |

**Superseded by:** [PAS-004C](PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) · [PAS-004D](PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md)
