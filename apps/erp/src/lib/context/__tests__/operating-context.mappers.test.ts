import type { TenantLookupRow } from "@afenda/database";
import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { toTenantContext } from "../operating-context.mappers";

const TENANT_ENTERPRISE_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);

describe("toTenantContext", () => {
  it("brands enterpriseId as TenantId and maps SaaS lifecycle phase", () => {
    const row: TenantLookupRow = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      enterpriseId: TENANT_ENTERPRISE_ID,
      slug: "dev-local",
      name: "Dev Local Workspace",
      status: "active",
    };

    const tenant = toTenantContext(row);

    expect(`${tenant.tenantId}`).toBe(TENANT_ENTERPRISE_ID);
    expect(tenant.saasLifecyclePhase).toBe("active");
    expect(tenant.status).toBe("active");
  });

  it("maps archived DB status to offboarded SaaS lifecycle phase", () => {
    const row: TenantLookupRow = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      enterpriseId: TENANT_ENTERPRISE_ID,
      slug: "archived-tenant",
      name: "Archived Tenant",
      status: "archived",
    };

    const tenant = toTenantContext(row);

    expect(tenant.status).toBe("archived");
    expect(tenant.saasLifecyclePhase).toBe("offboarded");
  });
});
