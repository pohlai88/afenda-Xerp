import { describe, expect, it } from "vitest";

import { createTestEnterpriseId } from "../../families/index.js";
import {
  assertTenantHumanReferenceWireText,
  TENANT_HUMAN_REFERENCE_MAX_WIRE_LENGTH,
} from "../tenant-human-reference.assert.js";

describe("tenant-human-reference.assert (PAS-001 §4.1.13)", () => {
  it("exports wire length parity with scoped parsers", () => {
    expect(TENANT_HUMAN_REFERENCE_MAX_WIRE_LENGTH).toBe(64);
  });

  it("rejects canonical enterprise IDs on the wire", () => {
    expect(() =>
      assertTenantHumanReferenceWireText(
        createTestEnterpriseId("employee"),
        "Employee No"
      )
    ).toThrow(/must not be a canonical enterprise ID/i);
  });

  it("returns trimmed wire text for valid human references", () => {
    expect(assertTenantHumanReferenceWireText(" EMP-1 ", "Employee No")).toBe(
      "EMP-1"
    );
  });
});
