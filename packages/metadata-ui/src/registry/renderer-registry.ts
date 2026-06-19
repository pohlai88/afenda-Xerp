import type { MetadataRegistryContract } from "../contracts/metadata-registry.contract";
import type {
  MetadataRendererContract,
  MetadataRendererResolution,
} from "../contracts/metadata-renderer.contract";
import {
  METADATA_SECTION_TYPES,
  type MetadataSectionType,
} from "../contracts/metadata-section.contract";

export interface MetadataRendererRegistry {
  readonly listRenderers: () => readonly MetadataRendererContract[];
  readonly register: (
    renderer: MetadataRendererContract
  ) => MetadataRendererRegistry;
  readonly resolve: (
    sectionType: MetadataSectionType
  ) => MetadataRendererResolution;
  readonly snapshot: () => MetadataRegistryContract;
}

const sortRenderers = (
  renderers: readonly MetadataRendererContract[]
): MetadataRendererContract[] =>
  [...renderers].sort((left, right) => right.priority - left.priority);

export const createMetadataRendererRegistry = (
  initialRenderers: readonly MetadataRendererContract[] = []
): MetadataRendererRegistry => {
  const renderers = new Map<string, MetadataRendererContract>();

  for (const renderer of initialRenderers) {
    renderers.set(renderer.id, renderer);
  }

  const registry: MetadataRendererRegistry = {
    listRenderers: () => sortRenderers([...renderers.values()]),
    register: (renderer) => {
      renderers.set(renderer.id, renderer);
      return registry;
    },
    resolve: (sectionType) => {
      const compatibleRenderer = sortRenderers([...renderers.values()]).find(
        (renderer) => renderer.sectionTypes.includes(sectionType)
      );

      return {
        reason: compatibleRenderer
          ? `Resolved renderer "${compatibleRenderer.id}" for section "${sectionType}".`
          : `No renderer registered for section "${sectionType}".`,
        renderer: compatibleRenderer ?? null,
        sectionType,
      };
    },
    snapshot: () => ({
      renderers: sortRenderers([...renderers.values()]),
      sectionTypes: METADATA_SECTION_TYPES,
    }),
  };

  return registry;
};
