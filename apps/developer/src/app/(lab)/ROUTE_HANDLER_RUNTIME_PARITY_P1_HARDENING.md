# Route Handler Runtime Parity P1 Hardening

## Status

Implemented — runtime-parity slice P1 is active.

## Objective

Activate the first governed Route Handler surface for `apps/developer` without
introducing auth, tenant context, database access, kernel imports, or ERP BFF
behavior.

## Why

The route-lab audit tracked Route Handlers as pending runtime-parity work.
P1 closes that gap with one demo-safe liveness handler, an explicit allowlist,
governance enforcement, and executable proof.

## Allowed Scope

- `apps/developer/src/app/api/lab/v1/health/route.ts`
- `apps/developer/src/lib/lab/lab-api-route-registry.ts`
- `apps/developer/src/lib/lab/lab-api-contracts.ts`
- `apps/developer/scripts/check-route-lab-governance.mjs`
- `apps/developer/src/app/__tests__/route-lab-smoke.spec.ts`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`
- `apps/developer/README.md`

## Out of Scope

- `apps/erp/**`
- live Server Actions (P2)
- shared cache strategy (P3)
- middleware / request policy (P4)
- tenant/auth/OperatingContext/BFF authority (P5)
- mock backends or fake service layers

## Constraints

- Route Handlers must appear only in `lab-api-route-registry.ts`.
- Governance must fail on unregistered `route.ts` files under `src/app/api/**`.
- Handlers must not import guarded runtime packages.
- Keep the handler frontend-only and promotion-safe.

## Required Deliverables

- one governed GET `/api/lab/v1/health` Route Handler
- typed response contract in `lab-api-contracts.ts`
- allowlist registry in `lab-api-route-registry.ts`
- governance allowlist enforcement
- Vitest route contract test
- Playwright smoke proof for the handler path

## Verification

- `node apps/developer/scripts/verify-greenlight.mjs`
- `node apps/developer/scripts/check-route-lab-governance.mjs`

## Done Means

- P1 Route Handlers move from Pending to Pass in the route-lab audit
- only allowlisted `route.ts` files may exist under `src/app/api/**`
- green-light proof covers the lab health handler response contract

## Related Docs

- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`
- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
