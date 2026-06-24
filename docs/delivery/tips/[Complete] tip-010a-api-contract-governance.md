# TIP-010A — API Contract Governance Closeout

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Authority status** | **Accepted** — Architecture Authority slice under TIP-010 (2026-06-23) |
| **Runtime evidence** | `apps/erp/src/server/api/contracts/`, `scripts/api-contract/check-api-contracts.mts`, `scripts/api-contract/governed-api-routes.mts`, `docs/governance/api-contract.md` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 5 — API Contract Governance |
| **Remaining gap** | — |

## Purpose

Close out REST-first, envelope-based API contract governance for all governed ERP surfaces. Every non-auth ERP route must register a serializable `ApiRouteContract`, use `createApiHandler`, resolve operating context, enforce RBAC, emit stable success/error envelopes, and record audit events on mutations and denials.

ADR-0013 authority: Foundation Phase 5 exit criterion — API contract registry covers 100% of non-auth ERP routes.

Complements [`tip-010-api-rbac-wiring.md`]([Partially Implemented] tip-010-api-rbac-wiring.md) (RBAC slice); this TIP owns contract registry completeness, idempotency, pagination, and method rules.

## Scope

**In scope**

| Requirement | Deliverable |
| --- | --- |
| Route registry | 100% non-auth ERP route coverage in `api-contract-registry.ts` |
| Method contract | GET/POST/PATCH/PUT/DELETE rules per route class |
| Idempotency | Required for mutation routes with retry risk |
| Pagination | Standard for collection/list endpoints |
| Error envelope | Stable serializable `{ ok, error, meta }` shape with correlationId |
| Audit | Every mutation and permission denial |
| RBAC | Every protected route declares permission keys |
| Tenant/company context | No protected route without `resolveOperatingContext` |

**Out of scope**

- Public OpenAPI catalog (TIP-031)
- Accounting domain routes and schemas (TIP-013+, ADR-0010)
- System Admin routes ([TIP-013]([Complete] tip-013-system-admin-control-plane.md))
- GraphQL or public SDK defaults

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| Envelope contracts | `apps/erp/src/server/api/contracts/api-envelope.contract.ts` | Yes |
| Contract registry + handler bindings | `apps/erp/src/server/api/contracts/api-contract-registry.ts` | **Yes** — Slice 1 |
| Method policy contract | `apps/erp/src/server/api/contracts/method-policy.contract.ts` | **Yes** — Slice 1 |
| Route coverage validation | `apps/erp/src/server/api/contracts/api-route-coverage.ts` (canonical); `scripts/api-contract/check-api-contracts.mts` imports canonical module; `governed-api-routes.mts` re-exports for CI evidence path | **Yes** — Slice 1 + TIP-007/012 Slice B closeout |
| createApiHandler | `apps/erp/src/server/api/runtime/create-api-handler.ts` | Yes |
| API contract check | `scripts/api-contract/check-api-contracts.mts` | **Yes** — registry + method policy |
| Registry tests | `apps/erp/src/server/api/__tests__/api-contract-registry.test.ts` | **Yes** — Slice 1 |
| Idempotency contract + runtime | `idempotency.contract.ts`, `runtime/idempotency.ts`, dashboard PUT wiring | **Yes** — Slice 2 |
| Pagination contract | `pagination.contract.ts` | **Yes** — Slice 2 |
| Governance doc | `docs/governance/api-contract.md` | **Yes** — Slice 2 |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/erp` (PKG-007) | Route handlers, contracts, registry, tests |
| `@afenda/permissions` (PKG-014) | Permission keys on protected contracts |
| `@afenda/kernel` (PKG-010) | Branded execution context in envelopes |

## Depends on

- TIP-010 Identity & Authorization (partial) — [`tip-010-api-rbac-wiring.md`]([Partially Implemented] tip-010-api-rbac-wiring.md)
- TIP-012 ERP Operating Spine (**Complete**) — `createApiHandler` lifecycle

## Blocks

- Foundation Phase 5 gate
- Foundation Phase 9 requirement #5 — API contract governance proven
- TIP-013 System Admin — admin API routes require this closeout

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `apps/erp/src/server/api/contracts/api-contract-registry.ts` | `@afenda/erp` | Application | **Delivered** (Slice 1) | — |
| `apps/erp/src/server/api/contracts/method-policy.contract.ts` | `@afenda/erp` | Application | **Delivered** (Slice 1) | Application Authority |
| `apps/erp/src/server/api/contracts/api-route-coverage.ts` | `@afenda/erp` | Application | **Delivered** (Slice 1) | — |
| `scripts/api-contract/governed-api-routes.mts` | scripts | CI | **Delivered** (Slice 1) | — |
| `apps/erp/src/server/api/contracts/idempotency.contract.ts` | `@afenda/erp` | Application | **Delivered** (Slice 2) | Application Authority |
| `apps/erp/src/server/api/contracts/pagination.contract.ts` | `@afenda/erp` | Application | **Delivered** (Slice 2) | Application Authority |
| `apps/erp/src/server/api/runtime/idempotency.ts` | `@afenda/erp` | Application | **Delivered** (Slice 2) | Application Authority |
| `apps/erp/src/server/api/runtime/create-api-handler.ts` | `@afenda/erp` | Application | **Delivered** (Slice 2) | — |
| `docs/governance/api-contract.md` | docs | Governance | **Delivered** (Slice 2) | Architecture Authority |
| `apps/erp/src/server/api/__tests__/api-contract-registry.test.ts` | `@afenda/erp` | Application | **Delivered** (Slice 1) | — |
| `apps/erp/src/lib/api/__tests__/idempotency.test.ts` | `@afenda/erp` | Application | **Delivered** (Slice 2) | — |

## Acceptance gate

- `pnpm check:api-contracts` passes on 100% non-auth routes
- `pnpm --filter @afenda/erp test:run` — registry, idempotency, denial tests
- `pnpm --filter @afenda/erp typecheck`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN every non-auth ERP route is registered in api-contract-registry.ts
WHEN  pnpm check:api-contracts runs in CI
THEN  all governed routes declare Zod schemas, HTTP methods, permissions where required, and createApiHandler wiring

GIVEN the user is signed in under Tenant A
AND   the user operates within Company A (legal entity)
AND   the user has permission workspace.dashboard_read
WHEN  the user calls GET /api/internal/v1/workspace/dashboard-layout with valid x-tenant-slug
THEN  the response uses the governed success envelope with correlationId in meta
AND   no Company B data is accessible or returned

GIVEN the user is signed in under Tenant A
AND   the user does NOT have permission workspace.dashboard_write
WHEN  the user calls PUT /api/internal/v1/workspace/dashboard-layout
THEN  the API returns 403 Forbidden with error.correlationId
AND   an audit event records the denial with actor and correlation ID

GIVEN a mutation endpoint requires idempotency
WHEN  the client retries with the same Idempotency-Key header
THEN  the server returns the same result without duplicate side effects
AND   an audit event records actor, company, action, target, correlation ID

GIVEN a collection endpoint supports pagination
WHEN  the client requests page 2 with governed cursor/limit parameters
THEN  the response envelope includes stable pagination meta
AND   results remain scoped to the resolved operating context
```

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | 100% non-auth route registry | `pnpm check:api-contracts` | [x] Slice 1 |
| 2 | Idempotency + pagination + method contracts exist | File paths in Deliverables | [x] Slices 1–2 |
| 3 | Tests pass | `pnpm --filter @afenda/erp test:run` | [x] Slices 1–2 |
| 4 | Boundaries clean | `pnpm quality:boundaries` | [x] Slices 1–2 |
| 5 | Typecheck clean | `pnpm --filter @afenda/erp typecheck` | [x] Slices 1–2 |
| 6 | Biome clean | `pnpm ci:biome` | [x] Slice 2 — changed paths |
| 7 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] Slice 2 |
| 8 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] Slice 2 |
| 9 | Drift guard passes | `pnpm check:documentation-drift` | [x] Slice 2 |
| 10 | No accounting routes/schemas | ADR-0010 | [x] |
| 11 | Completion report posted | afenda-coding-session §11 | [x] Slices 1–2 |

## Handoff to implementation

> **Mandatory before code edits.** One slice per session.

### Slice 1 — Registry + method policy (`@afenda/erp`)

**Status:** Delivered (2026-06-23)

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-010a-api-contract-governance.md (Slice 1)

1. Objective    — Register all non-auth ERP routes; add method-policy contract and registry tests.
2. Allowed layer— apps/erp/src/server/api/contracts/ + apps/erp/src/app/api/
3. Files        — apps/erp/src/server/api/contracts/api-contract-registry.ts (Modified)
                  apps/erp/src/server/api/contracts/method-policy.contract.ts (New)
                  apps/erp/src/server/api/__tests__/api-contract-registry.test.ts (Modified)
4. Prohibited   — @afenda/accounting routes, packages/ui, unregistered route handlers
5. Authority    — ADR-0013 Phase 5 — Application Authority
6. Gates        — pnpm check:api-contracts
                  pnpm --filter @afenda/erp test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm quality:boundaries
```

### Slice 2 — Idempotency + pagination (`@afenda/erp`)

**Status:** Delivered (2026-06-23)

#### Design (internal-guide)

- Idempotency policy lives on `ApiRouteContract`; only mutations at retry risk declare `idempotency: { mode: "required" }` (dashboard layout PUT in this slice).
- Foundation store is **in-process** (`IdempotencyStore` interface) — no Drizzle migration until a dedicated schema TIP; swappable in tests via `resetIdempotencyStoreForTests()`.
- Replay returns the same serialized `data` payload with a fresh envelope `meta` (new `requestId` / `correlationId`) — no duplicate mutation side effects.
- Pagination contract defines cursor/limit query + `pagination` meta extension for future collection routes; no list route wiring until a collection endpoint exists.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-010a-api-contract-governance.md (Slice 2)

1. Objective    — Add idempotency and pagination contracts; wire idempotency replay in createApiHandler for mutation routes at retry risk.
2. Allowed layer— apps/erp/src/server/api/
3. Files        — apps/erp/src/server/api/contracts/api-contract.ts (Modified)
                  apps/erp/src/server/api/contracts/idempotency.contract.ts (New)
                  apps/erp/src/server/api/contracts/pagination.contract.ts (New)
                  apps/erp/src/server/api/contracts/workspace/dashboard-layout.contract.ts (Modified)
                  apps/erp/src/server/api/runtime/idempotency.ts (New)
                  apps/erp/src/server/api/runtime/create-api-handler.ts (Modified)
                  apps/erp/src/server/api/__tests__/api-contract-registry.test.ts (Modified)
                  apps/erp/src/lib/api/__tests__/idempotency.test.ts (New)
                  docs/governance/api-contract.md (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-010a-api-contract-governance.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified — if TIP status changes)
4. Prohibited   — @afenda/accounting, @afenda/accounting routes, ledger/journal/COA/posting (ADR-0010)
                  hand-edited migrations for idempotency store without schema TIP
                  packages/ui, packages/appshell, TIP-013 System Admin routes
5. Authority    — ADR-0013 Phase 5 — Application Authority
6. Gates        — pnpm check:api-contracts
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 2 | Idempotency + pagination + method contracts exist | File paths in Deliverables |
| 3 | Tests pass | `pnpm --filter @afenda/erp test:run` |
| 5 | Typecheck clean | `pnpm --filter @afenda/erp typecheck` |
| 6 | Biome clean | `pnpm ci:biome` |
| 7 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 8 | TIP status index updated | `pnpm check:documentation-drift` |
| 9 | Drift guard passes | `pnpm check:documentation-drift` |
| 11 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- Idempotency store is in-process only; durable store deferred until schema TIP.
- Pagination meta helpers defined; no collection route consumes them until list endpoints land.

## Verdict

**Complete** — Phase 5 API contract governance closed: registry + method policy (Slice 1), idempotency replay on dashboard PUT + pagination contract (Slice 2). Durable idempotency store deferred to a future schema TIP.
