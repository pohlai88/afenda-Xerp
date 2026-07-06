import type { SurfaceTemplateContractWire } from "./metadata-studio.contract";
import { getMetadataBindingById } from "./metadata-binding.registry";
import { getSurfaceTemplateById } from "./metadata-surface-template.registry";

import {
  hydrateMetadataBindingSlots,
  type MetadataBindingSlotHydrationWire,
} from "./hydrate-metadata-binding-slots.server";
import type { MetadataRuntimeContext } from "./metadata-runtime.contract";
import {
  type MetadataUiBindingProjectionWire,
  projectMetadataUiBindingWire,
} from "./metadata-ui-binding.projection";

export interface MetadataOperatorSurfaceWire {
  readonly bindingProjection?: MetadataUiBindingProjectionWire;
  readonly slotHydration?: MetadataBindingSlotHydrationWire;
  readonly surfaceTemplate: SurfaceTemplateContractWire;
}

export interface ResolveMetadataOperatorSurfaceInput {
  readonly runtime: MetadataRuntimeContext;
  readonly surfaceTemplateId: string;
}

/** Resolves one operator surface template with binding projection and slot hydration. */
export function resolveMetadataOperatorSurface(
  input: ResolveMetadataOperatorSurfaceInput
): MetadataOperatorSurfaceWire | undefined {
  const surfaceTemplate = getSurfaceTemplateById(input.surfaceTemplateId);

  if (surfaceTemplate === undefined) {
    return;
  }

  const binding = getMetadataBindingById(surfaceTemplate.metadataBindingId);
  const bindingProjection =
    binding === undefined
      ? undefined
      : projectMetadataUiBindingWire({ binding, runtime: input.runtime });
  const slotHydration =
    binding === undefined || bindingProjection === undefined
      ? undefined
      : hydrateMetadataBindingSlots({
          binding,
          projection: bindingProjection,
          runtime: input.runtime,
        });

  return {
    surfaceTemplate,
    ...(bindingProjection === undefined ? {} : { bindingProjection }),
    ...(slotHydration === undefined ? {} : { slotHydration }),
  };
}
