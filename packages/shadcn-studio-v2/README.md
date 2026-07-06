# @afenda/shadcn-studio-v2

## Purpose

`@afenda/shadcn-studio-v2` is the greenfield enterprise design-system package
for Afenda.

This package is built through bounded execution slices. It is not a debugging,
migration, or documentation-expansion project.

## Active authority

Use only these documents as active authority for the package:

- `docs/DESIGN-SYSTEM-ARCHITECTURE.md`
- `docs/DEVELOPMENT-ROADMAP.md`
- `docs/TAXONOMY.md`
- `docs/MIGRATION-MAP.md`
- `docs/slices/README.md`
- `docs/slices/*`

Other documents may remain on disk, but they are not active execution authority
unless one of the files above explicitly references them.

## Package rule

The package is accepted only through executable proof:

```txt
taxonomy + tokens + components + exports + consumer route + tests
```

**Status (2026-07-06):** Phase 9 enterprise acceptance **granted**. Consumer
proof: `@afenda/developer` → `/design-system/v2-proof`.

## Install and import

```ts
// Neutral surfaces + slot constants
import { PageSurface, PAGE_SURFACE_SLOTS } from "@afenda/shadcn-studio-v2";

// Client runtime (providers, hooks, composed views)
import {
  AppShell01,
  StudioPresentationProviders,
  ThemeScript,
  useTheme,
} from "@afenda/shadcn-studio-v2/clients";
```

```css
/* App globals.css — package CSS exports only */
@import "@afenda/shadcn-studio-v2/shadcn-default.css";
@import "@afenda/shadcn-studio-v2/themes/afenda-brand.css";
```

Do not import `packages/shadcn-studio-v2/src/*` from consumers.

## Verification

### Package gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 check:apca
pnpm exec biome ci packages/shadcn-studio-v2
```

### Consumer proof (developer app)

```bash
pnpm --filter @afenda/developer verify:v2-proof
pnpm --filter @afenda/developer build
```

Playwright smoke (requires dev or production server on port 3002):

```bash
pnpm --filter @afenda/developer test:e2e:smoke
```

## Current workflow

Phases 1–9 and the closing synchronization gate are complete for the current
greenfield baseline. Use `docs/MIGRATION-MAP.md` for migration status and
`docs/slices/README.md` for slice history.

New work must:

- stay inside a bounded slice scope
- return proof
- avoid unrelated package or consumer changes

## Do not use this package README for

- historical analysis
- previous implementation comparison
- broad migration planning without updating `MIGRATION-MAP.md`
- doctrine expansion
