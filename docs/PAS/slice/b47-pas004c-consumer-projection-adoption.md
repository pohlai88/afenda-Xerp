# Slice B47 — Consumer Projection Adoption (PAS-004C post-close)

**Prerequisite:** [B46 Semantic attestation](b46-pas004c-semantic-attestation.md) delivered

**Status:** Delivered · 2026-06-28

**Type:** Implementation

**Risk class:** Low — consumer wiring only; no new contracts

**Clean Core impact:** A→A — consumers use B43 projection API

## Purpose

Wire `@afenda/ui-composition` and `apps/erp` to `projectKnowledgeAtom(profile)` instead of raw atom field picking. Closes PAS-004C consumer adoption gap.

## Handoff block

```
Handoff from: docs/PAS/slice/b47-pas004c-consumer-projection-adoption.md

1. Objective    — Refactor metadata + ERP vocabulary helpers to use projectKnowledgeAtom('metadata'|'erp');
                  update consumer proof gates; backfill double_entry.knowledgeDecision.decision in atoms.json.
2. Allowed layer— packages/ui-composition/src/knowledge/** · apps/erp/src/lib/knowledge/** · scripts/governance/check-knowledge-*-consumer*.mts
                  · packages/enterprise-knowledge/src/data/atoms.json (double_entry only) · docs/PAS/slice/b47-pas004c-consumer-projection-adoption.md
3. Files        —
   packages/ui-composition/src/knowledge/platform-identity-vocabulary.ts
   packages/ui-composition/src/__tests__/platform-identity-vocabulary.test.ts
   apps/erp/src/lib/knowledge/enterprise-knowledge-vocabulary.server.ts
   apps/erp/src/lib/knowledge/__tests__/enterprise-knowledge-vocabulary.test.ts
   scripts/governance/check-knowledge-metadata-consumer-proof.mts
   scripts/governance/check-knowledge-consumer-proof.mts
   packages/enterprise-knowledge/src/data/atoms.json
   docs/PAS/slice/b47-pas004c-consumer-projection-adoption.md
4. Prohibited   — foundation-disposition.registry.ts (done via B46 registry promotion); new atoms; kernel edits
5. Authority    — PAS-004C §4.3 · PAS-004 §9.2 · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/ui-composition typecheck
   pnpm --filter @afenda/ui-composition test:run
   pnpm --filter apps/erp typecheck
   pnpm --filter apps/erp test:run
   pnpm check:knowledge-metadata-consumer-proof
   pnpm check:knowledge-consumer-proof
   pnpm check:knowledge-conformance
   pnpm quality:boundaries
7. Closes       — Consumer adoption gap; double_entry knowledgeDecision hygiene
8. Evidence     — platform-identity-vocabulary.ts · enterprise-knowledge-vocabulary.server.ts
9. Attestation  — Contract · Test · Governance
```
