---
name: afenda-repo-housekeeping
description: Orchestrates Afenda monorepo dead-code discovery with Knip, workspace rollout, registry/catalog alignment, and CI promotion planning. Classifies findings and delegates removals to afenda-monorepo-refactor Slice D. Use when running housekeeping, knip, dead-code audits, storybook orphan checks, registry drift, or promoting Knip from advisory to blocking CI.
disable-model-invocation: true
paths:
  - knip.jsonc
  - turbo.json
  - package.json
  - scripts/storybook/**
  - packages/**
  - apps/**
---

# Afenda Repo Housekeeping

Knip discovers unused files, dependencies, and exports. This skill **orchestrates** discovery, classification, rollout, and alignment. **Removal** always delegates to [`/afenda-monorepo-refactor`](afenda-monorepo-refactor/SKILL.md) **Slice D** — not ad-hoc deletes.

**Announce at start:** "I'm using afenda-repo-housekeeping — stating housekeeping contract before edits."

---

## Skill chain (do not reinvent)

| Phase | Delegate to |
|-------|-------------|
| Layer / import rules | `/monorepo-discipline` |
| Slice D execution | `/afenda-monorepo-refactor execute` + `/afenda-coding-session` |
| Implementation | `@afenda-governed-implementer` + `coding-consistency-bundle` |
| Registry / PAS lane edits | `foundation-registry-owner` |
| Foundation stubs | Read `foundation-disposition.registry.ts` before deleting entitlements / feature-flag files |

This skill does **not** have an `execute` mode. When findings require deletion, output a paste-ready `/afenda-monorepo-refactor execute Slice D — …` command.

---

## Modes

| Keyword | Mode | Edits? | Output |
|---------|------|--------|--------|
| (default) | `audit` | No | Finding matrix by taxonomy + recommended next mode |
| `expand` | `expand` | Yes — `knip.jsonc` + `turbo.json` inputs only | One workspace enabled + scoped knip baseline |
| `plan` | `plan` | No | Numbered rollout slices + paste-ready Slice D commands |
| `align` | `align` | Yes — registries / catalogs only | Registry or catalog diff + gates |
| `promote` | `promote` | No (CI yaml only when user approves) | Go / no-go vs CI promotion criteria |

If the user asks to delete files directly, redirect to `/afenda-monorepo-refactor execute Slice D`.

---

## Hard stops (non-negotiable)

Stop before editing when any of these apply:

- User requests repo-wide `knip --fix` or bulk delete without classification
- Target is `_retired/**` evidence trees
- Edit touches `foundation-disposition.registry.ts` without `foundation-registry-owner`
- Storybook orphan `--apply` without dry-run review in the same session
- Slice would delete >10 files (split into multiple Slice D commands)
- Entitlements / feature-flag stubs would be deleted without `rg` + registry check
- Knip finding is `registry-drift` or `catalog-drift` but agent plans file deletion instead of **align**

**Never:** add `"turbo": true` to `knip.jsonc` — Knip 6 rejects it. Turbo integration is root tasks in `turbo.json` only.

---

## Phase 0 — Housekeeping contract (mandatory before edits)

State all six lines. Do not edit until complete.

```text
1. Mode              — audit | expand | plan | align | promote
2. Objective         — one sentence
3. Workspace scope   — package(s) or layer tier
4. Finding classes   — taxonomy buckets (see reference/finding-taxonomy.md)
5. Prohibited        — paths / registries / deletes out of scope
6. Gates             — scoped pnpm commands that must pass
```

`audit` and `plan` modes: Phase 0 required before reporting. `expand` and `align`: required before file edits.

---

## Phase 1 — Discover

Prefer scoped runs over root `pnpm housekeeping:knip` (noisy on root scripts).

```bash
pnpm housekeeping:knip:workspace packages/<name>   # single package
pnpm housekeeping:knip:turbo                       # all enabled workspaces (strict)
pnpm housekeeping:knip:advisory:turbo              # CI signal — exit 0, logs findings
pnpm housekeeping:storybook-orphans                  # dry-run orphan MCP blocks only
```

Knip and storybook-orphan output stays in the terminal — do not commit captures under `.cursor/audit/` (see `pnpm check:local-artifact-leakage`).

Full command reference: [reference/knip-rollout.md](reference/knip-rollout.md).

---

## Phase 2 — Classify

Every finding gets exactly one class before action. See [reference/finding-taxonomy.md](reference/finding-taxonomy.md).

| Class | This skill action |
|-------|-------------------|
| `unused-export` / `unused-file` / `unused-dependency` | Delegate Slice D |
| `registry-drift` | **align** mode — trim registry to filesystem |
| `catalog-drift` | **align** mode — fix seed catalog + rebuild database dist |
| `intentional-public` | Document ignore / tag; no delete |
| `storybook-orphan` | Dry-run script → delegate Slice D if confirmed |

---

## Phase 3 — Mode workflows

### audit

1. Run scoped Knip (+ storybook dry-run if Design layer)
2. Build finding matrix: class × count × package
3. Flag P0 items (broken imports, stale scan roots)
4. Recommend next mode: `expand`, `align`, or paste-ready Slice D slices

### expand

One package per session. Checklist:

- [ ] Add `!packages/<name>` negation in `knip.jsonc` `ignoreWorkspaces`
- [ ] Add `workspaces["packages/<name>"]` entry (use [reference/workspace-templates.md](reference/workspace-templates.md))
- [ ] Add matching `inputs` to `//#housekeeping:knip` and `//#housekeeping:knip:advisory` in `turbo.json`
- [ ] Run `pnpm housekeeping:knip:workspace packages/<name>` and record baseline
- [ ] Do **not** delete findings in the same expand slice

### plan

Output numbered slices following rollout order in [reference/knip-rollout.md](reference/knip-rollout.md). Each removal slice:

```text
/afenda-monorepo-refactor execute Slice D — remove <symbols> from @afenda/<pkg> (housekeeping)
```

Include Slice D Phase 0 block (seven lines) per slice — see knip-rollout.md.

### align

For registry/catalog drift only — not Knip file deletes.

**Observability registries:** trim entries to files that exist on disk.

**Permissions catalog:** edit `packages/database/src/seeds/platform-permissions.catalog.ts`, then:

```bash
pnpm --filter @afenda/database build
pnpm --filter @afenda/permissions test:run
```

### promote

Assess against [reference/ci-promotion.md](reference/ci-promotion.md). Output go / no-go with evidence. CI yaml edits only when user explicitly approves promotion.

---

## Phase 4 — Delegate removals (Slice D)

Do not delete in this skill. Hand off:

```text
/afenda-monorepo-refactor execute Slice D — <objective>
@afenda-governed-implementer + coding-consistency-bundle
```

Before delete, consumer check:

```bash
rg "SymbolName" packages apps --glob "*.{ts,tsx}"
```

Post-removal gates (every delegated slice):

```bash
pnpm --filter @afenda/<pkg> typecheck
pnpm --filter @afenda/<pkg> test:run
pnpm architecture:cycles
pnpm --filter @afenda/architecture-authority test:run
```

When `package.json` deps change, also run `pnpm quality:architecture-drift` and `pnpm quality:exports`.

Full gate matrix: [afenda-monorepo-refactor/reference/gate-matrix.md](../afenda-monorepo-refactor/reference/gate-matrix.md).

---

## Completion report

Post before ending the turn:

```markdown
## Housekeeping completion

| Item | Evidence |
|------|----------|
| Mode | audit / expand / plan / align / promote |
| Workspaces | packages touched |
| Findings by class | unused-export: N, registry-drift: N, … |
| Delegated slices | /afenda-monorepo-refactor commands issued (or none) |
| Gates | command → pass/fail |
| CI promotion delta | advisory unchanged / criteria X of Y met |
| Next recommended mode | … |
```

---

## Additional resources

| Topic | File |
|-------|------|
| Commands, rollout order, Slice D Phase 0 | [reference/knip-rollout.md](reference/knip-rollout.md) |
| Finding taxonomy + triage | [reference/finding-taxonomy.md](reference/finding-taxonomy.md) |
| Per-layer knip.jsonc snippets | [reference/workspace-templates.md](reference/workspace-templates.md) |
| CI advisory → blocking promotion | [reference/ci-promotion.md](reference/ci-promotion.md) |
| Waves 1–5 worked examples | [examples.md](examples.md) |

---

## Related

- Removal execution: [`afenda-monorepo-refactor`](../afenda-monorepo-refactor/SKILL.md)
- Layer rules: [`monorepo-discipline`](../monorepo-discipline/SKILL.md)
- Legacy redirect: [`.cursor/references/knip-afenda.md`](../../references/knip-afenda.md)
