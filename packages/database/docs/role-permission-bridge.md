# Governed UI — Role-permission bridge completion

Governed write path for `role_permissions` and production authorization read integration.

## Status

**Status:** Done

**Deferred:** seed/bootstrap (`db:seed:authz`) intentionally excluded

**Follow-up:** authorization read/write integration proof — completed in `@afenda/permissions` (`authorization-bridge.integration.test.ts`)

## Completion audit

| Area | Result | Evidence |
|------|--------|----------|
| Public API | Pass | `grantPermissionToRole`, contract types, and errors exported from `@afenda/database` public API; `rolePermissions` table export retained for read adapters only (existing schema surface) |
| Boundary | Pass | Only `role-permission/role-permission.service.ts` inserts into `role_permissions`; permissions adapter reads via join |
| Runtime | Pass | `DatabasePermissionDataSource.getPermissionsForRole()` reads `role_permissions` joined to `permissions`; integration test proves grant → `checkPermission` allow |
| Audit | Pass | `role.permission.grant` written only when insert returns a row (new grant) |
| Idempotency | Pass | `onConflictDoNothing()` + skip audit on conflict; covered in service and integration tests |
| Tenant safety | Pass | `assertRolePermissionGrantBoundaries()` enforces tenant/platform alignment before insert |

## Governed API

```typescript
import { grantPermissionToRole } from "@afenda/database";

await grantPermissionToRole({
  tenantId,
  roleId,
  permissionId,
  reason: "optional",
  audit: {
    actorType: "system",
    correlationId,
    source: "system",
  },
});
```

Do not insert into `role_permissions` from feature modules.

## Integration proof

```
grantPermissionToRole()
  → shared Postgres state (role_permissions)
  → createProductionAuthorizationDataSources()
  → checkPermission() returns allowed
```

Test location: `packages/permissions/src/__tests__/authorization-bridge.integration.test.ts`

## Out of scope (this TIP)

- Authorization seed/bootstrap scripts
- Policy catalog seeding
- Commercial entitlements (Foundation phase 08)
