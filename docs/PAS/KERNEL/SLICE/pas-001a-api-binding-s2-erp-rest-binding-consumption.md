# PAS-001A-API-BINDING-S2 — ERP REST Binding Consumption

| Slice ID | PAS-001A-API-BINDING-S2 |
| Parent PAS | [PAS-001A-API-BINDING](../PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| Status | **Delivered** |
| Type | Implementation |
| Scope | Prove ERP internal v1 routes consume PAS-API-REST-001 registry + handler discipline |
| Prerequisite | [S1 Delivered](./pas-001a-api-binding-s1-erp-api-consumption-boundary.md) · [PAS-API-REST-001-S1/S2](../../API-CONTRACT/REST/SLICE/pas-api-rest-001-s1-rest-operation-binding.md) Delivered |

## 0. Purpose

Prove ERP `apps/erp` internal v1 routes consume **PAS-API-REST-001** registry and handler discipline via IS-004.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-api-binding-s2-erp-rest-binding-consumption.md
1. Objective    — Wire IS-004 to REST binding contracts; attestation that all internal v1 routes reference registry.
2. Allowed layer— apps/erp/src/app/api/internal/v1/** · apps/erp/src/server/api/contracts/** · __tests__/
3. Files        —
   apps/erp/src/server/api/contracts/erp-rest-binding-consumption.contract.ts
   apps/erp/src/server/api/__tests__/erp-rest-binding-consumption.test.ts
   apps/erp/src/server/api/contracts/api-governance.constants.ts
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md (§6.1.3)
   docs/PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md
4. Prohibited   — REST family authority claims in PAS-001A · kernel · new routes
5. Authority    — PAS-001A-API-BINDING §3 · PAS-API-REST-001 · IS-004
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:api-route-catalog
   pnpm check:documentation-drift
7. Closes       — Internal v1 REST consumption typed + route-registry attested
8. Evidence     — erp-rest-binding-consumption.contract.ts · erp-rest-binding-consumption.test.ts · PAS-001A §6.1.3
9. Attestation  — Contract · Test · Documentation
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | All governed routes live under `/api/internal/v1/` | `erp-rest-binding-consumption.test.ts` |
| 2 | Registry REST + schema bindings parity with `API_CONTRACTS` | test |
| 3 | Route coverage matches registry (no orphan routes/contracts) | test |
| 4 | Attestation JSON-serializable | test |

## 7. Evidence (Delivered)

| Artifact | Path |
| --- | --- |
| REST consumption contract | `apps/erp/src/server/api/contracts/erp-rest-binding-consumption.contract.ts` |
| Attestation test | `apps/erp/src/server/api/__tests__/erp-rest-binding-consumption.test.ts` |

## 9. Hard Stops

No REST family authority claims in PAS-001A.

## Related

| Artifact | Path |
| --- | --- |
| Prior slice | [pas-001a-api-binding-s1-erp-api-consumption-boundary.md](./pas-001a-api-binding-s1-erp-api-consumption-boundary.md) |
| Next slice | [pas-001a-api-binding-s3-operating-context-assembly-bridge.md](./pas-001a-api-binding-s3-operating-context-assembly-bridge.md) |
