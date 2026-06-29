# PAS-API-REST-001 — REST / OpenAPI Binding Standard

> **Style binding under:** [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · implements REST/OpenAPI publication on `apps/erp` internal v1 · consumed by [PAS-001A-API-BINDING](../../KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md)

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-API-REST-001 |
| **Document title** | REST / OpenAPI Binding Standard |
| **Document class** | `api_style_binding_standard` |
| **Document role** | `rest_openapi_binding` |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Consumer binding** | [PAS-001A-API-BINDING](../../KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| **Primary runtime owner** | `apps/erp/src/server/api/` |
| **Exposure namespace** | `/api/internal/v1/**` at current maturity |
| **Runtime stance** | `scaffold-delivered` — registry + generator + partial handler runtime live; **attestation closure Planned** via R3a–R3d |
| **Maturity** | Production Candidate (scaffold); Enterprise Runtime after R3d |
| **Agent skills** | `afenda-openapi` · `platform-api-contract` · `/afenda-coding-session` |
| **Upstream** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [ADR-0030](../../adr/ADR-0030-erp-rest-api-contract-standard.md) |
| **Last reviewed** | 2026-06-30 |

> **Canonical location:** `docs/PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md`

> **Legacy ID note:** Formerly documented as `PAS-001A-API`. Renamed 2026-06-30 when API family doctrine moved to PAS-API-001.

---

# 0. Agent Quick Path

**Read order:** [PAS-API-001 §1–§4](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) → **this document §0–§4** → [R3 slice handoff](./SLICE/pas-001a-r3-api-contract-runtime.md) → [afenda-openapi skill](../../../.cursor/skills/afenda-openapi/SKILL.md) → Code.

**Integration surface:** **IS-004** — REST Contract Runtime (ERP consumer)

**Hard stops:**

- Do not hand-edit `afenda-internal-v1.openapi.json`
- Do not add governed routes without `API_CONTRACTS` registry entry
- Do not implement REST binding logic in `packages/kernel/src/**`
- Do not conflate human session and service-actor `authPolicy`
- Do not assemble operating context handler-local — use PAS-001A IS-002 spine
- Do not claim R3 Delivered until R3a–R3d DoD gates pass

**Execution:** R3a → R3b → R3c → R3d · Session scope from slice 9-field handoff only

---

# 1. Binding Scope

## 1.1 Owns (REST / OpenAPI only)

| Area | Authority |
| --- | --- |
| REST path shape | `/api/internal/v1/**` or future governed namespace |
| HTTP method discipline | GET, POST, PATCH, DELETE semantics |
| HTTP status mapping | Status codes as primary signal |
| OpenAPI publication | Generated OpenAPI 3.1 snapshot |
| ProblemDetail mapping | REST error body (RFC 9457) |
| Route handler runtime | `createApiHandler` or successor |
| Route coverage gate | No orphan governed routes |
| OpenAPI drift gate | Generated output equals checked-in snapshot |

## 1.2 Does not own

Business meaning · Enterprise Knowledge vocabulary · Permission evaluation · Operating context assembly · API family doctrine (PAS-API-001) · RPC/GraphQL/event/agent bindings

---

# 2. Authority Surfaces

## 2.1 Operation registry

`apps/erp/src/server/api/contracts/api-contract-registry.ts` — sole authoring surface for REST operations.

## 2.2 Domain contract modules

`apps/erp/src/server/api/contracts/**/*.api-contract.ts`

## 2.3 OpenAPI publication

`apps/erp/src/server/api/contracts/openapi/` + `afenda-internal-v1.openapi.json` (output only).

## 2.4 Envelope and errors

Governed envelope + ProblemDetail.

## 2.5 Handler runtime

`create-api-handler.ts` — bidirectional Zod validation pipeline.

## 2.6 Attestation gates

`scripts/api-contract/` — drift, coverage, catalog.

---

# 3. Required Gates

| # | Gate command | Slice | Status |
| --- | --- | --- | --- |
| 1 | `pnpm --filter @afenda/erp typecheck` | baseline | Active |
| 2 | `pnpm --filter @afenda/erp test:run` | baseline | Active |
| 3 | `pnpm check:api-contracts` | R3c · R3d | Planned |
| 4 | `pnpm check:openapi-drift` | R3c · R3d | Planned |
| 5 | `pnpm check:api-route-catalog` | R3c | Planned |
| 6 | `pnpm lint:openapi` | R3c | Planned |
| 7 | `pnpm check:erp-service-actor-s2s-attestation` | R3b | Active |
| 8 | `pnpm export:openapi` | Any contract change | Active |

---

# 4. REST Binding Invariants

| ID | Invariant |
| --- | --- |
| REST-INV-001 | Every governed route uses `createApiHandler` (R3c) |
| REST-INV-002 | Ingress + egress Zod validation (R3a) |
| REST-INV-003 | Service-actor context via spine (R3b) |
| REST-INV-004 | Zero hand-edited OpenAPI (R3c) |
| REST-INV-005 | Consumer impact on deprecated/breaking (R3d) |
| REST-INV-006 | Ownership metadata on active contracts (R3d) |

All REST-INV-* trace to PAS-API-001 API-001–API-016.

---

# 5. Slice Catalog

| Track | [pas-api-rest-001-slice-track.md](./SLICE/pas-api-rest-001-slice-track.md) |
| S-series catalog | [pas-api-rest-001-slice-catalog.md](./SLICE/pas-api-rest-001-slice-catalog.md) |
| Guideline | [SLICE-BUILDING-GUIDELINE.md](../SLICE-BUILDING-GUIDELINE.md) |

**S-series (canonical):** S1 → S10 — see [slice track](./SLICE/pas-api-rest-001-slice-track.md)

**Legacy R3 bundles:** R3a–R3d — mapped to S3–S10; see track index · **Next implementable:** S1 or R3a

| R3 | [pas-001a-r3-api-contract-runtime.md](./SLICE/pas-001a-r3-api-contract-runtime.md) | Planned (index) |
| R3a | [pas-001a-r3a-handler-runtime-envelope.md](./SLICE/pas-001a-r3a-handler-runtime-envelope.md) | Planned |
| R3b | [pas-001a-r3b-service-actor-context-assembly.md](./SLICE/pas-001a-r3b-service-actor-context-assembly.md) | Planned |
| R3c | [pas-001a-r3c-route-coverage-drift-attestation.md](./SLICE/pas-001a-r3c-route-coverage-drift-attestation.md) | Planned |
| R3d | [pas-001a-r3d-governance-metadata-closure.md](./SLICE/pas-001a-r3d-governance-metadata-closure.md) | Planned |

---

# 6. References

| Artifact | Path |
| --- | --- |
| Root authority | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| ERP consumption | [PAS-001A-API-BINDING](../../KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| Blueprint | [api-contract-blueprint.md](../../../BLUEPRINT/api-contract-blueprint.md) |
| ADR-0030 | [ADR-0030-erp-rest-api-contract-standard.md](../../../adr/ADR-0030-erp-rest-api-contract-standard.md) |
