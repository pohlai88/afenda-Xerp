# PAS-001A-API-BINDING-S5 — ERP Runtime Evidence

| Slice ID | PAS-001A-API-BINDING-S5 |
| Parent PAS | [PAS-001A-API-BINDING](../PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| Status | **Delivered** |
| Type | Evidence-sync |
| Scope | Composite route + handler + context + auth + audit proof for IS-004 Production Accepted |
| Prerequisite | [S4 Delivered](./pas-001a-api-binding-s4-auth-authorization-bridge.md) · [R3c/R3d](../../API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md) Delivered |

## 0. Purpose

Attest route + handler + context + audit proof for IS-004 Production Accepted.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-api-binding-s5-erp-runtime-evidence.md
1. Objective    — erp-api-runtime-evidence.contract.ts; composite S1–S4 + R3c/R3d runtime attestation.
2. Allowed layer— apps/erp/src/server/api/contracts/** · __tests__/
3. Files        —
   apps/erp/src/server/api/contracts/erp-api-runtime-evidence.contract.ts
   apps/erp/src/server/api/__tests__/erp-api-runtime-evidence.test.ts
   apps/erp/src/server/api/contracts/api-governance.constants.ts
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md (§6.1.3)
   docs/PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md
4. Prohibited   — New API meaning · registry bypass · hand-edited OpenAPI
5. Authority    — PAS-001A IS-004 · PAS-API-REST-001 · R3c · R3d
6. Gates        —
   pnpm check:api-contracts
   pnpm check:openapi-drift
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:documentation-drift
7. Closes       — IS-004 Production Accepted runtime evidence bundle at ERP binding layer
8. Evidence     — erp-api-runtime-evidence.contract.ts · erp-api-runtime-evidence.test.ts · PAS-001A §6.1.3
9. Attestation  — Contract · Test · Gate bundle
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | S1–S4 binding violations empty in composite collector | `erp-api-runtime-evidence.test.ts` |
| 2 | All governed routes use `createApiHandler` | test |
| 3 | Active operations require correlation; mutations declare audit | test |
| 4 | Full R3 gate bundle green | `check:api-contracts` · `check:openapi-drift` |
| 5 | Attestation JSON-serializable | test |

## 7. Evidence (Delivered)

| Artifact | Path |
| --- | --- |
| Runtime evidence contract | `apps/erp/src/server/api/contracts/erp-api-runtime-evidence.contract.ts` |
| Composite attestation test | `apps/erp/src/server/api/__tests__/erp-api-runtime-evidence.test.ts` |

## 9. Hard Stops

Evidence sync only — no new API meaning.

## Related

| Artifact | Path |
| --- | --- |
| Prior slice | [pas-001a-api-binding-s4-auth-authorization-bridge.md](./pas-001a-api-binding-s4-auth-authorization-bridge.md) |
| Legacy bundle | [pas-001a-r3c-route-coverage-drift-attestation.md](../../API-CONTRACT/REST/SLICE/pas-001a-r3c-route-coverage-drift-attestation.md) · [pas-001a-r3d-governance-metadata-closure.md](../../API-CONTRACT/REST/SLICE/pas-001a-r3d-governance-metadata-closure.md) |
| Next slice | [pas-001a-api-binding-s6-erp-consumer-impact-sync.md](./pas-001a-api-binding-s6-erp-consumer-impact-sync.md) |
