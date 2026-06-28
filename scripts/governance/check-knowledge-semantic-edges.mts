#!/usr/bin/env tsx
/**
 * PAS-004C §4.7 — B42: semantic edge vocabulary governance gate.
 *
 * Validates:
 * 1. SEMANTIC_EDGE_TYPES defines all 8 PAS-004C §4.7 edge types.
 * 2. edges.json includes ≥2 semantic edges with valid term/concept endpoints.
 * 3. ≥1 equivalent edge links B38 terms to concepts.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  KNOWLEDGE_EDGE_TYPES,
  SEMANTIC_EDGE_TYPES,
} from "../../packages/enterprise-knowledge/src/contracts/knowledge-edge.contract.ts";
import {
  validateEdgeCorpus,
  validateSemanticEdgeCorpus,
} from "../../packages/enterprise-knowledge/src/data/knowledge-data.schema.ts";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import {
  ENTERPRISE_KNOWLEDGE_CONCEPTS,
  ENTERPRISE_KNOWLEDGE_TERMS,
} from "../../packages/enterprise-knowledge/src/policy/knowledge-concept-vocabulary.policy.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dataDir = join(repoRoot, "packages/enterprise-knowledge/src/data");

const REQUIRED_SEMANTIC_EDGE_TYPES = [
  "specializes",
  "generalizes",
  "equivalent",
  "implements",
  "realizes",
  "constrains",
  "depends_on",
  "references",
] as const;

const errors: string[] = [];

for (const required of REQUIRED_SEMANTIC_EDGE_TYPES) {
  if (!(SEMANTIC_EDGE_TYPES as readonly string[]).includes(required)) {
    errors.push(`SEMANTIC_EDGE_TYPES missing "${required}"`);
  }
  if (!(KNOWLEDGE_EDGE_TYPES as readonly string[]).includes(required)) {
    errors.push(`KNOWLEDGE_EDGE_TYPES missing "${required}"`);
  }
}

let edgesRaw: unknown[] = [];
try {
  const text = readFileSync(join(dataDir, "edges.json"), "utf8");
  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    errors.push("edges.json: root must be a JSON array");
  } else {
    edgesRaw = parsed;
  }
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  errors.push(`edges.json: invalid JSON — ${message}`);
}

const atomIds = new Set(
  ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) => atom.atomId)
);
const atomConceptById = new Map(
  ENTERPRISE_KNOWLEDGE_ATOMS.flatMap((atom) =>
    atom.conceptId ? [[atom.atomId, atom.conceptId] as const] : []
  )
);
const conceptIds = new Set(
  ENTERPRISE_KNOWLEDGE_CONCEPTS.map((concept) => concept.conceptId)
);
const termConceptById = new Map(
  ENTERPRISE_KNOWLEDGE_TERMS.map(
    (term) => [term.termId, term.conceptId] as const
  )
);

for (const error of validateEdgeCorpus(edgesRaw, atomIds)) {
  errors.push(`edges.json schema: ${error.path} — ${error.message}`);
}

for (const error of validateSemanticEdgeCorpus(edgesRaw, {
  atomConceptById,
  conceptIds,
  termConceptById,
})) {
  errors.push(`edges.json semantic: ${error.path} — ${error.message}`);
}

if (errors.length > 0) {
  console.error("check:knowledge-semantic-edges: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

const semanticCount = edgesRaw.filter(
  (edge) =>
    typeof edge === "object" &&
    edge !== null &&
    (SEMANTIC_EDGE_TYPES as readonly string[]).includes(
      String((edge as Record<string, unknown>).type)
    )
).length;

console.log(
  `check:knowledge-semantic-edges: PASS — ${SEMANTIC_EDGE_TYPES.length} semantic edge types, ${semanticCount} semantic edges in corpus`
);
