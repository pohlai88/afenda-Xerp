---
name: enterprise-knowledge
description: Enforces @afenda/enterprise-knowledge — accepted enterprise meaning via Knowledge Atoms, acceptance chains, domains, and integrity. Use when touching packages/enterprise-knowledge, adding or querying Knowledge Atoms, resolving vocabulary conflicts, enforcing acceptance chains, or working on PAS-004 slices.
paths:
  - packages/enterprise-knowledge/**
  - docs/PAS/PAS-004*.md
---

# @afenda/enterprise-knowledge — Authority Skill (PAS-004 / PAS-004A–D)

## PAS rollout status (mirror header — sync on slice close)

| PAS | Runtime status | Remaining slices |
| --- | --- | --- |
| **PAS-004** (charter) | Constitutional §1–§4 — live runtime truth in PAS-004C/D | none — superseded by PAS-004A |
| **PAS-004A** (rollout) | B24–B32 delivered — 24 atoms, JSON authority, ERP consumer, glossary parity, scorecard 30/30 | none |
| **PAS-004B** (Enterprise Accepted) | B33–B37 closed — scorecard 40/40; PKGR04 authority PAS-004B | none |
| **PAS-004C** (semantic model) | B38–B48 delivered — scorecard **58/58**; PKGR04 authority PAS-004C | none — superseded by PAS-004D |
| **PAS-004D** (operational closure) | B49 in progress — mirror sync + legacy retirement + corpus depth (proposed B50–B54) | B49 → B54 |

> Canonical: [`PAS-004`](../../../docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) · [`PAS-004A`](../../../docs/PAS/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) · [`PAS-004B`](../../../docs/PAS/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) · [`PAS-004C`](../../../docs/PAS/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) · [`PAS-004D`](../../../docs/PAS/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md) · Closure: [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md)

---

## Boundary (one sentence)

`@afenda/enterprise-knowledge` **owns authoritative acceptance of enterprise meaning — Knowledge Atoms, domains, acceptance chains, relationships, integrity dimensions, and conformance policy; it never owns kernel wire contracts, business master data runtime, UI rendering, accounting-standard rules, database migrations, package lifecycle registries, or tenant-specific knowledge.**

**Constitutional sentence:** Enterprise knowledge exists when meaning is accepted, reasoning is understood, evidence is trusted, relationships are preserved, decisions are explainable, and evolution is traceable.

**First principle:** Knowledge **becomes authoritative through acceptance** — by an accepted authority, supported by evidence, within a defined domain.

---

## When to use this skill

Apply this skill when touching:

- `packages/enterprise-knowledge/**`
- any `@afenda/enterprise-knowledge` import
- Knowledge Atom registry, relationships, or acceptance chain questions
- enterprise vocabulary authority (tenant, legal entity, organization unit, workspace, surface)
- glossary vs registry authority conflicts
- PAS-004 slice work
- AI/copilot context that must cite accepted business meaning

**Kernel boundary:** Branded IDs and wire contracts live in `@afenda/kernel` ([PAS-001](../../../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md)). Atoms **reference** kernel shapes via `implementationMapping`; never duplicate parsers.

**Architecture authority boundary:** Package/layer/dependency listing → [PAS-002](../../../docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md) / `.cursor/skills/architecture-authority/SKILL.md`. Do **not** store Knowledge Atoms in architecture-authority.

| PAS-004A rollout | [PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md](../../../docs/PAS/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) · B25–B32 slices (closed) |
| PAS-004B rollout | [PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md](../../../docs/PAS/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) · B33–B37 closed · **kernel-authority mandatory** |
| PAS-004C rollout | [PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md](../../../docs/PAS/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) · B38–B48 closed · **kernel-authority on B44 realization paths** |
| PAS-004D rollout | [PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md](../../../docs/PAS/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md) · B49+ · **kernel-authority on B53 erp-domain bridge only** |

---

## Decision matrix

> Can this belong in enterprise-knowledge?

| Question | If yes → | In this package? |
| --- | --- | --- |
| Does this define accepted enterprise meaning for a term or invariant? | Add or update Knowledge Atom. | **Yes** |
| Does this record acceptance chain, domain, lifecycle, evidence? | Atom facets. | **Yes** |
| Does this link atoms with typed relationships? | Relationship registry edge. | **Yes** |
| Does this validate registry constitutional rules? | `knowledge.policy.ts` | **Yes** |
| Does this resolve glossary vs registry conflicts? | Registry wins; glossary is representation. | **Yes** (registry side) |
| Does this define kernel wire/parser behavior? | Belongs to Kernel. | **No** |
| Does this list packages or layer rules? | Belongs to architecture-authority. | **No** |
| Does this render UI labels or sections? | Belongs to metadata / metadata-ui. | **No** |
| Does this post journals or validate IFRS treatment? | Belongs to accounting / PAS-003. | **No** |
| Does this store tenant-editable wiki content? | Out of MVP scope. | **No** |
| Does this compute integrity scores (0–100)? | Deferred — presence only in MVP. | **No** |

---

## Hard stops

### Prohibited imports — never add runtime dependencies on:

```
@afenda/architecture-authority
@afenda/database
@afenda/metadata
@afenda/metadata-ui
@afenda/ui
@afenda/appshell
apps/erp
Auth/session packages
React
Next.js
```

### Enterprise knowledge must never own

```
Kernel wire contracts
Branded ID parsers
Database schema/migrations
Journal posting
Ledger mutation
UI components
Package registry rows
IFRS rule engines (PAS-003)
Tenant wiki stores
Graph DB runtime
Scoring algorithms (MVP)
MCP servers exposing graph traversal
```

### Documentation-only slices

When the task is **explicitly documentation or skill maintenance only**, add:

```
Do not modify packages/enterprise-knowledge/src/**
Do not add new atoms or change atom IDs
Do not change package exports
Do not mark atom lifecycle complete without acceptance evidence
```

For implementation slices, the Phase 0 contract governs scope — not this list.

---

## Phase 0 — enterprise-knowledge change contract

Before editing any enterprise-knowledge file, state these six lines:

```
1. Objective       — the exact change, in one sentence
2. Allowed layer   — packages/enterprise-knowledge only (or docs/PAS for charter slices)
3. Files to change — explicit list
4. Prohibited      — kernel wire behavior, architecture-authority atoms, database, UI, scoring
5. Authority       — Enterprise Knowledge Authority (PAS-004)
6. Gates           — pnpm --filter @afenda/enterprise-knowledge typecheck
                     pnpm --filter @afenda/enterprise-knowledge test:run
                     pnpm check:knowledge-conformance
                     pnpm quality:boundaries
```

If a slice handoff exists, paste the 9-field block from `docs/PAS/slice/<file>.md` into Phase 0 first.

---

## Required read order

For new enterprise-knowledge slices, read in this order:

1. This file (SKILL.md) — boundary, hard stops, Phase 0
2. [reference/authority-surfaces.md](reference/authority-surfaces.md) — TypeScript shapes + Status labels
3. [reference/package-structure.md](reference/package-structure.md) — folder tree + source truth order
4. [docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md](../../../docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) — §0 Agent Quick Path
5. Target slice under `docs/PAS/slice/` — 9-field handoff when implementing

**Maturity:** Enterprise Accepted (PAS-004B B33–B37, 40/40). Semantic model closed (PAS-004C B38–B48, **58/58**). Operational closure active (PAS-004D B49+). Read **`kernel-authority`** before B53 erp-domain bridge atoms.

**Slice gate:** PAS-004C closed. **Active slice: B49** — mirror sync before B50 legacy retirement. Next: [B49 authority mirror sync](../../../docs/PAS/slice/b49-pas004d-authority-mirror-sync.md).

---

## Authority surface summary

| Surface | Owns | Does not own |
| --- | --- | --- |
| Knowledge Atom registry | Accepted meaning, acceptance chains, domains | Kernel wire types, DB migrations, IFRS rules |
| Relationship registry | Typed atom-to-atom edges | Graph DB runtime, MCP servers, graph traversal |
| Conformance policy | `validateKnowledgeAtom`, `validateKnowledgeRegistry` | UI rendering, scoring algorithms |
| Integrity constants | `COMPLETE_INTEGRITY_PROFILE` | Numeric scoring engine |
| Public exports | JSON-serializable boundary API | Internal cross-package re-export barrels |

Full TypeScript shapes → [reference/authority-surfaces.md](reference/authority-surfaces.md)

---

## Atom authoring rules — contract checklist

Before any new atom is merged into the registry:

- [ ] `atomId` is stable snake_case — no rename after `ratified`
- [ ] `fqn` follows `afenda.enterprise.<domain>.<id>` (or documented exception)
- [ ] `acceptanceChain` has ≥ 2 entries when `lifecycle` is `accepted` or later
- [ ] `knowledgeDecision.alternativesConsidered` is non-empty
- [ ] `evidence` paths point to real on-disk artifacts (repo-relative when under `packages/` or `docs/`)
- [ ] `implementationMapping.persistenceClass` is honest (`derived` ≠ `persisted`)
- [ ] `ownedByPas: "PAS-004"` — always
- [ ] `lifecycle` is not `ratified` until an `architecture_authority` (or higher) step exists in `acceptanceChain`
- [ ] `COMPLETE_INTEGRITY_PROFILE` used only when all ten dimensions are genuinely present
- [ ] Consumers import from `@afenda/enterprise-knowledge` — never redefine atoms locally
- [ ] All atom fields are `readonly`; registry uses `satisfies readonly KnowledgeAtom[]`
- [ ] Public contracts remain JSON-serializable at boundaries

---

## Atom lifecycle rules

| Status | Meaning | Promotion requirement |
| --- | --- | --- |
| `observed` | Meaning noticed; not yet proposed for acceptance | — |
| `proposed` | Candidate meaning with draft reasoning | Acceptance chain started |
| `accepted` | Accepting authority records meaning + reasoning | ≥ 2 chain steps; non-empty decision + evidence |
| `ratified` | Constitutional/architecture authority confirms binding | `architecture_authority` (or higher) in chain |
| `implemented` | Runtime or doc evidence exists | Honest `implementationMapping.runtimeStatus` |
| `superseded` | Replaced; lineage preserved | Superseding atom + relationship edge |
| `historical` | Read-only reference | Must not drive new work |

Policy helpers: `isAcceptedOrLaterLifecycle`, `isRatifiedOrLaterLifecycle` — use in tests and gates; do not bypass with string comparisons.

**Three orthogonal axes (never collapse):**

| Axis | Field | Never substitute with |
| --- | --- | --- |
| Authority kind | `authorityType` | `binding` or `confidence.score` |
| Consumer obligation | `binding` | `authorityType` |
| Certainty | `confidence.score` + `confidence.basis` | lifecycle alone |

---

## Quick decision test

Before adding any function, type, or atom facet, pass all three:

```
1. Does this accept, not just record meaning?        → Only acceptance through authority is knowledge
2. Does this cross into kernel wire/parser territory? → Belongs in kernel
3. Does this store runtime behavior (DB, UI, HTTP)?   → Out of scope
```

If any answer fails the enterprise-knowledge test → the change does not belong here.

---

## Surface anti-patterns (what the gate misses)

| Anti-pattern | Example | Violation | Correct home |
| --- | --- | --- | --- |
| Local atom copy | redefine `legalEntity` meaning in apps/erp | Violates registry authority | Import from `@afenda/enterprise-knowledge` |
| Overstated lifecycle | `lifecycle: "ratified"` without architecture chain step | Honesty gate | Demote to `accepted` until ratified |
| Atom in wrong package | atom in `packages/architecture-authority/src/data` | PKGR04 prohibited | `packages/enterprise-knowledge/src/data` |
| Glossary as authority | agents read glossary as canonical | Glossary is representation | Read registry; glossary is synced view |
| Scoring in MVP | integrity score computed 0–100 | Deferred by charter | Presence only; scoring is future platform |
| Kernel meaning duplication | duplicate `LegalEntityContext` semantics in atom | PAS-001 boundary | Reference via `implementationMapping` only |
| Metadata owns meaning | section labels define business terms | Metadata renders; does not accept | Atom in registry; metadata imports |

### Gate coverage reminder

| Violation | `pnpm check:knowledge-conformance` catches? |
| --- | --- |
| Duplicate `atomId` | Yes |
| Empty acceptance chain | Yes |
| Accepted+ lifecycle with 1-step chain | Yes |
| Empty evidence | Yes |
| Incomplete integrity profile | Yes |
| Cross-package atom copy | No — review manually |
| Overstated `ratified` without authority chain | Partial — chain length only |
| Atom in wrong package | No — audit periodically |

---

## Required gates

```bash
pnpm --filter @afenda/enterprise-knowledge typecheck
pnpm --filter @afenda/enterprise-knowledge test:run
pnpm check:knowledge-conformance
pnpm quality:boundaries
```

Recommended when touching foundation disposition:

```bash
pnpm check:foundation-disposition
```

Registry lane: `PKGR04_ENTERPRISE_KNOWLEDGE` · Package id: `PKG-024`

---

## Acceptance criteria

### Current (must pass today)

| Category | Check | Required |
| --- | --- | --- |
| Architecture | Zero runtime package dependencies | Pass |
| Architecture | Atoms not in kernel or architecture-authority | Pass |
| Registry | Twelve MVP seed atoms + relationship edges | Pass |
| Registry | `validateKnowledgeRegistry()` returns empty | Pass |
| Honesty | Workspace/surface marked `derived` persistence | Pass |
| Governance | `check:knowledge-conformance` registered | Pass |
| Type safety | Atoms use `satisfies`; public API serializable | Pass |

### Target (slice-gated — not enforced until implemented)

| Category | Check | Slice |
| --- | --- | --- |
| Consumer proof | metadata/erp imports atoms for labels | Post-B24 |
| Representation sync | glossary body synced to registry | Post-B24 |
| Integrity scoring | numeric 0–100 engine | Out of MVP |
| Tenant knowledge | editable per-tenant atoms | Out of MVP |
| Graph platform | relationship traversal service | Out of MVP |

---

## Doctrine

The enterprise-knowledge package is not a wiki or glossary.
It is the smallest possible constitutional registry that lets Afenda ERP agents agree on what a term means, why that meaning was accepted, and what evidence backs it.

> If it describes **accepted enterprise meaning** with an acceptance chain, it may belong here.
> If it describes **wire shape, package topology, UI rendering, or runtime behavior**, it belongs elsewhere.

The registry owns the accepted meaning.
The accepting authority owns the decision.
The representation layer (glossary, metadata, AI context) owns the rendering.

Knowledge becomes authoritative through acceptance — not through being written down.

---

## Reference

- [Authority surfaces](reference/authority-surfaces.md)
- [Package structure](reference/package-structure.md)
- [PAS-004 canonical doc](../../../docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)
- [Slice B24 handoff](../../../docs/PAS/slice/b24-knowledge-charter-mvp.md)
