import type { SurfaceTemplateContractWire } from "./metadata-studio.contract";
import { getMetadataBindingById } from "./metadata-binding.registry";
import { SURFACE_TEMPLATE_REGISTRY } from "./metadata-surface-template.registry";

import {
  hydrateMetadataBindingSlots,
  type MetadataBindingSlotHydrationWire,
} from "./hydrate-metadata-binding-slots.server";
import type { MetadataRuntimeContext } from "./metadata-runtime.contract";
import {
  type MetadataUiBindingProjectionWire,
  projectMetadataUiBindingWire,
} from "./metadata-ui-binding.projection";

export interface MetadataWorkspaceSurfaceWire {
  readonly bindingProjection?: MetadataUiBindingProjectionWire;
  readonly slotHydration?: MetadataBindingSlotHydrationWire;
  readonly surfaceTemplate: SurfaceTemplateContractWire;
}

export interface ResolveMetadataWorkspaceSurfacesInput {
  readonly runtime: MetadataRuntimeContext;
}

/** Resolves metadata workspace surfaces from studio template + binding registries. */
export function resolveMetadataWorkspaceSurfaces(
  input: ResolveMetadataWorkspaceSurfacesInput
): readonly MetadataWorkspaceSurfaceWire[] {
  const { runtime } = input;

  return SURFACE_TEMPLATE_REGISTRY.map((surfaceTemplate) => {
    const binding = getMetadataBindingById(surfaceTemplate.metadataBindingId);
    const bindingProjection =
      binding === undefined
        ? undefined
        : projectMetadataUiBindingWire({ binding, runtime });
    const slotHydration =
      binding === undefined || bindingProjection === undefined
        ? undefined
        : hydrateMetadataBindingSlots({
            binding,
            projection: bindingProjection,
            runtime,
          });

    return {
      surfaceTemplate,
      ...(bindingProjection === undefined ? {} : { bindingProjection }),
      ...(slotHydration === undefined ? {} : { slotHydration }),
    } satisfies MetadataWorkspaceSurfaceWire;
  });
}
