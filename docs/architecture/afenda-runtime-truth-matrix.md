# Afenda ERP — Runtime Truth Matrix

| Field | Value |
|-------|-------|
| **As-of date** | 2026-06-25 |
| **Audit** | [`afenda-documentation-drift-audit.md`](afenda-documentation-drift-audit.md) |
| **Roadmap** | [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) (Phases 0–9 complete) |
| **Implementation authority** | [`foundation-delivery-authority.md`](foundation-delivery-authority.md) (FDR — ADR-0014) |
| **Evidence rule** | Status requires file, test, export, script, or schema proof — not TIP delivery doc claims alone |

**Status vocabulary:** `implemented` · `partially-implemented` · `documented-only` · `runtime-only` · `drifted` · `obsolete` · `blocked`

**Matrix vs FDR delivery (ADR-0016):** This matrix describes **runtime truth** (files, tests, gates). FDR docs under [`docs/delivery/FDR/`](../delivery/FDR/) describe **delivery authority** (Research attestation, §Remaining gaps, enterprise readiness). A row may be **implemented** while its FDR is **Not started** or **Partially Implemented** — that gap is an **improvement opportunity**, not a contradiction. Close it via FDR Research + Evidence-sync slices; do not copy matrix labels into FDR Status without gate-backed attestation.

---

## Matrix

| Area | Runtime package / path | FDR authority | Current status | Evidence | Gaps | Required action |
| --- | --- | --- | --- | --- | --- | --- |
| **Architecture Authority** | `packages/architecture-authority/` | [`fdr-019-architecture-maps`](../delivery/FDR/[Not%20started]%20fdr-019-architecture-maps.md) — Partially Implemented (Research Slice 1 ✓) | **implemented** | Package exists; Slice 1 gate log exit 0 (`quality:architecture`, `quality:architecture-drift`, `check:foundation-disposition`, 13/13 PKG tests); registries in `docs/architecture/` | PKG-019 + PKG-017 lack disposition entries; FDR Complete blocked until Slice 2 registry-sync | Slice 2 registry onboard (`foundation-registry-owner`) |
| **Package Ownership** | `docs/architecture/ownership-registry.md` | — (governance doc) | **implemented** | Registry file + `pnpm architecture:owners` | Sign-off pending on baseline | Architecture Authority sign-off |
| **Dependency Governance** | `docs/architecture/dependency-registry.md`, `packages/architecture-authority/` | [`fdr-019-architecture-maps`](../delivery/FDR/[Not%20started]%20fdr-019-architecture-maps.md) — Partially Implemented | **implemented** | Registry + `pnpm quality:boundaries` (exit 0 — Slice 1 attested) | New edges (appshell→design-system, erp→ui) need registry verification | Run `pnpm architecture:dependencies`; update registry on new edges |
| **Design System** | `packages/design-system/` | [`fdr-004-design-authority`](../delivery/FDR/[Partially%20Implemented]%20fdr-004-design-authority.md) — Partially Implemented | **partially-implemented** | Token registry, recipes, `generate-tokens-css.ts`, contrast tests; **no runtime UI** (by design) | Registry row `PKG004_DESIGN` pending | Registry-sync Slice 2 |
| **UI Primitives** | `packages/ui/src/components/` | [`fdr-018-governed-primitives`](../delivery/FDR/[Not%20started]%20fdr-018-governed-primitives.md) — Not started | **implemented** | 58 component files; 68+ tests; `resolvePrimitiveGovernance()`; stories | ADR-0008 ref-as-prop migration deferred; FDR amber closeout pending | FDR Research + ADR-0008 track |
| **UI Consumption (TIP-004)** | `scripts/governance/ui-guard.mjs`, `docs/governance/tip-004-policy.md` | [`fdr-018-ui-consumption`](../delivery/FDR/[Not%20started]%20fdr-018-ui-consumption.md) — Not started | **implemented** | Gate D/F scripts; consumer rules in AGENTS.md | FDR not reconciled with tip-004 **Complete** archive | Research Slice 1; `pnpm ui:guard:scan` on changes |
| **shadcn/studio (ADR-0017)** | `packages/appshell/src/shadcn-studio/` · agent skill [`.cursor/skills/afenda-shadcn-components/`](../../.cursor/skills/afenda-shadcn-components/SKILL.md) | [`ADR-0017`](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) Proposed | **implemented** | 29+ governed blocks; `STUDIO-PATTERN-MAP.md`; `afenda-appshell-studio.css`; 3-layer token chain; per-block promotion pipeline (Q1–Q3 filter); `pnpm ui:guard` A–G | ADR-0017 acceptance; MCP `shadcn` cwd wiring (`apps/erp` → `packages/ui`) | Accept ADR-0017; MCP cwd fix — **no bulk migration FDR** |
| **AppShell** | `packages/appshell/` | [`fdr-001-shell-composition`](../delivery/FDR/[Partially%20Implemented]%20fdr-001-shell-composition.md) **29/30 audit-adjusted** · [`fdr-001-manifest-nav`](../delivery/FDR/[Complete]%20fdr-001-manifest-nav.md) Complete | **implemented** | 93+ `.tsx`; contracts; governance tests (368 PKG tests); ERP `(protected)/layout.tsx` wiring; Slice 3 gate log exit 0 | DoD #14 peer review (`shell-composition-complete-status`); E2E waived | DoD #14 peer review → Complete promotion |
| **Metadata UI** | `packages/metadata-ui/` | [`fdr-012-metadata-renderers`](../delivery/FDR/[Partially%20Implemented]%20fdr-012-metadata-renderers.md) — Partially Implemented | **implemented** | Renderers + ERP `/metadata-workspace` route; production proof tests | Registry row `PKG012_METADATA_UI` pending | Registry-sync Slice 2 |
| **Metadata Authority** | `packages/metadata/` | [`fdr-011-metadata-authority`](../delivery/FDR/[Partially%20Implemented]%20fdr-011-metadata-authority.md) — Partially Implemented | **implemented** | Contracts, registries, validation tests (153 tests) | Registry row `PKG011_METADATA` pending | Registry-sync Slice 2 |
| **Kernel Execution Context** | `packages/kernel/src/context/` | [`fdr-010-context-contracts`](../delivery/FDR/[Partially%20Implemented]%20fdr-010-context-contracts.md) Partially Implemented | **implemented** | 10 required context modules; consolidation scope; `quality:kernel-context-surface` (dist freshness gap in FDR) | `dist/` gate may fail until package build | Slice 2 dist freshness; peer review |
| **Platform Authority (TIP-007)** | `packages/kernel/src/contracts/platform/` | [`fdr-010-platform-authority`](../delivery/FDR/[Partially%20Implemented]%20fdr-010-platform-authority.md) 29/30 candidate | **implemented** | 11 ADR-0001 entities; governed barrel + drift tests | DoD #14 peer review before Complete | PR peer review |
| **Multi-tenancy** | `docs/architecture/multi-tenancy.md`, `apps/erp/src/lib/context/` | [`fdr-007-operating-context`](../delivery/FDR/[Partially%20Implemented]%20fdr-007-operating-context.md) **28/30 audit · 29/30 ceiling** | **implemented** | Resolver pipeline; protected surface registry; RSC bridge audit; context-switch UX + session workspace hint merge (FR-A05.2); governed API RBAC; Slice 2 gate refresh 2026-06-25 | Dedicated operating-context matrix row deferred Slice 3 | Slice 3 Evidence-sync; peer review |
| **Enterprise hierarchy (DB)** | `packages/database/src/schema/entity-group.schema.ts` | [`fdr-003-persistence`](../delivery/FDR/[Partially%20Implemented]%20fdr-003-persistence.md) · [`fdr-003-tenant-rls`](../delivery/FDR/[Complete]%20fdr-003-tenant-rls.md) **Complete — 29/30** | **implemented** | Tables + services; RLS registry + live apply gates (169 tests); ADR-0011 closed | New `tenant_id` tables need persistence coordination | Maintain |
| **Business master data authority (TIP-008B)** | `packages/kernel/src/contracts/business-master-data/` | [`fdr-010-master-data-authority`](../delivery/FDR/[Partially%20Implemented]%20fdr-010-master-data-authority.md) 29/30 candidate | **implemented** | Frozen authority registry + wire contracts + tests | Domain PKG-R02–R05 schemas not started | Domain packages after Phase 1 |
| **RBAC / Permissions** | `packages/permissions/`, `apps/erp/src/lib/api/` | [`fdr-014-rbac`](../delivery/FDR/[Complete]%20fdr-014-rbac.md) **Complete — 29/30** · PKG014_PERMISSIONS | **implemented** | `PERMISSION_REGISTRY`, 62 tests; API RBAC wired (tip-010); scope/grants surface gate exit 0 | Session→context residual (out of PKG-014; identity FDR) | Maintain |
| **Audit / Observability** | `packages/observability/`, `packages/database/src/audit/` | [`fdr-013-audit-coverage`](../delivery/FDR/[Complete]%20fdr-013-audit-coverage.md) **Complete — 29/30** · [`fdr-013-logging-tracing`](../delivery/FDR/[Partially%20Implemented]%20fdr-013-logging-tracing.md) **29/30 audit-adjusted** · PKG013_AUDIT + PKG013_LOGGING | **implemented** | Governed mutation + diagnostic logging registries complete; fail-closed audit inventory scan; Pino + correlation spine (66 PKG tests, `quality:erp-observability` exit 0) | DoD #14 peer review (`fdr-013-logging-tracing`); E2E waived | logging-tracing Slice 4 Complete promotion |
| **Database / Drizzle** | `packages/database/` | [`fdr-003-persistence`](../delivery/FDR/[Partially%20Implemented]%20fdr-003-persistence.md) **27/30 audit-adjusted** (29/30 ceiling) · [`fdr-003-tenant-rls`](../delivery/FDR/[Complete]%20fdr-003-tenant-rls.md) **Complete — 29/30** | **implemented** | 175+ tests; 34 migrations incl. `tenant_settings` (+ `integrations` JSONB) + `user_preferences` (ARCH-USER-001 Slice 4A) + RLS + `auth_session.active_workspace_id` (FR-A05.2.1); RLS registry + live apply gates | `fdr-003-persistence` peer review pending | Maintain |
| **Auth** | `packages/auth/`, `apps/erp/src/app/api/auth/` | [`fdr-002-auth-disposition`](../delivery/FDR/[Complete]%20fdr-002-auth-disposition.md) **Complete — 29/30** · PKG002_AUTH · [ARCH-AUTH-001](../ARCH/[Partially%20Implemented]%20ARCH-AUTH-001-enterprise-authentication.md) slices 1–9 ✓ · FR-A05.2.1 + FR-A05.2 ERP ✓ (ARCH Partially Implemented — waivers remain) | **implemented** | Better Auth; session→context bridge; `auth.mirror-sync` · `auth.mfa-policy` · `auth.invitation`; system-admin Members/Security UI (`account-settings-05/06`); workspace session contract (`activeWorkspaceId` persisted on `auth_session` · ERP resolver merge · `AUTH_EVENT.workspaceContextSwitched` on switch); **104/104 PKG tests**; integration attestation pass (Slice 7 multiSession) | in-memory invitations (`AUTH-INV-001`); MFA enroll UI (`AUTH-MFA-UI-001`); enterprise SSO/passkey deferred (`AUTH-PHASE3-001`) | Waiver review; durable `member_invitations` table |
| **API Contract Governance** | `apps/erp/src/server/api/contracts/` | [`fdr-007-api-governance`](../delivery/FDR/[Partially%20Implemented]%20fdr-007-api-governance.md) **27/30 audit · 29/30 ceiling** | **implemented** | `pnpm check:api-contracts`; envelope + route coverage tests (19); v2 gate refresh 2026-06-25 | Durable idempotency store deferred | Maintain; peer review (DoD #14) |
| **Execution / Jobs** | `packages/execution/`, `apps/erp/src/lib/outbox/` | [`fdr-008-outbox-jobs`](../delivery/FDR/[Complete]%20fdr-008-outbox-jobs.md) **Complete — 29/30** · PKG008_EXECUTION | **implemented** | Trigger.dev worker **20260623.1**; outbox publish + lifecycle tests (48 PKG tests exit 0) | — | Maintain |
| **Feature Manifest** | `apps/erp/src/lib/modules/` + `@afenda/entitlements` | [`fdr-001-manifest-nav`](../delivery/FDR/[Complete]%20fdr-001-manifest-nav.md) **Complete** · [`fdr-006-feature-manifest`](../delivery/FDR/[Partially%20Implemented]%20fdr-006-feature-manifest.md) **27/30 audit-adjusted** · PKG006_FEATURE_MANIFEST | **implemented** | Full pipeline: entitlements → appshell nav → ERP routes + RBAC guard + active-route highlight | DoD #14 peer review (fdr-006) | Evidence-sync / peer review |
| **Entitlements evaluation** | `packages/entitlements/` | [`fdr-006-entitlements`](../delivery/FDR/[Partially%20Implemented]%20fdr-006-entitlements.md) **26/30 audit-adjusted** · PKG006_ENTITLEMENTS | **implemented** | 52 tests; feature manifest registry; flag engine; check:governance | DoD #14 peer review; ERP consumer wiring | Evidence-sync / peer review |
| **Feature Flags** | `packages/feature-flags/`, `apps/erp/src/lib/rollout/` | [`fdr-009-rollout-flags`](../delivery/FDR/[Partially%20Implemented]%20fdr-009-rollout-flags.md) **29/30 audit-adjusted** · PKG009_FEATURE_FLAGS | **partially-implemented** | 24 PKG tests + ERP rollout resolver; evaluation facade; kill-switch service | DoD #14 peer review; route-level gating deferred | Peer review (DoD #14) |
| **System Admin** | `apps/erp/src/app/(protected)/system-admin/` | [`fdr-007-system-admin`](../delivery/FDR/[Partially%20Implemented]%20fdr-007-system-admin.md) **29/30 audit-adjusted** · PKG007_ADMIN · [ARCH-ADMIN-001](../ARCH/[Partially%20Implemented]%20ARCH-ADMIN-001-system-admin-control-plane.md) **Slices 1–7 ✓** | **implemented** | Seven sections; mutation audit registry (settings + invite resend/revoke); `check:system-admin-mutation-audit` exit 0; `tenant_settings` persistence (notifications/workspace/billing/integrations) via server actions; General tab `AppShellAccountSettings01`; live Members roster (Slice 3); Security user MFA enable/disable (Slice 4); settings audit waiver closed (Slice 5); FDR waiver evidence-sync (Slice 7); `quality:migrations` exit 0; `ui:guard:scan` exit 0; ERP test:run 613+ pass | DoD #14 peer review | Peer review (DoD #14) |
| **User Settings** | `apps/erp/src/app/(protected)/settings/` | [`fdr-007-ux-surfaces`](../delivery/FDR/[Partially%20Implemented]%20fdr-007-ux-surfaces.md) · [ARCH-USER-001](../ARCH/[Partially%20Implemented]%20ARCH-USER-001-user-settings-self-service.md) | **partially-implemented** | ARCH-USER-001 Slices 1–7 ✓ — four v1 tabs (profile/security/notifications/preferences); `user_preferences` persistence; dual-surface split; USER notification copy; preferences display section; doc drift exit 0 | DoD #14–20 peer review; AC-U01/U08/U11–U12 integration tests; email change UI (ARCH-AUTH-001) | Peer review + integration AC closure |
| **ERP Application** | `apps/erp/` | [`fdr-007-ux-surfaces`](../delivery/FDR/[Partially%20Implemented]%20fdr-007-ux-surfaces.md) **26/30 audit · 28/30 ceiling** · PKG-007 siblings | **implemented** | TIP-UI-05 Complete; governed surfaces; CSP; ui:guard 243 files; **658/658 tests** (124 files, validated 2026-06-25) | DoD #14 peer review | Evidence-sync / peer review |
| **Storybook** | `apps/storybook/` | [`fdr-021-storybook`](../delivery/FDR/[Not%20started]%20fdr-021-storybook.md) — Not started · **Research Slice 1 ✓** | **implemented** | `typecheck` exit 0; colocated ui/appshell/metadata-ui stories; `ui:guard:scan` exit 0 | `test:storybook:run` exit 1 (400/1860 failed — import + a11y taxonomy in FDR §Research) | Slice 2 registry onboard; Slice 3 runner green |
| **Docs application (`@afenda/docs`)** | `apps/docs/` | [`fdr-005-docs-app`](../delivery/FDR/[Partially%20Implemented]%20fdr-005-docs-app.md) · [ARCH-APPS-001](../ARCH/[Partially%20Implemented]%20ARCH-APPS-001-applications-book.md) **Slices 1–3 ✓** | **implemented** | Fumadocs + `quality:docs` (15 SSG routes); Applications Book at `/docs/apps/**`; `PKG005_DOCS` registry row; 83 vitest tests; no-ERP import scans | Live DNS operator step (`docs-live-dns`); DoD #14 peer review | Peer review (DoD #14) |
| **Testing Infrastructure** | `packages/testing/`, `vitest.shared.ts` | [`fdr-016-test-utilities`](../delivery/FDR/[Partially%20Implemented]%20fdr-016-test-utilities.md) — Partially Implemented | **implemented** | Shared react setup; interaction pattern | Registry row `PKG016_TESTING` pending | Registry-sync Slice 2 |
| **Tenant storage** | `packages/storage/` | [`fdr-015-tenant-storage`](../delivery/FDR/[Partially%20Implemented]%20fdr-015-tenant-storage.md) **29/30 audit-adjusted** · `PKG015_STORAGE` | **implemented** | Contracts, R2/Blob providers, 15 tests incl. `tenant-denial.test.ts`; registry aligned; Slice 3 gate log exit 0 | ERP consumer wiring (waiver `storage-erp-e2e`); audit deferred (waiver `storage-audit-deferred`) | DoD #14 peer review |
| **TypeScript config** | `packages/typescript-config/` | [`fdr-017-ts-config`](../delivery/FDR/[Partially%20Implemented]%20fdr-017-ts-config.md) — **Partially Implemented · 20/30** · active-exempt | **implemented** | 11 JSON presets; consumer audit Grade A (21/21 primary) | Slice 2 registry onboard (`PKG017_*`) | Registry-sync Slice 2 |
| **CI / Quality Gates** | Root `package.json`, `scripts/governance/` | — (cross-cutting) | **implemented** | `pnpm check`, `pnpm quality` (30+ sub-gates) | `check:downstream-integration` not in aggregator | Optional wiring |
| **Documentation synchronized** | docs + ADRs | FDR fleet (33 docs) | **implemented** | ADR-0014/0016; FDR scaffolds upgraded 2026-06-25 | Matrix/FDR drift rows being closed | Maintain FDR + matrix sync |
| **AI Governance** | `packages/ai-governance/`, `docs/ai/` | [`fdr-020-ai-governance`](../delivery/FDR/[Not%20started]%20fdr-020-ai-governance.md) — Not started · **Research Slice 1 ✓** | **implemented** | ADR-0007 Accepted; baseline + scope `quality:ai-governance` exit 0 (fingerprint `AI-GOV-BASELINE-2026-06-20-v1`); `quality:architecture` exit 0; 38/39 unit tests | 1 failing test (TIP-002 fixture missing `@afenda/accounting` → AI-001); PKG-020 registry entry pending; FDR Not started until Slice 2–4 | Slice 2 registry; Slice 3 test fix |
| **Accounting Core** | `packages/accounting/` (PKG-R01) | [`fdr-r01-accounting-contracts`](../delivery/FDR/[Complete%20(authority%20only)]%20fdr-r01-accounting-contracts.md) **29/30** | **partially-implemented** | Contracts-only; 19 tests; governance gate | Ledger runtime prohibited until TIP-015+ ADR | Maintain contracts; new ADR for posting |
| **Pre-accounting foundation readiness** | Cross-cutting | [`fdr-007-accounting-readiness`](../delivery/FDR/[Partially%20Implemented]%20fdr-007-accounting-readiness.md) **28/30 audit · 29/30 ceiling** | **implemented** | Phase 9 signed off 2026-06-24; diagnostics UI + gate registry; v2 gate refresh 2026-06-25 | Peer review (DoD #14) | PR peer review |

---

## shadcn/studio — agent workflow (normalized 2026-06-25)

| Concern | Authority | Implementation model |
| --- | --- | --- |
| **New block promotion** | [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../.cursor/skills/afenda-shadcn-components/SKILL.md) | Per-block MCP/CLI pipeline only — install → Q1–Q3 filter → STUDIO-PATTERN-MAP → gates |
| **Token / CSS bridge** | `packages/design-system` Part B/C → `afenda-appshell-studio.css` | Automatic flow for shadcn utilities and semantic tones — no manual per-utility mapping |
| **Constitutional** | [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) | Proposed — Architecture Authority acceptance pending |
| **Bulk Tailwind migration** | **Not scheduled** | Superseded by decision filter + `ui:guard`; waiver `shell-composition-studio-deferral` permanent |
| **MCP wiring** | `.cursor/skills/shadcn-studio/SKILL.md` | Install cwd `packages/ui`; align `.cursor/mcp.json` `shadcn` server cwd (follow-up) |

Future studio blocks: agents follow `afenda-shadcn-components` — not a separate FDR upgrade track.

---

## Package filesystem inventory (2026-06-25)

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
| Auditability | implemented | Governed mutation audit registry + system-admin mutation audit gate |
| API contract stability | partial | Envelope pattern started |
| System Admin control plane | implemented | `system-admin` layout + pages + governed API contracts; ARCH-ADMIN-001 Slices 1–7 ✓ — `tenant_settings` (notifications/workspace/billing/integrations); General `AppShellAccountSettings01`; live Members roster + invite resend/revoke audit; Security MFA actions; settings audit waiver closed; FDR waiver evidence-sync; mutation audit gate exit 0 |
| Foundation disposition | implemented | `foundation-disposition.registry.ts` — zero red-lane (v3) |
| Phase 9 gate orchestrator | implemented | `check-accounting-readiness-gate.mts` + registry (10 requirements); includes `check:foundation-disposition` on req #10 |
| Phase 9 diagnostics UI | implemented | `/system-admin/diagnostics` live gate status + Phase 9 signed-off banner |
| Phase 9 sign-off record | implemented | `phase-9-accounting-readiness-sign-off.md` (2026-06-24) |
| Documentation synchronized | **implemented** | Runtime matrix + tip-status-index + TIP-013A Complete synced 2026-06-25 |

**Verdict:** Accounting Readiness Gate **PASSED** (2026-06-24). TIP-014 **Complete (authority only)**; ledger posting remains prohibited until TIP-015+ ADR.

---

*Runtime truth matrix — update after each foundation phase completes.*
