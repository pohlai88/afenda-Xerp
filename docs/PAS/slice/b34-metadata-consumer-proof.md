# Slice B34 — Metadata Consumer Proof (PAS-004B §4.2)

**Prerequisite:** [B33 Kernel identity mapping gate](b33-kernel-identity-mapping-gate.md) delivered

**Status:** Delivered — 2026-06-28

**Type:** Implementation

**Risk class:** Low — additive metadata vocabulary consumer; one approved upstream dependency

**Clean Core impact:** A→A — metadata resolves accepted meaning from atoms; no local label forks

## Purpose

Prove `@afenda/ui-composition` resolves platform identity labels from `@afenda/enterprise-knowledge` without enterprise-knowledge importing metadata. Static governance gate + unit tests.

## Handoff block

```
Handoff from: docs/PAS/slice/b34-metadata-consumer-proof.md

1. Objective    — Wire metadata platform-identity vocabulary resolver (≥3 labels from atoms) + check:knowledge-metadata-consumer-proof gate.
2. Allowed layer— packages/ui-composition/** · scripts/governance/check-knowledge-metadata-consumer-proof.mts · package.json (script) · docs/PAS/**
3. Files        —
   packages/ui-composition/src/knowledge/platform-identity-vocabulary.ts
   packages/ui-composition/src/__tests__/platform-identity-vocabulary.test.ts
   packages/ui-composition/package.json
   packages/ui-composition/tsconfig.json
   packages/ui-composition/src/index.ts
   packages/ui-composition/src/governance/cross-package-authority.contract.ts
   packages/ui-composition/src/__tests__/downstream-boundary.test.ts
   scripts/governance/check-knowledge-metadata-consumer-proof.mts
   package.json
   docs/PAS/slice/b34-metadata-consumer-proof.md
   docs/PAS/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md
4. Prohibited   — enterprise-knowledge importing metadata; kernel edits; B35–B37 in same slice; foundation-disposition.registry.ts
5. Authority    — PAS-004B §4.2 · PAS-004 §9.2 · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/ui-composition typecheck
   pnpm --filter @afenda/ui-composition test:run
   pnpm check:knowledge-metadata-consumer-proof
   pnpm check:knowledge-kernel-identity-mapping
   pnpm quality:boundaries
7. Closes       — PAS-004B scorecard row #17; metadata consumer import proof
8. Evidence     —
   packages/ui-composition/src/knowledge/platform-identity-vocabulary.ts
   scripts/governance/check-knowledge-metadata-consumer-proof.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Metadata declares `@afenda/enterprise-knowledge` dependency | package.json + gate |
| 2 | ≥3 platform identity labels resolve via `getKnowledgeAtom` | unit tests + gate |
| 3 | Enterprise-knowledge does not import metadata | architecture-boundary test |
| 4 | Cross-package authority allows single upstream import | metadata tests |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Metadata vocabulary consumer | Yes — B34 | `packages/ui-composition/src/knowledge/platform-identity-vocabulary.ts` |
| Metadata consumer gate | Yes — B34 | `scripts/governance/check-knowledge-metadata-consumer-proof.mts` |
