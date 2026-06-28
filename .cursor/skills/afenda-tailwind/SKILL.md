---
name: afenda-tailwind
description: >-
  Afenda ERP Tailwind v4 authority — CSS-first @theme inline, import order,
  layered utility rules (author/consumer/app), v3 banlist, validation script,
  and quality gates. Use when editing Tailwind CSS, @utility/@theme/@source,
  globals.css, package CSS, or utility styling in apps/erp, apps/storybook,
  packages/ui, packages/appshell, packages/metadata-ui. For PAS-005 token
  registry slices use css-authority; for studio block promotion use
  afenda-shadcn-components.
disable-model-invocation: true
paths:
  - apps/erp/**/*.css
  - apps/storybook/**/*.css
  - packages/ui/**/*.css
  - packages/appshell/**/*.css
  - packages/css-authority/**/*.css
  - packages/design-system/**/*.css
---

# Afenda Tailwind v4

Single entry for Tailwind work in the Afenda monorepo. Scoped to `packages/css-authority`, `packages/design-system`, `packages/ui`, `packages/appshell`, `packages/metadata-ui`, `apps/erp`, `apps/storybook`.

## When to use / when to defer

| Task | Skill |
| --- | --- |
| Tailwind CSS, `@utility`, `@theme`, `@source`, `globals.css`, package CSS | **this skill** |
| PAS-005 token registry, `CSS-TOKEN-*`, `@afenda/css-authority` slices | `css-authority` |
| `@afenda/ui` primitive authoring | `govern-primitive` |
| shadcn/studio MCP promotion, block adaptation | `afenda-shadcn-components` + `shadcn-studio` |
| UI fix-first preflight, surface routing | `ui-consistency-bundle` |
| shadcn normalization pipeline | `afenda-ui-quality` |

Canonical docs: [`docs/architecture/css-authority.md`](../../../docs/architecture/css-authority.md) · PAS-005: [`docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md`](../../../docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md)

## Layered styling model

Afenda is **not** utility-first everywhere. Tailwind usage depends on layer:

| Layer | Path | Tailwind rule |
| --- | --- | --- |
| **Token** | `packages/css-authority` | `@theme inline` maps shadcn bridge vars to utilities; never ad-hoc hex/OKLCH in app CSS |
| **Author** | `packages/ui/src/components` | Zero raw Tailwind — `resolvePrimitiveGovernance()` only (see `.cursor/rules/no-raw-tailwind.mdc`) |
| **Consumer** | `packages/appshell`, `apps/erp` | Semantic utilities on **plain HTML** only; zero `className` on `@afenda/ui` primitives |
| **Studio blocks** | `packages/appshell/src/shadcn-studio/blocks` | `.app-shell-*` / `.app-shell-studio-*` only — no raw utilities in block TSX |
| **App entry** | `apps/erp/src/app/globals.css` | Single `@import "tailwindcss"` + `@source` scopes; package CSS never re-imports Tailwind |

Full layer guide: [reference/layered-styling.md](reference/layered-styling.md)

## Import order (ERP)

App entry: `apps/erp/src/app/globals.css`

1. `@import "tailwindcss"`
2. `@afenda/ui/afenda-ui.css`
3. `@afenda/shadcn-studio/shadcn-studio.css` (layer theme)
4. `@afenda/appshell/afenda-appshell.css`
5. `@afenda/metadata-ui/afenda-metadata-ui.css` (layer components)
6. `shadcn/tailwind.css`
7. App overrides in `@layer components`

Do not insert imports between package entries. Do not duplicate `@import "tailwindcss"` in package CSS.

Full chain: [reference/import-order.md](reference/import-order.md)

## v3 banlist (reject on sight)

| v3 (ban) | v4 (use) |
| --- | --- |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` theme.extend | `@theme` / `@theme inline` in CSS |
| `@layer utilities { .foo {} }` for new utilities | `@utility foo { ... }` |
| `hsl(var(--primary))` | `var(--primary)` or `bg-primary` utility |
| `rgb()`, hex in token sources | CSS variables + semantic utilities |

Extended banlist + v3→v4 renames: [reference/v3-banlist.md](reference/v3-banlist.md)

## Afenda-safe utility patterns

Use on **consumer plain HTML** and **shell chrome** only — not in `packages/ui` components or studio block TSX.

- Parent `gap-*` over child margins
- Mobile-first responsive prefixes (`md:`, `lg:`)
- `pointer-coarse:` for touch targets
- Semantic token utilities (`bg-muted`, `text-foreground`, `border-border`)
- Spacing via `var(--afenda-spacing-*)` until extension cutover

**Never use:** raw palette (`bg-gray-900`, `bg-blue-500`), hex/OKLCH outside authority token files, `v-stack`/`h-stack` (not in this repo), `tailwind.config.js`.

## Fix workflow

1. Fix at token source (`@afenda/css-authority` or design-system shim) if color-related
2. Map through `@theme inline` if utility missing
3. Use `@utility` for reusable non-token patterns
4. Promote reusable block patterns to `packages/appshell/src/styles/afenda-appshell-studio.css`
5. After package CSS edits: `pnpm sync:package-css-dist` then verify
6. Re-run gates below

## shadcn component install

```bash
npx shadcn@latest add [component] -c packages/ui
```

MCP install cwd: **`packages/ui`** only.

## Verification gates

```bash
pnpm --filter @afenda/design-system build
pnpm quality:css
pnpm ui:guard:scan
pnpm check:css-governance
pnpm --filter @afenda/erp typecheck
```

When package CSS sources change:

```bash
pnpm sync:package-css-dist
pnpm check:package-css-dist-sync
```

## Validation script

Detect v3 regressions before or after Tailwind edits:

```bash
python .cursor/skills/afenda-tailwind/scripts/validate-tailwind-v4.py --root . --verbose
python .cursor/skills/afenda-tailwind/scripts/validate-tailwind-v4.py --root . --strict --ci
```

## Reference

| File | Contents |
| --- | --- |
| [reference/v4-api.md](reference/v4-api.md) | `@theme` namespaces, directives, v4 API |
| [reference/layered-styling.md](reference/layered-styling.md) | Author / consumer / token / app layers |
| [reference/import-order.md](reference/import-order.md) | globals.css + package CSS rules |
| [reference/v3-banlist.md](reference/v3-banlist.md) | Full v3 ban + migration table |

Official Tailwind v4 docs: [theme](https://tailwindcss.com/docs/theme) · [directives](https://tailwindcss.com/docs/functions-and-directives) · [upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
