// biome-ignore-all lint/performance/noBarrelFile: TIP-005 requires a stable contract export surface.
export type {
  MetadataAuthorityDecision,
  MetadataAuthorityKey,
  MetadataAuthorityOwnership,
} from "./metadata-authority-map.js";
export {
  METADATA_AUTHORITY_KEYS,
  metadataAuthorityMap,
} from "./metadata-authority-map.js";
export type {
  MetadataContract,
  MetadataIdentity,
  MetadataLifecycleState,
} from "./metadata.contract.js";
export {
  METADATA_LIFECYCLE_STATES,
  metadataContract,
} from "./metadata.contract.js";
export type {
  LayoutContract,
  LayoutDefinition,
  LayoutType,
} from "./layout.contract.js";
export { LAYOUT_TYPES, layoutContract } from "./layout.contract.js";
export type {
  MetadataDensityMode,
  PresentationContract,
  PresentationDefinition,
  PresentationMode,
  ReadonlyMode,
  VisibilityMode,
} from "./presentation.contract.js";
export {
  DENSITY_MODES,
  PRESENTATION_MODES,
  READONLY_MODES,
  VISIBILITY_MODES,
  presentationContract,
} from "./presentation.contract.js";
export type {
  RegistryContract,
  RegistryEntry,
  RegistrationLifecycleState,
} from "./registry.contract.js";
export {
  REGISTRATION_LIFECYCLE_STATES,
  registryContract,
} from "./registry.contract.js";
export type {
  RendererCapability,
  RendererCompatibilityRule,
  RendererContract,
} from "./renderer.contract.js";
export {
  RENDERER_CAPABILITIES,
  rendererContract,
} from "./renderer.contract.js";
export type {
  RuntimeContract,
  RuntimeDiagnostic,
  RuntimeDiagnosticLevel,
  MetadataRuntimeContext,
} from "./runtime.contract.js";
export {
  RUNTIME_DIAGNOSTIC_LEVELS,
  runtimeContract,
} from "./runtime.contract.js";
export type {
  SectionContract,
  SectionDefinition,
  SectionType,
} from "./section.contract.js";
export { SECTION_TYPES, sectionContract } from "./section.contract.js";
export type {
  SurfaceContract,
  SurfaceDefinition,
  SurfaceType,
} from "./surface.contract.js";
export { SURFACE_TYPES, surfaceContract } from "./surface.contract.js";
