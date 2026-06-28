# Slice B39 — Contextual Meaning / Perspective Model (PAS-004C §4.2 · Phase 1)

**Prerequisite:** [B38 Concept + Vocabulary](b38-pas004c-concept-vocabulary.md) delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Medium — perspective registry links concepts to domain-specific accepted meanings

**Clean Core impact:** A→A — additive; no atom ID changes

## Purpose

Model contextual accepted meaning: Concept × Domain → KnowledgePerspective → atomId. Replace flat meaning.{canonical,business,engineering} as the primary semantic path (fields retained for backward compat).

## Handoff block

```
Handoff from: docs/PAS/slice/b39-pas004c-contextual-meaning.md

1. Objective    — Introduce KnowledgePerspective contract, perspectives.json, policy + gate;
                  wire ≥3 platform identity perspectives (e.g. legal_entity × accounting, identity, reporting).
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-perspective.mts · package.json · docs/PAS/**
3. Files        —
   packages/enterprise-knowledge/src/contracts/knowledge-perspective.contract.ts
   packages/enterprise-knowledge/src/data/perspectives.json
   packages/enterprise-knowledge/src/data/knowledge-perspective.loader.ts
   packages/enterprise-knowledge/src/policy/knowledge-perspective.policy.ts
   packages/enterprise-knowledge/src/index.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-perspective.test.ts
   scripts/governance/check-knowledge-perspective.mts
   package.json
   docs/PAS/slice/b39-pas004c-contextual-meaning.md
4. Prohibited   — domainClass split (B40); consumer profiles (B43); new atoms; kernel edits; foundation-disposition.registry.ts
5. Authority    — PAS-004C §4.2 · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-concept-vocabulary
   pnpm check:knowledge-perspective
   pnpm quality:boundaries
7. Closes       — PAS-004C §4.2; scorecard row #22; perspectives.json authority
8. Evidence     — packages/enterprise-knowledge/src/data/perspectives.json · scripts/governance/check-knowledge-perspective.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | perspectives.json validates | gate |
| 2 | ≥3 platform identity perspectives with resolving atomIds | gate |
| 3 | getPerspectivesForConcept(conceptId) pure export | test |
