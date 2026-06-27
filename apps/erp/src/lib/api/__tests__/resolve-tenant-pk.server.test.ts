import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

import { API_TEST_TENANT_ID } from "./api-id-test-fixtures";

const findTenantByEnterpriseId = vi.fn();

vi.mock("@afenda/database/tenant-domain", () => ({
  findTenantByEnterpriseId: (...args: unknown[]) =>
    findTenantByEnterpriseId(...args),
}));

describe("resolveTenantPkFromWire", () => {
  beforeEach(() => {
    findTenantByEnterpriseId.mockReset();
  });

  it("resolves canonical tenant wire to internal uuid PK", async () => {
    findTenantByEnterpriseId.mockResolvedValue({
      id: "tenant-uuid-001",
      enterpriseId: API_TEST_TENANT_ID,
      name: "Acme",
      slug: "acme",
      status: "active",
    });

    const { resolveTenantPkFromWire } = await import(
      "../resolve-tenant-pk.server"
    );

    const resolved = await resolveTenantPkFromWire({
      wireTenantId: API_TEST_TENANT_ID,
    });

    expect(resolved.enterpriseId).toBe(API_TEST_TENANT_ID);
    expect(resolved.tenantPk).toBe("tenant-uuid-001");
    expect(findTenantByEnterpriseId).toHaveBeenCalledWith(
      API_TEST_TENANT_ID,
      undefined
    );
  });

  it("rejects tenant human reference before database lookup", async () => {
    const { resolveTenantPkFromWire } = await import(
      "../resolve-tenant-pk.server"
    );

    await expect(
      resolveTenantPkFromWire({ wireTenantId: "EMP-000123" })
    ).rejects.toThrow(ApiRouteError);
    expect(findTenantByEnterpriseId).not.toHaveBeenCalled();
  });

  it("throws not_found when enterprise ID is valid but tenant row is missing", async () => {
    findTenantByEnterpriseId.mockResolvedValue(null);

    const { resolveTenantPkFromWire } = await import(
      "../resolve-tenant-pk.server"
    );

    await expect(
      resolveTenantPkFromWire({ wireTenantId: API_TEST_TENANT_ID })
    ).rejects.toMatchObject({
      code: "not_found",
    });
  });
});

describe("resolveTenantPkFromCanonicalId", () => {
  beforeEach(() => {
    findTenantByEnterpriseId.mockReset();
  });

  it("returns uuid PK for a parsed TenantId", async () => {
    findTenantByEnterpriseId.mockResolvedValue({
      id: "tenant-uuid-002",
      enterpriseId: API_TEST_TENANT_ID,
      name: "Acme",
      slug: "acme",
      status: "active",
    });

    const { resolveTenantPkFromCanonicalId } = await import(
      "../resolve-tenant-pk.server"
    );

    await expect(
      resolveTenantPkFromCanonicalId(API_TEST_TENANT_ID)
    ).resolves.toBe("tenant-uuid-002");
  });
});
