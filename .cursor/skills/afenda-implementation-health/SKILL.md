---
name: afenda-implementation-health
description: Full-stack implementation health audit and repair for approved Afenda packages or features. Runs review, repair, normalize, serialize, stabilize, and report. Use after pas-codebase-bridge or after an approved PAS/FDR slice to close implementation gaps, fix recurring errors, run gates, and return a completeness table plus git diff.
disable-model-invocation: true
---

# Afenda Implementation Health

## Purpose

This skill repairs and stabilizes an **approved** Afenda package, feature, PAS slice, or FDR slice.

It runs a 6-phase implementation health loop:

```text
review → repair → normalize → serialize → stabilize → report
```

It detects repeated error patterns across files, fixes implementation gaps, normalizes code to Afenda patterns, verifies wire safety, runs gates, and returns a completeness report plus diff summary.

Use this skill **after**:

* `/pas-codebase-bridge` has produced a completeness matrix, or
* the user has approved one serialized implementation slice, or
* a PAS/FDR already defines the exact scope.

---

## Hard stop

Do not use this skill to decide architecture ownership.

Architecture ownership must already be decided by:

```text
PAS
FDR
package authority skill
pas-codebase-bridge audit
explicit user approval
```

This skill repairs and stabilizes an approved implementation scope.

Do not implement more than one serialized slice at a time.
Do not mix documentation repair, source refactor, consumer migration, and governance wiring unless the approved slice explicitly includes them.
Do not create ADR/FDR/TIP ceremony unless explicitly requested.
Do not expand scope because nearby gaps are found. Report extra gaps separately.
Do not run full-repo formatting or broad autofix commands unless explicitly approved. Avoid commands such as `pnpm lint --fix`, `biome check --write .`, or package-wide codemods unless they are part of the approved slice.

---

## When to use this skill

Use this skill when asked to:

* repair implementation gaps
* stabilize a package
* resolve recurring errors
* normalize code after a PAS/FDR slice
* close completeness gaps
* run final gates
* produce a git diff report
* fix identical error patterns across many files
* verify a slice is complete

Common invocations:

```text
/afenda-implementation-health Kernel Slice 1 — Primitive Identity + LocalizationContext
/afenda-implementation-health Stabilize @afenda/kernel after PAS-001 Slice 2
/afenda-implementation-health Fix repeated branded-ID type errors in kernel
```

---

## Phase 0 — Implementation scope contract

Before editing, state:

```text
1. Approved source  — PAS/FDR/bridge report/user-approved slice
2. Scope            — exact package/app/folders allowed
3. Objective        — one sentence
4. Files allowed    — explicit file list or folder list
5. Files forbidden  — explicit forbidden package/app/source areas
6. Gates            — commands that must pass before completion
7. Output           — completeness table + git diff stat
```

If the approved scope is ambiguous, choose the smallest safe implementation slice and state what is excluded.

---

## Working tree safety

Before editing, inspect the working tree:

```bash
git status --short
```

If unrelated uncommitted changes exist, do not overwrite, reformat, or move them. State the existing changes and restrict edits to the approved slice files only.

Do not run full-repo formatting or broad autofix commands unless explicitly approved. Avoid commands such as:

```bash
pnpm lint --fix
biome check --write .
```

or package-wide codemods unless they are part of the approved slice.

---

## Required read order

Read in this order:

1. Approved slice / PAS / FDR / bridge report
2. Relevant package authority skill
   Example: `.cursor/skills/kernel-authority/SKILL.md`
3. Relevant reference docs
4. `afenda-coding-session` rules if available
5. Current source files
6. Existing tests
7. Consumer files only if approved scope includes consumer migration

---

## Phase 1 — Review

Review the approved scope across these dimensions.

| Dimension        | What to find                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Boundary         | Layer violations, registry gaps, unapproved dependency edges, deep imports                         |
| Type safety      | `any`, unsafe `as`, unbranded IDs, missing `readonly`, source-incompatible helper patterns         |
| Wire safety      | `Date`, `Map`, `Set`, function, class instance, `unknown` payloads in cross-package wire contracts |
| Test coverage    | New source files without tests, changed exports without export tests, untested branch behavior     |
| Identical errors | Same violation repeated across 3+ files                                                            |
| Completeness     | Approved slice requirements missing or partial in source                                           |
| Consumer impact  | Approved consumer files compile and follow new contracts                                           |

Output a numbered violation list:

```text
[BLOCK/WARN/GAP] [Dimension] file:line — issue
```

Severity:

| Severity | Meaning                                                         |
| -------- | --------------------------------------------------------------- |
| `BLOCK`  | Typecheck/build/boundary failure or violation of approved scope |
| `WARN`   | Type/wire/test risk that should be repaired in this slice       |
| `GAP`    | Approved slice item not yet implemented                         |

---

## Phase 2 — Repair

Repair in this priority order:

1. `BLOCK`
2. `WARN`
3. `GAP`

Never mix unrelated priority levels in one edit group.

Do not weaken PAS, FDR, package authority skills, or acceptance criteria to make current implementation appear complete. If source cannot satisfy the approved standard within the approved scope, report `Partial` or `Blocked`.

### Routing table

| Violation type                 | Repair pattern                                                |
| ------------------------------ | ------------------------------------------------------------- |
| Registry gap / layer violation | Follow monorepo discipline; do not bypass registries          |
| Type error                     | Fix the source type; avoid `any` and avoid unsafe casts       |
| Branded ID missing             | Follow existing package brand/helper pattern                  |
| Wire-unsafe contract           | Replace with JSON-safe primitives or `JsonValue`/`JsonObject` |
| Missing test                   | Add or update colocated test suite                            |
| Identical pattern across files | Fix canonical utility/type first, then all call sites         |
| Completeness gap               | Implement only the approved PAS/FDR slice item                |
| Consumer type break            | Update consumer only if consumer scope was approved           |

### Identical error rule

When the same pattern appears in 3 or more files:

```text
1. Identify the root pattern.
2. Fix the canonical type/helper/contract first.
3. Apply the fix consistently to all occurrences in the approved scope.
4. Add one regression test where possible.
```

---

## Phase 3 — Normalize

Normalize repaired code to Afenda standards.

| Area                            | Normalize by                          |
| ------------------------------- | ------------------------------------- |
| Branded IDs                     | Existing package brand helper style   |
| Kernel contracts                | `kernel-authority` contract rules     |
| API contracts                   | `api-contract` skill rules            |
| Server Actions / route handlers | server action/security rules          |
| Drizzle/database                | database migration/schema rules       |
| React/Next UI                   | React ERP quality rules               |
| CSS/Tailwind                    | Afenda CSS/design-system rules        |
| Observability                   | Observability logger/audit rules      |
| Tests                           | Existing test pattern in same package |

Do not invent a new pattern when a local package pattern already exists.

Do not replace existing source conventions with greenfield examples from docs.

---

## Phase 4 — Serialize

Check every cross-package contract touched by this slice.

Wire-unsafe examples:

```ts
// Not wire-safe
readonly createdAt: Date;
readonly metadata: Map<string, unknown>;
readonly compute: () => void;
readonly payload: unknown;

// Wire-safe
readonly createdAt: string;
readonly metadata: JsonObject;
readonly payload: JsonObject;
```

Required checks:

* exported kernel context contracts
* exported event contracts
* API response contracts
* audit payload contracts
* storage metadata contracts
* any cross-package interface

If strict JSON utility types do not exist yet, do not invent them outside the approved scope. Record the gap.

---

## Phase 5 — Stabilize

Run scope gates first, then broader gates.

### Scope gates

Use the package/app scope.

```bash
pnpm --filter <scope> typecheck
pnpm --filter <scope> test:run
```

### Common Afenda gates

```bash
pnpm quality:boundaries
pnpm architecture:cycles
pnpm architecture:drift
```

### Architecture/package gates, when relevant

```bash
pnpm quality:architecture
pnpm check:foundation-disposition
pnpm quality:kernel-context-surface
pnpm check:accounting-domain-contracts
```

### Optional/future gates

Only run these if they exist in `package.json` or scripts:

```bash
pnpm check:kernel-propagation-isolation
pnpm check:kernel-events-wire-serializable
pnpm check:kernel-zero-runtime-deps
```

Before running optional gates, verify the command exists in root `package.json`, package `package.json`, or `scripts/governance/`.

If an optional gate does not exist, mark it as `NOT AVAILABLE`, not `FAIL`.

Rules:

* Every required gate must exit 0.
* If a gate fails, repair within approved scope and re-run.
* If a gate fails outside approved scope, report it separately and do not expand scope without approval.
* Do not claim completion if gates were not run.

For every gate, record whether it was:

- baseline before edit
- after repair
- not run
- not available

---

## Phase 6 — Report

Return these sections.

### 1. Completion verdict

```text
Complete / Partial / Blocked
```

### 2. Completeness table

| Approved item | Required | Status   | File   | Notes  |
| ------------- | -------: | -------- | ------ | ------ |
| <item>        |      Yes | Complete | <path> | <note> |
| <item>        |      Yes | Missing  | —      | <note> |
| <item>        |      Yes | Partial  | <path> | <note> |

### 3. Repairs made

| File   | Change    | Reason   |
| ------ | --------- | -------- |
| <path> | <summary> | <reason> |

### 4. Gates

| Gate                              | Result            | Notes  |
| --------------------------------- | ----------------- | ------ |
| `pnpm --filter <scope> typecheck` | PASS/FAIL/NOT RUN | <note> |

### 5. Remaining risks

| Risk   | Severity        | Follow-up     |
| ------ | --------------- | ------------- |
| <risk> | BLOCK/WARN/INFO | <next action> |

### 6. Git diff summary

Run:

```bash
git diff --stat
```

Present the stat summary inline.

Offer the full diff only if requested.

### 7. Confidence matrix

| Claim   | Confidence | Basis                     |
| ------- | ---------: | ------------------------- |
| <claim> |    <0–95%> | <file/test/gate evidence> |

Confidence must not exceed 95%.

---

## Final response rules

* Be explicit about what changed.
* Be explicit about what did not change.
* Be honest about gates not run.
* Do not claim enterprise acceptance without passing required gates.
* Do not claim runtime completeness for target-only surfaces.
* Do not expand scope silently.
