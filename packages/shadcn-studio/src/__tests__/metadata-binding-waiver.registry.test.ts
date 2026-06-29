import { describe, expect, it } from "vitest";

import { isMetadataBindingWaiverReason } from "../contracts/metadata-binding-waiver.contract.js";
import { METADATA_BINDING_WAIVER_REGISTRY } from "../registry/metadata-binding-waiver.registry.js";

describe("metadata-binding-waiver.registry", () => {
  it("uses approved waiver reasons and required notes", () => {
    for (const waiver of METADATA_BINDING_WAIVER_REGISTRY) {
      expect(isMetadataBindingWaiverReason(waiver.reason)).toBe(true);
      expect(waiver.notes.trim().length).toBeGreaterThan(0);
      expect(waiver.waiverId.startsWith("metadata-binding-waiver.")).toBe(true);
    }
  });

  it("has unique blockId and waiverId values", () => {
    const blockIds = METADATA_BINDING_WAIVER_REGISTRY.map(
      (entry) => entry.blockId
    );
    const waiverIds = METADATA_BINDING_WAIVER_REGISTRY.map(
      (entry) => entry.waiverId
    );

    expect(new Set(blockIds).size).toBe(blockIds.length);
    expect(new Set(waiverIds).size).toBe(waiverIds.length);
  });
});
