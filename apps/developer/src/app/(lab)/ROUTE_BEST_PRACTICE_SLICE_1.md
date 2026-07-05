# Route Best Practice Slice 1

## Purpose

This document records the completion state of Route Best Practice Slice 1 for
`apps/developer` after the follow-on hardening slices completed the current
applicable Next.js route-lab baseline.

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

It does not yet activate:

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

- `Applicable-now accomplishment`: `83% (49/59 applicable-or-pending rows)`
- `Codebase implemented-now`: `85% (33/39 repo-owned control rows)`
- `Whole audited surface implemented now`: `80% (49/61 total rows)`
- `Open gaps`: `0% (0/61 total rows)`

Interpretation:

- Slice 1 is complete for everything that should exist in the route lab now.
- Later hardening slices closed the route-law, acceptance, boundary-state,
  module-route, green-light verification, root unmatched-route, and metadata
  file gaps.
- Accessibility and visual acceptance now prove semantic landmarks, accessible
  names, image alt attributes, keyboard focus reachability, and mobile/desktop
  overflow behavior.
- Legacy topology remains retired and is now protected by the route-lab
  governance check.
- Route surface registry invariants now protect active route identity before
  drift reaches navigation, policy, smoke proof, or filesystem topology.
- Live route error probing now fails smoke proof when registry-backed routes
  emit browser `pageerror` or `console.error` during navigation.
- Error boundary governance now fails if `error.tsx` or `global-error.tsx`
  loses `"use client"` or imports studio/runtime authority.
- Client-leaf governance now fails if `"use client"` files import loaders,
  demo data, route policy, route registry, nav config, theme config, or API
  surfaces instead of receiving shaped props.
- Dynamic route params governance now fails if active dynamic App Router routes
  stop typing `params` as `Promise<T>` or stop awaiting `params` before route
  value access.
- The remaining non-pass audit rows are pending runtime-parity slices or a
  sterile placeholder, not active misses.

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
- active routes expose route-owned `generateMetadata`
- the route lab has one governed green-light verification command

### Verification

- TypeScript passes
- Biome passes for the app-local surface
- route smoke coverage exists
- a route-law governance script exists
- one green-light runner now executes Biome, Vitest, Next typegen, TypeScript,
  route-law governance, Playwright smoke, and sandbox build in one sequence
- Playwright smoke now includes desktop and mobile accessibility and visual
  layout acceptance checks

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

These areas are now pending runtime-parity work, not completed Slice 1 work:

- Route Handlers / `app/api/**`
- live Server Actions
- `cacheComponents` or shared operator-route cache strategy
- middleware / request-policy runtime surfaces
- tenant/auth/OperatingContext/BFF runtime authority
- query helper activation
- module runtime wiring

They must be activated through:

- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`
- the matching P1-P5 pending slice
- code, tests, and governance updates in the same change

## Completed Follow-On Slices

The following route-lab best-practice slices are now complete:

- Slice 2 — Governance Guard Hardening
- Slice 3 — Route Acceptance Hardening
- Boundary State Hardening
- Module Document Route proving route
- Module Surface Registry Hardening
- Action Seam Governance Hardening
- Query Seam Governance Hardening
- Green-Light Automation Hardening
- Root Metadata and Not-Found Hardening
- Accessibility and Visual Acceptance Hardening
- Legacy Topology Regression Guard Hardening
- Route Surface Registry Invariant Hardening
- Live Route Error Probe Hardening
- Error Boundary Client Safety Hardening
- Client Leaf Import Wall Hardening
- Dynamic Params Promise Hardening

## Current Next Highest-ROI Guidance

The next highest-ROI work is the pending runtime-parity track, not more
frontend route composition.

The current pending order is:

- P1 Route Handlers / `app/api/**`
- P2 live Server Actions
- P3 `cacheComponents` or shared operator-route cache strategy
- P4 middleware / request-policy runtime surfaces
- P5 tenant/auth/OperatingContext/BFF runtime authority

Preserve green-light proof, route-surface registry governance, and the live
route error probe while these slices are implemented.

If a future frontend need appears, the next topic should be selected from one
of these categories only:

- a newly introduced App Router feature that is applicable to `apps/developer`
- an explicit route-lab regression caught by governance or smoke proof
- a doctrine-approved seam activation backed by a concrete UI need

## Acceptance Statement

Slice 1 is complete.

The route lab should preserve the completed frontend baseline while pending
runtime-parity slices are implemented one at a time.

## Related Docs

- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/GOVERNANCE_GUARD_HARDENING.md`
- `apps/developer/src/app/(lab)/ROUTE_ACCEPTANCE_HARDENING.md`
- `apps/developer/src/app/(lab)/GREENLIGHT_AUTOMATION_HARDENING.md`
- `apps/developer/src/app/(lab)/ROOT_METADATA_AND_NOT_FOUND_HARDENING.md`
- `apps/developer/src/app/(lab)/ACCESSIBILITY_AND_VISUAL_ACCEPTANCE_HARDENING.md`
- `apps/developer/src/app/(lab)/LEGACY_TOPOLOGY_REGRESSION_GUARD_HARDENING.md`
- `apps/developer/src/app/(lab)/ROUTE_SURFACE_REGISTRY_INVARIANT_HARDENING.md`
- `apps/developer/src/app/(lab)/LIVE_ROUTE_ERROR_PROBE_HARDENING.md`
- `apps/developer/src/app/(lab)/ERROR_BOUNDARY_CLIENT_SAFETY_HARDENING.md`
- `apps/developer/src/app/(lab)/CLIENT_LEAF_IMPORT_WALL_HARDENING.md`
- `apps/developer/src/app/(lab)/DYNAMIC_PARAMS_PROMISE_HARDENING.md`
- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`
