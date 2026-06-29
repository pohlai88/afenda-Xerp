#!/usr/bin/env tsx
/**
 * PAS-004D B50 — legacy surface retirement gate.
 *
 * Validates:
 * 1. knowledge-relationships.registry.ts removed (adapter inlined in knowledge.policy.ts).
 * 2. Parsed public atoms omit implementationMapping (JSON corpus may retain it).
 * 3. Deprecated KNOWLEDGE_RELATIONSHIPS adapter still derives from KNOWLEDGE_EDGES.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ENTERPRISE_KNOWLEDGE_ATOMS,
  getKnowledgeRelationshipsForAtom,
  KNOWLEDGE_EDGES,
  KNOWLEDGE_RELATIONSHIPS,
} from "../../packages/enterprise-knowledge/src/index.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const pkgSrcRoot = join(
  repoRoot,
  "packages/enterprise-knowledge/src"
);
const deprecatedRegistryPath = join(
  pkgSrcRoot,
  "data/knowledge-relationships.registry.ts"
);
const atomsJsonPath = join(pkgSrcRoot, "data/atoms.json");

export const KNOWLEDGE_LEGACY_SURFACE_RETIREMENT_RULE =
  "knowledge-legacy-surface-retirement-strips-implementationMapping-at-loader-boundary";

export interface KnowledgeLegacySurfaceRetirementViolation {
  readonly message: string;
  readonly rule: string;
}

function collectSrcFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSrcFiles(absolutePath));
      continue;
    }
    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      files.push(absolutePath);
    }
  }

  return files;
}

export function checkKnowledgeLegacySurfaceRetirement(): KnowledgeLegacySurfaceRetirementViolation[] {
  const violations: KnowledgeLegacySurfaceRetirementViolation[] = [];

  if (existsSync(deprecatedRegistryPath)) {
    violations.push({
      rule: "deprecated-registry-removed",
      message:
        "knowledge-relationships.registry.ts must be removed — adapter lives in knowledge.policy.ts",
    });
  }

  for (const file of collectSrcFiles(pkgSrcRoot)) {
    const source = readFileSync(file, "utf8");
    if (source.includes("knowledge-relationships.registry")) {
      violations.push({
        rule: "no-deprecated-registry-imports",
        message: `${file.replace(/\\/g, "/")} must not import knowledge-relationships.registry`,
      });
    }
  }

  for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
    if (atom.implementationMapping !== undefined) {
      violations.push({
        rule: "parsed-atoms-omit-implementationMapping",
        message: `${atom.atomId}: public loader must strip implementationMapping (use realizationMapping)`,
      });
    }
  }

  const atomsJsonRaw = readFileSync(atomsJsonPath, "utf8");
  const atomsJson = JSON.parse(atomsJsonRaw) as unknown;
  if (!Array.isArray(atomsJson)) {
    violations.push({
      rule: "atoms-json-retains-legacy-field",
      message: "atoms.json must remain a JSON array",
    });
  } else {
    const legacyCount = atomsJson.filter(
      (entry) =>
        typeof entry === "object" &&
        entry !== null &&
        "implementationMapping" in entry
    ).length;
    if (legacyCount === 0) {
      violations.push({
        rule: "atoms-json-retains-legacy-field",
        message:
          "atoms.json must retain implementationMapping for one release (migration note in PAS-004D §4.2)",
      });
    }
  }

  if (KNOWLEDGE_RELATIONSHIPS.length === 0) {
    violations.push({
      rule: "relationship-adapter-derived",
      message:
        "KNOWLEDGE_RELATIONSHIPS must derive non-empty legacy rows from KNOWLEDGE_EDGES",
    });
  }

  if (KNOWLEDGE_RELATIONSHIPS.length >= KNOWLEDGE_EDGES.length) {
    violations.push({
      rule: "relationship-adapter-derived",
      message:
        "KNOWLEDGE_RELATIONSHIPS must be a strict subset adapter (legacy relationship types only)",
    });
  }

  const legalEntityRelationships =
    getKnowledgeRelationshipsForAtom("legal_entity");
  if (legalEntityRelationships.length === 0) {
    violations.push({
      rule: "relationship-query-adapter",
      message:
        "getKnowledgeRelationshipsForAtom('legal_entity') must return legacy relationship rows",
    });
  }

  return violations;
}

export function formatKnowledgeLegacySurfaceRetirementViolations(
  violations: readonly KnowledgeLegacySurfaceRetirementViolation[]
): string {
  if (violations.length === 0) {
    return "knowledge-legacy-surface-retirement: PASS";
  }

  const lines = ["knowledge-legacy-surface-retirement: FAIL"];
  for (const violation of violations) {
    lines.push(`  - [${violation.rule}] ${violation.message}`);
  }
  return lines.join("\n");
}

function main(): void {
  const violations = checkKnowledgeLegacySurfaceRetirement();

  if (violations.length > 0) {
    console.error(formatKnowledgeLegacySurfaceRetirementViolations(violations));
    console.error(`surface-rule: ${KNOWLEDGE_LEGACY_SURFACE_RETIREMENT_RULE}`);
    process.exit(1);
  }

  console.log(formatKnowledgeLegacySurfaceRetirementViolations(violations));
  console.log(`surface-rule: ${KNOWLEDGE_LEGACY_SURFACE_RETIREMENT_RULE}`);
}

main();
