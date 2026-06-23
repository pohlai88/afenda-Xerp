# Afenda ERP — Runtime Truth Matrix

| Field | Value |
|-------|-------|
| **As-of date** | 2026-06-23 |
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
| **AppShell** | `packages/appshell/` | **partially-implemented** | 92 `.tsx` files; `afenda-appshell.css`; shadcn-studio blocks; dashboard canvas; tests | TIP-006 authority contracts not frozen (`tip-006` verdict stale); no production ERP shell route beyond dev harness | Complete TIP-006 contracts; wire ApplicationShell in ERP |
| **Metadata UI** | `packages/metadata-ui/` | **partially-implemented** | Renderers: `default-section-renderers.tsx`, surfaces, layouts, actions, 44 `.tsx` files, tests | Production ERP metadata-driven pages incomplete | TIP-UI-04 continuation |
| **Metadata Authority** | `packages/metadata/` | **implemented** | Contracts, registries, validation tests | — | Maintain; no renderers here (correct) |
| **Kernel Execution Context** | `packages/kernel/src/context/` | **implemented** | `context-registry.ts` — 10 required modules; public barrel exports; `quality:kernel-context-surface` passes | Consolidation resolution remains stub (non-accounting) | TIP-008 consolidation resolver when ready |
| **Multi-tenancy** | `docs/architecture/multi-tenancy.md`, `apps/erp/src/lib/context/` | **partially-implemented** | Full delivery evidence: [`tips/[Partially Implemented] tip-007-012-enterprise-group-operating-context.md`](../delivery/tips/%5BPartially%20Implemented%5D%20tip-007-012-enterprise-group-operating-context.md); resolver pipeline; 15+ governance scripts | Tenant URL routing proven; not all ERP routes use resolver | Complete route coverage; Phase 2 spine |
| **Enterprise hierarchy (DB)** | `packages/database/src/schema/entity-group.schema.ts`, `legal-entity-ownership.schema.ts` | **partially-implemented** | Tables + services + contract tests | TIP-008 doc says "Not started"; no consolidation arithmetic (correct deferral) | Split TIP-008A (hierarchy) vs TIP-008B (business master data) |
| **RBAC / Permissions** | `packages/permissions/`, `packages/database/` role-permission | **partially-implemented** | `PERMISSION_REGISTRY`, policy evaluation, scope/grants modules; TIP-010 API wiring | Not all protected ERP actions gated; System Admin permissions undefined | Phase 3 + Phase 8 |
| **Audit / Observability** | `packages/observability/`, `packages/database/src/audit/` | **partially-implemented** | Audit event contract, builder, writer; ERP Pino logger; correlation ID; spine helper + lifecycle test [`tips/[Partially Implemented] tip-012-erp-operating-spine.md`](../delivery/tips/%5BPartially%20Implemented%5D%20tip-012-erp-operating-spine.md); outbox on dashboard PUT; Trigger.dev prod worker **20260623.1** ([`tips/[Complete] tip-011-execution-foundation.md`](../delivery/tips/%5BComplete%5D%20tip-011-execution-foundation.md) Slice 4) | Not all mutations emit audit | TIP-010 continuation |
| **Database / Drizzle** | `packages/database/` | **partially-implemented** | 141+ TS files; schemas: tenant, company, org, membership, audit, policy, entitlement, **outbox**; migrations; seeds; RLS helpers | No accounting tables (correct); RLS DB policies need verification | Phase 4 RLS proof |
| **Auth** | `packages/auth/`, `apps/erp/src/app/api/auth/` | **partially-implemented** | Better Auth integration; bootstrap scripts; sign-in via `@afenda/ui` | Session→operating-context bridge incomplete on all surfaces | TIP-010 continuation |
| **API Contract Governance** | `apps/erp/src/server/api/contracts/`, `scripts/api-contract/` | **partially-implemented** | Envelope contracts; `pnpm check:api-contracts`; canonical spec [`tip-010a-api-contract-governance.md`](../delivery/tips/[Not started] tip-010a-api-contract-governance.md) | Registry below 100%; idempotency/pagination missing | TIP-010A Slice 1 |
| **Execution / Jobs** | `packages/execution/`, `apps/erp/src/lib/outbox/` | **implemented** | Trigger.dev provider, `publishOutboxEventsTriggerTask`, `trigger.config.ts` (`maxDuration: 3600`); outbox publish service + ERP adapter + lifecycle test; prod worker **20260623.1** task `foundation.publish-outbox-events`; SDK/CLI **4.4.6** | — | Maintain schedule + env sync |
| **Feature Manifest** | `packages/entitlements/src/evaluation/feature-manifest.ts` | **documented-only** | `FeatureManifestContract` + catalog; canonical spec [`tip-007a-feature-manifest-governance.md`](../delivery/tips/[Not started] tip-007a-feature-manifest-governance.md) | No nav/route pipeline | TIP-007A Slice 1 |
| **Feature Flags** | `packages/feature-flags/` | **partially-implemented** | Package exists with contracts | ERP integration incomplete | Phase 7 |
| **System Admin** | `apps/erp/src/app/` | **missing** | No `system-admin` routes; canonical spec [`tip-013-system-admin-control-plane.md`](../delivery/tips/[Not started] tip-013-system-admin-control-plane.md) | Full control plane UI + API absent | TIP-013 Slice 1 |
| **ERP Application** | `apps/erp/` | **partially-implemented** | 199 TS/TSX files; globals.css; protected dashboard; API routes; CSP; context resolution; tests | Module placeholders (Manufacturing, Inventory, Sales, Accounting, HRM) missing; only 6 page routes | TIP-UI-05 completion |
| **Storybook** | `apps/storybook/` | **implemented** | PKG-021; UI + appshell + metadata-ui stories; test runner | — | Maintain as visual gate |
| **Testing Infrastructure** | `packages/testing/`, `vitest.shared.ts` | **implemented** | Shared react setup; interaction test pattern; multi-project vitest | — | Keep AGENTS.md patterns current |
| **CI / Quality Gates** | Root `package.json`, `scripts/governance/`, `scripts/quality/` | **implemented** | `pnpm check`, `pnpm quality` (30+ sub-gates), `pnpm ui:guard`, multi-tenancy matrix; `quality:documentation-drift` | `check:downstream-integration` not in `pnpm quality` aggregator | Optional: wire downstream gate or document as manual |
| **Documentation Governance** | `docs/architecture/`, `docs/delivery/`, `docs/governance/`, `docs/adr/` | **implemented** | TIP-000D closeout; ADR-0009–0013 Accepted; `pnpm check:documentation-drift`; tip-status-index **Implementation workflow**; TIP-011/012 §Handoff blocks | Phase 5/7/8 slice IDs proposed not accepted | Maintain; add §Handoff to remaining partial TIPs |
| **AI Governance** | `packages/ai-governance/`, `docs/ai/` | **implemented** | ADR-0007; quality:ai-governance; change boundaries | — | Maintain |
| **Accounting Core** | — (reserved PKG-R01) | **blocked** | No `@afenda/accounting`; no journal/ledger schemas; `ledger.contract.test.ts` is governance naming only | Intentionally not started | **Do not start until Phase 9 gate** |
| **Pre-accounting foundation readiness** | Cross-cutting | **partially-implemented** | TIP-011 **Complete** (Slices 1–4); TIP-012 Slices 1–2 (spine + lifecycle); TIP-010A/007A/013 promoted | System Admin UI; TIP-012 doc sync | TIP-010A → TIP-013 when Phase 8 starts |

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
| `@afenda/kernel` | `packages/kernel` | Platform | 38 files, context contracts | Yes |
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
| `@afenda/docs` | `apps/docs` | Application | Docs app | No (app) |

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
| Consolidation preparation | partial | `consolidation-scope-context.contract.ts` + stub resolver |
| Legal vs operating entity | documented | Glossary sections |
| RBAC by context | partial | TIP-010 API slice |
| RLS / DB isolation | partial | RLS helpers; full proof pending |
| Auditability | partial | Audit writer exists; coverage incomplete |
| API contract stability | partial | Envelope pattern started |
| System Admin control plane | **missing** | No admin routes |
| Documentation synchronized | **in progress** | This audit |

**Verdict:** Accounting Readiness Gate **NOT PASSED** — proceed with Phases 0–8.

---

*Runtime truth matrix — update after each foundation phase completes.*
