# CSS Authority — Canonical Reference

> Single source of truth for CSS ownership, import rules, cascade layer order,
> namespace contracts, and entrypoint decision trees across the Afenda monorepo.
>
> Package READMEs link here with a short summary — do not duplicate rule tables.

---

## Authority model

**One file per package, named `afenda-<package>.css`. `globals.css` is reserved
for the app composition entry only — no package may use that name.**

```
@afenda/design-system
  Owns: raw --afenda-* tokens (Foundation phase 04 TS governance + generated afenda-tokens.css)
  Files (generated): ./css/afenda-tokens.css, ./css/afenda-design-system.css (B30 deprecation shim)
  May import from: @afenda/css-authority (shim only)

@afenda/css-authority  (PAS-005)
  Owns: vendored shadcn theme, CSS Authority Registry, runtime bridge (Parts B–F)
  Files: ./css/afenda-css-authority.css (generated bundle)
  May import from: (nothing upstream)

@afenda/ui
  Owns: ONE entry — token shim + css-authority runtime + primitive structural hooks
  File: ./afenda-ui.css   (@imports afenda-tokens.css + afenda-css-authority.css)
  May import from: @afenda/design-system, @afenda/css-authority

@afenda/metadata-ui
  Owns: metadata renderer structural CSS (+ storybook-only fixture CSS)
  Files: ./afenda-metadata-ui.css, ./fixtures.css
  May import from: @afenda/design-system, @afenda/ui

@afenda/appshell
  Owns: AppShell structural CSS + internal studio pattern layer
  Files: ./afenda-appshell.css (public export)
         ./afenda-appshell-studio.css (internal @import only — not a package export)
  May import from: @afenda/design-system, @afenda/ui

apps/erp
  Owns: globals.css — the single final composition entry
  May import from: all packages
```

### Forbidden cross-package CSS imports

| Package | May NOT import |
|---|---|
| `@afenda/metadata-ui` | `@afenda/appshell` CSS |
| `@afenda/appshell` | `@afenda/metadata-ui` CSS |
| `@afenda/ui` | `@afenda/metadata-ui` or `@afenda/appshell` CSS |
| `@afenda/ui-composition` | ANY CSS (pure contract package) |
| `@afenda/design-system` | ANY downstream package CSS |
| production app globals | any `fixtures.css` file |

---

## Cascade layer order

We use **Tailwind v4's native layer order**. `@import "tailwindcss"` declares it,
and we restate it once in `@afenda/ui/afenda-ui.css` (and the app entry) so the
cascade stays deterministic regardless of `@import` order changes.

```css
@layer theme, base, components, utilities;
```

| Layer | Content | Owner |
|---|---|---|
| `theme` | Design tokens + `@theme` bridge (`--afenda-*`, utility map) | `@afenda/design-system` tokens + `@afenda/css-authority` runtime (via `afenda-ui.css`) |
| `base` | Element/base styles (html, body, h1–h6, resets) | design-system + `shadcn/tailwind.css` |
| `components` | `@afenda/ui` primitive hooks, `@afenda/appshell` `.app-shell-*` (incl. `.app-shell-studio-*` via studio layer), `@afenda/metadata-ui` `.metadata-*` | ui / appshell / metadata-ui |
| `utilities` | Tailwind utilities + app-level overrides (always win) | Tailwind / app |

Packages place their rules in `components` either by declaring `@layer components { … }`
in-file (`appshell`) or by being imported with `layer(components)` (`metadata-ui`,
which is intentionally unlayered so it stays composable).

---

## Class namespace contract (BEM/SMACSS)

| Package | Allowed leading class prefix | Notes |
|---|---|---|
| `@afenda/design-system` | none | Token CSS only — no class selectors |
| `@afenda/ui` | `[data-component]`, `[data-slot]` | No bare class authority |
| `@afenda/metadata-ui` | `.metadata-*` | Production |
| `@afenda/metadata-ui` | `.metadata-fixture-*` | Fixture CSS only |
| `@afenda/appshell` | `.app-shell-*` | Production only — no fixture classes |
| `@afenda/appshell` (studio layer) | `.app-shell-studio-*` | Reusable shadcn/studio patterns — internal `@import` only |
| State | `is-*` or `data-*` | Not ad-hoc class names |

---

## Custom-property namespace contract

| Package | Allowed custom-property prefix | Forbidden |
|---|---|---|
| `@afenda/design-system` | `--afenda-*` | — |
| `@afenda/ui` | none (reads `--afenda-*` via `var()`) | must not define `--afenda-*` |
| `@afenda/appshell` | `--app-shell-*` | `--color-*`, `--spacing-*`, `--font-*`, `--radius-*`, `--afenda-*` |
| `@afenda/metadata-ui` | `--metadata-*` | same as above |

Generic Tailwind/shared namespaces (`--color-*`, `--spacing-*`, `--font-*`, `--radius-*`, `--shadow-*`) are squatted namespaces — downstream packages must not define them.

---

## 3-layer CSS token chain (shadcn/studio bridge)

Studio blocks never consume `--afenda-*` directly. The chain cascades automatically:

```txt
@afenda/design-system (Part A)    --afenda-* tokens (source)
         ↓ Part B
         --card, --primary, --border  (shadcn shorthand)
         ↓ appshell
         --app-shell-text-*, --app-shell-radius-*  (shell geometry)
         ↓ appshell-studio
         --app-shell-studio-*  (studio block bridge)
         ↓ class CSS
         .app-shell-studio-metric-*, .app-shell-studio-sparkline-*, etc.
```

**What flows automatically** (no manual per-utility mapping):

| Category | Mechanism |
|----------|-----------|
| shadcn utilities (`bg-primary`, `text-muted-foreground`, `border-border`) | Part C `@theme inline` → Part B shadcn vars → `--afenda-*` |
| Semantic tones (`text-success`, `text-warning`, `text-info`, `text-destructive`) | Part B bridge |
| `shadow-*`, `z-*`, `radius-*` aliases | Part C motion/z/radius |
| All `--app-shell-studio-*` variables | `afenda-appshell-studio.css` transitive wiring |

MCP block normalization uses the **3-question decision filter** before adding new studio CSS.
Agent operational authority: [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../.cursor/skills/afenda-shadcn-components/SKILL.md).
Variable tables: [css-bridge-reference.md](../../.cursor/skills/afenda-shadcn-components/css-bridge-reference.md).

**Superseded:** Manual per-utility CSS mapping tables for every Tailwind class; reference-template-specific
layout patterns (6-column grid, density attribute mapping, base-vega vs new-york).

---

## Entrypoint decision tree

### Which CSS to import?

```
Building an app (Tailwind v4)?
  → import each package's single entry, in order (see Canonical app import order):
      @afenda/ui/afenda-ui.css
      @afenda/appshell/afenda-appshell.css
      @afenda/metadata-ui/afenda-metadata-ui.css

Need only design-system token variables (no UI primitives)?
  → @import "@afenda/design-system/css/afenda-tokens.css"

Need legacy single-file shim (deprecated — B30)?
  → @import "@afenda/design-system/css/afenda-design-system.css"
     (re-exports tokens + @afenda/css-authority/css/afenda-css-authority.css)
```

`@afenda/ui/afenda-ui.css` `@import`s `@afenda/design-system/css/afenda-tokens.css` and
`@afenda/css-authority/css/afenda-css-authority.css` — **do not** import the deprecated
design-system monolith shim from new app code.

```
Rendering metadata-ui fixtures or composed Storybook?
  → also @import "@afenda/metadata-ui/fixtures.css"  (Storybook only, not app globals)
```

---

## Canonical ERP app import order (`apps/erp/src/app/globals.css`)

`globals.css` is THE single composition entry. Package CSS is never named
`globals.css`.

```css
/* 1. Tailwind base */
@import "tailwindcss";

/* 2. Design tokens + UI primitives */
@import "@afenda/ui/afenda-ui.css";

/* 3. AppShell structural chrome */
@import "@afenda/appshell/afenda-appshell.css";

/* 4. Metadata renderer structural CSS */
@import "@afenda/metadata-ui/afenda-metadata-ui.css";

/* 5. shadcn primitive resets */
@import "shadcn/tailwind.css";

/* 6. App-specific overrides (if needed) */
```

**Do NOT** include `./fixtures.css` in app globals. Fixture CSS belongs inside story files only.

**Do NOT** import `afenda-appshell-studio.css` directly. It is an internal
implementation detail loaded by `afenda-appshell.css` via `@import "./afenda-appshell-studio.css"`.

---

## AppShell studio pattern layer

`@afenda/appshell` owns **three** CSS source files (budget: `maxSourceFiles: 3`):

| File | Role | Import rule |
|---|---|---|
| `afenda-appshell.css` | Shell structural chrome, block-local geometry, readiness-gate overrides | **Public** — `@import "@afenda/appshell/afenda-appshell.css"` |
| `afenda-appshell-studio.css` | Reusable shadcn/studio visual patterns (metric cards, sparklines) | **Internal** — `@import` from `afenda-appshell.css` only |
| `auth-shell/auth-shell.css` | Auth shell BEM layer (`.af-auth-shell*`) | **Internal** — `@import` from `afenda-appshell.css` only |

### Purpose and namespace

- **Purpose manifest value:** `studio-patterns` (see `packages/ui/src/governance/css-manifest.ts`)
- **Class sub-namespace:** `.app-shell-studio-*` (e.g. `.app-shell-studio-metric-card`, `.app-shell-studio-sparkline-card`)
- **Property namespace:** `--app-shell-*` bridge vars only — studio layer reads tokens via `var()`, never defines `--afenda-*`
- **Block-local geometry** (readiness gate status dots, dashboard grid placement) stays in `afenda-appshell.css`
- **Reusable patterns** shared across ≥2 blocks land in `afenda-appshell-studio.css`

Pattern map and migration notes: `packages/appshell/src/presentation/STUDIO-PATTERN-MAP.md`.
Normalization workflow: **3-question decision filter** in [afenda-shadcn-components SKILL §2](../../.cursor/skills/afenda-shadcn-components/SKILL.md).

### Manifest `internalOnly`

Studio CSS is registered in `packages/appshell/src/styles/css-manifest.ts` with
`internalOnly: true` because it shares the public `./afenda-appshell.css` export path.
Governance duplicate-export checks skip `internalOnly` entries; the monorepo registry
(`scripts/css/css-registry.mts`) lists it as `authored-studio-patterns`.

```typescript
{
  packageName: "@afenda/appshell",
  exportPath: "./afenda-appshell.css",
  sourceFile: "src/styles/afenda-appshell-studio.css",
  purpose: "studio-patterns",
  internalOnly: true,          // not a standalone package.json export
  productionSafe: true,
  allowedImporters: ["@afenda/appshell"],
  prohibitedImporters: ["apps/*", "@afenda/ui", "@afenda/metadata-ui"],
  classNamespace: "app-shell-",
  propertyNamespace: "--app-shell-",
}
```

Apps, Storybook preview, and ERP `globals.css` continue to import **one** appshell
entry — the studio layer cascades automatically.

---

## Storybook CSS rules

Storybook renders every component, so `preview.css` loads the SAME single
composition entry the app uses — `apps/erp/src/app/globals.css` — instead of
re-listing each package file. It adds only storybook-only fixture CSS and the
Tailwind `@source` globs for package sources.

| Story type | Allowed imports |
|---|---|
| `preview.css` global | The app `globals.css` + fixture CSS + `@source` globs |
| Per-story (optional) | `@afenda/ui/afenda-ui.css` (redundant with preview, harmless) |

---

## Governance enforcement

| Command | What it checks |
|---|---|
| `pnpm check:css-governance` | All 18 rules (manifest-driven) |
| `pnpm quality:css` | Same — runs as part of `pnpm quality` |
| Per-package `css-manifest.test.ts` | sourceFile existence, export alignment, sideEffects, boundary assertions |

Script: `scripts/css/check-css-governance.mts`
Manifest types: `packages/ui/src/governance/css-manifest.ts`

---

## CSS manifest format

Every CSS export must have a manifest entry in the owning package's `css-manifest.ts`:

```typescript
import type { CssManifest } from "@afenda/ui/governance";

export const packageCssManifest = [
  {
    packageName: "@afenda/example",
    exportPath: "./styles.css",         // matches package.json exports key
    sourceFile: "src/styles.css",       // relative to package root
    purpose: "renderer-structural",     // SMACSS-aligned category (or "studio-patterns" for internal @import layers)
    productionSafe: true,               // false for fixture CSS
    requiresTailwindTheme: false,       // true only for @theme bridge files
    internalOnly: true,                 // optional — shares exportPath; skip duplicate-export check
    allowedImporters: ["apps/*"],
    prohibitedImporters: ["@afenda/ui-composition"],
    classNamespace: "metadata-",        // leading class prefix contract
    propertyNamespace: "none",          // custom-property prefix contract
  },
] as const satisfies CssManifest;
```

`design-system` mirrors the interface locally (cannot depend on `@afenda/ui`).
