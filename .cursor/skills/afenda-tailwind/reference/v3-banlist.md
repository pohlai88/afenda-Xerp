# v3 Banlist and Migration

Reject these patterns in Afenda CSS. AI assistants often default to v3 — flag and fix immediately.

## Afenda-specific bans

| v3 / anti-pattern (ban) | v4 / Afenda (use) |
| --- | --- |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` / `.ts` theme.extend | `@theme` / `@theme inline` in CSS |
| `@layer utilities { .foo {} }` for new utilities | `@utility foo { ... }` |
| `hsl(var(--primary))` | `var(--primary)` or `bg-primary` |
| `rgb()`, hex in token sources | CSS variables + semantic utilities |
| Raw palette in components (`bg-gray-900`) | `bg-muted`, `text-foreground`, token vars |
| `v-stack` / `h-stack` custom utilities | `flex flex-col gap-*` / `flex flex-row gap-*` |
| Duplicate `@import "tailwindcss"` in packages | Single import in app `globals.css` only |

## Config file bans

Delete if found (migrate to CSS `@theme`):

- `tailwind.config.js`
- `tailwind.config.ts`
- `tailwind.config.mjs`
- `tailwind.config.cjs`

## PostCSS (v3 → v4)

**v3 (ban):**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**v4 (use):**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

Remove `autoprefixer` — built into `@tailwindcss/postcss`.

## Utility renames (v3 → v4)

| v3 | v4 |
| --- | --- |
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` | `ring-3` |
| `bg-opacity-*` | `bg-black/50` (slash opacity) |
| `text-opacity-*` | `text-black/50` |
| `flex-shrink-*` | `shrink-*` |
| `flex-grow-*` | `grow-*` |

## Syntax changes

**Custom utilities:**

```css
/* v3 — ban */
@layer utilities {
  .tab-4 { tab-size: 4; }
}

/* v4 — use */
@utility tab-4 {
  tab-size: 4;
}
```

**Arbitrary CSS variables:**

```html
<!-- v3 -->
<div class="bg-[--brand-color]"></div>

<!-- v4 -->
<div class="bg-(--brand-color)"></div>
```

**Important modifier:**

```html
<!-- v3 -->
<div class="!bg-red-500">

<!-- v4 -->
<div class="bg-red-500!">
```

## Plugins (v3 → v4)

| v3 | v4 |
| --- | --- |
| `plugins: [require('@tailwindcss/forms')]` | `@plugin "@tailwindcss/forms"` |
| `content: ['./src/**/*.tsx']` | `@source` in CSS (auto-detect) |

## Validation

Run the project validator after any Tailwind edit:

```bash
python .cursor/skills/afenda-tailwind/scripts/validate-tailwind-v4.py --root . --strict
```
