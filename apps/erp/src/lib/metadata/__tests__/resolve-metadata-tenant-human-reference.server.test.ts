import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import {
  normalizeMetadataTenantHumanReferenceAtBoundary,
  parseMetadataTenantHumanReferenceAtBoundary,
  parseMetadataTenantHumanReferenceFieldBindingAtBoundary,
  parseOptionalMetadataTenantHumanReferenceAtBoundary,
  serializeMetadataTenantHumanReferenceFieldBindingAtBoundary,
} from "../resolve-metadata-tenant-human-reference.server.js";

describe("resolve-metadata-tenant-human-reference.server", () => {
  it("parses employee numbers via kernel at the ERP boundary", () => {
    const employeeNo = parseMetadataTenantHumanReferenceAtBoundary(
      "employee",
      "EMP-000123"
    );
    expect(
      normalizeMetadataTenantHumanReferenceAtBoundary("employee", employeeNo)
    ).toBe("EMP-000123");
  });

  it("rejects canonical enterprise IDs misclassified as human references", () => {
    expect(() =>
      parseMetadataTenantHumanReferenceAtBoundary(
        "employee",
        createTestEnterpriseId("employee")
      )
    ).toThrow(/must not be a canonical enterprise ID/i);
  });

  it("round-trips field bindings through parse and serialize", () => {
    const parsed = parseMetadataTenantHumanReferenceFieldBindingAtBoundary({
      scope: "sku",
      wireValue: "SKU-001",
    });
    expect(
      serializeMetadataTenantHumanReferenceFieldBindingAtBoundary("sku", parsed)
    ).toEqual({
      scope: "sku",
      wireValue: "SKU-001",
    });
  });

  it("returns null for optional empty ingress", () => {
    expect(
      parseOptionalMetadataTenantHumanReferenceAtBoundary("employee", null)
    ).toBeNull();
  });
});
