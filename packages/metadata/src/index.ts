// biome-ignore-all lint/performance/noBarrelFile: package root is the curated public API surface.

export const PACKAGE_NAME = "@afenda/metadata" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export type {
  LayoutContract,
  LayoutDefinition,
  LayoutType,
  MetadataAuthorityDecision,
  MetadataAuthorityKey,
  MetadataAuthorityOwnership,
  MetadataContract,
  MetadataDensityMode,
  MetadataIdentity,
  MetadataLifecycleState,
  MetadataRuntimeContext,
  PresentationContract,
  PresentationDefinition,
  PresentationMode,
  ReadonlyMode,
  RegistryContract,
  RegistryEntry,
  RegistrationLifecycleState,
  RendererCapability,
  RendererCompatibilityRule,
  RendererContract,
  RuntimeContract,
  RuntimeDiagnostic,
  RuntimeDiagnosticLevel,
  SectionContract,
  SectionDefinition,
  SectionType,
  SurfaceContract,
  SurfaceDefinition,
  SurfaceType,
  VisibilityMode,
} from "./contracts/index.js";
export {
  DENSITY_MODES,
  LAYOUT_TYPES,
  METADATA_AUTHORITY_KEYS,
  METADATA_LIFECYCLE_STATES,
  PRESENTATION_MODES,
  READONLY_MODES,
  REGISTRATION_LIFECYCLE_STATES,
  RENDERER_CAPABILITIES,
  RUNTIME_DIAGNOSTIC_LEVELS,
  SECTION_TYPES,
  SURFACE_TYPES,
  VISIBILITY_MODES,
  layoutContract,
  metadataAuthorityMap,
  metadataContract,
  presentationContract,
  registryContract,
  rendererContract,
  runtimeContract,
  sectionContract,
  surfaceContract,
} from "./contracts/index.js";
