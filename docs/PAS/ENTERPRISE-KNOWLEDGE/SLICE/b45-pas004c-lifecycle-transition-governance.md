# Slice B45 — Lifecycle Transition Governance (PAS-004C §4.8 · Phase 3)

**Prerequisite:** [B42 Semantic Edges](b42-pas004c-semantic-edges.md) delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low — policy-only transition rules

**Clean Core impact:** A→A — governs promotions; does not auto-mutate atoms

## Purpose

Make lifecycle transitions explicit: who can promote proposed→accepted→ratified, required evidence, min chain steps.

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b45-pas004c-lifecycle-transition-governance.md

1. Objective    — KnowledgeTransitionRule registry + canTransitionLifecycle policy + gate.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-lifecycle-transitions.mts · package.json · docs/PAS/**
3. Files        —
   packages/enterprise-knowledge/src/contracts/knowledge-transition.contract.ts
   packages/enterprise-knowledge/src/data/transition-rules.registry.ts
   packages/enterprise-knowledge/src/policy/knowledge-transition.policy.ts
   packages/enterprise-knowledge/src/index.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-transition.test.ts
   scripts/governance/check-knowledge-lifecycle-transitions.mts
   package.json
   docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b45-pas004c-lifecycle-transition-governance.md
4. Prohibited   — auto-promoting atom lifecycle in JSON; foundation-disposition.registry.ts
5. Authority    — PAS-004C §4.8 · PAS-004 §7.3 · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-lifecycle-transitions
   pnpm quality:boundaries
7. Closes       — PAS-004C §4.8; scorecard row #28; canTransitionLifecycle export
8. Evidence     — packages/enterprise-knowledge/src/policy/knowledge-transition.policy.ts · scripts/governance/check-knowledge-lifecycle-transitions.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Rules for proposed→accepted, accepted→ratified, ratified→implemented | registry |
| 2 | canTransitionLifecycle rejects ratified without architecture_authority chain step | test |
| 3 | All 24 atoms pass transition validation at current lifecycle | gate |
