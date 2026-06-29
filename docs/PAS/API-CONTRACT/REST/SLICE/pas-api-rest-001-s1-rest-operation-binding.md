# PAS-API-REST-001-S1 — REST Operation Binding

| Slice ID | PAS-API-REST-001-S1 |
| Parent PAS | [PAS-API-REST-001](../PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| Status | **Delivered** |
| Type | Implementation |
| Scope | Map `ApiOperationId` → HTTP method + path (`/api/internal/v1/**`) |
| Prerequisite | [PAS-API-001-S1](../../SLICE/pas-api-001-s1-operation-identity-registry.md) Delivered |

## 0. Purpose

REST binding layer maps family operation identity to **HTTP method and path** without redefining operation identity (PAS-API-001 API-001 · API-002 style binding).

## 2. Owns / Never Owns

| Owns | Never owns |
| --- | --- |
| `rest-operation-binding.contract.ts` | Family registry doctrine |
| Method/path REST binding projection | OpenAPI snapshot editing |
| REST-INV-007 operation binding | Kernel HTTP routing |

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/REST/SLICE/pas-api-rest-001-s1-rest-operation-binding.md
1. Objective    — REST operation binding contract; every registry entry exposes method+path binding to family operation id.
2. Allowed layer— apps/erp/src/server/api/contracts/** · __tests__/
3. Files        —
   apps/erp/src/server/api/contracts/rest-operation-binding.contract.ts
   apps/erp/src/server/api/__tests__/rest-operation-binding.test.ts
   apps/erp/src/server/api/contracts/api-governance.constants.ts
4. Prohibited   — route.ts wiring · hand-edited OpenAPI · kernel · family core doctrine forks
5. Authority    — PAS-API-REST-001 §2.1 · PAS-API-001 API-001 · ADR-0030 §4
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:api-contracts
7. Closes       — DoD #1–#3 · REST-INV-007
8. Evidence     —
   apps/erp/src/server/api/contracts/rest-operation-binding.contract.ts
   apps/erp/src/server/api/__tests__/rest-operation-binding.test.ts
9. Attestation  — Contract · Test
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Every active REST operation has method+path binding under `/api/internal/v1/` | `rest-operation-binding.test.ts` |
| 2 | Binding references family ApiOperationId (no identity fork) | typecheck |
| 3 | REST binding registry is JSON-serializable for catalog pipelines | `rest-operation-binding.test.ts` |

## 7. Evidence (Delivered)

| Artifact | Path |
| --- | --- |
| Binding contract | `apps/erp/src/server/api/contracts/rest-operation-binding.contract.ts` |
| Attestation test | `apps/erp/src/server/api/__tests__/rest-operation-binding.test.ts` |

## 9. Hard Stops

No orphan routes · No identity fork from PAS-API-001 · No HTTP binding logic in `packages/kernel/src/**`.

## Related

| Artifact | Path |
| --- | --- |
| Next slice | [pas-api-rest-001-s2-rest-request-response-schema.md](./pas-api-rest-001-s2-rest-request-response-schema.md) |
| Parent track | [pas-api-rest-001-slice-track.md](./pas-api-rest-001-slice-track.md) |
