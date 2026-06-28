# Slice B42 — Semantic Edges (PAS-004C §4.7 · Phase 3)

**Prerequisite:** [B44 Realization Mapping](b44-pas004c-realization-mapping.md) delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low — additive edge types after consumer/realization need known

**Clean Core impact:** A→A — additive KNOWLEDGE_EDGE_TYPES

## Purpose

Expand semantic edge vocabulary: specializes, generalizes, equivalent, implements, realizes, constrains, depends_on, references. Runs **after** B43/B44 by design.

## Handoff block

```
Handoff from: docs/PAS/slice/b42-pas004c-semantic-edges.md

1. Objective    — Add 8 semantic edge types to knowledge-edge.contract.ts; migrate ≥2 edges in edges.json; gate check:knowledge-semantic-edges.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-semantic-edges.mts · package.json · docs/PAS/**
3. Files        —
   packages/enterprise-knowledge/src/contracts/knowledge-edge.contract.ts
   packages/enterprise-knowledge/src/data/edges.json
   packages/enterprise-knowledge/src/data/knowledge-data.schema.ts
   packages/enterprise-knowledge/src/index.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-semantic-edges.test.ts
   scripts/governance/check-knowledge-semantic-edges.mts
   package.json
   docs/PAS/slice/b42-pas004c-semantic-edges.md
4. Prohibited   — graph DB; new atoms; lifecycle transitions (B45); foundation-disposition.registry.ts
5. Authority    — PAS-004C §4.7 · PAS-004A §4.9 · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-json-authority
   pnpm check:knowledge-semantic-edges
   pnpm quality:boundaries
7. Closes       — PAS-004C §4.7; scorecard row #27; semantic edges in corpus
8. Evidence     — packages/enterprise-knowledge/src/contracts/knowledge-edge.contract.ts · scripts/governance/check-knowledge-semantic-edges.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | 8 new edge types in KNOWLEDGE_EDGE_TYPES | contract |
| 2 | ≥2 semantic edges in edges.json | gate |
| 3 | equivalent links terms to concepts (from B38) | test |
