/**
 * PAS-006 Storybook lab — block discovery for auto vs curated stories.
 *
 * Folder page blocks (self-contained entry files) → auto stories with <Block />.
 * Flat prop-driven .tsx files → manualStoryRequired (curated fixtures in compositions).
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const FULLSCREEN_BLOCK_SLUG_PATTERN =
  /login|error|account-settings|application-shell|page-\d/i;

const TSX_FILE_EXTENSION_PATTERN = /\.tsx$/;

const SHARED_LAYOUT_FILES = new Set(["logo.tsx", "morphing-text.tsx"]);
const SKIP_FLAT_BLOCK_SLUGS = new Set(["morphing-text"]);
const SKIP_DIR_NAMES = new Set(["__tests__", "_shared", "_internal"]);

/** @typedef {{ slug: string; importPath: string; importName: string; layout: "centered" | "fullscreen" }} BlockEntry */

/**
 * @param {string} slug
 * @returns {string}
 */
export function slugToImportName(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * @param {string} slug
 * @returns {"centered" | "fullscreen"}
 */
export function resolveBlockStoryLayout(slug) {
  return FULLSCREEN_BLOCK_SLUG_PATTERN.test(slug) ? "fullscreen" : "centered";
}

/**
 * @param {string} blocksRoot
 * @returns {{ auto: BlockEntry[]; manualStoryRequired: string[] }}
 */
export function discoverBlockStories(blocksRoot) {
  /** @type {BlockEntry[]} */
  const auto = [];
  /** @type {string[]} */
  const manualStoryRequired = [];

  for (const name of readdirSync(blocksRoot)) {
    if (name.startsWith("_") || SKIP_DIR_NAMES.has(name)) {
      continue;
    }

    const absolute = join(blocksRoot, name);
    const stat = statSync(absolute);

    if (stat.isDirectory()) {
      const entryFile = join(absolute, `${name}.tsx`);
      try {
        statSync(entryFile);
      } catch {
        manualStoryRequired.push(name);
        continue;
      }

      auto.push({
        slug: name,
        importPath: `../components-layouts/${name}/${name}.js`,
        importName: `${slugToImportName(name)}Block`,
        layout: resolveBlockStoryLayout(name),
      });
      continue;
    }

    if (name.endsWith(".tsx")) {
      if (SHARED_LAYOUT_FILES.has(name)) {
        continue;
      }
      if (name.endsWith(".stories.tsx")) {
        continue;
      }
      const slug = name.replace(TSX_FILE_EXTENSION_PATTERN, "");
      if (SKIP_FLAT_BLOCK_SLUGS.has(slug)) {
        continue;
      }
      manualStoryRequired.push(slug);
    }
  }

  auto.sort((a, b) => a.slug.localeCompare(b.slug));
  manualStoryRequired.sort();

  return { auto, manualStoryRequired };
}
