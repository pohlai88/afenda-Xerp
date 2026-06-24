# Afenda ERP — Runtime Truth Matrix

| Field | Value |
|-------|-------|
| **As-of date** | 2026-06-24 |
| **Audit** | [`afenda-documentation-drift-audit.md`](afenda-documentation-drift-audit.md) |
| **Roadmap** | [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) |
| **Evidence rule** | Status requires file, test, export, script, or schema proof — not delivery doc claims alone |

**Status vocabulary:** `implemented` · `partially-implemented` · `documented-only` · `runtime-only` · `drifted` · `obsolete` · `blocked`

---

## Matrix

| Area | Runtime package / path | Current status | Evidence | Gaps | Required action |
| --- | --- | --- | --- | --- | --- |
| **Architecture Authority** | `packages/architecture-authority/` | **implemented** | Package exists; `pnpm quality:architecture`, `quality:architecture-drift`; registries in `docs/architecture/` | — | Maintain; fingerprint `ARCH-BASELINE-2026-06-23-v2` |
| **Package Ownership** | `docs/architecture/ownership-registry.md` | **implemented** | Registry file + `pnpm architecture:owners` | Sign-off pending on baseline | Architecture Authority sign-off |
| **Dependency Governance** | `docs/architecture/dependency-registry.md`, `packages/architecture-authority/` | **implemented** | Registry + `pnpm quality:boundaries` | New edges (appshell→design-system, erp→ui) need registry verification | Run `pnpm architecture:dependencies`; update registry on new edges |
| **Design System** | `packages/design-system/` | **partially-implemented** | Token registry, recipes, `generate-tokens-css.ts`, contrast tests; **no runtime UI** (by design) | No component implementations in design-system (correct — lives in `@afenda/ui`) | Maintain authority-only boundary; TIP-003/004 complete |
| **UI Primitives** | `packages/ui/src/components/` | **implemented** | 58 component files; 68+ tests; `resolvePrimitiveGovernance()`; stories | ADR-0008 ref-as-prop migration deferred; P1 components may exceed P0 inventory | Mark TIP-UI-02 complete; track ADR-0008 separately |
| **UI Consumption (TIP-004)** | `scripts/governance/ui-guard.mjs`, `docs/governance/tip-004-policy.md` | **implemented** | Gate D/F scripts; consumer rules in AGENTS.md | Ongoing enforcement as new blocks land | `pnpm ui:guard:scan` on appshell/erp changes |
| **AppShell** | `packages/appshell/` | **implemented** | 93+ `.tsx` files; `afenda-appshell.css`; shadcn-studio blocks incl. `AppShellDashboardStatisticsIncomeCard` + `AppShellDashboardStatisticsExpenseCard` (TIP-UI-05 Slice 6); `recharts` lazy client; dashboard canvas; tests; **TIP-006 Complete** — authority contracts `src/contracts/`, compile-time drift guards (`contract-type-assertions.ts`), presentation drift tests; public API re-exports from `index.ts`; ERP `(protected)/layout.tsx` production wiring + `protected-appshell-token-closeout.test.ts` (TIP-UI-03 Complete) | Optional Tailwind utility migration for shell blocks (out of scope) | Maintain |
| **Metadata UI** | `packages/metadata-ui/` | **implemented** | Renderers + registry + tests (Slice 1); ERP production route `/metadata-workspace` via `@afenda/metadata-ui/server` (Slice 2 — [`tip-ui-04`](../delivery/tips/%5BComplete%5D%20tip-ui-04-metadata-ui-renderers.md) **Complete**); consolidated production proof `metadata-production-page.test.tsx` (TIP-UI-05 Slice 3) | — | Maintain |
| **Metadata Authority** | `packages/metadata/` | **implemented** | Contracts, registries, validation tests | — | Maintain; no renderers here (correct) |
| **Kernel Execution Context** | `packages/kernel/src/context/` | **implemented** | `context-registry.ts` — 10 required modules; public barrel exports; `consolidation-scope-resolution.server.ts` + tests; `hierarchy-id-boundary.contract.ts` (TIP-008A Slice 6 branded-id trust boundaries); `quality:kernel-context-surface` passes | — | Maintain |
| **Platform Authority (TIP-007)** | `packages/kernel/src/contracts/platform/` | **implemented** | `platform-entity-authority.contract.ts` registry (11 ADR-0001 entities); governed barrel + drift tests; public export from `@afenda/kernel` ([`tip-007-erp-platform-authority.md`](../delivery/tips/%5BComplete%5D%20tip-007-erp-platform-authority.md) Slice 1) | — | Maintain |
| **Multi-tenancy** | `docs/architecture/multi-tenancy.md`, `apps/erp/src/lib/context/` | **implemented** | Resolver pipeline; entity_group + project + team membership scope; entity_group default company + context expansion (Slice E); context-switch UX (TIP-UI-05 Slice 9); consolidation scope (TIP-008A); governed API RBAC; TypeScript contract closeout (Slice D); loadActorMemberships dedup | Session→context on all non-API surfaces (TIP-010) | Maintain |
| **Enterprise hierarchy (DB)** | `packages/database/src/schema/entity-group.schema.ts`, `legal-entity-ownership.schema.ts` | **implemented** | Tables + services + contract tests; consolidation scope resolver + dedup policy (TIP-008A); ADR-0011 acceptance gate closed; entity_group subsidiary allow/deny RBAC (TIP-008 Slice 4); **008A formal sign-off Complete (Slice 5)** | Maintain only | Maintain |
| **Business master data authority (TIP-008B)** | `packages/kernel/src/contracts/business-master-data/` | **implemented** | Frozen authority registry + wire reference contracts + branded-id trust helpers; contract tests; PKG-R02–R05 aligned | Domain package schemas/services (PKG-R02–R05) | Domain TIPs after Phase 1 |
| **RBAC / Permissions** | `packages/permissions/`, `apps/erp/src/lib/api/` | **implemented** | `PERMISSION_REGISTRY`, policy evaluation, scope/grants; **TIP-010 Complete** — full internal v1 route matrix, system-admin API RBAC, cross-company `company_mismatch` denial ([`tip-010-api-rbac-wiring.md`](../delivery/tips/%5BComplete%5D%20tip-010-api-rbac-wiring.md) Slice 2) | Session→context on all non-API surfaces | TIP-010 identity closeout (out of API wiring doc) |
| **Audit / Observability** | `packages/observability/`, `packages/database/src/audit/` | **partially-implemented** | Audit event contract, builder, writer; ERP Pino logger; correlation ID; spine helper + lifecycle test [`tips/[Complete] tip-012-erp-operating-spine.md`](../delivery/tips/%5BComplete%5D%20tip-012-erp-operating-spine.md); outbox on dashboard PUT; Trigger.dev prod worker **20260623.1** ([`tips/[Complete] tip-011-execution-foundation.md`](../delivery/tips/%5BComplete%5D%20tip-011-execution-foundation.md) Slice 4) | Not all mutations emit audit | TIP-010 continuation |
| **Database / Drizzle** | `packages/database/` | **implemented** | 141+ TS files; schemas: tenant, company, org, membership, audit, policy, entitlement, **outbox**; migrations; seeds; RLS helpers; unified tenant RLS registry (foundation + completion + commercial plans); coverage + schema parity gates (Slice H); live apply gate (Slice G) | No accounting tables (correct) | Maintain |
| **Auth** | `packages/auth/`, `apps/erp/src/app/api/auth/` | **partially-implemented** | Better Auth integration; bootstrap scripts; sign-in via `@afenda/ui` | Session→operating-context bridge incomplete on all surfaces | TIP-010 continuation |
| **API Contract Governance** | `apps/erp/src/server/api/contracts/`, `scripts/api-contract/` | **implemented** | Envelope contracts; `pnpm check:api-contracts`; method-policy + route coverage + idempotency replay + pagination contract ([`tip-010a-api-contract-governance.md`](../delivery/tips/[Complete] tip-010a-api-contract-governance.md)) | Durable idempotency store deferred | Maintain; wire pagination on list routes |
| **Execution / Jobs** | `packages/execution/`, `apps/erp/src/lib/outbox/` | **implemented** | Trigger.dev provider, `publishOutboxEventsTriggerTask`, `trigger.config.ts` (`maxDuration: 3600`); outbox publish service + ERP adapter + lifecycle test; prod worker **20260623.1** task `foundation.publish-outbox-events`; SDK/CLI **4.4.6** | — | Maintain schedule + env sync |
| **Feature Manifest** | `apps/erp/src/lib/modules/generate-module-routes.ts` | **implemented** | Full pipeline: entitlements registry, appshell nav builder, ERP dynamic routes + RBAC guard + layout wiring ([`tip-007a-feature-manifest-governance.md`](../delivery/tips/[Complete]%20tip-007a-feature-manifest-governance.md)) | E2E browser proof optional | Maintain |
| **Feature Flags** | `packages/feature-flags/` | **partially-implemented** | Package exists with contracts | ERP integration incomplete | Phase 7 |
| **System Admin** | `apps/erp/src/app/(protected)/system-admin/`, `apps/erp/src/server/api/contracts/system-admin/` | **implemented** | Layout + users/memberships/roles/permissions/audit/settings pages; section guard + audit on denial; shared access resolver + permission catalog + tenant-scoped audit list; governed admin API contracts (invite, role assign, audit read) + integration tests ([`tip-013-system-admin-control-plane.md`](../delivery/tips/[Complete]%20tip-013-system-admin-control-plane.md) Slices 1–4) | Audit pagination; settings/org mutations | Maintain |
| **ERP Application** | `apps/erp/` | **implemented** | Protected dashboard with `WORKSPACE_HOME_COPY` + `resolveWorkspaceDashboardStatusCopy`; `AppShellMain` titleId/contentLabel contract; governed Skeleton/Alert dashboard UX; metadata production page `/metadata-workspace` + `metadata-production-page.test.tsx`; module placeholder UX; System Admin settings form-layout; System Admin audit DataTable (Slice 7); invite wizard with governed `Label`+`RadioGroupItem` role association (Slices 8, 12); context-switch UX (Slice 9); manifest module placeholders; governed API routes; CSP; tests green under full-suite load (Slice 11); **TIP-UI-05 Complete** (Slices 1–12, DoD #1–24) | — | Maintain |
| **Storybook** | `apps/storybook/` | **implemented** | PKG-021; UI + appshell + metadata-ui stories; test runner | — | Maintain as visual gate |
| **Docs application (`@afenda/docs`)** | `apps/docs/` | **implemented** | Fumadocs MDX + CI gate + porcelain palette + seed content (Slices 1–4); Afenda Docs reference blocks in `packages/ui/src/components/afenda-docs/` + Storybook (Slice 5); MDX editorial blocks in `apps/docs/src/components/blocks/` + `docs-editorial-blocks.css` (Slice 5.1); deploy config `apps/docs/vercel.json` + [`fumadocs-docs-app-deploy.md`](../delivery/support/fumadocs-docs-app-deploy.md) (Slice 6); `quality:docs` ([`tip-032`](../delivery/tips/[Complete]%20tip-032-implementation-documentation.md)) | Live DNS for `docs.afenda.app` — Vercel dashboard operator step | Maintain |
| **Testing Infrastructure** | `packages/testing/`, `vitest.shared.ts` | **implemented** | Shared react setup; interaction test pattern; multi-project vitest | — | Keep AGENTS.md patterns current |
| **CI / Quality Gates** | Root `package.json`, `scripts/governance/`, `scripts/quality/` | **implemented** | `pnpm check`, `pnpm quality` (30+ sub-gates), `pnpm ui:guard`, multi-tenancy matrix; `quality:documentation-drift` | `check:downstream-integration` not in `pnpm quality` aggregator | Optional: wire downstream gate or document as manual |
| **Documentation synchronized** | **implemented** | TIP-000D closeout; ADR-0009–0013 Accepted; `pnpm check:documentation-drift`; tip-status-index synced 2026-06-24; duplicate TIP basename guard | Phase 5/7/8 slice IDs proposed not accepted | Maintain; add §Handoff to remaining partial TIPs |
| **AI Governance** | `packages/ai-governance/`, `docs/ai/` | **implemented** | ADR-0007; quality:ai-governance; change boundaries | — | Maintain |
| **Accounting Core** | — (reserved PKG-R01) | **blocked** | No `@afenda/accounting`; no journal/ledger schemas; `ledger.contract.test.ts` is governance naming only | Intentionally not started | **Do not start until Phase 9 gate** |
| **Pre-accounting foundation readiness** | Cross-cutting | **partially-implemented** | TIP-011 **Complete**; TIP-012 **Complete**; TIP-010A **Complete**; TIP-007A **Complete**; TIP-013 **Complete** (Phase 8 System Admin MVP); TIP-UI-05 **Complete** (Phase 6); Phase 4 RLS proof **Complete** (TIP-007/012 Slice H); **TIP-013A Slice 1** — gate orchestrator + diagnostics UI | Architecture Authority Phase 9 sign-off | Phase 9 gate pass |

---

## Package filesystem inventory (2026-06-23)

| Package | Path | Layer | Files (indicative) | Export map |
| --- | --- | --- | --- | --- |
| `@afenda/architecture-authority` | `packages/architecture-authority` | Platform | Contracts + validators | Yes |
| `@afenda/ai-governance` | `packages/ai-governance` | Platform | Governance validators | Yes |
| `@afenda/appshell` | `packages/appshell` | ERPSpine | 92+ `.tsx` | Yes |
| `@afenda/auth` | `packages/auth` | Platform | Auth provider + Better Auth | Yes |
| `@afenda/database` | `packages/database` | Platform | 141+ `.ts`, schemas, seeds | Yes |
| `@afenda/design-system` | `packages/design-system` | Design | 71 files, no `.tsx` UI | Yes |
| `@afenda/entitlements` | `packages/entitlements` | Integration | Entitlement + feature manifest | Yes |
| `@afenda/execution` | `packages/execution` | Foundation | 21 files, Trigger.dev | Yes |
| `@afenda/feature-flags` | `packages/feature-flags` | Integration | Contracts | Yes |
| `@afenda/kernel` | `packages/kernel` | Platform | 42+ files, context + platform authority contracts | Yes |
| `@afenda/metadata` | `packages/metadata` | Metadata | Authority contracts | Yes |
| `@afenda/metadata-ui` | `packages/metadata-ui` | Metadata | 44+ `.tsx` renderers | Yes |
| `@afenda/observability` | `packages/observability` | Platform | Logging/audit adapters | Yes |
| `@afenda/permissions` | `packages/permissions` | Platform | RBAC engine | Yes |
| `@afenda/storage` | `packages/storage` | Foundation | Tenant-scoped storage | Yes |
| `@afenda/testing` | `packages/testing` | Integration | Test utilities | Yes |
| `@afenda/typescript-config` | `packages/typescript-config` | Platform (tooling) | TS presets | Config |
| `@afenda/ui` | `packages/ui` | Design | 58 components, 68+ tests | Yes |
| `@afenda/erp` | `apps/erp` | Application | 199 TS/TSX | No (app) |
| `@afenda/storybook` | `apps/storybook` | Application | Storybook app | No (app) |
| `@afenda/docs` | `apps/docs` | Application | Fumadocs docs app (17+ TS/TSX) | No (app) |

**Missing directories (recorded, not invented):**

- `docs/tip/` — does not exist; TIPs live in `docs/delivery/tips/[status] tip-*.md`
- `docs/roadmap/` — does not exist; replaced by `pre-accounting-foundation-roadmap.md`
- `packages/features-*` — no feature packages exist

---

## Governance scripts evidence

| Script prefix | Count | Purpose |
| --- | --- | --- |
| `check:multi-tenancy-*` | 15 | Multi-tenancy foundation gates |
| `quality:*` | 30+ | CI quality matrix |
| `ui:guard*` | 4 | TIP-004 consumption enforcement |
| `check:api-contracts` | 1 | API contract validation |
| `architecture:*` | 5 | Drift, owners, dependencies |

Run: `pnpm quality` for full matrix (post `build:governance-dist`).

---

## Accounting readiness pre-check (Phase 9 preview)

| Requirement | Status | Evidence |
| --- | --- | --- |
| Multi-tenant operation | partial | Tenant schema + resolver |
| Multi-company operation | partial | `companies` schema + legal entity context |
| Multi-organization operation | partial | `organizations` schema + org unit context |
| Multi-workspace operation | partial | Workspace contract + dashboard API |
| Holding company structures | partial | `entity_groups` + glossary |
| Subsidiaries | partial | Ownership interest schema |
| Minor interest ownership | partial | `relationshipType: minority_interest` in glossary + schema |
| Consolidation preparation | partial | `consolidation-scope-context.contract.ts` + `consolidation-scope-resolution.server.ts` + `hierarchy-id-boundary.contract.ts` + ERP `resolve-consolidation-scope.server.ts` |
| Legal vs operating entity | documented | Glossary sections |
| RBAC by context | partial | TIP-010 API slice |
| RLS / DB isolation | implemented | Unified tenant RLS registry; artifact gate (`check:database-tenant-rls-coverage`) with schema parity; live apply gate (`check:database-tenant-rls-live`, environment-specific) — **Slices F–H signed off** |
| Auditability | partial | Audit writer exists; coverage incomplete |
| API contract stability | partial | Envelope pattern started |
| System Admin control plane | implemented | `system-admin` layout + pages + governed API contracts (Slices 1–4) |
| Phase 9 gate orchestrator | implemented | `check-accounting-readiness-gate.mts` + registry (10 requirements); `pnpm check:accounting-readiness-gate`; wired in `ci.yml` (structure-only) + `release-verification.yml` (full delegated) via TIP-009 `quality:release-gate` |
| Phase 9 diagnostics UI | implemented | `/system-admin/diagnostics` live gate status + sign-off banner + on-demand full refresh (Slices 3–4) |
| Documentation synchronized | **implemented** | Runtime matrix + tip-status-index + delivery TIPs synced 2026-06-24 |

**Verdict:** Accounting Readiness Gate **NOT PASSED** (automated evidence chain delivered; Architecture Authority human sign-off pending).

---

*Runtime truth matrix — update after each foundation phase completes.*
