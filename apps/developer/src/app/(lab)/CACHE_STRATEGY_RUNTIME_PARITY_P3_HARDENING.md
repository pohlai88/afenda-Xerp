# Cache Strategy Runtime Parity P3 Hardening

## Status

Implemented — runtime-parity slice P3 is active.

## Objective

Define and enforce a correctness-safe cache posture for `apps/developer`
operator routes without introducing cross-request operator caching, `"use cache"`
directives, or tenant-leaking static generation.

## Why

The route-lab audit tracked shared cache strategy as pending runtime-parity
work. Operator routes call loaders from both `generateMetadata` and `page.tsx`,
so per-request deduplication is required while `(lab)/layout` stays
`force-dynamic`.

## Allowed Scope

- `apps/developer/src/lib/lab/lab-cache-policy.ts`
- `apps/developer/src/lib/lab/lab-cache-route-registry.ts`
- `apps/developer/src/lib/lab/create-cached-lab-loader.server.ts`
- `apps/developer/src/lib/lab/load-*-page.server.ts`
- `apps/developer/src/lib/lab/route-surface-registry.ts` (`cacheSeam`)
- `apps/developer/scripts/check-route-lab-governance.mjs`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`

## Out of Scope

- `apps/erp/**`
- `"use cache"` / `cacheComponents` on operator surfaces
- cross-request shared route-data caches
- middleware / request policy (P4)
- tenant/auth/OperatingContext/BFF authority (P5)

## Constraints

- `(lab)/layout.tsx` must keep `export const dynamic = "force-dynamic"`.
- Operator loaders must use `React.cache()` via `createCachedLabLoader`.
- `"use cache"` is prohibited under `(lab)` and in `src/lib/lab/**` (except policy docs).
- Lab health handler keeps `revalidate = 30` without operator payload.
- Routes with loaders must declare `cacheSeam: "governed-active"` in the route surface registry.

## Required Deliverables

- cache policy kinds and forbidden directive list
- cache route registry mapping routes/loaders to cache kinds
- `createCachedLabLoader` wrapper applied to all five operator loaders
- `cacheSeam` metadata on route surface registry and route policy
- governance enforcement for registry entries, loader wrapping, and `"use cache"` ban
- Vitest policy/registry proof

## Verification

- `node apps/developer/scripts/check-route-lab-governance.mjs`
- `pnpm --dir apps/developer test src/lib/lab/__tests__/lab-cache-policy.test.ts`
- `pnpm --dir apps/developer typecheck`

## Done Means

- P3 cache strategy moves from Pending to Pass in the route-lab audit
- operator routes dedupe loader work per request only
- no shared `"use cache"` strategy exists for lab operator data

## Related Docs

- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`
- `apps/developer/src/app/(lab)/SERVER_ACTION_RUNTIME_PARITY_P2_HARDENING.md`
- `apps/developer/src/app/(lab)/ROUTE_HANDLER_RUNTIME_PARITY_P1_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
