#!/usr/bin/env tsx
/**
 * PAS-001 §5 — kernel prohibited ownership registry gate.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS,
  listKernelProhibitedOwnershipConcerns,
} from "../../packages/kernel/src/governance/kernel-prohibited-ownership.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const pasPath = join(repoRoot, "docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md");
const kernelSrcRoot = join(repoRoot, "packages/kernel/src");

const FORBIDDEN_KERNEL_IMPORT_PATTERNS = [
  /from\s+["']drizzle-orm["']/,
  /from\s+["']@afenda\/database["']/,
  /from\s+["']react["']/,
  /from\s+["']react-dom["']/,
  /from\s+["']next\//,
] as const;

function extractPasSection5Labels(source: string): string[] {
  const sectionStart = source.indexOf("# 5. What Kernel Must Never Own");
  const sectionEnd = source.indexOf("# 6. Package Structure Standard");

  if (sectionStart === -1 || sectionEnd === -1 || sectionEnd <= sectionStart) {
    throw new Error("Could not locate PAS §5 boundaries in PAS-001.");
  }

  const section = source.slice(sectionStart, sectionEnd);
  const labels: string[] = [];

  for (const line of section.split("\n")) {
    const match = /^\*\s+(.+)\s*$/.exec(line.trim());
    if (match?.[1]) {
      labels.push(match[1]);
    }
  }

  return labels;
}

function collectSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") {
        continue;
      }
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (entry.endsWith(".ts") && !entry.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

const pasLabels = extractPasSection5Labels(readFileSync(pasPath, "utf8"));
const registryLabels = listKernelProhibitedOwnershipConcerns().map(
  (concern) => concern.label
);

if (pasLabels.length !== KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS.length) {
  console.error(
    "Kernel prohibited ownership gate failed: registry/PAS count mismatch."
  );
  console.error(`  PAS §5 labels: ${pasLabels.length}`);
  console.error(
    `  Registry ids: ${KERNEL_PROHIBITED_OWNERSHIP_CONCERN_IDS.length}`
  );
  process.exit(1);
}

for (let index = 0; index < pasLabels.length; index += 1) {
  const pasLabel = pasLabels[index];
  const registryLabel = registryLabels[index];

  if (pasLabel !== registryLabel) {
    console.error("Kernel prohibited ownership gate failed: label drift.");
    console.error(
      `  index ${index}: PAS="${pasLabel}" registry="${registryLabel}"`
    );
    process.exit(1);
  }
}

const forbiddenImportViolations: string[] = [];

for (const filePath of collectSourceFiles(kernelSrcRoot)) {
  const source = readFileSync(filePath, "utf8");

  for (const pattern of FORBIDDEN_KERNEL_IMPORT_PATTERNS) {
    if (pattern.test(source)) {
      forbiddenImportViolations.push(
        `${filePath.replace(/\\/g, "/")} matches ${pattern.source}`
      );
    }
  }
}

if (forbiddenImportViolations.length > 0) {
  console.error(
    "Kernel prohibited ownership gate failed: forbidden imports in kernel src."
  );
  for (const violation of forbiddenImportViolations) {
    console.error(`  ${violation}`);
  }
  process.exit(1);
}

console.log("Kernel prohibited ownership gate passed (PAS-001 §5).");
