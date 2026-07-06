# Afenda ERP — Runtime Truth Matrix

| Field | Value |
|-------|-------|
| **As-of date** | 2026-07-06 (ADR-0040 · Lane B-15 v2 cutover doc sync) |
| **Closure registry** | [`pas-status-index.md`](../PAS/pas-status-index.md) — slice delivery SSOT |
| **Audit** | [`afenda-documentation-drift-audit.md`](afenda-documentation-drift-audit.md) |
| **Roadmap** | [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) (Phases 0–9 complete) |
| **Implementation authority** | [`foundation-delivery-authority.md`](foundation-delivery-authority.md) (PAS — ADR-0014) |
| **Evidence rule** | Status requires file, test, export, script, or schema proof — not TIP delivery doc claims alone |

**Status vocabulary:** `implemented` · `partially-implemented` · `documented-only` · `runtime-only` · `drifted` · `obsolete` · `blocked`

**Matrix vs PAS delivery (ADR-0016):** This matrix describes **runtime truth** (files, tests, gates). PAS docs under [`docs/PAS/`](../PAS/README.md) describe **delivery authority** (slice handoffs, §Remaining gaps, enterprise readiness). A row may be **implemented** while its PAS slice is **Not started** or **Partially Implemented** — that gap is an **improvement opportunity**, not a contradiction. Close it via PAS Research + Evidence-sync slices; do not copy matrix labels into PAS status without gate-backed attestation.

---

## Matrix

| Area | Runtime package / path | Disposition (PAS) | Current status | Evidence | Gaps | Required action |
| --- | --- | --- | --- | --- | --- | --- |
| **Architecture Authority** | `packages/architecture-authority/` | `PKGR02_ARCHITECTURE_AUTHORITY` — green-lane (PAS-002 B1–B27 ✓; PAS-002A B38–B42 ✓ Enterprise Accepted) | **implemented** | Package + validators; `PKGR02_ARCHITECTURE_AUTHORITY` disposition row; four PAS-002A governance gates; `pnpm quality:architecture` + `check:foundation-disposition` pass | — | — |
| **Package Ownership** | `docs/architecture/ownership-registry.md` | — (governance doc) | **implemented** | Registry file + `pnpm architecture:owners` + `check:architecture-ownership-signoff` (ADR-0004 attested 2026-06-28) | — | — |
| **Dependency Governance** | `docs/architecture/dependency-registry.md`, `packages/architecture-authority/` | PAS-002 §4.8 delivered | **implemented** | Registry + `pnpm quality:boundaries` exit 0 | Re-run `pnpm architecture:dependencies` when adding workspace edges | Update `dependency-registry.data.ts` on drift |
| **Design System (retired)** | `packages/ui/src/design-authority/` (internalized) · PKG-004 **retired** in package registry | `PKGR05B_DESIGN_RETIREMENT` — amber-lane · [PAS-005B](../PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md) B43 ✓ · B44 handoff authored | **partially-implemented** | `@afenda/design-system` package **removed from workspace**; governed registries live under `@afenda/ui/design-authority`; bridge via `packages/ui/src/governance/design-system.ts`; [ADR-0025](../adr/ADR-0025-design-system-retirement.md) **Accepted** | B44 closure attestation · B48 appshell consolidation · registry-owner PKG004 deprecation row | Execute [B44 handoff](../PAS/CSS-AUTHORITY/SLICE/b44-pas005b-migration-study-readiness-gate.md) when retirement track resumes |
| **UI Primitives** | `packages/ui/src/components/` | historical `@afenda/ui` primitive package — **not ERP presentation authority** | **implemented** | Package remains on disk for historical and non-ERP purposes; ERP runtime authority has moved to `@afenda/shadcn-studio-v2` | ADR-0008 ref-as-prop migration deferred | Do not treat as ERP frontend authority |
| **UI Consumption (Governed UI)** | *(retired ADR-0027)* | — | **obsolete** | `ui-guard.mjs` archived; governed-ui hooks removed | — | Use PAS-006 creation gates |
| **shadcn/studio (ADR-0040 · PAS-006)** | `@afenda/shadcn-studio-v2` · `apps/erp/src/app/globals.css` | `PKGR05C_SHADCN_STUDIO_V2` — **sole ERP frontend design authority** · [`ADR-0040`](../adr/ADR-0040-promote-shadcn-studio-v2-and-deprecate-legacy.md) **Accepted** | **implemented** | Lane B consumer cutover complete; ERP/Storybook/developer import v2 public exports; `@afenda/shadcn-studio` (PKGR05A) **archive-lane** | residual PAS slice handoff v1 path references (historical) | Maintain v2 as sole ERP presentation chain |
| **shadcn/studio v1 (legacy)** | `@afenda/shadcn-studio` · `packages/shadcn-studio/` (stub) | `PKGR05A_SHADCN_STUDIO` — **archive-lane** per ADR-0040 | **obsolete** | Formal deprecation sign-off (Lane B-15); `pnpm check:v1-consumer-imports` blocks consumer imports | filesystem stub may remain until housekeeping D-1 | Do not author new v1 work |
| **CSS Authority (PAS-005 — archived)** | `@afenda/css-authority` · `packages/css-authority/` | `PKGR05_CSS_AUTHORITY` — **retired for ERP** | **obsolete** for ERP frontend | Package frozen on disk; docs archived | — | Do not execute PAS-005 gates for ERP |
| **Design System Retirement (PAS-005B — archived)** | *(superseded)* | `PKGR05B` — retired for ERP | **obsolete** for ERP frontend | ADR-0027 cutover supersedes incremental strangler | — | — |
| **Enterprise Knowledge (PAS-004C → 004D)** | `@afenda/enterprise-knowledge` · `scripts/governance/check-knowledge-*.mts` | `PKGR04_ENTERPRISE_KNOWLEDGE` — PAS-004C (B38–B48 ✓; 58/58); **PAS-004D B49+ proposed** | **implemented** | JSON authority; semantic model North Star; consumer projections; full §13 gate chain | B49 mirror gate + B50–B54 closure queue | Maintain → PAS-004D |
| **Accounting Standards (PAS-003)** | `@afenda/accounting-standards` | `PKGR03_ACCOUNTING_STANDARDS` — Enterprise Accepted (B0–B20 ✓) | **partially-implemented** | IFRS pack + validation engine + B17–B19 runtime + B20 ERP consumer (31 tests) | — | [b20-erp-consumer-workflow-proof.md](../PAS/ACCOUNTING-STANDARDS/SLICE/b20-erp-consumer-workflow-proof.md) |
| **AppShell** | *(retired for ERP — ADR-0027)* · historical: `packages/appshell/` | `PKG-001 shell-composition` — **retired for ERP frontend** | **obsolete** for ERP | Package **removed from workspace**; ERP skeleton has no `(auth)`/`(protected)` shell routes on `main` | PAS-006 protected shell (P006-01) | Do not restore without ADR |
| **Tenant settings (appearance)** | `packages/database/src/tenant-settings/` · ERP system-admin *(suspended on skeleton)* | ARCH-AUTH-003 · PKG-007 tenant-auth-branding | **partially-implemented** | Schema/contracts may remain; ERP admin UI **not on skeleton** | PAS-006 + ERP rebuild | — |
| **Metadata UI** | *(retired for ERP — ADR-0027)* · historical: `packages/metadata-ui/` | `PKG-012 metadata-renderers` — **retired for ERP** | **obsolete** for ERP | Package **removed**; metadata consumer wire = B111 ERP-local runtime contract | PAS-006D · PAS-001A-R1 | — |
| **Metadata Authority** | *(retired for ERP — ADR-0027)* · historical: `packages/ui-composition/` | `PKG-011 metadata-authority` — **retired for ERP** | **obsolete** for ERP | Package **removed**; `apps/erp/src/lib/metadata/` carries interim contracts | PAS-006D | — |
| **Kernel Execution Context** | `packages/kernel/src/context/` · `propagation/` · `events/` · `policy/` | `PKG-010 context-contracts (pas-status-index)` · B49–B70 closure ✓ | **implemented** | 10 required context modules + wire triads (incl. hierarchy-id-boundary B68); permission-scope wire ingress in `@afenda/permissions` (`scope/permission-scope-context.{assert,parser}.ts`); kernel branding via `permission-scope-context.projection.ts` only (PAS-001A B71); UomCode primitive live; 604+ kernel tests; `quality:kernel-context-surface` + `check:kernel-context-wire-triad` + `check:permission-scope-permissions-surface` exit 0 | — | Maintain |
| **Kernel ERP consumer integration (PAS-001A)** | `apps/erp/src/lib/context/` · `apps/erp/src/lib/metadata/` · `@afenda/permissions/src/scope/` | PAS-001A B71–B75 **historical** · R1a–R1d **Delivered** · B111 skeleton consumer · doctrine Production Candidate | **implemented** | IS-001/IS-002/IS-003 **live** on PAS-006 skeleton — `CONTEXT_INTEGRATION_WIRING` (**11 entries**) · `METADATA_PAS006_CONSUMER_WIRING` (8 entries) · `resolve-operating-context.server.ts` · `loadProtectedRequestOperatingContext` present; active gates: `check:erp-operating-context-spine`, `check:erp-auth-actor-protected-path-attestation`, `check:erp-metadata-pas006-consumer`, `check:erp-tenant-lifecycle-extension-consumer-attestation`, `pnpm quality:pas001a-skeleton-gates`; legacy `check:metadata-context-authorization-bridge` · `check:erp-context-surface` **archived** | Maintain R1d §6.1 gate bundle | See [PAS-001A §1.4](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md#14-adr-0027-skeleton-re-attestation-2026-06-29) |
| **Kernel ERP domain vocabulary catalog (PAS-001B)** | `packages/kernel/src/erp-domain/` (28 modules) · `./erp-domain/catalog` | PAS-001B B76–B106 + **KV1–KV3** ✓ · `PKGR01B_ERP_DOMAIN_CATALOG` | **implemented** | 28/28 delivered; layout gate **12/12**; KV SSOT + authority mirrors; ERP projection validates KV at trust boundary | PAS-001A-R1 full spine | — |
| **Kernel PAS/package-tree sync (Slice B)** | `packages/kernel/PAS-001-KERNEL-TREE.md` · `docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md` §6 · `kernel-package-layout.contract.ts` · `kernel-boundary-drift.registry.ts` | [`pas-status-index.md`](../PAS/pas-status-index.md) · KERNEL PAS §6 | **implemented** | Composed PAS, package-local tree, skill adapter synchronized; stale `src/PAS-001-Kernal-tree.md` paths blocked by `check:kernel-package-structure`; kernel tests + layout gate exit 0; B18 public exports parity Delivered | — | — |
| **Platform Authority (Foundation phase 07)** | `packages/kernel/src/contracts/platform/` | `PKG-010 platform-authority (pas-status-index)` 29/30 candidate | **implemented** | 11 ADR-0001 entities; governed barrel + drift tests | DoD #14 peer review before Complete | PR peer review |
| **Kernel Identity Constitution (PAS §4.1)** | `packages/kernel/src/identity/` · [`ADR-0021`](../adr/ADR-0021-canonical-enterprise-identity.md)–[`0023`](../adr/ADR-0023-tenant-human-reference-numbering.md) | `PKG-010 kernel-identity-constitution (pas-status-index)` Doc note · Slice A–E ✓ (2026-06-27) | **implemented** (production-ready) | 22 enterprise families; 17 live platform tables with `enterprise_id`; tenant human refs (sku, warehouse_code); 10 identity drift gates via `check:kernel-identity-governance` | Deferred entity tables (customer, supplier, employee, document, asset) | **Domain PAS slices** — master-data entity schemas |
| **Multi-tenancy** | `docs/architecture/multi-tenancy.md`, `apps/erp/src/lib/context/` (B111 consumer wire) | `PKG-007 operating-context (pas-status-index)` | **partially-implemented** | B111 tenant lifecycle mapper + extension boundary on skeleton; full resolver pipeline **suspended** post ADR-0027 | PAS-001A-R1 · P006-01 | Slice 3 Evidence-sync when spine returns |
| **Enterprise hierarchy (DB)** | `packages/database/src/schema/entity-group.schema.ts` | `PKG-003 persistence (pas-status-index)` · `PKG-003 tenant-rls (pas-status-index)` **Complete — 29/30** | **implemented** | Tables + services; RLS registry + live apply gates (169 tests); ADR-0011 closed | New `tenant_id` tables need persistence coordination | Maintain |
| **Business reference identity authority (Foundation phase 08)** | `packages/kernel/src/identity/families/business-reference-id.contract.ts` · `identity/wire/` · `scripts/governance/check-business-master-data-scaffold.mts` | `PKG-010 master-data-authority (pas-status-index)` · Slice 2 evidence-sync ✓ · Foundation phase 08 **Complete (authority only)** | **implemented** | Business reference ID families + wire refs in `identity/` (retired `contracts/business-master-data/` path removed); scaffold guards; PKGR02 product/warehouse/stock runtime (Slices 1–4) | Domain entity table promotion (customer, supplier, etc.) | ADR-0020 + domain PAS slices |
| **Inventory master data (Product + Warehouse + Stock)** | `packages/database/src/product/` · `warehouse/` · `stock/` · `apps/erp/src/app/api/internal/v1/inventory/` | `PKGR02 inventory-master-data (pas-status-index)` **Partially Implemented** · Slices 1–4 ✓ (2026-06-27) | **implemented** (master data CRUD + stock QOH/movement API) | ADR-0020 physical model; kernel wire refs; 8 governed API contracts; non-negative QOH guard | `inventory-erp-ui` · `inventory-peer-review` · `inventory-remote-migration` | Maintain |
| **RBAC / Permissions** | `packages/permissions/`, `apps/erp/src/lib/api/` | `PKG-014 rbac (pas-status-index)` **Complete — 29/30** · PKG014_PERMISSIONS | **implemented** | `PERMISSION_REGISTRY`, 62 tests; API RBAC wired (tip-010); scope/grants surface gate exit 0 | Session→context residual (out of PKG-014; identity PAS slice) | Maintain |
| **Audit / Observability** | `packages/observability/`, `packages/database/src/audit/` | `PKG-013 audit-coverage (pas-status-index)` **Complete — 29/30** · `PKG-013 logging-tracing (pas-status-index)` **Complete — 29/30** · PKG013_AUDIT + PKG013_LOGGING | **implemented** | Governed mutation + diagnostic logging registries complete; fail-closed audit + diagnostic inventory scan; Pino + correlation spine (66 PKG tests, `quality:erp-observability` exit 0) | E2E waived per §Waivers | — |
| **Database / Drizzle** | `packages/database/` | `PKG-003 persistence (pas-status-index)` **27/30 audit-adjusted** (29/30 ceiling) · `PKG-003 tenant-rls (pas-status-index)` **Complete — 29/30** | **implemented** | 196+ tests; 39 migrations incl. `member_invitations` (ARCH-AUTH-001 Slice 11) + `passkey` (Slice 13b) + `tenant_sso_providers` `(tenant_id, domain)` uidx (Slice 13a-debt) + `tenant_settings` (+ `integrations` JSONB) + `user_preferences` (ARCH-USER-001 Slice 4A) + RLS + `auth_session.active_workspace_id` (FR-A05.2.1); RLS registry + live apply gates; **Supabase connection routing registry** + pool wiring (ARCH-SUPA-001 Slice 8) | `PKG-003 persistence (pas-status-index)` peer review pending | Maintain |
| **Supabase platform (Postgres ops)** | `packages/database/src/supabase/` · `scripts/env-utils.mjs` · `scripts/ops/supabase-*.mjs` · `scripts/governance/check-supabase-advisors.mjs` | `PKG-003 persistence (pas-status-index)` · ARCH-SUPA-001 **Complete — 29/30** · Slices 1–9 ✓ | **implemented** | Connection routing + pool registry wiring (Slice 8); excluded-capabilities contracts; env-doctor P1 advisories; preview-branch + auth-redirects ops scripts; **`pnpm check:supabase-advisors`** (Slice 9); DoD #20 closed 2026-06-25 | Waiver **SUPA-P1-ADVISORS-001** **Accepted** — release CI wiring at external beta | Maintain; run advisor gate per §12 runbook |
| **Auth** | `packages/auth/`, `apps/erp/src/app/api/auth/` | `PKG-002 auth-disposition (pas-status-index)` **Complete — 29/30** · PKG002_AUTH · ARCH-AUTH-001 **Complete — enterprise 9.5 accepted** · slices 1–21 ✓ · FR-A01.4 + FR-A05.3 ✓ · FR-A05.2.1 + FR-A05.2 ERP ✓ · AUTH-PHASE3-001 **Closed** (Slice 13d · 2026-06-26) | **implemented** | Better Auth; session→context bridge; `auth.mirror-sync` · `auth.mfa-policy` (`getEffectiveMfaPolicy` · company override Slice 21) · `auth.session-revoke` · `deactivatePlatformUserWithSessionRevoke` (Slice 20) · `auth.invitation` (Postgres `member_invitations` · Slice 11 · `AUTH_EVENT.invitationSent` Slice 16); system-admin Members/Security UI; admin MFA TOTP; workspace session contract; enterprise SSO + OAuth + passkeys (13a–13c); SAML admin UI (15); IdP rotation UX (18); governed sign-in surface (19); **`pnpm check:auth-user-id-rbac-boundary` exit 0** (Slice 16 · DoD #15); **PKG tests exit 0** | Company MFA override admin UI (follow-up) | Maintain |
| **Resend transactional email** | `packages/auth/src/auth.email*.ts` · `apps/erp/src/app/api/webhooks/resend/` (Vercel) · `apps/email/` (preview) | ARCH-EMAIL-001 **Complete — 29/30** · `PKG-002 email-delivery (pas-status-index)` · PKG002_AUTH | **implemented** | Slices 1–15 ✓ — invite/verify/reset · React Email · SDK adapter · Vercel webhook · `apps/email` preview :3003 · DoD #20 closed 2026-06-26 | DMARC `p=none` → quarantine (ops) · `@afenda/notifications` P2 PAS slice | Maintain |
| **API Contract Governance** | `apps/erp/src/server/api/contracts/` | `PKG-007 api-governance (pas-status-index)` **29/30 · Complete** | **implemented** | `pnpm check:api-contracts`; envelope + route coverage + idempotency + rate-limit tests (49); OpenAPI 3.1 catalog + drift gate (`ARCH-API-002`) | Kong P2; apply migration `20260626110401` on prod DB; public v1 P2 | Maintain |
| **Execution / Jobs** | `packages/execution/`, `apps/erp/src/lib/outbox/` | `PKG-008 outbox-jobs (pas-status-index)` **Complete — 29/30** · PKG008_EXECUTION | **implemented** | Trigger.dev worker **20260623.1**; outbox publish + lifecycle tests (48 PKG tests exit 0) | — | Maintain |
| **Feature Manifest** | `apps/erp/src/lib/modules/` + `@afenda/entitlements` | `PKG-001 manifest-nav (pas-status-index)` **Complete** · `PKG-006 feature-manifest (pas-status-index)` **27/30 audit-adjusted** · PKG006_FEATURE_MANIFEST | **implemented** | Full pipeline: entitlements → appshell nav → ERP routes + RBAC guard + active-route highlight | DoD #14 peer review (PKG-006) | Evidence-sync / peer review |
| **Entitlements evaluation** | `packages/entitlements/` | `PKG-006 entitlements (pas-status-index)` **26/30 audit-adjusted** · PKG006_ENTITLEMENTS | **implemented** | 52 tests; feature manifest registry; flag engine; check:governance | DoD #14 peer review; ERP consumer wiring | Evidence-sync / peer review |
| **Feature Flags** | `packages/feature-flags/`, `apps/erp/src/lib/rollout/` | `PKG-009 rollout-flags (pas-status-index)` **29/30 audit-adjusted** · PKG009_FEATURE_FLAGS | **partially-implemented** | 24 PKG tests + ERP rollout resolver; evaluation facade; kill-switch service | DoD #14 peer review; route-level gating deferred | Peer review (DoD #14) |
| **System Admin** | `apps/erp/src/app/(protected)/system-admin/` | `PKG-007 system-admin (pas-status-index)` **29/30 audit-adjusted** · PKG007_ADMIN · ARCH-ADMIN-001 **Complete — 29/30** | **implemented** | ARCH-ADMIN-001 Slices 1–11 ✓ — seven settings sections; mutation audit registry (settings + invite resend/revoke); `check:system-admin-mutation-audit` exit 0; `tenant_settings` persistence (notifications/workspace/billing/integrations) via server actions; General tab `AppShellAccountSettings01`; live Members roster (Slice 3); Security user MFA enable/disable (Slice 4); settings audit waiver closed (Slice 5); PAS waiver evidence-sync (Slice 7); TypeScript action dedup (Slice 9); DoD #20 closed (Slice 11 · 2026-06-25); `quality:migrations` exit 0; `ui:guard:scan` exit 0; ERP test:run pass | DoD #14 peer review (PAS) · operator migrate per env (ops) | Maintain; PAS DoD #14 peer review |
| **User Settings** | `apps/erp/src/app/(protected)/settings/` | `PKG-007 ux-surfaces (pas-status-index)` · ARCH-USER-001 **Complete — 29/30** | **implemented** | ARCH-USER-001 Slices 1–12 ✓ — four v1 tabs (profile/security/notifications/preferences); `user_preferences` persistence; dual-surface split; integration AC closure (Slice 8); `USER_SETTINGS_SERVER_ACTION_MUTATION_AUDIT_ENTRIES` + coverage test (Slice 9); DoD #20 closed (Slice 12 · 2026-06-25); profile email change UI via ARCH-AUTH-001 Slice 14 (`authClient.changeEmail` · verification flow) | — | Maintain |
| **ERP Application** | `apps/erp/` | `PKG-007 ux-surfaces (pas-status-index)` **26/30 audit · 28/30 ceiling** · PKG-007 siblings | **implemented** | UI phase 5 Complete; governed surfaces; CSP; ui:guard 243 files; **658/658 tests** (124 files, validated 2026-06-25) | DoD #14 peer review | Evidence-sync / peer review |
| **Storybook** | `apps/storybook/` | `PKG-021 storybook (pas-status-index)` — Not started · **Research Slice 1 ✓** | **implemented** | `typecheck` exit 0; colocated ui/appshell/metadata-ui stories; `ui:guard:scan` exit 0 | `test:storybook:run` exit 1 (400/1860 failed — import + a11y taxonomy in PAS Research) | Slice 2 registry onboard; Slice 3 runner green |
| **Docs application (`@afenda/docs`)** | `apps/docs/` | `PKG-005 docs-app (pas-status-index)` · ARCH-DOCS-001 **Complete** · `PKG-033 published-docs-ia (pas-status-index)` · ARCH-DOCS-002 **Complete — 29/30 with non-code waivers** | **implemented** | `quality:docs` 879 SSG routes · 234 tests · reader IA · catalog drift gate · `en/(guides)` sunset · module stubs · **engineering delivery closed 2026-06-26** | `docs-live-dns` (PKG-005 waiver) · `docs-ia-l10n-tasks` (P2 editorial) · CSS `::highlight` watch | Operator DNS at external beta; translation backlog not an engineering blocker |
| **Testing Infrastructure** | `packages/testing/`, `vitest.shared.ts` | `PKG-016 test-utilities (pas-status-index)` · ARCH-TEST-001 · ARCH-TEST-002 | **implemented** | Vitest 3 projects; four factories; jsdom UI; DB forks serial; Gate 3 `test:run`; Gate 3i interaction; Gate 3j ERP E2E smoke; Gate 3cov phase-1 coverage summary | P2 nightly full E2E matrix (sharding) | [`e2e/full/README.md`](../../apps/erp/e2e/full/README.md) · [`e2e-nightly.yml`](../../.github/workflows/e2e-nightly.yml) |
| **Tenant storage** | `packages/storage/` | `PKG-015 tenant-storage (pas-status-index)` **29/30 audit-adjusted** · `PKG015_STORAGE` · ARCH-SUPA-001 Slice 5 | **implemented** | Contracts, R2/Blob providers, 17 tests incl. `tenant-denial.test.ts` + `storage-additional-providers.contract.ts` (Supabase additional-only); registry aligned; Slice 3 gate log exit 0 | ERP consumer wiring (waiver `storage-erp-e2e`); audit deferred (waiver `storage-audit-deferred`) | DoD #14 peer review |
| **TypeScript config** | `packages/typescript-config/` | `PKG-017 ts-config (pas-status-index)` — **Partially Implemented · 20/30** · active-exempt | **implemented** | 11 JSON presets; consumer audit Grade A (21/21 primary) | Slice 2 registry onboard (`PKG017_*`) | Registry-sync Slice 2 |
| **CI / Quality Gates** | Root `package.json`, `scripts/governance/` | — (cross-cutting) | **implemented** | `pnpm check`, `pnpm quality` (30+ sub-gates) | `check:downstream-integration` not in aggregator | Optional wiring |
| **Documentation synchronized** | docs + ADRs | [`foundation-disposition.md`](foundation-disposition.md) · [`pas-status-index.md`](../PAS/pas-status-index.md) | **implemented** | ADR-0014/0016; PAS authority active; `pnpm check:documentation-drift` green | Matrix row sync on slice close | Maintain disposition + matrix + pas-status-index |
| **AI Governance** | `packages/ai-governance/`, `docs/ai/` | `PKG020_AI_GOVERNANCE` — green-lane (ADR-0007) | **implemented** | ADR-0007 Accepted; `quality:ai-governance` exit 0; baseline + scope validators; disposition row PKG020 | Peer review for enterprise 9.5 promotion | Maintain AI-001..AI-010 invariants |
| **Accounting Core** | `packages/kernel/src/erp-domain/accounting/` · `@afenda/kernel/erp-domain/accounting` (PKG-R01 retired) | `PKGR01 accounting-contracts (pas-status-index)`]%20PKGR01 accounting-contracts (pas-status-index).md) **29/30** | **partially-implemented** | Contracts-only in kernel `erp-domain/accounting/`; `pnpm check:accounting-domain-contracts`; bridge `toAccountingDomainContext` in ERP projection; no `packages/accounting/` | Ledger runtime prohibited until Foundation phase 15+ ADR | Maintain contracts; new ADR for posting |
| **Pre-accounting foundation readiness** | Cross-cutting | `PKG-007 accounting-readiness (pas-status-index)` **28/30 audit · 29/30 ceiling** | **implemented** | Phase 9 signed off 2026-06-24; diagnostics UI + gate registry; v2 gate refresh 2026-06-25 | Peer review (DoD #14) | PR peer review |

---

## shadcn/studio — agent workflow (normalized 2026-07-06 · ADR-0040)

| Concern | Authority | Implementation model |
| --- | --- | --- |
| **MCP product / install cwd** | `@afenda/shadcn-studio-v2` · [`.cursor/skills/shadcn-studio/SKILL.md`](../../.cursor/skills/shadcn-studio/SKILL.md) | `packages/shadcn-studio-v2` — `/cui`, `/rui`, quarantine → promotion |
| **Governed Afenda blocks** | `packages/shadcn-studio-v2/src/` | Production ERP presentation surfaces live in v2 governed exports |
| **Bridge re-exports** | `@afenda/shadcn-studio-v2` · `@afenda/shadcn-studio-v2/clients` | ERP, Storybook, and developer lab consume v2 public exports only |
| **New block promotion** | [`.cursor/skills/shadcn-studio/SKILL.md`](../../.cursor/skills/shadcn-studio/SKILL.md) | MCP install → quarantine → promotion pipeline |
| **Token / CSS bridge** | `@afenda/shadcn-studio-v2/shadcn-default.css` | ERP imports v2 CSS dist; do not route through retired v1 or CSS authority paths |
| **Constitutional** | [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) · [ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) · [ADR-0040](../adr/ADR-0040-promote-shadcn-studio-v2-and-deprecate-legacy.md) | Accepted ERP presentation chain = v2 only |
| **Legacy v1** | `@afenda/shadcn-studio` (PKGR05A archive-lane) | **Do not import** — `pnpm check:v1-consumer-imports` |

Future studio blocks: agents follow `shadcn-studio` skill — not a separate PAS upgrade track.

---

## Package filesystem inventory (2026-06-25)

| Package | Path | Layer | Files (indicative) | Export map |
| --- | --- | --- | --- | --- |
| `@afenda/accounting-standards` | `packages/accounting-standards` | Foundation | PAS-003 B0–B16 delivered (46+ src files; 23 tests) | Yes |
| `@afenda/architecture-authority` | `packages/architecture-authority` | Platform | Contracts + validators | Yes |
| `@afenda/css-authority` | `packages/css-authority` | Design | archived CSS authority package — not ERP frontend authority | Yes |
| `@afenda/enterprise-knowledge` | `packages/enterprise-knowledge` | Platform | JSON authority + semantic model (PAS-004C) | Yes |
| `@afenda/shadcn-studio-v2` | `packages/shadcn-studio-v2` | Design | sole ERP presentation package + theme/runtime surfaces (PAS-006 · ADR-0040) | Yes |
| `@afenda/shadcn-studio` | `packages/shadcn-studio` (stub) | Design | **archive-lane** legacy v1 — do not import in consumers | Retired per ADR-0040 |
| `@afenda/ai-governance` | `packages/ai-governance` | Platform | Governance validators | Yes |
| `@afenda/appshell` | `packages/appshell` | ERPSpine | historical or retired-for-ERP package; not current ERP presentation authority | Yes |
| `@afenda/auth` | `packages/auth` | Platform | Auth provider + Better Auth | Yes |
| `@afenda/database` | `packages/database` | Platform | 141+ `.ts`, schemas, seeds | Yes |
| `@afenda/design-system` | *(retired — no workspace path)* | Design | Registries internalized in `@afenda/ui` | **Retired** per ADR-0025 |
| `@afenda/entitlements` | `packages/entitlements` | Integration | Entitlement + feature manifest | Yes |
| `@afenda/execution` | `packages/execution` | Foundation | 21 files, Trigger.dev | Yes |
| `@afenda/feature-flags` | `packages/feature-flags` | Integration | Contracts | Yes |
| `@afenda/kernel` | `packages/kernel` | Platform | 42+ files; `context/` + `contracts/` + `erp-domain/accounting/` | Yes (`./erp-domain/accounting` subpath) |
| `@afenda/ui-composition` | `packages/ui-composition` | Metadata | retired for ERP presentation path | Yes |
| `@afenda/metadata-ui` | `packages/metadata-ui` | Metadata | retired for ERP presentation path | Yes |
| `@afenda/observability` | `packages/observability` | Platform | Logging/audit adapters | Yes |
| `@afenda/permissions` | `packages/permissions` | Platform | RBAC engine | Yes |
| `@afenda/storage` | `packages/storage` | Foundation | Tenant-scoped storage | Yes |
| `@afenda/testing` | `packages/testing` | Integration | Test utilities | Yes |
| `@afenda/typescript-config` | `packages/typescript-config` | Platform (tooling) | TS presets | Config |
| `@afenda/ui` | `packages/ui` | Design | historical primitive package; not current ERP presentation authority | Yes |
| `@afenda/erp` | `apps/erp` | Application | 199 TS/TSX | No (app) |
| `@afenda/storybook` | `apps/storybook` | Application | Storybook app | No (app) |
| `@afenda/docs` | `apps/docs` | Application | Fumadocs docs app (17+ TS/TSX) | No (app) |

**Missing directories (recorded, not invented):**

- `docs/tip/` — does not exist; slice handoffs live in [`docs/PAS/CSS-AUTHORITY/SLICE/`](../PAS/slice/)
- `docs/roadmap/` — does not exist; replaced by `pre-accounting-foundation-roadmap.md`
- `packages/features-*` — no feature packages exist

---

## Governance scripts evidence

| Script prefix | Count | Purpose |
| --- | --- | --- |
| `check:multi-tenancy-*` | 15 | Multi-tenancy foundation gates |
| `quality:*` | 30+ | CI quality matrix |
| `ui:guard*` | 4 | Governed UI consumption enforcement |
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
| Consolidation preparation | partial | `consolidation-scope-context.contract.ts` + `consolidation-scope-resolution.ts` + `hierarchy-id-boundary.contract.ts` + ERP `resolve-consolidation-scope.server.ts` |
| Legal vs operating entity | documented | Glossary sections |
| RBAC by context | partial | Foundation phase 10 API slice |
| RLS / DB isolation | implemented | Unified tenant RLS registry; artifact gate (`check:database-tenant-rls-coverage`) with schema parity; live apply gate (`check:database-tenant-rls-live`, environment-specific) — **Slices F–H signed off** |
| Auditability | implemented | Governed mutation audit registry + system-admin mutation audit gate |
| API contract stability | partial | Envelope pattern started |
| System Admin control plane | implemented | `system-admin` layout + pages + governed API contracts; ARCH-ADMIN-001 **Complete** Slices 1–11 ✓ — `tenant_settings` (notifications/workspace/billing/integrations); General `AppShellAccountSettings01`; live Members roster + invite resend/revoke audit; Security MFA actions; settings audit waiver closed; PAS waiver evidence-sync; mutation audit gate exit 0; DoD #20 closed 2026-06-25 |
| Foundation disposition | implemented | `foundation-disposition.registry.ts` — zero red-lane (v3) |
| Phase 9 gate orchestrator | implemented | `check-accounting-readiness-gate.mts` + registry (10 requirements); includes `check:foundation-disposition` on req #10 |
| Phase 9 diagnostics UI | implemented | `/system-admin/diagnostics` live gate status + Phase 9 signed-off banner |
| Phase 9 sign-off record | implemented | `phase-9-accounting-readiness-sign-off.md` (2026-06-24) |
| Documentation synchronized | **implemented** | Runtime matrix + [`pas-status-index.md`](../PAS/pas-status-index.md) synced 2026-06-28 |

**Verdict:** Accounting Readiness Gate **PASSED** (2026-06-24). Foundation phase 14 **Complete (authority only)**; ledger posting remains prohibited until Foundation phase 15+ ADR.

---

*Runtime truth matrix — update after each foundation phase completes.*
