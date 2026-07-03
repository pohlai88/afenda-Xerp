/**
 * Shared path SSOT for quarantine install, sync, reset, promote, and gates.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LEADING_SLASH_RE = /^[/\\]/;

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
export const REPO_ROOT = repoRoot;
export const STUDIO_ROOT = join(repoRoot, "packages/shadcn-studio");
export const STUDIO_SRC = join(STUDIO_ROOT, "src");

export const QUARANTINE_ROOT = join(STUDIO_SRC, "components-quarantine");
export const QUARANTINE_README = join(QUARANTINE_ROOT, "README.md");
export const QUARANTINE_REGISTRY = join(
  QUARANTINE_ROOT,
  "quarantine-inbox.registry.json"
);

export const QUARANTINE_BLOCKS = join(QUARANTINE_ROOT, "blocks");
export const QUARANTINE_COMPONENTS = join(QUARANTINE_ROOT, "components");

export const QUARANTINE_LEGACY_UI = join(QUARANTINE_ROOT, "ui");

export const PRODUCTION_LAYOUTS = join(STUDIO_SRC, "components-layouts");
export const PRODUCTION_UI = join(STUDIO_SRC, "components-ui");
export const PRODUCTION_AUTH = join(STUDIO_SRC, "components-auth-shell");

export const LEGACY_BLOCKS_ROOT = join(
  STUDIO_SRC,
  "components",
  "shadcn-studio",
  "blocks"
);
export const LEGACY_COMPONENTS_ROOT = join(STUDIO_SRC, "components");
export const STRAY_LIB_UTILS = join(STUDIO_SRC, "lib", "utils.ts");
export const CANONICAL_UTILS = join(STUDIO_SRC, "utils", "utils.ts");

export const ALLOWED_QUARANTINE_ROOT_FILES = new Set([
  "README.md",
  "quarantine-inbox.registry.json",
]);

export const MIRRORED_BUCKET_DIRS = [QUARANTINE_BLOCKS, QUARANTINE_COMPONENTS];

export const COMPONENTS_JSON_INSTALL_ALIASES = {
  components: "@/components-quarantine/blocks",
  ui: "@/components-quarantine/components",
  utils: "@/lib/utils",
  lib: "@/lib",
  hooks: "@/hooks",
};

export const INSTALL_ALIAS_PATH_KEYS = [
  "@/components-quarantine/blocks",
  "@/components-quarantine/blocks/*",
  "@/components-quarantine/components",
  "@/components-quarantine/components/*",
  "@/components-quarantine/*",
];

/** Blocks that install into auth-shell bucket (not layouts). */
export const AUTH_SHELL_BLOCK_IDS = new Set(["login-page-04"]);

export const EMPTY_REGISTRY = {
  schemaVersion: 1,
  generatedAt: null,
  entries: [],
};

export function relFromRepo(absolutePath) {
  return join(
    "packages/shadcn-studio",
    absolutePath.replace(STUDIO_ROOT, "").replace(LEADING_SLASH_RE, "")
  ).replaceAll("\\", "/");
}

export function quarantineRelPath(absolutePath) {
  const rel = absolutePath
    .replace(STUDIO_SRC, "")
    .replace(LEADING_SLASH_RE, "");
  return rel.replaceAll("\\", "/");
}

export function productionTargetForBlock(blockId) {
  if (AUTH_SHELL_BLOCK_IDS.has(blockId)) {
    return {
      bucket: "components-auth-shell",
      relativePath: `components-auth-shell/${blockId}.tsx`,
      absolutePath: join(PRODUCTION_AUTH, `${blockId}.tsx`),
    };
  }

  const flatFile = join(PRODUCTION_LAYOUTS, `${blockId}.tsx`);
  const dirPath = join(PRODUCTION_LAYOUTS, blockId);

  return {
    bucket: "components-layouts",
    relativePath: `components-layouts/${blockId}`,
    absolutePath: flatFile,
    directoryPath: dirPath,
  };
}

export function quarantineTargetForBlock(blockId, layout = "flat") {
  if (layout === "directory") {
    return {
      bucket: "blocks",
      relativePath: `components-quarantine/blocks/${blockId}`,
      absolutePath: join(QUARANTINE_BLOCKS, blockId),
      layout: "directory",
    };
  }

  return {
    bucket: "blocks",
    relativePath: `components-quarantine/blocks/${blockId}.tsx`,
    absolutePath: join(QUARANTINE_BLOCKS, `${blockId}.tsx`),
    layout: "flat",
  };
}
