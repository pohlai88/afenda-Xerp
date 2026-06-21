import { createRegistryEntry } from "@afenda/metadata";
import { describe, expect, it } from "vitest";

import {
  createMetadataRendererRegistry,
  defaultMetadataRenderers,
  resolveMetadataRenderer,
  sampleRenderContext,
} from "../index.js";
import { createMetadataRendererDefinition } from "../registry/create-metadata-renderer-definition.js";
import { ListSection } from "../sections/list-section.js";
import { listRenderer } from "../renderers/list-renderer.js";

function createListRendererVariant(options: {
  readonly key: string;
  readonly priority: number;
  readonly supports?: () => { readonly supported: false; readonly reason: string };
}) {
  return createMetadataRendererDefinition({
    identity: {
      key: options.key,
      version: "0.1.0",
      label: "List Renderer Variant",
    },
    registry: createRegistryEntry({
      authority: "renderer",
      id: options.key,
      lifecycle: "active",
      version: "0.1.0",
      ownerPackage: "@afenda/metadata-ui",
    }),
    capability: "render-list",
    sectionTypes: ["list"],
    priority: options.priority,
    ...(options.supports !== undefined ? { supports: options.supports } : {}),
    render(_input, context) {
      return (
        <ListSection
          context={context}
          identity={{
            id: "metadata-list-variant",
            title: "List Variant",
          }}
          slots={{ content: null }}
        />
      );
    },
  });
}

describe("resolveMetadataRenderer", () => {
  it("resolves by section type and capability with highest priority", () => {
    const low = createListRendererVariant({
      key: "metadata-ui.renderer.list.low",
      priority: 50,
    });
    const registry = createMetadataRendererRegistry([low, listRenderer]);

    const resolved = resolveMetadataRenderer({
      registry,
      sectionType: "list",
      capability: "render-list",
      input: {},
      context: sampleRenderContext,
    });

    expect(resolved?.identity.key).toBe("metadata-ui.renderer.list.default");
  });

  it("skips renderers whose supports() returns false", () => {
    const unsupported = createListRendererVariant({
      key: "metadata-ui.renderer.list.unsupported",
      priority: 200,
      supports: () => ({ supported: false, reason: "Unsupported input." }),
    });
    const registry = createMetadataRendererRegistry([unsupported, listRenderer]);

    const resolved = resolveMetadataRenderer({
      registry,
      sectionType: "list",
      capability: "render-list",
      input: {},
      context: sampleRenderContext,
    });

    expect(resolved?.identity.key).toBe("metadata-ui.renderer.list.default");
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
