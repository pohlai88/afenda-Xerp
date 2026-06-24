# API Contract Governance

ERP route handlers are public API surfaces. All governed routes use one factory, one envelope, and one contract registry.

## Add a new endpoint

1. Define Zod request/response schemas in `apps/erp/src/server/api/contracts/`.
2. Export an `ApiRouteContract` with `satisfies ApiRouteContract<...>`.
3. Register the contract in `api-contract-registry.ts`.
4. Implement domain logic in `apps/erp/src/server/**` (not in `route.ts`).
5. Wire `app/api/**/route.ts` with `createApiHandler` only.
6. Add contract, service, and boundary tests.

## Response envelope (governed internal v1)

**Use `createApiHandler` for all routes under `apps/erp/src/app/api/internal/v1/**`.**  
Do not hand-roll response shapes on governed routes.

Success:

```json
{ "ok": true, "data": {}, "meta": { "requestId": "", "correlationId": "", "timestamp": "" } }
```

Error:

```json
{ "ok": false, "error": { "code": "", "message": "", "correlationId": "" }, "meta": { ... } }
```

### Relationship to the api-contract skill

The [api-contract skill](../../.cursor/skills/api-contract/SKILL.md) documents a **flat** `{ data }` / `{ code, message }` shape for greenfield or non-governed handlers. That skill remains valid for:

- Legacy or public alias routes not yet on the registry
- External integrations that cannot consume the governed envelope

**Governed ERP internal routes always use the `{ ok, data|error, meta }` envelope** produced by `createApiHandler`. Clients must parse via `readApiEnvelope` / `isApiSuccessEnvelope` in `apps/erp/src/lib/api/api-envelope.client.ts`.

### Browser client workspace scope

Protected internal v1 routes resolve workspace context from **`x-tenant-slug`** (injected by proxy or set by `buildWorkspaceScopeHeaders`). Optional company/org slug or id headers are selection hints only — the server re-validates via `resolveOperatingContext` and `checkPermission`.

Use `WorkspaceApiScope` + `WorkspaceApiScopeProvider` / `useWorkspaceApiScope()` for client fetch helpers.

## Idempotency (mutation retries)

Routes that declare `idempotency: { mode: "required" }` on their `ApiRouteContract` require the **`Idempotency-Key`** header on every mutation request.

| Header | Rule |
| --- | --- |
| `Idempotency-Key` | 8–128 characters; scoped replay key |

Replay behavior:

- Same contract + tenant + user + key → same serialized `data` payload returned
- Fresh envelope `meta` (`requestId`, `correlationId`, `timestamp`) on each response
- No duplicate mutation side effects on retry

Foundation store is in-process (`IdempotencyStore` interface). Durable persistence requires a future schema TIP — do not hand-edit migrations locally.

## Pagination (collection routes)

Collection/list endpoints use `pagination.contract.ts`:

| Query | Rule |
| --- | --- |
| `cursor` | Opaque cursor from prior page |
| `limit` | 1–100, default 20 |

Success envelopes for paginated routes extend `meta` with:

```json
{ "pagination": { "limit": 20, "hasMore": false, "nextCursor": null } }
```

Wire `pagination: { mode: "cursor" }` on the contract when a list route lands.

## Verification

```bash
pnpm --filter @afenda/erp typecheck test:run
pnpm check:api-contracts
```

See also: [nextjs-api-hardening.md](./nextjs-api-hardening.md), [TIP-010 delivery](../delivery/tips/%5BComplete%5D%20tip-010-api-rbac-wiring.md)
