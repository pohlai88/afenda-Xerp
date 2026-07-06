import { describe, expect, it } from "vitest";

import { mapMembershipWireToTableRow } from "../map-membership-wire-to-table-row";

describe("mapMembershipWireToTableRow", () => {
  it("maps API membership wire into ERP table row shape", () => {
    const row = mapMembershipWireToTableRow({
      displayName: "Jordan Lee",
      email: "jordan.lee@example.com",
      membershipId: "membership-1",
      membershipStatus: "active",
      roleId: "role-1",
      roleKey: "tenant.admin",
      roleName: "Tenant Admin",
      userId: "user-1",
    });

    expect(row).toMatchObject({
      id: "membership-1",
      user: "Jordan Lee",
      email: "jordan.lee@example.com",
      role: "admin",
      status: "active",
    });
  });
});
