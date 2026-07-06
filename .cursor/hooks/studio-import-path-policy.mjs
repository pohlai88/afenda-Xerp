/**
 * Retired — v1 @afenda/shadcn-studio import path policy removed (Slice D-1).
 * Hooks remain wired for compatibility; reminders are no-ops.
 */
export const FORBIDDEN_IMPORT_PATTERNS = [];
export const FORBIDDEN_PHYSICAL_PATH_KEYS = [];
export const LEGACY_COMPONENTS_DIR = null;
export const PATH_EDIT_WATCH_PATTERNS = [];
export const REQUIRED_VIRTUAL_PATH_KEYS = [];
export const STUDIO_PACKAGE_ROOT = "packages/shadcn-studio-v2";
export const STUDIO_PATHS_SSOT = "packages/shadcn-studio-v2/tsconfig.json";

export function legacyComponentsDirExists() {
  return false;
}

export function matchesPathEditWatch() {
  return false;
}

export function normalizeRepoPath(relativePath) {
  return String(relativePath ?? "").replace(/\\/g, "/");
}

export function studioImportPathReminder() {
  return null;
}
