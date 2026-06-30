# Enterprise Runtime Exit Checklist — REST / OpenAPI Binding

> **Purpose:** Map [Platform API Contract Blueprint §11](../../../BLUEPRINT/api-contract-blueprint.md) Production Accepted → Enterprise Runtime criteria to current evidence. **Does not promote maturity** — attestation only.

| Field | Value |
| --- | --- |
| **Binding PAS** | [PAS-API-REST-001](PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| **Current maturity** | Production Accepted (runtime) |
| **Target maturity** | Enterprise Runtime (attested 2026-06-30) |
| **Last reviewed** | 2026-06-30 |

---

## Criteria attestation

| # | Blueprint §11 criterion | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Zero orphan governed routes | **Pass** | `pnpm check:api-contracts` — route coverage via `collectRouteBoundaryViolations` · `apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts` |
| 2 | 100% governed errors use ProblemDetail | **Pass** | `pnpm check:api-problemdetail-runtime-attestation` · `api-envelope.test.ts` · `api-problemdetail-runtime-attestation.test.ts` · `create-api-handler.ts` → `jsonErrorResponse` · `projectProblemDetailClass` on all `API_ERROR_CODES` |
| 3 | 100% governed success responses use envelope with correlation | **Pass** | `apps/erp/src/server/api/__tests__/api-envelope.test.ts` · `assertRegistryCorrelationPolicy` in `api-audit-replay.contract.test.ts` |
| 4 | Audit replay minimum attested | **Pass** | `apps/erp/src/server/api/__tests__/api-audit-replay.contract.test.ts` — `buildAuditReplayMinimumRecord` on registry operations |
| 5 | Service-actor policy attested where applicable | **Pass** | [ADR-0035](../../../adr/ADR-0035-internal-v1-service-actor-bearer-verification.md) · [ADR-0036](../../../adr/ADR-0036-machine-s2s-production-activation.md) — `verifyServiceActorS2sBearerToken` · `GET /api/internal/v1/auth/service-actor/ping` · `service-actor-ping.integration.test.ts` · `assertApiRouteAuthPolicy` in `create-api-handler.ts` · `pnpm check:erp-service-actor-s2s-attestation` · `api-handler-boundary.test.ts` service-token Prove-It · `erp-api-auth-bridge` contract attestation |
| 6 | Breaking-change classification on contract diffs | **Pass** | `pnpm check:api-breaking-change-registry` · `api-breaking-change-registry.snapshot.json` · `buildBreakingChangeRegistryDocument` · `api-lifecycle.contract.ts` · `api-consumer-impact.contract.ts` |
| 7 | Consumer impact declared on deprecated/breaking operations | **Pass** | `apps/erp/src/server/api/__tests__/api-consumer-impact-ownership.test.ts` — `assertRegistryConsumerImpactPolicy` |
| 8 | Operation ownership metadata enforced in PAS | **Pass** | `apps/erp/src/server/api/__tests__/api-consumer-impact-ownership.test.ts` — `assertActiveOperationOwnership` · `buildOperationOwnershipRegistry` |

---

## Summary

| Status | Count |
| --- | ---: |
| Pass | 7 |
| Partial | 0 |
| Open | 0 |

**Enterprise Runtime promotion:** criteria 1–8 attested **Pass** as of 2026-06-30 (machine S2S activated per [ADR-0036](../../../adr/ADR-0036-machine-s2s-production-activation.md)).

---

## References

- [api-contract-blueprint.md §11](../../../BLUEPRINT/api-contract-blueprint.md)
- [PAS-API-REST-001](PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md)
- [ADR-0036 — Machine S2S Production Activation](../../../adr/ADR-0036-machine-s2s-production-activation.md)
- [ADR-0035 — Internal v1 Service-Actor Bearer Verification](../../../adr/ADR-0035-internal-v1-service-actor-bearer-verification.md)
- [ADR-0034 — Service-Actor Production Policy Attestation (machine policy superseded)](../../../adr/ADR-0034-service-actor-production-policy-attestation.md)
- [ADR-0033 — S2S token verification deferred (superseded)](../../../adr/ADR-0033-service-actor-s2s-token-verification-deferred.md)
