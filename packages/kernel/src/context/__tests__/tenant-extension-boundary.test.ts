import { describe, expect, it } from "vitest";

import { parseUnknownTenantExtensionBoundaryVocabulary } from "../tenant-extension-boundary.parser.js";

describe("tenant extension boundary vocabulary (PAS-001 amendment)", () => {
  it("accepts non-authoritative custom field keys", () => {
    const parsed = parseUnknownTenantExtensionBoundaryVocabulary({
      kind: "custom_field",
      fieldKey: "tenant.custom.color",
    });

    expect(parsed.fieldKey).toBe("tenant.custom.color");
  });

  it("rejects canonical enterprise id shaped field keys", () => {
    expect(() =>
      parseUnknownTenantExtensionBoundaryVocabulary({
        kind: "custom_field",
        fieldKey: "ten_01234567890123456789012345",
      })
    ).toThrow(/must not match canonical enterprise ID shape/i);
  });
});
