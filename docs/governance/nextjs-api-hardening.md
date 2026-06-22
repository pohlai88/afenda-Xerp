# Next.js API Hardening

## Route handler rules

- Handlers live in `app/api/**/route.ts`.
- Governed routes must use `createApiHandler` from `@/server/api/runtime/create-api-handler`.
- Export `runtime` and `dynamic` from the contract cache policy.
- Protected routes default to `force-dynamic` and `Cache-Control: no-store`.
- Mutations must use `cache: { kind: "no-store" }` and an audit policy.

## Auth

- Session is resolved server-side via `getAfendaAuthSession`.
- Protected contracts declare `permission` policy; unauthenticated requests return `401`.
- Server Actions must not bypass the same authorization rules as route handlers.

## Allowlisted legacy routes

These routes remain on legacy wrappers until migrated:

- `app/api/auth/**`
- `app/api/integrations/**`

## Drift guardrails

```bash
pnpm check:api-contracts
pnpm --filter @afenda/erp test:run
```

Static tests in `apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts` enforce:

- `createApiHandler` usage
- no direct `Response.json`
- no UI/AppShell imports in governed routes
