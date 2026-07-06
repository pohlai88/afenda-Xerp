# shadcn + Tailwind v4 (V2)

How `@afenda/shadcn-studio-v2` splits CSS authority from consuming apps. For PAS-006 Phase 1 doctrine and import-only `globals.css` rules, defer to `afenda-tailwind`. For repo paths and gates, see [repo-authority.md](repo-authority.md).

## Authority Split

| Owner | Owns | Does not own |
| --- | --- | --- |
| Package CSS (`src/styles/*.css`) | `:root` / `.dark` OKLCH semantic variables; theme overlay scoped classes | `@import "tailwindcss"`, `@source`, app-specific layout |
| App CSS (`apps/erp/src/app/globals.css`, Storybook `preview.css`, developer lab) | Tailwind entry, `shadcn/tailwind.css`, package CSS imports, `@source`, optional `@theme inline` | Duplicate `:root` token blocks copied from package |

After editing package CSS sources, always sync dist:

```bash
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio-v2
pnpm check:package-css-dist-sync
```

## Canonical App Import Stack

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@afenda/shadcn-studio-v2/shadcn-default.css";
/* optional theme overlay after default */
@import "@afenda/shadcn-studio-v2/themes/swiss-noir.css";

@source "../**/*.{ts,tsx}";
@source "../../../../packages/shadcn-studio-v2/src/**/*.{ts,tsx}";
```

Import order matters: Tailwind and shadcn base first, then package token sheet, then optional theme overlay.

## Theme tiers

| Tier | Artifacts | ERP default? |
| --- | --- | --- |
| **L0 Canonical** | `shadcn-default.css` + `theme-config` `shadcn-default` (`kind: default`) | Yes |
| **L1 Reference presets** | `admincn-theme-presets.ts` → `ThemeProvider` (`kind: reference`) | No |
| **L1 Editorial presets** | `editorial-theme-presets.ts` + optional `themes/swiss-noir.css` / `verdant-noir.css` (`kind: editorial`) | No — opt-in for lab/editorial |

ERP [`globals.css`](../../../apps/erp/src/app/globals.css) imports **shadcn-default only**. Developer lab imports [`reference/pattern-globals.css`](../../../packages/shadcn-studio-v2/reference/pattern-globals.css).

## App-layer reference (`pattern-globals.css`)

Non-authoritative calm-operator stack at `packages/shadcn-studio-v2/reference/pattern-globals.css`:

```css
@import "@afenda/shadcn-studio-v2/reference/pattern-globals.css";
@source "../**/*.{ts,tsx}";
@source "../../../../packages/shadcn-studio-v2/src/**/*.{ts,tsx}";
```

Includes: canonical import, value overrides, `@theme inline`, base comfort rules. Apps add `@source` locally — do not fork token architecture.

## Theme Config (TypeScript)

Theme IDs, preset metadata, and canonical token name lists live in:

```txt
packages/shadcn-studio-v2/src/configs/theme-config.ts
```

Runtime theme switching uses `ThemeProvider` (`@afenda/shadcn-studio-v2/clients`): toggles `.dark`, injects inline tokens for non-default themes. Storage key: `afenda-studio-v2-theme`.

CSS overlays for **editorial** presets (static import after default):

- `src/styles/swiss-noir.css` — runtime SSOT: `configs/editorial-theme-presets.ts`
- `src/styles/verdant-noir.css` — same

Reference presets use `configs/admincn-theme-presets.ts` (runtime only, no CSS export).

Do not use legacy `theme-manifest.json` — V2 registers themes in `theme-config.ts` plus CSS files under `src/styles/`.

## OKLCH Semantic Tokens

`shadcn-default.css` defines the 32 canonical tokens (`CANONICAL_THEME_TOKEN_NAMES`). Use semantic pairs:

- `background` / `foreground`
- `primary` / `primary-foreground`
- `muted` / `muted-foreground`
- `destructive` / `destructive-foreground`
- sidebar and chart families as registered

In components, prefer utilities mapped from these vars (`bg-primary`, `border-input`, `text-muted-foreground`) over raw palette classes.

Forbidden in any CSS: `--brand-*`, `--afenda-*`, `--surface-*`, `--luxury-*`.

## `@theme inline` in Apps

When an app needs utility aliases for package variables, map in app CSS only:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  /* map only what Tailwind utilities require */
}
```

Do not redefine token values in `@theme inline` — values stay in package CSS.

## Content Detection (`@source`)

Tailwind v4 scans via `@source` in the app entry CSS. Include:

- App route and component trees (`apps/erp/src/**`, etc.)
- V2 package source for class names used in exported components

Avoid duplicating `@source` in package CSS — keep detection at the consuming app.

## Verification Gates

| Change | Gate |
| --- | --- |
| Token or theme CSS | `pnpm --filter @afenda/shadcn-studio-v2 check:drift` |
| Biome suppressions (PascalCase / barrels) | `pnpm --filter @afenda/shadcn-studio-v2 check:biome-suppressions` · fix: `pnpm studio:v2:normalize-biome` |
| Contrast-sensitive tokens | `pnpm --filter @afenda/shadcn-studio-v2 check:apca` |
| Any package CSS edit | `pnpm sync:package-css-dist` + `pnpm check:package-css-dist-sync` |
| Full package | `pnpm --filter @afenda/shadcn-studio-v2 quality` |

## External References

Use Context7 (`/shadcn-ui/ui`, `/tailwindlabs/tailwindcss.com`) or official docs when CLI behavior or v4 APIs are in question — see [research-sources.md](research-sources.md).
