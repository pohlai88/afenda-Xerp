# TIP-013 — System Admin Control Plane

| Field | Value |
| --- | --- |
| **Status** | Not started |
| **Authority status** | **Accepted** — Architecture Authority Phase 8 delivery TIP (2026-06-23) |
| **Runtime evidence** | `packages/database/src/schema/user.schema.ts`, `membership.schema.ts`, `role.schema.ts`; no `system-admin` routes under `apps/erp/src/app/` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 8 — System Admin Control Plane |
| **Remaining gap** | No System Admin routes, admin API contracts, or control-plane UI surfaces |
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

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| User / membership / role schemas | `packages/database/src/schema/user.schema.ts`, `membership.schema.ts`, `role.schema.ts` | Yes |
| Permission registry | `packages/permissions/src/permission.contract.ts` | Partial |
| Policy service | `packages/permissions/` policy evaluation | Partial |
| System Admin routes | `apps/erp/src/app/` — no `system-admin` | **No** |
| Admin API contracts | `apps/erp/src/server/api/contracts/system-admin/` | **No** |
| Audit viewer UI | — | **No** |

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
| `packages/permissions/src/permission.contract.ts` | `@afenda/permissions` | Platform | Modified | Platform Authority |
| `apps/erp/src/__tests__/system-admin.integration.test.tsx` | `@afenda/erp` | Application | **New** | — |

## Acceptance gate

- Admin smoke + denial tests — `pnpm --filter @afenda/erp test:run`
- UI guard — `pnpm ui:guard:scan`
- API contracts — `pnpm check:api-contracts`
- `pnpm --filter @afenda/erp typecheck`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN the user is signed in under Tenant A
AND   the user has permission platform.admin.users_invite
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
AND   the user has permission platform.admin.audit_read
WHEN  the admin opens the audit viewer
THEN  audit events for Tenant A are searchable read-only
AND   no mutation occurs without explicit admin write permission

GIVEN the user is signed in under Tenant A
AND   the user does NOT have permission platform.admin.users_invite
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
| 1 | System admin routes exist | `apps/erp/src/app/(protected)/system-admin/` | [ ] |
| 2 | Smoke + denial tests pass | `pnpm --filter @afenda/erp test:run` | [ ] |
| 3 | UI guard clean | `pnpm ui:guard:scan` | [ ] |
| 4 | API contracts registered | `pnpm check:api-contracts` | [ ] |
| 5 | Boundaries clean | `pnpm quality:boundaries` | [ ] |
| 6 | Typecheck clean | `pnpm --filter @afenda/erp typecheck` | [ ] |
| 7 | Biome clean | `pnpm ci:biome` | [ ] |
| 8 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [ ] |
| 9 | TIP status index updated | `docs/delivery/tip-status-index.md` | [ ] |
| 10 | Drift guard passes | `pnpm check:documentation-drift` | [ ] |
| 11 | No accounting admin logic | ADR-0010 — no `@afenda/accounting` | [ ] |
| 12 | Completion report posted | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Mandatory before code edits.** Phase 8 MVP — implement one slice per session.

**Prerequisites:** TIP-010A Slice 1 (registry) and TIP-012 partial (audit on mutations) recommended before admin mutation APIs.

### Slice 1 — Shell + users (`@afenda/erp`)

```
Handoff from: docs/delivery/tips/[Not started] tip-013-system-admin-control-plane.md (Slice 1)

1. Objective    — Add system-admin layout and users page with RBAC-gated Server Components.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/
3. Files        — apps/erp/src/app/(protected)/system-admin/layout.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/users/page.tsx (New)
4. Prohibited   — @afenda/accounting, COA/journal UI, className on @afenda/ui primitives, packages/ui edits
5. Authority    — ADR-0013 Phase 8 — Application Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
```

### Slice 2 — Memberships + roles + permissions catalog (`@afenda/erp`)

```
Handoff from: docs/delivery/tips/[Not started] tip-013-system-admin-control-plane.md (Slice 2)

1. Objective    — Add memberships, roles, and read-only permissions catalog admin pages.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/
3. Files        — apps/erp/src/app/(protected)/system-admin/memberships/page.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/roles/page.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/permissions/page.tsx (New)
4. Prohibited   — local permission constants (use PERMISSION_REGISTRY), @afenda/accounting
5. Authority    — ADR-0013 Phase 8 — Application Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
```

**Prerequisite:** Slice 1 merged.

### Slice 3 — Audit viewer + settings (`@afenda/erp`)

```
Handoff from: docs/delivery/tips/[Not started] tip-013-system-admin-control-plane.md (Slice 3)

1. Objective    — Add read-only audit viewer and minimum organization/security settings surfaces.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/
3. Files        — apps/erp/src/app/(protected)/system-admin/audit/page.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/settings/page.tsx (New)
4. Prohibited   — accounting settings, mutation without spine audit hook
5. Authority    — ADR-0013 Phase 8 — Application Authority
6. Gates        — pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
```

**Prerequisite:** Slice 2 merged.

### Slice 4 — Admin API contracts + integration tests (`@afenda/erp`, `@afenda/permissions`)

```
Handoff from: docs/delivery/tips/[Not started] tip-013-system-admin-control-plane.md (Slice 4)

1. Objective    — Register system-admin API contracts; add platform.admin.* permissions; integration tests for invite, denial, audit read.
2. Allowed layer— apps/erp/src/server/api/contracts/system-admin/ + packages/permissions/src/permission.contract.ts
3. Files        — apps/erp/src/server/api/contracts/system-admin/ (New directory)
                  packages/permissions/src/permission.contract.ts (Modified)
                  apps/erp/src/__tests__/system-admin.integration.test.tsx (New)
4. Prohibited   — @afenda/accounting, unregistered API routes
5. Authority    — ADR-0013 Phase 8 — Application + Permission Authority
6. Gates        — pnpm check:api-contracts
                  pnpm --filter @afenda/erp test:run
                  pnpm --filter @afenda/permissions test:run
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
```

**Prerequisite:** Slices 1–3 merged.

## Verdict

**Not started** — database schemas and permission registry exist; System Admin routes, API contracts, and control-plane UI are not implemented.
