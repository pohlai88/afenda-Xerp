# TIP-012 — Trigger.dev Execution Foundation

Status: **Complete (foundation)**

## Purpose

TIP-012 establishes Afenda's **Execution Spine** — the single authority for durable execution, background jobs, retries, schedules, workflow registration, execution context, and audit integration.

This TIP does **not** implement business workflows (email, AI, invoice, sync, payroll, etc.). Those belong to later TIPs.

## Architecture

```text
Business domains
       │
       ▼
executionService  (@afenda/execution)
       │
       ├── executionRegistry (workflow contracts)
       ├── withAuditEvidence (@afenda/observability / TIP-010)
       └── trigger.provider (ONLY Trigger.dev SDK import site)
              │
              ▼
         Trigger.dev (infrastructure)
```

## Package ownership

| Package | Owns |
|---------|------|
| `@afenda/execution` | Contracts, registry, service, Trigger.dev provider |
| `@afenda/kernel` | Execution context types |
| `@afenda/database` | `execution_runs` persistence schema |
| `@afenda/observability` | Audit writer integration (consumed, not recreated) |
| `@afenda/testing` | Mock execution provider fixtures |

## Public API

- `executionService.execute(...)`
- `executionService.schedule(...)`
- `executionService.retry(...)`
- `executionService.cancel(...)`
- `executionService.getStatus(...)`
- `executionService.registerWorkflow(...)`

## Governance

- Only `packages/execution/src/providers/trigger.provider.ts` may import `@trigger.dev/sdk`
- Business packages must call `executionService`, never Trigger.dev directly
- No `packages/jobs`, `packages/workflows`, `packages/cron`, etc.

## Rollout strategy

1. Merge execution spine (this TIP)
2. Configure `TRIGGER_SECRET_KEY` in deployment environments
3. Future TIPs register workflows via `executionService.registerWorkflow`
4. Future TIP-023 outbox consumers dispatch through `executionService.execute`

## Rollback strategy

1. Revert `@afenda/execution` package and database migration `20260620100000_execution_foundation`
2. Remove workflow registrations from consuming TIPs
3. Default `executionService` returns `provider_unavailable` safely when no provider is wired

## Drift risks

- Direct Trigger.dev imports in apps or business packages
- Custom retry/cron/queue frameworks outside `@afenda/execution`
- Business workflows registered inside TIP-012 instead of domain TIPs
- Bypassing execution context or correlation IDs

## Acceptance criteria

| Scenario | Result |
|----------|--------|
| Registered workflow executed | Starts through Trigger.dev provider |
| Failure with retry policy | Enters `retrying` state |
| Successful completion | Result becomes `success` |
| Scheduling | Uses execution schedule contracts |
| Audit events | Emitted via TIP-010 `withAuditEvidence` |
| Business background work | Uses `executionService` only |

## Files changed

### New

- `packages/execution/**` — execution spine
- `packages/kernel/src/contracts/execution-context.contract.ts`
- `packages/database/src/schema/execution.schema.ts`
- `packages/database/src/migrations/20260620100000_execution_foundation.sql`
- `packages/testing/src/execution/mock-execution-provider.ts`
- `docs/delivery/tip-012-execution-foundation.md`

### Updated

- `packages/kernel/src/index.ts`
- `packages/database/src/schema/index.ts`
- `packages/database/src/database.types.ts`
- `packages/testing/package.json`, `src/index.ts`, `tsconfig.json`
- `pnpm-workspace.yaml` (Trigger.dev catalog entry)
- `tsconfig.json` (project reference)

## Final verdict

TIP-012 delivers the Execution Spine foundation. Business domains can now depend on `@afenda/execution` as the only approved execution path for future TIPs.

## Enterprise 9.5 hardening (TypeScript architecture pass)

- Added `execution-metadata.contract.ts` with JSON-serializable `ExecutionPayload` for outbox/TIP-023 boundary safety
- Wired `ExecuteInput.kind` through service → provider → handle (removed dead optional field)
- Typed audit evidence with `ExecutionAuditAction` (removed `string` drift)
- Emit `workflow.failed` alongside `execution.failed` on provider failure
- Removed unused `localSchedules` map from trigger provider
- Removed `unavailableTriggerProvider` from public exports (internal wiring only)
- Replaced inline `import()` types with explicit contract imports
- Added vocabulary + serialization governance tests (`execution-vocabulary.test.ts`)
