# Client Leaf Import Wall Hardening Technical Specification

## Overview

This slice turns the route-lab client component boundary into an executable
governance rule.

Audience: engineers maintaining `apps/developer`.

Action enabled: prevent Client Components from importing server/data authority
or route-lab configuration that should be resolved by server boundaries.

## Problem

Afenda Next.js route-lab law allows Client Components only for browser
interaction and rendering concerns. Client leaves must receive already-shaped
props from server route boundaries.

The rule was documented, but governance did not previously fail when a client
leaf imported:

- route loaders
- lab demo context
- route policy or route registry
- navigation or theme config
- API route surfaces

## Goals

- Keep Server Components and loaders as the data orchestration boundary.
- Keep Client Components focused on interaction and rendering.
- Fail governance when a client leaf imports route-lab authority/config paths.
- Preserve existing runtime behavior.

## Non-Goals

- Do not remove valid client leaves.
- Do not add `apps/developer/src/app/api/**`.
- Do not activate `_actions` or `_queries`.
- Do not add middleware, auth, tenant context, database access, kernel imports,
  server imports, or ERP runtime imports.
- Do not block type-only page-data contracts unless they cross authority paths.

## Constraints

- Client leaves may import React/browser utilities, `next/navigation`, and
  presentation components.
- Client leaves must not import loaders, demo context, route policy, route
  registry, nav config, theme config, or API surfaces.
- Route pages and layouts remain server-first.

## Proposed Design

Extend `apps/developer/scripts/check-route-lab-governance.mjs` so it:

1. collects repo-owned `.ts` and `.tsx` files under `apps/developer/src/app`
2. identifies files containing `"use client"`
3. fails when those files import:
   - `@/lib/lab/load-*`
   - `@/lib/lab/lab-demo-context`
   - `@/lib/lab/route-policy`
   - `@/lib/lab/route-surface-registry`
   - `@/config/nav-config`
   - `@/config/theme-config`
   - `@/app/api/**` or `src/app/api/**`

## Interfaces / Dependencies

Primary files:

- `apps/developer/src/app/(lab)/_components/lab-shell.client.tsx`
- `apps/developer/src/app/lab-segment-error.client.tsx`
- `apps/developer/scripts/check-route-lab-governance.mjs`

Verification entry point:

```powershell
node scripts/governance/check-developer-route-lab-greenlight.mjs
```

## Risks and Mitigations

Risk: a future client component needs route metadata for display.

Mitigation: the server route boundary should shape that metadata into props.
The client component should not import the registry or policy directly.

Risk: the rule becomes too broad.

Mitigation: the current rule blocks only authority/config/API paths and leaves
presentation imports and normal browser interactivity untouched.

## Rollout and Rollback

Rollout:

1. Add client-leaf import-wall checks.
2. Run route-lab governance.
3. Run the full route-lab green-light command.
4. Record the completed slice in the audit and Slice 1 summary.

Rollback:

Rollback is not recommended. Removing this guard would allow client leaves to
grow data orchestration and break RSC-first route-lab parity.

## Status

Implemented.

