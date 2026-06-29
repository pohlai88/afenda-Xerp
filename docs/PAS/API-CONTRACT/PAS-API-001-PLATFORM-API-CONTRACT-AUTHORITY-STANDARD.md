# PAS-API-001 — Platform API Contract Authority Standard

> **Root PAS family:** [`docs/PAS/API-CONTRACT/`](README.md) · implements [Platform API Contract North Star](../../NORTHSTAR/api-contract-north-star.md) · style bindings consume this authority · ERP consumes via [PAS-001A-API-BINDING](../KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md)

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-API-001 |
| **Document title** | Platform API Contract Authority Standard |
| **Document class** | `domain_root_authority_standard` |
| **Document role** | `api_exposure_governance` |
| **PAS family** | [`API-CONTRACT/`](README.md) |
| **Blueprint box** | **Platform API Contract** (cross-style exposure authority) |
| **Parent** | [Platform API Contract North Star](../../NORTHSTAR/api-contract-north-star.md) |
| **Child bindings** | [REST](REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) · [RPC](RPC/PAS-API-RPC-001-GRPC-CONNECT-PROTOBUF-BINDING-STANDARD.md) · [GraphQL](GRAPHQL/PAS-API-GQL-001-GRAPHQL-BINDING-STANDARD.md) · [Event](EVENT/PAS-API-EVENT-001-EVENT-API-BINDING-STANDARD.md) · [Agent](AGENT/PAS-API-AGENT-001-AGENT-TOOL-API-BINDING-STANDARD.md) |
| **Consumer binding** | [PAS-001A-API-BINDING](../KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| **Maturity** | Production Accepted (family doctrine + REST runtime) · reserved bindings Planned |
| **Authority status** | `accepted` (family invariants API-001–API-016 attested · REST binding Production Accepted) |
| **Upstream** | [api-contract North Star](../../NORTHSTAR/api-contract-north-star.md) · [api-contract Blueprint](../../BLUEPRINT/api-contract-blueprint.md) · [ADR-0030](../../adr/ADR-0030-erp-rest-api-contract-standard.md) (REST binding ADR) |
| **Last reviewed** | 2026-06-30 |

> **One sentence:** Every exposed ERP capability — REST, RPC, GraphQL, event, or agent-facing — must have stable operation identity, registry-first declaration, schema authority, ingress/egress validation, actor and context policy, governed errors, correlation, audit replay minimum, lifecycle classification, consumer impact, and ownership metadata — independent of transport, publication format, or runtime framework.

> **Canonical location:** `docs/PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md`

---

# 0. Agent Quick Path

**Read order:** [api-contract North Star §1–§12](../../NORTHSTAR/api-contract-north-star.md) → **this document §1–§4** → active style binding PAS → consumer binding (if ERP) → slice handoff → Code.

**Doctrine (permanent):**

```text
API Contract is the family.
API style is the binding.
Transport is the mechanism.
Publication is the artifact.
Runtime is the implementation.
ERP Integration Spine is the consumer.
```

**Hard stops:**

- Do not nest API family doctrine inside PAS-001A or ERP Integration Spine
- Do not treat REST, OpenAPI, or Next.js route handlers as permanent API family authority
- Do not treat generated TypeScript (OpenAPI, Protobuf, GraphQL) as contract source of truth
- Do not add `.proto`, GraphQL schema, event topic, or agent tool without PAS-API-001 registry operation identity
- Do not bypass lifecycle rules because an API style feels internal

---

# 1. Derivation and Scope

## 1.1 Why this PAS exists

[Platform API Contract North Star](../../NORTHSTAR/api-contract-north-star.md) defines **permanent exposure-governance architecture**. PAS-API-001 owns the **style-agnostic invariants** that survive REST → RPC → GraphQL → event → agent transitions.

## 1.2 In scope / out of scope

| In scope (PAS-API-001) | Out of scope (style bindings or consumers) |
| --- | --- |
| Operation identity and registry-first exposure | REST paths, HTTP methods, status codes |
| Schema authority (shape declared before runtime) | OpenAPI file layout, `.proto` layout |
| Ingress and egress validation policy | `createApiHandler` implementation |
| Actor policy (human vs service) | Session/credential storage |
| Operating context policy declaration | Operating context assembly execution |
| Permission declaration on operations | Permission evaluation execution |
| Error semantics (governed failure shape) | ProblemDetail / gRPC status mapping details |
| Correlation and audit replay minimum | Log sink configuration |
| Lifecycle: proposed → active → deprecated → retired | Route file paths |
| Breaking-change classification | Generator commands |
| Consumer impact classification | Business workflow orchestration |
| Governance exceptions (bounded, expiring) | Enterprise Knowledge term definitions |
| Ownership metadata dimensions | UI composition |

## 1.3 Style binding layer

Each API style receives a **binding PAS** when active, planned, or intentionally reserved:

| Binding PAS | Style | Status |
| --- | --- | --- |
| [PAS-API-REST-001](REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) | REST / OpenAPI | **Active** |
| [PAS-API-RPC-001](RPC/PAS-API-RPC-001-GRPC-CONNECT-PROTOBUF-BINDING-STANDARD.md) | gRPC / Connect / Protobuf | Reserved |
| [PAS-API-GQL-001](GRAPHQL/PAS-API-GQL-001-GRAPHQL-BINDING-STANDARD.md) | GraphQL | Reserved |
| [PAS-API-EVENT-001](EVENT/PAS-API-EVENT-001-EVENT-API-BINDING-STANDARD.md) | Event API | Reserved |
| [PAS-API-AGENT-001](AGENT/PAS-API-AGENT-001-AGENT-TOOL-API-BINDING-STANDARD.md) | Agent / Tool API | Reserved |

---

# 2. One-Sentence Boundary

**Owns:** Cross-style API exposure governance — operation identity, registry, schema authority, validation policy, actor/context/permission declarations, error doctrine, correlation, audit replay, lifecycle, breaking-change class, consumer impact, exceptions, ownership.

**Never owns:** REST paths, OpenAPI snapshots, Protobuf files, GraphQL schemas, queue names, handler frameworks, permission evaluation, operating-context assembly, or business meaning.

---

# 3. Permanent Authority Invariants

| ID | Invariant | Meaning |
| --- | --- | --- |
| API-001 | Operation identity | Every exposed capability has a stable governed identity |
| API-002 | Registry-first exposure | No API operation exists outside registry authority |
| API-003 | Schema authority | Request, response, event, or message shapes declared before runtime |
| API-004 | Ingress validation | Caller input validated before business execution |
| API-005 | Egress validation | Runtime output validated before serialization or dispatch |
| API-006 | Actor policy | Human session and service actor remain distinct |
| API-007 | Operating context policy | Tenant/company/org/workspace scope is declared per operation |
| API-008 | Permission declaration | Operation declares capability intent |
| API-009 | Error semantics | Failure shape is governed per active style binding |
| API-010 | Correlation | Every governed operation carries replayable trace identity |
| API-011 | Audit replay minimum | Operation, request, correlation, actor, context, timestamp, lifecycle |
| API-012 | Lifecycle | proposed → active → deprecated → retired |
| API-013 | Breaking-change classification | additive · compatible · deprecated · breaking |
| API-014 | Consumer impact | internal UI · internal service · partner · agent · public client |
| API-015 | Governance exceptions | bounded owner · expiry · risk reason · follow-up evidence |
| API-016 | Ownership metadata | domain · technical · lifecycle · consumer-impact owners |

---

# 4. Style Replacement Behavior

When changing API style, only the affected **binding** changes. PAS-API-001 invariants persist.

| Change | Keep | Replace / amend |
| --- | --- | --- |
| REST to gRPC | PAS-API-001 | REST binding retired; RPC binding activated |
| OpenAPI to Protobuf | Lifecycle, ownership, audit replay | Publication binding |
| Next.js handlers to gateway | API authority | REST runtime binding |
| JSON DTO to Protobuf message | Operation identity, consumer impact | Schema binding and mapping |
| Add GraphQL | API core authority | Add GraphQL binding |
| Add event API | Lifecycle and consumer impact | Add Event API binding |

---

# 5. Package Boundary (future)

| Package | Owns | MVP |
| --- | --- | --- |
| `@afenda/api-contract` | Cross-style registry, lifecycle, policy, audit replay, ownership | Reserved — folders under `apps/erp` today |
| `@afenda/api-contract-rest` | REST/OpenAPI binding (optional extract) | Not created until multi-consumer need |
| `@afenda/api-contract-rpc` | RPC/gRPC/Connect binding (optional extract) | Reserved |

Extract packages only when multiple consumers need authority outside `apps/erp`.

---

# 6. Slice Catalog

| Track | [SLICE/pas-api-001-slice-track.md](SLICE/pas-api-001-slice-track.md) |
| Catalog | [SLICE/pas-api-001-slice-catalog.md](SLICE/pas-api-001-slice-catalog.md) |
| Guideline | [SLICE-BUILDING-GUIDELINE.md](SLICE-BUILDING-GUIDELINE.md) |

| Slice | Handoff | Status |
| --- | --- | --- |
| S1 | [pas-api-001-s1-operation-identity-registry.md](SLICE/pas-api-001-s1-operation-identity-registry.md) | Delivered |
| S2 | [pas-api-001-s2-schema-authority-model.md](SLICE/pas-api-001-s2-schema-authority-model.md) | Delivered |
| S3 | [pas-api-001-s3-validation-direction-model.md](SLICE/pas-api-001-s3-validation-direction-model.md) | Delivered |
| S4 | [pas-api-001-s4-actor-context-permission-policy.md](SLICE/pas-api-001-s4-actor-context-permission-policy.md) | Delivered |
| S5 | [pas-api-001-s5-error-correlation-audit-replay.md](SLICE/pas-api-001-s5-error-correlation-audit-replay.md) | Delivered |
| S6 | [pas-api-001-s6-lifecycle-breaking-change.md](SLICE/pas-api-001-s6-lifecycle-breaking-change.md) | Delivered |
| S7 | [pas-api-001-s7-consumer-impact-ownership.md](SLICE/pas-api-001-s7-consumer-impact-ownership.md) | Delivered |
| S8 | [pas-api-001-s8-governance-exception-model.md](SLICE/pas-api-001-s8-governance-exception-model.md) | Delivered |
| S9 | [pas-api-001-s9-family-gate-release-attestation.md](SLICE/pas-api-001-s9-family-gate-release-attestation.md) | Delivered |

**Remaining slices:** none — S1–S9 Delivered · **Gate:** `pnpm check:api-family-conformance`

**Core contract surfaces (S-track target):** see [SLICE/pas-api-001-slice-track.md](SLICE/pas-api-001-slice-track.md)

---

# 7. Enterprise Acceptance Criteria

PAS-API-001 is **accepted** when:

1. North Star §19 doctrine aligns with this PAS
2. Blueprint separates Platform API Contract box from ERP consumer binding
3. Active style binding (REST) traces all invariants API-001–API-016
4. Reserved bindings exist with explicit Planned status — no false Delivered claims
5. ERP Integration Spine consumption doc does not own family doctrine

---

# 8. References

| Artifact | Path |
| --- | --- |
| PAS family index | [API-CONTRACT/README.md](README.md) |
| North Star | [api-contract-north-star.md](../../NORTHSTAR/api-contract-north-star.md) |
| Blueprint | [api-contract-blueprint.md](../../BLUEPRINT/api-contract-blueprint.md) |
| REST binding | [PAS-API-REST-001](REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| ERP consumption | [PAS-001A-API-BINDING](../KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| ADR-0030 (REST) | [ADR-0030-erp-rest-api-contract-standard.md](../../adr/ADR-0030-erp-rest-api-contract-standard.md) |

**Provenance:** Created 2026-06-30 — enterprise API family split; REST/OpenAPI demoted from family root to style binding.
