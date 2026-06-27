# Afenda Refactor Type Playbooks

One-level reference for `afenda-monorepo-refactor`. Read only the section matching Phase 0 refactor type.

---

## extract — Pull shared code into a lower layer

**When:** Two or more packages duplicate logic or need the same contract.

**Target selection:**

| Behavior owns | Valid target layer |
|---------------|-------------------|
| Branded IDs, wire envelopes, kernel context | `@afenda/kernel` (Foundation) |
| Permission vocabulary / evaluation | `@afenda/permissions` (Platform) |
| Audit/logging primitives | `@afenda/observability` (Platform) |
| UI presentation helpers | `@afenda/ui` or `apps/erp` — not kernel |
| Tenant resolution | `@afenda/kernel` — never app-local |

**Slice pattern:** A surface → B implementation → C consumers → D delete duplicate

**Common mistakes:**

- Extracting to a package **above** consumers in the layer stack
- Extracting UI formatting into kernel because it has no illegal imports
- Creating a new package when an existing lower-layer owner already exists

---

## move — Relocate code within legal layer boundaries

**When:** Code is in the wrong package but does not need a new package.

**Pre-check:** Target package already owns this authority per PAS/FDR/skill.

**Slice pattern:** A add to target → B update consumers → C remove from source

**Shim:** Re-export from old path for at most one slice if consumer count > 5.

---

## rename-export — Change public API surface

**When:** Symbol rename, export path change, or `package.json#exports` subpath addition/removal.

**Slice pattern:** A add new export (keep old) → B migrate consumers → C remove old export

**Wire safety:** If rename touches cross-package interfaces, verify JSON-serializable fields unchanged unless migration slice approves wire break.

---

## split-package — Divide an overloaded package

**When:** Single package mixes Platform + Integration concerns or unrelated domains.

**Requires:** Architecture review + registry updates via `foundation-registry-owner`.

**Slice pattern:** One concern per slice — never split two domains in one execute slice.

```text
Slice 1 — Register new package + empty surface
Slice 2 — Move domain A files + tests
Slice 3 — Move domain A consumers
Slice 4 — Repeat for domain B
Slice 5 — Remove dead exports from original package
```

---

## layer-fix — Repair illegal imports

**When:** `quality:boundaries` or architecture-authority reports layer violation.

**Diagnosis order:**

1. Is the import wrong, or is the **code in the wrong package**?
2. If code is wrong → `move` or `extract` to legal owner
3. If import is wrong → point consumer at correct package export
4. If shared concern → `extract` to lowest layer both may import

**Never:** Silence with `// @ts-expect-error` or deep import into private paths.

---

## consumer-migration — Update call sites only

**When:** Target contract already exists; only importers are stale.

**Scope:** One consuming package per slice (`@afenda/appshell`, then `apps/erp`, etc.).

**Order:** Downstream apps last — packages before apps.

**Checklist per consumer:**

```text
[ ] Imports from package name, not deep path
[ ] No new local duplicate of moved contract
[ ] Tests updated
[ ] pnpm --filter <consumer> typecheck passes
```

---

## Anti-patterns (all types)

| Anti-pattern | Why blocked |
|--------------|-------------|
| Regex bulk replace across repo | Misses authority/context per file |
| `update.py` / one-off codemod scripts | Forbidden by agent-multi-file rule |
| Move + consumer + registry in one slice | Unreviewable blast radius |
| Parallel types in consumer "until later" | Drift — fix target first |
| Hoisted dep not in package.json | Phantom dependency — CI fails |
| `from "@afenda/pkg/src/..."` | Deep import — use public surface |
