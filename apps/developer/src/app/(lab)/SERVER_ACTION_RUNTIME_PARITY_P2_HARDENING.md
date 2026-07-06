# Server Action Runtime Parity P2 Hardening

## Status

Implemented — runtime-parity slice P2 is active.

## Objective

Activate the first governed live Server Action for `apps/developer` on
`/settings/appearance` without introducing auth, tenant context, database
access, kernel imports, or ERP user-settings authority.

## Why

The route-lab audit tracked live Server Actions as pending runtime-parity work.
The appearance route already documents ERP promotion toward user-settings
actions, so it is the correct proving surface for a route-local mutation seam.

## Allowed Scope

- `apps/developer/src/app/(lab)/settings/appearance/**`
- `apps/developer/src/lib/lab/lab-action-route-registry.ts`
- `apps/developer/src/lib/lab/lab-action-contracts.ts`
- `apps/developer/src/lib/lab/validate-appearance-review-note.ts`
- `apps/developer/scripts/check-route-lab-governance.mjs`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`

## Out of Scope

- `apps/erp/**`
- additional Route Handlers beyond P1
- shared cache strategy (P3)
- middleware / request policy (P4)
- tenant/auth/OperatingContext/BFF authority (P5)
- fake service layers or mock backends

## Constraints

- Only `/settings/appearance` may use `actionSeam: "governed-active"`.
- Server Actions must appear in `lab-action-route-registry.ts`.
- Action files must use `"use server"` and must not import guarded runtime packages.
- Lab persistence stays in an httpOnly cookie scoped to the appearance route.

## Required Deliverables

- one route-local Server Action for saving a lab review note
- typed action result contract
- client leaf wired through `useActionState`
- loader reads the lab cookie into serializable page data
- governance allowlist enforcement for governed-active action seams
- Vitest validation coverage

## Verification

- `node apps/developer/scripts/check-route-lab-governance.mjs`
- `pnpm --dir apps/developer test src/lib/lab/__tests__/validate-appearance-review-note.test.ts`
- `pnpm --dir apps/developer typecheck`

## Done Means

- P2 Server Actions move from Pending to Pass in the route-lab audit
- only registry-backed action files may exist on governed-active routes
- appearance route proves the client/server action boundary without ERP runtime

## Related Docs

- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`
- `apps/developer/src/app/(lab)/ROUTE_HANDLER_RUNTIME_PARITY_P1_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
