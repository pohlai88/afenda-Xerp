---
name: afenda-openapi
description: Analyzes, audits, and extends Afenda's contract-driven OpenAPI 3.1 implementation under apps/erp/src/server/api/contracts/openapi/. Use when adding new API contracts, improving OpenAPI quality (summary, description, examples, deprecated flag, tags, file upload content type), running drift gates, or evaluating completeness against best practices. Covers the full pipeline: ApiRouteContract → zod-openapi generator → afenda-internal-v1.openapi.json snapshot.
disable-model-invocation: true
---

# Afenda OpenAPI Skill

## What Afenda has (current state as of 2026-06-26)

**Generator:** `zod-openapi` (`createDocument` + `createSchema`) — schema-first, Zod as single source of truth.  
**Registry:** `API_CONTRACTS` array in `api-contract-registry.ts` — 10 registered routes, all active.  
**Output snapshot:** `apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json`  
**Document spec:** OpenAPI 3.1.0 — correct and modern.  
**Docs locales:** en + zh Fumadocs API reference operation pages (`ARCH-API-002` P3 delivered 2026-06-26).

### What is solid (do not change)

- OpenAPI 3.1.0 with `zod-openapi`'s `createDocument`
- Registry-first pattern: contract → OpenAPI, never hand-edit the JSON
- `x-afenda-*` vendor extensions (`x-afenda-contract-id`, `x-afenda-auth-policy`, `x-afenda-lifecycle`, `x-afenda-context-policy`, `x-afenda-rate-limit-policy`, `x-afenda-permission`)
- `AfendaSession` cookie security scheme (Better Auth)
- Standard error responses: 8 HTTP statuses (400, 401, 403, 404, 409, 429, 500, 503) on every operation
- Idempotency key header (`idempotency-key`) documented when contract policy is `required` or `optional`
- Context policy headers (tenant slug, company, org, workspace) per `contextPolicy`
- Snapshot drift CI gate: `pnpm check:openapi-drift` (chained in `pnpm check:api-contracts`)
- POST mutations document `201 Created`; GET/PUT/DELETE document `200 OK`
- Transport response headers (`x-correlation-id`, `x-request-id`, `Cache-Control`) on success and error responses
- Full test suite in `apps/erp/src/server/api/__tests__/openapi-document.test.ts` (21+ structural tests)

---

## Gap registry (actionable quality improvements)

Original generator gaps **G1–G8, G10** are **closed** (2026-06-26). Remaining work is spec/runtime accuracy and governance hygiene:

| # | Gap | Status | How to close |
|---|-----|--------|--------------|
| G1 | Human-readable `summary` on operations | **Closed** | `ApiRouteContract.summary` projected in `buildOperationObject` |
| G2 | Route narrative `description` | **Closed** | Optional `ApiRouteContract.description` with formula fallback |
| G3 | Zod `.meta({description, example})` on schema fields | **Closed** | Domain `*.api-contract.ts` + envelope components |
| G4 | `deprecated: true` from lifecycle/stability | **Closed** | `isContractDeprecated()` in `buildOperationObject` |
| G5 | Document-level `tags[]` | **Closed** | `AFENDA_OPENAPI_DOCUMENT_TAGS` includes all operation tag groups |
| G6 | `info.contact` and `info.license` | **Closed** | Set in `buildAfendaOpenapiDocument` |
| G7 | Rate-limit response headers on 429 | **Closed** | `RATE_LIMIT_RESPONSE_HEADERS` in `buildStandardErrorResponses` |
| G8 | Cursor pagination params + meta | **Closed** | `contract.pagination.mode === "cursor"` projection |
| G9 | Multipart upload false positive | **Removed** | Presigned JSON upload flow — not multipart |
| G10 | `externalDocs` at document level | **Closed** | Links to governance doc path |
| C1 | POST success status `201` vs spec `200` | **Closed** | `resolveOperationSuccessStatus()` matches `createApiHandler` |
| C2 | Optional `idempotency-key` header | **Closed** | `acceptsIdempotencyKey()` projects header with `required: false` |
| C3 | Transport response headers | **Closed** | `TRANSPORT_RESPONSE_HEADERS` on success + error responses |
| I1 | Undefined operation tags | **Closed** | Extended `AFENDA_OPENAPI_DOCUMENT_TAGS` |
| I2 | `check:openapi-drift` not in default contract gate | **Closed** | Chained in `pnpm check:api-contracts` |
| I3 | Structural OpenAPI lint | **Closed** | `pnpm lint:openapi` (operationId uniqueness + declared tags) |
| I4 | `externalDocs.url` repo-relative | Open | Use deployed docs URL or `x-afenda-governance-path` when public catalog ships |
| I5 | Request schema component merge asymmetry | **Closed** | `collectRequestSchemaComponents()` mirrors response merge |
| I6 | Pagination on one route only | Pattern ready | Adopt `pagination: { mode: "cursor" }` on new list routes |

---

## How to add a new contract correctly (complete checklist)

### Step 1 — write the Zod schemas with `.meta()`

```typescript
import { z } from "zod";

// Add .meta() to every field consumers will read
export const myResourceSchema = z.object({
  id: z.string().uuid().meta({
    description: "Unique resource identifier.",
    example: "4dd643ff-7ec7-4666-9c88-50b7d3da34e4",
  }),
  name: z.string().min(1).meta({
    description: "Human-readable name for the resource.",
    example: "Default workspace",
  }),
}).meta({ id: "MyResource" }); // id registers as reusable $ref component
```

### Step 2 — declare the contract

```typescript
import { z } from "zod";
import type { ApiRouteContract } from "../api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "../api-governance.constants";
import { myResourceSchema } from "./my-resource.api-contract";

export const myResourceGetContract = {
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-org-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.my-domain.my-resource.get",
  // G1/G2: add human-readable summary + description when fields land on ApiRouteContract
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/my-domain/my-resource",
  permission: { mode: "required", permission: "my_domain.resource_read" },
  rateLimitPolicy: "authenticated-standard",
  requestSchema: z.undefined(),
  requestSchemaRef: "apps/erp/src/server/api/contracts/my-domain/my-resource.api-contract.ts#request:none",
  responseSchema: myResourceSchema,
  responseSchemaRef: "apps/erp/src/server/api/contracts/my-domain/my-resource.api-contract.ts#myResourceSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["my-domain"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<undefined, z.infer<typeof myResourceSchema>>;
```

### Step 3 — register in api-contract-registry.ts

```typescript
// In GOVERNED_ROUTE_CONTRACT_EXPORTS:
myResourceGetContract,

// In API_CONTRACTS array:
myResourceGetContract,
```

### Step 4 — wire the route handler

`apps/erp/src/app/api/internal/v1/my-domain/my-resource/route.ts` must use `createApiHandler` and re-export bindings. No direct `Response.json()`.

### Step 5 — refresh snapshots and run gates

```bash
pnpm export:api-route-catalog          # refresh api-route-catalog.snapshot.json
pnpm export:openapi                    # refresh afenda-internal-v1.openapi.json
pnpm check:api-contracts               # registry coverage + method policy
pnpm check:api-route-catalog           # snapshot drift
pnpm check:openapi-drift               # OpenAPI snapshot drift
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run -- openapi-document
```

---

## How to close G4 — `deprecated` flag (concrete fix)

In `build-afenda-openapi-document.ts`, `buildOperationObject`:

```typescript
const isDeprecated =
  contract.lifecycle === "deprecated" || contract.stability === "deprecated";

const operation: Record<string, unknown> = {
  operationId: contractIdToOperationId(contract.id),
  summary: contract.id,
  // ...
  ...(isDeprecated ? { deprecated: true } : {}),
};
```

After editing: refresh snapshot with `pnpm export:openapi && pnpm check:openapi-drift`.

---

## How to close G5 — document-level tags

In `buildAfendaOpenapiDocument`, add to `createDocument`:

```typescript
tags: [
  { name: "health", description: "Service health and diagnostics." },
  { name: "auth", description: "Session authentication and membership resolution." },
  { name: "workspace", description: "Workspace-scoped resources." },
  { name: "system-admin", description: "System administration — tenant management." },
  { name: "storage", description: "Binary asset storage operations." },
  { name: "observability", description: "Client-side telemetry and error ingestion." },
],
```

---

## How to close G7 — rate-limit response headers on 429

In `buildStandardErrorResponses`, extend the 429 response:

```typescript
responses["429"] = {
  description: STANDARD_ERROR_DESCRIPTIONS[429],
  headers: {
    "X-RateLimit-Limit": {
      description: "Maximum requests allowed in the current window.",
      schema: { type: "integer" },
    },
    "X-RateLimit-Remaining": {
      description: "Requests remaining in the current window.",
      schema: { type: "integer" },
    },
    "Retry-After": {
      description: "Seconds until the rate-limit window resets.",
      schema: { type: "integer" },
    },
  },
  content: { "application/json": { schema: errorSchema } },
};
```

---

## Verification gates (complete set)

```bash
pnpm check:api-contracts          # registry coverage + method/idempotency policy
pnpm check:api-route-catalog      # snapshot drift vs live registry
pnpm export:api-route-catalog     # refresh api-route-catalog.snapshot.json
pnpm export:openapi               # refresh afenda-internal-v1.openapi.json
pnpm check:openapi-drift          # OpenAPI snapshot drift vs live generator
pnpm lint:openapi                 # structural lint (operationId, declared tags)
pnpm sync:openapi                 # export:openapi + MDX docs regeneration
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run -- openapi-document api-contract api-envelope
```

---

## Files map

| File | Role |
|------|------|
| `contracts/openapi/build-afenda-openapi-document.ts` | Document builder — paths + operations from registry |
| `contracts/openapi/afenda-openapi.components.ts` | Shared schemas, error envelope, security schemes |
| `contracts/openapi/context-policy-openapi.ts` | Context policy → header parameter projection |
| `contracts/openapi/index.ts` | Public exports |
| `contracts/afenda-internal-v1.openapi.json` | Committed snapshot (source of truth for CI drift check) |
| `contracts/api-contract-registry.ts` | `API_CONTRACTS` — single source for all operations |
| `contracts/api-contract.ts` | `ApiRouteContract<TRequest, TResponse>` shape |
| `__tests__/openapi-document.test.ts` | Snapshot + structural tests |

---

## Do / do not

| Do | Do not |
|----|--------|
| Add `.meta({description, example})` to every exported Zod schema field | Hand-edit `afenda-internal-v1.openapi.json` |
| Run `pnpm export:openapi` after any contract or generator change | Change `openapi: "3.1.0"` — it is correct |
| Use `contract.id` dot-notation: `internal.v1.<domain>.<resource>.<method>` | Add routes outside `API_CONTRACTS` registry |
| Set `deprecated: true` on operations when lifecycle is `deprecated` | Duplicate envelope or error schema constants |
| Define tags at document level when adding a new tag group | Introduce a parallel OpenAPI generator |
| Reference `ARCH-API-002` for OpenAPI catalog governance authority | Generate SDK clients without ARCH/FDR approval |

---

## Related documents

- [`docs/architecture/afenda-rest-api-governance.md`](../../docs/architecture/afenda-rest-api-governance.md) — governance authority
- [`ARCH-API-002`](../../docs/ARCH/ARCH-API-002-openapi-internal-v1-catalog.md) — OpenAPI catalog decision
- [`docs/governance/api-contract.md`](../../docs/governance/api-contract.md) — developer how-to
- [`fdr-007-api-governance`](../../docs/delivery/FDR/%5BPartially%20Implemented%5D%20fdr-007-api-governance.md) — FDR gates
