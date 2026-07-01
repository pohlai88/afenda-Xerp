/**
 * Re-export studio import path policy for Cursor hooks.
 * Canonical source: scripts/governance/studio-import-path-policy.mjs
 */
export {
  FORBIDDEN_IMPORT_PATTERNS,
  FORBIDDEN_PHYSICAL_PATH_KEYS,
  LEGACY_COMPONENTS_DIR,
  PATH_EDIT_WATCH_PATTERNS,
  REQUIRED_VIRTUAL_PATH_KEYS,
  STUDIO_PACKAGE_ROOT,
  STUDIO_PATHS_SSOT,
  legacyComponentsDirExists,
  matchesPathEditWatch,
  normalizeRepoPath,
  studioImportPathReminder,
} from "../../scripts/governance/studio-import-path-policy.mjs";
