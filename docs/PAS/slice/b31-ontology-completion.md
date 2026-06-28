# Slice B31 — Ontology Completion (PAS-004A §12)

**Prerequisite:** [B30 Enterprise Accepted attestation](b30-enterprise-accepted-attestation.md) delivered

**Status:** Delivered · 2026-06-28

**Type:** Implementation

**Risk class:** Medium — corpus expansion + kernel mapping alignment

## Handoff block

```
Handoff from: docs/PAS/slice/b31-ontology-completion.md

1. Objective    — Expand typed JSON corpus from 16 to 24 atoms (PAS-004A §12 Production Candidate target); add B31 kernel-aligned context atoms with valid implementationMapping.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/migrate-b31-atoms.mjs · docs/PAS/** · docs/architecture/glossary.md (manifest optional subset)
3. Files        —
   packages/enterprise-knowledge/src/data/atoms.json
   packages/enterprise-knowledge/src/data/knowledge.registry.ts
   scripts/governance/migrate-b31-atoms.mjs
   docs/PAS/slice/b31-ontology-completion.md
   docs/PAS/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md
   docs/PAS/pas-status-index.md
4. Prohibited   — kernel package edits; foundation-disposition.registry.ts direct edit
5. Authority    — PAS-004A §12 · enterprise-knowledge skill · kernel evidence paths read-only
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-typed-corpus
   pnpm check:knowledge-json-authority
   pnpm check:knowledge-kernel-mapping
   pnpm check:knowledge-conformance
   pnpm quality:boundaries
7. Closes       — §12 ≥24 atom Production Candidate target; B31_CONTEXT_ATOM_IDS tuple
8. Evidence     — atoms.json (24 atoms) · migrate-b31-atoms.mjs
9. Attestation  — Contract · Test · Governance · Documentation
```

## Atoms added (B31)

| atomId | Kernel evidence |
| --- | --- |
| `operating_context` | `operating-context.contract.ts` |
| `permission_scope` | `permission-scope-context.contract.ts` |
| `project` | `project-context.contract.ts` |
| `team` | `team-context.contract.ts` |
| `localization_context` | `localization-context.contract.ts` |
| `workflow_context` | `workflow-context.contract.ts` |
| `business_reference` | `business-reference-wire.contract.ts` |
| `human_reference` | `tenant-human-reference.policy.ts` (meaning only; no implementationMapping) |
