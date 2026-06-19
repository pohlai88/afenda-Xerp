# Afenda Permissions (`@afenda/permissions`)

Central authorization foundation for Afenda ERP (TIP-005).

## Auth vs authorization

| Layer | Package | Question answered |
|-------|---------|-------------------|
| Authentication (TIP-004) | `@afenda/auth` | **Who** is this user? |
| Authorization (TIP-005) | `@afenda/permissions` | **May** this actor perform this action in this scope? |

Better Auth confirms identity. The permission and policy engine confirms authority.

## Responsibilities

- Typed permission key registry (dot notation)
- Role and membership contracts
- Platform actor status gate — only `active` users pass permission checks
- `requirePermission` — role-grant enforcement (registry-validated at boundary)
- `requirePolicyDecision` — policy overlay (approval, evidence, step-up, readonly; registry-validated at boundary)
- `checkPermission` / `checkPolicyDecision` — non-throwing paths; shape-only key validation
- Audit-ready `AuthorizationDecision` output
- Standard denied-result and error types

## Out of scope

- User authentication or session management
- Commercial entitlements or plan checks (TIP-008)
- Module-specific business rules
- Hardcoded admin bypass
- Page-level permission checks without action context

## Usage

```typescript
import {
  actorFromAuthSession,
  InMemoryPermissionDataSource,
  PERMISSION_REGISTRY,
  requirePermission,
} from "@afenda/permissions";
import { requireAfendaAuthSession } from "@afenda/auth";

const session = await requireAfendaAuthSession(headers);
const dataSource = createProductionPermissionDataSource(); // TIP-006+

const decision = await requirePermission(
  {
    actor: actorFromAuthSession(session),
    context: {
      tenantId: workspace.tenantId,
      companyId: workspace.companyId,
      organizationId: workspace.organizationId,
    },
    permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
    action: "manage",
    targetType: "user",
  },
  dataSource
);

// decision is audit-ready: actorId, tenantId, permissionKey, result, correlationId, ...
```

Policy-gated actions:

```typescript
import {
  InMemoryPolicyDataSource,
  requirePolicyDecision,
} from "@afenda/permissions";

const policyDataSource = new InMemoryPolicyDataSource();

try {
  await requirePolicyDecision(request, permissionDataSource, policyDataSource);
  // execute mutation
} catch (error) {
  if (isPolicyGateError(error)) {
    // route to approval / evidence / step-up flow — do not mutate
  }
}
```

## Permission keys

Shape validation lives in `@afenda/database` (`permission-key.contract.ts`).
Registry ownership lives here (`PERMISSION_REGISTRY`).

Format: `{domain}.{action}` — exactly one dot, lowercase snake_case segments.

Use `createPermissionKey(domain, action)` when seeding the `permissions` table.
Use `assertRegisteredPermissionKey()` to reject unregistered keys at boundaries.

Examples:

- `system_admin.users_manage`
- `accounting.journal_post`
- `inventory.stock_adjust`

## Contracts

All exports are normalized contracts — never raw database rows. Wire a `PermissionDataSource` implementation (database adapter in TIP-006) to connect persistence.

## Audit evidence

Every decision includes:

- `actorId`, `tenantId`, `companyId`, `organizationId`, `workspaceId`
- `permissionKey`, `action`, `targetType`, `targetId`
- `result` (`allow`, `deny`, `require_approval`, …)
- `reason`, `correlationId`, `evaluatedAt`
- `membershipId`, `roleId` when resolved

## Consumers

Modules and server actions must import from `@afenda/permissions` only. Do not invent local permission logic in routes or UI components.
