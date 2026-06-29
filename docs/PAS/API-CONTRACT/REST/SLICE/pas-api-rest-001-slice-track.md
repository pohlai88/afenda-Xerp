# PAS-API-REST-001 — slice track index

> **Position:** PAS-API-REST-001 style binding · Blueprint box: **REST binding** · IS-004 consumer: ERP

**Prerequisite:** [PAS-API-001-S1](../SLICE/pas-api-001-s1-operation-identity-registry.md) in progress or Delivered · [ADR-0030](../../../adr/ADR-0030-erp-rest-api-contract-standard.md)

**Status:** Production Accepted (R3a–R3d Delivered · IS-004 runtime) · S-track S1–S2 remain optional formal slices

---

## S-series track (canonical)

| Slice | Handoff | Closes | Status |
| --- | --- | --- | --- |
| S1 | [pas-api-rest-001-s1-rest-operation-binding.md](./pas-api-rest-001-s1-rest-operation-binding.md) | REST-INV path/method map | Planned |
| S2 | [pas-api-rest-001-s2-rest-request-response-schema.md](./pas-api-rest-001-s2-rest-request-response-schema.md) | Schema-first REST modules | Planned |
| S3 | [pas-api-rest-001-s3-rest-handler-runtime.md](./pas-api-rest-001-s3-rest-handler-runtime.md) | createApiHandler | Delivered (R3a) |
| S4 | [pas-api-rest-001-s4-rest-ingress-validation.md](./pas-api-rest-001-s4-rest-ingress-validation.md) | Ingress Zod | Delivered (R3a) |
| S5 | [pas-api-rest-001-s5-rest-egress-validation.md](./pas-api-rest-001-s5-rest-egress-validation.md) | Egress Zod | Delivered (R3a) |
| S6 | [pas-api-rest-001-s6-rest-error-mapping.md](./pas-api-rest-001-s6-rest-error-mapping.md) | ProblemDetail | Delivered (R3a) |
| S7 | [pas-api-rest-001-s7-openapi-publication.md](./pas-api-rest-001-s7-openapi-publication.md) | OpenAPI 3.1 gen | Delivered (R3c) |
| S8 | [pas-api-rest-001-s8-openapi-drift-gate.md](./pas-api-rest-001-s8-openapi-drift-gate.md) | Drift attestation | Delivered (R3c) |
| S9 | [pas-api-rest-001-s9-rest-route-coverage-gate.md](./pas-api-rest-001-s9-rest-route-coverage-gate.md) | Orphan route ban | Delivered (R3c) |
| S10 | [pas-api-rest-001-s10-rest-lifecycle-projection.md](./pas-api-rest-001-s10-rest-lifecycle-projection.md) | Deprecation in OpenAPI | Delivered (R3d) |

**Order:** S1 → S2 → S3 → … → S10

---

## Legacy R3 implementation bundles (still valid)

Parallel **implementation bundles** for ERP closure — map to S-series:

| R3 bundle | Maps to S-series | Handoff | Status |
| --- | --- | --- | --- |
| R3a | S3 · S4 · S5 · S6 | [pas-001a-r3a-handler-runtime-envelope.md](./pas-001a-r3a-handler-runtime-envelope.md) | Delivered |
| R3b | ERP binding S3 | [pas-001a-r3b-service-actor-context-assembly.md](./pas-001a-r3b-service-actor-context-assembly.md) | Delivered |
| R3c | S7 · S8 · S9 | [pas-001a-r3c-route-coverage-drift-attestation.md](./pas-001a-r3c-route-coverage-drift-attestation.md) | Delivered |
| R3d | S10 · PAS-API-001 S7 | [pas-001a-r3d-governance-metadata-closure.md](./pas-001a-r3d-governance-metadata-closure.md) | Delivered |

**Track index:** [pas-001a-r3-api-contract-runtime.md](./pas-001a-r3-api-contract-runtime.md)

**Rule:** New sessions may use **either** S-series handoff **or** R3 bundle when mapped — not both in one Phase 0 without orchestrator merge.

---

## Runtime surfaces

```text
apps/erp/src/server/api/contracts/**
apps/erp/src/server/api/runtime/**
apps/erp/src/server/api/contracts/openapi/**
apps/erp/src/app/api/internal/v1/**/route.ts
scripts/api-contract/**
```
