# Layered Styling Model

Afenda separates Tailwind concerns across four layers. Applying the wrong layer's rules causes governance gate failures.

## Token layer — `packages/css-authority`

**Owns:** shadcn bridge variables, `@theme inline`, generated `CSS-TOKEN-*` registry, consumption validation.

**Rules:**

- `:root` / `.dark` at stylesheet root — semantic CSS variables
- `@theme inline` maps tokens to Tailwind utilities via `var(--token)`
- `@layer base` applies semantic defaults
- Never hand-edit `src/generated/css-authority-registry.ts`

**Defer to:** `css-authority` skill for PAS-005 slice work.

Canonical token shim: `@afenda/design-system/css/afenda-tokens.css` (`--afenda-*`). Prefer shadcn vars (`--foreground`, `--border`) in new ERP CSS.

Legacy `@import "@afenda/design-system/css/afenda-design-system.css"` is a **B30 deprecation shim** — prefer `@afenda/ui/afenda-ui.css`.

## Author layer — `packages/ui/src/components`

**Owns:** Governed UI primitives via `resolvePrimitiveGovernance()`.

**Rules:**

- Zero raw Tailwind in component TSX (not even `bg-primary` or `rounded-md`)
- Stories use `StoryStack` / `StoryFrame` / `StoryRow` — not raw spacing utilities
- Only `_storybook/story-frame.tsx` may centralize layout Tailwind for stories

**Enforcement:** `pnpm --filter @afenda/ui check:governance` · `.cursor/rules/no-raw-tailwind.mdc`

**Defer to:** `govern-primitive` skill.

## Consumer layer — `packages/appshell`, `apps/erp`

**Owns:** Shell chrome, page composition, plain HTML wrappers.

**Rules:**

- Semantic bridge utilities on plain HTML: `bg-muted`, `flex`, `gap-*`, `text-foreground`
- Zero `className` on `@afenda/ui` governed primitives
- Layout/spacing may use `var(--afenda-spacing-*)` until extension cutover
- No raw hex/oklch outside authority token files
- `tabular-nums` on numeric data; status cells use dot + text (no filled pill backgrounds)

**Enforcement:** `pnpm ui:guard:scan` · `pnpm --filter @afenda/appshell check:governance`

**Defer to:** `governed-ui-consumption.mdc` · `afenda-ui-quality`.

## Studio blocks — `packages/appshell/src/shadcn-studio/blocks`

**Owns:** Adapted shadcn/studio block markup.

**Rules:**

- No raw Tailwind utilities in block TSX
- Use `.app-shell-*` / `.app-shell-studio-*` classes only
- Reusable patterns live in `packages/appshell/src/styles/afenda-appshell-studio.css`

**Defer to:** `afenda-shadcn-components` + `shadcn-studio`.

## App entry — `apps/*/src/app/globals.css`

**Owns:** Single Tailwind import, `@source` scopes, app-level overrides.

**Rules:**

- Exactly one `@import "tailwindcss"` per app entry
- Package CSS files never re-import Tailwind
- `@layer theme, base, components, utilities` declared once for deterministic cascade

See [import-order.md](import-order.md).

## Decision tree

```
Editing CSS/TSX?
├── packages/css-authority/**     → css-authority (+ this skill for @theme syntax)
├── packages/ui/src/components/** → govern-primitive (no Tailwind in TSX)
├── shadcn-studio/blocks/**       → afenda-shadcn-components (studio classes only)
├── packages/appshell/**          → this skill (consumer + studio CSS)
├── apps/erp/**                   → this skill + ui-consistency-bundle
└── globals.css / @source         → this skill (import-order.md)
```
