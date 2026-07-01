---
name: monorepo-discipline
description: Enforces monorepo import discipline, package layering rules, circular dependency prevention, and internal export surface governance for the @afenda workspace. References the architecture-authority layer registry. Use when adding imports between packages, creating a new package, scaffolding with pnpm scaffold:package, reviewing package.json dependencies, or when the user mentions cross-package imports, circular dependencies, layer violations, or workspace governance.
disable-model-invocation: true
paths:
  - packages/**
  - pnpm-workspace.yaml
  - turbo.json
---

# monorepo-discipline

The `@afenda/architecture-authority` package enforces these rules automatically at CI time. This skill tells you what the rules are and why, so you follow them before the CI gate fails.

## Layer hierarchy (from `layer-registry.data.ts`)

```
Rank 6 — Application  : @afenda/erp, @afenda/docs, @afenda/storybook, @afenda/email
Rank 5 — Domain       : (future domain packages)
Rank 4 — ERPSpine     : (retired — ADR-0027; no @afenda/appshell)
Rank 3 — Integration  : @afenda/entitlements, @afenda/feature-flags, @afenda/testing
Rank 2 — Foundation   : @afenda/execution, @afenda/erp-module-foundation, @afenda/storage,
                         @afenda/accounting-standards
Rank 2 — Design       : @afenda/shadcn-studio (PAS-006 · ADR-0027)
Rank 1 — Platform     : @afenda/auth, @afenda/database, @afenda/observability,
                         @afenda/permissions, @afenda/architecture-authority,
                         @afenda/typescript-config, @afenda/ai-governance,
                         @afenda/kernel, @afenda/enterprise-knowledge
```

Retired presentation packages (`@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, `@afenda/css-authority`) are **archive-lane only** — see ADR-0027.

**Direction rule:** packages may only import from the same rank or lower (lower rank number = closer to platform). Higher-rank packages must never be imported by lower-rank packages.

---

## Non-negotiable rules

1. **Package name only for imports.** Never use relative paths across package boundaries:
   ```ts
   // ✅
   import { createLogger } from "@afenda/observability";
   // ❌
   import { createLogger } from "../../observability/src/index.js";
   ```

2. **`index.ts` is the only public surface.** Consumers import from the package name (which resolves to `index.ts`). Never import from a deep path inside another package:
   ```ts
   // ✅
   import { writeAuditEvent } from "@afenda/observability";
   // ❌
   import { writeAuditEvent } from "@afenda/observability/src/audit.writer.js";
   ```

3. **Apps never imported by packages.** `@afenda/erp` (Application layer) must never appear in a `package.json#dependencies` of any `packages/*` package. Information only flows downward.

4. **No circular dependencies.** If A imports B and B imports A, both fail the architecture validator. Extract the shared concern to a lower-rank package.

5. **`workspace:*` pinning.** All internal package dependencies use `workspace:*`, never a semver range:
   ```json
   { "@afenda/observability": "workspace:*" }
   ```

6. **No phantom dependencies.** A package may only import what is listed in its own `package.json#dependencies` or `devDependencies`. Hoisting is not a contract.

---

## Allowed imports by layer

| From \ To | Platform | Design | Foundation | Integration | Metadata | ERPSpine | Domain | Application |
|-----------|----------|--------|------------|-------------|----------|----------|--------|-------------|
| Platform  | same-ok  | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Design    | ✅ | same-ok | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Foundation| ✅ | ❌ | same-ok | ❌ | ❌ | ❌ | ❌ | ❌ |
| Integration| ✅ | ❌ | ✅ | same-ok | ❌ | ❌ | ❌ | ❌ |
| Metadata  | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ERPSpine  | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Domain    | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Application| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

"same-ok" means same-layer imports are allowed for that layer.

---

## Scaffolding a new package (`pnpm scaffold:package`)

Use **`pnpm scaffold:package`** from the repo root — non-interactive, agent-safe. **Do not use `turbo gen workspace --copy`** (interactive prompts break agent/automation flows and duplicate `dist/` / `node_modules/` from the copy source).

Templates live under `templates/package-scaffold/`. Env wiring is integrated: Vitest loads monorepo env automatically; optional `--with-env-scripts` adds `scripts/load-env.ts` + `dotenv` for standalone tsx scripts.

### Choose a variant

| New package type | Variant | Runtime deps |
|------------------|---------|--------------|
| Foundation authority (kernel contracts) | `foundation-with-kernel` | `@afenda/kernel` |
| Platform authority (zero runtime deps) | `platform-zero-deps` | none |
| Contract-heavy metadata | Manual peer copy from `packages/ui-composition` | varies |
| React/UI (Design layer only) | Manual peer copy from `packages/shadcn-studio` | PAS-006 — ask before use |

**Do not copy:** `packages/kernel` wholesale (wrong layout gates). **Do not scaffold:** `crm`, `hrm`, `procurement`, `inventory` — blocked by `pnpm check:business-master-data-scaffold`.

### Commands

```bash
# Platform authority (PAS-004 pattern) — always pass --pas for real packages
pnpm scaffold:package -- \
  --name @afenda/<pkg-name> \
  --variant platform-zero-deps \
  --pas PAS-NNN-<kebab-name>-STANDARD.md \
  --description "Short PAS description"

# Kernel-dependent Foundation authority (PAS-003 pattern)
pnpm scaffold:package -- \
  --name @afenda/<pkg-name> \
  --variant foundation-with-kernel \
  --pas PAS-NNN-<kebab-name>-STANDARD.md \
  --description "Short PAS description"

# Package with standalone CLI scripts that read secrets
pnpm scaffold:package -- \
  --name @afenda/<pkg-name> \
  --variant platform-zero-deps \
  --with-env-scripts \
  --env-sync-target

# End-to-end template verification (install → typecheck → test → cleanup)
pnpm scaffold:package -- --verify --variant platform-zero-deps
pnpm scaffold:package -- --verify --variant foundation-with-kernel
```

**Naming:** do not use `_`-prefixed package names in production (`--allow-internal-name` for smoke only). Default tombstone without `--pas` is a placeholder (`PAS-NNN-<kebab-slug>-STANDARD.md`).

**Post-scaffold order:** `pnpm install` first (workspace link), then `typecheck`, then `test:run`.

`--env-sync-target` prints a checklist to add `packages/<dir>/.env` to `LOCAL_SYNC_TARGETS` in `scripts/env-utils.mjs`, then run `pnpm env:console refresh`. See [env-var-governance](../env-var-governance/SKILL.md) and `.cursor/rules/env-workflow.mdc`.

### Post-scaffold cleanup (before registry)

```
[ ] Replace placeholder PAS tombstone if --pas was omitted
[ ] Update src/index.ts fingerprint when PAS contracts stabilize
[ ] Update architecture-boundary.test.ts approved/prohibited lists if deps differ
[ ] 1. pnpm install  ← required before typecheck/test
[ ] 2. pnpm --filter @afenda/<pkg-name> typecheck
[ ] 3. pnpm --filter @afenda/<pkg-name> test:run  (and typecheck:scripts if --with-env-scripts)
[ ] 4. pnpm check:business-master-data-scaffold
[ ] If --env-sync-target: edit LOCAL_SYNC_TARGETS → pnpm env:console refresh → .env.example
[ ] Delegate registry rows to foundation-registry-owner
```

**Do not automate:** registry rows (`layer-registry`, `package-registry`, `ownership-registry`, `dependency-registry`, `foundation-disposition.registry.ts`) — delegate to **`foundation-registry-owner`**. Full PAS docs and package-specific governance scripts remain separate slices.

---

## Adding a new package checklist

```
[ ] 0. Filesystem scaffold — `pnpm scaffold:package` (see above) or manual peer copy for UI/metadata trees
[ ] 1. Layer assigned in architecture-authority layer-registry.data.ts
[ ] 2. Package registered in package-registry.data.ts
[ ] 3. Ownership recorded in ownership-registry.data.ts
[ ] 4. All dependencies use workspace:* for internal packages
[ ] 5. package.json#exports defines the public surface (typically dist via tsc -b build)
[ ] 6. No imports from packages at a higher layer rank
[ ] 7. No circular deps — run pnpm --filter @afenda/architecture-authority test:run
```

---

## Adding an import to an existing package checklist

```
[ ] 1. The imported package is listed in package.json#dependencies
[ ] 2. The import is from the package name, not a deep internal path
[ ] 3. The target package is at the same or lower layer rank
[ ] 4. The import does not create a cycle (check with architecture-authority)
```

---

## Verification

```bash
# Run architecture validation (catches layer violations, cycles, registry gaps)
pnpm --filter @afenda/architecture-authority test:run

# Full workspace type check (catches phantom dep import errors)
pnpm typecheck
```

## Dead code (Knip)

Discovery: `pnpm housekeeping:knip:workspace packages/<name>` or `pnpm housekeeping:knip` (config [`knip.jsonc`](../../../knip.jsonc)). Orchestration: [`/afenda-repo-housekeeping`](../afenda-repo-housekeeping/SKILL.md). Removal: [`/afenda-monorepo-refactor`](../afenda-monorepo-refactor/SKILL.md) Slice D.

See [LAYERS.md](LAYERS.md) for the full layer diagram with package assignments and known exceptions.
