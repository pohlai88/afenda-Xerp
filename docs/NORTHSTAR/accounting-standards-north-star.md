# Accounting Standards Authority North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Accounting Standards Authority — external authority consumption, interpretation, and deterministic validation |
| **Domain type** | Foundation external-authority substrate *(supports Accounting & Finance LoB — not posting runtime)* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Constitutional laws** | [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) — LAW 10 (evidence traceability) |
| **Derived document** | [Accounting Standards Blueprint](../BLUEPRINT/accounting-standards-blueprint.md) · [Platform Blueprint rollup](../architecture/afenda-architecture-blueprint.md) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) |
| **Maturity** | Production Candidate — gap analysis enhanced 2026-06-29 |
| **NS profile** | Streamlined (§1–§15 + condensed §16–§19) — peer review 9.8/10 baseline; ERP-parity enhancements in this revision |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** (Enterprise Accepted blocked on §15 + §16 EAC) |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-29 |
| **Package / PAS inventory** | See [Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) — not declared here |
| **Next document** | [Accounting Standards Blueprint](../BLUEPRINT/accounting-standards-blueprint.md) |

> **One sentence:** Afenda consumes external accounting authorities through a governed interpretation layer — citing publisher, edition, paragraph, and effective date — and returns deterministic validation results before any posting, consolidation, or disclosure logic executes.

> **Critical distinction:** Afenda does **not** own IFRS, MFRS, US GAAP, or any external standard. External bodies are the authorities. This domain owns the **Authority Consumption Layer** — how Afenda records, routes, validates against, and cites external evidence without reproducing copyrighted text or claiming standard-setting power.

---

# 0. Agent Quick Path

**Read order:** [Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → Platform NS → this document §1–§12 → [Accounting Standards Blueprint](../BLUEPRINT/accounting-standards-blueprint.md) → Accounting Standards PAS → Slice → Code.

**This document answers:** why external accounting authority must be consumed separately from runtime; how jurisdiction, effective dates, and precedence resolve; what capabilities the consumption layer permanently provides.

**This document never answers:** journal posting rules, ledger schemas, gate commands, or registry file paths.

**Chain rule:** Platform North Star → Accounting Standards Authority North Star → Accounting Standards Blueprint → PAS → Slice → Code

**Hard stops (business scope):**

- Afenda **consumes** external authority — it does **not** **be** the authority.
- Standards consumption answers *which authority applies and what validation result to return* — never *what journal entry to post*.
- Do not embed IFRS/MFRS treatment logic in Platform Kernel wire vocabulary.
- Generative AI judgment is not a substitute for deterministic, cited validation rules.

---

# 1. Domain Philosophy

Every enterprise that reports under IFRS, MFRS, SFRS, US GAAP, or local policy must reconcile **three permanent needs**:

1. **External authority** — IFRS Foundation, FASB, MASB, and other bodies that **set** standards; Afenda does not replace them.
2. **Authority consumption** — versioned evidence, routing, effective-date resolution, and deterministic validation that **cites** external authority without owning it.
3. **Operational execution** — posting, consolidation, tax, and disclosure workflows that mutate financial state.

When external authority and consumption collapse into posting code, standards become stale comments, audit trails lose paragraph-level citations, and agents embed unversioned "IFRS" references that cannot be replayed for prior periods.

When consumption is mistaken for authority, teams believe Afenda **owns** IFRS — it does not. Afenda owns the **interpretation and consumption layer**: publisher → publication → edition → standard → paragraph → rule → validation result.

The Accounting Standards Authority domain exists because **external authority consumption must be constitutional** — separate from ledger execution and honest about who sets the rules.

**Source:** Platform NS §2 · ADR-0026 · Blueprint accounting decomposition · Accounting Standards PAS §1 (T5)

---

# 2. Domain Identity

| Field | Definition |
| --- | --- |
| **Mission** | Govern how Afenda consumes external accounting authorities — recording cited evidence, resolving jurisdiction and effective dates, applying precedence when authorities conflict, and returning deterministic validation before financial state mutates. |
| **Success definition** | No production workflow relies on uncited or unversioned standard references; every validation traces to external authority metadata; historical transactions replay against the edition effective on transaction date — not today's edition. |
| **Scope** | External authority hierarchy · parallel accounting books · reporting context profiles · jurisdiction resolution · authority instruments · source-type taxonomy · authority version evidence · effective-date resolution · scope gates · conflict precedence · process routing · cross-representation routing · deterministic validation · explanation metadata · evidence snapshots · authority supersession awareness. |
| **Out of scope** | Owning or amending external standards · journal creation · ledger mutation · chart-of-accounts mapping execution · consolidation calculation · tax filing · transfer-pricing rate policy · XBRL instance generation · UI rendering · AI-only accounting judgment · statutory filing execution · final professional sign-off. |

---

# 3. Enterprise Vocabulary

Business meanings — not registry implementation types.

| Term | Enterprise meaning |
| --- | --- |
| **External authority body** | The organization that sets standards (IFRS Foundation, FASB, MASB, …) — not Afenda. |
| **Authority consumption layer** | Afenda's governed layer that records, routes, validates against, and cites external authority — without claiming ownership. |
| **Accounting standard family** | A recognized reporting framework class (IFRS, MFRS, SFRS, US GAAP) — not a jurisdiction. |
| **Jurisdiction** | Legal or reporting geography (Malaysia, Singapore, EU, US, …) determining which frameworks and policies apply concurrently. |
| **Authority source type** | Class of rule origin — external standard, national standard, regulatory rule, company policy, project policy (§3.3). |
| **Accounting standard** | A named standard within a publication (e.g. IFRS 10 Consolidated Financial Statements). |
| **Authority paragraph** | The finest citable unit referenced by a validation rule (e.g. IFRS 10 paragraph B86) — reference only, not reproduced text. |
| **Authority version** | Edition + effective dates + retrieval metadata for a publication — not the word "IFRS" alone. |
| **Effective-date resolution** | Selecting the authority edition binding on **transaction date** — not current date. |
| **Standard-to-process routing** | Mapping business context to relevant authorities — routing, not treatment. |
| **Conflict precedence** | Ordered rules when statutory law, mandatory standard, regulator guidance, and company policy disagree (§5.2). |
| **Standards-backed validation** | Deterministic pass/info/warning/block citing external evidence — not generative advice. |
| **Evidence snapshot** | Durable record of publisher, publication, edition, paragraph refs, and license status at validation time. |
| **Accounting book** | Named parallel financial representation (group IFRS, local statutory, tax, management) — routing metadata, not the general ledger engine. |
| **Reporting purpose** | Why validation runs: statutory, group consolidation, tax, management, regulatory disclosure (§3.4). |
| **Representation level** | How deeply a book mirrors source activity: balance, journal, subledger, adjustment-only — metadata for consumers, not posting depth. |
| **Accounting principle assignment** | Which external framework binds an accounting book for an entity — parallel to SAP accounting principles on ledgers (T3 △). |
| **Reporting context profile** | Resolved bundle: entity + jurisdiction + book + reporting purpose + standard families (§3.5). |
| **Authority instrument** | Kind of cited authority: standard, interpretation, amendment, implementation guidance, exposure draft (§3.6). |
| **Binding strength** | Mandatory, optional, illustrative, superseded — feeds precedence before company policy (§3.6). |
| **Scope gate** | Deterministic pre-check whether a standard applies to a fact pattern — before rule evaluation. |
| **Judgment escalation** | Validation outcome requiring qualified human sign-off — not AI inference or silent pass. |
| **Cross-representation routing** | Maps one process context to multiple applicable authorities across books — routing only, not account mapping. |
| **Authority supersession** | External edition or instrument replaced by a newer binding version — consumers must re-validate open work. |

## 3.1 External authority hierarchy

External evidence chains through a fixed hierarchy — every validation rule must cite a position in this chain:

```text
Authority Body          (IFRS Foundation, FASB, MASB, …)
        │
        ▼
Publication             (Bound volume · compendium · regulatory gazette · digital disclosure taxonomy)
        │
        ▼
Edition                 (2026 Required IFRS · 2025 MFRS · IFRS taxonomy 2024-03-16, …)
        │
        ▼
Authority instrument    (Standard · interpretation · amendment · implementation guidance)
        │
        ▼
Standard / instrument ref (IFRS 10 · IFRIC 12 · …)
        │
        ▼
Paragraph / element ref   (B86 · taxonomy element — reference only)
        │
        ▼
Validation Rule         (Deterministic Afenda rule citing the chain above)
```

**Example:**

```text
IFRS Foundation → 2026 Bound Volume → IFRS 10 → Paragraph B86 → rule:holding_control_assessment
```

**Rule:** Afenda records references and metadata — never reproduces copyrighted standard text in registries or validation output.

**Rule:** Afenda records references and metadata — never reproduces copyrighted standard text in registries or validation output. **Digital disclosure taxonomies** (e.g. IFRS/US-GAAP XBRL) are **publications** in this hierarchy; XBRL **instance generation** belongs to Reporting runtime.

## 3.2 Jurisdiction and parallel books layer

Enterprises operate under **concurrent** reporting contexts. Jurisdiction sits **above** standard family selection; **accounting books** express parallel representations enterprises expect from SAP, Oracle, and NetSuite multi-book patterns (T3 △):

```text
Legal Entity
        │
        ▼
Jurisdiction            (Malaysia · Singapore · EU · US · …)
        │
        ├─► Accounting book (group IFRS)     + reporting purpose: group consolidation
        ├─► Accounting book (local statutory)+ reporting purpose: statutory
        ├─► Accounting book (tax)            + reporting purpose: tax
        ├─► Accounting book (management)     + reporting purpose: management
        └─► Regulatory overlay               + reporting purpose: regulatory disclosure
        │
        ▼
Standard family per book (IFRS · MFRS · local GAAP · tax basis · …)
```

The same group may apply IFRS for consolidation, MFRS for statutory entities, and local tax rules simultaneously. Routing must accept **reporting context profile** — not a single global family flag.

## 3.3 Authority source types

Do not collapse all rule origins into "standard." Five distinct source types carry different precedence (§5.2):

| Source type | Example | Authority body |
| --- | --- | --- |
| **External standard** | IFRS 10 | IFRS Foundation |
| **National standard** | MFRS | MASB |
| **Regulatory rule** | Bursa disclosure requirement | Regulator |
| **Company policy** | Group accounting manual | Corporate board / CFO office |
| **Project policy** | Implementation guidance for one rollout | Project steering (non-binding unless ratified) |

**Rule:** Company and project policies are **recorded and cited** — they are not external standards and must not be labeled as IFRS/MFRS.

**Source:** Accounting Standards PAS §1 · §4 · IFRS Foundation (T3)

## 3.4 Reporting purpose taxonomy

| Reporting purpose | Typical accounting book | Example framework |
| --- | --- | --- |
| **Statutory** | Local statutory book | MFRS · SFRS · local GAAP |
| **Group consolidation** | Group reporting book | IFRS · US GAAP |
| **Tax** | Tax book | Tax basis · deferred tax overlay |
| **Management** | Management book | Group policy · management adjustments |
| **Regulatory disclosure** | Disclosure overlay | Exchange · central bank rules |

**Rule:** Purpose drives **which authorities** apply — not how journals post.

## 3.5 Reporting context profile resolution

```text
Entity + jurisdiction + accounting book + reporting purpose + transaction date
        │
        ▼
Reporting context profile (resolved metadata bundle)
        │
        ▼
Applicable standard families + editions + active rule packs
```

## 3.6 Authority instruments and binding strength

| Instrument | Example | Typical binding strength |
| --- | --- | --- |
| **Standard** | IFRS 10 | Mandatory when legally required |
| **Interpretation** | IFRIC 12 | Mandatory when referenced by framework |
| **Amendment** | Annual improvements | Mandatory from effective date |
| **Implementation guidance** | Illustrative examples | Illustrative — not sole block basis |
| **Exposure draft** | Pending standard | Non-binding — routing only |

**Binding strength** values: mandatory · optional · illustrative · superseded. Feeds §5.2 precedence below statutory law.

## 3.7 Sector and industry framework scope

Standard families may include sector frameworks without implying full implementation in early slices:

| Family scope | Example | Notes |
| --- | --- | --- |
| **General IFRS/US GAAP** | IFRS 10 · IFRS 16 | Initial PAS focus |
| **Insurance** | IFRS 17 | Family slot — rules planned |
| **Public sector** | IPSAS | Family slot — jurisdiction-driven |
| **SME** | IFRS for SMEs | Family slot — entity-size routing |

**Rule:** Sector families use the same consumption hierarchy — no abbreviated citation chain.

---

# 4. Capability Model

| Capability | Maturity | EFR summary | Source |
| --- | --- | --- | --- |
| **External authority hierarchy** | Production | Body → publication → edition → standard → paragraph → rule | §3.1 · peer review D1 |
| **Jurisdiction resolution** | Production | Concurrent frameworks per entity and reporting purpose | §3.2 · peer review D2 |
| **Authority source type taxonomy** | Production | Five source types distinguished — not all called "standard" | §3.3 · peer review D3 |
| **Standard family registry** | Production | Framework classes enumerated (IFRS, MFRS, SFRS, US GAAP, …) | Accounting Standards PAS §4.1 |
| **Standard catalog** | Production | Standard codes, titles, scopes, lifecycle | PAS §4.2 |
| **Authority version registry** | Enterprise | Edition, effective dates, publisher, retrieval, license status | PAS §4.3 · §12.1 metadata |
| **Effective-date resolution** | Enterprise | Transaction date → applicable edition → rule → result | §8.4 · peer review D4 |
| **Conflict precedence engine** | Advanced | Ordered resolution when authorities disagree | §5.2 · peer review D5 |
| **Process routing registry** | Production | Business context → relevant authorities — not treatment | PAS §4.4 |
| **Deterministic validation rules** | Production | Testable, severity-graded, AI-independent | PAS §4.6 |
| **Validation result contract** | Production | Pass/info/warning/block with full citation chain | PAS §4.7 |
| **Evidence snapshots for audit** | Enterprise | Historical replay with paragraph-level metadata | §12.1 |
| **Group relationship routing** | Production | Holding/subsidiary/JV/associate → IFRS 10/11/IAS 28 refs | PAS §4.4 |
| **Parallel accounting book routing** | Advanced | Entity + book + purpose → framework assignment | §3.2 · §3.4 · T3 △ |
| **Reporting context profile** | Enterprise | Resolved bundle for edition and rule selection | §3.5 |
| **Authority instrument taxonomy** | Production | Standard · interpretation · amendment · guidance · exposure draft | §3.6 |
| **Scope gate assessment** | Production | Standard applicability pre-check before rules | §3 vocabulary |
| **Cross-representation routing** | Advanced | One context → multiple book-specific authorities | §3 vocabulary · T3 △ |
| **Versioned rule packs** | Production | Per-standard deterministic rule bundles (IFRS pack first) | PAS §4.8 |
| **Consumer validation input contract** | Production | Wire-safe facts boundary for downstream packages | PAS §4.5 |
| **Explanation and disclosure metadata** | Production | UI · AI · audit summaries with boundary statements | PAS §4.10 |
| **Authority supersession awareness** | Enterprise | Edition/amendment ingestion · consumer re-validation signal | §7 · §8.7 |
| **Judgment escalation outcomes** | Production | Escalate-to-accountant — not block or silent pass | P12 · §3 vocabulary |

**Capability maturity key:** Idea · MVP · Production · Enterprise

**Enterprise Accepted blockers:** Effective-date resolution implemented · conflict precedence operational · reporting context profile in routing · citation metadata complete on all Production+ rules · explanation registry operational · one consumer workflow proof · authority supersession path defined.

---

# 5. Domain Principles

| # | Principle | Because | Therefore |
| --- | --- | --- | --- |
| P1 | **External authority is not Afenda** | IFRS Foundation sets IFRS — Afenda cites it | Consumption layer never claims standard-setting power |
| P2 | **Standards separate from posting** | Collapsed modules hide version drift | Validation returns results; consumers decide persistence |
| P3 | **Version is evidence** | "IFRS" without edition is not auditable | Every rule cites full hierarchy through paragraph ref |
| P4 | **Routing is not treatment** | Pathway hints are not journal entries | Routing informs; execution stays downstream |
| P5 | **Determinism over generation** | AI cannot satisfy audit replay | Rules are testable with fixed inputs/outputs |
| P6 | **Transaction date governs edition** | 2023 facts require 2023 edition — not 2026 | Effective-date resolution is mandatory at Enterprise |
| P7 | **Kernel consumes, never defines standards** | IFRS types in kernel create permanent coupling | Branded IDs from Platform Kernel only |
| P8 | **Honest maturity** | External authority model incomplete at MVP | Production Candidate until §15 exit criteria met |
| P9 | **Jurisdiction is concurrent** | One entity may report under multiple frameworks | Routing accepts jurisdiction + reporting purpose |
| P10 | **Policies ≠ standards** | Company manual is not IFRS | Source type taxonomy enforced in citations |
| P11 | **Severity is policy-gated** | Warning ≠ block without consumer policy | Consumers promote severity; rules default conservative |
| P12 | **Judgment zones escalate honestly** | Some outcomes require professional judgment | Return escalation — not AI inference or silent pass |

## 5.1 Domain invariants

| # | Invariant |
| --- | --- |
| I1 | Afenda never claims to own, amend, or publish external accounting standards. |
| I2 | Every blocking validation cites authority body, publication, edition, standard, and paragraph reference. |
| I3 | Historical validation replays against edition effective on transaction date — not current edition. |
| I4 | Routing suggests relevant authorities — never posts journals or decides final treatment. |
| I5 | Generative AI does not produce blocking validation outcomes without deterministic rule backing. |
| I6 | Copyrighted standard text is referenced — not reproduced in registries or outputs. |
| I7 | Cross-representation routing cites authorities per book — never executes account mapping. |
| I8 | Superseded authority editions trigger consumer re-validation — not silent continuation on stale rules. |

## 5.2 Conflict precedence model

When authorities conflict, apply this order unless jurisdiction-specific law mandates otherwise:

| Precedence | Source type | Example |
| ---: | --- | --- |
| 1 | **Statutory law** | Companies Act, tax law |
| 2 | **Mandatory reporting standard** | IFRS · MFRS · US GAAP (when legally required) |
| 3 | **Regulator guidance** | Stock exchange · central bank · securities commission |
| 4 | **Corporate accounting policy** | Group accounting manual (must not contradict 1–3) |
| 5 | **Advisory guidance** | Non-binding interpretation · project guidance |

**Rule:** When precedence cannot be resolved automatically, validation returns **block** or **warning** with citation to conflicting sources — never silent pick of lowest precedence.

**Source:** Peer review 2026-06-29 · external authority governance practice (T3 △ — formalize per jurisdiction in PAS slices)

---

# 6. Enterprise Outcomes and KPIs

| Outcome | Target | Measures |
| --- | --- | --- |
| **External citation completeness** | 100% blocking rules cite full hierarchy through paragraph | Citation metadata audit |
| **Historical replay accuracy** | Validations reproducible for any prior transaction date | Effective-date resolution tests |
| **Zero embedded IFRS in posting code** | Consumption layer only | Prohibited-surface scans |
| **Deterministic validation** | Zero generative-AI-only blocking gates | Rule implementation review |
| **Parallel book correctness** | Each book resolves correct framework | Book + purpose routing audit |
| **Scope gate accuracy** | No block when standard out of scope | Scope gate test suite |
| **Supersession hygiene** | Open drafts re-validated after edition change | Supersession event tests |
| **Explanation completeness** | Production+ rules have explanation keys | Explanation registry audit |
| **Consumer proof** | One workflow proves end-to-end consumption | Enterprise Accepted exit criterion |

---

# 7. Business Events

Standards vocabulary events — not runtime dispatches.

| Event (business vocabulary) | Meaning |
| --- | --- |
| **Authority edition anchored** | Publisher/publication/edition entered with effective dates and license status |
| **Jurisdiction context resolved** | Entity reporting purpose mapped to concurrent frameworks |
| **Effective edition resolved** | Transaction date bound to applicable authority edition |
| **Process routed to authority** | Business context mapped to relevant standard codes — not treatment |
| **Precedence conflict detected** | Two sources disagree — precedence or escalation applied |
| **Validation requested** | Consumer submitted wire-safe facts for standards-backed checking |
| **Validation blocked** | Blocking rule failed with full external citation chain |
| **Evidence snapshot recorded** | Citation metadata durably captured for audit replay |
| **Authority edition superseded** | External body published replacement edition — consumers notified |
| **Authority amendment ingested** | Amendment metadata recorded with effective dates |
| **Scope excluded** | Standard determined not applicable — validation skipped honestly |
| **Judgment escalation requested** | Outcome requires qualified accountant sign-off |
| **Reporting profile resolved** | Entity + book + purpose bundle established for validation |

---

# 8. Entity Lifecycles

## 8.1 External standard (as consumed)

```text
Pending review → Current → Amended / Future effective → Superseded
```

## 8.2 Authority edition

```text
Published → Effective → Amended → Superseded → Historical reference only
```

## 8.3 Validation rule

```text
Proposed → Accepted (full citation chain) → Active → Amended → Retired
```

## 8.4 Effective-date resolution (business flow)

```text
Transaction date + reporting context profile (§3.5)
        │
        ▼
Applicable authority edition (not "current" edition)
        │
        ├─► Annual vs interim application period metadata
        ├─► First-time adoption / transition context (routing only)
        └─► Early adoption flag when optional standard adopted early
        │
        ▼
Active validation rules for that edition + rule pack version
        │
        ▼
Scope gate (if applicable) → Deterministic result + evidence snapshot
```

**Example:** A 2023-08-15 transaction in a Malaysian group entity resolves to the IFRS/MFRS editions **effective on that date** — not the 2026 bound volume retrieved today.

## 8.5 Standards-backed validation result

```text
Requested → Profile resolved → Edition resolved → Scope gated → Evaluated
        → Pass / Info / Warning / Block / Judgment escalation → Snapshotted (audit)
```

## 8.6 Reporting context profile

```text
Entity identified → Jurisdiction resolved → Book + purpose selected
        → Framework families assigned → Profile active → Profile amended / retired
```

## 8.7 Authority edition supersession

```text
Edition effective → Amendment published → Supersession announced
        → Consumers notified → Open validations re-run → Historical snapshots preserved
```

## 8.8 First-time adoption context (routing metadata only)

```text
Adoption election recorded → Transition edition bundle selected → Routing rules active
        → Transition complete → Standard ongoing edition resolution (§8.4)
```

**Rule:** Transition **routing** lives here; transition **journal logic** lives in Accounting runtime.

---

# 9. Boundary and Dependencies

## 9.1 This domain owns (business)

- External authority consumption model (§3.1–§3.7)
- Parallel accounting book and reporting purpose routing metadata
- Reporting context profile resolution
- Jurisdiction and concurrent-framework resolution
- Authority instrument and binding-strength taxonomy
- Effective-date resolution (including transition routing metadata)
- Scope gates and cross-representation routing
- Conflict precedence and judgment escalation outcomes
- Deterministic validation rules, results, explanations, and evidence snapshots
- Authority supersession awareness and consumer notification contract
- Honest distinction: consumption layer vs external authority bodies

## 9.2 This domain never owns (business)

- **External standard-setting** (IFRS Foundation, FASB, MASB, …)
- Journal posting and ledger mutation (Accounting runtime)
- Chart-of-accounts mapping execution across books (Accounting runtime)
- Consolidation calculations (Consolidation domain)
- Intercompany eliminations (Intercompany domain)
- Tax computation and statutory filing (Tax domain)
- Financial statement generation and XBRL instance filing (Reporting domain)
- Enterprise identity vocabulary (Platform Kernel — consumes only)
- Contested term meaning beyond citations (Enterprise Knowledge)
- UI rendering without rule/atom citations (Presentation domain)
- Final professional or legal sign-off on judgment zones

## 9.3 Cross-domain dependencies (business domains only)

| Depends on | Required for |
| --- | --- |
| **External authority bodies** | T3 evidence — IFRS Foundation, FASB, MASB, regulators |
| **Platform Kernel** | Branded IDs and relationship vocabulary at validation inputs |
| **Platform Architecture Authority** | Package registration and layer discipline |
| **Enterprise Knowledge** | Accepted meaning for accounting terms — orthogonal to standard citations |
| **Accounting & Finance runtimes** | Consumers of validation — not authorities |

| Provides to (domain) | What flows |
| --- | --- |
| **Accounting runtime** | Standards-backed validation before posting |
| **Consolidation / Intercompany / Tax / Finance / Reporting** | Routing, precedence, and citation evidence |
| **ERP surfaces and assistants** | Explanation keys · boundary statements · citation chain |

## 9.4 Four orthogonal platform domains

Accounting Standards Authority is **External Authority Consumption** — one of four non-overlapping constitutional domains:

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
              (Accounting Standards Authority · future Tax NS · …)
```

| Domain | Question |
| --- | --- |
| **Kernel** | *What does the platform say?* (wire shape) |
| **Architecture Authority** | *What is allowed?* (structure) |
| **Enterprise Knowledge** | *How does truth become accepted?* (meaning) |
| **Accounting Standards Authority** | *Which external accounting authority applies?* (citation) |

**Rule:** Shape ≠ meaning ≠ structure ≠ external citation.

## 9.5 Reusable external-authority pattern

This domain establishes a pattern extensible beyond accounting:

```text
External Authority (IFRS Foundation, tax bureau, ISO, …)
        │
        ▼
Authority North Star (this document · future Tax NS · …)
        │
        ▼
Blueprint box
        │
        ▼
Authority PAS
        │
        ▼
Consumer runtime
```

Future domains (tax, payroll, ESG, ISO, banking, healthcare) should reuse consumption-layer discipline — not embed external rules in runtime code.

---

# 10. Enterprise Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Afenda mistaken for authority** | Regulatory challenge; false compliance claims | P1 · I1 · Philosophy §1 |
| **Uncited "IFRS"** | Audit failure | Full hierarchy citations · §12.1 metadata |
| **Current-edition bias** | Historical misstatement | Effective-date resolution · P6 |
| **Standards in posting code** | Version drift | Separate authority box |
| **AI-only judgment** | Non-deterministic gates | P5 · I5 |
| **Routing as treatment** | Wrong journals | P4 · I4 |
| **Jurisdiction oversimplification** | Wrong framework for entity | §3.2 · P9 |
| **Policy labeled as standard** | False IFRS claims | §3.3 · P10 |
| **Unresolved precedence conflict** | Silent wrong treatment | §5.2 block/warning escalation |
| **Copyright reproduction** | Licensing violation | I6 · reference-only paragraphs |
| **Parallel book mis-routing** | Wrong framework per book | §3.2 · §3.4 · book routing |
| **Supersession drift** | Stale rules on open transactions | I8 · §8.7 |
| **Scope false positive** | Blocking when standard not applicable | Scope gates |
| **Judgment zone collapse** | AI or automation replaces accountant | P12 · escalation outcomes |
| **Cross-book mapping in consumption** | Treatment logic in wrong layer | I7 · Accounting runtime owns mapping |

---

# 11. Quality Attributes

| Attribute | Expectation |
| --- | --- |
| **External honesty** | Afenda cited as consumer — never as standard-setter |
| **Auditability** | Block/warning cites body → edition → standard → paragraph |
| **Temporal correctness** | Transaction-date edition resolution |
| **Determinism** | Same inputs + date + jurisdiction → same result |
| **Jurisdiction concurrency** | Multiple frameworks per entity supported |
| **Precedence clarity** | Conflicts escalated — not silently resolved |
| **Separation** | No runtime dependency on posting packages |
| **License hygiene** | Reference metadata includes license status |
| **Book concurrency** | Multiple books per entity without single-family assumption |
| **Supersession signaling** | Consumers notified when editions change |
| **Judgment honesty** | Escalation outcomes explicit in results |
| **AI grounding** | Explanations cite registry evidence + boundary statements |

---

# 12. Domain Evidence

## 12.1 Citation metadata model

Every Production+ validation rule and evidence snapshot must record this chain — auditable without reproducing copyrighted text:

| Field | Example | Required at |
| --- | --- | --- |
| **Publisher** | IFRS Foundation | Production+ |
| **Publication** | Required IFRS Accounting Standards | Production+ |
| **Edition** | 2026 bound volume | Production+ |
| **Standard** | IFRS 10 | Production+ |
| **Paragraph** | B86 (reference only) | Production+ when rule is paragraph-specific |
| **Effective from** | 2026-01-01 | Enterprise |
| **Effective until** | open or supersession date | Enterprise |
| **Retrieved at** | 2026-06-29 | Production+ |
| **Source URL** | ifrs.org issued-standards URL | Production+ |
| **License status** | Referenced · Licensed · Internal | Production+ |
| **Source type** | External standard · National · Regulatory · Company · Project | Production+ |
| **Jurisdiction** | MY · SG · EU · Global group | Production+ when jurisdiction-specific |
| **Accounting book** | Group IFRS · Local statutory | Production+ when book-specific |
| **Reporting purpose** | Statutory · Group · Tax | Production+ |
| **Authority instrument** | Standard · Interpretation | Production+ when not primary standard |
| **Binding strength** | Mandatory · Illustrative | Production+ |

## 12.2 Decision Reasoning Log

| Decision ID | Claim | Because | Source (E#) | Therefore |
| --- | --- | --- | --- | --- |
| D1 | External authority ≠ Afenda | IFRS Foundation sets standards | E3 | Consumption never claims standard-setting |
| D2 | Standards separate from posting | Version drift in posting modules | E2 | Blueprint declares separate box |
| D3 | Kernel consumes, never defines IFRS | Permanent coupling if types in Kernel | E4 | Branded IDs only at boundary |
| D4 | Parallel books are routing metadata | SAP/Oracle/NetSuite multi-book is enterprise norm | E11–E13 △ | Book + purpose in profile — not ledger engine |
| D5 | Interpretation layer in hierarchy | IFRIC/SIC are binding citation targets | E3 · §3.6 | Instrument type on citation chain |
| D6 | Citation ≠ accepted term meaning | Same word may have Knowledge atom | E4 · [Enterprise Knowledge NS](../NORTHSTAR/enterprise-knowledge-north-star.md) | §14.5 matrix splits ownership |

## 12.3 Evidence Register

| ID | Claim | Source class | Tier | Reference |
| --- | --- | --- | --- | --- |
| E1 | Platform requires versioned financial-standard consumption | ✓ | T1 | [Platform NS](../architecture/afenda-platform-north-star.md) §2 |
| E2 | Accounting domain decomposed — standards upstream of runtime | ✓ | T0 | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) |
| E3 | IFRS Foundation as external authority (not Afenda) | ✓ | T3 | IFRS Foundation · Required IFRS 2026 · PAS §4.3 anchor |
| E4 | Consumption layer boundary | ✓ | T5 | Accounting Standards PAS §1–§2 |
| E5 | Group relationship routing | ✓ | T5 | Accounting Standards PAS §4.4 |
| E6 | Blueprint standards box live | ✓ | T1 | Architecture Blueprint · Accounting standards authority |
| E7 | External authority hierarchy formalized | ✓ | T6 | Gap analysis 2026-06-29 · §3.1 |
| E8 | Jurisdiction + parallel book model | △ | T6 | §3.2 · §3.4 — implement in PAS B4+ / B13+ |
| E9 | Conflict precedence model | △ | T6 | §5.2 — implement in PAS validation engine |
| E10 | Effective-date + profile resolution | △ | T6 | §8.4 · §8.6 — implement in PAS B3+ |
| E11 | SAP accounting principles on ledgers | ✓ | T3 | SAP KB 3530183 · S/4HANA ledger scoping |
| E12 | Oracle primary/secondary ledger parallel accounting | ✓ | T3 | Oracle Fusion — secondary ledgers · conversion levels |
| E13 | NetSuite multi-book accounting | ✓ | T3 | NetSuite Multi-Book · accounting books per standard |
| E14 | IFRS taxonomy as publication type | △ | T3 | IFRS XBRL taxonomy · py-xbrl reference pattern |

**Provenance:** Production Candidate — gap-analysis enhanced 2026-06-29. Enterprise Accepted requires §15 + §16 EAC — implementation closes E8–E10 △.

## 12.4 Evidence lifecycle obligations

| Document maturity | Required evidence action |
| --- | --- |
| **Idea → MVP** | §1 Philosophy + core §4 rows have Source; △ marked |
| **MVP → Production** | §3 core vocabulary · §4 Production rows ✓ or △ with slice |
| **Production → Enterprise** | E8–E10 closed · §15 exit criteria · §16 EAC pass |
| **Any amendment** | Update `Last reviewed` · Decision log · sync Blueprint §4.2 |

---

# 13. Blueprint Mapping

| §4 Capability | Blueprint box |
| --- | --- |
| External authority hierarchy | **Accounting standards authority** |
| Jurisdiction resolution | **Accounting standards authority** |
| Authority source type taxonomy | **Accounting standards authority** |
| Standard family registry | **Accounting standards authority** |
| Standard catalog | **Accounting standards authority** |
| Authority version registry | **Accounting standards authority** |
| Effective-date resolution | **Accounting standards authority** |
| Conflict precedence engine | **Accounting standards authority** |
| Process routing registry | **Accounting standards authority** |
| Deterministic validation rules | **Accounting standards authority** |
| Validation result contract | **Accounting standards authority** |
| Evidence snapshots for audit | **Accounting standards authority** |
| Group relationship routing | **Accounting standards authority** |
| Parallel accounting book routing | **Accounting standards authority** |
| Reporting context profile | **Accounting standards authority** |
| Authority instrument taxonomy | **Accounting standards authority** |
| Scope gate assessment | **Accounting standards authority** |
| Cross-representation routing | **Accounting standards authority** |
| Versioned rule packs | **Accounting standards authority** |
| Consumer validation input contract | **Accounting standards authority** |
| Explanation and disclosure metadata | **Accounting standards authority** |
| Authority supersession awareness | **Accounting standards authority** |
| Judgment escalation outcomes | **Accounting standards authority** |

---

# 14. Governance

| Question | Authority |
| --- | --- |
| Change consumption-layer business meaning | This North Star + ADR |
| Add external authority body or edition | Accounting Standards PAS slice + §12.1 metadata |
| Add jurisdiction routing rule | PAS routing registry + jurisdiction tests |
| Add validation rule | PAS §4 + full citation chain |
| Resolve precedence conflict policy | This NS §5.2 + jurisdiction ADR if needed |
| Promote to Enterprise Accepted | §15 exit criteria + consumer proof |

## 14.5 Standards governance decision matrix

| Question / change | Authority owner |
| --- | --- |
| New **external standard** citation | Accounting Standards PAS + §12.1 metadata |
| New **jurisdiction** reporting profile | This North Star §3.2 + PAS routing |
| New **company policy** rule | Source type = Company policy · not labeled IFRS |
| **Transaction-date edition** logic | Effective-date resolution capability |
| **Precedence conflict** handling | §5.2 model + escalation in validation result |
| **Posting / ledger** behavior | Accounting runtime — not this domain |
| **Business term meaning** | Enterprise Knowledge · [Enterprise Knowledge NS](../NORTHSTAR/enterprise-knowledge-north-star.md) §3 |
| **IFRS paragraph citation** | Accounting Standards Authority · §12.1 |
| **Accepted meaning of "control" / "associate"** | Enterprise Knowledge atom — not citation chain |
| **UI label for standard name** | Representation from Knowledge atom |
| **Accounting book / COA mapping execution** | Accounting runtime |
| **XBRL instance filing** | Reporting runtime |
| **New accounting book or purpose** | This NS §3.4 + PAS routing |
| **Authority supersession policy** | §8.7 + PAS edition registry |
| **Judgment escalation policy** | §5 P12 + consumer workflow config |

---

# 15. Sync and Enterprise Accepted path

| Downstream | Sync rule |
| --- | --- |
| Accounting Standards Blueprint §4 | Every §13 row maps to Accounting standards authority box |
| Platform Blueprint — Accounting & finance | Standards box upstream of all runtime boxes · rollup |
| Accounting Standards PAS | Trace to §4 capabilities; implement △ items E8–E10 in slices B3+ · B4+ · B13+ |

## Enterprise Accepted exit criteria

Promote from Production Candidate only when **all** are true:

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | External authority hierarchy operational in registries | Body → instrument → paragraph chain in PAS §4 |
| 2 | Reporting context profile in routing | Entity + book + purpose → frameworks |
| 3 | Effective-date resolution implemented | Transaction date → edition → rule pack |
| 4 | Conflict precedence operational | §5.2 model in validation engine |
| 5 | §12.1 citation metadata on all Production+ rules | Publisher through binding strength |
| 6 | Explanation registry operational | PAS §4.10 keys on Production+ rules |
| 7 | Scope gates on applicable rule families | Scope excluded events in tests |
| 8 | One consumer workflow proof | End-to-end validation before posting |
| 9 | Authority supersession path defined | Edition supersession event + consumer contract |
| 10 | Zero △ peer-review items (E8–E10) remain open | Evidence register upgraded to ✓ |

**Last synced with PAS:** Accounting Standards PAS published · B0 skeleton · B1–B11 planned · B13+ for parallel-book extensions (2026-06-29) · **Maturity:** Production Candidate · **Enhancement:** ERP-parity gap analysis 2026-06-29

---

# 16. Enterprise Acceptance Criteria (document EAC)

| Criterion | Gate | Traces to |
| --- | --- | --- |
| §1 Philosophy cited ✓ | Manual review | §1 Source |
| §2 Identity complete | Manual review | §2 |
| §3 Vocabulary — parallel book + instrument terms | Manual review | §3.1–§3.7 |
| §4 EFR complete — every Production+ row sourced | Evidence audit | §4 · §12.3 |
| §5 Principles P1–P12 | Manual review | §5 |
| §6 Outcomes + KPIs | Manual review | §6 |
| §7 Business events — core + supersession | Manual review | §7 |
| §8 Lifecycles — profile · supersession · transition | Manual review | §8.4–§8.8 |
| §9 Boundaries + four-domain diagram | Manual review | §9.4 |
| §10 Risks mitigated | Manual review | §10 |
| §11 Quality attributes | Manual review | §11 |
| §12 Register + decision log complete | Manual review | §12.2–§12.4 |
| §13 maps every §4 capability to Blueprint box | Manual review | §13 |
| §1–§12 contain no package names or PAS IDs | Boundary contract | Hygiene |
| Blueprint authorable without redefining domain | Manual review | Full §1–§12 |

---

# 17. Document Sync Obligations

| Change in this document | Then update |
| --- | --- |
| New §4 capability | §13 row · [Accounting Standards Blueprint](../BLUEPRINT/accounting-standards-blueprint.md) §4.2 |
| New §3 vocabulary term | PAS-004 promotion slice via Enterprise Knowledge |
| New §7 event | Blueprint §5.1 integration table · PAS event surface |
| Parallel book / profile model | PAS slice catalog B13+ |
| Boundary change | Blueprint §4.2 · Platform Blueprint rollup |
| Business meaning stable; implementation only | Blueprint or PAS — not §1–§12 |

---

# 18. Required Reviews and References

## Before accepting amendments

- [ ] §1–§12 complete; no package names or PAS IDs in §1–§12
- [ ] §13 traces every §4 capability to Accounting standards authority box
- [ ] §14.5 matrix covers Knowledge vs citation split
- [ ] [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) passes
- [ ] [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) — E8–E10 △ have slice owners
- [ ] `pnpm check:documentation-drift` passes after Blueprint sync

## References

| Document | Role |
| --- | --- |
| Platform North Star | [`afenda-platform-north-star.md`](../architecture/afenda-platform-north-star.md) |
| Enterprise Knowledge North Star | [`enterprise-knowledge-north-star.md`](../NORTHSTAR/enterprise-knowledge-north-star.md) |
| Accounting Standards Blueprint | [`accounting-standards-blueprint.md`](../BLUEPRINT/accounting-standards-blueprint.md) |
| Accounting Standards PAS | [`PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md`](../PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) |

---

# 19. Final Doctrine

**Accounting Standards covenant:** Afenda **consumes** external accounting authority — it never **becomes** it. Every validation cites a versioned chain from authority body through instrument to paragraph reference; every parallel book and reporting purpose resolves through an honest reporting context profile; conflicts escalate, supersession notifies, and judgment zones return escalation — not AI invention or silent pass. Posting, mapping, consolidation, tax, and filing stay downstream. If business meaning of consumption changes, amend §1–§12 first — then Blueprint and PAS.
