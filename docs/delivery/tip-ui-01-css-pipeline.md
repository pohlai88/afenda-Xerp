# TIP-UI-01 — CSS Pipeline

Status: **Complete**

## Purpose

Establish the CSS and styling foundation for Afenda ERP. Bridge `@afenda/design-system` token registry to runtime CSS custom properties and Tailwind v4 `@theme` — enabling all subsequent UI work.

## Deliverables

| File | Purpose |
| --- | --- |
| `packages/design-system/src/css/token-css-variable.ts` | Type-safe token → CSS variable mapping |
| `packages/design-system/scripts/generate-tokens-css.mjs` | Generates `dist/css/tokens.css` from registry |
| `packages/design-system/dist/css/tokens.css` | `--token-*` custom properties (build output) |
| `apps/erp/src/app/globals.css` | Tailwind v4 + theme aliases |
| `apps/erp/postcss.config.mjs` | `@tailwindcss/postcss` |
| `apps/erp/src/app/layout.tsx` | Imports `globals.css` |

## Package changes

- `@afenda/design-system` exports `./css/tokens.css`
- `@afenda/erp` depends on `@afenda/design-system`, Tailwind v4, PostCSS plugin
- Architecture registry: `@afenda/erp` → `@afenda/design-system`

## Acceptance criteria

| Scenario | Result |
| --- | --- |
| `pnpm --filter @afenda/design-system build` | Generates aligned `tokens.css` |
| `pnpm --filter @afenda/design-system test:run` | Token CSS variable tests pass |
| ERP dashboard | Tailwind utility classes resolve via design-system tokens |
| `pnpm quality:architecture` | Dependency edge approved |

## Verdict

Complete — CSS pipeline operational; TIP-UI-02 unblocked.
