# Route Surface Registry Invariant Hardening Technical Specification

## Overview

This slice hardens the route-lab registry as the single source of truth for
active route identity.

Audience: engineers maintaining `apps/developer`.

Action enabled: make invalid route registry states fail before they can drift
into navigation, route policy, smoke proof, or App Router topology.

## Problem

`src/lib/lab/route-surface-registry.ts` now drives active route identity across
the route lab. That centralization is useful only if invalid registry states are
detected automatically.

Without explicit invariants, future changes could introduce:

- duplicate route IDs or hrefs
- dynamic route patterns as smoke hrefs
- navigable routes without labels
- operator routes that are not `force-dynamic`
- root route metadata that behaves like an operator route

## Goals

- Preserve the registry as the route-lab route identity source of truth.
- Fail governance when registry entries violate route-lab law.
- Keep the check local to `apps/developer`.
- Avoid adding runtime behavior.

## Non-Goals

- Do not add routes.
- Do not add `apps/developer/src/app/api/**`.
- Do not activate `_actions` or `_queries`.
- Do not add middleware, auth, tenant context, database access, kernel imports,
  server imports, or ERP runtime imports.
- Do not change rendered UI.

## Constraints

- The route lab remains frontend-only.
- Root `/` remains `auto`, non-navigable, and loading-boundary-free.
- Non-root operator routes remain `force-dynamic` and require `loading.tsx`.
- Smoke hrefs must be concrete URLs, not dynamic route patterns.
- Navigable routes must define both `navGroupLabel` and `navLabel`.

## Proposed Design

Extend `apps/developer/scripts/check-route-lab-governance.mjs` with registry
invariant checks for:

- unique `href`
- unique `routeId`
- absolute `href` and `routePath`
- no trailing slash except `/`
- no `[` or `]` dynamic segments in `href`
- dotted lowercase namespace form for `routeId`
- root route rendering/navigation/loading constraints
- non-root route `force-dynamic` and loading-boundary constraints
- navigable route label completeness

## Interfaces / Dependencies

Primary inputs:

- `apps/developer/src/lib/lab/route-surface-registry.ts`
- `apps/developer/scripts/check-route-lab-governance.mjs`

Verification entry point:

```powershell
node scripts/governance/check-developer-route-lab-greenlight.mjs
```

## Risks and Mitigations

Risk: the governance script becomes too broad.

Mitigation: this slice checks only registry metadata that already controls route
identity, navigation, rendering posture, and smoke coverage. It does not inspect
business semantics.

Risk: future dynamic route examples fail because `href` cannot contain dynamic
segments.

Mitigation: dynamic route examples should keep `routePath` dynamic and `href`
concrete, as the module document proving route already does.

## Rollout and Rollback

Rollout:

1. Add invariant checks to the governance script.
2. Run the route-lab green-light command.
3. Record this slice in the route-lab audit and Slice 1 status document.

Rollback:

Rollback is not recommended unless the route-lab registry stops being the
source of truth. Removing these checks would make navigation, smoke, and policy
drift harder to detect.

## Status

Implemented.

