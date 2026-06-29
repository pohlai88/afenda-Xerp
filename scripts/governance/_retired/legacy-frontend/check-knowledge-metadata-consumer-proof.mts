#!/usr/bin/env tsx
/**
 * RETIRED (ADR-0027) — PAS-004B §4.2 B34 metadata consumer import proof.
 *
 * Pre-reset gate targeted `@afenda/ui-composition`. ERP metadata consumer proof
 * is now `pnpm check:erp-metadata-pas006-consumer` (PAS-001A R1c / IS-003).
 *
 * Do not re-register in root package.json without a new ADR.
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const metadataKnowledgeDir = join(
  repoRoot,
  "packages/ui-composition/src/knowledge"
);
const metadataPackageJson = join(
  repoRoot,
  "packages/ui-composition/package.json"
);
const enterpriseKnowledgeSrc = join(
  repoRoot,
  "packages/enterprise-knowledge/src"
);

const REQUIRED_PLATFORM_IDENTITY_ATOMS = [
  "tenant",
  "legal_entity",
  "organization_unit",
] as const;

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

const packageJson = JSON.parse(readFileSync(metadataPackageJson, "utf8")) as {
  dependencies?: Record<string, string>;
};

if (!packageJson.dependencies?.["@afenda/enterprise-knowledge"]) {
  errors.push(
    "packages/ui-composition/package.json must declare @afenda/enterprise-knowledge dependency"
  );
}

let hasEnterpriseKnowledgeImport = false;
let hasProjectKnowledgeAtomUsage = false;
let resolvesRequiredAtoms = 0;

for (const filePath of collectTsFiles(metadataKnowledgeDir)) {
  const content = readFileSync(filePath, "utf8");
  if (content.includes("@afenda/enterprise-knowledge")) {
    hasEnterpriseKnowledgeImport = true;
  }
  if (content.includes("projectKnowledgeAtom")) {
    hasProjectKnowledgeAtomUsage = true;
  }
  for (const atomId of REQUIRED_PLATFORM_IDENTITY_ATOMS) {
    if (content.includes(`"${atomId}"`) || content.includes(`'${atomId}'`)) {
      resolvesRequiredAtoms += 1;
    }
  }
}

if (!hasEnterpriseKnowledgeImport) {
  errors.push(
    "packages/ui-composition/src/knowledge/** must import @afenda/enterprise-knowledge"
  );
}

if (!hasProjectKnowledgeAtomUsage) {
  errors.push(
    "metadata consumer must call projectKnowledgeAtom (PAS-004C B47)"
  );
}

if (resolvesRequiredAtoms < REQUIRED_PLATFORM_IDENTITY_ATOMS.length) {
  errors.push(
    "metadata consumer must reference tenant, legal_entity, and organization_unit atom ids"
  );
}

const testDir = join(metadataKnowledgeDir, "../__tests__");
const hasConsumerTest = readdirSync(testDir, { withFileTypes: true }).some(
  (entry) =>
    entry.isFile() &&
    entry.name.includes("platform-identity-vocabulary") &&
    entry.name.endsWith(".test.ts")
);

if (!hasConsumerTest) {
  errors.push(
    "packages/ui-composition must include platform-identity-vocabulary consumer test"
  );
}

for (const filePath of collectTsFiles(enterpriseKnowledgeSrc)) {
  const content = readFileSync(filePath, "utf8");
  if (
    content.includes('from "@afenda/ui-composition"') ||
    content.includes("from '@afenda/ui-composition'")
  ) {
    errors.push(
      `enterprise-knowledge must not import metadata: ${filePath.replace(repoRoot, "")}`
    );
  }
}

if (errors.length > 0) {
  console.error("knowledge-metadata-consumer-proof: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("knowledge-metadata-consumer-proof: PASS");
