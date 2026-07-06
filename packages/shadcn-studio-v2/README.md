# @afenda/shadcn-studio-v2

## Purpose

`@afenda/shadcn-studio-v2` is the greenfield enterprise design-system package
for Afenda.

This package is built through bounded execution slices. It is not a debugging,
migration, or documentation-expansion project.

## Active authority

Use only these documents as active authority for the package:

- `docs/DESIGN-SYSTEM-ARCHITECTURE.md`
- `docs/DESIGN-SYSTEM-GUIDELINE.md`
- `docs/PRIMITIVE-API-CONSISTENCY.md`
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

**Status (2026-07-06):** Phase 9 enterprise acceptance **granted**. **Lane A complete**
(A-01–A-11, decision **PROCEED**). Lane B **approved-for-planning** — program
`docs/slices/LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md` (B-01–B-15 through v1
formal deprecation). Execution remains per-slice with gates. Consumer proof:
`@afenda/developer` → `/design-system/v2-proof`.

**Execution priority:** Lane A complete. Lane B migration program:
`docs/slices/LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md`. Ledger:
`docs/MIGRATION-MAP.md`.

## Install and import

```ts
// Neutral surfaces + slot constants
import { page-surface, PAGE_SURFACE_SLOTS } from "@afenda/shadcn-studio-v2";

// Client runtime (providers, hooks, composed views)
import {
  AppShell01,
  StudioPresentationProviders,
  theme-script,
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
greenfield baseline. **Lane A (A-01–A-11) is complete** with sign-off **PROCEED**.
Lane B migration program is **authored** (B-01–B-15); execution requires per-slice
proof through **B-15** for formal v1 deprecation. Use `docs/MIGRATION-MAP.md` for
migration status and `docs/slices/LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md` for
Lane B order.

New work must:

- stay inside a bounded slice scope
- return proof
- avoid unrelated package or consumer changes

## Do not use this package README for

- historical analysis
- previous implementation comparison
- broad migration planning without updating `MIGRATION-MAP.md`
- doctrine expansion
