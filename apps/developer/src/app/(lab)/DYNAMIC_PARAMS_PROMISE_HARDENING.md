# Dynamic Params Promise Hardening Technical Specification

## Overview

This slice makes the Next.js 16 dynamic route params contract executable in the
route-lab governance check.

Audience: engineers maintaining `apps/developer`.

Action enabled: fail governance when a dynamic App Router page reads dynamic
segment params without typing `params` as a `Promise` and awaiting it first.

## Problem

Afenda Next.js best practice follows the Next.js 16 App Router binding:

```text
params / searchParams as Promise — always await
```

The canonical module document route already follows this rule, but the rule was
not previously enforced by the route-lab governance script.

## Goals

- Preserve Next.js 16 App Router compatibility for dynamic route segments.
- Fail governance if dynamic route pages stop typing `params` as `Promise<T>`.
- Fail governance if dynamic route pages stop awaiting `params`.
- Preserve current runtime behavior.

## Non-Goals

- Do not add routes.
- Do not add `apps/developer/src/app/api/**`.
- Do not activate `_actions` or `_queries`.
- Do not add middleware, auth, tenant context, database access, kernel imports,
  server imports, or ERP runtime imports.
- Do not introduce business validation beyond route-lab fixture validation.

## Constraints

- Static routes are not required to declare `params`.
- Dynamic routes must keep `href` concrete in the route surface registry and
  keep `routePath` dynamic.
- Dynamic route params stay at the page boundary and are passed to one typed
  loader.

## Proposed Design

Extend `apps/developer/scripts/check-route-lab-governance.mjs` so active routes
whose `routePath` contains `[` must satisfy:

- `page.tsx` contains a `params: Promise<...>` prop type
- `page.tsx` awaits `params` before reading route values

## Interfaces / Dependencies

Primary files:

- `apps/developer/src/app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/page.tsx`
- `apps/developer/scripts/check-route-lab-governance.mjs`

Verification entry point:

```powershell
node scripts/governance/check-developer-route-lab-greenlight.mjs
```

## Risks and Mitigations

Risk: the text-based governance check is narrower than TypeScript AST analysis.

Mitigation: the check is intentionally scoped to the route-lab active dynamic
route pattern and catches the highest-risk regression: reverting to synchronous
`params` access.

## Rollout and Rollback

Rollout:

1. Add the governance check.
2. Run route-lab governance.
3. Run the full route-lab green-light command.
4. Record the completed slice in the audit and Slice 1 summary.

Rollback:

Rollback is not recommended. Removing this guard would weaken the route lab
against Next.js 16 dynamic route regressions.

## Status

Implemented.

