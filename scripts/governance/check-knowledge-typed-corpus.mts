#!/usr/bin/env tsx
/**
 * PAS-004A B29 — typed corpus gate.
 *
 * Validates atoms.json uses typedEvidence + structuredReasoning (no legacy fields).
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { validateAtomCorpus } from "../../packages/enterprise-knowledge/src/data/knowledge-data.schema.ts";
import { KNOWLEDGE_ATOM_IDS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const atomsPath = join(
  repoRoot,
  "packages/enterprise-knowledge/src/data/atoms.json"
);
const errors: string[] = [];

let atomsRaw: unknown[];
try {
  atomsRaw = JSON.parse(readFileSync(atomsPath, "utf8")) as unknown[];
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  errors.push(`atoms.json: invalid JSON — ${message}`);
  atomsRaw = [];
}

for (const e of validateAtomCorpus(atomsRaw)) {
  errors.push(`atoms.json schema: ${e.path} — ${e.message}`);
}

if (atomsRaw.length !== KNOWLEDGE_ATOM_IDS.length) {
  errors.push(
    `atoms.json: expected ${KNOWLEDGE_ATOM_IDS.length} atoms per KNOWLEDGE_ATOM_IDS, found ${atomsRaw.length}`
  );
}

const jsonIds = atomsRaw
  .filter(
    (r): r is { atomId: string } =>
      typeof (r as Record<string, unknown>).atomId === "string"
  )
  .map((r) => r.atomId);
if (jsonIds.join(",") !== KNOWLEDGE_ATOM_IDS.join(",")) {
  errors.push("atoms.json: atomId order diverges from KNOWLEDGE_ATOM_IDS registry");
}

if (errors.length > 0) {
  console.error("knowledge-typed-corpus: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(`knowledge-typed-corpus: PASS — ${atomsRaw.length} typed atoms`);
