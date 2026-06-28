#!/usr/bin/env tsx
/**
 * PAS-004A B27 — consumer import proof gate.
 *
 * Requires at least one production import of @afenda/enterprise-knowledge with
 * getKnowledgeAtom (or getEnterpriseKnowledgePreferredWording wrapper) in apps/erp.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const erpKnowledgeDir = join(repoRoot, "apps/erp/src/lib/knowledge");
const erpPackageJson = join(repoRoot, "apps/erp/package.json");

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

const packageJson = JSON.parse(readFileSync(erpPackageJson, "utf8")) as {
  dependencies?: Record<string, string>;
};
if (!packageJson.dependencies?.["@afenda/enterprise-knowledge"]) {
  errors.push(
    "apps/erp/package.json must declare @afenda/enterprise-knowledge dependency"
  );
}

let hasEnterpriseKnowledgeImport = false;
let hasGetKnowledgeAtomUsage = false;

for (const filePath of collectTsFiles(erpKnowledgeDir)) {
  const content = readFileSync(filePath, "utf8");
  if (content.includes("@afenda/enterprise-knowledge")) {
    hasEnterpriseKnowledgeImport = true;
  }
  if (
    content.includes("getKnowledgeAtom") ||
    content.includes("getEnterpriseKnowledgePreferredWording")
  ) {
    hasGetKnowledgeAtomUsage = true;
  }
}

if (!hasEnterpriseKnowledgeImport) {
  errors.push(
    "apps/erp/src/lib/knowledge/** must import @afenda/enterprise-knowledge"
  );
}

if (!hasGetKnowledgeAtomUsage) {
  errors.push(
    "apps/erp consumer must call getKnowledgeAtom or getEnterpriseKnowledgePreferredWording"
  );
}

const testDir = join(erpKnowledgeDir, "__tests__");
const hasConsumerTest = readdirSync(testDir, { withFileTypes: true }).some(
  (entry) =>
    entry.isFile() &&
    entry.name.includes("enterprise-knowledge") &&
    entry.name.endsWith(".test.ts")
);
if (!hasConsumerTest) {
  errors.push("apps/erp must include enterprise-knowledge consumer test");
}

if (errors.length > 0) {
  console.error("knowledge-consumer-proof: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("knowledge-consumer-proof: PASS");
