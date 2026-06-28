import { describe, expect, it } from "vitest";

import {
  createTestEnterpriseId,
  ID_FAMILIES,
  IDENTITY_STACK_LAYER_IDS,
  IDENTITY_STACK_LAYERS,
  IDENTITY_STACK_POLICY,
  isIdentityStackLayerId,
  parseCustomerId,
  parseEmployeeNo,
  parseInternalEntityPk,
  parseTenantHumanReferenceForScope,
  TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS,
  TENANT_HUMAN_REFERENCE_SCOPES,
} from "../../index.js";

const VALID_UUID_V7 = "018f9f8c-9f1a-7c2b-9c20-000000000001";

describe("identity stack (PAS-001 §4.1.1)", () => {
  it("registers exactly three constitutional layers", () => {
    expect(IDENTITY_STACK_LAYER_IDS).toEqual([
      "internal-pk",
      "canonical-enterprise-id",
      "tenant-human-reference",
    ]);
    expect(IDENTITY_STACK_POLICY.layerCount).toBe(3);
  });

  it("maps each layer to the correct owner and kernel module", () => {
    expect(IDENTITY_STACK_LAYERS["internal-pk"].owner).toBe("@afenda/database");
    expect(IDENTITY_STACK_LAYERS["canonical-enterprise-id"].owner).toContain(
      "@afenda/kernel"
    );
    expect(IDENTITY_STACK_LAYERS["tenant-human-reference"].owner).toContain(
      "Domain"
    );
    expect(
      IDENTITY_STACK_LAYERS["canonical-enterprise-id"].kernelModule
    ).toContain("families/");
  });

  it("narrows layer id strings at the boundary", () => {
    expect(isIdentityStackLayerId("internal-pk")).toBe(true);
    expect(isIdentityStackLayerId("unknown-layer")).toBe(false);
  });

  it("keeps canonical enterprise IDs separate from human references", () => {
    const customerId = createTestEnterpriseId("customer");
    expect(() => parseCustomerId(customerId)).not.toThrow();
    expect(() => parseCustomerId("EMP-000123")).toThrow();
    expect(parseEmployeeNo("EMP-000123")).toBe("EMP-000123");
    expect(parseTenantHumanReferenceForScope("employee", "EMP-000123")).toBe(
      "EMP-000123"
    );
    expect(TENANT_HUMAN_REFERENCE_SCOPES.length).toBeGreaterThan(0);
  });

  it("keeps internal PK layer separate from canonical enterprise IDs", () => {
    expect(() =>
      parseInternalEntityPk(createTestEnterpriseId("tenant"), "TenantPk")
    ).toThrow(/must not be a canonical enterprise ID/i);
    expect(() =>
      parseInternalEntityPk(VALID_UUID_V7, "TenantPk")
    ).not.toThrow();
  });

  it("does not register human reference scopes in ID_FAMILIES", () => {
    const enterpriseTypeNames = new Set<string>(
      Object.values(ID_FAMILIES).map((entry) => entry.typeName)
    );
    const humanReferenceTypeNames = [
      "EmployeeNo",
      "CustomerNo",
      "SupplierNo",
      "SkuNo",
      "AssetNo",
      "DocumentNo",
      "WarehouseCode",
    ] as const;

    for (const scope of TENANT_HUMAN_REFERENCE_SCOPES) {
      expect(TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS[scope].scope).toBe(scope);
    }

    for (const typeName of humanReferenceTypeNames) {
      expect([...enterpriseTypeNames].includes(typeName)).toBe(false);
    }
  });
});
