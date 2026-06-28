---
name: cross-boundary-anti-pattern-scan
description: Scans Afenda packages for semantic boundary violations and cross-boundary anti-patterns that normal import gates may miss, including wrong-owner functions, misplaced types, duplicated authority, self-imports, repo-governance logic in source, and behavior that belongs to another package or domain.
disable-model-invocation: true
---

# Cross-Boundary Anti-Pattern Scan

## Purpose

This skill finds code that **passes normal import gates** but still violates architecture ownership.

It asks:

```text
What exists here that semantically belongs somewhere else?
What function performs behavior the package must not own?
What type exports a concept owned by another package/domain?
What authority is duplicated across packages?
What local logic bypasses a proper shared owner?
What patterns are blind spots of quality:boundaries?
```

This skill is read-only by default.

Do not edit source code.
Do not implement repairs.
Do not create ADR/PAS ceremony.
Do not decide new architecture ownership.
Do not treat name-based findings as final proof without checking authority docs.

---

## When to use this skill

Use this skill when asked to:

* find cross-boundary anti-patterns
* scan "what does not belong here"
* audit package pollution
* find violations import gates miss
* review semantic boundary drift
* check kernel/app/database/UI/metadata ownership leaks
* inspect duplicate authority across packages
* review package before governance gates
* check whether code belongs in another layer

Common invocations:

```text
/cross-boundary-anti-pattern-scan @afenda/kernel
/cross-boundary-anti-pattern-scan packages/metadata
/cross-boundary-anti-pattern-scan apps/erp auth-v2
/cross-boundary-anti-pattern-scan find anti-patterns import gates miss
```

---

## Phase 0 — Scope contract

Before scanning, state:

```text
1. Scope package/app     — exact source folder(s)
2. Authority sources     — PAS/PAS/skill/registry docs to check
3. Mode                  — read-only anti-pattern scan
4. Source truth          — source code + package manifest + exports
5. Output                — anti-pattern matrix + blind-spot report + priority list
```

If authority docs are missing, continue with lower confidence and mark authority-dependent findings as `REVIEW`, not `BLOCK`.

---

## Required read order

Read in this order:

1. Package authority source:

   * PAS document, if one exists
   * PAS, if scope is PAS-governed
   * package authority skill, if one exists

2. Architecture registries:

   * package registry
   * layer registry
   * dependency registry
   * ownership registry

3. Package manifest:

   * `package.json`
   * exports map
   * dependencies

4. Source entrypoints:

   * `src/index.ts`
   * subpath barrels
   * public exports

5. Source files:

   * production source
   * skip tests unless testing logic itself appears exported or reused

6. Existing gates/scripts:

   * understand what standard gates already catch

---

## Core principle

Name-based scans are evidence, not final judgment.

A name such as `resolve*`, `format*`, `evaluate*`, `publish*`, or `load*` can trigger review. Final severity must be assigned only after checking:

```text
1. canonical authority document
2. package authority skill
3. current source pattern
4. registry / PAS evidence if available
5. whether the function is pure vocabulary/helper or actual behavior
```

---

## Severity labels

Use exactly these labels:

| Severity | Meaning                                                                                 |
| -------- | --------------------------------------------------------------------------------------- |
| `BLOCK`  | Explicit authority violation or source pattern that can cause wrong ownership to spread |
| `WARN`   | Likely wrong owner, but not immediately dangerous                                       |
| `REVIEW` | Suspicious pattern that may be allowed; requires authority verification                 |
| `INFO`   | Naming, organization, or clarity smell                                                  |

---

## Scan dimensions

### A. Exported behavior scan

For every exported function, exported const object, and public barrel export, ask:

```text
Does this export perform behavior this package does not own?
```

Red-flag patterns:

| Pattern                                                | Review because                                     |
| ------------------------------------------------------ | -------------------------------------------------- |
| `resolve*`, `load*`, `fetch*`, `find*By*`, `get*From*` | May be data loading/resolution                     |
| `format*`, `*Label`, `*Display*`, `toDisplay*`         | May be UI/presentation behavior                    |
| `decide*`, `select*`, `default*`, `fallback*`          | May be business decision behavior                  |
| `evaluate*`, `require*Permission`, `can*`              | May be permission/policy evaluation                |
| `dispatch*`, `publish*`, `schedule*`, `enqueue*`       | May be execution/outbox behavior                   |
| `calculate*`, `post*`, `reconcile*`, `eliminate*`      | May be accounting/business runtime                 |
| `parse*`, `validate*`, `assert*`, `is*`                | Review whether contract guard or domain validation |

Allowed exceptions:

* Brand guards
* Contract guards
* Pure type narrowing
* Pure projection from already-trusted input
* Wire-shape conversion with no data loading
* Frozen registry lookup with no runtime side effect

---

### B. Type and interface ownership scan

For every exported type/interface, ask:

```text
Does this type describe stable cross-package vocabulary, or does it encode another domain's runtime decision?
```

Red flags:

```text
- domain runtime state in platform package
- UI presentation structs in non-UI package
- permission evaluation result in kernel/metadata
- database row shape leaking into UI/contracts
- app route state leaking into package contracts
- fiscal/calendar/currency decisions outside Finance/Accounting authority
- workflow/business lifecycle owned by wrong domain
- operational telemetry snapshots in stable vocabulary package
```

Classify as `REVIEW` unless PAS explicitly allows/prohibits it.

---

### C. Import and self-import scan

Scan for:

```text
from "@afenda/<same-package>"
from "apps/"
from "@afenda/<higher-layer-package>"
from prohibited external libraries
```

Rules:

* Same-package self-import via package name is `BLOCK`.
* Deep imports across package boundaries are `BLOCK`.
* Higher-layer imports are `BLOCK`.
* Prohibited runtime dependency imports are `BLOCK`.

---

### D. Duplicate authority scan

Search for duplicate definitions across packages:

```text
same branded ID
same permission vocabulary
same lifecycle enum
same event envelope
same metadata field contract
same API envelope
same auth/session shape
same domain status vocabulary
```

Output:

```text
canonical owner
duplicate owner
which source should remain
which source should be removed/migrated
```

If canonical owner is unclear, classify `REVIEW`.

---

### E. Repo governance logic in source scan

Look for repo/layout enforcement inside package source:

```text
existsSync
readFileSync
readdirSync
glob
FORBIDDEN_PACKAGE_DIRS
assertMustNotExist
architecture registry file reads
package registry file reads
```

Rules:

* In production source: usually `WARN` or `BLOCK`.
* In tests: may be allowed for governance validation.
* In scripts/governance or architecture-authority: usually allowed.

---

### F. Runtime leakage scan

For contracts-only or vocabulary packages, scan for:

```text
new Date()
Date.now()
crypto.randomUUID()
AsyncLocalStorage
fetch
process.env
setTimeout / setInterval
filesystem writes
network clients
database clients
```

Rules:

* Runtime primitives are `REVIEW` unless PAS explicitly allows them.
* For `@afenda/kernel`, `crypto.randomUUID()` for execution ID and `AsyncLocalStorage` for approved propagation may be allowed by PAS.
* Environment access in package contracts is usually `BLOCK`.

---

### G. Boundary blind-spot scan

Report what normal gates may miss.

Examples:

| Blind spot                                   | Why import gates miss it            |
| -------------------------------------------- | ----------------------------------- |
| Local formatting helper in kernel            | No illegal import                   |
| Currency decision helper in platform package | No illegal import                   |
| Permission evaluation type in metadata       | Type-only local code                |
| Duplicate authority in two packages          | Each package may pass independently |
| Self-import via package name                 | Looks like normal package import    |
| Repo file-system policy in source            | Uses Node built-ins only            |
| Runtime state snapshot in contracts          | Type-only, no dependency violation  |

---

## Package-specific examples

### Kernel examples

For `@afenda/kernel`, use PAS-001 as authority.

| Pattern                                   | Initial classification | Final judgment rule                                                                                        |
| ----------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `format*Label`                            | REVIEW                 | Violation only if user-facing presentation behavior                                                        |
| `resolve*Currency`                        | REVIEW                 | Violation if selecting/defaulting/converting currency; allowed only if pure projection explicitly approved |
| `FiscalCalendarId`                        | REVIEW/BLOCK           | Block as general platform ID unless PAS/PAS approves; review if in approved erp-domain/accounting vocabulary   |
| `AccountingReadinessGateLiveSnapshot`     | REVIEW                 | Allowed only if PAS/PAS defines it as stable gate contract                                                 |
| `deriveConsolidationScopeContext`         | REVIEW                 | Allowed if pure derivation from trusted input; violation if it loads/queries                               |
| `from "@afenda/kernel"` inside kernel     | BLOCK                  | Must use relative import                                                                                   |
| `Date` in wire contract                   | BLOCK                  | Use ISO string unless contract is not wire-facing                                                          |
| `Record<string, unknown>` as JSON payload | WARN                   | Use strict `JsonValue` / `JsonObject` when wire-facing                                                     |

### Metadata examples

| Pattern                           | Initial classification | Final judgment rule                         |
| --------------------------------- | ---------------------- | ------------------------------------------- |
| Business validation in metadata   | REVIEW/BLOCK           | Domain owner should validate business rules |
| UI rendering behavior in metadata | REVIEW                 | May belong in metadata-ui                   |
| Database row shape in metadata    | WARN/BLOCK             | Persistence owner is database               |
| Field contract vocabulary         | Usually allowed        | If generic and cross-domain                 |

### UI examples

| Pattern                                        | Initial classification | Final judgment rule                 |
| ---------------------------------------------- | ---------------------- | ----------------------------------- |
| Permission evaluation in UI primitive          | BLOCK                  | Permissions package owns evaluation |
| Domain workflow in UI                          | BLOCK                  | Domain/app owns workflow            |
| Styling token definition outside design system | WARN/BLOCK             | Design-system owns tokens           |
| Layout-only className helper                   | Usually allowed        | If package style rules allow        |

---

## Anti-pattern matrix template

Return a table:

| Dimension | Item                            | File  | Classification        | Severity | Correct home               | Evidence       |
| --------- | ------------------------------- | ----- | --------------------- | -------- | -------------------------- | -------------- |
| A         | `formatWorkspaceDisplayLabel()` | `...` | Presentation red flag | REVIEW   | AppShell/UI if user-facing | PAS §...       |
| C         | `from "@afenda/kernel"`         | `...` | Self-import           | BLOCK    | Relative import            | package source |
| D         | Duplicate `AppErrorCode`        | `...` | Duplicate authority   | BLOCK    | `@afenda/kernel`           | PAS §...       |

---

## Blind-spot report template

Return:

```text
### What existing gates catch
- quality:boundaries — prohibited cross-package imports
- architecture:cycles — cycles
- package-specific gates — known governed surfaces

### What this scan catches that gates may miss
- local behavior in wrong package
- duplicated vocabulary
- self-imports
- runtime leakage through Node built-ins
- presentation helpers without illegal imports
- domain decisions encoded as local pure helpers

### Recommended gate additions
- <script idea>
- <grep/static check>
```

---

## Priority list

Close with the top three findings.

Format:

```text
Priority 1 (BLOCK): <actionable issue>
Priority 2 (WARN): <actionable issue>
Priority 3 (REVIEW): <actionable issue>
```

If no violations are found:

```text
No BLOCK findings. Package is clean against scanned anti-pattern profile. Remaining REVIEW items require human authority confirmation.
```

---

## Output format

Final output must contain:

1. Executive verdict
2. Anti-pattern matrix
3. Blind-spot report
4. Top three priorities
5. Confidence matrix

Confidence must not exceed 95%.

Do not edit files unless the user explicitly requests implementation mode.
