# Slice B35 — Docs Consumer Proof (PAS-004B §4.2)

**Prerequisite:** [B34 Metadata consumer proof](b34-metadata-consumer-proof.md) delivered

**Status:** Delivered — 2026-06-28

**Type:** Implementation

**Risk class:** Low — docs vocabulary helper + MDX atom citations

**Clean Core impact:** A→A — accepted meaning from atoms; docs layout unchanged

## Handoff block

```
Handoff from: docs/PAS/slice/b35-docs-consumer-proof.md

1. Objective    — Wire apps/docs vocabulary helper citing Knowledge Atom IDs + check:knowledge-docs-consumer-proof gate.
2. Allowed layer— apps/docs/** · scripts/governance/check-knowledge-docs-consumer-proof.mts · package.json (script) · docs/PAS/**
3. Files        —
   apps/docs/src/lib/knowledge/docs-vocabulary.ts
   apps/docs/src/__tests__/docs-vocabulary.test.ts
   apps/docs/src/components/blocks/docs-knowledge-atom-block.tsx
   apps/docs/content/docs/en/configure-tenant/enterprise-vocabulary.mdx
   apps/docs/content/docs/en/configure-tenant/meta.json
   apps/docs/package.json
   scripts/governance/check-knowledge-docs-consumer-proof.mts
   package.json
   docs/PAS/slice/b35-docs-consumer-proof.md
4. Prohibited   — enterprise-knowledge importing apps/docs; kernel edits; B36–B37 in same slice; foundation-disposition.registry.ts
5. Authority    — PAS-004B §4.2 · PAS-004 §9.2 · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/docs typecheck
   pnpm --filter @afenda/docs test:run
   pnpm check:knowledge-docs-consumer-proof
   pnpm check:knowledge-metadata-consumer-proof
7. Closes       — PAS-004B scorecard row #18; docs consumer import proof
8. Evidence     —
   apps/docs/src/lib/knowledge/docs-vocabulary.ts
   scripts/governance/check-knowledge-docs-consumer-proof.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Docs declares `@afenda/enterprise-knowledge` dependency | package.json + gate |
| 2 | Vocabulary helper resolves atom titles/definitions via `getKnowledgeAtom` | unit tests |
| 3 | MDX cites ≥3 platform identity atom IDs | gate + enterprise-vocabulary.mdx |
| 4 | Enterprise-knowledge does not import apps/docs | gate scan |
