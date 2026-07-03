#!/usr/bin/env tsx
/**
 * PAS-004E — code vocabulary coverage gate (module maps + governed surfaces).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatVocabularyCoverageViolations,
  hasVocabularyCoverageErrors,
  validateModuleKnowledgeTerms,
  validateSurfaceStrings,
} from "../../packages/enterprise-knowledge/src/vocabulary/knowledge-vocabulary-coverage.ts";
import type { VocabularyAllowlist } from "../../packages/enterprise-knowledge/src/vocabulary/knowledge-vocabulary-export.ts";
import { buildReferenceRegistryBundle } from "./erp-module-foundation-registry.mts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const GATE = "check:code-vocabulary-coverage" as const;

const SCAN_ROOTS = [
  "apps/erp/src",
  "packages/features",
  "packages/shadcn-studio/src/components",
] as const;

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  ".next",
  "coverage",
  "__tests__",
]);

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

function loadAllowlist(): VocabularyAllowlist {
  const path = join(
    repoRoot,
    "packages/enterprise-knowledge/dist/vocabulary.allowlist.json"
  );
  if (!existsSync(path)) {
    console.error(
      `${GATE}: missing ${path} — run pnpm export:knowledge-vocabulary first`
    );
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, "utf8")) as VocabularyAllowlist;
}

function collectSourceFiles(directory: string, files: string[] = []): string[] {
  if (!existsSync(directory)) {
    return files;
  }

  for (const name of readdirSync(directory)) {
    const absolute = join(directory, name);
    if (statSync(absolute).isDirectory()) {
      if (SKIP_DIRS.has(name)) {
        continue;
      }
      collectSourceFiles(absolute, files);
      continue;
    }

    if (/\.(tsx?|jsx?)$/.test(name)) {
      files.push(absolute);
    }
  }

  return files;
}

function main(): void {
  const allowlist = loadAllowlist();
  const registryBundle = buildReferenceRegistryBundle();
  const violations = registryBundle.bundles.flatMap((bundle) =>
    validateModuleKnowledgeTerms(allowlist, {
      module: bundle.knowledge.module,
      terms: bundle.knowledge.terms,
    })
  );

  for (const root of SCAN_ROOTS) {
    const absoluteRoot = join(repoRoot, root);
    for (const file of collectSourceFiles(absoluteRoot)) {
      const relativePath = normalizePath(relative(repoRoot, file));
      const source = readFileSync(file, "utf8");
      violations.push(
        ...validateSurfaceStrings(allowlist, relativePath, source)
      );
    }
  }

  console.log(formatVocabularyCoverageViolations(violations));
  console.log(`allowlist fingerprint: ${allowlist.fingerprint}`);

  if (hasVocabularyCoverageErrors(violations)) {
    process.exit(1);
  }
}

main();
