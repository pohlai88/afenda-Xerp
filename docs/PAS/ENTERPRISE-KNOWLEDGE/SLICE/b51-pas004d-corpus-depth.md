# Slice B51 — Semantic Corpus Depth (PAS-004D §4.3)

**Prerequisite:** [B50 Legacy surface retirement](b50-pas004d-legacy-surface-retirement.md) delivered

**Status:** Delivered — `check:knowledge-corpus-depth` registered 2026-06-30

**Type:** Runtime + governance

**Risk class:** Low — corpus enrichment only; no kernel or consumer wire changes

**Clean Core impact:** A→A — honest depth thresholds on existing semantic model contracts

## Purpose

Raise corpus depth to PAS-004D minimum thresholds: platform identity perspectives for tenant and organization_unit, contextualValidity on multi-framework atoms, semantic edge count, and realizationMapping-only public boundary for platform identity + accounting invariant atoms.

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b51-pas004d-corpus-depth.md

1. Objective    — Enrich perspectives/atoms/edges corpus to B51 thresholds; add check:knowledge-corpus-depth policy + gate; register in package.json.
2. Allowed layer— packages/enterprise-knowledge/src/data/** · packages/enterprise-knowledge/src/policy/knowledge-corpus-depth.policy.ts · scripts/governance/check-knowledge-corpus-depth.mts · package.json (script) · docs/PAS/ENTERPRISE-KNOWLEDGE/**
3. Files        —
   packages/enterprise-knowledge/src/data/perspectives.json
   packages/enterprise-knowledge/src/data/atoms.json
   packages/enterprise-knowledge/src/data/edges.json
   packages/enterprise-knowledge/src/policy/knowledge-corpus-depth.policy.ts
   scripts/governance/check-knowledge-corpus-depth.mts
   scripts/governance/__tests__/check-knowledge-corpus-depth.test.ts
4. Prohibited   — packages/kernel/** edits; foundation-disposition.registry.ts (delegate); procurement operational runtime
5. Authority    — PAS-004D §4.3 · enterprise-knowledge skill · B50 loader boundary (read-only)
6. Gates        —
   pnpm check:knowledge-corpus-depth
   pnpm check:knowledge-perspective
   pnpm check:knowledge-contextual-validity
   pnpm check:knowledge-semantic-edges
   pnpm check:knowledge-legacy-surface-retirement
   pnpm --filter @afenda/enterprise-knowledge test:run
7. Closes       — PAS-004D §4.3 corpus depth thresholds
8. Evidence     — ≥3 perspectives per tenant/legal_entity/organization_unit · ≥6 contextualValidity · ≥8 edges · gate PASS
9. Attestation  — Runtime · Governance
```

## DoD

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | ≥3 perspectives each for tenant, legal_entity, organization_unit | perspectives.json · gate PASS |
| 2 | ≥6 atoms with contextualValidity | atoms.json · gate PASS |
| 3 | ≥8 semantic edges in corpus | edges.json · gate PASS |
| 4 | Platform identity + accounting invariant atoms: realizationMapping only at public boundary | policy + legacy gate PASS |
| 5 | `check:knowledge-corpus-depth` registered in root package.json | package.json |
| 6 | pas-status-index B51 → Delivered; next B54 deferred | pas-status-index |

## Registry delegation

Append B51 gate + evidence paths to PKGR04 via **foundation-registry-owner** (B54 batch).
