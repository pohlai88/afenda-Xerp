---
name: package-css-dist-sync
description: >-
  Package CSS dist sync workflow for @afenda/appshell, @afenda/ui, and
  @afenda/metadata-ui. Use after editing package CSS sources, before ERP or
  Storybook visual verification, when debugging missing styles, or when setting
  Phase 0 gates for shell/UI CSS work. Apps import CSS from dist/, not src/.
disable-model-invocation: true
paths:
  - packages/appshell/src/**/*.css
  - packages/ui/src/**/*.css
  - packages/metadata-ui/**/*.css
---

# Package CSS dist sync

**Problem:** Apps import CSS from package **`dist/`** exports. Editing `src/` CSS without syncing `dist/` leaves ERP/Storybook serving stale rules — often showing as missing padding, radius, or token-scoped layout.

**Announce when invoked:** "Using package-css-dist-sync — syncing dist CSS before visual verification."

## When to use

| Trigger | Action |
|---------|--------|
| Edited `packages/appshell/src/styles/**` | Sync before ERP auth/shell visual check |
| Edited `packages/ui/src/styles/**` | Sync before primitive/token visual check |
| Edited `packages/metadata-ui/src/**/*.css` | Sync before metadata renderer visual check |
| Agent stop hook failed `package-css-dist-sync` | Run sync, re-run check |
| Pre-commit staged package CSS | lint-staged auto-syncs (still verify in Completion Report) |

## Commands

```bash
# Fast CSS-only sync (all packages)
pnpm sync:package-css-dist

# One package
pnpm sync:package-css-dist -- --package @afenda/appshell
pnpm sync:package-css-dist -- --package @afenda/ui
pnpm sync:package-css-dist -- --package @afenda/metadata-ui

# Full build (TS + CSS) — use when TS and CSS both changed
pnpm --filter @afenda/appshell build
pnpm --filter @afenda/ui build
pnpm --filter @afenda/metadata-ui build

# Verification gate (required in Completion Report for CSS edits)
pnpm check:package-css-dist-sync
```

## Workflow (agents)

1. Edit **`src/` CSS only** — never hand-edit `dist/`.
2. Run **`pnpm sync:package-css-dist`** (or scoped `--package`).
3. Run **`pnpm check:package-css-dist-sync`** — must exit 0.
4. Restart or hard-refresh the consuming app dev server.
5. Record both commands in the **Completion Report → Tests / gates run** table.

## Phase 0 gate line (copy when CSS sources change)

```txt
Acceptance gates: pnpm sync:package-css-dist -- --package @afenda/appshell && pnpm check:package-css-dist-sync && pnpm --filter @afenda/erp typecheck
```

Adjust the package filter to match the layer you edited.

## Enforcement map

| Mechanism | Path |
|-----------|------|
| Policy registry | `scripts/governance/package-css-dist-policy.mjs` |
| Check script | `scripts/governance/check-package-css-dist-sync.mjs` |
| Sync script | `scripts/governance/sync-package-css-dist.mjs` |
| Cursor rule | `.cursor/rules/package-css-dist-sync.mdc` |
| postToolUse hook | `.cursor/hooks/post-package-css-source-edit.mjs` |
| stop hook gate | `.cursor/hooks/stop-quality-gates.mjs` (`package-css-dist-sync`) |
| pre-commit | `lint-staged` in root `package.json` |

## Related authority

- CSS composition order: `docs/governance/downstream-ui-composition.md`
- AppShell CSS manifest: `packages/appshell/src/styles/css-manifest.ts`
- Governed UI consumption: `.cursor/skills/afenda-shadcn-components/SKILL.md`

## Do not

- Verify ERP auth/shell visuals immediately after editing `src/` CSS without syncing `dist/`
- Edit `packages/*/dist/**/*.css` directly
- Assume `pnpm --filter @afenda/erp dev` rebuilds upstream package CSS — it does not
