import { grantPermissionToRole } from "@afenda/database";
import { describe, expect, it } from "vitest";

import {
  checkPermission,
  createProductionAuthorizationDataSources,
  PERMISSION_REGISTRY,
} from "../index";
import {
  createBridgeAuthorizationDatabase,
  createBridgeAuthorizationStore,
} from "./support/bridge-authorization-store";

const TENANT_ID = "00000000-0000-4000-8000-000000000010";
const COMPANY_ID = "00000000-0000-4000-8000-000000000011";
const USER_ID = "00000000-0000-4000-8000-000000000012";
const ROLE_ID = "00000000-0000-4000-8000-000000000020";
const PERMISSION_ID = "00000000-0000-4000-8000-000000000030";
const MEMBERSHIP_ID = "00000000-0000-4000-8000-000000000040";
const CORRELATION_ID = "corr-authz-bridge-integration";

const PERMISSION_KEY = PERMISSION_REGISTRY.systemAdmin.users.manage;

const audit = {
  actorType: "system" as const,
  correlationId: CORRELATION_ID,
  source: "system" as const,
};

describe("authorization bridge integration", () => {
  it("grantPermissionToRole flows into production authorization checks", async () => {
    const store = createBridgeAuthorizationStore();
    store.tenants.set(TENANT_ID, {
      id: TENANT_ID,
      slug: "bridge-tenant",
      name: "Bridge Tenant",
      status: "active",
    });
    store.users.set(USER_ID, {
      id: USER_ID,
      email: "bridge@example.com",
      displayName: "Bridge User",
      status: "active",
    });
    store.companies.set(COMPANY_ID, {
      id: COMPANY_ID,
      tenantId: TENANT_ID,
    });
    store.roles.set(ROLE_ID, {
      id: ROLE_ID,
      tenantId: TENANT_ID,
      key: "tenant.admin",
      name: "Tenant Admin",
      description: null,
      scope: "tenant",
      status: "active",
    });
    store.permissions.set(PERMISSION_ID, {
      id: PERMISSION_ID,
      key: PERMISSION_KEY,
      name: "Manage Users",
      domain: "system_admin",
      action: "users_manage",
    });
    store.memberships.push({
      id: MEMBERSHIP_ID,
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      entityGroupId: null,
      organizationId: null,
      projectId: null,
      userId: USER_ID,
      roleId: ROLE_ID,
      scopeType: "company",
      status: "active",
    });

    const db = createBridgeAuthorizationDatabase(store);
    const { permission: permissionDataSource } =
      createProductionAuthorizationDataSources(db);

    const deniedBeforeGrant = await checkPermission(
      {
        actor: { actorId: USER_ID },
        context: {
          tenantId: TENANT_ID,
          companyId: COMPANY_ID,
        },
        permissionKey: PERMISSION_KEY,
        correlationId: CORRELATION_ID,
      },
      permissionDataSource
    );

    expect(deniedBeforeGrant.allowed).toBe(false);

    await grantPermissionToRole(
      {
        tenantId: TENANT_ID,
        roleId: ROLE_ID,
        permissionId: PERMISSION_ID,
        reason: "bridge integration proof",
        audit,
      },
      db
    );

    const allowedAfterGrant = await checkPermission(
      {
        actor: { actorId: USER_ID },
        context: {
          tenantId: TENANT_ID,
          companyId: COMPANY_ID,
        },
        permissionKey: PERMISSION_KEY,
        correlationId: CORRELATION_ID,
      },
      permissionDataSource
    );

    expect(allowedAfterGrant.allowed).toBe(true);
    expect(allowedAfterGrant.decision.roleId).toBe(ROLE_ID);

    await grantPermissionToRole(
      {
        tenantId: TENANT_ID,
        roleId: ROLE_ID,
        permissionId: PERMISSION_ID,
        audit,
      },
      db
    );

    const stillAllowed = await checkPermission(
      {
        actor: { actorId: USER_ID },
        context: {
          tenantId: TENANT_ID,
          companyId: COMPANY_ID,
        },
        permissionKey: PERMISSION_KEY,
        correlationId: CORRELATION_ID,
      },
      permissionDataSource
    );

    expect(stillAllowed.allowed).toBe(true);
    expect(store.rolePermissions.size).toBe(1);
  });
});
