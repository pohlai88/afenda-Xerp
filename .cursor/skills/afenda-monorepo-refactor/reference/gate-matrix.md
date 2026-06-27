# Gate Matrix by Refactor Type

Run **scoped gates first**. Expand to workspace gates only when the slice touches cross-package imports or `architecture-authority` registries.

---

## Universal minimum (every execute slice)

| Gate | Command |
|------|---------|
| Target typecheck | `pnpm --filter <target-pkg> typecheck` |
| Target tests | `pnpm --filter <target-pkg> test:run` |
| Boundaries | `pnpm quality:boundaries` |
| Cycles | `pnpm architecture:cycles` |
| Architecture authority | `pnpm --filter @afenda/architecture-authority test:run` |

---

## By refactor type

### extract / move / split-package

| Additional gate | When |
|-----------------|------|
| Source package typecheck | Source files removed or re-export shims remain |
| Each consumer typecheck | Consumer in slice scope |
| `pnpm typecheck` (root) | Slice authorizes full workspace check |
| `pnpm check:foundation-disposition` | Foundation package touched |
| `pnpm quality:architecture` | Registry or layer assignment changed |

### rename-export

| Additional gate | When |
|-----------------|------|
| Export surface test | Package has `*.export.test.ts` pattern |
| Consumer package typecheck | Each migrated consumer |
| `pnpm quality:kernel-context-surface` | `@afenda/kernel` export map changed |

### layer-fix

| Additional gate | When |
|-----------------|------|
| `pnpm quality:boundaries` | **Before and after** — primary proof |
| `pnpm architecture:drift` | Structural registry change |

### consumer-migration

| Additional gate | When |
|-----------------|------|
| `pnpm --filter <consumer> typecheck` | Required per consumer |
| `pnpm --filter <consumer> test:run` | Consumer has tests for migrated paths |
| `pnpm ui:guard:scan` | Consumer is `apps/erp` and touches UI imports |

---

## Package-specific gates

| Package touched | Optional / required gates |
|-----------------|---------------------------|
| `@afenda/kernel` | `pnpm quality:kernel-context-surface`; PAS-001 slice gates if applicable |
| `@afenda/database` | `pnpm quality:migrations` — never hand-edit SQL |
| `@afenda/ui` | `pnpm ui:guard` — TIP-004 governed primitives |
| `@afenda/appshell` | `pnpm --filter @afenda/appshell test:run` |
| `apps/erp` | `pnpm --filter @afenda/erp typecheck`; Next.js MCP `get_errors` if routes changed |
| CSS in packages | `pnpm sync:package-css-dist` then `pnpm check:package-css-dist-sync` |

Verify optional commands exist in `package.json` before running. Mark `NOT AVAILABLE`, not `FAIL`, if missing.

---

## Audit / plan mode

Do **not** run gates in `audit` or `plan` mode unless user explicitly requests. List recommended gates in the slice plan instead.

---

## stabilize mode

Use full `afenda-implementation-health` gate set for approved scope. Minimum:

```bash
pnpm --filter <scope> typecheck
pnpm --filter <scope> test:run
pnpm quality:boundaries
pnpm architecture:cycles
```
