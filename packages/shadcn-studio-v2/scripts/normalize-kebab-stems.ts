/**
 * Deterministic PascalCase/camelCase → kebab-case file stem normalizer for V2 src/.
 *
 * Rewrites import/export module paths only — never identifier names.
 *
 * Usage:
 *   pnpm --filter @afenda/shadcn-studio-v2 normalize:kebab-stems -- --check
 *   pnpm --filter @afenda/shadcn-studio-v2 normalize:kebab-stems -- --write
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");

const ROOT_BARREL_FILES = new Set([
  "clients.ts",
  "index.ts",
  "metadata.ts",
  "server.ts",
]);

/** Taxonomy widget lane — not plain camel→kebab. */
const STEM_OVERRIDES: Readonly<Record<string, string>> = {
  EvidenceWidget: "widget-evidence",
  MetricWidget: "widget-metric",
};

const KEBAB_STEM_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);
const SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".md",
  ".json",
  ".jsonc",
  ".mjs",
]);
const IGNORED_DIR_NAMES = new Set([
  "__tests__",
  "dist",
  "node_modules",
  ".git",
]);

interface RenamePlan {
  readonly fromAbsolute: string;
  readonly fromRelative: string;
  readonly toAbsolute: string;
  readonly toRelative: string;
}

function toPosix(relativePath: string): string {
  return relativePath.replaceAll("\\", "/");
}

function fileStem(fileName: string): string {
  return fileName.replace(/\.(tsx?)$/u, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function isKebabStem(stem: string): boolean {
  return KEBAB_STEM_PATTERN.test(stem);
}

function toKebabStem(stem: string): string {
  return stem
    .replace(/([a-z0-9])([A-Z])/gu, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/gu, "$1-$2")
    .toLowerCase();
}

function resolveKebabStem(stem: string): string {
  return STEM_OVERRIDES[stem] ?? toKebabStem(stem);
}

function collectSourceFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory)) {
    if (IGNORED_DIR_NAMES.has(entry)) {
      continue;
    }

    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    const extension = path.extname(entry);

    if (SOURCE_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function collectPackageTextFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory)) {
    if (
      IGNORED_DIR_NAMES.has(entry) ||
      entry === "dist" ||
      entry === "node_modules"
    ) {
      continue;
    }

    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectPackageTextFiles(fullPath));
      continue;
    }

    const extension = path.extname(entry);

    if (SCAN_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function buildRenamePlan(): RenamePlan[] {
  const plans: RenamePlan[] = [];
  const targetPaths = new Set<string>();

  for (const absolutePath of collectSourceFiles(SRC_ROOT)) {
    const fileName = path.basename(absolutePath);
    const relativePath = toPosix(path.relative(PACKAGE_ROOT, absolutePath));

    if (
      ROOT_BARREL_FILES.has(fileName) &&
      path.dirname(absolutePath) === SRC_ROOT
    ) {
      continue;
    }

    const stem = fileStem(fileName);

    if (isKebabStem(stem)) {
      continue;
    }

    const kebabStem = resolveKebabStem(stem);
    const extension = path.extname(fileName);
    const targetAbsolute = path.join(
      path.dirname(absolutePath),
      `${kebabStem}${extension}`
    );
    const targetRelative = toPosix(path.relative(PACKAGE_ROOT, targetAbsolute));

    if (existsSync(targetAbsolute) && targetAbsolute !== absolutePath) {
      const caseOnlyRename =
        targetAbsolute.toLowerCase() === absolutePath.toLowerCase();

      if (!caseOnlyRename) {
        throw new Error(
          `Refusing to overwrite existing file for rename: ${relativePath} -> ${targetRelative}`
        );
      }
    }

    if (targetPaths.has(targetRelative)) {
      throw new Error(`Duplicate kebab target: ${targetRelative}`);
    }

    targetPaths.add(targetRelative);

    if (targetAbsolute === absolutePath) {
      continue;
    }

    plans.push({
      fromAbsolute: absolutePath,
      fromRelative: relativePath,
      toAbsolute: targetAbsolute,
      toRelative: targetRelative,
    });
  }

  return plans.sort(
    (left, right) => right.fromRelative.length - left.fromRelative.length
  );
}

function renameFile(fromAbsolute: string, toAbsolute: string): void {
  if (
    fromAbsolute.toLowerCase() === toAbsolute.toLowerCase() &&
    fromAbsolute !== toAbsolute
  ) {
    const tempAbsolute = `${toAbsolute}.tmp-kebab-rename`;
    renameSync(fromAbsolute, tempAbsolute);
    renameSync(tempAbsolute, toAbsolute);
    return;
  }

  renameSync(fromAbsolute, toAbsolute);
}

function rewriteModulePaths(
  content: string,
  plans: readonly RenamePlan[]
): string {
  let next = content;

  for (const plan of plans) {
    const fromRel = plan.fromRelative.replace(/^src\//u, "");
    const toRel = plan.toRelative.replace(/^src\//u, "");
    const fromStem = fileStem(path.basename(plan.fromRelative));
    const toStem = fileStem(path.basename(plan.toRelative));

    next = next.split(fromRel).join(toRel);
    next = next.split(`src/${fromRel}`).join(`src/${toRel}`);
    next = next.replaceAll(`./${fromStem}"`, `./${toStem}"`);
    next = next.replaceAll(`./${fromStem}'`, `./${toStem}'`);

    const modulePattern = new RegExp(
      `(\\bfrom\\s+|export\\s+[^\\n;]*\\bfrom\\s+)(['"])(?:((?:\\.\\.\\/|\\.\\/)[^'"]*\\/)?)${escapeRegExp(fromStem)}\\2`,
      "gu"
    );

    next = next.replace(
      modulePattern,
      (_match, prefix: string, quote: string, dir = "") =>
        `${prefix}${quote}${dir}${toStem}${quote}`
    );
  }

  return next;
}

function applyImportRewrites(
  plans: readonly RenamePlan[],
  write: boolean
): number {
  const scanRoots = [
    PACKAGE_ROOT,
    path.resolve(PACKAGE_ROOT, "../../scripts/studio"),
    path.resolve(PACKAGE_ROOT, "../../apps/developer"),
  ];
  let touchedFiles = 0;

  for (const scanRoot of scanRoots) {
    if (!existsSync(scanRoot)) {
      continue;
    }

    for (const filePath of collectPackageTextFiles(scanRoot)) {
      if (
        filePath.includes(
          `${path.sep}scripts${path.sep}normalize-kebab-stems.ts`
        )
      ) {
        continue;
      }

      const original = readFileSync(filePath, "utf8");
      const next = rewriteModulePaths(original, plans);

      if (next !== original) {
        touchedFiles += 1;

        if (write) {
          writeFileSync(filePath, next, "utf8");
        }
      }
    }
  }

  return touchedFiles;
}

function resolveMode(): "check" | "write" | null {
  if (process.argv.includes("--write")) {
    return "write";
  }

  if (process.argv.includes("--check")) {
    return "check";
  }

  return null;
}

function main(): void {
  const mode = resolveMode();

  if (mode == null) {
    console.error(
      "Usage: tsx scripts/normalize-kebab-stems.ts --check|--write"
    );
    process.exitCode = 1;
    return;
  }

  const plans = buildRenamePlan();

  if (plans.length === 0) {
    console.log("Kebab stem normalization: nothing to rename.");
    return;
  }

  console.log(`Kebab stem normalization (${mode}): ${plans.length} file(s)`);

  for (const plan of plans) {
    console.log(`  ${plan.fromRelative} -> ${plan.toRelative}`);
  }

  const touched = applyImportRewrites(plans, mode === "write");
  console.log(
    `Import path references ${mode === "write" ? "updated" : "would update"}: ${touched}`
  );

  if (mode === "check") {
    process.exitCode = 1;
    console.error("Run with --write to apply renames.");
    return;
  }

  for (const plan of plans) {
    renameFile(plan.fromAbsolute, plan.toAbsolute);
  }

  console.log("Kebab stem normalization complete.");
}

main();
