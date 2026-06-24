---
name: afenda-css-tailwind-stylelint
description: >-
  Afenda ERP CSS — Tailwind v4, design tokens, utility-first styling for
  @afenda/design-system. Use when editing CSS, globals.css, @theme/@utility/@source,
  design tokens, or component styles in apps/erp and Storybook.
---

# Afenda ERP CSS + Tailwind v4

Scoped to the Afenda monorepo (`packages/design-system`, `apps/erp`, `apps/storybook`).

## When to apply

- Editing `packages/design-system/css/**/*.css` or app `globals.css`
- Adding design tokens, `@utility`, `@theme inline`, or `@source` scopes
- Choosing utilities vs custom CSS in components
- Fixing Tailwind v3 regressions (`@tailwind`, `tailwind.config.js`, `hsl(var(--*))`)

## Architecture

1. **`:root` / `.dark`** at stylesheet root — semantic CSS variables
2. **`@theme inline`** maps tokens to Tailwind utilities via `var(--token)`
3. **`@layer base`** applies semantic defaults
4. Apps import package CSS — do not duplicate `@import "tailwindcss"` in consumers

Canonical token authority: `@afenda/design-system` (`afenda-design-system.css`)

ERP app entry: `apps/erp/src/app/globals.css` (imports `@afenda/ui`, `@afenda/appshell`, etc.)

Studio block patterns: `packages/appshell/src/styles/afenda-appshell-studio.css` (`.app-shell-studio-*`)

See [`docs/architecture/css-authority.md`](../../../docs/architecture/css-authority.md).

## Tailwind v4 rules (reject v3)

| v3 (ban) | v4 (use) |
|----------|----------|
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` theme.extend | `@theme` / `@theme inline` in CSS |
| `@layer utilities { .foo {} }` for new utilities | `@utility foo { ... }` |
| `hsl(var(--primary))` | `var(--primary)` or `bg-primary` utility |
| `rgb()`, hex in token sources | CSS variables + semantic utilities |

## Utility-first (consumer vs author)

**ERP / appshell consumers (TIP-004):**

- No raw Tailwind utilities in `packages/appshell/src/shadcn-studio/blocks/*.tsx` — use `.app-shell-*` / `.app-shell-studio-*` only
- Shell chrome on plain HTML wrappers may use semantic bridge utilities (`bg-muted`, `flex`, `gap-*`) per Gate D anti-slop policy
- Zero `className` on `@afenda/ui` governed primitives

**Author layer (`packages/ui`):**

- Governed via `resolvePrimitiveGovernance()` — not utility-first TSX

## shadcn workflow

```bash
npx shadcn@latest add [component] -c packages/ui
```

MCP install cwd: **`packages/ui`** only (`components.json`, `shadcn-studio.config.json`).

## Verification

```bash
pnpm --filter @afenda/design-system build
pnpm quality:css
pnpm ui:guard:scan
pnpm --filter @afenda/erp typecheck
pnpm check
```

## Related skills

| Skill | When |
|-------|------|
| `tailwindcss-v4` | Generic v4 API and migration |
| `frontend-tailwind-best-practices` | Utility-first composition patterns |
| `css-architecture` | Layering and CSS structure |
| `govern-primitive` | `@afenda/ui` primitive authoring |
| `afenda-ui-quality` | shadcn/studio normalization pipeline |

All live under `.cursor/skills/`.

## Fix workflow

1. Fix at token source (`@afenda/design-system`) if color-related
2. Map through `@theme inline` if utility missing
3. Use `@utility` for reusable non-token patterns
4. Promote reusable block patterns to `afenda-appshell-studio.css`
5. Re-run `pnpm quality:css` and `pnpm ui:guard`
