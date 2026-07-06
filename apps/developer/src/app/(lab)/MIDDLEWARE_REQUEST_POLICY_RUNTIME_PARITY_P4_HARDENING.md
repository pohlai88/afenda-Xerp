# Middleware / Request Policy Runtime Parity P4 Hardening

## Status

Implemented — runtime-parity slice P4 is active.

## Objective

Activate a minimal Next.js edge request-policy surface for `apps/developer`
that mirrors ERP correlation-id pass-through without auth redirects, session
gates, or tenant routing.

## Why

The route-lab audit tracked middleware / request-policy runtime surfaces as
pending work. ERP uses `src/proxy.ts` for correlation-id injection and future
tenant routing; the lab needs the same edge shape minus auth and tenant
authority (ADR-0039).

## Allowed Scope

- `apps/developer/src/proxy.ts`
- `apps/developer/src/lib/lab/lab-request-policy.ts`
- `apps/developer/src/lib/lab/lab-request-policy-registry.ts`
- `apps/developer/scripts/check-route-lab-governance.mjs`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`

## Out of Scope

- `apps/erp/**`
- Better Auth / session redirects
- `x-tenant-slug` injection or subdomain routing
- OperatingContext spine (P5)
- BFF routes
- `middleware.ts` parallel to the governed proxy

## Constraints

- Only the registry-backed `src/proxy.ts` may shape requests at the edge.
- Proxy must strip client-supplied tenant / operating-context spoof headers.
- Proxy must not call `NextResponse.redirect` or import auth packages.
- Matcher excludes static assets and `api/**` (same shape as ERP proxy).

## Required Deliverables

- governed request-policy registry entry
- pure policy helpers + edge proxy implementation
- Vitest proof for header stripping, correlation pass-through, and no redirect
- governance enforcement for proxy presence, forbidden auth/tenant patterns

## Verification

- `node apps/developer/scripts/check-route-lab-governance.mjs`
- `pnpm --dir apps/developer test src/lib/lab/__tests__/lab-request-policy.test.ts src/lib/lab/__tests__/lab-proxy.test.ts`
- `pnpm --dir apps/developer typecheck`

## Done Means

- P4 middleware / request policy moves from Pending to Pass in the route-lab audit
- route-lab requests receive correlation ids without auth or tenant shortcuts
- spoof tenant/context headers are stripped before App Router rendering

## Related Docs

- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`
- `apps/developer/src/app/(lab)/CACHE_STRATEGY_RUNTIME_PARITY_P3_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
