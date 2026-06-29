# `@afenda/ui`

**Architecture layer:** UI implementation  
**Authority:** Consumes `@afenda/css-authority` for CSS tokens — variant/recipe governance lives in-package  
**Lifecycle:** Active

## What this package is

`@afenda/ui` is the **React primitive implementation layer** for Afenda. It renders governed shadcn/Radix primitives using:

- In-package **recipes** and **variant contracts** (Governed UI)
- **`--afenda-*` CSS variables** from `@afenda/css-authority`
- **Foundation phase 04 class-name policy** (layout-only consumer `className`)
- **`resolvePrimitiveGovernance()`** as the single class authority

This package does **not** define raw colors, spacing scales, typography, radius, shadow, or motion tokens.

## CSS

**Authority:** `@afenda/ui` owns primitive structural hooks (`[data-slot]`, `[data-component]`). No class selectors.
**Property namespace:** `--afenda-*` values are read via `var()` only — not defined here.
**Cascade layer:** `components` (Tailwind v4 native).

Full authority model and decision tree: [docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md](../../docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md).
Manifest: `src/styles/css-manifest.ts`. Governance: `pnpm check:css-governance`.

### CSS entrypoint

`@afenda/ui` owns exactly **one** CSS file. It composes css-authority tokens,
the runtime bridge bundle, and primitive structural hooks:

| Import | Use when |
| --- | --- |
| `@afenda/ui/afenda-ui.css` | Tailwind v4 apps — the single, recommended UI entry |
| `@afenda/css-authority/css/afenda-tokens.css` | Token-only surfaces (no `@afenda/ui` primitive hooks) |
| `@afenda/css-authority/css/afenda-css-authority.css` | Runtime bridge + shadcn `@theme` (no primitive hooks) |

```css
@import "@afenda/ui/afenda-ui.css";
```

`afenda-ui.css` `@import`s `@afenda/css-authority/css/afenda-tokens.css` and
`@afenda/css-authority/css/afenda-css-authority.css`.

## Authority surface recipes (pre-wiring)

`app-shell` and `metadata-ui` recipes are resolved at runtime via `@afenda/ui/governance`:

```typescript
import {
  resolveAppShellSlotClassName,
  resolveMetadataUiSlotClassName,
  densityToAttribute,
} from "@afenda/ui/governance";

// TS density `standard` → DOM hook `default`
document.documentElement.dataset.afendaDensity = densityToAttribute("standard");
```

Downstream packages (`@afenda/appshell`, `@afenda/metadata-ui`) should consume these helpers when wiring visual tokens — not duplicate recipe maps locally.

## shadcn-studio blocks

Raw MCP install output must **not** remain under `packages/ui/src/components/shadcn-studio/blocks/`. Governed blocks live in `packages/appshell/src/shadcn-studio/blocks/`.

## Governance

| Layer | Location |
| --- | --- |
| Class authority | `src/governance/resolve-primitive-governance.ts` |
| Primitive registry | `src/governance/primitive-registry.ts` |
| Class-name guard | `src/governance/class-name-guard.ts` |
| Recipe runtime | `src/governance/recipe.ts`, `recipe-maps.ts`, `authority-recipe.ts` |
| Density bridge | `src/governance/density.ts` |

Components call `resolvePrimitiveGovernance()` — never local `cva()` or raw Tailwind semantic classes.

## Public API

```typescript
import { Button, Badge, Card } from "@afenda/ui";
import { mapStockButtonProps, densityToAttribute } from "@afenda/ui/governance";
```

## Commands

```bash
pnpm --filter @afenda/css-authority build   # generates token CSS first
pnpm --filter @afenda/ui typecheck
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/ui check:governance
pnpm --filter @afenda/ui build
```

## Boundary

`@afenda/ui` must not import `@afenda/metadata-ui`, `@afenda/appshell`, `@afenda/database`, or ERP feature packages.
