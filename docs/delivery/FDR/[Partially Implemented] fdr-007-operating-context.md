# fdr-007-operating-context — Operating Context

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-007-operating-context` |
| **Registry entry ID** | `PKG007_CONTEXT` |
| **Package** | `@afenda/erp` (PKG-007) |
| **Lane** | green-lane (gate-critical — `requiredBeforeAccounting: true`) |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | High |
| **BRD reference** | internal — Phase 9 operating context resolver pipeline |
| **Enterprise readiness** | **28/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (not final Complete; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | HANA RLS · Data Security ([enterprise-erp-standards §8](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Do not invent fields here.

| Field | Value |
| --- | --- |
| id | `PKG007_CONTEXT` |
| packageId | PKG-007 |
| domain | `operating-context` |
| lane | green-lane |
| runtimeOwner | `apps/erp` |
| requiredBeforeAccounting | `true` |
| gates | `pnpm --filter @afenda/erp typecheck`; `pnpm quality:erp-context-surface`; `pnpm check:multi-tenancy-context-integration`; `pnpm check:documentation-drift` |
| prohibited | `do-not-create-accounting-package`; `do-not-inline-tenant-lookup`; `do-not-trust-session-for-tenant-scope` |
| allowedAgents | `erp-app-agent`; `kernel-context-agent`; `foundation-registry-owner` |
| evidence | See §Runtime evidence — all five registry paths verified on disk |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/erp` (PKG-007) | Server-side operating context resolver pipeline, server-action binding, header bridge | `apps/erp/src/lib/context/` · `apps/erp/src/lib/server-actions/` |
| `@afenda/kernel` (PKG-010) | Upstream `OperatingContext` contracts (read-only consumer) | `packages/kernel/src/context/` |
| `@afenda/database` (PKG-003) | Tenant/org/team lookup delegates (read-only consumer) | `packages/database/` |
| `@afenda/permissions` (PKG-014) | Membership grant scope (read-only consumer) | `packages/permissions/` |

## Purpose

Formalize and maintain the ERP operating context resolver pipeline — tenant, entity group, legal entity, organization unit, team, and project scope — so every protected server action and API route resolves authority via `resolveOperatingContext()` (or its action/header delegates), never from session or client-supplied IDs alone.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-012-erp-operating-spine.md`](../../delivery/tips/[Complete]%20tip-012-erp-operating-spine.md) · [`tip-007-012-enterprise-group-operating-context.md`](../../delivery/tips/[Complete]%20tip-007-012-enterprise-group-operating-context.md).

## Scope

**In scope**

- `apps/erp/src/lib/context/resolve-operating-context.server.ts` — canonical `resolveOperatingContext()` server resolver
- `apps/erp/src/lib/context/resolve-operating-context-from-headers.server.ts` — header/cookie selection bridge
- `apps/erp/src/lib/context/operating-context-resolver-registry.ts` — Step 7 pipeline registry
- `apps/erp/src/lib/server-actions/resolve-action-operating-context.server.ts` — protected server-action binding
- `apps/erp/src/__tests__/operating-context-integration.test.ts` — integration gate for action/API boundaries
- Context unit tests under `apps/erp/src/lib/context/__tests__/`
- FDR evidence reconciliation against registry `evidence[]` paths

**Out of scope**

- Session-only tenant trust (`do-not-trust-session-for-tenant-scope`)
- Inline tenant lookup outside resolver pipeline (`do-not-inline-tenant-lookup`)
- Kernel contract authoring (`fdr-010-context-contracts`, PKG010_KERNEL)
- Accounting runtime (ADR-0010)
- System Admin settings surface (`fdr-007-system-admin`)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `apps/erp` paths under §Scope |
| Shared constants | No agent may duplicate operating-context authority keys outside `@afenda/kernel` contracts |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-007 | **Sequential** with `fdr-007-api-governance` and `fdr-007-system-admin` — same `runtimeOwner`; orchestrator serializes shared `apps/erp` edits |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled registry `evidence[]`, archive TIP claims, and live gate exit codes with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Do all five registry `evidence[]` paths exist on disk? | **Yes** | File existence verified; see §Runtime evidence |
| Does `resolveOperatingContext()` verify client hints server-side? | **Yes** — slugs/IDs are selection hints only | `resolve-operating-context.server.ts` JSDoc + `operating-context-resolver-registry.ts` |
| Do protected server actions bind via `resolveActionOperatingContext`? | **Yes** — integration test discovers all `"use server"` modules | `operating-context-integration.test.ts` (18 tests pass) |
| Are registry prohibited rules enforced in source? | **Yes** — no `session.user.tenantId` in protected actions | Integration test static analysis |
| Do registry gates exit 0? | **Yes** | Baseline gate log below |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm quality:erp-context-surface` | 0 | A |
| `pnpm check:multi-tenancy-context-integration` | 0 | A |
| `pnpm --filter @afenda/erp test:run -- operating-context-integration` | 0 | A (18 tests) |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

### v2 audit gate log (2026-06-25 refresh)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm quality:erp-context-surface` | 0 | A |
| `pnpm check:multi-tenancy-context-integration` | 0 | A |
| `pnpm --filter @afenda/erp test:run -- operating-context-integration` | 0 | A (18 tests) |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

### Files inspected

| Path | Why |
| --- | --- |
| `apps/erp/src/lib/context/resolve-operating-context.server.ts` | Canonical `resolveOperatingContext()` export |
| `apps/erp/src/lib/context/resolve-operating-context-from-headers.server.ts` | Header/cookie bridge for RSC and actions |
| `apps/erp/src/lib/context/operating-context-resolver-registry.ts` | Step 7 pipeline registry |
| `apps/erp/src/lib/server-actions/resolve-action-operating-context.server.ts` | Server-action binding |
| `apps/erp/src/__tests__/operating-context-integration.test.ts` | Protected action + API boundary integration |
| `apps/erp/src/lib/context/__tests__/` (12 files) | Unit coverage for resolver delegates |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Auth row — session bridge gap cited in §Remaining gaps |

### Skills read

- `enterprise-erp-standards` — HANA RLS / Data Security domain controls (§8)
- `write-fdr` — 25-section template + enterprise scoring (ENTERPRISE-BENCHMARK §3)

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Canonical resolver | `apps/erp/src/lib/context/resolve-operating-context.server.ts` | Yes — Grade A (`typecheck` exit 0) |
| Header bridge | `apps/erp/src/lib/context/resolve-operating-context-from-headers.server.ts` | Yes — Grade A (`quality:erp-context-surface` exit 0) |
| Resolver pipeline registry | `apps/erp/src/lib/context/operating-context-resolver-registry.ts` | Yes — Grade B (registry + integration test cites pipeline) |
| Server-action binding | `apps/erp/src/lib/server-actions/resolve-action-operating-context.server.ts` | Yes — Grade A (integration test — all protected actions) |
| Integration gate | `apps/erp/src/__tests__/operating-context-integration.test.ts` | Yes — Grade A (18 tests exit 0) |
| Context switch action | `apps/erp/src/lib/context/context-switch.action.ts` | Yes — Grade A (integration test + actor from resolved context) |
| Protected surface registry | `apps/erp/src/lib/context/operating-context-protected-surface.registry.ts` | Yes — Grade A (RSC bridge integration test exit 0) |
| RSC bridge integration | `apps/erp/src/__tests__/operating-context-rsc-bridge.integration.test.ts` | Yes — Grade A (static surface audit exit 0) |
| Resolution logging | `apps/erp/src/lib/context/log-operating-context-resolution.server.ts` | Yes — Grade B (observability read path) |
| Untrusted authority rejection | `apps/erp/src/lib/context/reject-untrusted-authority-fields.ts` | Yes — Grade A (integration test + kernel key parity) |
| Context unit tests | `apps/erp/src/lib/context/__tests__/` (12 files) | Yes — Grade B (resolver delegate coverage) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `ctx-session-bridge-surfaces` | ~~Runtime matrix Auth row: session→operating-context bridge incomplete on some surfaces~~ **Closed Slice 2 (2026-06-25)** — `operating-context-protected-surface.registry.ts` + RSC bridge integration tests | green (gate-critical) | `erp-app-agent` | Slice 2 ✓ | Dedicated matrix row + surface audit; all RSC/API paths cite resolver |
| `ctx-matrix-row-dedicated` | Runtime matrix uses **Multi-tenancy** row; no dedicated operating-context row | green | Architecture Authority | Evidence-sync | Matrix row cites FDR v2 dual scores |
| `ctx-complete-status` | FDR at 27/30 audit-adjusted; Complete blocked on peer review + DoD #5 biome | green | Architecture Authority (PR) | Slice 3 | DoD #14 peer review `[x]`; §Waivers reconfirmed |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 on this table **and** DoD #14 peer review closed **and** waivers reconfirmed at PR ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). Until then this FDR is an **enterprise 9.5 candidate / evidence-qualified**, not final Complete.
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row. Where waivers or open DoD rows cap a dimension, the **audit-adjusted** score is used for the honest total.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + `resolveOperatingContext()` + `@afenda/kernel` contracts — Grade A | — |
| Test coverage | 5/5 | 18 integration tests + 12 context unit test files + `check:multi-tenancy-context-integration` exit 0 — Grade A | — |
| Observability + audit | 4/5 | `log-operating-context-resolution.server.ts` — Grade B | Waiver `ctx-observability-read-path` |
| Security + RBAC + RLS | 5/5 | Prohibited rules enforced; integration denial tests; multi-tenancy gate exit 0 — Grade A | — |
| Documentation + BRD traceability | 4/5 | FDR v2 + index + matrix Multi-tenancy row + `check:documentation-drift` exit 0 — Grade A | DoD #14 peer review still `[ ]` |
| Maintainability + Clean Core | 5/5 | Registry gates exit 0; Clean Core B; protected surface registry + RSC bridge audit — Grade A | DoD #5 repo-wide `pnpm ci:biome` still `[ ]` |
| **Total (audit-adjusted)** | **28/30** | **~9.3 / 10 equivalent** — honest gate-critical score today | |
| **Total (evidence-qualified ceiling)** | **29/30** | Upper bound if §Waivers accepted and peer review + biome pending only | Not final 9.5 until Complete |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — resolver pipeline at approved `apps/erp` boundary; authority types owned in `@afenda/kernel`; tenant lookups delegated to `@afenda/database`; no session-trust for tenant scope.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` (protected actions) | `resolveActionOperatingContext` | No | B→B |
| `apps/erp` (API routes) | `resolveVerifiedApiRouteOperatingContext` via `authorize-api-route.ts` | No | B→B |
| `apps/erp` (RSC pages) | `resolveOperatingContextFromHeaders` | No | B→B |
| `@afenda/accounting` (future) | `toAccountingDomainContext` bridge (read-only until ADR-0010 amended) | No | B→B |

Upstream consumers scan: all protected `"use server"` modules under `apps/erp/src` must call `resolveActionOperatingContext`. Integration test discovers modules statically — adding a new protected action without binding fails CI.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| HANA RLS | Data Security | `pnpm check:multi-tenancy-context-integration` | 1, 17 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/erp typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Tenant scope resolved server-side via `resolveOperatingContext()` | 1, 2 | `pnpm check:multi-tenancy-context-integration` |
| internal | Protected server actions bind operating context before mutation | 2 | `operating-context-integration.test.ts` |
| internal | Client authority IDs rejected at action/API boundary | 17 | `operating-context-integration.test.ts` |
| tip-012 (archive) | ERP operating spine resolver pipeline | 1 | `quality:erp-context-surface` |
| tip-007-012 (archive) | Enterprise group operating context | 1 | `resolve-operating-context.server.ts` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Operating context resolves all authority dimensions or fails closed | `resolve-operating-context.server.ts` + unit tests |
| Performance efficiency | Resolver delegates use indexed DB lookups; no N+1 in hot path | code review + `typecheck` |
| Security | RBAC grant scope + tenant isolation; no session-trust for tenant | `operating-context-integration.test.ts`; prohibited registry rules |
| Reliability | Deterministic fail-closed on missing/suspended tenant | `context-errors.test.ts`; resolver tests |
| Maintainability | Biome clean; strict typecheck; resolver registry documents pipeline | `typecheck` exit 0; `operating-context-resolver-registry.ts` |
| Compatibility | `@afenda/kernel` `OperatingContext` shape unchanged at ERP boundary | `typecheck` + kernel contract imports |
| Documentation | Registry evidence paths + FDR aligned | `pnpm check:foundation-disposition`; `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Context switch (`context-switch.action.ts`) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |
| Operating context resolution (read path) | N/A — no governed mutation in resolver | — |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-007-operating-context**
- Registry: `PKG007_CONTEXT` read-only snapshot in §Registry link
- Upstream contracts: `@afenda/kernel` operating context types (`fdr-010-context-contracts`)
- Upstream data: `@afenda/database` tenant/org lookups; `@afenda/permissions` membership grants
- Sibling (sequential): [`fdr-007-api-governance`](%5BNot%20started%5D%20fdr-007-api-governance.md), [`fdr-007-system-admin`](%5BNot%20started%5D%20fdr-007-system-admin.md)
- Archive evidence: [`tip-012-erp-operating-spine.md`](../../delivery/tips/[Complete]%20tip-012-erp-operating-spine.md) · [`tip-007-012-enterprise-group-operating-context.md`](../../delivery/tips/[Complete]%20tip-007-012-enterprise-group-operating-context.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[Not started] fdr-007-operating-context.md` | — | Modified (FDR upgrade) |
| `apps/erp/src/lib/context/resolve-operating-context.server.ts` | `@afenda/erp` | Existing — registry evidence |
| `apps/erp/src/lib/context/resolve-operating-context-from-headers.server.ts` | `@afenda/erp` | Existing — registry evidence |
| `apps/erp/src/lib/context/operating-context-resolver-registry.ts` | `@afenda/erp` | Existing — registry evidence |
| `apps/erp/src/lib/server-actions/resolve-action-operating-context.server.ts` | `@afenda/erp` | Existing — registry evidence |
| `apps/erp/src/__tests__/operating-context-integration.test.ts` | `@afenda/erp` | Existing — registry evidence |

## Acceptance gate

- `pnpm --filter @afenda/erp typecheck`
- `pnpm quality:erp-context-surface`
- `pnpm check:multi-tenancy-context-integration`
- `pnpm --filter @afenda/erp test:run -- operating-context-integration`
- `pnpm check:foundation-disposition`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
Feature: ERP operating context resolver pipeline

  Scenario: Server resolver verifies tenant from slug hint
    GIVEN the actor has permission keys resolved from @afenda/permissions
    AND operating context is resolved via resolveOperatingContext()
    AND the client supplies tenantSlug as a selection hint only
    WHEN resolveOperatingContext is called with the actor userId and selection
    THEN the tenant row is loaded via findTenantBySlug
    AND the tenant must be operational or resolution fails closed
    AND the returned OperatingContext includes verified tenant scope

  Scenario: Protected server action binds verified operating context
    GIVEN operating context is resolved via resolveOperatingContext()
    AND a protected server action module exists under apps/erp/src
    WHEN the action handler executes
    THEN resolveActionOperatingContext is invoked before any mutation
    AND session.user.tenantId is never used for tenant scope

  Scenario: Client authority IDs are rejected at action boundary
    GIVEN the actor submits a protected action payload
    WHEN the payload contains tenantId, companyId, or other UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS
    THEN parseProtectedActionInput or rejectUntrustedAuthorityFields rejects the payload
    AND no operating context is resolved from client-supplied authority IDs

  Scenario: Context switch uses strict schema for slug hints only
    GIVEN the actor has permission to switch workspace context
    AND operating context is resolved via resolveOperatingContext()
    WHEN context-switch.action.ts accepts a selection payload
    THEN operatingContextSelectionHintsSchema validates slug hints with .strict()
    AND companyId and other authority IDs are not accepted from the client
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | registry `evidence[]` + file exists | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run -- operating-context-integration` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/erp typecheck` | [x] |
| 5 | Biome clean | `pnpm ci:biome` | [ ] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | dedicated operating-context row | [ ] (partial — Multi-tenancy residual gap cleared Slice 2; dedicated row deferred Slice 3) |
| 8 | fdr-status-index updated | index row → Partially Implemented | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | integration test — session untrust + authority rejection | [x] |
| 18 | Public API compatibility verified | kernel `OperatingContext` import stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers `ctx-e2e` | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score (audit-adjusted + ceiling) | [x] |

## Slices

### Slice 1 — Research (operating-context)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** High  
**Clean Core impact:** B→B

**Purpose:** Reconcile registry `evidence[]` paths, archive tip-012/tip-007-012 claims, and live gate exit codes with FDR **Not started** delivery status; update §Runtime evidence, §Remaining gaps, and §Enterprise readiness score. No source edits.

**Outcomes:**

- All five registry evidence paths verified on disk
- Baseline gates exit 0 (typecheck, context surface, multi-tenancy integration)
- 18 integration tests pass
- Status promoted to **Partially Implemented**
- Readiness score: 27/30 audit-adjusted (29/30 ceiling)
- Slice 2 unblocked for session-bridge surface audit

### Slice 2 — Implementation (session-bridge closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Implementation  
**Risk class:** High  
**Clean Core impact:** B→B

#### Design (internal-guide)

Close gap `ctx-session-bridge-surfaces` by proving every protected ERP surface resolves tenant scope via governed operating-context delegates — never from session payload fields alone.

Implementation plan (`apps/erp` only — coordinate sequentially with `fdr-002-auth-disposition` on shared layout paths; auth session wiring stays in auth FDR):

1. **Protected surface registry** — add `operating-context-protected-surface.registry.ts` enumerating RSC pages, system-admin resolver, dashboard loader, API authorization, and server-action binding with required delegate (`resolveOperatingContextFromHeaders`, `resolveActionOperatingContext`, `resolveVerifiedApiRouteOperatingContext`). Extend `context-integration-registry.ts` wiring IDs only when new integration points are discovered — do not duplicate kernel authority keys.
2. **Static surface audit** — extend `operating-context-integration.test.ts` and add `operating-context-rsc-bridge.integration.test.ts` to scan registered surfaces for resolver imports and forbidden `session.user.tenantId` / `session.user.companyId` patterns.
3. **Action audit actor source** — align `context-switch.action.ts` audit `actorUserId` with `operatingContext.actor.userId` (resolved context) instead of session payload when drift is found.
4. **Matrix evidence** — update runtime matrix Multi-tenancy row residual gap column; dedicated operating-context row remains Slice 3 Evidence-sync (`ctx-matrix-row-dedicated`).

May require zero resolver pipeline changes if audit finds all surfaces already wired — tests and registry still deliverable.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-007-operating-context.md

1. Objective    — Close session→operating-context bridge on every protected ERP RSC/API/action surface via canonical surface registry, static audit tests, and matrix gap clearance without session-trusted tenant scope.
2. Allowed layer— apps/erp/src/lib/context/; apps/erp/src/lib/system-admin/resolve-system-admin-operating-context.server.ts; apps/erp/src/lib/workspace/resolve-dashboard-widget-render-context.server.ts; apps/erp/src/lib/workspace/load-dashboard-widget-render-context.server.ts; apps/erp/src/app/(protected)/layout.tsx; apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx; apps/erp/src/app/(protected)/metadata-workspace/page.tsx; apps/erp/src/__tests__/
3. Files        —
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/context/operating-context-protected-surface.registry.ts
   apps/erp/src/lib/context/__tests__/operating-context-protected-surface.registry.test.ts
   apps/erp/src/lib/context/context-switch.action.ts
   apps/erp/src/lib/context/__tests__/context-switch.action.test.ts
   apps/erp/src/lib/system-admin/resolve-system-admin-operating-context.server.ts
   apps/erp/src/lib/workspace/resolve-dashboard-widget-render-context.server.ts
   apps/erp/src/lib/workspace/load-dashboard-widget-render-context.server.ts
   apps/erp/src/app/(protected)/layout.tsx
   apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx
   apps/erp/src/app/(protected)/metadata-workspace/page.tsx
   apps/erp/src/__tests__/operating-context-integration.test.ts
   apps/erp/src/__tests__/operating-context-rsc-bridge.integration.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-007-operating-context.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — foundation-disposition.registry.ts and foundation-disposition.md edits (delegate to foundation-registry-owner); packages/auth/ and fdr-002-auth-disposition session wiring (coordinate only); @afenda/accounting runtime and PKGR01_ACCOUNTING paths (ADR-0010); do-not-inline-tenant-lookup; do-not-trust-session-for-tenant-scope; do-not-create-accounting-package
5. Authority    — ADR-0014 · ADR-0016 · PKG007_CONTEXT · operating-context-resolver-registry.ts pipeline vocabulary
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm quality:erp-context-surface
   pnpm check:multi-tenancy-context-integration
   pnpm --filter @afenda/erp test:run -- operating-context
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap `ctx-session-bridge-surfaces`; DoD #17 (security negative path — session untrust + surface audit); DoD #7 (partial — matrix residual gap column cleared; dedicated row deferred Slice 3)
8. Evidence     —
   apps/erp/src/lib/context/operating-context-protected-surface.registry.ts
   apps/erp/src/lib/context/__tests__/operating-context-protected-surface.registry.test.ts
   apps/erp/src/__tests__/operating-context-rsc-bridge.integration.test.ts
   apps/erp/src/__tests__/operating-context-integration.test.ts
   docs/architecture/afenda-runtime-truth-matrix.md
9. Attestation  — Security + RBAC (all registered surfaces cite resolver; no session-trusted tenant scope); Test coverage (+RSC bridge integration + surface registry tests); Documentation (matrix Multi-tenancy residual gap cleared); Maintainability (Clean Core B — registry-driven audit)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 17 | Security negative path tested | `operating-context-rsc-bridge.integration.test.ts`; `operating-context-integration.test.ts` |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run -- operating-context` |
| 4 | TypeScript strict | `pnpm --filter @afenda/erp typecheck` |

#### Known debt

- `ctx-matrix-row-dedicated` — dedicated operating-context matrix row deferred to Slice 3 Evidence-sync
- `ctx-complete-status` — DoD #14 peer review and DoD #5 repo-wide `pnpm ci:biome` remain open
- Sequential overlap with `fdr-002-auth-disposition` on `(protected)/layout.tsx` — operating-context resolver audit only; auth session denial stays sibling FDR

### Slice 3 — Evidence-sync (v2 audit + Complete promotion)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Evidence-sync  
**Risk class:** Medium  

**Purpose:** v2 audit refresh gate log; reconcile matrix Multi-tenancy row; recalculate dual readiness scores; promote to **Complete** when DoD #14 closes at PR.

**Outcomes (v2 audit 2026-06-25):**

- v2 audit gate log recorded (all PKG007_CONTEXT gates exit 0)
- Dual scores: **27/30 audit-adjusted**, **29/30 evidence-qualified ceiling**
- Matrix Multi-tenancy row reconciled (FDR link + **implemented** status)
- Complete promotion still blocked on DoD #14 peer review and DoD #5 biome

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert `apps/erp/src/lib/context/` commit; re-run gates | Quarterly-release-safe; no hand-edited registry objects |
| Evidence-sync | Revert index + matrix + FDR prefix rename | Git revert + gate re-run |

Oracle analog: confirm upgrade-safe — no internal object modifications outside `runtimeOwner`. SAP analog: transport rollback = git revert + gate re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `ctx-observability-read-path` | Audit event on every operating context resolution (ISO observability 5/5) | Resolution is read-path; security enforced at action/API boundary; logging via `log-operating-context-resolution.server.ts` | Architecture Authority | Phase 9 observability FDR (`fdr-013-logging-tracing`) |
| `ctx-e2e` | Browser E2E for context switch | Integration + unit tests prove resolver pipeline; static analysis covers all protected actions | Architecture Authority | External beta go-live |
| `ctx-sod-context-switch` | Approver ≠ initiator on context switch | Phase 9 gate — self-service workspace switch | Architecture Authority | Accounting readiness sign-off |

## §Knowledge transfer

### Operational runbook

- Canonical resolver: `apps/erp/src/lib/context/resolve-operating-context.server.ts` — `resolveOperatingContext(input)`
- Header bridge: `apps/erp/src/lib/context/resolve-operating-context-from-headers.server.ts`
- Server-action binding: `apps/erp/src/lib/server-actions/resolve-action-operating-context.server.ts` — `resolveActionOperatingContext()`
- Pipeline registry: `apps/erp/src/lib/context/operating-context-resolver-registry.ts` — Step 7 delegate map
- Context switch: `apps/erp/src/lib/context/context-switch.action.ts`

### Observability

- Resolution logging: `apps/erp/src/lib/context/log-operating-context-resolution.server.ts`
- Integration trace: `pnpm --filter @afenda/erp test:run -- operating-context-integration`
- Prohibited rule enforcement: static analysis in integration test + `quality:erp-context-surface`

### On-call escalation

- Symptom: action returns forbidden despite valid session → check `resolveActionOperatingContext` result; verify tenant operational status
- Symptom: new protected action fails CI → add `resolveActionOperatingContext` call before mutation
- Symptom: client authority ID accepted → verify `parseProtectedActionInput` / `rejectUntrustedAuthorityFields` wired
- Owner: `@afenda/erp` (PKG-007) via `erp-app-agent`

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate / evidence-qualified**, not final **Complete — enterprise 9.5 accepted**, because DoD #14 peer review remains open and DoD #5 repo-wide Biome is unchecked.

The **29/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. Read-path observability on context resolution is waived (`ctx-observability-read-path`).
2. Browser E2E is waived until external beta go-live (`ctx-e2e`).
3. Context-switch SoD is waived under Phase 9 gate (`ctx-sod-context-switch`).
4. **Complete** status requires Architecture Authority peer review and waiver reconfirmation at PR merge.

The **27/30 audit-adjusted** score is the honest gate-critical benchmark today (~9.0 / 10 equivalent): strong contract, test, and security evidence; capped by open peer review, session-bridge surface gap, and repo-wide Biome DoD row.

Until DoD #14 is closed, this FDR must not be represented as fully **Complete** or as final **enterprise 9.5 accepted**.

**Promotion to Complete — enterprise 9.5 accepted requires:**

1. Architecture Authority peer review approval (DoD #14).
2. Confirmation that §Waivers remain valid at merge time.
3. Close gap `ctx-session-bridge-surfaces` or document residual scope in matrix.
4. FDR filename/status/index promotion to `[Complete]`.

## Verdict

**Partially Implemented — enterprise 9.5 candidate / evidence-qualified at 28/30 audit-adjusted (29/30 ceiling), pending Architecture Authority peer review.**

Slice 2 session-bridge closeout complete (2026-06-25): protected surface registry + RSC bridge integration tests; gap `ctx-session-bridge-surfaces` closed. Complete promotion blocked on Slice 3 Evidence-sync, DoD #5 biome, and DoD #14 peer review.
