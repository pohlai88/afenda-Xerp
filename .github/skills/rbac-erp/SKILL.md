---
name: rbac-erp
description: >-
  Comprehensive RBAC guide for @afenda/permissions (Foundation phase 05). Covers the two-layer
  authorization model (permission check + policy overlay), permission key registry,
  role/membership/tenant contracts, denial codes, policy gate decisions
  (require_approval, require_evidence, require_step_up, readonly), data source
  wiring, server action pattern, testing with InMemory stubs, and all forbidden
  patterns. Use when adding a permission check, registering a new permission key,
  writing a guarded Server Action, handling a PolicyGateError, adding a policy rule,
  or debugging an AuthorizationDeniedError.
disable-model-invocation: true
paths:
  - packages/permissions/**
  - apps/erp/**
---

# RBAC — `@afenda/permissions` (Foundation phase 05)

## Two-layer model

```
Session (Better Auth)
  └─ Layer 1: Permission check   requirePermission / checkPermission
       └─ Layer 2: Policy overlay  requirePolicyDecision / checkPolicyDecision
```

- **Layer 1** — does the actor's role include this `PermissionKey`?
- **Layer 2** — do any active `PolicyContract` rules add a gate or override?

Use `requirePermission` when a denial must throw.  
Use `requirePolicyDecision` when you also need policy gate handling.  
Use `check*` variants for conditional branching without exceptions.

---

## Decision flow (both layers)

```
1. Actor exists and is active?           → deny: missing_actor / inactive_actor
2. Tenant exists and is active?          → deny: missing_tenant / inactive_tenant
3. Company belongs to tenant?            → deny: tenant_mismatch
4. Active membership found for scope?    → deny: missing_membership / company_mismatch
5. Role is active?                       → deny: permission_denied
6. Role grants the PermissionKey?        → deny: permission_denied
7. Policy rules evaluated (layer 2):
   - effect=deny           → deny: policy_denied
   - gateDecision present  → gate: require_approval | require_evidence | require_step_up | readonly
   - no blocking rule      → allow
```

---

## Permission key registry (`PERMISSION_REGISTRY`)

Format: `{domain}.{action}` — lowercase snake_case, exactly one dot.

```ts
// packages/permissions/src/permission.contract.ts
export const PERMISSION_REGISTRY = {
  systemAdmin: {
    users: {
      read:    "system_admin.users_read",
      manage:  "system_admin.users_manage",
    },
    roles:       { manage: "system_admin.roles_manage" },
    permissions: { manage: "system_admin.permissions_manage" },
    modules:     { manage: "system_admin.modules_manage" },
  },
  accounting: { journal: { read: "accounting.journal_read", post: "accounting.journal_post" } },
  inventory:  { stock:   { adjust: "inventory.stock_adjust" } },
  hr:         { employee:{ read: "hr.employee_read" } },
} as const;
```

**Adding a new permission key:**

1. Add to `PERMISSION_REGISTRY` using `definePermissionKey(domain, action)`.
2. Seed the `permissions` table (migration or seed script) with `createPermissionKey(domain, action)`.
3. Assign to roles in the `role_permissions` table.
4. Never hardcode the string — always reference via `PERMISSION_REGISTRY`.

---

## Guarded Server Action pattern

```ts
import { requireAfendaAuthSession } from "@afenda/auth";
import {
  actorFromAuthSession,
  createProductionAuthorizationDataSources,
  PERMISSION_REGISTRY,
  requirePermission,
} from "@afenda/permissions";
import { headers } from "next/headers";

export async function updateInvoiceAction(input: UpdateInvoiceInput) {
  // 1. Authenticate
  const session = await requireAfendaAuthSession(await headers());

  // 2. Authorize (Layer 1)
  const { permission } = createProductionAuthorizationDataSources();
  const decision = await requirePermission(
    {
      actor: actorFromAuthSession(session),
      context: { tenantId: input.tenantId, companyId: input.companyId },
      permissionKey: PERMISSION_REGISTRY.accounting.journal.post,
      action: "post",
      targetType: "invoice",
      targetId: input.invoiceId,
    },
    permission
  );

  // decision is audit-ready — pass to recordErpAuditEvent if needed
  // 3. Mutate
}
```

### With policy layer (approval / step-up flows)

```ts
import {
  isPolicyGateError,
  productionPolicyEvaluationOptions,
  requirePolicyDecision,
} from "@afenda/permissions";

try {
  const { permission, policy } = createProductionAuthorizationDataSources();
  await requirePolicyDecision(
    { actor, context, permissionKey: PERMISSION_REGISTRY.accounting.journal.post },
    permission,
    policy,
    productionPolicyEvaluationOptions  // persists policy audit evidence
  );
  // execute mutation
} catch (error) {
  if (isPolicyGateError(error)) {
    // error.decision.result: "require_approval" | "require_evidence" | "require_step_up" | "readonly"
    // Route to appropriate UX flow — never silently continue or mutate
    return { gated: true, decision: error.decision };
  }
  throw error;
}
```

---

## Role and membership scopes

```ts
type RoleScope = "platform" | "tenant" | "company" | "organization";
type MembershipScopeType = "tenant" | "company" | "organization";
```

Scope resolution order (narrowest wins):
- `organization` membership → matches organization + company + tenant context
- `company` membership → matches company + tenant context
- `tenant` membership → matches tenant context only (no company filter)

Tenant-scope memberships pass `membershipMatchesCompany` for any company — they are the fallback when no company-scoped membership exists.

---

## Denial codes

| Code | Cause |
|------|-------|
| `missing_actor` | No platform user record for the session userId |
| `inactive_actor` | Platform user status is not `active` |
| `missing_tenant` | `tenantId` absent from context or not found |
| `inactive_tenant` | Tenant is `suspended` or `archived` |
| `missing_membership` | No active membership for actor+tenant |
| `company_mismatch` | No membership matching the requested company scope |
| `tenant_mismatch` | Company does not belong to the requested tenant |
| `permission_denied` | Role inactive / not found, or role lacks the permission key |
| `policy_denied` | Active policy rule with `effect: deny` matched |
| `policy_gated` | Active policy gate decision (`require_*` / `readonly`) caught by `PolicyGateError` |

---

## Contracts quick reference

| Contract | Key fields |
|----------|------------|
| `RoleContract` | `id`, `key`, `scope`, `status` (`active\|archived\|inactive`), `tenantId` |
| `MembershipContract` | `userId`, `tenantId`, `roleId`, `scopeType`, `companyId`, `organizationId`, `status` |
| `TenantContract` | `id`, `slug`, `status` (`active\|suspended\|archived`) |
| `PolicyContract` | `key`, `condition`, `effect` (`allow\|deny`), `priority`, `scope`, `tenantId` |
| `AuthorizationDecision` | audit-ready; includes `actorId`, `tenantId`, `permissionKey`, `result`, `reason`, `correlationId`, `membershipId`, `roleId`, `evaluatedAt` |

---

## Testing with in-memory stubs

```ts
import {
  InMemoryPermissionDataSource,
  InMemoryPolicyDataSource,
  requirePermission,
  PERMISSION_REGISTRY,
} from "@afenda/permissions";

const ds = new InMemoryPermissionDataSource()
  .seedPlatformUser({ id: "u-1", status: "active" })
  .seedTenant({ id: "t-1", name: "Acme", slug: "acme", status: "active" })
  .seedRole(
    { id: "r-1", key: "accountant", name: "Accountant", scope: "tenant", status: "active", tenantId: "t-1", description: null },
    [PERMISSION_REGISTRY.accounting.journal.post]
  )
  .seedMembership({ id: "m-1", userId: "u-1", tenantId: "t-1", roleId: "r-1",
    scopeType: "tenant", status: "active", companyId: null, organizationId: null });

const decision = await requirePermission(
  { actor: { actorId: "u-1" },
    context: { tenantId: "t-1" },
    permissionKey: PERMISSION_REGISTRY.accounting.journal.post },
  ds
);
expect(decision.result).toBe("allow");
```

For policy tests, use `InMemoryPolicyDataSource().seedPolicy(rule)`.

---

## Forbidden patterns

```ts
// ❌ Invent local permission logic outside @afenda/permissions
if (session.user.role === "admin") { /* ... */ }

// ❌ Hardcoded admin bypass
if (isAdminUser) return true;

// ❌ Raw string permission key (not from PERMISSION_REGISTRY)
await requirePermission({ permissionKey: "accounting.journal_post", ... }, ds);

// ❌ Page-level UI check without action context
if (!hasPermission) return <Redirect />;   // enforce on the Server Action, not UI

// ❌ Import @afenda/auth inside @afenda/permissions (auth never depends on permissions)

// ❌ Swallow PolicyGateError silently
} catch (error) {
  if (isPolicyGateError(error)) return;  // ← must route to gate UX
}
```

---

## Out of scope for `@afenda/permissions`

- Authentication / session management → `@afenda/auth`
- Commercial entitlements / plan limits → Foundation phase 08
- Module-specific business rules
- Row-level security (handle in Postgres RLS or service layer)

---

## Additional resources

- Package public API: `packages/permissions/src/index.ts`
- Permission registry: `packages/permissions/src/permission.contract.ts`
- Policy decisions: `packages/permissions/src/policy.contract.ts`
- Policy engine: `packages/permissions/src/policy-engine.ts`
- ERP server action helpers: `apps/erp/src/lib/server-actions/resolve-action-session.ts`
- Detailed reference: [reference.md](reference.md)
