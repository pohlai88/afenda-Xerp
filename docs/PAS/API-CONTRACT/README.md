# Platform API Contract PAS Family

| Field | Value |
| --- | --- |
| **Scope** | Platform API Contract — permanent exposure governance across API styles |
| **North Star** | [api-contract-north-star.md](../../NORTHSTAR/api-contract-north-star.md) |
| **Blueprint** | [api-contract-blueprint.md](../../BLUEPRINT/api-contract-blueprint.md) |
| **Authority ADR** | [ADR-0030](../../adr/ADR-0030-erp-rest-api-contract-standard.md) (REST binding) |
| **Closure registry** | [pas-status-index.md](../pas-status-index.md) |
| **Last reviewed** | 2026-06-30 |

> **One sentence:** PAS-API-001 owns cross-style API exposure authority; REST, RPC, GraphQL, Event, and Agent bindings implement style-specific proof; ERP Integration Spine consumes active bindings — it does not own API doctrine.

---

## Constitutional chain

```text
Platform North Star
        ↓
Platform API Contract North Star
        ↓
Platform API Contract Blueprint
        ↓
PAS-API-001 — Platform API Contract Authority
        ↓
API Style Binding PAS
        ├── PAS-API-REST-001 (Active)
        ├── PAS-API-RPC-001 (Reserved)
        ├── PAS-API-GQL-001 (Reserved)
        ├── PAS-API-EVENT-001 (Reserved)
        └── PAS-API-AGENT-001 (Reserved)
        ↓
PAS-001A-API-BINDING — ERP Integration Spine consumption
        ↓
Code (apps/erp/src/server/api/**)
```

**Cross-domain dependency:** [PAS-001A](../KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) IS-001–IS-003 — consumed, not owned here.

---

## Family index

| PAS ID | Document | Status | Slices |
| --- | --- | --- | --- |
| **PAS-API-001** | [PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md](PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) | Production Accepted (family doctrine) | — |
| **PAS-API-REST-001** | [REST/PAS-API-REST-001](REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) | Production Accepted (runtime) | [R3a–R3d Delivered](REST/SLICE/README.md) |
| **PAS-API-RPC-001** | [RPC/PAS-API-RPC-001](RPC/PAS-API-RPC-001-GRPC-CONNECT-PROTOBUF-BINDING-STANDARD.md) | Reserved | — |
| **PAS-API-GQL-001** | [GRAPHQL/PAS-API-GQL-001](GRAPHQL/PAS-API-GQL-001-GRAPHQL-BINDING-STANDARD.md) | Reserved | — |
| **PAS-API-EVENT-001** | [EVENT/PAS-API-EVENT-001](EVENT/PAS-API-EVENT-001-EVENT-API-BINDING-STANDARD.md) | Reserved | — |
| **PAS-API-AGENT-001** | [AGENT/PAS-API-AGENT-001](AGENT/PAS-API-AGENT-001-AGENT-TOOL-API-BINDING-STANDARD.md) | Reserved | — |
| **PAS-001A-API-BINDING** | [KERNEL consumption doc](../KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) | Active | — |

**Agent skills:** `afenda-openapi` · `platform-api-contract` · `/afenda-coding-session`

**Slice guideline:** [SLICE-BUILDING-GUIDELINE.md](SLICE-BUILDING-GUIDELINE.md) · **Master catalog:** [SLICE/pas-api-family-slice-catalog.md](SLICE/pas-api-family-slice-catalog.md)

---

## Agent read order

```text
1. api-contract North Star §1–§12 (business dispute only)
2. [SLICE-BUILDING-GUIDELINE.md](SLICE-BUILDING-GUIDELINE.md)
3. PAS-API-001 §1–§4 + [S-track](SLICE/pas-api-001-slice-track.md)
4. Active REST binding + [S-track / R3](REST/SLICE/pas-api-rest-001-slice-track.md)
5. PAS-001A-API-BINDING + [S-track](../KERNEL/SLICE/pas-001a-api-binding-slice-track.md)
6. Copy 9-field handoff → `/afenda-coding-session` Phase 0
7. afenda-openapi skill → Code
```

**Do not** nest API family doctrine inside PAS-001A or ERP Integration Spine.

---

## Related

| Artifact | Path |
| --- | --- |
| ERP Integration Spine | [PAS-001A](../KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| ERP API consumption | [PAS-001A-API-BINDING](../KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| REST slice catalog | [REST/SLICE/api-contract-slice-catalog.md](REST/SLICE/api-contract-slice-catalog.md) |
| PAS index | [docs/PAS/README.md](../README.md) |

**Legacy:** Former root doc `PAS-001A-API-CONTRACT-RUNTIME-STANDARD.md` superseded by PAS-API-001 + PAS-API-REST-001 (2026-06-30).
