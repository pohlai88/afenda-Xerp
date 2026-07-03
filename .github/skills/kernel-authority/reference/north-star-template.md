# [DOMAIN] North Star

> **Purpose**
>
> The Domain North Star is the **root business architecture specification** for one domain.
>
> It defines **why the domain exists forever**, **what it means in enterprise language**, **what it must permanently provide**, and **how capabilities decompose toward Blueprint and PAS**.
>
> It never defines package names, PAS IDs, slice counts, contracts, runtime rules, or code.

> Fill-in template for a domain-scoped North Star (e.g. "Accounting North Star", "HRM North Star").
> Replace every `[PLACEHOLDER]`. Delete instruction lines (lines beginning with `>`).
> **Business architecture:** §1–§12 (entirely business-facing). **Evidence:** §12. **Blueprint bridge:** §13. **Governance & EAC:** §14–§19.
> Cross-document rules: [doc-boundary-contract.md](doc-boundary-contract.md) · [doc-evidence-standard.md](doc-evidence-standard.md)

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | `[DOMAIN NAME]` — e.g. Accounting, HRM, CRM |
| **Parent** | [Platform North Star](../../docs/NORTHSTAR/kernel-north-star.md) |
| **Derived document** | [Architecture Blueprint](../../docs/BLUEPRINT/kernel-blueprint.md) |
| **Authority ADR** | [ADR-0026](../../docs/adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) (or domain-specific ADR) |
| **Maturity** | Idea / MVP / Production / Enterprise |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package ownership, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** (business architecture authority) |
| **Evidence standard** | [doc-evidence-standard.md](doc-evidence-standard.md) |
| **Last reviewed** | `[YYYY-MM-DD]` — update on every §1–§12 amendment |
| **Package / PAS inventory** | See [Architecture Blueprint](../../docs/BLUEPRINT/kernel-blueprint.md) — not declared here |
| **Next document** | Architecture Blueprint |

> **One sentence:** [Permanent purpose of this domain in one sentence — business language only.]

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

> Read §1–§12 for business architecture. For packages, PAS, and slices — go to Blueprint and PAS ([boundary contract](doc-boundary-contract.md)).

## Read order

1. [Platform North Star](../../docs/NORTHSTAR/kernel-north-star.md) — confirm domain exists at platform scope
2. This document §1–§12 — philosophy, vocabulary, capabilities, events, boundaries, evidence
3. [Architecture Blueprint](../../docs/BLUEPRINT/kernel-blueprint.md) — boxes, layers, PAS inventory
4. Target PAS — feature spec
5. Target Slice — work order
6. Implement

## This document answers

- Why this domain exists **forever** (§1 Philosophy)
- What the domain **is** in enterprise language (§2–§3)
- What permanent capabilities, outcomes, events, and lifecycles it owns (§4–§8)
- What it owns, never owns, and depends on — **business domains only** (§9)
- What risks and quality attributes shape architectural decisions (§10–§11)
- Battle-proven evidence for every permanent claim (§12)
- How capabilities map to Blueprint boxes (§13 — names only)

## This document never answers

- Package names, layers, or `why separate` (Blueprint §4)
- PAS IDs, slice counts, or build order (Blueprint §10; PAS §10–§12)
- Consumer lists (Blueprint §5)
- Runtime contracts (PAS §4)
- Gate commands (PAS §13; Platform North Star §13 for platform gates)

## Hard stops (business scope)

- [STOP 1: domain business rule — e.g. "Do not treat estimates as ledger truth"]
- [STOP 2: e.g. "Do not conflate this domain with Tax or Reporting"]
- [STOP 3: add domain-specific business stops]

**Chain rule:** Platform North Star → Domain North Star → Blueprint → PAS → Slice → Code

## Vibe-coding modes

| Mode | Who | Read | Output |
| --- | --- | --- | --- |
| **Author** | Human or agent drafting domain spec | §1–§12 first, then §13 | Business-complete North Star; no packages/PAS |
| **Implement** | Coding agent on a slice | Blueprint §4 → PAS §0 → slice handoff | Code + gates; **do not** re-derive scope from §1–§12 |
| **Review** | `/afenda-review` or doc drift | §16 + [doc-boundary-contract.md](doc-boundary-contract.md) | Pass/fail on business architecture and boundary hygiene |

**Implement mode rule:** Phase 0 six lines come from the **slice 9-field handoff** and `/afenda-coding-session` — not from this document.

**Enterprise 10 / 10 (this document):** §16 EAC pass · §1–§12 stable · §13 maps every §4 capability · zero package/PAS leakage · **§12 Evidence Register complete** · vocabulary feeds PAS-004 ([doc-evidence-standard.md](doc-evidence-standard.md)).

---

# 1. Domain Philosophy

> **Immutable.** Why this domain exists **forever** — independent of software, vendor, or implementation era.
> Philosophy is not tactical. Mission (§2) and outcomes (§6) derive from this.

**[DOMAIN] exists because:** [One paragraph — permanent human/enterprise need. Business language only.]

**Examples (replace with domain-specific prose):**

- **Accounting:** Every enterprise must preserve an auditable financial truth independent of software implementation.
- **HRM:** Every enterprise must govern human relationships throughout their lifecycle.
- **CRM:** Every enterprise must manage customer relationships from prospect through lifetime value.

| Source (✓ battle-proven) | Reasoning (Because → Therefore) |
| --- | --- |
| `[T0–T3 citation]` ✓ | **Because** … **Therefore** all downstream EFR must serve this philosophy … |

> **Rule:** Philosophy changes only by ADR + domain owner review — not by slice delivery.

---

# 2. Domain Identity

> **What this domain is** — operational identity anchored in §1 Philosophy. Not implementation.

## Mission

[How Afenda permanently serves §1 Philosophy — the domain's enduring operational mandate. Shorter and more tactical than Philosophy; still business language only.]

| Source | Reasoning |
| --- | --- |
| `[T1 Domain NS §1]` · `[T1 Platform NS §4]` | **Because** … **Therefore** … |

## Definition

**[DOMAIN] is:** [Business paragraph. No packages, APIs, folders, or runtime.]

**Describe:** business scope · business responsibility · relationship to §1 Philosophy

**Do not describe:** packages · APIs · folders · runtime

**What [DOMAIN] is not:** [Explicit exclusions in business terms — reference other **domains** by name, not package names.]

## Success (capability gain)

[When the domain is fully realized in Afenda, what **permanent capability** the platform gains — not KPIs (those live in §6).]

| Source | Reasoning |
| --- | --- |
| `[T1 Platform NS §4 …]` or `[T3 external standard]` ✓ | **Because** … **Therefore** … |

---

# 3. Enterprise Vocabulary

> **Business meanings only** — canonical input for [PAS-004 / `@afenda/enterprise-knowledge`](../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md).
> PAS derives terminology atoms from here — do not invent terms in PAS without amending this section.

| Term | Business meaning (one line) | Not confused with | Source (✓) | PAS-004 atom (when promoted) |
| --- | --- | --- | --- | --- |
| [Term 1 — e.g. Customer] | [Permanent business definition] | [Related term or domain] | `[T2/T3]` ✓ | `atom:[id]` or `planned` |
| [Term 2 — e.g. Invoice] | | | | |
| [Term 3] | | | | |
| [Add domain core entities] | | | | |

> **Rule:** At Production+, every core entity in §4 capabilities and §7 events must have a vocabulary row or explicit `planned` promotion slice.

---

# 4. Domain Capability Model

> Permanent business capabilities (**EFR** — Enterprise Feature Requirements). Each row maps to Blueprint §4 in §13 — **not** to packages or PAS here.
> **Every capability requires battle-proven Source + Reasoning** ([doc-evidence-standard.md](doc-evidence-standard.md)). Assumptions (✗) forbidden at Production+.

| Capability | Business description (one line) | Maturity target | Source (✓) | Reasoning (Because → Therefore) | Review by |
| --- | --- | --- | --- | --- | --- |
| Capability A — Core | [what must always exist] | Enterprise | `[T0–T3]` ✓ | **Because** … **Therefore** … | Enterprise |
| Capability B — Advanced | [extended capability] | Production | | | Production |
| Capability C — [tier] | | MVP | `[T6 △ — upgrade before Production]` | | MVP |

**Capability maturity tiers (per row — stages Blueprint delivery, not document maturity):**

| Tier | Meaning | Blueprint staging |
| --- | --- | --- |
| **Core** | Non-negotiable for domain to exist | First boxes / PAS |
| **Advanced** | Expected at Production ERP | Planned boxes after Core live |
| **AI Assisted** | Human-in-the-loop augmentation | Optional box — cite EFR |
| **Predictive** | Forecasting / anomaly on domain data | Optional — depends on §11 quality targets |
| **Autonomous** | Policy-bound automation with audit trail | Enterprise-only — ADR required |

> **Rule:** No EFR row without ✓ battle-proven Source at Production+. Capability **Maturity target** ≤ document **Maturity** field in header.

---

# 5. Domain Principles

> Principles that must survive every implementation. Each principle cites **why** it is non-negotiable.

| # | Principle | Source (✓) | Reasoning (Because → Therefore) |
| --- | --- | --- | --- |
| 1 | [PRINCIPLE 1 — e.g. auditability] | `[T0–T3]` ✓ | **Because** … **Therefore** … |
| 2 | [PRINCIPLE 2] | | |
| 3 | [PRINCIPLE 3] | | |
| 4 | [add — integrity, traceability, compliance, immutability] | | |

---

# 6. Enterprise Outcomes

> **Business outcomes** — what the enterprise **measures**. Different from §4 capabilities (what Afenda must **provide**) and §2 Success (platform capability gain).

## Outcome statements

| Outcome | Business description | Source (✓) | Reasoning |
| --- | --- | --- | --- |
| [Outcome 1 — e.g. 100% traceable financial truth] | [One line] | `[T3 regulation]` ✓ | **Because** … **Therefore** … |
| [Outcome 2 — e.g. faster close] | | | |
| [Outcome 3 — e.g. regulatory compliance] | | | |

**Examples by domain (replace):**

- **Accounting:** traceable financial truth · faster period close · regulatory compliance
- **HRM:** reduced turnover · improved retention · workforce compliance
- **CRM:** increased retention · increased conversion · customer lifetime value

## Success metrics (permanent KPI targets)

> Measurable targets — not implementation metrics. Blueprint and PAS NFR sections derive architectural targets from §11; KPIs here are **business permanent targets**.

| KPI | Target | Measurement context | Source (✓) | Review by |
| --- | --- | --- | --- | --- |
| [KPI 1 — e.g. Close period] | `< N days` | [When measured — e.g. month-end close] | `[T3/T6 △]` | Enterprise |
| [KPI 2 — e.g. Payroll accuracy] | `> 99.99%` | | | Production |
| [KPI 3] | | | | |

> **Rule:** KPIs without ✓ source remain △ until validated — they must not drive Production EFR alone.

---

# 7. Business Events

> **Event-driven domain vocabulary.** Events are business facts that occurred — not API names, queue topics, or PAS contracts.
> Blueprint integration points and PAS event surfaces derive from this list later.

| Event | Business meaning | Typical trigger | Related vocabulary (§3) | Source (✓) |
| --- | --- | --- | --- | --- |
| [Event 1] | [What happened in the business] | [Business condition] | [Term from §3] | `[T2/T3]` ✓ |
| [Event 2] | | | | |
| [Event 3] | | | | |

**Examples (replace):**

- **Accounting:** Invoice Issued · Payment Received · Journal Posted · Period Closed
- **HRM:** Employee Hired · Promotion · Termination · Leave Approved
- **CRM:** Lead Qualified · Opportunity Won · Customer Activated

> **Rule:** Do not name `@afenda/*` event types here. Map implementation event names in PAS §4 only.

---

# 8. Entity Lifecycles

> **Business state progression** for core entities — not workflow engines, status enums, or database states.
> PAS owns runtime state machines; this section owns **business lifecycle meaning**.

### [Entity 1 — from §3 Vocabulary]

```text
[State A] → [State B] → [State C] → [Terminal state]
```

| State | Business meaning | Entry condition (business) | Exit to |
| --- | --- | --- | --- |
| [State A] | | | [State B] |
| [State B] | | | |

**Examples (replace):**

- **Customer:** Prospect → Lead → Qualified → Customer → Inactive → Archived
- **Employee:** Candidate → Employee → On Leave → Separated → Archived

### [Entity 2]

[Repeat lifecycle block for second core entity if applicable.]

| Source (✓) | Reasoning |
| --- | --- |
| `[T2 vocabulary atom]` ✓ | **Because** … **Therefore** PAS state models must preserve these transitions … |

---

# 9. Domain Boundary

## This domain owns

> Permanent **business** responsibilities — not packages. Each row: Source + Reasoning.

| Responsibility | Source (✓) | Reasoning (Because → Therefore) |
| --- | --- | --- |
| [Responsibility 1] | `[T1/T3]` ✓ | **Because** … **Therefore** … |
| [Responsibility 2] | | |
| [Responsibility 3] | | |

## This domain never owns

> Reference **domains**, not `@afenda/*` packages.

| Exclusion | Owning domain / rationale | Source (✓) | Reasoning |
| --- | --- | --- | --- |
| [Exclusion 1] | [Domain name] | `[T1/T3]` ✓ | **Because** … **Therefore** … |
| [Exclusion 2] | | | |
| Capabilities not in §4 | — | Domain NS §4 | Boundary hygiene |

## Cross-domain dependencies

> **Business domains** this domain depends on or integrates with — not packages. Helps Blueprint discover integration points.

| Depends on (domain) | Dependency type | Business reason | Source (✓) |
| --- | --- | --- | --- |
| [Domain — e.g. Inventory] | Reads / writes / governs | [Why integration exists] | `[T1/T3]` ✓ |
| [Domain — e.g. Tax] | Compliance input | | |
| [Domain — e.g. Sales] | Event source (§7) | | |

| Provides to (domain) | What flows | Related §7 event |
| --- | --- | --- |
| [Domain] | [Business artifact or event] | [Event name] |

> **Rule:** Dependency rows name **domains** only. Package and API mapping belongs in Blueprint §5 consumers.

---

# 10. Enterprise Risks

> **Business risks** this domain must mitigate — justify architectural decisions in Blueprint §4 Reasoning and PAS §0 hard stops.

| Risk | Business impact | Mitigation principle (business) | Source (✓) | Blueprint/PAS handoff |
| --- | --- | --- | --- | --- |
| [Risk 1 — e.g. financial misstatement] | [Impact] | [Principle — links §5] | `[T3]` ✓ | Cite in D# · PAS §0 |
| [Risk 2 — e.g. fraud / duplicate posting] | | | | |
| [Risk 3 — e.g. compliance failure] | | | | |

**Examples (replace):**

- **Accounting:** misstatement · fraud · duplicate posting · compliance failure
- **HRM:** payroll errors · privacy breach · unauthorized access
- **CRM:** customer data leakage · revenue leakage

> **Rule:** Every **Core** capability (§4) should trace to at least one risk or outcome (§6).

---

# 11. Quality Attributes

> **Domain non-functional expectations** — business-facing NFRs Blueprint must architect toward. Not gate commands (PAS §13 owns those).

| Attribute | Domain expectation | Why it matters (link §10 risk or §6 outcome) | Target (business language) | Source (✓) |
| --- | --- | --- | --- | --- |
| Accuracy | [e.g. posting must balance] | [Risk / outcome] | [Target] | `[T3 ISO 25010]` ✓ |
| Auditability | | | | |
| Traceability | | | | |
| Compliance | | | | |
| Immutability | | | | |
| [Availability / Latency — if applicable] | | | | |

> **Handoff:** Blueprint §4 `Reasoning` may cite §11 attribute + §10 risk. PAS §11.5 ERP Readiness implements measurable gates.

---

# 12. Domain Evidence

> Master evidence layer for **all §1–§11 permanent claims**. Link — do not paste full ADR or standard text.

## 12.1 Evidence Register

> Register only **✓ battle-proven** sources for Production+ EFR. Mark **△** hypotheses with expiry date.

| ID | Source | Tier | Class | What it justifies | Link |
| --- | --- | --- | --- | --- | --- |
| E1 | [e.g. ADR-0026] | T0 | ✓ | Documentation hierarchy | [`ADR-0026`](../../docs/adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| E2 | [Platform NS §4 row] | T1 | ✓ | Domain exists at platform scope | [Platform NS](../../docs/NORTHSTAR/kernel-north-star.md) |
| E3 | [IFRS / MFRS section] | T3 | ✓ | Principle / outcome / risk EFR | [external or PAS-003] |
| E4 | [Enterprise knowledge atom] | T2 | ✓ | §3 Vocabulary term | [PAS-004 / atom id] |
| E5 | [Domain expert review] | T6 | △ | Interim — expiry `[YYYY-MM-DD]` | Owner · date |

## 12.2 Decision Reasoning Log

> Permanent decisions Blueprint/PAS must not re-debate without amending this document.

| Decision ID | Claim | Because | Source (E#) | Therefore | Review by |
| --- | --- | --- | --- | --- | --- |
| D1 | [e.g. Standards separate from posting runtime] | [one sentence] | E1, E3 | Blueprint may declare two boxes | Enterprise |
| D2 | [Links §10 risk to §4 capability split] | | | | Production |

## 12.3 Evidence lifecycle obligations

| Document maturity | Required evidence action |
| --- | --- |
| **Idea → MVP** | §1 Philosophy + §4 EFR rows have Source; △ marked; §12.1 started |
| **MVP → Production** | **All §4–§5, §9 EFR battle-proven (✓)** · §3 vocabulary core terms · §12.2 complete |
| **Production → Enterprise** | Full register · §7 events · §8 lifecycles · §16 EAC pass |
| **Any amendment** | Update Source class, Reasoning, `Last reviewed`, Decision log row |

---

# 13. Capability → Blueprint Traceability

> **Only allowed cross-link with Blueprint.** Map §4 capabilities to Blueprint box **names** — no PAS IDs, packages, or status.

| Capability (§4) | Maturity tier | Blueprint box (see Blueprint §4) |
| --- | --- | --- |
| Capability A — Core | Core | `[BOX NAME]` |
| Capability B — Advanced | Advanced | `[BOX NAME]` |
| Capability C | MVP | `[BOX NAME]` |

> **Do not add:** Package column · PAS column · Status · Slice counts — those live in [Blueprint §4 and §10](blueprint-template.md).

**When a capability needs a new box:** amend §4 → add §13 row → add Blueprint §4 row → satisfy Blueprint §7 → author PAS.

**Agent execution** (decision matrix, PAS creation gate, runtime chain): [Blueprint §7–§9](blueprint-template.md) · [Platform North Star §7–§9](../../docs/NORTHSTAR/kernel-north-star.md)

---

# 14. Domain Governance

## 14.1 Governance model

| Model | Definition |
| --- | --- |
| **Ownership** | [Domain spec owner — role or team] |
| **Change model** | Amend when business meaning changes — not when a slice ships |
| **Approval model** | [Who approves — must review Source + Reasoning deltas in §12] |
| **Acceptance model** | See §16 EAC |
| **Evidence standard** | [doc-evidence-standard.md](doc-evidence-standard.md) |
| **Last reviewed** | `[YYYY-MM-DD]` |

## 14.2 Domain authority model

| Level | Owns |
| --- | --- |
| **Domain North Star** | §1–§12 business architecture |
| **Architecture Blueprint** | Packages, layers, why separate, PAS inventory, consumers |
| **PAS** | Contracts, authority surfaces, slice catalog, gates |
| **Slice** | One implementation unit |
| **Code** | Implements the Slice |

No document may duplicate the row above or below it.

## 14.3 Decomposition chain

```text
Domain North Star §1–§12 (business architecture)

        ↓

Architecture Blueprint — packages, layers, PAS inventory

        ↓

PAS — contracts, surfaces, slice catalog

        ↓

Slice → Code
```

**Amendment rule:** Business meaning changes → this document first. Package boundaries change → Blueprint first ([doc-boundary-contract.md](doc-boundary-contract.md)).

## 14.4 Domain business invariants

> High-level business rules agents must respect — **not** gate commands or TypeScript contracts (PAS owns those).

- [INVARIANT 1 — business language; may cite §1 Philosophy]
- [INVARIANT 2 — may cite §10 risk]

Platform documentation gates: [Platform North Star §13](../../docs/NORTHSTAR/kernel-north-star.md). Package gates: target PAS §13 only.

---

# 15. Domain Evolution

**May evolve here:** new §4 capabilities · §6 outcome targets · §7 events · vocabulary (§3)

**Must not evolve here:** runtime rules (PAS) · slice order (PAS §10) · registry rows · PAS inventory (Blueprint §10)

**Long-term direction:**

- [DIRECTION 1 — business maturity, not package list]
- [DIRECTION 2 — e.g. Core → Advanced → AI Assisted capability tiers]

---

# 16. Enterprise Acceptance Criteria (EAC)

> **Business-document EAC** — proves §1–§12 complete and every **EFR** battle-proven. Package/PAS EAC → Blueprint §14 · PAS §11.

| Criterion | Gate | Traces to |
| --- | --- | --- |
| §1 Philosophy immutable and cited ✓ | Manual review — domain owner | §1 Source |
| §2 Identity complete (mission, definition, success) | Manual review | §2 |
| §3 Enterprise Vocabulary — core terms defined | Manual review + PAS-004 promotion plan | §3 |
| §4 EFR complete — every row ✓ battle-proven at Production+ | [doc-evidence-standard.md](doc-evidence-standard.md) audit | §4 |
| §5 Principles cited | Manual review | §5 |
| §6 Outcomes + KPIs declared | Manual review | §6 |
| §7 Business Events — core events listed | Manual review | §7 |
| §8 Entity Lifecycles — core entities | Manual review | §8 |
| §9 Boundaries + cross-domain dependencies | Manual review | §9 |
| §10 Risks — Core capabilities mitigated | Manual review | §10 |
| §11 Quality attributes declared | Manual review | §11 |
| §12 Evidence Register + Decision log complete | Manual review | §12.1–§12.2 |
| §13 maps every §4 capability to Blueprint box | Manual review + Blueprint exists | §4 → §13 |
| §1–§12 contain no `@afenda/*` or `PAS-[NNN]` | [doc-boundary-contract.md](doc-boundary-contract.md) | Hygiene |
| **Zero ✗ assumptions** in EFR rows at Production+ | Evidence class audit | §12 |
| Blueprint/PAS authorable without redefining domain | Manual review | Full §1–§12 |

---

# 17. Document Sync Obligations

| Change in this document | Then update |
| --- | --- |
| New §4 capability | §13 row · Blueprint §4 box |
| New §3 vocabulary term | PAS-004 atom promotion slice |
| New §7 event | Blueprint integration planning · PAS §4 event surface |
| Renamed capability | §13 + Blueprint box name (if business rename) |
| Boundary / dependency change (§9) | Blueprint §5 consumers · integration boxes |
| Risk or quality change (§10–§11) | Blueprint §4 Reasoning · PAS §0 |
| Business meaning stable; implementation only | Blueprint or PAS — **not** this document |

---

# 18. Required Reviews and References

## Before accepting this document

- [ ] §1–§12 complete; no `@afenda/*` or `PAS-[NNN]` in §1–§12
- [ ] §13 traces every §4 capability to a Blueprint box name
- [ ] No PAS inventory, build order, or slice counts in this file
- [ ] No duplicate of Blueprint `why separate`, layers, or consumers
- [ ] [doc-boundary-contract.md](doc-boundary-contract.md) checklist passes
- [ ] [doc-evidence-standard.md](doc-evidence-standard.md) — EFR cited ✓ · §12 register · **zero ✗ assumptions at Production+**
- [ ] §3 vocabulary ready for PAS-004 derivation

## Derived documents

**Produces:** Architecture Blueprint (after §4 capabilities exist)

**Never produces:** PAS · slices · contracts · code

## References (link only)

| Document | Role |
| --- | --- |
| Platform North Star | [`afenda-platform-north-star.md`](../../docs/NORTHSTAR/kernel-north-star.md) |
| Architecture Blueprint | [`afenda-architecture-blueprint.md`](../../docs/BLUEPRINT/kernel-blueprint.md) |
| Enterprise Knowledge (PAS-004) | [`PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md`](../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) |
| Boundary contract | [`doc-boundary-contract.md`](doc-boundary-contract.md) |
| Evidence standard | [`doc-evidence-standard.md`](doc-evidence-standard.md) |
| ADR Constitution | [`adr-constitution.md`](adr-constitution.md) |
| Blueprint template | [`blueprint-template.md`](blueprint-template.md) |
| PAS doc template | [`pas-doc-template.md`](pas-doc-template.md) |

---

# 19. Final Doctrine

**[DOMAIN] covenant:** [One paragraph synthesizing §1 Philosophy + §5 Principles — business identity and non-negotiable meaning.]

§1–§12 define **what this domain means in enterprise business architecture**.

§13 bridges to Blueprint — **names only**.

PAS defines **how to build**.

If business meaning changes, amend §1–§12 — then Blueprint.

If packages or PAS change, amend Blueprint or PAS — **not** §1–§12 unless business meaning changed.

> **May belong here:** §1–§12 business architecture with **Source + Reasoning** · §12 Evidence · §13 capability→box · §14–§18 governance.

> **Belongs in Blueprint:** packages, layers, why separate, status, consumers, PAS inventory ([doc-boundary-contract.md](doc-boundary-contract.md)).

> **Belongs in PAS:** contracts, surfaces, slice catalog, gates, runtime event type names.

> **Belongs in PAS-004:** promoted vocabulary atoms derived from §3.
