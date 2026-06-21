import { createRegistryEntry } from "@afenda/metadata";
import { describe, expect, it } from "vitest";

import {
  createMetadataRendererRegistry,
  defaultMetadataRenderers,
  resolveMetadataRenderer,
  sampleRenderContext,
} from "../index.js";
import { listRenderer } from "../renderers/list-renderer.js";

describe("resolveMetadataRenderer", () => {
  it("resolves by section type and capability with highest priority", () => {
    const low = {
      ...listRenderer,
      key: "metadata-ui.renderer.list.low",
      registry: createRegistryEntry({
        authority: "renderer",
        id: "metadata-ui.renderer.list.low",
        lifecycle: "active",
        version: "0.1.0",
        ownerPackage: "@afenda/metadata-ui",
      }),
      priority: 50,
    };
    const registry = createMetadataRendererRegistry([low, listRenderer]);

    const resolved = resolveMetadataRenderer({
      registry,
      sectionType: "list",
      capability: "render-list",
      input: {},
      context: sampleRenderContext,
    });

    expect(resolved?.key).toBe("metadata-ui.renderer.list.default");
  });

  it("skips renderers whose supports() returns false", () => {
    const unsupported = {
      ...listRenderer,
      key: "metadata-ui.renderer.list.unsupported",
      registry: createRegistryEntry({
        authority: "renderer",
        id: "metadata-ui.renderer.list.unsupported",
        lifecycle: "active",
        version: "0.1.0",
        ownerPackage: "@afenda/metadata-ui",
      }),
      priority: 200,
      supports: () => false,
    };
    const registry = createMetadataRendererRegistry([unsupported, listRenderer]);

    const resolved = resolveMetadataRenderer({
      registry,
      sectionType: "list",
      capability: "render-list",
      input: {},
      context: sampleRenderContext,
    });

    expect(resolved?.key).toBe("metadata-ui.renderer.list.default");
  });

  it("returns undefined for incompatible pairs and unknown section types", () => {
    const registry = createMetadataRendererRegistry(defaultMetadataRenderers);

    expect(
      resolveMetadataRenderer({
        registry,
        sectionType: "list",
        capability: "render-stat",
        input: {},
        context: sampleRenderContext,
      })
    ).toBeUndefined();

    expect(
      resolveMetadataRenderer({
        registry,
        // @ts-expect-error governed section vocabulary is enforced upstream
        sectionType: "unknown",
        capability: "render-list",
        input: {},
        context: sampleRenderContext,
      })
    ).toBeUndefined();
  });
});
