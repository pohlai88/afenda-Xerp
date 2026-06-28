# Slice B29 — Coverage Expansion + Typed Corpus (PAS-004A §12 · §4.6–§4.7)

**Prerequisite:** [B28 Glossary sync gate](b28-glossary-sync-gate.md) delivered

**Status:** Delivered · 2026-06-28

**Type:** Implementation

**Risk class:** Medium-High — corpus shape migration + atom expansion

**Clean Core impact:** A→A — JSON corpus migration; B24 atom ID prefix preserved

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b29-coverage-expansion.md

1. Objective    — Migrate atoms.json to typedEvidence + structuredReasoning; canonical acceptance authority IDs; add 4 platform identity atoms; quality score helper + typed corpus gate.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/migrate-b29-atoms.mjs · scripts/governance/check-knowledge-typed-corpus.mts · package.json · docs/PAS/** · docs/architecture/glossary.md
3. Files        —
   packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.ts
   packages/enterprise-knowledge/src/data/atoms.json
   packages/enterprise-knowledge/src/data/knowledge.registry.ts
   packages/enterprise-knowledge/src/data/knowledge-data.schema.ts
   packages/enterprise-knowledge/src/policy/knowledge-evidence-paths.policy.ts
   packages/enterprise-knowledge/src/policy/knowledge-kernel-mapping.policy.ts
   packages/enterprise-knowledge/src/policy/knowledge-quality.policy.ts
   packages/enterprise-knowledge/src/policy/knowledge.policy.ts
   packages/enterprise-knowledge/src/index.ts
   packages/enterprise-knowledge/src/__tests__/*.test.ts (updated)
   scripts/governance/migrate-b29-atoms.mjs
   scripts/governance/check-knowledge-typed-corpus.mts
   scripts/governance/check-knowledge-json-authority.mts
   package.json
   docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b29-coverage-expansion.md
   docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md
   docs/architecture/glossary.md
4. Prohibited   — kernel package edits; registry disposition mutation (B30); metadata runtime deps
5. Authority    — PAS-004A §4.6–§4.7 · §12 · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-typed-corpus
   pnpm check:knowledge-conformance
   pnpm check:knowledge-json-authority
   pnpm check:knowledge-kernel-mapping
   pnpm quality:boundaries
7. Closes       — Typed evidence/reasoning migration; canonical authority IDs; 16-atom corpus (honest gap vs ≥24 target documented)
8. Evidence     —
   packages/enterprise-knowledge/src/data/atoms.json
   scripts/governance/check-knowledge-typed-corpus.mts
   packages/enterprise-knowledge/src/policy/knowledge-quality.policy.ts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Honest coverage note

Production Candidate target remains **≥24 atoms** per PAS-004A §12. B29 delivers **16** (12 B24 + 4 platform identity). Remaining expansion is a future slice — not conflated with Enterprise Accepted.
