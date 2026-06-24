# fdr-014-rbac — RBAC

| Field | Value |
| --- | --- |
| **Status** | Complete — enterprise 9.5 accepted |
| **FDR ID** | `fdr-014-rbac` |
| **Registry entry ID** | `PKG014_PERMISSIONS` |
| **Package** | `@afenda/permissions` (PKG-014) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | High |
| **BRD reference** | internal — Phase 2 RBAC foundation + FDR delivery reconciliation |
| **Enterprise readiness** | **29/30 — enterprise 9.5 accepted** (DoD #14 peer review closed 2026-06-25; §Waivers reconfirmed) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SAP Authorization Objects · SAP GRC · Oracle RBAC policies · Oracle Advanced Controls |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Do not invent fields here.

| Field | Value |
| --- | --- |
| id | `PKG014_PERMISSIONS` |
| packageId | PKG-014 |
| domain | `rbac` |
| lane | green-lane |
| runtimeOwner | `packages/permissions` |
| gates | `pnpm --filter @afenda/permissions typecheck`; `pnpm quality:permissions-scope-grants-surface` |
| prohibited | `do-not-create-accounting-package`; `do-not-define-local-permission-constants-in-consumers` |
| allowedAgents | `permissions-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/permissions` (PKG-014) | Permission registry, policy evaluation, scope/grants surface | `packages/permissions/src/` |
| `@afenda/database` (PKG-003) | Permission key shape + `PLATFORM_PERMISSION_CATALOG` seed (read-only in Research) | `packages/database/src/seeds/platform-permissions.catalog.ts` |
| `apps/erp` (PKG-007) | API RBAC consumer — `authorizeApiRoute` wiring (read-only in Research) | `apps/erp/src/lib/api/` |

## Purpose

Lock and maintain the governed RBAC foundation — canonical `PERMISSION_REGISTRY`, membership-scoped permission checks, policy evaluation, and scope/grants barrels — so every ERP surface resolves permission keys from `@afenda/permissions` with no local permission constants in consumers.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-010-api-rbac-wiring.md`](../../delivery/tips/[Complete]%20tip-010-api-rbac-wiring.md).

## Scope

**In scope**

- `packages/permissions/src/grants/permission.contract.ts` — `PERMISSION_REGISTRY`, `RegisteredPermissionKey`, boundary validation
- `packages/permissions/src/grants/permission-checker.ts` — `checkPermission`, `requirePermission`, denial codes
- `packages/permissions/src/policy-engine.ts` — `evaluateAuthorizationPolicy`, policy gate decisions
- `packages/permissions/src/scope/` — membership scope resolution (`tenant`, `entity_group`, `company`, `organization`, `project`, `team`)
- `packages/permissions/src/permissions-scope-grants-registry.ts` — canonical scope/grants surface registry
- `packages/permissions/src/policy-audit.ts` — policy evaluation audit writer
- Test suites under `packages/permissions/src/__tests__/` (62 tests)
- FDR-aligned reconciliation of archive TIP-010 + runtime matrix **implemented** claims vs FDR delivery status

**Out of scope**

- Local permission constants in consumer packages (`prohibited` on registry entry)
- Accounting runtime posting engine (ADR-0010)
- Full TIP-010 identity closeout — session→context on all non-API surfaces (matrix residual gap)
- UI-only client-side permission checks

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice purpose |
| Shared constants | No agent may duplicate `PERMISSION_REGISTRY` keys outside `permission.contract.ts` |
| Consumer prohibition | No agent may define local permission constants in `apps/` or other packages |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel work | Two agents may not modify `packages/permissions` in the same session |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-010 + runtime matrix **implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| What runtime evidence exists for `@afenda/permissions`? | **Full package** — registry, checker, policy engine, scope resolution, 62 unit/integration tests | §Runtime evidence table |
| Does `PERMISSION_REGISTRY` align with database seed catalog? | **Yes** — exact key parity | `seed-catalog-alignment.test.ts` |
| Are accounting permission keys registered without cross-package import? | **Yes** — 9 accounting keys in registry; parity test mirrors `@afenda/accounting` vocabulary | `accounting-permission-registry.test.ts` |
| Is API RBAC wired in ERP? | **Yes** — `authorizeApiRoute` + route permission matrix (archive tip-010 Slice 2) | `apps/erp/src/lib/api/authorize-api-route.ts` |
| Do registry gates exit 0? | **Yes** — Slice 2 aligned `build` with `tsc -b --force`; all PKG gates exit 0 (2026-06-25) | Gate log below |
| What blocks FDR `Complete`? | Peer review (DoD #14); session→context on non-API surfaces (matrix residual; out of PKG-014) | §Remaining gaps |

### Baseline gate log (Research Slice 1 — 2026-06-25 audit re-run)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/permissions test:run` | 0 | A (62 tests) |
| `pnpm --filter @afenda/permissions typecheck` | 0 | A |
| `pnpm --filter @afenda/permissions build` | 0 | A |
| `pnpm quality:permissions-scope-grants-surface` | 1 | — (stale `dist/` after build — gap `rbac-stale-dist-gate`; closed Slice 2) |
| `pnpm exec biome check packages/permissions` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:api-contracts` | not run this session | — (ERP consumer evidence via tip-010 archive) |

### Slice 2 gate log (Implementation — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/permissions typecheck` | 0 | A |
| `pnpm --filter @afenda/permissions test:run` | 0 | A (62 tests) |
| `pnpm --filter @afenda/permissions build` | 0 | A (`tsc -b --force` aligned with `build:governance-dist`) |
| `pnpm quality:permissions-scope-grants-surface` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

### Files inspected

| Path | Why |
| --- | --- |
| `packages/permissions/src/grants/permission.contract.ts` | `PERMISSION_REGISTRY` authority |
| `packages/permissions/src/grants/permission-checker.ts` | Permission enforcement |
| `packages/permissions/src/policy-engine.ts` | Policy evaluation |
| `packages/permissions/src/scope/membership-resolution.ts` | `company_mismatch` denial |
| `packages/permissions/src/permissions-scope-grants-registry.ts` | Scope/grants surface registry |
| `packages/permissions/src/__tests__/authorization.test.ts` | Core RBAC + denial paths (25 tests) |
| `packages/permissions/src/__tests__/seed-catalog-alignment.test.ts` | Registry ↔ seed catalog parity |
| `packages/database/src/seeds/platform-permissions.catalog.ts` | Platform permission seed |
| `apps/erp/src/lib/api/authorize-api-route.ts` | ERP API RBAC consumer |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | RBAC / Permissions row **implemented** |

### Skills read

- `enterprise-erp-standards` — §2 SAP GRC / Oracle roles gate mapping; §8 `rbac` domain controls
- `write-fdr` — 25-section template + Gherkin permission key requirements

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Permission registry | `packages/permissions/src/grants/permission.contract.ts` | Yes — Grade A (`seed-catalog-alignment.test.ts`) |
| Permission checker | `packages/permissions/src/grants/permission-checker.ts` | Yes — Grade A (`authorization.test.ts` 25 tests) |
| Policy engine | `packages/permissions/src/policy-engine.ts` | Yes — Grade B (`authorization.test.ts` policy scenarios) |
| Policy audit writer | `packages/permissions/src/policy-audit.ts` | Yes — Grade B (`productionPolicyEvaluationOptions`) |
| Scope/grants registry | `packages/permissions/src/permissions-scope-grants-registry.ts` | Yes — Grade A (`permissions-scope-grants-registry.test.ts`) |
| Membership scope resolution | `packages/permissions/src/scope/membership-resolution.ts` | Yes — Grade A (entity-group + authorization denial tests) |
| Authorization context | `packages/permissions/src/authorization-context.ts` | Yes — Grade B (`authorization.test.ts`) |
| Public barrel exports | `packages/permissions/src/index.ts` | Yes — Grade A (`root-export-compat.test.ts`) |
| Accounting permission parity | `packages/permissions/src/__tests__/accounting-permission-registry.test.ts` | Yes — Grade A (2 tests) |
| Database seed alignment | `packages/permissions/src/__tests__/seed-catalog-alignment.test.ts` | Yes — Grade A (1 test) |
| Bridge integration | `packages/permissions/src/__tests__/authorization-bridge.integration.test.ts` | Yes — Grade A (1 test) |
| ERP API RBAC wiring | `apps/erp/src/lib/api/authorize-api-route.ts` | Yes — Grade B (archive tip-010 Slice 2) |
| ERP route permission matrix | `apps/erp/src/lib/api/api-route-permissions.ts` | Yes — Grade B (archive tip-010) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| ~~`rbac-stale-dist-gate`~~ | ~~`quality:permissions-scope-grants-surface` fails on stale `dist/`~~ | green | `permissions-agent` | Slice 2 **Closed** | ~~`pnpm --filter @afenda/permissions build` then gate exit 0~~ — closed 2026-06-25 (`build`: `tsc -b --force`) |
| `rbac-session-context-residual` | Session→context bridge not on all non-API surfaces (matrix residual) | green | identity FDR (future) | Out of PKG-014 scope | Matrix RBAC row residual cleared |
| ~~`rbac-complete-status`~~ | ~~FDR at 29/30 audit-adjusted; Complete blocked on peer review only~~ | green | Architecture Authority (PR) | **Closed 2026-06-25** | Slice 4 Complete promotion |

## §Matrix drift gaps

> Reconciles FDR delivery status vs [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md).

| Matrix row | Matrix status | FDR status | Gap | Close condition |
| --- | --- | --- | --- | --- |
| RBAC / Permissions | **implemented** | **Partially Implemented** 29/30 audit-adjusted | session→context residual (out of PKG-014); DoD #14 peer review | Slice 3 Evidence-sync + identity FDR for residual |
| Multi-tenancy (session→context) | **implemented** (partial residual) | out of scope | Non-API surfaces lack session→context bridge | Identity closeout FDR |

## §Enterprise readiness score

> **Complete — enterprise 9.5 accepted (2026-06-25):** DoD #14 peer review closed; §Waivers reconfirmed at promotion. Readiness **29/30** ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + `PERMISSION_REGISTRY` + `seed-catalog-alignment.test.ts` — Grade A | — |
| Test coverage | 5/5 | `test:run` exit 0 (62 tests) + denial paths in `authorization.test.ts` — Grade A | Slice 3 gate log re-run |
| Observability + audit | 4/5 | `policy-audit.ts` + ERP `api-handler-audit.ts` (tip-010) — Grade B | Waiver `rbac-observability-package-only` |
| Security + RBAC + RLS | 5/5 | `permission_denied`, `company_mismatch`, `inactive_actor` + tip-010 API wiring — Grade A | — |
| Documentation + BRD traceability | 5/5 | FDR Complete + matrix + index + `check:documentation-drift` exit 0 — Grade A | DoD #14 peer review closed 2026-06-25 |
| Maintainability + Clean Core | 5/5 | PKG biome + typecheck + test + `quality:permissions-scope-grants-surface` exit 0 after `tsc -b --force` build — Grade A | Slice 2 closed `rbac-stale-dist-gate` |
| **Total (audit-adjusted)** | **29/30** | **Complete — enterprise 9.5 accepted** (~9.7 / 10 equivalent) | DoD #14 closed 2026-06-25 |
| **Total (evidence-qualified ceiling)** | **29/30** | Matches audit-adjusted — waivers reconfirmed | Complete |

### Slice 3 gate log (Evidence-sync — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/permissions typecheck` | 0 | A |
| `pnpm --filter @afenda/permissions test:run` | 0 | A (62 tests) |
| `pnpm --filter @afenda/permissions build` | 0 | A |
| `pnpm quality:permissions-scope-grants-surface` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — `PERMISSION_REGISTRY` is the single authority for permission keys; consumers import from `@afenda/permissions` public barrel only; registry `prohibited` blocks local constants.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` | `checkPermission`, `PERMISSION_REGISTRY`, `evaluateAuthorizationPolicy` | No | A→A |
| `@afenda/appshell` | Permission keys for nav filter (via ERP resolver) | No | A→A |
| `@afenda/accounting` | Vocabulary parity only — no import (architecture boundary) | No | A→A |
| `@afenda/database` | `createPermissionKey`, `assertPermissionKey` (upstream shape) | No | A→A |
| `@afenda/kernel` | Operating context inputs to authorization | No | A→A |

**Upstream consumers scan:** `apps/erp` (API RBAC), `@afenda/appshell` (nav permission filter via ERP), any server action calling `requirePermission`. No package may define permission keys outside `PERMISSION_REGISTRY`.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SAP Authorization Objects — every transaction has auth check | Oracle RBAC policies — role-to-permission mapping | `pnpm check:api-contracts` (ERP routes → `PERMISSION_REGISTRY` keys) | 17 |
| SAP GRC — Segregation of Duties (conflicting auth objects) | Oracle Advanced Controls — duty separation | `accounting.journal_post` ≠ `accounting.journal_approve` in registry; SoD via separate keys | 17 |
| SAP GRC — access risk analysis (denial audit trail) | Oracle Advanced Controls — audit on sensitive access | `policy-audit.ts` + ERP `api-handler-audit.ts` | 18 |
| SAP HANA Row-Level Security — company/org isolation | Oracle Data Security — cross-company isolation | `company_mismatch` denial in `membership-resolution.ts` + tests | 17 |
| SAP ATC — static analysis clean | Oracle FDD — quality standards | `pnpm --filter @afenda/permissions typecheck`; `pnpm ci:biome` | 4, 5 |
| SAP namespace governance | Oracle CEMLI classification | `pnpm check:foundation-disposition` | 6 |
| SAP SOLMAN — docs match runtime | Oracle FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP Solution Manager go-live checklist | Oracle deployment checklist | §Knowledge transfer + §NFR | 11, 19 |
| Permissions scope/grants surface | Oracle Fusion security policy surface | `pnpm quality:permissions-scope-grants-surface` | 1 |

### SAP GRC / Oracle roles mapping (permission keys)

| Enterprise role / duty | SAP analog | Oracle analog | Afenda `PERMISSION_REGISTRY` key |
| --- | --- | --- | --- |
| System administrator — user lifecycle | Auth object `S_USER_GRP` / `S_USER_AUTH` | Duty `ORA_FND_USER_MANAGEMENT` | `system_admin.users_read`, `system_admin.users_manage` |
| System administrator — role assignment | Auth object `S_USER_ROLE` | Role `Application Administrator` | `system_admin.roles_manage` |
| System administrator — permission catalog | Auth object `S_TCODE` (custom Z*) | Duty `Security Administrator` | `system_admin.permissions_manage` |
| System administrator — module toggles | Auth object `S_DEVELOP` (config) | Profile option admin | `system_admin.modules_manage` |
| System administrator — audit read | Auth object `S_AUDIT` | Audit Reports duty | `system_admin.audit_read` |
| Accountant — chart of accounts read | Auth object `F_BKPF_BUK` (display) | GL Inquiry role | `accounting.coa_read` |
| Accountant — COA maintenance | Auth object `F_SKA1_BUK` (change) | GL Accounting Manager | `accounting.coa_manage` |
| Accountant — fiscal period read | Auth object `F_BKPF_GJA` (display) | Period Status Inquiry | `accounting.fiscal_period_read` |
| Accountant — fiscal period manage | Auth object `F_BKPF_GJA` (post) | Period Management duty | `accounting.fiscal_period_manage` |
| Accountant — period close (SoD-sensitive) | Auth object `F_BKPF_CLO` | Period Close duty (segregated) | `accounting.fiscal_period_close` |
| Accountant — journal read | Auth object `F_BKPF` (display) | Journal Inquiry | `accounting.journal_read` |
| Accountant — journal post (initiator) | Auth object `F_BKPF` (post) | Journal Entry duty | `accounting.journal_post` |
| Accountant — journal approve (approver ≠ initiator) | SAP GRC SoD: post ⊕ approve | Oracle Advanced Controls: JE approval | `accounting.journal_approve` |
| Accountant — journal reverse | Auth object `F_BKPF_STO` | Reversal duty | `accounting.journal_reverse` |
| Workspace user — dashboard read | Auth object custom `Z_WS_DSH_R` | Dashboard Viewer | `workspace.dashboard_read` |
| Workspace user — dashboard write | Auth object custom `Z_WS_DSH_W` | Dashboard Editor | `workspace.dashboard_write` |
| Inventory clerk — stock adjust | Auth object `M_MATE_WRK` | Inventory Manager | `inventory.stock_adjust` |
| HR — employee read | Auth object `P_ORGIN` (display) | HR Specialist Inquiry | `hr.employee_read` |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-010.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Actor with granted key passes `checkPermission` | 2 | `pnpm --filter @afenda/permissions test:run` |
| internal | Actor without key receives `permission_denied` | 17 | `authorization.test.ts` |
| internal | Cross-company scope yields `company_mismatch` | 17 | `authorization.test.ts` |
| internal | Unregistered keys rejected at `requirePermission` boundary | 17 | `authorization.test.ts` |
| internal | Registry keys match database seed catalog | 16 | `seed-catalog-alignment.test.ts` |
| internal | Accounting vocabulary parity without cross-package import | 18 | `accounting-permission-registry.test.ts` |
| tip-010 (archive) | ERP API routes map to registry keys | 17 | `pnpm check:api-contracts` |
| tip-010 (archive) | System-admin routes use `system_admin.*` keys | 17 | `api-route-permissions.ts` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Permission check returns allow/deny with structured decision | `authorization.test.ts` (25 tests) |
| Performance efficiency | In-memory check completes synchronously per request; no N+1 in checker | unit test timing + code review |
| Reliability | Deterministic denial codes (`permission_denied`, `company_mismatch`, `inactive_actor`, `inactive_tenant`) | `authorization.test.ts` |
| Security | RBAC gate on all governed routes; membership scope narrowing; SoD via separate keys | denial tests + tip-010 API wiring |
| Compatibility | `PERMISSION_REGISTRY` parity with `PLATFORM_PERMISSION_CATALOG` | `seed-catalog-alignment.test.ts` |
| Maintainability | Biome clean; strict typecheck; scope/grants barrels enforced | `typecheck` exit 0; `quality:permissions-scope-grants-surface` |
| Documentation | Index + matrix aligned with FDR evidence | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Journal post vs approve | **Yes** — separate registry keys (`accounting.journal_post` initiator, `accounting.journal_approve` approver) | `PERMISSION_REGISTRY.accounting.journal.*` in `permission.contract.ts` |
| Role assignment | Enforced at ERP API layer — actor must hold `system_admin.roles_manage` | tip-010 system-admin membership role route |
| General domain mutations | waived — Phase 9 gate for non-accounting posting | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-014-rbac**
- Registry: `PKG014_PERMISSIONS` read-only snapshot in §Registry link
- Upstream: `@afenda/database` — permission key shape + seed catalog
- Upstream: `@afenda/kernel` — operating context for authorization inputs
- Consumer evidence: [`tip-010-api-rbac-wiring.md`](../../delivery/tips/[Complete]%20tip-010-api-rbac-wiring.md) (archive)
- Residual (out of scope): TIP-010 identity closeout — session→context on non-API surfaces

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-014-rbac.md` | — | Modified (FDR upgrade) |
| `packages/permissions/src/grants/permission.contract.ts` | `@afenda/permissions` | Existing — evidence anchor |
| `packages/permissions/src/grants/permission-checker.ts` | `@afenda/permissions` | Existing — evidence anchor |
| `packages/permissions/src/policy-engine.ts` | `@afenda/permissions` | Existing — evidence anchor |
| `packages/permissions/src/scope/` | `@afenda/permissions` | Existing — evidence anchor |
| `packages/permissions/src/__tests__/authorization.test.ts` | `@afenda/permissions` | Existing — 25 RBAC tests |
| `packages/permissions/src/__tests__/seed-catalog-alignment.test.ts` | `@afenda/permissions` | Existing — catalog parity |

## Acceptance gate

- `pnpm --filter @afenda/permissions typecheck`
- `pnpm --filter @afenda/permissions test:run`
- `pnpm --filter @afenda/permissions build` (required before surface gate)
- `pnpm quality:permissions-scope-grants-surface`
- `pnpm check:api-contracts`
- `pnpm check:foundation-disposition`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
Feature: Governed RBAC permission enforcement

  Scenario: Actor with system_admin.users_manage passes permission check
    GIVEN the actor has permission "system_admin.users_manage" from @afenda/permissions
    AND operating context is resolved via resolveOperatingContext()
    AND the actor has an active company-scoped membership with a role granting the key
    WHEN checkPermission is called with permissionKey PERMISSION_REGISTRY.systemAdmin.users.manage
    THEN the result is allowed
    AND the decision includes membershipId and roleId

  Scenario: Actor lacking accounting.journal_post receives permission_denied
    GIVEN the actor has permission "system_admin.users_manage" from @afenda/permissions
    AND the actor does NOT have permission "accounting.journal_post"
    AND operating context is resolved via resolveOperatingContext()
    WHEN checkPermission is called with permissionKey PERMISSION_REGISTRY.accounting.journal.post
    THEN the result is denied with code "permission_denied"
    AND the decision result is "deny"

  Scenario: Cross-company membership scope yields company_mismatch
    GIVEN the actor has permission "system_admin.users_manage" from @afenda/permissions
    AND operating context companyId is "company-b"
    AND the actor membership is scoped to "company-a"
    WHEN checkPermission is called with permissionKey PERMISSION_REGISTRY.systemAdmin.users.manage
    THEN the result is denied with code "company_mismatch"

  Scenario: Suspended actor denied before membership check
    GIVEN the actor platform user status is "suspended"
    WHEN checkPermission is called with permissionKey PERMISSION_REGISTRY.systemAdmin.users.manage
    THEN the result is denied with code "inactive_actor"

  Scenario: Unregistered permission key rejected at requirePermission boundary
    GIVEN the actor has a valid session
    WHEN requirePermission is called with permissionKey "banana.destroy_all"
    THEN InvalidPermissionKeyError is thrown

  Scenario: Journal SoD — post and approve are separate registry keys
    GIVEN PERMISSION_REGISTRY.accounting.journal.post equals "accounting.journal_post"
    AND PERMISSION_REGISTRY.accounting.journal.approve equals "accounting.journal_approve"
    THEN the keys are distinct
    AND accounting-permission-registry.test.ts covers both keys

  Scenario: ERP system-admin audit route requires system_admin.audit_read
    GIVEN the actor has permission "system_admin.audit_read" from @afenda/permissions
    AND operating context is resolved via resolveOperatingContext()
    WHEN the GET /api/internal/v1/system-admin/audit-events route is authorized
    THEN authorizeApiRoute allows the request
    AND an audit event is emitted on denial for governed mutations

  Scenario: Workspace dashboard write requires workspace.dashboard_write
    GIVEN the actor has permission "workspace.dashboard_write" from @afenda/permissions
    AND operating context is resolved via resolveOperatingContext()
    WHEN the PUT /api/internal/v1/workspace/dashboard-layout route is authorized
    THEN authorizeApiRoute allows the request
    AND an audit event is emitted via @afenda/observability for the mutation
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/permissions test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/permissions typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/permissions` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix RBAC / Permissions row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [x] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `seed-catalog-alignment.test.ts` | [x] |
| 17 | Security negative path tested | `authorization.test.ts` denial scenarios | [x] |
| 18 | Public API compatibility verified | `root-export-compat.test.ts` | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers — ERP E2E out of PKG-014 scope | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 1 — Research (rbac)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** High  
**Clean Core impact:** A→A

**Purpose:** Reconcile archive tip-010 + runtime matrix **implemented** with FDR **Not started**; inventory `PERMISSION_REGISTRY` keys, denial paths, scope/grants surface, and ERP consumer wiring; update §Remaining gaps, §Runtime evidence, and §Enterprise readiness score. No source edits.

**Outcomes:**

- Closed gap `fdr-research-slice-1`
- Status promoted to **Partially Implemented**
- Readiness score: **26/30 audit-adjusted**, **29/30 evidence-qualified ceiling**
- Slice 2 unblocked for dist gate + documentation closeout

### Slice 2 — Implementation (dist gate + documentation closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Implementation  
**Risk class:** Low (runtime proven; closeout gates only)  
**Clean Core impact:** A→A

#### Design (internal-guide)

Research Slice 1 proved RBAC runtime at Grade A/B across registry, checker, policy engine, scope resolution, and 62 tests — but `quality:permissions-scope-grants-surface` fails when `dist/` barrel artifacts are older than `src/` after incremental `tsc -b` (gap `rbac-stale-dist-gate`). Root cause: package `build` uses `tsc -b` without `--force`, so emitted `dist/index.d.ts` and `dist/scope/index.d.ts` can retain stale mtimes while source barrels are newer (git checkout, parallel edits, or skipped incremental emit). Monorepo `build:governance-dist` already uses `tsc -b --force` for `@afenda/permissions`; this slice aligns the package-local `build` script with that governance pattern so standalone `pnpm --filter @afenda/permissions build` → `pnpm quality:permissions-scope-grants-surface` is deterministic. No registry, ERP consumer, or permission-key changes. `check:database-tenant-rls-coverage` is **out of scope** — database RLS schema evidence is owned by `fdr-003-tenant-rls`; PKG-014 proves grant-scope enforcement via `membership-resolution.ts` denial tests and the permissions scope/grants surface gate.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-014-rbac.md

1. Objective    — Align @afenda/permissions build with governance-dist force emit so scope/grants barrel dist artifacts are never stale vs src, then re-run full PKG acceptance gates and update FDR gate log + readiness score for Maintainability closeout.
2. Allowed layer— packages/permissions/package.json; packages/permissions/dist/ (build output only); docs/delivery/FDR/[Partially Implemented] fdr-014-rbac.md
3. Files        —
   packages/permissions/package.json
   docs/delivery/FDR/[Partially Implemented] fdr-014-rbac.md
4. Prohibited   — foundation-disposition.registry.ts; do-not-create-accounting-package; do-not-define-local-permission-constants-in-consumers; apps/erp/; packages/database/; packages/permissions/src/ (no permission-key or barrel source edits unless build fix alone fails gates — escalate to fdr-slice-author); scripts/governance/; root package.json
5. Authority    — ADR-0014 · ADR-0016 · PKG014_PERMISSIONS · multi-tenancy.md §403–409 permissions scope/grants barrels
6. Gates        —
   pnpm --filter @afenda/permissions typecheck
   pnpm --filter @afenda/permissions test:run
   pnpm --filter @afenda/permissions build
   pnpm quality:permissions-scope-grants-surface
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap `rbac-stale-dist-gate`; Gap `rbac-complete-status` (surface-gate criterion only — peer review remains open); DoD #2 (tests re-verified); DoD #4 (typecheck re-verified); DoD #9 (drift after FDR sync); §Enterprise acceptance row Permissions scope/grants surface; §Enterprise readiness Maintainability dimension (2/5 → 5/5 when gate exit 0)
8. Evidence     —
   packages/permissions/package.json
   packages/permissions/dist/index.d.ts
   packages/permissions/dist/scope/index.d.ts
   packages/permissions/dist/grants/index.d.ts
   packages/permissions/src/__tests__/authorization.test.ts
   packages/permissions/src/__tests__/permissions-scope-grants-registry.test.ts
9. Attestation  — Maintainability + Clean Core (surface gate exit 0; build aligned with build:governance-dist); Test coverage (62 tests re-run); Documentation (FDR Slice 2 gate log + §Remaining gaps update)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 2 | Tests pass | `pnpm --filter @afenda/permissions test:run` |
| 4 | TypeScript strict | `pnpm --filter @afenda/permissions typecheck` |
| 9 | Drift green | `pnpm check:documentation-drift` |
| — | Permissions scope/grants surface (§Enterprise acceptance) | `pnpm --filter @afenda/permissions build` then `pnpm quality:permissions-scope-grants-surface` |

#### Known debt

- `rbac-complete-status` — DoD #14 Architecture Authority peer review remains open; FDR stays **Partially Implemented** until Slice 3 Evidence-sync + PR merge
- `rbac-session-context-residual` — session→context on non-API surfaces is identity closeout (waiver `rbac-session-context-residual`); out of PKG-014
- `check:database-tenant-rls-coverage` / `check:database-tenant-rls-live` — not applicable to this slice (no database schema or RLS policy edits); cross-company isolation evidence remains `company_mismatch` in `authorization.test.ts` + `fdr-003-tenant-rls`
- `check:api-contracts` — ERP consumer gate; run at PR merge / quality pipeline; not a PKG-014 source edit in this slice

### Slice 3 — Evidence-sync (Complete promotion)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 2 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  

**Purpose:** Promote to **Complete** after peer review; recalculate readiness; final matrix + index sync.

**Outcomes:**

- Slice 3 gate log attests permissions typecheck/test:run/build, scope/grants surface, foundation-disposition, documentation-drift — all exit 0
- Readiness confirmed: **29/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise 9.5 candidate
- Matrix RBAC / Permissions row reconciled (dist gate closed Slice 2; session→context residual out of PKG-014)
- fdr-status-index row synced (29/30, Partially Implemented)
- Complete prefix promotion deferred to DoD #14 peer review at PR merge

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-014-rbac.md

1. Objective    — Sync FDR evidence with Slice 3 gate log; reconcile matrix RBAC / Permissions row + fdr-status-index to 29/30 audit-adjusted. Do not rename to [Complete] — DoD #14 peer review still open.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-014-rbac.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts; do-not-create-accounting-package; do-not-define-local-permission-constants-in-consumers
5. Authority    — ADR-0014 · ADR-0016 · PKG014_PERMISSIONS · archive tip-010 (read-only)
6. Gates        —
   pnpm --filter @afenda/permissions typecheck
   pnpm --filter @afenda/permissions test:run
   pnpm --filter @afenda/permissions build
   pnpm quality:permissions-scope-grants-surface
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap rbac-complete-status (matrix/index sync — peer review remains open); DoD #20 (readiness attestation)
8. Evidence     —
   docs/delivery/FDR/[Partially Implemented] fdr-014-rbac.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
9. Attestation  — Documentation + BRD traceability (matrix/index sync); Enterprise readiness 29/30 audit-adjusted confirmed
```

### Slice 4 — Evidence-sync (Complete — enterprise 9.5 accepted)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 3 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  

**Purpose:** Record Architecture Authority peer review (DoD #14); reconfirm §Waivers; promote to **Complete — enterprise 9.5 accepted**; sync index and runtime matrix.

**Outcomes (delivered 2026-06-25):**

- Architecture Authority peer review **Approved** (Slice 2 dist gate + Slice 3 matrix closeout)
- §Waivers reconfirmed at promotion
- Status promoted to **Complete — enterprise 9.5 accepted**
- Gap `rbac-complete-status` closed
- Final gates: permissions typecheck ✓; test:run 62 ✓; build + scope/grants surface ✓; documentation-drift ✓; foundation-disposition ✓

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Complete] fdr-014-rbac.md

1. Objective    — Close DoD #14; promote fdr-014-rbac to Complete — enterprise 9.5 accepted at 29/30.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Complete] fdr-014-rbac.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts
5. Authority    — Architecture Authority peer review attestation · ADR-0016 · PKG014_PERMISSIONS
6. Gates        —
   pnpm --filter @afenda/permissions typecheck
   pnpm --filter @afenda/permissions test:run
   pnpm --filter @afenda/permissions build
   pnpm quality:permissions-scope-grants-surface
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap rbac-complete-status; DoD #14; DoD #7; DoD #8 (index)
8. Evidence     — §Peer review attestation; final gate log below
9. Attestation  — Documentation 5/5; Enterprise readiness 29/30 accepted
```

### Final acceptance gate log (Complete promotion — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/permissions typecheck` | 0 | A |
| `pnpm --filter @afenda/permissions test:run` | 0 | A (62 tests) |
| `pnpm --filter @afenda/permissions build` | 0 | A |
| `pnpm quality:permissions-scope-grants-surface` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert permissions package commit; rebuild dist | Quarterly-release-safe; no hand-edited seed objects |
| Registry key addition | Revert `permission.contract.ts` + seed catalog in same commit | Transport rollback = git revert + gate re-run |

Oracle analog: confirm upgrade-safe — no internal object modifications outside `runtimeOwner`. SAP analog: transport rollback = git revert + `pnpm --filter @afenda/permissions test:run`.

## §Waivers

| Waiver ID | Owner | Reason | Scope | Expiry / revisit |
| --- | --- | --- | --- | --- |
| ~~`rbac-stale-dist-gate`~~ | permissions-agent | Surface gate checks dist freshness; src evidence proven via tests | Slice 2 build step | **Closed** 2026-06-25 — `build`: `tsc -b --force` |
| `rbac-observability-package-only` | Architecture Authority | Full ERP observability gate (`quality:erp-observability`) owned by PKG-013 / apps/erp | PKG-014 package scope | Phase 9 sign-off |
| `rbac-e2e-waiver` | Architecture Authority | ERP API RBAC E2E covered by tip-010; no PKG-014 Playwright suite required | PKG-014 deliverables | Journal posting E2E when ADR-0010 unblocks |
| `rbac-session-context-residual` | Architecture Authority | Session→context on non-API surfaces is identity closeout — out of PKG-014 | Matrix residual gap | Identity FDR delivery |

## §Knowledge transfer

### Operational runbook

- Permission keys: import from `@afenda/permissions` — never define local constants
- Adding a key: register in `PERMISSION_REGISTRY` → add to `PLATFORM_PERMISSION_CATALOG` seed → run `seed-catalog-alignment.test.ts`
- Enforcement: call `requirePermission` or `checkPermission` with `resolveOperatingContext()` inputs
- Policy layer: use `evaluateAuthorizationPolicy` after permission check for gate decisions
- Denial codes: see `authorization-denial-code.ts` (`permission_denied`, `company_mismatch`, `inactive_actor`, `inactive_tenant`)

### Observability

- Policy audit: `packages/permissions/src/policy-audit.ts` — `databasePolicyAuditWriter`
- ERP denial audit: `apps/erp/src/server/api/runtime/api-handler-audit.ts`
- Correlation ID: `createAuthorizationCorrelationId()` from `@afenda/permissions`

### On-call escalation

| Symptom | Diagnostic | Owner |
| --- | --- | --- |
| `InvalidPermissionKeyError` at API boundary | Key not in `PERMISSION_REGISTRY` — check consumer vs registry | permissions-agent |
| Widespread `permission_denied` | Role assignment / membership scope — check `memberships` table + scope_type | system-admin / identity |
| `company_mismatch` spike | Operating context companyId ≠ membership company — check context switch | kernel / operating-context FDR |

## §Peer review attestation

| Field | Value |
| --- | --- |
| **Decision** | Approved |
| **Date** | 2026-06-25 |
| **Reviewer** | Architecture Authority |
| **Scope** | Slice 2 `tsc -b --force` dist alignment; Slice 3 matrix/index sync; PKG-014 RBAC gate evidence |
| **Finding** | `PERMISSION_REGISTRY` single authority proven; 62 tests + scope/grants surface gate exit 0; API RBAC wired via archive tip-010. Session→context residual on non-API surfaces out of PKG-014 scope (waiver `rbac-session-context-residual`). |
| **Boundary** | Acceptable — PKG-014 `runtimeOwner` only; no local permission constants in consumers; no accounting runtime leakage. |
| **Gate evidence** | `@afenda/permissions typecheck` exit 0; `test:run` 62 pass; `quality:permissions-scope-grants-surface` exit 0 |
| **DoD #14** | `[x]` |

## §Enterprise benchmark qualification

This FDR is **Complete — enterprise 9.5 accepted** at **29/30** with DoD #14 peer review closed and §Waivers reconfirmed (2026-06-25).

Accepted score composition:

1. Observability capped at 4/5 per waiver `rbac-observability-package-only` — full ERP observability owned by PKG-013.
2. Session→context residual on non-API surfaces waived (`rbac-session-context-residual`) — identity FDR closeout.
3. E2E browser waived (`rbac-e2e-waiver`) — unit + integration tests prove enforcement.

## Verdict

**Complete — enterprise 9.5 accepted at 29/30 (2026-06-25).**

Slice 2 complete — `build` aligned with `tsc -b --force`. Slice 3 Evidence-sync complete — matrix/index synced. Slice 4 Complete promotion — DoD #14 peer review approved; §Waivers reconfirmed. Session→context residual remains identity FDR scope (waiver `rbac-session-context-residual`).
