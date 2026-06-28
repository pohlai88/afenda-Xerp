# Platform Kernel North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Platform Kernel — shared enterprise language substrate |
| **Domain type** | Platform substrate domain *(not a business LoB such as Accounting, HRM, or CRM)* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Derived document** | [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) · [ADR-0022](../adr/ADR-0022-postgres-split-id-persistence-model.md) · [ADR-0023](../adr/ADR-0023-tenant-human-reference-numbering.md) |
| **Maturity** | Enterprise Accepted — reverse-engineered from accepted PAS authority |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-29 |
| **Package / PAS inventory** | See [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) — not declared here |
| **Next document** | [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) |

> **One sentence:** Every Afenda module must speak one stable enterprise language for identity, scope, errors, and cross-domain facts before any business workflow can be trusted, audited, or integrated.

---

# 0. Agent Quick Path

**Read order:** Platform NS → this document §1–§12 → [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) → [KERNEL PAS](../PAS/KERNEL/README.md) → Slice → Code.

**This document answers:** why the kernel exists forever, what enterprise capabilities it permanently provides, and how they map to Blueprint boxes.

**This document never answers:** package paths, wire contracts, resolver spine, gate commands, or slice order.

**Chain rule:** Platform North Star → Platform Kernel North Star → Kernel Blueprint → PAS → Slice → Code

**Hard stops (business scope):**

- Kernel never resolves business state — it only carries accepted vocabulary and boundary-safe references.
- Do not treat Platform Kernel as an Accounting/HRM/CRM business domain.
- Resolver, spine, persistence, and authorization evaluation belong outside this domain.

---

# 1. Domain Philosophy

Every enterprise ERP must agree on **what things are called and how they are scoped** before it can agree on **what happened in the business**.

Without a shared language:

- Two modules can use the same word for different scopes (tenant vs company vs org).
- Integrations break silently when IDs cross package boundaries as plain strings.
- Audit trails lose correlation when execution chains cannot be traced end-to-end.
- AI-assisted development reinvents vocabulary in every package, causing irreversible drift.

The Platform Kernel domain exists because **cross-module facts and primitive vocabulary must be immutable, battle-proven, and independent of any single business workflow, database schema, or UI surface**.

**Source:** Platform NS §2 (canonical wire contracts) · ADR-0026 (governed platform constitution) · PAS-001 §16 doctrine (reverse-engineered acceptance, T5)

---

# 2. Domain Identity

| Field | Definition |
| --- | --- |
| **Mission** | Preserve the smallest stable enterprise language that all Afenda modules share at boundaries. |
| **Success definition** | No production module defines parallel identity, context, error, or event vocabulary outside the governed kernel language. |
| **Scope** | **Primitive vocabulary** (§3.1): identity, scope, trace, errors, event envelope, grant-scope words. **ERP wire catalog** (§3.2): cross-domain business labels at wire layer — meaning at boundaries only. |
| **Out of scope** | Business decisions, persistence, authorization evaluation, rendering, formatting, posting, workflows, and external integration behavior. |

---

# 3. Enterprise Vocabulary

Business meanings — not implementation types. Two governed classes — do not merge in prose or ownership.

## 3.1 Kernel primitive vocabulary

Platform substrate terms shared by every module. Governed primarily by PAS-001.

| Term | Enterprise meaning |
| --- | --- |
| **Enterprise identity** | A governed reference to a thing that may cross module boundaries (tenant, legal entity, document, correlation). |
| **Operating scope** | The hierarchy of boundaries within which a user or process is acting (tenant → group → entity → org → team → project → …). |
| **Execution trace** | The immutable chain linking a user action, API call, job, or event to a single auditable attempt. |
| **Grant scope** | The vocabulary of *where* a permission applies — not whether it is granted. |
| **Wire-safe fact** | A value that may cross process boundaries as JSON without leaking runtime objects. |
| **Result / error vocabulary** | Shared classification words for outcomes and failures at boundaries. |
| **Domain event envelope** | The standard wrapper for *what happened* in business vocabulary — not dispatch or retry. |
| **Consumer integration** | Proof that production surfaces speak the kernel language consistently — not new kernel vocabulary. |

## 3.2 ERP wire vocabulary

Cross-domain business labels at the wire layer. Governed by PAS-001B catalog — distinct lifecycle from primitive vocabulary.

| Term | Enterprise meaning |
| --- | --- |
| **ERP wire term** | A cross-domain business label (account type, posting status, lead stage) agreed at platform level — not ledger behavior. |
| **Domain wire catalog** | The governed set of ERP wire terms — meaning authority remains Enterprise Knowledge; kernel retains shapes only. |

**Separation rule:** Primitive vocabulary (§3.1) defines *how the platform speaks*. ERP wire vocabulary (§3.2) defines *which business labels may cross domains* — never operational state or workflow outcomes.

**Source:** PAS-001 §1 · §4.1–§4.4 · §4.10 · §16 (T5) · PAS-001B scope (T5) · Platform NS §2 (T1)

---

# 4. Capability Model

Permanent capabilities with maturity tiers.

| Capability | Maturity | EFR summary | Source |
| --- | --- | --- | --- |
| **Shared enterprise identity** | Enterprise | Branded IDs and reference families cross all modules without ambiguity | ADR-0021 §Decision · ADR-0022 §Decision · ADR-0023 §Decision · PAS-001 §4.1 |
| **Operating scope hierarchy** | Enterprise | Tenant → entity → org → project scope is one agreed hierarchy | ADR-0011 §Decision · PAS-001 §4.4 |
| **Execution traceability** | Enterprise | Every protected action carries correlation and execution identity | PAS-001 §4.3 |
| **Result and error vocabulary** | Enterprise | Failures are expressed in a shared, auditable vocabulary | PAS-001 §4.2 |
| **Policy decision vocabulary** | Enterprise | Permission *words* (module × action × scope) are platform-owned | PAS-001 §8 |
| **Domain event envelope** | Enterprise | Business events share one envelope shape at boundaries | PAS-001 §4.10 |
| **ERP domain wire catalog** | Production | Cross-domain business terms are catalogued without owning runtime | ADR-0020 §Decision · PAS-001B §0 · B76–B106 |
| **Minimal async context frame** | Enterprise | Safe propagation of execution frame without app/runtime leakage | PAS-001 §4.11 |
| **Consumer integration proof** | Production | Production ERP resolves scope and assembles operating context through one spine | PAS-001A §2.1 · B71–B75 |

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
| P6 | **Integration is provable** | Closed vocabulary does not guarantee production speaks it | Consumer integration PAS proves end-to-end spine |

**Source:** PAS-001 §16 · PAS-001A §1.2 TOGAF/DDD framing (T5)

---

# 6. Enterprise Outcomes and KPIs

| Outcome | Target | Measures |
| --- | --- | --- |
| **Vocabulary singularity** | Zero parallel ID/scope models in production packages | `pnpm quality:boundaries` · prohibited-surface scans |
| **Integration coherence** | 100% protected ERP surfaces use canonical resolver spine | `pnpm check:erp-operating-context-spine` |
| **Audit traceability** | Every API/action carries correlation + execution identity | Context wire triad gates |
| **Drift prevention** | Kernel PAS, SKILL, and runtime matrix stay aligned | `pnpm check:documentation-drift` |
| **Agent-safe delivery** | Any agent can implement a slice without re-deriving scope | PAS + slice handoff + kernel-authority skill |

---

# 7. Business Events

Events the kernel domain **names** (envelope vocabulary) — not dispatches.

| Event (business vocabulary) | Meaning |
| --- | --- |
| **Scope context established** | Operating scope resolved for a protected surface |
| **Execution started** | A traceable attempt began with correlation identity |
| **Execution failed (vocabulary)** | A failure was classified using shared error vocabulary |
| **Identity referenced cross-module** | A governed ID crossed a package boundary |
| **Domain term referenced** | An ERP wire term from catalog used at a boundary |
| **Integration attestation completed** | Consumer spine proven for a production milestone |

Dispatch, retry, outbox, and workflow orchestration belong outside this domain.

---

# 8. Entity Lifecycles

Business-state lifecycles for concepts this domain owns at vocabulary level.

### Enterprise identity reference

```text
Proposed → Accepted (governed family) → Active use at boundaries → Deprecated (ADR) → Retired
```

### Operating scope resolution (business view)

```text
Request received → Tenant boundary identified → Entity hierarchy resolved → Scope branded → Consumer authorized
```

### Kernel vocabulary amendment

```text
Need identified → ADR or PAS amendment → Slice delivered → Gates green → Enterprise Accepted
```

---

# 9. Boundary and Dependencies

## 9.1 This domain owns (business)

- **Primitive vocabulary** (§3.1): identity, operating scope, execution trace, result/error words, grant-scope words, event envelope
- Hierarchy semantics for operating scope (tenant through project and readiness signals)
- Cross-module identity and reference vocabulary
- **ERP wire catalog** (§3.2): governed business labels at wire layer — not operational workflows

## 9.2 This domain never owns (business)

> **Hard stop:** Kernel never resolves business state. It only carries accepted vocabulary and boundary-safe references.

- Who is logged in (Identity & Access domain)
- Whether an action is permitted (Authorization domain)
- **Resolution of scope, hierarchy, or master data** (ERP integration spine + Persistence — not kernel)
- What was stored or queried (Persistence domain)
- What the business calculated or posted (Accounting and domain runtimes)
- How the UI rendered or formatted (Presentation domain)
- What the enterprise *means* in contested terms (Enterprise Knowledge domain)

## 9.3 Cross-domain dependencies (business domains only)

| Depends on | Required for |
| --- | --- |
| **Platform constitution** | Declared authority for kernel as platform substrate |
| **Identity & Access** | Actor and session facts consumed — not defined — by execution trace |
| **Enterprise Knowledge** | Accepted business meaning — kernel retains wire shapes only |
| **Authorization** | Grant scope resolution — kernel retains vocabulary and branded projection |
| **Persistence** | Master data rows — kernel retains IDs only |
| **All ERP business domains** | Consume wire catalog — do not fork vocabulary |

---

# 10. Enterprise Risks

| Risk | Impact | Mitigation (architectural) |
| --- | --- | --- |
| **Vocabulary fork** | Incompatible modules; broken integrations | Kernel decision matrix · prohibited ownership gates |
| **Resolver in kernel** | Circular deps; untestable platform core | ERP spine owns assembly (PAS-001A) |
| **Parser duplication** | Incompatible branded types at boundaries | Wire triad owner split (permissions vs kernel projection) |
| **Scope fallback** | Cross-tenant data exposure | Fail-closed contract rules |
| **Kernel as dumping ground** | Unmaintainable shared-utils antipattern | Decision matrix + §5 must-never-own |
| **Docs/runtime drift** | Agents build from stale authority | Documentation drift gates · SYNC intent |
| **Vocabulary without integration proof** | Production silently ignores kernel language | PAS-001A consumer attestation |

---

# 11. Quality Attributes

| Attribute | Expectation |
| --- | --- |
| **Stability** | Kernel contracts change rarely; breaking changes require ADR |
| **Auditability** | Correlation and execution identity on every protected path |
| **Isolation** | Zero runtime dependency; no DB/HTTP/UI in kernel |
| **Type safety** | Branded IDs at trust boundaries |
| **Serializability** | Wire shapes JSON-safe across processes |
| **Testability** | Pure contracts testable without ERP runtime |
| **Agent readability** | North Star → Blueprint → PAS chain is unambiguous |

---

# 12. Evidence Register

| ID | Claim | Source class | Tier | Reference (exact anchor) |
| --- | --- | --- | --- | --- |
| E1 | Platform requires canonical wire contracts | ✓ | T0 | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) §Decision |
| E2 | Enterprise identity architecture | ✓ | T0 | [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) §Decision · [ADR-0022](../adr/ADR-0022-postgres-split-id-persistence-model.md) §Decision · [ADR-0023](../adr/ADR-0023-tenant-human-reference-numbering.md) §Decision |
| E3 | Multi-level company / operating hierarchy | ✓ | T0 | [ADR-0011](../adr/ADR-0011-multi-level-company-model-foundational.md) §Decision |
| E4 | Accounting vocabulary consolidated to platform wire layer | ✓ | T0 | [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) §Decision |
| E5 | Kernel primitive vocabulary enterprise-gated | ✓ | T5 | [PAS-001](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) §4 · B49–B70 |
| E6 | Consumer integration production-attested | ✓ | T5 | [PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) §2.1 · B71–B75 |
| E7 | ERP wire vocabulary catalog delivered | ✓ | T5 | [PAS-001B](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) §0 · B76–B106 · KV-* |
| D1 | Kernel owns words not decisions | ✓ | T1 | Platform NS §2 · PAS-001 §16 Final Kernel Doctrine |
| D2 | Kernel never resolves business state | ✓ | T5 | PAS-001 §5 · PAS-001A §2.2 ownership split |

**Provenance:** **Enterprise Accepted — reverse-engineered from accepted PAS authority** (PAS-001 · PAS-001A · PAS-001B) and upstream ADRs (T0). Amend via Domain NS change + Blueprint + PAS amendment — not by editing PAS alone.

---

# 13. Blueprint Mapping

Capability → Blueprint box names only. Detail: [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md).

| §4 Capability | Blueprint box |
| --- | --- |
| Shared enterprise identity | **Kernel Vocabulary** |
| Operating scope hierarchy | **Kernel Vocabulary** |
| Execution traceability | **Kernel Vocabulary** |
| Result and error vocabulary | **Kernel Vocabulary** |
| Policy decision vocabulary | **Kernel Vocabulary** |
| Domain event envelope | **Kernel Vocabulary** |
| ERP domain wire catalog | **Kernel Domain Vocabulary Catalog** |
| Minimal async context frame | **Kernel Vocabulary** |
| Consumer integration proof | **ERP Integration Spine** |

---

# 14. Governance

| Question | Authority |
| --- | --- |
| Change business meaning of scope/identity | This North Star + ADR |
| Split kernel into new box | Kernel Blueprint §3.1 matrix |
| Add authority surface / contract | PAS-001 amendment slice |
| Prove production speaks kernel | PAS-001A integration slice |
| Add ERP wire term | PAS-001B + Enterprise Knowledge alignment |

**Evolution:** Amend §1–§12 only with evidence register update. Implementation detail never enters §1–§12.

---

# 15. Sync

| Downstream | Sync rule |
| --- | --- |
| Kernel Blueprint §4 | Every §13 row has a box |
| Platform Blueprint | Kernel family row references this domain NS |
| PAS-001 / PAS-001A / PAS-001B | Trace to §4 capabilities and §13 map |

**Last synced with PAS:** PAS-001 Enterprise Accepted · PAS-001A Production Candidate · PAS-001B closed (2026-06-29) · **Maturity:** Enterprise Accepted (reverse-engineered)
