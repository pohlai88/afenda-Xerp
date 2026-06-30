# Slice B52 — Vocabulary Synonym Richness (PAS-004D §4.4)

**Prerequisite:** [B51 Corpus depth](b51-pas004d-corpus-depth.md) delivered

**Status:** Delivered — `check:knowledge-vocabulary-richness` registered 2026-06-30

**Type:** Runtime + governance

**Risk class:** Low — terms.json enrichment only; no concept or atom meaning changes

**Clean Core impact:** A→A — exercises KnowledgeTerm synonym model without horizontal ontology expansion

## Purpose

Validate ≥2 `KnowledgeTerm` rows per platform identity concept where PAS-004 charter lists honest synonyms (tenant, legal_entity, organization_unit, workspace, supplier). Proves synonym vocabulary model beyond 1:1 concept:term seed.

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b52-pas004d-vocabulary-richness.md

1. Objective    — Add charter synonym term rows; add check:knowledge-vocabulary-richness policy + gate; register in package.json.
2. Allowed layer— packages/enterprise-knowledge/src/data/terms.json · packages/enterprise-knowledge/src/policy/knowledge-vocabulary-richness.policy.ts · scripts/governance/check-knowledge-vocabulary-richness.mts · package.json (script) · docs/PAS/ENTERPRISE-KNOWLEDGE/**
3. Files        —
   packages/enterprise-knowledge/src/data/terms.json
   packages/enterprise-knowledge/src/policy/knowledge-vocabulary-richness.policy.ts
   scripts/governance/check-knowledge-vocabulary-richness.mts
   scripts/governance/__tests__/check-knowledge-vocabulary-richness.test.ts
4. Prohibited   — packages/kernel/** edits; foundation-disposition.registry.ts (delegate); procurement operational runtime
5. Authority    — PAS-004D §4.4 · PAS-004 charter synonym pattern · enterprise-knowledge skill
6. Gates        —
   pnpm check:knowledge-vocabulary-richness
   pnpm check:knowledge-concept-vocabulary
   pnpm check:knowledge-corpus-depth
   pnpm --filter @afenda/enterprise-knowledge test:run
7. Closes       — PAS-004D §4.4 vocabulary richness thresholds
8. Evidence     — ≥2 terms per charter synonym concept · gate PASS
9. Attestation  — Runtime · Governance
```

## DoD

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | ≥2 KnowledgeTerm rows for tenant, legal_entity, organization_unit, workspace, supplier | terms.json · gate PASS |
| 2 | Customer concept skipped when absent from corpus | policy comment + gate PASS |
| 3 | `check:knowledge-vocabulary-richness` registered in root package.json | package.json |
| 4 | pas-status-index B52 → Delivered; next B54 deferred | pas-status-index |

## Registry delegation

Append B52 gate + evidence paths to PKGR04 via **foundation-registry-owner** (B54 batch).
