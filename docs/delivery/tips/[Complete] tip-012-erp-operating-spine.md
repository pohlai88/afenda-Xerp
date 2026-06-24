# TIP-012 — ERP Operating Spine

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Authority status** | ADR-0001 TIP-012 accepted — full lifecycle including outbox proven |
| **Runtime evidence** | `packages/kernel/src/context/context-registry.ts`, `apps/erp/src/lib/context/`, `apps/erp/src/lib/spine/`, `apps/erp/src/server/api/runtime/create-api-handler.ts`, `packages/database/src/audit/`, `apps/erp/src/__tests__/operating-spine-lifecycle.integration.test.ts` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 2 — Platform Runtime Spine (cross-cutting through Phase 3 closeout) |
| **Remaining gap** | — |

## Purpose

Every protected ERP action must flow through a governed lifecycle with no bypass. The operating spine binds validation, authorization, policy evaluation, domain execution, audit emission, observability, and **event publication via outbox** into one testable pipeline that all future ERP modules must use.

ADR-0001 TIP-012 authority: every future ERP module must execute through the operating spine; no business domain may bypass validation → authorization → policy → execution → audit → observability → event publication.

## Scope

**In scope**

- Kernel operating context contracts (`@afenda/kernel`)
- ERP operating context resolver pipeline (`apps/erp/src/lib/context/`)
- API route spine via `createApiHandler` + `authorizeApiRoute`
- Audit writer integration on protected mutations
- Correlation ID propagation (`apps/erp/src/lib/observability/erp-correlation-id.ts`)
- Server action audit helper (`apps/erp/src/lib/server-actions/record-action-audit.ts`)
- Full lifecycle integration test on at least one protected mutation (dashboard layout PUT recommended)
- Cross-tenant and cross-company denial paths with audit evidence
- Outbox event publication step (depends on TIP-011 outbox deliverables)

**Out of scope**

- New ERP business modules or domain packages (TIP-013+, ADR-0010)
- `@afenda/accounting`, chart of accounts, journals, posting, fiscal periods, consolidation arithmetic
- Approval workflow engine implementation (TIP-029) — policy/approval **hooks** only where placeholders exist
- Replacing kernel context model with monolithic context files — distributed concerns remain in permissions, observability, metadata, entitlements (master plan v5 §8)

## Spine lifecycle (mandatory)

```text
Validation
  → Authorization      (@afenda/permissions — authorizeApiRoute)
  → Policy             (evaluateAuthorizationPolicy)
  → Execution          (domain service / route handler)
  → Audit              (@afenda/database audit + record-erp-audit-event)
  → Observability      (pino + correlation ID)
  → Event publication  (outbox → @afenda/execution)   ← proven on dashboard PUT (TIP-011 Slice 3 + TIP-012 Slice 2)
```

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| Kernel context registry (10 modules) | `packages/kernel/src/context/context-registry.ts` | Yes |
| Operating context resolver | `apps/erp/src/lib/context/resolve-operating-context.server.ts` | Partial |
| Resolver pipeline registry | `apps/erp/src/lib/context/operating-context-resolver-registry.ts` | Partial |
| API handler factory | `apps/erp/src/server/api/runtime/create-api-handler.ts` | Partial |
| API RBAC wiring | `apps/erp/src/lib/api/authorize-api-route.ts`, [`tip-010-api-rbac-wiring.md`](%5BComplete%5D%20tip-010-api-rbac-wiring.md) | Complete |
| Audit contracts + writer | `packages/database/src/audit/audit-event.contract.ts`, `audit.writer.ts` | Partial |
| ERP audit recorder | `apps/erp/src/lib/observability/record-erp-audit-event.ts` | Partial |
| Correlation ID | `apps/erp/src/lib/observability/erp-correlation-id.ts` | Partial |
| Handler boundary test | `apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts` | Partial — routes use createApiHandler |
| Operating context integration tests | `apps/erp/src/__tests__/operating-context-integration.test.ts` | Partial |
| Multi-tenancy slice evidence | [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md) | Partial |
| Outbox event publication | `apps/erp/src/lib/outbox/`, dashboard PUT route | **Yes** — TIP-011 Slice 3 + TIP-012 Slice 2 |
| Full lifecycle integration test | `apps/erp/src/__tests__/operating-spine-lifecycle.integration.test.ts` | **Yes** — Slice 2 |
| Misnumbered execution evidence | [`tip-012-execution-foundation.md`](tip-012-execution-foundation.md) | Superseded — belongs to TIP-011 |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/kernel` (PKG-010) | Operating context contracts — serializable, boundary-safe |
| `@afenda/permissions` (PKG-014) | Authorization and policy evaluation |
| `@afenda/database` (PKG-003) | Audit persistence |
| `@afenda/observability` (PKG-013) | Logging and audit adapters |
| `@afenda/execution` (PKG-008) | Outbox dispatch (TIP-011) |
| `@afenda/erp` (PKG-007) | Resolver implementation, API spine, integration tests |

## Depends on

- TIP-007 ERP Platform Authority (partial) — platform entity and context model
- TIP-007/012 Enterprise Group Operating Context (partial) — multi-tenancy resolver slice
- TIP-010 Identity & Authorization (partial) — API RBAC wiring
- TIP-011 Execution Foundation (**Complete**) — outbox required for spine closeout

## Blocks

- TIP-013+ all business domains (with Phase 9 gate per ADR-0010)
- Foundation Phase 2 gate sign-off
- TIP-023 Outbox domain event pattern (post–Phase 9)

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `apps/erp/src/lib/spine/run-protected-mutation.ts` | `@afenda/erp` | Application | **Delivered** (Slice 1) | Application Authority |
| `apps/erp/src/lib/spine/protected-mutation-spine.contract.ts` | `@afenda/erp` | Application | **Delivered** (Slice 1) | Application Authority |
| `apps/erp/src/server/api/runtime/create-api-handler.ts` | `@afenda/erp` | Application | **Delivered** (Slice 2) | — |
| `apps/erp/src/server/api/runtime/api-handler-audit.ts` | `@afenda/erp` | Application | **Delivered** (Slice 2) | — |
| `apps/erp/src/lib/context/context-integration-registry.ts` | `@afenda/erp` | Application | **Delivered** (Slice 2) | — |
| `apps/erp/src/__tests__/operating-spine-lifecycle.integration.test.ts` | `@afenda/erp` | Application | **Delivered** (Slice 2) | — |
| `packages/database/src/schema/outbox.schema.ts` | `@afenda/database` | Platform | **New** | TIP-011 |
| `packages/execution/src/services/outbox-publish.service.ts` | `@afenda/execution` | Foundation | **New** | TIP-011 |

## Acceptance gate

- All governed API routes use `createApiHandler` — `pnpm --filter @afenda/erp test:run` (`api-handler-boundary.test.ts`)
- Operating context resolver tests pass — `pnpm --filter @afenda/erp test:run`
- Full lifecycle integration test passes including outbox row — `pnpm --filter @afenda/erp test:run`
- RBAC denial + audit on cross-company scope mismatch — `pnpm --filter @afenda/erp test:run`
- Outbox operational — `pnpm --filter @afenda/execution test:run` (TIP-011)
- No boundary violations — `pnpm quality:boundaries`
- Documentation synchronized — `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN the user is signed in under Tenant A
AND   the user operates within Company A (legal entity)
AND   the user has permission workspace.dashboard_write
AND   no pending approval exists for this action
WHEN  the user mutates workspace dashboard layout via PUT /api/internal/v1/workspace/dashboard-layout
THEN  the request passes validation, authorization, and policy evaluation
AND   the domain service executes within the resolved operating context
AND   an audit event records actor, company, action, target, correlation ID
AND   structured logs include the correlation ID
AND   an outbox row is created for event publication

GIVEN the user is signed in under Tenant A with access to Company A only
AND   the user attempts to mutate data scoped to Company B
WHEN  resolveOperatingContext evaluates the request
THEN  the API returns 403 Forbidden
AND   no mutation or outbox row is created
AND   an audit event records the denial with actor and correlation ID
AND   Company B data is not accessible or returned

GIVEN the user is signed in under Tenant A
AND   Tenant B has overlapping workspace resources
WHEN  Tenant A user requests Tenant B scoped endpoints
THEN  the resolver fail-closes with tenant mismatch
AND   no cross-tenant data is returned

GIVEN Phase 9 Accounting Readiness Gate has NOT passed
WHEN  a developer adds ledger, journal, or posting logic to the spine
THEN  the change is rejected by ADR-0010 and architecture gates
```

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Spine helper and integration test exist | File paths in Deliverables table | [x] Slices 1–2 |
| 2 | Acceptance criteria pass as tests | `pnpm --filter @afenda/erp test:run` | [x] Slice 2 |
| 3 | Kernel context surface gate passes | `pnpm quality:kernel-context-surface` | [x] Slice 1 |
| 4 | No unauthorized package boundary crossing | `pnpm quality:boundaries` | [x] Slice 1 |
| 5 | TypeScript strict — no `any` | `pnpm --filter @afenda/erp typecheck` | [x] Slice 1 |
| 6 | Biome lint + format clean | `pnpm ci:biome` | [x] Slice 2 — scoped paths |
| 7 | TIP-011 outbox deliverables complete | TIP-011 DoD rows 1–7 | [x] |
| 8 | Runtime truth matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] Slice 2 |
| 9 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] Slice 2 |
| 10 | Delivery doc + matrix in sync | `pnpm check:documentation-drift` | [x] Slice 2 |
| 11 | No accounting logic introduced | ADR-0010 compliance | [x] |
| 12 | Completion report posted | afenda-coding-session §11 | [x] Slice 2 |

## Handoff to implementation

> **Mandatory before code edits.** Copy a slice block into `/afenda-coding-session` Phase 0.  
> Skill reference: [write-tip §10](../../.cursor/skills/write-tip/SKILL.md#10--handoff-to-implementation).

**Prerequisite:** [TIP-011 Slice 2](%5BPartially%20Implemented%5D%20tip-011-execution-foundation.md#slice-2--outbox-publish-worker-afendaexecution) (outbox operational) must complete before Slice 2 below.

### Slice 1 — Spine contract + helper (`@afenda/erp`)

**Status:** Delivered (2026-06-23)

### Slice 2 — Handler integration + lifecycle test (`@afenda/erp`)

**Status:** Delivered (2026-06-23)

#### Slice 2 — DoD closed

- `runProtectedMutation` wired in `createApiHandler` for mutation methods
- `operating-spine-lifecycle.integration.test.ts` proves mutation → outbox → publish
- Audit metadata includes tenant/company scope from execution context

**Prerequisite:** TIP-011 Slices 1–3 merged. **Satisfied.**

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-012-erp-operating-spine.md (Slice 1)

1. Objective    — Add protected-mutation spine contract and run-protected-mutation helper wiring
                  validation → auth → policy → execute → audit → observability hooks.
2. Allowed layer— apps/erp/src/lib/spine/
3. Files        — apps/erp/src/lib/spine/protected-mutation-spine.contract.ts (New)
                  apps/erp/src/lib/spine/run-protected-mutation.ts (New)
4. Prohibited   — @afenda/accounting, packages/ui, packages/kernel contract changes,
                  outbox worker (TIP-011), ad-hoc tenant lookups
5. Authority    — ADR-0001 ERP Operating Spine (TIP-012) — Application Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm quality:kernel-context-surface
                  pnpm quality:boundaries
```

### Slice 2 — Handler integration + lifecycle test (`@afenda/erp`)

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-012-erp-operating-spine.md (Slice 2)

1. Objective    — Wire createApiHandler to spine helper; add full lifecycle integration test
                  including outbox row on dashboard layout PUT.
2. Allowed layer— apps/erp/src/server/api/runtime/ + apps/erp/src/__tests__/
3. Files        — apps/erp/src/server/api/runtime/create-api-handler.ts (Modified)
                  apps/erp/src/server/api/runtime/api-handler-audit.ts (Modified)
                  apps/erp/src/lib/context/context-integration-registry.ts (Modified)
                  apps/erp/src/__tests__/operating-spine-lifecycle.integration.test.ts (New)
4. Prohibited   — @afenda/accounting, packages/ui, new domain routes, ledger/journal logic
5. Authority    — ADR-0001 ERP Operating Spine (TIP-012) — Application Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm --filter @afenda/execution test:run
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

**Prerequisite:** TIP-011 Slices 1–2 merged; TIP-012 Slice 1 merged.

### Coding-session additions (all slices)

After handoff, `afenda-coding-session` governs: branded IDs at DB boundaries, `resolveOperatingContext()` only (no inline tenant lookup), Drizzle transactions for mutations, `setupUser` in tests, Completion Report §11 closing every DoD row.

### Post-implementation doc updates

1. [`[Complete] tip-012-erp-operating-spine.md`](%5BComplete%5D%20tip-012-erp-operating-spine.md) — Runtime evidence + DoD
2. [`tip-status-index.md`](tip-status-index.md) — if Partially Implemented → Complete
3. [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) — Audit / Observability + Pre-accounting readiness rows

## Verdict

**Complete** — Operating spine contract, `runProtectedMutation`, `createApiHandler` integration, dashboard PUT outbox wiring, and lifecycle integration test delivered. Trigger.dev prod worker closed via [TIP-011 Slice 4](%5BComplete%5D%20tip-011-execution-foundation.md).
