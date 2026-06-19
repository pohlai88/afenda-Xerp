import type { MetadataRegistryContract } from "../contracts/metadata-registry.contract";
import type {
  MetadataRendererContract,
  MetadataRendererResolution,
} from "../contracts/metadata-renderer.contract";
import {
  METADATA_SECTION_TYPES,
  type MetadataSectionType,
} from "../contracts/metadata-section.contract";

/**
 * Fluent, priority-ordered renderer registry.
 *
 * - `register` returns the same registry instance for chaining.
 * - `resolve` selects the highest-priority compatible renderer or returns
 *   `{ renderer: null }` — callers must handle the null case gracefully.
 * - `snapshot` returns a point-in-time serializable view of all registered
 *   renderers and the governed section-type roster.
 */
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
) => {
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
