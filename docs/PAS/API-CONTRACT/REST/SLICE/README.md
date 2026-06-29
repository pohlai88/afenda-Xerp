# REST / OpenAPI slice handoffs

| REST binding PAS | [PAS-API-REST-001](../PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| S-series track | [pas-api-rest-001-slice-track.md](./pas-api-rest-001-slice-track.md) |
| S-series catalog | [pas-api-rest-001-slice-catalog.md](./pas-api-rest-001-slice-catalog.md) |
| Guideline | [SLICE-BUILDING-GUIDELINE.md](../../SLICE-BUILDING-GUIDELINE.md) |

---

## Build order

**Canonical:** S1 → S2 → … → S10

**Legacy ERP bundles:** R3a → R3b → R3c → R3d (see [track mapping](./pas-api-rest-001-slice-track.md))

**Next implementable:** none — S-track S1–S2 and R3 closed

---

## S-series track

| Slice | Handoff | Status |
| --- | --- | --- |
| S1 | [pas-api-rest-001-s1-rest-operation-binding.md](./pas-api-rest-001-s1-rest-operation-binding.md) | Delivered |
| S2 | [pas-api-rest-001-s2-rest-request-response-schema.md](./pas-api-rest-001-s2-rest-request-response-schema.md) | Delivered |
| S3–S10 | [pas-api-rest-001-slice-track.md](./pas-api-rest-001-slice-track.md) | Delivered (R3 bundles) |

## R3 legacy track

| Slice | Handoff | Status |
| --- | --- | --- |
| R3 | [pas-001a-r3-api-contract-runtime.md](./pas-001a-r3-api-contract-runtime.md) | Delivered |
| R3a | [pas-001a-r3a-handler-runtime-envelope.md](./pas-001a-r3a-handler-runtime-envelope.md) | Delivered |
| R3b | [pas-001a-r3b-service-actor-context-assembly.md](./pas-001a-r3b-service-actor-context-assembly.md) | Delivered |
| R3c | [pas-001a-r3c-route-coverage-drift-attestation.md](./pas-001a-r3c-route-coverage-drift-attestation.md) | Delivered |
| R3d | [pas-001a-r3d-governance-metadata-closure.md](./pas-001a-r3d-governance-metadata-closure.md) | Delivered |
