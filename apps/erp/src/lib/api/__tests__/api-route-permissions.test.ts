import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";

import {
  buildRoutePermissionMatrix,
  resolveRouteProtectionLevel,
} from "../api-route-permissions";

describe("api-route-permissions", () => {
  it("derives permission matrix entries from governed contracts", () => {
    const matrix = buildRoutePermissionMatrix();

    expect(matrix["internal.v1.workspace.dashboard-layout.get"]).toEqual({
      level: "tenant-protected",
      permissionKey: PERMISSION_REGISTRY.workspace.dashboard.read,
    });
    expect(matrix["internal.v1.workspace.dashboard-layout.put"]).toEqual({
      level: "tenant-protected",
      permissionKey: PERMISSION_REGISTRY.workspace.dashboard.write,
    });
    expect(matrix["internal.v1.workspace.dashboard-layout.delete"]).toEqual({
      level: "tenant-protected",
      permissionKey: PERMISSION_REGISTRY.workspace.dashboard.write,
    });
  });

  it("includes every protected contract exactly once", () => {
    const matrix = buildRoutePermissionMatrix();
    const protectedContracts = API_CONTRACTS.filter(
      (contract): contract is (typeof API_CONTRACTS)[number] & {
        permission: NonNullable<
          Extract<(typeof API_CONTRACTS)[number], { permission?: unknown }>["permission"]
        >;
      } => "permission" in contract && contract.permission !== undefined
    );

    expect(Object.keys(matrix)).toHaveLength(protectedContracts.length);

    for (const contract of protectedContracts) {
      expect(matrix[contract.id]?.permissionKey).toBe(
        contract.permission?.permission
      );
    }
  });

  it("classifies public contracts without permission requirements", () => {
    const healthContract = API_CONTRACTS.find(
      (contract) => contract.id === "internal.v1.health.get"
    );

    expect(healthContract).toBeDefined();
    if (healthContract === undefined) {
      return;
    }

    expect(resolveRouteProtectionLevel(healthContract)).toBe("public");
  });
});
