import { describe, expect, it } from "vitest";

import {
  assertMetadataTenantHumanReferenceWireShape,
  isMetadataTenantHumanReferenceFieldBinding,
  isMetadataTenantHumanReferenceScope,
  METADATA_TENANT_HUMAN_REFERENCE_SCOPE_COLUMNS,
  METADATA_TENANT_HUMAN_REFERENCE_SCOPES,
  normalizeMetadataTenantHumanReferenceWireValue,
  serializeMetadataTenantHumanReferenceFieldBinding,
} from "../metadata-tenant-human-reference-vocabulary.contract.js";

describe("metadata-tenant-human-reference-vocabulary (PAS-001 §4.1.13 projection)", () => {
  it("mirrors kernel/database governed scopes", () => {
    expect(METADATA_TENANT_HUMAN_REFERENCE_SCOPES).toEqual([
      "employee",
      "customer",
      "supplier",
      "sku",
      "asset",
      "document",
      "warehouse",
    ]);
    expect(METADATA_TENANT_HUMAN_REFERENCE_SCOPE_COLUMNS.employee).toBe(
      "employee_no"
    );
  });

  it("narrows scope strings at the metadata boundary", () => {
    expect(isMetadataTenantHumanReferenceScope("employee")).toBe(true);
    expect(isMetadataTenantHumanReferenceScope("tenant")).toBe(false);
  });

  it("validates wire shape without kernel branding", () => {
    expect(
      assertMetadataTenantHumanReferenceWireShape(" EMP-1 ", "Employee No")
    ).toBe("EMP-1");
    expect(() =>
      assertMetadataTenantHumanReferenceWireShape("   ", "Employee No")
    ).toThrow(/Employee No is required/);
  });

  it("serializes field bindings as JSON-safe wire carriers", () => {
    const binding = serializeMetadataTenantHumanReferenceFieldBinding({
      scope: "sku",
      wireValue: " SKU-001 ",
    });

    expect(binding).toEqual({ scope: "sku", wireValue: "SKU-001" });
    expect(JSON.parse(JSON.stringify(binding))).toEqual(binding);
    expect(isMetadataTenantHumanReferenceFieldBinding(binding)).toBe(true);
    expect(
      normalizeMetadataTenantHumanReferenceWireValue(binding.wireValue)
    ).toBe("SKU-001");
  });
});
