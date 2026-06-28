import type {
  insertMembership,
  insertUser,
  updateMembership,
} from "@afenda/database";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { assertAuthorizedApiRoute } from "@/lib/api/authorize-api-route";
import {
  MODULE_ROUTE_TEST_ACTOR_ID,
  MODULE_ROUTE_TEST_COMPANY_ID,
  MODULE_ROUTE_TEST_TENANT_ID,
} from "@/lib/modules/__tests__/module-route-test-fixtures";
import {
  createSystemAdminApiOperatingContextResolver,
  createSystemAdminApiPermissionDataSource,
  createSystemAdminApiRequest,
  SYSTEM_ADMIN_API_COMPANY_B_ID,
  SYSTEM_ADMIN_API_CORRELATION_ID,
  SYSTEM_ADMIN_API_DEFAULT_ROLE_ID,
  SYSTEM_ADMIN_AUDIT_PERMISSIONS,
  SYSTEM_ADMIN_INVITE_PERMISSIONS,
  SYSTEM_ADMIN_ROLE_PERMISSIONS,
} from "@/lib/system-admin/__tests__/system-admin-api-test-fixtures";
import {
  systemAdminAuditEventsGetContract,
  systemAdminMembershipRolePostContract,
  systemAdminUserInvitePostContract,
} from "@/server/api/contracts/system-admin/system-admin.contract";
import { assignMembershipRole } from "@/server/system-admin/assign-membership-role.server";
import { inviteCompanyUser } from "@/server/system-admin/invite-company-user.server";
import { listSystemAdminAuditEvents } from "@/server/system-admin/list-system-admin-audit-events.server";

const ACCOUNTING_ADMIN_PATTERN = /accounting|ledger|journal|coa/i;

const databaseMocks = vi.hoisted(() => ({
  insertMembership: vi
    .fn<typeof insertMembership>()
    .mockResolvedValue({ id: "membership-invited-001" }),
  insertUser: vi
    .fn<typeof insertUser>()
    .mockResolvedValue({ id: "user-invited-001" }),
  updateMembership: vi
    .fn<typeof updateMembership>()
    .mockResolvedValue({ id: "membership-updated-001" }),
}));

const auditMocks = vi.hoisted(() => ({
  listRecentAuditEvents: vi.fn(),
  recordErpAuditEvent: vi
    .fn<() => Promise<void>>()
    .mockResolvedValue(undefined),
}));

const authMocks = vi.hoisted(() => ({
  registerAuthInvitation: vi.fn(),
  syncAuthMirrorUser: vi.fn().mockResolvedValue({
    authUserId: "auth-user-invited-001",
    createdAuthUser: true,
    createdIdentityLink: true,
    updatedAuthUser: false,
  }),
}));

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    insertMembership: databaseMocks.insertMembership,
    insertUser: databaseMocks.insertUser,
    updateMembership: databaseMocks.updateMembership,
  };
});

vi.mock("@/lib/observability/record-erp-audit-event", () => ({
  recordErpAuditEvent: auditMocks.recordErpAuditEvent,
}));

vi.mock("@/lib/system-admin/list-recent-audit-events.server", () => ({
  listRecentAuditEvents: auditMocks.listRecentAuditEvents,
}));

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();
  return {
    ...actual,
    registerAuthInvitation: authMocks.registerAuthInvitation,
    syncAuthMirrorUser: authMocks.syncAuthMirrorUser,
  };
});

describe("system admin API integration (Foundation phase 13 Slice 4)", () => {
  beforeEach(() => {
    databaseMocks.insertMembership.mockClear();
    databaseMocks.insertUser.mockClear();
    databaseMocks.updateMembership.mockClear();
    auditMocks.listRecentAuditEvents.mockClear();
    auditMocks.recordErpAuditEvent.mockClear();
    authMocks.registerAuthInvitation.mockClear();
    authMocks.syncAuthMirrorUser.mockClear();
  });

  it("invites a user with company-scoped membership and governed database writes", async () => {
    const result = await inviteCompanyUser({
      actorUserId: MODULE_ROUTE_TEST_ACTOR_ID,
      companyId: MODULE_ROUTE_TEST_COMPANY_ID,
      correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
      displayName: "Invited User",
      email: "invited@example.com",
      roleId: SYSTEM_ADMIN_API_DEFAULT_ROLE_ID,
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
    });

    expect(result).toEqual({
      membershipId: "membership-invited-001",
      userId: "user-invited-001",
    });

    expect(databaseMocks.insertUser).toHaveBeenCalledWith(
      expect.objectContaining({
        audit: expect.objectContaining({
          actorUserId: MODULE_ROUTE_TEST_ACTOR_ID,
          correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
          source: "api",
        }),
        displayName: "Invited User",
        email: "invited@example.com",
        status: "invited",
      })
    );

    expect(databaseMocks.insertMembership).toHaveBeenCalledWith(
      expect.objectContaining({
        audit: expect.objectContaining({
          actorUserId: MODULE_ROUTE_TEST_ACTOR_ID,
          correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
        }),
        companyId: MODULE_ROUTE_TEST_COMPANY_ID,
        organizationId: null,
        roleId: SYSTEM_ADMIN_API_DEFAULT_ROLE_ID,
        scopeType: "company",
        tenantId: MODULE_ROUTE_TEST_TENANT_ID,
        userId: "user-invited-001",
      })
    );

    expect(authMocks.syncAuthMirrorUser).toHaveBeenCalledWith({
      displayName: "Invited User",
      email: "invited@example.com",
      userId: "user-invited-001",
    });

    expect(authMocks.registerAuthInvitation).toHaveBeenCalledWith({
      audit: {
        correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
        email: "invited@example.com",
        invitationId: "membership-invited-001",
        platformUserId: MODULE_ROUTE_TEST_ACTOR_ID,
        tenantId: MODULE_ROUTE_TEST_TENANT_ID,
      },
      email: "invited@example.com",
      invitationId: "membership-invited-001",
      platformUserId: "user-invited-001",
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
    });
  });

  it("denies cross-company role assignment with audit evidence", async () => {
    await expect(
      assignMembershipRole({
        actorUserId: MODULE_ROUTE_TEST_ACTOR_ID,
        correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
        membershipId: "membership-target-001",
        operatingCompanyId: MODULE_ROUTE_TEST_COMPANY_ID,
        roleId: SYSTEM_ADMIN_API_DEFAULT_ROLE_ID,
        targetCompanyId: SYSTEM_ADMIN_API_COMPANY_B_ID,
      })
    ).rejects.toMatchObject({
      code: "forbidden",
    });

    expect(databaseMocks.updateMembership).not.toHaveBeenCalled();
    expect(auditMocks.recordErpAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "system_admin.membership.role.assignment_denied",
        actorUserId: MODULE_ROUTE_TEST_ACTOR_ID,
        correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
        module: "system_admin",
        result: "denied",
        targetId: "membership-target-001",
        targetType: "membership",
      })
    );
  });

  it("assigns membership role within operating company scope", async () => {
    const result = await assignMembershipRole({
      actorUserId: MODULE_ROUTE_TEST_ACTOR_ID,
      correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
      membershipId: "membership-target-001",
      operatingCompanyId: MODULE_ROUTE_TEST_COMPANY_ID,
      roleId: SYSTEM_ADMIN_API_DEFAULT_ROLE_ID,
      targetCompanyId: MODULE_ROUTE_TEST_COMPANY_ID,
    });

    expect(result).toEqual({
      membershipId: "membership-updated-001",
      roleId: SYSTEM_ADMIN_API_DEFAULT_ROLE_ID,
    });
    expect(databaseMocks.updateMembership).toHaveBeenCalledTimes(1);
  });

  it("returns tenant-scoped audit events read-only", async () => {
    auditMocks.listRecentAuditEvents.mockResolvedValue({
      events: [
        {
          action: "user.create",
          correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
          createdAt: "2026-06-23T12:00:00.000Z",
          id: "audit-001",
          module: "platform",
          result: "success",
          targetId: "user-invited-001",
          targetType: "user",
        },
      ],
      hasMore: false,
      nextCursor: null,
    });

    const result = await listSystemAdminAuditEvents({
      limit: 20,
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
    });

    expect(result.events).toHaveLength(1);
    expect(result.events[0]?.action).toBe("user.create");
    expect(auditMocks.listRecentAuditEvents).toHaveBeenCalledWith({
      limit: 20,
      tenantId: MODULE_ROUTE_TEST_TENANT_ID,
    });
  });

  it("allows invite when users.manage permission is granted", async () => {
    const permissionDataSource = createSystemAdminApiPermissionDataSource([
      ...SYSTEM_ADMIN_INVITE_PERMISSIONS,
    ]);

    const authorized = await assertAuthorizedApiRoute(
      {
        actorId: MODULE_ROUTE_TEST_ACTOR_ID,
        correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
        method: "POST",
        path: systemAdminUserInvitePostContract.path,
        permission: {
          permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
        },
        protectionLevel: "tenant-protected",
        request: createSystemAdminApiRequest(
          systemAdminUserInvitePostContract.path,
          "POST"
        ),
      },
      {
        permission: permissionDataSource,
        resolveOperatingContext: createSystemAdminApiOperatingContextResolver(),
      }
    );

    expect(authorized.authorization).not.toBeNull();
  });

  it("denies invite when users.manage permission is missing", async () => {
    const permissionDataSource = createSystemAdminApiPermissionDataSource([]);

    await expect(
      assertAuthorizedApiRoute(
        {
          actorId: MODULE_ROUTE_TEST_ACTOR_ID,
          correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
          method: "POST",
          path: systemAdminUserInvitePostContract.path,
          permission: {
            permissionKey: PERMISSION_REGISTRY.systemAdmin.users.manage,
          },
          protectionLevel: "tenant-protected",
          request: createSystemAdminApiRequest(
            systemAdminUserInvitePostContract.path,
            "POST"
          ),
        },
        {
          permission: permissionDataSource,
          resolveOperatingContext:
            createSystemAdminApiOperatingContextResolver(),
        }
      )
    ).rejects.toMatchObject({
      code: "forbidden",
    });
  });

  it("allows audit read when audit.read permission is granted", async () => {
    const permissionDataSource = createSystemAdminApiPermissionDataSource([
      ...SYSTEM_ADMIN_AUDIT_PERMISSIONS,
    ]);

    const authorized = await assertAuthorizedApiRoute(
      {
        actorId: MODULE_ROUTE_TEST_ACTOR_ID,
        correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
        method: "GET",
        path: systemAdminAuditEventsGetContract.path,
        permission: {
          permissionKey: PERMISSION_REGISTRY.systemAdmin.audit.read,
        },
        protectionLevel: "tenant-protected",
        request: createSystemAdminApiRequest(
          systemAdminAuditEventsGetContract.path,
          "GET"
        ),
      },
      {
        permission: permissionDataSource,
        resolveOperatingContext: createSystemAdminApiOperatingContextResolver(),
      }
    );

    expect(authorized.authorization).not.toBeNull();
  });

  it("allows role assignment when roles.manage permission is granted", async () => {
    const permissionDataSource = createSystemAdminApiPermissionDataSource([
      ...SYSTEM_ADMIN_ROLE_PERMISSIONS,
    ]);

    const authorized = await assertAuthorizedApiRoute(
      {
        actorId: MODULE_ROUTE_TEST_ACTOR_ID,
        correlationId: SYSTEM_ADMIN_API_CORRELATION_ID,
        method: "POST",
        path: systemAdminMembershipRolePostContract.path,
        permission: {
          permissionKey: PERMISSION_REGISTRY.systemAdmin.roles.manage,
        },
        protectionLevel: "tenant-protected",
        request: createSystemAdminApiRequest(
          systemAdminMembershipRolePostContract.path,
          "POST"
        ),
      },
      {
        permission: permissionDataSource,
        resolveOperatingContext: createSystemAdminApiOperatingContextResolver(),
      }
    );

    expect(authorized.authorization).not.toBeNull();
  });

  it("registers serializable system-admin contract schemas", () => {
    expect(
      systemAdminUserInvitePostContract.requestSchema.parse({
        displayName: "Invited User",
        email: "invited@example.com",
        roleId: "role-001",
      })
    ).toBeDefined();

    expect(
      systemAdminMembershipRolePostContract.requestSchema.parse({
        companyId: MODULE_ROUTE_TEST_COMPANY_ID,
        membershipId: "membership-001",
        roleId: "role-001",
      })
    ).toBeDefined();

    expect(
      systemAdminAuditEventsGetContract.responseSchema.parse({
        events: [],
      })
    ).toBeDefined();
  });

  it("does not reference accounting admin modules", async () => {
    const moduleIds = [
      systemAdminUserInvitePostContract.id,
      systemAdminMembershipRolePostContract.id,
      systemAdminAuditEventsGetContract.id,
    ];

    for (const contractId of moduleIds) {
      expect(contractId).not.toMatch(ACCOUNTING_ADMIN_PATTERN);
    }

    await expect(
      import("@/server/system-admin/invite-company-user.server")
    ).resolves.toBeDefined();
  });
});
