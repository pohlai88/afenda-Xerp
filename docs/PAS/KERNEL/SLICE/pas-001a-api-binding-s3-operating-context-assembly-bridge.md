# PAS-001A-API-BINDING-S3 — Operating Context Assembly Bridge

| Slice ID | PAS-001A-API-BINDING-S3 |
| Parent PAS | [PAS-001A-API-BINDING](../PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| Status | **Delivered** |
| Type | Implementation |
| Scope | Bridge IS-004 API-007 context declarations to IS-002 spine assembly |
| Prerequisite | [S2 Delivered](./pas-001a-api-binding-s2-erp-rest-binding-consumption.md) · [R3b](../../API-CONTRACT/REST/SLICE/pas-001a-r3b-service-actor-context-assembly.md) Delivered |

## 0. Purpose

Protected API operations receive operating context from **IS-002 spine** — not handler-local inference.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-api-binding-s3-operating-context-assembly-bridge.md
1. Objective    — erp-api-context-bridge.contract.ts; API-007 ↔ IS-002 spine attestation (closes R2 deferred at binding layer).
2. Allowed layer— apps/erp/src/server/api/contracts/** · __tests__/
3. Files        —
   apps/erp/src/server/api/contracts/erp-api-context-bridge.contract.ts
   apps/erp/src/server/api/__tests__/erp-api-context-bridge.test.ts
   apps/erp/src/server/api/contracts/api-governance.constants.ts
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md (§6.1.3)
   docs/PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md
4. Prohibited   — Kernel OAuth/token runtime · handler-local scope inference · packages/kernel/src/**
5. Authority    — PAS-001A IS-002 · PAS-API-001 API-007
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:erp-operating-context-spine
   pnpm check:erp-service-actor-s2s-attestation
   pnpm check:documentation-drift
7. Closes       — API contract context policies wired to IS-002 spine attestation
8. Evidence     — erp-api-context-bridge.contract.ts · erp-api-context-bridge.test.ts · PAS-001A §6.1.3
9. Attestation  — Contract · Test · Spine gate
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Protected operations declare non-`none` context policies | `erp-api-context-bridge.test.ts` |
| 2 | API-007 declarations match contextPolicy required flags | test |
| 3 | Service-actor operations require operating context | test |
| 4 | IS-002 spine + S2S gates remain green | `check:erp-operating-context-spine` · `check:erp-service-actor-s2s-attestation` |
| 5 | Attestation JSON-serializable | test |

## 7. Evidence (Delivered)

| Artifact | Path |
| --- | --- |
| Context bridge contract | `apps/erp/src/server/api/contracts/erp-api-context-bridge.contract.ts` |
| Attestation test | `apps/erp/src/server/api/__tests__/erp-api-context-bridge.test.ts` |

## 9. Hard Stops

No handler-local tenant/company fallback from URL slugs.

## Related

| Artifact | Path |
| --- | --- |
| Prior slice | [pas-001a-api-binding-s2-erp-rest-binding-consumption.md](./pas-001a-api-binding-s2-erp-rest-binding-consumption.md) |
| Legacy overlap | [pas-001a-r3b-service-actor-context-assembly.md](../../API-CONTRACT/REST/SLICE/pas-001a-r3b-service-actor-context-assembly.md) |
| Next slice | [pas-001a-api-binding-s4-auth-authorization-bridge.md](./pas-001a-api-binding-s4-auth-authorization-bridge.md) |
