#!/usr/bin/env tsx
/**
 * PAS-004E — export derived vocabulary artifacts for cspell + CI coverage gate.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildCspellEnterpriseDictionary,
  buildVocabularyAllowlist,
  buildVocabularyCoverageSchema,
} from "../../packages/enterprise-knowledge/src/vocabulary/knowledge-vocabulary-export.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const outputs = {
  allowlist: join(
    repoRoot,
    "packages/enterprise-knowledge/dist/vocabulary.allowlist.json"
  ),
  coverageSchema: join(
    repoRoot,
    "packages/enterprise-knowledge/dist/vocabulary.coverage.schema.json"
  ),
  cspellDictionary: join(repoRoot, "cspell.enterprise-knowledge.txt"),
} as const;

function main(): void {
  const allowlist = buildVocabularyAllowlist();
  const coverageSchema = buildVocabularyCoverageSchema();
  const cspellDictionary = buildCspellEnterpriseDictionary(allowlist);

  mkdirSync(dirname(outputs.allowlist), { recursive: true });

  writeFileSync(outputs.allowlist, `${JSON.stringify(allowlist, null, 2)}\n`);
  writeFileSync(
    outputs.coverageSchema,
    `${JSON.stringify(coverageSchema, null, 2)}\n`
  );
  writeFileSync(outputs.cspellDictionary, cspellDictionary);

  console.log(`✓ export:knowledge-vocabulary`);
  console.log(`  allowlist: ${outputs.allowlist}`);
  console.log(`  coverage schema: ${outputs.coverageSchema}`);
  console.log(`  cspell dictionary: ${outputs.cspellDictionary}`);
  console.log(`  fingerprint: ${allowlist.fingerprint}`);
}

main();
