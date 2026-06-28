# Slice B41 — Accepted vs Applicable (PAS-004C §4.6 · Phase 1)

**Prerequisite:** [B40 Domain Axis Split](b40-pas004c-domain-axis-split.md) delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low — contextualValidity facet on atoms; GAAP/IFRS coexistence proof

**Clean Core impact:** A→A — additive atom facet

## Purpose

Distinguish **accepted** (authority recorded meaning) from **applicable** (valid in jurisdiction/domain). Enable GAAP/IFRS/tax coexistence without implying universal truth.

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b41-pas004c-accepted-vs-applicable.md

1. Objective    — Add ContextualValidity facet to KnowledgeAtom contract + atoms.json for multi-framework atoms;
                  validate accepted≠universal; gate check:knowledge-contextual-validity.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-contextual-validity.mts · package.json · docs/PAS/**
3. Files        —
   packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.ts (contextualValidity)
   packages/enterprise-knowledge/src/data/atoms.json (ifrs_10 + accounting framework atoms)
   packages/enterprise-knowledge/src/data/knowledge-data.schema.ts
   packages/enterprise-knowledge/src/policy/knowledge-contextual-validity.policy.ts
   packages/enterprise-knowledge/src/index.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-contextual-validity.test.ts
   scripts/governance/check-knowledge-contextual-validity.mts
   package.json
   docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b41-pas004c-accepted-vs-applicable.md
4. Prohibited   — consumer profiles (B43); new framework rule engines; PAS-003 accounting runtime; foundation-disposition.registry.ts
5. Authority    — PAS-004C §4.6 · PAS-004 §3.1 · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-contextual-validity
   pnpm quality:boundaries
7. Closes       — PAS-004C §4.6; scorecard row #24; contextualValidity on applicable atoms
8. Evidence     — scripts/governance/check-knowledge-contextual-validity.mts · contextualValidity on ifrs_10 atom
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | contextualValidity optional on atoms; required when confidence.basis includes conflicting frameworks | policy |
| 2 | ifrs_10 atom documents applicableIn/notApplicableIn | gate |
| 3 | validateContextualValidity returns empty for corpus | gate |
