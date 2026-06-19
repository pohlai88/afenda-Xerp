// biome-ignore-all lint/performance/noBarrelFile: TIP-007 requires a stable public root export surface.
export const PACKAGE_NAME = "@afenda/metadata-ui" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export type {
  MetadataActionAudit,
  MetadataActionCategory,
  MetadataActionContract,
  MetadataActionExecutionMode,
  MetadataActionPolicy,
} from "./contracts/metadata-action.contract";
export type {
  MetadataAuditEvidenceType,
  MetadataAuditField,
  MetadataAuditPanelContract,
} from "./contracts/metadata-audit-panel.contract";
export type { MetadataExampleContract } from "./contracts/metadata-example.contract";
export type {
  MetadataLayoutContract,
  MetadataLayoutDensity,
  MetadataLayoutRegion,
} from "./contracts/metadata-layout.contract";
export type {
  MetadataPermissionRequirement,
  MetadataVisibilityContext,
  MetadataVisibilityEffect,
  MetadataVisibilityResolution,
} from "./contracts/metadata-permission.contract";
export type { MetadataRegistryContract } from "./contracts/metadata-registry.contract";
export type {
  MetadataRendererContract,
  MetadataRendererResolution,
} from "./contracts/metadata-renderer.contract";
export type {
  MetadataFieldSchema,
  MetadataListColumn,
  MetadataSectionContract,
  MetadataSectionType,
} from "./contracts/metadata-section.contract";
export type {
  MetadataStateContract,
  MetadataSurfaceState,
} from "./contracts/metadata-state.contract";
export type { MetadataSurfaceContract } from "./contracts/metadata-surface.contract";
export { governedMetadataSurfaceExample } from "./examples/governed-surface.example";
export {
  createExampleRendererRegistry,
  exampleRendererRegistration,
} from "./examples/renderer-registration.example";
export {
  resolveMetadataActions,
  resolveMetadataVisibility,
} from "./registry/permission-visibility";
export {
  createMetadataRendererRegistry,
  type MetadataRendererRegistry,
} from "./registry/renderer-registry";
export { defaultMetadataRenderers } from "./renderers/default-renderers";
export {
  type MetadataStatePresentation,
  resolveMetadataStatePresentation,
} from "./renderers/state-renderer";
export {
  isSensitiveMetadataAction,
  type MetadataActionValidationResult,
  validateMetadataAction,
} from "./schemas/action-schema";
export {
  isMetadataSectionType,
  type MetadataSchemaValidationResult,
  metadataSectionSchemas,
  validateMetadataSection,
} from "./schemas/section-schema";
export {
  metadataStateSchema,
  resolveMetadataState,
} from "./schemas/state-schema";
export { validateMetadataSurface } from "./schemas/surface-schema";
export { governedMetadataSectionTypes } from "./sections/section-types";
