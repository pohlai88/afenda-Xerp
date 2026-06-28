#!/usr/bin/env tsx
/**
 * PAS-004C §4.4 — B44: realization mapping governance gate.
 *
 * Validates:
 * 1. realizationMapping on ≥3 platform identity atoms (tenant, legal_entity, organization_unit).
 * 2. ≥3 distinct realizationKind values cited in corpus.
 * 3. kernel realizationKind entries cite existing *.contract.ts paths only.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { REALIZATION_KINDS } from "../../packages/enterprise-knowledge/src/contracts/knowledge-realization.contract.ts";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import {
  collectRealizationKinds,
  REALIZATION_MAPPING_EVIDENCE_ATOM_IDS,
  validateKnowledgeRealizationMapping,
} from "../../packages/enterprise-knowledge/src/policy/knowledge-realization.policy.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors: string[] = [];

if (REALIZATION_KINDS.length < 10) {
  errors.push(
    `expected at least 10 realization kinds (kernel through report), found ${REALIZATION_KINDS.length}`
  );
}

errors.push(
  ...validateKnowledgeRealizationMapping(ENTERPRISE_KNOWLEDGE_ATOMS, {
    repoRoot,
  })
);

if (errors.length > 0) {
  console.error("check:knowledge-realization-mapping: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

const kindCount = collectRealizationKinds(ENTERPRISE_KNOWLEDGE_ATOMS).size;

console.log(
  `check:knowledge-realization-mapping: PASS — ${REALIZATION_MAPPING_EVIDENCE_ATOM_IDS.length} platform identity atoms, ${kindCount} realization kinds`
);
