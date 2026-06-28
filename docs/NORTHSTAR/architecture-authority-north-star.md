# Platform Architecture Authority North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Platform Architecture Authority — constitutional owner of registry-first package and layer truth |
| **Domain type** | Platform authority substrate *(not a business LoB such as Accounting, HRM, or CRM)* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Constitutional laws** | [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) — LAW 2 · LAW 3 · LAW 7 · LAW 8 · LAW 9 |
| **Derived document** | [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md) · [Platform Blueprint rollup](../architecture/afenda-architecture-blueprint.md) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0004](../adr/ADR-0004-ownership-governance.md) · [ADR-0014](../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) |
| **Maturity** | Enterprise Accepted |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-29 |
| **Package / PAS inventory** | See [Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) — not declared here |
| **Next document** | [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md) |

> **One sentence:** Every Afenda package, layer, dependency, and ownership decision must be discoverable, enforceable, and drift-detectable before product code can scale without architectural entropy.

> **Authority vs activity:** *Governance* is the activity of maintaining compliance. *Architecture Authority* is the constitutional owner that records what exists and what is permitted. This document defines the **authority domain** — not a process manual.

---

# 0. Agent Quick Path

**Read order:** [Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → Platform NS → this document §1–§12 → [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md) → Architecture Authority PAS family → Slice → Code.

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

The Platform Architecture Authority domain exists because **package topology, layer discipline, dependency direction, ownership, and delivery disposition must be constitutional** — independent of any single feature, sprint, or team roster.

**Source:** [LAW 2](../CONSTITUTION/platform-constitutional-laws.md) · Platform NS §4 Platform governance · ADR-0026 · Architecture Authority PAS family doctrine (T5)

---

# 2. Domain Identity

| Field | Definition |
| --- | --- |
| **Mission** | Preserve one authoritative, machine-enforceable model of which packages exist, which layers they belong to, who owns them, and which dependencies are permitted. |
| **Success definition** | No production package operates outside registered layer rules; no architectural exception exists without recorded ADR evidence; disposition truth matches delivery reality. |
| **Scope** | Six registry classes (§3.1) · architecture quality attestation · governance consumer discipline. |
| **Out of scope** | Business workflow behavior · identity wire semantics · authorization evaluation · ledger posting · UI rendering · database schema execution · tenant configuration. |

---

# 3. Enterprise Vocabulary

Business meanings — not registry implementation types.

| Term | Enterprise meaning |
| --- | --- |
| **Architecture package** | A governed unit of software ownership with a declared layer, lifecycle, and dependency profile. |
| **Architecture layer** | A permanent stratum (Platform, Foundation, Application, UI, Design) that constrains dependency direction. |
| **Architecture authority** | The constitutional owner of registry truth — distinct from the *activity* of governance. |
| **Package ownership** | The accountable authority that approves boundary changes — governance metadata, not HR master data. |
| **Dependency boundary** | A rule about which packages may depend on which — enforced before merge, not debated in code review ad hoc. |
| **Architecture exception** | An ADR-approved, time-bounded waiver of a boundary rule — not informal technical debt. |
| **Architecture drift** | Detected divergence between registry truth, filesystem reality, and documentation claims. |
| **Governance consumer** | Any package or script that reads architecture authority to validate structure — must use approved surfaces only. |
| **Governance event** | A business-named fact that registry or compliance state changed — not a runtime ERP event. |

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

---

# 4. Capability Model

Permanent capabilities with maturity tiers.

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

**Amendment:** Invariants change only via this North Star + ADR — not via slice delivery or PAS prose alone.

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

---

# 8. Entity Lifecycles

Two lifecycle models — **do not conflate**.

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

---

# 9. Boundary and Dependencies

## 9.1 This domain owns (business)

- Six registry classes (§3.1) and their constitutional meaning
- Package governance lifecycle (§8.1)
- Governance invariants (§5.1)
- Governance event vocabulary (§7)
- Architecture quality attestation vocabulary

## 9.2 This domain never owns (business)

- Business master data records (customers, employees, products, ledger rows)
- Enterprise identity wire semantics and parsers (Platform Kernel domain)
- Whether an action is permitted (Authorization domain)
- Accepted business meaning of contested terms (Enterprise Knowledge domain)
- Versioned IFRS/MFRS rule evidence (Financial Reporting Standards domain)
- Visual token values and CSS consumption (Visual Token Authority domain)
- ERP workflow behavior in any business LoB

## 9.3 Cross-domain dependencies (business domains only)

| Depends on | Required for |
| --- | --- |
| **Platform Constitutional Laws** | LAW 2 · LAW 3 · LAW 7 · LAW 8 · LAW 9 |
| **Platform Kernel** | Identity semantics remain kernel-owned; authority records reservations only |
| **Enterprise Knowledge** | Lists knowledge platform in registries — does not store atoms |
| **All ERP domains** | Consume registry truth when declaring packages and boundaries |
| **Documentation governance** | Disposition and drift gates require doc/runtime parity |

| Provides to (domain) | What flows |
| --- | --- |
| **All platform domains** | Package allowed/not-allowed answers |
| **Foundation delivery** | Disposition status and gap visibility |
| **Agent orchestration** | Scaffold and slice placement discipline |

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
| **Governance as runtime** | ERP request path coupled to CI rules | P8 · P9 · LAW 6 |
| **Docs/registry drift** | Agents author from stale inventory | Documentation drift gates |
| **Registry class collapse** | Six registries treated as one blob | §3.1 taxonomy · I8 |

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
| E7 | Platform NS declares governance capability | ✓ | T1 | [Platform NS](../architecture/afenda-platform-north-star.md) §4 Platform governance |
| E8 | Constitutional laws codified | ✓ | T1 | [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) |
| D1 | Registry before runtime | ✓ | T5 | LAW 2 · Architecture Authority PAS §3.3 |
| D2 | Identity stays in Kernel | ✓ | T0 | LAW 8 · ADR-0021 · Enterprise extension B38 |
| D3 | Governance descriptive not prescriptive | ✓ | T1 | LAW 7 · P9 |

**Provenance:** Enterprise Accepted — reverse-engineered from Architecture Authority PAS family and upstream ADRs. Peer review accepted 2026-06-29.

---

# 13. Blueprint Mapping

Capability → Blueprint box names only. Detail: [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md) §4 · [Platform Blueprint rollup](../architecture/afenda-architecture-blueprint.md).

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

---

# 14. Governance

| Question | Authority |
| --- | --- |
| Change business meaning of authority concepts | This North Star + ADR |
| Add registry surface or gate | Architecture Authority PAS amendment slice |
| Promote foundation disposition lane | Foundation registry owner + disposition gate |
| Add business entity reservation | ADR-0020 alignment + Architecture Authority slice |
| Claim Enterprise Accepted maturity | Enterprise extension scorecard + disposition promotion |

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
| **Breaking contract** | ADR + PAS owner | ADR Constitution |
| **Emergency production deviation** | ADR + Architecture Authority | Retroactive ADR ≤5 business days |

**Rule:** If the matrix answer is unclear, stop — do not implement until the authority owner is identified.

**Evolution:** Amend §1–§12 only with evidence register update. Implementation detail never enters §1–§12.

---

# 15. Sync

| Downstream | Sync rule |
| --- | --- |
| Architecture Authority Blueprint §4 | Every §13 row has a box |
| Platform Blueprint | Governance family row references this domain NS · rollup only |
| Architecture Authority PAS family | Trace to §4 capabilities and §13 map |
| Platform Constitutional Laws | Laws 2, 3, 7, 8, 9 cite this document as primary home |

**Last synced with PAS:** Architecture Authority MVP closed · Enterprise extension B38–B42 delivered · **Maturity:** Enterprise Accepted · **Peer review:** accepted 2026-06-29
