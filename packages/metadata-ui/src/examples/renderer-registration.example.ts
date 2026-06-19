import type { MetadataRendererContract } from "../contracts/metadata-renderer.contract";
import { createMetadataRendererRegistry } from "../registry/renderer-registry";
import { defaultMetadataRenderers } from "../renderers/default-renderers";

export const exampleRendererRegistration = {
  id: "metadata.list.enterprise",
  priority: 200,
  recipe: "table",
  sectionTypes: ["list"],
  stable: true,
} as const satisfies MetadataRendererContract;

export const createExampleRendererRegistry = () =>
  createMetadataRendererRegistry(defaultMetadataRenderers).register(
    exampleRendererRegistration
  );
