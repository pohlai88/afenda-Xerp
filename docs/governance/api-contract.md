# API Contract Governance

ERP route handlers are public API surfaces. All governed routes use one factory, one envelope, and one contract registry.

## Add a new endpoint

1. Define Zod request/response schemas in `apps/erp/src/server/api/contracts/`.
2. Export an `ApiRouteContract` with `satisfies ApiRouteContract<...>`.
3. Register the contract in `api-contract-registry.ts`.
4. Implement domain logic in `apps/erp/src/server/**` (not in `route.ts`).
5. Wire `app/api/**/route.ts` with `createApiHandler` only.
6. Add contract, service, and boundary tests.

## Response envelope

Success:

```json
{ "ok": true, "data": {}, "meta": { "requestId": "", "correlationId": "", "timestamp": "" } }
```

Error:

```json
{ "ok": false, "error": { "code": "", "message": "" }, "meta": { ... } }
```

## Verification

```bash
pnpm --filter @afenda/erp typecheck test:run
pnpm check:api-contracts
```

See also: [nextjs-api-hardening.md](./nextjs-api-hardening.md)
