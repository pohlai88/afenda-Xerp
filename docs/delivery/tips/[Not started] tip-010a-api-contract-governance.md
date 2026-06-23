# TIP-010A — API Contract Governance Closeout

| Field | Value |
| --- | --- |
| **Status** | Not started |
| **Authority status** | **Accepted** — Architecture Authority slice under TIP-010 (2026-06-23) |
| **Runtime evidence** | `apps/erp/src/server/api/contracts/`, `scripts/api-contract/check-api-contracts.mts`, `docs/governance/api-contract.md` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 5 — API Contract Governance |
| **Remaining gap** | Route registry below 100%; idempotency and pagination standards missing |

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
- System Admin routes ([TIP-013]([Not started] tip-013-system-admin-control-plane.md))
- GraphQL or public SDK defaults

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| Envelope contracts | `apps/erp/src/server/api/contracts/api-envelope.contract.ts` | Yes |
| Contract registry | `apps/erp/src/server/api/contracts/api-contract-registry.ts` | Partial |
| createApiHandler | `apps/erp/src/server/api/runtime/create-api-handler.ts` | Partial |
| API contract check | `scripts/api-contract/check-api-contracts.mts` | Yes |
| Governance doc | `docs/governance/api-contract.md` | Partial |
| Idempotency contract + middleware | — | **No** |
| Pagination contract | — | **No** |
| 100% route registry | — | **No** |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/erp` (PKG-007) | Route handlers, contracts, registry, tests |
| `@afenda/permissions` (PKG-014) | Permission keys on protected contracts |
| `@afenda/kernel` (PKG-010) | Branded execution context in envelopes |

## Depends on

- TIP-010 Identity & Authorization (partial) — [`tip-010-api-rbac-wiring.md`]([Partially Implemented] tip-010-api-rbac-wiring.md)
- TIP-012 ERP Operating Spine (partial) — `createApiHandler` lifecycle

## Blocks

- Foundation Phase 5 gate
- Foundation Phase 9 requirement #5 — API contract governance proven
- TIP-010B System Admin (proposed) — admin API routes require this closeout

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `apps/erp/src/server/api/contracts/api-contract-registry.ts` | `@afenda/erp` | Application | Modified | — |
| `apps/erp/src/server/api/contracts/idempotency.contract.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/server/api/contracts/pagination.contract.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/server/api/contracts/method-policy.contract.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/server/api/runtime/idempotency.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `docs/governance/api-contract.md` | docs | Governance | Modified | Architecture Authority |
| `apps/erp/src/server/api/__tests__/api-contract-registry.test.ts` | `@afenda/erp` | Application | Modified | — |
| `apps/erp/src/lib/api/__tests__/api-route-permissions.test.ts` | `@afenda/erp` | Application | Modified | — |
| `apps/erp/src/lib/api/__tests__/idempotency.test.ts` | `@afenda/erp` | Application | **New** | — |

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
| 1 | 100% non-auth route registry | `pnpm check:api-contracts` | [ ] |
| 2 | Idempotency + pagination + method contracts exist | File paths in Deliverables | [ ] |
| 3 | Tests pass | `pnpm --filter @afenda/erp test:run` | [ ] |
| 4 | Boundaries clean | `pnpm quality:boundaries` | [ ] |
| 5 | Typecheck clean | `pnpm --filter @afenda/erp typecheck` | [ ] |
| 6 | Biome clean | `pnpm ci:biome` | [ ] |
| 7 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [ ] |
| 8 | TIP status index updated | `docs/delivery/tip-status-index.md` | [ ] |
| 9 | Drift guard passes | `pnpm check:documentation-drift` | [ ] |
| 10 | No accounting routes/schemas | ADR-0010 | [ ] |
| 11 | Completion report posted | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Mandatory before code edits.** One slice per session.

### Slice 1 — Registry + method policy (`@afenda/erp`)

```
Handoff from: docs/delivery/tips/[Not started] tip-010a-api-contract-governance.md (Slice 1)

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

```
Handoff from: docs/delivery/tips/[Not started] tip-010a-api-contract-governance.md (Slice 2)

1. Objective    — Add idempotency and pagination contracts; wire idempotency for mutation routes at retry risk.
2. Allowed layer— apps/erp/src/server/api/
3. Files        — apps/erp/src/server/api/contracts/idempotency.contract.ts (New)
                  apps/erp/src/server/api/contracts/pagination.contract.ts (New)
                  apps/erp/src/server/api/runtime/idempotency.ts (New)
                  apps/erp/src/lib/api/__tests__/idempotency.test.ts (New)
                  docs/governance/api-contract.md (Modified)
4. Prohibited   — @afenda/accounting, hand-edited migrations for idempotency store without schema TIP
5. Authority    — ADR-0013 Phase 5 — Application Authority
6. Gates        — pnpm check:api-contracts
                  pnpm --filter @afenda/erp test:run
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

**Prerequisite:** Slice 1 merged.

## Verdict

**Not started** — envelope pattern and partial registry exist; Phase 5 closeout requires full route coverage, idempotency, pagination, and method rules with tests.
