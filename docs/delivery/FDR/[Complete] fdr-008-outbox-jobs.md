# fdr-008-outbox-jobs — Outbox Jobs

| Field | Value |
| --- | --- |
| **Status** | Complete — enterprise 9.5 accepted |
| **FDR ID** | `fdr-008-outbox-jobs` |
| **Registry entry ID** | `PKG008_EXECUTION` |
| **Package** | `@afenda/execution` (PKG-008) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Integration |
| **Risk class** | Medium |
| **BRD reference** | internal — durable outbox publish + Trigger.dev worker |
| **Enterprise readiness** | **29/30 — enterprise 9.5 accepted** (DoD #14 peer review closed 2026-06-25; §Waivers reconfirmed) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | AIF / RFC · Oracle AQ |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts).

| Field | Value |
| --- | --- |
| id | `PKG008_EXECUTION` |
| packageId | PKG-008 |
| domain | `outbox-jobs` |
| lane | green-lane |
| runtimeOwner | `packages/execution` |
| gates | `pnpm --filter @afenda/execution typecheck`; `pnpm --filter @afenda/execution test:run` |
| prohibited | `do-not-create-accounting-package`; `do-not-bypass-outbox-for-mutations` |
| allowedAgents | `execution-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/execution` (PKG-008) | Durable execution registry, Trigger.dev provider, outbox publish worker | `packages/execution/src/` |
| `@afenda/database` (PKG-003) | Outbox + execution_runs persistence (read-only in Research) | `packages/database/src/schema/outbox.schema.ts` |
| `@afenda/observability` (PKG-013) | Audit/logging adapters on execution paths (read-only in Research) | `packages/observability/` |
| `apps/erp` (PKG-007) | ERP outbox adapter + enqueue integration (read-only in Research) | `apps/erp/src/lib/outbox/` |

## Purpose

Lock and maintain the governed outbox publish pipeline — database outbox rows → `@afenda/execution` publish worker → Trigger.dev scheduled task — so protected ERP mutations enqueue durable events without bypassing tenant scope, retry policy, or execution registry contracts.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-011-execution-foundation.md`](../../delivery/tips/[Complete]%20tip-011-execution-foundation.md).

## Scope

**In scope**

- `packages/execution/src/services/outbox-publish.service.ts` — claim, dispatch, mark published/failed/dead-letter
- `packages/execution/src/jobs/publish-outbox-events.job.ts` — workflow registration, cron schedule, batch runner
- `packages/execution/src/providers/trigger.provider.ts` — Trigger.dev task wiring (`foundation.publish-outbox-events`)
- `packages/execution/src/contracts/outbox-event.contract.ts` — envelope, persistence port, tenant scope guards
- Outbox publish, retry, registry, and trigger isolation tests under `packages/execution/src/__tests__/`
- FDR-aligned reconciliation of archive tip-011 + runtime matrix **implemented** claims vs FDR **Not started** status

**Out of scope**

- Business workflow orchestration beyond outbox publish (future domain FDRs)
- Accounting event consumers and domain posting (ADR-0010)
- Direct mutation paths that bypass outbox enqueue (`do-not-bypass-outbox-for-mutations`)
- Hand-editing Trigger.dev production env without documented rollback

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate outbox workflow IDs or cron presets outside `publish-outbox-events.job.ts` |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-008 | **Sequential** with `fdr-013-logging-tracing` when touching shared observability adapters |
| Database schema | Outbox schema owned by `@afenda/database` — execution FDR may not hand-edit migrations |
| Implementation blocked until | Research Slice 1 complete; archive tip-011 reconciled with matrix row |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 = Research only — no `packages/` or `apps/` edits.  
> TIP archive / runtime matrix may show prior work — that is **not** FDR delivery status until Research reconciles evidence grades.

### Baseline gate log (2026-06-25 — manifest-nav v2 audit)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/execution typecheck` | 0 | A |
| `pnpm --filter @afenda/execution test:run` | 0 | A (45 tests: outbox-publish 9, trigger-deployment 5, retry-policy 4, trigger-isolation 2) |
| `pnpm exec biome check packages/execution` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

### Discovery questions

| Question | Expected answer source |
| --- | --- |
| Does runtime matrix **implemented** match live gate output for `@afenda/execution`? | **Yes** — typecheck + test:run exit 0 (45 tests) | Baseline gate log above |
| Is prod Trigger.dev worker aligned with `PUBLISH_OUTBOX_EVENTS_TRIGGER_TASK_ID`? | `trigger.config.ts`; archive tip-011 Slice 4 attestation |
| Does ERP outbox adapter enforce tenant scope on claim/dispatch? | `apps/erp/src/lib/outbox/` + integration tests |
| Are outbox workflow IDs stable across registry + Trigger task registration? | `publish-outbox-events.job.ts`; `execution-registry.ts` |
| Which upstream FDRs block promotion beyond green-lane maintain? | `fdr-status-index.md` PKG-008 rows; ADR-0010 accounting prohibition |

### Files to inspect

| Path | Why |
| --- | --- |
| `packages/execution/src/services/outbox-publish.service.ts` | Outbox publish worker core |
| `packages/execution/src/jobs/publish-outbox-events.job.ts` | Workflow + cron constants |
| `packages/execution/src/providers/trigger.provider.ts` | Trigger.dev provider isolation |
| `packages/execution/src/contracts/outbox-event.contract.ts` | Outbox envelope + tenant scope |
| `packages/execution/src/__tests__/outbox-publish.test.ts` | Publish service behaviour |
| `packages/execution/trigger.config.ts` | Worker deploy configuration |
| `packages/database/src/schema/outbox.schema.ts` | Persistence schema |
| `apps/erp/src/lib/outbox/enqueue-outbox-event.server.ts` | ERP enqueue path |
| `apps/erp/src/lib/outbox/drizzle-outbox-persistence.adapter.ts` | ERP persistence adapter |
| `apps/erp/src/lib/outbox/__tests__/enqueue-outbox-event.test.ts` | ERP enqueue tests |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Execution / Jobs row |

### Skills to read

- `enterprise-erp-standards` — §8 `outbox-jobs` controls (AIF / Oracle AQ)
- `write-fdr` — 25-section template; no handoff blocks in §Slices

## Runtime evidence (2026-06-25 — Research Slice 1 attested)

| Artifact | Path | Proven |
| --- | --- | --- |
| Execution public API | `packages/execution/src/index.ts` | Yes — Grade A (`typecheck` exit 0) |
| Outbox publish service | `packages/execution/src/services/outbox-publish.service.ts` | Yes — Grade A (`outbox-publish.test.ts` batch audit + publish tests) |
| Publish outbox job | `packages/execution/src/jobs/publish-outbox-events.job.ts` | Yes — Grade A (`trigger-deployment.test.ts` 5 tests) |
| Trigger.dev provider | `packages/execution/src/providers/trigger.provider.ts` | Yes — Grade A (`trigger-isolation.test.ts` 2 tests) |
| Outbox event contract | `packages/execution/src/contracts/outbox-event.contract.ts` | Yes — Grade A (`execution-vocabulary.test.ts` 4 tests) |
| Outbox publish tests | `packages/execution/src/__tests__/outbox-publish.test.ts` | Yes — Grade A (`test:run` exit 0) |
| Trigger isolation tests | `packages/execution/src/__tests__/trigger-isolation.test.ts` | Yes — Grade A (`test:run` exit 0) |
| Database outbox schema | `packages/database/src/schema/outbox.schema.ts` | Yes — Grade B (registry evidence + matrix) |
| ERP outbox adapter | `apps/erp/src/lib/outbox/drizzle-outbox-persistence.adapter.ts` | Yes — Grade B (archive tip-011 + ERP enqueue tests) |
| ERP enqueue | `apps/erp/src/lib/outbox/enqueue-outbox-event.server.ts` | Yes — Grade B (archive tip-011) |
| Trigger worker deploy | `packages/execution/trigger.config.ts` | Yes — Grade B (prod worker **20260623.1** per matrix) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| ~~`outbox-fdr-peer-review`~~ | ~~DoD #14 peer review open~~ | green | Architecture Authority | **Closed 2026-06-25** | Slice 4 Complete promotion |
| `outbox-observability-dim` | ~~Observability dimension 3/5~~ — batch-completion audit on `outbox-publish.service.ts` | green | Slice 2 | **Closed 2026-06-25** | Observability dim ≥4/5 |
| ~~`outbox-matrix-fdr-sync`~~ | ~~Matrix Execution / Jobs row link updated to Partially Implemented FDR~~ | green | Evidence-sync | **Closed 2026-06-25** | Index + matrix link synced Slice 3 |

## §Enterprise readiness score

> **Complete — enterprise 9.5 accepted (2026-06-25):** DoD #14 peer review closed; §Waivers reconfirmed at promotion. Readiness **29/30** ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row. Where waivers or open DoD rows cap a dimension, the **audit-adjusted** score is used for the honest total.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + `outbox-event.contract.ts` + `execution-vocabulary.test.ts` — Grade A | — |
| Test coverage | 5/5 | `test:run` exit 0 (48 tests) — Grade A | Slice 3 gate log re-run |
| Observability + audit | 4/5 | `outbox-publish.service.ts` batch-completion audit via optional `auditAdapter` + `outbox-publish.test.ts` — Grade A | ERP dispatch mutation audit deferred to `fdr-013-audit-coverage` |
| Security + RBAC + RLS | 5/5 | `assertOutboxRecordTenantScope` + `outbox-publish.test.ts` tenant/retry/dead-letter — Grade A | — |
| Documentation + BRD traceability | 5/5 | FDR Complete + matrix + index + `check:documentation-drift` exit 0 — Grade A | DoD #14 peer review closed 2026-06-25 |
| Maintainability + Clean Core | 5/5 | PKG gates + `biome check packages/execution` + `quality:boundaries` exit 0; Clean Core A — Grade A | — |
| **Total (audit-adjusted)** | **29/30** | **Complete — enterprise 9.5 accepted** (~9.7 / 10 equivalent) | DoD #14 closed 2026-06-25 |
| **Total (evidence-qualified ceiling)** | **29/30** | Matches audit-adjusted — waivers reconfirmed | Complete |

### Slice 3 gate log (Evidence-sync — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/execution typecheck` | 0 | A |
| `pnpm --filter @afenda/execution test:run` | 0 | A (48 tests; 9 files) |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — outbox publish at `@afenda/execution` registry boundary; workflow IDs owned in `publish-outbox-events.job.ts`; persistence via declared `OutboxPersistencePort` only.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` | `runPublishOutboxEventsJob`, `createOutboxPublishService`, outbox contracts | No | A→A |
| `@afenda/observability` | Audit adapters on dispatch path | No | A→A |
| `@afenda/database` | Outbox schema (upstream persistence) | No | A→A |
| Future domain packages | `OutboxEventEnvelope`, enqueue via ERP adapter only | No | A→A |

**ERP giant compatibility (Research to confirm):**

- **Batch scale:** `publishBatch` accepts `limit` — default batch size must be documented in Research gate log.
- **Worker alignment:** `evaluateWorkerReleaseAlignment` guards prod deploy drift.
- **Retry policy:** `DEFAULT_RETRY_POLICY` + dead-letter path in publish service.
- **Tenant isolation:** Cross-tenant negative test cited in archive tip-011 Slice 3.

Upstream consumers scan: `apps/erp/src/lib/outbox/` is the only approved ERP integration surface. No package may import `packages/execution/src/services/` privately without dependency-registry entry.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| AIF / RFC | Oracle AQ | `pnpm --filter @afenda/execution test:run` | 2 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/execution typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-011.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Protected mutation enqueues outbox row with tenant scope | 17 | ERP enqueue tests |
| internal | Publish worker claims pending rows and dispatches without bypass | 2 | `outbox-publish.test.ts` |
| internal | Failed dispatch retries per policy then dead-letters | 17 | retry-policy tests |
| tip-011 (archive) | Trigger.dev prod worker runs `foundation.publish-outbox-events` | 1 | `trigger-deployment.test.ts` |
| internal | Cross-tenant outbox row not dispatchable under wrong tenant | 17 | tip-011 integration test path |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Pending rows published; failed rows retried or dead-lettered | `outbox-publish.test.ts` |
| Performance efficiency | Batch publish bounded by `limit`; cron every 5 minutes | `PUBLISH_OUTBOX_EVENTS_CRON` constant + service tests |
| Compatibility | Outbox envelope version stable (`OUTBOX_EVENT_VERSION`) | `execution-vocabulary.test.ts` |
| Security | Tenant scope enforced on claim and dispatch | `assertOutboxRecordTenantScope`; cross-tenant test |
| Maintainability | Strict typecheck; biome clean on PKG-008 | `typecheck`; `pnpm exec biome check packages/execution` |
| Reliability | Retry policy + dead-letter; worker release alignment | `retry-policy.test.ts`; `worker-release-alignment.ts` |
| Documentation | Index + matrix aligned with FDR evidence | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Outbox enqueue (ERP mutation path) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |
| Outbox publish worker (system) | N/A — scheduled system actor | `PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID` as `lockedBy` default |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-008-outbox-jobs**
- Registry: `PKG008_EXECUTION` read-only snapshot in §Registry link
- Upstream: `@afenda/database` outbox schema (PKG-003) — platform persistence authority
- Upstream: `@afenda/kernel` execution context contracts (PKG-010)
- Sibling observability: `fdr-013-logging-tracing`, `fdr-013-audit-coverage` — sequential when touching audit adapters
- Archive evidence: [`tip-011-execution-foundation.md`](../../delivery/tips/[Complete]%20tip-011-execution-foundation.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-008-outbox-jobs.md` | — | Modified per slice |
| `packages/execution/src/services/outbox-publish.service.ts` | `@afenda/execution` | Modified (Implementation slices only) |
| `packages/execution/src/jobs/publish-outbox-events.job.ts` | `@afenda/execution` | Modified (Implementation slices only) |
| `packages/execution/src/providers/trigger.provider.ts` | `@afenda/execution` | Modified (Implementation slices only) |
| `packages/execution/src/contracts/outbox-event.contract.ts` | `@afenda/execution` | Modified (Implementation slices only) |
| `packages/execution/src/__tests__/outbox-publish.test.ts` | `@afenda/execution` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm --filter @afenda/execution typecheck`
- `pnpm --filter @afenda/execution test:run`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Governed outbox publish worker

  Scenario: Pending outbox row is claimed and published
    GIVEN an outbox row with status "pending" and valid tenant scope
    AND the OutboxPersistencePort returns the row on claim
    AND the OutboxEventDispatcher accepts the envelope
    WHEN runPublishOutboxEventsJob executes with default lockedBy
    THEN the row status becomes "published"
    AND the dispatch result records success
    AND no row is published without passing validateOutboxPayload

  Scenario: Failed dispatch retries before dead-letter
    GIVEN an outbox row that fails dispatch on first attempt
    AND retry policy allows one more attempt
    WHEN publishBatch processes the row
    THEN the row is released and re-queued for retry
    AND after max attempts the row is marked dead-letter

  Scenario: Cross-tenant outbox row is not dispatchable
    GIVEN an outbox row scoped to tenant A
    WHEN publishBatch runs with tenantId filter for tenant B
    THEN tenant A row is not claimed
    AND no dispatch occurs for tenant A envelope under tenant B scope

  Scenario: Trigger.dev scheduled task matches registry workflow ID
    GIVEN PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID is "foundation.publish-outbox-events"
    WHEN registerPublishOutboxEventsWorkflow registers with execution registry
    THEN triggerTaskId matches PUBLISH_OUTBOX_EVENTS_TRIGGER_TASK_ID
    AND cron schedule matches PUBLISH_OUTBOX_EVENTS_CRON
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/execution test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/execution typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/execution` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix Execution / Jobs row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [x] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | cross-tenant / dead-letter tests | [x] |
| 18 | Public API compatibility verified | `packages/execution/src/index.ts` export surface stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score (audit-adjusted + ceiling) | [x] |

## Slices

### Slice 1 — Research (outbox-jobs)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Medium  
**Clean Core impact:** A→A

**Purpose:** Reconcile archive tip-011 + runtime matrix **implemented** claims with FDR **Not started**; run PKG-008 baseline gates; map execution → database → ERP outbox paths; update §Remaining gaps, §Runtime evidence, and §Enterprise readiness score. No source edits.

**Deliverables / gaps closed:**

- Baseline gate log in §Research (typecheck, test:run, boundaries, drift) — **closed**
- Gaps `fdr-research-slice-1`, `outbox-fdr-gate-attestation`, `outbox-fdr-status-promotion` — **closed**
- Status promoted: **Partially Implemented**
- Readiness score: **26/30 audit-adjusted** · **28/30 evidence-qualified ceiling**

### Slice 2 — Implementation (outbox pipeline closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** A→A

#### Design (internal-guide)

Research Slice 1 attested all PKG-008 gates exit 0 (45 tests, typecheck, boundaries, drift). The remaining **audit-adjusted** blocker is observability dimension **3/5**: ERP dispatch logging is Grade B at `apps/erp/src/lib/outbox/logging-outbox-dispatcher.server.ts`, while `@afenda/execution` publish batch completion has no governed audit evidence (unlike `execution.service.ts` which wires `withAuditEvidence` from `@afenda/observability`).

This slice closes observability within **`packages/execution` only**: add optional `auditAdapter` on `OutboxPublishServiceDependencies`, define outbox publish audit action vocabulary, emit batch-completion audit rows after successful `publishBatch`, and prove via unit tests. Trigger registry constants (`PUBLISH_OUTBOX_EVENTS_*`) already align — harden with regression assertions in existing deployment tests only if a drift is found during implementation.

**Backward compatibility:** `auditAdapter` is optional; existing `createOutboxPublishService({ dispatcher, persistence })` call sites unchanged. No public export removals.

Matrix/index doc sync (`outbox-matrix-fdr-sync`) and §Enterprise readiness score recalculation defer to **Slice 3 Evidence-sync** — not in this slice's §3 Files.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-008-outbox-jobs.md

1. Objective    — Wire governed batch-completion audit evidence on outbox publish service; prove observability dim ≥4/5 within PKG-008; run full acceptance gates exit 0.
2. Allowed layer— packages/execution/src/services/; packages/execution/src/jobs/; packages/execution/src/providers/; packages/execution/src/contracts/; packages/execution/src/__tests__/; packages/execution/src/index.ts
3. Files        —
   packages/execution/src/contracts/execution.contract.ts
   packages/execution/src/contracts/outbox-event.contract.ts
   packages/execution/src/services/outbox-publish.service.ts
   packages/execution/src/jobs/publish-outbox-events.job.ts
   packages/execution/src/providers/trigger.provider.ts
   packages/execution/src/__tests__/outbox-publish.test.ts
   packages/execution/src/__tests__/trigger-deployment.test.ts
   packages/execution/src/index.ts
   docs/delivery/FDR/[Partially Implemented] fdr-008-outbox-jobs.md
4. Prohibited   — apps/erp/; packages/database/; packages/observability/ source edits; foundation-disposition.registry.ts; hand-edited migrations; do-not-create-accounting-package; do-not-bypass-outbox-for-mutations; duplicate PUBLISH_OUTBOX_EVENTS_* constants outside publish-outbox-events.job.ts
5. Authority    — ADR-0014 · ADR-0016 · PKG008_EXECUTION registry snapshot (§Registry link) · archive tip-011 Slice 2 outbox worker evidence (read-only)
6. Gates        —
   pnpm --filter @afenda/execution typecheck
   pnpm --filter @afenda/execution test:run
   pnpm exec biome check packages/execution
   pnpm quality:boundaries
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap `outbox-observability-dim`; DoD #2 (tests pass); DoD #10 (§11 attestation on delivery); DoD #18 (additive optional auditAdapter only); DoD #20 (observability dim bump — full 29/30 recalc in Slice 3)
8. Evidence     —
   packages/execution/src/services/outbox-publish.service.ts
   packages/execution/src/contracts/execution.contract.ts
   packages/execution/src/__tests__/outbox-publish.test.ts
   packages/execution/src/jobs/publish-outbox-events.job.ts
   packages/execution/src/providers/trigger.provider.ts
9. Attestation  — Observability + audit (batch-completion audit rows via optional adapter); Test coverage (+audit evidence path in outbox-publish.test.ts); Contract stability (additive audit action constants + optional dependency); Security unchanged (tenant scope tests remain authoritative)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 2 | Tests pass | `pnpm --filter @afenda/execution test:run` |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 on delivery |
| 18 | Public API compatibility verified | optional `auditAdapter?` additive only |
| 20 | Enterprise readiness score updated | observability dim 3→4 in §Enterprise readiness score (Slice 3 recalc to 29/30) |

#### Known debt

- `outbox-fdr-peer-review` — DoD #14 peer review still open; blocks **Complete** status
- `outbox-matrix-fdr-sync` — deferred to Slice 3 Evidence-sync (matrix + index link)
- Full mutation audit on ERP dispatch paths remains owned by sequential sibling `fdr-013-audit-coverage`

### Slice 3 — Evidence-sync (29/30 closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 2 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Recalculate §Enterprise readiness score after Slice 2 observability evidence; sync runtime matrix Execution / Jobs row FDR link; distinguish **audit-adjusted** vs **evidence-qualified ceiling**. No `packages/` or `apps/` source edits.

**Purpose:** Close gap `outbox-matrix-fdr-sync`; target **29/30 audit-adjusted** if Slice 2 observability dim ≥4/5; label **enterprise 9.5 candidate** — not final Complete until DoD #14.

**Outcomes:**

- Slice 3 gate log attests execution typecheck/test:run, foundation-disposition, documentation-drift — all exit 0
- Readiness promoted: **29/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise 9.5 candidate
- Gap `outbox-matrix-fdr-sync` closed — matrix Execution / Jobs row + fdr-status-index synced
- Complete prefix promotion deferred to DoD #14 peer review at PR merge

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-008-outbox-jobs.md

1. Objective    — Recalculate §Enterprise readiness score to 29/30 audit-adjusted; sync FDR evidence with Slice 3 gate log; sync matrix Execution / Jobs row + fdr-status-index; close gap outbox-matrix-fdr-sync. Do not rename to [Complete] — DoD #14 peer review still open.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-008-outbox-jobs.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts; do-not-create-accounting-package; do-not-bypass-outbox-for-mutations
5. Authority    — ADR-0014 · ADR-0016 · PKG008_EXECUTION · archive tip-011 (read-only)
6. Gates        —
   pnpm --filter @afenda/execution typecheck
   pnpm --filter @afenda/execution test:run
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap outbox-matrix-fdr-sync; DoD #20 (readiness recalc)
8. Evidence     —
   docs/delivery/FDR/[Partially Implemented] fdr-008-outbox-jobs.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
9. Attestation  — Documentation + BRD traceability (matrix/index sync); Enterprise readiness 29/30 audit-adjusted
```

### Slice 4 — Evidence-sync (Complete — enterprise 9.5 accepted)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 3 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

**Purpose:** Record Architecture Authority peer review (DoD #14); reconfirm §Waivers; promote to **Complete — enterprise 9.5 accepted**; sync index and runtime matrix.

**Outcomes (delivered 2026-06-25):**

- Architecture Authority peer review **Approved** (Slice 2 observability + Slice 3 matrix closeout)
- §Waivers reconfirmed at promotion
- Status promoted to **Complete — enterprise 9.5 accepted**
- Gap `outbox-fdr-peer-review` closed
- Final gates: execution typecheck ✓; execution test:run 48 ✓; documentation-drift ✓; foundation-disposition ✓

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Complete] fdr-008-outbox-jobs.md

1. Objective    — Close DoD #14; promote fdr-008-outbox-jobs to Complete — enterprise 9.5 accepted at 29/30.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Complete] fdr-008-outbox-jobs.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts
5. Authority    — Architecture Authority peer review attestation · ADR-0016 · PKG008_EXECUTION
6. Gates        —
   pnpm --filter @afenda/execution typecheck
   pnpm --filter @afenda/execution test:run
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap outbox-fdr-peer-review; DoD #14; DoD #7; DoD #8 (index)
8. Evidence     — §Peer review attestation; final gate log below
9. Attestation  — Documentation 5/5; Enterprise readiness 29/30 accepted
```

### Final acceptance gate log (Complete promotion — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/execution typecheck` | 0 | A |
| `pnpm --filter @afenda/execution test:run` | 0 | A (48 tests; 9 files) |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert `@afenda/execution` commit; redeploy prior Trigger.dev worker version | Quarterly-release-safe; git revert + `trigger:deploy` with prior release ID |
| Trigger prod deploy | Roll back to worker release **20260623.1** or prior documented snapshot | `verify-outbox-worker-release.server.ts` alignment check |

Oracle analog: confirm upgrade-safe — no internal object modifications outside `runtimeOwner`. SAP analog: transport rollback = git revert + gate re-run + worker release alignment.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `outbox-fdr-archive-authority` | FDR status lags archive tip-011 Complete | Matrix marks **implemented**; FDR delivery authority starts at Research Slice 1 | Architecture Authority (doc upgrade) | **Closed 2026-06-25** — Partially Implemented |
| `outbox-fdr-e2e` | Browser E2E for outbox worker | Unit + integration tests prove pipeline per tip-011 | Architecture Authority | External beta go-live |

## §Knowledge transfer

### Operational runbook

- Outbox publish entry: `packages/execution/src/services/outbox-publish.service.ts` — `publishBatch(input)`
- Job runner: `packages/execution/src/jobs/publish-outbox-events.job.ts` — `runPublishOutboxEventsJob`
- Trigger task ID: `foundation.publish-outbox-events` (`PUBLISH_OUTBOX_EVENTS_TRIGGER_TASK_ID`)
- Cron: `*/5 * * * *` (`PUBLISH_OUTBOX_EVENTS_CRON`)
- ERP enqueue: `apps/erp/src/lib/outbox/enqueue-outbox-event.server.ts`
- ERP persistence adapter: `apps/erp/src/lib/outbox/drizzle-outbox-persistence.adapter.ts`
- Worker release check: `apps/erp/src/lib/outbox/verify-outbox-worker-release.server.ts`

### Observability

- Dispatch logging: `apps/erp/src/lib/outbox/logging-outbox-dispatcher.server.ts`
- Batch-completion audit: `packages/execution/src/services/outbox-publish.service.ts` (`OUTBOX_AUDIT_ACTIONS.OUTBOX_BATCH_COMPLETED` via optional `auditAdapter`)
- Execution spine diagnostics: `apps/erp/src/lib/outbox/execution-spine-diagnostics.server.ts`
- Full mutation audit coverage: deferred to `fdr-013-audit-coverage`

### On-call escalation

- Symptom: outbox rows stuck pending → check Trigger.dev worker health + `verify-outbox-worker-release`; run `outbox-publish.test.ts`
- Symptom: dead-letter accumulation → inspect retry policy + dispatcher errors in observability logs
- Owner: `@afenda/execution` (PKG-008) via `execution-agent`

## §Peer review attestation

| Field | Value |
| --- | --- |
| **Decision** | Approved |
| **Date** | 2026-06-25 |
| **Reviewer** | Architecture Authority |
| **Scope** | Slice 2 batch-completion audit on `outbox-publish.service.ts`; Slice 3 matrix/index sync; PKG-008 gate evidence |
| **Finding** | Outbox publish pipeline proven at Grade A: optional `auditAdapter` additive only; tenant scope tests authoritative; Trigger.dev worker **20260623.1** aligned. No accounting runtime leakage; Clean Core A maintained. |
| **Boundary** | Acceptable — PKG-008 `runtimeOwner` only; ERP dispatch mutation audit deferred to `fdr-013-audit-coverage` per waiver scope. |
| **Gate evidence** | `@afenda/execution typecheck` exit 0; `test:run` 48 pass; `check:documentation-drift` exit 0 |
| **DoD #14** | `[x]` |

## §Enterprise benchmark qualification

This FDR is **Complete — enterprise 9.5 accepted** at **29/30** with DoD #14 peer review closed and §Waivers reconfirmed (2026-06-25).

Accepted score composition:

1. Browser E2E waived until external beta go-live (`outbox-fdr-e2e`) — Observability ERP dispatch audit sibling-owned (`fdr-013-audit-coverage`).
2. Runtime matrix **Execution / Jobs** = **implemented**; FDR delivery **Complete** at 29/30.
3. **Complete** status attested — Architecture Authority peer review closed Slice 4.

**G0–G10 gate summary:** G0–G2 PASS · G3 PASS · G4 PASS · G5 PASS · G6 PASS · G7 PASS · G8 PASS (48 tests) · G9 PASS (observability dim 4/5) · G10 PASS.

## Verdict

**Complete — enterprise 9.5 accepted at 29/30 (2026-06-25).**

Research Slice 1 complete. Slice 2 complete — batch-completion audit on `outbox-publish.service.ts`. Slice 3 Evidence-sync complete — matrix/index synced. Slice 4 Complete promotion — DoD #14 peer review approved; §Waivers reconfirmed. Full mutation audit on ERP dispatch paths remains owned by sequential sibling `fdr-013-audit-coverage`.
