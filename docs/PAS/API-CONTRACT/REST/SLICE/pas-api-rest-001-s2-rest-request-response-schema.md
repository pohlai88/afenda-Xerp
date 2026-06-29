# PAS-API-REST-001-S2 — REST Request / Response Schema

| Slice ID | PAS-API-REST-001-S2 |
| Parent PAS | [PAS-API-REST-001](../PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| Status | **Delivered** |
| Type | Implementation |
| Scope | Schema-first Zod modules per REST operation (PAS-API-001 API-003 at REST binding) |
| Prerequisite | [S1 Delivered](./pas-api-rest-001-s1-rest-operation-binding.md) |

## 0. Purpose

Schema-first **Zod** request/response modules per REST operation — implements PAS-API-001 API-003 at the REST style binding without duplicating family schema authority.

## 2. Owns / Never Owns

| Owns | Never owns |
| --- | --- |
| `rest-schema-binding.contract.ts` | Family `api-validation.contract.ts` doctrine |
| REST `*.api-contract.ts` module ref validation | OpenAPI generator internals |
| REST-INV-008 schema module binding | Enterprise Knowledge definitions |

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/REST/SLICE/pas-api-rest-001-s2-rest-request-response-schema.md
1. Objective    — Standardize REST schema binding; link *.api-contract.ts Zod modules to family schema authority refs.
2. Allowed layer— apps/erp/src/server/api/contracts/** · __tests__/
3. Files        —
   apps/erp/src/server/api/contracts/rest-schema-binding.contract.ts
   apps/erp/src/server/api/__tests__/rest-schema-binding.test.ts
   apps/erp/src/server/api/contracts/api-governance.constants.ts
4. Prohibited   — handler runtime · OpenAPI hand edits · kernel
5. Authority    — PAS-API-001-S2 · PAS-API-REST-001 §2.2 · API-003 declared-before-runtime
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:api-contracts
7. Closes       — DoD #1–#3 · REST-INV-008
8. Evidence     —
   apps/erp/src/server/api/contracts/rest-schema-binding.contract.ts
   apps/erp/src/server/api/__tests__/rest-schema-binding.test.ts
9. Attestation  — Contract · Test
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Every REST operation declares valid `*.api-contract.ts` or `*.contract.ts` schema module refs | `rest-schema-binding.test.ts` |
| 2 | REST bindings link to family declared-before-runtime authority | `rest-schema-binding.test.ts` |
| 3 | Schema binding metadata is JSON-serializable | `rest-schema-binding.test.ts` |

## 7. Evidence (Delivered)

| Artifact | Path |
| --- | --- |
| Schema binding contract | `apps/erp/src/server/api/contracts/rest-schema-binding.contract.ts` |
| Attestation test | `apps/erp/src/server/api/__tests__/rest-schema-binding.test.ts` |

## 9. Hard Stops

Schemas are not Enterprise Knowledge definitions · No OpenAPI component paths in schema refs · No style-specific paths in family layer.

## Related

| Artifact | Path |
| --- | --- |
| Prior slice | [pas-api-rest-001-s1-rest-operation-binding.md](./pas-api-rest-001-s1-rest-operation-binding.md) |
| Next slice | [pas-api-rest-001-s3-rest-handler-runtime.md](./pas-api-rest-001-s3-rest-handler-runtime.md) |
| Parent track | [pas-api-rest-001-slice-track.md](./pas-api-rest-001-slice-track.md) |
