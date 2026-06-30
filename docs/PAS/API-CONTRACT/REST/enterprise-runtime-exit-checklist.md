# Enterprise Runtime Exit Checklist — REST / OpenAPI Binding

> **Purpose:** Map [Platform API Contract Blueprint §11](../../../BLUEPRINT/api-contract-blueprint.md) Production Accepted → Enterprise Runtime criteria to current evidence. **Does not promote maturity** — attestation only.

| Field | Value |
| --- | --- |
| **Binding PAS** | [PAS-API-REST-001](PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| **Current maturity** | Production Accepted (runtime) |
| **Target maturity** | Enterprise Runtime (not claimed) |
| **Last reviewed** | 2026-06-30 |

---

## Criteria attestation

| # | Blueprint §11 criterion | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Zero orphan governed routes | **Pass** | `pnpm check:api-contracts` — route coverage via `collectRouteBoundaryViolations` · `apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts` |
| 2 | 100% governed errors use ProblemDetail | **Partial** | `apps/erp/src/server/api/__tests__/api-envelope.test.ts` · `api-exception.contract.test.ts` — governed error doctrine attested; full runtime sweep on every route not exhaustively proven in CI |
| 3 | 100% governed success responses use envelope with correlation | **Pass** | `apps/erp/src/server/api/__tests__/api-envelope.test.ts` · `assertRegistryCorrelationPolicy` in `api-audit-replay.contract.test.ts` |
| 4 | Audit replay minimum attested | **Pass** | `apps/erp/src/server/api/__tests__/api-audit-replay.contract.test.ts` — `buildAuditReplayMinimumRecord` on registry operations |
| 5 | Service-actor policy attested where applicable | **Pass** | [ADR-0034](../../../adr/ADR-0034-service-actor-production-policy-attestation.md) — zero `service-token-required` routes · `assertApiRouteAuthPolicy` in `create-api-handler.ts` · `pnpm check:erp-service-actor-s2s-attestation` · `api-handler-boundary.test.ts` forged-S2S Prove-It · `erp-api-auth-bridge` contract attestation |
| 6 | Breaking-change classification on contract diffs | **Partial** | `apps/erp/src/server/api/contracts/core/api-consumer-impact.contract.ts` · lifecycle/stability fields on registry — automated diff gate on PR not yet dedicated |
| 7 | Consumer impact declared on deprecated/breaking operations | **Pass** | `apps/erp/src/server/api/__tests__/api-consumer-impact-ownership.test.ts` — `assertRegistryConsumerImpactPolicy` |
| 8 | Operation ownership metadata enforced in PAS | **Pass** | `apps/erp/src/server/api/__tests__/api-consumer-impact-ownership.test.ts` — `assertActiveOperationOwnership` · `buildOperationOwnershipRegistry` |

---

## Summary

| Status | Count |
| --- | ---: |
| Pass | 5 |
| Partial | 2 |
| Open | 0 |

**Enterprise Runtime promotion blocked by:** criteria 2 and 6 (Partial) — not criterion 5. Machine S2S REST production remains **not offered** per [ADR-0034](../../../adr/ADR-0034-service-actor-production-policy-attestation.md) until crypto verification ADR + `service-token-required` routes.

---

## References

- [api-contract-blueprint.md §11](../../../BLUEPRINT/api-contract-blueprint.md)
- [PAS-API-REST-001](PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md)
- [ADR-0034 — Service-Actor Production Policy Attestation](../../../adr/ADR-0034-service-actor-production-policy-attestation.md)
- [ADR-0033 — S2S token verification deferred (superseded)](../../../adr/ADR-0033-service-actor-s2s-token-verification-deferred.md)
