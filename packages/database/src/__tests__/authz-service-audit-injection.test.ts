import { beforeEach, describe, expect, it, vi } from "vitest";

import { insertCompany } from "../company/company.service.js";
import type { AfendaDatabase } from "../db.js";
import { insertMembership } from "../membership/membership.service.js";
import { insertOrganization } from "../organization/organization.service.js";
import { insertPermission } from "../permission/permission.service.js";
import { createPermissionKey } from "../permission-key.contract.js";
import { insertPolicy } from "../policy/policy.service.js";
import { insertRole } from "../role/role.service.js";
import { insertTenant } from "../tenant/tenant.service.js";
import { insertUser } from "../user/user.service.js";

const insertAuditEvent = vi.fn();

vi.mock("../audit/audit.writer.js", () => ({
  insertAuditEvent: (...args: unknown[]) => insertAuditEvent(...args),
}));

const TENANT_ID = "00000000-0000-4000-8000-000000000010";
const COMPANY_ID = "00000000-0000-4000-8000-000000000011";
const CORRELATION_ID = "corr-governed-audit-injection";

const audit = {
  actorType: "system" as const,
  correlationId: CORRELATION_ID,
  source: "system" as const,
};

function createInsertMockDb(returnedId: string): AfendaDatabase {
  return {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [{ id: returnedId }]),
      })),
    })),
  } as unknown as AfendaDatabase;
}

function createCompanyInsertMockDb(
  returnedId: string,
  tenantId: string
): AfendaDatabase {
  return {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [{ id: returnedId, tenantId }]),
      })),
    })),
  } as unknown as AfendaDatabase;
}

function createOrganizationInsertMockDb(options: {
  companyId: string;
  organizationId: string;
  tenantId: string;
}): AfendaDatabase {
  return {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => [{ tenantId: options.tenantId }]),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [
          {
            id: options.organizationId,
            tenantId: options.tenantId,
            companyId: options.companyId,
          },
        ]),
      })),
    })),
  } as unknown as AfendaDatabase;
}

function createMembershipInsertMockDb(options: {
  membershipId: string;
  tenantId: string;
}): AfendaDatabase {
  return {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => [
            { scope: "platform", tenantId: null, status: "active" },
          ]),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [
          {
            id: options.membershipId,
            tenantId: options.tenantId,
            companyId: null,
            organizationId: null,
          },
        ]),
      })),
    })),
  } as unknown as AfendaDatabase;
}

function getAuditDbArgument(): unknown {
  return insertAuditEvent.mock.calls[0]?.[1];
}

describe("governed service audit injection", () => {
  beforeEach(() => {
    insertAuditEvent.mockReset();
    insertAuditEvent.mockResolvedValue({ id: "audit-001" });
  });

  it("insertRole forwards injected db to insertAuditEvent", async () => {
    const db = createInsertMockDb("role-001");

    await insertRole(
      {
        key: "tenant.admin",
        name: "Tenant Admin",
        description: null,
        scope: "tenant",
        tenantId: TENANT_ID,
        audit,
      },
      db
    );

    expect(insertAuditEvent).toHaveBeenCalledOnce();
    expect(getAuditDbArgument()).toBe(db);
  });

  it("insertPolicy forwards injected db to insertAuditEvent", async () => {
    const db = createInsertMockDb("policy-001");

    await insertPolicy(
      {
        key: "gate.test.policy",
        name: "Test Gate",
        description: null,
        scope: "platform",
        tenantId: null,
        effect: "allow",
        priority: 10,
        condition: {
          version: 1,
          gateDecision: "require_approval",
          match: {
            permissionKey: createPermissionKey("system_admin", "users_read"),
          },
        },
        audit,
      },
      db
    );

    expect(insertAuditEvent).toHaveBeenCalledOnce();
    expect(getAuditDbArgument()).toBe(db);
  });

  it("insertPermission forwards injected db to insertAuditEvent", async () => {
    const db = createInsertMockDb("permission-001");

    await insertPermission(
      {
        key: "system_admin.users_read",
        name: "Read users",
        description: "Read platform users.",
        audit,
      },
      db
    );

    expect(insertAuditEvent).toHaveBeenCalledOnce();
    expect(getAuditDbArgument()).toBe(db);
  });

  it("insertCompany forwards injected db to insertAuditEvent", async () => {
    const db = createCompanyInsertMockDb("company-001", TENANT_ID);

    await insertCompany(
      {
        tenantId: TENANT_ID,
        slug: "acme-corp",
        legalName: "Acme Corporation",
        displayName: "Acme",
        countryCode: "US",
        baseCurrency: "USD",
        audit,
      },
      db
    );

    expect(insertAuditEvent).toHaveBeenCalledOnce();
    expect(getAuditDbArgument()).toBe(db);
  });

  it("insertTenant forwards injected db to insertAuditEvent", async () => {
    const db = createInsertMockDb("tenant-001");

    await insertTenant(
      {
        slug: "acme",
        name: "Acme Workspace",
        audit,
      },
      db
    );

    expect(insertAuditEvent).toHaveBeenCalledOnce();
    expect(getAuditDbArgument()).toBe(db);
  });

  it("insertUser forwards injected db to insertAuditEvent", async () => {
    const db = createInsertMockDb("user-001");

    await insertUser(
      {
        email: "admin@localhost.afenda",
        displayName: "Admin User",
        audit,
      },
      db
    );

    expect(insertAuditEvent).toHaveBeenCalledOnce();
    expect(getAuditDbArgument()).toBe(db);
  });

  it("insertOrganization forwards injected db to insertAuditEvent", async () => {
    const db = createOrganizationInsertMockDb({
      organizationId: "organization-001",
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
    });

    await insertOrganization(
      {
        tenantId: TENANT_ID,
        companyId: COMPANY_ID,
        slug: "hq",
        name: "Headquarters",
        parentOrganizationId: null,
        audit,
      },
      db
    );

    expect(insertAuditEvent).toHaveBeenCalledOnce();
    expect(getAuditDbArgument()).toBe(db);
  });

  it("insertMembership forwards injected db to insertAuditEvent", async () => {
    const db = createMembershipInsertMockDb({
      membershipId: "membership-001",
      tenantId: TENANT_ID,
    });

    await insertMembership(
      {
        tenantId: TENANT_ID,
        userId: "00000000-0000-4000-8000-000000000020",
        roleId: "00000000-0000-4000-8000-000000000030",
        scopeType: "tenant",
        audit,
      },
      db
    );

    expect(insertAuditEvent).toHaveBeenCalledOnce();
    expect(getAuditDbArgument()).toBe(db);
  });
});
