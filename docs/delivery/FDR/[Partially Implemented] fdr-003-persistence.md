# fdr-003-persistence — Persistence Authority

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-003-persistence` |
| **Registry entry ID** | `PKG003_DATABASE` |
| **Package** | `@afenda/database` (PKG-003) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Configuration |
| **Risk class** | Low |
| **BRD reference** | internal — platform schema + migration authority |
| **Enterprise readiness** | **27/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (not final Complete; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SAP CTS / no DDL · SAP HANA RLS · Oracle change management · Oracle Data Security |
| **Archive hint** | TIP/runtime archive — [`tip-011-execution-foundation.md`](../../delivery/tips/[Complete]%20tip-011-execution-foundation.md) |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `persistence`; this FDR scopes **schema, migrations, and seeds** on `PKG003_DATABASE`. Tenant RLS live-apply attestation is sibling [`fdr-003-tenant-rls`](%5BNot%20started%5D%20fdr-003-tenant-rls.md).

| Field | Value |
| --- | --- |
| id | `PKG003_DATABASE` |
| packageId | PKG-003 |
| domain | `persistence` (FDR subdomain: schema + migrations + seeds) |
| lane | green-lane |
| runtimeOwner | `packages/database` |
| gates | `pnpm --filter @afenda/database typecheck`; `pnpm quality:migrations`; `pnpm check:database-tenant-rls-coverage` |
| prohibited | `do-not-create-accounting-package`; `do-not-hand-edit-migrations`; `do-not-add-accounting-schema-without-adr` |
| allowedAgents | `database-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/database` (PKG-003) | Platform schema registry, Drizzle migrations, seeds, domain services | `packages/database/src/schema/` · `packages/database/src/migrations/` · `packages/database/src/seeds/` |
| `@afenda/kernel` (PKG-010) | Operating-context consumer — reads tenant/company lookups (read-only in Research) | `packages/kernel/src/context/` |
| `@afenda/permissions` (PKG-014) | RBAC catalog seeded via platform-permissions catalog (read-only in Research) | `packages/permissions/src/` |
| `apps/erp` (PKG-007) | Runtime DB client consumer via auth-db + domain services (read-only in Research) | `apps/erp/src/lib/` |

### SAP / Oracle data ownership mapping

| Enterprise analog | Afenda owner | Evidence path |
| --- | --- | --- |
| **SAP CTS — transport objects (DDL)** | `@afenda/database` — sole DDL authority | `packages/database/src/migrations/` (27 journal entries); `drizzle-kit generate` only — [`afenda-drizzle-migration`](../../../.cursor/rules/afenda-drizzle-migration.mdc) |
| **SAP table/data dictionary** | `platformSchema` in `schema/index.ts` — 23 platform tables | `packages/database/src/schema/index.ts` |
| **SAP HANA Row-Level Security** | Unified tenant RLS registry + isolation policies | `packages/database/src/rls/tenant-rls-coverage.contract.ts` |
| **Oracle Fusion — change management** | Migration governance probes + journal repair | `packages/database/src/migrations/migration-governance.contract.ts`; `pnpm quality:migrations` |
| **Oracle Data Security — tenant isolation** | `TENANT_RLS_ISOLATION_POLICIES` + live probes | `packages/database/src/rls/`; `pnpm check:database-tenant-rls-coverage` |
| **Oracle seed / reference data** | Platform seed catalogs (permissions, rollout, workspace) | `packages/database/src/seeds/` |

**Rule:** No consumer package may author DDL, duplicate schema constants, or hand-edit `.sql` migration files. All platform tables are owned by `runtimeOwner` `packages/database`.

## Purpose

Lock and maintain governed Drizzle schema authority, migration pipeline, and platform seed catalogs for `@afenda/database` — so every platform table, migration tag, and seed catalog change flows through `runtimeOwner` with CTS-equivalent gates (`quality:migrations`, journal validation, migration-governance probes) and no hand-edited SQL.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-011-execution-foundation.md`](../../delivery/tips/[Complete]%20tip-011-execution-foundation.md).

## Scope

**In scope**

- `packages/database/src/schema/index.ts` — `platformSchema` barrel (23 tables: tenant, company, org, membership, audit, policy, entitlement, outbox, execution, rollout, storage, entity-group, legal-entity ownership, etc.)
- `packages/database/src/migrations/` — Drizzle SQL migrations (27 journal entries through `20260624115705_tenant_commercial_plans_rls`)
- `packages/database/src/migrations/migration-governance.contract.ts` — per-tag complete/partial probes (SAP CTS repair analog)
- `packages/database/src/seeds/` — platform, dev, test, demo seed pipelines + catalogs (`platform-permissions.catalog.ts`, `platform-rollout.catalog.ts`)
- `packages/database/src/public-api.ts` — intentional aggregate export surface for domain services and contracts
- Domain contract + service tests under `packages/database/src/__tests__/` and `packages/database/src/rls/__tests__/`
- FDR-aligned reconciliation of archive tip-011 + runtime matrix **implemented** claims vs FDR **Not started** delivery status

**Out of scope**

- Tenant RLS live-apply attestation and environment-specific live probes as primary deliverable ([`fdr-003-tenant-rls`](%5BNot%20started%5D%20fdr-003-tenant-rls.md) — same registry entry, sequential subdomain)
- Accounting tables without ADR (ADR-0010 + registry `prohibited[]`)
- Authentication flows (`@afenda/auth` owns session/logon; database owns auth schema tables only)
- Hand-editing migration `.sql` files or running `drizzle-kit push`

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate schema table names, RLS policy names, or migration tags outside `packages/database` |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-003 | **Sequential** with `fdr-003-tenant-rls` — same `PKG003_DATABASE` entry; orchestrator must not run both Implementation slices concurrently |
| Migration authority | Only `drizzle-kit generate` may write `.sql`; every new journal tag requires a rule in `migration-governance.contract.ts` |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-011 + runtime matrix **implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| What runtime evidence exists for `@afenda/database`? | **Yes — extensive** — 141+ TS files; 23-table `platformSchema`; 27 migrations; 164 passing tests | Runtime matrix Database/Drizzle row **implemented**; gate log below |
| Does migration governance cover all journal tags? | **Yes** — 27 entries; journal valid; repair in sync | `pnpm quality:migrations` exit 0 (2026-06-25) |
| Are tenant RLS artifact gates green? | **Yes** — coverage + live apply pass | `pnpm check:database-tenant-rls-coverage` exit 0; live gate included in `quality:migrations` |
| Is accounting schema absent (correct)? | **Yes** — no accounting tables in `platformSchema`; `ledger.contract.test.ts` guards boundary | Matrix gap "No accounting tables (correct)" |
| Do registry gates exit 0? | **Yes — all** | typecheck ✓; test:run ✓ (164 pass, 4 skipped live); boundaries ✓; disposition ✓; drift ✓ |
| Is `fdr-003-tenant-rls` hard prerequisite for persistence Slice 2? | **No for schema/migration closeout** — RLS registry + coverage gates live; live attestation FDR is sibling subdomain | §Waivers `persistence-tenant-rls-fdr-split` |

### Baseline gate log (Research Slice 1 — 2026-06-25 audit re-run)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/database typecheck` | 0 | A |
| `pnpm --filter @afenda/database test:run` | 0 | A (164 pass, 4 skipped live) |
| `pnpm quality:migrations` | 0 | A |
| `pnpm check:database-tenant-rls-coverage` | 0 | A |
| `pnpm check:database-tenant-rls-live` (via quality:migrations) | 0 | A |
| `pnpm exec biome check packages/database` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm ci:biome` (repo-wide) | not run | — (PKG-scoped biome exit 0) |

### Files inspected

| Path | Why |
| --- | --- |
| `packages/database/src/schema/index.ts` | `platformSchema` — single schema registry |
| `packages/database/src/migrations/migration-governance.contract.ts` | CTS repair probes per migration tag |
| `packages/database/src/migrations/meta/_journal.json` | 27-entry journal authority |
| `packages/database/src/public-api.ts` | Public export surface for consumers |
| `packages/database/src/rls/tenant-rls-coverage.contract.ts` | Unified tenant RLS registry |
| `packages/database/src/audit/audit.writer.ts` | Audit event persistence |
| `packages/database/src/seeds/platform-permissions.catalog.ts` | Platform permission seed authority |
| `packages/database/src/__tests__/migration-governance.contract.test.ts` | Governance rule coverage |
| `packages/database/src/rls/__tests__/tenant-rls-coverage.contract.test.ts` | RLS registry invariants |
| `packages/database/README.md` | Operational runbook baseline |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Database/Drizzle + RLS rows |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Platform schema barrel | `packages/database/src/schema/index.ts` | Yes — Grade A (23 tables in `platformSchema`) |
| Migration journal | `packages/database/src/migrations/meta/_journal.json` | Yes — Grade A (27 entries; `quality:migrations` exit 0) |
| Migration governance | `packages/database/src/migrations/migration-governance.contract.ts` | Yes — Grade A (`migration-governance.contract.test.ts` exit 0) |
| Public API surface | `packages/database/src/public-api.ts` | Yes — Grade B (export surface; `index.test.ts` 12 tests pass) |
| Tenant RLS registry | `packages/database/src/rls/tenant-rls-coverage.contract.ts` | Yes — Grade A (`check:database-tenant-rls-coverage` exit 0) |
| RLS registry invariants | `packages/database/src/rls/tenant-rls-registry-invariants.contract.ts` | Yes — Grade A (4 invariant tests pass) |
| Audit writer | `packages/database/src/audit/audit.writer.ts` | Yes — Grade B (`audit-event.test.ts` 9 tests pass) |
| Platform seeds | `packages/database/src/seeds/index.ts` | Yes — Grade B (`seed-catalog.test.ts`, `seed-environment.test.ts` pass) |
| Domain contracts | `packages/database/src/*/*.contract.ts` | Yes — Grade B (company, org, membership, role, policy, tenant, entity-group, ownership-interest tests pass) |
| Package test suite | `packages/database/src/**/__tests__/` | Yes — Grade A (164 tests pass; 4 live tests skipped) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `persistence-fdr-index-prefix` | ~~Index prefix lag~~ **Closed** (2026-06-25 v2 audit) | green | fdr-author | — | FDR filename + index synced in this audit |
| `persistence-peer-review` | DoD row 14 — PR peer review not yet recorded | green | Architecture Authority | Slice 2 | PR approved by Architecture Authority member |
| `persistence-29-closeout` | Enterprise readiness 27/30 audit-adjusted — 29/30 at Complete | green | Evidence-sync slice | Slice 3 | Peer review + optional repo-wide biome |
| `persistence-live-seed-e2e` | Live seed/idempotency tests skipped in default CI | blue | — | §Waivers | Waiver or live-env CI path before Complete |

## §Matrix drift gaps

> Reconciles FDR delivery status vs [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md).

| Matrix row | Matrix status | FDR status | Gap | Close condition |
| --- | --- | --- | --- | --- |
| Database / Drizzle | **implemented** 28/30 (matrix) | **Partially Implemented** 27/30 audit-adjusted | Matrix score ahead of FDR audit-adjusted; peer review open | Sync matrix note on Complete |
| Enterprise hierarchy (DB) | **implemented** | Partially Implemented | sibling `fdr-003-tenant-rls` still **Not started** despite RLS gates green | tenant-rls FDR Research Slice 1 |
| Tenant RLS live attestation | gates green | scoped to `fdr-003-tenant-rls` | Waiver `persistence-tenant-rls-fdr-split` | tenant-rls FDR promotion |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 **and** DoD #14 peer review closed ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). Until then: **enterprise 9.5 candidate / evidence-qualified**.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `migration-governance.contract.ts` (27 tags) + domain contracts — Grade A | — |
| Test coverage | 5/5 | 164 tests pass (4 live skipped) — Grade A | Waiver `persistence-live-seed-e2e` |
| Observability + audit | 4/5 | `audit.writer.ts` + tests — Grade B | Not all platform mutations emit audit |
| Security + RBAC + RLS | 5/5 | RLS coverage + live gate exit 0 — Grade A | — |
| Documentation + BRD traceability | 4/5 | FDR v2 audit + drift exit 0 — Grade A | DoD #14 peer review `[ ]` |
| Maintainability + Clean Core | 4/5 | PKG biome + migrations + boundaries exit 0; Clean Core A — Grade A | Repo-wide `ci:biome` not verified |
| **Total (audit-adjusted)** | **27/30** | **~9.0 / 10 equivalent** | Honest foundation-grade score today |
| **Total (evidence-qualified ceiling)** | **29/30** | Upper bound when peer review + waivers accepted | Not final 9.5 until Complete |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — schema and migration authority owned exclusively by `@afenda/database`; consumers import public barrel only; `prohibited[]` enforces no hand-edited migrations and no accounting schema without ADR.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/kernel` | Tenant/company lookup services | No | A→A |
| `@afenda/permissions` | Platform permission catalog alignment | No | A→A |
| `@afenda/observability` | Audit event contract via `audit.writer` | No | A→A |
| `apps/erp` | `createAuthDb`, domain services, audit adapter | No | A→A |
| `@afenda/auth` | Auth schema tables via `auth-db.ts` | No | A→A |

**ERP giant compatibility (Research confirmed):**

- **Schema scale:** 23 platform tables in `platformSchema`; adding tables requires schema edit → `drizzle-kit generate` → governance rule → gates.
- **Migration transport:** 27 sequential migrations with complete/partial probes — SAP CTS rollback analog via git revert + `db:migrate` retry path.
- **Tenant isolation:** Unified RLS registry covers all tenant-scoped tables; artifact gate + live apply gate both exit 0.
- **Seed idempotency:** `seed-ensure.ts` + catalog tests prove repeatable platform bootstrap.

Upstream consumers scan: `@afenda/kernel`, `apps/erp`, `@afenda/auth` import `@afenda/database` public exports only. No package should duplicate Drizzle table definitions or migration tags.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SAP CTS / no direct DDL | Oracle change management | `pnpm quality:migrations` | 1 |
| SAP HANA Row-Level Security | Oracle Data Security | `pnpm check:database-tenant-rls-coverage` | 17 |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/database typecheck` | 4 |
| SAP transport safety | Oracle upgrade-safe migrations | §Rollback strategy | 13 |
| SAP data dictionary ownership | Oracle table ownership | `platformSchema` in `schema/index.ts` | 18 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-011.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | All platform DDL flows through Drizzle generate + journal validation | 1 | `pnpm quality:migrations` |
| internal | Schema barrel exposes governed platform tables only | 18 | `packages/database/src/schema/index.ts` |
| internal | Tenant-scoped tables registered in RLS coverage artifact | 17 | `pnpm check:database-tenant-rls-coverage` |
| internal | Domain write contracts validated before persistence | 2 | `pnpm --filter @afenda/database test:run` |
| tip-011 (archive) | Execution foundation schema + outbox + seeds | 1 | `migration-governance.contract.ts`; outbox in `platformSchema` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Schema barrel matches migration-applied database; governance probes pass | `migration-governance.contract.test.ts`; `quality:migrations` |
| Performance efficiency | Connection pooling via Supabase transaction pooler default | `packages/database/README.md`; `pool.ts` |
| Compatibility | Public API stable; no breaking export removals without semver | `index.test.ts`; `quality:boundaries` |
| Security | Tenant RLS on all tenant-scoped tables; no accounting schema without ADR | `check:database-tenant-rls-coverage`; registry `prohibited[]` |
| Maintainability | Biome clean; strict typecheck; 0 hand-edited migrations | `pnpm ci:biome`; `typecheck`; `quality:migrations` |
| Reliability | Migration repair probes + partial cleanup for failed applies | `migration-governance.contract.ts`; `db:repair-journal` |
| Portability | No hand-edited SQL; journal repair scripts for drift recovery | `pnpm quality:migrations` |
| Documentation | Index + matrix aligned with FDR evidence | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Schema/migration changes (DDL transport) | N/A at runtime — governed by CI gates + PR review | `quality:migrations`; DoD row 14 peer review |
| Audit event insert | Actor recorded in `audit_events` row | `audit-event.test.ts`; `audit.writer.ts` |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-003-persistence**
- Registry: `PKG003_DATABASE` read-only snapshot in §Registry link
- Sibling: [`fdr-003-tenant-rls`](%5BNot%20started%5D%20fdr-003-tenant-rls.md) — sequential subdomain on same registry entry (RLS live attestation)
- Archive evidence: [`tip-011-execution-foundation.md`](../../delivery/tips/[Complete]%20tip-011-execution-foundation.md)
- Drizzle governance rule: [`.cursor/rules/afenda-drizzle-migration.mdc`](../../../.cursor/rules/afenda-drizzle-migration.mdc)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-003-persistence.md` | — | Modified per slice |
| `packages/database/src/schema/*.schema.ts` | `@afenda/database` | Modified (Implementation slices only) |
| `packages/database/src/migrations/*.sql` | `@afenda/database` | New via `drizzle-kit generate` only |
| `packages/database/src/migrations/migration-governance.contract.ts` | `@afenda/database` | Modified (Implementation slices only) |
| `packages/database/src/seeds/*` | `@afenda/database` | Modified (Implementation slices only) |
| `packages/database/src/**/__tests__/` | `@afenda/database` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm --filter @afenda/database typecheck`
- `pnpm --filter @afenda/database test:run`
- `pnpm quality:migrations`
- `pnpm check:database-tenant-rls-coverage`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Governed persistence authority (@afenda/database)

  Scenario: Migration journal is valid and governance rules cover every tag
    GIVEN the Drizzle migration journal at packages/database/src/migrations/meta/_journal.json
    AND migration governance rules at migration-governance.contract.ts
    WHEN pnpm quality:migrations runs
    THEN journal validation passes for all 27 entries
    AND every journal tag has a completeProbe and partialCleanup rule
    AND no hand-edited migration SQL bypasses drizzle-kit generate

  Scenario: Platform schema barrel declares owned tables only
    GIVEN platformSchema exported from packages/database/src/schema/index.ts
    WHEN a consumer imports @afenda/database/schema
    THEN all platform tables (tenant, company, audit, outbox, entitlement, rollout, storage, etc.) are registered
    AND no accounting ledger tables are present without ADR authority

  Scenario: Tenant RLS coverage artifact gate passes
    GIVEN TENANT_RLS_ISOLATION_POLICIES in tenant-rls-coverage.contract.ts
    WHEN pnpm check:database-tenant-rls-coverage runs
    THEN every tenant-scoped platform table is registered with an isolation policy
    AND tenant-rls-coverage.contract.test.ts passes

  Scenario: Domain write contracts reject invalid input before persistence
    GIVEN company, organization, membership, role, and policy contract validators
    WHEN invalid slug, ISO code, or scope is submitted
    THEN contract tests fail before any database write occurs
    AND pnpm --filter @afenda/database test:run exits 0 for the full suite
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/database test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/database typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/database` (PKG scope) | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix Database/Drizzle row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | RLS coverage + registry invariant tests | [x] |
| 18 | Public API compatibility verified | `public-api.ts` + `index.test.ts` | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 1 — Research (persistence)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** A→A

**Purpose:** Reconcile archive tip-011 + runtime matrix **implemented** claims with FDR **Not started**; map schema → migrations → seeds → RLS registry; run baseline gates; update §Remaining gaps, §Runtime evidence, and §Enterprise readiness score. No source edits.

**Outcomes:**

- Closed gap `fdr-research-slice-1`
- Status promoted to **Partially Implemented** (content; index prefix sync deferred)
- Readiness score: **27/30 audit-adjusted**, **29/30 evidence-qualified ceiling**
- Slice 2 unblocked for persistence closeout (may require zero code changes)

### Slice 2 — Implementation (persistence closeout)

**Status:** Not started  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Implementation  
**Risk class:** Low (runtime proven; closeout gates + peer review)  
**Clean Core impact:** A→A

#### Design (internal-guide)

Close persistence Implementation gaps without duplicating Research attestation: re-run full §Acceptance gate set exit 0; add **journal-tag coverage closeout** assertions in package tests if any gate re-run surfaces drift; mark DoD rows 5 and 10 `[x]` with evidence paths in this FDR. Research Slice 1 found **zero schema/migration drift** — expect **no edits** to `*.schema.ts`, migration SQL, or `migration-governance.contract.ts` unless a gate re-run fails. DoD #14 peer review is attested in FDR §Peer review attestation at PR merge — not a source deliverable. Sequential sibling `fdr-003-tenant-rls` remains coordination-only for new RLS tags.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-003-persistence.md

1. Objective    — Close persistence Implementation gaps: full §Acceptance gates exit 0, journal-governance closeout test attestation, stable public-export re-verification, and FDR DoD rows 5 + 10 marked with evidence paths; zero schema/migration edits unless gate failure proves drift.
2. Allowed layer— packages/database/src/__tests__/; docs/delivery/FDR/
3. Files        —
   packages/database/src/__tests__/migration-governance.contract.test.ts
   packages/database/src/__tests__/migration-journal.test.ts
   packages/database/src/__tests__/index.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-003-persistence.md
4. Prohibited   — do-not-create-accounting-package; do-not-hand-edit-migrations; do-not-add-accounting-schema-without-adr; foundation-disposition.registry.ts; packages/accounting/; apps/erp/; packages/database/src/migrations/*.sql; packages/database/src/schema/*.schema.ts (unless quality:migrations failure requires generate workflow); duplicating platformSchema table names outside schema/index.ts
5. Authority    — ADR-0014 · ADR-0016 · PKG003_DATABASE registry snapshot (§Registry link) · archive tip-011 (evidence only)
6. Gates        —
   pnpm --filter @afenda/database typecheck
   pnpm --filter @afenda/database test:run
   pnpm quality:migrations
   pnpm check:database-tenant-rls-coverage
   pnpm quality:boundaries
   pnpm exec biome check packages/database
   pnpm ci:biome
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — partial persistence-peer-review (gate attestation only — DoD #14 PR approval at merge); partial persistence-29-closeout (Slice 3 Evidence-sync for Complete); DoD #5; DoD #10
8. Evidence     —
   packages/database/src/schema/index.ts
   packages/database/src/migrations/meta/_journal.json
   packages/database/src/migrations/migration-governance.contract.ts
   packages/database/src/__tests__/migration-governance.contract.test.ts
   packages/database/src/__tests__/migration-journal.test.ts
   packages/database/src/__tests__/index.test.ts
   packages/database/src/public-api.ts
9. Attestation  — Test coverage (journal + governance closeout tests exit 0); Maintainability (typecheck, migrations, boundaries, PKG + repo biome exit 0); Documentation (FDR DoD #5/#10 attested); Contract stability (public-api export surface unchanged — index.test.ts)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 5 | Biome clean | `pnpm ci:biome` + `pnpm exec biome check packages/database` |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 Completion Report in PR |

#### Known debt

- `persistence-peer-review` — DoD #14 Architecture Authority PR approval deferred to PR merge / Slice 3 Complete
- `persistence-29-closeout` — Evidence-sync Slice 3 for `[Complete]` prefix + 29/30 audit-adjusted score
- `persistence-live-seed-e2e` — live seed tests remain waived per §Waivers
- `fdr-003-tenant-rls` — sibling subdomain; new tenant_id tables require coordination

### Slice 3 — Evidence-sync (29/30 Complete)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Evidence-sync  
**Risk class:** Low  

**Purpose:** Promote to **Complete** after peer review; recalculate readiness to 29/30 audit-adjusted; sync matrix in same PR.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Schema/migration Implementation | Revert schema + generated migration commit; run `db:repair-journal` if partial apply | Quarterly-release-safe; down-migration via git revert + governance partialCleanup probes |
| Seed catalog change | Revert seed commit; re-run `db:seed:platform` on target env | Idempotent seeds via `seed-ensure.ts` |

Oracle analog: confirm upgrade-safe — no internal object modifications outside `runtimeOwner`. SAP analog: transport rollback = git revert + `pnpm quality:migrations` + `db:migrate` re-run on target environment.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `persistence-tenant-rls-fdr-split` | Consolidated RLS live attestation in this FDR | RLS live apply attestation scoped to sibling `fdr-003-tenant-rls`; artifact + live gates already exit 0 | Architecture Authority (Research attestation) | Revisit when `fdr-003-tenant-rls` FDR starts |
| `persistence-live-seed-e2e` | Live seed/idempotency tests in default CI | `entitlement-provision.live.test.ts` and `seed-idempotency.live.test.ts` skipped without live DB; contract tests cover shape | Architecture Authority | External beta go-live |
| `persistence-fdr-index-prefix` | Index row + filename prefix sync | Closed 2026-06-25 v2 audit — FDR already Partially Implemented | Architecture Authority | **Closed** |

## §Knowledge transfer

### Operational runbook

- Schema authority: `packages/database/src/schema/index.ts` — `platformSchema`
- Generate migration: edit `*.schema.ts` → `pnpm --filter @afenda/database db:generate` → add governance rule → gates
- Apply migrations: `pnpm --filter @afenda/database db:migrate` (runs journal repair + apply-pending)
- Validate journal: `pnpm --filter @afenda/database db:validate-journal`
- Platform seed: `pnpm --filter @afenda/database db:seed:platform`
- Full README: [`packages/database/README.md`](../../../packages/database/README.md)

### Observability

- Audit persistence: `packages/database/src/audit/audit.writer.ts` — `insertAuditEvent`
- Audit contract: `packages/database/src/audit/audit-event.contract.ts`
- Correlation: audit metadata validated via `audit-event.validation.ts`
- RLS verification: `packages/database/src/rls/verify-tenant-rls-live.server.ts`

### On-call escalation

- Symptom: migration apply fails mid-transport → check `migration-governance.contract.ts` partialProbe/partialCleanup for tag; run `db:repair-journal`
- Symptom: RLS coverage gate fails → run `tenant-rls-coverage.contract.test.ts`; compare schema new table vs registry
- Symptom: journal drift → `pnpm --filter @afenda/database db:repair-journal:check`
- Owner: `@afenda/database` (PKG-003) via `database-agent`

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate / evidence-qualified at 29/30 ceiling**, not final **Complete — enterprise 9.5 accepted**, because:

1. **DoD #14 peer review** remains open.
2. **Audit-adjusted score is 27/30** — Maintainability capped (repo-wide biome not verified); Documentation capped (peer review pending).
3. **Sibling `fdr-003-tenant-rls`** remains Not started despite RLS gates green — waiver `persistence-tenant-rls-fdr-split` bounds scope.

The **29/30 evidence-qualified ceiling** assumes §Waivers accepted and peer review the only remaining blocker.

**Promotion to Complete — enterprise 9.5 accepted requires:** DoD #14 closed, audit-adjusted ≥29/30, matrix row score synced.

## Verdict

**Partially Implemented — enterprise 9.5 candidate / evidence-qualified at 27/30 audit-adjusted (29/30 ceiling), pending Architecture Authority peer review.**

Research Slice 1 complete (2026-06-25 audit re-run): 164 tests, all PKG-003 registry gates exit 0, archive tip-011 reconciled. Tenant RLS live attestation remains sibling FDR scope. Do not represent as **enterprise 9.5 complete** until Complete promotion criteria met.
