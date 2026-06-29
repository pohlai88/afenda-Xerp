import { describe, expect, it } from "vitest";
import { createMetadataRuntimeContext } from "../metadata-runtime.contract";
import { projectMetadataUiBindingWire } from "../metadata-ui-binding.projection";

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
});
