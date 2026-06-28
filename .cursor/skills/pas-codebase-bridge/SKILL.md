---
name: pas-codebase-bridge
description: Audits an Afenda Package Authority Standard against the actual monorepo source. Produces a source-truth completeness matrix, drift list, current-vs-target classification, consumer-impact summary, and next serialized slice recommendation without editing code.
disable-model-invocation: true
paths:
  - docs/PAS/**
  - packages/**
---

# PAS Codebase Bridge

## Purpose

This skill bridges a canonical Package Authority Standard, such as PAS-001, against the actual Afenda source tree.

It answers:

```text
What does the PAS require?
What currently exists in source?
What is missing?
What is partial?
What is only target/proposed?
What documentation contradicts source truth?
What consumer impact exists?
What serialized slice should run next?
```

This skill is **audit-only by default**.

Do not edit source code.
Do not implement missing features.
Do not mark target items complete.
Do not rewrite architecture decisions.
Do not create ADR/PAS ceremony.
Do not run repair loops.
Do not produce git diff unless edits were explicitly requested and performed.
Do not run destructive, mutating, or long-running commands unless explicitly requested. Prefer static file inspection first. If gates are needed, list them as recommended verification commands instead of running them.

---

## When to use this skill

Use this skill when asked to:

* bridge PAS against code
* compare PAS vs source
* verify implementation completeness
* audit package authority compliance
* check current vs target
* find PAS drift
* prepare implementation slices
* validate a package before coding
* review whether actual codebase matches a package authority standard

Common invocations:

```text
/pas-codebase-bridge PAS-001 @afenda/kernel
/pas-codebase-bridge docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md packages/kernel
/pas-codebase-bridge compare kernel-authority skill against source
```

---

## Phase 0 — Scope contract

Before auditing, state:

```text
1. PAS source      — exact PAS/PAS/skill file being audited
2. Code scope      — exact package/app/source folders being compared
3. Consumer scope  — packages/apps that may import the target package
4. Mode            — audit-only, no edits
5. Source truth    — actual code wins over examples/proposals
6. Output          — completeness matrix + drift list + next slice recommendation
```

If the user gives an ambiguous scope, infer the smallest safe package scope and state it.

---

## Required read order

If the canonical PAS file cannot be found, stop and report:

```text
BLOCK — canonical PAS missing
```

Do not infer package authority from skill adapters, reference docs, or draft notes alone.

Read in this order:

1. Canonical PAS file
   Example: `docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md`

2. Relevant skill adapter
   Example: `.cursor/skills/kernel-authority/SKILL.md`

3. Relevant reference docs
   Example:

   * `.cursor/skills/kernel-authority/reference/package-structure.md`
   * `.cursor/skills/kernel-authority/reference/authority-surfaces.md`

4. Package manifest
   Example: `packages/kernel/package.json`

5. Source entrypoints
   Example:

   * `packages/kernel/src/index.ts`
   * `packages/kernel/src/context/index.ts`
   * `packages/kernel/src/contracts/**`
   * `packages/kernel/src/context/**`

6. Tests
   Example:

   * `packages/kernel/src/__tests__/**`

7. Consumer usage
   Search imports from the audited package:

   * root package import
   * known subpath imports
   * planned subpath imports if relevant
   * prohibited deep imports

   For `@afenda/kernel`, search at minimum:

   ```text
   @afenda/kernel
   @afenda/kernel/context
   @afenda/kernel/erp-domain/accounting
   @afenda/kernel/policy
   @afenda/kernel/events
   @afenda/kernel/propagation
   ```

---

## Source-truth hierarchy

When documents and source disagree, classify using this hierarchy:

```text
Current source truth
→ Canonical PAS
→ Skill adapter
→ Reference docs
→ Draft/proposal notes
```

Rules:

* Current source truth is what exists in code today.
* Canonical PAS is authority for target direction.
* Skill adapter is execution guidance.
* Reference docs are support material only.
* Draft/proposal notes are not authority.
* Do not change code to match a reference example unless PAS and an approved slice require it.
* Do not treat target exports as current exports.
* Do not treat greenfield TypeScript stubs as source truth.
* Prefer `src/**`, package manifests, tests, and governance scripts over generated `dist/**`. Do not treat generated files as source truth unless source files are unavailable.

---

## Classification labels

Use exactly these labels:

| Label       | Meaning                                             |
| ----------- | --------------------------------------------------- |
| `CURRENT`   | Implemented in source and aligned with PAS          |
| `PARTIAL`   | Implemented but incomplete against PAS              |
| `TARGET`    | Required or planned by PAS but not implemented yet  |
| `PROPOSED`  | Mentioned in reference/proposal, not canonical PAS  |
| `DRIFT`     | Document says something that contradicts source/PAS |
| `FORBIDDEN` | PAS says it must not exist in this package          |
| `UNKNOWN`   | Cannot verify from available files                  |

---

## Severity labels

Use exactly these severity labels:

| Severity | Meaning                                                                                       |
| -------- | --------------------------------------------------------------------------------------------- |
| `BLOCK`  | Can cause wrong code, broken build, boundary violation, or source-incompatible implementation |
| `WARN`   | Confusing or incomplete but not immediately dangerous                                         |
| `INFO`   | Cleanup, clarity, naming, or documentation quality                                            |

---

## Audit dimensions

### 1. Public API surface

Check:

* `package.json` exports
* root barrel exports
* subpath exports
* current vs target exports
* deep import risks
* missing target export documentation
* removed current export risks

For kernel-like packages, output rows for:

```text
.
./context
./erp-domain/accounting
./policy
./events
./propagation
```

Only mark a subpath `CURRENT` if it exists in `package.json` and source.

---

### 2. Authority surfaces

Compare PAS authority surfaces against source.

For PAS-001 / `@afenda/kernel`, check:

```text
Branded IDs
Result/AppError
ProblemDetail
ExecutionContext
OperatingContext
LocalizationContext
Platform entity authority
Business reference identity authority
Accounting vocabulary (`erp-domain/accounting`)
Policy decision vocabulary
Domain event envelope
Async context propagation
JSON wire utility types
```

For other packages, map the PAS sections to equivalent package authority surfaces.

---

### 3. Boundary compliance

Check for prohibited imports.

For PAS-001 / kernel, prohibited imports include:

```text
@afenda/database
@afenda/auth
@afenda/permissions
@afenda/execution
@afenda/observability
@afenda/appshell
apps/erp
drizzle
better-auth
next
react
zod
HTTP clients
database clients
cloud SDKs
external runtime libraries
```

Classify any found import as `BLOCK`.

---

### 4. Source pattern compliance

Check that source follows existing package patterns.

For kernel, verify:

```text
brand.contract.ts style
platform-id.contract.ts helper style
AppError discriminated union style
AppErrors.* factory style
ExecutionContextSource current vocabulary
readonly properties
explicit nulls
wire-safe strings instead of Date objects
no duplicated branding pattern
no greenfield replacement of existing helpers
```

Do not recommend replacing an existing source pattern with a reference-doc example unless a dedicated migration slice explicitly approves it.

---

### 5. Documentation drift

Check whether PAS, skill, or reference docs show:

```text
target files as current
forbidden files as target
greenfield stubs that contradict current source
missing current exports
removed current exports
recommended gates as required before implementation
RFC 7807 where RFC 9457 should be used
Record<string, unknown> as strict JSON-safe payload
```

Classify dangerous drift as `BLOCK`.

---

### 6. Consumer impact

Search consumer imports.

Classify each missing or target item:

| Impact               | Meaning                                                               |
| -------------------- | --------------------------------------------------------------------- |
| `kernel-only`        | Can be implemented inside the package without consumer source changes |
| `consumer-impacting` | Consumers may need import/type updates                                |
| `migration-required` | Existing source type changes affect consumers                         |
| `optional-follow-up` | Consumer adoption can wait                                            |
| `unknown`            | Not enough evidence                                                   |

For each item, list the consumer packages/apps likely affected.

---

### 7. Prohibited surface presence

This dimension is the inverse of the completeness check. It asks: **what is in source that the PAS says must not exist here?**

Standard import gates only catch cross-package prohibited imports. They do not catch locally defined code that encodes forbidden behavior. This dimension closes that gap.

For each package, extract from the PAS:

* Its `§ Must Never Own` list (behaviors, types, decisions)
* Its decision matrix `No` column (things explicitly ruled out)

Then scan source for:

| Pattern | Violation class |
|---------|----------------|
| Functions named `resolve*`, `load*`, `fetch*` | Data loading in a contracts-only package |
| Functions named `format*`, `*Label`, `*Display*` | Presentation/formatting — belongs to UI layer |
| Functions named `decide*`, `*Currency`, `*Fallback` | Business decisions — belongs to domain layer |
| Types marked "operational snapshot", "live status", "gate telemetry" | Diagnostic output — belongs to observability/ERP |
| ID brands the PAS explicitly lists as "not approved" | Forbidden IDs — belongs to domain package |
| `from "@afenda/<this-package>"` inside the same package | Self-import via package name — always use relative path |
| `existsSync`, `readdirSync` in non-test `src/**` files | Repo governance — belongs in `scripts/governance/` |
| Duplicated type/function present in another live package | Duplicate authority — identify which is canonical |

Classify each finding using the standard labels (`FORBIDDEN`, `DRIFT`, `BLOCK`, `WARN`).

Append a **Prohibited surface matrix** section to the output immediately before the Completeness matrix:

| Dimension | Item | File | Violation | Severity | Correct home |
|-----------|------|------|-----------|----------|--------------|
| Presentation | `formatWorkspaceDisplayLabel()` | `app-shell-context.contract.ts` | Formatting — PAS §4.5 | WARN | `@afenda/appshell` |
| Decision | `resolveReportingCurrency()` | `accounting-readiness.contract.ts` | Currency decision — PAS §4.5/§7 | WARN | Finance layer |
| Forbidden ID | `FiscalPeriodId` | `erp-domain/accounting/accounting-id.contract.ts` | PAS §4.1 "not approved" | BLOCK | `@afenda/accounting` |
| Self-import | `from "@afenda/kernel"` | `accounting-id.contract.ts` | §3.3 — use relative path | BLOCK | Relative import |

After the matrix, add a one-line **Blind-spot note**: which existing governance gates would NOT catch each item, and why.

---

## Completeness matrix template

Return a table like this:

| PAS item                        | Required by PAS | Source status | Label   | Evidence path                                           | Consumer impact   | Next action |
| ------------------------------- | --------------: | ------------- | ------- | ------------------------------------------------------- | ----------------- | ----------- |
| §4.1 `TenantId`                 |             Yes | Implemented   | CURRENT | `packages/kernel/src/contracts/platform-id.contract.ts` | Stable            | None        |
| §4.5 `LocalizationContext`      |             Yes | Missing       | TARGET  | —                                                       | Kernel-only first | Slice 1     |
| §4.10 `DomainEvent`             |             Yes | Missing       | TARGET  | —                                                       | Execution later   | Slice 5     |
| §6 `./erp-domain/accounting` export |     Yes/current | Implemented   | CURRENT | `packages/kernel/package.json`                          | Stable            | None        |

Rules:

* Every PAS required item must have one row.
* Every target export must have one row.
* Every current export must have one row.
* Every forbidden/proposed item found in docs or code must have one row.
* Evidence path must point to actual file path or `—`.

---

## Drift report template

Return this table:

| Drift                                  | Severity | File                             | Why it matters                  | Fix                       |
| -------------------------------------- | -------- | -------------------------------- | ------------------------------- | ------------------------- |
| Target tree shown as current           | BLOCK    | `reference/package-structure.md` | Agent may implement wrong files | Split Current vs Target   |
| RFC 7807 wording                       | WARN     | docs/reference                   | Outdated standard               | Use RFC 9457              |
| `Record<string, unknown>` JSON payload | WARN     | reference                        | Not strict JSON-safe            | Use recursive `JsonValue` |

---

## Consumer impact summary template

Return this table:

| Target item           | Consumer impact    | Likely consumers                     | Notes                                   |
| --------------------- | ------------------ | ------------------------------------ | --------------------------------------- |
| `LocalizationContext` | kernel-only first  | `apps/erp`, `@afenda/appshell` later | Consumers can adopt later               |
| `traceId/spanId`      | optional-follow-up | `apps/erp`, `@afenda/observability`  | Optional fields are backward compatible |
| `PolicyDecisionKind`  | consumer-impacting | `@afenda/permissions`                | Can import after `./policy` exists      |

---

## Next-slice recommendation

Recommend exactly **one** next slice.

Format:

```text
Recommended next slice:
Slice N — <name>

Why:
- <reason 1>
- <reason 2>
- <reason 3>

Allowed files:
- <file>
- <file>

Forbidden:
- <file/pattern>
- <runtime behavior>

Gates:
- <commands>
```

Never recommend multiple implementation slices at once.

If the audit discovers doc drift that can cause wrong code, recommend a doc-repair slice before source changes.

---

## Confidence matrix

End with:

| Finding   | Confidence | Basis                                         |
| --------- | ---------: | --------------------------------------------- |
| <finding> |    <0–95%> | <source file / PAS / test / package manifest> |

Confidence must not exceed 95%.

Use lower confidence when:

* file not found
* source not inspected
* consumer usage not searched
* item exists only in draft/proposal
* tests were not run

---

## Output format

Final output must contain:

1. Executive verdict
2. **Prohibited surface matrix** (Dimension 7 — what is present that must not be)
3. Completeness matrix (what is required and missing)
4. Drift report
5. Consumer impact summary
6. Recommended next slice
7. Confidence matrix

Do not include a git diff unless edits were explicitly requested and performed.
Do not edit files unless the user explicitly requests an implementation mode.
