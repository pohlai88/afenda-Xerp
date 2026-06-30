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
    if (name.startsWith("_")) {
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
        importPath: `./components/shadcn-studio/blocks/${name}/${name}.js`,
        importName: `${slugToImportName(name)}Block`,
        layout: resolveBlockStoryLayout(name),
      });
      continue;
    }

    if (name.endsWith(".tsx")) {
      manualStoryRequired.push(name.replace(TSX_FILE_EXTENSION_PATTERN, ""));
    }
  }

  auto.sort((a, b) => a.slug.localeCompare(b.slug));
  manualStoryRequired.sort();

  return { auto, manualStoryRequired };
}
