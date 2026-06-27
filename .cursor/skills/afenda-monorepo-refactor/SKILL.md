---
name: afenda-monorepo-refactor
description: Plans and executes governed monorepo refactors in the Afenda workspace — package extraction, layer fixes, export moves, consumer migrations, and boundary repairs. Serializes work into safe slices, enforces architecture-authority layer rules, runs scoped gates, and chains to pas-codebase-bridge, cross-boundary-anti-pattern-scan, and afenda-coding-session. Use when refactoring across packages, moving code between layers, extracting shared libraries, fixing import violations, or migrating consumers after contract changes.
disable-model-invocation: true
---

# Afenda Monorepo Refactor

Governed refactoring for the `@afenda/*` pnpm + Turborepo workspace. Combines monorepo extraction patterns (dependency-graph order, affected-package scoping, one-slice-at-a-time execution) with Afenda authority boundaries (PAS/FDR, layer registry, package ownership).

**Announce at start:** "I'm using afenda-monorepo-refactor — stating refactor contract before edits."

---

## Skill chain (do not reinvent)

| Phase | Delegate to |
|-------|-------------|
| PAS/FDR compliance audit | `/pas-codebase-bridge` |
| Semantic boundary scan | `/cross-boundary-anti-pattern-scan` |
| PAS kernel slice planning | `/pas-slice-planner` |
| Layer/import rules reference | `/monorepo-discipline` |
| Implementation execution | `/afenda-coding-session` |
| Post-refactor repair + gates | `/afenda-implementation-health` |
| Registry / FDR lane edits | `foundation-registry-owner` agent |

This skill **orchestrates** refactors. It does not replace upstream authority docs or registry owners.

---

## Modes

| Keyword | Mode | Edits? | Output |
|---------|------|--------|--------|
| `audit` (default when scope unclear) | Safety assessment | No | Refactor matrix + risk verdict + recommended slices |
| `plan` | Serialized slice plan | No | Numbered slices + paste-ready `/afenda-coding-session` commands |
| `execute` | One approved slice | Yes | Implementation + gates + completion evidence |
| `stabilize` | Post-refactor health | Yes | Delegates repair loop to implementation-health patterns |

If no keyword is given and the user names a concrete single slice, use `execute`. Otherwise default to `audit` or `plan`.

---

## Hard stops (non-negotiable)

Stop and escalate before editing when any of these are true:

- Refactor moves code to a package with no assigned layer in `architecture-authority`
- Refactor creates or widens a circular dependency
- Refactor duplicates authority owned by another package (permissions, kernel context, metadata contracts, design tokens)
- Refactor touches `foundation-disposition.registry.ts` without `foundation-registry-owner`
- Refactor requires database schema change without Drizzle migration ownership
- Refactor spans multiple serialized slices but user asked for one slice
- Canonical PAS/FDR prohibits the target shape and no waiver exists
- User requests bulk codemods, regex tree-wide replace, or throwaway migration scripts

**Never:** `git restore` / `git clean` on unrelated WIP. **Never:** `pnpm lint --fix` or `biome check --write .` across the full repo unless explicitly approved.

---

## Phase 0 — Refactor contract (mandatory before edits)

State all seven lines. Do not edit until complete.

```text
1. Refactor type     — extract | move | rename-export | split-package | layer-fix | consumer-migration
2. Objective         — one sentence: what moves from where to where
3. Source scope      — exact folders/files being removed or changed
4. Target scope      — exact package(s)/folders receiving code
5. Consumer scope    — packages/apps that must compile after this slice (list or "none this slice")
6. Prohibited        — packages/paths/registries that must NOT be touched
7. Gates             — scoped pnpm commands that must pass (see reference/gate-matrix.md)
```

Also state **authority**: Architecture · Design System · UI Governance · Metadata · Kernel · Database · Permission — pick exactly one primary owner for the code being moved.

If upstream contract is missing, stop. Do not invent parallel types, registries, or resolvers in the consumer.

---

## Phase 1 — Classify and map impact

### 1.1 Refactor type decision tree

```text
Code in wrong package but same layer?        → move
Code needed by 2+ packages?                → extract (to lowest valid layer)
Public API rename or export surface change?  → rename-export (+ consumer-migration slice)
Package too large / mixed concerns?          → split-package (multi-slice)
Import violates layer rank?                  → layer-fix (often extract + consumer-migration)
Only call sites break, contracts stable?     → consumer-migration only
```

### 1.2 Dependency graph (read before planning)

```bash
# List workspace packages
pnpm ls -r --depth 0

# Architecture validation (layers, cycles, registry)
pnpm --filter @afenda/architecture-authority test:run
```

Build an **impact table**:

| Package | Role | Imports source? | Imported by target? | In this slice? |
|---------|------|-----------------|---------------------|----------------|
| `@afenda/...` | source / target / consumer | yes/no | yes/no | yes/no |

**Direction rule:** code flows to the **lowest valid layer** that may own the behavior. See `/monorepo-discipline` and [reference/refactor-types.md](reference/refactor-types.md).

### 1.3 Consumer discovery

```bash
# Ripgrep importers (adjust symbol/path)
rg "from [\"']@afenda/<source>" packages apps --glob "*.{ts,tsx}"
rg "<ExportedSymbol>" packages apps --glob "*.{ts,tsx}"
```

Record every consumer. Split consumers across slices if more than ~8 files or multiple apps.

---

## Phase 2 — Pre-flight audit (read-only)

Run before `plan` or `execute`:

1. **Layer check** — source → target import direction legal per `layer-registry.data.ts`
2. **Ownership check** — behavior belongs to target authority (not just convenient location)
3. **Export surface** — target `package.json#exports` and `src/index.ts` can absorb new public API
4. **Semantic scan** — `/cross-boundary-anti-pattern-scan` on source folder when moving platform/kernel/metadata code
5. **PAS/FDR** — `/pas-codebase-bridge` when scope is PAS- or FDR-governed

Output a **refactor risk matrix**:

| Check | Result | Severity | Notes |
|-------|--------|----------|-------|
| Layer legal | pass/fail | BLOCK/WARN | |
| Cycle introduced | pass/fail | BLOCK | |
| Duplicate authority | pass/fail | BLOCK | |
| Consumer count | N files | WARN if >8 | |
| Wire contract change | yes/no | BLOCK | |
| Registry edit needed | yes/no | BLOCK | |

`audit` mode ends here with a **Go / No-go / Slice-first** verdict.

---

## Phase 3 — Serialize into slices

One slice = one mergeable unit. Default sequence:

```text
Slice A — Target surface   : types/contracts + package.json exports + index.ts (no consumers yet)
Slice B — Move implementation: move source files; fix internal imports; add tests
Slice C — Consumer migration : update importers one package at a time
Slice D — Removal            : delete re-exports/shims from source; verify no orphaned imports
Slice E — Registry/governance: architecture-authority / FDR docs (only if slice authorizes)
```

Rules:

- **Types before behavior** — move interfaces/brands first when extract touches wire contracts
- **One package per consumer slice** — e.g. `@afenda/appshell` then `apps/erp`
- **Shim window** — optional temporary re-export from old path for one slice only; must be listed in Prohibited-after slice D
- **Max ~10 files per execute slice** — split if larger (per `agent-multi-file.mdc`)

`plan` mode outputs numbered slices with Handoff-compatible fields for `/afenda-coding-session`.

---

## Phase 4 — Execute one slice

**Announce:** "I'm using afenda-coding-session — stating the execution contract before edits."

Map Phase 0 into afenda-coding-session §0 six lines. Edit **only** files in the current slice.

### Chunk order (within slice)

```text
1. Types / contracts / brands
2. Implementation in target package
3. Tests in target package
4. Consumer updates (if in scope)
5. Source cleanup / shim removal (if in scope)
6. package.json dependencies (workspace:* only)
```

### File discipline

- Edit files **one at a time** — no throwaway codemods or bulk regex replace
- Add dependency to `package.json` **before** importing
- Import via package name only: `from "@afenda/<pkg>"` — never deep cross-package paths
- Same-package imports use **relative** paths — never `from "@afenda/<same-package>"`
- Update `index.ts` export surface when adding public API

### Package creation (extract only)

Follow `/monorepo-discipline` new-package checklist:

```text
[ ] Layer in layer-registry.data.ts
[ ] Entry in package-registry.data.ts
[ ] Ownership in ownership-registry.data.ts
[ ] workspace:* internal deps
[ ] exports map in package.json
[ ] pnpm --filter @afenda/architecture-authority test:run
```

Registry edits → `foundation-registry-owner` unless slice explicitly includes them.

---

## Phase 5 — Verify (scoped gates)

Run gates for **touched packages only** first, then workspace gates if slice authorizes.

```bash
# Per touched package
pnpm --filter <pkg> typecheck
pnpm --filter <pkg> test:run

# Workspace architecture (required for cross-package refactors)
pnpm quality:boundaries
pnpm architecture:cycles
pnpm --filter @afenda/architecture-authority test:run
```

Optional when UI/CSS touched: `pnpm ui:guard:scan`, `pnpm check:package-css-dist-sync`.

Full gate matrix: [reference/gate-matrix.md](reference/gate-matrix.md).

If a gate fails outside approved scope, report it — do not expand scope silently.

---

## Phase 6 — Report

Post completion evidence (aligns with afenda-coding-session §11):

### 1. Verdict

```text
Complete / Partial / Blocked
```

### 2. Slice compliance

| Slice item | Required | Status | Files | Notes |
|------------|----------|--------|-------|-------|
| ... | Yes | Complete/Partial/Missing | path | |

### 3. Refactor diff summary

```bash
git diff --stat
```

### 4. Gates

| Gate | Result | Notes |
|------|--------|-------|
| `pnpm --filter <pkg> typecheck` | PASS/FAIL/NOT RUN | |

### 5. Remaining slices

List next serialized slices with one-line objective each.

### 6. Drift prevention

| Check | Pass/Fail |
|-------|-----------|
| No new layer violations | |
| No new cycles | |
| No duplicate authority | |
| No deep cross-package imports | |
| Consumers compile | |
| No orphaned exports in source | |

---

## Quick invocation examples

```text
/afenda-monorepo-refactor audit move resolveFoo from apps/erp to @afenda/kernel
/afenda-monorepo-refactor plan extract shared wire types from @afenda/metadata to @afenda/kernel
/afenda-monorepo-refactor execute Slice B — move implementation per plan above
/afenda-monorepo-refactor stabilize @afenda/kernel after extract slice
```

---

## Additional resources

- Refactor type playbooks: [reference/refactor-types.md](reference/refactor-types.md)
- Gate matrix by refactor type: [reference/gate-matrix.md](reference/gate-matrix.md)
- Layer diagram: `/monorepo-discipline` → `LAYERS.md`
