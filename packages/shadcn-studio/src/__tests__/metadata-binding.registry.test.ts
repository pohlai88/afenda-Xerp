import { describe, expect, it } from "vitest";

import { getBlockSlotsForBlockId } from "../registry/block-slot.registry.js";
import {
  getMetadataBindingByBlockId,
  METADATA_BINDING_REGISTRY,
} from "../registry/metadata-binding.registry.js";
import { METADATA_BINDING_MODULE_KV_ID_BY_SLUG } from "../registry/metadata-binding-module-assignment.js";

describe("metadata-binding.registry", () => {
  it("has unique blockId and metadataBindingId values", () => {
    const blockIds = METADATA_BINDING_REGISTRY.map((entry) => entry.blockId);
    const bindingIds = METADATA_BINDING_REGISTRY.map(
      (entry) => entry.metadataBindingId
    );

    expect(new Set(blockIds).size).toBe(blockIds.length);
    expect(new Set(bindingIds).size).toBe(bindingIds.length);
  });

  it("assigns erpDomainKvId matching erpDomainModuleSlug when slug is assigned", () => {
    for (const binding of METADATA_BINDING_REGISTRY) {
      if (binding.erpDomainModuleSlug === undefined) {
        continue;
      }

      const expectedKvId =
        METADATA_BINDING_MODULE_KV_ID_BY_SLUG[
          binding.erpDomainModuleSlug as keyof typeof METADATA_BINDING_MODULE_KV_ID_BY_SLUG
        ];

      if (expectedKvId === undefined) {
        continue;
      }

      expect(
        binding.erpDomainKvId,
        `binding ${binding.metadataBindingId} slug ${binding.erpDomainModuleSlug}`
      ).toBe(expectedKvId);
    }
  });

  it("references only declared slot IDs and includes labelAtomRef on every field", () => {
    for (const binding of METADATA_BINDING_REGISTRY) {
      const slotIds = new Set(
        getBlockSlotsForBlockId(binding.blockId).map((slot) => slot.slotId)
      );

      for (const field of binding.fields) {
        expect(slotIds.has(field.slotId)).toBe(true);
        expect(field.labelAtomRef?.trim().length ?? 0).toBeGreaterThan(0);
        expect(field.presentationKind.length).toBeGreaterThan(0);
      }
    }
  });

  it("exposes getMetadataBindingByBlockId for every registry row", () => {
    for (const binding of METADATA_BINDING_REGISTRY) {
      expect(
        getMetadataBindingByBlockId(binding.blockId)?.metadataBindingId
      ).toBe(binding.metadataBindingId);
    }
  });
});
