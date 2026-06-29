# PAS-API-RPC-001 — gRPC / Connect / Protobuf Binding Standard

> **Style binding under:** [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · **Status: Reserved** — doctrine only; no runtime until ADR + slice

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-API-RPC-001 |
| **Maturity** | Planned (reserved) |
| **Authority status** | `planned` |
| **Last reviewed** | 2026-06-30 |

---

# 1. Binding Scope (when activated)

| Area | Authority |
| --- | --- |
| `.proto` service definitions | RPC service/method/message contract |
| Protobuf message evolution | Field numbering, reserved fields, compatibility |
| TypeScript generation | Generated TS clients and message types (consumer artifacts only) |
| Server-to-server RPC | Internal service RPC profile |
| Browser-compatible RPC | Connect / gRPC-web profile if adopted |
| RPC error mapping | Canonical RPC errors mapped to PAS-API-001 error doctrine |
| RPC metadata | Correlation, actor, context, idempotency metadata |
| Streaming policy | Unary, server-streaming, client-streaming, bidirectional |
| RPC drift gate | Generated TS output matches `.proto` source |
| RPC lifecycle | Service/method/message deprecation and retirement |

---

# 2. Hard Stops

- Generated TypeScript from `.proto` is a **consumer artifact** — never source of truth
- Source of truth: PAS-API-001 registry identity + RPC binding `.proto` + generation gate
- Do not duplicate REST DTOs and Protobuf messages without mapping ownership
- Do not bypass PAS-API-001 lifecycle because RPC feels internal
- Do not allow `.proto` files without registry operation identity

---

# 3. Recommended Profiles (future)

| Profile | Use |
| --- | --- |
| `rpc-internal-s2s` | Server-to-server typed calls |
| `rpc-browser-compatible` | Connect / gRPC-web clients |
| `rpc-streaming` | Long-running machine streams |
| `rpc-agent-tooling` | Typed agent/tool execution if approved |

**Stance:** Use RPC for typed internal S2S, high-throughput machine calls, and streaming — not to replace every REST endpoint.

---

# 4. References

| Artifact | Path |
| --- | --- |
| Root authority | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| REST binding (active) | [PAS-API-REST-001](../REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
