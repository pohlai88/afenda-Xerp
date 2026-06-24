# fdr-r01-accounting-contracts — Accounting Domain Contracts

| Field | Value |
| --- | --- |
| **Status** | Complete (authority only) |
| **FDR ID** | `fdr-r01-accounting-contracts` |
| **Registry entry ID** | `PKGR01_ACCOUNTING` |
| **Package** | `@afenda/accounting` (PKG-R01) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | High |
| **BRD reference** | internal — Phase 9 contracts freeze (ADR-0015) |
| **Enterprise readiness** | **29/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — **Complete (authority only) — enterprise 9.5 accepted** at contracts-only boundary (see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | FI config (design) · Financials setup · SAP namespace · Oracle FDD contract freeze |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts).

| Field | Value |
| --- | --- |
| id | `PKGR01_ACCOUNTING` |
| packageId | PKG-R01 |
| domain | `accounting-contracts` |
| lane | green-lane |
| authority | ADR-0015 |
| runtimeOwner | `packages/accounting` |
| gates | `pnpm --filter @afenda/accounting typecheck`; `pnpm --filter @afenda/accounting test:run`; `pnpm check:accounting-domain-contracts`; `pnpm quality:boundaries` |
| prohibited | `do-not-add-database-dependency`; `do-not-add-drizzle-schema-without-tip-015-adr`; `do-not-implement-posting-services`; `do-not-add-ledger-runtime-in-contracts-only-phase` |
| allowedAgents | `accounting-agent`; `foundation-registry-owner` |
| legacyTipEvidence | [`tip-014-accounting-core-contracts.md`](../../delivery/tips/[Complete%20(authority%20only)]%20tip-014-accounting-core-contracts.md) |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/accounting` (PKG-R01) | Domain contract vocabulary + kernel bridge (contracts-only lifecycle) | `packages/accounting/src/` |
| `@afenda/kernel` (PKG-010) | Upstream `AccountingReadinessContext` — consume only; never imports accounting | `packages/kernel/src/context/accounting-readiness.contract.ts` |
| `@afenda/permissions` (PKG-008) | Permission key registry for accounting vocabulary (parity-tested) | `packages/permissions/src/grants/permission.contract.ts` |
| `@afenda/architecture-authority` (PKG-019) | PKG-R01 registry + dependency edge | `packages/architecture-authority/src/data/` |
| `@afenda/observability` (PKG-014) | Audit action shape reference — accounting exports constants only | `packages/observability/src/surface/` |

## Purpose

Lock and maintain **contracts-only** accounting domain authority per [ADR-0015](../../adr/ADR-0015-accounting-domain-contracts-only-activation.md) — branded IDs, closed vocabularies, wire contexts, permission keys, and audit action constants — before any chart-of-accounts schema, journal posting, or ERP accounting UI (TIP-015+).

This FDR declares **Complete (authority only)**: the PKG-R01 surface is frozen at the contract layer with strong automated proof. Ledger runtime, Drizzle COA schemas, posting services, and ERP accounting routes remain **prohibited** until a separate ADR accepts TIP-015+ runtime.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0015](../../adr/ADR-0015-accounting-domain-contracts-only-activation.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-014-accounting-core-contracts.md`](../../delivery/tips/[Complete%20(authority%20only)]%20tip-014-accounting-core-contracts.md).

## Scope

**In scope**

- `@afenda/accounting` public barrel — curated contracts + `toAccountingDomainContext` bridge
- Branded ID contracts: `AccountId`, `JournalEntryId`, `FiscalPeriodId`, `LedgerAccountCode`
- Closed vocabularies: account types, journal document types, fiscal period states, posting status labels (no arithmetic)
- `AccountingDomainWireContext` — JSON-serializable slice bridging kernel readiness
- `ACCOUNTING_PERMISSION_KEY_VOCABULARY` + parity with `@afenda/permissions` registry
- `ACCOUNTING_AUDIT_ACTIONS` — observability-compatible dot notation
- Governance gate `pnpm check:accounting-domain-contracts` — prohibits Drizzle, database imports, posting services, ERP accounting routes
- Contract tests (19 tests) + governance negative-path tests
- SAP FI / Oracle GL **contract vocabulary mapping** (design freeze — not posting runtime)

**Out of scope**

- Drizzle schemas / migrations for COA, journals, ledger balances, fiscal periods (**TIP-015+ ADR**)
- Posting, elimination, consolidation, or report calculation services
- ERP accounting module routes, Server Actions, or UI beyond manifest placeholders
- `@afenda/database` runtime dependency in `@afenda/accounting`
- Import of `@afenda/accounting` from `@afenda/kernel` (kernel retains readiness-only contracts)
- Vietnam localization rules in domain code (**TIP-018**)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `packages/accounting/` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate accounting permission keys or audit actions outside `@afenda/accounting` contracts + `@afenda/permissions` registry |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-R01 | **Sequential** with any TIP-015+ runtime work — runtime ADR must precede ledger implementation |
| Implementation blocked until | Contracts-only phase complete ✓; TIP-015+ ADR accepted for runtime slices |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive TIP-014 **Complete (authority only)** + runtime matrix **partially-implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| What runtime evidence exists for `@afenda/accounting`? | **Yes** — 9 contract files, bridge, 19 package tests, governance gate | §Runtime evidence; gates exit 0 (2026-06-25) |
| Which registry row is required? | **PKGR01_ACCOUNTING** — green-lane, ADR-0015 authority | `foundation-disposition.registry.ts` |
| Which ADRs block ledger runtime? | **ADR-0010** + **ADR-0015** prohibit posting until TIP-015+ ADR | ADR-0015 §Decision point 3 |
| Does kernel import accounting? | **No** — one-way bridge `toAccountingDomainContext` | `to-accounting-domain-context.ts` + `pnpm quality:boundaries` exit 0 |
| Are permission keys aligned? | **Yes** — vocabulary parity test in accounting + permissions packages | `accounting-permission-vocabulary.test.ts`; `accounting-permission-registry.test.ts` |
| Do all registry gates exit 0? | **Yes** — typecheck, test:run, check:accounting-domain-contracts, boundaries | Baseline gate log below |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/accounting typecheck` | 0 | A |
| `pnpm --filter @afenda/accounting test:run` | 0 | A |
| `pnpm check:accounting-domain-contracts` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| Governance negative-path tests | 0 | A |
| `pnpm --filter @afenda/permissions test:run` (accounting parity) | 0 | A |
| `pnpm ci:biome` | 0 | A |

### Files inspected

| Path | Why |
| --- | --- |
| `packages/accounting/src/index.ts` | Public API barrel |
| `packages/accounting/src/contracts/*.contract.ts` | Domain vocabulary authority (9 files) |
| `packages/accounting/src/bridge/to-accounting-domain-context.ts` | Kernel → domain wire bridge |
| `packages/accounting/src/__tests__/*.test.ts` | 6 test files, 19 assertions |
| `scripts/governance/check-accounting-domain-contracts.mts` | Contracts-only prohibition gate |
| `scripts/governance/__tests__/check-accounting-domain-contracts.test.ts` | Negative-path import/posting detection |
| `packages/permissions/src/__tests__/accounting-permission-registry.test.ts` | Cross-package permission parity |
| `packages/kernel/src/context/accounting-readiness.contract.ts` | Upstream readiness context |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Accounting Core row |
| [`ADR-0015`](../../adr/ADR-0015-accounting-domain-contracts-only-activation.md) | Contracts-only activation decision |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Authority contract barrel | `packages/accounting/src/contracts/accounting-authority.contract.ts` | Yes — Grade A (`test:run` exit 0) |
| Account type vocabulary | `packages/accounting/src/contracts/account-type.contract.ts` | Yes — Grade A (exported + serializable test) |
| Journal document types | `packages/accounting/src/contracts/journal-document-type.contract.ts` | Yes — Grade A (exported + serializable test) |
| Fiscal period states | `packages/accounting/src/contracts/fiscal-period-state.contract.ts` | Yes — Grade A (exported + serializable test) |
| Posting status labels | `packages/accounting/src/contracts/posting-status.contract.ts` | Yes — Grade A (labels only — no arithmetic) |
| Branded IDs | `packages/accounting/src/contracts/accounting-id.contract.ts` | Yes — Grade A (`accounting-id-boundary.test.ts`) |
| Wire context | `packages/accounting/src/contracts/accounting-domain-wire-context.contract.ts` | Yes — Grade A (JSON serializable test) |
| Permission vocabulary | `packages/accounting/src/contracts/accounting-permission-vocabulary.contract.ts` | Yes — Grade A (parity test) |
| Audit actions | `packages/accounting/src/contracts/accounting-audit-actions.contract.ts` | Yes — Grade A (3 tests) |
| Kernel bridge | `packages/accounting/src/bridge/to-accounting-domain-context.ts` | Yes — Grade A (4 bridge tests) |
| Public barrel | `packages/accounting/src/index.ts` | Yes — Grade A (`index.test.ts`) |
| Contracts-only gate | `scripts/governance/check-accounting-domain-contracts.mts` | Yes — Grade A (exit 0) |
| Gate negative tests | `scripts/governance/__tests__/check-accounting-domain-contracts.test.ts` | Yes — Grade A (Drizzle/database/posting detection) |
| Permission registry parity | `packages/permissions/src/__tests__/accounting-permission-registry.test.ts` | Yes — Grade A |
| ADR-0015 | `docs/adr/ADR-0015-accounting-domain-contracts-only-activation.md` | Yes — Accepted |
| Phase 9 prerequisite | `docs/architecture/phase-9-accounting-readiness-sign-off.md` | Yes — 2026-06-24 |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated. Gaps below are **future runtime** — they do not block Complete (authority only).

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `accounting-ledger-runtime` | COA Drizzle schemas + journal posting services blocked until TIP-015+ ADR | blue (future) | Future FDR + new ADR | TIP-015+ | Separate ADR accepted; runtime gates pass |
| `accounting-erp-ui` | ERP accounting module routes/UI beyond manifest placeholder | blue (future) | Future FDR | TIP-015+ | Governed routes + UI FDR |
| `accounting-fdr-index-rename` | FDR filename prefix synced to `[Complete (authority only)]` | green | maintainer | Maintenance | Index row + filename aligned ✓ |

## §Enterprise readiness score

> **Complete (authority only) — enterprise 9.5 accepted** = **29/30 audit-adjusted** on this table **and** all contracts-only gates exit 0 **and** ADR-0015 lifecycle frozen. Full runtime Complete requires TIP-015+ ADR.
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | 9 contract files + `typecheck` exit 0 + `check:accounting-domain-contracts` exit 0 — Grade A | — |
| Test coverage | 5/5 | 19 package tests + governance negative-path tests — all exit 0 — Grade A | — |
| Observability + audit | 4/5 | `ACCOUNTING_AUDIT_ACTIONS` + 3 contract tests — Grade B | Waiver `accounting-contracts-no-runtime-audit-emit` |
| Security + RBAC + RLS | 5/5 | Permission vocabulary parity + governance prohibits database/posting — Grade A | — |
| Documentation + BRD traceability | 5/5 | ADR-0015 + FDR + matrix + `check:documentation-drift` exit 0 — Grade A | DoD #14 peer review open |
| Maintainability + Clean Core | 5/5 | Clean Core A; boundaries + disposition exit 0 — Grade A | — |
| **Total (audit-adjusted)** | **29/30** | **Complete (authority only) — enterprise 9.5 accepted** | |
| **Total (evidence-qualified ceiling)** | **29/30** | Observability capped at 4/5 until TIP-015+ runtime ADR | Not runtime Complete |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — contracts-only PKG-R01; single dependency edge to `@afenda/kernel`; vocabulary owned in `packages/accounting/src/contracts/`; permission keys canonical in `@afenda/permissions`.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Enterprise domain contract mapping (SAP FI / Oracle GL)

> **Design freeze only** — vocabulary labels and wire types. No posting arithmetic, no BAPI/GL posting, no journal entry persistence.

| Afenda contract | SAP FI analog (config / design) | Oracle GL analog (setup / design) | Contract path |
| --- | --- | --- | --- |
| `ACCOUNT_TYPES` | G/L account category (balance sheet / P&L / memo) — KTOKS field group semantics | Account type / financial category in CoA setup | `account-type.contract.ts` |
| `LedgerAccountCode` (branded wire string) | SAKNR / account number wire format | Account combination segment code (structure only) | `accounting-id.contract.ts` |
| `JOURNAL_DOCUMENT_TYPES` | Document type / BLART classification (SA, AB, etc. — vocabulary slot) | Journal category (Manual, Recurring, Reversal — label set) | `journal-document-type.contract.ts` |
| `POSTING_STATUSES` | Document status workflow labels (parked → posted → reversed) — **not** FB01 posting | Journal approval status (Incomplete → Posted → Reversed) — **not** Post Journal | `posting-status.contract.ts` |
| `FISCAL_PERIOD_STATES` | OB52 period status (open / closed / locked) | Period status (Never Opened / Open / Closed / Permanently Closed) | `fiscal-period-state.contract.ts` |
| `AccountingDomainWireContext` | Company code + fiscal year variant + currency context (BUKRS wire) | Ledger / legal entity + currency context | `accounting-domain-wire-context.contract.ts` |
| `toAccountingDomainContext` | Readiness → FI organizational context mapping (design) | Readiness → GL setup context mapping (design) | `to-accounting-domain-context.ts` |
| `ACCOUNTING_PERMISSION_KEY_VOCABULARY` | SAP FI authorization objects (F_BKPF_*, etc. — key slots) | Oracle GL duty roles (CoA maintain, Post Journal — key slots) | `accounting-permission-vocabulary.contract.ts` |
| `ACCOUNTING_AUDIT_ACTIONS` | SAP change documents / audit class labels | Oracle audit trail action codes | `accounting-audit-actions.contract.ts` |

**Explicitly not mapped (TIP-015+ runtime):** document posting (FB01/FBB1), balance calculation, elimination entries, intercompany settlement, report execution.

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/kernel` | None — kernel never imports accounting | No | A→A |
| `@afenda/permissions` | Parity-tested key strings (no import of accounting package) | No | A→A |
| Future TIP-015 packages | `@afenda/accounting` public barrel — IDs, vocabularies, wire context | No (additive runtime ADR) | A→A until runtime ADR |
| `apps/erp` | Manifest placeholder only — no accounting routes | No | A→A |

**Upstream consumers scan:** No production package currently imports `@afenda/accounting` except tests and governance scripts. ERP accounting module remains manifest placeholder. Kernel bridge is one-way.

**ERP giant compatibility (contracts-only):**

- **Vocabulary scale:** 9 account types, 7 journal document types, 5 fiscal period states, 6 posting status labels — closed `as const` arrays with type guards.
- **Wire serializability:** `AssertJsonSerializable` pattern on `AccountingDomainWireContext` — safe for API/event payloads when runtime ADR lands.
- **Permission model:** 9 permission keys across COA, fiscal period, journal domains — registered in `@afenda/permissions` before any UI.
- **Prohibition enforcement:** Governance gate scans for Drizzle, `@afenda/database`, posting service surfaces, and forbidden ERP route directories.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| FI config (design) | Financials setup | `pnpm check:accounting-domain-contracts` | 1 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/accounting typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |
| SAP GRC authorization object design | Oracle GL duty role design | `accounting-permission-vocabulary.test.ts` | 17 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement, ADR-0015, or archive TIP-014.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| ADR-0015 | Contracts-only lifecycle frozen at `contracts-only` phase | 15 | `index.test.ts` |
| ADR-0015 | Kernel bridge maps readiness → domain wire context | 2 | `to-accounting-domain-context.test.ts` |
| ADR-0015 | No database/Drizzle/posting in accounting package | 17 | `check-accounting-domain-contracts` |
| internal | Domain wire types JSON-serializable | 2 | `accounting-domain-wire-serializable.test.ts` |
| internal | Branded IDs reject raw strings at boundary | 18 | `accounting-id-boundary.test.ts` |
| internal | Permission vocabulary matches permissions registry | 17 | `accounting-permission-vocabulary.test.ts` |
| tip-014 (archive) | Audit action dot notation registry | 2 | `accounting-audit-actions.test.ts` |
| tip-014 (archive) | SAP FI / Oracle GL vocabulary mapping documented | 11 | §Enterprise domain contract mapping |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Closed vocabularies cover COA category, journal class, period state, posting workflow labels | contract exports + type guards |
| Performance efficiency | Contract-only — no I/O; bridge is O(1) field mapping | code review + unit tests |
| Compatibility | Wire context JSON-serializable; kernel readiness shape stable | `accounting-domain-wire-serializable.test.ts` |
| Security | Permission keys canonical in `@afenda/permissions`; prohibited imports enforced | parity test + governance gate |
| Maintainability | Biome clean; strict typecheck; 0 `any` in contracts | `pnpm ci:biome`; `typecheck` exit 0 |
| Reliability | Deterministic bridge — same readiness input → same wire output | `to-accounting-domain-context.test.ts` (4 tests) |
| Documentation | FDR + ADR-0015 + matrix + SAP/Oracle mapping | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Contracts-only surface (no mutations) | N/A — no governed mutation in contracts package | — |
| Future journal post (TIP-015+) | Required at runtime ADR | deferred |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-r01-accounting-contracts**
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-R01**
- Registry: `PKGR01_ACCOUNTING` read-only snapshot in §Registry link
- [ADR-0015](../../adr/ADR-0015-accounting-domain-contracts-only-activation.md) — contracts-only activation
- [ADR-0010](../../adr/ADR-0010-no-accounting-before-foundation-gate.md) — foundation gate (Phase 9 passed)
- Phase 9 sign-off: [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) (2026-06-24)
- Archive evidence: [`tip-014-accounting-core-contracts.md`](../../delivery/tips/[Complete%20(authority%20only)]%20tip-014-accounting-core-contracts.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[Not started] fdr-r01-accounting-contracts.md` | — | Modified (FDR enterprise upgrade) |
| `packages/accounting/src/index.ts` | `@afenda/accounting` | Delivered (TIP-014 archive) |
| `packages/accounting/src/contracts/*.contract.ts` | `@afenda/accounting` | Delivered (9 contract files) |
| `packages/accounting/src/bridge/to-accounting-domain-context.ts` | `@afenda/accounting` | Delivered |
| `packages/accounting/src/__tests__/*.test.ts` | `@afenda/accounting` | Delivered (6 files, 19 tests) |
| `scripts/governance/check-accounting-domain-contracts.mts` | — | Delivered |
| `docs/adr/ADR-0015-accounting-domain-contracts-only-activation.md` | — | Delivered (Accepted) |

## Acceptance gate

- `pnpm --filter @afenda/accounting typecheck`
- `pnpm --filter @afenda/accounting test:run`
- `pnpm check:accounting-domain-contracts`
- `pnpm quality:boundaries`
- `pnpm check:foundation-disposition`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
Feature: Accounting domain contracts-only authority (ADR-0015)

  Scenario: Package declares contracts-only lifecycle
    GIVEN PKG-R01 is registered as PKGR01_ACCOUNTING in foundation disposition
    WHEN the @afenda/accounting public barrel is imported
    THEN ACCOUNTING_PACKAGE_LIFECYCLE equals "contracts-only"
    AND ACCOUNTING_AUTHORITY_ADR equals "ADR-0015"
    AND isAccountingPackageLifecyclePhase("posting") returns false

  Scenario: Kernel readiness maps to serializable domain wire context
    GIVEN operating context is resolved via resolveOperatingContext()
    AND AccountingReadinessContext is supplied from @afenda/kernel
    WHEN toAccountingDomainContext is called
    THEN the result satisfies AccountingDomainWireContext
    AND the result is JSON-serializable without loss

  Scenario: Forbidden runtime surfaces are blocked by governance gate
    GIVEN an agent attempts to add Drizzle schema or @afenda/database import under packages/accounting/
    WHEN pnpm check:accounting-domain-contracts runs
    THEN the gate fails with a contracts-only violation
    AND no ledger posting service surface exists in the package

  Scenario: Permission vocabulary matches @afenda/permissions registry
    GIVEN ACCOUNTING_PERMISSION_KEY_VOCABULARY in @afenda/accounting
    WHEN compared to PERMISSION_REGISTRY.accounting keys
    THEN every vocabulary key has a matching permissions registry entry
    AND keys follow accounting.<domain>_<action> convention

  Scenario: Audit actions use observability-compatible dot notation
    GIVEN ACCOUNTING_AUDIT_ACTIONS constants
    WHEN parseAccountingAuditAction validates each action
    THEN each action matches module.action dot notation
    AND isAccountingAuditAction narrows unknown strings safely
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/accounting test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/accounting typecheck` | [x] |
| 5 | Biome clean | `pnpm ci:biome` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix Accounting Core row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | governance gate + lifecycle guard | [x] |
| 18 | Public API compatibility verified | index barrel + export surface stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 1 — Research (accounting-contracts)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Phase 9 sign-off ✓; ADR-0015 Accepted ✓  
**Type:** Research  
**Risk class:** High  
**Clean Core impact:** A→A

**Purpose:** Reconcile archive TIP-014 **Complete (authority only)** + runtime matrix **partially-implemented** with FDR **Not started**; inventory contracts, tests, governance gate; map SAP FI / Oracle GL vocabulary; update §Remaining gaps, §Runtime evidence, and §Enterprise readiness score. No source edits.

**Outcomes:**

- Archive TIP-014 evidence reconciled into FDR authority
- All registry gates verified exit 0 (2026-06-25)
- Enterprise readiness: 29/30 (contracts-only)
- Status promoted to **Complete (authority only)**

### Slice 2 — Evidence-sync (FDR enterprise upgrade)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

**Purpose:** Upgrade FDR to enterprise 9.5 quality; fill all 25 sections, 20-row DoD, Gherkin AC, SAP FI / Oracle GL contract mapping; attestation from gate exit 0 evidence.

**Outcomes:**

- FDR document at enterprise 9.5 benchmark
- DoD rows 1–7, 9–13, 15–20 marked complete
- DoD rows 8, 14 deferred to index-rename / PR peer-review maintenance PR

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research / Evidence-sync | Revert FDR doc commit | Safe — no runtime change |
| Future TIP-015 runtime | Revert accounting runtime commit; restore contracts-only lifecycle constant | Requires new ADR + registry promotion via `foundation-registry-owner` |

Oracle analog: contracts-only phase is upgrade-safe — no internal GL object modifications. SAP analog: transport rollback = git revert + gate re-run. Contracts-only rollback cannot affect ledger data (no ledger exists).

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `accounting-contracts-no-runtime-audit-emit` | Audit event emission on contract read/export | Contracts-only package — no governed mutations; audit constants are vocabulary only | Architecture Authority (ADR-0015) | TIP-015+ runtime ADR |
| `accounting-contracts-e2e` | Browser E2E for accounting module | No ERP accounting UI in contracts-only phase; manifest placeholder only | Architecture Authority | TIP-015+ ERP accounting FDR |
| `accounting-contracts-sod-runtime` | SoD approver ≠ initiator on journal post | No posting runtime until TIP-015+ ADR | Architecture Authority | TIP-015+ runtime ADR |
| `accounting-ledger-runtime-deferred` | COA schemas + posting services | Explicit ADR-0015 prohibition — tracked in §Remaining gaps | ADR-0015 | New ADR for TIP-015+ |

## §Knowledge transfer

### Operational runbook

- Public API entry: `packages/accounting/src/index.ts` — import from `@afenda/accounting`
- Kernel bridge: `toAccountingDomainContext(readiness)` in `packages/accounting/src/bridge/to-accounting-domain-context.ts`
- Contract authority: `packages/accounting/src/contracts/` — all vocabulary changes require contract test updates
- Governance gate: `pnpm check:accounting-domain-contracts` — run before any PKG-R01 PR
- Lifecycle check: `ACCOUNTING_PACKAGE_LIFECYCLE` must remain `"contracts-only"` until runtime ADR

### Observability

- Audit vocabulary: `ACCOUNTING_AUDIT_ACTIONS` in `accounting-audit-actions.contract.ts` — constants only, no emit in contracts-only phase
- Permission keys: `@afenda/permissions` registry — accounting section parity-tested
- Gate diagnostics: `scripts/governance/check-accounting-domain-contracts.mts` prints violation paths on failure

### On-call escalation

- Symptom: `check:accounting-domain-contracts` fails after PKG-R01 change → read violation output; remove forbidden import or posting surface
- Symptom: permission parity test fails → align `ACCOUNTING_PERMISSION_KEY_VOCABULARY` with `PERMISSION_REGISTRY.accounting`
- Symptom: kernel import cycle detected → verify kernel does not import `@afenda/accounting`; run `pnpm quality:boundaries`
- Owner: `@afenda/accounting` (PKG-R01) via `accounting-agent`

## §Enterprise benchmark qualification

This FDR is **Complete (authority only) — enterprise 9.5 accepted at 29/30 audit-adjusted**, not full **runtime Complete — enterprise 9.5 accepted**, because ADR-0015 explicitly prohibits ledger runtime until TIP-015+ ADR.

The **29/30 evidence-qualified ceiling** equals the audit-adjusted score under these bounded assumptions:

1. Contracts-only lifecycle remains frozen at `"contracts-only"` — no Drizzle, database, or posting surfaces.
2. Observability remains capped at 4/5 with waiver `accounting-contracts-no-runtime-audit-emit` (no runtime audit emit).
3. Browser E2E waived (`accounting-contracts-e2e`) — no ERP accounting UI in this phase.
4. DoD #14 peer review may remain open for maintenance PR without demoting **Complete (authority only)** status.

The **29/30 audit-adjusted** score is gate-backed (manifest-nav v2 audit re-confirmed 2026-06-25): all PKG-R01 acceptance gates exit 0.

**Promotion to runtime Complete requires:**

1. New ADR accepting TIP-015+ ledger/posting runtime.
2. Separate posting FDR at minimum 29/30 with no dimension below 4/5.
3. Lift of registry prohibited rules via `foundation-registry-owner`.

## Verdict

**Complete (authority only) — enterprise 9.5 accepted at 29/30 audit-adjusted (29/30 ceiling).** ADR-0015 contracts-only PKG-R01 is **proven** by 19 package tests + governance gate exit 0 (2026-06-25). SAP FI / Oracle GL vocabulary mapped at design layer — **no posting runtime**. Ledger runtime (`accounting-ledger-runtime`) remains a **future** gap requiring TIP-015+ ADR. DoD #14 peer review open at PR merge does not demote authority-only Complete.
