#!/usr/bin/env tsx
/**
 * PAS-004C §4.2 — B39: contextual meaning perspective governance gate.
 *
 * Validates:
 * 1. perspectives.json is valid JSON.
 * 2. Structural schema validation passes.
 * 3. atomId and conceptId cross-references resolve.
 * 4. ≥3 platform identity perspectives for legal_entity (accounting, identity, reporting).
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { validatePerspectiveCorpus } from "../../packages/enterprise-knowledge/src/data/knowledge-data.schema.ts";
import {
  PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS,
  validateKnowledgePerspective,
} from "../../packages/enterprise-knowledge/src/policy/knowledge-perspective.policy.ts";

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
const conceptIds = new Set(
  conceptsRaw
    .filter(
      (r): r is { conceptId: string } =>
        typeof (r as Record<string, unknown>).conceptId === "string"
    )
    .map((r) => r.conceptId)
);

const atomsRaw = readJsonArray("atoms.json");
const atomIds = new Set(
  atomsRaw
    .filter(
      (r): r is { atomId: string } =>
        typeof (r as Record<string, unknown>).atomId === "string"
    )
    .map((r) => r.atomId)
);

const perspectivesRaw = readJsonArray("perspectives.json");
const perspectiveErrors = validatePerspectiveCorpus(
  perspectivesRaw,
  conceptIds,
  atomIds
);
for (const e of perspectiveErrors) {
  errors.push(`perspectives.json schema: ${e.path} — ${e.message}`);
}

if (
  perspectivesRaw.length < PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS.length
) {
  errors.push(
    `perspectives.json: expected at least ${PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS.length} platform identity perspectives, found ${perspectivesRaw.length}`
  );
}

const policyErrors = validateKnowledgePerspective();
for (const e of policyErrors) {
  errors.push(`policy: ${e}`);
}

if (errors.length > 0) {
  console.error("check:knowledge-perspective: FAIL");
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log(
  `check:knowledge-perspective: PASS — ${perspectivesRaw.length} perspectives, ${PLATFORM_IDENTITY_PERSPECTIVE_REQUIREMENTS.length} platform identity contexts for legal_entity`
);
