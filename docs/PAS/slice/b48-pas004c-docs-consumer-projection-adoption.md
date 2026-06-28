# Slice B48 — Docs Consumer Projection Adoption (PAS-004C post-close)

**Prerequisite:** [B47 Consumer projection adoption](b47-pas004c-consumer-projection-adoption.md) delivered

**Status:** Delivered · 2026-06-28

**Type:** Implementation

**Risk class:** Low — consumer wiring only; no new contracts

**Clean Core impact:** A→A — docs app uses B43 projection API

## Purpose

Wire `apps/docs` vocabulary helpers to `projectKnowledgeAtom('docs'|'erp')` instead of raw `getKnowledgeAtom` field picking. Update docs consumer proof gate to require projection API.

## Handoff block

```
Handoff from: docs/PAS/slice/b48-pas004c-docs-consumer-projection-adoption.md

1. Objective    — Refactor apps/docs vocabulary helpers to use projectKnowledgeAtom('docs'|'erp');
                  update check-knowledge-docs-consumer-proof gate; sync pas-status-index + B46 attestation to 58/58.
2. Allowed layer— apps/docs/src/lib/knowledge/** · scripts/governance/check-knowledge-docs-consumer-proof.mts
                  · docs/PAS/pas-status-index.md · docs/PAS/slice/b46-pas004c-semantic-attestation.md
                  · docs/PAS/slice/b48-pas004c-docs-consumer-projection-adoption.md
3. Files        —
   apps/docs/src/lib/knowledge/docs-vocabulary.ts
   apps/docs/src/__tests__/docs-vocabulary.test.ts
   scripts/governance/check-knowledge-docs-consumer-proof.mts
   docs/PAS/pas-status-index.md
   docs/PAS/slice/b46-pas004c-semantic-attestation.md
   docs/PAS/slice/b48-pas004c-docs-consumer-projection-adoption.md
4. Prohibited   — foundation-disposition.registry.ts; new atoms; kernel edits; enterprise-knowledge contracts
5. Authority    — PAS-004C §4.3 · PAS-004B B35 docs consumer proof · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/docs typecheck
   pnpm --filter @afenda/docs test:run
   pnpm check:knowledge-docs-consumer-proof
   pnpm check:knowledge-conformance
   pnpm quality:boundaries
   pnpm check:documentation-drift
7. Closes       — Docs consumer raw-atom gap; pas-status-index scorecard drift (56→58)
8. Evidence     — docs-vocabulary.ts · check-knowledge-docs-consumer-proof.mts
9. Attestation  — Contract · Test · Governance
```
