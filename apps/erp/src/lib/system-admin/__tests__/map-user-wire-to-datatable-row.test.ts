import { describe, expect, it } from "vitest";

import { mapUserWireToDatatableRow } from "../map-user-wire-to-datatable-row";

describe("mapUserWireToDatatableRow", () => {
  it("maps API user wire into datatable row shape", () => {
    const row = mapUserWireToDatatableRow({
      displayName: "Jordan Lee",
      email: "jordan.lee@example.com",
      membershipId: "membership-1",
      membershipStatus: "active",
      roleId: "role-1",
      roleKey: "admin",
      roleName: "Administrator",
      userId: "user-1",
      userStatus: "active",
    });

    expect(row).toMatchObject({
      id: "user-1",
      user: "Jordan Lee",
      email: "jordan.lee@example.com",
      role: "admin",
      status: "active",
    });
  });
});
