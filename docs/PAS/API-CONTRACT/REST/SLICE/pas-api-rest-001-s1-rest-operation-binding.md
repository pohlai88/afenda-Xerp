# PAS-API-REST-001-S1 — REST Operation Binding

| Slice ID | PAS-API-REST-001-S1 |
| Parent PAS | [PAS-API-REST-001](../PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| Status | Planned |
| Scope | Map `ApiOperationId` → HTTP method + path (`/api/internal/v1/**`) |
| Prerequisite | [PAS-API-001-S1](../../SLICE/pas-api-001-s1-operation-identity-registry.md) |

## 0. Purpose

REST binding layer maps family operation identity to **HTTP method and path** without redefining operation identity.

## 2. Owns / Never Owns

| Owns | Never owns |
| --- | --- |
| `rest-operation-binding.contract.ts` | Family registry doctrine |
| Method/path on registry entries | OpenAPI snapshot editing |

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/REST/SLICE/pas-api-rest-001-s1-rest-operation-binding.md
1. Objective    — REST operation binding contract; every registry entry exposes method+path binding to family operation id.
2. Allowed layer— apps/erp/src/server/api/contracts/** · __tests__/
3. Files        — rest-operation-binding.contract.ts (or extend api-contract.ts) · api-contract-registry.ts · tests
4. Prohibited   — route.ts wiring · hand-edited OpenAPI · kernel
5. Authority    — PAS-API-REST-001 §2.1 · PAS-API-001 API-001
6. Gates        — pnpm --filter @afenda/erp typecheck · pnpm --filter @afenda/erp test:run
7. Closes       — DoD #1–#2
8. Evidence     — binding contract · registry test
9. Attestation  — Contract · Test
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Every active REST operation has method+path binding | test |
| 2 | Binding references family ApiOperationId | typecheck |

## 9. Hard Stops

No orphan routes · No identity fork from PAS-API-001.
