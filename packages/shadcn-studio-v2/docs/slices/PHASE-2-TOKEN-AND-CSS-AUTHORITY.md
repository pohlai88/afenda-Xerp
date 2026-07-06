# Phase 2 - Token And CSS Authority Technical Specification

## Overview

This slice establishes the package CSS authority for `@afenda/shadcn-studio-v2`.

It turns the architecture token law into executable CSS files, drift guards, and
package-export-ready style boundaries.

## Problem

Without a locked token and theme model, later primitives and views can hardcode
colors, invent token families, or couple reusable components to app-specific
styling assumptions.

## Goals

* Create the approved CSS files:

  * `src/styles/shadcn-default.css`
  * `src/styles/swiss-noir.css`
  * `src/styles/verdant-noir.css`
* Enforce canonical shadcn token names only.
* Block unapproved theme files and raw hex usage in reusable TSX.
* Prepare CSS for package-export consumption.

## Non-goals

* Building component implementations.
* Theme playground expansion.
* Adding new named themes.

## Constraints

* No `--brand-*`, `--afenda-*`, `--surface-*`, `--luxury-*`.
* No near-canonical token families such as `--primary-2`, `--background-alt`,
  `--card-secondary`, or `--muted-2`.
* No effect token families such as `--shadow-*` or `--gradient-*`.
* Noir theme files must be static root/dark override sheets and imported one at a time.
* Theme files may override only tokens declared in `shadcn-default.css`.
* `shadcn-default.css` declares the complete canonical semantic baseline.
* Text-bearing token pairs must maintain at least WCAG AA 4.5:1 contrast.
* CSS authority files remain consumable only through package CSS exports, and
  package `sideEffects` preserves those emitted CSS files.
* Tailwind v4 generation must stay on the shadcn CSS-variable path:

  * `components.json` keeps `"tailwind.config": ""`.
  * `components.json` points to `src/styles/shadcn-default.css`.
  * No `tailwind.config.*` file owns package theming.
  * Phase 2 token files do not use Tailwind app or utility directives such as
    `@import "tailwindcss"`, `@tailwind`, `@apply`, `@theme`, `@plugin`,
    `@utility`, or `@custom-variant`.
  * Phase 2 token files do not use double-wrapped `hsl(var(...))` /
    `oklch(var(...))` values.
  * Tailwind `@theme inline` utility mapping belongs at a consuming
    app/global CSS boundary, not inside these package token authority files.

## Proposed design

### Base layer

`shadcn-default.css` owns the canonical token declarations for reusable V2
surfaces.

### Named theme layer

`swiss-noir.css` and `verdant-noir.css` are static token override sheets using
`:root` and `.dark` selectors only. Consumers import one noir theme file after
`shadcn-default.css`.

### Drift enforcement

Add or align executable checks for:

* forbidden token families
* no raw hex values inside reusable component and view TSX
* no consumer import from internal style source paths
* no unapproved theme-file growth

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * `../DESIGN-SYSTEM-GUIDELINE.md`
* Downstream slices:

  * Phase 3 primitive layer
  * Phase 7 public export contract
  * Phase 8 proof route

## Risks and mitigations

* Risk: later slices bypass token law with component-local styles.

  * Mitigation: keep drift checks blocking.
* Risk: named themes become behavior owners.

  * Mitigation: keep themes token-only and static.
* Risk: consumers import internal CSS source paths.

  * Mitigation: enforce package-export-only CSS paths.

## Rollout and rollback

### Rollout

1. Create or align the three approved CSS files.
2. Add or align drift tests for token and style violations.
3. Verify package build and drift commands.

### Rollback

If a theme or token addition cannot pass the canonical rules, remove it from the
active slice and keep it as reference-only input until explicitly approved.

## Open questions

* Whether a package-level CSS sync step is needed once dist CSS exports are
  formalized for V2.
