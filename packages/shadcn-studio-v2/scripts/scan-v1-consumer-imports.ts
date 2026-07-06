import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Lane B-01 / B-13 SSOT — governance scripts must delegate here, not re-scan. */
export const V1_CONSUMER_IMPORT_BASELINE_RELATIVE = path.join(
  "scripts",
  "lane-b",
  "v1-consumer-import.baseline.json"
);

export const V1_CONSUMER_SCAN_ROOTS = [
  "apps/developer/src",
  "apps/erp/src",
  "apps/storybook",
] as const;

export type V1ConsumerRoot = (typeof V1_CONSUMER_SCAN_ROOTS)[number];

export type V1ImportCategory =
  | "block"
  | "config"
  | "lab"
  | "metadata"
  | "shell"
  | "theme"
  | "type-only"
  | "unknown";

export interface V1ConsumerImportEntry {
  readonly category: V1ImportCategory;
  readonly consumer: V1ConsumerRoot;
  readonly line: number;
  readonly relativePath: string;
  readonly specifier: string;
}

export interface V1ConsumerImportBaseline {
  readonly imports: readonly V1ConsumerImportEntry[];
  readonly policy: "LANE-B-01";
  readonly recordedAt: string;
  readonly scanRoots: readonly string[];
  readonly totals: {
    readonly all: number;
    readonly developer: number;
    readonly erp: number;
    readonly storybook: number;
  };
}

const TEXT_EXTENSIONS = new Set([".ts", ".tsx"]);

const IGNORED_DIR_NAMES = new Set([
  ".git",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
]);

const V1_IMPORT_FROM_PATTERN =
  /(?:import|export)\s+(?:type\s+)?[\s\S]*?\sfrom\s+["'](@afenda\/shadcn-studio(?!-v2)(?:\/[^"']*)?)["']/gmu;

function lineNumberAtIndex(content: string, index: number): number {
  return content.slice(0, index).split(/\r?\n/u).length;
}

function statementAtIndex(content: string, index: number): string {
  const lineStart = content.lastIndexOf("\n", index) + 1;
  const nextNewline = content.indexOf("\n", index);
  const lineEnd = nextNewline === -1 ? content.length : nextNewline;
  return content.slice(lineStart, lineEnd);
}

function consumerKeyForRelativePath(relativePath: string): V1ConsumerRoot {
  const normalized = relativePath.replace(/\\/gu, "/");

  if (normalized.startsWith("apps/developer/src/")) {
    return "apps/developer/src";
  }

  if (normalized.startsWith("apps/erp/src/")) {
    return "apps/erp/src";
  }

  return "apps/storybook";
}

function classifyImport(
  relativePath: string,
  specifier: string,
  statement: string
): V1ImportCategory {
  if (specifier.includes("/theme")) {
    return "theme";
  }

  if (specifier.includes("/metadata")) {
    return "metadata";
  }

  if (specifier.includes("/lab")) {
    return "lab";
  }

  if (/\bimport\s+type\b/u.test(statement)) {
    return "type-only";
  }

  const normalized = relativePath.replace(/\\/gu, "/").toLowerCase();

  if (
    normalized.includes("/shell") ||
    normalized.includes("lab-shell") ||
    normalized.includes("/navigation/") ||
    normalized.includes("app-protected-shell") ||
    normalized.includes("nav-config")
  ) {
    return "shell";
  }

  if (normalized.includes("/metadata/") || normalized.includes("metadata-")) {
    return "metadata";
  }

  if (
    normalized.includes("datatable") ||
    normalized.includes("-table") ||
    normalized.includes("toolbar") ||
    normalized.includes("block") ||
    /Block["']?\s*[,}]|Datatable/u.test(statement)
  ) {
    return "block";
  }

  if (normalized.includes("/config/")) {
    return "config";
  }

  return "unknown";
}

async function collectFiles(root: string): Promise<string[]> {
  if (!existsSync(root)) {
    return [];
  }

  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIR_NAMES.has(entry.name)) {
        continue;
      }

      files.push(...(await collectFiles(absolutePath)));
      continue;
    }

    if (TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

export function importEntryKey(entry: V1ConsumerImportEntry): string {
  return `${entry.relativePath}::${entry.line}::${entry.specifier}`;
}

export function buildBaseline(
  imports: readonly V1ConsumerImportEntry[],
  recordedAt: string
): V1ConsumerImportBaseline {
  const totals = {
    all: imports.length,
    developer: imports.filter((entry) =>
      entry.relativePath.startsWith("apps/developer/src/")
    ).length,
    erp: imports.filter((entry) =>
      entry.relativePath.startsWith("apps/erp/src/")
    ).length,
    storybook: imports.filter((entry) =>
      entry.relativePath.startsWith("apps/storybook/")
    ).length,
  };

  return {
    policy: "LANE-B-01",
    recordedAt,
    scanRoots: [...V1_CONSUMER_SCAN_ROOTS],
    totals,
    imports: [...imports].sort((left, right) =>
      importEntryKey(left).localeCompare(importEntryKey(right))
    ),
  };
}

export async function scanV1ConsumerImports(
  repoRoot: string
): Promise<V1ConsumerImportEntry[]> {
  const imports: V1ConsumerImportEntry[] = [];

  for (const scanRoot of V1_CONSUMER_SCAN_ROOTS) {
    const absoluteRoot = path.join(repoRoot, scanRoot);
    const files = await collectFiles(absoluteRoot);

    for (const file of files) {
      const content = await readFile(file, "utf8");
      const relativePath = path.relative(repoRoot, file).replace(/\\/gu, "/");
      const consumer = consumerKeyForRelativePath(relativePath);

      V1_IMPORT_FROM_PATTERN.lastIndex = 0;
      for (
        let match = V1_IMPORT_FROM_PATTERN.exec(content);
        match !== null;
        match = V1_IMPORT_FROM_PATTERN.exec(content)
      ) {
        const specifier = match[1];

        if (!specifier) {
          continue;
        }

        const line = lineNumberAtIndex(content, match.index);
        const statement = statementAtIndex(content, match.index);

        imports.push({
          consumer,
          relativePath,
          line,
          specifier,
          category: classifyImport(relativePath, specifier, statement),
        });
      }
    }
  }

  return imports.sort((left, right) =>
    importEntryKey(left).localeCompare(importEntryKey(right))
  );
}

export interface BaselineComparison {
  readonly current: readonly V1ConsumerImportEntry[];
  readonly missingFromBaseline: readonly V1ConsumerImportEntry[];
  readonly newImports: readonly V1ConsumerImportEntry[];
  readonly ok: boolean;
}

export function compareImportsToBaseline(
  current: readonly V1ConsumerImportEntry[],
  baseline: readonly V1ConsumerImportEntry[]
): BaselineComparison {
  const baselineKeys = new Set(baseline.map((entry) => importEntryKey(entry)));
  const currentKeys = new Set(current.map((entry) => importEntryKey(entry)));

  const newImports = current.filter(
    (entry) => !baselineKeys.has(importEntryKey(entry))
  );
  const missingFromBaseline = baseline.filter(
    (entry) => !currentKeys.has(importEntryKey(entry))
  );

  return {
    current,
    newImports,
    missingFromBaseline,
    ok: newImports.length === 0 && missingFromBaseline.length === 0,
  };
}

export function resolveBaselinePath(packageRoot: string): string {
  return path.join(packageRoot, V1_CONSUMER_IMPORT_BASELINE_RELATIVE);
}

export async function writeBaseline(
  packageRoot: string,
  baseline: V1ConsumerImportBaseline
): Promise<void> {
  const baselinePath = resolveBaselinePath(packageRoot);
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(
    baselinePath,
    `${JSON.stringify(baseline, null, 2)}\n`,
    "utf8"
  );
}

export async function runV1ConsumerImportCli(
  packageRoot: string,
  argv: readonly string[]
): Promise<number> {
  const repoRoot = path.resolve(packageRoot, "..", "..");
  const writeMode = argv.includes("--write");
  const checkMode = argv.includes("--check");
  const imports = await scanV1ConsumerImports(repoRoot);
  const baseline = buildBaseline(
    imports,
    new Date().toISOString().slice(0, 10)
  );

  if (writeMode) {
    await writeBaseline(packageRoot, baseline);
    process.stderr.write(
      `Wrote ${baseline.totals.all} v1 consumer imports (${baseline.totals.developer} developer, ${baseline.totals.erp} erp, ${baseline.totals.storybook} storybook).\n`
    );
    return 0;
  }

  if (checkMode) {
    const baselinePath = resolveBaselinePath(packageRoot);
    const recorded = JSON.parse(
      await readFile(baselinePath, "utf8")
    ) as V1ConsumerImportBaseline;
    const comparison = compareImportsToBaseline(imports, recorded.imports);

    if (comparison.ok) {
      process.stderr.write(
        `v1 consumer import baseline OK (${imports.length} imports).\n`
      );
      return 0;
    }

    for (const entry of comparison.newImports) {
      process.stderr.write(
        `NEW v1 import: ${entry.relativePath}:${entry.line} ${entry.specifier}\n`
      );
    }

    for (const entry of comparison.missingFromBaseline) {
      process.stderr.write(
        `REMOVED v1 import (ratchet baseline in same PR): ${entry.relativePath}:${entry.line} ${entry.specifier}\n`
      );
    }

    return 1;
  }

  process.stdout.write(`${JSON.stringify(baseline, null, 2)}\n`);
  return 0;
}

const isDirectExecution =
  process.argv[1] !== undefined &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  const exitCode = await runV1ConsumerImportCli(process.cwd(), process.argv);
  process.exit(exitCode);
}
