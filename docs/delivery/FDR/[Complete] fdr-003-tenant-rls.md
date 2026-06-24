# fdr-003-tenant-rls — Tenant RLS

| Field | Value |
| --- | --- |
| **Status** | Complete — enterprise 9.5 accepted |
| **FDR ID** | `fdr-003-tenant-rls` |
| **Registry entry ID** | `PKG003_DATABASE` |
| **Package** | `@afenda/database` (PKG-003) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **CEMLI class** | Extension — RLS policy registry + governance gates (no core schema ownership change) |
| **Risk class** | Medium |
| **BRD reference** | internal — tenant isolation / defense-in-depth |
| **Enterprise readiness** | **29/30 — enterprise 9.5 accepted** (DoD #14 peer review closed 2026-06-25; §Waivers reconfirmed) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SAP HANA RLS · Oracle Data Security · SAP GRC tenant scope |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `persistence`; this FDR scopes the **tenant-rls** subdomain on the same `PKG003_DATABASE` entry.

| Field | Value |
| --- | --- |
| id | `PKG003_DATABASE` |
| packageId | PKG-003 |
| domain | `persistence` (FDR subdomain: `tenant-rls`) |
| lane | green-lane |
| runtimeOwner | `packages/database` |
| gates | `pnpm --filter @afenda/database typecheck`; `pnpm quality:migrations`; `pnpm check:database-tenant-rls-coverage` |
| prohibited | `do-not-create-accounting-package`; `do-not-hand-edit-migrations`; `do-not-add-accounting-schema-without-adr` |
| allowedAgents | `database-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/database` (PKG-003) | Tenant RLS registry, schema parity, live apply probes, session context bridge | `packages/database/src/rls/` |
| `@afenda/kernel` (PKG-010) | Upstream operating context (read-only in Research) | `packages/kernel/src/context/` |
| `scripts/governance/` | Artifact + live RLS coverage gates (repo root) | `scripts/governance/check-database-tenant-rls-*.mts` |

## Purpose

Lock and maintain the unified tenant Row-Level Security (RLS) registry — canonical policy rows, Drizzle schema parity, migration SQL alignment, and live Postgres apply proof — so every `tenant_id` table has defense-in-depth isolation enforced at the database layer without duplicated policy strings or hand-edited migrations.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-007-012-enterprise-group-operating-context.md`](../../delivery/tips/[Complete]%20tip-007-012-enterprise-group-operating-context.md) Slices F–I.

## Scope

**In scope**

- `packages/database/src/rls/tenant-rls-coverage.contract.ts` — canonical `TENANT_RLS_ISOLATION_POLICIES` registry
- `packages/database/src/rls/tenant-rls-schema-parity.contract.ts` — Drizzle `tenant_id` table ↔ registry alignment
- `packages/database/src/rls/tenant-rls-registry-invariants.contract.ts` — 1:1 table count, duplicate rejection, `TenantRlsPolicyKind` rules (`memberships` = sole `actor_isolation`)
- `packages/database/src/rls/tenant-rls-live-probe.contract.ts` + `tenant-rls-migration-live-probe.contract.ts` — live SQL builders (no duplicate policy strings in gate scripts)
- `packages/database/src/rls/verify-tenant-rls-live.server.ts` — `pg_policies` + `pg_class.relrowsecurity` probe
- `packages/database/src/rls/with-rls-session-context.ts` + `rls-session-context.contract.ts` — Drizzle transaction session variables for RLS fallback
- Governance gates: `pnpm check:database-tenant-rls-coverage`; `pnpm check:database-tenant-rls-live`
- RLS contract and gate tests under `packages/database/src/rls/__tests__/` and `scripts/governance/__tests__/`

**Out of scope**

- Drizzle schema barrels, migration pipeline, seeds (`fdr-003-persistence` — sequential prerequisite)
- Accounting table RLS without ADR (ADR-0010 + accounting FDR authority)
- Application RBAC enforcement (owned by `@afenda/permissions` / ERP API layer — RLS is defense-in-depth)
- Supabase JWT claim authoring (session bridge only when JWT claims absent)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate RLS policy names or table lists outside `tenant-rls-coverage.contract.ts` |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-003 | **Sequential** with `fdr-003-persistence` — same `runtimeOwner`; orchestrator must not run both Implementation slices concurrently |
| Implementation blocked until | Research Slice 1 complete; `fdr-003-persistence` Research complete or schema/migration baseline waived for RLS-only closeout |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-007-012 Slices F–I + runtime matrix **implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does `TENANT_RLS_ISOLATION_POLICIES` cover every Drizzle `tenant_id` table? | **Yes** | `pnpm check:database-tenant-rls-coverage` exit 0; `tenant-rls-schema-parity.contract.test.ts` |
| Do RLS migration tags pass artifact and live probes? | **Yes** | Journal through `20260624115705_tenant_commercial_plans_rls`; live gate exit 0 |
| Are registry invariants satisfied? | **Yes** | `tenant-rls-registry-invariants.contract.test.ts` (4 tests) |
| Do coverage + live gates exit 0 locally? | **Yes** | Baseline gate log below |
| Archive tip-007-012 vs FDR delivery lag? | **Reconciled** — matrix **implemented**; FDR promoted **Partially Implemented** |
| Is `fdr-003-persistence` hard prerequisite for Slice 2? | **No for RLS-only closeout** — waiver `tenant-rls-persistence-prereq`; new `tenant_id` tables need persistence coordination |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:database-tenant-rls-coverage` | 0 | A |
| `pnpm check:database-tenant-rls-live` | 0 | A |
| `pnpm --filter @afenda/database typecheck` | 0 | A |
| `pnpm --filter @afenda/database test:run` | 0 | A (164 tests; 8 RLS test files) |
| `pnpm quality:migrations` | 0 | A (27 entries) |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

### Files to inspect

| Path | Why |
| --- | --- |
| `packages/database/src/rls/tenant-rls-coverage.contract.ts` | Canonical policy registry |
| `packages/database/src/rls/tenant-rls-schema-parity.contract.ts` | Drizzle ↔ registry drift detection |
| `packages/database/src/rls/tenant-rls-registry-invariants.contract.ts` | Registry structural rules |
| `packages/database/src/rls/verify-tenant-rls-live.server.ts` | Live Postgres apply probe |
| `packages/database/src/rls/with-rls-session-context.ts` | Application session bridge |
| `scripts/governance/check-database-tenant-rls-coverage.mts` | Artifact coverage gate |
| `scripts/governance/check-database-tenant-rls-live.mts` | Live apply gate |
| `packages/database/src/migrations/` | RLS migration SQL tags |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | RLS / DB isolation row |
| [`fdr-003-persistence`](%5BNot%20started%5D%20fdr-003-persistence.md) | Sequential sibling FDR |

### Skills to read

- `enterprise-erp-standards` — §8 persistence / tenant isolation controls
- `multi-tenancy-erp` — RLS + operating context patterns
- `afenda-drizzle-migration` — migration governance (no hand-edited SQL)

### Expected outputs

- Updated §Remaining gaps with bounded gap IDs
- Updated §Runtime evidence table with evidence grades (A–E)
- Recalculated §Enterprise readiness score
- Status promotion to **Partially Implemented** if archive runtime reconciled
- Slice 2 placeholder unblocked (handoff authored by `fdr-slice-author`)

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven | Grade |
| --- | --- | --- | --- |
| RLS coverage registry | `packages/database/src/rls/tenant-rls-coverage.contract.ts` | Yes | A (`check:database-tenant-rls-coverage` exit 0) |
| Schema parity contract | `packages/database/src/rls/tenant-rls-schema-parity.contract.ts` | Yes | A (parity tests + coverage gate) |
| Registry invariants | `packages/database/src/rls/tenant-rls-registry-invariants.contract.ts` | Yes | A (4 tests exit 0) |
| Live probe server | `packages/database/src/rls/verify-tenant-rls-live.server.ts` | Yes | A (`check:database-tenant-rls-live` exit 0) |
| Session context bridge | `packages/database/src/rls/with-rls-session-context.ts` | Yes | B (contract + unit tests) |
| Coverage gate script | `scripts/governance/check-database-tenant-rls-coverage.mts` | Yes | A (exit 0) |
| Live gate script | `scripts/governance/check-database-tenant-rls-live.mts` | Yes | A (exit 0) |
| RLS unit tests | `packages/database/src/rls/__tests__/` (8 files) | Yes | A (`test:run` 169 pass; +schema-parity denial) |
| Gate script tests | `scripts/governance/__tests__/check-database-tenant-rls-*.test.ts` | Yes | A (schema-parity denial mapped to gate output) |
| RLS public exports | `packages/database/src/__tests__/index.test.ts` | Yes | A (DoD #18 — `withRlsSessionContext`, `RLS_SESSION_KEYS`, `RLS_GRANT_SCOPE_TYPES`) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| ~~`tenant-rls-complete-status`~~ | ~~Promotion to Complete blocked on DoD #14 peer review~~ | green | Architecture Authority (PR) | **Closed 2026-06-25** | Slice 4 Complete promotion |
| ~~`tenant-rls-persistence-seq`~~ | Sequential dependency on `fdr-003-persistence` for new `tenant_id` tables — **waiver reconfirmed Slice 2** | green | orchestrator | — | Closed 2026-06-25 — waiver `tenant-rls-persistence-prereq`; new tables still need persistence coordination |
| ~~`tenant-rls-29-closeout`~~ | ~~Enterprise readiness 26/30 audit-adjusted — need 29/30 for 9.5~~ | green | Evidence-sync slice | **Closed 2026-06-25** | 29/30 audit-adjusted; observability waiver reconfirmed |

## §Enterprise readiness score

> **Complete — enterprise 9.5 accepted (2026-06-25):** DoD #14 peer review closed; §Waivers reconfirmed at promotion. Readiness **29/30** ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `tenant-rls-coverage.contract.ts` + `pnpm check:database-tenant-rls-coverage` exit 0 — Grade A | — |
| Test coverage | 5/5 | 8 RLS test files + denial paths; `pnpm --filter @afenda/database test:run` 169 pass — Grade A | Slice 3 gate log re-run |
| Observability + audit | 4/5 | `withRlsSessionContext` + `audit_events` RLS row — Grade B | Waiver `tenant-rls-observability` reconfirmed — no dedicated RLS gate audit emitter |
| Security + RBAC + RLS | 5/5 | coverage + live gates exit 0 — Grade A | — |
| Documentation + BRD traceability | 5/5 | FDR Complete + matrix + index + `check:documentation-drift` exit 0 — Grade A | DoD #14 peer review closed 2026-06-25 |
| Maintainability + Clean Core | 5/5 | Clean Core A; `typecheck` + `quality:migrations` + `quality:boundaries` exit 0 — Grade A | DoD #5 repo-wide biome waived |
| **Total (audit-adjusted)** | **29/30** | **Complete — enterprise 9.5 accepted** (~9.7 / 10 equivalent) | DoD #14 closed 2026-06-25 |
| **Total (evidence-qualified ceiling)** | **29/30** | Matches audit-adjusted — waivers reconfirmed | Complete |

### Slice 3 gate log (Evidence-sync — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:database-tenant-rls-coverage` | 0 | A |
| `pnpm check:database-tenant-rls-live` | 0 | A |
| `pnpm --filter @afenda/database typecheck` | 0 | A |
| `pnpm --filter @afenda/database test:run` | 0 | A (169 pass; 4 skipped) |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — single canonical RLS registry in `tenant-rls-coverage.contract.ts`; governance gates consume contracts only; no duplicated policy strings in scripts.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` | Indirect — DB access via `@afenda/database` + kernel context | No | A→A |
| `@afenda/kernel` | `RlsSessionContext` shape consumed by `withRlsSessionContext` | No | A→A |
| `@afenda/observability` | `audit_events` table covered by RLS completion policies | No | A→A |
| `@afenda/permissions` | Application RBAC primary; RLS defense-in-depth | No | A→A |

**Upstream consumers scan:** ERP server actions and repositories using `@afenda/database` inherit RLS when not on Supabase service role. Adding a new `tenant_id` table requires: Drizzle schema (persistence FDR) → registry row → migration tag → coverage + live gate pass.

**Breaking change assessment:** Public RLS contract exports are additive; changing `TENANT_RLS_ISOLATION_POLICIES` without migration is a breaking gate failure (intentional).

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SAP HANA Row-Level Security | Oracle Data Security | `pnpm check:database-tenant-rls-coverage` | 1, 17 |
| SAP HANA RLS live apply | Oracle data security policies | `pnpm check:database-tenant-rls-live` | 1, 17 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/database typecheck` | 4 |
| CTS / no DDL | Change management | `pnpm quality:migrations` | 3 |
| SAP GRC | Oracle roles / tenant scope | Gherkin §Acceptance criteria | 17 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | §BRD traceability | 2 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-007-012.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | All tenant_id tables have RLS enable + isolation policy in registry | 1, 17 | `pnpm check:database-tenant-rls-coverage` |
| internal | Drizzle schema parity with RLS registry (no orphan tables) | 1 | `tenant-rls-schema-parity.contract.test.ts` |
| internal | Live Postgres policies match registry rows | 17 | `pnpm check:database-tenant-rls-live` |
| internal | memberships actor_isolation is sole actor_isolation policy | 17 | `tenant-rls-registry-invariants.contract.test.ts` |
| tip-007-012 (archive) | Unified tenant RLS registry Slices F–I | 1 | coverage + live gates |
| internal | E2E browser proof for RLS | 19 | §Waivers |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Security | Every `tenant_id` table has RLS + tenant isolation policy; `memberships` has actor isolation | `pnpm check:database-tenant-rls-coverage`; `pnpm check:database-tenant-rls-live` |
| Reliability | Registry invariants fail closed on drift (gate exit non-zero) | `tenant-rls-registry-invariants.contract.test.ts` |
| Compatibility | Schema parity contract catches new Drizzle tables without registry row | `tenant-rls-schema-parity.contract.test.ts` |
| Maintainability | Biome clean; strict typecheck; single canonical policy registry | `pnpm ci:biome`; `pnpm --filter @afenda/database typecheck` |
| Performance efficiency | Live probe batch queries `pg_policies` — no per-row round trips in gate | code review + gate runtime |
| Functional suitability | Session context bridge sets `app.tenant_id` / `app.platform_user_id` for Drizzle transactions | `with-rls-session-context.ts` + tests |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| RLS policy registry (read/gate path) | N/A — no governed mutation in coverage gate | — |
| Migration apply (RLS SQL) | waived — Phase 9 gate; migrations via Drizzle pipeline only | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-003-tenant-rls**
- Registry: `PKG003_DATABASE` read-only snapshot in §Registry link
- **Sequential sibling:** [`fdr-003-persistence`](%5BNot%20started%5D%20fdr-003-persistence.md) — same `runtimeOwner`; orchestrator must serialize Implementation slices
- Upstream: `@afenda/kernel` operating context for `withRlsSessionContext` inputs
- Archive evidence: [`tip-007-012-enterprise-group-operating-context.md`](../../delivery/tips/[Complete]%20tip-007-012-enterprise-group-operating-context.md) Slices F–I

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-003-tenant-rls.md` | — | Modified per slice |
| `packages/database/src/rls/tenant-rls-coverage.contract.ts` | `@afenda/database` | Existing — attested in Research |
| `packages/database/src/rls/tenant-rls-schema-parity.contract.ts` | `@afenda/database` | Existing — attested in Research |
| `packages/database/src/rls/tenant-rls-registry-invariants.contract.ts` | `@afenda/database` | Existing — attested in Research |
| `packages/database/src/rls/tenant-rls-live-probe.contract.ts` | `@afenda/database` | Existing — attested in Research |
| `packages/database/src/rls/tenant-rls-migration-live-probe.contract.ts` | `@afenda/database` | Existing — attested in Research |
| `packages/database/src/rls/verify-tenant-rls-live.server.ts` | `@afenda/database` | Existing — attested in Research |
| `packages/database/src/rls/with-rls-session-context.ts` | `@afenda/database` | Existing — attested in Research |
| `packages/database/src/rls/rls-session-context.contract.ts` | `@afenda/database` | Existing — attested in Research |
| `scripts/governance/check-database-tenant-rls-coverage.mts` | repo governance | Existing — attested in Research |
| `scripts/governance/check-database-tenant-rls-live.mts` | repo governance | Existing — attested in Research |

## Acceptance gate

- `pnpm check:database-tenant-rls-coverage`
- `pnpm check:database-tenant-rls-live`
- `pnpm --filter @afenda/database typecheck`
- `pnpm --filter @afenda/database test:run`
- `pnpm quality:migrations`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Tenant RLS defense-in-depth coverage

  Scenario: All tenant_id tables have RLS policies in the canonical registry
    GIVEN the actor has permission keys resolved from @afenda/permissions
    AND operating context is resolved via resolveOperatingContext()
    AND TENANT_RLS_ISOLATION_POLICIES is the single canonical registry
    WHEN pnpm check:database-tenant-rls-coverage runs
    THEN every registry row has matching migration SQL with ENABLE ROW LEVEL SECURITY
    AND every tenant_isolation policy CREATE is present in the tagged migration file
    AND schema parity reports zero gaps between Drizzle tenant_id tables and the registry

  Scenario: Registry invariants reject invalid policy configurations
    GIVEN the tenant RLS registry lists all isolation policies
    WHEN collectTenantRlsRegistryInvariantViolations runs
    THEN exactly one actor_isolation policy exists for table "memberships"
    AND no duplicate tableName rows exist
    AND every Drizzle tenant_id table has exactly one registry row

  Scenario: Live Postgres RLS matches the registry
    GIVEN a migration database URL is available in the environment
    AND operating context tenant scope is established for the probe session
    WHEN pnpm check:database-tenant-rls-live runs
    THEN pg_class.relrowsecurity is true for every registry tableName
    AND pg_policies contains every registry policyName

  Scenario: Missing RLS policy fails the coverage gate (negative path)
    GIVEN a tenant_id table exists in Drizzle schema
    AND no matching row exists in TENANT_RLS_ISOLATION_POLICIES
    WHEN pnpm check:database-tenant-rls-coverage runs
    THEN the gate exits non-zero with a schema-parity violation

  Scenario: Drizzle transactions satisfy RLS via session context bridge
    GIVEN operating context is resolved via resolveOperatingContext()
    AND the database connection is not using the Supabase service role
    WHEN withRlsSessionContext executes a transaction
    THEN set_config is applied for app.tenant_id and app.platform_user_id
    AND RLS policies using current_setting('app.tenant_id', true) permit tenant-scoped reads
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/database test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/database typecheck` | [x] |
| 5 | Biome clean | PKG-scoped biome; repo-wide `ci:biome` waived (§Waivers) | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix RLS / DB isolation row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [x] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | schema-parity denial in coverage gate tests | [x] |
| 18 | Public API compatibility verified | RLS contract exports stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 1 — Research (tenant-rls)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Medium  
**Clean Core impact:** A→A

**Purpose:** Reconcile archive tip-007-012 Slices F–I + runtime matrix **implemented** with FDR **Not started**; grade all §Runtime evidence rows; run baseline gate log; update §Remaining gaps and §Enterprise readiness score. No source edits.

**Expected deliverables / gaps to close:**

- Close gap `fdr-research-slice-1`
- Promote status to **Partially Implemented** if archive runtime reconciled
- Baseline gate log with exit codes and evidence grades
- Slice 2 unblocked for RLS closeout (handoff via `@fdr-slice-author`)

### Slice 2 — Implementation (RLS pipeline closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓; waiver `tenant-rls-persistence-prereq` reconfirmed (persistence Research not required for RLS-only closeout)  
**Type:** Implementation  
**Risk class:** Medium (pipeline proven in Research; closeout = negative-path tests + full gate attestation; registry/migration edits only if drift discovered)  
**Clean Core impact:** A→A

#### Design (internal-guide)

Close tenant-rls Implementation gaps without duplicating Research attestation: run full §Acceptance gate set exit 0; add **schema-parity denial** coverage in package + governance gate tests (DoD #17); assert stable RLS public exports (DoD #18); mark DoD rows 1–6 and 16–18 `[x]` with evidence paths in this FDR. Research Slice 1 found **zero registry/schema/migration drift** — expect **no edits** to `tenant-rls-coverage.contract.ts`, migration SQL, or gate script logic unless a gate re-run surfaces new drift. Reconfirm waiver `tenant-rls-persistence-prereq` in §Waivers to close gap `tenant-rls-persistence-seq`. Sequential sibling `fdr-003-persistence` remains coordination-only for **new** `tenant_id` tables — not a blocker for this slice.

Negative-path proof: `collectTenantRlsSchemaParityGaps` with an incomplete synthetic registry must yield `registry-missing-table`; `collectTenantRlsRegistryInvariantViolations` must surface `schema-parity-gap`; `checkDatabaseTenantRlsCoverage` must map invariant violations to gate output (governance test may use `vi.mock` per live-gate test pattern).

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-003-tenant-rls.md

1. Objective    — Close tenant-rls Implementation gaps: full §Acceptance gates exit 0, schema-parity denial tests in coverage gate suite, stable RLS public-export attestation, and FDR DoD rows 1–6 + 16–18 marked with evidence paths; reconfirm persistence prerequisite waiver.
2. Allowed layer— packages/database/src/rls/; packages/database/src/__tests__/; scripts/governance/check-database-tenant-rls-coverage.mts; scripts/governance/__tests__/; docs/delivery/FDR/
3. Files        —
   packages/database/src/rls/__tests__/tenant-rls-coverage.contract.test.ts
   packages/database/src/rls/__tests__/tenant-rls-registry-invariants.contract.test.ts
   packages/database/src/__tests__/index.test.ts
   scripts/governance/__tests__/check-database-tenant-rls-coverage.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-003-tenant-rls.md
4. Prohibited   — do-not-create-accounting-package; do-not-hand-edit-migrations; do-not-add-accounting-schema-without-adr; foundation-disposition.registry.ts; packages/accounting/; apps/erp/; packages/database/src/migrations/*.sql (unless Research drift re-run proves missing RLS tag); duplicating TENANT_RLS_ISOLATION_POLICIES or policy strings outside tenant-rls-coverage.contract.ts; behavioural edits to verify-tenant-rls-live.server.ts or with-rls-session-context.ts unless gate failure requires fix
5. Authority    — ADR-0014 · ADR-0016 · PKG003_DATABASE registry snapshot (§Registry link) · archive tip-007-012 Slices F–I (evidence only)
6. Gates        —
   pnpm check:database-tenant-rls-coverage
   pnpm check:database-tenant-rls-live
   pnpm --filter @afenda/database typecheck
   pnpm --filter @afenda/database test:run
   pnpm quality:migrations
   pnpm quality:boundaries
   pnpm ci:biome
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap tenant-rls-persistence-seq (waiver reconfirmation); partial tenant-rls-complete-status (DoD attestation — peer review remains Slice 3/Complete); DoD #1; DoD #2; DoD #3; DoD #4; DoD #5; DoD #6; DoD #16; DoD #17; DoD #18
8. Evidence     —
   packages/database/src/rls/tenant-rls-coverage.contract.ts
   packages/database/src/rls/tenant-rls-schema-parity.contract.ts
   packages/database/src/rls/tenant-rls-registry-invariants.contract.ts
   packages/database/src/rls/__tests__/tenant-rls-coverage.contract.test.ts
   scripts/governance/__tests__/check-database-tenant-rls-coverage.test.ts
   packages/database/src/__tests__/index.test.ts
   packages/database/src/public-api.ts
9. Attestation  — Contract stability (RLS public exports unchanged — DoD #18); Test coverage (+schema-parity denial negative path — DoD #17); Security (coverage + live gates exit 0 + denial tests); Maintainability (typecheck, migrations, boundaries, biome exit 0); Documentation (FDR DoD rows attested)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + §Runtime evidence table unchanged Grade A |
| 2 | Tests pass | `pnpm --filter @afenda/database test:run` |
| 3 | Boundaries | `pnpm quality:boundaries` |
| 4 | TypeScript strict | `pnpm --filter @afenda/database typecheck` |
| 5 | Biome clean | `pnpm ci:biome` |
| 6 | Registry aligned | `pnpm check:foundation-disposition` |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` + single registry in `tenant-rls-coverage.contract.ts` |
| 17 | Security negative path tested | `tenant-rls-coverage.contract.test.ts` + `check-database-tenant-rls-coverage.test.ts` schema-parity denial |
| 18 | Public API compatibility verified | `packages/database/src/__tests__/index.test.ts` RLS export assertions |

#### Slice 2 gate attestation (2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:database-tenant-rls-coverage` | 0 | A |
| `pnpm check:database-tenant-rls-live` | 0 | A |
| `pnpm --filter @afenda/database typecheck` | 0 | A |
| `pnpm --filter @afenda/database test:run` | 0 | A (169 pass; +5 denial/export tests) |
| `pnpm quality:migrations` | 0 | A (27 entries) |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm ci:biome` | 1 | — (20 pre-existing violations outside handoff §3; slice §3 files pass `biome ci`) |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

No registry/schema/migration drift — tests-only closeout per Research waiver.

#### Known debt

- `tenant-rls-complete-status` — DoD #14 peer review still open; DoD #5 repo-wide biome blocked; deferred to Complete promotion (Slice 3 Evidence-sync + PR)
- `tenant-rls-29-closeout` — Evidence-sync Slice 3; matrix row + index rename to `[Complete]`
- `tenant-rls-observability` — observability dimension 3/5 waived; not closed in this slice
- New `tenant_id` Drizzle tables require `fdr-003-persistence` coordination even after waiver reconfirmation

### Slice 3 — Evidence-sync (29/30 closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 2 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  

**Purpose:** Promote to **Complete**; recalculate readiness to 29/30; rename FDR prefix; final matrix + index sync.

**Outcomes:**

- Slice 3 gate log attests database tenant RLS coverage/live, typecheck, test:run, foundation-disposition, documentation-drift — all exit 0
- Readiness promoted: **29/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise 9.5 candidate
- Waiver `tenant-rls-observability` reconfirmed at Slice 3
- Gap `tenant-rls-29-closeout` closed — matrix RLS row + fdr-status-index synced
- Complete prefix promotion deferred to DoD #14 peer review at PR merge

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-003-tenant-rls.md

1. Objective    — Recalculate §Enterprise readiness score to 29/30 audit-adjusted; sync FDR evidence with Slice 3 gate log; reconcile matrix RLS / DB isolation row + fdr-status-index; reconfirm waiver tenant-rls-observability. Do not rename to [Complete] — DoD #14 peer review still open.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-003-tenant-rls.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts; do-not-hand-edit-migrations; do-not-create-accounting-package
5. Authority    — ADR-0014 · ADR-0016 · PKG003_DATABASE · archive tip-007-012 (read-only)
6. Gates        —
   pnpm check:database-tenant-rls-coverage
   pnpm check:database-tenant-rls-live
   pnpm --filter @afenda/database typecheck
   pnpm --filter @afenda/database test:run
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap tenant-rls-29-closeout; partial tenant-rls-complete-status (matrix/index sync — peer review remains open); DoD #20 (readiness recalc)
8. Evidence     —
   docs/delivery/FDR/[Partially Implemented] fdr-003-tenant-rls.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
9. Attestation  — Documentation + BRD traceability (matrix/index sync); Enterprise readiness 29/30 audit-adjusted; Observability waiver reconfirmed
```

### Slice 4 — Evidence-sync (Complete — enterprise 9.5 accepted)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 3 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  

**Purpose:** Record Architecture Authority peer review (DoD #14); reconfirm §Waivers; promote to **Complete — enterprise 9.5 accepted**; sync index and runtime matrix.

**Outcomes (delivered 2026-06-25):**

- Architecture Authority peer review **Approved** (Slice 2 denial tests + Slice 3 matrix closeout)
- §Waivers reconfirmed at promotion
- Status promoted to **Complete — enterprise 9.5 accepted**
- Gap `tenant-rls-complete-status` closed
- Final gates: RLS coverage ✓; RLS live ✓; database typecheck ✓; test:run 169 ✓; documentation-drift ✓; foundation-disposition ✓

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Complete] fdr-003-tenant-rls.md

1. Objective    — Close DoD #14; promote fdr-003-tenant-rls to Complete — enterprise 9.5 accepted at 29/30.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Complete] fdr-003-tenant-rls.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts
5. Authority    — Architecture Authority peer review attestation · ADR-0016 · PKG003_DATABASE
6. Gates        —
   pnpm check:database-tenant-rls-coverage
   pnpm check:database-tenant-rls-live
   pnpm --filter @afenda/database typecheck
   pnpm --filter @afenda/database test:run
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap tenant-rls-complete-status; DoD #14; DoD #5 (waived); DoD #7; DoD #9; DoD #10
8. Evidence     — §Peer review attestation; final gate log below
9. Attestation  — Documentation 5/5; Enterprise readiness 29/30 accepted
```

### Final acceptance gate log (Complete promotion — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:database-tenant-rls-coverage` | 0 | A |
| `pnpm check:database-tenant-rls-live` | 0 | A |
| `pnpm --filter @afenda/database typecheck` | 0 | A |
| `pnpm --filter @afenda/database test:run` | 0 | A (169 pass; 4 skipped) |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation — registry row add | Revert commit; run Drizzle `down` migration for RLS tag via migration pipeline (not hand-edited) | Quarterly-release-safe; `pnpm quality:migrations` |
| Implementation — live probe change | Revert `verify-tenant-rls-live.server.ts` commit; re-run live gate | No hand-edited Postgres objects |
| Coverage gate regression | Revert contract/gate commit; restore prior `TENANT_RLS_ISOLATION_POLICIES` from git | Transport rollback = git revert + gate re-run |

Oracle analog: confirm upgrade-safe — RLS policies applied only via tagged migrations. SAP analog: transport rollback = git revert + `pnpm check:database-tenant-rls-coverage` + `pnpm check:database-tenant-rls-live`.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `tenant-rls-live-env-skip` | Live gate when `DATABASE_URL` / migration URL unavailable | Gate script skips with documented message; CI uses env injection | Architecture Authority (archive tip-007-012 Slice G) | Revisit when CI always provisions migration DB |
| `tenant-rls-persistence-prereq` | Hard block on `fdr-003-persistence` Complete before tenant-rls Slice 2 | RLS registry + gates already implemented; new tables need persistence coordination only | Architecture Authority (Research + Slice 2 reconfirmed 2026-06-25) | Revisit when persistence FDR Research completes |
| `tenant-rls-e2e` | Browser E2E for DB RLS | Coverage + live gates + unit tests prove isolation; E2E is DB-layer | Architecture Authority | Phase 9 / external beta |
| `tenant-rls-observability` | Dedicated audit event on RLS gate run | Gates are CI/dev tooling; audit_events table has RLS policy | Architecture Authority | **Reconfirmed 2026-06-25** — Slice 4 Complete |
| `tenant-rls-biome-repo` | DoD #5 repo-wide `pnpm ci:biome` | Pre-existing violations outside PKG-003 handoff scope; PKG gates exit 0 | Architecture Authority | Monorepo hygiene batch |

## §Knowledge transfer

### Operational runbook

- Canonical registry: `packages/database/src/rls/tenant-rls-coverage.contract.ts` — add row before schema migration
- Schema parity: `packages/database/src/rls/tenant-rls-schema-parity.contract.ts` — lists every Drizzle `tenant_id` table
- Adding a new tenant table: (1) Drizzle schema via persistence FDR → (2) registry row + migration tag → (3) `pnpm check:database-tenant-rls-coverage` → (4) `pnpm check:database-tenant-rls-live`
- Session bridge: `withRlsSessionContext(db, context, run)` for non–service-role Drizzle transactions

### Observability

- RLS gate failure: read stderr from `check-database-tenant-rls-coverage.mts` — lists rule + file + message
- Live probe failure: `verify-tenant-rls-live.server.ts` reports missing `relrowsecurity` or policy name
- Audit trail: `audit_events` table covered by `audit_events_tenant_isolation` policy

### On-call escalation

- Symptom: coverage gate fails on schema-parity → check new Drizzle table missing from `TENANT_RLS_ISOLATION_POLICIES`
- Symptom: live gate fails → verify migration applied to target DB; run `pnpm check:database-tenant-rls-live` with `.env.local` URL
- Symptom: cross-tenant data visible → verify application uses `withRlsSessionContext` or Supabase JWT; RBAC is primary control
- Owner: `@afenda/database` (PKG-003) via `database-agent`

## §Peer review attestation

| Field | Value |
| --- | --- |
| **Decision** | Approved |
| **Date** | 2026-06-25 |
| **Reviewer** | Architecture Authority |
| **Scope** | Slice 2 schema-parity denial tests + RLS public-export attestation; Slice 3 matrix/index sync; PKG-003 tenant RLS gate evidence |
| **Finding** | Unified `TENANT_RLS_ISOLATION_POLICIES` registry proven; coverage + live gates exit 0; 169 database tests pass. Single canonical registry — no duplicated policy strings. Clean Core A maintained. |
| **Boundary** | Acceptable — PKG-003 RLS subdomain only; new `tenant_id` tables require `fdr-003-persistence` coordination per waiver `tenant-rls-persistence-prereq`. |
| **Gate evidence** | `check:database-tenant-rls-coverage` exit 0; `check:database-tenant-rls-live` exit 0; `@afenda/database test:run` 169 pass |
| **DoD #14** | `[x]` |

## §Matrix–FDR drift

| Matrix row | Matrix status | FDR status (pre-audit) | FDR status (post-audit) | Gap nature | Required action |
| --- | --- | --- | --- | --- | --- |
| Enterprise hierarchy (DB) / RLS / DB isolation | **implemented** | Not started | **Complete — 29/30** | FDR delivery lag resolved Slices 1–4 | Maintain |
| Database / Drizzle | **implemented** | Not started (tenant-rls subdomain) | **Complete** | Same package, subdomain FDR lag resolved | Coordinate new `tenant_id` tables with `fdr-003-persistence` |

**Verdict:** Matrix **implemented** aligns with FDR **Complete** at 29/30 — delivery authority synchronized.

## §Enterprise benchmark qualification

This FDR is **Complete — enterprise 9.5 accepted** at **29/30** with DoD #14 peer review closed and §Waivers reconfirmed (2026-06-25).

Accepted score composition:

1. RLS gate observability waived (`tenant-rls-observability`) — Observability 4/5 effective.
2. Browser E2E for DB RLS waived (`tenant-rls-e2e`).
3. Repo-wide Biome waived outside PKG-003 (`tenant-rls-biome-repo`).
4. Live gate env skip waived with documented path (`tenant-rls-live-env-skip`).

## Verdict

**Complete — enterprise 9.5 accepted at 29/30 (2026-06-25).**

Research Slice 1 **Complete**. Slice 2 **Complete** — schema-parity denial tests, RLS public-export attestation. Slice 3 Evidence-sync **Complete** — matrix/index synced. Slice 4 Complete promotion — DoD #14 peer review approved; §Waivers reconfirmed. New `tenant_id` Drizzle tables require `fdr-003-persistence` coordination per waiver `tenant-rls-persistence-prereq`.
