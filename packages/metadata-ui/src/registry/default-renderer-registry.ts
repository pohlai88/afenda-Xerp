import { defaultMetadataRenderers } from "../renderers/default-section-renderers.js";
import { createMetadataRendererRegistry } from "./metadata-renderer-registry.js";

export function createDefaultMetadataRendererRegistry() {
  return createMetadataRendererRegistry(defaultMetadataRenderers);
}

export const defaultMetadataRendererRegistry =
  createDefaultMetadataRendererRegistry();
