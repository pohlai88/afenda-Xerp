# Foundation Phase Delivery TIP ID Proposal

> **Architecture Authority proposal only.**  
> **This file is not an executable delivery source of truth.**  
> Draft TIP specs inside this file become authoritative **only after** promotion into `docs/delivery/tips/[status] tip-*.md`  
> and after `tip-status-index.md` + `pre-accounting-foundation-roadmap.md` are updated under **§Canonical delivery TIPs**.

| Field | Value |
| --- | --- |
| **Status** | Partially superseded — TIP-010A, TIP-007A, **TIP-013** promoted; historical drafts archived below |
| **Date** | 2026-06-23 |
| **Owner** | Architecture Authority |
| **Authority** | ADR-0013 (delivery sequence), ADR-0012 (evidence-backed docs) |
| **Canonical TIPs** | [`tip-status-index.md`](../delivery/tip-status-index.md) §Canonical delivery TIPs |

---

## Promotion status (2026-06-23)

| Proposed ID | Decision | Canonical delivery doc |
| --- | --- | --- |
| **TIP-010A** | **Accepted** — slice under TIP-010 | [`tip-010a-api-contract-governance.md`](../delivery/tips/[Not started] tip-010a-api-contract-governance.md) |
| **TIP-007A** | **Accepted** — slice under TIP-007 | [`tip-007a-feature-manifest-governance.md`](../delivery/tips/[Not started] tip-007a-feature-manifest-governance.md) |
| **TIP-010B** | **Superseded by TIP-013** | Draft archived in §Draft — TIP-010B below |
| **TIP-013** | **Accepted** — Phase 8 System Admin | [`tip-013-system-admin-control-plane.md`](../delivery/tips/[Not started] tip-013-system-admin-control-plane.md) |

Do not implement System Admin from this proposal file. Use canonical TIP-013 delivery doc only.

**Accounting numbering:** TIP-013 is Phase 8 foundation; Accounting Core begins **TIP-014+** (see [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md)).

---

## Context

Foundation Phases 0–4 and 6 map to existing TIP IDs (TIP-000A–D, TIP-001–012, TIP-UI-01–05). Phases **5**, **7**, and **8** define work items and gates in [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) but lack executable `docs/delivery/tips/[status] tip-*.md` delivery specs with assigned TIP IDs.

Per write-tip rule §2 Step 2: **do not invent TIP numbers**. This note proposes slice IDs following the established **TIP-008A/B** and **TIP-007/012** patterns until Architecture Authority accepts or amends ADR-0013.

### Rejected prior proposal

| Proposed ID | Source | Rejection reason |
| --- | --- | --- |
| `TIP-030-SA` | [`afenda-documentation-drift-audit.md`](afenda-documentation-drift-audit.md) §10 | **Conflicts** with TIP-030 Project Management domain in master plan v5 §13 |

---

## Proposed TIP assignments

| Foundation phase | Proposed TIP ID | Title | Primary owner | Parent TIP | Rationale |
| --- | --- | --- | --- | --- | --- |
| **Phase 5** | **TIP-010A** | API Contract Governance Closeout | `@afenda/erp` (PKG-007) | TIP-010 | Extends identity/API surface; complements [`tip-010-api-rbac-wiring.md`](../delivery/tips/[Partially Implemented] tip-010-api-rbac-wiring.md) with contract registry, envelope, idempotency, pagination |
| **Phase 7** | **TIP-007A** | Feature Manifest & Module Governance | `@afenda/entitlements` (PKG-006), `@afenda/appshell` (PKG-001) | TIP-007 | ERP platform authority owns module/capability/navigation projection pipeline |
| **Phase 8** | **TIP-013** (was TIP-010B proposal) | System Admin Control Plane | `@afenda/erp` (PKG-007) | TIP-010 | **Promoted** — [`tip-013-system-admin-control-plane.md`](../delivery/tips/[Not started] tip-013-system-admin-control-plane.md) |

### Acceptance required before implementation

1. ~~Architecture Authority accepts TIP-010A, TIP-007A~~ — **Done (2026-06-23)**
2. **TIP-010B** — scope accepted; **canonical ID + standalone delivery doc pending**
3. Optional: amend ADR-0013 or add ADR-0014 registering foundation phase slice IDs
4. ~~Promote TIP-010A/007A~~ — **Done** → [`tip-010a-api-contract-governance.md`](../delivery/tips/[Not started] tip-010a-api-contract-governance.md), [`tip-007a-feature-manifest-governance.md`](../delivery/tips/[Not started] tip-007a-feature-manifest-governance.md)
5. ~~Update roadmap Phase 5/7~~ — **Done**; Phase 8 remains pending TIP ID

---

## Delivery ecosystem (write-tip ↔ afenda-coding-session)

Foundation delivery is a **closed loop**, not isolated docs:

```text
tip-status-index.md          ← which TIP is next
        ↓
docs/delivery/tips/[status] tip-*.md       ← spec + DoD + §Handoff to implementation
        ↓
/afenda-coding-session §0    ← paste handoff block (six-line contract)
        ↓
implementation (one slice)   ← dependency order per handoff
        ↓
§11 Completion Report        ← proves DoD rows
        ↓
runtime matrix + index       ← same PR as code
```

When IDs are accepted, each promoted delivery doc **must** include §Handoff per [write-tip TEMPLATES §G](../.cursor/skills/write-tip/TEMPLATES.md#g--handoff-block-template-paste-into-afenda-coding-session).

---

## Draft delivery specs

**Active draft:** None — all Phase 5/7/8 slices promoted (TIP-010A, TIP-007A, TIP-013).  
**Archived drafts below:** historical reference only — **do not implement**.

---

Add handoff pointers at top of draft sections for promoted TIPs:

### Draft — TIP-010A — PROMOTED

> **Superseded.** Canonical spec: [`tip-010a-api-contract-governance.md`](../delivery/tips/[Not started] tip-010a-api-contract-governance.md). Do not implement from this section.

---

### Draft — TIP-007A — PROMOTED

> **Superseded.** Canonical spec: [`tip-007a-feature-manifest-governance.md`](../delivery/tips/[Not started] tip-007a-feature-manifest-governance.md). Do not implement from this section.

---

### Draft — TIP-010A — API Contract Governance Closeout (archived draft)

# TIP-010A — API Contract Governance Closeout

| Field | Value |
| --- | --- |
| **Status** | Not started |
| **Authority status** | Proposed slice — pending Architecture Authority acceptance of TIP-010A |
| **Runtime evidence** | `apps/erp/src/server/api/contracts/`, `scripts/api-contract/check-api-contracts.mts`, `docs/governance/api-contract.md` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 5 — API Contract Governance |
| **Remaining gap** | Route registry covers less than 100% of non-auth ERP routes; idempotency and pagination standards missing |

## Purpose

Close out REST-first, envelope-based API contract governance for all governed ERP surfaces. Every non-auth ERP route must register a serializable `ApiRouteContract`, use `createApiHandler`, emit governed success/error envelopes, and support enterprise isolation and audit requirements.

ADR-0013 authority: Foundation Phase 5 exit criterion — API contract registry covers 100% of non-auth ERP routes.

## Scope

**In scope**

- Complete `api-contract-registry.ts` for all non-auth ERP routes
- Request/response envelope on all governed internal v1 routes
- Consistent error envelope with correlation ID
- Idempotency key rules for mutations (document + implement)
- Pagination/filter/sort standard for list endpoints (document + first reference implementation)
- Internal vs public route separation documented
- `pnpm check:api-contracts` passes on full route surface
- Cross-tenant negative tests for tenant-protected routes

**Out of scope**

- Public OpenAPI catalog (TIP-031)
- Accounting domain routes (TIP-013+, ADR-0010)
- GraphQL or public SDK defaults
- System Admin UI routes (TIP-010B proposed)

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| Envelope contracts | `apps/erp/src/server/api/contracts/api-envelope.contract.ts` | Yes |
| Contract registry | `apps/erp/src/server/api/contracts/api-contract-registry.ts` | Partial |
| createApiHandler | `apps/erp/src/server/api/runtime/create-api-handler.ts` | Partial |
| API contract check script | `scripts/api-contract/check-api-contracts.mts` | Yes |
| Governance doc | `docs/governance/api-contract.md` | Partial |
| Idempotency implementation | — | **No** |
| Pagination standard | — | **No** |
| 100% route registry | — | **No** |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/erp` (PKG-007) | Route handlers, contracts, registry, tests |
| `@afenda/permissions` (PKG-014) | Permission keys on protected contracts |
| `@afenda/kernel` (PKG-010) | Branded execution context in envelopes |

## Depends on

- TIP-010 Identity & Authorization (partial) — [`tip-010-api-rbac-wiring.md`](../delivery/tips/[Partially Implemented] tip-010-api-rbac-wiring.md)
- TIP-012 ERP Operating Spine (partial) — createApiHandler spine

## Blocks

- Foundation Phase 5 gate
- Foundation Phase 9 requirement #5 — API contract governance proven

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `apps/erp/src/server/api/contracts/api-contract-registry.ts` | `@afenda/erp` | Application | Modified | — |
| `apps/erp/src/server/api/contracts/idempotency.contract.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/server/api/contracts/pagination.contract.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `docs/governance/api-contract.md` | docs | Governance | Modified | Architecture Authority |
| `apps/erp/src/server/api/__tests__/api-contract-registry.test.ts` | `@afenda/erp` | Application | Modified | — |
| `apps/erp/src/lib/api/__tests__/api-route-permissions.test.ts` | `@afenda/erp` | Application | Modified | — |

## Acceptance gate

- `pnpm check:api-contracts` passes
- `pnpm --filter @afenda/erp test:run` — registry + boundary tests
- `pnpm --filter @afenda/erp typecheck`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN every non-auth ERP route is registered in api-contract-registry.ts
WHEN  pnpm check:api-contracts runs in CI
THEN  all governed routes declare Zod schemas, permissions where required, and createApiHandler wiring

GIVEN the user is signed in under Tenant A
AND   the user has permission workspace.dashboard_read
WHEN  the user calls GET /api/internal/v1/workspace/dashboard-layout with valid x-tenant-slug
THEN  the response uses the governed success envelope with correlationId in meta
AND   no Company B data is accessible or returned

GIVEN the user is signed in under Tenant A
AND   the user does NOT have permission workspace.dashboard_write
WHEN  the user calls PUT /api/internal/v1/workspace/dashboard-layout
THEN  the API returns 403 Forbidden with error.correlationId
AND   an audit event records the denial with actor and correlation ID

GIVEN a mutation endpoint requires idempotency
WHEN  the client retries with the same Idempotency-Key header
THEN  the server returns the same result without duplicate side effects
AND   an audit event records actor, company, action, target, correlation ID
```

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | 100% non-auth route registry | `pnpm check:api-contracts` | [ ] |
| 2 | Idempotency + pagination contracts exported | File paths exist | [ ] |
| 3 | Tests pass | `pnpm --filter @afenda/erp test:run` | [ ] |
| 4 | Boundaries clean | `pnpm quality:boundaries` | [ ] |
| 5 | Typecheck clean | `pnpm --filter @afenda/erp typecheck` | [ ] |
| 6 | Biome clean | `pnpm ci:biome` | [ ] |
| 7 | Runtime matrix updated | `afenda-runtime-truth-matrix.md` | [ ] |
| 8 | TIP status index updated | `tip-status-index.md` | [ ] |
| 9 | Drift guard passes | `pnpm check:documentation-drift` | [ ] |
| 10 | No accounting routes/schemas | ADR-0010 | [ ] |
| 11 | Completion report posted | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Blocked until Architecture Authority accepts TIP-010A.** Draft handoff for promotion.

```
Handoff from: docs/delivery/tips/[Not started] tip-010a-api-contract-governance.md (Slice 1 — registry)

1. Objective    — Register all non-auth ERP routes in api-contract-registry with Zod contracts.
2. Allowed layer— apps/erp/src/server/api/contracts/ + apps/erp/src/app/api/
3. Files        — apps/erp/src/server/api/contracts/api-contract-registry.ts (Modified)
                  apps/erp/src/server/api/contracts/idempotency.contract.ts (New)
                  apps/erp/src/server/api/contracts/pagination.contract.ts (New)
                  docs/governance/api-contract.md (Modified)
4. Prohibited   — @afenda/accounting routes, packages/ui, unregistered route handlers
5. Authority    — ADR-0013 Foundation Phase 5 — Application Authority
6. Gates        — pnpm check:api-contracts
                  pnpm --filter @afenda/erp test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
```

## Verdict

**Not started** — envelope pattern and partial registry exist; Phase 5 closeout requires full route coverage, idempotency, and pagination standards with tests.

---

### Draft — TIP-007A — Feature Manifest & Module Governance (archived draft)

> **Superseded.** Canonical spec: [`tip-007a-feature-manifest-governance.md`](../delivery/tips/[Not started] tip-007a-feature-manifest-governance.md). Do not implement from this section.

# TIP-007A — Feature Manifest & Module Governance

| Field | Value |
| --- | --- |
| **Status** | Not started |
| **Authority status** | Proposed slice — pending Architecture Authority acceptance of TIP-007A |
| **Runtime evidence** | `packages/entitlements/src/evaluation/feature-manifest.ts` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 7 — Feature Manifest and Module Governance |
| **Remaining gap** | No ERP navigation generation, module route manifest pipeline, or manifest drift tests |

## Purpose

Establish a single feature source → domain → module → capability → navigation → dashboard projection pipeline. Adding an ERP module must require a manifest entry only — no ad-hoc route strings in AppShell or ERP app code.

ADR-0013 authority: Foundation Phase 7 gate — adding a module requires manifest entry only.

## Scope

**In scope**

- Single feature source registry in `@afenda/entitlements`
- Domain / module / capability map driving navigation
- Governed nav generation in `@afenda/appshell` from manifest + RBAC
- Route contract: module placeholder routes generated from manifest (shell only)
- Manifest drift tests
- RBAC-aware dashboard widget registry alignment
- Package generation rules for PKG-R01–R05 (documented — ADR before domain package creation)

**Out of scope**

- Business domain logic in module placeholders
- `@afenda/accounting` or reserved domain packages (ADR-0010)
- Real entitlement billing enforcement (TIP-039)
- System Admin module configuration UI (TIP-010B proposed)

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| FeatureManifestContract interface | `packages/entitlements/src/evaluation/feature-manifest.ts` | Partial — contract + static catalog |
| ERP nav from manifest | — | **No** |
| Module route manifest pipeline | — | **No** |
| Manifest drift tests | — | **No** |
| Feature flags ERP integration | `packages/feature-flags/` | Partial |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/entitlements` (PKG-006) | Feature manifest source, capability evaluation |
| `@afenda/appshell` (PKG-001) | Navigation projection from manifest + permissions |
| `@afenda/permissions` (PKG-014) | RBAC filter on nav items |
| `@afenda/erp` (PKG-007) | Module placeholder routes wired from manifest |

## Depends on

- TIP-006 AppShell Authority (partial) — nav contracts
- TIP-007 ERP Platform Authority (partial)
- TIP-010 Identity & Authorization (partial)
- TIP-UI-05 ERP App Surfaces (partial) — placeholder routes

## Blocks

- Foundation Phase 7 gate
- Foundation Phase 9 requirement #7 — manifest-driven navigation test
- TIP-UI-05 module placeholder closeout (nav-driven routes)

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | `@afenda/entitlements` | Integration | **New** | Platform Authority |
| `packages/entitlements/src/evaluation/module-route-manifest.ts` | `@afenda/entitlements` | Integration | **New** | Platform Authority |
| `packages/appshell/src/navigation/build-nav-from-manifest.ts` | `@afenda/appshell` | ERPSpine | **New** | ERP Spine Authority (TIP-006) |
| `packages/entitlements/src/__tests__/feature-manifest-drift.test.ts` | `@afenda/entitlements` | Integration | **New** | — |
| `apps/erp/src/lib/modules/generate-module-routes.ts` | `@afenda/erp` | Application | **New** | Application Authority |

## Acceptance gate

- `pnpm --filter @afenda/entitlements test:run`
- `pnpm --filter @afenda/appshell test:run`
- `pnpm --filter @afenda/erp test:run`
- `pnpm ui:guard:scan` (AppShell consumer changes)
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN the feature manifest includes module "manufacturing"
AND   the user is signed in under Tenant A
AND   the user has RBAC permission for manufacturing module access
WHEN  the AppShell nav renders
THEN  Manufacturing appears in the nav
AND   no ad-hoc string literals for nav module IDs exist outside governed unions

GIVEN the feature manifest includes module "manufacturing"
AND   the user does NOT have RBAC permission for manufacturing module access
WHEN  the AppShell nav renders
THEN  Manufacturing does not appear in the nav

GIVEN a developer adds a new module entry to the manifest only
WHEN  generate-module-routes runs at build or runtime
THEN  a placeholder route exists without hand-editing route strings in apps/erp
AND   the module surface contains no business domain logic

GIVEN Phase 9 Accounting Readiness Gate has NOT passed
WHEN  the manifest references module "accounting"
THEN  the route renders a shell placeholder only
AND   no ledger, journal, or posting logic is introduced
```

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Manifest registry + nav builder exist | File paths | [ ] |
| 2 | Drift tests pass | `pnpm --filter @afenda/entitlements test:run` | [ ] |
| 3 | AppShell nav integration tests pass | `pnpm --filter @afenda/appshell test:run` | [ ] |
| 4 | UI guard clean | `pnpm ui:guard:scan` | [ ] |
| 5 | Boundaries clean | `pnpm quality:boundaries` | [ ] |
| 6 | Typecheck clean | `pnpm --filter @afenda/entitlements typecheck` | [ ] |
| 7 | Biome clean | `pnpm ci:biome` | [ ] |
| 8 | Runtime matrix updated | `afenda-runtime-truth-matrix.md` | [ ] |
| 9 | TIP status index updated | `tip-status-index.md` | [ ] |
| 10 | Drift guard passes | `pnpm check:documentation-drift` | [ ] |
| 11 | Completion report posted | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Blocked until Architecture Authority accepts TIP-007A.** Multi-package — three slices.

**Slice 1 — Manifest registry (`@afenda/entitlements`):** `feature-manifest.registry.ts`, `module-route-manifest.ts`, drift tests.

**Slice 2 — Nav builder (`@afenda/appshell`):** `build-nav-from-manifest.ts` — requires TIP-006 nav contracts or Architecture approval.

**Slice 3 — ERP routes (`@afenda/erp`):** `generate-module-routes.ts` — shell placeholders only.

Gates per slice: `pnpm --filter <pkg> typecheck`, `pnpm --filter <pkg> test:run`, `pnpm ui:guard:scan` (Slice 2), `pnpm quality:boundaries`.

## Verdict

**Not started** — `FeatureManifestContract` and static catalog exist; manifest-driven navigation and module route pipeline are not implemented.

---

### Draft — TIP-010B — System Admin Control Plane (archived — superseded by TIP-013)

> **Superseded.** Canonical spec: [`tip-013-system-admin-control-plane.md`](../delivery/tips/[Not started] tip-013-system-admin-control-plane.md).  
> **Do not implement from this section.** Historical rationale only.

# TIP-010B — System Admin Control Plane

| Field | Value |
| --- | --- |
| **Status** | Not started |
| **Authority status** | Proposed slice — pending Architecture Authority acceptance of TIP-010B |
| **Runtime evidence** | — (no `system-admin` routes under `apps/erp/src/app/`) |
| **Status source** | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 8 — System Admin Completion Before Accounting |
| **Remaining gap** | No admin UI for users, roles, memberships, permissions catalog, audit viewer |

## Purpose

Deliver the minimum viable System Admin control plane so platform administrators can invite users, assign roles with company scope, and view audit trails without direct database access — a Phase 9 Accounting Readiness Gate requirement.

ADR-0010 / ADR-0013 authority: System Admin control plane operational before Accounting Core (`TIP-013+`).

## Scope

**In scope**

- Admin routes under `apps/erp/src/app/(protected)/system-admin/`
- Users, memberships, roles admin UI (backed by existing `@afenda/database` services)
- Permissions read-only catalog UI (from `PERMISSION_REGISTRY`)
- Audit viewer (read-only search)
- Tenant security and organization settings surfaces (minimum viable)
- All admin mutations through operating spine: RBAC, policy hook, audit, correlation ID, API contracts
- Cross-company and cross-tenant denial tests

**Out of scope**

- Accounting admin (COA, journals, fiscal periods — TIP-013+)
- Approval workflow configuration engine (TIP-029) — placeholder config only
- Full integrations marketplace admin
- `@afenda/accounting` package creation

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| User/membership/role schemas | `packages/database/src/schema/user.schema.ts`, `membership.schema.ts`, `role.schema.ts` | Yes |
| Permission registry | `packages/permissions/src/permission.contract.ts` | Partial |
| System Admin routes | `apps/erp/src/app/` — no `system-admin` | **No** |
| Admin API contracts | — | **No** |
| Audit viewer UI | — | **No** |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/erp` (PKG-007) | Admin routes, Server Components, API handlers |
| `@afenda/database` (PKG-003) | User, membership, role persistence |
| `@afenda/permissions` (PKG-014) | Admin permission keys, policy checks |
| `@afenda/appshell` (PKG-001) | Admin shell layout integration |
| `@afenda/ui` (PKG-018) | Governed admin form primitives (TIP-004) |

## Depends on

- TIP-010 Identity & Authorization (partial)
- TIP-010A API Contract Governance (proposed) — admin API routes
- TIP-012 ERP Operating Spine (partial) — audit + correlation on mutations
- TIP-007A Feature Manifest (proposed) — modules/capabilities admin slice

## Blocks

- Foundation Phase 8 gate
- Foundation Phase 9 requirement #8 — System Admin smoke tests
- TIP-013+ Accounting Core (ADR-0010)

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `apps/erp/src/app/(protected)/system-admin/layout.tsx` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/app/(protected)/system-admin/users/page.tsx` | `@afenda/erp` | Application | **New** | — |
| `apps/erp/src/app/(protected)/system-admin/roles/page.tsx` | `@afenda/erp` | Application | **New** | — |
| `apps/erp/src/app/(protected)/system-admin/audit/page.tsx` | `@afenda/erp` | Application | **New** | — |
| `apps/erp/src/server/api/contracts/system-admin/` | `@afenda/erp` | Application | **New** | TIP-010A |
| `packages/permissions/src/permission.contract.ts` | `@afenda/permissions` | Platform | Modified | Platform Authority — admin permissions |
| `apps/erp/src/__tests__/system-admin.integration.test.tsx` | `@afenda/erp` | Application | **New** | — |

## Acceptance gate

- Admin smoke tests pass — `pnpm --filter @afenda/erp test:run`
- UI guard on admin surfaces — `pnpm ui:guard:scan`
- API contracts registered — `pnpm check:api-contracts`
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
| 8 | Runtime matrix updated | `afenda-runtime-truth-matrix.md` | [ ] |
| 9 | TIP status index updated | `tip-status-index.md` | [ ] |
| 10 | Drift guard passes | `pnpm check:documentation-drift` | [ ] |
| 11 | No accounting admin logic | ADR-0010 | [ ] |
| 12 | Completion report posted | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Blocked until Architecture Authority accepts TIP-010B.** Requires TIP-010A + TIP-012 partial.

```
Handoff from: docs/delivery/tips/[Not started] tip-013-system-admin-control-plane.md (Slice 1 — routes; superseded TIP-010B draft)

1. Objective    — Add system-admin layout and users/roles/audit placeholder pages with RBAC gates.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/
3. Files        — apps/erp/src/app/(protected)/system-admin/layout.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/users/page.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/roles/page.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/audit/page.tsx (New)
4. Prohibited   — @afenda/accounting admin, COA/journal UI, className on @afenda/ui primitives
5. Authority    — ADR-0010 / ADR-0013 Phase 8 — Application Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm check:api-contracts
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
```

## Verdict

**Not started** — database schemas and permission registry exist; no System Admin routes or admin UI surfaces are implemented.

---

## Architecture Authority decision checklist

- [x] Accept TIP-010A — promoted to `docs/delivery/tips/[Not started] tip-010a-api-contract-governance.md`
- [x] Accept TIP-007A — promoted to `docs/delivery/tips/[Not started] tip-007a-feature-manifest-governance.md`
- [x] Accept TIP-013 — promoted to `docs/delivery/tips/[Not started] tip-013-system-admin-control-plane.md` (supersedes TIP-010B)
- [x] Supersede TIP-010B — historical draft only
- [x] Reject `TIP-030-SA` permanently in favor of Phase 8 slice under review
- [x] Add rows to `tip-status-index.md` under **Canonical delivery TIPs**
- [x] Update `pre-accounting-foundation-roadmap.md` Phase 5/7 TIP columns; Phase 8 pending
- [ ] Optional: ADR-0014 Foundation Phase Slice Registry

---

*Architecture Delivery Agent — 2026-06-23*
