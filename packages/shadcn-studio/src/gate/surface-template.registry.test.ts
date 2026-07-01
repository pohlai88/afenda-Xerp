import { describe, expect, it } from "vitest";

import {
  assertSurfaceTemplateContractWire,
  isSurfaceTemplateContractWire,
} from "../meta-contracts/surface-template.contract.js";
import {
  assertSurfaceTemplateBlockDataCoverage,
  assertSurfaceTemplateMetadataBinding,
  getSurfaceTemplateById,
  SURFACE_TEMPLATE_REGISTRY,
} from "../meta-registry/surface-template.registry.js";

describe("surface template registry (PAS-006D P06-009)", () => {
  it("registry templates are JSON-serializable", () => {
    expect(() => JSON.stringify(SURFACE_TEMPLATE_REGISTRY)).not.toThrow();

    for (const template of SURFACE_TEMPLATE_REGISTRY) {
      const parsed: unknown = JSON.parse(JSON.stringify(template));
      expect(isSurfaceTemplateContractWire(parsed)).toBe(true);
    }
  });

  it("templates reference metadata binding ids", () => {
    for (const template of SURFACE_TEMPLATE_REGISTRY) {
      expect(assertSurfaceTemplateMetadataBinding(template)).toBe(true);
      expect(template.metadataBindingId.startsWith("metadata-binding.")).toBe(
        true
      );
    }
  });

  it("resolves templates by id with block data contract coverage", () => {
    const template = getSurfaceTemplateById("surface-template.auth-sign-in");
    expect(template).toBeDefined();
    expect(template?.templateClass).toBe("form");
    expect(template && assertSurfaceTemplateBlockDataCoverage(template)).toBe(
      true
    );
  });

  it("rejects surface templates with empty slotFills keys", () => {
    const sample = SURFACE_TEMPLATE_REGISTRY[0];
    expect(sample).toBeDefined();
    if (!sample) {
      return;
    }

    expect(
      isSurfaceTemplateContractWire({
        ...sample,
        blockBindings: [
          {
            blockId: sample.blockBindings[0]?.blockId ?? "login-page-04",
            slotFills: { "": "hero.title" },
          },
        ],
      })
    ).toBe(false);
  });

  it("assertSurfaceTemplateContractWire throws on invalid payload", () => {
    const sample = SURFACE_TEMPLATE_REGISTRY[0];
    expect(sample).toBeDefined();
    if (!sample) {
      return;
    }

    expect(() => assertSurfaceTemplateContractWire(sample)).not.toThrow();
    expect(() => assertSurfaceTemplateContractWire(null)).toThrow(
      "Invalid surface template contract wire payload."
    );
  });
});
