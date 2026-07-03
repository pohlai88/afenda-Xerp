# RBAC Reference — `@afenda/permissions`

## Complete `checkPermission` request shape

```ts
interface PermissionCheckRequest {
  actor:         { actorId: string };
  context: {
    tenantId:       string;          // required
    companyId?:     string | null;
    organizationId?: string | null;
    workspaceId?:   string | null;
  };
  permissionKey: PermissionKey | string;
  action?:       string;             // defaults to the action segment of permissionKey
  targetType?:   string | null;      // e.g. "invoice", "user"
  targetId?:     string | null;      // record-level context for audit
  correlationId?: string;            // auto-generated if omitted
}
```

## `AuthorizationDecision` shape (audit-ready)

```ts
interface AuthorizationDecision {
  actorId:         string;
  tenantId:        string;
  companyId:       string | null;
  organizationId:  string | null;
  workspaceId:     string | null;
  membershipId:    string | null;
  roleId:          string | null;
  permissionKey:   PermissionKey;
  action:          string;
  targetType:      string | null;
  targetId:        string | null;
  result:          PolicyDecision;     // "allow" | "deny" | gate variants
  reason:          string;
  correlationId:   string;
  evaluatedAt:     string;             // ISO timestamp
}
```

Pass `decision` directly to `recordErpAuditEvent` or `writeAuditEvent` as evidence.

## Policy gate decision handling

```ts
type PolicyGateDecision =
  | "require_approval"    // action needs a human approver
  | "require_evidence"    // actor must supply supporting evidence
  | "require_step_up"     // re-authentication / MFA step required
  | "readonly";           // action is visible but not executable
```

Catch `PolicyGateError`, inspect `error.decision.result`, and route:

| Gate | UX response |
|------|-------------|
| `require_approval` | Open approval workflow; return pending state |
| `require_evidence` | Prompt for document upload or justification |
| `require_step_up` | Trigger MFA / re-auth challenge |
| `readonly` | Render view-only mode; disable mutation controls |

## Data source interface summary

### `PermissionDataSource`

```ts
interface PermissionDataSource {
  findMembershipsForActor(input: { actorId: string; tenantId: string }): Promise<readonly MembershipContract[]>;
  getPermissionsForRole(roleId: string): Promise<readonly PermissionKey[]>;
  getPlatformUser(actorId: string): Promise<PlatformUserContract | null>;
  getRole(roleId: string): Promise<RoleContract | null>;
  getTenant(tenantId: string): Promise<TenantContract | null>;
  isCompanyInTenant(companyId: string, tenantId: string): Promise<boolean>;
}
```

### `PolicyDataSource`

```ts
interface PolicyDataSource {
  findApplicableRules(input: PolicyEvaluationInput): Promise<readonly PolicyContract[]>;
}
```

Production: `createProductionAuthorizationDataSources()` — returns both.  
Tests: `InMemoryPermissionDataSource` / `InMemoryPolicyDataSource`.

## Membership scope resolution algorithm

```
activeMemberships = memberships.filter(status === "active")

  ↓ if empty → missing_membership

companyScopedMemberships = activeMemberships.filter(
  scopeType === "tenant"  ||  companyId matches context.companyId
)

  ↓ if empty → company_mismatch

organizationScopedMemberships = companyScopedMemberships.filter(
  scopeType !== "organization"  ||  organizationId matches context.organizationId
)

  ↓ if empty → company_mismatch (org variant)

membership = organizationScopedMemberships[0]  ← first match wins
```

## `PolicyContract` condition matching

Conditions are matched via `policyConditionMatches(condition, input)` from `@afenda/database`.  
A policy applies when:
- `status === "active"`
- `scope === "platform"` OR `tenantId === input.tenantId`
- `condition` matches `{ permissionKey, action, targetType? }`

Priority (ascending integer) determines evaluation order — lower priority number = evaluated first.

## Role scope hierarchy

| Scope | Assigned where | Membership scopeType |
|-------|---------------|----------------------|
| `platform` | Global admin role | — (no membership needed) |
| `tenant` | Workspace-level | `"tenant"` |
| `company` | Per-company assignment | `"company"` |
| `organization` | Sub-org assignment | `"organization"` |

Platform-scope roles are reserved for system-level admin — do not assign to end users.

## Adding a new module's permissions

```ts
// 1. Extend PERMISSION_REGISTRY in permission.contract.ts
export const PERMISSION_REGISTRY = {
  // ...existing...
  crm: {
    contact: {
      read:   definePermissionKey("crm", "contact_read"),
      create: definePermissionKey("crm", "contact_create"),
      update: definePermissionKey("crm", "contact_update"),
      delete: definePermissionKey("crm", "contact_delete"),
    },
  },
} as const satisfies PermissionRegistryShape;   // type error if shape breaks

// 2. Write a DB migration to insert rows into `permissions` table
// 3. Assign to roles via `role_permissions` table seeding
// 4. Reference in server actions via PERMISSION_REGISTRY.crm.contact.create
```

## `resolveActionSession` utility

`apps/erp/src/lib/server-actions/resolve-action-session.ts`:

```ts
const result = await resolveActionSession();
if (!result.ok) return failServerAction(result.error);
const session = result.session;
const actor = actorFromAuthSession(session);
```

Use instead of calling `getAfendaAuthSession` directly in every action — handles null session and errors uniformly.

## Audit integration

After `requirePermission` or `requirePolicyDecision`:

```ts
await recordActionAudit({
  action: "invoice.post",
  actorUserId: decision.actorId,
  module: "accounting",
  result: "success",
  targetType: "invoice",
});
```

Or use `decision` directly with `writeAuditEvent` for richer audit evidence with `correlationId`.

## Testing checklist

For each permission-guarded server action, write tests covering:

```
- [ ] active user + active tenant + correct role → allow
- [ ] missing user → missing_actor denial
- [ ] inactive user → inactive_actor denial
- [ ] missing tenant → missing_tenant denial
- [ ] suspended/archived tenant → inactive_tenant denial
- [ ] no membership → missing_membership denial
- [ ] wrong company scope → company_mismatch denial
- [ ] role lacks permission → permission_denied denial
- [ ] policy deny rule → policy_denied denial
- [ ] policy gate rule → PolicyGateError (correct gateDecision)
```

Use `InMemoryPermissionDataSource` + `InMemoryPolicyDataSource` for all unit tests.  
Use `noopPolicyAuditWriter` in `PolicyEvaluationOptions` to skip DB audit in tests.
