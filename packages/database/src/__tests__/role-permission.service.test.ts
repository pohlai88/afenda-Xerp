import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AfendaDatabase } from "../db.js";
import type {
  RolePermissionGrantPermissionSnapshot,
  RolePermissionGrantRoleSnapshot,
} from "../role-permission/role-permission.contract.js";
import {
  RolePermissionGrantError,
  RolePermissionTenantMismatchError,
} from "../role-permission/role-permission.contract.js";

const insertAuditEvent = vi.fn();

vi.mock("../audit/audit.writer.js", () => ({
  insertAuditEvent: (...args: unknown[]) => insertAuditEvent(...args),
}));

import { grantPermissionToRole } from "../role-permission/role-permission.service.js";

const TENANT_ID = "00000000-0000-4000-8000-000000000010";
const ROLE_ID = "00000000-0000-4000-8000-000000000020";
const PERMISSION_ID = "00000000-0000-4000-8000-000000000030";
const CORRELATION_ID = "corr-role-permission-grant";

const audit = {
  actorType: "system" as const,
  correlationId: CORRELATION_ID,
  source: "system" as const,
};

interface MockGrantState {
  existingGrant: boolean;
  permission: RolePermissionGrantPermissionSnapshot | null;
  role: RolePermissionGrantRoleSnapshot | null;
}

function createMockDb(state: MockGrantState): AfendaDatabase {
  let selectPass = 0;

  return {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => {
            selectPass += 1;

            if (selectPass === 1) {
              return state.role ? [state.role] : [];
            }

            return state.permission ? [state.permission] : [];
          }),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onConflictDoNothing: vi.fn(() => ({
          returning: vi.fn(() => {
            if (state.existingGrant) {
              return [];
            }

            return [
              {
                roleId: ROLE_ID,
                permissionId: PERMISSION_ID,
              },
            ];
          }),
        })),
      })),
    })),
  } as unknown as AfendaDatabase;
}

describe("grantPermissionToRole", () => {
  beforeEach(() => {
    insertAuditEvent.mockReset();
    insertAuditEvent.mockResolvedValue({ id: "audit-001" });
  });

  it("grants permission to role", async () => {
    const db = createMockDb({
      role: {
        id: ROLE_ID,
        scope: "tenant",
        status: "active",
        tenantId: TENANT_ID,
      },
      permission: { id: PERMISSION_ID },
      existingGrant: false,
    });

    const result = await grantPermissionToRole(
      {
        tenantId: TENANT_ID,
        roleId: ROLE_ID,
        permissionId: PERMISSION_ID,
        reason: "bootstrap",
        audit,
      },
      db
    );

    expect(result).toEqual({
      roleId: ROLE_ID,
      permissionId: PERMISSION_ID,
    });
    expect(insertAuditEvent).toHaveBeenCalledOnce();
  });

  it("duplicate grant is safe", async () => {
    const db = createMockDb({
      role: {
        id: ROLE_ID,
        scope: "tenant",
        status: "active",
        tenantId: TENANT_ID,
      },
      permission: { id: PERMISSION_ID },
      existingGrant: true,
    });

    const result = await grantPermissionToRole(
      {
        tenantId: TENANT_ID,
        roleId: ROLE_ID,
        permissionId: PERMISSION_ID,
        audit,
      },
      db
    );

    expect(result).toEqual({
      roleId: ROLE_ID,
      permissionId: PERMISSION_ID,
    });
    expect(insertAuditEvent).not.toHaveBeenCalled();
  });

  it("invalid role fails", async () => {
    const db = createMockDb({
      role: null,
      permission: { id: PERMISSION_ID },
      existingGrant: false,
    });

    await expect(
      grantPermissionToRole(
        {
          tenantId: TENANT_ID,
          roleId: ROLE_ID,
          permissionId: PERMISSION_ID,
          audit,
        },
        db
      )
    ).rejects.toBeInstanceOf(RolePermissionGrantError);
  });

  it("invalid permission fails", async () => {
    const db = createMockDb({
      role: {
        id: ROLE_ID,
        scope: "tenant",
        status: "active",
        tenantId: TENANT_ID,
      },
      permission: null,
      existingGrant: false,
    });

    await expect(
      grantPermissionToRole(
        {
          tenantId: TENANT_ID,
          roleId: ROLE_ID,
          permissionId: PERMISSION_ID,
          audit,
        },
        db
      )
    ).rejects.toBeInstanceOf(RolePermissionGrantError);
  });

  it("writes audit event", async () => {
    const db = createMockDb({
      role: {
        id: ROLE_ID,
        scope: "tenant",
        status: "active",
        tenantId: TENANT_ID,
      },
      permission: { id: PERMISSION_ID },
      existingGrant: false,
    });

    await grantPermissionToRole(
      {
        tenantId: TENANT_ID,
        roleId: ROLE_ID,
        permissionId: PERMISSION_ID,
        reason: "catalog sync",
        audit,
      },
      db
    );

    expect(insertAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: TENANT_ID,
        action: "role.permission.grant",
        targetType: "role_permission",
        targetId: ROLE_ID,
        correlationId: CORRELATION_ID,
        metadata: {
          roleId: ROLE_ID,
          permissionId: PERMISSION_ID,
          reason: "catalog sync",
        },
      }),
      db
    );
  });

  it("blocks cross-tenant role/permission drift", async () => {
    const db = createMockDb({
      role: {
        id: ROLE_ID,
        scope: "tenant",
        status: "active",
        tenantId: TENANT_ID,
      },
      permission: { id: PERMISSION_ID },
      existingGrant: false,
    });

    await expect(
      grantPermissionToRole(
        {
          tenantId: "00000000-0000-4000-8000-000000000099",
          roleId: ROLE_ID,
          permissionId: PERMISSION_ID,
          audit,
        },
        db
      )
    ).rejects.toBeInstanceOf(RolePermissionTenantMismatchError);
    expect(insertAuditEvent).not.toHaveBeenCalled();
  });
});
