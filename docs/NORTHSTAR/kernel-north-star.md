# Platform Kernel North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Platform Kernel — shared enterprise language substrate |
| **Domain type** | Platform substrate domain *(not a business LoB such as Accounting, HRM, or CRM)* |
| **Constitutional question** | *What does the platform say at boundaries?* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Cross-domain laws** | [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) — K6 (shape ≠ meaning) |
| **Derived document** | [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) · [Platform Blueprint rollup](../architecture/afenda-architecture-blueprint.md) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) · [ADR-0022](../adr/ADR-0022-postgres-split-id-persistence-model.md) · [ADR-0023](../adr/ADR-0023-tenant-human-reference-numbering.md) |
| **Maturity** | Enterprise Accepted — peer-enhanced 2026-06-29 |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-29 |
| **Package / PAS inventory** | See [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) — not declared here |
| **Next document** | [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) |

> **One sentence:** Every Afenda module must speak one stable enterprise language for identity, scope, errors, and cross-domain facts before any business workflow can be trusted, audited, or integrated.

> **Platform language, not business logic:** This domain governs **how the platform speaks at boundaries** — wire shapes, scope words, trace vocabulary, and integration proof — independent of databases, auth evaluation, or domain posting.

---

# 0. Agent Quick Path

**Read order:** [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) (context) → Platform NS → this document §1–§12 → [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) → [KERNEL PAS](../PAS/KERNEL/README.md) → Slice → Code.

**This document answers:** why the kernel exists forever, what enterprise capabilities it permanently provides, and how they map to Blueprint boxes.

**This document never answers:** package paths, wire contracts, resolver spine, gate commands, or slice order.

**Chain rule:** Platform North Star → Platform Kernel North Star → Kernel Blueprint → PAS → Slice → Code

**Hard stops (business scope):**

- Kernel never resolves business state — it only carries accepted vocabulary and boundary-safe references.
- Do not treat Platform Kernel as an Accounting/HRM/CRM business domain.
- Resolver, spine, persistence, and authorization evaluation belong outside this domain.
- Wire type does not imply accepted business meaning ([LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md)).

---

# 1. Domain Philosophy

Every enterprise ERP must agree on **what things are called and how they are scoped** before it can agree on **what happened in the business**.

Without a shared language:

- Two modules can use the same word for different scopes (tenant vs company vs org).
- Integrations break silently when IDs cross package boundaries as plain strings.
- Audit trails lose correlation when execution chains cannot be traced end-to-end.
- Multi-company operations link records across incompatible scopes without detection.
- AI-assisted development reinvents vocabulary in every package, causing irreversible drift.

The Platform Kernel domain exists because **cross-module facts and primitive vocabulary must be immutable, battle-proven, and independent of any single business workflow, database schema, or UI surface**.

**Source:** Platform NS §2 (canonical wire contracts) · ADR-0026 (governed platform constitution) · Kernel vocabulary authority doctrine (T5)

---

# 2. Domain Identity

| Field | Definition |
| --- | --- |
| **Mission** | Preserve the smallest stable enterprise language that all Afenda modules share at boundaries. |
| **Success definition** | No production module defines parallel identity, context, error, or event vocabulary outside the governed kernel language; every protected surface attests consumer integration. |
| **Scope** | **Primitive vocabulary** (§3.1): identity, scope, trace, errors, event envelope, grant-scope words, localization codes, entity authority metadata, business reference families. **ERP wire catalog** (§3.2): cross-domain business labels at wire layer — meaning at boundaries only. |
| **Out of scope** | Business decisions, persistence, authorization evaluation, rendering, formatting, posting, workflows, tenant provisioning execution, and external integration transport. |

---

# 3. Enterprise Vocabulary

Business meanings — not implementation types. Two governed classes — do not merge in prose or ownership.

## 3.1 Kernel primitive vocabulary

Platform substrate terms shared by every module.

| Term | Enterprise meaning | Not confused with |
| --- | --- | --- |
| **Enterprise identity** | A governed reference to a thing that may cross module boundaries (tenant, legal entity, document, correlation). | Business meaning of the referenced thing (Enterprise Knowledge) |
| **Identity family** | A branded ID category with one parse/validation rule at wire ingress (tenant, entity, document, correlation). | Database primary key strategy |
| **Operating scope** | The hierarchy of boundaries within which a user or process is acting (tenant → group → entity → org → team → project → …). | Permission grant result |
| **Active scope set** | The one or more operating scopes authorized for the current session or job — not every scope the actor could ever access. | Full org chart |
| **Scope consistency** | Rule that linked cross-module references must share compatible operating scope — no silent cross-entity linkage. | Business validation logic |
| **Effective scope** | Operating scope valid *as-of* a business date or event time — not only "now". | Calendar master data |
| **Tenant boundary** | The outermost isolation boundary for subscriber data and configuration — distinct from legal entity. | Hosting region or deployment |
| **Tenant lifecycle (vocabulary)** | Provisioned → Active → Suspended → Offboarded — substrate words only; execution elsewhere. | Subscription billing |
| **Execution trace** | The immutable chain linking a user action, API call, job, or event to a single auditable attempt. | Application log text |
| **Correlation identity** | The ID that ties all spans of one business attempt across services. | Causation or parent event ID |
| **Causation identity** | The ID of the immediate predecessor that caused this attempt or event. | Correlation identity |
| **Distributed trace context** | W3C-aligned trace propagation vocabulary (trace parent, baggage) carried on wire-safe facts. | Observability backend config |
| **Actor kind** | Human, service, system, or delegated application — *who initiated* at vocabulary level. | Login session record |
| **Integration identity** | A governed reference to an external or cross-tenant initiator without conflating with human user. | OAuth token payload |
| **Grant scope** | The vocabulary of *where* a permission applies — not whether it is granted. | Permission evaluation outcome |
| **Wire-safe fact** | A value that may cross process boundaries as JSON without leaking runtime objects. | In-memory domain object |
| **Result / error vocabulary** | Shared classification words for outcomes and failures at boundaries. | HTTP status code alone |
| **Domain event envelope** | Standard wrapper metadata for *what happened* — event identity, schema version, tenant, correlation, causation, occurred-at — not dispatch or retry. | Message queue topic name |
| **Localization code vocabulary** | Shared brands for locale, timezone (IANA), currency, country, and unit-of-measure *codes* — not formatting or translation. | Fiscal calendar or FX policy |
| **Platform entity authority** | Reservation metadata for who owns which platform-level entity ID families — not entity rows. | Master data runtime |
| **Business reference identity** | Cross-module reference ID family for business records (customer, product, employee) — not master data resolution. | Operational workflow state |
| **Contract stability** | How likely a wire contract is to change — see §3.3. | Implementation deployment status |
| **Tenant extension boundary** | Vocabulary distinguishing platform-amended wire types from tenant-specific custom fields — extensions must not fork kernel brands. | Tenant configuration store |
| **Consumer integration** | Proof that production surfaces speak the kernel language consistently — not new kernel vocabulary. | Feature completeness |

## 3.2 ERP wire vocabulary

Cross-domain business labels at the wire layer. Governed by the ERP wire catalog (Blueprint Catalog box) — distinct lifecycle from primitive vocabulary.

| Term | Enterprise meaning | Not confused with |
| --- | --- | --- |
| **ERP wire term** | A cross-domain business label (account type, posting status, lead stage) agreed at platform level — not ledger behavior. | Knowledge Atom definition |
| **Domain wire catalog** | The governed set of ERP wire terms — meaning authority remains Enterprise Knowledge; kernel retains shapes only. | Domain runtime enum implementation |

**Separation rule:** Primitive vocabulary (§3.1) defines *how the platform speaks*. ERP wire vocabulary (§3.2) defines *which business labels may cross domains* — never operational state or workflow outcomes.

## 3.3 Contract stability tiers

Consumers need to know **how likely wire vocabulary is to change**:

| Stability | Meaning | Consumer expectation |
| --- | --- | --- |
| **Constitutional** | Rarely changes — identity families, tenant boundary, fail-closed scope | Amend only via ADR + domain owner |
| **Stable** | Production binding — safe for automation and integration | Conformance gates enforce |
| **Evolutionary** | Active refinement — ERP wire catalog and localization codes may extend | Monitor lineage; additive preferred |
| **Experimental** | Pilot vocabulary — not production-automation safe | Explicit exposure policy |
| **Deprecated** | Frozen for new use — historical queries only | Must not drive new work |

## 3.4 Identity family taxonomy

Three layers — do not collapse:

```text
Enterprise identity family     (how IDs are branded and parsed at ingress)
        │
        ▼
Platform entity authority      (who owns Tenant, Entity, Org, User families)
        │
        ▼
Business reference identity    (Customer, Product, Employee ref families)
```

**Rule:** Platform entity authority records *ownership metadata* only. Business reference identity records *cross-module ref families* only. Neither resolves rows.

**Source:** Kernel vocabulary authority (T5) · ERP wire catalog scope (T5) · Platform NS §2 (T1)

---

# 4. Capability Model

Permanent capabilities with maturity tiers. **Because → Therefore** reasoning is mandatory at Production+.

| Capability | Tier | Maturity | EFR summary | Because → Therefore | Source |
| --- | --- | --- | --- | --- | --- |
| **Shared enterprise identity** | Core | Enterprise | Branded IDs and reference families cross all modules without ambiguity | **Because** plain strings cross boundaries silently · **Therefore** every cross-package fact uses governed identity families | ADR-0021–0023 · Kernel vocabulary identity surfaces (T5) |
| **Operating scope hierarchy** | Core | Enterprise | Tenant → entity → org → project is one agreed hierarchy | **Because** multi-entity ERPs fail on scope ambiguity · **Therefore** one hierarchy vocabulary binds all modules | ADR-0011 · Kernel vocabulary operating scope (T5) |
| **Multi-scope consistency** | Core | Enterprise | Linked cross-module references must declare compatible operating scope | **Because** cross-company linkage causes audit and compliance failure · **Therefore** scope consistency is a substrate invariant, not optional validation | Odoo multi-company pattern (T3) · Kernel vocabulary scope consistency (T5) |
| **Effective dating vocabulary** | Advanced | Enterprise | As-of scope and identity context can be named without resolver logic | **Because** org structure and currency change over time · **Therefore** kernel carries effective-scope words; owners resolve | Enterprise ERP universal (T3) |
| **Execution traceability** | Core | Enterprise | Every protected action carries correlation and execution identity | **Because** async ERP cannot be audited without end-to-end trace · **Therefore** trace vocabulary is constitutional | Kernel vocabulary trace surfaces (T5) · W3C Trace Context (T3) |
| **Result and error vocabulary** | Core | Enterprise | Failures expressed in shared, auditable vocabulary | **Because** incompatible errors break integrations and support · **Therefore** one result/error word set at boundaries | Kernel vocabulary result/error surfaces (T5) |
| **Policy decision vocabulary** | Core | Enterprise | Permission *words* (module × action × scope) are platform-owned | **Because** authorization without shared scope words is inconsistent · **Therefore** kernel owns grant-scope vocabulary only | Kernel vocabulary grant-scope words (T5) |
| **Domain event envelope** | Core | Enterprise | Business events share one envelope shape at boundaries | **Because** event-driven integrations require interoperable metadata · **Therefore** envelope aligns with CloudEvents-style context attributes | Kernel vocabulary event envelope (T5) · CloudEvents 1.0 (T3) |
| **Localization code vocabulary** | Core | Enterprise | Locale, timezone, currency, country, UOM *code brands* shared across modules | **Because** each domain inventing format codes breaks reporting · **Therefore** kernel owns code brands; Finance/Inventory own masters and conversion | Kernel vocabulary localization codes (T5) |
| **Platform entity authority registry** | Core | Enterprise | Platform-level entity ID families have declared ownership metadata | **Because** undclared ownership causes duplicate ID systems · **Therefore** authority registry is vocabulary-only reservation map | Kernel vocabulary entity authority (T5) |
| **Business reference identity families** | Advanced | Enterprise | Cross-module business record refs use governed ID families | **Because** integrations reference customers/products by ID across modules · **Therefore** ref families are kernel vocabulary; master data is not | Kernel vocabulary ref families (T5) · ADR-0020 |
| **ERP domain wire catalog** | Advanced | Production | Cross-domain business terms catalogued without owning runtime | **Because** accounting/HRM/CRM must share wire labels · **Therefore** catalog separates shape from meaning | ADR-0020 · ERP wire catalog (T5) |
| **Minimal async context frame** | Core | Enterprise | Safe propagation of execution frame; parallel work cannot leak frames | **Because** Promise parallelism loses audit context · **Therefore** fork/isolated frame vocabulary is mandatory | Kernel vocabulary async context frame (T5) |
| **Tenant lifecycle vocabulary** | Advanced | Production | Subscribe/provision/active/suspend/offboard states named at substrate level | **Because** SaaS ERP must isolate tenants from first request · **Therefore** lifecycle *words* live in kernel; provisioning *execution* does not | SAP CAP multitenancy (T3) |
| **Actor and integration identity** | Advanced | Production | Human vs service vs delegated application initiators distinguished at boundaries | **Because** S2S and multi-tenant ERP mix actor types · **Therefore** actor kind is vocabulary; session auth is not | Dataverse multi-tenant S2S (T3) |
| **Tenant extension boundary** | Advanced | Production | Tenant customization cannot fork platform wire brands | **Because** per-tenant extensions otherwise become parallel vocabulary · **Therefore** extensions are explicitly non-authoritative for kernel brands | SAP tenant extensibility (T3) |
| **Consumer integration proof** | Core | Production | Production ERP resolves scope and assembles operating context through one spine | **Because** closed vocabulary does not guarantee production compliance · **Therefore** attestation is a permanent capability | ERP Integration Spine attestation (T5) |

**Capability maturity key:** Idea · MVP · Production · Enterprise

---

# 5. Domain Principles

| # | Principle | Because | Therefore |
| --- | --- | --- | --- |
| P1 | **Kernel owns words; owners own decisions** | Vocabulary drift breaks integrations faster than logic bugs | Kernel defines shapes; permissions evaluates; ERP resolves; database persists |
| P1a | **Kernel never resolves business state** | Resolver logic in kernel reintroduces circular platform deps | Kernel carries vocabulary and boundary-safe references only |
| P2 | **Zero dependency substrate** | Platform vocabulary must not pull auth, DB, or UI into every import | Kernel has no runtime deps on higher layers |
| P3 | **Fail closed at boundaries** | Silent fallbacks to wrong tenant/entity destroy auditability | Absent context is explicit null — never guessed |
| P4 | **Wire ingress is owned once** | Duplicate parsers create incompatible branded types | Parse/assert at designated owner; kernel projects branded slots |
| P5 | **Vocabulary before runtime** | Domain packages must not invent parallel IDs or scope models | New cross-package facts require kernel amendment path |
| P6 | **Integration is provable** | Closed vocabulary does not guarantee production speaks it | Consumer integration attestation proves end-to-end spine |
| P7 | **Scope consistency is non-negotiable** | Cross-entity linkage is a compliance failure mode | Linked references must declare compatible scope — never silent mismatch |
| P8 | **Shape ≠ meaning** | Types are not definitions | Wire labels defer meaning to Enterprise Knowledge ([LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md)) |
| P9 | **Interop by vocabulary alignment** | Event and trace integrations fail without shared metadata words | Envelope and trace vocabulary align with industry standards where cited (T3) |
| P10 | **Tenant isolation starts at vocabulary** | Context bleed across tenants is catastrophic | Tenant boundary and lifecycle words are constitutional; cache and token rules live in Identity/Persistence |

## 5.1 Domain invariants

| # | Invariant |
| --- | --- |
| I1 | No production module introduces parallel branded ID or scope vocabulary outside kernel amendment path. |
| I2 | Absent tenant or operating scope is explicit null — never inferred from URL, default company, or last-used context. |
| I3 | Linked cross-module references at boundaries must satisfy scope consistency (§3.1) — violations are fail-closed. |
| I4 | Wire types and ERP wire terms do not imply accepted business meaning without Enterprise Knowledge atom. |
| I5 | Kernel vocabulary amendment requires Domain NS or ADR change before implementation slice — not reverse. |
| I6 | Tenant-specific extensions must not redefine or fork constitutional identity or scope brands. |
| I7 | Correlation identity is mandatory on every protected execution path; causation identity is mandatory on emitted domain events. |
| I8 | Localization vocabulary owns code brands only — never formatting, translation, fiscal calendar, or FX conversion. |

**Source:** Kernel vocabulary invariants (T5) · ERP Integration Spine framing (T5)

---

# 6. Enterprise Outcomes and KPIs

## 6.1 Outcome statements

| Outcome | Target | Measures | Source |
| --- | --- | --- | --- |
| **Vocabulary singularity** | Zero parallel ID/scope models in production | Boundary and prohibited-surface conformance | Platform NS §2 |
| **Integration coherence** | 100% protected ERP surfaces use canonical resolver spine | Consumer integration attestation | ERP Integration Spine (T5) |
| **Audit traceability** | Every protected action carries correlation + execution identity | Context wire triad conformance | Kernel vocabulary trace surfaces (T5) |
| **Scope integrity** | Zero undetected cross-entity scope linkage in governed surfaces | Scope consistency checks at integration boundaries | §5.1 I3 |
| **Drift prevention** | Kernel PAS, SKILL, and runtime matrix stay aligned | Documentation drift gate | Platform governance |
| **Agent-safe delivery** | Any agent implements a slice without re-deriving scope | PAS + slice handoff + kernel-authority skill | Platform NS §3.1 |
| **Event interop readiness** | Cross-system events carry envelope metadata sufficient for trace replay | Envelope field completeness on integration paths | CloudEvents (T3) E8 |

## 6.2 Success metrics (permanent KPI targets)

| KPI | Target | Measurement context | Source |
| --- | --- | --- | --- |
| **Parallel vocabulary incidents** | 0 in production | Per release boundary scan | Platform governance |
| **Protected path trace coverage** | 100% | API, job, and event ingress | Kernel vocabulary trace surfaces (T5) |
| **Consumer spine attestation** | 100% of declared ERP milestones | Integration proof slices | ERP Integration Spine (T5) |
| **Wire catalog drift** | 0 orphan ERP wire terms | Catalog ↔ Knowledge alignment | ERP wire catalog (T5) |

---

# 7. Business Events

Events the kernel domain **names** (envelope vocabulary) — not dispatches.

| Event (business vocabulary) | Meaning | Typical trigger | Related vocabulary (§3) |
| --- | --- | --- | --- |
| **Tenant boundary established** | Subscriber isolation context identified for an attempt | First request after tenant resolution | Tenant boundary · Tenant lifecycle |
| **Tenant boundary missing (fail-closed)** | Protected work attempted without tenant context | Missing or invalid tenant on protected path | Tenant boundary · P3 |
| **Scope context established** | Operating scope resolved for a protected surface | Successful scope assembly | Operating scope · Active scope set |
| **Scope consistency violated (vocabulary)** | Linked references failed compatible-scope rule | Cross-module link with mismatched scope | Scope consistency · I3 |
| **Effective scope applied** | As-of scope context named for an attempt | Backdated or period-bound operation | Effective scope |
| **Execution started** | Traceable attempt began with correlation identity | API, job, or user action ingress | Execution trace · Correlation identity |
| **Execution failed (vocabulary)** | Failure classified using shared error vocabulary | Bounded failure at trust boundary | Result / error vocabulary |
| **Identity referenced cross-module** | Governed ID crossed a package boundary | Inter-module call or event | Enterprise identity · Identity family |
| **Domain term referenced** | ERP wire term from catalog used at a boundary | Cross-domain payload | ERP wire term |
| **Domain event envelope emitted (vocabulary)** | Business fact wrapped with standard envelope metadata | Posting, status change, integration handoff | Domain event envelope · Causation identity |
| **Integration attestation completed** | Consumer spine proven for a production milestone | Integration Spine attestation milestone | Consumer integration |
| **Vocabulary amended** | New or changed kernel word accepted through governance | ADR or NS amendment closed | Contract stability · Kernel vocabulary amendment (§8) |

Dispatch, retry, outbox, workflow orchestration, and tenant provisioning **execution** belong outside this domain.

---

# 8. Entity Lifecycles

Business-state lifecycles for concepts this domain owns at vocabulary level.

### 8.1 Enterprise identity reference

```text
Proposed → Accepted (governed family) → Active use at boundaries → Deprecated (ADR) → Retired
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Proposed | New ID family under review | Gap identified | Accepted or Rejected |
| Accepted | Governed family approved for wire use | ADR or NS amendment | Active use |
| Active use | Used at production boundaries | First consumer adoption | Deprecated |
| Deprecated | New work must not adopt; existing use grandfathered | ADR supersession | Retired |
| Retired | No new or existing boundary use | Migration complete | — |

### 8.2 Operating scope resolution (business view)

```text
Request received → Tenant boundary identified → Entity hierarchy resolved → Scope branded → Scope consistency checked → Consumer authorized
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Request received | Attempt entered platform boundary | Ingress | Tenant boundary identified |
| Tenant boundary identified | Subscriber context known or explicitly null | Tenant resolution | Entity hierarchy resolved |
| Entity hierarchy resolved | Operating scope chain assembled | Spine resolution | Scope branded |
| Scope branded | Scope expressed in kernel vocabulary | Branding projection | Scope consistency checked |
| Scope consistency checked | Linked refs compatible or fail-closed | Consistency rule | Consumer authorized |

### 8.3 Tenant lifecycle (vocabulary)

```text
Provisioned → Active → Suspended → Offboarded
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Provisioned | Tenant exists; not yet serving traffic | Subscription accepted | Active |
| Active | Tenant may serve protected work | Readiness attestation | Suspended or Offboarded |
| Suspended | Tenant blocked from new protected work | Policy or billing hold | Active or Offboarded |
| Offboarded | Tenant vocabulary retained for audit; no live service | Offboarding complete | — |

### 8.4 Kernel vocabulary amendment

```text
Need identified → ADR or NS amendment → Slice delivered → Gates green → Enterprise Accepted
```

### 8.5 Constitutional promotion pipeline (ERP wire terms)

```text
Domain North Star §3.2 or business domain NS §3
        │
        ▼
Enterprise Knowledge atom (accepted meaning)
        │
        ▼
ERP wire catalog entry (shape only)
        │
        ▼
Domain runtime consumer (never reverse)
```

**Rule:** Reverse flow is forbidden — catalog → atom without Knowledge acceptance requires NS amendment first.

---

# 9. Boundary and Dependencies

## 9.1 This domain owns (business)

- **Primitive vocabulary** (§3.1): identity, operating scope, execution trace, result/error words, grant-scope words, event envelope, localization codes, entity authority metadata, business reference families, tenant lifecycle words, actor kinds
- Hierarchy semantics for operating scope (tenant through project and readiness signals)
- Multi-scope consistency and effective-scope vocabulary
- Cross-module identity and reference vocabulary
- Contract stability tiers (§3.3)
- **ERP wire catalog** (§3.2): governed business labels at wire layer — not operational workflows

## 9.2 This domain never owns (business)

> **Hard stop:** Kernel never resolves business state. It only carries accepted vocabulary and boundary-safe references.

- Who is logged in (Identity & Access domain)
- Whether an action is permitted (Authorization domain)
- **Resolution of scope, hierarchy, or master data** (ERP integration spine + Persistence — not kernel)
- Tenant database provisioning, routing, and subscription execution (Platform operations / Persistence)
- What was stored or queried (Persistence domain)
- What the business calculated or posted (Accounting and domain runtimes)
- How the UI rendered, formatted, or translated (Presentation domain)
- What the enterprise *means* in contested terms (Enterprise Knowledge domain)
- Event dispatch, outbox, retry, and scheduling (Execution domain)

## 9.3 Cross-domain dependencies (business domains only)

| Depends on | Required for |
| --- | --- |
| **Platform constitution** | Declared authority for kernel as platform substrate |
| **Identity & Access** | Actor and session facts consumed — not defined — by execution trace |
| **Enterprise Knowledge** | Accepted business meaning — kernel retains wire shapes only |
| **Authorization** | Grant scope resolution — kernel retains vocabulary and branded projection |
| **Persistence** | Master data rows — kernel retains IDs only |
| **All ERP business domains** | Consume wire catalog — do not fork vocabulary |

| Provides to (domain) | What flows | Related §7 event |
| --- | --- | --- |
| **Identity & Access** | Tenant boundary and actor kind vocabulary | Tenant boundary established |
| **Authorization** | Grant-scope words and operating scope projection | Scope context established |
| **Persistence** | Branded ID families for foreign references | Identity referenced cross-module |
| **Execution** | Event envelope and trace metadata vocabulary | Domain event envelope emitted |
| **Observability** | Correlation, causation, and trace context words | Execution started |
| **Enterprise Knowledge** | Wire shape catalog for meaning alignment | Domain term referenced |
| **All ERP business domains** | Shared scope, identity, error, and wire vocabulary | Integration attestation completed |
| **Agent orchestration** | Unambiguous NS → Blueprint → PAS chain | Vocabulary amended |

## 9.4 Four orthogonal platform domains

Platform Kernel is **Platform Language** — one of four non-overlapping constitutional domains:

```text
                    Platform North Star
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 Platform Language    Platform Meaning    Platform Structure
    (Kernel)         (Enterprise Knowledge)  (Architecture Authority)
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                  External Authority Consumption
              (Accounting Standards Authority)
```

| Domain | Question |
| --- | --- |
| **Kernel** | *What does the platform say?* (wire shape) |
| **Architecture Authority** | *What is allowed?* (structure) |
| **Enterprise Knowledge** | *How does truth become accepted?* (meaning) |
| **Accounting Standards Authority** | *Which external accounting authority applies?* (citation) |

**Rule:** No domain absorbs another's question. Shape ≠ meaning ≠ structure ≠ external citation.

---

# 10. Enterprise Risks

| Risk | Impact | Mitigation (architectural) |
| --- | --- | --- |
| **Vocabulary fork** | Incompatible modules; broken integrations | Kernel decision matrix · prohibited ownership gates · I1 |
| **Resolver in kernel** | Circular deps; untestable platform core | ERP Integration Spine owns assembly · P1a |
| **Parser duplication** | Incompatible branded types at boundaries | Wire triad owner split · P4 |
| **Scope fallback** | Cross-tenant data exposure | Fail-closed contract rules · P3 · I2 |
| **Cross-entity scope linkage** | Compliance and audit failure | Scope consistency · P7 · I3 |
| **Context bleed across tenants** | Catastrophic data isolation breach | Tenant boundary vocabulary · P10 · I6 |
| **Kernel as dumping ground** | Unmaintainable shared-utils antipattern | Decision matrix + §9.2 must-never-own |
| **Shape/meaning collapse** | Types treated as business definitions | LAW K6 · P8 · I4 |
| **Tenant extension fork** | Per-tenant parallel wire vocabulary | Tenant extension boundary · I6 |
| **Docs/runtime drift** | Agents build from stale authority | Documentation drift gates · SYNC intent |
| **Vocabulary without integration proof** | Production silently ignores kernel language | ERP Integration Spine consumer attestation · P6 |
| **Event black box** | Async failures untraceable across systems | Correlation + causation + trace vocabulary · P9 |

---

# 11. Quality Attributes

| Attribute | Expectation | Why it matters | Source |
| --- | --- | --- | --- |
| **Stability** | Constitutional contracts change rarely; breaking changes require ADR | Integration longevity | §3.3 · ADR-0026 |
| **Auditability** | Correlation and execution identity on every protected path | Regulatory and forensic replay | §6.1 · ISO 25010 maintainability (T3) |
| **Isolation** | Zero runtime dependency; no DB/HTTP/UI in kernel | Substrate purity | P2 |
| **Type safety** | Branded IDs at trust boundaries | Prevents stringly-typed integrations | Kernel vocabulary identity surfaces (T5) |
| **Serializability** | Wire shapes JSON-safe across processes | Event and API interop | Kernel vocabulary event envelope (T5) |
| **Traceability** | W3C-aligned trace vocabulary at boundaries | Distributed ERP observability | W3C Trace Context (T3) |
| **Testability** | Pure contracts testable without ERP runtime | Agent-safe slices | Platform NS §3.1 |
| **Agent readability** | North Star → Blueprint → PAS chain is unambiguous | Vibe-coding governance | Platform NS §3.1 |
| **Interoperability** | Event envelope metadata aligns with CloudEvents context model | SAP/OSS integration patterns | CloudEvents 1.0 (T3) |

---

# 12. Domain Evidence

## 12.1 Evidence Register

| ID | Claim | Source class | Tier | Reference (exact anchor) |
| --- | --- | --- | --- | --- |
| E1 | Platform requires canonical wire contracts | ✓ | T0 | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) §Decision |
| E2 | Enterprise identity architecture | ✓ | T0 | [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) · [ADR-0022](../adr/ADR-0022-postgres-split-id-persistence-model.md) · [ADR-0023](../adr/ADR-0023-tenant-human-reference-numbering.md) |
| E3 | Multi-level company / operating hierarchy | ✓ | T0 | [ADR-0011](../adr/ADR-0011-multi-level-company-model-foundational.md) §Decision |
| E4 | Accounting vocabulary consolidated to platform wire layer | ✓ | T0 | [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) §Decision |
| E5 | Kernel primitive vocabulary enterprise-gated | ✓ | T5 | [Kernel Vocabulary Authority](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) §4 · B49–B70 · B107–B109 |
| E6 | Consumer integration doctrine production-attested (historical B71–B75); ERP runtime spine partial post ADR-0027 | ✓ | T5 | [ERP Integration Spine Standard](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) §1.4 · §6.1 · B111 skeleton consumer |
| E7 | ERP wire vocabulary catalog delivered | ✓ | T5 | [ERP Wire Vocabulary Catalog](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) §0 · B76–B106 |
| E8 | Event metadata interop — CloudEvents context attributes | ✓ | T3 | [CloudEvents 1.0 spec](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) · SAP AsyncAPI ecosystem |
| E9 | Distributed trace context propagation | ✓ | T3 | [W3C Trace Context](https://www.w3.org/TR/trace-context/) |
| E10 | Multi-company scope consistency expectation | ✓ | T3 | [Odoo multi-company guidelines](https://www.odoo.com/documentation/19.0/developer/howtos/company.html) |
| E11 | SaaS tenant lifecycle and isolation | ✓ | T3 | [SAP CAP multitenancy](https://cap.cloud.sap/docs/guides/multitenancy/) |
| E12 | Multi-tenant org / application identity separation | ✓ | T3 | [Microsoft Dataverse multi-tenant S2S](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/use-multi-tenant-server-server-authentication) |
| E13 | Quality attribute framing | ✓ | T3 | ISO/IEC 25010 maintainability and modularity |

## 12.2 Decision Reasoning Log

| Decision ID | Claim | Because | Source (E#) | Therefore | Review by |
| --- | --- | --- | --- | --- | --- |
| D1 | Kernel owns words not decisions | Vocabulary/behavior split prevents circular deps | E1 · E5 | Blueprint separates Vocabulary box from Integration Spine | Enterprise |
| D2 | Kernel never resolves business state | Resolver in substrate breaks zero-deps rule | E5 · E6 | ERP Integration Spine owns assembly proof | Enterprise |
| D3 | CloudEvents-aligned envelope metadata | Industry ERP integrations standardize on CloudEvents context | E8 | Envelope carries id, source, type, time, subject vocabulary — not broker logic | Production |
| D4 | W3C trace vocabulary at boundary | Async ERP requires cross-service trace replay | E9 | Correlation + distributed trace context are kernel words; backends consume | Production |
| D5 | Scope consistency is substrate invariant | Cross-company linkage is universal ERP failure mode | E10 · E3 | Multi-scope consistency capability is Core tier | Enterprise |
| D6 | Localization owns codes not formatting | Formatting pulls UI/runtime into substrate | E5 | Locale/timezone/currency/UOM code brands only | Production |

## 12.3 Evidence lifecycle obligations

| Document maturity | Required evidence action |
| --- | --- |
| **Idea → MVP** | §1 Philosophy + §4 EFR rows have Source; △ marked; §12.1 started |
| **MVP → Production** | All §4–§5, §9 EFR battle-proven (✓) · §3 core terms · §12.2 started |
| **Production → Enterprise** | Full register · §7 events · §8 lifecycles · §16 EAC pass · T3 rows for interop claims |
| **Any amendment** | Update Source class, Reasoning, `Last reviewed`, Decision log row |

**Provenance:** Peer-enhanced from accepted kernel authority (vocabulary · integration spine · wire catalog) and upstream ADRs (T0) plus T3 industry patterns (E8–E13). Amend via Domain NS change + Blueprint + governed standard amendment — not by editing implementation authority alone.

---

# 13. Blueprint Mapping

Capability → Blueprint box names only. Detail: [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md).

| §4 Capability | Blueprint box |
| --- | --- |
| Shared enterprise identity | **Kernel Vocabulary** |
| Operating scope hierarchy | **Kernel Vocabulary** |
| Multi-scope consistency | **Kernel Vocabulary** |
| Effective dating vocabulary | **Kernel Vocabulary** |
| Execution traceability | **Kernel Vocabulary** |
| Result and error vocabulary | **Kernel Vocabulary** |
| Policy decision vocabulary | **Kernel Vocabulary** |
| Domain event envelope | **Kernel Vocabulary** |
| Localization code vocabulary | **Kernel Vocabulary** |
| Platform entity authority registry | **Kernel Vocabulary** |
| Business reference identity families | **Kernel Vocabulary** |
| Minimal async context frame | **Kernel Vocabulary** |
| Tenant lifecycle vocabulary | **Kernel Vocabulary** |
| Actor and integration identity | **Kernel Vocabulary** |
| Tenant extension boundary | **Kernel Vocabulary** |
| ERP domain wire catalog | **Kernel Domain Vocabulary Catalog** |
| Consumer integration proof | **ERP Integration Spine** |

---

# 14. Domain Governance

## 14.1 Governance model

| Model | Definition |
| --- | --- |
| **Ownership** | Platform Kernel domain spec owner (Platform Authority) |
| **Change model** | Amend when business meaning of substrate vocabulary changes — not when a slice ships |
| **Approval model** | Domain owner reviews Source + Reasoning deltas in §12 |
| **Acceptance model** | See §16 EAC |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-29 |

## 14.2 Domain authority model

| Level | Owns |
| --- | --- |
| **Domain North Star** | §1–§12 business architecture |
| **Architecture Blueprint** | Packages, layers, why separate, PAS inventory, consumers |
| **PAS** | Contracts, authority surfaces, slice catalog, gates |
| **Slice** | One implementation unit |
| **Code** | Implements the Slice |

## 14.3 Kernel governance decision matrix

| Question / change | Authority owner |
| --- | --- |
| New **primitive vocabulary term** | This North Star §3.1 → PAS-001 amendment slice |
| New **ERP wire term shape** | PAS-001B + Enterprise Knowledge alignment · §8.5 pipeline |
| **Business meaning** of a wire label | Enterprise Knowledge atom — not Kernel |
| **Scope/identity business semantics** | This North Star §1–§3 + ADR |
| **Consumer integration proof** | PAS-001A attestation slice |
| **Platform entity ownership metadata** | Kernel NS §3.1 + PAS-001 §4.6 — not Persistence schema |
| **Tenant provisioning execution** | Identity / Persistence / Platform ops — not Kernel |
| **Event broker / outbox / retry** | Execution domain — not Kernel |
| **Package allowed / layer** | Platform Architecture Authority |

## 14.4 Domain business invariants

See §5.1 I1–I8 — high-level rules agents must respect; TypeScript contracts and gate commands live in PAS only.

---

# 15. Domain Evolution

**May evolve here:** new §4 capabilities · §6 outcome targets · §7 events · vocabulary (§3) · contract stability tiers

**Must not evolve here:** runtime rules (PAS) · slice order (PAS §10) · registry rows · PAS inventory (Blueprint §10)

**Long-term direction:**

- Core vocabulary closed at Enterprise; additive ERP wire catalog on evolutionary cadence
- Advanced: effective dating and business reference families fully attested in production consumers
- Interop: envelope and trace vocabulary remain aligned with cited T3 standards unless ADR supersedes

---

# 16. Enterprise Acceptance Criteria (EAC)

| Criterion | Gate | Traces to |
| --- | --- | --- |
| §1 Philosophy immutable and cited ✓ | Manual review — domain owner | §1 Source |
| §2 Identity complete | Manual review | §2 |
| §3 Enterprise Vocabulary — core terms + stability tiers | Manual review + PAS-004 promotion plan for wire terms | §3 · §3.3 |
| §4 EFR complete — every row ✓ at Production+ | Evidence audit | §4 · §12.1 |
| §5 Principles + §5.1 invariants cited | Manual review | §5 |
| §6 Outcomes + KPIs declared | Manual review | §6 |
| §7 Business Events — core events with triggers | Manual review | §7 |
| §8 Entity Lifecycles — core entities with state tables | Manual review | §8 |
| §9 Boundaries + dependencies + Provides to + §9.4 | Manual review | §9 |
| §10 Risks — Core capabilities mitigated | Manual review | §10 |
| §11 Quality attributes declared with T3 where claimed | Manual review | §11 · E8–E13 |
| §12 Evidence Register + Decision log complete | Manual review | §12.1–§12.2 |
| §13 maps every §4 capability to Blueprint box | Manual review + Blueprint exists | §4 → §13 |
| §1–§12 contain no package names or PAS IDs | Boundary contract | Hygiene |
| Blueprint/PAS authorable without redefining domain | Manual review | Full §1–§12 |

---

# 17. Document Sync Obligations

| Change in this document | Then update |
| --- | --- |
| New §4 capability | §13 row · [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) §2 traceability · §4 box map |
| New §3 vocabulary term | Enterprise Knowledge promotion slice for ERP wire terms · §8.5 |
| New §7 event | Blueprint integration planning · PAS §4 event surface |
| Renamed capability | §13 + Blueprint box name (if business rename) |
| Boundary / dependency change (§9) | Blueprint §5 consumers · integration boxes |
| Risk or quality change (§10–§11) | Blueprint §4 Reasoning · PAS §0 |
| Business meaning stable; implementation only | Blueprint or PAS — **not** this document |
| Platform Blueprint rollup | Kernel family row references this domain NS |
| PAS-001 / PAS-001A / PAS-001B | Trace to §4 capabilities and §13 map |

**Last synced with PAS:** PAS-001 Enterprise Accepted (B49–B70 · B107–B111) · PAS-001A Production Candidate doctrine · **runtime partial** (ADR-0027 skeleton · PAS-001A-R1 open) · PAS-001B Catalog Authority **KV1–KV3 closed** · Enterprise Accepted (2026-06-29) · **Maturity:** Enterprise Accepted (peer-enhanced)

---

# 18. Required Reviews and References

## Before accepting this document

- [ ] §1–§12 complete; no package names or PAS IDs in §1–§12
- [ ] §13 traces every §4 capability to a Blueprint box name
- [ ] No PAS inventory, build order, or slice counts in this file
- [ ] [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) checklist passes
- [ ] [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) — EFR cited ✓ · §12 register · T3 for interop claims
- [ ] §3 vocabulary ready for Enterprise Knowledge derivation where wire terms apply

## Derived documents

**Produces:** [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md)

**Never produces:** PAS · slices · contracts · code

## References (link only)

| Document | Role |
| --- | --- |
| Platform North Star | [`afenda-platform-north-star.md`](../architecture/afenda-platform-north-star.md) |
| Kernel Blueprint | [`kernel-blueprint.md`](../BLUEPRINT/kernel-blueprint.md) |
| Enterprise Knowledge | [`enterprise-knowledge-north-star.md`](enterprise-knowledge-north-star.md) |
| Boundary contract | [`doc-boundary-contract.md`](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) |
| Evidence standard | [`doc-evidence-standard.md`](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |

---

# 19. Final Doctrine

**Platform Kernel covenant:** The kernel is the platform's permanent voice at boundaries. It owns the words for identity, scope, trace, failure, event metadata, and cross-domain labels — never the decisions that fill them. It fails closed when context is missing, refuses to resolve business state, and proves through consumer attestation that production actually speaks this language. Shape is not meaning; vocabulary is not workflow; substrate is not runtime. If the platform cannot name it consistently, it cannot integrate it, audit it, or trust it — therefore the kernel exists forever, ahead of every business domain.

§1–§12 define **what Platform Kernel means in enterprise business architecture**.

§13 bridges to Blueprint — **names only**.

PAS defines **how to build**.

If business meaning changes, amend §1–§12 — then Blueprint.

If packages or PAS change, amend Blueprint or PAS — **not** §1–§12 unless business meaning changed.
