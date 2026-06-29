# PAS-001A R3b — Service-Actor Operating-Context Assembly

> **Position:** API-CONTRACT R3 slice `2 of 4` · IS-004 · closes R2 deferred work

**Prerequisite:** [R3a](./pas-001a-r3a-handler-runtime-envelope.md) Delivered · [R2](../../../KERNEL/SLICE/pas-001a-r2-service-actor-s2s-attestation.md) Delivered

**Status:** Planned

**Type:** Implementation

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/REST/SLICE/pas-001a-r3b-service-actor-context-assembly.md

1. Objective    — Complete service-actor operating-context assembly on protected internal v1 API paths without human session impersonation — closing R2 deferred scope.
2. Allowed layer— apps/erp/src/lib/api/resolve-api-route-operating-context.ts · apps/erp/src/lib/auth/resolve-api-route-auth-actor.server.ts · apps/erp/src/lib/auth/resolve-service-actor.server.ts · apps/erp/src/lib/context/context-integration-registry.ts · apps/erp/src/__tests__/operating-context-integration.test.ts
3. Files        —
   apps/erp/src/lib/api/resolve-api-route-operating-context.ts
   apps/erp/src/lib/auth/resolve-api-route-auth-actor.server.ts
   apps/erp/src/lib/auth/resolve-service-actor.server.ts
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/auth/__tests__/resolve-service-actor.server.test.ts
   apps/erp/src/__tests__/operating-context-integration.test.ts
4. Prohibited   — Kernel OAuth/token runtime · handler-local scope inference · bypassing IS-002 spine · packages/kernel/src/**
5. Authority    — PAS-001A IS-002 · PAS-API-REST-001 §2.5 · R2 deferred · ADR-0030 §5–§6
6. Gates        —
   pnpm check:erp-service-actor-s2s-attestation
   pnpm check:erp-operating-context-spine
   pnpm --filter @afenda/erp test:run
   pnpm --filter @afenda/erp typecheck
7. Closes       — Service-actor operating-context assembly (R3b · R2 deferred)
8. Evidence     —
   apps/erp/src/lib/api/resolve-api-route-operating-context.ts
   scripts/governance/check-erp-service-actor-s2s-attestation.mts
9. Attestation  — Gate · Integration · Security
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Service actor paths resolve context via spine | `pnpm check:erp-service-actor-s2s-attestation` | API-INV-003 |
| 2 | IS-002 spine gate green with API resolver | `pnpm check:erp-operating-context-spine` | PAS-001A IS-002 |
| 3 | S2S attestation passes full context path | `pnpm check:erp-service-actor-s2s-attestation` | R2 deferred |
| 4 | Integration tests prove S2S context assembly | `pnpm --filter @afenda/erp test:run` | operating-context-integration.test.ts |
| 5 | No human session impersonation for machine callers | `pnpm check:erp-service-actor-s2s-attestation` | North Star P6 · I4 |

## Related

| Artifact | Path |
| --- | --- |
| R2 (KERNEL) | [pas-001a-r2-service-actor-s2s-attestation.md](../../../KERNEL/SLICE/pas-001a-r2-service-actor-s2s-attestation.md) |
| Next slice | [pas-001a-r3c-route-coverage-drift-attestation.md](./pas-001a-r3c-route-coverage-drift-attestation.md) |
