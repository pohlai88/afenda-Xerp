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
const STYLE_ROOT = path.join(PACKAGE_SRC, "styles");

const REQUIRED_STYLE_FILES = [
  "shadcn-default.css",
  "swiss-noir.css",
  "verdant-noir.css",
] as const;

const THEME_STYLE_FILES = ["swiss-noir.css", "verdant-noir.css"] as const;
const DEFAULT_STYLE_FILE = "shadcn-default.css";
const TOKEN_DECLARATION_PATTERN = /--([a-z0-9-]+)\s*:/gu;
const SELECTOR_PATTERN = /(^|\})\s*([^{}@][^{}]*)\{/gu;

const CANONICAL_SHADCN_TOKENS = new Set([
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "radius",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
]);

const FORBIDDEN_TOKEN_PATTERNS = [
  { label: "--brand-*", pattern: /--brand-[\w-]+/u },
  { label: "--afenda-*", pattern: /--afenda-[\w-]+/u },
  { label: "--surface-*", pattern: /--surface-[\w-]+/u },
  { label: "--luxury-*", pattern: /--luxury-[\w-]+/u },
  { label: "--primary-2", pattern: /--primary-2\b/u },
  { label: "--background-alt", pattern: /--background-alt\b/u },
  { label: "--card-secondary", pattern: /--card-secondary\b/u },
  { label: "--muted-2", pattern: /--muted-2\b/u },
  { label: "--shadow-*", pattern: /--shadow-[\w-]+/u },
  { label: "--gradient-*", pattern: /--gradient-[\w-]+/u },
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

const listTokenNames = (content: string): string[] => {
  TOKEN_DECLARATION_PATTERN.lastIndex = 0;

  return [...content.matchAll(TOKEN_DECLARATION_PATTERN)].map(
    (match) => match[1] ?? ""
  );
};

const listSelectors = (content: string): string[] => {
  SELECTOR_PATTERN.lastIndex = 0;

  return [...content.matchAll(SELECTOR_PATTERN)].map((match) =>
    (match[2] ?? "").trim()
  );
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

const checkRequiredStyleFiles = (styleNames: Set<string>): DriftViolation[] =>
  REQUIRED_STYLE_FILES.filter((fileName) => !styleNames.has(fileName)).map(
    (fileName) => ({
      rule: "missing-required-style-file",
      file: toRelative(path.join(STYLE_ROOT, fileName)),
      detail: "Phase 2 requires exactly the approved CSS authority files.",
    })
  );

const checkApprovedStyleFile = (file: string): DriftViolation[] => {
  const fileName = path.basename(file);
  const requiredNames = new Set(REQUIRED_STYLE_FILES);

  if (requiredNames.has(fileName as (typeof REQUIRED_STYLE_FILES)[number])) {
    return [];
  }

  return [
    {
      rule: "unapproved-style-file",
      file: toRelative(file),
      detail: "New theme files require an explicit taxonomy and export slice.",
    },
  ];
};

const checkCanonicalTokenNames = (
  file: string,
  tokenNames: string[]
): DriftViolation[] =>
  tokenNames
    .filter((tokenName) => !CANONICAL_SHADCN_TOKENS.has(tokenName))
    .map((tokenName) => ({
      rule: "non-canonical-token",
      file: toRelative(file),
      detail: `--${tokenName} is not in the canonical shadcn token list.`,
    }));

const checkDefaultStyleSelectors = (
  file: string,
  selectors: string[]
): DriftViolation[] => {
  const selectorSet = new Set(selectors);

  if (selectorSet.has(":root") && selectorSet.has(".dark")) {
    return [];
  }

  return [
    {
      rule: "default-style-selector",
      file: toRelative(file),
      detail:
        "Default CSS must declare the canonical :root and .dark token layers.",
    },
  ];
};

const isApprovedThemeStyle = (fileName: string): boolean =>
  THEME_STYLE_FILES.includes(fileName as (typeof THEME_STYLE_FILES)[number]);

const checkThemeStyleSelector = (
  file: string,
  expectedSelector: string,
  selectors: string[]
): DriftViolation[] => {
  if (selectors.length === 1 && selectors[0] === expectedSelector) {
    return [];
  }

  return [
    {
      rule: "theme-selector",
      file: toRelative(file),
      detail: `Named theme must use only ${expectedSelector}.`,
    },
  ];
};

const checkThemeTokensDeclaredByDefault = (
  file: string,
  tokenNames: string[],
  defaultTokens: Set<string>
): DriftViolation[] =>
  tokenNames
    .filter((tokenName) => !defaultTokens.has(tokenName))
    .map((tokenName) => ({
      rule: "theme-token-not-in-default",
      file: toRelative(file),
      detail: `--${tokenName} is not declared by ${DEFAULT_STYLE_FILE}.`,
    }));

const checkThemeStyle = (
  file: string,
  tokenNames: string[],
  selectors: string[],
  defaultTokens: Set<string>
): DriftViolation[] => {
  const themeName = path.basename(file).replace(".css", "");
  const expectedSelector = `[data-theme="${themeName}"]`;

  return [
    ...checkThemeStyleSelector(file, expectedSelector, selectors),
    ...checkThemeTokensDeclaredByDefault(file, tokenNames, defaultTokens),
  ];
};

const checkCssFileAuthority = (
  file: string,
  tokenNames: string[],
  selectors: string[],
  defaultTokens: Set<string>
): DriftViolation[] => {
  const fileName = path.basename(file);
  const violations = [
    ...checkApprovedStyleFile(file),
    ...checkCanonicalTokenNames(file, tokenNames),
  ];

  if (fileName === DEFAULT_STYLE_FILE) {
    return [...violations, ...checkDefaultStyleSelectors(file, selectors)];
  }

  if (isApprovedThemeStyle(fileName)) {
    return [
      ...violations,
      ...checkThemeStyle(file, tokenNames, selectors, defaultTokens),
    ];
  }

  return violations;
};

const checkCssTokenAuthority = async (): Promise<DriftViolation[]> => {
  const violations: DriftViolation[] = [];
  const styleFiles = (await collectFiles(STYLE_ROOT)).filter(
    (file) => path.extname(file) === ".css"
  );
  const styleNames = new Set(styleFiles.map((file) => path.basename(file)));
  const defaultStylePath = path.join(STYLE_ROOT, DEFAULT_STYLE_FILE);
  const defaultSource = existsSync(defaultStylePath)
    ? await readText(defaultStylePath)
    : "";
  const defaultTokens = new Set(listTokenNames(defaultSource));

  violations.push(...checkRequiredStyleFiles(styleNames));

  for (const file of styleFiles) {
    const content = await readText(file);
    const tokenNames = listTokenNames(content);
    const selectors = listSelectors(content);

    violations.push(
      ...checkCssFileAuthority(file, tokenNames, selectors, defaultTokens)
    );
  }

  return violations;
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
  checkCssTokenAuthority,
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
