# PAS-001A-API-BINDING — ERP Integration Spine API Consumption

> **Consumer binding only** — [PAS-001A](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) consumes [PAS-API-001](../API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) and active style bindings; **does not own** API family doctrine.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-001A-API-BINDING |
| **Document title** | ERP Integration Spine API Consumption Binding |
| **Document class** | `consumer_binding_standard` |
| **Document role** | `erp_integration_spine_api_consumption` |
| **Parent PAS** | [PAS-001A](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| **Consumes** | [PAS-API-001](../API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Active style binding** | [PAS-API-REST-001](../API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| **Integration surface** | IS-004 — REST Contract Runtime |
| **Runtime owner** | `apps/erp/src/server/api/` + `apps/erp/src/lib/context/` |
| **Maturity** | Production Candidate (REST scaffold; R3a–R3d Planned) |
| **Last reviewed** | 2026-06-30 |

> **One sentence:** ERP Integration Spine consumes Platform API Contract authority and the active REST binding for internal v1 proof — owning operating-context assembly and runtime wiring, not permanent API exposure doctrine.

---

# 1. Consumption Model

```text
PAS-API-001 (family invariants)
        ↓
PAS-API-REST-001 (active REST/OpenAPI binding)
        ↓
PAS-001A-API-BINDING (this document — ERP consumer)
        ↓
PAS-001A IS-001–IS-004 (integration surfaces)
        ↓
apps/erp runtime
```

**At current maturity:** ERP Integration Spine consumes **PAS-API-REST-001** for internal v1 REST exposure.

**Future:** RPC/gRPC/Connect usage consumes [PAS-API-RPC-001](../API-CONTRACT/RPC/PAS-API-RPC-001-GRPC-CONNECT-PROTOBUF-BINDING-STANDARD.md) when activated — not before ADR + slice approval.

---

# 2. Owns vs Consumes

| ERP Integration Spine owns | ERP Integration Spine consumes |
| --- | --- |
| Operating context assembly (IS-002) | Operation identity (PAS-API-001) |
| Permission scope wiring (IS-001) | Registry-first exposure policy |
| Service-actor S2S scaffold (R2) | REST path/OpenAPI binding rules |
| Protected shell integration (R1) | Schema validation pipeline |
| Runtime wiring proof on `apps/erp` | Lifecycle and ownership metadata rules |

| ERP Integration Spine never owns |
| --- |
| API family doctrine |
| Cross-style invariants |
| OpenAPI as sole publication truth |
| GraphQL / event / agent bindings |

---

# 3. IS-004 Integration Surface

| Field | Value |
| --- | --- |
| **ID** | IS-004 |
| **Name** | REST Contract Runtime |
| **Authority PAS** | [PAS-API-REST-001](../API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| **Slice track** | [S1–S7](./SLICE/pas-001a-api-binding-slice-track.md) · legacy [R3](../API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md) |
| **Primary gates** | `check:api-contracts` · `check:openapi-drift` (Planned at R3c) |

---

# 4. Slice Catalog

| Track | [KERNEL/SLICE/pas-001a-api-binding-slice-track.md](SLICE/pas-001a-api-binding-slice-track.md) |
| Catalog | [KERNEL/SLICE/pas-001a-api-binding-slice-catalog.md](SLICE/pas-001a-api-binding-slice-catalog.md) |

| Slice | Handoff | Status |
| --- | --- | --- |
| S1 | [pas-001a-api-binding-s1-erp-api-consumption-boundary.md](SLICE/pas-001a-api-binding-s1-erp-api-consumption-boundary.md) | Planned |
| S2 | [pas-001a-api-binding-s2-erp-rest-binding-consumption.md](SLICE/pas-001a-api-binding-s2-erp-rest-binding-consumption.md) | Planned |
| S3 | [pas-001a-api-binding-s3-operating-context-assembly-bridge.md](SLICE/pas-001a-api-binding-s3-operating-context-assembly-bridge.md) | Planned |
| S4 | [pas-001a-api-binding-s4-auth-authorization-bridge.md](SLICE/pas-001a-api-binding-s4-auth-authorization-bridge.md) | Planned |
| S5 | [pas-001a-api-binding-s5-erp-runtime-evidence.md](SLICE/pas-001a-api-binding-s5-erp-runtime-evidence.md) | Planned |
| S6 | [pas-001a-api-binding-s6-erp-consumer-impact-sync.md](SLICE/pas-001a-api-binding-s6-erp-consumer-impact-sync.md) | Planned |
| S7 | [pas-001a-api-binding-s7-erp-release-gate.md](SLICE/pas-001a-api-binding-s7-erp-release-gate.md) | Planned |

**Remaining slices:** S1 → S7 Planned

---

# 5. Hard Stops

- Do not amend PAS-API-001 invariants from PAS-001A — escalate to API-CONTRACT family
- Do not claim API Contract family Delivered from ERP spine closure alone
- Do not introduce RPC/GraphQL/event/agent runtime without corresponding binding PAS activation

---

# 6. References

| Artifact | Path |
| --- | --- |
| ERP Integration Spine | [PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| API family root | [PAS-API-001](../API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| REST binding | [PAS-API-REST-001](../API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| Blueprint | [api-contract-blueprint.md](../../BLUEPRINT/api-contract-blueprint.md) |

**Provenance:** Created 2026-06-30 — separates ERP consumer proof from Platform API Contract family authority.
