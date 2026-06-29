# Platform API Contract slice handoffs (REST binding)

| Field | Value |
| --- | --- |
| **Catalog** | [api-contract-slice-catalog.md](./api-contract-slice-catalog.md) |
| **Root PAS** | [PAS-API-001](../../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **REST binding** | [PAS-API-REST-001](../PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| **Closure registry** | [pas-status-index.md](../../../pas-status-index.md) |
| **Last reviewed** | 2026-06-30 |

---

## Build order

```text
R3 track: R3 (index) → R3a → R3b → R3c → R3d
```

**Prerequisite (KERNEL):** [R2 S2S attestation](../../../KERNEL/SLICE/pas-001a-r2-service-actor-s2s-attestation.md) Delivered

---

## R3 track

| Slice | Handoff | Status |
| --- | --- | --- |
| R3 | [pas-001a-r3-api-contract-runtime.md](./pas-001a-r3-api-contract-runtime.md) | **Planned** (track index) |
| R3a | [pas-001a-r3a-handler-runtime-envelope.md](./pas-001a-r3a-handler-runtime-envelope.md) | **Planned** |
| R3b | [pas-001a-r3b-service-actor-context-assembly.md](./pas-001a-r3b-service-actor-context-assembly.md) | **Planned** |
| R3c | [pas-001a-r3c-route-coverage-drift-attestation.md](./pas-001a-r3c-route-coverage-drift-attestation.md) | **Planned** |
| R3d | [pas-001a-r3d-governance-metadata-closure.md](./pas-001a-r3d-governance-metadata-closure.md) | **Planned** |

**Next implementable slice:** R3a
