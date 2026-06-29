import { getMetadataBindingByBlockId } from "@afenda/shadcn-studio";
import { describe, expect, it } from "vitest";
import { createMetadataRuntimeContext } from "../metadata-runtime.contract";
import {
  isKnownErpDomainKvId,
  projectMetadataUiBindingWire,
} from "../metadata-ui-binding.projection";

describe("metadata ui binding projection (PAS-006D ERP bridge)", () => {
  it("projects runtime context into binding wire summary", () => {
    const result = projectMetadataUiBindingWire({
      binding: {
        metadataBindingId: "metadata-binding.test",
        blockId: "hero-section-01",
        erpDomainModuleSlug: "inventory",
        fields: [
          {
            fieldKey: "title",
            slotId: "hero.title",
            presentationKind: "text",
          },
        ],
      },
      runtime: createMetadataRuntimeContext({
        tenantId: "tenant-wire-1",
        actorId: "actor-1",
        correlationId: "corr-1",
      }),
    });

    expect(result).toEqual({
      metadataBindingId: "metadata-binding.test",
      blockId: "hero-section-01",
      erpDomainModuleSlug: "inventory",
      erpDomainKvId: "KV-INV",
      tenantId: "tenant-wire-1",
      actorId: "actor-1",
      correlationId: "corr-1",
      fieldCount: 1,
      hasStateTemplates: false,
      matchedBlockDataFieldCount: 1,
    });
    expect(() => JSON.stringify(result)).not.toThrow();
  });

  it("projects shadcn-studio registry binding for hero-section-01 via catalog SSOT", () => {
    const binding = getMetadataBindingByBlockId("hero-section-01");
    if (binding === undefined) {
      throw new Error("hero-section-01 binding must exist in registry");
    }

    const result = projectMetadataUiBindingWire({
      binding,
      runtime: createMetadataRuntimeContext({}),
    });

    expect(result.erpDomainModuleSlug).toBe("inventory");
    expect(result.erpDomainKvId).toBe("KV-INV");
    expect(result.blockId).toBe("hero-section-01");
  });

  it("prefers catalog KV id when slug and mismatched erpDomainKvId are both present", () => {
    const result = projectMetadataUiBindingWire({
      binding: {
        metadataBindingId: "metadata-binding.mismatch",
        blockId: "hero-section-01",
        erpDomainModuleSlug: "inventory",
        erpDomainKvId: "KV-HCM",
        fields: [],
      },
      runtime: createMetadataRuntimeContext({}),
    });

    expect(result.erpDomainModuleSlug).toBe("inventory");
    expect(result.erpDomainKvId).toBe("KV-INV");
  });

  it("passes through known erpDomainKvId when slug is absent", () => {
    const result = projectMetadataUiBindingWire({
      binding: {
        metadataBindingId: "metadata-binding.kv-only",
        blockId: "unknown-block",
        erpDomainKvId: "KV-HCM",
        fields: [],
      },
      runtime: createMetadataRuntimeContext({}),
    });

    expect(result.erpDomainModuleSlug).toBeUndefined();
    expect(result.erpDomainKvId).toBe("KV-HCM");
  });

  it("omits erpDomainKvId when only an unknown kv id is provided", () => {
    const result = projectMetadataUiBindingWire({
      binding: {
        metadataBindingId: "metadata-binding.unknown-kv",
        blockId: "unknown-block",
        erpDomainKvId: "KV-UNKNOWN",
        fields: [],
      },
      runtime: createMetadataRuntimeContext({}),
    });

    expect(result.erpDomainKvId).toBeUndefined();
    expect(result.erpDomainModuleSlug).toBeUndefined();
  });
});

describe("isKnownErpDomainKvId", () => {
  it("accepts catalog KV ids and rejects unknown strings", () => {
    expect(isKnownErpDomainKvId("KV-INV")).toBe(true);
    expect(isKnownErpDomainKvId("KV-HCM")).toBe(true);
    expect(isKnownErpDomainKvId("KV-UNKNOWN")).toBe(false);
    expect(isKnownErpDomainKvId("inventory")).toBe(false);
  });
});
