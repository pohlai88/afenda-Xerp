/**
 * Presentation contracts barrel — visibility + theme preset vocabulary.
 *
 * Authority: metadata-ui contracts only; runtime modes from @afenda/ui-composition.
 */

export {
  type LegacyMetadataVisibilityInput,
  METADATA_VISIBILITY_REASONS,
  METADATA_VISIBILITY_STATES,
  type MetadataVisibilityInput,
  type MetadataVisibilityReason,
  type MetadataVisibilityResult,
  type MetadataVisibilityState,
} from "../presentation/presentation.contract.js";

export {
  isMetadataUiThemePresetSlug,
  METADATA_UI_THEME_PRESET_SLUGS,
  type MetadataUiThemePresentation,
  type MetadataUiThemePresetSlug,
} from "./theme-presentation.contract.js";
