# Import Order

## ERP app entry — `apps/erp/src/app/globals.css`

Canonical composition (do not reorder):

```css
@layer theme, base, components, utilities;

@import "tailwindcss";

@import "@afenda/ui/afenda-ui.css";
@import "@afenda/shadcn-studio/shadcn-studio.css" layer(theme);
@import "@afenda/appshell/afenda-appshell.css";
@import "@afenda/metadata-ui/afenda-metadata-ui.css" layer(components);
@import "shadcn/tailwind.css";

@source "../**/*.{ts,tsx}";
@source "../../../../packages/design-system/src/**/*.{ts,tsx,css}";
@source "../../../../packages/ui/src/**/*.{ts,tsx}";
@source "../../../../packages/appshell/src/**/*.{ts,tsx}";
@source "../../../../packages/metadata-ui/src/**/*.{ts,tsx}";
@source "../../../../packages/shadcn-studio/src/**/*.{ts,tsx}";

/* App overrides in @layer components { ... } */
```

**Do not:**

- Insert imports between package entries
- Import fixture CSS (`metadata-ui/fixtures.css`)
- Import `@afenda/ui-composition` (contract package — no CSS)
- Duplicate `@import "tailwindcss"` in package CSS

## Package CSS — `@afenda/ui/afenda-ui.css`

Packages compose authority CSS — they do **not** import Tailwind:

```css
@layer theme, base, components, utilities;

@import "@afenda/design-system/css/afenda-tokens.css";
@import "@afenda/css-authority/css/afenda-css-authority.css";

@layer components {
  /* primitive structural hooks only */
}
```

**Do not** define `--afenda-*` tokens or `@theme` in `afenda-ui.css`. **Do not** add `@source` here — that belongs in app entries.

## CSS dist sync

Apps import foundation CSS from package **`dist/`** exports. After editing package CSS sources:

```bash
pnpm sync:package-css-dist
pnpm check:package-css-dist-sync
```

## Architecture summary

1. **`:root` / `.dark`** at token authority root — semantic variables
2. **`@theme inline`** in `@afenda/css-authority` — maps tokens to utilities
3. **`@layer base`** — semantic defaults
4. **Apps** import package CSS bundles — never duplicate Tailwind base

Studio block patterns: `packages/appshell/src/styles/afenda-appshell-studio.css` (`.app-shell-studio-*`)
