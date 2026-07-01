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

/** ERP metadata workspace live preview (PAS-006D). */
export const STUDIO_BLOCK_COMPONENT_REGISTRY_IDS = [
  "account-settings-01",
  "datatable-invoice",
  "hero-section-01",
  "login-page-04",
  "statistics-card-01",
];

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

  return new Set([
    ...flat,
    ...STUDIO_BLOCK_COMPONENT_REGISTRY_IDS,
    ...CURATED_BLOCK_STORY_SLUGS,
    ...erp,
  ]);
}

/**
 * @param {string} slug
 * @param {Set<string>} consumerSlugs
 * @returns {boolean}
 */
export function isBlockConsumer(slug, consumerSlugs) {
  return consumerSlugs.has(slug);
}
