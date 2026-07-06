/**
 * Shared policy for @afenda/shadcn-studio-v2 biome suppressions.
 *
 * PascalCase filenames, root boundary barrels, and primitive label patterns are
 * owned by biome.project.jsonc package overrides — not per-file biome-ignore.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { REPO_ROOT } from "./quarantine-paths.mjs";

export const PACKAGE_SRC = join(REPO_ROOT, "packages/shadcn-studio-v2/src");

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);

/** Suppressions covered by biome.project.jsonc shadcn-studio-v2 overrides. */
export const REMOVABLE_SUPPRESSION_RE =
  /^\s*\/\/ biome-ignore lint\/(?:style\/useFilenamingConvention|performance\/noBarrelFile|a11y\/noLabelWithoutControl):[^\n]*\n/gm;

const LEADING_NEWLINES_RE = /^\n+/;
const MULTIPLE_BLANK_LINES_RE = /\n{3,}/g;

export function walkV2SourceFiles(directory = PACKAGE_SRC) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);

    if (statSync(fullPath).isDirectory()) {
      if (entry === "__tests__") {
        continue;
      }

      files.push(...walkV2SourceFiles(fullPath));
      continue;
    }

    const extension = entry.slice(entry.lastIndexOf("."));

    if (SOURCE_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

export function normalizeV2BiomeSuppressions(content) {
  const withoutSuppressions = content.replace(REMOVABLE_SUPPRESSION_RE, "");
  return withoutSuppressions
    .replace(LEADING_NEWLINES_RE, "")
    .replace(MULTIPLE_BLANK_LINES_RE, "\n\n");
}

/**
 * @returns {Array<{ file: string; detail: string }>}
 */
export function findRedundantV2BiomeSuppressions() {
  const violations = [];

  for (const filePath of walkV2SourceFiles()) {
    const original = readFileSync(filePath, "utf8");
    const match = original.match(REMOVABLE_SUPPRESSION_RE);

    if (!match) {
      continue;
    }

    violations.push({
      file: relative(REPO_ROOT, filePath).replaceAll("\\", "/"),
      detail: `redundant per-file biome-ignore (${match.length} suppression(s)); use biome.project.jsonc override and pnpm studio:v2:normalize-biome`,
    });
  }

  return violations;
}
