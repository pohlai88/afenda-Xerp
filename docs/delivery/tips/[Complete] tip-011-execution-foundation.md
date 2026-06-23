# TIP-011 — Execution Foundation

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Authority status** | ADR-0001 TIP-011 accepted — Slices 1–4 delivered; production route wiring remains TIP-012 scope |
| **Runtime evidence** | `packages/database/src/schema/outbox.schema.ts`, `packages/execution/`, `apps/erp/src/lib/outbox/`, `packages/database/src/schema/execution.schema.ts`, `packages/storage/`, `packages/observability/`, Trigger.dev prod worker **20260623.1** (`foundation.publish-outbox-events`) |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 2 — Platform Runtime Spine |
| **Remaining gap** | — |

## Purpose

Establish Afenda's execution foundation: Drizzle persistence hooks, tenant-scoped storage, observability adapters, Trigger.dev durable jobs, and a **database outbox** for governed event publication. Every protected ERP mutation that completes successfully must be able to enqueue an outbox row for asynchronous dispatch through `@afenda/execution` without bypassing tenant, company, or correlation context.

ADR-0001 TIP-011 authority: platform execution services (Supabase, Drizzle, Storage, Trigger.dev, **Outbox**, Observability, Audit Infrastructure) must be operational before the ERP operating spine closes out.

## Scope

**In scope**

- `@afenda/execution` — durable job spine, outbox publish worker, outbox contracts
- `@afenda/storage` — tenant-scoped storage abstraction
- `@afenda/observability` — logging, tracing, audit adapters consumed by execution paths
- `@afenda/database` — `execution_runs` schema (exists); **outbox schema** (Slice 1 — delivered)
- Trigger.dev provider isolation and execution registry
- Integration test: protected mutation → outbox row → worker dispatch (happy path)
- Cross-tenant negative test: outbox row scoped to Tenant A is not readable or dispatchable under Tenant B session

**Out of scope**

- Business workflow orchestration (TIP-029+)
- Accounting event consumers and domain posting (TIP-013+, ADR-0010)
- `@afenda/accounting` package, ledger/journal/posting schemas, or consolidation logic
- Replacing misnumbered evidence docs — retain with superseded banners (TIP-000D)

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| Execution package + Trigger.dev provider | `packages/execution/src/providers/trigger.provider.ts`, `packages/execution/src/services/execution.service.ts` | Yes |
| Execution runs schema | `packages/database/src/schema/execution.schema.ts` | Yes |
| Execution metadata / outbox vocabulary | `packages/execution/src/contracts/execution-metadata.contract.ts` | Partial — contract only |
| Outbox envelope round-trip test | `packages/execution/src/__tests__/execution-vocabulary.test.ts` | Partial — vocabulary only |
| Storage abstraction | `packages/storage/` | Yes |
| Observability baseline | `packages/observability/`, [`tip-010-observability-audit.md`](tip-010-observability-audit.md) (misnumbered evidence) | Partial |
| **Database outbox table** | `packages/database/src/schema/outbox.schema.ts`, migration `20260623100000_outbox_foundation.sql` | **Yes** — Slice 1 |
| Outbox publish worker | `packages/execution/src/services/outbox-publish.service.ts`, `packages/execution/src/jobs/publish-outbox-events.job.ts` | **Yes** — Slice 2 |
| **ERP outbox integration** | `apps/erp/src/__tests__/outbox-mutation.integration.test.ts`, `apps/erp/src/lib/outbox/` | **Yes** — Slice 3 |
| **Trigger.dev prod deploy** | `packages/execution/trigger.config.ts`, `pnpm --filter @afenda/execution trigger:deploy`; worker **20260623.1**; task `foundation.publish-outbox-events`; env `TRIGGER_PROJECT_REF`, `TRIGGER_SECRET_KEY`, `TRIGGER_API_URL` | **Yes** — Slice 4 |
| Misnumbered Trigger.dev slice evidence | [`tip-012-execution-foundation.md`](tip-012-execution-foundation.md) | Superseded — audit trail only |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/execution` (PKG-008) | Durable execution registry, Trigger.dev adapter, outbox publish worker |
| `@afenda/database` (PKG-003) | Outbox + execution_runs persistence, migrations |
| `@afenda/storage` (PKG-015) | Tenant-scoped blob storage |
| `@afenda/observability` (PKG-013) | Structured logging and audit adapters for execution paths |
| `@afenda/erp` (PKG-007) | Consumer of execution spine in protected mutations (integration tests) |

## Depends on

- TIP-001 Architecture Authority — package boundaries and CI gates
- TIP-009 Monorepo & CI/CD — build and test pipeline
- TIP-010 Identity & Authorization (partial) — actor and tenant scope for outbox rows

## Blocks

- TIP-012 ERP Operating Spine — event publication step requires outbox
- Foundation Phase 2 gate — spine lifecycle integration test
- Foundation Phase 9 Accounting Readiness Gate — requirement #5 (spine + outbox proven)
- TIP-023 Outbox domain event pattern (Phase 2 business domain — blocked by ADR-0010 until Phase 9)

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `packages/database/src/schema/outbox.schema.ts` | `@afenda/database` | Platform | **Delivered** (Slice 1) | Platform Authority |
| `packages/database/src/schema/index.ts` | `@afenda/database` | Platform | **Delivered** (Slice 1) | — |
| `packages/execution/src/contracts/outbox-event.contract.ts` | `@afenda/execution` | Foundation | **Delivered** (Slice 2) | Platform Authority |
| `packages/execution/src/services/outbox-publish.service.ts` | `@afenda/execution` | Foundation | **Delivered** (Slice 2) | Platform Authority |
| `packages/execution/src/jobs/publish-outbox-events.job.ts` | `@afenda/execution` | Foundation | **Delivered** (Slice 2) | Platform Authority |
| `packages/execution/src/index.ts` | `@afenda/execution` | Foundation | **Delivered** (Slice 2) | — |
| `packages/execution/src/__tests__/outbox-publish.test.ts` | `@afenda/execution` | Foundation | **Delivered** (Slice 2) | — |
| `apps/erp/src/__tests__/outbox-mutation.integration.test.ts` | `@afenda/erp` | Application | **Delivered** (Slice 3) | — |
| `apps/erp/src/lib/outbox/enqueue-outbox-event.server.ts` | `@afenda/erp` | Application | **Delivered** (Slice 3) | — |
| `apps/erp/src/lib/outbox/drizzle-outbox-persistence.adapter.ts` | `@afenda/erp` | Application | **Delivered** (Slice 3) | — |
| `apps/erp/src/lib/outbox/commit-workspace-dashboard-mutation.server.ts` | `@afenda/erp` | Application | **Delivered** (Slice 3) | — |
| Drizzle migration (generated) | `@afenda/database` | Platform | **New** | `pnpm db:generate` — no hand-edit |

## Acceptance gate

- Trigger.dev execution spine operational — `pnpm --filter @afenda/execution test:run` passes; prod worker **20260623.1** deployed with task `foundation.publish-outbox-events` (`pnpm --filter @afenda/execution trigger:deploy`)
- Outbox schema migrated — `pnpm quality:migrations` passes
- Outbox publish worker dispatches at least one test event — `pnpm --filter @afenda/execution test:run`
- Protected mutation integration test covers mutation → outbox row → worker — `pnpm --filter @afenda/erp test:run`
- No unauthorized package edges — `pnpm quality:boundaries`
- Documentation synchronized — `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN the user is signed in under Tenant A
AND   the user operates within Company A (legal entity)
AND   a protected ERP mutation completes successfully through createApiHandler
WHEN  the domain service commits the transaction
THEN  an outbox row is inserted with tenantId, companyId, correlationId, and serializable payload
AND   an audit event records actor, company, action, target, correlation ID
AND   the outbox publish worker dispatches the event through @afenda/execution exactly once

GIVEN the user is signed in under Tenant A
AND   Tenant B has pending outbox rows
WHEN  a Tenant A session queries or triggers outbox dispatch
THEN  no Tenant B outbox rows are accessible or dispatched
AND   Company B data is not accessible or returned

GIVEN the user does NOT have permission workspace.dashboard_write
WHEN  the user attempts a protected mutation on workspace dashboard layout
THEN  the API returns 403 Forbidden
AND   no outbox row is created
AND   an audit event records the denial with actor and correlation ID

GIVEN Phase 9 Accounting Readiness Gate has NOT passed
WHEN  a developer attempts to create @afenda/accounting or ledger schemas
THEN  the attempt is blocked by ADR-0010
```

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Runtime evidence exists at stated file paths | `outbox.schema.ts`, publish service, worker exist | [x] Slices 1–2 |
| 2 | Acceptance criteria pass as tests | `pnpm --filter @afenda/execution test:run` | [x] Slice 2 — unit publish proof |
| 3 | ERP integration test passes | `pnpm --filter @afenda/erp test:run` | [x] Slice 3 |
| 4 | No unauthorized package boundary crossing | `pnpm quality:boundaries` | [x] Slices 1–3 |
| 5 | TypeScript strict — no `any` | `pnpm --filter @afenda/execution typecheck` | [x] Slice 2 |
| 6 | Biome lint + format clean | `pnpm ci:biome` | [x] Slice 3 — outbox paths |
| 7 | Migrations generated not hand-edited | `pnpm quality:migrations` | [x] Slice 1 — journal + governance pass; see Known debt |
| 8 | Runtime truth matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] Slice 3 |
| 9 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] Slice 3 |
| 10 | Delivery doc + matrix in sync | `pnpm check:documentation-drift` | [x] Slice 3 |
| 11 | No accounting logic introduced | ADR-0010 — no `@afenda/accounting` | [x] Slice 1 |
| 12 | Completion report posted | afenda-coding-session §11 | [x] Slice 3 |
| 13 | Trigger.dev prod worker deployed | `pnpm --filter @afenda/execution trigger:deploy` → worker **20260623.1** | [x] Slice 4 |

## Handoff to implementation

> **Mandatory before code edits.** Copy the block below into `/afenda-coding-session` Phase 0.  
> Skill reference: [write-tip §10](../../.cursor/skills/write-tip/SKILL.md#10--handoff-to-implementation).  
> The DoD table above is the checklist; afenda-coding-session §11 Completion Report is the proof.

This TIP spans three packages — **implement one slice per coding session** (dependency order: database → execution → ERP test).

### Slice 1 — Outbox schema (`@afenda/database`)

**Status:** Delivered (commit `764c31f`, 2026-06-23). Slice 2 prerequisite satisfied at runtime.

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-011-execution-foundation.md (Slice 1)

1. Objective    — Add governed outbox Drizzle schema, generated migration, public exports,
                  registry smoke test, migration governance, and §9 documentation sync.
2. Allowed layer— packages/database/ (schema, migrations, public-api, tests);
                  repo-root drizzle entry (db:generate only); docs/ (§9 evidence only)
3. Files        — packages/database/src/schema/outbox.schema.ts (New)
                  packages/database/src/schema/index.ts (Modified)
                  packages/database/src/public-api.ts (Modified)
                  packages/database/src/__tests__/index.test.ts (Modified)
                  packages/database/src/migrations/migration-governance.contract.ts (Modified)
                  packages/database/src/migrations/<timestamp>_outbox_foundation.sql (New — pnpm db:generate)
                  packages/database/src/migrations/meta/_journal.json (Modified — drizzle-kit output)
                  drizzle.config.ts (New — monorepo db:generate entry)
                  package.json (Modified — root db:generate script)
                  docs/delivery/tips/[Partially Implemented] tip-011-execution-foundation.md (Modified — §9)
                  docs/delivery/tip-status-index.md (Modified — §9)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — §9)
4. Prohibited   — @afenda/accounting, packages/execution (Slice 2), apps/erp (Slice 3),
                  packages/ui/appshell, hand-edited SQL without generate provenance
5. Authority    — ADR-0001 Platform Authority (TIP-011) — Database / Platform Authority
6. Gates        — pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm quality:migrations
                  pnpm quality:boundaries
                  pnpm migrate (operator — apply pending migration)
                  pnpm check:documentation-drift
```

#### Slice 1 — Definition of Done (closed rows)

| Row | Criterion | Slice 1 result |
| --- | --- | --- |
| DoD 1 | `outbox.schema.ts` exists | **Partial** — schema yes; worker deferred to Slice 2 |
| DoD 4 | `pnpm quality:boundaries` | **Pass** |
| DoD 7 | Migration governance | **Pass** — `quality:migrations` + governance contract |
| DoD 8–9 | Matrix + index updated | **Pass** — same PR as §9 sync |
| DoD 11 | No accounting logic | **Pass** |
| DoD 12 | Completion report | **Pass** — afenda-coding-session §11 |

#### Slice 1 — Known debt (non-blocking for Slice 2 start)

| Item | Impact | Remediation |
| --- | --- | --- |
| Drizzle `meta/` snapshots stale (3 snapshots / 22 journal entries) | `pnpm db:generate` prompts interactively in non-TTY shells | Baseline snapshots before next schema change; Architecture Authority tracks |
| `tenantId` / `companyId` nullable on `outbox_events` | Write path must enforce scope (matches `audit_events` pattern) | Slice 2 publish service + Slice 3 ERP test prove enforcement |

### Slice 2 — Outbox publish worker (`@afenda/execution`)

**Status:** Delivered (2026-06-23). Slice 3 prerequisite satisfied at unit-test level; ERP persistence adapter wiring remains in Slice 3.

#### Design (internal-guide)

| Decision | Rationale |
| --- | --- |
| **Port/adapter pattern** | `@afenda/execution` must not import `@afenda/database` (dependency registry). Persistence is injected via `OutboxPersistencePort`. |
| **Dispatcher injection** | Downstream consumers (Trigger.dev tasks, domain handlers) implement `OutboxEventDispatcher` — execution owns poll/lock/lifecycle only. |
| **Tenant filter on claim** | `PublishOutboxBatchInput.tenantId` scopes claims — defense-in-depth before dispatch. |
| **Serializable contracts** | Envelopes reuse `ExecutionOutboxEnvelope` + `ExecutionPayload` guards from Slice 1 vocabulary. |
| **Trigger.dev isolation** | Job module registers workflow metadata only; `@trigger.dev/sdk` stays in `trigger.provider.ts`. |

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-011-execution-foundation.md (Slice 2)

1. Objective    — Implement outbox contracts, publish service, Trigger.dev job registration helper,
                  unit tests proving dispatch + tenant isolation, and §9 documentation sync.
2. Allowed layer— packages/execution/src/; docs/ (§9 evidence only)
3. Files        — packages/execution/src/contracts/outbox-event.contract.ts (New)
                  packages/execution/src/services/outbox-publish.service.ts (New)
                  packages/execution/src/jobs/publish-outbox-events.job.ts (New)
                  packages/execution/src/index.ts (Modified)
                  packages/execution/src/__tests__/outbox-publish.test.ts (New)
                  docs/delivery/tips/[Partially Implemented] tip-011-execution-foundation.md (Modified — §9)
                  docs/delivery/tip-status-index.md (Modified — §9)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — §9)
4. Prohibited   — @afenda/accounting, apps/erp (Slice 3), @afenda/database direct import,
                  hand-edited SQL migrations, packages/ui/appshell
5. Authority    — ADR-0001 Platform Authority (TIP-011) — Platform / Execution
6. Gates        — pnpm --filter @afenda/execution typecheck
                  pnpm --filter @afenda/execution test:run
                  pnpm quality:boundaries
                  pnpm ci:biome (execution paths)
                  pnpm check:documentation-drift
```

#### Slice 2 — Definition of Done (closed rows)

| Row | Criterion | Slice 2 result |
| --- | --- | --- |
| DoD 1 | Publish service + job exist | **Pass** |
| DoD 2 | Unit test dispatches ≥1 event | **Pass** — `outbox-publish.test.ts` |
| DoD 4 | `pnpm quality:boundaries` | **Pass** — no `@afenda/database` edge |
| DoD 5 | Execution typecheck | **Pass** |
| DoD 11 | No accounting logic | **Pass** |
| DoD 12 | Completion report | **Pass** — afenda-coding-session §11 |

#### Slice 2 — Follow-on (Slice 3 / ERP)

| Item | Owner | Notes |
| --- | --- | --- |
| `OutboxPersistencePort` Drizzle adapter | `@afenda/erp` or `@afenda/database` consumer | Implements claim/mark SQL against `outbox_events` |
| Trigger.dev task wiring | ERP deployment | Calls `runPublishOutboxEventsJob` on schedule |

**Prerequisite:** Slice 1 merged (outbox table exists). **Satisfied.**

### Slice 3 — ERP integration test (`@afenda/erp`)

**Status:** Delivered (2026-06-23)  
**Prerequisite:** Slice 2 runtime evidence — `packages/execution/src/services/outbox-publish.service.ts` delivered; Slices 1–2 gates pass. **Satisfied.**

#### Design (internal-guide)

- **`OutboxPersistencePort` Drizzle adapter** lives in `@afenda/erp` — `@afenda/execution` must not import `@afenda/database`.
- **`enqueueOutboxEvent`** enforces tenant + company + correlation at the ERP write boundary (matches acceptance criteria).
- **Integration tests** use in-memory persistence for CI; optional live-DB suite skipped without `DATABASE_URL`.
- **`createApiHandler` path** proven via workspace dashboard PUT contract + `assertRoutePermission` — no inline tenant resolvers.
- **Dependency:** add approved `@afenda/erp` → `@afenda/execution` edge in dependency registry.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-011-execution-foundation.md (Slice 3)

1. Objective    — Prove protected mutation → outbox row → publish worker dispatch with tenant isolation
                  and authorization denial tests; wire ERP outbox enqueue + Drizzle persistence adapter.
2. Allowed layer— apps/erp/src/lib/outbox/; apps/erp/src/__tests__/; apps/erp/package.json;
                  docs/architecture/dependency-registry.md; docs/ (§9 evidence only)
3. Files        — apps/erp/src/lib/outbox/enqueue-outbox-event.server.ts (New)
                  apps/erp/src/lib/outbox/drizzle-outbox-persistence.adapter.ts (New)
                  apps/erp/src/lib/outbox/in-memory-outbox-persistence.ts (New)
                  apps/erp/src/lib/outbox/commit-workspace-dashboard-mutation.server.ts (New)
                  apps/erp/src/__tests__/outbox-mutation.integration.test.ts (New)
                  apps/erp/package.json (Modified — @afenda/execution dependency)
                  docs/architecture/dependency-registry.md (Modified — erp → execution edge)
                  docs/delivery/tips/[Partially Implemented] tip-011-execution-foundation.md (Modified — §9)
                  docs/delivery/tip-status-index.md (Modified — §9)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — §9)
4. Prohibited   — @afenda/accounting, packages/ui, packages/ui/appshell, hand-edited SQL migrations,
                  inline tenant/company lookup (use resolveOperatingContext / operating context fixtures),
                  packages/execution or packages/database schema changes (Slices 1–2 closed)
5. Authority    — ADR-0001 Platform Authority (TIP-011) — Application Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm quality:boundaries
                  pnpm biome ci apps/erp/src/lib/outbox apps/erp/src/__tests__/outbox-mutation.integration.test.ts
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate | Slice 3 result |
|---|-----------|------|----------------|
| 3 | ERP integration test passes | `pnpm --filter @afenda/erp test:run` | **Pass** — 4 tests in `outbox-mutation.integration.test.ts` |
| 10 | Delivery doc + matrix in sync | `pnpm check:documentation-drift` | **Pass** |
| 12 | Completion report posted | afenda-coding-session §11 | **Pass** |

**Prerequisite:** Slices 1–2 merged. **Satisfied.**

### Slice 4 — Trigger.dev production deploy (`@afenda/execution`)

**Status:** Delivered (2026-06-23)  
**Prerequisite:** Slices 1–3 merged; `TRIGGER_PROJECT_REF`, `TRIGGER_SECRET_KEY`, `TRIGGER_API_URL` configured in `.env.config`/`.env.secret` and synced to `packages/execution/.env`. **Satisfied.**

| Artifact | Evidence |
| --- | --- |
| SDK + CLI pin | `@trigger.dev/sdk` and `trigger.dev` **4.4.6** in `packages/execution/package.json` (catalog pin incompatible with deploy CLI) |
| Worker config | `packages/execution/trigger.config.ts` — `maxDuration: 3600`, `project: TRIGGER_PROJECT_REF` |
| Deploy gate | `pnpm --filter @afenda/execution trigger:deploy` — prod worker version **20260623.1** |
| Scheduled task | `foundation.publish-outbox-events` — cron `*/5 * * * *` via `createPublishOutboxEventsScheduleDefinition()` |

#### Slice 4 — Definition of Done (closed rows)

| Row | Criterion | Slice 4 result |
| --- | --- | --- |
| DoD 13 | Prod worker deployed | **Pass** — version **20260623.1** |
| DoD 10 | Delivery doc + matrix in sync | **Pass** — this closeout PR |
| DoD 12 | Completion report | **Pass** — documentation-drift session |

### Post-implementation doc updates (all slices)

After any slice changes TIP status, update in the **same PR**:

1. [`tip-011-execution-foundation.md`](tip-011-execution-foundation.md) — Runtime evidence + DoD checkboxes
2. [`tip-status-index.md`](tip-status-index.md) — if status changes
3. [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) — Execution / Jobs row
4. Run `pnpm check:documentation-drift`

**Blocks downstream:** [TIP-012 Handoff — Slice 2](tip-012-erp-operating-spine.md#handoff-to-implementation) requires TIP-011 Slice 2 complete.

## Verdict

**Complete** — Outbox schema (Slice 1), publish worker (Slice 2), ERP integration proof (Slice 3), and Trigger.dev prod deploy (Slice 4) delivered. Prod worker **20260623.1** runs task `foundation.publish-outbox-events` on schedule. Production route spine wiring remains [TIP-012](tip-012-erp-operating-spine.md) scope.
