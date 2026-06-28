#!/usr/bin/env tsx
/**
 * PAS-004C §4.1 — B38: concept + vocabulary governance gate.
 *
 * Validates:
 * 1. concepts.json and terms.json are valid JSON.
 * 2. Structural schema validation passes.
 * 3. Every atom carries conceptId resolving to concepts.json (24/24).
 * 4. Platform identity concepts present with preferred terms.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  validateAtomCorpusWithConcepts,
  validateConceptCorpus,
  validateTermCorpus,
} from "../../packages/enterprise-knowledge/src/data/knowledge-data.schema.ts";
import {
  PLATFORM_IDENTITY_CONCEPT_IDS,
  validateKnowledgeConceptVocabulary,
} from "../../packages/enterprise-knowledge/src/policy/knowledge-concept-vocabulary.policy.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dataDir = join(repoRoot, "packages/enterprise-knowledge/src/data");

const errors: string[] = [];

function readJsonArray(fileName: string): unknown[] {
  try {
    const text = readFileSync(join(dataDir, fileName), "utf8");
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      errors.push(`${fileName}: root must be a JSON array`);
      return [];
    }
    return parsed;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    errors.push(`${fileName}: invalid JSON — ${message}`);
    return [];
  }
}

const conceptsRaw = readJsonArray("concepts.json");
const conceptErrors = validateConceptCorpus(conceptsRaw);
for (const e of conceptErrors) {
  errors.push(`concepts.json schema: ${e.path} — ${e.message}`);
}

const conceptIds = new Set(
  conceptsRaw
    .filter(
      (r): r is { conceptId: string } =>
        typeof (r as Record<string, unknown>).conceptId === "string"
    )
    .map((r) => r.conceptId)
);

const termsRaw = readJsonArray("terms.json");
const termErrors = validateTermCorpus(termsRaw, conceptIds);
for (const e of termErrors) {
  errors.push(`terms.json schema: ${e.path} — ${e.message}`);
}

const atomsRaw = readJsonArray("atoms.json");
const atomErrors = validateAtomCorpusWithConcepts(atomsRaw, conceptIds);
for (const e of atomErrors) {
  errors.push(`atoms.json schema: ${e.path} — ${e.message}`);
}

for (const id of PLATFORM_IDENTITY_CONCEPT_IDS) {
  if (!conceptIds.has(id)) {
    errors.push(`concepts.json: platform identity concept "${id}" is missing`);
  }
}

const policyErrors = validateKnowledgeConceptVocabulary();
for (const e of policyErrors) {
  errors.push(`policy: ${e}`);
}

if (errors.length > 0) {
  console.error("check:knowledge-concept-vocabulary: FAIL");
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log(
  `check:knowledge-concept-vocabulary: PASS — ${conceptsRaw.length} concepts, ${termsRaw.length} terms, ${atomsRaw.length} atoms with conceptId`
);
