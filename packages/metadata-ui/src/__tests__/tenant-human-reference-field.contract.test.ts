import { describe, expect, it } from "vitest";

import {
  isMetadataTenantHumanReferenceScope,
  METADATA_TENANT_HUMAN_REFERENCE_SCOPES,
  serializeMetadataTenantHumanReferenceFieldBinding,
} from "../contracts/tenant-human-reference-field.contract.js";

describe("tenant-human-reference-field.contract", () => {
  it("re-exports governed scopes from ui-composition", () => {
    expect(METADATA_TENANT_HUMAN_REFERENCE_SCOPES.length).toBe(7);
    expect(isMetadataTenantHumanReferenceScope("employee")).toBe(true);
  });

  it("serializes metadata field bindings for wire transport", () => {
    expect(
      serializeMetadataTenantHumanReferenceFieldBinding({
        scope: "employee",
        wireValue: " EMP-000123 ",
      })
    ).toEqual({
      scope: "employee",
      wireValue: "EMP-000123",
    });
  });
});
