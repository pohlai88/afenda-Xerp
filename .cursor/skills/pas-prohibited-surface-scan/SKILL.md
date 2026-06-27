---
name: pas-prohibited-surface-scan
description: Scans an Afenda package for exports, functions, types, and patterns that the Package Authority Standard explicitly prohibits being in that package. Complements pas-codebase-bridge (which finds what is missing) by finding what should not be present. Use when asked to find violations, audit what does not belong, review boundary pollution, check "what should not be in kernel", or confirm a package is clean before a governance gate.
disable-model-invocation: true
---

# PAS Prohibited Surface Scan

## Purpose

`pas-codebase-bridge` asks: **what is missing?**

This skill asks the inverse: **what is present that the PAS says must not exist here?**

The skill answers:

```text
Which exports violate the PAS "must never own" list?
Which functions encode decisions the package is forbidden to make?
Which types belong to a different layer?
Which imports violate the boundary (including self-imports via package name)?
Which governance / repo-layout logic lives in source files instead of scripts?
Which IDs slip in through allowed sub-domains while being explicitly forbidden at platform floor?
Which patterns the skill checkers don't flag — and why?
```

This skill is **read-only by default**. Do not edit source. Do not implement. Do not propose ADR ceremony.

---

## Core principle — name scans are evidence, not final judgment

A function or type name can trigger review, but final severity must be assigned only after checking:

1. Canonical PAS
2. Package authority skill (`Hard stops`, `Kernel must never own`)
3. Current source pattern and context
4. Relevant FDR / registry entry if present

Pattern names create **suspicion**. PAS / current source authority decides **violation**.

---

## When to use this skill

```text
/pas-prohibited-surface-scan @afenda/kernel
/pas-prohibited-surface-scan packages/permissions PAS-003
"what doesn't belong in kernel?"
"find violations the skill doesn't flag"
"audit boundary pollution in packages/accounting"
```

---

## Phase 0 — Scope contract

Before scanning, state:

```text
1. PAS source         — exact canonical PAS file
2. Package scope      — packages/X/src/**
3. Audit mode         — prohibition scan only, read-only
4. Source truth       — what is exported/importable in source today
5. Output             — prohibition matrix + blind-spot report + priority list
```

---

## Required read order

1. Canonical PAS `§ Must Never Own` and `§ Decision Matrix` sections — build the Prohibition Profile
2. Package-authority skill SKILL.md — read `Hard stops` and `Kernel must never own` lists
3. `package.json` exports map — enumerate every public entrypoint
4. Root barrel (`src/index.ts`) + all subpath barrels — every `export function`, `export const`, `export interface`
5. Each source file in scope — look for violation patterns (see §Scan dimensions below)
6. Governance scripts and gates — understand what IS already caught, so you only report what is NOT

---

## Prohibition Profile construction

From the PAS, extract two lists:

**Forbidden behaviors** (verbs the package must not perform):

```text
Example for @afenda/kernel:
- resolve / load / fetch data (database, HTTP, session, auth)
- format / localise / render (date, number, label, display string)
- decide (currency choice, fiscal calendar, period status)
- evaluate (permissions, flags, entitlements)
- dispatch / publish / schedule (events, outbox, jobs)
- post / calculate / eliminate (accounting runtime)
- navigate / render UI (app shell, React components)
```

**Forbidden or review-required ID/type families** for `@afenda/kernel`:

```text
- Fiscal calendar / fiscal period platform IDs:
  Prohibited as general platform IDs unless canonical PAS approves them.
  If found inside approved `erp-domain/accounting` contracts, classify as REVIEW and verify against PAS/FDR.

- Locale/timezone/date/number selected values:
  Kernel may own vocabulary and LocalizationContext shape.
  Kernel must not own selected user/company/location preference resolution or formatting behavior.

- Currency decision context:
  Kernel may own CurrencyCode.
  Kernel must not own functional/base/reporting currency decisions, exchange-rate policy, or conversion.

- Operational snapshots / diagnostics:
  REVIEW by default.
  Allowed only if PAS explicitly defines them as stable cross-package gate contracts.

- Full permission evaluation records:
  Prohibited.
  Kernel may own vocabulary only.

- AppShell-specific display structs:
  Prohibited unless they are true cross-package context contracts.
```

---

## Scan dimensions

### Dimension A — Exported function prohibition check

For every `export function` and `export const = { ... }` in the package:

Ask: does this function **perform a forbidden behavior** per the prohibition profile?

| Function pattern | Suspicion class | Verify before labeling |
|-----------------|-----------------|------------------------|
| `resolve*`, `load*`, `fetch*` | Data loading — app/database layer | Is it pure derivation from wire input? If yes, may be allowed |
| `format*`, `*Label`, `*Display*` | Presentation/formatting red flag | Does it produce user-facing display text? If yes, WARN. Pure ID canonicalization may be allowed |
| `decide*`, `resolve*Currency`, `*Fallback` | Business decision red flag | Is it a pure projection from already-trusted input? If yes, verify PAS permits it |
| `is*`, `assert*`, `check*` (business rules) | Business validation | Is it a brand/contract invariant guard? If yes, allowed |
| `spawn*`, `dispatch*`, `publish*` | Execution runtime | Check if PAS allows any runtime primitive |
| `evaluate*`, `require*Permission` | Permission evaluation | Belongs to `@afenda/permissions` unless vocabulary only |
| `get*From*`, `find*By*` | Data query | Belongs to persistence layer |

**Exception — always allowed:** `is*` and `assert*` that enforce brand/contract invariants (e.g., `assertExecutionContext`, `isBrandedId`) are vocabulary guards, not business rules.

**Exception — always allowed:** Pure derivation helpers from already-trusted wire input with no DB/HTTP access (e.g., `deriveConsolidationScopeContext`). Verify no data loading occurs.

**`format*` rule:** Classify as violation only if the function produces presentation text, localized output, UI copy, or user-facing display behavior. Pure canonicalization of IDs or wire-safe values may be allowed if PAS explicitly permits it.

**`resolve*Currency` rule:** It is a violation if it selects, defaults, loads, converts, or decides currency policy. It may be allowed only if it is a pure projection from already-trusted input and PAS explicitly allows that helper.

---

### Dimension B — Forbidden type/ID presence

For every `export type` and `export interface`:

Ask: does this type belong to a **forbidden or review-required category** per the prohibition profile?

Red flags requiring verification:

```text
- ID types the PAS "not approved" list names explicitly (FiscalCalendarId, FiscalPeriodId)
  → Prohibited as general platform-floor IDs
  → If found inside an approved `erp-domain/accounting` contract: classify REVIEW, not automatic BLOCK;
    verify against canonical PAS/erp-domain accounting authority before escalating

- Operational snapshot shapes (live run results, gate telemetry, diagnostic evidence)
  → REVIEW by default; WARN/BLOCK only when not listed as approved authority surfaces or
    when they carry runtime telemetry/persistence concerns into a contracts-only package

- Full resolved permission records (as opposed to permission vocabulary)
- Resolved user/company/currency selection values (as opposed to primitive brands)
- AppShell-specific display structs that don't cross package boundaries
```

---

### Dimension C — Self-import via package name

Grep for:

```bash
from "@afenda/<package-name>"
```

inside `packages/<package-name>/src/**`.

Every hit is a **BLOCK**. A package must import from itself using relative paths only. Self-import via package name hides true dependency structure, breaks monorepo link resolution under some tools, and makes circular dependency risk invisible.

---

### Dimension D — Repo governance logic in source

Scan for:

```text
existsSync, readFileSync, readdirSync  — in non-test source files
FORBIDDEN_PACKAGE_DIRS                  — directory scaffold policy
assertMustNotExist                      — repo layout enforcement
```

These are governance-script concerns. If they appear in `src/**` (not `__tests__/**`), that logic belongs in `scripts/governance/` or `packages/architecture-authority`, not in the package's own source.

**Exception:** When used only in `__tests__/**` to verify authority registry entries against the file system — test-time validation is acceptable.

---

### Dimension E — Runtime in a contracts-only package

If the PAS declares the package "contracts-only" or "vocabulary-only":

Scan for:

```text
new Date()           — live timestamp generation (vocabulary packages must not decide "now")
crypto.randomUUID()  — ID generation at runtime (belongs to creator/factory layer)
AsyncLocalStorage    — unless the PAS explicitly approves one runtime primitive
fetch, axios, node:http  — any HTTP
process.env access   — environment decisions belong to app/config layer
```

For `@afenda/kernel`, `AsyncLocalStorage` and `crypto.randomUUID()` are **explicitly approved** by PAS-001 §4.11 and §4.3. Document why each one is allowed. Any others are violations.

---

### Dimension F — Duplicate authority across packages

Check whether the same type, function, or vocabulary exists in:

- The target package AND another live package in the monorepo

When a duplicate is found, identify which is canonical per PAS/FDR/registry and flag the other as `DRIFT` or `WARN`. Do not automatically assume either is correct — verify against current PAS authority.

---

### Dimension G — Blind spots the import gate misses

The standard boundary gate (`quality:boundaries`) only catches **prohibited imports**. Enumerate what it does NOT catch:

| Blind spot | Why the gate misses it | Detection method |
|-----------|------------------------|-----------------|
| Presentation helpers (format, label) | No import — logic is local | Dimension A function name scan |
| Currency decision functions | No prohibited import needed | Dimension A behavior classification |
| Fiscal IDs through erp-domain/accounting module | Module is allowed; gate checks folder not contents | Dimension B ID family check |
| Self-import via package name | Not a cross-package import | Dimension C grep |
| Repo scaffold guards in source | Use only stdlib (`node:fs`) | Dimension D pattern scan |
| Operational diagnostic types | No import — types are local | Dimension B snapshot pattern |
| Duplicate package authority | Each package valid in isolation | Dimension F cross-package check |

---

## Severity labels

| Severity | Meaning |
|----------|---------|
| `BLOCK` | Violates explicit PAS prohibition; import gate may miss it; agent may propagate the wrong pattern |
| `WARN` | Outside PAS scope; not immediately harmful; creates drift over time |
| `REVIEW` | Suspicious pattern that may be allowed by PAS/current source authority; requires verification before labeling as violation |
| `INFO` | Naming or organisation smell; does not cross authority boundary |

---

## Prohibition matrix template

Output a table per Dimension with a row per finding:

| Dimension | Item | File | Suspicion | Severity | Correct home |
|-----------|------|------|-----------|----------|--------------|
| C | `from "@afenda/kernel"` | `packages/kernel/src/**` | Self-import via package name | BLOCK | Relative import |
| D | `existsSync` in non-test source | `packages/*/src/**` | Repo governance logic in source | WARN | `scripts/governance/` or `architecture-authority` |
| A | `format*Label()` | source file | Presentation helper; verify behavior | REVIEW | UI/appshell if user-facing |
| A | `resolve*Currency()` | source file | Currency decision red flag; verify if pure projection | REVIEW | Finance/accounting authority if decision logic |
| B | `FiscalCalendarId` general platform | source file | General platform fiscal ID not approved | BLOCK/REVIEW | Finance/accounting authority; REVIEW if inside approved erp-domain/accounting |
| B | Operational snapshot type | source file | Diagnostic contract; verify PAS approval | REVIEW | ERP/observability if runtime telemetry |
| F | Duplicate vocabulary | two packages | Duplicate authority | WARN/BLOCK | Canonical PAS/FDR owner |

For `Correct home`: prefer `approved Finance/Accounting authority surface, per current PAS/FDR/registry` over naming a specific package, unless the canonical owner is unambiguously confirmed in PAS or registry.

---

## Blind-spot report template

After the matrix, output a section explaining what the existing gates catch vs miss:

```text
### What existing gates catch
- quality:boundaries — prohibited imports (cross-package only)
- check:kernel-zero-runtime-deps — runtime dependencies in package.json
- check:kernel-events-wire-serializable — DomainEvent payload types
- check:accounting-domain-contracts — no posting/ledger runtime

### What this scan caught that gates missed
- [list items from matrix]

### Recommended gate additions
- [commands or script ideas that would automate catching the above]
```

---

## Priority list (end of output)

Close with a ranked list of the three highest-priority findings, each as a single actionable statement.

Format:

```text
Priority 1 (BLOCK): [item] — [why it violates PAS §X]; verify against [PAS section/FDR] before removing.
Priority 2 (REVIEW): [item] — [suspicion]; requires PAS authority check before labeling final severity.
Priority 3 (WARN): [item] — [drift risk]; schedule cleanup slice after authority confirmation.
```

Do not name a specific package as "correct home" unless the canonical owner is confirmed in PAS or registry.

---

## Kernel-specific anti-pattern catalogue

Reference for `@afenda/kernel` scans. See `reference/kernel-anti-patterns.md` for the full table.

Quick lookup — common false-safe patterns in kernel and how to classify them:

| Pattern | Looks allowed | Suspicion | Final verdict requires |
|---------|--------------|-----------|----------------------|
| `resolveReporting*` | "pure derivation" | Currency decision red flag | Verify: pure projection or business fallback? |
| `format*Label` | "pure string helper" | Presentation formatting red flag | Verify: user-facing display or wire-safe canonicalization? |
| `FiscalPeriodId` inside `erp-domain/accounting/` | "accounting vocabulary" | PAS §4.1 "not approved" as general platform ID | REVIEW if in approved erp-domain accounting contract; BLOCK if exposed as general platform ID |
| `is*OrganizationUnit(type)` | "vocabulary guard" | Business classification rule | Verify: brand invariant or domain policy? |
| Operational snapshot types | "contracts" | Diagnostic/telemetry output | REVIEW; WARN/BLOCK only if not in approved PAS authority surface |
| `from "@afenda/kernel"` in kernel | "just an import" | Self-import via package name | BLOCK — no exceptions; always use relative path |
