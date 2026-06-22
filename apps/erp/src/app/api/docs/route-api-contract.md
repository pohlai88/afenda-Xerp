* `/api-contract` discipline
* `/nextjs` App Router best practice
* API hardening
* future drift guardrails
* ERP production-readiness
* testable acceptance gates

Next.js Route Handlers are the right primitive for custom API endpoints in the `app` directory, and they should be treated as public-facing API surfaces with authentication and authorization verified inside the handler. ([Next.js][1]) ([Next.js][2])
For mutations, Next.js also warns that Server Functions / Server Actions are reachable by direct POST requests, so authentication and authorization must be checked inside every mutation path. ([Next.js][3])
For production hardening, Next.js recommends explicitly reviewing caching, security, observability, and performance before release. ([Next.js][4])

---

# Paste-ready command

````md
/api-contract /nextjs

You are working inside the Afenda ERP monorepo.

Your mission is to configure, harden, optimize, stabilize, and guardrail the Next.js ERP API surface so it reaches at least **9.5/10 enterprise coding quality**.

The implementation must follow REST-first API contract governance, Next.js App Router best practices, strict runtime validation, server-side authorization, observability, and future drift prevention.

Do not produce quick demo code. Do not bypass architecture. Do not introduce duplicate API patterns. Do not mix UI concerns into API contracts. Do not weaken existing governance.

---

## 0. Context and target

Project context:

- App: `apps/erp`
- API style: REST-first
- Framework: Next.js App Router
- API route primitive: `app/api/**/route.ts`
- Existing governance direction:
  - execution context required
  - permissions required
  - audit evidence required
  - route handlers treated as public API endpoints
  - server actions must not bypass API/domain authorization
  - no drift between API contract, route handler, domain service, and tests

Target quality:

```txt
Enterprise score target: 9.5 / 10
````

The final output must include:

1. API contract structure
2. route handler hardening
3. request/response envelope
4. error taxonomy
5. authz and execution context guard
6. validation pattern
7. caching and runtime policy
8. observability and audit integration
9. contract tests
10. route handler tests
11. architecture drift guards
12. documentation
13. verification commands

---

## 1. Architecture rules — non-negotiable

Implement or refine the API governance so the following rules become testable:

```txt
Route handler owns:
- HTTP method
- request parsing
- request validation
- auth/session guard
- permission guard
- response mapping
- cache/runtime policy
- correlation id propagation
- audit evidence call boundary

Route handler must NOT own:
- business logic
- database writes directly
- permission decisions inline
- UI copy
- React components
- client state
- raw SQL unless explicitly part of approved data adapter
```

```txt
Contract owns:
- endpoint identity
- method
- path
- request schema
- response schema
- error schema
- permission requirement
- audit action name
- cache policy
- runtime policy
```

```txt
Domain/service layer owns:
- business rules
- transactional behavior
- domain validation beyond API shape
- persistence orchestration
- audit event payload details
```

Add or update tests to ensure route handlers do not import forbidden modules directly.

Forbidden examples inside `app/api/**/route.ts`:

```txt
- React components
- UI packages
- app-shell
- metadata-ui renderers
- database schema tables directly, unless through approved adapter/service
- raw dashboard/demo modules
```

---

## 2. Desired folder structure

Create or refine the API contract structure using this pattern.

```txt
apps/erp/src/
  app/api/
    internal/v1/
      health/route.ts
      system-admin/
        users/route.ts
        roles/route.ts
        permissions/route.ts
        memberships/route.ts

  server/api/
    contracts/
      api-contract.ts
      api-error.contract.ts
      api-envelope.contract.ts
      api-route-policy.contract.ts
      system-admin/
        users.api-contract.ts
        roles.api-contract.ts
        permissions.api-contract.ts
        memberships.api-contract.ts

    runtime/
      create-api-handler.ts
      api-request-context.ts
      api-response.ts
      api-error.ts
      api-validation.ts
      api-permission.ts
      api-cache-policy.ts
      api-correlation.ts

    __tests__/
      api-contract.test.ts
      api-handler-boundary.test.ts
      api-error.test.ts
      api-envelope.test.ts
      api-permission.test.ts
```

If the repo already has equivalent folders, reuse and improve them. Do not create duplicate architecture.

---

## 3. API contract model

Create a serializable API contract format.

```ts
export type ApiHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRuntime = "nodejs" | "edge";

export type ApiCachePolicy =
  | { readonly kind: "no-store" }
  | { readonly kind: "revalidate"; readonly seconds: number }
  | { readonly kind: "static" };

export interface ApiRoutePermissionPolicy {
  readonly permission: string;
  readonly mode: "required";
}

export interface ApiAuditPolicy {
  readonly action: string;
  readonly targetType: string;
  readonly enabled: boolean;
}

export interface ApiRouteContract<
  TRequestSchema,
  TResponseSchema,
  TErrorSchema
> {
  readonly id: string;
  readonly method: ApiHttpMethod;
  readonly path: string;
  readonly version: "v1";
  readonly runtime: ApiRuntime;
  readonly cache: ApiCachePolicy;
  readonly requestSchema: TRequestSchema;
  readonly responseSchema: TResponseSchema;
  readonly errorSchema: TErrorSchema;
  readonly permission?: ApiRoutePermissionPolicy;
  readonly audit?: ApiAuditPolicy;
  readonly tags: readonly string[];
}
```

Use `satisfies ApiRouteContract<...>` for every contract.

Every route handler must reference exactly one contract.

---

## 4. Request / response envelope

Standardize all API responses.

```ts
export interface ApiSuccessEnvelope<TData> {
  readonly ok: true;
  readonly data: TData;
  readonly meta: {
    readonly requestId: string;
    readonly correlationId: string;
    readonly timestamp: string;
  };
}

export interface ApiErrorEnvelope<TCode extends string = string> {
  readonly ok: false;
  readonly error: {
    readonly code: TCode;
    readonly message: string;
    readonly details?: unknown;
  };
  readonly meta: {
    readonly requestId: string;
    readonly correlationId: string;
    readonly timestamp: string;
  };
}
```

Rules:

```txt
- Never return raw thrown errors.
- Never leak stack traces.
- Never leak SQL messages.
- Never return inconsistent `{ success: true }`, `{ status: "ok" }`, or ad-hoc shapes.
- Every route returns `ApiSuccessEnvelope` or `ApiErrorEnvelope`.
```

Add tests proving this.

---

## 5. Error taxonomy

Create governed API errors.

```ts
export const API_ERROR_CODES = [
  "bad_request",
  "unauthenticated",
  "forbidden",
  "not_found",
  "conflict",
  "validation_failed",
  "rate_limited",
  "internal_error",
  "service_unavailable",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export interface ApiErrorDefinition {
  readonly code: ApiErrorCode;
  readonly httpStatus: number;
  readonly publicMessage: string;
  readonly logLevel: "debug" | "info" | "warn" | "error";
}
```

Rules:

```txt
- Validation failure maps to 400.
- Unauthenticated maps to 401.
- Permission failure maps to 403.
- Not found maps to 404.
- Conflict maps to 409.
- Unexpected error maps to 500 with generic message.
```

Add tests for every mapping.

---

## 6. Route handler factory

Create a single route handler factory.

```ts
export function createApiHandler<TRequest, TResponse>(config: {
  readonly contract: ApiRouteContract<unknown, unknown, unknown>;
  readonly handler: (context: ApiRequestContext<TRequest>) => Promise<TResponse>;
}): (request: Request) => Promise<Response>;
```

The factory must handle:

```txt
- method validation
- correlation id
- request id
- JSON parsing
- query parsing for GET
- schema validation
- authentication/session guard
- organization/tenant/company context resolution where required
- permission guard
- audit evidence wrapper
- response envelope
- error envelope
- status code mapping
- cache headers
- logging
```

Route handlers should become thin:

```ts
export const runtime = usersListContract.runtime;
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: usersListContract,
  async handler(context) {
    return listUsersForSystemAdmin(context);
  },
});
```

Do not duplicate try/catch logic across route files.

---

## 7. Next.js hardening rules

Apply these App Router rules.

```txt
- Route Handlers live in `app/api/**/route.ts`.
- Use Web `Request` / `Response` APIs.
- Use `Response.json()` through the central response helper only.
- Explicitly set runtime per contract.
- Explicitly set dynamic/cache behavior per contract.
- Mutating routes must be `no-store`.
- Authenticated GET routes should default to `no-store` unless contract says otherwise.
- Public static GET routes may opt into revalidation.
- Never rely on default caching behavior for protected data.
```

Also ensure:

```txt
- Server Actions must not bypass domain authorization.
- Server Actions that mutate must call the same service/contract governance or a protected action wrapper.
- Route Handlers and Server Actions must verify auth and authorization server-side.
```

---

## 8. Security headers and CORS

Add API-safe defaults.

```txt
- Internal APIs default to same-origin only.
- No wildcard CORS on authenticated routes.
- Reject unsupported origins if CORS is configured.
- Add security headers through Next config or middleware/proxy where appropriate.
- Do not expose sensitive headers.
```

Minimum headers for API responses where applicable:

```txt
Cache-Control
Content-Type
X-Request-Id
X-Correlation-Id
```

If security headers are handled globally in `next.config.ts`, document the source of authority and do not duplicate them in every route.

---

## 9. Validation pattern

Use one validation path.

Preferred:

```txt
- zod schema or existing repo schema system
- parse `unknown`
- return typed result
- map validation issue to `validation_failed`
```

Rules:

```txt
- Do not cast request body directly.
- Do not trust query params.
- Do not trust route params.
- Do not trust local headers except approved system headers.
- Do not use `as SomeType` to bypass parsing.
```

Add tests:

```txt
- invalid JSON
- invalid body
- invalid query
- missing required context
- unsupported method
```

---

## 10. Observability and audit

Integrate with existing Afenda observability.

Every API request should produce structured log context:

```txt
requestId
correlationId
method
path
contractId
actorId when available
tenantId when available
organizationId when available
statusCode
durationMs
errorCode when failed
```

Audit rules:

```txt
- Mutations should emit audit evidence.
- Read endpoints only audit when contract requires it.
- Audit action name comes from contract.
- Do not hardcode audit action names inside route handlers.
```

Do not log:

```txt
passwords
tokens
cookies
authorization headers
OTP
secret keys
raw request body by default
```

---

## 11. Drift guardrails

Add static tests or scripts that fail if future drift occurs.

Required guardrails:

```txt
1. Every `app/api/**/route.ts` must use `createApiHandler`.
2. Every route handler must reference an `ApiRouteContract`.
3. No route handler may return raw `Response.json()` directly.
4. No route handler may import React/UI/AppShell/Metadata UI modules.
5. No route handler may directly import database tables unless allowlisted.
6. No duplicate response envelope definitions.
7. No duplicate API error code arrays.
8. No mutation route may use cache policy other than `no-store`.
9. No protected route may omit permission policy unless explicitly public.
10. No contract may omit version, method, path, runtime, cache, tags.
```

Suggested script:

```txt
scripts/api-contract/check-api-contracts.mts
```

Suggested tests:

```txt
apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts
apps/erp/src/server/api/__tests__/api-contract-registry.test.ts
```

---

## 12. API contract registry

Create a central registry.

```ts
export const API_CONTRACTS = [
  usersListContract,
  usersCreateContract,
  rolesListContract,
  permissionsListContract,
] as const satisfies readonly ApiRouteContract<unknown, unknown, unknown>[];
```

Validate:

```txt
- unique contract id
- unique method + path pair
- all protected contracts have permission
- all mutation contracts have audit policy unless explicitly exempted
- all mutation contracts are no-store
- all tags are known
```

---

## 13. Testing requirements

Add or update tests for:

```txt
Contract tests
- unique ids
- unique method/path
- required fields
- protected permissions
- mutation no-store
- mutation audit policy

Factory tests
- success envelope
- error envelope
- validation failure
- unsupported method
- unauthenticated
- forbidden
- unexpected error mapped to internal_error
- correlation id propagation
- cache header behavior

Route tests
- each route uses createApiHandler
- no forbidden imports
- no direct Response.json
- no direct database table import unless allowlisted

Next.js behavior tests
- GET protected route is no-store
- POST/PATCH/DELETE are no-store
- runtime export matches contract
```

---

## 14. Documentation output

Create or update:

```txt
docs/governance/api-contract.md
docs/governance/nextjs-api-hardening.md
```

Docs must explain:

```txt
- how to add a new API endpoint
- where to define the contract
- how to wire route.ts
- how errors are mapped
- how permissions are enforced
- how audit is configured
- how cache/runtime policy is chosen
- how to run verification gates
- what drift guardrails exist
```

Keep docs concise. Do not duplicate huge code blocks.

---

## 15. Acceptance criteria

The work is not complete until all are true.

```txt
Architecture
- All API routes use createApiHandler.
- Every API route references exactly one ApiRouteContract.
- No business logic lives in route.ts.
- No UI/AppShell/Metadata UI imports exist in API routes.
- No duplicate envelope/error taxonomy exists.

Security
- Every protected route verifies authentication server-side.
- Every protected route verifies permission server-side.
- Every mutation has no-store policy.
- Every mutation has audit policy unless explicitly exempted.
- Raw thrown errors are never exposed to clients.
- Sensitive values are redacted from logs.

Next.js
- Route handlers use App Router route.ts conventions.
- Runtime and cache policy are explicit.
- Protected GET routes are no-store unless contract explicitly permits revalidation.
- Server Actions do not bypass API/domain authorization rules.

Quality
- Contract registry validates unique ids and method/path pairs.
- Invalid JSON/body/query returns governed validation error.
- Correlation id is propagated.
- Request id is generated.
- All responses follow envelope format.

Drift guardrails
- Static tests fail on forbidden imports.
- Static tests fail on direct Response.json usage.
- Static tests fail on route handlers not using createApiHandler.
- Static tests fail on duplicated API error/envelope definitions.

Docs
- API contract governance doc exists.
- Next.js API hardening doc exists.
- New endpoint onboarding steps are documented.

Verification
- All required commands pass.
```

---

## 16. Verification commands

Run these and fix all failures:

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm --filter @afenda/erp build

pnpm typecheck
pnpm test:run
pnpm build
pnpm quality

pnpm ui:guard:scan
pnpm check:downstream-integration
```

If scripts do not exist, do not silently ignore them. Either add the correct package script or document the existing equivalent.

---

## 17. Final response required from coding agent

When complete, return a structured completion report:

```md
# API Contract + Next.js Hardening Completion Report

## Enterprise score
Target: 9.5 / 10
Actual: x.x / 10

## Files created

## Files modified

## Architecture decisions

## Security hardening applied

## Next.js hardening applied

## Drift guardrails added

## Tests added

## Verification results

## Remaining risks

## Follow-up recommendations
```

Be strict. If the implementation does not meet 9.5 quality, state what is missing and do not claim it is complete.

```

---

# My recommendation

Use this as a **single implementation command**. It is strict enough to prevent future drift, but not overcomplicated. The strongest parts are:

- one `createApiHandler`
- one API contract registry
- one response envelope
- one error taxonomy
- explicit Next.js runtime/cache policy
- static guardrails against route drift

That combination is what turns the API layer from “working code” into **enterprise-governed infrastructure**.
```

[1]: https://nextjs.org/docs/app/getting-started/route-handlers?utm_source=chatgpt.com "Getting Started: Route Handlers"
[2]: https://nextjs.org/docs/app/guides/authentication?utm_source=chatgpt.com "Guides: Authentication"
[3]: https://nextjs.org/docs/app/getting-started/mutating-data?utm_source=chatgpt.com "Getting Started: Mutating Data"
[4]: https://nextjs.org/docs/app/guides/production-checklist?utm_source=chatgpt.com "How to optimize your Next.js application for production"
