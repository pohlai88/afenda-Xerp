# Afenda Enterprise Design System Architecture — Code-First One Page

## Decision

Afenda Design System shall stop behaving like a documentation project.

From now on, enterprise quality is proven by:

```txt
taxonomy + tokens + components + exports + consumer route + tests
```

Not by more doctrine pages.

Documentation is only allowed when it directly protects code execution, migration, or deletion safety.

---

## Architecture Principle

```txt
shadcn/ui semantics
+ Tailwind CSS v4 token pipeline
+ Afenda enterprise composition
+ executable gates
= production design system
```

The system must stay **DRY, KISS, token-safe, accessible, and consumer-proven**.

No reference app becomes runtime.
No theme creates new token families.
No component becomes public without proof.
No route imports internals.
No migration is complete without consumer cutover.

---

## Package Structure

```txt
packages/shadcn-studio-v2/
  src/
    components/
      ui/              # primitives: Button, Card, Badge, Alert, Field, Table
      layout/          # shell frame/chrome: appshell-frame, appshell-01, Sidebar, Topbar
      shared/          # ThemeToggle, ThemeScript, small shared runtime helpers
      assets/          # IconMark and component-coupled assets
      quarantine/      # temporary, non-public, never consumer imported

    views/
      auth/            # AuthShell and login presentation surfaces
      pages/           # PageSurface, evidence reading pages
      widgets/         # metric, revenue, summary, chart evidence blocks
      datatables/      # table-heavy ERP compositions
      forms/           # governed form compositions
      dialogs/         # governed dialog compositions
      settings/        # settings surfaces

    configs/           # studio-config.ts, theme-config.ts
    contexts/          # ThemeProvider, StudioProvider
    hooks/             # use-theme, use-studio
    metadata/          # contracts, registries, gates, builders
    styles/            # shadcn-default.css, swiss-noir.css, verdant-noir.css
    types/             # public package type shapes
    utils/             # tiny reusable helpers only
    lib/               # cn.ts only unless strongly proven

    index.ts           # neutral public API
    clients.ts         # client-safe exports
    server.ts          # server-safe exports
    metadata.ts        # metadata exports
```

Hard rule:

```txt
If it does not fit this structure, it does not enter V2.
```

---

## Styling Authority

Only this token model is allowed:

```txt
Tailwind CSS v4
+ shadcn semantic CSS variables
+ scoped Afenda theme values
```

Allowed CSS:

```txt
src/styles/shadcn-default.css
src/styles/swiss-noir.css
src/styles/verdant-noir.css
```

Forbidden:

```txt
--brand-*
--afenda-*
--surface-*
--luxury-*
--primary-2
--background-alt
--card-secondary
raw hex values inside reusable components
copied AdminCN / editorial CSS
```

Brand identity must come from:

```txt
token values
density
spacing rhythm
typography discipline
composition
state completeness
```

Not from new token families.

---

## Runtime Layers

```txt
Layer 1: Primitives
Button, Card, Badge, Alert, Field, Table.
Small, accessible, variant-based, token-only.

Layer 2: Layout Chrome
appshell-frame, appshell-01, Sidebar, Topbar.
Own frame structure, navigation structure, active state, landmarks, keyboard access.

Layer 3: Shared Runtime
ThemeProvider, ThemeToggle, ThemeScript.
Small, stable, client-safe.

Layer 4: Views
AuthShell, PageSurface, MetricWidget, revenue blocks, table/form/dialog/settings surfaces.
Composed ERP presentation, not primitive bloat.

Layer 5: Consumer Routes
apps/developer and real ERP routes.
No internal imports. Public package API only.
```

---

## Public Import Law

Consumers may import only:

```ts
import { Button, Card, PageSurface } from "@afenda/shadcn-studio-v2";
import { ThemeProvider } from "@afenda/shadcn-studio-v2/clients";
import type { ViewMetadata } from "@afenda/shadcn-studio-v2/metadata";
```

CSS must come only from package exports:

```css
@import "@afenda/shadcn-studio-v2/shadcn-default.css";
@import "@afenda/shadcn-studio-v2/themes/swiss-noir.css";
@import "@afenda/shadcn-studio-v2/themes/verdant-noir.css";
```

Forbidden:

```ts
@afenda/shadcn-studio-v2/src/*
@afenda/shadcn-studio-v2/components/*
@afenda/shadcn-studio-v2/views/*
_reference/*
packages/shadcn-studio/src/*
```

---

## Component Quality Bar

A component is not accepted because it renders.

It is accepted only when it has:

```txt
typed props
semantic variants
accessible name where needed
focus-visible state
disabled state
loading state when action-based
empty/error/unavailable state when data-driven
light/dark/theme behavior
no hardcoded hex
no copied reference code
no app-specific behavior
Storybook, Vitest, or consumer proof
```

Primitive API rule:

```txt
Prefer explicit variants over boolean customization.
Prefer children and named parts over render props.
Keep primitives presentational unless runtime ownership is proven.
```

---

## Migration Law

Legacy is not deleted because V2 exists.

A legacy component may move only when this exists:

```txt
legacy path
V2 destination
classification
API strategy
export intent
CSS dependency
runtime dependency
a11y concern
test target
visual proof
consumer impact
rollback note
enterprise evidence
status
```

Status progression:

```txt
pending
approved-for-migration
migrated
pilot-proven
enterprise-accepted
retirement-candidate
retired
```

Never treat:

```txt
migrated = retired
pilot-proven = enterprise-ready
pretty screenshot = production proof
```

---

## Docs Retirement Policy

Deprecate documentation into four surviving files only:

```txt
README.md                  # how to install, import, verify
TAXONOMY.md                # structural law
MIGRATION-MAP.md           # migration and retirement ledger
DESIGN-SYSTEM-GUIDELINE.md # only if reduced to gates and quality law
```

Everything else should become one of:

```txt
Vitest test
Biome rule
drift guard
Storybook proof
consumer route proof
migration ledger row
deleted archive
```

No new narrative docs unless they remove ambiguity from executable work.

---

## Required Gates

Every slice must pass:

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2
```

Production claim additionally requires:

```txt
one real consumer route imports public V2 API
CSS loads from package export
no deep imports
route renders in light/dark/named theme
accessibility states are checked
rollback path exists
legacy row updated
```

---

## Immediate Execution Order

```txt
1. Freeze documentation expansion.
2. Reduce docs to README, TAXONOMY, MIGRATION-MAP, DESIGN-SYSTEM-GUIDELINE.
3. Convert all remaining doctrine into tests or drift guards.
4. Lock public exports.
5. Lock CSS exports.
6. Build primitives to enterprise state.
7. Build shell and page surfaces.
8. Prove one real consumer route.
9. Only then mark legacy as retirement-candidate.
10. Delete legacy only by release-owner cutover decision.
```

---

## Final Standard

```txt
No code, no proof.
No proof, no export.
No export, no consumer.
No consumer, no production claim.
No rollback, no retirement.
```
