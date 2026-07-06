# Lane B — ERP Datatable Headless Composer (Deferred)

## Document status

- Status: **Deferred** until Lane A-11 sign-off
- Audience: Engineers planning interactive ERP grids after V2 internal stabilization
- Authority: `../MIGRATION-MAP.md`, PAS-006D metadata binding standard
- Action enabled: Track phased table strategy; do not implement during Lane A

## Overview

Interactive ERP tables (client sort, filter, column visibility, pagination) belong
in the **ERP consumer layer**, not in `@afenda/shadcn-studio-v2`. V2 keeps
presentational `table.tsx` + `DataTableSurface` only.

## Problem

Teams may reach for TanStack Table inside the design system or Next.js App Router
`metadata` for column configuration. Both violate PAS boundaries.

## Goals (Lane B)

- Add `@tanstack/react-table` in `apps/erp` (or ADR-approved thin module).
- Map PAS-006D tenant column bindings → column definitions → V2 `Table*` markup.
- Keep `@afenda/shadcn-studio-v2` free of TanStack and tenant resolution.

## Non-goals

- TanStack inside `packages/shadcn-studio-v2`.
- Next.js page `metadata` for operator column config (use PAS-006D bindings).
- Lane A primitive or proof-route work.

## Proposed design

```text
PAS-006D binding (column ids, labels, visibility)
        ↓
ERP datatable composer (TanStack useReactTable)
        ↓
V2 Table parts / DataTableSurface shell
```

## Required gates (when executed)

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/developer verify:v2-proof
```

## Decision

**Blocked** until Lane A-11. Lane A-04 completed form-control contracts without
widening table scope.
