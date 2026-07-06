# Platform API Contract North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Platform API Contract — governed ERP API exposure (cross-style) |
| **Domain type** | Platform integration domain *(not a business line-of-business such as Accounting, HRM, or CRM)* |
| **Constitutional question** | *How does the platform expose governed, auditable API contracts across REST, RPC, GraphQL, event, and agent surfaces?* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Cross-domain laws** | [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) — LAW 1 (registry-first) · LAW 6 (evidence-backed status) |
| **Derived document** | [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) — ERP Integration Spine and related boxes |
| **Authority ADR** | [ADR-0030](../adr/ADR-0030-erp-rest-api-contract-standard.md) · [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) |
| **Maturity** | Enterprise **10 / 10** (governance-hardening complete) |
| **Prior maturity** | Production Candidate 8.8 → Enterprise 9.5 boundary cleanup 2026-06-30 |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** (business architecture authority) |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-30 (Enterprise 10 / 10 governance-hardening) |
| **Package / PAS inventory** | See [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) — not declared here |
| **Next document** | [Platform API Contract Blueprint](../BLUEPRINT/api-contract-blueprint.md) |

> **One sentence:** Every API surface that exposes ERP capability — REST, RPC, GraphQL, event, or agent-facing — must be declared, schema-validated, auditable, lifecycle-governed, and published or discoverable from a single contract authority — never from hand-edited specification artifacts or ad-hoc route shapes.

> **Exposure contract, not business logic:** This domain governs **how the platform exposes and attests API operations** — operation identity, request/response/event/message shapes, authentication and context policies, error semantics, and publication discipline — independent of ledger posting, master-data resolution, or UI composition. **REST/OpenAPI is the current binding;** it is not the permanent API family.

---

# 0. Agent Quick Path

**Read order:** [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) (context) → [Platform North Star](../architecture/afenda-platform-north-star.md) → this document §1–§12 → [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) §4 boxes → target PAS → Slice → Code.

**Consumer / UI materialization:** For cross-layer alignment (registry → loader → page → presentation), read [Full-Stack Integration North Star](full-stack-integration-north-star.md) after this document when wiring UI consumers to governed API operations — HTTP exposure stays here; materialization integrity stays there.

**This document answers:** why governed API exposure exists forever, what permanent capabilities the platform must provide at API boundaries, and how those capabilities map to Blueprint boxes.

**This document never answers:** registry file paths, OpenAPI generator modules, `.proto` layout, gate commands, slice order, or package npm names.

**Chain rule:** Platform North Star → Platform API Contract North Star → Blueprint box names → PAS-API-001 → style bindings → consumer bindings → Slice → Code

**Hard stops (business scope):**

- Do not treat HTTP contract governance as a substitute for operating-context assembly — every protected operation depends on resolved scope from the integration spine.
- Do not publish business meaning inside transport schemas without Enterprise Knowledge alignment — wire shapes are not definitions.
- Do not hand-edit generated OpenAPI publication snapshots; the registry is the sole authoring surface.
- Human session authentication and service-to-service service-actor authentication are distinct policies — never conflate at the contract layer.
- Internal v1 REST is the **current** governed exposure tier — concrete route namespace belongs to REST binding PAS; RPC, GraphQL, event, and agent bindings require governance before runtime.

**Implement mode rule:** Phase 0 six lines come from the **slice 9-field handoff** and `/afenda-coding-session` — not from re-deriving scope from §1–§12 on every session.

---

## 0.1 Boundary clarification for Enterprise acceptance

This North Star defines the **business architecture** of governed HTTP exposure. It does not define runtime folders, package names, generator commands, registry file paths, or generated artifact filenames.

Runtime and implementation evidence may be cited in §12 only as **proof** that a business capability has been realized. Such evidence does not confer implementation authority and must not be used as a build instruction.

| Belongs here (North Star) | Belongs in Blueprint | Belongs in PAS / Slice |
| --- | --- | --- |
| Business meaning of governed HTTP exposure | Package/layer ownership and consumer map | TypeScript contracts, registry shape, gates |
| Capability model and permanent invariants | Why the capability is separated | File paths, commands, generated snapshots |
| Evidence claims and reasoning | PAS inventory and status | Runtime tests and implementation proof |
| Contract lifecycle and business risks | Integration sequencing | Handler wiring and generator behavior |

**T5 rule:** Evidence tier T5 rows in §12 prove maturity — they must not be copied into §1–§11 as permanent doctrine.

---

## 0.2 API style binding doctrine (permanent)

Platform API Contract is **permanent exposure-governance authority**. It must not be structurally owned by ERP Integration Spine, REST, OpenAPI, Next.js route handlers, or any single API style.

```text
API Contract authority survives API-style changes.
API style bindings may be added, replaced, deprecated, or retired.
ERP Integration Spine consumes the API Contract authority; it does not own it.
```

| Layer | Role | Current maturity |
| --- | --- | --- |
| **API Contract (family)** | Operation identity, registry, lifecycle, policy, audit replay, ownership | [PAS-API-001](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **REST / OpenAPI (binding)** | Paths, HTTP semantics, OpenAPI publication, route handlers | Active — [PAS-API-REST-001](../PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |
| **RPC / Protobuf (binding)** | `.proto`, Connect/gRPC, TS generation | Reserved |
| **GraphQL (binding)** | Schema, resolvers, query policy | Reserved |
| **Event API (binding)** | Async integration contracts | Reserved |
| **Agent / Tool API (binding)** | Governed agent execution | Reserved |
| **ERP Integration Spine (consumer)** | Operating-context assembly + runtime wiring proof | [PAS-001A-API-BINDING](../PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |

**Enterprise doctrine:**

```text
API Contract is the family.
API style is the binding.
Transport is the mechanism.
Publication is the artifact.
Runtime is the implementation.
ERP Integration Spine is the consumer.
```

# 1. Domain Philosophy

Every enterprise platform that exposes HTTP APIs eventually fails on **silent contract drift**: clients parse undocumented fields, errors return incompatible shapes, operations lack trace metadata, and integrators discover scope rules only after a production breach.

Without a governed HTTP contract layer:

- Two teams ship the same path with different response envelopes and monitoring cannot classify failures.
- Partners and internal clients bind to JSON that was never declared, then break on the first schema tightening.
- Audit and support cannot replay a request because correlation metadata was optional or omitted.
- Multi-tenant ERP routes accept work without declared operating scope, enabling cross-entity linkage at the transport boundary.
- Agents and vendors regenerate parallel OpenAPI documents that contradict the runtime registry.

The Platform API Contract domain exists because **API exposure must be contract-first, auditable, and mechanically verifiable** — independent of transport, publication format, business workflow, database schema, or presentation surface.

**Source:** Platform NS §2 (canonical wire contracts) · ADR-0026 (documentation hierarchy) · ADR-0010 foundation gate (API contract governance) · ADR-0030 (ERP REST API contract standard) ✓

---

# 2. Domain Identity

| Field | Definition |
| --- | --- |
| **Mission** | Ensure every governed HTTP operation is declared once, validated at ingress and egress, published consistently, and traceable end-to-end. |
| **Success definition** | No production HTTP handler serves a path absent from the contract registry; no publication artifact diverges from the registry; every protected operation declares authentication, context, and permission intent; clients receive ProblemDetail-class errors and governed envelopes with correlation metadata. |
| **Scope** | Operation registry · schema-first request/response contracts · OpenAPI 3.1 publication discipline · authentication policy vocabulary (human session vs service actor) · operating-context policy on operations · idempotency, pagination, and rate-limit policy declarations · permission declarations on operations · contract lifecycle and stability tiers · internal API scope discipline · governance exceptions · consumer impact declaration · audit replay minimum · operation contract ownership accountability. |
| **Out of scope** | Business workflow orchestration · permission evaluation execution · session and credential storage · database persistence · master-data resolution · ledger posting · UI rendering · event dispatch · hand-authored publication JSON. |

**Platform API Contract is:** the permanent business architecture for how Afenda **names, constrains, and publishes** exposed operations at platform boundaries.

**Platform API Contract is not:** a catalog of business rules, a replacement for authorization decisions, a REST-only runtime, or a domain runtime for inventory, accounting, or HR workflows.

**Success (capability gain):** When fully realized, any integrator — human developer, partner, or agent — can discover, implement against, and audit HTTP operations without reading handler source code.

| Source | Reasoning |
| --- | --- |
| Platform NS §2 · ADR-0020 §Decision (HTTP wiring ownership) ✓ | **Because** HTTP is the primary machine integration surface for ERP · **Therefore** contract governance is a platform capability, not a per-feature afterthought |

---

# 3. Enterprise Vocabulary

Business meanings — not TypeScript types, Zod schemas, or OpenAPI component names.

| Term | Business meaning | Not confused with |
| --- | --- | --- |
| **HTTP operation contract** | The permanent declaration of one HTTP method on one path — including policies and schemas — before runtime wiring | Route handler implementation file |
| **Contract registry** | The authoritative ordered set of all declared HTTP operation contracts | Ad-hoc route folder inventory |
| **OpenAPI publication document** | The machine-readable API catalog generated from the registry — never hand-edited | Marketing API PDF or wiki page |
| **Generated contract snapshot** | The checked-in publication artifact produced by the generator pipeline | Authoring source for new operations |
| **Governed response envelope** | The standard success wrapper carrying payload plus request and correlation metadata | Raw database row JSON |
| **Problem detail error** | A structured failure surface with code, message, and optional detail — aligned to industry Problem Details practice | Plain-text error string or ambiguous HTTP body |
| **Authentication policy** | Declared rule for how an operation authenticates callers — human session vs automated service actor | Authorization outcome (permitted or denied) |
| **Human session policy** | Operation requires an authenticated human session established through the identity surface | Service-to-service credential |
| **Service actor policy** | Operation accepts a governed service identity for machine callers — distinct lifecycle from human sessions | Human user impersonation without audit |
| **Operating context policy** | Declared requirement for tenant and organizational scope on an operation — which scope dimensions must be present | Full permission evaluation |
| **Context header vocabulary** | Business names for tenant, company, organization, and workspace scope carried on requests | Cookie names or framework internals |
| **Permission declaration** | Operation-level statement that a capability check is required, optional, or absent — not the evaluation result | Role name or group membership |
| **Idempotency policy** | Whether a mutating operation accepts, requires, or rejects idempotency keys for safe retry | Database unique constraint alone |
| **Rate limit policy** | Declared traffic class for an operation — informs fair use and abuse response semantics | CDN or edge configuration |
| **Contract lifecycle** | Active, deprecated, or retired state of an operation — drives publication `deprecated` signaling | Feature flag for UI only |
| **Contract stability tier** | How aggressively an operation may change — internal-stable vs evolving exposure | Deployment environment name |
| **Internal API scope** | Business-governed internal REST exposure tier at current maturity — deliberate boundary before public or partner API | Public partner API tier |
| **Breaking-change class** | Classification of a contract amendment as additive, compatible, deprecated, or breaking — governs migration obligation | Deployment environment name |
| **Compatibility class** | Whether an amendment preserves existing client behavior without code change | Version number alone |
| **Ingress validation** | Caller request must match declared contract before business execution | Business rule evaluation |
| **Egress validation** | Handler response must match declared contract before serialization | Ad-hoc response shaping |
| **Publication validation** | Generated OpenAPI must match registry and schema source | Hand-edited specification |
| **Handler-coverage validation** | No protected handler may serve traffic outside the contract registry | Route folder inventory |
| **Governance extension metadata** | Vendor-specific operation metadata linking contract identity, policies, and documentation — projected into publication | Business payload fields |
| **Correlation metadata** | Request and correlation identifiers returned on success and failure for audit replay | Application log line text |
| **Contract drift** | Runtime registry or handler wiring diverges from publication snapshot or policy declarations | Intentional API versioning event |
| **Schema single source of truth** | Request and response shapes authored once in schema definitions that feed both runtime validation and publication | Parallel DTO and OpenAPI manual edits |
| **Governance exception** | Time-bounded waiver that may defer validation or lifecycle obligations — never bypass registry-first exposure | Permanent ungoverned route |
| **Consumer impact class** | Category of client affected by a deprecated or breaking change — internal UI, internal service, partner, agent, or public client | Deployment environment |
| **Audit replay minimum** | Minimum business facts required to replay a governed HTTP attempt for audit and support | Full distributed trace dump |
| **Operation contract ownership** | Named accountability for an HTTP operation contract — domain, technical, lifecycle, and consumer-impact owners | Handler file author |

**Source:** Platform Kernel NS §3.1 (trace, error, actor vocabulary) · OpenAPI 3.1 specification (T3) · RFC 9457 Problem Details (T3) · ADR-0030 ✓

---

# 4. Domain Capability Model

Permanent business capabilities (**EFR**). Each row maps to Blueprint §13 — not to packages or PAS here.

| Capability | Tier | Maturity target | EFR summary | Because → Therefore | Source (✓) | Review by |
| --- | --- | --- | --- | --- | --- | --- |
| **Authoritative operation registry** | Core | Enterprise | Every governed HTTP operation is registered before it may serve traffic | **Because** undiscovered routes cannot be gated or audited · **Therefore** registry-first is non-negotiable at HTTP boundary | ADR-0010 gate 5 · ADR-0026 ✓ | Enterprise |
| **Schema-first operation contracts** | Core | Enterprise | Request and response shapes are declared and validated — not inferred from handlers | **Because** leaky internal fields break security and integrations · **Therefore** schema is contract, not comment | ADR-0020 HTTP wiring ✓ | Enterprise |
| **OpenAPI 3.1 publication** | Core | Production | Machine catalog is generated from registry — contract-first OpenAPI | **Because** integrators require industry-standard discovery · **Therefore** publication follows registry, never precedes it | OpenAPI 3.1 (T3) ✓ | Production |
| **No hand-edited publication JSON** | Core | Enterprise | Generated snapshot is output only — drift is a governance failure | **Because** dual authoring guarantees silent divergence · **Therefore** hand-editing publication artifacts is prohibited | Runtime contract pipeline (T5) ✓ | Enterprise |
| **Governed response envelope** | Core | Enterprise | Success responses use one envelope with payload and trace metadata | **Because** clients and observability need stable parsing · **Therefore** envelope is constitutional for internal v1 scope | Platform API contract doctrine (T5) ✓ | Enterprise |
| **Problem detail errors** | Core | Enterprise | Failures use structured problem semantics across standard HTTP statuses | **Because** ambiguous errors break client automation and support triage · **Therefore** errors are classified, not improvised | RFC 9457 (T3) ✓ | Enterprise |
| **Human session authentication policy** | Core | Enterprise | Operations declare when human session is required | **Because** ERP actions must attribute human actors · **Therefore** session policy is explicit per operation | Identity & Access domain (T1) ✓ | Enterprise |
| **Service actor authentication policy** | Advanced | Production | Machine callers use governed service-actor identity — distinct from human session | **Because** multi-tenant ERP mixes human and S2S traffic · **Therefore** service-actor policy is a separate contract dimension | ERP Integration Spine S2S scaffold (T5) ✓ | Production |
| **Operating context dependency** | Core | Enterprise | Protected operations declare and consume assembled operating scope | **Because** HTTP without scope enables cross-entity leakage · **Therefore** context policy is mandatory on protected operations | ERP Integration Spine operating-context assembly (T5) ✓ | Enterprise |
| **Permission declaration on operations** | Core | Production | Each operation states required capability intent at contract layer | **Because** authorization without declared intent is undiscoverable · **Therefore** permission mode is part of the operation contract | Authorization domain (T1) ✓ | Production |
| **Idempotency policy declaration** | Advanced | Production | Mutations declare idempotency key acceptance for safe retry | **Because** ERP integrations retry on timeout · **Therefore** idempotency is contract-visible, not handler-local | Enterprise ERP integration practice (T3) ✓ | Production |
| **Pagination policy declaration** | Advanced | MVP | List operations declare cursor or offset policy where applicable | **Because** unbounded lists break clients and infrastructure · **Therefore** pagination mode is declared on contract | REST API governance (T5) ✓ | MVP |
| **Rate limit policy declaration** | Advanced | Production | Operations declare traffic class for fair-use response semantics | **Because** abuse response must be predictable · **Therefore** rate-limit policy is operation metadata | REST API governance (T5) ✓ | Production |
| **Contract lifecycle and deprecation** | Core | Production | Operations move through active → deprecated → retired with publication signaling | **Because** integrators need lead time on breaking change · **Therefore** lifecycle is business state on contract | OpenAPI deprecation semantics (T3) ✓ | Production |
| **Internal v1 REST scope discipline** | Core | MVP | Current exposure namespace is internal v1 — expansion requires governance | **Because** premature public API creates irreversible partner obligations · **Therefore** scope boundary is explicit | ADR-0020 internal routes (T0) ✓ | MVP |
| **Publication drift detection** | Core | Production | Registry, handlers, and snapshot stay aligned through automated attestation | **Because** "green CI" without contract proof is aspiration · **Therefore** drift detection is permanent capability | ADR-0010 gate 5 (T0) ✓ | Production |
| **Correlation on every response** | Core | Enterprise | Success and error responses carry correlation metadata for replay | **Because** HTTP-only ERP cannot be audited without trace · **Therefore** correlation is envelope invariant | Platform Kernel NS §3.1 trace vocabulary (T1) ✓ | Enterprise |
| **Domain payload shapes at wire layer** | Advanced | Production | Business payloads use governed wire shapes for cross-module labels | **Because** each domain inventing DTO vocabulary breaks reporting · **Therefore** payload schemas align with wire catalog discipline | Kernel Domain Vocabulary Catalog (T1) ✓ | Production |
| **Bidirectional contract validation** | Core | Enterprise | Ingress and egress are validated against declared contract — handlers may not widen wire shape silently | **Because** leaky responses break clients as surely as leaky requests · **Therefore** validation is bidirectional at the HTTP boundary | ADR-0010 gate 5 · ADR-0030 ✓ | Enterprise |
| **Version and breaking-change governance** | Core | Production | Changes classify as additive, compatible, deprecated, or breaking; breaking requires lifecycle transition, migration notice, and publication signaling before runtime removal | **Because** OpenAPI publication alone does not protect integrators · **Therefore** compatibility rules are business-governed | OpenAPI deprecation (T3) · ADR-0030 ✓ | Production |
| **Governance exception discipline** | Advanced | Enterprise | No exception bypasses registry-first exposure; waivers defer validation or lifecycle only with named owner, expiry, risk reason, and follow-up evidence | **Because** "temporary" ungoverned routes become permanent drift · **Therefore** exceptions are bounded and auditable | Enterprise ERP governance practice (T3) · ADR-0030 ✓ | Enterprise |
| **Consumer impact declaration** | Advanced | Production | Every deprecated or breaking operation identifies affected consumer impact classes before migration | **Because** migration risk depends on who consumes the API · **Therefore** consumer class is declared at lifecycle transition | ADR-0030 breaking-change governance ✓ | Production |
| **Audit replay minimum** | Core | Enterprise | Every governed operation boundary carries minimum replay facts for audit and support | **Because** correlation alone without context cannot reconstruct accountability · **Therefore** replay minimum is a business invariant | Platform Kernel NS trace vocabulary (T1) · ADR-0030 ✓ | Enterprise |
| **Operation contract ownership accountability** | Advanced | Production | Every operation contract has named domain, technical, lifecycle, and consumer-impact ownership | **Because** undowned contracts drift without migration accountability · **Therefore** ownership is a governance expectation enforced in PAS | Architecture Authority ownership doctrine (T1) ✓ | Production |

---

# 5. Domain Principles

| # | Principle | Because | Therefore |
| --- | --- | --- | --- |
| P1 | **Contract before handler** | Routes without contracts evade gates | Registry entry precedes production traffic |
| P2 | **Publication follows registry** | Dual authoring creates drift | OpenAPI is generated output, never authoring input |
| P3 | **Fail closed on auth and context** | Silent defaults cause isolation breaches | Missing session, actor, or scope yields explicit unauthorized or forbidden — never anonymous success |
| P4 | **One envelope, one error shape** | Client parsers must not branch per route | Governed envelope and ProblemDetail errors at internal v1 scope |
| P5 | **Scope is declared, not inferred** | URL slug or last-used company is not operating context | Context policy on every protected operation |
| P6 | **Human and machine actors are distinct** | S2S and session auth have different audit meaning | Separate authentication policies — never merged labels |
| P7 | **Transport does not own business meaning** | Wire types are not definitions | Payload labels defer meaning to Enterprise Knowledge |
| P8 | **HTTP status is the primary signal** | Monitoring and caches depend on status codes | Error body complements status — does not replace it |
| P9 | **No raw persistence shapes on the wire** | Internal columns leak security and coupling | DTO mapping is mandatory before serialization |
| P10 | **Drift is a governance incident** | Silent divergence breaks integrators | Attestation proves registry, wiring, and publication alignment |
| P11 | **Breaking change is explicit** | Silent removal breaks integrators and partners | Classification and lifecycle precede handler retirement |
| P12 | **No exception bypasses registry-first** | Temporary routes become permanent shadow APIs | Exceptions defer obligations only — never unregistered exposure |

## 5.0 Contract validation direction

| Validation | Meaning |
| --- | --- |
| **Ingress validation** | Caller request must match contract before business execution |
| **Egress validation** | Handler response must match contract before serialization |
| **Publication validation** | Generated OpenAPI must match registry and schema source |
| **Handler-coverage validation** | No protected handler exists outside registry |

## 5.1 Domain invariants

| # | Invariant |
| --- | --- |
| I1 | No governed path serves traffic without a registry contract at matching method and path. |
| I2 | Generated publication snapshot is never hand-edited — regeneration is the only repair for drift. |
| I3 | Protected operations declare operating context policy and depend on integration spine assembly — not ad-hoc scope reads. |
| I4 | Service-actor authenticated operations do not impersonate human session semantics without explicit audit design. |
| I5 | Error responses on governed routes use ProblemDetail-class structure — not ad-hoc string bodies on non-success status. |
| I6 | Correlation metadata is present on governed success and error envelopes. |
| I7 | Contract lifecycle changes (deprecated, retired) precede removal of runtime handlers. |
| I8 | Governed operations validate ingress and egress against the declared contract; handlers may not widen wire shape silently. |
| I9 | Publication and handler-coverage attestation prove registry, wiring, and snapshot alignment — drift is a governance incident. |
| I10 | No governance exception bypasses registry-first exposure; exceptions may only defer validation or lifecycle obligations with named owner, expiry date, risk reason, and follow-up evidence. |
| I11 | Deprecated or breaking operations declare affected consumer impact classes before migration proceeds. |
| I12 | Governed operation boundaries satisfy the audit replay minimum — see §5.2. |

**Source:** ADR-0010 · ADR-0030 · Platform Kernel NS trace vocabulary (T1) · ERP Integration Spine operating-context assembly (T5) ✓

## 5.2 Audit replay minimum

Business facts required to replay a governed HTTP attempt — not implementation field names or storage formats.

| Replay fact | Business meaning |
| --- | --- |
| **Operation identity** | Which declared HTTP operation was attempted |
| **Request identity** | Unique identifier for this HTTP attempt |
| **Correlation identity** | Cross-boundary identifier linking caller, handler, and observability |
| **Actor kind** | Human session vs service actor — distinct audit semantics |
| **Operating context** | Tenant and organizational scope dimensions applicable to the attempt |
| **Timestamp** | When the attempt occurred in business time |
| **Contract version / lifecycle state** | Active, deprecated, or retired state of the operation contract at attempt time |

**Rule:** Missing replay facts on a governed boundary is an audit governance failure — not a logging preference.

---

---

# 6. Enterprise Outcomes and KPIs

## 6.1 Outcome statements

| Outcome | Target | Measures | Source |
| --- | --- | --- | --- |
| **Contract completeness** | Zero orphan governed routes | Registry coverage attestation | ADR-0010 ✓ |
| **Publication fidelity** | Generated catalog matches registry | Drift detection green | Runtime pipeline (T5) |
| **Integrator self-service** | Developers discover operations without reading handlers | OpenAPI publication completeness | OpenAPI 3.1 (T3) |
| **Audit replayability** | Every governed call satisfies audit replay minimum | Replay fact completeness on envelope boundary | Platform Kernel NS trace (T1) · §5.2 |
| **Scope safety at HTTP boundary** | Protected operations fail closed without operating context | Integration spine attestation | ERP Integration Spine (T5) |
| **Actor clarity** | Human vs service-actor calls distinguishable in contract and audit | Authentication policy coverage | ERP Integration Spine S2S scaffold (T5) |

## 6.2 Success metrics (permanent KPI targets)

| KPI | Target | Measurement context | Source |
| --- | --- | --- | --- |
| **Registry coverage** | 100% of governed internal v1 routes | Per release attestation | ADR-0010 ✓ |
| **Publication drift incidents** | 0 undetected | CI contract governance | Runtime pipeline (T5) |
| **ProblemDetail conformance** | 100% governed error responses | Contract structural tests | RFC 9457 (T3) |
| **Protected path context attestation** | 100% spine-covered | Integration proof milestones | ERP Integration Spine (T5) |
| **Hand-edited publication files** | 0 | Repository policy | P2 · I2 |
| **Audit replay minimum conformance** | 100% governed boundaries | Per-release attestation | §5.2 · I12 |
| **Deprecated/breaking ops with consumer impact declared** | 100% | Lifecycle governance review | I11 · §8.5 |

---

# 7. Business Events

Events this domain **names** at the HTTP contract layer — not queue topics or PAS event type strings.

| Event (business vocabulary) | Meaning | Typical trigger | Related vocabulary (§3) |
| --- | --- | --- | --- |
| **Operation contract registered** | New HTTP operation declared in registry | Feature slice adds API surface | HTTP operation contract · Contract registry |
| **Operation contract deprecated** | Integrators must migrate; publication signals deprecation | Lifecycle governance decision | Contract lifecycle |
| **Operation invoked** | Client attempted a declared HTTP operation | Incoming request matches registry path | Governed response envelope |
| **Authentication policy violated** | Caller failed session or service-actor requirement | Missing or invalid credentials | Human session policy · Service actor policy |
| **Operating context rejected** | Required scope absent or inconsistent | Protected operation without assembled context | Operating context policy |
| **Permission declaration breached** | Authenticated caller lacks declared capability | Authorization denial at handler boundary | Permission declaration |
| **Schema validation failed** | Request or response violated declared shape | Invalid payload at ingress or egress | Schema single source of truth |
| **Problem detail error returned** | Failure communicated in governed error shape | Bounded business or transport failure | Problem detail error |
| **Publication drift detected** | Registry, handler, or snapshot misaligned | Attestation failure | Contract drift · Generated contract snapshot |
| **Idempotency key replayed** | Safe retry recognized for mutating operation | Duplicate key on declared mutation | Idempotency policy |
| **Rate limit applied** | Traffic class exceeded declared policy | Abuse or burst traffic | Rate limit policy |
| **Breaking change classified** | Contract amendment assigned additive, compatible, deprecated, or breaking class | Governance review of schema or policy change | Breaking-change class · Compatibility class |
| **Migration notice published** | Integrators notified of deprecated or breaking transition | Lifecycle governance before retirement | Contract lifecycle |
| **Consumer impact declared** | Affected consumer impact classes identified for deprecated or breaking operation | Lifecycle governance review | Consumer impact class |
| **Governance exception granted** | Time-bounded waiver recorded for validation or lifecycle deferral | Emergency or migration bridge — never registry bypass | Governance exception |

Dispatch to outbox, workflow continuation, and domain posting **execution** belong outside this domain.

---

# 8. Entity Lifecycles

Business-state lifecycles for concepts this domain owns — not workflow engines or database enums.

### 8.1 HTTP operation contract

```text
Proposed → Registered (active) → [Additive / Compatible in-place]
         → Deprecated (publication warning + migration notice)
         → Retired (breaking removal only after deprecation policy)
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Proposed | Operation under design — not serving traffic | Slice planning | Registered or withdrawn |
| Registered (active) | Declared, wired, and publication-visible | Registry + handler alignment | Deprecated · or in-place additive/compatible amendment |
| Deprecated | Serves traffic with publication warning — no new dependents | Lifecycle governance | Retired |
| Retired | Removed from registry and publication — no traffic | Migration complete · breaking class satisfied | — |

**In-place amendments:** Additive and compatible changes remain in Registered (active) with updated publication — they do not skip classification.

### 8.2 OpenAPI publication artifact

```text
Registry changed → Generated → Attested (no drift) → Regenerated on change
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Registry changed | Authoring surface updated | New or amended contract | Generated |
| Generated | Snapshot produced from registry | Generator pipeline success | Attested |
| Attested | Snapshot matches registry and wiring | Drift checks pass | Registry changed |
| Drift detected | Snapshot or wiring diverged | Attestation failure | Regenerated after fix |

### 8.3 Service actor authentication (contract view)

```text
Declared → Attested on protected paths → Expanded to new operations via contract amendment
```

**Rule:** Service-actor policy expansion follows the same registry-first path as human session policy — never handler-only S2S shortcuts.

| Source (✓) | Reasoning |
| --- | --- |
| ERP Integration Spine S2S scaffold (T5) · RFC 9457 (T3) | **Because** machine identity must be contract-visible · **Therefore** lifecycle is declared per operation, not inferred from headers alone |

### 8.4 Breaking-change classification

Business classification for contract amendments — not tool output labels.

| Class | Business meaning | Migration obligation |
| --- | --- | --- |
| **Additive** | New optional fields or new operations | None for existing clients |
| **Compatible** | Non-breaking clarification or constraint that does not reject previously valid client requests or remove previously valid response fields | Monitor; document in publication |
| **Deprecated** | Operation or field marked for future removal | Migration notice · publication `deprecated` signaling |
| **Breaking** | Existing clients may fail without change | Lifecycle transition · migration notice · lead time before retirement |

**Rule:** Deprecation and migration notice must precede breaking removal and handler retirement — never handler-only deletion. Exposure-tier change requires explicit ADR before Retired.

| Source (✓) | Reasoning |
| --- | --- |
| OpenAPI deprecation semantics (T3) · ADR-0030 ✓ | **Because** integrators need predictable evolution · **Therefore** classification is business state, not CI log text |

### 8.5 Consumer impact declaration

When an operation enters **Deprecated** or **Breaking** classification, the contract must declare which consumer impact classes are affected:

| Consumer impact class | Meaning |
| --- | --- |
| **Internal UI** | ERP presentation surfaces and browser clients |
| **Internal service** | In-platform machine callers and background jobs |
| **Partner** | External integrators under contractual API obligations |
| **Agent** | Automated implementers consuming publication for code generation |
| **Public client** | Unauthenticated or broad public API consumers — future exposure tier only |

**Rule:** Migration notice must name affected classes — migration risk assessment depends on consumer type, not schema diff alone.

| Source (✓) | Reasoning |
| --- | --- |
| ADR-0030 breaking-change governance ✓ | **Because** partner breakage differs from internal UI breakage · **Therefore** consumer class is declared at lifecycle transition |

---

# 9. Domain Boundary and Dependencies

## 9.1 This domain owns (business)

- HTTP operation identity (method + path namespace discipline)
- Contract registry as authoritative operation catalog
- Schema-first request and response contract semantics
- OpenAPI 3.1 publication discipline and snapshot lifecycle
- Governed response envelope and ProblemDetail error semantics at HTTP boundary
- Authentication **policy vocabulary** on operations (human session vs service actor)
- Operating context **policy declarations** on operations
- Idempotency, pagination, and rate-limit **policy declarations**
- Permission **declarations** on operations
- Contract lifecycle, stability tiers, and deprecation signaling
- Correlation metadata requirements on governed responses
- Audit replay minimum on governed operation boundaries
- Internal API scope boundary at current maturity (internal v1 REST)
- Governance exception discipline (bounded waivers — never registry bypass)
- Consumer impact declaration on deprecated and breaking lifecycle transitions
- Operation contract ownership accountability expectations

## 9.2 This domain never owns (business)

> **Hard stop:** HTTP contract governance does not evaluate permissions, assemble operating context, or authenticate credentials — it **declares** requirements that other domains execute.

| Exclusion | Owning domain / rationale |
| --- | --- |
| Session establishment and credential validation | Identity & Access |
| Permission evaluation and grant outcomes | Authorization |
| Operating context assembly and scope consistency checks | ERP Integration Spine (integration layer) |
| Branded identity and error **vocabulary** | Platform Kernel |
| Business meaning of wire labels in payloads | Enterprise Knowledge |
| Persistence, queries, and master-data rows | Persistence |
| Business workflow and posting logic | Line-of-business domains |
| Event dispatch, outbox, and retry | Execution |
| Edge CDN, WAF, and infrastructure rate limiting | Platform operations |
| Handlers without registry contracts | — (governance violation) |

## 9.3 Cross-domain dependencies (business domains only)

| Depends on | Required for |
| --- | --- |
| **Platform Kernel** | Error, trace, correlation, and actor-kind vocabulary on envelopes |
| **Identity & Access** | Human session facts consumed at handler boundary |
| **Authorization** | Capability evaluation against declared permission intent |
| **ERP Integration Spine** | Operating context assembly for protected operations (IS-002) |
| **Enterprise Knowledge** | Accepted meaning for contested wire labels in payloads |
| **Observability** | Correlation consumption in monitoring and audit backends |
| **Platform Architecture Authority** | Evidence that contract governance gates are registered |

| Provides to (domain) | What flows | Related §7 event |
| --- | --- | --- |
| **All ERP consumers** | Discoverable, validated HTTP operations | Operation contract registered |
| **Partners and internal integrators** | OpenAPI publication document | Publication attested |
| **Observability** | Correlation metadata on every response | Operation invoked |
| **Authorization** | Declared permission intent per operation | Permission declaration breached |
| **Agent orchestration** | Stable contract chain for automated implementation | Contract drift detected |

---

# 10. Enterprise Risks

| Risk | Business impact | Mitigation principle (business) | Source (✓) |
| --- | --- | --- | --- |
| **Contract drift** | Clients break silently; CI gives false confidence | Registry-first · generated publication only · drift attestation | ADR-0010 · P2 |
| **Hand-edited publication** | Integrators bind to stale artifact | I2 — snapshot is output only | Runtime pipeline (T5) |
| **Scope bleed via HTTP** | Cross-tenant or cross-entity data exposure | Context policy + integration spine dependency | ERP Integration Spine (T5) |
| **Ambiguous errors** | Automation and support cannot classify failures | ProblemDetail conformance · P4 | RFC 9457 (T3) |
| **Missing trace metadata** | Audit cannot replay HTTP attempts | Correlation on every envelope · I6 | Platform Kernel NS trace |
| **S2S/session conflation** | Wrong actor attributed in audit | Separate authentication policies · P6 | ERP Integration Spine S2S scaffold (T5) |
| **Internal field leakage** | Security and compliance breach | DTO mapping · P9 | ADR-0020 |
| **Premature public API** | Irreversible partner obligations | Internal v1 scope discipline | ADR-0020 |
| **Phantom operations** | Ungoverned routes evade gates | Registry coverage · I1 | ADR-0010 |
| **Meaning in transport schema** | Types treated as business definitions | Shape ≠ meaning · P7 | LAW K6 |
| **Shadow routes via exceptions** | Permanent ungoverned APIs masquerading as temporary | I10 — no registry bypass · named owner + expiry | P12 |
| **Undeclared consumer impact** | Wrong migration priority; partner surprise | I11 · §8.5 consumer class declaration | ADR-0030 |
| **Incomplete audit replay** | Regulatory replay failure despite correlation present | §5.2 audit replay minimum · I12 | Platform Kernel NS trace |

---

# 11. Quality Attributes

| Attribute | Domain expectation | Why it matters | Target (business language) | Source (✓) |
| --- | --- | --- | --- | --- |
| **Consistency** | One envelope and error shape across governed operations | Client and agent parsers must not branch per route | 100% internal v1 conformance | ISO/IEC 25010 compatibility (T3) |
| **Discoverability** | Every active operation appears in publication | Integrator self-service | Complete OpenAPI coverage | OpenAPI 3.1 (T3) |
| **Auditability** | Correlation plus audit replay minimum on all governed responses | Regulatory replay | 100% replay fact completeness | Platform Kernel NS (T1) · §5.2 |
| **Stability** | Lifecycle and stability tiers honored | Partner trust | Deprecated lead time before retirement | Contract lifecycle (§8.1) |
| **Security** | No raw persistence shapes; fail-closed auth/context | Data leakage prevention | Zero internal-field leaks in contract tests | ADR-0020 |
| **Verifiability** | Drift attestation on every change | Evidence over aspiration | Zero undetected drift per release | ADR-0010 |
| **Interoperability** | OpenAPI 3.1 and Problem Details alignment | Industry tool compatibility | Publication validates structurally | T3 standards |

---

# 12. Domain Evidence

## 12.0 Evidence tier legend

| Tier | Meaning |
| --- | --- |
| **T0** | Constitutional / accepted ADR authority |
| **T1** | Accepted platform or domain authority |
| **T3** | External industry standard or stable reference |
| **T5** | Runtime or implementation evidence — valid only as proof, not as North Star authority |
| **T6** | Domain expert review — hypothesis until upgraded to T0–T3 |

**Rule:** T5 rows prove that a capability has been realized in runtime — they must not be copied into §1–§11 as permanent business doctrine. Implementation paths and gate commands belong in [Blueprint](../BLUEPRINT/api-contract-blueprint.md) §4.

## 12.1 Evidence Register

| ID | Claim | Source class | Tier | Reference (exact anchor) |
| --- | --- | --- | --- | --- |
| E1 | Documentation hierarchy and domain North Star authority | ✓ | T0 | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| E2 | Foundation gate requires API contract governance before accounting | ✓ | T0 | [ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) gate 5 |
| E3 | ERP application owns HTTP wiring and OpenAPI contracts | ✓ | T0 | [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) §Decision · [ADR-0030](../adr/ADR-0030-erp-rest-api-contract-standard.md) |
| E4 | Platform expects canonical wire contracts at boundaries | ✓ | T1 | [Platform North Star](../architecture/afenda-platform-north-star.md) §2 |
| E5 | Operating context assembly on protected paths (IS-002) | ✓ | T5 | [PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) §2.1 · IS-002 |
| E6 | Service-actor S2S scaffold and attestation (R2) | ✓ | T5 | [PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) R2 · S2S attestation |
| E7 | ERP contract runtime attests registry-first publication | ✓ | T5 | [Platform HTTP Contract Blueprint](../BLUEPRINT/api-contract-blueprint.md) §4.4 runtime evidence |
| E8 | OpenAPI generator quality attested | ✓ | T5 | [Platform HTTP Contract Blueprint](../BLUEPRINT/api-contract-blueprint.md) §10 skill mirror · generator gap registry closed |
| E9 | OpenAPI 3.1 as publication standard | ✓ | T3 | [OpenAPI 3.1 specification](https://spec.openapis.org/oas/v3.1.0) |
| E10 | Problem Details for HTTP errors | ✓ | T3 | [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) |
| E11 | Trace and error vocabulary at boundaries | ✓ | T1 | [Platform Kernel North Star](kernel-north-star.md) §3.1 · §4 |
| E12 | ERP Integration Spine consumer proof doctrine | ✓ | T5 | [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) §4 ERP Integration Spine box |
| E13 | Breaking-change and bidirectional validation constitutional | ✓ | T0 | [ADR-0030](../adr/ADR-0030-erp-rest-api-contract-standard.md) §Decision 7–8 |

## 12.2 Decision Reasoning Log

| Decision ID | Claim | Because | Source (E#) | Therefore | Review by |
| --- | --- | --- | --- | --- | --- |
| D1 | Registry is sole authoring surface for HTTP operations | Dual authoring guarantees drift | E2 · E7 | Hand-edited OpenAPI JSON is prohibited | Enterprise |
| D2 | Protected operations depend on operating context assembly | HTTP without scope enables leakage | E5 · E11 | Context policy + integration spine — not handler-local scope | Enterprise |
| D3 | Human session and service actor are separate authentication policies | S2S and human audit semantics differ | E6 · E11 | Contract declares policy dimension independently | Production |
| D4 | Internal v1 is current deliberate exposure scope | Premature public API creates partner lock-in | E3 · E2 | Expansion requires governance amendment | MVP |
| D5 | ProblemDetail errors at governed boundary | Integrators and monitoring need structured failures | E10 · E9 | Error shape is contract — not per-route improvisation | Production |
| D6 | Publication generated from schema-first contracts | Single authoring surface for validation and catalog | E7 · E8 · E13 | Schema-first contracts feed validation and publication — never parallel manual edits | Production |
| D7 | Breaking changes require classified lifecycle | Silent removal breaks integrators | E13 · E9 | Additive/compatible/deprecated/breaking classes govern migration | Enterprise |

## 12.3 Evidence lifecycle obligations

| Document maturity | Required evidence action |
| --- | --- |
| **Idea → MVP** | §1 Philosophy + §4 EFR rows have Source; △ marked; §12.1 started |
| **MVP → Production** | All §4–§5, §9 EFR battle-proven (✓) · §3 core terms · §12.2 complete |
| **Production → Enterprise** | Full register · §7 events · §8 lifecycles · §16 EAC pass |
| **Any amendment** | Update Source class, Reasoning, `Last reviewed`, Decision log row |

**Runtime proof pointer:** File paths, gate commands, and generator modules — [Platform HTTP Contract Blueprint](../BLUEPRINT/api-contract-blueprint.md) §4.4 only. Do not treat §12 T5 rows as build instructions.

---

# 13. Capability → Blueprint Traceability

Capability → Blueprint box names only. Detail: [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) §4.

| Capability (§4) | Maturity tier | Blueprint box |
| --- | --- | --- |
| Authoritative operation registry | Core | **ERP Integration Spine** |
| Schema-first operation contracts | Core | **ERP Integration Spine** |
| OpenAPI 3.1 publication | Core | **ERP Integration Spine** |
| No hand-edited publication JSON | Core | **ERP Integration Spine** |
| Governed response envelope | Core | **ERP Integration Spine** |
| Problem detail errors | Core | **Kernel Vocabulary** · **ERP Integration Spine** |
| Human session authentication policy | Core | **ERP Integration Spine** |
| Service actor authentication policy | Advanced | **ERP Integration Spine** |
| Operating context dependency | Core | **ERP Integration Spine** |
| Permission declaration on operations | Core | **ERP Integration Spine** |
| Idempotency policy declaration | Advanced | **ERP Integration Spine** |
| Pagination policy declaration | MVP | **ERP Integration Spine** |
| Rate limit policy declaration | Advanced | **ERP Integration Spine** |
| Contract lifecycle and deprecation | Core | **ERP Integration Spine** |
| Internal v1 REST scope discipline | Core | **ERP Integration Spine** |
| Publication drift detection | Core | **ERP Integration Spine** |
| Correlation on every response | Core | **Kernel Vocabulary** · **ERP Integration Spine** |
| Domain payload shapes at wire layer | Advanced | **Kernel Domain Vocabulary Catalog** · **ERP Integration Spine** |
| Bidirectional contract validation | Core | **ERP Integration Spine** |
| Version and breaking-change governance | Core | **ERP Integration Spine** |
| Governance exception discipline | Advanced | **ERP Integration Spine** · **Platform Architecture Authority** |
| Consumer impact declaration | Advanced | **ERP Integration Spine** |
| Audit replay minimum | Core | **ERP Integration Spine** · **Kernel Vocabulary** |
| Operation contract ownership accountability | Advanced | **ERP Integration Spine** |

**Reading rule:** **ERP Integration Spine** owns HTTP wiring proof and operation registry discipline. **Kernel Vocabulary** owns trace, error, and actor words consumed on envelopes. **Kernel Domain Vocabulary Catalog** owns cross-domain wire labels inside payload schemas. Runtime paths and gates: [Platform HTTP Contract Blueprint](../BLUEPRINT/api-contract-blueprint.md) §4.

**When a capability needs a new box:** amend §4 → add §13 row → add Blueprint §4 row → satisfy Blueprint §7 → author PAS (Slot B+).

---

# 14. Domain Governance

## 14.1 Governance model

| Model | Definition |
| --- | --- |
| **Ownership** | Platform HTTP Contract domain spec owner (Platform Authority · ERP integration) |
| **Change model** | Amend when HTTP exposure **business meaning** changes — not when a single handler refactors |
| **Approval model** | Domain owner reviews Source + Reasoning deltas in §12 |
| **Acceptance model** | See §16 EAC |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-30 (Enterprise 10 / 10 governance-hardening) |

## 14.2 Domain authority model

| Level | Owns |
| --- | --- |
| **Domain North Star** | §1–§12 business architecture |
| **Architecture Blueprint** | Packages, layers, why separate, PAS inventory, consumers |
| **PAS** | Contracts, authority surfaces, slice catalog, gates |
| **Slice** | One implementation unit |
| **Code** | Implements the Slice |

## 14.3 Decomposition chain

```text
Platform HTTP Contract North Star §1–§12 (business architecture)

        ↓

Architecture Blueprint — ERP Integration Spine box + related kernel boxes

        ↓

PAS — contracts, surfaces, slice catalog

        ↓

Slice → Code
```

**Amendment rule:** Business meaning of HTTP exposure changes → this document first. Package or handler wiring changes → Blueprint or PAS — not §1–§12 unless business meaning changed.

## 14.4 Domain business invariants

See §5.1 I1–I12 — high-level rules agents must respect; TypeScript contracts and gate commands live in PAS and [Blueprint](../BLUEPRINT/api-contract-blueprint.md) §4 only.

## 14.5 Governance exceptions

Enterprise systems require bounded exceptions — never permanent shadow APIs.

| Rule | Requirement |
| --- | --- |
| **Registry-first is non-waivable** | No exception may bypass registry-first exposure |
| **Deferral only** | Exceptions may defer validation or lifecycle obligations — not registration |
| **Exception record** | Named owner · expiry date · risk reason · follow-up evidence obligation |
| **Follow-up** | Expired exceptions require registry alignment or ADR-amended extension — not silent renewal |

PAS and Architecture Authority own exception registration mechanics — this section states business expectation only.

## 14.6 Operation contract ownership accountability

Every HTTP operation contract is expected to declare four ownership dimensions — enforced in PAS contract metadata, not invented at handler level:

| Ownership dimension | Accountability |
| --- | --- |
| **Domain owner** | Business meaning and lifecycle intent of the operation |
| **Technical owner** | Schema, registry entry, and publication fidelity |
| **Lifecycle owner** | Deprecation, migration notice, and retirement timing |
| **Consumer impact owner** | Affected consumer classes and migration coordination |

**Rule:** Undeclared ownership is a governance gap — not an implementer convenience.

Platform documentation gates: [Platform North Star §13](../architecture/afenda-platform-north-star.md). Package gates: target PAS §13 only.

---

# 15. Domain Evolution

**May evolve here:** new §4 capabilities (e.g. public partner API tier) · §6 outcome targets · §7 events · vocabulary (§3) · internal scope expansion beyond v1

**Must not evolve here:** runtime handler implementation (PAS/slice) · slice order · registry disposition rows · PAS inventory (Blueprint §10)

**Long-term direction:**

- MVP: internal v1 REST fully registry-covered with drift attestation
- Production: service-actor policy on all machine-facing operations · cursor pagination pattern adoption
- Advanced: optional public API tier with explicit stability tier and partner lifecycle — requires ADR before §4 amendment
- Enterprise: full §16 EAC · zero publication drift · ProblemDetail and envelope conformance on every governed route

---

# 16. Enterprise Acceptance Criteria (EAC)

| Criterion | Gate | Traces to |
| --- | --- | --- |
| §1 Philosophy immutable and cited ✓ | Manual review — domain owner | §1 Source |
| §2 Identity complete (mission, definition, success) | Manual review | §2 |
| §3 Enterprise Vocabulary — core terms defined | Manual review + Enterprise Knowledge promotion for payload labels | §3 |
| §4 EFR complete — every row ✓ battle-proven at Production+ | Evidence audit | §4 · §12.1 |
| §5 Principles + §5.1 invariants cited | Manual review | §5 |
| §6 Outcomes + KPIs declared | Manual review | §6 |
| §7 Business Events — core events listed | Manual review | §7 |
| §8 Entity Lifecycles — contract, publication, service-actor, breaking-change, consumer impact | Manual review | §8 |
| §9 Boundaries + cross-domain dependencies | Manual review | §9 |
| §10 Risks — Core capabilities mitigated | Manual review | §10 |
| §11 Quality attributes declared | Manual review | §11 |
| §12 Evidence Register + Decision log complete | Manual review | §12.1–§12.2 |
| §13 maps every §4 capability to Blueprint box | Manual review + Blueprint exists | §4 → §13 |
| §1–§11 contain no package names, runtime paths, gate commands, generated artifact filenames, or PAS inventory | Boundary contract hygiene | doc-boundary-contract |
| §12 may cite ADR/PAS/runtime evidence only as proof; must not define implementation steps | Evidence hygiene | §12 |
| Ingress, egress, publication, and handler-coverage validation responsibilities are separated | Contract validation hygiene | §4 · §5 |
| Breaking-change classification exists for additive, compatible, deprecated, and breaking changes | Lifecycle governance | §8 |
| Runtime evidence is cited only in §12 and never used as implementation authority | Evidence boundary hygiene | §12 |
| Internal/public exposure tiers are business-governed before route namespace expansion | API exposure governance | §4 · §9 · §15 |
| Governance exception discipline — no registry bypass | Exception hygiene | §5 · §14.5 · I10 |
| Consumer impact classes declared on deprecated/breaking operations | Migration governance | §8.5 · I11 |
| Audit replay minimum defined and referenced by invariants | Audit hygiene | §5.2 · I12 |
| Operation contract ownership accountability declared as governance expectation | Ownership hygiene | §14.6 |
| Blueprint/PAS authorable without redefining domain | Manual review | Full §1–§12 |

---

# 17. Document Sync Obligations

| Change in this document | Then update |
| --- | --- |
| New §4 capability | §13 row · Kernel Blueprint §2 traceability · §4 box map (Slot B+) |
| New §3 vocabulary term | Enterprise Knowledge promotion for wire payload labels |
| New §7 event | Blueprint integration planning · PAS §4 event surface |
| Renamed capability | §13 + Blueprint box name (if business rename) |
| Boundary / dependency change (§9) | Blueprint §5 consumers · integration boxes |
| Risk or quality change (§10–§11) | Blueprint §4 Reasoning · PAS §0 |
| Internal API scope expansion (e.g. public tier) | ADR + §4 amendment — not handler-only |
| Business meaning stable; implementation only | Blueprint or PAS — **not** this document |
| NORTHSTAR README index | Add row when Slot B+ syncs catalog |

---

# 18. Required Reviews and References

## Before accepting this document

- [ ] §1–§11 complete; no package names, runtime paths, gate commands, or PAS inventory in business sections
- [ ] §12 cites ADR/PAS/runtime evidence as proof only — no build instructions
- [ ] §13 traces every §4 capability to a Kernel Blueprint box name
- [ ] [Platform HTTP Contract Blueprint](../BLUEPRINT/api-contract-blueprint.md) exists for runtime evidence
- [ ] No PAS inventory, build order, or slice counts in §1–§11
- [ ] No duplicate of Blueprint `why separate`, layers, or consumers
- [ ] [doc-boundary-contract.md](../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) checklist passes
- [ ] [doc-evidence-standard.md](../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) — EFR cited ✓ · §12 register · zero ✗ assumptions at Production+
- [ ] §3 vocabulary ready for Enterprise Knowledge derivation where payload labels contested

## Derived documents

**Produces:** [Platform HTTP Contract Blueprint](../BLUEPRINT/api-contract-blueprint.md) · Kernel Blueprint box traceability (Slot B+)

**Never produces:** slices · handler wiring · generated OpenAPI JSON · gate script definitions

## References (link only)

| Document | Role |
| --- | --- |
| ADR-0030 ERP REST API contract standard | [`ADR-0030-erp-rest-api-contract-standard.md`](../adr/ADR-0030-erp-rest-api-contract-standard.md) |
| Platform HTTP Contract Blueprint | [`api-contract-blueprint.md`](../BLUEPRINT/api-contract-blueprint.md) |
| Platform North Star | [`afenda-platform-north-star.md`](../architecture/afenda-platform-north-star.md) |
| Platform Kernel North Star | [`kernel-north-star.md`](kernel-north-star.md) |
| Kernel Blueprint | [`kernel-blueprint.md`](../BLUEPRINT/kernel-blueprint.md) |
| ERP Integration Spine standard | [`PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md`](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| OpenAPI implementation skill | [`afenda-openapi/SKILL.md`](../.cursor/skills/afenda-openapi/SKILL.md) |
| Boundary contract | [`doc-boundary-contract.md`](../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) |
| Evidence standard | [`doc-evidence-standard.md`](../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| ADR Constitution | [`adr-constitution.md`](../.cursor/skills/kernel-authority/reference/adr-constitution.md) |

---

# 19. Final Doctrine

## 19.1 Enterprise acceptance summary

The Platform API Contract North Star is accepted at **Enterprise 10 / 10** because it defines governed API exposure as a **registry-first, schema-first, validation-backed, publication-generated, actor-clear, context-aware, lifecycle-governed, exception-bounded, consumer-aware, replay-complete, ownership-accountable, and evidence-attested** business architecture — **independent of REST, OpenAPI, or any single API style binding**.

It does **not** own runtime paths, handler implementation, generated artifacts, package boundaries, or PAS slice execution. Those belong to Blueprint, style bindings, consumer bindings, Slice, and Code.

**Therefore:** this North Star is authority for **meaning and acceptance** — not authority for **implementation** or a single transport.

## 19.2 Platform API Contract covenant

Afenda exposes ERP capability to the world only through declared operations — schema-validated, context-aware, actor-clear, trace-rich, and published from a single registry. Integrators, partners, auditors, and agents trust the platform because the contract layer is mechanical truth, not handler folklore.

## 19.3 Enterprise truth bar

Nothing becomes enterprise truth because code exists. It becomes enterprise truth when it is **accepted, declared, evidenced, governed, and mechanically attested**.

For API contracts:

| Bar | Rule |
| --- | --- |
| No registry | No exposed operation |
| No schema | No contract |
| No validation | No trust |
| No governed publication | No integration truth |
| No correlation + replay minimum | No audit |
| No lifecycle | No enterprise stability |
| No boundary hygiene | No North Star acceptance |
| REST-only thinking | No 9.5+ architecture |

§1–§12 define **what governed API exposure means in enterprise business architecture**.

§0.2 and §13 bridge to Blueprint boxes and style bindings — **names only**.

[PAS-API-001](../PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) defines **cross-style invariants**.

Style binding PAS documents define **how to build and attest per API style**.

If the **business meaning** of API exposure changes, amend §1–§12 — then Blueprint.

If handlers, generators, or gates change, amend style binding PAS or slices — **not** §1–§12 unless business meaning changed.

> **May belong here:** §1–§12 business architecture with **Source + Reasoning** · §12 Evidence · §13 capability→box · §14–§18 governance.

> **Belongs in Blueprint:** packages, layers, why separate, status, consumers, PAS inventory.

> **Belongs in PAS:** contract TypeScript surfaces, slice catalog, gate commands, runtime event type names, ownership metadata enforcement.

> **Belongs in Enterprise Knowledge:** promoted vocabulary atoms derived from §3 payload labels.
