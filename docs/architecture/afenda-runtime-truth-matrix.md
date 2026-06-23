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
| **Architecture Authority** | `packages/architecture-authority/` | **implemented** | Package exists; `pnpm quality:architecture`, `quality:architecture-drift`; registries in `docs/architecture/` | Baseline fingerprint still `2026-06-20-v1`; PKG-021 storybook in registry but count narrative stale in master plan | Bump baseline fingerprint after ADR acceptance; keep registry synced |
| **Package Ownership** | `docs/architecture/ownership-registry.md` | **implemented** | Registry file + `pnpm architecture:owners` | Sign-off pending on baseline | Architecture Authority sign-off |
| **Dependency Governance** | `docs/architecture/dependency-registry.md`, `packages/architecture-authority/` | **implemented** | Registry + `pnpm quality:boundaries` | New edges (appshell→design-system, erp→ui) need registry verification | Run `pnpm architecture:dependencies`; update registry on new edges |
| **Design System** | `packages/design-system/` | **partially-implemented** | Token registry, recipes, `generate-tokens-css.ts`, contrast tests; **no runtime UI** (by design) | No component implementations in design-system (correct — lives in `@afenda/ui`) | Maintain authority-only boundary; TIP-003/004 complete |
| **UI Primitives** | `packages/ui/src/components/` | **implemented** | 58 component files; 68+ tests; `resolvePrimitiveGovernance()`; stories | ADR-0008 ref-as-prop migration deferred; P1 components may exceed P0 inventory | Mark TIP-UI-02 complete; track ADR-0008 separately |
| **UI Consumption (TIP-004)** | `scripts/governance/ui-guard.mjs`, `docs/governance/tip-004-policy.md` | **implemented** | Gate D/F scripts; consumer rules in AGENTS.md | Ongoing enforcement as new blocks land | `pnpm ui:guard:scan` on appshell/erp changes |
| **AppShell** | `packages/appshell/` | **partially-implemented** | 92 `.tsx` files; `afenda-appshell.css`; shadcn-studio blocks; dashboard canvas; tests | TIP-006 authority contracts not frozen (`tip-006` verdict stale); no production ERP shell route beyond dev harness | Complete TIP-006 contracts; wire ApplicationShell in ERP |
| **Metadata UI** | `packages/metadata-ui/` | **partially-implemented** | Renderers: `default-section-renderers.tsx`, surfaces, layouts, actions, 44 `.tsx` files, tests | TIP-UI-04 doc says "Not started"; no production ERP metadata-driven pages | Update TIP-UI-04 status; wire renderers in ERP module surfaces |
| **Metadata Authority** | `packages/metadata/` | **implemented** | Contracts, registries, validation tests | — | Maintain; no renderers here (correct) |
| **Kernel Execution Context** | `packages/kernel/src/context/` | **partially-implemented** | `context-registry.ts` — 10 required operating-context modules + support modules; branded IDs; Result type | Master plan listed 6 "missing" contexts — **obsolete claim**; consolidation resolution is stub | Update docs; implement consolidation resolution (non-accounting) |
| **Multi-tenancy** | `docs/architecture/multi-tenancy.md`, `apps/erp/src/lib/context/` | **partially-implemented** | Full delivery evidence: `tip-007-012-enterprise-group-operating-context.md`; resolver pipeline; 15+ governance scripts | Tenant URL routing proven; not all ERP routes use resolver | Complete route coverage; Phase 2 spine |
| **Enterprise hierarchy (DB)** | `packages/database/src/schema/entity-group.schema.ts`, `legal-entity-ownership.schema.ts` | **partially-implemented** | Tables + services + contract tests | TIP-008 doc says "Not started"; no consolidation arithmetic (correct deferral) | Split TIP-008A (hierarchy) vs TIP-008B (business master data) |
| **RBAC / Permissions** | `packages/permissions/`, `packages/database/` role-permission | **partially-implemented** | `PERMISSION_REGISTRY`, policy evaluation, scope/grants modules; TIP-010 API wiring | Not all protected ERP actions gated; System Admin permissions undefined | Phase 3 + Phase 8 |
| **Audit / Observability** | `packages/observability/`, `packages/database/src/audit/` | **partially-implemented** | Audit event contract, builder, writer; ERP Pino logger; correlation ID | Not all mutations emit audit; observability sink partial | TIP-011/012 closeout |
| **Database / Drizzle** | `packages/database/` | **partially-implemented** | 141+ TS files; schemas: tenant, company, org, membership, audit, policy, entitlement; migrations; seeds; RLS helpers | No outbox table; no accounting tables (correct); RLS DB policies need verification | TIP-011 outbox; Phase 4 RLS proof |
| **Auth** | `packages/auth/`, `apps/erp/src/app/api/auth/` | **partially-implemented** | Better Auth integration; bootstrap scripts; sign-in via `@afenda/ui` | Session→operating-context bridge incomplete on all surfaces | TIP-010 continuation |
| **API Contract Governance** | `apps/erp/src/server/api/contracts/`, `scripts/api-contract/` | **partially-implemented** | Envelope contracts, health, workspace dashboard-layout; `pnpm check:api-contracts` | Small route surface; internal vs public separation incomplete | Phase 5 — extend to all routes |
| **Execution / Jobs** | `packages/execution/` | **partially-implemented** | Trigger.dev provider, registry, job contracts, tests | **No outbox** — only metadata vocabulary references outbox | TIP-011 — outbox schema + worker |
| **Feature Manifest** | `packages/entitlements/src/evaluation/feature-manifest.ts` | **documented-only** | `FeatureManifestContract` interface + catalog array | No ERP navigation generation; no module route manifest pipeline | Phase 7 |
| **Feature Flags** | `packages/feature-flags/` | **partially-implemented** | Package exists with contracts | ERP integration incomplete | Phase 7 |
| **System Admin** | `apps/erp/src/app/` | **missing** | No `system-admin` routes (grep verified) | Users, roles, permissions, modules, audit viewer UI absent | Phase 8 — blocker before accounting |
| **ERP Application** | `apps/erp/` | **partially-implemented** | 199 TS/TSX files; globals.css; protected dashboard; API routes; CSP; context resolution; tests | Module placeholders (Manufacturing, Inventory, Sales, Accounting, HRM) missing; only 6 page routes | TIP-UI-05 completion |
| **Storybook** | `apps/storybook/` | **implemented** | PKG-021; UI + appshell + metadata-ui stories; test runner | — | Maintain as visual gate |
| **Testing Infrastructure** | `packages/testing/`, `vitest.shared.ts` | **implemented** | Shared react setup; interaction test pattern; multi-project vitest | — | Keep AGENTS.md patterns current |
| **CI / Quality Gates** | Root `package.json`, `scripts/governance/`, `scripts/quality/` | **implemented** | `pnpm check`, `pnpm quality` (30+ sub-gates), `pnpm ui:guard`, multi-tenancy matrix | Delivery evidence surface check may not cover all stale TIP statuses | Add doc-status hygiene to Phase 0 |
| **Documentation Governance** | `docs/architecture/`, `docs/delivery/`, `docs/governance/`, `docs/adr/` | **partially-implemented** | 69+ markdown docs; glossary; multi-tenancy guide | **`docs/tip/` missing**; **`docs/roadmap/` missing**; master plan v4 stale; multiple TIP status drift | This audit + v5 master plan |
| **AI Governance** | `packages/ai-governance/`, `docs/ai/` | **implemented** | ADR-0007; quality:ai-governance; change boundaries | — | Maintain |
| **Accounting Core** | — (reserved PKG-R01) | **blocked** | No `@afenda/accounting`; no journal/ledger schemas; `ledger.contract.test.ts` is governance naming only | Intentionally not started | **Do not start until Phase 9 gate** |
| **Pre-accounting foundation readiness** | Cross-cutting | **partially-implemented** | Strong architecture + multi-tenancy + UI foundation | Outbox, System Admin, feature manifest, spine lifecycle, doc sync | Execute Phases 0–9 roadmap |

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

- `docs/tip/` — does not exist; TIPs live in `docs/delivery/tip-*.md`
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
