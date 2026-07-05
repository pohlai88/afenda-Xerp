# Route Best Practice Slice 1

## Purpose

This document records the completion state of Route Best Practice Slice 1 for
`apps/developer` and identifies the next highest-ROI move.

Slice 1 is not a generic Next.js milestone. It is the first governed route-lab
baseline for ADR-0039 and PAS-006E.

Controlling doctrine:

```text
apps/developer proves ERP frontend shape.
apps/erp owns ERP runtime authority.
Promotion replaces data authority, not route composition.
```

## What Slice 1 Covers

Slice 1 is the route-law baseline for the active route-lab surfaces:

- `/`
- `/dashboard/sales`
- `/dashboard/finance`
- `/admin/users`
- `/settings/appearance`

It covers:

- App Router route structure
- thin async page boundaries
- route-local component colocation
- request-dynamic operator-route policy
- loading and error boundaries
- smoke verification
- root typography and image optimization baseline
- audit-backed governance status

It does not cover:

- ERP runtime authority
- auth
- tenant context
- database access
- internal BFF/API routes
- real mutation authority
- module runtime activation

## Current Slice 1 Status

Source of truth: `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

Current audit interpretation:

- `Applicable-now accomplishment`: `100% (31/31 applicable rows)`
- `Codebase implemented-now`: `88% (22/25 repo-owned control rows)`
- `Whole audited surface implemented now`: `76% (31/41 total rows)`
- `Open gaps`: `0%`

Interpretation:

- Slice 1 is complete for everything that should exist in the route lab now.
- Remaining non-pass rows are not misses. They are either intentional runtime exclusions or sterile placeholders.

## What Is Complete Now

### Route structure

- Active routes use App Router conventions correctly.
- Operator surfaces live under `app/(lab)/**`.
- Route-specific UI is colocated under route-local `_components/`.

### Page law

- `page.tsx` is thin and async.
- Each active page awaits one loader.
- Loader return shape is typed and serializable.

### Rendering law

- `(lab)/layout.tsx` exports `dynamic = "force-dynamic"`.
- No `generateStaticParams` exists under lab routes.
- Root `/` remains a shell/index surface rather than an accidental runtime route.

### Boundary law

- No `app/api/**` exists in `apps/developer`.
- No auth, kernel, database, server, or ERP runtime imports were found in the route-lab codepath.
- `page.tsx` and `layout.tsx` remain server-first.

### UX and framework hardening

- operator routes include `loading.tsx`
- error boundaries are client-safe
- root route uses `next/image`
- root layout provisions `Geist` and `Geist Mono` through `next/font`

### Verification

- TypeScript passes
- Biome passes for the app-local surface
- route smoke coverage exists
- a route-law governance script exists

## Why Slice 1 Is Considered Complete

Slice 1 is complete because it proves the route-lab baseline, not because it implements runtime power.

That distinction matters:

- the goal of Slice 1 is route correctness
- the goal is not backend simulation
- the goal is not ERP business execution
- the goal is not placeholder expansion

The correct completion statement is:

```text
The active route-lab surfaces now satisfy the current Next.js/Vercel best-practice
baseline that is applicable to a governed frontend-only route lab.
```

## What Is Not Missing

These areas are intentionally not treated as incomplete Slice 1 work:

- Route Handlers
- `app/api/**`
- middleware-driven runtime policy
- real Server Actions
- query helper activation
- module runtime wiring
- tenant-aware caching policy

These belong either to:

- ERP runtime later, or
- future route-lab needs that justify activating placeholders

## Next Highest-ROI Move

The next highest ROI is not adding more route code.

It is strengthening the executable governance guard so the audit’s strongest route-law expectations become automatic regressions checks.

## Recommended Slice 2

### Name

`Slice 2 — Governance Guard Hardening`

### Why this is next

Slice 1 already has `0%` open gaps. The highest return now is protecting that state.

The best next move is to extend the route-lab governance script so it fails on:

- `"use client"` in any `page.tsx` or `layout.tsx`
- `generateStaticParams` anywhere under `app/(lab)/**`
- loss of `dynamic = "force-dynamic"` in `app/(lab)/layout.tsx`

### Why this beats other options

This has higher ROI than:

- adding more placeholder content
- expanding route inventory
- rewriting already-normalized route files
- growing docs again without new enforcement

Reason:

- it reduces future drift
- it keeps the audit true over time
- it improves confidence without expanding runtime authority

## Proposed Slice 2 Goal Shape

Use this as the next implementation brief:

```md
## Objective
Strengthen the route-lab governance check so executable guards match the route audit.

## Allowed Scope
- apps/developer/**
- docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md

## Out of Scope
- apps/erp/**
- apps/developer/src/app/api/**
- auth
- database
- placeholder activation

## Constraints
- Do not add new routes.
- Do not introduce runtime authority.
- Preserve route-lab doctrine and audit terminology.

## Required Deliverables
- governance script update
- audit evidence update if the guard surface changes

## Verification
- .\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit
- .\node_modules\.bin\biome ci apps\developer
- node apps\developer\scripts\check-route-lab-governance.mjs

## Done Means
- the script fails on `use client` in any `page.tsx` or `layout.tsx`
- the script fails when `(lab)/layout.tsx` loses `dynamic = "force-dynamic"`
- the script fails when `generateStaticParams` appears under `app/(lab)/**`
```

## Non-Goals for Slice 2

- do not add APIs
- do not activate `_actions` or `_queries`
- do not add ERP runtime imports
- do not expand the module placeholder tree
- do not rewrite stable route files unless the guard requires tiny path updates

## Acceptance Statement

Slice 1 is complete.

Slice 2 should begin only as regression hardening, not as renewed architecture drift.

## Related Docs

- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/GOVERNANCE_GUARD_HARDENING.md`
- `apps/developer/src/app/(lab)/ROUTE_ACCEPTANCE_HARDENING.md`
