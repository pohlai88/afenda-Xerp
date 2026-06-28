#!/usr/bin/env tsx
/**
 * PAS-004B §4.3 — B36: Acceptance graph query surface gate.
 *
 * Validates knowledge-graph.query.ts exports exactly four query helpers.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getKnowledgeAtomsByDomain,
  getKnowledgeEdgesFrom,
  getSupersessionChain,
  resolveAcceptanceGraphRoots,
} from "./shared/enterprise-knowledge-governance.imports.mts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const queryPath = join(
  repoRoot,
  "packages/enterprise-knowledge/src/query/knowledge-graph.query.ts"
);

const REQUIRED_EXPORTS = [
  "getKnowledgeAtomsByDomain",
  "getKnowledgeEdgesFrom",
  "getSupersessionChain",
  "resolveAcceptanceGraphRoots",
] as const;

const errors: string[] = [];
const source = readFileSync(queryPath, "utf8");

for (const exportName of REQUIRED_EXPORTS) {
  if (!source.includes(`export function ${exportName}`)) {
    errors.push(`missing export function ${exportName}`);
  }
}

const exportFunctionMatches = source.match(/^export function \w+/gm) ?? [];
if (exportFunctionMatches.length !== REQUIRED_EXPORTS.length) {
  errors.push(
    `expected exactly ${REQUIRED_EXPORTS.length} export functions, found ${exportFunctionMatches.length}`
  );
}

const identityAtoms = getKnowledgeAtomsByDomain("identity");
if (identityAtoms.length === 0) {
  errors.push("getKnowledgeAtomsByDomain(identity) returned no atoms");
}

const legalEntityEdges = getKnowledgeEdgesFrom("legal_entity");
if (legalEntityEdges.length === 0) {
  errors.push("getKnowledgeEdgesFrom(legal_entity) returned no edges");
}

const tenantChain = getSupersessionChain("tenant");
if (tenantChain.length === 0) {
  errors.push("getSupersessionChain(tenant) returned empty chain");
}

const roots = resolveAcceptanceGraphRoots();
if (roots.length === 0) {
  errors.push("resolveAcceptanceGraphRoots returned no atoms");
}

if (errors.length > 0) {
  console.error("knowledge-acceptance-graph: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("knowledge-acceptance-graph: PASS (4 query helpers)");
