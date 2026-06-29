import type {
  ModuleMetadataBindingDefinition,
  ModuleMetadataSurfaceBinding,
} from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertPermissionKeyFormat,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleMetadataBindingInput {
  readonly kvId: string;
  readonly module: string;
  readonly surfaces: readonly ModuleMetadataSurfaceBinding[];
}

export function defineModuleMetadataBinding(
  input: DefineModuleMetadataBindingInput
): ModuleMetadataBindingDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  if (input.surfaces.length === 0) {
    throw new Error("defineModuleMetadataBinding: surfaces must not be empty");
  }

  assertUniqueStrings(
    input.surfaces.map((surface) => surface.surfaceId),
    "metadata surfaceId"
  );

  const surfaces = input.surfaces.map((surface) => {
    assertNonEmptyString(surface.surfaceId, "surfaceId");
    assertNonEmptyString(surface.route, "route");
    assertPermissionKeyFormat(surface.permissionKey);
    if (!surface.route.includes(input.module)) {
      throw new Error(
        `metadata route "${surface.route}" must reference module slug "${input.module}"`
      );
    }
    return {
      surfaceId: surface.surfaceId,
      route: surface.route,
      permissionKey: surface.permissionKey,
      operatingContextRequired: surface.operatingContextRequired,
      ...(surface.metadataSlotId
        ? { metadataSlotId: surface.metadataSlotId }
        : {}),
      ...(surface.uiBlockReference
        ? { uiBlockReference: surface.uiBlockReference }
        : {}),
    } as const;
  });

  return {
    module: input.module,
    kvId: input.kvId,
    surfaces,
  } as const;
}
