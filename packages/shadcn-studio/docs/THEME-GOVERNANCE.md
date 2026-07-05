# Theme CSS Governance

## Purpose

This document defines how future theme CSS files are authored for `@afenda/shadcn-studio`.

The goal is a clean CSS stack:
- `shadcn-default.css` owns the canonical shadcn/ui Tailwind v4 token contract and `@theme inline`
- `themes/*.css` files override token values only
- final app CSS entries import Tailwind and compose the package CSS

## Stack

```css
/* apps/erp/src/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@afenda/shadcn-studio/shadcn-default.css";
@import "@afenda/shadcn-studio/themes/<theme>.css";
```

Storybook follows the same model in `.storybook/preview.css`.

## File Roles

| File | Role |
| --- | --- |
| `shadcn-default.css` | Canonical default tokens, `.dark`, `@theme inline`, and minimal base rules |
| `theme-template.css` | Copy source for future theme CSS files |
| `theme-manifest.json` | Governance registry for theme CSS files |
| `themes/*.css` | Token override files only |

## Current Themes

| Theme | File | Status | Scope |
| --- | --- | --- | --- |
| Swiss Noir | `themes/swiss-noir.css` | `review` | `scoped-theme` |
| Verdant Noir | `themes/verdant-noir.css` | `review` | `scoped-theme` |

## Theme CSS Rules

Theme CSS files must:
- define token overrides only
- use a scope class such as `.theme-afenda-admin`
- include both light and dark token values
- use only canonical shadcn token names unless the manifest explicitly allows extras
- be listed in `theme-manifest.json`

Theme CSS files must not:
- import Tailwind
- import other CSS files
- declare `@theme inline`
- declare `@layer base`
- define component selectors
- redefine the default token contract

## Manifest Rule

Every permanent theme CSS file must be registered in `theme-manifest.json`.

Minimum entry shape:

```json
{
  "id": "theme-id",
  "label": "Theme Label",
  "cssPath": "src/styles/themes/theme-id.css",
  "scope": "scoped-theme",
  "status": "draft",
  "extends": "shadcn-default",
  "tokenContract": "shadcn-ui-tailwind-v4-default",
  "allowedExtraTokens": [],
  "storybookTarget": "",
  "erpConsumer": "",
  "owner": ""
}
```

## Promotion Rule

ERP should import only approved theme CSS files.

Storybook may import draft or review themes for inspection, but those imports must stay out of ERP globals until the theme is approved.

## Typography Pairing Guidance

Typography pairings are theme guidance, not theme CSS implementation.

Do not add font-family variables, font imports, `@font-face`, Google Fonts imports, or Next.js font wiring to `themes/*.css`. Font loading affects app composition, Storybook preview, fallback policy, licensing, and performance. It needs a separate authority before implementation.

| Theme | UI and data font | Editorial font | Use |
| --- | --- | --- | --- |
| Swiss Noir | Geist Sans | IBM Plex Mono for numeric and technical data | Executive audit, proof chamber, control-room ERP surfaces |
| Verdant Noir | IBM Plex Sans | Newsreader for editorial headings only | Authentication, onboarding, traceability, ESG, and premium public-facing surfaces |

Rules:
- keep serif typography out of dense ERP tables and operational forms
- use mono typography only for numeric, code-like, ledger, ticker, or technical evidence surfaces
- do not encode typography into theme CSS until the font loading authority is defined
- treat typography as composition guidance until promoted through the same governance path as other presentation decisions

## Deferred Decisions

Deferred theme decisions belong in `theme-manifest.json` on the relevant theme entry.

For Swiss Noir, the deferred decisions are:
- no visualization opacity tokens until a real chart component requires them
- no ERP globals import until Storybook review covers dense tables, forms, authentication, and evidence surfaces
- no cinematic effects in token CSS; keep those in page or pattern composition
- no font variables or font loading until typography authority is defined

For Verdant Noir, the deferred decisions are:
- no `--afenda-*` editorial anchors until the token contract is extended deliberately
- no ERP globals import until Storybook review covers dense tables, forms, authentication, and evidence surfaces
- no verdant atmosphere effects in token CSS; keep those in page or pattern composition
- no font variables or font loading until typography authority is defined

## Authoring Workflow

1. Copy `theme-template.css` into `themes/<theme-id>.css`.
2. Replace `<theme-id>` with the final scope class suffix.
3. Fill every canonical token in light and dark scopes.
4. Register the file in `theme-manifest.json`.
5. Add Storybook coverage before ERP import.
6. Import into ERP only after approval.

## Boundary

This package owns package CSS files only.

Next.js final composition stays in `apps/erp/src/app/globals.css`.
