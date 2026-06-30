import { describe, expect, it } from "vitest";

import {
  isMetadataBindingWaiverReason,
  isMetadataBindingWaiverWire,
  type MetadataBindingWaiverWire,
} from "../contracts/metadata-binding-waiver.contract.js";

describe("metadata binding waiver contract (P06-008-R1)", () => {
  const sample: MetadataBindingWaiverWire = {
    blockId: "dropdown-profile",
    waiverId: "waiver.dropdown-profile",
    reason: "chrome-navigation",
    notes: "Application shell chrome — no field binding.",
  };

  it("is JSON-serializable", () => {
    expect(() => JSON.stringify(sample)).not.toThrow();
    const parsed: unknown = JSON.parse(JSON.stringify(sample));
    expect(isMetadataBindingWaiverWire(parsed)).toBe(true);
  });

  it("rejects invalid reason enums", () => {
    expect(
      isMetadataBindingWaiverWire({
        ...sample,
        reason: "not-a-reason",
      })
    ).toBe(false);
    expect(isMetadataBindingWaiverReason("chrome-navigation")).toBe(true);
    expect(isMetadataBindingWaiverReason("invalid")).toBe(false);
  });

  it("rejects empty or whitespace-only required strings", () => {
    expect(isMetadataBindingWaiverWire([])).toBe(false);
    expect(
      isMetadataBindingWaiverWire({
        ...sample,
        notes: "",
      })
    ).toBe(false);
    expect(
      isMetadataBindingWaiverWire({
        ...sample,
        blockId: "   ",
      })
    ).toBe(false);
  });
});
