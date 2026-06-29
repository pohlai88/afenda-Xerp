import { describe, expect, it } from "vitest";

import {
  assertMetadataTenantExtensionFieldKey,
  parseMetadataTenantExtensionBoundaryVocabulary,
} from "../resolve-metadata-tenant-extension-boundary.server";

describe("assertMetadataTenantExtensionFieldKey", () => {
  it("accepts non-canonical extension keys", () => {
    expect(() =>
      assertMetadataTenantExtensionFieldKey("custom_field_notes")
    ).not.toThrow();
  });

  it("rejects keys that mimic canonical enterprise ID shape", () => {
    expect(() =>
      assertMetadataTenantExtensionFieldKey("ten_01ARZ3NDEKTSV4RRFFQ69G5FAV")
    ).toThrow(/canonical enterprise ID shape/);
  });
});

describe("parseMetadataTenantExtensionBoundaryVocabulary", () => {
  it("parses valid extension boundary wire vocabulary", () => {
    const parsed = parseMetadataTenantExtensionBoundaryVocabulary({
      kind: "custom_field",
      fieldKey: "workspace_notes",
    });

    expect(parsed).toEqual({
      kind: "custom_field",
      fieldKey: "workspace_notes",
    });
  });
});
