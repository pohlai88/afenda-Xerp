// TIP-008 spec-required service file — re-exports from the localization engine.
// biome-ignore lint/performance/noBarrelFile: TIP-008 requires this compatibility service entry point.
export {
  type LocalizationResolution,
  localization,
  resolveLocalizationAccess,
} from "./localization-engine";
