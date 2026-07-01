import { describe, expect, it } from "vitest";

import {
  assertMetadataBindingContractWire,
  isMetadataBindingContractWire,
  type MetadataBindingContractWire,
} from "../meta-contracts/metadata-binding.contract.js";

describe("metadata binding contract (PAS-006D)", () => {
  const sampleBinding: MetadataBindingContractWire = {
    metadataBindingId: "metadata-binding.workspace-preview",
    blockId: "account-settings-01",
    surfaceTemplateClass: "settings",
    fields: [
      {
        fieldKey: "displayName",
        slotId: "profile.displayName",
        presentationKind: "text",
        labelAtomRef: "atom.user.display-name",
        density: "comfortable",
        requiredDisplay: true,
      },
    ],
    stateTemplates: [
      {
        stateKind: "loading",
        slotId: "profile.loading",
      },
    ],
  };

  it("is JSON-serializable", () => {
    expect(() => JSON.stringify(sampleBinding)).not.toThrow();
    const parsed: unknown = JSON.parse(JSON.stringify(sampleBinding));
    expect(isMetadataBindingContractWire(parsed)).toBe(true);
  });

  it("rejects invalid wire shapes", () => {
    expect(isMetadataBindingContractWire(null)).toBe(false);
    expect(isMetadataBindingContractWire({ metadataBindingId: "x" })).toBe(
      false
    );
    expect(
      isMetadataBindingContractWire({
        ...sampleBinding,
        fields: [
          {
            ...sampleBinding.fields[0],
            presentationKind: "invalid-kind",
          },
        ],
      })
    ).toBe(false);
    expect(
      isMetadataBindingContractWire({
        ...sampleBinding,
        surfaceTemplateClass: "not-a-class",
      })
    ).toBe(false);
  });

  it("assertMetadataBindingContractWire throws on invalid payload", () => {
    expect(() =>
      assertMetadataBindingContractWire(sampleBinding)
    ).not.toThrow();
    expect(() => assertMetadataBindingContractWire(null)).toThrow(
      "Invalid metadata binding contract wire payload."
    );
  });
});
