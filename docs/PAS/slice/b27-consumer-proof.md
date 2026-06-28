# Slice B27 — Consumer Proof (PAS-004A §4.3 · §10 · §11)

**Prerequisite:** [B26 Kernel mapping gate](b26-kernel-mapping-gate.md) delivered

**Status:** Delivered · 2026-06-28

**Type:** Implementation

**Risk class:** Low-Medium — adds one production import path in apps/erp

**Clean Core impact:** A→A — additive ERP wiring; no atom corpus changes

## Handoff block

```
Handoff from: docs/PAS/slice/b27-consumer-proof.md

1. Objective    — Prove ≥1 production consumer imports getKnowledgeAtom from @afenda/enterprise-knowledge; add static governance gate.
2. Allowed layer— apps/erp/src/lib/knowledge/** · apps/erp/package.json · scripts/governance/check-knowledge-consumer-proof.mts · package.json (script) · docs/PAS/slice/b27-consumer-proof.md · docs/PAS/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md (status)
3. Files        —
   apps/erp/src/lib/knowledge/enterprise-knowledge-vocabulary.server.ts
   apps/erp/src/lib/knowledge/__tests__/enterprise-knowledge-vocabulary.test.ts
   apps/erp/package.json
   scripts/governance/check-knowledge-consumer-proof.mts
   package.json
   docs/PAS/slice/b27-consumer-proof.md
4. Prohibited   — packages/metadata runtime dep (zero-deps policy); atom corpus edits; kernel edits; registry disposition mutation (B30)
5. Authority    — PAS-004A §4.3 · PAS-004 consumer rules · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run -- enterprise-knowledge-vocabulary
   pnpm check:knowledge-consumer-proof
   pnpm quality:boundaries
7. Closes       — Scorecard row #4 consumer proof
8. Evidence     —
   apps/erp/src/lib/knowledge/enterprise-knowledge-vocabulary.server.ts
   scripts/governance/check-knowledge-consumer-proof.mts
9. Attestation  — Contract · Test · Governance · Documentation
```
