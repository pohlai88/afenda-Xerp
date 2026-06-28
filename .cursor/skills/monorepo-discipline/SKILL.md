---
name: monorepo-discipline
description: Enforces monorepo import discipline, package layering rules, circular dependency prevention, and internal export surface governance for the @afenda workspace. References the architecture-authority layer registry. Use when adding imports between packages, creating a new package, scaffolding with turbo gen workspace --copy, reviewing package.json dependencies, or when the user mentions cross-package imports, circular dependencies, layer violations, or workspace governance.
disable-model-invocation: true
---

# monorepo-discipline

The `@afenda/architecture-authority` package enforces these rules automatically at CI time. This skill tells you what the rules are and why, so you follow them before the CI gate fails.

## Layer hierarchy (from `layer-registry.data.ts`)

```
Rank 6 — Application  : @afenda/erp, @afenda/docs, @afenda/storybook
Rank 5 — Domain       : (future domain packages)
Rank 4 — ERPSpine     : @afenda/appshell
Rank 3 — Metadata     : @afenda/metadata, @afenda/metadata-ui
Rank 3 — Integration  : @afenda/entitlements, @afenda/feature-flags, @afenda/testing
Rank 2 — Foundation   : @afenda/execution, @afenda/storage, @afenda/accounting-standards
Rank 2 — Design       : @afenda/design-system, @afenda/ui
Rank 1 — Platform     : @afenda/auth, @afenda/database, @afenda/observability,
                         @afenda/permissions, @afenda/architecture-authority,
                         @afenda/typescript-config, @afenda/ai-governance,
                         @afenda/kernel, @afenda/enterprise-knowledge
```

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

## Scaffolding a new package (Turborepo built-in)

Use **`turbo gen workspace --copy`** from the repo root — no custom generators or `@turbo/gen` required. Copy an in-repo authority skeleton, then clean up and register.

### Choose a template

| New package type | Copy from | Runtime deps |
|------------------|-----------|--------------|
| Foundation authority (kernel contracts) | `packages/accounting-standards` | `@afenda/kernel` |
| Platform authority (zero runtime deps) | `packages/enterprise-knowledge` | none |
| Contract-heavy metadata | `packages/metadata` | none — heavier tree |
| React/UI (Design layer only) | `packages/ui` | many — ask before use |

**Do not copy:** `packages/kernel` wholesale (wrong layout gates). **Do not scaffold:** `crm`, `hrm`, `procurement`, `inventory` — blocked by `pnpm check:business-master-data-scaffold`.

### Commands

```bash
# Kernel-dependent Foundation authority (PAS-003 pattern)
pnpm exec turbo gen workspace --copy packages/accounting-standards \
  --name @afenda/<pkg-name> \
  --destination packages/<pkg-dir> \
  --type package

# Zero runtime-deps Platform authority (PAS-004 pattern)
pnpm exec turbo gen workspace --copy packages/enterprise-knowledge \
  --name @afenda/<pkg-name> \
  --destination packages/<pkg-dir> \
  --type package
```

Interactive mode (omit flags): `pnpm exec turbo gen workspace --copy`

### Post-copy cleanup (before registry)

```
[ ] Delete copied dist/ and node_modules/ under packages/<pkg-dir>/
[ ] Update package.json name, description, and PAS id in tombstone filename
[ ] Rewrite src/index.ts fingerprint export for the new package
[ ] Update architecture-boundary.test.ts approved/prohibited dependency lists
[ ] Remove template-specific PAS tombstone content; point to docs/PAS/PAS-NNN-*.md
[ ] pnpm install
[ ] pnpm --filter @afenda/<pkg-name> typecheck
[ ] pnpm --filter @afenda/<pkg-name> test:run
[ ] pnpm check:business-master-data-scaffold
```

**Do not automate:** registry rows (`layer-registry`, `package-registry`, `ownership-registry`, `dependency-registry`, `foundation-disposition.registry.ts`) — delegate to **`foundation-registry-owner`**. Full PAS docs and package-specific governance scripts remain separate slices.

---

## Adding a new package checklist

```
[ ] 0. Filesystem scaffold — turbo gen workspace --copy (see above) or manual peer copy
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

See [LAYERS.md](LAYERS.md) for the full layer diagram with package assignments and known exceptions.
