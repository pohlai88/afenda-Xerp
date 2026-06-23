export type {
  LegacyMetadataVisibilityInput,
  MetadataVisibilityInput,
  MetadataVisibilityReason,
  MetadataVisibilityResult,
  MetadataVisibilityState,
} from "./presentation.contract.js";
export {
  METADATA_VISIBILITY_REASONS,
  METADATA_VISIBILITY_STATES,
} from "./presentation.contract.js";

export {
  normalizeLegacyVisibilityInput,
  resolveDensityMode,
  resolvePresentationMode,
  resolveReadonlyMode,
  resolveVisibility,
} from "./resolve-presentation.js";
