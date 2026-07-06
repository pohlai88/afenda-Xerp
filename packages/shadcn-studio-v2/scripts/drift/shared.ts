import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface DriftViolation {
  readonly detail: string;
  readonly file: string;
  readonly rule: string;
}

export const PACKAGE_ROOT = process.cwd();
export const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
export const PACKAGE_SRC = path.join(PACKAGE_ROOT, "src");
export const QUARANTINE_ROOT = path.join(
  PACKAGE_SRC,
  "components",
  "quarantine"
);
export const QUARANTINE_INVENTORY_BASELINE_PATH = path.join(
  QUARANTINE_ROOT,
  "inventory.baseline.json"
);

export const STYLE_ROOT = path.join(PACKAGE_SRC, "styles");
export const COMPONENTS_JSON_PATH = path.join(PACKAGE_ROOT, "components.json");
export const PACKAGE_JSON_PATH = path.join(PACKAGE_ROOT, "package.json");

const IGNORED_DIR_NAMES = new Set([
  ".git",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
]);

const TEXT_FILE_EXTENSIONS = new Set([
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".jsonc",
  ".md",
  ".mdx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
]);

const SOURCE_FILE_EXTENSIONS = new Set([".css", ".ts", ".tsx"]);
const COMPONENT_FILE_EXTENSIONS = new Set([".ts", ".tsx"]);

const toPosix = (filePath: string): string =>
  filePath.split(path.sep).join("/");

export const toRelative = (filePath: string): string =>
  toPosix(path.relative(REPO_ROOT, filePath));

const isIgnoredPath = (filePath: string): boolean =>
  filePath.split(path.sep).some((segment) => IGNORED_DIR_NAMES.has(segment));

export const isTextFile = (filePath: string): boolean =>
  TEXT_FILE_EXTENSIONS.has(path.extname(filePath));

export const isSourceFile = (filePath: string): boolean =>
  SOURCE_FILE_EXTENSIONS.has(path.extname(filePath));

export const isComponentFile = (filePath: string): boolean =>
  COMPONENT_FILE_EXTENSIONS.has(path.extname(filePath));

export const collectFiles = async (root: string): Promise<string[]> => {
  if (!existsSync(root)) {
    return [];
  }

  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);

    if (isIgnoredPath(entryPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
};

export const collectDirectories = async (root: string): Promise<string[]> => {
  if (!existsSync(root)) {
    return [];
  }

  const entries = await readdir(root, { withFileTypes: true });
  const directories: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);

    if (isIgnoredPath(entryPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      directories.push(entryPath, ...(await collectDirectories(entryPath)));
    }
  }

  return directories;
};

export const readText = async (filePath: string): Promise<string> =>
  readFile(filePath, "utf8");

export const findFirstMatch = (
  content: string,
  pattern: RegExp
): string | null => {
  pattern.lastIndex = 0;
  const match = pattern.exec(content);
  return match?.[0] ?? null;
};

export const parseJsonFile = async <T>(filePath: string): Promise<T | null> => {
  if (!existsSync(filePath)) {
    return null;
  }

  return JSON.parse(await readText(filePath)) as T;
};
