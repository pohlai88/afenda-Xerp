# Afenda REST API Governance

> **Operational authority** for governed ERP REST routes.  
> **PAS ingress:** [`b10-4.1.10-api-ingress.md`](../PAS/slice/b10-4.1.10-api-ingress.md) · **How-to:** [`docs/governance/api-contract.md`](../governance/api-contract.md)

| Field | Value |
| --- | --- |
| **As-of** | 2026-06-26 |
| **Runtime owner** | `apps/erp/src/server/api/` |
| **Registry entry** | `PKG007_CONTEXT` (api-governance subdomain) |
| **Version prefix** | `/api/internal/v1/**` |

---

## Core principle

**Govern before multiply.**

Every new governed ERP route must answer the eleven governance questions (below), register an `ApiRouteContract` in `api-contract-registry.ts`, wire `createApiHandler`, and pass CI gates **before merge**. No ad-hoc `route.ts` handlers, no duplicate envelope shapes, no parallel registries.

| Rule | Detail |
| --- | --- |
| **No route without registry** | Ungoverned `apps/erp/src/app/api/**/route.ts` files (outside allowlist) fail `pnpm check:api-contracts` |
| **No Kong this phase** | External API gateway is **P2 — excluded from current production release**; `api-gateway.adapter.ts` holds the seam only |
| **REST-first** | JSON over HTTP; governed internal surface under `/api/internal/v1/**` |
| **Single envelope** | Success and error bodies use `{ ok, data\|error, meta }` from `createApiHandler` |

---

## REST design and versioning

| Surface | Path pattern | Contract rule |
| --- | --- | --- |
| **Governed internal v1** | `/api/internal/v1/**` | Must register in `API_CONTRACTS`; `version: "v1"` on contract |
| **Legacy auth** | `/api/auth/**` | Allowlisted — Better Auth transport; not in registry |
| **Legacy integrations** | `/api/integrations/**` | Allowlisted — migration backlog |
| **Webhooks** | `/api/webhooks/**` | Allowlisted — Svix, Resend transport-specific handlers |

Contract IDs follow dot notation: `internal.v1.<domain>.<resource>.<method>` (example: `internal.v1.workspace.dashboard-layout.get`).

Route files live at `apps/erp/src/app/api/internal/v1/**/route.ts` and re-export handler bindings only — domain logic stays in `apps/erp/src/server/**` or `apps/erp/src/lib/**`.

---

## Eleven governance questions

Answer every question in the `ApiRouteContract` before registering a route. CI validates completeness via `validateApiRouteCatalogCompleteness`.

| # | Question | Contract field | Validated by |
| ---: | --- | --- | --- |
| 1 | Who may call this route? | `authPolicy` | `auth-policy.contract.ts` · registry tests |
| 2 | What operating context must be resolved? | `contextPolicy` | `context-policy.contract.ts` · `createApiHandler` |
| 3 | What permission key gates protected access? | `permission` | `@afenda/permissions` vocabulary · registry tests |
| 4 | What lifecycle status applies? | `lifecycle` | `lifecycle.contract.ts` — active routes only |
| 5 | What stability classification applies? | `stability` | `stability.contract.ts` |
| 6 | What rate-limit policy applies? | `rateLimitPolicy` | `rate-limit.contract.ts` · `api-rate-limit.ts` seam |
| 7 | Who owns runtime maintenance? | `owner` | Must be `"apps/erp"` |
| 8 | Where is operational documentation? | `documentationPath` | Points to this document |
| 9 | What tests prove compliance? | `testPaths` | Minimum registry + envelope + boundary tests |
| 10 | What request schema defines input? | `requestSchemaRef` | Zod schema co-located in `contracts/` |
| 11 | What response schema defines output? | `responseSchemaRef` | Zod schema co-located in `contracts/` |

Additional mutation requirements (not separate registry columns): `audit` policy on mutations, `idempotency` where retry risk exists, `cache: { kind: "no-store" }` on mutations — enforced by `method-policy.contract.ts` and registry tests.

---

## Route registry model

Canonical type: `ApiRouteContract<TRequest, TResponse>` in `apps/erp/src/server/api/contracts/api-contract.ts`.

| Field group | Fields | Purpose |
| --- | --- | --- |
| **Identity** | `id`, `path`, `method`, `version`, `tags` | Stable route identity and discovery |
| **Governance** | `authPolicy`, `contextPolicy`, `lifecycle`, `stability`, `rateLimitPolicy`, `owner` | Policy vocabulary — serializable, catalog-exportable |
| **Authorization** | `permission?` | Required on protected routes; omitted on `public` |
| **Evidence** | `testPaths`, `documentationPath`, `requestSchemaRef`, `responseSchemaRef` | CI and documentation traceability |
| **Schemas** | `requestSchema`, `responseSchema` | Runtime Zod validation in `createApiHandler` |
| **Runtime** | `runtime`, `cache`, `audit?`, `idempotency?`, `pagination?` | Handler factory wiring |

Registry files:

| File | Role |
| --- | --- |
| `api-contract-registry.ts` | `API_CONTRACTS` array + `GOVERNED_ROUTE_CONTRACT_EXPORTS` map |
| `api-route-catalog.ts` | Serializable catalog builder + governance policy assertions |
| `api-route-catalog.snapshot.json` | Exported snapshot for drift detection |

---

## Policy vocabularies

### Auth (`authPolicy`)

Defined in `auth-policy.contract.ts`:

| Value | Meaning |
| --- | --- |
| `public` | No session required |
| `session-required` | Valid Afenda session |
| `session-required-email-verified` | Session + verified email |
| `service-token-required` | Machine/service credential |
| `internal-only` | Internal network or service boundary |

### Context (`contextPolicy`)

Defined in `context-policy.contract.ts`. Resolves via `resolveOperatingContext()` — see [`multi-tenancy.md`](./multi-tenancy.md).

| Value | Meaning |
| --- | --- |
| `none` | No operating context |
| `tenant-required` | Tenant scope required |
| `tenant-company-required` | Tenant + legal entity |
| `tenant-company-org-required` | Tenant + company + org unit |
| `tenant-company-org-team-required` | + team |
| `tenant-company-org-team-project-required` | + project |
| `consolidation-scope-required` | Group consolidation scope |

### Lifecycle (`lifecycle`)

| Value | Meaning |
| --- | --- |
| `planned` | Documented, not wired |
| `active` | Production registry entry |
| `deprecated` | Wired but scheduled for removal |
| `removed` | Must not remain in route handlers |

### Stability (`stability`)

| Value | Meaning |
| --- | --- |
| `experimental` | May change without notice |
| `internal-stable` | Stable for ERP internal clients |
| `public-stable` | Stable for external integrators |
| `deprecated` | Successor route exists |

### Rate limit (`rateLimitPolicy`)

Declared on every contract; enforcement is adapter-backed (no-op today).

| Value | Typical use |
| --- | --- |
| `anonymous-low` | Public health/read probes |
| `authenticated-standard` | Signed-in CRUD |
| `authenticated-sensitive` | Invites, role changes, uploads |
| `service-token` | Machine callers |
| `disabled-local-dev` | Local development override |

---

## Envelope shapes

Governed routes **must** use the envelope from `api-envelope.contract.ts` — never hand-roll JSON in `route.ts`.

**Success:**

```json
{
  "ok": true,
  "data": {},
  "meta": {
    "requestId": "",
    "correlationId": "",
    "timestamp": ""
  }
}
```

**Error** — `error.category` and `error.retryable` come from `api-error.contract.ts`:

```json
{
  "ok": false,
  "error": {
    "code": "forbidden",
    "category": "authorization",
    "message": "You do not have permission to perform this action.",
    "correlationId": "",
    "retryable": false
  },
  "meta": {
    "requestId": "",
    "correlationId": "",
    "timestamp": ""
  }
}
```

| Error category | Example codes | Default `retryable` |
| --- | --- | --- |
| `validation` | `bad_request`, `validation_failed`, `method_not_allowed` | `false` |
| `authentication` | `unauthenticated` | `false` |
| `authorization` | `forbidden` | `false` |
| `not_found` | `not_found` | `false` |
| `conflict` | `conflict` | `false` |
| `rate_limit` | `rate_limited` | `true` |
| `internal` | `internal_error`, `service_unavailable` | `true` |

Clients parse via `readApiEnvelope` / `isApiSuccessEnvelope` in `apps/erp/src/lib/api/api-envelope.client.ts`.

---

## Auth, session, permission, and operating context

| Concern | Authority | ERP wiring |
| --- | --- | --- |
| **Session** | `@afenda/auth` | `getAfendaAuthSession` inside `createApiHandler` |
| **Permission** | `@afenda/permissions` | Contract `permission.permission` key; `authorizeApiRoute` |
| **Operating context** | `@afenda/kernel` + resolver pipeline | `resolveOperatingContext()` — **never inline tenant lookup** |

Protected internal v1 routes resolve workspace scope from **`x-tenant-slug`** (proxy-injected). Optional company/org headers are selection hints only — the server re-validates via operating context and `checkPermission`.

Cross-reference: [`multi-tenancy.md`](./multi-tenancy.md) — tenant, entity group, legal entity, org unit, team, project, RLS, and consolidation scope vocabulary.

---

## Audit and rate-limit seams

### Audit

| Event | Path | When |
| --- | --- | --- |
| Mutation success | `runtime/api-handler-audit.ts` | Contract declares `audit: { enabled: true, action, targetType }` |
| Permission denial | `emitApiDeniedAuditEvidence` | Protected route returns 403 |

Audit records include tenant/company scope from execution context and `correlationId`.

### Rate limit

`runtime/api-rate-limit.ts` enforces contract `rateLimitPolicy` via Postgres fixed-window buckets (`api_rate_limit_buckets`) by default. Tests and local overrides use `API_RATE_LIMIT_PROVIDER=memory`. Policy `disabled-local-dev` skips enforcement.

| Policy | Window | Max requests |
| --- | ---: | ---: |
| `anonymous-low` | 60s | 30 |
| `authenticated-standard` | 60s | 120 |
| `authenticated-sensitive` | 60s | 60 |
| `service-token` | 60s | 300 |
| `disabled-local-dev` | — | — |

Exceeded limits return governed `rate_limited` errors (`retryable: true`).

### Idempotency store

Mutation contracts with idempotency policy replay responses from Postgres (`api_idempotency_records`, 24h TTL) by default. Tests use `API_IDEMPOTENCY_STORE=memory` or `setIdempotencyStoreForTests`.

---

## API gateway seam (Kong deferred)

**P2 — excluded from current production release.** Not in current production release scope. Requires separate ARCH/FDR approval before implementation. No runtime Kong wiring in this work item.

| Artifact | Role |
| --- | --- |
| `runtime/api-gateway.adapter.ts` | `ApiGatewayAdapter` interface; `defaultApiGatewayAdapter.name === "none"` |
| `runApiGatewayPreRequest` / `runApiGatewayPostResponse` | Hook points in handler lifecycle — callable when gateway lands |

---

## Allowlisted legacy routes

Excluded from `API_CONTRACTS` coverage scan (`GOVERNED_ROUTE_ALLOWLIST` in `api-route-coverage.ts`):

| Segment | Path | Reason |
| --- | --- | --- |
| `auth` | `app/api/auth/**` | Better Auth session transport |
| `integrations` | `app/api/integrations/**` | Third-party integration adapters — migration backlog |
| `webhooks` | `app/api/webhooks/**` | Svix, Resend signature-verified ingress |

New ERP domain APIs belong under `/api/internal/v1/**` with full registry governance.

---

## Do / do-not

| Do | Do not |
| --- | --- |
| Register every governed route in `API_CONTRACTS` | Add `route.ts` without contract + `createApiHandler` |
| Use `createApiHandler` for `/api/internal/v1/**` | Call `Response.json` directly in governed routes |
| Declare `permission` on protected contracts | Trust client-supplied tenant scope without `resolveOperatingContext` |
| Map DB rows to DTOs before envelope serialization | Return raw Drizzle rows in API responses |
| Add contract + envelope + boundary tests | Duplicate envelope or policy constants outside `contracts/` |
| Run `pnpm check:api-contracts` before merge | Hand-edit idempotency persistence (P1 — durable store not shipped) |
| Refresh catalog snapshot after registry changes | Introduce Kong or OpenAPI generation without ARCH/FDR row |

---

## File ownership (`apps/erp/src/server/api/`)

| Path | Owner responsibility |
| --- | --- |
| `contracts/` | `ApiRouteContract` definitions, policy vocabularies, registry, route catalog |
| `contracts/auth/`, `workspace/`, `system-admin/`, `storage/`, `observability/` | Domain contract modules + Zod schema refs |
| `runtime/create-api-handler.ts` | Handler factory — session, context, RBAC, envelope, audit |
| `runtime/api-response.ts`, `api-error.ts`, `api-validation.ts` | Envelope serialization and validation |
| `runtime/api-handler-audit.ts`, `api-handler-logging.ts`, `api-correlation.ts` | Observability hooks |
| `runtime/api-rate-limit.ts` | Rate-limit seam (no-op) |
| `runtime/api-gateway.adapter.ts` | Gateway seam (none adapter) |
| `runtime/idempotency.ts` | In-process idempotency replay (P1 durable store pending) |
| `__tests__/` | Registry, envelope, policy, route-catalog, handler-boundary tests |

Governance scripts (repo root): `scripts/api-contract/check-api-contracts.mts`, `check-api-route-catalog.mts`, `export-api-route-catalog.mts`.

---

## Verification gates

```bash
pnpm check:api-contracts          # registry coverage + method/idempotency policy
pnpm check:api-route-catalog      # snapshot drift vs live registry
pnpm export:api-route-catalog     # refresh api-route-catalog.snapshot.json after registry edits
pnpm export:openapi               # refresh afenda-internal-v1.openapi.json (+ docs copy)
pnpm check:openapi-drift          # OpenAPI snapshot drift vs live generator
pnpm sync:openapi                 # export:openapi + docs MDX regeneration
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run -- api-contract api-envelope api-handler-boundary api-route-catalog
```

`check:api-contracts` is delegated from Phase 9 accounting-readiness gate (requirement #5).

---

## Known gaps (production classification)

| Gap | Classification | Close condition |
| --- | --- | --- |
| **OpenAPI catalog generation** | **Closed 2026-06-26** | `ARCH-API-002` · `pnpm export:openapi` · `pnpm check:openapi-drift` |
| **Kong / external API gateway** | **P2 — excluded from current production release** | Separate ARCH/FDR approval; seam exists at `api-gateway.adapter.ts` |
| **Durable idempotency store** | **P1 — production hardening** | Redis/DB-backed `IdempotencyStore`; waiver until Accounting Core ADR amendment |
| **Real rate-limit enforcement** | **P1 — production hardening** | Provider wired to `assertRateLimitAllowed`; policies already declared on contracts |
| **Registry gate sync** | **Closed 2026-06-26** | `PKG007_CONTEXT` gates include `pnpm check:api-contracts` + `pnpm check:api-route-catalog` |

---

## Registered contracts (current)

Ten contracts in `API_CONTRACTS` as of 2026-06-26:

| Contract ID | Method | Path |
| --- | --- | --- |
| `internal.v1.health.get` | GET | `/api/internal/v1/health` |
| `internal.v1.auth.memberships.get` | GET | `/api/internal/v1/auth/memberships` |
| `internal.v1.client-error.post` | POST | `/api/internal/v1/client-error` |
| `internal.v1.workspace.dashboard-layout.get` | GET | `/api/internal/v1/workspace/dashboard-layout` |
| `internal.v1.workspace.dashboard-layout.put` | PUT | `/api/internal/v1/workspace/dashboard-layout` |
| `internal.v1.workspace.dashboard-layout.delete` | DELETE | `/api/internal/v1/workspace/dashboard-layout` |
| `internal.v1.system-admin.users.invite.post` | POST | `/api/internal/v1/system-admin/users/invite` |
| `internal.v1.system-admin.memberships.role.post` | POST | `/api/internal/v1/system-admin/memberships/role` |
| `internal.v1.system-admin.audit-events.get` | GET | `/api/internal/v1/system-admin/audit-events` |
| `internal.v1.storage.tenant-brand-logo.post` | POST | `/api/internal/v1/storage/tenant-brand-logo` |

Live catalog: `apps/erp/src/server/api/contracts/api-route-catalog.snapshot.json`.

---

## Related documents

| Document | Role |
| --- | --- |
| [`PAS-001`](../PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md) §4.1.10 | Kernel/API ingress standard |
| [`foundation-disposition.md`](foundation-disposition.md) | Disposition registry human view |
| [`api-contract.md`](../governance/api-contract.md) | Developer how-to |
| [`nextjs-api-hardening.md`](../governance/nextjs-api-hardening.md) | Route handler rules |
| [`multi-tenancy.md`](./multi-tenancy.md) | Operating context model |
