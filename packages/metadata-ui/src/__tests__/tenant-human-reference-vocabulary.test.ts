import { describe, expect, it } from "vitest";

import {
  resolveMetadataTenantHumanReferenceConceptLabel,
  resolveMetadataTenantHumanReferenceScopeLabel,
} from "../knowledge/tenant-human-reference-vocabulary.js";

describe("tenant-human-reference-vocabulary (PAS-004B consumer chain)", () => {
  it("resolves human_reference concept and scope labels", () => {
    expect(
      resolveMetadataTenantHumanReferenceConceptLabel().length
    ).toBeGreaterThan(0);
    expect(resolveMetadataTenantHumanReferenceScopeLabel("employee")).toBe(
      "Employee No"
    );
    expect(resolveMetadataTenantHumanReferenceScopeLabel("warehouse")).toBe(
      "Warehouse Code"
    );
  });
});
