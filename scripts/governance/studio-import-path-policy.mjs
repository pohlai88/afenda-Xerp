/**
 * Shared policy for shadcn-studio import path aliases.
 * Consumed by check-studio-tsconfig-paths.mjs and Cursor hooks.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Virtual MCP aliases — required in source imports. */
export const REQUIRED_VIRTUAL_PATH_KEYS = [
  "@/components/ui/*",
  "@/components/shadcn-studio/*",
  "@/components-auth-shell/*",
  "@/components-app-shell/*",
  "@/components-assets/*",
  "@/lib/utils",
  "@/lib/*",
  "@/hooks/*",
  "@/*",
];

/** Physical folder mirrors — forbidden in tsconfig and source imports. */
export const FORBIDDEN_PHYSICAL_PATH_KEYS = [
  "@/components-ui/*",
  "@/components-layouts/*",
];

/** Forbidden import patterns in studio/storybook source. */
export const FORBIDDEN_IMPORT_PATTERNS = [
  {
    id: "physical-ui-alias",
    pattern: /from\s+["']@\/components-ui\//,
    message: "Use @/components/ui/ instead of @/components-ui/",
  },
  {
    id: "physical-layouts-alias",
    pattern: /from\s+["']@\/components-layouts\//,
    message: "Use @/components/shadcn-studio/ instead of @/components-layouts/",
  },
];

export const STUDIO_PACKAGE_ROOT = "packages/shadcn-studio";
export const STUDIO_PATHS_SSOT = `${STUDIO_PACKAGE_ROOT}/tsconfig.paths.json`;
export const LEGACY_COMPONENTS_DIR = `${STUDIO_PACKAGE_ROOT}/src/components`;

/** Paths that trigger post-edit reminders when modified. */
export const PATH_EDIT_WATCH_PATTERNS = [
  /^packages\/shadcn-studio\/src\/.*\.(ts|tsx)$/,
  /^packages\/shadcn-studio\/tsconfig.*\.json$/,
  /^vitest\.shared\.ts$/,
  /^apps\/storybook\/\.storybook\/main\.ts$/,
  /^apps\/storybook\/tsconfig\.storybook\.json$/,
];

export function normalizeRepoPath(relativePath) {
  return relativePath.replace(/\\/g, "/");
}

export function matchesPathEditWatch(relativePath) {
  const normalized = normalizeRepoPath(relativePath);
  return PATH_EDIT_WATCH_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function studioImportPathReminder(relativePath) {
  if (!matchesPathEditWatch(relativePath)) {
    return null;
  }

  return [
    "Studio import path alias reminder:",
    "- Physical folders (components-ui/) ≠ import aliases (@/components/ui/).",
    `- SSOT: ${STUDIO_PATHS_SSOT}`,
    "- Forbidden in source: @/components-ui/, @/components-layouts/",
    "- Gates: pnpm check:studio-tsconfig-paths && pnpm check:studio-import-zones",
    "- Diagnosis agent: @studio-import-path-auditor",
  ].join("\n");
}

export function legacyComponentsDirExists(repoRoot) {
  return existsSync(join(repoRoot, LEGACY_COMPONENTS_DIR));
}
