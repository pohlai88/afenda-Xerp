import type { SurfaceTemplateContractWire } from "@afenda/shadcn-studio";
import {
  getMetadataBindingById,
  SURFACE_TEMPLATE_REGISTRY,
} from "@afenda/shadcn-studio";

import type { MetadataRuntimeContext } from "./metadata-runtime.contract";
import {
  type MetadataUiBindingProjectionWire,
  projectMetadataUiBindingWire,
} from "./metadata-ui-binding.projection";

export interface MetadataWorkspaceSurfaceWire {
  readonly bindingProjection?: MetadataUiBindingProjectionWire;
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

    return {
      surfaceTemplate,
      ...(bindingProjection === undefined ? {} : { bindingProjection }),
    } satisfies MetadataWorkspaceSurfaceWire;
  });
}
