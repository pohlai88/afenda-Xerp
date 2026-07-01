# Knip rollout and commands

Knip discovers unused files, dependencies, and exports. **Removal** is governed by [`/afenda-monorepo-refactor`](../../afenda-monorepo-refactor/SKILL.md) **Slice D** — orchestrated via [`/afenda-repo-housekeeping`](../SKILL.md).

## Commands

```bash
pnpm housekeeping:knip:workspace packages/<name>  # preferred — single scoped workspace
pnpm housekeeping:knip          # all enabled workspaces (exit 1 on findings)
pnpm housekeeping:knip:turbo    # same, turbo-cached root task (local strict)
pnpm housekeeping:knip:advisory # CI signal — logs findings, exit 0
pnpm housekeeping:knip:advisory:turbo  # advisory + turbo cache (used in CI workflow)
pnpm housekeeping:knip:fix      # auto-fix deps only — never repo-wide without review
pnpm housekeeping:audit         # knip + downstream-integration + legacy terminology
pnpm housekeeping:verify        # audit + quality:boundaries + quality:exports
pnpm housekeeping:storybook-orphans           # dry-run orphan MCP blocks
pnpm housekeeping:storybook-orphans -- --apply # delete orphan MCP blocks (after dry-run)
```

**Prefer** `housekeeping:knip:workspace` for agent sessions — root `housekeeping:knip` also reports unused root scripts and is noisier.

**CI:** [`.github/workflows/housekeeping-advisory.yml`](../../../.github/workflows/housekeeping-advisory.yml) runs on PRs with `continue-on-error: true`. Promotion criteria: [ci-promotion.md](ci-promotion.md).

**Turbo:** Root tasks `//#housekeeping:knip` and `//#housekeeping:knip:advisory` in [`turbo.json`](../../../turbo.json). Update task `inputs` when expanding `knip.jsonc` workspaces. Do **not** add `"turbo": true` to `knip.jsonc` — Knip 6 rejects it.

## Slice D Phase 0 (before any deletion)

Delegated to `/afenda-monorepo-refactor execute`. Required seven lines:

```text
1. Refactor type     — Slice D removal
2. Objective         — Remove <symbols/files> from <package> per Knip + rg
3. Source scope      — exact files/exports to remove
4. Target scope      — none
5. Consumer scope    — importers that must still compile
6. Prohibited        — _retired/**, registries, >10 files per slice
7. Gates             — universal minimum below
```

Confirm exports before delete:

```bash
rg "SymbolName" packages apps --glob "*.{ts,tsx}"
```

## Post-removal gates (every slice)

```bash
pnpm --filter @afenda/<pkg> typecheck
pnpm --filter @afenda/<pkg> test:run
pnpm quality:boundaries
pnpm architecture:cycles
pnpm --filter @afenda/architecture-authority test:run
```

When `package.json` deps change:

```bash
pnpm quality:architecture-drift
pnpm quality:exports
pnpm test:run:affected
```

**Catalog alignment** (permissions): after editing `platform-permissions.catalog.ts`:

```bash
pnpm --filter @afenda/database build
pnpm --filter @afenda/permissions test:run
```

## Workspace rollout order

1. Platform — `observability` ✓, `testing` ✓, `typescript-config` ✓, `auth` ✓, `permissions` ✓, `database` ✓, `ai-governance` ✓
2. Integration — `entitlements` ✓, `feature-flags` ✓
3. Design — `shadcn-studio` ✓ (remediation deferred)
4. Foundation — `execution` ✓, `storage` ✓, `erp-module-foundation` ✓, `accounting-standards` ✓
5. Application — `apps/erp` ✓, `apps/storybook` ✓, `apps/docs` ✓ (`apps/email` — no src; skipped)
6. Platform last — `kernel` ✓, `architecture-authority` ✓, `enterprise-knowledge` ✓, `packages/features/erp-modules` ✓

Include `packages/features/*` when expanding — boundary scripts may not scan nested features yet.

## expand mode checklist

When enabling a new workspace:

1. Add `!packages/<name>` to `ignoreWorkspaces` negation list in [`knip.jsonc`](../../../knip.jsonc)
2. Add `workspaces["packages/<name>"]` block — see [workspace-templates.md](workspace-templates.md)
3. Add matching paths to `//#housekeeping:knip` and `//#housekeeping:knip:advisory` `inputs` in [`turbo.json`](../../../turbo.json)
4. Run `pnpm housekeeping:knip:workspace packages/<name>` and record baseline findings
5. Do not delete in the same expand session

## Hard stops

- No repo-wide `knip --fix`
- No deletion of `_retired` evidence trees
- No registry edits without `foundation-registry-owner`
- Internal deps stay `workspace:*`
- Max ~10 files per execute slice
- No storybook orphan `--apply` without dry-run in same session

## Related

- Orchestration: [`afenda-repo-housekeeping/SKILL.md`](../SKILL.md)
- Finding taxonomy: [finding-taxonomy.md](finding-taxonomy.md)
- Layer rules: [`monorepo-discipline/SKILL.md`](../../monorepo-discipline/SKILL.md)
- Gate matrix: [`afenda-monorepo-refactor/reference/gate-matrix.md`](../../afenda-monorepo-refactor/reference/gate-matrix.md)
