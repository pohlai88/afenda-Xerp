# Platform API Contract Architecture Blueprint

| Field | Value |
| --- | --- |
| **Document class** | `architecture_blueprint` |
| **Document role** | `domain_architecture_box_map` |
| **Architectural identity** | Blueprint boxes (§4) — **Platform API Contract** + **ERP Integration Spine** (consumer) |
| **Workspace mapping** | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) — `apps/erp` integration layer |
| **Scope** | Platform API Contract — cross-style exposure authority; ERP REST binding proof |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) · [Platform API Contract North Star](../NORTHSTAR/api-contract-north-star.md) |
| **Platform rollup** | [Kernel Blueprint](kernel-blueprint.md) §2 cross-cutting row |
| **Authority ADR** | [ADR-0030](../adr/ADR-0030-erp-rest-api-contract-standard.md) (REST binding) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) · [ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) |
| **Derived documents** | [PAS-API-001](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) · [PAS-001A-API-BINDING](../PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) · [R3 track](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md) |
| **Maturity** | Production Accepted — document **9.5 / 10**; REST R3 Planned |
| **Runtime maturity** | Production Candidate — `createApiHandler` on internal v1 routes; R3 attestation Planned |
| **Runtime stance** | Documentation only — references registries and runtime paths |
| **Total PAS at maturity** | PAS-API-001 + style bindings + ERP consumer binding |
| **Live PAS today** | PAS-API-001 · PAS-API-REST-001 (active) · reserved RPC/GQL/Event/Agent bindings |
| **Does not confer** | Business domain meaning, North Star EFR, slice handoff execution |
| **Quality target** | Enterprise **10 / 10** |
| **Evidence standard** | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| **Last reviewed** | 2026-06-30 (API family restructure) |
| **Next document** | [PAS-API-001](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [R3a slice handoff](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3a-handler-runtime-envelope.md) |

> **One sentence:** **Platform API Contract** owns cross-style exposure authority; **ERP Integration Spine** owns the current ERP implementation binding for internal v1 REST and consumes that authority — REST/OpenAPI, RPC, GraphQL, Event API, and Agent API are style bindings beneath the family, not the family itself.

---

# 0. Agent Quick Path

**Read order:** [Platform API Contract North Star](../NORTHSTAR/api-contract-north-star.md) §1–§12 (business) → **this document** → [PAS-API-001](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) → [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) → [PAS-001A-API-BINDING](../PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) → [R3 slice handoff](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md) → [afenda-openapi skill](../../.cursor/skills/afenda-openapi/SKILL.md) → Code.

**This document answers:**

- Which **Blueprint boxes** own API contract authority vs ERP consumer proof
- **File paths**, generated artifacts, and gate commands for REST binding governance
- PAS inventory and skill mirror for implementers

**This document never answers:**

- Business mission, vocabulary, or domain boundaries (North Star §1–§12)
- TypeScript contract shapes (PAS §4)
- Slice session scope (9-field handoff)

**Hard stops:**

- Do not hand-edit `afenda-internal-v1.openapi.json`
- Do not add governed routes without registry entry
- Do not implement from this Blueprint alone — use R3 slice handoff + PAS §13 gates
- Do not restate North Star §1 philosophy here

**Chain rule:** North Star §1–§12 → **this Blueprint** → PAS-001A / R3 slice → Code

---

# 1. Blueprint Purpose

Before authoring or extending HTTP contract runtime, answer from **this document only**:

1. **What box?** → **ERP Integration Spine** (§4)
2. **Why separate from Kernel Vocabulary?** → Vocabulary owns words; spine owns consumer wiring and HTTP proof ([Kernel Blueprint](kernel-blueprint.md) §3.1)
3. **Which app layer?** → `apps/erp` — ADR-0020 · ADR-0030
4. **Which exposure namespace?** → `/api/internal/v1/**` at current maturity
5. **Which gates?** → §4.4 gate inventory
6. **Which slice for runtime work?** → PAS-001A R3

Business **why** governed HTTP exists: [North Star §1](../NORTHSTAR/api-contract-north-star.md) — do not copy here.

---

# 2. Upstream Traceability

| Upstream | Link | This Blueprint uses |
| --- | --- | --- |
| ADR-0030 | ERP REST API contract standard | T0 constitutional decisions |
| ADR-0020 | HTTP wiring in `apps/erp` | Layer ownership |
| ADR-0010 | Gate 5 API contract governance | Foundation prerequisite |
| Platform HTTP Contract NS | §4 capabilities · §13 box map | Capability → box justification |
| Kernel Blueprint | §4 ERP Integration Spine | Parent box identity |

| North Star §4 capability | Blueprint §4 box | Notes |
| --- | --- | --- |
| Authoritative operation registry | ERP Integration Spine | `api-contract-registry.ts` |
| Schema-first operation contracts | ERP Integration Spine | `*.api-contract.ts` + Zod |
| OpenAPI 3.1 publication | ERP Integration Spine | `openapi/build-afenda-openapi-document.ts` |
| No hand-edited publication JSON | ERP Integration Spine | Generated snapshot only |
| Governed response envelope | ERP Integration Spine | `api-envelope.contract.ts` |
| Problem detail errors | ERP Integration Spine · Kernel Vocabulary | Envelope + kernel error words |
| Human / service-actor auth policy | ERP Integration Spine | `auth-policy.contract.ts` |
| Operating context dependency | ERP Integration Spine | IS-002 · `context-policy.contract.ts` |
| Permission declaration | ERP Integration Spine | Contract metadata |
| Idempotency · pagination · rate limit | ERP Integration Spine | Policy contracts |
| Internal v1 REST scope | ERP Integration Spine | Route namespace discipline |
| Publication drift detection | ERP Integration Spine | Drift + route catalog gates |
| Correlation on every response | ERP Integration Spine · Kernel Vocabulary | Transport headers + envelope |
| Bidirectional contract validation | ERP Integration Spine | Ingress + egress in handler runtime |
| Version and breaking-change governance | ERP Integration Spine | Lifecycle + ADR-0030 classification |
| Governance exception discipline | ERP Integration Spine · Platform Architecture Authority | Exception registration — North Star §14.5 |
| Consumer impact declaration | ERP Integration Spine | Lifecycle metadata — North Star §8.5 |
| Audit replay minimum | ERP Integration Spine · Kernel Vocabulary | Envelope + trace — North Star §5.2 |
| Operation contract ownership accountability | ERP Integration Spine | Contract metadata — North Star §14.6 |
| Domain payload wire shapes | Kernel Domain Vocabulary Catalog · ERP Integration Spine | Payload schemas in domain contracts |

---

# 3. Layer Map

| Layer | Owner | HTTP contract role |
| --- | --- | --- |
| **Platform** | Kernel Vocabulary · Kernel Domain Vocabulary Catalog | Trace, error, actor words; cross-domain wire labels in payloads |
| **Application integration** | ERP Integration Spine (`apps/erp`) | Registry, handler runtime, OpenAPI generator, drift gates |
| **Identity & Access · Authorization** | Separate domains | Execute auth and permission — contract declares policy only |

---

# 4. Blueprint Box — ERP Integration Spine (HTTP contract runtime)

| Field | Value |
| --- | --- |
| **Box name** | **ERP Integration Spine** |
| **Registry PKG** | `apps/erp` (application — not a separate npm package) |
| **PAS** | [PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| **Status** | Production Candidate — contract scaffold live; R3 handler runtime Planned |
| **Parent kernel box** | Same box as operating-context spine ([Kernel Blueprint](kernel-blueprint.md) §4) |

## 4.1 Why this box owns HTTP contract proof

**Because** kernel vocabulary must stay zero-dependency · **Therefore** HTTP registry, handlers, and OpenAPI generation live in the ERP application integration layer — consuming kernel words, not defining HTTP in `@afenda/kernel`.

**Because** ADR-0020 assigns HTTP wiring to `apps/erp` · **Therefore** contract paths and gates are declared here — not in North Star §1–§11.

## 4.2 Box owns (architectural)

- Operation contract registry and domain contract modules
- OpenAPI 3.1 generator pipeline (`zod-openapi`)
- Generated publication snapshot (output only)
- Route handler runtime (`createApiHandler` — R3 delivery)
- Contract drift and route coverage attestation scripts
- Internal v1 route namespace `/api/internal/v1/**`
- Skill mirror: [afenda-openapi](../../.cursor/skills/afenda-openapi/SKILL.md)

## 4.3 Box never owns (architectural)

- Business meaning of HTTP exposure (North Star)
- Permission evaluation · session establishment · operating-context assembly logic (executed by sibling domains — declared on contract)
- Kernel vocabulary types
- Public/partner API tier without new ADR + North Star §4 amendment
- Hand-edited OpenAPI JSON

## 4.4 Runtime evidence appendix

**Authoring surface (registry-first):**

| Path | Role |
| --- | --- |
| `apps/erp/src/server/api/contracts/api-contract-registry.ts` | Authoritative operation list |
| `apps/erp/src/server/api/contracts/**/*.api-contract.ts` | Domain schema-first contracts |
| `apps/erp/src/server/api/contracts/openapi/` | OpenAPI document builder |
| `apps/erp/src/server/api/runtime/` | Handler runtime (R3 — partial today) |
| `apps/erp/src/app/api/internal/v1/**/route.ts` | Governed route handlers |

**Generated artifact (never hand-edit):**

| Artifact | Role |
| --- | --- |
| `apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json` | Checked-in OpenAPI 3.1 snapshot |

**Gate commands (PAS §13 / R3 slice):**

| Gate | Purpose |
| --- | --- |
| `pnpm check:api-contracts` | Registry policy + route boundary (createApiHandler, no orphan routes) |
| `pnpm check:openapi-drift` | Snapshot matches live generator output |
| `pnpm check:api-route-catalog` | Route catalog export alignment |
| `pnpm lint:openapi` | Structural OpenAPI lint (operationId, tags) |
| `pnpm export:openapi` | Regenerate snapshot after contract changes |

**Validation direction (runtime proof — aligns with North Star I8):**

| Direction | Runtime surface |
| --- | --- |
| Ingress | Request schema validation before handler business logic |
| Egress | Response schema validation before serialization |
| Publication | Generator output vs checked-in snapshot (drift gate) |
| Handler coverage | Route files must use `createApiHandler`; registry must cover governed routes |

**Breaking-change tooling (PAS intent — not North Star doctrine):**

- CI may adopt OpenAPI diff tools (e.g. oasdiff-class comparison) on snapshot changes — classify additive vs breaking per ADR-0030 §8
- Tool choice and policy live in PAS R3+ slices — not in North Star

## 4.5 Source register

| ID | Claim | Tier | Status | Reference |
| --- | --- | --- | --- | --- |
| B1 | ADR-0030 constitutional HTTP contract standard | T0 | Accepted | [ADR-0030](../adr/ADR-0030-erp-rest-api-contract-standard.md) |
| B2 | Operation registry and schema-first contract scaffold exist | T5 | Delivered scaffold | `apps/erp/src/server/api/contracts/**` |
| B3 | OpenAPI generation path exists; generated snapshot is output-only | T5 | Delivered scaffold | `apps/erp/src/server/api/contracts/openapi/` · `afenda-internal-v1.openapi.json` |
| B4 | Drift and route coverage gates declared for contract governance | T5 | Declared — must remain green | §4.4 gate inventory |
| B5 | Full `createApiHandler` runtime | T5 | **Delivered** (2026-06-30) — R3 API track | `apps/erp/src/server/api/runtime/create-api-handler.ts` |
| B6 | OpenAPI skill mirror governs generator discipline | T5 | Supporting implementation guide | [afenda-openapi skill](../../.cursor/skills/afenda-openapi/SKILL.md) |

**Reading rule:** B5 blocks **runtime** Production Accepted — not Blueprint document validity. B2–B4 prove scaffold; B5 closes full handler conformance.

## 4.6 Governance expectations (PAS enforcement)

North Star defines business expectations; this box proves runtime wiring. PAS R3+ and contract metadata must enforce:

| North Star expectation | PAS / runtime enforcement locus |
| --- | --- |
| Governance exceptions (§14.5 · I10) | Architecture Authority exception registry — never unregistered routes |
| Consumer impact classes (§8.5 · I11) | Contract lifecycle metadata on deprecated/breaking operations |
| Audit replay minimum (§5.2 · I12) | Envelope + transport metadata on governed boundaries |
| Operation ownership (§14.6) | Per-contract domain · technical · lifecycle · consumer-impact owner fields |

**Rule:** Missing PAS enforcement of an Enterprise 10 / 10 North Star invariant is a **runtime gap** — not a Blueprint document gap.

---

# 5. Consumers

Consumer **classes** — not an exhaustive route inventory. Aligns with [Kernel Blueprint](kernel-blueprint.md) §3.2 dependency categories where applicable.

| Consumer | Dependency category | Uses from this box |
| --- | --- | --- |
| ERP UI and internal client fetchers | Application | Governed envelope · internal v1 routes · typed operation discovery |
| ERP business modules | Application | Registered operations and schema-first payload contracts |
| System Admin and platform operations | Governance | Contract visibility · route coverage · lifecycle status |
| Observability and audit surfaces | Platform | Correlation metadata · operation identity · error classification · audit replay facts |
| Identity & Access · Authorization | Platform dependency | Declared auth and permission intent consumed at runtime boundary |
| Agent implementers | Governance / automation | OpenAPI publication · add-contract workflow · drift gate expectations |
| Foundation quality gates | Governance | API contract · route catalog · OpenAPI drift · publication checks (ADR-0010 gate 5) |
| Future partner / public API governance | Future exposure tier | Reuses lifecycle and breaking-change model only after ADR + North Star §4 amendment |

**Rule:** Blueprint consumers name **who depends on the box** — not every current route file.

---

# 6. Cross-cutting composition

```text
Kernel Vocabulary
(trace · error · actor words)
        ↓ consumed by
ERP Integration Spine — HTTP contract registry + handler runtime
        ↓ declares policy requirements for
Human session · service actor · permission intent · operating context
        ↓ runtime invokes
Identity & Access · Authorization · IS-002 Operating Context Assembly
        ↓ returns
Governed envelope / ProblemDetail with correlation metadata
```

**Rule:** This Blueprint owns the **wiring proof**. It does not own credential validation, permission evaluation, or operating-context business rules.

Detail: [Kernel Blueprint](kernel-blueprint.md) §5.1 · [PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) §2.1.

---

# 7. PAS Creation Gate

Dedicated root PAS **is required** for the Platform API Contract family because API exposure governance is broader than the current ERP REST implementation.

| Authority | Document | Role |
| --- | --- | --- |
| **PAS-API-001** | [Platform API Contract Authority](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) | Cross-style family invariants |
| **PAS-API-REST-001** | [REST / OpenAPI Binding](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) | Active REST binding |
| **PAS-001A-API-BINDING** | [ERP Integration Spine Consumption](../PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) | ERP consumer — not family owner |

REST/OpenAPI remains a **binding** under the API Contract family. ERP Integration Spine **consumes** that binding for current runtime proof.

**Style binding activation (RPC, GraphQL, Event, Agent)** requires:

1. North Star §0.2 / §4 capability amendment (if business meaning changes)
2. Blueprint §7 row + style folder PAS
3. ADR when exposure tier or consumer impact changes
4. Slice handoff before runtime

**Do not** nest API family doctrine inside PAS-001A. **Do not** treat REST as permanent API family authority.

---

# 8. Blockers

| Blocker | Resolution |
| --- | --- |
| R3 handler runtime not Delivered | Execute [R3 track](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md) (R3a–R3d) |
| Service-actor operating-context assembly deferred from R2 | Closes in R3 per slice DoD |
| Public API tier | Requires ADR + North Star §4 amendment — out of scope |

---

# 9. Blueprint → PAS Handoff

| Blueprint box | PAS | Active slice |
| --- | --- | --- |
| Platform API Contract | [PAS-API-001](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) | — |
| REST binding | [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) | [R3a handler runtime](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3a-handler-runtime-envelope.md) (first) |
| ERP Integration Spine (consumer) | [PAS-001A-API-BINDING](../PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) | IS-004 via R3 track |

Implementers: copy **R3a–R3d 9-field handoff** into Phase 0 — do not re-derive from North Star §12. Track index: [R3](../PAS/API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md).

---

# 10. PAS Inventory

| PAS ID | Name | Blueprint box | Status | Slice |
| --- | --- | --- | --- | --- |
| PAS-API-001 | Platform API Contract Authority | Platform API Contract | Production Candidate (doctrine) | — |
| PAS-API-REST-001 | REST / OpenAPI Binding | REST style binding | Production Candidate (scaffold) | R3a → R3d Planned |
| PAS-001A | ERP Integration Spine | ERP Integration Spine | Production Candidate | R1a–R1d · R2 Delivered · IS-004 R3 Planned |
| PAS-001A-API-BINDING | ERP API Consumption | ERP Integration Spine (consumer) | Active | — |
| PAS-API-RPC-001 | gRPC / Connect / Protobuf | RPC binding | Reserved | — |
| PAS-API-GQL-001 | GraphQL | GraphQL binding | Reserved | — |
| PAS-API-EVENT-001 | Event API | Event binding | Reserved | — |
| PAS-API-AGENT-001 | Agent / Tool API | Agent binding | Reserved | — |

**Skill mirror:**

| Skill | Role |
| --- | --- |
| [afenda-openapi](../../.cursor/skills/afenda-openapi/SKILL.md) | Generator discipline · gap registry · add-contract checklist |
| [platform-api-contract](../../.cursor/skills/platform-api-contract/SKILL.md) | Envelope shape · HTTP status discipline on routes |

---

# 11. Maturity Exit

| Target | Criteria |
| --- | --- |
| **Production Candidate → Production Accepted (runtime)** | R3 slice Delivered · `createApiHandler` on all governed internal v1 routes · ingress and egress validation proven · route coverage gate green · OpenAPI drift gate green · snapshot regenerated only via approved export command · North Star §16 EAC remains Enterprise 10 / 10 |
| **Production Accepted → Enterprise Runtime** | Zero orphan governed routes · 100% governed errors use ProblemDetail · 100% governed success responses use envelope with correlation · audit replay minimum attested · service-actor policy attested where applicable · breaking-change classification on contract diffs · consumer impact declared on deprecated/breaking operations · operation ownership metadata enforced in PAS |
| **Public API tier** | ADR + North Star §4 amendment + Blueprint exposure row + PAS amendment + consumer migration policy |

**Document vs runtime:** This Blueprint may reach **9.5 / 10** as architecture documentation before R3 delivers. **Enterprise Runtime** requires B5 closed and §4.4 gates green on every release.

---

# 12. Document Sync Obligations

| Change | Then update |
| --- | --- |
| New contract path or gate | This §4.4 · R3 slice handoff · afenda-openapi skill |
| North Star §4 new capability | North Star §13 · this §2 table · Kernel Blueprint §2 rollup |
| Breaking-change policy | ADR-0030 · North Star §8.4 · PAS amendment |
| R3 Delivered | PAS-001A §12 · Kernel Blueprint §10 slice counts |

---

# 13. Agent Implementation Rules

1. **Business dispute** → [North Star §1–§12](../NORTHSTAR/api-contract-north-star.md)
2. **Box name + paths + gates** → **this document §4**
3. **Session scope** → R3 slice 9-field handoff only
4. **Add contract** → afenda-openapi skill checklist + `pnpm export:openapi` + drift gates
5. **Never** cite §4.4 file paths in North Star amendments — update Blueprint instead

**Last reviewed:** 2026-06-30 (Blueprint 9.5 peer cleanup)
