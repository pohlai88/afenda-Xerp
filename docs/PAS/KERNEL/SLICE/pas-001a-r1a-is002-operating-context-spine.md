# Slice PAS-001A-R1a — IS-002 Operating Context Spine Re-attestation (ADR-0027)

> **Position:** R1 slice `1 of 4` in PAS-001A skeleton rebuild · Blueprint box: `ERP Integration Spine`

**Prerequisite:** ADR-0027 skeleton reset · B71–B75 historical attestation preserved

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-r1a-is002-operating-context-spine.md

1. Objective    — Re-prove IS-002 operating-context spine on ADR-0027 ERP skeleton with full CONTEXT_INTEGRATION_WIRING.
2. Allowed layer— apps/erp/src/lib/context/** · scripts/governance/check-erp-operating-context-spine.mts
3. Files        —
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/context/resolve-operating-context.server.ts
   apps/erp/src/lib/context/resolve-operating-context-orchestrator.server.ts
   scripts/governance/check-erp-operating-context-spine.mts
   apps/erp/src/lib/context/__tests__/operating-context-spine.integration.test.ts
4. Prohibited   — Kernel resolver logic · parallel OperatingContext assembly
5. Authority    — PAS-001A §2.3 · IS-002 · multi-tenancy-erp
6. Gates        —
   pnpm check:erp-operating-context-spine
   pnpm --filter @afenda/erp test:run
   pnpm quality:boundaries
7. Closes       — IS-002 integration-proven on skeleton ERP
8. Evidence     —
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/context/__tests__/operating-context-spine.integration.test.ts
   scripts/governance/check-erp-operating-context-spine.mts
9. Attestation  — Gate · Integration · Test
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | CONTEXT_INTEGRATION_WIRING delegates resolve | pnpm check:erp-operating-context-spine | PAS-001A §6.1 row 6 |
| 2 | Orchestrator pipeline wired for tenant/actor/org | pnpm check:erp-operating-context-spine | R1a spine |
| 3 | Integration test proves spine assembly | pnpm --filter @afenda/erp test:run | INV-001 |
