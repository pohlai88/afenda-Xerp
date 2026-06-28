# Slice B40 — Domain Axis Split (PAS-004C §4.5 · Phase 1)

**Prerequisite:** [B39 Contextual Meaning](b39-pas004c-contextual-meaning.md) delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low-Medium — domain metadata registry; no atom renames

**Clean Core impact:** A→A — additive domainClass metadata

## Purpose

Separate business domains (accounting, hr) from architecture domains (platform, engineering, api) via `KnowledgeDomainClass` registry.

## Handoff block

```
Handoff from: docs/PAS/slice/b40-pas004c-domain-axis-split.md

1. Objective    — Introduce KnowledgeDomainEntry + domainClass (business|architecture|knowledge), domains.registry.ts,
                  query helpers filterByDomainClass + gate.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-domain-axis.mts · package.json · docs/PAS/**
3. Files        —
   packages/enterprise-knowledge/src/contracts/knowledge-domain-registry.contract.ts
   packages/enterprise-knowledge/src/data/domains.registry.ts
   packages/enterprise-knowledge/src/policy/knowledge-domain-axis.policy.ts
   packages/enterprise-knowledge/src/index.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-domain-axis.test.ts
   scripts/governance/check-knowledge-domain-axis.mts
   package.json
   docs/PAS/slice/b40-pas004c-domain-axis-split.md
4. Prohibited   — renaming KNOWLEDGE_DOMAINS enum values; contextualValidity (B41); foundation-disposition.registry.ts
5. Authority    — PAS-004C §4.5 · PAS-004 §7.1 (platform amend) · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-domain-axis
   pnpm quality:boundaries
7. Closes       — PAS-004C §4.5; scorecard row #23; every KNOWLEDGE_DOMAINS entry has domainClass
8. Evidence     — packages/enterprise-knowledge/src/data/domains.registry.ts · scripts/governance/check-knowledge-domain-axis.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | All 17 KNOWLEDGE_DOMAINS have domainClass | gate |
| 2 | platform/architecture/engineering/api classified as architecture | test |
| 3 | accounting/hr/finance classified as business | test |
