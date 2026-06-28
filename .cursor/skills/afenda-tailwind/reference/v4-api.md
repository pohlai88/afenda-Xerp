# Tailwind v4 API Reference

Condensed reference for Afenda agents. Afenda token rules override generic examples — tokens come from `@afenda/css-authority`, not ad-hoc `@theme` blocks in app CSS.

## @theme namespaces

| Namespace | Generated utilities |
| --- | --- |
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*` |
| `--font-*` | `font-*` |
| `--text-*` | `text-xs`, `text-sm`, `text-base`, etc. |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` |
| `--radius-*` | `rounded-*` |
| `--shadow-*` | `shadow-*` |
| `--breakpoint-*` | `sm:*`, `md:*`, `lg:*`, `xl:*` |
| `--animate-*` | `animate-spin`, `animate-bounce`, etc. |
| `--ease-*` | `ease-in`, `ease-out`, `ease-in-out` |

Afenda uses **`@theme inline`** in `@afenda/css-authority` to bridge existing CSS variables — do not duplicate token definitions in app `globals.css`.

## Directives

### @utility — create a utility

```css
@utility tab-4 {
  tab-size: 4;
}
/* Usage: class="tab-4" */
```

Prefer `@utility` over `@layer utilities { }` for new utilities.

### @custom-variant — new variant

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
/* Usage: dark:bg-background */
```

### @source — content detection

App entries declare scan scopes (see `apps/erp/src/app/globals.css`):

```css
@source "../**/*.{ts,tsx}";
@source "../../../../packages/ui/src/**/*.{ts,tsx}";
```

### @apply — inline utilities in CSS

```css
.btn {
  @apply px-4 py-2 rounded-lg font-bold;
}
```

Use sparingly in package CSS; prefer semantic classes (`.app-shell-studio-*`) for studio blocks.

## Core functions

```css
/* Adjust color opacity */
color: --alpha(var(--color-lime-300) / 50%);

/* Generate spacing values */
margin: --spacing(4);
```

## shadcn + v4 gotchas

Borrowed from production v4+shadcn patterns — Afenda import order is canonical in [import-order.md](import-order.md).

- Do not insert new `@import` between existing package imports in `globals.css`
- Do not duplicate `@layer base` blocks after shadcn init
- Use `@plugin "@tailwindcss/typography"` syntax in v4 — not `require()` in JS config
- `tw-animate-css` is deprecated in v4 — use `@keyframes` inside `@theme`
- App additions go after `shadcn/tailwind.css`

## Upgrade tool

```bash
npx @tailwindcss/upgrade
```

Requires Node.js 20+. Run only with explicit user approval — Afenda migration is governed by PAS-005 slices.

## Browser support

Safari 16.4+ · Chrome 111+ · Firefox 128+
