# REST / OpenAPI API Style Binding

| Field | Value |
| --- | --- |
| **Binding PAS** | [PAS-API-REST-001](PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| **Parent** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Status** | **Production Accepted (runtime)** — internal v1 REST on `apps/erp` |
| **Slices** | [SLICE/](SLICE/README.md) — S1–S2 **Delivered** · R3a–R3d **Delivered** |
| **Last reviewed** | 2026-06-30 |

> **One sentence:** Active REST/OpenAPI binding for `/api/internal/v1/**` — registry, OpenAPI publication, `createApiHandler`, and drift attestation.

**Production stance:** Human-session internal v1 is **GO** (Production Accepted). Machine S2S REST is **not offered** — policy attested per [ADR-0034](../../../adr/ADR-0034-service-actor-production-policy-attestation.md); crypto verification required before first `service-token-required` route.
