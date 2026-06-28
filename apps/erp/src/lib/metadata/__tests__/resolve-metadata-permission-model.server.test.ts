import { describe, expect, it } from "vitest";

import { createModuleRouteOperatingContext } from "@/lib/modules/__tests__/module-route-test-fixtures";

import {
  parseRegisteredPermissionKeyToWireDescriptor,
  resolveMetadataPermissionModelDescriptorsFromGrantedKeys,
} from "../resolve-metadata-permission-model.server";

describe("resolveMetadataPermissionModelDescriptorsFromGrantedKeys", () => {
  it("derives descriptors from governed permission keys via live evaluation shape", () => {
    expect(
      resolveMetadataPermissionModelDescriptorsFromGrantedKeys({
        grantScopeType: "company",
        permissionKeys: ["workspace.dashboard_read", "inventory.product_read"],
      })
    ).toEqual([
      {
        module: "workspace",
        action: "read",
        scope: "legal_entity",
      },
      {
        module: "inventory",
        action: "read",
        scope: "legal_entity",
      },
    ]);
  });

  it("supports legacy multi-segment fixture keys", () => {
    expect(
      resolveMetadataPermissionModelDescriptorsFromGrantedKeys({
        grantScopeType: "company",
        permissionKeys: ["workspace.dashboard.read"],
      })
    ).toEqual([
      {
        module: "workspace.dashboard",
        action: "read",
        scope: "legal_entity",
      },
    ]);
  });
});

describe("parseRegisteredPermissionKeyToWireDescriptor", () => {
  it("maps registered keys to module.action@scope wire shape", () => {
    expect(
      parseRegisteredPermissionKeyToWireDescriptor(
        "accounting.journal_approve",
        "legal_entity"
      )
    ).toEqual({
      module: "accounting",
      action: "approve",
      scope: "legal_entity",
    });
  });
});

describe("resolveMetadataPermissionModelDescriptorsFromOperatingContext", () => {
  it("delegates operating-context grant scope to granted-key resolver", async () => {
    const { resolveMetadataPermissionModelDescriptorsFromOperatingContext } =
      await import("../resolve-metadata-permission-model.server");

    const operatingContext = createModuleRouteOperatingContext();

    expect(
      resolveMetadataPermissionModelDescriptorsFromOperatingContext({
        operatingContext,
        permissionKeys: ["workspace.dashboard_read"],
      })
    ).toEqual([
      {
        module: "workspace",
        action: "read",
        scope: "legal_entity",
      },
    ]);
  });
});
