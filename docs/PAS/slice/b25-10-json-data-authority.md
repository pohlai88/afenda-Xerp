# Slice B25 — JSON Data Authority + Acceptance Graph Contracts (PAS-004A §4.1–§4.9 · §10)

**Prerequisite:** [B24 Knowledge Charter MVP](b24-knowledge-charter-mvp.md) delivered · [PAS-004A](../PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) published · PAS-004 §3 amended (Acceptance Graph — done)

**Status:** Delivered · 2026-06-28

**Type:** Implementation

**Risk class:** Medium-High — migrates authoritative corpus from TS literals to JSON and introduces five new contract surfaces

**Clean Core impact:** A→A — contracts-only; existing public exports preserved; new exports additive

## Purpose

Deliver PAS-004A first rollout item in two coordinated parts:

1. **JSON data authority** — `atoms.json` + `edges.json` with thin TS loaders; removes the ~719-line hand-authored TS corpus anti-pattern while preserving B24 atom IDs.
2. **Acceptance Graph contracts** — five new typed surfaces demanded by PAS-004 §3 amendment and PAS-004A §4.5–§4.9: `AcceptingAuthorityEntity`, `KnowledgeEvidence`, `KnowledgeReasoning`, effective time on atoms, richer `KnowledgeEdge` types, and rename `Relationship → Edge`.

B25 does **not** migrate existing atom data to the new typed shapes (that is B29 coverage expansion); it delivers the contract shell, JSON loaders, and gates.

## Handoff block

```
Handoff from: docs/PAS/slice/b25-10-json-data-authority.md

1. Objective    — (Part 1) Migrate atom/edge corpus to atoms.json + edges.json with thin TS loaders + schema validation;
                  (Part 2) Introduce AcceptingAuthorityEntity, KnowledgeEvidence, KnowledgeReasoning, effectiveFrom/Until,
                  richer KnowledgeEdge types, rename KnowledgeRelationship → KnowledgeEdge;
                  preserve all 12 B24 atom IDs and existing public exports.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-json-authority.mts
                  · package.json (script only) · docs/PAS/slice/b25-10-json-data-authority.md (status)
3. Files        —
   packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.ts          (add effectiveFrom/Until/version/supersededBy)
   packages/enterprise-knowledge/src/contracts/knowledge-edge.contract.ts          (NEW — KnowledgeEdge + richer types)
   packages/enterprise-knowledge/src/contracts/knowledge-evidence.contract.ts      (NEW — KnowledgeEvidence typed)
   packages/enterprise-knowledge/src/contracts/knowledge-reasoning.contract.ts     (NEW — KnowledgeReasoning structured)
   packages/enterprise-knowledge/src/contracts/accepting-authority.contract.ts     (NEW — AcceptingAuthorityEntity)
   packages/enterprise-knowledge/src/data/atoms.json                               (NEW — authoritative corpus)
   packages/enterprise-knowledge/src/data/edges.json                               (NEW — edges corpus, replaces relationships.json)
   packages/enterprise-knowledge/src/data/accepting-authority.registry.ts          (NEW — typed loader)
   packages/enterprise-knowledge/src/data/knowledge-data.schema.ts                 (pure-TS validation for JSON)
   packages/enterprise-knowledge/src/data/knowledge-data.loader.ts                 (NEW — parseAtomCorpus / parseEdgeCorpus trust boundary)
   packages/enterprise-knowledge/src/data/knowledge.registry.ts                    (thin loader, ≤120 lines)
   packages/enterprise-knowledge/src/data/knowledge-relationships.registry.ts      (deprecation notice → edges.json)
   packages/enterprise-knowledge/src/index.ts                                      (re-export new contracts)
   packages/enterprise-knowledge/src/__tests__/knowledge-json-authority.test.ts    (NEW)
   packages/enterprise-knowledge/src/__tests__/accepting-authority.test.ts         (NEW)
   packages/enterprise-knowledge/src/__tests__/knowledge.registry.test.ts          (update for new loaders)
   scripts/governance/check-knowledge-json-authority.mts                           (NEW gate script)
   package.json
   docs/PAS/slice/b25-10-json-data-authority.md
4. Prohibited   — kernel parsers; architecture-authority atoms; metadata/erp consumer work (B27);
                  changing PAS-004 §1–§2; renaming B24 atom IDs; adding runtime npm deps;
                  migrating existing atom data to typed evidence/reasoning shapes (B29)
5. Authority    — PAS-004A §4.1–§4.9 · PAS-004 §3 (amended) · kernel-authority (implementationMapping paths unchanged)
                  · enterprise-knowledge skill · coding-consistency-bundle preflight
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-json-authority
   pnpm quality:boundaries
   pnpm check:foundation-disposition
7. Closes       — PAS-004A §6.2 JSON authority; §4.5 AcceptingAuthority; §4.6 typed Evidence;
                  §4.7 structured Reasoning; §4.8 effective time; §4.9 Edge rename/types;
                  scorecard rows #1, #5 (contract surfaces present); transitional TS corpus removed
8. Evidence     —
   packages/enterprise-knowledge/src/data/atoms.json
   packages/enterprise-knowledge/src/data/edges.json
   packages/enterprise-knowledge/src/contracts/knowledge-edge.contract.ts
   packages/enterprise-knowledge/src/contracts/knowledge-evidence.contract.ts
   packages/enterprise-knowledge/src/contracts/knowledge-reasoning.contract.ts
   packages/enterprise-knowledge/src/contracts/accepting-authority.contract.ts
   scripts/governance/check-knowledge-json-authority.mts
   packages/enterprise-knowledge/src/__tests__/knowledge-json-authority.test.ts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. All twelve B24 atom IDs preserved byte-for-byte unless supersession slice explicitly authorizes rename.
2. `knowledge.registry.ts` after delivery must not contain inline atom objects — JSON only (≤120 lines).
3. `implementationMapping` kernel paths unchanged in B25 (B26 validates paths).
4. Public export surface from `src/index.ts` unchanged for consumers; new contracts are **additive**.
5. Read `kernel-authority` before touching any `implementationMapping` entry.
6. `KnowledgeRelationship` type alias may be retained for backwards compatibility until B26 cleans consumers; new code uses `KnowledgeEdge`.
7. Do **not** migrate existing atom `evidence: string[]` or `reasoning: string` to new typed shapes — that is B29 coverage work. Contracts are shell only.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Atoms load from `atoms.json` with `satisfies readonly KnowledgeAtom[]` | unit test |
| 2 | Edges load from `edges.json`; `KnowledgeEdge` type exported from index | unit test |
| 3 | Loader TS ≤ 120 lines per file (corpus excluded) | `check:knowledge-json-authority` |
| 4 | `AcceptingAuthorityEntity` contract exported and loader passes type check | typecheck |
| 5 | `KnowledgeEvidence`, `KnowledgeReasoning` contracts exported | typecheck |
| 6 | `effectiveFrom`/`effectiveUntil` added to `KnowledgeAtom` (optional) | typecheck |
| 7 | B24 conformance rules still pass | `pnpm check:knowledge-conformance` |
| 8 | No new runtime dependencies | `pnpm quality:boundaries` |
| 9 | Slice status → Delivered with date | doc update |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| JSON data authority | Yes — Slice B25 | `packages/enterprise-knowledge/src/data/atoms.json` |
| Acceptance Graph contracts | Yes — Slice B25 | `src/contracts/knowledge-edge.contract.ts` etc. |
| Kernel mapping lint | No — Slice B26 | deferred |
| Consumer import proof | No — Slice B27 | deferred |
