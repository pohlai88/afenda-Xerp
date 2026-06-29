# Platform Architecture Authority North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Platform Architecture Authority — constitutional owner of registry-first package and layer truth |
| **Domain type** | Platform authority substrate *(not a business LoB such as Accounting, HRM, or CRM)* |
| **Parent** | [Platform North Star](../PAS/afenda-platform-north-star.md) |
| **Constitutional laws** | [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) — LAW 2 · LAW 3 · LAW 7 · LAW 8 · LAW 9 |
| **Derived document** | [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md) · [Platform Blueprint rollup](../BLUEPRINT/kernel-blueprint.md) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0004](../adr/ADR-0004-ownership-governance.md) · [ADR-0014](../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) |
| **Maturity** | Enterprise Accepted |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-29 |
| **Package / PAS inventory** | See [Architecture Blueprint](../BLUEPRINT/kernel-blueprint.md) — not declared here |
| **Next document** | [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md) |

> **One sentence:** Every Afenda package, layer, dependency, and ownership decision must be discoverable, enforceable, and drift-detectable before product code can scale without architectural entropy.

> **Authority vs activity:** *Governance* is the activity of maintaining compliance. *Architecture Authority* is the constitutional owner that records what exists and what is permitted. This document defines the **authority domain** — not a process manual.

---

# 0. Agent Quick Path

**Read order:** [Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → Platform NS → this document §1–§12 → [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md) → Architecture Authority PAS family → Slice → Code. Authors and reviewers: §14–§19.

**This document answers:** why platform architecture **authority** exists forever, what permanent capabilities it provides, and how they map to Blueprint boxes.

**This document never answers:** registry file paths, gate commands, validator modules, slice order, or package npm names.

**Chain rule:** Constitutional Laws → Platform North Star → Platform Architecture Authority North Star → Architecture Authority Blueprint → PAS → Slice → Code

**Hard stops (business scope):**

- Architecture authority records **what is allowed** — never **how business workflows behave**.
- Do not conflate package authority with enterprise identity semantics or business master data runtime.
- Authority gates prove registry truth — they do not execute ERP features at request time.

---

# 1. Domain Philosophy

Every enterprise platform that grows beyond a handful of modules eventually fails on **undocumented boundaries**: packages import what they should not, layers invert, ownership is ambiguous, and agents invent parallel structures because no single authority answers *"Is this allowed?"*

Without governed architecture authority:

- Foundation packages silently depend on application UI, creating untestable cycles.
- Business master data ownership splinters across modules with no reservation map.
- Delivery status diverges from registry truth — teams ship against stale assumptions.
- Vibe-coding agents scaffold packages that violate layer rules before CI catches them.
- Partner and side-by-side extensions break upgrade paths because surface stability was never declared.

The Platform Architecture Authority domain exists because **package topology, layer discipline, dependency direction, ownership, delivery disposition, and extension boundaries must be constitutional** — independent of any single feature, sprint, or team roster.

**Source:** [LAW 2](../CONSTITUTION/platform-constitutional-laws.md) · Platform NS §4 Platform governance · ADR-0026 · Architecture Authority PAS family doctrine (T5)

---

# 2. Domain Identity

| Field | Definition |
| --- | --- |
| **Mission** | Preserve one authoritative, machine-enforceable model of which packages exist, which layers they belong to, who owns them, which dependencies are permitted, and which surfaces are stable for consumers. |
| **Success definition** | No production package operates outside registered layer rules; no architectural exception exists without recorded ADR evidence; disposition truth matches delivery reality; registry classes never contradict without recorded resolution. |
| **Scope** | Six registry classes (§3.1) · surface stability taxonomy (§3.2) · dependency categories (§3.3) · architecture quality attestation · golden-path scaffolding · governance consumer discipline · registry conflict resolution (§5.2). |
| **Out of scope** | Business workflow behavior · identity wire semantics · authorization evaluation · ledger posting · UI rendering · database schema execution · tenant configuration · customer-specific extension code execution. |

---

# 3. Enterprise Vocabulary

Business meanings — not registry implementation types.

| Term | Enterprise meaning | Not confused with |
| --- | --- | --- |
| **Architecture package** | A governed unit of software ownership with a declared layer, lifecycle, and dependency profile. | Business entity · ERP module runtime |
| **Architecture layer** | A permanent stratum (Platform, Foundation, Application, UI, Design) that constrains dependency direction. | Business domain · LoB ownership |
| **Architecture authority** | The constitutional owner of registry truth — distinct from the *activity* of governance. | Governance CI scripts · runtime enforcement |
| **Package ownership** | The accountable authority that approves boundary changes — governance metadata, not HR master data. | Employee record · org chart |
| **Dependency boundary** | A rule about which packages may depend on which — enforced before merge, not debated in code review ad hoc. | Authorization permission · API rate limit |
| **Architecture exception** | An ADR-approved, time-bounded waiver of a boundary rule — not informal technical debt. | Bug fix · temporary feature flag |
| **Architecture drift** | Detected divergence between registry truth, filesystem reality, and documentation claims. | Runtime data drift · ledger imbalance |
| **Governance consumer** | Any package or script that reads architecture authority to validate structure — must use approved surfaces only. | ERP application consumer |
| **Governance event** | A business-named fact that registry or compliance state changed — not a runtime ERP event. | Domain business event |
| **Extension domain** | Where an extension runs relative to core: on-stack (same monorepo), side-by-side (separate deployable), or hybrid. | Architecture layer · business LoB |
| **Bridge module** | A package whose sole job is to connect two otherwise independent packages with minimal, explicit dependencies. | God-module · shared utilities dump |
| **Architecture catalog entry** | Minimum metadata (owner, layer, lifecycle, system membership) required before a package may enter **Registered** state. | Package registry row implementation |
| **Architecture landscape** | A point-in-time view of registered packages, permitted dependencies, and declared target-state gaps. | Runtime topology · infra diagram |
| **Architecture system** | Logical grouping of packages under one business or platform domain for impact analysis — not a layer. | Architecture layer · reservation domain |
| **Cross-cutting steward** | Accountable role for a concern (security, observability, i18n) across multiple packages — complements package ownership. | Package owner · LoB product owner |
| **Reference pattern** | An approved integration or decomposition pattern (e.g. bridge module, contracts-only platform package) — not a waiver. | Architecture exception |

## 3.1 Registry taxonomy

*Registry* is not one concept. Architecture authority owns **six distinct registry classes** — each with a single purpose:

| Registry class | Purpose | Answers |
| --- | --- | --- |
| **Package registry** | Canonical package inventory | Does this package exist? Which layer? Which lifecycle? |
| **Ownership registry** | Accountability records | Who approves boundary changes for this package? |
| **Layer registry** | Dependency direction rules | May package A depend on package B? |
| **Disposition registry** | Foundation delivery truth | Is this foundation item delivered, blocked, or waived? |
| **Reservation registry** | Business entity ownership map | Which domain owns which entity identifier families? |
| **Exception registry** | ADR-backed waivers | Which approved exceptions override default boundary rules? |

**Rule:** Do not merge these registries in prose or ownership. Each class has one job. Composite gates may read multiple registries — but SSOT remains per class.

**Source:** Architecture Authority PAS §4.1–§4.6 · §4.10 · Enterprise extension PAS (T5)

## 3.2 Surface stability taxonomy

Consumer-facing exports (contracts, public APIs, wire types re-exported for discovery) carry a **stability class** — distinct from layer rules and exception waivers:

| Stability class | Business meaning | Upgrade expectation |
| --- | --- | --- |
| **Released** | Strategic, stability-contract surface — breaking change requires ADR and consumer notice | Long-term stability |
| **Classic** | Stable legacy surface — maintained for compatibility; prefer Released for new work | Upgrade-stable with changelog |
| **Conditional** | Internal or transitional — use only when necessary; no long-term guarantee | Migrate to Released or retire |
| **Prohibited** | Not for external or cross-package consumer use — governance and runtime defects if imported | Remove or reclassify |

**Rule:** Stability class answers *"May I depend on this across upgrades?"* Layer rules answer *"May this package import that package?"*

**Source:** SAP Clean Core Level A–D mapping (T3) · peer review 2026-06-29 (T6 △ — PAS surface implementation pending)

## 3.3 Dependency category vocabulary

Dependencies are not one concept. Every permitted edge has a **category** that constrains how it may be used:

| Category | Business meaning |
| --- | --- |
| **Compile-time** | Type and contract import for build — no ERP request-time execution path |
| **Runtime-ERP** | Executes on customer request path — must never depend on governance proof modules |
| **Metadata-only** | Labels, docs, or discovery — no behavioral coupling |
| **Agent-skill** | Agent orchestration reads governance docs and registries — not product runtime |
| **Documentation-derived** | Human or agent views generated from authority — never authoritative over registry |

**Rule:** Runtime-ERP packages must not depend on compile-time governance consumers in reverse (strengthens P8).

**Source:** Architecture Authority Blueprint §3.2 dependency categories (T5) · TOGAF separation of landscape vs runtime (T3)

---

# 4. Capability Model

Permanent capabilities with maturity tiers. **Because → Therefore:** every Enterprise-tier row is battle-proven at T0–T5; Production/MVP rows cite T3 industry mapping where noted.

| Capability | Maturity | EFR summary | Source |
| --- | --- | --- | --- |
| **Canonical package inventory** | Enterprise | Every workspace package is registered with layer, lifecycle, and governance status | ADR-0026 · Package registry |
| **Layer dependency discipline** | Enterprise | Dependency direction follows Platform → Foundation → Application/UI; upward leaks rejected | Layer registry |
| **Ownership accountability** | Enterprise | Every package has an owning authority with sign-off baseline | ADR-0004 · Ownership registry |
| **Dependency boundary enforcement** | Enterprise | Allowed and forbidden edges are machine-checked before merge | Boundary rules · Dependency registry |
| **Approved exception registry** | Production | ADR-level waivers are recorded with owner, evidence, and resolution | Exception registry |
| **Foundation delivery disposition** | Enterprise | Foundation package maturity is tracked with runtime evidence pointers | ADR-0014 · Disposition registry |
| **Business entity reservation map** | Production | Which domain owns which business entity IDs is declared without storing master data | ADR-0020 · Reservation registry |
| **Architecture quality attestation** | Enterprise | Composite gates prove registries, cycles, drift, and disposition integrity | Quality attestation |
| **Kernel adjacency discipline** | Enterprise | Architecture authority never re-owns identity wire semantics reserved to Platform Kernel | ADR-0021 · LAW 8 |
| **Governance consumer proof** | Production | Representative consumers import architecture authority through approved surfaces only | Enterprise extension |
| **Extension boundary registry** | Production | Records which packages and surfaces are partner-extensible vs platform-only | SAP extension domains (T3) · §3.2 |
| **Contract surface attestation** | Production | Every consumer-facing export declares a stability class (§3.2) | SAP Clean Core (T3) · §3.2 |
| **Golden-path scaffolding governance** | Production | New packages enter via approved scaffold with owner, layer, and disposition pre-filled | Backstage catalog + scaffolder (T3) |
| **Target-state declaration** | Production | Architecture landscape distinguishes as-built vs planned target membership | TOGAF Architecture Landscape (T3) |
| **Architecture system membership** | Production | Every package belongs to one logical system for impact analysis | Backstage System entity (T3) |
| **Reference pattern catalog** | MVP | Approved decomposition patterns (bridge module, minimal depends) are discoverable | Odoo bridge-module discipline (T3) |

**Capability maturity key:** Idea · MVP · Production · Enterprise

---

# 5. Domain Principles

| # | Principle | Because | Therefore |
| --- | --- | --- | --- |
| P1 | **Registry before runtime** | Undeclared packages become permanent | No package may ship without registry row and layer assignment |
| P2 | **Governance root, not consumer** | If authority imports the governed, cycles are guaranteed | Architecture authority reads static evidence — never runtime modules it governs |
| P3 | **Layers are directional** | Inverted dependencies make foundation untestable | Upward imports from foundation into application/UI are defects |
| P4 | **Ownership is explicit** | Ambiguous ownership blocks boundary amendments | Every package change requires identifiable approving authority |
| P5 | **Exceptions are ADR-backed** | Silent waivers become permanent architecture | Exceptions expire, resolve, or reject — never linger as comments |
| P6 | **Disposition honesty** | Overstated maturity causes agents to build on sand | Delivery status must match gate evidence, not aspiration |
| P7 | **Identity stays in Kernel** | Duplicate ID semantics create incompatible branded types | Architecture authority records reservations only — never parsers or wire asserts |
| P8 | **Contracts-only stance is permanent** | Authority at request time couples ERP to CI rules | Enterprise Accepted means governance proof — not ERP runtime execution |
| P9 | **Governance is descriptive, never prescriptive** | Authority records what exists and what is permitted — it does not execute product behavior | Registries describe truth; runtime owners execute within declared boundaries |
| P10 | **Minimal dependency fan-out** | Broad cross-domain depends lists become monoliths pretending to be modules | Split core utilities from bridge modules; keep depends explicit and minimal |

**Source:** [LAW 6](../CONSTITUTION/platform-constitutional-laws.md) · [LAW 7](../CONSTITUTION/platform-constitutional-laws.md) · Architecture Authority PAS §2 · Enterprise extension PAS §1.3 (T5)

## 5.1 Governance invariants

Permanent constitutional truths — not gate commands. Every downstream document and agent must respect these without re-debate.

| # | Invariant |
| --- | --- |
| I1 | Every production package must have **one** owner. |
| I2 | Every package belongs to **one** layer. |
| I3 | Every dependency must satisfy layer rules — or a recorded ADR exception. |
| I4 | Every exception must reference an ADR with owner and evidence. |
| I5 | Every delivered package must exist in the package registry. |
| I6 | Architecture authority records reservations — Kernel owns identity semantics. |
| I7 | Governance records truth; runtime executes truth — never the reverse. |
| I8 | Registry classes (§3.1) are not merged — each has single SSOT purpose. |
| I9 | Registry contradictions escalate via §5.2 — never silent overwrite of one class by another. |
| I10 | Runtime-ERP dependency categories must not reverse-depend on governance proof paths. |

**Amendment:** Invariants change only via this North Star + ADR — not via slice delivery or PAS prose alone.

## 5.2 Registry conflict resolution

When registry classes disagree (package **Registered** but disposition **Blocked**; reservation conflicts with Kernel ID family; catalog entry incomplete but filesystem package exists):

| Step | Action |
| --- | --- |
| 1 | Identify both registry classes and conflicting rows — do not merge SSOT |
| 2 | Apply precedence: **Kernel identity** > **Package registry existence** > **Disposition delivery truth** > **Documentation views** |
| 3 | If same precedence level conflicts, require **Architecture Decision** record citing both sources — epistemic status remains unresolved until closed |
| 4 | If unresolved, package remains **Governed** at most — not **Delivered** |
| 5 | Emit governance event **Registry conflict detected**; close with **Compliance assessment completed** when resolved |

**Example:** A package row exists but disposition is **Blocked** — consumers must treat the package as not delivered for foundation-dependent work until disposition advances or ADR exception records waiver.

**Source:** Enterprise Knowledge conflict model pattern (T1) · TOGAF Governance Log discipline (T3) · peer review 2026-06-29 (T6)

---

# 6. Enterprise Outcomes and KPIs

| Outcome | Target | Measures |
| --- | --- | --- |
| **Architectural singularity** | Zero unregistered production packages | Registry parity gates · filesystem discovery |
| **Layer hygiene** | Zero forbidden upward dependencies in CI | Boundary and cycle gates |
| **Ownership clarity** | 100% active packages have attested ownership | Ownership sign-off gate |
| **Disposition accuracy** | Foundation rows match delivery evidence | Disposition completeness gate |
| **Drift prevention** | Registry, docs, and runtime matrix aligned | Documentation drift gates |
| **Agent-safe scaffolding** | Any agent can validate package placement before coding | Architecture authority skill + registries |
| **Landscape honesty** | Target-state vs as-built gaps visible and tracked | Target-state declaration · architecture landscape reviews |
| **Exception discipline** | Zero active exceptions past ADR resolution date | Exception lifecycle · governance log |
| **Surface stability coverage** | 100% Production+ consumer exports declare stability class | Contract surface attestation (when PAS operational) |

---

# 7. Business Events

**Governance events** — facts that registry or compliance state changed. These are **not** runtime ERP events, queue messages, or API dispatches.

| Governance event | Meaning |
| --- | --- |
| **Package registered** | A new architecture package entered canonical inventory |
| **Layer violation detected** | A dependency crossed an undeclared layer boundary |
| **Ownership attested** | Approving authority confirmed responsibility for a package |
| **Exception granted** | An ADR-backed waiver was recorded for a boundary rule |
| **Disposition advanced** | Foundation delivery status changed with evidence |
| **Architecture drift detected** | Registry truth diverged from filesystem or documentation |
| **Governance attestation completed** | Enterprise maturity evidence closed for architecture authority |
| **Reservation declared** | A business entity family was assigned to an owning domain |
| **Surface released** | A consumer export received Released stability class with ADR evidence |
| **Surface deprecated** | A stability class moved toward retirement with consumer notice |
| **Package scaffold initiated** | Golden-path scaffolding started for a new architecture package |
| **Package scaffold rejected** | Scaffold failed catalog completeness or layer pre-check |
| **Registry conflict detected** | Two registry classes reported incompatible truth |
| **Compliance assessment completed** | Periodic or triggered architecture review closed with evidence |

---

# 8. Entity Lifecycles

Multiple lifecycle models — **do not conflate**.

## 8.1 Package governance lifecycle

Tracks **architectural membership and compliance** of a package in the monorepo:

```text
Proposed → Registered → Governed → Delivered → Retired
```

| State | Business meaning |
| --- | --- |
| **Proposed** | Intent declared — not yet in package registry |
| **Registered** | Package registry row exists with layer and owner |
| **Governed** | Layer rules, dependencies, and gates apply |
| **Delivered** | Foundation disposition or product milestone attests live delivery |
| **Retired** | Deprecated — historical reference; new work forbidden |

## 8.2 Foundation disposition lifecycle

Tracks **delivery evidence** for foundation-level architecture work — orthogonal to package registration:

```text
Not started → Partial → Delivered → Enterprise Accepted — OR Blocked / Waived
```

Disposition answers *"Is the foundation work done?"* Package lifecycle answers *"Is this package a governed member of the architecture?"*

## 8.3 Architecture exception lifecycle

```text
Proposed → Active (ADR-backed) → Completed / Waived / Rejected
```

## 8.4 Surface stability lifecycle

Tracks **consumer contract stability** — orthogonal to package registration and disposition:

```text
Experimental → Released / Classic → Deprecated → Removed
```

| State | Business meaning |
| --- | --- |
| **Experimental** | Not for production consumer dependence |
| **Released / Classic** | Declared stability class active (§3.2) |
| **Deprecated** | Consumers notified — migration window open |
| **Removed** | Export retired — ADR and consumer migration complete |

## 8.5 Architecture catalog entry lifecycle

Tracks **minimum metadata completeness** before scaffolding promotes to Registered:

```text
Draft → Validated → Registered — OR Rejected
```

**Rule:** **Validated** requires owner, layer, system membership, and dependency category declaration — golden-path scaffolding enforces this before registry row creation.

---

# 9. Boundary and Dependencies

## 9.1 This domain owns (business)

- Six registry classes (§3.1) and their constitutional meaning
- Surface stability taxonomy (§3.2) and dependency categories (§3.3)
- Package governance lifecycle (§8.1) · surface lifecycle (§8.4) · catalog entry lifecycle (§8.5)
- Governance invariants (§5.1) and registry conflict resolution (§5.2)
- Governance event vocabulary (§7)
- Architecture quality attestation vocabulary
- Extension boundary and golden-path scaffolding vocabulary

## 9.2 This domain never owns (business)

- Business master data records (customers, employees, products, ledger rows)
- Enterprise identity wire semantics and parsers (Platform Kernel domain)
- Whether an action is permitted (Authorization domain)
- Accepted business meaning of contested terms (Enterprise Knowledge domain)
- Versioned IFRS/MFRS rule evidence (Financial Reporting Standards domain)
- Visual token values and CSS consumption (Visual Token Authority domain)
- ERP workflow behavior in any business LoB
- Customer-specific extension code execution (side-by-side deployables outside platform registry)

## 9.3 Cross-domain dependencies (business domains only)

| Depends on | Required for |
| --- | --- |
| **Platform Constitutional Laws** | LAW 2 · LAW 3 · LAW 7 · LAW 8 · LAW 9 |
| **Platform Kernel** | Identity semantics remain kernel-owned; authority records reservations only |
| **Enterprise Knowledge** | Lists knowledge platform in registries — does not store atoms |
| **AI governance** | Agent scaffold and slice discipline consumes registry truth — separate PAS when authored |
| **All ERP domains** | Consume registry truth when declaring packages and boundaries |
| **Documentation governance** | Disposition and drift gates require doc/runtime parity |

| Provides to (domain) | What flows |
| --- | --- |
| **All platform domains** | Package allowed/not-allowed answers |
| **Foundation delivery** | Disposition status and gap visibility |
| **Agent orchestration** | Scaffold and slice placement discipline |
| **AI governance** | Registry inventory for agent boundary enforcement |

## 9.4 Four orthogonal platform domains

Platform Architecture Authority is **Platform Structure** — one of four non-overlapping constitutional domains:

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

**Rule:** No domain absorbs another's question. Shape ≠ meaning ≠ structure ≠ external citation. Registries record structure — never accepted business meaning (see Enterprise Knowledge NS §9.4).

---

# 10. Enterprise Risks

| Risk | Impact | Mitigation (architectural) |
| --- | --- | --- |
| **Architectural entropy** | Unmaintainable monorepo; agent-generated sprawl | Registry-first gates · layer enforcement · LAW 2 |
| **Phantom packages** | Imports to undeclared workspaces | Filesystem discovery parity |
| **Layer inversion** | Foundation depends on UI — untestable core | Forbidden dependency validators |
| **Ownership vacuum** | Boundary changes with no approver | Ownership registry + attestation · LAW 3 |
| **False maturity** | Teams build on undelivered foundation | Disposition honesty · Enterprise extension scorecard |
| **Kernel duplication** | Incompatible ID semantics in governance package | Kernel non-duplication gate · LAW 8 |
| **Governance as runtime** | ERP request path coupled to CI rules | P8 · P9 · LAW 6 · §3.3 |
| **Docs/registry drift** | Agents author from stale inventory | Documentation drift gates |
| **Registry class collapse** | Six registries treated as one blob | §3.1 taxonomy · I8 |
| **Registry contradiction** | Two SSOT classes disagree silently | §5.2 conflict resolution · I9 |
| **Monolith module** | One package depends on many LoBs — untestable blast radius | P10 · bridge modules · reference patterns |
| **Silent breaking export** | Consumers depend on Conditional/Prohibited surfaces | §3.2 stability classes · surface lifecycle §8.4 |
| **Scaffold bypass** | Agents create packages without owner/layer/disposition | Golden-path scaffolding · §8.5 catalog entry |
| **Extension upgrade break** | Partner extensions depend on non-Released surfaces | Extension boundary registry · stability attestation |

---

# 11. Quality Attributes

| Attribute | Expectation |
| --- | --- |
| **Determinism** | Gates produce the same result locally and in CI |
| **Explainability** | Failures cite registry row, rule, and remediation |
| **Stability** | Layer model changes rarely — ADR required |
| **Completeness** | Every active package has registry, ownership, and disposition rows |
| **Separation** | Authority never imports governed runtime modules |
| **Descriptiveness** | Registries record truth — they do not execute product behavior (P9) |
| **Agent readability** | Constitutional Laws → North Star → Blueprint → PAS chain is unambiguous |
| **Auditability** | Exceptions and disposition changes trace to ADR evidence |
| **Extension-readiness** | Stability classes and extension domains declared before partner scale |
| **Conflict honesty** | Registry contradictions escalate — never silent merge (§5.2) |

---

# 12. Evidence Register

| ID | Claim | Source class | Tier | Reference (exact anchor) |
| --- | --- | --- | --- | --- |
| E1 | Platform requires governed package topology | ✓ | T0 | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) §Decision |
| E2 | Package ownership baseline | ✓ | T0 | [ADR-0004](../adr/ADR-0004-ownership-governance.md) §Decision |
| E3 | Foundation disposition registry | ✓ | T0 | [ADR-0014](../adr/ADR-0014-foundation-disposition-registry.md) §Decision |
| E4 | Business master data authority consolidation | ✓ | T0 | [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) §Decision |
| E5 | Architecture authority MVP surfaces delivered | ✓ | T5 | Architecture Authority PAS §4 · B1–B27 |
| E6 | Enterprise Accepted hardening delivered | ✓ | T5 | Enterprise extension PAS B38–B42 |
| E7 | Platform NS declares governance capability | ✓ | T1 | [Platform NS](../PAS/afenda-platform-north-star.md) §4 Platform governance |
| E8 | Constitutional laws codified | ✓ | T1 | [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) |
| E9 | Four orthogonal platform domains | ✓ | T1 | Enterprise Knowledge NS §9.4 · peer review 2026-06-29 |
| E10 | Extension domain taxonomy (on-stack / side-by-side / hybrid) | ✓ | T3 | SAP Application Extension Methodology · Clean Core mapping |
| E11 | Surface stability levels (Released / Classic / Conditional / Prohibited) | △ | T3 | SAP Clean Core Level A–D · §3.2 — PAS implementation pending |
| E12 | Golden-path catalog + scaffolder discipline | △ | T3 | Backstage catalog-info ownership pattern · §4 golden-path capability |
| E13 | Module boundary tag constraints | △ | T3 | Nx enforce-module-boundaries · layer registry analogue |
| E14 | Minimal depends + bridge module decomposition | △ | T3 | Odoo manifest depends discipline · P10 |
| E15 | Architecture Landscape (as-built vs target) | △ | T3 | TOGAF Architecture Repository · §4 target-state capability |
| E16 | Registry conflict escalation model | ✓ | T6 | §5.2 · Enterprise Knowledge §5.2 pattern · peer review 2026-06-29 |
| D1 | Registry before runtime | ✓ | T5 | LAW 2 · Architecture Authority PAS §3.3 |
| D2 | Identity stays in Kernel | ✓ | T0 | LAW 8 · ADR-0021 · Enterprise extension B38 |
| D3 | Governance descriptive not prescriptive | ✓ | T1 | LAW 7 · P9 |
| D4 | Minimal dependency fan-out | ✓ | T3 | Odoo bridge-module pattern · P10 |
| D5 | Shape ≠ structure ≠ meaning | ✓ | T1 | §9.4 · Enterprise Knowledge NS §9.4 |

**Provenance:** Enterprise Accepted — amended 2026-06-29 with extension, surface stability, conflict resolution, and template §15–§19 completion. Items E11–E15 remain △ until PAS surfaces operational.

---

# 13. Blueprint Mapping

Capability → Blueprint box names only. Detail: [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md) §4 · [Platform Blueprint rollup](../BLUEPRINT/kernel-blueprint.md).

| §4 Capability | Blueprint box |
| --- | --- |
| Canonical package inventory | **Architecture authority** |
| Layer dependency discipline | **Architecture authority** |
| Ownership accountability | **Architecture authority** |
| Dependency boundary enforcement | **Architecture authority** |
| Approved exception registry | **Architecture authority** |
| Foundation delivery disposition | **Architecture authority** |
| Business entity reservation map | **Architecture authority** |
| Architecture quality attestation | **Architecture authority** |
| Kernel adjacency discipline | **Architecture authority** |
| Governance consumer proof | **Architecture authority** |
| Extension boundary registry | **Architecture authority** |
| Contract surface attestation | **Architecture authority** |
| Golden-path scaffolding governance | **Architecture authority** |
| Target-state declaration | **Architecture authority** |
| Architecture system membership | **Architecture authority** |
| Reference pattern catalog | **Architecture authority** |

---

# 14. Governance

| Question | Authority |
| --- | --- |
| Change business meaning of authority concepts | This North Star + ADR |
| Add registry surface or gate | Architecture Authority PAS amendment slice |
| Promote foundation disposition lane | Foundation registry owner + disposition gate |
| Add business entity reservation | ADR-0020 alignment + Architecture Authority slice |
| Claim Enterprise Accepted maturity | Enterprise extension scorecard + disposition promotion |
| Add stability class or extension domain vocabulary | This North Star §3 + ADR if constitutional |
| Resolve registry conflict | §5.2 · Architecture Decision record |

## 14.5 Governance Decision Matrix

*Where does this change belong?* — governance equivalent of Blueprint §3.1 Architecture Decision Matrix. [LAW 9](../CONSTITUTION/platform-constitutional-laws.md)

| Question / change | Authority owner | Document / actor |
| --- | --- | --- |
| New **package** | Architecture Authority | Package registry · Blueprint §4 box |
| New **layer** or layer rule change | ADR + Architecture Authority | Layer registry |
| New **business domain** (LoB) | Platform North Star → Domain North Star | Platform NS §4 · new Domain NS |
| New **business meaning** (EFR, vocabulary) | Domain North Star owner | Domain NS §1–§12 |
| New **Blueprint box** | Blueprint steward + §3.1 matrix | Architecture Blueprint |
| New **contract** / authority surface | PAS package owner | PAS §4 |
| **Runtime behavior** | Runtime domain owner | Domain runtime PAS — not architecture authority |
| New **registry class row** | Architecture Authority | Appropriate §3.1 registry |
| New **business entity** reservation | Reservation registry + ADR-0020 | Architecture Authority slice |
| New **cross-package vocabulary** | Platform Kernel · Enterprise Knowledge | Kernel NS · Knowledge NS — not architecture authority |
| **Breaking contract** / surface deprecation | ADR + PAS owner | ADR Constitution · §8.4 lifecycle |
| **Extension** or partner boundary | ADR + Architecture Authority | Extension boundary registry |
| **Golden-path scaffold** template | Architecture Authority + AI governance | Catalog entry §8.5 |
| **Registry conflict** | §5.2 escalation | Architecture Decision record |
| **Emergency production deviation** | ADR + Architecture Authority | Retroactive ADR ≤5 business days |

**Rule:** If the matrix answer is unclear, stop — do not implement until the authority owner is identified.

**Evolution:** Amend §1–§12 only with evidence register update. Implementation detail never enters §1–§12.

---

# 15. Domain Evolution

**May evolve here:** new §4 capabilities · §6 outcome targets · §7 events · vocabulary (§3) · stability classes · extension domains

**Must not evolve here:** runtime rules (PAS) · slice order (PAS §10) · registry row edits outside foundation-registry-owner · PAS inventory (Blueprint §10)

**Long-term direction:**

- **Core (delivered):** Six registry classes · layer discipline · ownership · disposition · kernel adjacency · Enterprise Accepted attestation
- **Production (next):** Surface stability attestation · golden-path scaffolding · extension boundary registry · target-state landscape · system membership
- **Advanced (LoB scale):** Partner side-by-side extension isolation · cross-cutting steward attestation · reference pattern catalog operational
- **Future (marketplace):** Multi-tenant customer extension registry — side-by-side deployables with Released-surface-only coupling

---

# 16. Enterprise Acceptance Criteria (EAC)

> **Business-document EAC** — proves §1–§12 complete and every **Production+** EFR battle-proven. Package/PAS EAC → Blueprint · PAS §11.

| Criterion | Gate | Traces to |
| --- | --- | --- |
| §1 Philosophy immutable and cited ✓ | Manual review — Architecture Authority owner | §1 Source |
| §2 Identity complete (mission, success, scope) | Manual review | §2 |
| §3 Enterprise Vocabulary — core + §3.1–§3.3 | Manual review + PAS-004 promotion plan for new terms | §3 |
| §4 EFR — Enterprise rows ✓ at Production+ | Evidence standard audit | §4 · §12 |
| §5 Principles + invariants + §5.2 conflict model | Manual review | §5 |
| §6 Outcomes + KPIs declared | Manual review | §6 |
| §7 Governance events listed | Manual review | §7 |
| §8 Lifecycles — package · disposition · exception · surface · catalog | Manual review | §8 |
| §9 Boundaries + §9.4 four-domain placement | Manual review | §9 |
| §10 Risks — core capabilities mitigated | Manual review | §10 |
| §11 Quality attributes declared | Manual review | §11 |
| §12 Evidence Register complete; △ items tracked | Manual review | §12 |
| §13 maps every §4 capability to Blueprint box | Manual review + Blueprint exists | §4 → §13 |
| §1–§12 contain no implementation identifiers | Boundary contract hygiene | doc-boundary-contract |
| Zero ✗ assumptions in Production+ EFR rows | Evidence class audit | §12 |
| Blueprint/PAS authorable without redefining domain | Manual review | Full §1–§12 |

**Enterprise Accepted maintenance:** Re-run this EAC when §1–§12 amended or when △ items (E11–E15) promote to ✓.

---

# 17. Document Sync Obligations

| Change in this document | Then update |
| --- | --- |
| New §4 capability | §13 row · Blueprint §4 box · PAS §4 surface slice |
| New §3 vocabulary term | PAS-004 atom promotion slice (SYNC) |
| New §7 event | Blueprint integration planning · PAS §4 event surface |
| Renamed capability | §13 + Blueprint box name (if business rename) |
| Boundary / dependency change (§9) | Blueprint §5 consumers · Platform Blueprint rollup |
| Risk or quality change (§10–§11) | Blueprint §4 Reasoning · PAS §0 |
| Stability class or extension domain | PAS amendment · ADR if constitutional |
| Business meaning stable; implementation only | Blueprint or PAS — **not** §1–§12 unless meaning changed |

| Downstream | Sync rule |
| --- | --- |
| Architecture Authority Blueprint §4 | Every §13 row has a box |
| Platform Blueprint | Governance family row references this domain NS · rollup only |
| Architecture Authority PAS family | Trace to §4 capabilities; implement △ items E11–E15 |
| Platform Constitutional Laws | Laws 2, 3, 7, 8, 9 cite this document as primary home |
| Enterprise Knowledge NS §9.4 | Four-domain diagram consistent — Structure = Architecture Authority |

**Last synced with PAS:** Architecture Authority MVP closed · Enterprise extension B38–B42 delivered · NS amended 2026-06-29 · **Maturity:** Enterprise Accepted · **△ PAS follow-up:** E11–E15 surfaces

---

# 18. Required Reviews and References

## Before accepting §1–§12 amendments

- [ ] §1–§12 complete; no implementation identifiers in business sections
- [ ] §13 traces every §4 capability to a Blueprint box name
- [ ] No PAS inventory, build order, or slice counts in §1–§12
- [ ] No duplicate of Blueprint `why separate`, layers, or consumers
- [ ] [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) checklist passes
- [ ] [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) — EFR cited ✓ · §12 register · **zero ✗ at Production+**
- [ ] §3 vocabulary ready for PAS-004 derivation on new terms
- [ ] §9.4 consistent with Enterprise Knowledge NS §9.4

## Derived documents

**Produces:** [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md)

**Never produces:** PAS · slices · contracts · code

## References

| Document | Role |
| --- | --- |
| Platform North Star | [afenda-platform-north-star.md](../PAS/afenda-platform-north-star.md) |
| Architecture Authority Blueprint | [architecture-authority-blueprint.md](../BLUEPRINT/architecture-authority-blueprint.md) |
| Enterprise Knowledge NS | [enterprise-knowledge-north-star.md](enterprise-knowledge-north-star.md) §9.4 |
| Boundary contract | [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) |
| Evidence standard | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| North Star template | [north-star-template.md](../../.cursor/skills/kernel-authority/reference/north-star-template.md) |

---

# 19. Final Doctrine

**Architecture Authority covenant:** The platform survives scale only when every package, dependency, owner, disposition, and consumer surface is declared before it becomes permanent. Structure is not meaning and structure is not shape — Architecture Authority answers *what is allowed* with registries that machines and agents can enforce, while Kernel owns wire shape and Enterprise Knowledge owns accepted meaning. Exceptions are ADR-backed and time-bounded; contradictions escalate; disposition never lies; runtime ERP never depends on governance proof paths. Extension and upgrade safety require explicit stability classes and minimal dependency fan-out — not hope and code review debate.

§1–§12 define **what platform structure means in enterprise business architecture**.

§13 bridges to Blueprint — **names only**.

PAS defines **how to build**.

If business meaning changes, amend §1–§12 — then Blueprint.

If packages or PAS change, amend Blueprint or PAS — **not** §1–§12 unless business meaning changed.
