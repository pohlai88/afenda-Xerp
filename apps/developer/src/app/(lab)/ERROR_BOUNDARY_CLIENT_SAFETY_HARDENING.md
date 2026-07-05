# Error Boundary Client Safety Hardening Technical Specification

## Overview

This slice hardens the route-lab `error.tsx` contract as an executable
governance rule.

Audience: engineers maintaining `apps/developer`.

Action enabled: fail route-lab governance when an App Router error boundary is
not client-safe or imports presentation/runtime dependencies that are unsafe for
error recovery.

## Problem

Afenda Next.js best practice treats `error.tsx` and `global-error.tsx` as P0
boundaries. They must be client components and must avoid
`@afenda/shadcn-studio` imports because error routes can execute while the
normal presentation shell is already failing.

The current code follows this rule, but the rule was previously documented more
strongly than it was enforced.

## Goals

- Enforce `"use client"` in every repo-owned `error.tsx` and
  `global-error.tsx`.
- Fail governance if an error boundary imports `@afenda/shadcn-studio`.
- Fail governance if an error boundary imports prohibited runtime authority.
- Preserve current rendered behavior.

## Non-Goals

- Do not add new error routes.
- Do not add `apps/developer/src/app/api/**`.
- Do not activate `_actions` or `_queries`.
- Do not add middleware, auth, tenant context, database access, kernel imports,
  server imports, or ERP runtime imports.
- Do not introduce mock runtime recovery infrastructure.

## Constraints

- Error boundaries may use native controls such as `<button>`.
- Error boundaries may link back to safe frontend route-lab surfaces.
- Error boundaries must remain independent from studio barrel exports and
  runtime authority.

## Proposed Design

Extend `apps/developer/scripts/check-route-lab-governance.mjs` so it collects
every `error.tsx` and `global-error.tsx` under `apps/developer/src/app` and
checks:

- the file contains `"use client"`
- the file does not import `@afenda/shadcn-studio`
- the file does not reference prohibited runtime import families

## Interfaces / Dependencies

Primary files:

- `apps/developer/src/app/error.tsx`
- `apps/developer/src/app/(lab)/error.tsx`
- `apps/developer/src/app/lab-segment-error.client.tsx`
- `apps/developer/scripts/check-route-lab-governance.mjs`

Verification entry point:

```powershell
node scripts/governance/check-developer-route-lab-greenlight.mjs
```

## Risks and Mitigations

Risk: a future contributor tries to reuse studio buttons in an error boundary.

Mitigation: governance now fails with a file-specific message and requires
native client-safe recovery controls instead.

Risk: an error boundary accidentally imports runtime authority.

Mitigation: the same prohibited import wall now applies to error boundaries.

## Rollout and Rollback

Rollout:

1. Add the governance checks.
2. Run the route-lab green-light command.
3. Record the completed slice in the route-lab audit and Slice 1 summary.

Rollback:

Rollback is not recommended. Removing this check would re-open a known Next.js
P0 failure mode for App Router error recovery.

## Status

Implemented.

