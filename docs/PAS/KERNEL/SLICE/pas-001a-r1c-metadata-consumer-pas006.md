# Slice PAS-001A-R1c — Metadata Consumer PAS-006 (IS-003)

> **Position:** R1 slice `3 of 4` in PAS-001A skeleton rebuild · Blueprint box: `ERP Integration Spine` + PAS-006

**Prerequisite:** R1b Delivered · P06-008 metadata binding contract Delivered

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-r1c-metadata-consumer-pas006.md

1. Objective    — IS-003 metadata workspace consumes operating-context spine + PAS-006 binding registries on skeleton ERP.
2. Allowed layer— apps/erp/src/lib/metadata/** · scripts/governance/check-erp-metadata-pas006-consumer.mts · apps/erp/src/app/(protected)/metadata-workspace/**
3. Files        —
   scripts/governance/check-erp-metadata-pas006-consumer.mts
   apps/erp/src/lib/metadata/hydrate-metadata-binding-slots.server.ts
   apps/erp/src/lib/metadata/metadata-ui-binding.projection.ts
   apps/erp/src/lib/metadata/resolve-metadata-ui-render-context.server.ts
   apps/erp/src/lib/metadata/resolve-metadata-workspace-surfaces.server.ts
   apps/erp/src/app/(protected)/metadata-workspace/page.tsx
4. Prohibited   — @afenda/metadata-ui · @afenda/ui-composition · kernel import in @afenda/shadcn-studio contracts
5. Authority    — PAS-001A IS-003 · PAS-006D · ADR-0027
6. Gates        —
   pnpm check:erp-metadata-pas006-consumer
   pnpm --filter @afenda/erp test:run
   pnpm quality:boundaries
7. Closes       — IS-003 metadata consumer on PAS-006 skeleton
8. Evidence     —
   scripts/governance/check-erp-metadata-pas006-consumer.mts
   apps/erp/src/lib/metadata/__tests__/metadata-ui-binding.projection.test.ts
   apps/erp/src/lib/metadata/__tests__/resolve-metadata-ui-render-context.server.test.ts
9. Attestation  — Gate · Integration · Contract
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Metadata modules consume spine output | pnpm check:erp-metadata-pas006-consumer | INV-004 |
| 2 | No retired presentation package imports | pnpm check:erp-metadata-pas006-consumer | ADR-0027 |
| 3 | Metadata workspace page wired | pnpm check:erp-metadata-pas006-consumer | PAS-001A §6.1 row 9 |
