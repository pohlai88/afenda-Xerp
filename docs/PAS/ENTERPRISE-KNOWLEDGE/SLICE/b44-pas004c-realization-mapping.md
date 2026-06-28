# Slice B44 — Realization Mapping (PAS-004C §4.4 · Phase 2)

**Prerequisite:** [B43 Consumer Profiles](b43-pas004c-consumer-profiles.md) delivered

**Status:** Delivered · 2026-06-28

**Type:** Implementation

**Risk class:** Medium — extends implementationMapping; kernel-authority mandatory

**Clean Core impact:** A→A — additive realizationMapping; implementationMapping alias preserved

## Purpose

Broaden realization beyond kernel/schema to SOP, policy, regulation, training, API, UI, report. Kernel entries still cite contract paths only.

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b44-pas004c-realization-mapping.md

1. Objective    — KnowledgeRealizationMapping contract + realizationMapping[] on atoms; normalize loader accepts both implementationMapping and realizationMapping;
                  gate validates kernel realizationKind cites *.contract.ts only.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-realization-mapping.mts · package.json · docs/PAS/**
3. Files        —
   packages/enterprise-knowledge/src/contracts/knowledge-realization.contract.ts
   packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.ts
   packages/enterprise-knowledge/src/data/atoms.json (add realizationMapping to ≥3 atoms)
   packages/enterprise-knowledge/src/data/knowledge-data.schema.ts
   packages/enterprise-knowledge/src/policy/knowledge-realization.policy.ts
   packages/enterprise-knowledge/src/index.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-realization.test.ts
   scripts/governance/check-knowledge-realization-mapping.mts
   package.json
   docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b44-pas004c-realization-mapping.md
4. Prohibited   — kernel parser duplication; semantic edges (B42); foundation-disposition.registry.ts
5. Authority    — PAS-004C §4.4 · PAS-001 · kernel-authority skill (mandatory read)
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-kernel-mapping
   pnpm check:knowledge-realization-mapping
   pnpm quality:boundaries
7. Closes       — PAS-004C §4.4; scorecard row #26; ≥3 realization kinds cited
8. Evidence     — scripts/governance/check-knowledge-realization-mapping.mts · realizationMapping on platform identity atoms
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | realizationKind enum includes sop/policy/regulation/training/api/ui/report | contract |
| 2 | kernel entries cite contract paths only | gate + kernel-mapping |
| 3 | implementationMapping backward compat preserved | test |
