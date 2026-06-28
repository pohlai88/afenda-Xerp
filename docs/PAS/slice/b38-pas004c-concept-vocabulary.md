# Slice B38 — Concept + Vocabulary Layer (PAS-004C §4.1 · Phase 1)

**Prerequisite:** [B37 Enterprise Accepted attestation](b37-enterprise-accepted-attestation.md) delivered · [PAS-004C](../PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) published

**Status:** Delivered

**Type:** Implementation

**Risk class:** Medium — new semantic layer contracts + JSON registries; backfills 24 existing atoms with conceptId

**Clean Core impact:** A→A — additive contracts; existing atom IDs preserved; public exports extended

## Purpose

Deliver PAS-004C Phase 1 foundation: separate **KnowledgeConcept** (stable idea) from **KnowledgeTerm** (vocabulary surface forms). Add `conceptId` to every existing atom. Eliminate synonym duplication pattern.

## Handoff block

```
Handoff from: docs/PAS/slice/b38-pas004c-concept-vocabulary.md

1. Objective    — Introduce KnowledgeConcept + KnowledgeTerm contracts, concepts.json + terms.json JSON authority,
                  backfill conceptId on all 24 atoms, add validateKnowledgeConceptVocabulary policy + gate;
                  preserve all existing atom IDs and public exports.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-concept-vocabulary.mts
                  · package.json (script only) · docs/PAS/** · docs/architecture/glossary.md (concept cross-ref note only)
3. Files        —
   packages/enterprise-knowledge/src/contracts/knowledge-concept.contract.ts
   packages/enterprise-knowledge/src/contracts/knowledge-term.contract.ts
   packages/enterprise-knowledge/src/data/concepts.json
   packages/enterprise-knowledge/src/data/terms.json
   packages/enterprise-knowledge/src/data/knowledge-concept.loader.ts
   packages/enterprise-knowledge/src/data/knowledge-term.loader.ts
   packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.ts (add conceptId)
   packages/enterprise-knowledge/src/data/atoms.json (backfill conceptId)
   packages/enterprise-knowledge/src/data/knowledge-data.schema.ts (validate conceptId)
   packages/enterprise-knowledge/src/policy/knowledge-concept-vocabulary.policy.ts
   packages/enterprise-knowledge/src/index.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-concept-vocabulary.test.ts
   scripts/governance/check-knowledge-concept-vocabulary.mts
   package.json
   docs/PAS/slice/b38-pas004c-concept-vocabulary.md
   docs/PAS/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md (status sync)
4. Prohibited   — kernel parsers; RDF/OWL; graph DB; new business atoms beyond concept backfill;
                  metadata/erp consumer changes (B43); perspective layer (B39); foundation-disposition.registry.ts
5. Authority    — PAS-004C §4.1 · PAS-004 §5 (platform amend) · enterprise-knowledge skill · kernel-authority (no kernel edits)
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-json-authority
   pnpm check:knowledge-concept-vocabulary
   pnpm quality:boundaries
   pnpm check:foundation-disposition
7. Closes       — PAS-004C §4.1; scorecard row #21; conceptId on 24/24 atoms; concepts + terms JSON authority
8. Evidence     —
   packages/enterprise-knowledge/src/data/concepts.json
   packages/enterprise-knowledge/src/data/terms.json
   packages/enterprise-knowledge/src/contracts/knowledge-concept.contract.ts
   scripts/governance/check-knowledge-concept-vocabulary.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | concepts.json validates; ≥1 concept per platform identity atom | unit + gate |
| 2 | terms.json validates; preferred term per concept | unit + gate |
| 3 | All 24 atoms carry conceptId resolving to concepts.json | gate |
| 4 | Public exports include KnowledgeConcept, KnowledgeTerm, loaders | typecheck |
| 5 | No prohibited imports; zero runtime deps | boundaries |
