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
| **Maturity** | Production Candidate — peer-reviewed 2026-06-29 (9.8/10) |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** (Enterprise Accepted blocked on §15 exit criteria) |
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
| **Scope** | External authority hierarchy · jurisdiction resolution · source-type taxonomy · authority version evidence · effective-date resolution · conflict precedence · process routing · deterministic validation · evidence snapshots. |
| **Out of scope** | Owning or amending external standards · journal creation · ledger mutation · consolidation calculation · tax filing · transfer-pricing rate policy · UI rendering · AI-only accounting judgment · statutory filing execution. |

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

## 3.1 External authority hierarchy

External evidence chains through a fixed hierarchy — every validation rule must cite a position in this chain:

```text
Authority Body          (IFRS Foundation, FASB, MASB, …)
        │
        ▼
Publication             (Bound volume, compendium, regulatory gazette)
        │
        ▼
Edition                 (2026 Required IFRS · 2025 MFRS, …)
        │
        ▼
Standard                (IFRS 10 · IAS 28 · …)
        │
        ▼
Paragraph               (B86 · 27 · … — reference only)
        │
        ▼
Validation Rule         (Deterministic Afenda rule citing the chain above)
```

**Example:**

```text
IFRS Foundation → 2026 Bound Volume → IFRS 10 → Paragraph B86 → rule:holding_control_assessment
```

**Rule:** Afenda records references and metadata — never reproduces copyrighted standard text in registries or validation output.

## 3.2 Jurisdiction layer

Enterprises operate under **concurrent** reporting contexts. Jurisdiction sits **above** standard family selection:

```text
Legal Entity / Reporting Context
        │
        ▼
Jurisdiction            (Malaysia · Singapore · EU · US · …)
        │
        ├─► Group reporting framework     (often IFRS)
        ├─► Statutory local framework     (often MFRS · SFRS · local GAAP)
        ├─► Regulatory overlay            (stock exchange · central bank)
        └─► Company accounting manual     (group policy)
```

The same group may apply IFRS for consolidation, MFRS for statutory entities, and local tax rules simultaneously. Routing must accept **jurisdiction + reporting purpose** — not a single global family flag.

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

**Capability maturity key:** Idea · MVP · Production · Enterprise

**Enterprise Accepted blockers:** Effective-date resolution implemented · conflict precedence operational · jurisdiction routing in registries · citation metadata complete on all Production+ rules · one consumer workflow proof.

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

## 5.1 Domain invariants

| # | Invariant |
| --- | --- |
| I1 | Afenda never claims to own, amend, or publish external accounting standards. |
| I2 | Every blocking validation cites authority body, publication, edition, standard, and paragraph reference. |
| I3 | Historical validation replays against edition effective on transaction date — not current edition. |
| I4 | Routing suggests relevant authorities — never posts journals or decides final treatment. |
| I5 | Generative AI does not produce blocking validation outcomes without deterministic rule backing. |
| I6 | Copyrighted standard text is referenced — not reproduced in registries or outputs. |

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
| **Jurisdiction correctness** | Concurrent frameworks resolved per entity context | Jurisdiction routing coverage |
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
Transaction date + jurisdiction + reporting purpose
        │
        ▼
Applicable authority edition (not "current" edition)
        │
        ▼
Active validation rules for that edition
        │
        ▼
Deterministic result + evidence snapshot
```

**Example:** A 2023-08-15 transaction in a Malaysian group entity resolves to the IFRS/MFRS editions **effective on that date** — not the 2026 bound volume retrieved today.

## 8.5 Standards-backed validation result

```text
Requested → Edition resolved → Evaluated → Pass / Info / Warning / Block → Snapshotted (audit)
```

---

# 9. Boundary and Dependencies

## 9.1 This domain owns (business)

- External authority consumption model (§3.1–§3.3)
- Jurisdiction and concurrent-framework resolution
- Effective-date resolution and conflict precedence
- Deterministic validation rules, results, and evidence snapshots
- Honest distinction: consumption layer vs external authority bodies

## 9.2 This domain never owns (business)

- **External standard-setting** (IFRS Foundation, FASB, MASB, …)
- Journal posting and ledger mutation (Accounting runtime)
- Consolidation calculations (Consolidation domain)
- Intercompany eliminations (Intercompany domain)
- Tax computation and statutory filing (Tax domain)
- Financial statement generation (Reporting domain)
- Enterprise identity vocabulary (Platform Kernel — consumes only)
- Contested term meaning beyond citations (Enterprise Knowledge)
- UI rendering without rule/atom citations (Presentation domain)

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
| **ERP surfaces and assistants** | Explanation keys tied to external citation chain |

## 9.4 Reusable external-authority pattern

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

## 12.2 Evidence Register

| ID | Claim | Source class | Tier | Reference |
| --- | --- | --- | --- | --- |
| E1 | Platform requires versioned financial-standard consumption | ✓ | T1 | [Platform NS](../architecture/afenda-platform-north-star.md) §2 |
| E2 | Accounting domain decomposed — standards upstream of runtime | ✓ | T0 | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) |
| E3 | IFRS Foundation as external authority (not Afenda) | ✓ | T3 | IFRS Foundation · Required IFRS 2026 · PAS §4.3 anchor |
| E4 | Consumption layer boundary | ✓ | T5 | Accounting Standards PAS §1–§2 |
| E5 | Group relationship routing | ✓ | T5 | Accounting Standards PAS §4.4 |
| E6 | Blueprint standards box live | ✓ | T1 | Architecture Blueprint · Accounting standards authority |
| E7 | External authority hierarchy formalized | ✓ | T6 | Peer review 2026-06-29 · §3.1 |
| E8 | Jurisdiction concurrency model | △ | T6 | Peer review 2026-06-29 · §3.2 — implement in PAS B4+ |
| E9 | Conflict precedence model | △ | T6 | Peer review 2026-06-29 · §5.2 — implement in PAS |
| E10 | Effective-date resolution | △ | T6 | Peer review 2026-06-29 · §8.4 — implement in PAS B3+ |
| D1 | External authority ≠ Afenda | ✓ | T3 | IFRS Foundation ownership · Philosophy §1 |
| D2 | Standards separate from posting | ✓ | T0 | ADR-0020 · Blueprint decomposition |
| D3 | Kernel consumes, never defines IFRS | ✓ | T5 | Accounting Standards PAS §3.4 |

**Provenance:** Production Candidate — peer-reviewed 9.8/10 (2026-06-29). Enterprise Accepted requires §15 exit criteria — not structure changes alone.

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
| **Business term meaning** | Enterprise Knowledge · Domain NS §3 |

---

# 15. Sync and Enterprise Accepted path

| Downstream | Sync rule |
| --- | --- |
| Accounting Standards Blueprint §4 | Every §13 row maps to Accounting standards authority box |
| Platform Blueprint — Accounting & finance | Standards box upstream of all runtime boxes · rollup |
| Accounting Standards PAS | Trace to §4 capabilities; implement §3.1–§3.3 · §5.2 · §8.4 in slices |

## Enterprise Accepted exit criteria

Promote from Production Candidate only when **all** are true:

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | External authority hierarchy operational in registries | Body → paragraph chain in PAS §4 |
| 2 | Jurisdiction resolution in routing | Concurrent frameworks per entity |
| 3 | Effective-date resolution implemented | Transaction date → edition → rule |
| 4 | Conflict precedence operational | §5.2 model in validation engine |
| 5 | §12.1 citation metadata on all Production+ rules | Publisher through license status |
| 6 | One consumer workflow proof | End-to-end validation before posting |
| 7 | Zero △ peer-review items (E8–E10) remain open | Evidence register upgraded to ✓ |

**Last synced with PAS:** Accounting Standards PAS published · B0 skeleton · B1+ planned (2026-06-29) · **Maturity:** Production Candidate · **Peer review:** 9.8/10 (2026-06-29)
