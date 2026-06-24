# TIP-007 — ERP Platform Authority

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Authority status** | Complete — platform entity ownership map frozen in `@afenda/kernel` |
| **Runtime evidence** | `packages/kernel/src/contracts/platform/`, `packages/kernel/src/context/`, `packages/database/src/schema/` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 1 — Platform Authority Contracts |
| **Remaining gap** | None — Slice 1 delivered |
| **Related delivery** | [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md) — multi-tenancy slice delivered |

## Purpose

Freeze the ERP platform entity ownership map before business domain packages exist. TIP-007 defines who owns writes, reads, audit emission, and cross-package serializable contracts for:

```text
tenant → company → organization → workspace → user → membership → role → permission → policy → approval → audit
```

Database schemas exist in `@afenda/database`; kernel operating-context contracts exist under `packages/kernel/src/context/`. This TIP closes the gap by publishing a **single governed authority map** and a **`@afenda/kernel` platform contract barrel** that downstream packages consume — not redefine.

ADR-0001 authority: Foundation Phase 1 — all platform entities have ownership and boundaries before TIP-008 master data, TIP-010 identity wiring, or TIP-012 operating spine expansion.

## Scope

**In scope**

- Platform entity ownership map (contract owner, persistence owner, authorization consumer)
- Serializable platform authority contracts in `@afenda/kernel`
- Barrel export from `packages/kernel/src/contracts/platform/`
- Authority map drift tests (entity ↔ schema ↔ contract alignment)
- Alignment with existing Drizzle schemas and permissions contracts

**Out of scope**

- Business master data entities (TIP-008B — Customer, Product, Employee, Warehouse)
- Enterprise hierarchy runtime expansion beyond authority stubs (TIP-008A — see [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md))
- Business domain packages (TIP-013+; ADR-0010)
- Consolidation arithmetic or accounting readiness computation
- New persistence tables — schemas already exist; this TIP freezes authority, not migrations

## Platform entity ownership map

Canonical vocabulary: [`docs/architecture/multi-tenancy.md`](../../architecture/multi-tenancy.md) glossary + ADR-0001 TIP-007 deliverables list.

| Entity | Serializable contract (authority) | Persistence (`@afenda/database`) | Authorization consumer (`@afenda/permissions`) | Write owner | Read owner | Audit owner |
| --- | --- | --- | --- | --- | --- | --- |
| **Tenant** | `packages/kernel/src/context/tenant-context.contract.ts` | `packages/database/src/schema/tenant.schema.ts` | `packages/permissions/src/tenant.contract.ts` | Platform admin / System Admin (TIP-013) | All scoped packages via kernel context | `@afenda/database` `audit.schema.ts` |
| **Company** | `packages/kernel/src/context/legal-entity-context.contract.ts` | `packages/database/src/schema/company.schema.ts` | Grant scope via `membership.contract.ts` + `grant-scope-resolution.ts` | Tenant-scoped admin | Scoped packages via `LegalEntityContext` | `audit.schema.ts` |
| **Organization** | `packages/kernel/src/context/organization-unit-context.contract.ts` | `packages/database/src/schema/organization.schema.ts` | `membership.contract.ts` (`organizationId`) | Company-scoped admin | Scoped packages via `OrganizationUnitContext` | `audit.schema.ts` |
| **Workspace** | `packages/kernel/src/context/workspace-context.contract.ts` (derived runtime — **not** a DB table) | — | Membership + operating-context resolution | ERP host (`apps/erp/src/lib/context/`) | AppShell display via `app-shell-context.contract.ts` | Context resolution audit via observability adapter |
| **User** | Branded ID: `packages/kernel/src/contracts/platform-id.contract.ts` (`UserId`) | `packages/database/src/schema/user.schema.ts` | `packages/permissions/src/user.contract.ts` | Identity provider + platform admin | Authorization actor resolution | `audit.schema.ts` |
| **Membership** | `PermissionScopeContext` + permissions contracts | `packages/database/src/schema/membership.schema.ts` | `packages/permissions/src/scope/membership.contract.ts` | Tenant / company admin | `@afenda/permissions` grant resolution | `audit.schema.ts` |
| **Role** | Permissions grant contracts | `packages/database/src/schema/role.schema.ts`, `role-permission.schema.ts` | `packages/permissions/src/grants/role.contract.ts` | Platform admin | `@afenda/permissions` `PERMISSION_REGISTRY` | `audit.schema.ts` |
| **Permission** | Branded ID + registry keys | `packages/database/src/schema/permission.schema.ts` | `packages/permissions/src/grants/permission.contract.ts`, `PERMISSION_REGISTRY` | Architecture Authority (registry) | All authorization checks | Denial decisions via `authorization-error.ts` |
| **Policy** | — (authorization layer) | `packages/database/src/schema/policy.schema.ts` | `packages/permissions/src/policy.contract.ts`, `policy-engine.ts` | Platform admin | `@afenda/permissions` policy evaluation | `packages/permissions/src/policy-audit.ts` |
| **Approval** | Policy gate outcome (`require_approval`) — no standalone entity table | Condition on `policies` rows | `policy-engine.ts` + `authorization-error.ts` (`PolicyGateError`) | Policy-defined approvers (future workflow) | Policy engine | Policy evaluation audit |
| **Audit** | Branded ID: `platform-id.contract.ts` (`AuditEventId`, `CorrelationId`) | `packages/database/src/schema/audit.schema.ts` | `policy-audit.ts`, authorization decision payloads | Mutation handlers / spine | Observability + compliance readers | `@afenda/database` audit pipeline |

**Boundary rules (frozen by this TIP)**

1. `@afenda/kernel` **defines** serializable platform authority contracts; it does not perform authorization or persistence.
2. `@afenda/database` **persists** platform entities; it does not define ownership boundaries or permission semantics.
3. `@afenda/permissions` **evaluates** access; it consumes kernel + database contracts — it does not own tenant/company/org context shapes.
4. `apps/erp` **resolves** operating context and projects kernel contracts at the request boundary; it does not redefine platform entity types.

## Runtime evidence (2026-06-24)

| Artifact | Path | Proven |
| --- | --- | --- |
| Kernel operating-context contracts (10 required modules) | `packages/kernel/src/context/` | Yes — registry + tests |
| Context registry governance | `packages/kernel/src/context/context-registry.ts` | Yes |
| Branded platform IDs | `packages/kernel/src/contracts/platform-id.contract.ts` | Yes |
| Platform schema registry | `packages/database/src/schema/index.ts` (`platformSchema`) | Yes |
| Tenant / company / org / membership persistence | `tenant.schema.ts`, `company.schema.ts`, `organization.schema.ts`, `membership.schema.ts` | Yes |
| Role / permission / policy persistence | `role.schema.ts`, `permission.schema.ts`, `policy.schema.ts`, `role-permission.schema.ts` | Yes |
| Audit persistence | `packages/database/src/schema/audit.schema.ts` | Yes |
| Permissions contracts + registry | `packages/permissions/src/grants/`, `policy.contract.ts`, `PERMISSION_REGISTRY` | Yes |
| Policy evaluation + audit writer | `packages/permissions/src/policy-engine.ts`, `policy-audit.ts` | Yes |
| Multi-tenancy resolver pipeline | `apps/erp/src/lib/context/resolve-operating-context.server.ts` | Yes — via TIP-007/012 |
| **Platform authority barrel** | `packages/kernel/src/contracts/platform/` | Yes — Slice 1 |
| **Authority map drift tests** | `packages/kernel/src/__tests__/platform-entity-authority.contract.test.ts` | Yes — Slice 1 |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/kernel` (PKG-010) | Platform authority contract types, entity ownership map, branded IDs |
| `@afenda/database` (PKG-003) | Persistence (consumes authority; does not define it) |
| `@afenda/permissions` (PKG-014) | Authorization engine (consumes platform contracts; owns policy/permission evaluation) |

## Depends on

- [TIP-001 Architecture Authority]([Complete]%20tip-001-architecture-authority.md) — package boundaries, dependency registry, layer enforcement
- [TIP-005 Metadata Authority]([Complete%20(authority%20only)]%20tip-005-metadata-authority.md) — cross-package metadata rules; no duplicate contract surfaces

## Blocks

- [TIP-008 Master Data Authority]([Partially%20Implemented]%20tip-008-master-data-authority.md) — business entity ownership requires frozen platform map
- [TIP-010 Identity & Authorization Foundation]([Partially%20Implemented]%20tip-010-api-rbac-wiring.md) — RBAC wiring assumes platform entity contracts are canonical
- [TIP-012 ERP Operating Spine]([Partially%20Implemented]%20tip-012-erp-operating-spine.md) — spine lifecycle requires platform audit + policy boundaries

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `packages/kernel/src/context/tenant-context.contract.ts` | `@afenda/kernel` | Platform | Existing | Platform Authority |
| `packages/kernel/src/context/legal-entity-context.contract.ts` | `@afenda/kernel` | Platform | Existing | Platform Authority |
| `packages/kernel/src/context/organization-unit-context.contract.ts` | `@afenda/kernel` | Platform | Existing | Platform Authority |
| `packages/kernel/src/context/workspace-context.contract.ts` | `@afenda/kernel` | Platform | Existing | Platform Authority |
| `packages/kernel/src/context/permission-scope-context.contract.ts` | `@afenda/kernel` | Platform | Existing | Platform Authority |
| `packages/kernel/src/context/operating-context.contract.ts` | `@afenda/kernel` | Platform | Existing | Platform Authority |
| `packages/kernel/src/contracts/platform-id.contract.ts` | `@afenda/kernel` | Platform | Existing | Platform Authority |
| `packages/database/src/schema/tenant.schema.ts` | `@afenda/database` | Persistence | Existing | Platform Authority |
| `packages/database/src/schema/company.schema.ts` | `@afenda/database` | Persistence | Existing | Platform Authority |
| `packages/database/src/schema/organization.schema.ts` | `@afenda/database` | Persistence | Existing | Platform Authority |
| `packages/database/src/schema/user.schema.ts` | `@afenda/database` | Persistence | Existing | Platform Authority |
| `packages/database/src/schema/membership.schema.ts` | `@afenda/database` | Persistence | Existing | Platform Authority |
| `packages/database/src/schema/role.schema.ts` | `@afenda/database` | Persistence | Existing | Platform Authority |
| `packages/database/src/schema/permission.schema.ts` | `@afenda/database` | Persistence | Existing | Platform Authority |
| `packages/database/src/schema/policy.schema.ts` | `@afenda/database` | Persistence | Existing | Platform Authority |
| `packages/database/src/schema/audit.schema.ts` | `@afenda/database` | Persistence | Existing | Platform Authority |
| `packages/permissions/src/tenant.contract.ts` | `@afenda/permissions` | Authorization | Existing | Platform Authority |
| `packages/permissions/src/user.contract.ts` | `@afenda/permissions` | Authorization | Existing | Platform Authority |
| `packages/permissions/src/scope/membership.contract.ts` | `@afenda/permissions` | Authorization | Existing | Platform Authority |
| `packages/permissions/src/grants/role.contract.ts` | `@afenda/permissions` | Authorization | Existing | Platform Authority |
| `packages/permissions/src/grants/permission.contract.ts` | `@afenda/permissions` | Authorization | Existing | Platform Authority |
| `packages/permissions/src/policy.contract.ts` | `@afenda/permissions` | Authorization | Existing | Platform Authority |
| `packages/permissions/src/policy-audit.ts` | `@afenda/permissions` | Authorization | Existing | Platform Authority |
| `packages/kernel/src/contracts/platform/platform-entity-authority.contract.ts` | `@afenda/kernel` | Platform | **New** (Slice 1) | Platform Authority |
| `packages/kernel/src/contracts/platform/index.ts` | `@afenda/kernel` | Platform | **New** (Slice 1) | Platform Authority |
| `packages/kernel/src/index.ts` | `@afenda/kernel` | Platform | Modified (Slice 1) | Platform Authority |
| `packages/kernel/src/__tests__/platform-entity-authority.contract.test.ts` | `@afenda/kernel` | Platform | **New** (Slice 1) | — |

## Acceptance gate

- `pnpm --filter @afenda/kernel test:run`
- `pnpm --filter @afenda/kernel typecheck`
- `pnpm --filter @afenda/permissions test:run`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN ADR-0001 TIP-007 platform entities are defined
WHEN  a developer imports platform authority from @afenda/kernel
THEN  a single barrel at packages/kernel/src/contracts/platform/ exports the entity ownership map
AND   no consumer package redefines Tenant, Company, Organization, User, Membership, Role, Permission, Policy, or Audit contract shapes

GIVEN the platform entity ownership map in this delivery doc
WHEN  authority map drift tests run
THEN  every ADR-0001 entity has a registered contract path in @afenda/kernel or @afenda/permissions
AND   every persisted entity has a matching schema under packages/database/src/schema/
AND   Workspace is documented as derived runtime context with no database table

GIVEN a tenant-scoped ERP request
WHEN  operating context is resolved via apps/erp/src/lib/context/
THEN  TenantContext, LegalEntityContext, and OrganizationUnitContext are assembled from server-side lookups
AND   client-supplied tenantId, companyId, or organizationId fields are rejected by untrusted-client-authority guards

GIVEN a user holds an active membership with a role assignment
WHEN  @afenda/permissions evaluates a permission check
THEN  the decision uses MembershipContract and RoleContract from the permissions package
AND   a denial or policy gate produces an audit-ready payload with correlation ID

GIVEN a policy rule with gateDecision require_approval
WHEN  the policy engine evaluates a matching permission
THEN  the authorization result is require_approval
AND   no separate Approval persistence table is introduced outside the policy model

GIVEN platform entity contracts are consumed by TIP-010 RBAC wiring
WHEN  an API route authorizes an action
THEN  permission keys resolve against PERMISSION_REGISTRY
AND   platform entity boundaries from this TIP are not bypassed by inline tenant lookups
```

### Acceptance criteria proof

| Scenario | Proof |
| --- | --- |
| Single kernel platform barrel | `packages/kernel/src/contracts/platform/index.ts`; `packages/kernel/src/index.ts` re-export |
| Entity ownership map frozen | This TIP §Platform entity ownership map; `platform-entity-authority.contract.ts` |
| Schema ↔ contract alignment | `packages/kernel/src/__tests__/platform-entity-authority.contract.test.ts` |
| Operating context from server lookups | `apps/erp/src/lib/context/resolve-operating-context.server.ts`; `packages/kernel/src/__tests__/untrusted-client-authority.contract.test.ts` |
| Membership + role authorization | `packages/permissions/src/__tests__/authorization.test.ts`; `authorization-bridge.integration.test.ts` |
| Policy gate require_approval | `packages/permissions/src/__tests__/authorization.test.ts` (approval policy scenarios) |
| PERMISSION_REGISTRY on API routes | `apps/erp/src/lib/context/` + TIP-010 wiring evidence (partial — remaining routes) |

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Platform entity ownership map documented | This TIP §Platform entity ownership map | [x] |
| 2 | Kernel context contracts for tenant / company / org / workspace exist | `packages/kernel/src/context/` | [x] |
| 3 | Database schemas for all ADR-0001 platform entities exist | `packages/database/src/schema/` | [x] |
| 4 | Permissions contracts for membership / role / permission / policy exist | `packages/permissions/src/` | [x] |
| 5 | Multi-tenancy operating-context slice delivered | [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md) | [x] |
| 6 | Platform authority barrel exists | `packages/kernel/src/contracts/platform/index.ts` | [x] |
| 7 | Authority map drift tests pass | `pnpm --filter @afenda/kernel test:run` | [x] |
| 8 | Kernel public export includes platform barrel | `packages/kernel/src/index.ts` | [x] |
| 9 | Boundaries clean | `pnpm quality:boundaries` | [x] |
| 10 | Typecheck clean | `pnpm --filter @afenda/kernel typecheck` | [x] |
| 11 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] |
| 12 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] |
| 13 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 14 | Completion report posted | afenda-coding-session §11 | [x] |

## Handoff to implementation

> **Mandatory before code edits.** One slice closes the remaining TIP-007 gap — platform contract barrel + authority map tests.

### Slice 1 — Platform contract barrel (`@afenda/kernel`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** TIP-001 Complete; TIP-005 authority-only Complete; multi-tenancy slice runtime evidence in [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md)

#### Design (internal-guide)

- Add `packages/kernel/src/contracts/platform/` as the **single import surface** for platform entity authority — do not scatter ownership constants across `context/` files.
- `platform-entity-authority.contract.ts` encodes the ADR-0001 entity list as a typed registry: entity id, contract path, schema path (nullable for Workspace), authorization consumer path, write/read/audit owner labels.
- Re-export existing context types from the barrel where they are the canonical authority shape (e.g. `TenantContext`, `LegalEntityContext`); do **not** duplicate interface definitions.
- Approval is modeled as a **policy gate outcome** (`require_approval`) — no new Approval table or contract type.
- Drift test asserts: (a) every registry entry path exists on disk, (b) ADR-0001 entity count matches registry length, (c) Workspace has null schema path, (d) barrel re-exports match `platform-entity-authority.contract.ts` entries.
- Update `packages/kernel/src/index.ts` to export from `./contracts/platform/index.js` — preserve existing context barrel exports for backward compatibility.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Complete] tip-007-erp-platform-authority.md

1. Objective    — Publish governed platform entity authority barrel and drift tests in @afenda/kernel; freeze ADR-0001 ownership map without new persistence or authorization logic.
2. Allowed layer— packages/kernel/src/contracts/platform/
                  packages/kernel/src/__tests__/platform-entity-authority.contract.test.ts
                  packages/kernel/src/index.ts (Modified)
                  docs/delivery/tips/[Complete] tip-007-erp-platform-authority.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
3. Files        — packages/kernel/src/contracts/platform/platform-entity-authority.contract.ts (New)
                  packages/kernel/src/contracts/platform/index.ts (New)
                  packages/kernel/src/__tests__/platform-entity-authority.contract.test.ts (New)
                  packages/kernel/src/index.ts (Modified)
                  docs/delivery/tips/[Complete] tip-007-erp-platform-authority.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/database schema/migration edits, packages/permissions logic changes, apps/erp resolver changes, @afenda/accounting, ADR-0010 Accounting Core packages, new Approval persistence table, duplicate Tenant/Company/User contract interfaces outside kernel authority registry
5. Authority    — ADR-0001 Phase 1 — Platform Authority Contracts (TIP-007)
6. Gates        — pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/kernel test:run
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 6 | Platform authority barrel exists | `pnpm --filter @afenda/kernel test:run` |
| 7 | Authority map drift tests pass | `pnpm --filter @afenda/kernel test:run` |
| 8 | Kernel public export includes platform barrel | `pnpm --filter @afenda/kernel typecheck` |
| 9 | Boundaries clean | `pnpm quality:boundaries` |
| 10 | Typecheck clean | `pnpm --filter @afenda/kernel typecheck` |
| 11 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 12 | TIP status index updated | `pnpm check:documentation-drift` |
| 13 | Drift guard passes | `pnpm check:documentation-drift` |
| 14 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- TIP-007/012 multi-tenancy resolver does not yet cover all ERP protected routes — route coverage remains TIP-007/012 scope, not this slice.
- TIP-010 RBAC wiring partial — platform contracts unblock remaining routes but do not implement them.
- Consolidation scope resolution stub remains TIP-008A scope.

## Verdict

**Complete** — Kernel operating-context contracts, database platform schemas, permissions authorization contracts, multi-tenancy operating-context slice ([`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md)), and the formal platform entity authority barrel at `packages/kernel/src/contracts/platform/` with drift tests are delivered. ADR-0001 platform ownership is frozen; TIP-008, TIP-010, and TIP-012 may consume `@afenda/kernel` platform authority without redefining entity shapes.
