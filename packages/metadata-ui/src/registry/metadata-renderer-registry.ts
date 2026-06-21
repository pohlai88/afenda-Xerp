import {
  RENDERER_COMPATIBILITY_RULES,
  type RendererCapability,
  type SectionType,
} from "@afenda/metadata";

import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import { MetadataUiError } from "../runtime/metadata-ui-error.js";
import type { MetadataRendererRegistry } from "./metadata-renderer-registry.types.js";
import { resolveMetadataRenderer } from "./resolve-metadata-renderer.js";

function isCompatiblePair(
  capability: RendererCapability,
  sectionType: SectionType
): boolean {
  return RENDERER_COMPATIBILITY_RULES.some(
    (rule) =>
      rule.capability === capability && rule.sectionType === sectionType
  );
}

function assertCompatibleRenderer(renderer: MetadataRendererDefinition): void {
  if (!isCompatiblePair(renderer.capability, renderer.sectionType)) {
    throw new MetadataUiError(
      `Renderer "${renderer.key}" pairs capability "${renderer.capability}" with incompatible section "${renderer.sectionType}".`
    );
  }
}

export function createMetadataRendererRegistry(
  initialRenderers: readonly MetadataRendererDefinition[] = []
): MetadataRendererRegistry {
  const renderers = new Map<string, MetadataRendererDefinition>();

  let registry: MetadataRendererRegistry;

  const register = (
    renderer: MetadataRendererDefinition
  ): MetadataRendererRegistry => {
    assertCompatibleRenderer(renderer);

    if (renderers.has(renderer.key)) {
      throw new MetadataUiError(
        `Duplicate renderer key "${renderer.key}" is not allowed.`
      );
    }

    renderers.set(renderer.key, renderer);
    return registry;
  };

  registry = {
    register,
    get: (key) => renderers.get(key),
    entries: () => Object.freeze([...renderers.values()]),
    keys: () => Object.freeze([...renderers.keys()]),
    has: (key) => renderers.has(key),
    resolve: (input) => resolveMetadataRenderer({ ...input, registry }),
  };

  for (const renderer of initialRenderers) {
    register(renderer);
  }

  return registry;
}

export function isRendererCapabilityCompatible(
  capability: RendererCapability,
  sectionType: SectionType
): boolean {
  return isCompatiblePair(capability, sectionType);
}
