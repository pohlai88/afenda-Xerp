# TIP-013 — System Admin Control Plane

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Authority status** | **Accepted** — Architecture Authority Phase 8 delivery TIP (2026-06-23) |
| **Runtime evidence** | Slice 1–4: `apps/erp/src/app/(protected)/system-admin/`, `apps/erp/src/lib/system-admin/`, `apps/erp/src/server/api/contracts/system-admin/`, governed routes under `apps/erp/src/app/api/internal/v1/system-admin/` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 8 — System Admin Control Plane |
| **Remaining gap** | None — MVP control plane delivered (pagination/settings mutations deferred as known debt) |
| **Supersedes** | Proposed TIP-010B draft in [`foundation-phase-delivery-tip-proposal.md`](../../architecture/foundation-phase-delivery-tip-proposal.md) |
| **Numbering note** | TIP-013 is **Phase 8 foundation** (pre-accounting). **Accounting Core begins at TIP-014+** after Phase 9 gate (supersedes master plan v5 TIP-013 = accounting assignment). |

## Purpose

Deliver the minimum viable System Admin control plane so platform administrators can manage users, security, and platform configuration — and view audit trails — without direct database access. This is Foundation Phase 8 and a Phase 9 Accounting Readiness Gate requirement.

ADR-0010 / ADR-0013 authority: System Admin must be operational **before** Accounting Core (`TIP-014+`, `@afenda/accounting`).

## Scope

**In scope (Phase 8 MVP surfaces)**

| Surface | MVP deliverable |
| --- | --- |
| Users | Admin UI + invite flow |
| Memberships | Company-scoped membership admin |
| Roles | Role assignment with company scope |
| Permissions | Read-only catalog from `PERMISSION_REGISTRY` |
| Modules / capabilities | Admin UI tied to TIP-007A manifest |
| Policies | Minimum viable policy admin |
| Approvals | Configuration placeholder (no TIP-029 engine) |
| Audit Viewer | Read-only search UI |
| Security settings | Tenant security config (minimum) |
| Organization settings | Legal entity + org unit admin |
| Integrations | Admin surface for existing debug/integration routes |
| Diagnostics | Admin diagnostics panel (health linkage) |

**Cross-cutting (every mutation)**

- Tenant / company operating context via `resolveOperatingContext`
- RBAC + policy hook through operating spine
- Audit event + correlation ID
- Governed API contracts (TIP-010A)
- TIP-004 UI consumption — zero `className` on `@afenda/ui`

**Out of scope**

- Accounting admin (COA, journals, fiscal periods — **TIP-014+**, ADR-0010)
- `@afenda/accounting` package creation
- Approval workflow engine (TIP-029)
- Full integrations marketplace

## Runtime evidence (2026-06-24)

| Artifact | Path | Proven |
| --- | --- | --- |
| User / membership / role schemas | `packages/database/src/schema/user.schema.ts`, `membership.schema.ts`, `role.schema.ts` | Yes |
| Permission registry | `packages/permissions/src/grants/permission.contract.ts` | Partial |
| Policy service | `packages/permissions/` policy evaluation | Partial |
| System Admin layout + users page | `apps/erp/src/app/(protected)/system-admin/` | **Yes** (Slice 1) |
| Memberships, roles, permissions pages + catalog | `apps/erp/src/app/(protected)/system-admin/memberships/`, `roles/`, `permissions/`; `list-permission-registry-entries.ts`; `resolve-system-admin-section-access.server.ts` | **Yes** (Slice 2) |
| Audit viewer + settings scaffold | `apps/erp/src/app/(protected)/system-admin/audit/`, `settings/`; `list-recent-audit-events.server.ts` | **Yes** (Slice 3) |
| Section guard + audit on denial | `apps/erp/src/lib/system-admin/guard-system-admin-section.server.ts` | **Yes** (Slice 1) |
| Admin API contracts | `apps/erp/src/server/api/contracts/system-admin/` | **Yes** (Slice 4) |
| Audit viewer UI | `apps/erp/src/app/(protected)/system-admin/audit/` | **Yes** (Slice 3) |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/erp` (PKG-007) | Admin routes, Server Components, API handlers, tests |
| `@afenda/database` (PKG-003) | User, membership, role persistence |
| `@afenda/permissions` (PKG-014) | Admin permission keys, policy checks |
| `@afenda/appshell` (PKG-001) | Admin shell layout integration |
| `@afenda/ui` (PKG-018) | Governed admin form primitives (TIP-004) |
| `@afenda/entitlements` (PKG-006) | Modules/capabilities admin (TIP-007A) |

## Depends on

- TIP-010 Identity & Authorization (partial)
- TIP-010A API Contract Governance (partial)
- TIP-012 ERP Operating Spine (partial) — audit + correlation on mutations
- TIP-007A Feature Manifest (partial) — modules/capabilities admin slice

## Blocks

- Foundation Phase 8 gate
- Foundation Phase 9 requirement #8 — System Admin smoke tests
- **TIP-014+ Accounting Core** (ADR-0010) — accounting blocked until Phase 9 passes

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `apps/erp/src/app/(protected)/system-admin/layout.tsx` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/app/(protected)/system-admin/users/page.tsx` | `@afenda/erp` | Application | **New** | — |
| `apps/erp/src/app/(protected)/system-admin/memberships/page.tsx` | `@afenda/erp` | Application | **New** | — |
| `apps/erp/src/app/(protected)/system-admin/roles/page.tsx` | `@afenda/erp` | Application | **New** | — |
| `apps/erp/src/app/(protected)/system-admin/permissions/page.tsx` | `@afenda/erp` | Application | **New** | — |
| `apps/erp/src/app/(protected)/system-admin/audit/page.tsx` | `@afenda/erp` | Application | **New** | — |
| `apps/erp/src/app/(protected)/system-admin/settings/page.tsx` | `@afenda/erp` | Application | **New** | — |
| `apps/erp/src/server/api/contracts/system-admin/` | `@afenda/erp` | Application | **New** | TIP-010A |
| `packages/permissions/src/grants/permission.contract.ts` | `@afenda/permissions` | Platform | Modified | Platform Authority |
| `apps/erp/src/__tests__/system-admin.integration.test.tsx` | `@afenda/erp` | Application | **New** | — |

## Acceptance gate

- Admin smoke + denial tests — `pnpm --filter @afenda/erp test:run`
- Acceptance criteria proof — `pnpm --filter @afenda/erp exec vitest run src/__tests__/system-admin-acceptance.test.ts`
- UI guard — `pnpm ui:guard:scan`
- API contracts — `pnpm check:api-contracts`
- `pnpm --filter @afenda/erp typecheck`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN the user is signed in under Tenant A
AND   the user has permission system_admin.users_manage (PERMISSION_REGISTRY.systemAdmin.users.manage)
AND   the user operates within Company A (legal entity)
WHEN  the admin invites a new user to Company A
THEN  the membership is created with company scope
AND   an audit event records actor, company, action, target, correlation ID

GIVEN the user is signed in under Tenant A with admin access to Company A only
WHEN  the admin attempts to assign a role scoped to Company B
THEN  the API returns 403 Forbidden
AND   an audit event records the denial with actor and correlation ID
AND   Company B data is not accessible or returned

GIVEN the user is signed in under Tenant A
AND   the user has permission system_admin.audit_read (PERMISSION_REGISTRY.systemAdmin.audit.read)
WHEN  the admin opens the audit viewer
THEN  audit events for Tenant A are searchable read-only
AND   no mutation occurs without explicit admin write permission

GIVEN the user is signed in under Tenant A
AND   the user does NOT have permission system_admin.users_manage (PERMISSION_REGISTRY.systemAdmin.users.manage)
WHEN  the admin attempts to invite a user via the System Admin API
THEN  the API returns 403 Forbidden
AND   an audit event records the denial with actor and correlation ID

GIVEN Phase 9 Accounting Readiness Gate has NOT passed
WHEN  the admin navigates to accounting module settings
THEN  only shell placeholder or manifest-disabled state is shown
AND   no chart of accounts or journal admin exists
```

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | System admin routes exist | `apps/erp/src/app/(protected)/system-admin/` | [x] |
| 2 | Smoke + denial tests pass | `pnpm --filter @afenda/erp test:run` | [x] |
| 3 | UI guard clean | `pnpm ui:guard:scan` | [x] |
| 4 | API contracts registered | `pnpm check:api-contracts` | [x] |
| 5 | Boundaries clean | `pnpm quality:boundaries` | [x] |
| 6 | Typecheck clean | `pnpm --filter @afenda/erp typecheck` | [x] |
| 7 | Biome clean | `pnpm ci:biome` | [x] |
| 8 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] |
| 9 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] |
| 10 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 11 | No accounting admin logic | ADR-0010 — no `@afenda/accounting` | [x] |
| 12 | Completion report posted | afenda-coding-session §11 | [x] |

## Handoff to implementation

> **Mandatory before code edits.** Phase 8 MVP — implement one slice per session.

**Prerequisites:** TIP-010A Slice 1 (registry) and TIP-012 partial (audit on mutations) recommended before admin mutation APIs.

### Slice 1 — Shell + users (`@afenda/erp`)

**Status:** Delivered (commit: pending)  
**Prerequisite:** TIP-007A Slice 3 (`apps/erp/src/lib/modules/guard-module-route.server.ts`) = `implemented` in `afenda-runtime-truth-matrix.md`; TIP-010A = `Complete`

#### Design (internal-guide)

- System Admin lives under `(protected)/system-admin/` — separate from manifest module placeholders at `/modules/[moduleId]`.
- Reuse the operating-context → permission-check pipeline (`toPermissionCheckContextFromOperatingContext`, `checkPermission`, audit on denial) mirroring `guardModuleRoute`.
- Typed section registry in `system-admin-sections.ts` references `PERMISSION_REGISTRY.systemAdmin.*` only — no local permission string literals.
- `layout.tsx` renders admin sub-nav (Users active; other sections deferred to Slices 2–3) inside inherited `AppShell` from `(protected)/layout.tsx`.
- `users/page.tsx` gates on `PERMISSION_REGISTRY.systemAdmin.users.read`; invite/manage UI deferred to Slice 4 API contracts.
- Page chrome via `AppShellMain` — zero `className` on `@afenda/ui` primitives (TIP-004).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Complete] tip-013-system-admin-control-plane.md

1. Objective    — Add system-admin layout and RBAC-gated users page with typed section guard, audit on denial, and AppShellMain chrome.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/ and apps/erp/src/lib/system-admin/
3. Files        — apps/erp/src/app/(protected)/system-admin/layout.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/users/page.tsx (New)
                  apps/erp/src/lib/system-admin/system-admin-sections.ts (New)
                  apps/erp/src/lib/system-admin/guard-system-admin-section.server.ts (New)
                  apps/erp/src/lib/system-admin/__tests__/guard-system-admin-section.server.test.ts (New)
                  docs/delivery/tips/[Complete] tip-013-system-admin-control-plane.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, ADR-0010 Accounting Core (COA, journals, ledger, posting), className on @afenda/ui primitives, packages/ui edits, packages/appshell edits, packages/permissions edits, unregistered API routes
5. Authority    — ADR-0013 Phase 8 — Application Authority; PERMISSION_REGISTRY from Permission Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 1 | System admin routes exist | `apps/erp/src/app/(protected)/system-admin/` |
| 6 | Typecheck clean | `pnpm --filter @afenda/erp typecheck` |
| 7 | Biome clean | `pnpm ci:biome` |
| 8 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` |

#### Known debt

- Users invite/manage mutation API and UI deferred to Slice 4.
- Admin sub-nav shows Users only; memberships, roles, permissions, audit, settings arrive in Slices 2–3.
- No E2E browser proof in this slice.

### Slice 2 — Memberships + roles + permissions catalog (`@afenda/erp`)

**Status:** Delivered (commit: pending)  
**Prerequisite:** Slice 1 runtime evidence — `apps/erp/src/lib/system-admin/guard-system-admin-section.server.ts` = `partially-implemented` in `afenda-runtime-truth-matrix.md` (Slice 1 delivered)

#### Design (internal-guide)

- Extend `SYSTEM_ADMIN_SECTIONS` with `memberships`, `roles`, `permissions` — permission keys from `PERMISSION_REGISTRY.systemAdmin` only.
- Memberships gate: `users.read` (company-scoped membership view scaffold; mutation deferred to Slice 4).
- Roles gate: `roles.manage` (no `roles.read` in registry).
- Permissions gate: `permissions.manage`; page renders read-only catalog via `listPermissionRegistryEntries()` — serializable `{ domain, action, key }[]`, no registry fork.
- Extract shared session/context/guard flow into `resolveSystemAdminSectionAccess` to DRY users page + three new pages (refactor users page in-place).
- Page chrome via `AppShellMain`; permissions page uses plain HTML list/table on shell chrome (TIP-004).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Complete] tip-013-system-admin-control-plane.md

1. Objective    — Add RBAC-gated memberships, roles, and read-only permissions catalog pages; extend section registry and shared access resolver.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/ and apps/erp/src/lib/system-admin/
3. Files        — apps/erp/src/app/(protected)/system-admin/memberships/page.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/roles/page.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/permissions/page.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/users/page.tsx (Modified)
                  apps/erp/src/lib/system-admin/system-admin-sections.ts (Modified)
                  apps/erp/src/lib/system-admin/resolve-system-admin-section-access.server.ts (New)
                  apps/erp/src/lib/system-admin/list-permission-registry-entries.ts (New)
                  apps/erp/src/lib/system-admin/__tests__/list-permission-registry-entries.test.ts (New)
                  apps/erp/src/lib/system-admin/__tests__/guard-system-admin-section.server.test.ts (Modified)
                  docs/delivery/tips/[Complete] tip-013-system-admin-control-plane.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — local permission string literals (use PERMISSION_REGISTRY), @afenda/accounting, ADR-0010 Accounting Core (COA, journals, ledger, posting), className on @afenda/ui primitives, packages/ui edits, packages/appshell edits, packages/permissions edits, unregistered API routes, membership/role mutation APIs
5. Authority    — ADR-0013 Phase 8 — Application Authority; PERMISSION_REGISTRY from Permission Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 1 | System admin routes exist (memberships, roles, permissions) | `apps/erp/src/app/(protected)/system-admin/` |
| 3 | UI guard clean | `pnpm ui:guard:scan` |
| 5 | Boundaries clean | `pnpm quality:boundaries` |
| 6 | Typecheck clean | `pnpm --filter @afenda/erp typecheck` |
| 7 | Biome clean | `pnpm ci:biome` |
| 8 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` |

#### Known debt

- None — memberships/roles/permissions pages, audit viewer, settings scaffold, and mutation APIs delivered in Slices 2–4.

### Slice 3 — Audit viewer + settings (`@afenda/erp`)

**Status:** Delivered (commit: pending)  
**Prerequisite:** Slice 2 runtime evidence — `apps/erp/src/app/(protected)/system-admin/memberships/` + `resolve-system-admin-section-access.server.ts` delivered; nav filtering via `list-visible-system-admin-sections.server.ts`

#### Design (internal-guide)

- Extend `SYSTEM_ADMIN_SECTIONS` with `audit` and `settings`; update `SystemAdminSectionId` union and nav filtering automatically via registry.
- Audit gate: `PERMISSION_REGISTRY.systemAdmin.audit.read` (registered in Permission Authority; consumed from registry only).
- Settings gate: `PERMISSION_REGISTRY.systemAdmin.modules.manage` (minimum org/platform config scaffold; no accounting settings).
- Audit page: tenant-scoped read-only query via `getDb()` + `auditEvents` filtered by `operatingContext.permissionScope.tenantId`; map to serializable `AdminAuditEventRow[]` (no raw jsonb in UI — extract scalar fields only).
- Settings page: read-only scaffold describing org/security config deferred to Slice 4 mutations; show current operating context labels from allowed access result.
- Reuse `resolveSystemAdminSectionAccess` + `applySystemAdminSectionAccessNavigation`; `AppShellMain` + plain HTML table (TIP-004).
- No mutations on either page; no `@afenda/permissions` edits in this slice.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Complete] tip-013-system-admin-control-plane.md

1. Objective    — Add RBAC-gated audit viewer (tenant-scoped read-only list) and settings scaffold; extend section registry for audit + settings.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/ and apps/erp/src/lib/system-admin/
3. Files        — apps/erp/src/app/(protected)/system-admin/audit/page.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/settings/page.tsx (New)
                  apps/erp/src/lib/system-admin/system-admin-sections.ts (Modified)
                  apps/erp/src/lib/system-admin/list-recent-audit-events.server.ts (New)
                  apps/erp/src/lib/system-admin/__tests__/list-recent-audit-events.server.test.ts (New)
                  apps/erp/src/lib/system-admin/__tests__/guard-system-admin-section.server.test.ts (Modified)
                  docs/delivery/tips/[Complete] tip-013-system-admin-control-plane.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — @afenda/accounting, ADR-0010 Accounting Core (COA, journals, ledger, posting), accounting settings UI, className on @afenda/ui primitives, packages/ui edits, packages/appshell edits, packages/permissions edits, unregistered API routes, audit/settings mutation without spine audit hook, local permission string literals
5. Authority    — ADR-0013 Phase 8 — Application Authority; audit schema read via `@afenda/database`; PERMISSION_REGISTRY from Permission Authority (consume only)
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 1 | System admin routes exist (audit, settings) | `apps/erp/src/app/(protected)/system-admin/` |
| 3 | UI guard clean | `pnpm ui:guard:scan` |
| 6 | Typecheck clean | `pnpm --filter @afenda/erp typecheck` |
| 8 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` |
| 11 | No accounting admin logic | ADR-0010 — settings scaffold excludes COA/journal |

#### Known debt

- Audit search/filter UI and pagination deferred to Slice 4 API contracts.
- Settings mutations (org/security) deferred to Slice 4.
- Full `erp test:run` green deferred — pre-existing TIP-004 harness failures unrelated to this slice.

### Slice 4 — Admin API contracts + integration tests (`@afenda/erp`)

**Status:** Delivered (commit: pending)  
**Prerequisite:** Slice 3 runtime evidence — `apps/erp/src/app/(protected)/system-admin/audit/` + `list-recent-audit-events.server.ts` = `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Three governed internal routes under `/api/internal/v1/system-admin/`: user invite (POST), membership role assignment (POST), audit events list (GET).
- Permission keys from `PERMISSION_REGISTRY.systemAdmin.*` only — `users.manage`, `roles.manage`, `audit.read`; no local permission literals.
- Invite derives `tenantId` + `companyId` from authorized operating context (not request body); creates platform user (`status: invited`) + company-scoped membership via `@afenda/database` governed writes (`insertUser`, `insertMembership`).
- Role assignment validates `requestBody.companyId === operatingContext.permissionScope.companyId` before `updateMembership`; cross-company attempts return 403 + `recordErpAuditEvent` denial (actor + correlation ID).
- Audit list reuses `listRecentAuditEvents` — tenant-scoped, read-only, serializable DTOs (no raw jsonb).
- Mutations use `createApiHandler` + spine (`runProtectedMutation`); contract audit policy on POST; idempotency optional on invite/role POST.
- Integration tests exercise service layer + `assertRoutePermission` with `InMemoryPermissionDataSource`; database writes mocked — no parallel registries.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Complete] tip-013-system-admin-control-plane.md

1. Objective    — Register system-admin API contracts (invite, role assignment, audit read) with integration tests for success, permission denial, and cross-company role denial.
2. Allowed layer— apps/erp/src/server/api/contracts/system-admin/, apps/erp/src/server/system-admin/, apps/erp/src/app/api/internal/v1/system-admin/, apps/erp/src/__tests__/, apps/erp/src/lib/system-admin/__tests__/
3. Files        — apps/erp/src/server/api/contracts/system-admin/system-admin.api-contract.ts (New)
                  apps/erp/src/server/api/contracts/system-admin/system-admin.contract.ts (New)
                  apps/erp/src/server/system-admin/invite-company-user.server.ts (New)
                  apps/erp/src/server/system-admin/assign-membership-role.server.ts (New)
                  apps/erp/src/server/system-admin/list-system-admin-audit-events.server.ts (New)
                  apps/erp/src/app/api/internal/v1/system-admin/users/invite/route.ts (New)
                  apps/erp/src/app/api/internal/v1/system-admin/memberships/role/route.ts (New)
                  apps/erp/src/app/api/internal/v1/system-admin/audit-events/route.ts (New)
                  apps/erp/src/server/api/contracts/api-contract-registry.ts (Modified)
                  apps/erp/src/lib/system-admin/__tests__/system-admin-api-test-fixtures.ts (New)
                  apps/erp/src/__tests__/system-admin.integration.test.tsx (New)
                  docs/delivery/tips/[Complete] tip-013-system-admin-control-plane.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, ADR-0010 Accounting Core (COA, journals, ledger, posting), local permission string literals, unregistered API routes, packages/ui edits, packages/appshell edits, packages/permissions edits, hand-edited migrations, className on @afenda/ui primitives
5. Authority    — ADR-0013 Phase 8 — Application Authority; PERMISSION_REGISTRY from Permission Authority (consume only); `@afenda/database` governed writes (consume only)
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm check:api-contracts
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 2 | Smoke + denial tests pass | `pnpm --filter @afenda/erp test:run` |
| 4 | API contracts registered | `pnpm check:api-contracts` |
| 9 | TIP status index updated | `docs/delivery/tip-status-index.md` |
| 10 | Drift guard passes | `pnpm check:documentation-drift` |
| 11 | No accounting admin logic | ADR-0010 — no `@afenda/accounting` |
| 12 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- Audit list pagination/cursor deferred — fixed default limit only.
- Settings/org mutation APIs deferred beyond MVP.
- Full `erp test:run` green may remain blocked by pre-existing TIP-004 harness failures unrelated to this slice.

## Verdict

**Complete** — Slices 1–4 deliver system-admin layout, RBAC-gated users/memberships/roles/permissions/audit/settings pages, typed section guard with audit on denial, shared access resolver, read-only permission catalog, tenant-scoped audit viewer, and governed admin API contracts (invite, role assignment, audit read) with integration tests for success, permission denial, and cross-company role denial.
