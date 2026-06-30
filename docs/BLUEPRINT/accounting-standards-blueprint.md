# Accounting Standards Authority Blueprint

| Field | Value |
| --- | --- |
| **Document class** | `architecture_blueprint` |
| **Document role** | `domain_architecture_box_map` |
| **Architectural identity** | **Blueprint Box name** (§4) — permanent |
| **Workspace mapping** | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) — `@afenda/*` npm name |
| **Scope** | Accounting Standards Authority — external authority consumption, interpretation, and deterministic validation |
| **Parent** | [Platform North Star](../PAS/afenda-platform-north-star.md) · [Accounting Standards Authority North Star](../NORTHSTAR/accounting-standards-north-star.md) |
| **Platform rollup** | [Afenda Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) § Accounting & finance domain |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) |
| **Constitutional laws** | [LAW 10](../CONSTITUTION/platform-constitutional-laws.md) — evidence traceability |
| **Derived documents** | PAS-003 · `@afenda/accounting-standards` package tree |
| **Maturity** | Production Candidate |
| **Runtime stance** | Documentation only — references registries; does not duplicate PKG tables |
| **Total PAS at maturity** | `1` (PAS-003) |
| **Live PAS today** | `1` |
| **Planned PAS** | `0` |
| **Does not confer** | Business domain meaning, contracts, slice handoffs, registry row edits, acceptance gate execution |
| **Machine registry** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) · `PKGR03_ACCOUNTING_STANDARDS` |
| **Quality target** | Enterprise **10 / 10** (Enterprise Accepted blocked on Domain NS §15 + §16) |
| **Evidence standard** | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| **Last reviewed** | 2026-06-29 (documentation-audit sync — B0–B16 delivered; B12 closed 2026-06-30) |
| **Next document** | [PAS-003](../PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) · [Slice SSOT](../PAS/ACCOUNTING-STANDARDS/SLICE/README.md) |

> **One sentence:** One Foundation-layer **Accounting standards authority** box owns the authority consumption layer — citing external IFRS/MFRS/SFRS bodies through registries and deterministic validation — wired end-to-end from external publishers through Domain North Star, PAS, package surfaces, and every downstream runtime that must validate **before** posting, consolidation, or disclosure.

---

# 0. Agent Quick Path

**Read order:** [Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → [Platform NS](../PAS/afenda-platform-north-star.md) → [Domain NS §1–§12](../NORTHSTAR/accounting-standards-north-star.md) → **this document** → [PAS-003](../PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) → Slice → Code.

**This document answers:**

- What **Blueprint box** owns external authority **consumption** (not standard-setting)
- Why consumption is **separate** from posting, consolidation, tax, and Kernel wire vocabulary (§3.1)
- How **authority hierarchy**, **jurisdiction**, and **source types** compose inside the box (§5.1)
- **Full-stack integration** from external bodies → validation → consumer runtimes (§5.2–§5.4)
- Box **owns / never owns** (§4.2) · downstream consumer map (§5)

**This document never answers:**

- IFRS treatment logic in journal entries · ledger schemas · gate commands
- Domain philosophy or conflict precedence prose (Domain NS §1–§12)
- PAS §4 contract shapes · slice order (PAS §10–§12)

**Hard stops:**

- Afenda **consumes** external authority — it does **not** **be** the authority (Domain NS P1)
- Do not embed standards validation in **Accounting runtime** or **Kernel**
- Do not create `@afenda/accounting` posting without ADR-0010 gate (consumer — blocked)
- Do not implement from Blueprint alone — read PAS §4 surface + slice handoff

**Chain rule:** Constitutional Laws → Platform NS → Domain NS → **Domain Blueprint (this doc)** → Platform Blueprint rollup → PAS-003 → Slice → Code

---

# 1. Blueprint Purpose

Before authoring or extending Accounting Standards PAS slices, answer from **this document only**:

1. **What** Blueprint box? → **Accounting standards authority** (§4)
2. **Why separate** from Accounting runtime, Kernel, Consolidation, Tax? → §3.1 · §4 Reasoning
3. **Which layer**? → Foundation (§3)
4. **What does the box own / never own**? → §4.2
5. **Who consumes** validation and evidence? → §5 · §5.3
6. **Which PAS**? → PAS-003
7. **Registry PKG**? → `PKG-023` → `@afenda/accounting-standards`

Business **why consumption is separate from posting:** [Domain NS §1](../NORTHSTAR/accounting-standards-north-star.md) — do not copy here.

---

# 2. Upstream Traceability

| Upstream | Link | This Blueprint uses |
| --- | --- | --- |
| Platform Constitutional Laws | LAW 10 | Evidence traceability |
| Platform North Star | §2 · §4 Accounting standards | Parent capability |
| Domain North Star | §4 · §13 · §9 · §12 D1–D6 · §3.1–§3.7 · §8.4–§8.8 | Box parent · hierarchy · parallel books · profile lifecycles |
| Platform Blueprint | Accounting & finance decomposition | Rollup · sibling runtime boxes |
| External authorities | IFRS Foundation · FASB · MASB (T3) | Citation chain — not owned |
| ADRs | ADR-0020 · ADR-0026 · ADR-0010 | Decomposition · runtime gate |

| Domain NS §4 capability | Blueprint §4 box | Domain NS Decision ID |
| --- | --- | --- |
| External authority hierarchy | **Accounting standards authority** | D1 |
| Jurisdiction resolution | **Accounting standards authority** | D2 |
| Authority source type taxonomy | **Accounting standards authority** | D3 |
| Standard family registry | **Accounting standards authority** | D1 |
| Standard catalog | **Accounting standards authority** | D1 |
| Authority version registry | **Accounting standards authority** | D1 |
| Effective-date resolution | **Accounting standards authority** | D1 |
| Conflict precedence engine | **Accounting standards authority** | D1 |
| Process routing registry | **Accounting standards authority** | D1 |
| Deterministic validation rules | **Accounting standards authority** | D1 |
| Validation result contract | **Accounting standards authority** | D1 |
| Evidence snapshots for audit | **Accounting standards authority** | D1 |
| Group relationship routing | **Accounting standards authority** | D1 |
| Parallel accounting book routing | **Accounting standards authority** | D4 |
| Reporting context profile | **Accounting standards authority** | D4 |
| Authority instrument taxonomy | **Accounting standards authority** | D5 |
| Scope gate assessment | **Accounting standards authority** | D1 |
| Cross-representation routing | **Accounting standards authority** | D4 |
| Versioned rule packs | **Accounting standards authority** | D1 |
| Consumer validation input contract | **Accounting standards authority** | D2 |
| Explanation and disclosure metadata | **Accounting standards authority** | D1 |
| Authority supersession awareness | **Accounting standards authority** | D1 |
| Judgment escalation outcomes | **Accounting standards authority** | P12 |

---

# 3. Layer Map

| Layer | Blueprint intent for this domain |
| --- | --- |
| **Platform** | **Kernel** — wire vocabulary only; consumes standards, never defines IFRS |
| **Foundation** | **Accounting standards authority** — consumption layer; contracts-only |
| **Domain** | **Accounting / Consolidation / Intercompany / Tax / Finance / Reporting** — downstream consumers (planned or blocked) |
| **Application** | **apps/erp** — surfaces that display validation results and explanations |

**Dependency rule:** `@afenda/accounting-standards` may depend on `@afenda/kernel` and architecture authority (cycle-free). Runtime domain packages depend on accounting-standards — never the reverse.

Machine assignments: [`layer-registry.data.ts`](../../packages/architecture-authority/src/data/layer-registry.data.ts).

---

# 3.1 Architecture Decision Matrix

> Run **before** adding or splitting §4 rows. Outcome in §4 Reasoning.

| Question | Accounting standards authority | Result |
| --- | --- | --- |
| Different **business capability** (Domain NS §4)? | All twenty-three capabilities serve one consumption-layer domain | **Single box** |
| Different **lifecycle** (Domain NS §8)? | Standard · edition · rule lifecycles are **tracks inside one box** | **Single box** |
| Different **ownership**? | Financial Reporting Standards Authority owns consumption | **Single box** |
| **Independent deployment**? | One `@afenda/accounting-standards` package | **Single box** |
| Separate **regulatory responsibility**? | Consumption cites T3 bodies — Afenda does not set standards | **Single box** |
| Same as **posting runtime**? | Posting mutates ledger — consumption returns validation only | **Separate box** — Accounting runtime |
| Same as **Kernel wire vocabulary**? | Kernel owns branded IDs — not IFRS treatment | **Separate box** — Kernel |
| Same as **consolidation / tax / reporting**? | Distinct LoB calculations and filing | **Separate boxes** — planned runtimes |
| §3.1 passes but only **technical** split of registry files? | PAS §4 surfaces — not architectural boxes | **Insufficient alone** |

**Workflow:** Domain NS EFR → matrix → **one §4 row** → §4.2 · §5.1 internal surfaces → PAS-003 §4.1–§4.11 (+ NS §15 extensions in slices).

---

# 3.2 Canonical Dependency Categories

| Category | Accounting standards usage |
| --- | --- |
| **Compile-time** | Consumers import `@afenda/accounting-standards` for validation contracts |
| **Runtime** | Validation invoked by consumer workflows — **not** at uncited ERP request paths without consumer |
| **Metadata** | Version refs · citation metadata · evidence snapshots |
| **Configuration** | Standard family / jurisdiction routing — static registry data |
| **Knowledge** | Enterprise Knowledge for contested **terms** — orthogonal to standard **citations** |

---

# 4. Blueprint Boxes

### Box → workspace authority chain

```text
Blueprint Box: Accounting standards authority (this document §4)
        ↓
package-registry.data.ts — PKG-023 → @afenda/accounting-standards
        ↓
foundation-disposition.registry.ts — PKGR03_ACCOUNTING_STANDARDS
        ↓
packages/accounting-standards/
```

| Blueprint box | Layer | Registry PKG | Why separate | Source | Reasoning (Because → Therefore) | Status | Governing PAS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Accounting standards authority** | Foundation | `PKG-023` → `@afenda/accounting-standards` | Versioned external authority evidence and deterministic validation must not collapse into posting code or Kernel wire types | [T0 ADR-0020] [T0 ADR-0026] [T1 Domain NS §4] [T3 IFRS Foundation] [T1 Domain NS §12 D1–D6] ✓ | **Because** uncited "IFRS" in posting modules creates audit failure and version drift (Domain NS §1). **Because** external bodies set standards — Afenda owns consumption only (D1). **Because** parallel books are routing metadata, not ledger engines (D4). **Therefore** one Foundation box upstream of all Accounting & Finance runtimes; Kernel consumes branded IDs only (D3). | **live** | PAS-003 |

**Sibling boxes (platform scope — declared in Platform Blueprint, not owned here):**

| Blueprint box | Package | Status | Relationship to this box |
| --- | --- | --- | --- |
| Accounting vocabulary (wire) | `@afenda/kernel` | live | Upstream compile-time — relationship types for routing inputs |
| Accounting runtime | `@afenda/accounting` | **blocked** | Downstream consumer — ADR-0010 |
| Consolidation runtime | `@afenda/consolidation` | planned | Downstream consumer |
| Intercompany runtime | `@afenda/intercompany` | planned | Downstream consumer |
| Tax runtime | `@afenda/tax` | planned | Downstream consumer |
| Finance / management reporting | `@afenda/finance` | planned | Downstream consumer |
| Financial reporting (statements) | `@afenda/reporting` | planned | Downstream consumer |

---

# 4.1 Blueprint Evidence Register

| ID | Source | Tier | Justifies | Link |
| --- | --- | --- | --- | --- |
| B1 | ADR-0026 | T0 | Accounting domain decomposition | [`docs/adr/ADR-0026`](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| B2 | ADR-0020 | T0 | Standards separate from posting | [`docs/adr/ADR-0020`](../adr/ADR-0020-master-data-authority-consolidation.md) |
| B3 | ADR-0010 | T0 | Accounting runtime blocked — consumer gate | [`docs/adr/ADR-0010`](../adr/ADR-0010-no-accounting-before-foundation-gate.md) |
| B4 | Domain NS §12 D1–D6 | T1 | Capability → box · ERP-parity extensions | [`accounting-standards-north-star.md`](../NORTHSTAR/accounting-standards-north-star.md) |
| B5 | IFRS Foundation | T3 | External authority — not Afenda | Domain NS §3.1 · PAS §4.3 anchor |
| B6 | PKG-023 · PKGR03 | T4 | Live package · green-lane disposition | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) |
| B7 | PAS-003 published | T5 | B0–B16 delivered | [`PAS-003`](../PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) |

---

# 4.2 Box Responsibility Matrix

| Blueprint box | Owns (architectural) | Never owns (explicit exclusions) | Domain NS trace |
| --- | --- | --- | --- |
| **Accounting standards authority** | External authority hierarchy metadata · standard family/catalog · authority version registry · parallel accounting book routing · reporting context profile · authority instrument taxonomy · process routing · jurisdiction routing (MVP via reporting purpose) · effective-date resolution (edition metadata; transaction-date engine future) · scope gates · conflict precedence (severity aggregation; §5.2 engine future) · cross-representation routing · deterministic validation rules · validation result contract · consumer input contract · versioned rule packs · explanation registry · evidence snapshots · authority supersession awareness · judgment escalation outcomes · IFRS rule packs (cited summaries) | External standard-setting · journal posting · ledger mutation · COA mapping execution · consolidation calculation · IC eliminations · tax filing · XBRL instance generation · financial statement generation · Kernel ID families · Enterprise Knowledge atoms · UI rendering · AI-only blocking judgment · copyrighted standard text reproduction · professional sign-off | §4 · §9.1 · §9.2 |

**Never-owns targets (name sibling boxes):** **Accounting runtime** · **Consolidation runtime** · **Intercompany runtime** · **Tax runtime** · **Finance runtime** · **Reporting runtime** · **Kernel** · **Enterprise Knowledge**.

---

# 4.3 Change Impact Matrix

| If this box changes… | PAS impacted | Domain NS | Registry PKG | Primary gates / tests | ADR required |
| --- | --- | --- | --- | --- | --- |
| **Accounting standards authority** | PAS-003 · §12 slices B1–B16 | §4 · §13 · §12 register | `PKG-023` | `pnpm --filter @afenda/accounting-standards test:run` · `pnpm quality:architecture` | Yes if split/merge |
| New PAS §4 surface | Amendment slice | §3.1 if new registry class | Unchanged | Package tests + architecture gates | No if additive |
| New validation rule | B6–B11 family | §12.1 citation metadata | Unchanged | Rule unit tests | No |
| Box split (hypothetical) | PAS migration | Amend §13 | New PKG | Full regression | **Yes** |
| Consumer adds dependency | Consumer PAS | — | Unchanged | Consumer boundary tests | No if declared in §5 |

---

# 5. Composition and Consumers

```text
External Authority Bodies (IFRS Foundation · FASB · MASB · …)
        │
        ▼
Accounting standards authority  ← this box (consumption layer)
        │
        ├──► @afenda/kernel (routing inputs · branded IDs)
        ├──► @afenda/accounting (blocked — primary posting consumer)
        ├──► @afenda/consolidation · intercompany · tax · finance · reporting (planned)
        ├──► @afenda/ui-composition · @afenda/metadata-ui (explanations)
        └──► apps/erp (validation surfaces · evidence display)
```

| Blueprint box | Declared consumers | Dependency category | Notes |
| --- | --- | --- | --- |
| **Accounting standards authority** | `@afenda/kernel` · `@afenda/accounting` · `@afenda/consolidation` · `@afenda/intercompany` · `@afenda/tax` · `@afenda/finance` · `@afenda/reporting` · `@afenda/ui-composition` · `@afenda/metadata-ui` · `apps/erp` | Compile-time · Runtime (consumer-invoked validation) | PAS **Consumers** ⊆ this list · blocked/planned consumers declared in Platform Blueprint |

---

# 5.1 Cross-box Composition — Authority Surfaces (Internal)

> Maps Domain NS §3.1–§3.7 and §8.4–§8.8 to PAS §4 surfaces inside **Accounting standards authority**. Not separate Blueprint boxes.

```text
Accounting standards authority (one box)
        │
        ├─ External hierarchy (NS §3.1) ─── PAS §4.2 catalog · §4.3 version · §4.8 IFRS pack
        ├─ Authority instruments (NS §3.6) ─ citation metadata · binding strength
        ├─ Parallel books (NS §3.2–§3.4) ── PAS §4.4 routing (+ book/purpose keys B4+ · B13+)
        ├─ Reporting profile (NS §3.5) ───── profile resolution engine (B3+ · B13+)
        ├─ Standard family (NS §3) ───────── PAS §4.1 family registry
        ├─ Source types (NS §3.3) ────────── citation metadata · §12.1 source_type field
        ├─ Effective-date (NS §8.4) ─────── PAS §4.3 edition + resolution engine (B3+)
        ├─ Scope gates (NS §4) ──────────── pre-rule applicability (B13+)
        ├─ Conflict precedence (NS §5.2) ─ validation engine extension
        ├─ Cross-representation (NS §4) ──── multi-book authority routing (B13+)
        ├─ Process routing (NS §4) ───────── PAS §4.4 standard-process-routing
        ├─ Validation pipeline ───────────── PAS §4.5 input · §4.6 rules · §4.7 result
        ├─ Proof rule (Production) ───────── PAS §4.9 IFRS 16 lease (B9)
        ├─ Explanations ──────────────────── PAS §4.10 (UI · AI grounding)
        ├─ Supersession (NS §8.7) ────────── edition feed metadata (B15 delivered)
        └─ Evidence snapshots ────────────── PAS §4.11 audit replay
```

| Upstream surface | Downstream surface | Relationship | Domain NS §7 event | Category |
| --- | --- | --- | --- | --- |
| Standard family registry | Standard catalog | family → standards | Authority edition anchored | Metadata |
| Standard catalog | Version registry | standard → editions | Authority edition anchored | Metadata |
| Version registry | Effective-date resolution | transaction date → edition | Effective edition resolved | Metadata |
| Version registry | Reporting context profile | entity + book + purpose bundle | Reporting profile resolved | Metadata |
| Reporting profile | Effective-date resolution | profile + transaction date → edition | Effective edition resolved | Metadata |
| Jurisdiction context | Process routing | entity + purpose → frameworks | Jurisdiction context resolved | Metadata |
| Scope gate | Validation rules | applicability pre-check | Scope excluded | Runtime |
| Process routing | Validation rules | context → applicable rules | Process routed to authority | Runtime |
| Validation rules | Validation result | facts → pass/warn/block/escalate | Validation requested · blocked · judgment escalation | Runtime |
| Validation result | Evidence snapshot | result → durable citation | Evidence snapshot recorded | Metadata |
| Precedence engine | Validation result | conflict → block/warn | Precedence conflict detected | Runtime |
| Edition registry | Consumer notification | supersession published | Authority edition superseded · amendment ingested | Metadata |

---

# 5.2 Full-Stack End-to-End Integration Chain

> **Mandatory integration path** — external authority through consumption to consumer runtimes.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ EXTERNAL AUTHORITY (not Afenda)                                              │
│ IFRS Foundation · FASB · MASB · regulators · company policy (cited)         │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONSTITUTION + PLATFORM                                                      │
│ LAW 10 · Platform NS §2 · ADR-0026 decomposition                             │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ BUSINESS AUTHORITY                                                           │
│ Domain North Star §1–§12 (consumption layer · hierarchy · parallel books ·   │
│ profile · precedence · invariants I1–I8)                                     │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ARCHITECTURAL MAP                                                            │
│ Domain Blueprint (this doc) §4 box · §5.1 surfaces · §4.2 boundaries        │
│ Platform Blueprint — Accounting & finance upstream of runtime boxes          │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PACKAGE AUTHORITY                                                            │
│ PAS-003 §4.1–§4.11 · slices B0–B16 (B13–B16 NS ERP-parity extensions)       │
│ Skill: .cursor/skills/accounting-standards-authority/SKILL.md               │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ IMPLEMENTATION                                                               │
│ packages/accounting-standards/src/ (B0–B16 delivered · B17–B20 proposed) │
│ Depends: @afenda/kernel · architecture authority (registry discipline)       │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ CI / GATE PLANE                                                              │
│ pnpm --filter @afenda/accounting-standards typecheck · test:run              │
│ pnpm quality:architecture · architecture:cycles · architecture:drift           │
│ pnpm quality:boundaries                                                        │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONSUMERS (validate before mutate)                                           │
│ Kernel (inputs) → Accounting runtime (blocked) → Consolidation/Tax/…         │
│ → metadata-ui / ui-composition → apps/erp surfaces                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Integration invariants (E2E):**

| # | Invariant | Enforced at |
| --- | --- | --- |
| E1 | Afenda never claims to own external standards | Domain NS I1 · PAS §2 |
| E2 | Every blocking rule cites body → edition → standard → paragraph | Domain NS I2 · §12.1 · PAS §4.6 |
| E3 | Historical replay uses transaction-date edition | Domain NS I3 · §8.4 · PAS B3+ |
| E4 | Routing does not post journals | Domain NS I4 · PAS §4.4 |
| E5 | No generative-AI-only blocking gates | Domain NS I5 · PAS §4.6 |
| E6 | No IFRS treatment types in Kernel | PAS §3.4 · architecture-kernel-non-duplication |
| E7 | Cross-representation routing cites per book — not COA mapping | Domain NS I7 · PAS §4.4 |
| E8 | Superseded editions trigger consumer re-validation | Domain NS I8 · §8.7 |
| E9 | Consumer workflow proof before Enterprise Accepted | Domain NS §15 criterion 8 |

---

# 5.3 Downstream Consumer Integration Map

| Consumer | Integration surface | When invoked | Proof required |
| --- | --- | --- | --- |
| **@afenda/kernel** | Branded IDs · relationship vocabulary for routing keys | Compile-time type imports | Kernel boundary tests |
| **@afenda/accounting** (blocked) | `validatePostingAgainstAccountingStandards` before journal persist | Pre-posting workflow | Enterprise Accepted consumer proof |
| **@afenda/consolidation** | Group relationship routing · IFRS 10/11 refs | Pre-consolidation validation | Planned PAS consumer |
| **@afenda/intercompany** | Standards-backed IC policy checks | Pre-elimination validation | Planned PAS consumer |
| **@afenda/tax** | Citation chain for statutory overlap | Pre-filing validation | Planned PAS consumer |
| **@afenda/finance** · **@afenda/reporting** | Presentation/disclosure standards (IFRS 18) | Pre-report validation | Planned PAS consumer |
| **@afenda/ui-composition** · **metadata-ui** | Explanation registry · evidence display | Validation UX | Live surfaces |
| **apps/erp** | Workflow gates · drawer explanations | Operator-facing | Live surfaces |
| **AI assistants** | Registry-backed explanations only | Assisted review | PAS §4.10 · Domain NS I5 |

---

# 5.4 Documentation and Registry Sync Chain

```text
External authority bodies (T3)
        ↓
Domain NS §3.1–§3.7 hierarchy · §3.2 parallel books · §12.1 citation model
        ↓
Domain Blueprint §5.1 (this doc)
        ↓
PAS-003 §4.1–§4.11
        ↓
packages/accounting-standards/src/**/*.ts
        ↓
Architecture Authority package-registry · layer · disposition (PKGR03)
        ↓
pnpm architecture:drift · pnpm check:documentation-drift
```

| Event | Update order |
| --- | --- |
| New external standard citation | Domain NS §12.1 fields → PAS §4 → registry slice → tests |
| New jurisdiction profile | Domain NS §3.2 → PAS §4.4 routing → jurisdiction tests |
| New consumer package | Platform Blueprint §5 → PAS metadata Consumers → dependency registry |
| Slice delivered | PAS §12 → pas-status-index → Platform Blueprint §10 counts |
| Enterprise Accepted | Domain NS §15 all criteria ✓ → B17–B20 runtime + B20 consumer proof |

---

# 6. Domain Grouping

### Accounting & finance domain (consumption upstream)

```text
                    Accounting standards authority  ← this blueprint (live)
                              │
         standards-backed validation & evidence
                              │
    ┌─────────────┬───────────┼───────────┬─────────────┐
    ▼             ▼           ▼           ▼             ▼
accounting   consolidation  intercompany   tax        finance
(blocked)    (planned)      (planned)   (planned)  (planned)
    │             │           │           │             │
    └─────────────┴───────────┴───────────┴─────────────┘
                              │
                    reporting (planned)
                              │
                         apps/erp
```

**Domain gate:** **Accounting runtime** blocked until [ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) **and** PKGR01 amendment. **This box is live** — consumption layer may implement ahead of posting consumer.

Rollup: [Platform Blueprint — Accounting & finance](../architecture/afenda-architecture-blueprint.md#accounting--finance-domain).

---

# 7. PAS Creation Gate

PAS-003 **satisfies** all conditions:

1. Box **Accounting standards authority** in §4 ✓
2. §3.1 matrix in §4 Reasoning ✓
3. §4.2 responsibility row ✓
4. Layer Foundation ✓
5. **Why separate** documented ✓
6. Registry PKG `PKG-023` linked ✓
7. Status **live** ✓
8. PAS-003 assigned ✓
9. ADRs ADR-0020 · ADR-0026 · ADR-0010 (consumer gate) ✓
10. §4.3 impact row ✓

---

# 8. Blocked and Retired Boxes

| Blueprint box | Status | Blocker | Notes |
| --- | --- | --- | --- |
| **Accounting runtime** | blocked | ADR-0010 · PKGR01 | Primary consumer — not this box |
| Standalone `@afenda/accounting` (PKG-R01) | retired | ADR-0020 | Vocabulary in Kernel — do not recreate |

This domain blueprint scope: **Accounting standards authority** only — status **live**.

---

# 9. Blueprint → PAS Handoff Contract

| §4 field | Pre-fills PAS |
| --- | --- |
| **Blueprint box** | `Accounting standards authority` |
| Registry PKG | `@afenda/accounting-standards` · `PKG-023` |
| Layer | Foundation |
| Why separate | §4 Reasoning → PAS §1–§2 |
| §4.2 Owns / never owns | PAS §2 · §5 |
| Status | live · Production Candidate |
| Governing PAS | PAS-003 |
| §5 consumers | PAS metadata `Consumers` |
| §5.1 surfaces | PAS §4.1–§4.11 |
| §5.2 E2E chain | PAS §0 · skill extract |
| NS §15 exit criteria | PAS §11 Enterprise Accepted |

---

# 10. PAS Inventory

**Total PAS at maturity: 1**

| PAS | Title | Blueprint box | Live / Total slices | Status |
| --- | --- | --- | --- | --- |
| PAS-003 | Accounting Standards Authority Standard | **Accounting standards authority** | 17 / 17 delivered · B17–B20 proposed | Production Candidate |

**Proposed extensions (documentation only — closes Domain NS E8–E10 △ + consumer proof):**

| Slice | Title | Closes |
| --- | --- | --- |
| B17 | Transaction-date edition resolution | E10 |
| B18 | Jurisdiction registry | E8 |
| B19 | Conflict precedence engine | E9 |
| B20 | ERP consumer workflow proof (ADR-0027) | PAS §11.6 criterion 8 |

> B0–B16 delivered (B12 governance doc sync 2026-06-30) · proposed B17–B20 · consumer proof deferred to B20. Sync from [`pas-status-index.md`](../PAS/pas-status-index.md) on slice close.

---

# 11. PAS Maturity Rollup (read-only)

| Blueprint box | Registry PKG | PAS | Maturity |
| --- | --- | --- | --- |
| **Accounting standards authority** | `PKG-023` · `@afenda/accounting-standards` | PAS-003 | Production Candidate |

Disposition: `PKGR03_ACCOUNTING_STANDARDS` · green-lane · authority PAS-003 · Enterprise Accepted.

---

# 12. How to Add a Blueprint Box (This Domain)

This domain is **closed at one box** for consumption layer. Sibling runtime boxes belong in **Platform Blueprint** § Accounting & finance.

To extend consumption (not split box):

1. Confirm capability in Domain NS §4
2. Add PAS §4 surface + §12 slice
3. Update §5.1 composition row
4. Implement in `packages/accounting-standards/src/`

To add a **new runtime consumer box** (e.g. new LoB): Platform Blueprint first — not this document.

---

# 13. Agent Execution Rules

## Vibe-coding entry checklist

- [ ] Target box **Accounting standards authority** in §4
- [ ] §3.1 matrix outcome recorded
- [ ] §4.2 responsibility row exists
- [ ] Box status **live**
- [ ] §10 lists PAS-003
- [ ] PAS maturity **Production Candidate** — implementation permitted
- [ ] Slice handoff for target PAS §4 surface (B1–B16)
- [ ] `/afenda-coding-session` Phase 0 from slice
- [ ] `accounting-standards-authority` skill loaded; `kernel-authority` when touching Kernel types

## Runtime chain (implement mode)

```text
§4 Accounting standards authority + live
        ↓
§10 PAS-003 · target §4 surface (B1–B11 core · B13–B16 extensions)
        ↓
Slice 9-field handoff → Phase 0
        ↓
Implement packages/accounting-standards/src/
        ↓
PAS §13 gates → Delivered
        ↓
Sync §10 · pas-status-index · PKGR03 evidence
```

## E2E integration checklist (before claiming slice delivery)

- [ ] Domain NS §4 capability traced to §4 box
- [ ] §5.1 surface maps to PAS §4 row
- [ ] §12.1 citation metadata on new rules (Production+)
- [ ] No posting/ledger imports in package
- [ ] No Kernel IFRS type additions
- [ ] Architecture + boundary gates pass
- [ ] Consumer declared in §5 if new dependency edge

---

# 14. Required Reviews and References

## Before accepting

- [ ] §4 box traces to Domain NS §4 + §13 with Decision IDs
- [ ] §3.1 explains separation from posting + Kernel + runtimes
- [ ] §4.2 complete · §4.3 present
- [ ] §5.1 maps NS §3.1–§3.7 + §8.4–§8.8 to PAS §4
- [ ] §5.2 full-stack chain documented
- [ ] §5.3 consumers match Platform Blueprint
- [ ] §5.4 sync chain documented
- [ ] External authority honesty (Afenda = consumer)
- [ ] No Domain NS prose duplicated
- [ ] [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) passes

## References

| Document | Role |
| --- | --- |
| Domain North Star | [`accounting-standards-north-star.md`](../NORTHSTAR/accounting-standards-north-star.md) |
| Platform Blueprint | [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) |
| PAS-003 | [`PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md`](../PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) |
| Architecture Authority Blueprint | [`architecture-authority-blueprint.md`](architecture-authority-blueprint.md) |

---

# 15. Final Doctrine

This Blueprint owns **one Foundation box — Accounting standards authority** — the **authority consumption layer** between external standard-setters and Afenda runtimes.

| Identity | Owner | Changes when |
| --- | --- | --- |
| **Blueprint Box name** | This document §4 | ADR + §4.3 split/merge only |
| **`@afenda/accounting-standards`** | `package-registry.data.ts` | Registry update — box unchanged |
| **`PKGR03` disposition** | `foundation-disposition.registry.ts` | `foundation-registry-owner` |

Domain North Star owns **why consumption is separate** and **what external honesty requires**. PAS owns **contracts, slices, gates**. External bodies own **the standards**.

Business meaning change → Domain NS first. New validation surface → PAS §4 + §5.1. New posting behavior → **Accounting runtime** box — not here.

**Reusable pattern (Domain NS §9.5):** External Authority → Domain NS → **Domain Blueprint** → PAS → Consumer runtime — extensible to Tax, ESG, ISO, and other authority domains.
