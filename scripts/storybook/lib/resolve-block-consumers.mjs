/**
 * Block slugs with a Storybook or ERP runtime consumer.
 * Used by promotion-doc codegen to skip orphan MCP installs.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "../../..");
const SOURCE_FILE_PATTERN = /\.(tsx?|jsx?)$/;

/** ERP metadata workspace live preview (PAS-006D) — synced with MCP_SEED_BLOCK_MANIFEST. */
export const STUDIO_BLOCK_COMPONENT_REGISTRY_IDS = readMcpSeedBlockIds();

/**
 * @param {string} repoRootPath
 * @returns {Set<string>}
 */
export function readFlatBlockStorySlugs(repoRootPath = repoRoot) {
  const source = readFileSync(
    join(
      repoRootPath,
      "packages/shadcn-studio/src/storybook/block-flat-story.registry.ts"
    ),
    "utf8"
  );

  return new Set(
    [...source.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1])
  );
}

/**
 * @param {string} exportName e.g. DatatableUserBlock
 * @returns {string | null}
 */
export function blockExportNameToSlug(exportName) {
  if (!exportName.endsWith("Block")) {
    return null;
  }

  const base = exportName.slice(0, -"Block".length);
  return base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * @param {string} dir
 * @param {Set<string>} blockExportNames
 */
function collectBlockExportsFromDir(dir, blockExportNames) {
  for (const name of readdirSync(dir)) {
    const absolute = join(dir, name);
    const stat = statSync(absolute);

    if (stat.isDirectory()) {
      collectBlockExportsFromDir(absolute, blockExportNames);
      continue;
    }

    if (!SOURCE_FILE_PATTERN.test(name)) {
      continue;
    }

    const source = readFileSync(absolute, "utf8");
    if (!source.includes("@afenda/shadcn-studio")) {
      continue;
    }

    for (const match of source.matchAll(/\b([A-Z][A-Za-z0-9]+Block)\b/g)) {
      blockExportNames.add(match[1]);
    }
  }
}

/**
 * @param {string} [repoRootPath]
 * @returns {Set<string>}
 */
export function readErpBlockConsumerSlugs(repoRootPath = repoRoot) {
  const erpSrc = join(repoRootPath, "apps/erp/src");
  const blockExportNames = new Set();

  collectBlockExportsFromDir(erpSrc, blockExportNames);

  const slugs = new Set();
  for (const exportName of blockExportNames) {
    const slug = blockExportNameToSlug(exportName);
    if (slug) {
      slugs.add(slug);
    }
  }

  return slugs;
}

/** Curated CSF stories in shadcn-studio-blocks.stories.tsx (not auto smoke only). */
export const CURATED_BLOCK_STORY_SLUGS = ["account-settings-01"];

/**
 * @param {{ autoStories?: Array<{ slug: string }>; manualStoryRequired?: string[] }} manifest
 * @param {string} [repoRootPath]
 * @returns {Set<string>}
 */
export function resolveBlockConsumerSlugs(_manifest, repoRootPath = repoRoot) {
  const flat = [...readFlatBlockStorySlugs(repoRootPath)];
  const erp = [...readErpBlockConsumerSlugs(repoRootPath)];
  const mcpSeed = [...readMcpSeedBlockIds(repoRootPath)];
  const layoutImports = [...readStudioLayoutImportSlugs(repoRootPath)];

  return new Set([
    ...flat,
    ...STUDIO_BLOCK_COMPONENT_REGISTRY_IDS,
    ...CURATED_BLOCK_STORY_SLUGS,
    ...erp,
    ...mcpSeed,
    ...layoutImports,
  ]);
}

/**
 * @param {string} repoRootPath
 * @returns {Set<string>}
 */
export function readMcpSeedBlockIds(repoRootPath = repoRoot) {
  const source = readFileSync(
    join(
      repoRootPath,
      "packages/shadcn-studio/src/meta-registry/mcp-seed-block-manifest.ts"
    ),
    "utf8"
  );

  return new Set(
    [...source.matchAll(/blockId: "([^"]+)"/g)].map((match) => match[1])
  );
}

/**
 * Slugs referenced by import paths under components-layouts/ or components-auth-shell/.
 * @param {string} dir
 * @param {Set<string>} slugs
 */
function collectLayoutImportSlugsFromDir(dir, slugs) {
  for (const name of readdirSync(dir)) {
    const absolute = join(dir, name);
    const stat = statSync(absolute);

    if (stat.isDirectory()) {
      if (name === "components-layouts" || name === "components-auth-shell") {
        continue;
      }

      collectLayoutImportSlugsFromDir(absolute, slugs);
      continue;
    }

    if (!SOURCE_FILE_PATTERN.test(name)) {
      continue;
    }

    const source = readFileSync(absolute, "utf8");

    for (const match of source.matchAll(
      /components-(?:layouts|auth-shell)\/([a-z0-9-]+)/g
    )) {
      slugs.add(match[1]);
    }
  }
}

/**
 * @param {string} [repoRootPath]
 * @returns {Set<string>}
 */
export function readStudioLayoutImportSlugs(repoRootPath = repoRoot) {
  const slugs = new Set();
  collectLayoutImportSlugsFromDir(
    join(repoRootPath, "packages/shadcn-studio/src"),
    slugs
  );
  return slugs;
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function normalizeBlockConsumerSlug(slug) {
  return slug.endsWith(".stories") ? slug.slice(0, -".stories".length) : slug;
}

/**
 * @param {string} slug
 * @param {Set<string>} consumerSlugs
 * @returns {boolean}
 */
export function isProtectedBlockSlug(slug, consumerSlugs) {
  if (consumerSlugs.has(slug)) {
    return true;
  }

  const normalized = normalizeBlockConsumerSlug(slug);
  return normalized !== slug && consumerSlugs.has(normalized);
}

/** @deprecated Use isProtectedBlockSlug */
export function isBlockConsumer(slug, consumerSlugs) {
  return isProtectedBlockSlug(slug, consumerSlugs);
}
