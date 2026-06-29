import { describe, expect, it } from "vitest";

import {
  assertMetadataErpDomainPermissionRegistryParity,
  getMetadataErpDomainPermissionRegistryBridgeEntry,
  isKernelWirePermissionRegistered,
  listRegisteredKernelWirePermissionKeys,
  METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_BRIDGE,
  METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_PARITY_MODULES,
  resolveRegisteredPermissionKeyForKernelWireKey,
} from "../metadata-erp-domain-permission-registry.bridge";

describe("metadata erp-domain permission registry bridge", () => {
  it("bridges all 28 delivered erp-domain permission vocabularies", () => {
    expect(METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_BRIDGE).toHaveLength(28);
    expect(
      METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_BRIDGE.map(
        (entry) => entry.moduleSlug
      )
    ).toEqual([
      "accounting",
      "controlling",
      "treasury",
      "tax",
      "consolidation",
      "intercompany",
      "procurement",
      "inventory",
      "manufacturing",
      "quality",
      "maintenance",
      "supply-chain",
      "sales",
      "crm",
      "pricing",
      "subscription",
      "ecommerce",
      "pos",
      "service",
      "field-service",
      "marketing",
      "hcm",
      "payroll",
      "project",
      "assets",
      "document",
      "workflow",
      "analytics",
    ]);
  });

  it("exposes KV ids on every bridge entry", () => {
    for (const entry of METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_BRIDGE) {
      expect(entry.moduleKvId).toMatch(/^KV-/);
      expect(entry.wirePermissionKeys.length).toBeGreaterThan(0);
    }
  });

  it("marks accounting and inventory as full PERMISSION_REGISTRY parity", () => {
    assertMetadataErpDomainPermissionRegistryParity();

    for (const moduleSlug of METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_PARITY_MODULES) {
      const entry =
        getMetadataErpDomainPermissionRegistryBridgeEntry(moduleSlug);
      expect(entry.registrationStatus).toBe("full");
      expect(entry.registeredPermissionKeys.length).toBe(
        entry.wirePermissionKeys.length
      );
    }
  });

  it("resolves registered kernel wire keys for metadata authorization lookup", () => {
    expect(isKernelWirePermissionRegistered("accounting.journal_post")).toBe(
      true
    );
    expect(
      resolveRegisteredPermissionKeyForKernelWireKey("accounting.journal_post")
    ).toBe("accounting.journal_post");
    expect(
      isKernelWirePermissionRegistered("procurement.purchaseOrder_read")
    ).toBe(false);
  });

  it("lists registered keys sourced from erp-domain vocabularies only", () => {
    const registered = listRegisteredKernelWirePermissionKeys();

    expect(registered).toContain("accounting.journal_post");
    expect(registered).toContain("inventory.product_read");
    expect(registered).not.toContain("system_admin.users_read");
  });
});
