import { createRegistryEntry } from "@afenda/metadata";
import { describe, expect, it } from "vitest";

import {
  createMetadataRendererRegistry,
  defaultMetadataRenderers,
} from "../index.js";
import { createMetadataRendererDefinition } from "../registry/index.js";
import { listRenderer } from "../renderers/index.js";

describe("metadata renderer registry", () => {
  it("registers default renderers", () => {
    const registry = createMetadataRendererRegistry(defaultMetadataRenderers);
    expect(registry.keys()).toHaveLength(7);
    expect(registry.has("metadata-ui.renderer.list.default")).toBe(true);
  });

  it("throws on duplicate renderer keys", () => {
    const registry = createMetadataRendererRegistry([listRenderer]);
    expect(() => registry.register(listRenderer)).toThrow(
      /Duplicate renderer key/
    );
  });

  it("returns readonly entries without mutating input arrays", () => {
    const source = [listRenderer];
    const registry = createMetadataRendererRegistry(source);
    const entries = registry.entries();

    expect(entries).toHaveLength(1);
    expect(Object.isFrozen(entries)).toBe(true);
    expect(source).toHaveLength(1);
  });

  it("rejects incompatible capability and section pairs at registration", () => {
    expect(() =>
      createMetadataRendererRegistry([
        createMetadataRendererDefinition({
          identity: {
            key: "metadata-ui.renderer.invalid",
            version: "0.1.0",
          },
          registry: createRegistryEntry({
            authority: "renderer",
            id: "metadata-ui.renderer.invalid",
            lifecycle: "active",
            version: "0.1.0",
            ownerPackage: "@afenda/metadata-ui",
          }),
          capability: "render-stat",
          sectionTypes: ["list"],
          render: () => null,
        }),
      ])
    ).toThrow(/incompatible section/);
  });
});
