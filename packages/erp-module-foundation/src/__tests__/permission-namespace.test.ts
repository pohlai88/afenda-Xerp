import { describe, expect, it } from "vitest";
import {
  defineErpRuntimeModule,
  defineModuleMetadataBinding,
  defineModulePermissionBinding,
} from "../index.js";

describe("permission namespace split", () => {
  it("allows slug supply-chain with permissionNamespace supplyChain", () => {
    const module = defineErpRuntimeModule({
      slug: "supply-chain",
      kvId: "KV-SC",
      permissionNamespace: "supplyChain",
      runtimePackage: "@afenda/supply-chain",
      wirePackage: "@afenda/kernel/erp-domain/supply-chain",
      ownerPackage: "@afenda/supply-chain",
      databaseOwner: "@afenda/database",
      appOwner: "apps/erp",
      permissionOwner: "@afenda/permissions",
      knowledgeOwner: "@afenda/enterprise-knowledge",
      lifecycle: "contracts_only",
      runtimeStatus: "wire_only",
    });

    expect(module.slug).toBe("supply-chain");
    expect(module.permissionNamespace).toBe("supplyChain");
    expect(module.routeSlug).toBe("supply-chain");

    const binding = defineModulePermissionBinding({
      module: "supply-chain",
      kvId: "KV-SC",
      permissionNamespace: "supplyChain",
      kernelPermissionKeys: ["supplyChain.order_read"],
    });

    expect(binding.permissionNamespace).toBe("supplyChain");
  });

  it("rejects permission keys that use module slug instead of permissionNamespace", () => {
    expect(() =>
      defineModulePermissionBinding({
        module: "supply-chain",
        kvId: "KV-SC",
        permissionNamespace: "supplyChain",
        kernelPermissionKeys: ["procurement.order_read"],
      })
    ).toThrow(/permissionNamespace/);
  });

  it("uses routeSlug for erp_module_page route patterns when different from slug", () => {
    const binding = defineModuleMetadataBinding({
      module: "supply-chain",
      kvId: "KV-SC",
      routeSlug: "supply-chain",
      surfaces: [
        {
          surfaceId: "supplyChain.orders.list",
          route: "/modules/supply-chain/orders",
          routeKind: "erp_module_page",
          permissionKey: "supplyChain.order_read",
          operatingContextRequired: true,
        },
      ],
    });

    expect(binding.surfaces[0]?.route).toBe("/modules/supply-chain/orders");
  });

  it("rejects invalid permissionNamespace format", () => {
    expect(() =>
      defineErpRuntimeModule({
        slug: "procurement",
        kvId: "KV-PROC",
        permissionNamespace: "procurement-invalid",
        runtimePackage: "@afenda/procurement",
        wirePackage: "@afenda/kernel/erp-domain/procurement",
        ownerPackage: "@afenda/procurement",
        databaseOwner: "@afenda/database",
        appOwner: "apps/erp",
        permissionOwner: "@afenda/permissions",
        knowledgeOwner: "@afenda/enterprise-knowledge",
        lifecycle: "contracts_only",
        runtimeStatus: "wire_only",
      })
    ).toThrow(/camelCase permission namespace/);
  });
});
