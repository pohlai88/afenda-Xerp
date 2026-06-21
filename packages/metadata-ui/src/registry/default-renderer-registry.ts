import { createMetadataRendererRegistry } from "./metadata-renderer-registry.js";
import { defaultMetadataRenderers } from "../renderers/default-section-renderers.js";

export function createDefaultMetadataRendererRegistry() {
  return createMetadataRendererRegistry(defaultMetadataRenderers);
}

export const defaultMetadataRendererRegistry =
  createDefaultMetadataRendererRegistry();
