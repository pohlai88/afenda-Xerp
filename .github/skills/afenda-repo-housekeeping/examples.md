# Housekeeping examples (waves 1–5)

Worked examples from the initial rollout. Use as audit/plan reference — do not replay deletes without fresh Knip + `rg`.

---

## Example 1 — P0 stale refs (Wave 1)

**Class:** broken import / stale-ref (P0)

**Signal:** Governance tests imported retired `@afenda/ui` scripts.

**Action:** Delegate Slice D — delete broken test files only.

**Lesson:** Run before Knip expand — broken imports block typecheck.

---

## Example 2 — Observability registry drift (Wave 3)

**Class:** `registry-drift` (NOT unused-file)

**Signal:** `governed-mutation-audit-registry.ts` listed 17 server actions that do not exist on disk (e.g. `demo-auth-action.ts`).

**Action:** **align** — trim both registries to the one existing action: `apps/erp/src/lib/context/context-switch.action.ts`.

**Files:**

- `packages/observability/src/surface/governed-mutation-audit-registry.ts`
- `packages/observability/src/surface/governed-diagnostic-logging-registry.ts`

**Gates:** `pnpm --filter @afenda/observability test:run` → 75/75 pass.

**Lesson:** Do not search for ghost files to delete — fix the registry.

---

## Example 3 — Permissions catalog drift (Wave 5)

**Class:** `catalog-drift`

**Signal:** `seed-catalog-alignment.test.ts` failed — inventory permission keys missing from catalog.

**Action:** **align** — add 7 keys to `packages/database/src/seeds/platform-permissions.catalog.ts`:

- `stock_movement_read/post/cancel`
- `stock_reservation_read/reserve/fulfill/cancel`

**Required gate before permissions tests:**

```bash
pnpm --filter @afenda/database build
pnpm --filter @afenda/permissions test:run
```

**Lesson:** `@afenda/permissions` reads catalog from `@afenda/database` **dist**, not src.

---

## Example 4 — Storybook orphan incident (Wave 4)

**Class:** `storybook-orphan`

**Signal:** Orphan script deleted `error-page-shell` and `morphing-text` blocks — false positives.

**Root cause:** Script defaulted to apply; consumer resolver missed MCP seed IDs and layout import paths.

**Recovery:** `git restore` for deleted blocks.

**Fix:** Dry-run default; hardened [`resolve-block-consumers.mjs`](../../scripts/storybook/lib/resolve-block-consumers.mjs); added tests.

**Lesson:** Always dry-run in same session; never `--apply` without reviewing output. ERP and studio both consume blocks via non-obvious paths.

---

## Example 5 — Testing unused exports (Wave 3)

**Class:** `unused-export`

**Signal:** Knip flagged exported symbols only used internally.

**Action:** Delegate Slice D — unexport (not delete files):

- `packages/testing/src/execution/validate-mock-execution-context-overrides.ts`
- `packages/testing/src/setup/load-monorepo-env.ts`

**Lesson:** Prefer unexport over delete when file is still used internally.

---

## Example 6 — Entitlements deferred (Wave 5)

**Class:** `intentional-public`

**Signal:** Knip reports 6 unused service files in `@afenda/entitlements`.

**Action:** **audit only** — defer. Check `foundation-disposition.registry.ts` before any Slice D.

**Lesson:** Foundation stubs are not dead code until registry and PAS say otherwise.

---

## Example 7 — expand mode (auth tsx)

**Class:** Knip false positive (config)

**Signal:** Auth email templates flagged unused — missing `*.tsx` in project globs.

**Action:** **expand** — update workspace template:

```jsonc
"project": ["src/**/*.{ts,tsx}", "scripts/**/*.ts"]
```

**Lesson:** See [reference/workspace-templates.md](reference/workspace-templates.md).
