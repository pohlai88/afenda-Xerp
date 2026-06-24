# TIP-010 — ERP API RBAC Wiring

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **Authority status** | **Accepted slice** — API RBAC wiring under ADR-0001 TIP-010 (Identity & Authorization Foundation) |
| **Runtime evidence** | `apps/erp/src/lib/api/authorize-api-route.ts`, `apps/erp/src/server/api/runtime/create-api-handler.ts` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 3 — Identity & Authorization |
| **Remaining gap** | All internal v1 routes classified + protected; system-admin API RBAC matrix completion |
| **Misnumbered evidence** | [`tip-010-observability-audit.md`]([Superseded] tip-010-observability-audit.md) — superseded; observability belongs to TIP-011 |
| **Related slice** | [TIP-010A]([Complete] tip-010a-api-contract-governance.md) (Complete) — contract registry, envelope, idempotency |

## Purpose

Wire server-side RBAC for governed ERP API routes using `@afenda/permissions`, tenant execution context from `@afenda/kernel`, and safe observability through the ERP Pino logger.

ADR-0001 TIP-010 defines the full Identity & Authorization Foundation (Better Auth, membership, role, permission, and policy engines). **This document covers the API RBAC wiring slice only** — not full TIP-010 identity closeout.

Foundation Phase 3 exit criterion: all internal v1 routes are classified and protected; permission denial + audit proven for cross-company scope mismatch scenarios.

## Scope

**In scope**

- API route protection classification (`public`, `authenticated`, `tenant-protected`, `internal-system`, `platform-admin`)
- Permission mapping from governed `ApiRouteContract` registry to `PERMISSION_REGISTRY` keys
- `authorizeApiRoute` helper — session gate, operating-context resolution, `checkPermission`, `evaluateAuthorizationPolicy`
- `createApiHandler` integration — context enrichment, denied-audit emission, stable error envelope
- Workspace dashboard-layout API RBAC (`workspace.dashboard_read`, `workspace.dashboard_write`)
- Architecture dependency approval for `@afenda/erp → @afenda/permissions`
- Unit and boundary tests for authorization paths

**Out of scope**

- Full TIP-010 identity closeout (membership engine, role engine, session→context bridge on all surfaces)
- TIP-013 System Admin UI and control-plane pages (API routes added there are partial evidence only)
- UI-only authorization and client-side permission checks
- Accounting domain routes (ADR-0010)
- Public OpenAPI catalog (TIP-031)

**Delivered in Slice 1:** Layer 1 (`checkPermission`) and Layer 2 (`evaluateAuthorizationPolicy`) on workspace dashboard-layout routes via `authorizeApiRoute` → `createApiHandler`.

## Runtime evidence (2026-06-24)

| Artifact | Path | Proven |
| --- | --- | --- |
| RBAC authorization helper | `apps/erp/src/lib/api/authorize-api-route.ts` | Yes — Slice 1 |
| Authorization contract types | `apps/erp/src/lib/api/authorize-api-route.contract.ts` | Yes — Slice 1 |
| Route protection + permission matrix | `apps/erp/src/lib/api/api-route-permissions.ts` | Yes — Slice 1 |
| Tenant scope resolution | `apps/erp/src/lib/api/api-route-context.ts` | Yes — Slice 1 |
| Operating-context resolver | `apps/erp/src/lib/api/resolve-api-route-operating-context.ts` | Yes — Slice 1 |
| Safe denial error mapping | `apps/erp/src/lib/api/api-error-response.ts` | Yes — Slice 1 |
| Handler runtime + RBAC wiring | `apps/erp/src/server/api/runtime/create-api-handler.ts` | Yes — Slice 1 |
| Request context + `assertRoutePermission` | `apps/erp/src/server/api/runtime/api-request-context.ts` | Yes — Slice 1 |
| Denied-audit helper | `apps/erp/src/server/api/runtime/api-handler-audit.ts` | Yes — Slice 1 |
| Workspace dashboard contracts | `apps/erp/src/server/api/contracts/workspace/dashboard-layout.contract.ts` | Yes — Slice 1 |
| Workspace dashboard route | `apps/erp/src/app/api/internal/v1/workspace/dashboard-layout/route.ts` | Yes — Slice 1 |
| Workspace permission keys | `packages/permissions/src/grants/permission.contract.ts` (`PERMISSION_REGISTRY.workspace.dashboard.*`) | Yes — Slice 1 |
| Seed alignment | `packages/database/src/seeds/platform-permissions.catalog.ts` | Yes — Slice 1 |
| System-admin audit-events route | `apps/erp/src/app/api/internal/v1/system-admin/audit-events/route.ts` | Partial — TIP-013 |
| System-admin users invite route | `apps/erp/src/app/api/internal/v1/system-admin/users/invite/route.ts` | Partial — TIP-013 |
| System-admin membership role route | `apps/erp/src/app/api/internal/v1/system-admin/memberships/role/route.ts` | Partial — TIP-013 |
| System-admin API contracts | `apps/erp/src/server/api/contracts/system-admin/system-admin.contract.ts` | Partial — TIP-013 |

## Route classification

| Route | Methods | Classification | Protection reason |
| --- | --- | --- | --- |
| `/api/health` | GET | `public` | Liveness alias; no identity required |
| `/api/internal/v1/health` | GET | `public` | Internal liveness probe |
| `/api/internal/v1/client-error` | POST | `public` | Anonymous client telemetry sink |
| `/api/auth/[...all]` | * | `public` | Better Auth protocol surface (allowlisted) |
| `/api/integrations/supabase/claims` | GET | `authenticated` | Supabase JWT debug; not Afenda RBAC |
| `/api/internal/v1/workspace/dashboard-layout` | GET | `tenant-protected` | Workspace layout read — tenant scope + `workspace.dashboard_read` |
| `/api/internal/v1/workspace/dashboard-layout` | PUT | `tenant-protected` | Workspace layout mutation — tenant scope + `workspace.dashboard_write` + audit |
| `/api/internal/v1/workspace/dashboard-layout` | DELETE | `tenant-protected` | Workspace layout reset — tenant scope + `workspace.dashboard_write` + audit |
| `/api/internal/v1/system-admin/audit-events` | GET | `tenant-protected` | System Admin audit read — `system_admin.audit_read` (TIP-013) |
| `/api/internal/v1/system-admin/users/invite` | POST | `tenant-protected` | User invite — `system_admin.users_manage` (TIP-013) |
| `/api/internal/v1/system-admin/memberships/role` | POST | `tenant-protected` | Role assignment — `system_admin.roles_manage` (TIP-013) |

## Permission mapping

| Contract ID | Method | Permission key | Registry path |
| --- | --- | --- | --- |
| `internal.v1.workspace.dashboard-layout.get` | GET | `workspace.dashboard_read` | `PERMISSION_REGISTRY.workspace.dashboard.read` |
| `internal.v1.workspace.dashboard-layout.put` | PUT | `workspace.dashboard_write` | `PERMISSION_REGISTRY.workspace.dashboard.write` |
| `internal.v1.workspace.dashboard-layout.delete` | DELETE | `workspace.dashboard_write` | `PERMISSION_REGISTRY.workspace.dashboard.write` |
| `internal.v1.system-admin.audit-events.get` | GET | `system_admin.audit_read` | `PERMISSION_REGISTRY.systemAdmin.audit.read` |
| `internal.v1.system-admin.users.invite.post` | POST | `system_admin.users_manage` | `PERMISSION_REGISTRY.systemAdmin.users.manage` |
| `internal.v1.system-admin.memberships.role.post` | POST | `system_admin.roles_manage` | `PERMISSION_REGISTRY.systemAdmin.roles.manage` |

**Registry additions (Slice 1):** `workspace.dashboard_read`, `workspace.dashboard_write` in `@afenda/permissions` `PERMISSION_REGISTRY` and `@afenda/database` `PLATFORM_PERMISSION_CATALOG`.

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/erp` (PKG-007) | API route handlers, `authorizeApiRoute`, `createApiHandler` integration, route permission matrix |
| `@afenda/permissions` (PKG-014) | `PERMISSION_REGISTRY`, `checkPermission`, `evaluateAuthorizationPolicy`, policy data sources |
| `@afenda/kernel` (PKG-003) | Branded execution context, operating-context resolution at API boundary |
| `@afenda/database` (PKG-005) | Platform permission catalog seed alignment |

## Depends on

- TIP-001 Auth Foundation (partial) — Better Auth session surface
- TIP-011 Execution Foundation (Complete) — audit infrastructure, correlation IDs, outbox on dashboard PUT
- TIP-010A API Contract Governance (Complete) — contract registry, envelope, `createApiHandler` baseline

## Blocks

- Foundation Phase 3 gate — full internal v1 route matrix + cross-company denial audit
- TIP-013 System Admin control plane API completion (partial routes exist; matrix not closed)
- Pre-accounting Phase 9 readiness — RBAC by context must be proven on all protected actions

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `apps/erp/src/lib/api/authorize-api-route.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/lib/api/authorize-api-route.contract.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/lib/api/api-route-context.ts` | `@afenda/erp` | Application | **Modified** | Application Authority |
| `apps/erp/src/lib/api/api-route-permissions.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/lib/api/api-error-response.ts` | `@afenda/erp` | Application | **Modified** | Application Authority |
| `apps/erp/src/lib/api/resolve-api-route-operating-context.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/server/api/runtime/create-api-handler.ts` | `@afenda/erp` | Application | **Modified** | Application Authority |
| `apps/erp/src/server/api/runtime/api-request-context.ts` | `@afenda/erp` | Application | **Modified** | Application Authority |
| `apps/erp/src/server/api/runtime/api-handler-audit.ts` | `@afenda/erp` | Application | **Modified** | Application Authority |
| `apps/erp/src/server/api/runtime/api-error.ts` | `@afenda/erp` | Application | **Modified** | Application Authority |
| `apps/erp/src/server/api/runtime/api-response.ts` | `@afenda/erp` | Application | **Modified** | Application Authority |
| `apps/erp/src/server/api/contracts/workspace/dashboard-layout.contract.ts` | `@afenda/erp` | Application | **Modified** | Application Authority |
| `packages/permissions/src/grants/permission.contract.ts` | `@afenda/permissions` | Integration | **Modified** | Permission Authority |
| `packages/database/src/seeds/platform-permissions.catalog.ts` | `@afenda/database` | Integration | **Modified** | Database Authority |
| `packages/architecture-authority/src/data/dependency-registry.data.ts` | `@afenda/architecture-authority` | Governance | **Modified** | Architecture Authority |

## Acceptance gate

- `pnpm --filter @afenda/permissions test:run`
- `pnpm --filter @afenda/erp typecheck`
- `pnpm --filter @afenda/erp test:run`
- `pnpm quality:boundaries`
- `pnpm ci:biome`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN a governed tenant-protected API contract declares a permission key
WHEN  createApiHandler serves the route
THEN  authorizeApiRoute resolves session + operating context
AND   checkPermission runs before handler execution
AND   evaluateAuthorizationPolicy runs after checkPermission
AND   denial returns stable { ok: false, error, meta } with correlationId

GIVEN the user is signed in under Tenant A
AND   the user has permission workspace.dashboard_read
AND   x-tenant-slug matches Tenant A
WHEN  GET /api/internal/v1/workspace/dashboard-layout is called
THEN  the response is 200 with the layout payload

GIVEN the user is signed in under Tenant A
AND   the user does NOT have permission workspace.dashboard_write
WHEN  PUT /api/internal/v1/workspace/dashboard-layout is called
THEN  the response is 403 Forbidden
AND   api.authorization.denied is logged without tokens or bodies
AND   denied audit evidence is emitted with correlationId

GIVEN the user is signed in
AND   x-tenant-slug does not match the user's granted tenant scope
WHEN  a tenant-protected internal v1 route is called
THEN  the response is 403 Forbidden
AND   an audit event records the denial with actor and correlation ID

GIVEN every non-allowlisted route file under apps/erp/src/app/api/
WHEN  the handler boundary test runs
THEN  each route uses createApiHandler or is explicitly allowlisted (auth, integrations)

GIVEN Phase 3 API RBAC closeout is complete
WHEN  the route permission matrix is built from API_CONTRACTS
THEN  every internal v1 protected route has a registry-backed permission key
AND   system-admin API routes declare system_admin.* permissions
```

### Acceptance criteria proof

| Scenario | Proof |
| --- | --- |
| authorizeApiRoute session + permission + policy | `apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts` |
| Workspace permission matrix entries | `apps/erp/src/lib/api/__tests__/api-route-permissions.test.ts` |
| Denial mapping + correlationId | `apps/erp/src/lib/api/__tests__/api-error-response.test.ts` |
| Error envelope includes correlationId | `apps/erp/src/server/api/__tests__/api-envelope.test.ts` |
| All governed routes use createApiHandler | `apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts` |
| Protected contracts declare permissions | `apps/erp/src/server/api/__tests__/api-contract-registry.test.ts` |
| Dashboard read granted → 200 | `apps/erp/src/__tests__/outbox-mutation.integration.test.ts`; `authorize-api-route.test.ts` |
| Dashboard write denied → 403 | `authorize-api-route.test.ts`; `protected-workspace-dashboard.integration.test.tsx` |
| System-admin routes exist with contracts | `apps/erp/src/app/api/internal/v1/system-admin/` (3 routes); `system-admin.contract.ts` |
| Full internal v1 matrix closed | **Gap** — Slice 2 |
| Cross-company scope mismatch audit | **Gap** — Phase 3 gate |

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | `authorizeApiRoute` helper exists | Deliverables table | [x] |
| 2 | `createApiHandler` delegates to RBAC | `create-api-handler.ts`, `api-request-context.ts` | [x] |
| 3 | Workspace dashboard routes gated | `dashboard-layout.contract.ts`, route file | [x] |
| 4 | `workspace.dashboard_*` in PERMISSION_REGISTRY + seed | `permission.contract.ts`, `platform-permissions.catalog.ts` | [x] |
| 5 | Authorization unit tests pass | `pnpm --filter @afenda/erp test:run` | [x] |
| 6 | Handler boundary tests pass | `api-handler-boundary.test.ts` | [x] |
| 7 | Architecture edge `@afenda/erp → @afenda/permissions` approved | `dependency-registry.data.ts` | [x] |
| 8 | All internal v1 routes classified + protected | `api-route-permissions.ts` matrix vs `API_CONTRACTS` | [ ] |
| 9 | System-admin API RBAC matrix complete | All system-admin routes + permission keys | [ ] |
| 10 | Cross-company scope mismatch denial + audit | Phase 3 gate integration test | [ ] |
| 11 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [ ] |
| 12 | TIP status index reflects partial closeout | `docs/delivery/tip-status-index.md` | [ ] |

## Handoff to implementation

> **Mandatory before code edits.** Two slices — dependency order: workspace RBAC (delivered) → route matrix + system-admin completion.

### Slice 1 — Workspace API RBAC (`@afenda/erp` + `@afenda/permissions`)

**Status:** Delivered  
**Prerequisite:** TIP-010A contract registry baseline (`apps/erp/src/server/api/contracts/` = `implemented`)

#### Design (internal-guide)

- `authorizeApiRoute` is the single RBAC entry point for governed API routes; never trust client scope without `checkPermission` + policy evaluation.
- `assertRoutePermission` in `api-request-context.ts` delegates to `assertAuthorizedApiRoute` and enriches `ApiRequestContext.execution` with tenant-scoped `ExecutionContext`.
- Route permission matrix is derived from `API_CONTRACTS` — no hand-maintained permission map outside the registry.
- Denied decisions log via `api.authorization.denied` (no tokens, cookies, or bodies) and emit denied audit evidence through `createApiHandler`.
- Workspace scope is slug-based (`x-tenant-slug`); `WorkspaceApiScope` headers must align with seed slugs in dev.

#### Helper contract — `authorizeApiRoute(input, deps?)`

- Requires session for non-public routes
- Resolves tenant scope from headers via `resolveOperatingContext`
- Calls `checkPermission` then `evaluateAuthorizationPolicy` from `@afenda/permissions`
- Returns discriminated union: `{ kind: "success", authorization, decision, execution }` | `{ kind: "failure", apiCode, denialCode, message, correlationId }`

#### Error shape

```json
{
  "ok": false,
  "error": {
    "code": "forbidden",
    "message": "You do not have permission to perform this action.",
    "correlationId": "corr-…"
  },
  "meta": {
    "correlationId": "corr-…",
    "requestId": "req-…",
    "timestamp": "…"
  }
}
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 1 | `authorizeApiRoute` helper exists | `pnpm --filter @afenda/erp test:run` |
| 2 | `createApiHandler` delegates to RBAC | `pnpm --filter @afenda/erp test:run` |
| 3 | Workspace dashboard routes gated | `api-route-permissions.test.ts` |
| 4 | Registry + seed alignment | `pnpm --filter @afenda/permissions test:run` |
| 5 | Authorization unit tests pass | `pnpm --filter @afenda/erp test:run` |
| 6 | Handler boundary tests pass | `pnpm --filter @afenda/erp test:run` |
| 7 | Architecture edge approved | `pnpm quality:boundaries` |

#### Known debt

- Only workspace dashboard-layout routes are proven end-to-end; system-admin routes added by TIP-013 use the same pipeline but matrix closeout deferred to Slice 2.
- Supabase claims route is `authenticated`-only, not Afenda RBAC — intentional debug surface.
- Policy gate primary actions (approval/evidence/step-up backends) remain placeholders until workflow APIs land.

### Slice 2 — Route matrix + system-admin API RBAC (`@afenda/erp`)

**Status:** Not started  
**Prerequisite:** Slice 1 runtime evidence rows for `authorize-api-route.ts` and workspace dashboard route = `implemented`

#### Design (internal-guide)

- Extend `API_CONTRACTS` + `buildRoutePermissionMatrix()` until every non-public internal v1 route is covered.
- Verify TIP-013 system-admin routes under `apps/erp/src/app/api/internal/v1/system-admin/` declare `PERMISSION_REGISTRY.systemAdmin.*` keys and pass `authorizeApiRoute` integration tests.
- Add cross-company scope mismatch integration test proving 403 + audit with actor and correlation ID (Phase 3 gate).
- No new permission keys without `@afenda/permissions` Authority approval and seed realignment.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-010-api-rbac-wiring.md

1. Objective    — Close the internal v1 route permission matrix and prove system-admin API RBAC + cross-company denial audit on all protected routes.
2. Allowed layer— apps/erp/src/lib/api/, apps/erp/src/server/api/, apps/erp/src/app/api/internal/v1/
3. Files        — apps/erp/src/lib/api/api-route-permissions.ts (Modified)
                  apps/erp/src/server/api/contracts/api-contract-registry.ts (Modified)
                  apps/erp/src/server/api/contracts/system-admin/system-admin.contract.ts (Modified)
                  apps/erp/src/app/api/internal/v1/system-admin/**/route.ts (Modified/New as needed)
                  apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts (Modified)
                  apps/erp/src/lib/api/__tests__/api-route-permissions.test.ts (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-010-api-rbac-wiring.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, ledger/journal/COA/posting, packages/ui edits, ADR-0010 Accounting Core packages, hand-maintained permission maps outside API_CONTRACTS, bypassing authorizeApiRoute in governed routes
5. Authority    — ADR-0001 Phase 3 — Application Authority + Permission Authority
6. Gates        — pnpm --filter @afenda/permissions test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 8 | All internal v1 routes classified + protected | `api-route-permissions.test.ts`, `api-contract-registry.test.ts` |
| 9 | System-admin API RBAC matrix complete | `system-admin/` route tests |
| 10 | Cross-company scope mismatch denial + audit | New integration test |
| 11 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 12 | TIP status index updated | `pnpm check:documentation-drift` |

#### Known debt

- TIP-013 delivered three system-admin API routes (`audit-events`, `users/invite`, `memberships/role`) with registry-backed permissions; remaining system-admin surfaces (settings, roles UI mutations, module config) may need additional API routes before Slice 2 can close.
- Full TIP-010 identity (membership/role engines, session→context on all surfaces) remains outside this slice.

## Dependency decisions

| Dependency | Decision |
| --- | --- |
| `@afenda/erp → @afenda/permissions` | **Approved** — RBAC authority for API routes |
| `@afenda/erp → @afenda/kernel` | Already approved — execution context branding |
| `@afenda/erp → @afenda/database` | Already approved — seed alignment; not used for scope fallback |

No deep imports. Public package exports only.

## Rollout steps

1. Merge RBAC wiring + permission registry additions
2. Run database seed so `workspace.dashboard_*` keys exist in `permissions` table
3. Assign workspace dashboard permissions to tenant roles used in dev/demo
4. Deploy ERP app; verify protected dashboard API returns 401/403/200 with `x-tenant-slug` (e.g. `dev-local` after local seed)

## Rollback

1. Revert `assertRoutePermission` to session-only gate (interim behavior)
2. Remove `@afenda/permissions` import from ERP API runtime
3. Revert architecture registry edge for `@afenda/erp → @afenda/permissions`
4. Permission registry keys can remain (harmless) or be reverted with seed realignment

## Verdict

**Partially Implemented** — `authorizeApiRoute` and `createApiHandler` RBAC integration are delivered for workspace dashboard-layout APIs with `PERMISSION_REGISTRY.workspace.dashboard.*` keys, unit/boundary tests, and architecture approval. TIP-013 added three system-admin routes under `apps/erp/src/app/api/internal/v1/system-admin/` with registry-backed `system_admin.*` permissions, but the full internal v1 route matrix and Phase 3 cross-company denial audit remain open in Slice 2. Full ADR-0001 TIP-010 identity closeout (membership, role, session bridge) is out of scope for this document.
