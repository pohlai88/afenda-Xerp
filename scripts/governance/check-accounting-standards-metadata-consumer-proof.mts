#!/usr/bin/env tsx
/**
 * PAS-003 consumer proof — ui-composition resolves validation vocabulary from accounting-standards.
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const consumerDir = join(
  repoRoot,
  "packages/ui-composition/src/accounting-standards"
);
const packageJsonPath = join(repoRoot, "packages/ui-composition/package.json");

const REQUIRED_STATUS_KEYS = ["pass", "warning", "blocked", "info"] as const;

const errors: string[] = [];

function collectTsFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(fullPath));
      continue;
    }
    if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
  dependencies?: Record<string, string>;
};

if (!packageJson.dependencies?.["@afenda/accounting-standards"]) {
  errors.push(
    "packages/ui-composition/package.json must declare @afenda/accounting-standards dependency"
  );
}

let hasImport = false;
let hasStatusResolver = false;
let resolvesRequiredStatuses = 0;

for (const filePath of collectTsFiles(consumerDir)) {
  const content = readFileSync(filePath, "utf8");
  if (content.includes("@afenda/accounting-standards")) {
    hasImport = true;
  }
  if (content.includes("resolveAccountingStandardValidationStatusLabel")) {
    hasStatusResolver = true;
  }
  for (const status of REQUIRED_STATUS_KEYS) {
    if (content.includes(`"${status}"`)) {
      resolvesRequiredStatuses += 1;
    }
  }
}

if (!hasImport) {
  errors.push(
    "packages/ui-composition/src/accounting-standards must import @afenda/accounting-standards"
  );
}

if (!hasStatusResolver) {
  errors.push(
    "packages/ui-composition must expose resolveAccountingStandardValidationStatusLabel"
  );
}

if (resolvesRequiredStatuses < REQUIRED_STATUS_KEYS.length) {
  errors.push(
    "validation status vocabulary must cover pass, info, warning, and blocked"
  );
}

if (errors.length > 0) {
  console.error("accounting-standards-metadata-consumer-proof: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("accounting-standards-metadata-consumer-proof: PASS");
