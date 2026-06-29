# PAS-API-RPC-001 — slice track (Reserved)

| Binding status | **Reserved** — no runtime until ADR + activation |
| Parent PAS | [PAS-API-RPC-001](../PAS-API-RPC-001-GRPC-CONNECT-PROTOBUF-BINDING-STANDARD.md) |
| Catalog | [pas-api-rpc-001-slice-catalog.md](./pas-api-rpc-001-slice-catalog.md) |

| Slice | Handoff | Purpose |
| --- | --- | --- |
| S1 | [pas-api-rpc-001-s1-rpc-operation-binding.md](./pas-api-rpc-001-s1-rpc-operation-binding.md) | Operation → service/method |
| S2 | [pas-api-rpc-001-s2-protobuf-source-authority.md](./pas-api-rpc-001-s2-protobuf-source-authority.md) | `.proto` SSOT |
| S3 | [pas-api-rpc-001-s3-protobuf-evolution-rules.md](./pas-api-rpc-001-s3-protobuf-evolution-rules.md) | field numbers · reserved |
| S4 | [pas-api-rpc-001-s4-typescript-generation-gate.md](./pas-api-rpc-001-s4-typescript-generation-gate.md) | TS matches proto |
| S5 | [pas-api-rpc-001-s5-rpc-metadata-policy.md](./pas-api-rpc-001-s5-rpc-metadata-policy.md) | correlation · actor · context |
| S6 | [pas-api-rpc-001-s6-rpc-error-mapping.md](./pas-api-rpc-001-s6-rpc-error-mapping.md) | RPC → API error doctrine |
| S7 | [pas-api-rpc-001-s7-rpc-validation-boundary.md](./pas-api-rpc-001-s7-rpc-validation-boundary.md) | message validation |
| S8 | [pas-api-rpc-001-s8-rpc-streaming-policy.md](./pas-api-rpc-001-s8-rpc-streaming-policy.md) | streaming modes |
| S9 | [pas-api-rpc-001-s9-rpc-lifecycle-projection.md](./pas-api-rpc-001-s9-rpc-lifecycle-projection.md) | method deprecation |
| S10 | [pas-api-rpc-001-s10-rpc-consumer-contract.md](./pas-api-rpc-001-s10-rpc-consumer-contract.md) | s2s · browser · agent profiles |

**TypeScript rule:** Generated TS is consumer artifact only — never SSOT.

**Hard stop:** Do not implement until binding activation ADR.
