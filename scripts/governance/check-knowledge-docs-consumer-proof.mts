#!/usr/bin/env tsx
/**
 * PAS-004B §4.2 — B35: Docs consumer import proof gate.
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const docsKnowledgeDir = join(repoRoot, "apps/docs/src/lib/knowledge");
const docsPackageJson = join(repoRoot, "apps/docs/package.json");
const docsContentDir = join(
  repoRoot,
  "apps/docs/content/docs/en/configure-tenant"
);
const enterpriseKnowledgeSrc = join(
  repoRoot,
  "packages/enterprise-knowledge/src"
);

const REQUIRED_ATOM_IDS = ["tenant", "legal_entity", "organization_unit"] as const;

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

function collectMdxFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMdxFiles(fullPath));
      continue;
    }
    if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

const packageJson = JSON.parse(readFileSync(docsPackageJson, "utf8")) as {
  dependencies?: Record<string, string>;
};

if (!packageJson.dependencies?.["@afenda/enterprise-knowledge"]) {
  errors.push(
    "apps/docs/package.json must declare @afenda/enterprise-knowledge dependency"
  );
}

let hasEnterpriseKnowledgeImport = false;
let hasGetKnowledgeAtomUsage = false;

for (const filePath of collectTsFiles(docsKnowledgeDir)) {
  const content = readFileSync(filePath, "utf8");
  if (content.includes("@afenda/enterprise-knowledge")) {
    hasEnterpriseKnowledgeImport = true;
  }
  if (content.includes("getKnowledgeAtom")) {
    hasGetKnowledgeAtomUsage = true;
  }
}

if (!hasEnterpriseKnowledgeImport) {
  errors.push(
    "apps/docs/src/lib/knowledge/** must import @afenda/enterprise-knowledge"
  );
}

if (!hasGetKnowledgeAtomUsage) {
  errors.push("docs vocabulary helper must call getKnowledgeAtom");
}

const testPath = join(
  repoRoot,
  "apps/docs/src/__tests__/docs-vocabulary.test.ts"
);
if (!readFileSync(testPath, "utf8").includes("docs-vocabulary")) {
  errors.push("apps/docs must include docs-vocabulary consumer test");
}

let mdxAtomCitations = 0;
for (const filePath of collectMdxFiles(docsContentDir)) {
  const content = readFileSync(filePath, "utf8");
  for (const atomId of REQUIRED_ATOM_IDS) {
    if (content.includes(`"${atomId}"`) || content.includes(`\`${atomId}\``)) {
      mdxAtomCitations += 1;
    }
  }
}

if (mdxAtomCitations < REQUIRED_ATOM_IDS.length) {
  errors.push(
    "configure-tenant MDX must cite tenant, legal_entity, and organization_unit atom ids"
  );
}

for (const filePath of collectTsFiles(enterpriseKnowledgeSrc)) {
  const content = readFileSync(filePath, "utf8");
  if (
    content.includes('from "apps/docs"') ||
    content.includes("from 'apps/docs'") ||
    content.includes("@afenda/docs")
  ) {
    errors.push(
      `enterprise-knowledge must not import apps/docs: ${filePath.replace(repoRoot, "")}`
    );
  }
}

if (errors.length > 0) {
  console.error("knowledge-docs-consumer-proof: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("knowledge-docs-consumer-proof: PASS");
