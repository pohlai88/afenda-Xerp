# ERP Runtime Module Foundation North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | ERP Runtime Module Foundation — governed delivery pattern for line-of-business capability |
| **Domain type** | Platform delivery domain *(cross-cutting module foundation — not Accounting, HRM, CRM, or Procurement business truth)* |
| **Constitutional question** | *How does every line-of-business capability enter production with provable authority, ownership alignment, and integration discipline?* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Cross-domain laws** | [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) — LAW 1 (registry-first) · LAW 6 (evidence-backed status) · [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) — K6 (shape ≠ meaning) |
| **Derived document** | [Architecture Blueprint](../BLUEPRINT/erp-module-runtime-blueprint.md) — **ERP Module Runtime Foundation** box · [ERP runtime module foundation template](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) (implementation SSOT) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) · [ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) |
| **Maturity** | Production Candidate (2026-06-30) |
| **Quality target** | **9.5 / 10** enterprise acceptance boundary — structural completeness, scalability, cleanliness, and gate-ready handoff to Blueprint/PAS |
| **Current quality assessment** | **9.2 / 10** — Blueprint + PAS-001C + template migration delivered; procurement exemplar readiness report scaffolded (not operational) |
| **Prior maturity** | Draft template-only → Production Candidate after template SSOT + package path law alignment |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Condition for 9.5** | Procurement exemplar operational readiness report green (foundation documentation complete) |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-30 |
| **Package / PAS inventory** | See [erp-module-runtime Blueprint](../BLUEPRINT/erp-module-runtime-blueprint.md) — not declared here |
| **Next document** | [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) · [ERP-PROC-FDN-001](../PAS/ERP-MODULES/SLICE/erp-proc-fdn-001-runtime-authority-boundary.md) |

> **One sentence:** Every line-of-business capability must declare governed identity, explicit ownership, knowledge alignment, integration-spine consumption, permission and audit vocabulary, event discipline, metadata-bound presentation, and readiness attestation before it may serve protected enterprise work — never as anonymous folders, ad-hoc strings, or parallel platform vocabulary.

> **Delivery pattern, not business logic:** This domain governs **how Afenda authorizes and proves** a module's path to production — identity, ownership, integration, and readiness — independent of procurement rules, ledger posting, inventory movement, or UI composition.

---

## Document layers (constitutional)

```text
LAYER A — Business architecture (§1–§12)     philosophy → evidence
LAYER B — Implementation bridge (§13)        capability → Blueprint box names only
LAYER C — Governance & acceptance (§14–§19)  authority · evolution · EAC · sync
```

| Layer | Sections | Agent implement mode |
| --- | --- | --- |
| **A — Business** | §1–§12 | Read only on **business scope dispute** |
| **B — Bridge** | §13 | Blueprint authors only |
| **C — Governance** | §14–§19 | Authors and `/afenda-review` |

---

# 0. Agent Quick Path

**Read order:** [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → [Platform North Star](../architecture/afenda-platform-north-star.md) → [Platform Kernel North Star](kernel-north-star.md) §3.2 · §9 → this document §1–§12 → [ERP Integration Spine](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) doctrine → [Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) → target PAS → Slice → Code.

**This document answers:** why governed module foundation exists forever; what permanent capabilities every LoB module must prove; how module delivery decomposes toward Blueprint and PAS; what business events and lifecycles define module readiness.

**This document never answers:** filesystem paths, npm package names, gate commands, slice order, TypeScript contract shapes, or database schema columns.

**Chain rule:** Platform North Star → ERP Runtime Module Foundation North Star → Blueprint → PAS-001C → Slice → Code

**Hard stops (business scope):**

- Do not treat module foundation as a substitute for line-of-business meaning — business truth remains in Enterprise Knowledge and domain runtime.
- Do not embed platform wire vocabulary inside module runtime — kernel owns shapes; modules consume and bind.
- Do not build local tenant, company, or organization context inside a module — every protected path consumes the ERP operating-context spine.
- Do not authorize UI surfaces without metadata binding and permission declaration — presentation without authority is drift.
- Do not mark a module operational without readiness attestation across authority, knowledge, ownership, integration, persistence, and tests.
- Do not create module filesystem folders without governed module identity and Blueprint/PAS authority.
- Accounting Core ledger/posting runtime is blocked (ADR-0010 + new ADR amending `PKGR01_ACCOUNTING` prohibited rules) — procurement is the reference E2E exemplar; see [Hard platform blocks](../PAS/DEVELOPMENT-LANE-BOUNDARIES.md#hard-platform-blocks-constitution).

**Implement mode rule:** Phase 0 six lines come from the **slice 9-field handoff** and `/afenda-coding-session` — not from re-deriving scope from §1–§12 on every session.

---

## 0.1 Boundary clarification for Enterprise acceptance

This North Star defines the **business architecture** of governed ERP module delivery. It does not define runtime folders, npm names, generator commands, or gate scripts.

Implementation structure is authoritative in the [ERP runtime module foundation template](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md). Blueprint and PAS translate template sections into registry rows, paths, and gates.

| Belongs here (North Star) | Belongs in Blueprint | Belongs in PAS / template |
| --- | --- | --- |
| Business meaning of governed module foundation | Package/layer ownership and consumer map | Module definition contract, folder tree, file names |
| Capability model and permanent invariants | Why module runtime is separated from kernel and app ingress | Context projection helpers, permission binding registry |
| Evidence claims and reasoning | PAS inventory and planned PAS-001C status | Readiness dimensions, gate command list |
| Module lifecycle and readiness doctrine | ERP feature-family package law (npm name in Blueprint/PAS only) | Procurement exemplar scaffold under agreed path law |
| Cross-domain dependency business reasons | Integration sequencing with ERP Integration Spine | Database schema templates, ERP app ingress templates |

**Agreed package path law (recorded decision pointer — Blueprint/PAS/template authoritative):**

This North Star records the agreed path law for traceability only. The authoritative implementation owner is Blueprint + PAS-001C + template. If the path changes, amend Blueprint/PAS first, then update this §0.1 pointer.

**ERP feature-module runtime scaffold doctrine:** ERP module runtime foundations live in the **ERP feature-family package**, not in one root package per LoB. By default, no top-level per-LoB root packages (`packages/procurement/`, `packages/inventory/`, …) — one features-family package, one module slug per directory:

```text
packages/features/erp-modules/src/{module-slug}/
```

Reference exemplar: `procurement` (`KV-PROC`) — first module slice proving the foundation pattern end-to-end *(not yet delivered — see §12.4)*. Legacy template placeholders `packages/{module}/` are superseded by this law; PAS-001C and Blueprint must cite the features-package path exclusively.

**T5 rule:** Evidence tier T5 rows in §12 prove maturity — they must not be copied into §1–§11 as permanent doctrine.

**Kernel boundary (PAS-001):** Module foundation consumes kernel wire vocabulary and ERP Integration Spine operating context — it never adds resolver logic, permission evaluation, formatting, or business meaning to the kernel substrate.

---

# 1. Domain Philosophy

Every enterprise ERP eventually accumulates **anonymous feature folders**: code that works locally but cannot prove who owns it, what business terms it assumes, whether scope was validated, or whether audit and integration vocabulary match platform standards. Anonymous modules are how multi-year ERP programs lose auditability, duplicate vocabulary, and ship cross-tenant scope failures.

Line-of-business capability is not trustworthy because developers agreed in chat. It becomes trustworthy when **foundation is declared before behavior**: identity bound to wire catalog, ownership split across platform domains, meaning aligned with Enterprise Knowledge, integration proven through the operating-context spine, permissions and audit mapped to governed vocabulary, events catalogued before dispatch, presentation bound to metadata authority, and readiness attested with evidence.

The ERP Runtime Module Foundation domain exists because **Afenda must scale to dozens of LoB modules without each team reinventing platform integration, vocabulary, or ownership** — a permanent delivery pattern independent of any single business domain such as Procurement, Inventory, or Accounting.

| Source (✓ battle-proven) | Reasoning (Because → Therefore) |
| --- | --- |
| [T0 ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) §Decision 2 · [T1 Platform NS §3.1](../architecture/afenda-platform-north-star.md) | **Because** discovery order requires domain intent before PAS and code · **Therefore** module foundation is a platform delivery domain with its own North Star before filesystem creation |
| [T1 Kernel NS §5 P1](../NORTHSTAR/kernel-north-star.md) · [T5 PAS-001B](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | **Because** wire vocabulary is closed in kernel while ERP feature-module runtime scaffolds live in the ERP feature-family package · **Therefore** every module must declare binding to catalog identity without forking vocabulary |
| [T3 ISO/IEC 25010 modularity · maintainability](https://www.iso.org/standard/35733.html) | **Because** enterprise ERP longevity depends on replaceable modules · **Therefore** foundation enforces explicit boundaries before feature velocity |

> **Rule:** Philosophy changes only by ADR + domain owner review — not by slice delivery.

---

# 2. Domain Identity

## Mission

Permanently govern how Afenda authorizes, structures, and attests line-of-business modules from foundation through operational readiness — so every module proves the same integration, ownership, and vocabulary discipline before serving protected enterprise work.

| Source | Reasoning |
| --- | --- |
| [T1 Platform NS §4](../architecture/afenda-platform-north-star.md) | **Because** platform capability decomposition requires repeatable module entry · **Therefore** foundation mission is delivery discipline, not LoB business rules |

## Definition

| Field | Definition |
| --- | --- |
| **Scope** | Governed module identity · ownership declaration · knowledge alignment · operating-context consumption · permission and audit vocabulary binding · module policy declaration · event catalog and outbox classification · metadata-governed presentation binding · persistence boundary discipline · readiness attestation · scalable module architecture invariants |
| **Out of scope** | Line-of-business posting rules · master data resolution · ledger calculation · workflow engine execution · permission evaluation · UI rendering · HTTP transport · kernel wire vocabulary amendment · Enterprise Knowledge atom authorship |

**ERP Runtime Module Foundation is:** the permanent pattern that turns a Blueprint-declared LoB capability into a provably integrated, auditable, vocabulary-aligned runtime module.

**ERP Runtime Module Foundation is not:** Procurement, Inventory, Accounting, HRM, or CRM business domains — those domains consume this foundation and own their own North Stars when authored.

**LoB North Star separation:** This document governs **foundation delivery** — how any LoB capability enters production with authority and proof. Procurement, Inventory, Accounting, HRM, CRM, and other line-of-business domains still require **their own domain North Stars** for business meaning, entity lifecycles, and LoB-specific outcomes. Foundation North Star does not substitute for LoB domain NS authorship.

## Success (capability gain)

When fully realized, any Afenda team can scaffold a new LoB **ERP feature-module runtime scaffold** under one ERP feature-family package law, bind it to wire catalog identity, prove integration-spine consumption, and reach operational readiness through repeatable gates — without re-deriving platform integration or inventing parallel audit, permission, or event vocabulary.

| Source | Reasoning |
| --- | --- |
| [T1 Platform NS §8](../architecture/afenda-platform-north-star.md) | **Because** serialized slices with gates beat big-bang delivery · **Therefore** module foundation is the slice-ready contract surface for LoB runtime |

---

# 3. Enterprise Vocabulary

Business meanings for the **module foundation domain** — not LoB entity definitions (those promote from domain North Stars via Enterprise Knowledge).

| Term | Business meaning | Not confused with | Source (✓) | Knowledge atom |
| --- | --- | --- | --- | --- |
| **Module runtime identity** | The governed declaration that a LoB capability exists, its wire-catalog key, lifecycle phase, and owning authorities — before filesystem or behavior | Feature flag or route folder name | [T5 PAS-001B](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) · template §1 | `planned` |
| **Wire catalog key** | The stable catalog identifier binding module foundation to platform wire vocabulary | Business glossary term | [T1 Kernel NS §3.2](kernel-north-star.md) | `planned` |
| **Module ownership contract** | The one-row-per-responsibility map declaring which platform domain owns wire vocabulary, meaning, runtime, persistence, ingress, permissions, and presentation | Org chart or team roster | Template §3.3 · [T1 Kernel NS §9](kernel-north-star.md) | `planned` |
| **Knowledge map status** | Classification of whether a business term is accepted, proposed, wire-only, missing, ambiguous, or deferred before runtime behavior | Runtime enum value | [LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md) · template §3.2 | `planned` |
| **Operating context consumption** | Requirement that protected module work uses assembled tenant/entity/org scope from the ERP integration spine — never local reconstruction | Session object or header parsing | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) · template §3.4 | `planned` |
| **Permission binding** | Registration proving every module permission key exists in wire vocabulary and every protected surface declares required permission | Ad-hoc role string in handler | [T1 Kernel NS §3.1](kernel-north-star.md) grant-scope vocabulary | `planned` |
| **Module policy declaration** | Business rules for who may create, approve, submit, cancel, or block operations — declared without UI or persistence logic | Authorization evaluation outcome | Template §3.6 | `planned` |
| **Audit action map** | Governed mapping from runtime mutations to platform audit vocabulary — no ad-hoc action strings | Application log message | Template §3.7 | `accepted` · `audit_action_map` |
| **Module event catalog** | Declared business facts the module may emit — separate from audit vocabulary and separate from dispatch mechanics | Message queue topic name | Template §3.8 · [T1 Kernel NS §3.1](kernel-north-star.md) event envelope | `planned` |
| **Outbox requirement classification** | Whether an event requires durable outbox, is deferred, or is not required — decided before integration | Retry policy implementation | Template §3.9 | `planned` |
| **Metadata surface binding** | Proof that every UI route declares permission, operating-context requirement, and metadata slot authority | React component file | [T5 PAS-001A IS-003](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) · template §3.10 | `accepted` · `metadata_surface_binding` |
| **Module readiness dimension** | One attestable facet of foundation (authority, knowledge, ownership, database, context spine, permissions, audit, outbox, metadata, UI, tests, gates) | Feature completeness checklist item | Template §3.11 · §7 | `accepted` · `module_readiness_dimension` |
| **Document family** | The class of business documents a module supports (e.g. requisition, purchase order) at vocabulary level | Single database table | [T5 PAS-001B procurement wire](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | `wire_only` |
| **Foundation lifecycle phase** | Module authorized for scaffold and contracts only — behavior blocked until readiness attestation | Production operational status | Template §1 · registry lifecycle vocabulary | `accepted` · `foundation_lifecycle_phase` |
| **Module ingress** | The protected application entry layer that wires spine, authorization, server actions, and route policy — not business use cases | Public marketing site | Template §5 · [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | `accepted` · `module_ingress` |
| **Readiness report** | The evidence table proving pass/fail per readiness dimension with gate linkage | CI log excerpt | Template §7 | `accepted` · `readiness_report` |

**Separation rule:** Terms in this section describe **module delivery**. Procurement, Inventory, and Accounting entity terms belong in their domain North Stars §3 — referenced here only through knowledge map status, never redefined.

### 3.1 PAS-004 promotion backlog

P0 module foundation terms promoted via EK-MOD-FDN-001/002/003 (2026-06-30). Remaining §3 terms still require PAS-004 slices:

| Term | Promotion priority | Blocker for | Atom ID |
| --- | --- | --- | --- |
| Module runtime identity | P0 ✓ | — | `module_runtime_identity` |
| Wire catalog key | P0 ✓ | — | `wire_catalog_key` |
| Module ownership contract | P0 ✓ | — | `module_ownership_contract` |
| Knowledge map status | P0 ✓ | — | `knowledge_map_status` |
| Operating context consumption | P0 ✓ | — | `operating_context_consumption` |
| Permission binding | P0 ✓ | — | `permission_binding` |
| Module policy declaration | P1 | Operational promotion | planned |
| Audit action map | P0 ✓ | — | `audit_action_map` |
| Module event catalog | P1 | Event dispatch integration | planned |
| Outbox requirement classification | P1 | Outbox contract | planned |
| Metadata surface binding | P0 ✓ | — | `metadata_surface_binding` |
| Module readiness dimension | P0 ✓ | — | `module_readiness_dimension` |
| Foundation lifecycle phase | P0 ✓ | — | `foundation_lifecycle_phase` |
| Module ingress | P0 ✓ | — | `module_ingress` |
| Readiness report | P0 ✓ | — | `readiness_report` |

`wire_only` terms (e.g. Document family) follow PAS-004 wire-to-meaning promotion per LAW K6.

---

# 4. Domain Capability Model

Permanent capabilities (**EFR**). Each row maps to Blueprint §13 — not to packages or PAS here.

| Capability | Tier | Maturity target | Source (✓) | Reasoning (Because → Therefore) | Review by |
| --- | --- | --- | --- | --- | --- |
| **Governed module identity** | Core | Enterprise | [T0 ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [T5 PAS-001B](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | **Because** anonymous folders bypass registry and wire-catalog binding · **Therefore** every module declares identity before filesystem creation | Enterprise |
| **Explicit ownership separation** | Core | Enterprise | [T1 Kernel NS §5 P1](kernel-north-star.md) · template §3.3 | **Because** duplicated ownership causes vocabulary forks and audit gaps · **Therefore** one platform owner per responsibility class | Enterprise |
| **Knowledge alignment discipline** | Core | Enterprise | [LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md) · template §3.2 | **Because** wire types are not business definitions · **Therefore** every major term has knowledge map status before runtime behavior | Enterprise |
| **Operating context spine consumption** | Core | Enterprise | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) · template §3.4 | **Because** local scope construction causes cross-tenant failure · **Therefore** modules project runtime context only from assembled operating context | Enterprise |
| **Permission vocabulary binding** | Core | Enterprise | [T1 Kernel NS §4](kernel-north-star.md) policy decision vocabulary · template §3.5 | **Because** ad-hoc permission strings break authorization consistency · **Therefore** kernel keys, registry namespace, and surface declarations stay aligned | Enterprise |
| **Module policy declaration** | Advanced | Production | Template §3.6 | **Because** approval and posting rules differ by LoB · **Therefore** policy is declared in module runtime without UI or evaluation logic | Production |
| **Audit traceability mapping** | Core | Enterprise | Template §3.7 · [T3 ISO 25010 auditability](https://www.iso.org/standard/35733.html) | **Because** unaudited mutations fail compliance replay · **Therefore** every mutation maps to governed audit vocabulary with actor and context | Enterprise |
| **Event catalog and outbox classification** | Advanced | Production | Template §3.8–§3.9 · [T1 Kernel NS §3.1](kernel-north-star.md) domain event envelope | **Because** integration without declared events causes naming drift · **Therefore** events are catalogued and outbox requirement classified before dispatch | Production |
| **Metadata-governed presentation binding** | Core | Enterprise | [T0 ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) · template §3.10 | **Because** UI without metadata authority ships permission and context drift · **Therefore** every surface binds KV identity, route, permission, and context requirement | Enterprise |
| **Persistence boundary discipline** | Core | Enterprise | [T0 ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) · template §4 | **Because** schema without tenant scope and RLS expectation fails isolation · **Therefore** persistence templates declare scope, lifecycle, audit fields, and ownership registry rows | Enterprise |
| **Readiness attestation** | Core | Enterprise | Template §3.11 · §7 · [LAW 6](../CONSTITUTION/platform-constitutional-laws.md) | **Because** feature-complete ≠ integration-proven · **Therefore** modules produce readiness reports with gate evidence per dimension | Enterprise |
| **Scalable module architecture** | Advanced | Production | [T3 ISO/IEC 25010 modularity](https://www.iso.org/standard/35733.html) · template §2 | **Because** unconstrained folder growth and per-LoB root packages block agent-safe delivery · **Therefore** one ERP feature-family package path law, no default top-level LoB root packages, and repeatable layer folders (application, domain, infrastructure, testing) | Production |
| **Protected ingress flow invariant** | Core | Enterprise | Template §5 · [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | **Because** skipping spine steps reintroduces scope and audit holes · **Therefore** request flow is: context → projection → permission → use case → audit/outbox → response | Enterprise |
| **Cross-domain dependency declaration** | Advanced | Production | Template §3.1 runtime contract · [T0 ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) | **Because** hidden Inventory or Accounting coupling blocks ADR-gated work · **Therefore** runtime contract declares supported operations, non-goals, and cross-domain dependencies explicitly | Production |

**Capability maturity key:** Idea · MVP · Production · Enterprise

---

# 5. Domain Principles

| # | Principle | Source (✓) | Reasoning (Because → Therefore) |
| --- | --- | --- | --- |
| P1 | **Identity before filesystem** | [T0 ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) | **Because** folders created without authority become permanent debt · **Therefore** module definition precedes directory scaffold |
| P2 | **Kernel owns words; module owns behavior** | [T1 Kernel NS §5 P1](kernel-north-star.md) | **Because** vocabulary in runtime forks platform language · **Therefore** modules consume wire catalog; they do not redefine it |
| P3 | **Meaning before behavior** | [LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md) | **Because** guessing business definitions encodes wrong policy · **Therefore** knowledge map blocks runtime until terms are accepted or explicitly deferred |
| P4 | **Spine before service** | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | **Because** local context assembly breaks multi-entity ERP · **Therefore** operating context is consumed, never reconstructed |
| P5 | **No ad-hoc platform strings** | Template §8 · [T1 Kernel NS §5.1 I1](kernel-north-star.md) | **Because** permission, audit, event, and status strings drift fastest · **Therefore** all platform-facing words come from governed catalogs |
| P6 | **Presentation follows authority** | [T0 ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) | **Because** UI-led development bypasses permission and metadata · **Therefore** metadata binding precedes surface shipment |
| P7 | **Readiness is evidence, not opinion** | [LAW 6](../CONSTITUTION/platform-constitutional-laws.md) | **Because** verbal "done" without gates caused historical integration debt · **Therefore** readiness dimensions require gate or test evidence |
| P8 | **One module slug, one foundation tree** | Template §2 · agreed path law §0.1 | **Because** scattered per-LoB root packages multiply boundary violations · **Therefore** LoB ERP feature-module runtime scaffolds consolidate under one ERP feature-family package path law |
| P9 | **Persistence declares isolation intent** | [T0 ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) | **Because** schema without tenant and RLS expectation fails enterprise isolation · **Therefore** database templates are part of foundation, not an afterthought |
| P10 | **Events ≠ audit ≠ dispatch** | Template §3.7–§3.9 | **Because** conflating vocabulary causes integration and compliance confusion · **Therefore** audit map, event catalog, and outbox contract remain separate surfaces |

## 5.1 Domain invariants

| # | Invariant |
| --- | --- |
| I1 | No LoB module enters protected ERP routes without governed module identity bound to wire catalog key. |
| I2 | No module builds tenant, company, or organization context outside the ERP operating-context spine. |
| I3 | No mutation ships without mapped audit action from governed vocabulary. |
| I4 | No permission key is used at a protected surface unless registered and declared. |
| I5 | No UI surface ships without metadata binding declaring permission and operating-context requirement. |
| I6 | Wire-only or missing knowledge terms block runtime behavior until knowledge map records required action. |
| I7 | Module runtime never adds resolver, formatting, permission evaluation, or business meaning logic to kernel. |
| I8 | Readiness attestation must pass all required dimensions before lifecycle promotes beyond foundation. |
| I9 | Cross-domain operations blocked by ADR or PAS hard stop remain blocked in module policy declaration — not silently implemented. |
| I10 | Module foundation template SSOT governs implementation shape; this North Star governs business meaning of that shape. |
| I11 | No default top-level per-LoB root packages for ERP feature-module runtime scaffolds — one ERP feature-family package, one module slug per directory unless ADR explicitly authorizes an exception. |

---

# 6. Enterprise Outcomes and KPIs

## 6.1 Outcome statements

| Outcome | Target | Measures | Source |
| --- | --- | --- | --- |
| **Module vocabulary singularity** | Zero parallel permission, audit, or event strings per module | Module foundation gates · prohibited string scan | [T1 Kernel NS §6](kernel-north-star.md) |
| **Integration spine compliance** | 100% protected module paths consume operating context | Context spine consumer attestation per module | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| **Knowledge alignment before runtime** | 100% major terms classified in knowledge map before operational promotion | Readiness report knowledge dimension | [LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md) |
| **Metadata-bound presentation** | Zero unbound protected module routes | Metadata binding gate per module | [T5 PAS-001A IS-003](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| **Agent-safe module delivery** | Any agent implements module slice without re-deriving foundation | Template + PAS-001C slice handoff | [T1 Platform NS §3.1](../architecture/afenda-platform-north-star.md) |
| **Scalable module census** | New LoB ERP feature-module runtime scaffold repeatable under one ERP feature-family package path law | Time-to-foundation-scaffold · gate green on exemplar | Template §2 · §0.1 |

## 6.2 Success metrics (permanent KPI targets)

| KPI | Target | Measurement context | Source (✓) |
| --- | --- | --- | --- |
| **Anonymous module folders** | 0 in production | Per release foundation scan | [T0 ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Context spine bypass incidents** | 0 | Module integration tests | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| **Unmapped audit mutations** | 0 | Audit map conformance gate | Template §3.7 |
| **Readiness dimensions without evidence** | 0 at operational promotion | Readiness report audit | Template §7 |
| **Knowledge map `missing` terms driving runtime** | 0 | Knowledge alignment gate | Template §3.2 |

---

# 7. Business Events

Events the **module foundation domain** names — not LoB business facts (e.g. purchase order sent) which belong in domain North Stars.

| Event | Business meaning | Typical trigger | Related vocabulary (§3) | Source (✓) |
| --- | --- | --- | --- | --- |
| **Module identity declared** | Governed LoB capability registered with wire catalog binding | Blueprint box + PAS authorization | Module runtime identity · Wire catalog key | [T0 ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Module foundation authorized** | Module may scaffold contracts and folders; operational behavior still blocked | PAS slice closes foundation gate | Foundation lifecycle phase | Template §1 |
| **Knowledge gap identified** | Major term lacks accepted meaning; runtime behavior must not proceed | Knowledge map review | Knowledge map status | [LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md) |
| **Operating context consumption attested** | Module proves spine consumption on protected paths | Integration test milestone | Operating context consumption | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| **Permission binding verified** | All module permission keys registered and declared on surfaces | Permission binding gate green | Permission binding | Template §3.5 |
| **Audit mapping complete** | All declared mutations map to audit vocabulary | Audit map gate green | Audit action map | Template §3.7 |
| **Metadata surface registered** | UI route bound to permission, context, and metadata slot | Metadata binding gate green | Metadata surface binding | Template §3.10 |
| **Module readiness attested** | All required readiness dimensions pass with evidence | Readiness report published | Module readiness dimension · Readiness report | Template §7 |
| **Module operational authorized** | Lifecycle promotes; LoB business events may emit under domain NS | Readiness + domain PAS acceptance | Foundation lifecycle phase | §8.1 |
| **Context spine violation detected** | Protected path attempted without operating context — fail-closed | Integration test or production attestation failure | Operating context consumption | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| **Foundation template amended** | Implementation SSOT updated; North Star reviewed if business meaning changed | Template or path law change | Module foundation invariants | §0.1 |

Dispatch, retry, outbox execution, and workflow orchestration belong outside this domain.

---

# 8. Entity Lifecycles

Business-state lifecycles for concepts this domain owns at vocabulary level.

### 8.1 ERP runtime module (foundation lifecycle)

```text
Proposed → Identity declared → Foundation authorized → Integration attested → Readiness attested → Operational → Deprecated
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Proposed | LoB capability identified in Blueprint; no filesystem | Blueprint box declared | Identity declared |
| Identity declared | Module runtime identity bound to wire catalog key | Module definition accepted | Foundation authorized |
| Foundation authorized | Contracts and scaffold permitted; behavior gated | Foundation PAS slice | Integration attested |
| Integration attested | Context spine, permission binding, metadata consumer proven | Integration gates green | Readiness attested |
| Readiness attested | All required readiness dimensions pass | Readiness report | Operational |
| Operational | LoB business workflows permitted under domain NS + PAS | Domain PAS acceptance | Deprecated |
| Deprecated | No new work; historical use grandfathered | ADR or NS amendment | — |

### 8.2 Knowledge map term (module-scoped)

```text
missing | wire_only | proposed → accepted
         └→ ambiguous → resolved
         └→ deferred (explicit non-blocker with recorded rationale)
```

| Status | Business meaning | Runtime behavior |
| --- | --- | --- |
| **missing** | No atom and no wire label | Blocked |
| **wire_only** | Shape exists; meaning not accepted | Blocked for semantic operations |
| **proposed** | Under Enterprise Knowledge review | Blocked until accepted |
| **accepted** | Meaning authoritative | Permitted |
| **ambiguous** | Conflicting definitions | Blocked until resolved |
| **deferred** | Explicitly postponed with ADR/PAS record | Permitted only for declared non-semantic scope |

### 8.3 Protected request flow (business view)

```text
Request received → Operating context assembled → Module context projected → Permission checked → Use case executed → Audit recorded → Outbox classified (if required) → Response delivered
```

| Stage | Business meaning | Fail-closed when |
| --- | --- | --- |
| Operating context assembled | Tenant/entity/org scope known or explicitly null | Missing tenant on protected path |
| Module context projected | LoB runtime context derived from spine only | Local session/header parsing detected |
| Permission checked | Declared permission evaluated | Undeclared or unregistered key |
| Audit recorded | Mutation mapped to audit vocabulary | Unmapped mutation |
| Outbox classified | Event requirement known before dispatch | Undeclared event name |

### 8.4 Foundation template promotion pipeline

```text
North Star §4 capability alignment (this document)
        │
        ▼
Blueprint ERP Module Runtime Foundation box (Delivered)
        │
        ▼
PAS-001C authority + slice catalog (Delivered)
        │
        ▼
Canonical template (docs/PAS/ERP-MODULES/) — migrated from KERNEL/template tombstone
        │
        ▼
Procurement exemplar: **ERP-PROC-FDN-001 Delivered** · next slice TBD (§12.4)
        │
        ▼
Additional LoB ERP feature-module runtime scaffolds repeat under path law
```

**Rule:** Reverse flow is forbidden — filesystem before identity requires ADR remediation.

---

# 9. Domain Boundary

## 9.1 This domain owns (business)

- Governed module identity and foundation lifecycle vocabulary (§3, §8.1)
- Ownership separation doctrine — which platform concern owns wire, meaning, runtime, persistence, ingress, permissions, presentation (§3 module ownership contract)
- Knowledge alignment requirements before runtime behavior (§3 knowledge map status)
- Operating-context consumption invariant and protected request flow (§3, §8.3)
- Permission, audit, and event vocabulary binding requirements (§3, §5 P5)
- Metadata-governed presentation binding requirements (§3, §5 P6)
- Readiness attestation dimensions and evidence doctrine (§3, §6)
- Persistence boundary expectations at foundation level — tenant scope, lifecycle, audit fields, isolation intent (§4 persistence capability)
- Scalable module architecture invariants — one ERP feature-family package path law, no default top-level LoB root packages, layered folders (§4 scalable architecture)
- Module foundation business events (§7)

## 9.2 This domain never owns (business)

> **Hard stop:** Module foundation governs **delivery and proof** — not line-of-business truth or platform substrate vocabulary.

- Business meaning of Procurement, Inventory, Accounting, HRM, CRM entities (Enterprise Knowledge + domain North Stars)
- Wire vocabulary shapes and catalog keys (Platform Kernel / ERP wire catalog)
- Operating-context assembly and resolver spine execution (ERP Integration Spine)
- Permission evaluation outcomes (Authorization domain)
- Database queries, migrations execution, RLS policy implementation (Persistence domain)
- HTTP handlers, OpenAPI operation registry (Platform API Contract domain)
- UI rendering and design tokens (Presentation domain)
- Event dispatch, retry, outbox worker execution (Execution domain)
- LoB posting, approval workflow execution, stock movement, payroll calculation ( respective LoB domains)

## 9.3 Cross-domain dependencies (business domains only)

| Depends on (domain) | Required for | Source (✓) |
| --- | --- | --- |
| **Platform Kernel** | Wire catalog keys, permission words, audit words, event envelope vocabulary | [T1 Kernel NS §9](kernel-north-star.md) |
| **ERP Integration Spine** | Operating context assembly proof consumed by modules | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| **Enterprise Knowledge** | Accepted meaning before semantic runtime behavior | [LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md) |
| **Authorization** | Permission evaluation — modules declare keys only | [T1 Kernel NS §9.2](kernel-north-star.md) |
| **Persistence** | Schema ownership — modules declare boundary templates | [T0 ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) |
| **Presentation / Metadata** | Surface binding under PAS-006 presentation chain | [T0 ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) |
| **Platform Architecture Authority** | Package registry, layer law, features-package disposition | [T1 Architecture Authority NS](architecture-authority-north-star.md) |
| **Platform API Contract** | Governed HTTP exposure when modules add API operations | [T0 ADR-0030](../adr/ADR-0030-erp-rest-api-contract-standard.md) |

| Provides to (domain) | What flows | Related §7 event |
| --- | --- | --- |
| **All LoB business domains** | Repeatable foundation pattern, readiness doctrine, integration proof checklist | Module foundation authorized |
| **ERP Integration Spine** | Consumer attestation requirements per module | Operating context consumption attested |
| **Enterprise Knowledge** | Knowledge map gaps requiring atom promotion | Knowledge gap identified |
| **Presentation** | Metadata surface registration requirements | Metadata surface registered |
| **Agent orchestration** | Unambiguous NS → Blueprint → PAS-001C → slice chain | Module identity declared |

## 9.4 Orthogonal separation (module foundation vs LoB)

```text
                    Platform North Star
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 Platform Language    Module Foundation      LoB Business Domains
    (Kernel)         (this document)      (Procurement, Accounting, …)
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                  ERP Integration Spine
                            │
                            ▼
              Protected module runtime + ingress
```

| Layer | Question |
| --- | --- |
| **Kernel** | *What wire words exist?* |
| **Module foundation** | *How is a LoB module authorized and proven?* |
| **LoB domain** | *What business rules apply?* |
| **Integration spine** | *How is scope assembled for protected work?* |

---

# 10. Enterprise Risks

| Risk | Business impact | Mitigation (architectural) | Source (✓) | Handoff |
| --- | --- | --- | --- | --- |
| **Anonymous module creation** | Untraceable ownership; audit gaps | P1 identity before filesystem · I1 | [T0 ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) | PAS-001C §0 |
| **Vocabulary fork in runtime** | Broken integrations; incompatible audit | P2 · P5 · I7 | [T1 Kernel NS §10](kernel-north-star.md) | Module gates |
| **Local context construction** | Cross-tenant / cross-entity exposure | P4 · I2 · §8.3 fail-closed | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | Context spine gate |
| **Semantic runtime without knowledge** | Wrong business policy encoded in code | P3 · I6 | [LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md) | Knowledge alignment gate |
| **UI without metadata authority** | Permission and route drift | P6 · I5 | [T0 ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) | Metadata binding gate |
| **Unaudited mutations** | Compliance replay failure | P5 · I3 | Template §3.7 | Audit map gate |
| **Premature operational promotion** | Production incidents on incomplete integration | P7 · I8 | Template §7 | Readiness gate |
| **Hidden cross-domain coupling** | ADR-gated domains violated silently | I9 · cross-domain dependency capability | [T0 ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) | Runtime contract |
| **Scaffold sprawl** | Unmaintainable monorepo; agent confusion | P8 · scalable architecture | Template §2 · §0.1 | Blueprint path law |
| **Template / NS drift** | Agents build from stale shape | I10 · §8.4 pipeline | Template SSOT | Documentation drift gate |

---

# 11. Quality Attributes

| Attribute | Domain expectation | Why it matters | Target (business language) | Source (✓) |
| --- | --- | --- | --- | --- |
| **Modularity** | One module slug per ERP feature-module runtime scaffold under ERP feature-family package path law | Replace LoB without rewiring platform | Add module without new top-level LoB root package per runtime scaffold | [T3 ISO 25010 modularity](https://www.iso.org/standard/35733.html) |
| **Maintainability** | Repeatable folder layers and contract file set | Agent-safe slices | 100% new modules match template contract set | Template §2–§3 |
| **Auditability** | Audit map completeness before operational | Regulatory replay | Zero unmapped mutations | §6.2 KPI |
| **Traceability** | Protected flow preserves context and audit | End-to-end forensic chain | 100% protected paths follow §8.3 flow | [T5 PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| **Security** | Permission declaration on every protected surface | Unauthorized action prevention | Zero undeclared permission usage | Template §3.5 |
| **Scalability** | Foundation pattern scales to 28+ wire catalog modules | ERP breadth without rework | Exemplar + repeat model | [T5 PAS-001B 28/28](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) |
| **Cleanliness** | No kernel runtime leak; no ad-hoc strings | Boundary gate sustainability | Prohibited-surface scan clean per module | [T1 Kernel NS §9.2](kernel-north-star.md) |
| **Evidence-backed status** | Readiness is gate-proven | Stops verbal done | Readiness report required | [LAW 6](../CONSTITUTION/platform-constitutional-laws.md) |

---

# 12. Domain Evidence

## 12.1 Evidence Register

| ID | Claim | Source class | Tier | Reference |
| --- | --- | --- | --- | --- |
| E1 | Documentation hierarchy requires domain NS before PAS | ✓ | T0 | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) §Decision 2 |
| E2 | Kernel owns words; owners own behavior | ✓ | T1 | [Kernel NS §5 P1](kernel-north-star.md) |
| E3 | Shape ≠ meaning at module boundary | ✓ | T0 | [Knowledge LAW K6](../CONSTITUTION/knowledge-constitutional-laws.md) |
| E4 | ERP wire catalog closed — modules bind to KV IDs | ✓ | T5 | [PAS-001B](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) · procurement `KV-PROC` |
| E5 | Operating context spine is production integration proof | ✓ | T5 | [PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) · IS-001–IS-003 |
| E6 | Presentation reset requires metadata consumer attestation | ✓ | T0 | [ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) |
| E7 | Enterprise identity and tenant scope on persistence | ✓ | T0 | [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) · [ADR-0022](../adr/ADR-0022-postgres-split-id-persistence-model.md) |
| E8 | Module foundation template SSOT authored | ✓ | T5 | [erp-runtime-module-foundation.template.md](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) |
| E9 | Features package path law agreed for LoB scaffolds | ✓ | T1 | [Blueprint §4.5](../BLUEPRINT/erp-module-runtime-blueprint.md) · PAS-001C §7 · §0.1 |
| E10 | ISO modularity and maintainability framing | ✓ | T3 | ISO/IEC 25010 |
| E11 | Serialized slice delivery with gates | ✓ | T1 | [Platform NS §8–§9](../architecture/afenda-platform-north-star.md) |
| E12 | Master data / wire consolidation — modules consume not redefine | ✓ | T0 | [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) |
| E13 | Accounting runtime block — cross-domain dependency must declare | ✓ | T0 | [ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) |

## 12.2 Decision Reasoning Log

| Decision ID | Claim | Because | Source (E#) | Therefore | Review by |
| --- | --- | --- | --- | --- | --- |
| D1 | Module foundation is a platform delivery domain, not LoB business truth | Delivery pattern repeats across 28 wire modules | E1 · E4 · E8 | Blueprint declares **ERP Module Runtime Foundation** box; LoB NS remain separate | Enterprise |
| D2 | ERP feature-family package path law supersedes per-LoB root packages for runtime scaffold | Monorepo scalability and boundary enforcement | E9 · E10 | One ERP feature-family package with `{slug}/` trees — Blueprint/PAS authoritative; E9 upgrades after adoption | Production |
| D3 | Template is implementation SSOT; North Star is business SSOT | Doc boundary contract prevents gate/path leakage into §1–§12 | E8 · doc-boundary-contract | Amend template for shape; amend NS only when business meaning changes | Enterprise |
| D4 | Procurement is first exemplar module slice | Wire catalog KV-PROC delivered; ERP-PROC-FDN-001 Delivered 2026-06-30 | E4 · E8 | First slice under path law validates gates before horizontal rollout — operational runtime **not delivered** (§12.4) | Production |
| D5 | Readiness dimensions are constitutional for operational promotion | Historical integration debt from verbal done | E5 · E11 · LAW 6 | No operational state without readiness report | Enterprise |
| D6 | Knowledge map blocks semantic runtime | Wire-only terms caused wrong policy in peer ERP programs | E3 · E12 | `wire_only` and `missing` block behavior per §8.2 | Enterprise |

## 12.3 Evidence lifecycle obligations

| Document maturity | Required evidence action |
| --- | --- |
| **Idea → MVP** | §1 Philosophy + §4 EFR rows have Source; △ marked; §12.1 started |
| **MVP → Production** | All §4–§5, §9 EFR battle-proven (✓) · §3 core terms · §12.2 complete |
| **Production → Enterprise** | Full register · §7 events · §8 lifecycles · §16 EAC pass · exemplar module readiness report |
| **Any amendment** | Update Source class, Reasoning, `Last reviewed`, Decision log row |

**Provenance:** Composed from ERP runtime module foundation template (E8), kernel-authority boundary doctrine (E2), PAS-001A/001B integration and catalog evidence (E4–E5), and platform documentation hierarchy (E1). Amend via Domain NS change + Blueprint + PAS-001C — not by editing template alone when business meaning changes.

## 12.4 Exemplar and maturity status

| Item | Status | Evidence required for upgrade |
| --- | --- | --- |
| **Procurement exemplar (KV-PROC)** | Foundation scaffold only | [Readiness report](../PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md) · [Gap report](../PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md) · ERP-PROC-FDN-001 Delivered |
| **E9 path law evidence tier** | T1 | Blueprint + PAS-001C accepted |
| **Enterprise 9.5 acceptance** | Not achieved | Procurement operational readiness report green |

---

# 13. Capability → Blueprint Traceability

Map §4 capabilities to Blueprint box **names only** — no PAS IDs, packages, or status.

| §4 Capability | Maturity tier | Blueprint box |
| --- | --- | --- |
| Governed module identity | Core | **ERP Module Runtime Foundation** |
| Explicit ownership separation | Core | **ERP Module Runtime Foundation** |
| Knowledge alignment discipline | Core | **ERP Module Runtime Foundation** · **Enterprise Knowledge** (meaning) |
| Operating context spine consumption | Core | **ERP Integration Spine** (provider) · **ERP Module Runtime Foundation** (consumer proof) |
| Permission vocabulary binding | Core | **ERP Module Runtime Foundation** · **Authorization** |
| Module policy declaration | Advanced | **ERP Module Runtime Foundation** |
| Audit traceability mapping | Core | **ERP Module Runtime Foundation** |
| Event catalog and outbox classification | Advanced | **ERP Module Runtime Foundation** · **Execution** (dispatch owner) |
| Metadata-governed presentation binding | Core | **ERP Module Runtime Foundation** · **Presentation (PAS-006)** |
| Persistence boundary discipline | Core | **ERP Module Runtime Foundation** · **Persistence** |
| Readiness attestation | Core | **ERP Module Runtime Foundation** |
| Scalable module architecture | Advanced | **ERP Module Runtime Foundation** · **Architecture Authority** |
| Protected ingress flow invariant | Core | **ERP Integration Spine** · **ERP Application Ingress** |
| Cross-domain dependency declaration | Advanced | **ERP Module Runtime Foundation** · target LoB Blueprint box |

**When a capability needs a new box:** amend §4 → add §13 row → add Blueprint §4 row → satisfy Blueprint §7 → author PAS-001C.

---

# 14. Domain Governance

## 14.1 Governance model

| Model | Definition |
| --- | --- |
| **Ownership** | Platform delivery architecture owner (Platform Authority) |
| **Change model** | Amend when module foundation **business meaning** changes — not when one LoB slice ships |
| **Approval model** | Domain owner reviews Source + Reasoning deltas in §12 |
| **Acceptance model** | See §16 EAC |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Implementation SSOT** | [erp-runtime-module-foundation.template.md](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) |
| **Last reviewed** | 2026-06-30 |

## 14.2 Domain authority model

| Level | Owns |
| --- | --- |
| **Domain North Star** | §1–§12 business architecture (this document) |
| **Architecture Blueprint** | Packages, layers, path law, why separate, PAS inventory |
| **PAS-001C** | Module foundation contracts, surfaces, slice catalog, gates |
| **Slice** | One module or horizontal foundation unit |
| **Code** | Implements the Slice under path law |

## 14.3 Module foundation decision matrix

| Question / change | Authority owner |
| --- | --- |
| New **readiness dimension** | This North Star §4 → PAS-001C amendment |
| New **contract file** in template | Template + PAS-001C — NS amended only if business capability added |
| **Package path law** change | Blueprint + ADR — cite in §0.1 |
| **LoB business meaning** | LoB Domain North Star + Enterprise Knowledge — not this document |
| **Wire vocabulary** | Kernel / PAS-001B — not module runtime |
| **Operating context assembly** | PAS-001A ERP Integration Spine |
| **First exemplar module** | Procurement slice under `KV-PROC` — proves D4 |
| **Operational promotion** | Readiness report + domain PAS — not foundation alone |

## 14.4 Domain business invariants

See §5.1 I1–I10 — high-level rules agents must respect; TypeScript contracts and gate commands live in PAS-001C and template only.

---

# 15. Domain Evolution

**May evolve here:** new §4 capabilities · §6 outcome targets · §7 events · vocabulary (§3) · readiness dimensions

**Must not evolve here:** runtime contract field names (PAS) · slice order (PAS §10) · registry rows · gate command strings · template file tree (template/PAS — unless §4 capability added)

**Long-term direction:**

- Core foundation closed at Enterprise after PAS-001C + procurement exemplar readiness green
- Horizontal rollout: Inventory, HRM, CRM modules repeat under path law without amending §1 Philosophy
- Advanced: outbox and cross-domain event catalog attestation linked to Platform API Contract event binding (reserved)
- AI-assisted module scaffold from template + knowledge map — human attestation on readiness remains mandatory

---

# 16. Enterprise Acceptance Criteria (EAC)

| Criterion | Gate | Traces to |
| --- | --- | --- |
| §1 Philosophy immutable and cited ✓ | Manual review — domain owner | §1 Source |
| §2 Identity complete (mission, definition, success) | Manual review | §2 |
| §3 Enterprise Vocabulary — foundation terms defined | Manual review + PAS-004 promotion plan for module terms | §3 |
| §4 EFR complete — every row ✓ at Production+ | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) audit | §4 |
| §5 Principles + §5.1 invariants cited | Manual review | §5 |
| §6 Outcomes + KPIs declared | Manual review | §6 |
| §7 Business Events — foundation events listed | Manual review | §7 |
| §8 Entity Lifecycles — module + knowledge + request flow | Manual review | §8 |
| §9 Boundaries + cross-domain dependencies + §9.4 separation | Manual review | §9 |
| §10 Risks — Core capabilities mitigated | Manual review | §10 |
| §11 Quality attributes declared with T3 where claimed | Manual review | §11 |
| §12 Evidence Register + Decision log complete | Manual review | §12.1–§12.2 |
| §13 maps every §4 capability to Blueprint box | Manual review + Blueprint box exists or planned | §4 → §13 |
| §0.1 path law documented without polluting §1–§12 | [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) | §0.1 |
| §1–§12 contain no PAS inventory, implementation file trees, package exports, gate command lists, or slice build order — PAS/ADR/NS references allowed only as evidence citations | [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) | Hygiene |
| Template SSOT cross-linked as implementation authority | Manual review | §0.1 · §14.1 |
| **Zero ✗ assumptions** in EFR rows at Production+ | Evidence class audit | §12 |
| Blueprint/PAS-001C authorable without redefining domain | Manual review | Full §1–§12 |
| **9.5 / 10 quality bar (target):** structure, scalability, cleanliness, feature completeness — achieved only after Blueprint + PAS-001C + procurement exemplar | Peer review checklist | §12.4 · Condition for 9.5 |

---

# 17. Document Sync Obligations

| Change in this document | Then update |
| --- | --- |
| New §4 capability | §13 row · Blueprint **ERP Module Runtime Foundation** box · template § if implementation shape needed |
| New §3 vocabulary term | Enterprise Knowledge promotion slice · knowledge map contract |
| New §7 event | PAS-001C event surface · template event-catalog section |
| Path law change (§0.1) | Blueprint · PAS-001C · template §2 folder structure |
| Readiness dimension added | Template §3.11 · §7 report table · PAS-001C gates |
| Boundary / dependency change (§9) | Blueprint §5 consumers · PAS-001A consumer notes |
| Template moved from KERNEL/template/ to ERP-MODULES/ | §0.1 · §14.1 · §18 references — not §1–§12 unless meaning changed |
| Procurement exemplar delivered | §12.4 status upgrade · E9 evidence tier upgrade · readiness report linked · D4 closed |
| Business meaning stable; implementation only | Template · Blueprint · PAS-001C — **not** §1–§12 |

**Last synced with:** ERP runtime module foundation template (2026-06-30) · PAS-001A integration-proven · PAS-001B catalog authority · ADR-0026/0027 · agreed features-package path law

---

# 18. Required Reviews and References

## Before accepting this document

- [ ] §1–§12 complete; no PAS inventory, file trees, package exports, gate lists, or slice build order in §1–§12 — evidence citations to PAS/ADR/NS permitted
- [ ] §13 traces every §4 capability to a Blueprint box name
- [ ] §0.1 documents path law and template SSOT without duplicating template body
- [ ] No PAS inventory, build order, or slice counts in §1–§12
- [ ] [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) checklist passes
- [ ] [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) — EFR cited ✓ · §12 register · zero ✗ at Production+
- [ ] §3 foundation vocabulary ready for PAS-004 derivation where promoted
- [ ] Template cross-linked as implementation SSOT (temporary location noted)

## Derived documents

**Produces:** [erp-module-runtime Blueprint](../BLUEPRINT/erp-module-runtime-blueprint.md) · [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) · [ERP-MODULES template](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) · [Procurement NS](procurement-north-star.md)

**Never produces:** LoB domain North Stars (Procurement, Inventory, …) · slices · contracts · code

## References (link only)

| Document | Role |
| --- | --- |
| Platform North Star | [`afenda-platform-north-star.md`](../architecture/afenda-platform-north-star.md) |
| Platform Kernel North Star | [`kernel-north-star.md`](kernel-north-star.md) |
| ERP Integration Spine | [`PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md`](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| ERP Wire Vocabulary Catalog | [`PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md`](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) |
| Module foundation template (SSOT) | [`erp-runtime-module-foundation.template.md`](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) |
| PAS-001C | [`PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md`](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) |
| Module runtime Blueprint | [`erp-module-runtime-blueprint.md`](../BLUEPRINT/erp-module-runtime-blueprint.md) |
| Procurement domain NS | [`procurement-north-star.md`](procurement-north-star.md) |
| Platform API Contract North Star | [`api-contract-north-star.md`](api-contract-north-star.md) |
| Boundary contract | [`doc-boundary-contract.md`](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) |
| Evidence standard | [`doc-evidence-standard.md`](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| North Star template | [`north-star-template.md`](../../.cursor/skills/kernel-authority/reference/north-star-template.md) |

---

# 19. Final Doctrine

**ERP Runtime Module Foundation covenant:** Afenda scales line-of-business delivery by proving the same foundation before every module serves protected work. Identity precedes folders. Kernel words precede runtime behavior. Accepted meaning precedes semantic operations. Operating context precedes use cases. Declared permissions precede mutations. Mapped audit precedes compliance replay. Catalogued events precede integration. Metadata-bound surfaces precede UI shipment. Gate-proven readiness precedes operational life. The template shapes implementation; this North Star shapes meaning — if those diverge, fix the North Star first, then the Blueprint, then the template, then the code.

§1–§12 define **what governed module foundation means in enterprise business architecture**.

§13 bridges to Blueprint — **names only**.

PAS-001C and the foundation template define **how to build**.

If business meaning changes, amend §1–§12 — then Blueprint.

If paths, contracts, or gates change, amend Blueprint, PAS-001C, or template — **not** §1–§12 unless business meaning changed.
