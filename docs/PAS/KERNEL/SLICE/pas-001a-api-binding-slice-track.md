# PAS-001A-API-BINDING — slice track index

> **Position:** ERP Integration Spine **consumer** binding · IS-004

**Prerequisite:** [PAS-API-001-S1](../../API-CONTRACT/SLICE/pas-api-001-s1-operation-identity-registry.md) · [PAS-API-REST-001-S1](../../API-CONTRACT/REST/SLICE/pas-api-rest-001-s1-rest-operation-binding.md) in progress

**Parent PAS:** [PAS-001A-API-BINDING](../PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md)

---

| Slice | Handoff | Purpose | Status |
| --- | --- | --- | --- |
| S1 | [pas-001a-api-binding-s1-erp-api-consumption-boundary.md](./pas-001a-api-binding-s1-erp-api-consumption-boundary.md) | ERP consumes API authority | Planned |
| S2 | [pas-001a-api-binding-s2-erp-rest-binding-consumption.md](./pas-001a-api-binding-s2-erp-rest-binding-consumption.md) | internal v1 REST usage | Planned |
| S3 | [pas-001a-api-binding-s3-operating-context-assembly-bridge.md](./pas-001a-api-binding-s3-operating-context-assembly-bridge.md) | IS-002 bridge | Planned |
| S4 | [pas-001a-api-binding-s4-auth-authorization-bridge.md](./pas-001a-api-binding-s4-auth-authorization-bridge.md) | IS-001 bridge | Planned |
| S5 | [pas-001a-api-binding-s5-erp-runtime-evidence.md](./pas-001a-api-binding-s5-erp-runtime-evidence.md) | route/handler proof | Planned |
| S6 | [pas-001a-api-binding-s6-erp-consumer-impact-sync.md](./pas-001a-api-binding-s6-erp-consumer-impact-sync.md) | UI/internal service impact | Planned |
| S7 | [pas-001a-api-binding-s7-erp-release-gate.md](./pas-001a-api-binding-s7-erp-release-gate.md) | no API drift release | Planned |

**Legacy overlap:** [R3b](../../API-CONTRACT/REST/SLICE/pas-001a-r3b-service-actor-context-assembly.md) → S3 service-actor context

---

## Hard stops (track-level)

- Do not place API family doctrine inside PAS-001A
- Do not make ERP Integration Spine owner of REST/OpenAPI family authority
