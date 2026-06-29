# PAS-001A R2 — Service Actor S2S Attestation

> **Position:** PAS-001A integration spine slice · Blueprint box: `ERP Integration Spine` · E12 consumer proof

**Prerequisite:** B113 Delivered · R1d Delivered

**Status:** Delivered (2026-06-30)

**Type:** Evidence-sync + ingress scaffold

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-r2-service-actor-s2s-attestation.md

1. Objective    — Scaffold S2S service/delegated_application actor ingress on protected internal API paths with attestation gate.
2. Allowed layer— apps/erp/src/lib/auth/** · apps/erp/src/lib/api/resolve-api-route-operating-context.ts · apps/erp/src/lib/context/context-integration-registry.ts · scripts/governance/check-erp-service-actor-s2s-attestation.mts
3. Files        —
   apps/erp/src/lib/auth/resolve-service-actor.server.ts
   apps/erp/src/lib/auth/resolve-api-route-auth-actor.server.ts
   apps/erp/src/lib/api/resolve-api-route-operating-context.ts
   apps/erp/src/lib/context/context-integration-registry.ts
   scripts/governance/check-erp-service-actor-s2s-attestation.mts
   apps/erp/src/lib/auth/__tests__/resolve-service-actor.server.test.ts
4. Prohibited   — Kernel OAuth/token runtime · full service operating-context assembly (deferred to PAS-001A API track)
5. Authority    — PAS-001A IS-002 · PAS-001 §4.1.11 E12 · ADR-0027 skeleton
6. Gates        —
   pnpm check:erp-service-actor-s2s-attestation
   pnpm --filter @afenda/erp test:run
   pnpm --filter @afenda/erp typecheck
7. Closes       — Service/delegated_application protected-path S2S ingress attestation (R2)
8. Evidence     —
   scripts/governance/check-erp-service-actor-s2s-attestation.mts
   apps/erp/src/lib/auth/__tests__/resolve-service-actor.server.test.ts
9. Attestation  — Gate · Integration · Security
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Service actor headers parse via kernel `parseAuthActorIdentity` | `pnpm check:erp-service-actor-s2s-attestation` |
| 2 | Internal API resolver branches S2S before human session | `pnpm check:erp-service-actor-s2s-attestation` |
| 3 | SERVICE_ACTOR_BRIDGE_WIRING registry entries verified | `pnpm check:erp-service-actor-s2s-attestation` |
| 4 | Unit tests for service/delegated_application ingress | `pnpm --filter @afenda/erp test:run` |

## Deferred (PAS-001A API track)

~~Full operating-context assembly for service actors (tenant/scope resolution without human session) remains out of scope for this scaffold slice.~~ **Closed by [R3b](../../API-CONTRACT/REST/SLICE/pas-001a-r3b-service-actor-context-assembly.md) (Delivered).**
