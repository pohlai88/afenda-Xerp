import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

interface DriftViolation {
  readonly detail: string;
  readonly file: string;
  readonly rule: string;
}

const PACKAGE_ROOT = process.cwd();
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
const PACKAGE_SRC = path.join(PACKAGE_ROOT, "src");

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

const FORBIDDEN_TOKEN_PATTERNS = [
  { label: "--brand-*", pattern: /--brand-[\w-]+/u },
  { label: "--afenda-*", pattern: /--afenda-[\w-]+/u },
  { label: "--surface-*", pattern: /--surface-[\w-]+/u },
  { label: "--luxury-*", pattern: /--luxury-[\w-]+/u },
  { label: "--primary-2", pattern: /--primary-2\b/u },
  { label: "--background-alt", pattern: /--background-alt\b/u },
  { label: "--card-secondary", pattern: /--card-secondary\b/u },
  { label: "--muted-2", pattern: /--muted-2\b/u },
] satisfies ReadonlyArray<{ readonly label: string; readonly pattern: RegExp }>;

const FORBIDDEN_THEME_FILES = [
  "ledger-noir.css",
  "phantom-noir.css",
  "executive-noir.css",
  "audit-noir.css",
  "erp-dark.css",
  "luxury-admin.css",
] as const;

const FORBIDDEN_LEGACY_FOLDERS = [
  "components-ui",
  "components-layouts",
  "components-auth-shell",
  "theme-runtime",
  "meta-contracts",
  "blocks",
  "sections",
  "features",
  "domains",
] as const;

const V2_INTERNAL_IMPORT_PATTERN =
  /(?<quote>["'])@afenda\/shadcn-studio-v2\/(?<subpath>(?:components|views|contexts|styles|src)(?:\/[^"']*)?|metadata\/[^"']+)\k<quote>/gu;

const V2_SOURCE_STYLE_PATH_PATTERN =
  /(?<quote>["'])(?:\.\.?\/)*packages\/shadcn-studio-v2\/src\/styles\/[^"']+\k<quote>/gu;

const V2_FORBIDDEN_RUNTIME_IMPORT_PATTERNS = [
  {
    label: "_reference import",
    pattern: /(?<quote>["'])(?:\.\.?\/)*_reference\/[^"']+\k<quote>/gu,
  },
  {
    label: "legacy shadcn-studio source import",
    pattern:
      /(?<quote>["'])(?:@afenda\/shadcn-studio\/src|(?:\.\.?\/)*packages\/shadcn-studio\/src)\/[^"']+\k<quote>/gu,
  },
  {
    label: "legacy shadcn-studio package import",
    pattern: /(?<quote>["'])@afenda\/shadcn-studio(?:\/[^"']*)?\k<quote>/gu,
  },
] satisfies ReadonlyArray<{ readonly label: string; readonly pattern: RegExp }>;

const HARDCODED_HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/u;

const toPosix = (filePath: string): string =>
  filePath.split(path.sep).join("/");

const toRelative = (filePath: string): string =>
  toPosix(path.relative(REPO_ROOT, filePath));

const isIgnoredPath = (filePath: string): boolean =>
  filePath.split(path.sep).some((segment) => IGNORED_DIR_NAMES.has(segment));

const isTextFile = (filePath: string): boolean =>
  TEXT_FILE_EXTENSIONS.has(path.extname(filePath));

const isSourceFile = (filePath: string): boolean =>
  SOURCE_FILE_EXTENSIONS.has(path.extname(filePath));

const isComponentFile = (filePath: string): boolean =>
  COMPONENT_FILE_EXTENSIONS.has(path.extname(filePath));

const collectFiles = async (root: string): Promise<string[]> => {
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

const collectDirectories = async (root: string): Promise<string[]> => {
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

const readText = async (filePath: string): Promise<string> =>
  readFile(filePath, "utf8");

const findFirstMatch = (content: string, pattern: RegExp): string | null => {
  pattern.lastIndex = 0;
  const match = pattern.exec(content);
  return match?.[0] ?? null;
};

const checkForbiddenTokens = async (): Promise<DriftViolation[]> => {
  const files = (await collectFiles(PACKAGE_SRC)).filter(isSourceFile);
  const violations: DriftViolation[] = [];

  for (const file of files) {
    const content = await readText(file);

    for (const { label, pattern } of FORBIDDEN_TOKEN_PATTERNS) {
      const match = findFirstMatch(content, pattern);

      if (match) {
        violations.push({
          rule: "forbidden-token",
          file: toRelative(file),
          detail: `${label} matched ${match}`,
        });
      }
    }
  }

  return violations;
};

const checkForbiddenThemeFiles = async (): Promise<DriftViolation[]> => {
  const files = await collectFiles(PACKAGE_ROOT);
  const forbiddenNames = new Set(FORBIDDEN_THEME_FILES);

  return files
    .filter((file) =>
      forbiddenNames.has(
        path.basename(file) as (typeof FORBIDDEN_THEME_FILES)[number]
      )
    )
    .map((file) => ({
      rule: "forbidden-theme-file",
      file: toRelative(file),
      detail:
        "Future theme candidates require taxonomy, export, Storybook, and consumer proof before file creation.",
    }));
};

const checkV2RuntimeImports = async (): Promise<DriftViolation[]> => {
  const files = (await collectFiles(PACKAGE_SRC)).filter(isTextFile);
  const violations: DriftViolation[] = [];

  for (const file of files) {
    const content = await readText(file);

    for (const { label, pattern } of V2_FORBIDDEN_RUNTIME_IMPORT_PATTERNS) {
      const match = findFirstMatch(content, pattern);

      if (match) {
        violations.push({
          rule: "forbidden-v2-runtime-import",
          file: toRelative(file),
          detail: `${label}: ${match}`,
        });
      }
    }
  }

  return violations;
};

const checkConsumerDeepImports = async (): Promise<DriftViolation[]> => {
  const candidateRoots = [
    path.join(REPO_ROOT, "apps"),
    path.join(REPO_ROOT, "packages"),
  ];
  const violations: DriftViolation[] = [];

  for (const root of candidateRoots) {
    const files = (await collectFiles(root)).filter(
      (file) => isTextFile(file) && !file.startsWith(PACKAGE_ROOT)
    );

    for (const file of files) {
      const content = await readText(file);
      const internalImport = findFirstMatch(
        content,
        V2_INTERNAL_IMPORT_PATTERN
      );
      const stylePathImport = findFirstMatch(
        content,
        V2_SOURCE_STYLE_PATH_PATTERN
      );

      if (internalImport) {
        violations.push({
          rule: "forbidden-consumer-v2-internal-import",
          file: toRelative(file),
          detail: `consumer deep import ${internalImport}`,
        });
      }

      if (stylePathImport) {
        violations.push({
          rule: "forbidden-consumer-v2-style-source-import",
          file: toRelative(file),
          detail: `consumer source style import ${stylePathImport}`,
        });
      }
    }
  }

  return violations;
};

const checkLegacyFolders = async (): Promise<DriftViolation[]> => {
  const directories = await collectDirectories(PACKAGE_SRC);
  const forbiddenNames = new Set(FORBIDDEN_LEGACY_FOLDERS);

  return directories
    .filter((directory) =>
      forbiddenNames.has(
        path.basename(directory) as (typeof FORBIDDEN_LEGACY_FOLDERS)[number]
      )
    )
    .map((directory) => ({
      rule: "forbidden-legacy-folder",
      file: toRelative(directory),
      detail:
        "Legacy or reference structural folder restored inside V2 source.",
    }));
};

const checkHardcodedHex = async (): Promise<DriftViolation[]> => {
  const roots = [
    path.join(PACKAGE_SRC, "components"),
    path.join(PACKAGE_SRC, "views"),
  ];
  const violations: DriftViolation[] = [];

  for (const root of roots) {
    const rootStat = existsSync(root) ? await stat(root) : null;

    if (!rootStat?.isDirectory()) {
      continue;
    }

    const files = (await collectFiles(root)).filter(isComponentFile);

    for (const file of files) {
      const content = await readText(file);
      const match = findFirstMatch(content, HARDCODED_HEX_PATTERN);

      if (match) {
        violations.push({
          rule: "hardcoded-hex",
          file: toRelative(file),
          detail: `hardcoded color ${match}; use canonical CSS tokens instead`,
        });
      }
    }
  }

  return violations;
};

const checks = [
  checkForbiddenTokens,
  checkForbiddenThemeFiles,
  checkV2RuntimeImports,
  checkConsumerDeepImports,
  checkLegacyFolders,
  checkHardcodedHex,
] satisfies ReadonlyArray<() => Promise<DriftViolation[]>>;

const main = async (): Promise<void> => {
  const violations = (await Promise.all(checks.map((check) => check()))).flat();

  if (violations.length === 0) {
    console.log("Afenda Studio V2 design-system drift guard passed.");
    return;
  }

  console.error("Afenda Studio V2 design-system drift guard failed.");

  for (const violation of violations) {
    console.error(
      `- [${violation.rule}] ${violation.file}: ${violation.detail}`
    );
  }

  process.exitCode = 1;
};

await main();
