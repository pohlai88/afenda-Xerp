import type {
  MetadataRouteKind,
  ModuleMetadataBindingDefinition,
  ModuleMetadataSurfaceBinding,
} from "./erp-module-foundation.types.js";
import { METADATA_ROUTE_KINDS } from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertMetadataRoutePattern,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertPermissionKeyFormat,
  assertRouteSlugFormat,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleMetadataBindingInput {
  readonly kvId: string;
  readonly module: string;
  readonly routeSlug?: string;
  readonly surfaces: readonly ModuleMetadataSurfaceBinding[];
}

function assertRouteKind(value: MetadataRouteKind): void {
  if (!METADATA_ROUTE_KINDS.includes(value)) {
    throw new Error(`invalid routeKind: "${value}"`);
  }
}

export function defineModuleMetadataBinding(
  input: DefineModuleMetadataBindingInput
): ModuleMetadataBindingDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  const routeSlug = input.routeSlug ?? input.module;
  assertRouteSlugFormat(routeSlug, "routeSlug");

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
    assertRouteKind(surface.routeKind);
    assertMetadataRoutePattern({
      routeSlug,
      route: surface.route,
      routeKind: surface.routeKind,
    });

    return {
      surfaceId: surface.surfaceId,
      route: surface.route,
      routeKind: surface.routeKind,
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
