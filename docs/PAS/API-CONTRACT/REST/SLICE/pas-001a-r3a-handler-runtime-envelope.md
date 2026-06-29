# PAS-001A R3a — Handler Runtime + Envelope + Bidirectional Validation

> **Position:** API-CONTRACT R3 slice `1 of 4` · IS-004 REST Contract Runtime

**Prerequisite:** R2 Delivered · ADR-0030 Accepted · [PAS-API-REST-001](../PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) §2.5

**Status:** Planned

**Type:** Implementation

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/REST/SLICE/pas-001a-r3a-handler-runtime-envelope.md

1. Objective    — Prove full createApiHandler pipeline with ingress/egress Zod validation, governed success envelope, and RFC 9457 ProblemDetail errors on all standard HTTP statuses.
2. Allowed layer— apps/erp/src/server/api/runtime/** · apps/erp/src/server/api/contracts/api-envelope.contract.ts · apps/erp/src/server/api/contracts/api-error.contract.ts · apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts · apps/erp/src/server/api/__tests__/api-envelope.test.ts
3. Files        —
   apps/erp/src/server/api/runtime/create-api-handler.ts
   apps/erp/src/server/api/runtime/api-validation.ts
   apps/erp/src/server/api/runtime/api-response.ts
   apps/erp/src/server/api/runtime/api-error.ts
   apps/erp/src/server/api/runtime/api-correlation.ts
   apps/erp/src/server/api/runtime/api-request-context.ts
   apps/erp/src/server/api/runtime/api-handler-audit.ts
   apps/erp/src/server/api/runtime/api-handler-logging.ts
   apps/erp/src/server/api/contracts/api-envelope.contract.ts
   apps/erp/src/server/api/contracts/api-error.contract.ts
   apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts
   apps/erp/src/server/api/__tests__/api-envelope.test.ts
4. Prohibited   — Hand-editing afenda-internal-v1.openapi.json · handler-local operating-context without spine · packages/kernel/src/** · route.ts wiring (R3c)
5. Authority    — PAS-API-REST-001 §2.4 · §2.5 · ADR-0030 §4–§7 · platform-api-contract skill · api-contract North Star I5–I8
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
7. Closes       — Bidirectional validation + envelope + ProblemDetail runtime proof (R3a)
8. Evidence     —
   apps/erp/src/server/api/runtime/create-api-handler.ts
   apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts
   apps/erp/src/server/api/__tests__/api-envelope.test.ts
9. Attestation  — Contract · Test · Security
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Handler rejects invalid request bodies before business logic | `pnpm --filter @afenda/erp test:run` · `api-handler-boundary.test.ts` | North Star ingress · ADR-0030 §7 |
| 2 | Handler rejects invalid response shapes before serialization | `pnpm --filter @afenda/erp test:run` · `api-handler-boundary.test.ts` | North Star egress · API-INV-002 |
| 3 | Success responses use governed envelope with requestId + correlationId | `pnpm --filter @afenda/erp test:run` · `api-envelope.test.ts` | North Star I6 |
| 4 | Error responses use ProblemDetail-class structure | `pnpm --filter @afenda/erp test:run` · `api-envelope.test.ts` | North Star I5 · RFC 9457 |
| 5 | Type safety on handler generic bindings | `pnpm --filter @afenda/erp typecheck` | PAS-API-REST-001 §2.5 |

## Related

| Artifact | Path |
| --- | --- |
| Parent track | [pas-001a-r3-api-contract-runtime.md](./pas-001a-r3-api-contract-runtime.md) |
| Next slice | [pas-001a-r3b-service-actor-context-assembly.md](./pas-001a-r3b-service-actor-context-assembly.md) |
