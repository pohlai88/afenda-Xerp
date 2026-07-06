#!/usr/bin/env node
/**
 * Normalize @afenda/shadcn-studio-v2 biome suppressions.
 *
 * Usage:
 *   node scripts/studio/normalize-shadcn-studio-v2-biome-suppressions.mjs [--check|--write]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { relative } from "node:path";
import { REPO_ROOT } from "./quarantine-paths.mjs";
import {
  findRedundantV2BiomeSuppressions,
  normalizeV2BiomeSuppressions,
  walkV2SourceFiles,
} from "./shadcn-studio-v2-biome-suppression-policy.mjs";

const args = process.argv.slice(2);
const writeMode = args.includes("--write");
const checkMode = args.includes("--check") || !writeMode;

if (args.some((arg) => arg !== "--check" && arg !== "--write")) {
  process.stderr.write(
    "Usage: node scripts/studio/normalize-shadcn-studio-v2-biome-suppressions.mjs [--check|--write]\n"
  );
  process.exit(1);
}

function main() {
  if (checkMode && !writeMode) {
    const violations = findRedundantV2BiomeSuppressions();

    if (violations.length === 0) {
      process.stdout.write(
        "studio:v2:normalize-biome: no redundant suppressions found.\n"
      );
      return;
    }

    process.stdout.write(
      `studio:v2:normalize-biome: would update ${violations.length} file(s):\n`
    );

    for (const violation of violations) {
      process.stdout.write(`  - ${violation.file}\n`);
    }

    process.stderr.write(
      "\nRe-run with --write to apply (biome.project.jsonc owns these rules).\n"
    );
    process.exit(1);
  }

  const changed = [];

  for (const filePath of walkV2SourceFiles()) {
    const original = readFileSync(filePath, "utf8");
    const normalized = normalizeV2BiomeSuppressions(original);

    if (normalized === original) {
      continue;
    }

    const relPath = relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    changed.push(relPath);
    writeFileSync(filePath, normalized, "utf8");
  }

  if (changed.length === 0) {
    process.stdout.write(
      "studio:v2:normalize-biome: no redundant suppressions found.\n"
    );
    return;
  }

  process.stdout.write(
    `studio:v2:normalize-biome: updated ${changed.length} file(s):\n`
  );

  for (const file of changed) {
    process.stdout.write(`  - ${file}\n`);
  }
}

main();
