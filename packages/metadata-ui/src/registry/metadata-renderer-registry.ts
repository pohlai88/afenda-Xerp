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
  for (const sectionType of renderer.governance.sectionTypes) {
    if (!isCompatiblePair(renderer.governance.capability, sectionType)) {
      throw new MetadataUiError(
        `Renderer "${renderer.identity.key}" pairs capability "${renderer.governance.capability}" with incompatible section "${sectionType}".`
      );
    }
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

    if (renderers.has(renderer.identity.key)) {
      throw new MetadataUiError(
        `Duplicate renderer key "${renderer.identity.key}" is not allowed.`
      );
    }

    renderers.set(renderer.identity.key, renderer);
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
