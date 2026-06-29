# PAS-API family — master slice catalog

| Field | Value |
| --- | --- |
| **Guideline** | [SLICE-BUILDING-GUIDELINE.md](../SLICE-BUILDING-GUIDELINE.md) |
| **Last reviewed** | 2026-06-30 |

---

## Active PAS tracks

| PAS | Slices | Status | Catalog |
| --- | ---: | --- | --- |
| PAS-API-001 | S1–S9 | Delivered | [pas-api-001-slice-catalog.md](./pas-api-001-slice-catalog.md) |
| PAS-API-REST-001 | S1–S10 + R3a–R3d | R3 Delivered · S1–S2 optional | [REST/SLICE/pas-api-rest-001-slice-catalog.md](../REST/SLICE/pas-api-rest-001-slice-catalog.md) |
| PAS-001A-API-BINDING | S1–S7 | Planned | [KERNEL/SLICE/pas-001a-api-binding-slice-catalog.md](../../KERNEL/SLICE/pas-001a-api-binding-slice-catalog.md) |

## Reserved PAS tracks (no Delivered claims)

| PAS | Slices | Status | Catalog |
| --- | ---: | --- | --- |
| PAS-API-RPC-001 | S1–S10 | Reserved | [RPC/SLICE/](../RPC/SLICE/pas-api-rpc-001-slice-catalog.md) |
| PAS-API-GQL-001 | S1–S10 | Reserved | [GRAPHQL/SLICE/](../GRAPHQL/SLICE/pas-api-gql-001-slice-catalog.md) |
| PAS-API-EVENT-001 | S1–S10 | Reserved | [EVENT/SLICE/](../EVENT/SLICE/pas-api-event-001-slice-catalog.md) |
| PAS-API-AGENT-001 | S1–S10 | Reserved | [AGENT/SLICE/](../AGENT/SLICE/pas-api-agent-001-slice-catalog.md) |

---

## Global build order (recommended)

```text
Phase 2: PAS-API-001-S1 … S9 — Delivered
Phase 3: PAS-API-REST-001 R3a–R3d — Delivered (S3–S10 via bundles; S1–S2 optional)
Phase 4: PAS-001A-API-BINDING-S1 … S7
Phase 5: Reserved bindings — ADR trigger only
```

**Next sequence item (platform):** none for API family — optional REST S1–S2 or PAS-001A-API-BINDING S-track
