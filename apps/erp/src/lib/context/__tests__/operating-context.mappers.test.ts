import type { TenantLookupRow } from "@afenda/database";
import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { toTenantContext } from "../operating-context.mappers";

describe("toTenantContext (ADR-0022 split-ID)", () => {
  it("brands enterpriseId as TenantId — not uuid PK", () => {
    const enterpriseId = createTestEnterpriseId(
      "tenant",
      "01ARZ3NDEKTSV4RRFFQ69G5FAV"
    );
    const row: TenantLookupRow = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      enterpriseId,
      slug: "dev-local",
      name: "Dev Local Workspace",
      status: "active",
    };

    const tenant = toTenantContext(row);

    expect(`${tenant.tenantId}`).toBe(enterpriseId);
    expect(`${tenant.tenantId}`).not.toBe(row.id);
  });
});
