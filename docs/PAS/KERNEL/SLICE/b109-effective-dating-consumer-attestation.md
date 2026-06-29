# Slice B109 — Effective Dating Consumer Attestation (PAS-001 amendment)

> **Historical consumer note:** Evidence may cite pre-ADR-0027 packages. Current presentation lane is [PAS-006](../../PRESENTATION/README.md) — see [DEVELOPMENT-LANE-BOUNDARIES.md](../../DEVELOPMENT-LANE-BOUNDARIES.md).

> **Position:** Amendment slice 3 of 5 in PAS-001 · Blueprint box: `Kernel Vocabulary` + ERP consumer proof

**Prerequisite:** B108 Delivered

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b109-effective-dating-consumer-attestation.md

1. Objective    — Kernel effective-dating helpers + ERP consumer attestation gate + metadata bridge carriers.
2. Allowed layer— packages/kernel/src/context/effective-dating-vocabulary.contract.ts · scripts/governance/check-kernel-effective-dating-consumer-attestation.mts · apps/erp/src/lib/metadata/resolve-metadata-ui-render-context.server.ts · packages/ui-composition/src/runtime.contract.ts
3. Files        —
   packages/kernel/src/context/effective-dating-vocabulary.contract.ts
   packages/kernel/src/context/ownership-interest-context.contract.ts
   scripts/governance/check-kernel-effective-dating-consumer-attestation.mts
   scripts/governance/check-metadata-permission-model-parity.mts
   scripts/governance/check-metadata-policy-parity.mts
   apps/erp/src/lib/metadata/resolve-metadata-ui-render-context.server.ts
   packages/ui-composition/src/runtime.contract.ts
4. Prohibited   — foundation-disposition.registry.ts · packages/metadata-ui direct kernel imports
5. Authority    — PAS-001 §4 effective dating · Blueprint §6 · PAS-001A metadata bridge
6. Gates        —
   pnpm check:kernel-effective-dating-consumer-attestation
   pnpm check:metadata-permission-model-parity
   pnpm check:metadata-policy-parity
   pnpm --filter @afenda/kernel test:run
   pnpm --filter @afenda/erp typecheck
7. Closes       — Effective dating consumer attestation + metadata runtime carrier extension
8. Evidence     — packages/kernel/src/context/__tests__/effective-dating-vocabulary.test.ts
9. Attestation  — Contract · Gate · Integration
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | isRecordEffectiveAt shared helper | pnpm --filter @afenda/kernel test:run | PAS-001 effective dating |
| 2 | ERP consolidation uses effective dating | pnpm check:kernel-effective-dating-consumer-attestation | Blueprint §6 |
| 3 | Metadata permission/policy parity | pnpm check:metadata-permission-model-parity && pnpm check:metadata-policy-parity | PAS-001A bridge |
