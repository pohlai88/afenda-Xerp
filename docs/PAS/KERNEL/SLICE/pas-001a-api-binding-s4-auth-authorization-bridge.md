# PAS-001A-API-BINDING-S4 — Auth and Authorization Bridge

| Slice ID | PAS-001A-API-BINDING-S4 |
| Parent PAS | [PAS-001A-API-BINDING](../PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| Status | **Delivered** |
| Type | Implementation |
| Scope | Bridge IS-004 API-006/API-008 declarations to IS-001 identity + permission spine |
| Prerequisite | [S3 Delivered](./pas-001a-api-binding-s3-operating-context-assembly-bridge.md) · PAS-API-001-S4 Delivered |

## 0. Purpose

ERP API runtime invokes **identity** and **permission evaluation** — contract layer only declares policy (PAS-API-001 API-006/API-008).

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-api-binding-s4-auth-authorization-bridge.md
1. Objective    — erp-api-auth-bridge.contract.ts; API-006/API-008 declaration ↔ IS-001 runtime attestation.
2. Allowed layer— apps/erp/src/server/api/contracts/** · __tests__/
3. Files        —
   apps/erp/src/server/api/contracts/erp-api-auth-bridge.contract.ts
   apps/erp/src/server/api/__tests__/erp-api-auth-bridge.test.ts
   apps/erp/src/server/api/contracts/api-governance.constants.ts
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md (§6.1.3)
   docs/PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md
4. Prohibited   — Permission evaluation in contract modules · kernel auth runtime edits
5. Authority    — PAS-001A IS-001 · PAS-API-001 API-006 · API-008
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:erp-auth-actor-protected-path-attestation
   pnpm check:erp-service-actor-s2s-attestation
   pnpm check:documentation-drift
7. Closes       — Auth/authorization declaration bridge typed + attested
8. Evidence     — erp-api-auth-bridge.contract.ts · erp-api-auth-bridge.test.ts · PAS-001A §6.1.3
9. Attestation  — Contract · Test · Auth actor gate
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Public operations declare no permission policy | `erp-api-auth-bridge.test.ts` |
| 2 | Protected operations declare API-006 actor + API-008 intent | test |
| 3 | Family registry policy declarations remain consistent | test |
| 4 | IS-001 auth actor + S2S gates green | `check:erp-auth-actor-protected-path-attestation` · `check:erp-service-actor-s2s-attestation` |
| 5 | Attestation JSON-serializable | test |

## 7. Evidence (Delivered)

| Artifact | Path |
| --- | --- |
| Auth bridge contract | `apps/erp/src/server/api/contracts/erp-api-auth-bridge.contract.ts` |
| Attestation test | `apps/erp/src/server/api/__tests__/erp-api-auth-bridge.test.ts` |

## 9. Hard Stops

API contracts declare permission intent; authorization package evaluates.

## Related

| Artifact | Path |
| --- | --- |
| Prior slice | [pas-001a-api-binding-s3-operating-context-assembly-bridge.md](./pas-001a-api-binding-s3-operating-context-assembly-bridge.md) |
| Next slice | [pas-001a-api-binding-s5-erp-runtime-evidence.md](./pas-001a-api-binding-s5-erp-runtime-evidence.md) |
