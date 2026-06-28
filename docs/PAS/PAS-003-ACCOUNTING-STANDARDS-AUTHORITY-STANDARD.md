# PAS-003 — Accounting Standards Authority Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-003 |
| **Document class** | `package_authority_standard` |
| **Document role** | `accounting_standards_authority` |
| **Canonical filename** | `PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md` |
| **Package** | `@afenda/accounting-standards` |
| **Layer** | Foundation |
| **Package role** | Owns versioned accounting-standard authority metadata, process-routing rules, standards-backed validation contracts, explanation metadata, and evidence snapshots |
| **Runtime stance** | `contracts-only` |
| **Registry lane** | `PKGR03_ACCOUNTING_STANDARDS` |
| **Package owner** | Financial Reporting Standards Authority |
| **Agent skill** | `accounting-standards-authority` · `.cursor/skills/accounting-standards-authority/SKILL.md` |
| **Maturity** | Production Candidate (`production_candidate`) |
| **Authority status** | `accepted_for_implementation` |
| **Implementation status** | `partial` |
| **Evidence level** | `concept` |
| **Runtime status** | B0 skeleton + PAS published; versioned standard registries not started |
| **Remaining slices** | B1 — accounting standard family registry (next) |
| **Consumers** | See [Architecture Blueprint — Accounting domain](../architecture/afenda-architecture-blueprint.md#accounting--finance-domain): `@afenda/kernel` (live), `@afenda/accounting` (blocked), `@afenda/consolidation`, `@afenda/intercompany`, `@afenda/tax`, `@afenda/finance`, `@afenda/reporting` (planned), `@afenda/ui-composition`, `@afenda/metadata-ui`, `apps/erp` (live surfaces) |
| **Change model** | `serialized-slices` |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **ADR prerequisites** | ADR-0013 · consumer packages declared in [Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/accounting-standards typecheck` |
| 2 | `pnpm --filter @afenda/accounting-standards test:run` |
| 3 | `pnpm quality:architecture` |
| 4 | `pnpm architecture:cycles` |
| 5 | `pnpm architecture:drift` |
| 6 | `pnpm quality:boundaries` |

> **Maturity is part of authority.**
> PAS-003 is implementable and may guide package creation, contracts, tests, and slices. It is **not Enterprise Accepted** until the package exists, required gates pass, versioned standard registries are implemented, rule evidence is tested, and at least one consuming workflow proves standards-backed validation.

> **Canonical location:** `docs/PAS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md`
> **Package-local pointer:** [`packages/accounting-standards/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md`](../../packages/accounting-standards/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md)
> **Kernel identity boundary (do not duplicate):** [PAS-001 §4.1](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) · [PAS-001 context](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) · `.cursor/skills/kernel-authority/SKILL.md`
> **Blueprint (consumer discovery):** [Architecture Blueprint — Accounting domain](../architecture/afenda-architecture-blueprint.md#accounting--finance-domain) · [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md)

---

# 0. Agent Quick Path

> Read this section first for IDE/agent work. Full detail in §1–§15. Execution adapter: `.cursor/skills/accounting-standards-authority/SKILL.md`

**Boundary:** `@afenda/accounting-standards` **owns versioned accounting-standard authority metadata, standards-to-process routing, validation contracts, rule identifiers, explanation metadata, and evidence snapshots; it never owns journal posting execution, ledger persistence, consolidation calculation, tax filing, transfer-pricing rates, UI rendering, or AI-only accounting judgment.**

**Hard stops summary:**

* **Prohibited imports:** `apps/erp`, `@afenda/accounting` runtime posting engine, `@afenda/consolidation` runtime calculation modules, `@afenda/intercompany` runtime pricing/elimination modules, `@afenda/tax` runtime filing/calculation modules, `@afenda/database`, `@afenda/ui`, `@afenda/metadata-ui`, auth packages, external accounting SDKs.
* **Must never own:** journal creation, ledger mutation, consolidation calculation, tax calculation, transfer-pricing rates, UI behavior, AI-only accounting judgment, statutory filing, or unversioned IFRS references.

**Required gates:** see §13.1.

**Slice entrypoint:** `docs/PAS/slice/` · Planner: `pas-slice-planner` · Session: `/afenda-coding-session`

**Registry:** `PKGR03_ACCOUNTING_STANDARDS` · `PKG-023` in `packages/architecture-authority/src/data/package-registry.data.ts`.

**Blueprint consumers:** Downstream domain packages (`@afenda/accounting`, `@afenda/consolidation`, `@afenda/intercompany`, `@afenda/tax`, `@afenda/finance`, `@afenda/reporting`) are **declared planned or blocked** in the [Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) — not phantom references. Live surfaces today: `@afenda/kernel`, `@afenda/ui-composition`, `@afenda/metadata-ui`, `apps/erp`.

**Kernel boundary (read-only):** Branded IDs, `LegalEntityContext`, and relationship vocabulary (`holding`, `subsidiary`, `associate`, `joint_venture`, etc.) live in `@afenda/kernel` ([PAS-001](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)). Accounting Standards **consumes** Kernel types for routing and validation inputs only — it never defines identity brands, relationship semantics, or IFRS treatment logic inside Kernel.

**Production Candidate rule:** implementation may begin, but every slice must prove package boundary, standard-version evidence, deterministic validation behavior, and zero journal/ledger mutation.

---

# 1. Package Definition

`@afenda/accounting-standards` is the Foundation authority package for financial-reporting standard evidence and standards-backed process validation. It records accounting-standard families, standard versions, effective dates, rule evidence, process routes, and deterministic validation results that downstream packages may use before accepting sensitive accounting workflows.

This package is **not the accounting module**. It does not post journals, mutate ledgers, calculate consolidation, file tax, generate financial statements, or decide final statutory treatment. It provides governed, versioned, cited standards evidence that Accounting, Consolidation, Intercompany, Tax, Finance, Reporting, UI, and AI assistant features can use consistently.

> **This package answers:** “Which standard/version/rule is relevant to this process, and what governed pass/info/warning/block result should be returned?”

> **This package must not answer:** “What exact journal entry should be posted and persisted to the ledger?”

---

# 2. One-Sentence Boundary

`@afenda/accounting-standards` **owns versioned accounting-standard authority metadata, standard-to-process routing, validation contracts, rule identifiers, explanation metadata, and evidence snapshots; it never owns journal posting execution, ledger persistence, consolidation calculation, tax filing, transfer-pricing rate policy, UI rendering, or AI-only accounting judgment.**

---

# 3. Dependency Rules

## 3.1 Allowed

This package may import or use:

* TypeScript standard library types.
* `@afenda/kernel` identity/context types where needed, such as `TenantId`, `CompanyId`, `CurrencyCode`, and legal-entity relationship types.
* Local static standard registries.
* Local deterministic validation functions.
* Local explanation metadata.
* Local evidence snapshot contracts.
* Local test fixtures.
* Architecture Authority contracts only if cycle-free and approved.

Allowed dependency direction:

```text
@afenda/accounting-standards
  → @afenda/kernel
  → local registries
  → local pure validators
```

Consumer direction:

```text
@afenda/accounting
@afenda/consolidation
@afenda/intercompany
@afenda/tax
@afenda/finance
@afenda/ui-composition
@afenda/metadata-ui
apps/erp
  → @afenda/accounting-standards
```

## 3.2 Prohibited imports

This package must not import:

* `apps/erp`
* `@afenda/accounting` runtime posting modules
* `@afenda/consolidation` runtime calculation modules
* `@afenda/intercompany` runtime pricing/elimination modules
* `@afenda/tax` runtime filing/calculation modules
* `@afenda/database`
* `@afenda/ui`
* `@afenda/metadata-ui`
* `@afenda/appshell`
* Auth/session packages
* Database clients
* React, Next.js, browser rendering libraries
* External ERP/accounting SDKs

## 3.3 Import rule

Accounting Standards is a standards authority and validation package. Runtime packages may depend on it for standards-backed validation, but Accounting Standards must not depend on runtime packages.

Wrong-package signal:

```text
If this package needs a posted journal, ledger row, database transaction, UI component, or tax filing object to decide a rule, that logic belongs in the consuming package. This package may only receive plain input contracts and return deterministic validation results.
```

Escalation path:

```text
PAS-003
→ standard family registry
→ standard version registry
→ standard rule registry
→ process-routing registry
→ validation result contract
→ consumer workflow decision
```

## 3.4 Kernel boundary (read-only)

Accounting Standards may import from `@afenda/kernel`:

* Branded IDs (`TenantId`, `CompanyId`, `CurrencyCode`) at validation input boundaries.
* `LegalEntityContext` / `LegalEntityCompanyType` for process-routing keys only.
* `JsonValue` / `JsonObject` for wire-safe transaction fact payloads.

Accounting Standards must **not**:

* Add IFRS/MFRS/SFRS treatment types or posting logic to `@afenda/kernel`.
* Duplicate Kernel relationship vocabulary under different names.
* Push standards validation results into Kernel exports.

When Kernel needs a new relationship word, change PAS-001 + Kernel slice first. When a standard rule is needed, change PAS-003 + Accounting Standards slice — never Kernel.

---

# 4. Authority Surfaces

## 4.1 Accounting Standard Family Registry

**Authority:** PAS-003 §4.1
**Implementation:** `packages/accounting-standards/src/standards/accounting-standard-family.registry.ts`
**Slice gate:** B1

The standard family registry records recognized financial-reporting frameworks.

Initial families:

```ts
export const ACCOUNTING_STANDARD_FAMILIES = [
  "IFRS",
  "MFRS",
  "SFRS",
  "US_GAAP",
  "LOCAL_POLICY",
] as const;
```

This package starts with IFRS because Afenda’s first standards-backed routing use cases are group relationship classification and accounting posting validation.

The family registry must not encode journal entries or accounting calculations.

---

## 4.2 Accounting Standard Registry

**Authority:** PAS-003 §4.2
**Implementation:** `packages/accounting-standards/src/standards/accounting-standard.registry.ts`
**Slice gate:** B2

The accounting standard registry records standard code, title, family, lifecycle status, and scope summary.

Initial IFRS/IAS focus:

```text
IFRS 9  — Financial Instruments
IFRS 10 — Consolidated Financial Statements
IFRS 11 — Joint Arrangements
IFRS 12 — Disclosure of Interests in Other Entities
IFRS 16 — Leases
IFRS 18 — Presentation and Disclosure in Financial Statements
IAS 28  — Investments in Associates and Joint Ventures
```

Initial registry contract:

```ts
export interface AccountingStandardRegistryEntry {
  readonly standardKey: string;
  readonly family: AccountingStandardFamily;
  readonly standardCode: string;
  readonly standardTitle: string;
  readonly scopeSummary: string;
  readonly lifecycleStatus:
    | "current"
    | "future_effective"
    | "superseded"
    | "amended"
    | "pending_review";
  readonly defaultAuthorityVersionKey: string;
}
```

---

## 4.3 Standard Version Registry

**Authority:** PAS-003 §4.3
**Implementation:** `packages/accounting-standards/src/standards/standard-version.registry.ts`
**Slice gate:** B3

The standard version registry records the exact authority version used by rules, UI explanations, AI assistant explanations, and audit snapshots.

Minimum required fields:

```ts
export interface AccountingStandardVersionRef {
  readonly standardFamily: AccountingStandardFamily;
  readonly standardCode: string;
  readonly standardTitle: string;
  readonly edition: string;
  readonly issuedAsOf: string;
  readonly effectiveForAnnualPeriodsBeginningOnOrAfter: string;
  readonly retrievedAt: string;
  readonly authorityStatus:
    | "current"
    | "future_effective"
    | "superseded"
    | "amended"
    | "pending_review";
  readonly sourceName: string;
  readonly sourceUrl: string;
}
```

Version records must not be casual comments. They are authority evidence.

Initial IFRS version anchor:

```ts
export const IFRS_AUTHORITY_VERSION_2026 = {
  standardFamily: "IFRS",
  edition: "Required IFRS Accounting Standards 2026",
  issuedAsOf: "2025-12-31",
  effectiveForAnnualPeriodsBeginningOnOrAfter: "2026-01-01",
  retrievedAt: "2026-06-27",
  sourceName: "IFRS Foundation",
  sourceUrl: "https://www.ifrs.org/issued-standards/list-of-standards/",
} as const;
```

---

## 4.4 Standard-to-Process Routing Registry

**Authority:** PAS-003 §4.4
**Implementation:** `packages/accounting-standards/src/routing/standard-process-routing.registry.ts`
**Slice gate:** B4

The routing registry maps Kernel context or business process events to relevant accounting standards.

Initial routes:

```ts
export const STANDARD_PROCESS_ROUTING = {
  holding_relationship_subsidiary: ["IFRS_10"],
  holding_relationship_joint_venture: ["IFRS_11", "IAS_28"],
  holding_relationship_associate: ["IAS_28"],
  holding_relationship_minority_investment: ["IFRS_9", "LOCAL_POLICY_REVIEW"],
  lease_contract_recognition: ["IFRS_16"],
  financial_statement_presentation: ["IFRS_18"],
} as const;
```

Routing is not final accounting treatment. Routing tells the consumer which standards evidence and validation pathway may be relevant.

---

## 4.5 Posting Validation Input Contracts

**Authority:** PAS-003 §4.5
**Implementation:** `packages/accounting-standards/src/rules/posting-validation-input.contract.ts`
**Slice gate:** B5

Posting validation input contracts define the data shape that consuming packages pass into this package.

Minimum shape:

```ts
export interface AccountingStandardPostingValidationInput {
  readonly tenantId: string;
  readonly companyId: string;
  readonly eventType: string;
  readonly accountingStandardFamily: AccountingStandardFamily;
  readonly transactionFacts: Readonly<Record<string, JsonValue>>;
  readonly postingDraft:
    | {
        readonly debitAccountKeys: readonly string[];
        readonly creditAccountKeys: readonly string[];
        readonly amountCurrency: string;
      }
    | null;
}
```

Import `JsonValue` from `@afenda/kernel` — do not use loose `unknown` or unbounded `Record<string, unknown>` on public contracts.

---

## 4.6 Posting Validation Rule Contracts

**Authority:** PAS-003 §4.6
**Implementation:** `packages/accounting-standards/src/rules/posting-validation-rule.contract.ts`
**Slice gate:** B6

Posting validation rules define deterministic standards-backed checks.

Minimum shape:

```ts
export interface AccountingStandardPostingRule {
  readonly ruleId: string;
  readonly standardCode: string;
  readonly standardVersionKey: string;
  readonly appliesToEvent: string;
  readonly severity: "info" | "warning" | "blocking";
  readonly conditionKey: string;
  readonly expectedProcessRoute: string;
  readonly explanationKey: string;
  readonly authorityRefs: readonly AccountingStandardVersionRef[];
}
```

Rules must be deterministic and testable. They must not depend on generative AI.

---

## 4.7 Validation Result Contract

**Authority:** PAS-003 §4.7
**Implementation:** `packages/accounting-standards/src/rules/posting-validation-result.contract.ts`
**Slice gate:** B7

Validation result contracts are returned to consumers such as Accounting, ERP workflow modules, and AI assistant explanation layers.

Minimum shape:

```ts
export interface AccountingStandardValidationResult {
  readonly status: "pass" | "info" | "warning" | "blocked";
  readonly ruleId: string | null;
  readonly standardCode: string | null;
  readonly message: string;
  readonly recommendedAction: string | null;
  readonly authorityRefs: readonly AccountingStandardVersionRef[];
  readonly evidenceSnapshot: AccountingStandardEvidenceSnapshot | null;
}
```

Consumers decide whether `warning` blocks their workflow. Only explicitly configured `blocking` rules may prevent continuation.

---

## 4.8 IFRS Rule Pack

**Authority:** PAS-003 §4.8
**Implementation:** `packages/accounting-standards/src/standards/ifrs/`
**Slice gate:** B8

The IFRS rule pack stores versioned IFRS evidence and deterministic rule metadata.

Initial files:

```text
ifrs-authority-version.registry.ts
ifrs-standard.registry.ts
ifrs-9-financial-instruments.registry.ts
ifrs-10-consolidation.registry.ts
ifrs-11-joint-arrangements.registry.ts
ifrs-12-disclosure-interests.registry.ts
ias-28-associates-jv.registry.ts
ifrs-16-leases.registry.ts
ifrs-18-presentation-disclosure.registry.ts
```

IFRS text must be summarized, cited, and versioned. This package must not copy large IFRS standard text.

---

## 4.9 IFRS 16 Lease Posting Validation Proof

**Authority:** PAS-003 §4.9
**Implementation:** `packages/accounting-standards/src/standards/ifrs/ifrs-16-leases.registry.ts`
**Slice gate:** B9

Initial production-candidate proof rule:

```ts
export const IFRS_16_LEASE_POSTING_RULES = [
  {
    ruleId: "IFRS16-LEASE-LESSEE-ROU-LIABILITY-001",
    standardCode: "IFRS 16",
    standardVersionKey: "IFRS_16_REQUIRED_2026",
    appliesToEvent: "lease_contract_recognition",
    severity: "warning",
    conditionKey: "lease_term_gt_12_months_and_not_low_value",
    expectedProcessRoute:
      "route_to_lease_accounting_workflow_before_simple_rent_expense_posting",
    explanationKey: "ifrs16-lessee-rou-liability-warning",
  },
] as const;
```

Expected validation message:

```text
This posting may not follow IFRS 16. A qualifying lessee lease normally requires right-of-use asset and lease liability recognition, not simple rent expense only. Route this transaction through the lease accounting workflow.
```

This rule is a **warning** at Production Candidate maturity. It may become `blocking` only after Accounting, Leasing, and Finance policy owners approve workflow enforcement.

---

## 4.10 Explanation Registry

**Authority:** PAS-003 §4.10
**Implementation:** `packages/accounting-standards/src/explanations/accounting-standard-explanation.registry.ts`
**Slice gate:** B10

The explanation registry provides user-facing and AI-assistant-facing explanations.

It supports:

* UI drawers.
* Tooltips.
* Validation messages.
* Audit evidence summaries.
* AI assistant grounded explanations.

Explanation entries must include:

```ts
export interface AccountingStandardExplanation {
  readonly explanationKey: string;
  readonly title: string;
  readonly plainLanguageSummary: string;
  readonly whyItMatters: readonly string[];
  readonly recommendedAction: string;
  readonly boundaryStatement: string;
  readonly authorityRefs: readonly AccountingStandardVersionRef[];
}
```

All AI assistant responses using this package must cite registry-backed evidence, not invent accounting advice.

---

## 4.11 Audit Evidence Snapshot

**Authority:** PAS-003 §4.11
**Implementation:** `packages/accounting-standards/src/evidence/accounting-standard-evidence-snapshot.contract.ts`
**Slice gate:** B11

When a standards-backed warning/block is shown, consumers may store an immutable evidence snapshot.

Minimum shape:

```ts
export interface AccountingStandardEvidenceSnapshot {
  readonly ruleId: string;
  readonly standardCode: string;
  readonly standardTitle: string;
  readonly edition: string;
  readonly effectiveFrom: string;
  readonly retrievedAt: string;
  readonly sourceUrl: string;
  readonly authorityStatus: string;
  readonly explanationKey: string;
}
```

This proves what standard/version was used at validation time.

---

# 5. What This Package Must Never Own

`@afenda/accounting-standards` must never own:

* General ledger posting execution.
* Journal entry persistence.
* Chart of accounts ownership.
* Ledger mutation.
* Financial statement generation.
* Consolidation computation.
* Ownership percentage calculation.
* Control percentage calculation.
* Non-controlling-interest calculation.
* Goodwill calculation.
* Intercompany markup rate calculation.
* Transfer-pricing policy.
* Tax computation or filing.
* Bank reconciliation.
* Payment execution.
* Invoice posting.
* ERP UI behavior.
* AI free-form accounting judgment.
* Unversioned standard references.
* Long copied IFRS standard text.
* Legal or professional-advice final sign-off.

---

# 6. Package Structure Standard

## 6.0 Current package tree (skeleton — delivered)

```text
packages/accounting-standards/
├── PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md   # tombstone → docs/PAS
├── package.json
├── tsconfig.json
├── tsconfig.vitest.json
├── vitest.config.ts
└── src/
    ├── index.ts                                         # fingerprint + version only (B0)
    └── __tests__/
        └── architecture-boundary.test.ts
```

Authority registries and validators in §6.1 are **Target** — deliver in slices B1–B11.

## 6.1 Target package tree

```text
packages/accounting-standards/
├── package.json
├── tsconfig.json
├── PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md
└── src/
    ├── index.ts
    ├── standards/
    │   ├── accounting-standard-family.registry.ts
    │   ├── accounting-standard.contract.ts
    │   ├── accounting-standard.registry.ts
    │   ├── standard-version.contract.ts
    │   ├── standard-version.registry.ts
    │   └── ifrs/
    │       ├── ifrs-authority-version.registry.ts
    │       ├── ifrs-standard.registry.ts
    │       ├── ifrs-9-financial-instruments.registry.ts
    │       ├── ifrs-10-consolidation.registry.ts
    │       ├── ifrs-11-joint-arrangements.registry.ts
    │       ├── ifrs-12-disclosure-interests.registry.ts
    │       ├── ias-28-associates-jv.registry.ts
    │       ├── ifrs-16-leases.registry.ts
    │       └── ifrs-18-presentation-disclosure.registry.ts
    ├── routing/
    │   ├── standard-process-route.contract.ts
    │   └── standard-process-routing.registry.ts
    ├── rules/
    │   ├── posting-validation-input.contract.ts
    │   ├── posting-validation-rule.contract.ts
    │   ├── posting-validation-result.contract.ts
    │   └── posting-validation-engine.ts
    ├── explanations/
    │   ├── accounting-standard-explanation.contract.ts
    │   └── accounting-standard-explanation.registry.ts
    ├── evidence/
    │   └── accounting-standard-evidence-snapshot.contract.ts
    └── __tests__/
        ├── accounting-standard-family-registry.test.ts
        ├── accounting-standard-registry.test.ts
        ├── standard-version-registry.test.ts
        ├── standard-process-routing.test.ts
        ├── ifrs-16-lease-posting.test.ts
        └── architecture-boundary.test.ts
```

## 6.2 Required exports

Public exports may include:

```ts
export type {
  AccountingStandardFamily,
  AccountingStandardRegistryEntry,
  AccountingStandardVersionRef,
  AccountingStandardPostingValidationInput,
  AccountingStandardPostingRule,
  AccountingStandardValidationResult,
  AccountingStandardEvidenceSnapshot,
  AccountingStandardExplanation,
};

export {
  ACCOUNTING_STANDARD_FAMILIES,
  ACCOUNTING_STANDARD_REGISTRY,
  ACCOUNTING_STANDARD_VERSION_REGISTRY,
  STANDARD_PROCESS_ROUTING,
  validatePostingAgainstAccountingStandards,
};
```

## 6.3 Forbidden structure

Forbidden:

```text
packages/accounting-standards/src/ledger/
packages/accounting-standards/src/journal-posting/
packages/accounting-standards/src/database/
packages/accounting-standards/src/ui/
packages/accounting-standards/src/tax-filing/
packages/accounting-standards/src/consolidation-calculation/
packages/accounting-standards/src/intercompany-pricing/
packages/accounting-standards/src/ai-advice/
```

---

# 7. Decision Matrix

| Question                                                           | If yes →                                | In this package? |
| ------------------------------------------------------------------ | --------------------------------------- | ---------------- |
| Does this define versioned IFRS/MFRS/SFRS/GAAP authority metadata? | Add standard/version registry record.   | **Yes**          |
| Does this map a process to a potentially relevant standard?        | Add process-routing entry.              | **Yes**          |
| Does this return pass/info/warning/block for a posting draft?      | Add validation rule/result contract.    | **Yes**          |
| Does this explain why a posting may conflict with a standard?      | Add explanation registry entry.         | **Yes**          |
| Does this store cited evidence version for audit?                  | Add evidence snapshot contract.         | **Yes**          |
| Does this post the actual journal entry?                           | Belongs to Accounting.                  | **No**           |
| Does this mutate ledger balances?                                  | Belongs to Accounting.                  | **No**           |
| Does this calculate consolidation entries?                         | Belongs to Consolidation.               | **No**           |
| Does this calculate tax payable or filing values?                  | Belongs to Tax.                         | **No**           |
| Does this set transfer-pricing markup rates?                       | Belongs to Intercompany/Finance policy. | **No**           |
| Does this render UI drawers or forms?                              | Belongs to Metadata UI / apps/erp.      | **No**           |
| Does this generate AI accounting advice without registry evidence? | Prohibited.                             | **No**           |
| Does this define Kernel tenant/company identity?                   | Belongs to Kernel.                      | **No**           |
| Does this encode IFRS/MFRS treatment logic inside Kernel?          | Belongs here or Accounting runtime.     | **No** (Kernel)  |

---

# 8. Contract Rules

All Accounting Standards contracts must satisfy:

1. TypeScript strict mode.
2. `readonly` on contract properties.
3. JSON-serializable contracts (`JsonValue` from `@afenda/kernel` for open payloads).
4. No side effects on import.
5. No database access.
6. No UI imports.
7. No journal mutation.
8. No hidden accounting posting behavior.
9. No unversioned standard references.
10. Every rule must have `ruleId`.
11. Every rule must have `standardCode`.
12. Every rule must have standard-version evidence.
13. Every rule must have deterministic input/output behavior.
14. Every validation result must include user-safe explanation text.
15. Every warning/block must include authority references.
16. No large copyrighted standard text copied into source.
17. Summary and paraphrase only unless allowed by license.
18. AI assistant explanations must be grounded in the registry.
19. Consumers own final accounting policy and posting decision.
20. Audit snapshots must preserve evidence version used at validation time.
21. A Production Candidate rule may warn before it blocks.
22. Blocking rules require explicit owner approval and workflow proof.

---

# 9. Runtime Rules

This package is **contracts-only with pure validation**.

Approved runtime primitives:

* Static registries.
* Pure mapping functions.
* Pure validation functions.
* Deterministic rule evaluation.
* Explanation lookup.
* Evidence snapshot creation.

Forbidden runtime behavior:

* Database reads/writes.
* Journal posting.
* Ledger mutation.
* Tax filing.
* Consolidation execution.
* UI rendering.
* Network calls at validation time.
* AI model calls inside validator.
* Environment secret usage.

Allowed flow:

```text
Posting draft
→ accounting-standards.validate(...)
→ pass / info / warning / blocked
→ consumer package decides workflow action
→ audit stores evidence snapshot
```

Forbidden flow:

```text
Posting draft
→ accounting-standards
→ writes journal / mutates ledger / files tax
```

---

# 10. Implementation Sequence

Recommended order:

1. ~~Register package in Architecture Authority.~~ **Done**
2. ~~Create PAS-003 and package-local pointer.~~ **Done**
3. ~~Create package skeleton.~~ **Done (B0)**
4. Add standard family registry.
5. Add standard/version contracts.
6. Add IFRS authority version registry.
7. Add initial IFRS standard registry.
8. Add Kernel relationship-to-standard routing.
9. Add posting validation input/rule/result contracts.
10. Add IFRS 16 lease posting validation proof.
11. Add explanation registry.
12. Add audit evidence snapshot contract.
13. Wire consuming packages only after contracts are stable.

**Do not add in this package:**

* Kernel identity/context brands.
* Actual accounting journal posting.
* General ledger tables.
* Consolidation calculation.
* Tax filing workflows.
* UI components.
* AI prompt-only accounting decisions.

---

# 11. Enterprise Acceptance Criteria

A change is accepted only when all criteria pass.

## 11.1 Architecture

* Package is registered in Architecture Authority.
* Package has clear dependency direction.
* Package does not import consumers.
* Package remains Foundation layer.
* Package remains contracts-only with pure validation.
* No journal posting or database mutation exists in package.
* Each standard reference has version metadata.
* Every warning/block has evidence.

## 11.2 Type Safety

* All public contracts are readonly.
* Validation results are closed unions.
* Standard codes are typed.
* Rule IDs are stable.
* Evidence snapshots are serializable.
* No loose string standard references in rule records.
* No `any` in public contracts.

## 11.3 Governance

* Every standard reference has source URL, edition, effective date, retrieved date, and authority status.
* Every warning/block has rule ID.
* Every warning/block has authority reference.
* Every rule has downstream owner.
* Every rule has boundary statement.
* Superseded/amended standards are not silently reused.
* Standard version changes require explicit slice/update entry.
* Production Candidate status must not be represented as Enterprise Accepted.

## 11.4 Runtime Safety

* Validators are deterministic.
* Validators do not call network.
* Validators do not call AI models.
* Validators do not write database.
* Validators do not post journals.
* Validators return evidence, not hidden mutation.
* Consumers decide whether warnings block workflow unless severity is explicitly `blocking`.

## 11.5 ERP Readiness

* ERP can show “why this matters” explanations.
* AI assistant can cite registry-backed evidence.
* Accounting posting workflow can call validation before posting.
* Audit can store evidence snapshots.
* Relationship classifications from Kernel route to standards consistently.
* IFRS 18 future-effective state can be represented before it becomes mandatory.
* Local standard packs such as MFRS/SFRS can be added without changing Kernel.

## 11.6 Production Candidate Exit Criteria

PAS-003 may remain `Production Candidate` only if:

* The package boundary is approved.
* Required contracts are defined.
* Initial standard registries are planned.
* Rule validation shape is defined.
* Gates are known.
* Missing implementation is explicitly marked.

PAS-003 may move to `Enterprise Accepted` only when:

* Package exists on disk.
* Package registry entry is active.
* Typecheck passes.
* Tests pass.
* Architecture gates pass.
* IFRS version registry exists.
* At least one IFRS rule proof exists.
* At least one consumer workflow stores or displays an evidence snapshot.
* Docs/PAS, package-local pointer, and Architecture Authority registry are synchronized.

---

# 12. Slice Catalog

| Slice file                                      | ID  | PAS § | Status      | Type           | Prerequisite     |
| ----------------------------------------------- | --- | ----- | ----------- | -------------- | ---------------- |
| `b0-package-skeleton.md`                        | B0  | §6    | Delivered   | Implementation | PAS-003 accepted |
| `b1-4.1-accounting-standard-family-registry.md` | B1  | §4.1  | Not started | Implementation | B0               |
| `b2-4.2-accounting-standard-registry.md`        | B2  | §4.2  | Not started | Implementation | B1               |
| `b3-4.3-standard-version-registry.md`           | B3  | §4.3  | Not started | Implementation | B1–B2            |
| `b4-4.4-standard-process-routing.md`            | B4  | §4.4  | Not started | Implementation | B1–B3            |
| `b5-4.5-posting-validation-input-contracts.md`  | B5  | §4.5  | Not started | Implementation | B1–B4            |
| `b6-4.6-posting-validation-rule-contracts.md`   | B6  | §4.6  | Not started | Implementation | B5               |
| `b7-4.7-validation-result-contract.md`          | B7  | §4.7  | Not started | Implementation | B6               |
| `b8-4.8-ifrs-rule-pack.md`                      | B8  | §4.8  | Not started | Implementation | B1–B7            |
| `b9-4.9-ifrs-16-lease-posting-proof.md`         | B9  | §4.9  | Not started | Implementation | B8               |
| `b10-4.10-explanation-registry.md`              | B10 | §4.10 | Not started | Implementation | B8–B9            |
| `b11-4.11-audit-evidence-snapshot.md`           | B11 | §4.11 | Not started | Implementation | B9–B10           |
| `b12-11-enterprise-acceptance-sync.md`          | B12 | §11   | Not started | Governance     | B1–B11           |

Slice naming: `b<N>-<pas-section>-<slug>.md`.

Handoff format: 9 fields — see `pas-slice-template.md`.

---

# 13. Required Gates

## 13.1 Required

Run before accepting any `@afenda/accounting-standards` change:

```bash
pnpm --filter @afenda/accounting-standards typecheck
pnpm --filter @afenda/accounting-standards test:run
pnpm quality:architecture
pnpm architecture:cycles
pnpm architecture:drift
pnpm quality:boundaries
```

If package folder does not exist yet, the package-local gates are deferred, but Architecture Authority gates remain required.

## 13.2 Recommended

```bash
pnpm quality
pnpm check:documentation-drift
pnpm check:accounting-standard-version-registry
pnpm check:accounting-standard-rule-evidence
```

Recommended gates become required when implemented for affected slices.

## 13.3 Promotion rules

* Recommended gates must not block CI until implemented.
* Once implemented, recommended gates become required for affected slices.
* Missing future gates must not block unrelated source-only cleanup.
* Standard-version drift checks become required once the version registry exists.
* Rule evidence checks become required once posting validation rules exist.
* Enterprise Accepted promotion requires runtime consumer proof.

---

# 14. Reusable Package Guardrail Template

See `docs/PAS/README.md` for how to create a new PAS.

Reusable template:

```text
.cursor/skills/kernel-authority/reference/pas-template.md
```

Each package authority standard should have:

* one canonical PAS document
* one visible maturity label
* one agent skill adapter: `.cursor/skills/<package-name>-authority/SKILL.md`
* one optional package-local tombstone pointer
* no duplicated long-form authority outside `docs/PAS/`
* runtime gates that prove the package boundary
* slice catalog entries for serialized delivery

For this PAS, expected companion files are:

```text
docs/PAS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md
packages/accounting-standards/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md
.cursor/skills/accounting-standards-authority/SKILL.md
.cursor/skills/accounting-standards-authority/reference/package-structure.md
.cursor/skills/accounting-standards-authority/reference/authority-surfaces.md
```

The package-local file should be a pointer or tombstone, not duplicated full authority, unless Architecture Authority explicitly approves package-local duplication.

---

# 15. Final Doctrine

`@afenda/accounting-standards` is the standards-backed process authority for financial-reporting rules. It turns IFRS/MFRS/SFRS/GAAP references into versioned, cited, deterministic validation metadata that Accounting, Consolidation, Intercompany, Tax, Finance, Reporting, UI, and AI assistant features can use consistently.

> **May belong here:** standard version registries, IFRS/MFRS/SFRS/GAAP authority metadata, rule IDs, posting-validation contracts, standard-to-process routing, cited explanation metadata, audit evidence snapshot contracts.

> **Belongs outside:** actual journal posting, ledger mutation, tax filing, consolidation entries, transfer-pricing calculation, financial-statement generation, UI rendering, AI-only accounting judgment.

Kernel owns **identity and relationship vocabulary**.
Accounting Standards owns **versioned standards truth and validation rules**.
Accounting owns **journals and ledgers**.
Consolidation owns **group calculation**.
Intercompany owns **markup and elimination policy**.
Tax owns **tax treatment and filing**.
UI/AI own **explanation delivery grounded in this package**.

---

# Appendix A — Borrow reference inventory (temporary)

> **Status:** Temporary research appendix · **not Enterprise Accepted authority**
> **Purpose:** Guide B1–B11 implementation slices with prior art from the `pohlai88` org and selected OSS pattern repos.
> **Reviewed:** 2026-06-27 (GitHub MCP code search)
> **Rule:** Borrow **shapes, enums, citation patterns, and rule IDs** only. Do not copy ledger posting, full standard text, or runtime engines into `@afenda/accounting-standards`. Remove or fold this appendix into slice handoffs once B12 governance sync closes.

## A.1 Scope of this appendix

| Label | Meaning |
| --- | --- |
| **Tier A** | Safe pattern borrow into `@afenda/accounting-standards` (metadata + validation contracts) |
| **Tier B** | Borrow rule/evidence shape only — do not import runtime or ledger logic |
| **Tier C** | Monitoring / build-time ideas — not runtime package code |
| **Exclude** | Do not borrow — wrong layer or prohibited by PAS-003 §5 |

Official IFRS/MFRS/SFRS text remains **cite + paraphrase only** ([IFRS Foundation](https://www.ifrs.org/issued-standards/list-of-standards/), MASB for MFRS). Never embed full standard prose in source.

## A.2 Self repo — `pohlai88/afenda-Xerp`

GitHub code search returned **no indexed hits** as of 2026-06-27 (local PAS-003 / B0 skeleton not yet pushed).

| Local path | Status | PAS slice |
| --- | --- | --- |
| `docs/PAS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md` | Canonical authority | Publish |
| `packages/accounting-standards/src/index.ts` | B0 skeleton | B0 ✓ |
| `.cursor/skills/accounting-standards-authority/` | Skill adapter | B0 ✓ |

## A.3 Org prior art — `pohlai88/*` (primary borrow pool)

### Tier A — port patterns into accounting-standards

| Repository | Path | Borrow for | Target PAS § / slice |
| --- | --- | --- | --- |
| [aibos-erp](https://github.com/pohlai88/aibos-erp) | `packages/accounting/src/types/standards.ts` | `StandardReference`, `StandardCrosswalk`, `Jurisdiction`, compliance report shapes | §4.2–§4.3 · B2–B3 |
| [NEXUS-KERNEL](https://github.com/pohlai88/NEXUS-KERNEL) | `src/manifest.ts` | `BusinessStandardSchema` enum (`IFRS`, `MFRS`, `LOCAL`, `INTERNAL`) | §4.1 · B1 |
| [AIBOS-METADATA](https://github.com/pohlai88/AIBOS-METADATA) | `metadata-studio/seed/standard-packs/finance-ifrs-core.csv` | Standard pack keys (`MFRS15_REVENUE`, etc.) | §4.4 · B4 |
| [AFENDA-NEXUS](https://github.com/pohlai88/AFENDA-NEXUS) | `docs/ifrs-kpmg-generator.md` | `FinancialStatementAST`, localization layer (IFRS → MFRS/SFRS/MPERS) | Build-time generator · post-B8 |
| [AFENDA-NEXUS](https://github.com/pohlai88/AFENDA-NEXUS) | `packages/modules/finance/src/slices/lease/calculators/sale-leaseback.ts` | IFRS 16 cited pure calculator pattern | §4.9 · B9 |
| [AFENDA-NEXUS](https://github.com/pohlai88/AFENDA-NEXUS) | `packages/modules/finance/src/slices/gl/calculators/parallel-ledger.ts` | Multi-GAAP parallel ledger **vocabulary** (not runtime) | Consumer reference only |
| [smart-ledger-pro](https://github.com/pohlai88/smart-ledger-pro) | `src/lib/schemas.ts` | `AccountingStandardSchema` enum | §4.1 · B1 |
| [AI-BOS-Finance](https://github.com/pohlai88/AI-BOS-Finance) | `apps/kernel/src/metadata-studio/seed/standard-packs/finance-ifrs-core.csv` | Extended finance standard packs (tier1/tier2) | §4.4 · B4 |

### Tier B — evidence / rule shape only

| Repository | Path | Borrow | Do not borrow |
| --- | --- | --- | --- |
| [AIBOS-PLATFORM](https://github.com/pohlai88/AIBOS-PLATFORM) | `kernel/finance/compliance/mfrs-ifrs-validator.ts` | `ruleId`, `requirement`, severity union, validation result shape | GL account / journal validation runtime |
| [aibos_v6_vanilla](https://github.com/pohlai88/aibos_v6_vanilla) | `packages/backend/ledger/domain/mfrs_compliance_engine.py` | `MFRSStandard` enum list, `MFRSRule` / disclosure dataclass shapes | SQLite engine, `eval()` custom logic, ledger DB |
| [aibos-erp](https://github.com/pohlai88/aibos-erp) | `packages/accounting/src/services/intercompany-validator.utility.ts` | IFRS 10 / MFRS 10 citation on validation messages | IC mirroring calculation |
| [aibos-erpBOS](https://github.com/pohlai88/aibos-erpBOS) | `ui-runbook/M44-MULTI-GAAP-LOCAL-STAT.md` | ASEAN IFRS/MFRS/SFRS/MPERS matrix vocabulary | UI runbook prose as authority |

### Tier C — monitoring / ingestion ideas

| Repository | Path | Use |
| --- | --- | --- |
| [aibos_backend](https://github.com/pohlai88/aibos_backend) | `scripts/regulatory_monitor.py` | MASB RSS (`masb.org.my`) for MFRS version drift alerts → §4.3 `retrievedAt` / `authorityStatus` |
| [AFENDA-NEXUS](https://github.com/pohlai88/AFENDA-NEXUS) | `docs/ifrs-kpmg-generator.md` | Build-time PDF→AST pipeline (KPMG illustrative FS) — **not** runtime package |

## A.4 External OSS — pattern references (not dependencies)

No drop-in npm IFRS registry library was found. Useful **pattern** repos:

| Repository | Path | Borrow for | Target slice |
| --- | --- | --- | --- |
| [erpax/erpax](https://github.com/erpax/erpax) | `src/ifrs/16/` (`types.ts`, `validate.ts`, `translations.ts`) | Modular IFRS 16 package layout + tests | B8–B9 |
| [teren-papercutlabs/jaz-ai](https://github.com/teren-papercutlabs/jaz-ai) | `cli/src/core/calc/lease.ts` | Paragraph cites (IFRS 16.26, 36–37, 31–32), pure calculator | B9 |
| [marchouze/scrooge](https://github.com/marchouze/scrooge) | `prototype/platform/semantic/ifrs-classification-entries.ts` | `ifrsRef: "IAS 1 §54"` citation chains, semantic entry registry | B10–B11 |
| [stefbach/v0-lexora-accounting-saa-s](https://github.com/stefbach/v0-lexora-accounting-saa-s) | `lib/accounting/leases-ifrs16.ts` | Short IFRS 16 lessee exemption summary | B9 |
| [kjteng/LeaseReg-Software](https://github.com/kjteng/LeaseReg-Software) | *(repo root)* | MFRS 16 Malaysia lease domain vocabulary | B9 (MFRS lane) |
| [nclamvn/Viet-ERP](https://github.com/nclamvn/Viet-ERP) | `apps/Accounting/src/lib/vas/ifrs-mapping.ts` | Local GAAP → IFRS mapping `adjustmentType` enum | B4 (future LOCAL_POLICY) |
| [ilias-m-n/ExtractAccStds_GPT_MP](https://github.com/ilias-m-n/ExtractAccStds_GPT_MP) | `utility/prompts.py` | Build-time standard-name extraction prompts | Generator tooling only |

## A.5 Explicit exclusions (do not borrow into this package)

| Source | Reason |
| --- | --- |
| `mfrs_compliance_engine.py` runtime engine | Ledger-coupled, DB persistence, wrong layer |
| `mfrs-ifrs-validator.ts` in kernel/compliance path | GL validation belongs in Accounting runtime |
| KPMG/PwC/Deloitte illustrative PDF body text | Copyright — summary + URL cite only (PAS-003 §8.16–§8.17) |
| Full IASB XBRL taxonomy files | External authority evidence; store edition + URL, not embedded taxonomy |
| Angular/Java ERP modules (e.g. `ghacupha/erp-client`) | UI/runtime modules — pattern ideas only |

## A.6 Suggested slice → borrow map

| Slice | Primary borrow source | Deliverable in `packages/accounting-standards/` |
| --- | --- | --- |
| B1 | `NEXUS-KERNEL/manifest.ts` + PAS-003 §4.1 | `accounting-standard-family.registry.ts` |
| B2–B3 | `aibos-erp/standards.ts` | Standard + version contracts/registries |
| B4 | PAS-003 routing + `AIBOS-METADATA` CSV pack keys | `standard-process-routing.registry.ts` |
| B5–B7 | PAS-003 §4.5–§4.7 + Tier B result shapes | Validation input/rule/result contracts |
| B8–B9 | `erpax/ifrs/16` or `jaz-ai/lease.ts` | IFRS 16 rule pack + warning proof |
| B10–B11 | `scrooge/ifrs-classification-entries.ts` | Explanation + evidence snapshot contracts |

## A.7 Appendix retirement

Remove or archive this appendix when:

* B1–B11 slices cite their borrow sources in individual `docs/PAS/slice/*.md` handoffs, and
* B12 enterprise-acceptance sync confirms no agent treats this appendix as canonical authority.

Until then, agents may read Appendix A for **implementation hints only** — PAS §0–§15 and slice handoffs remain the authority.
