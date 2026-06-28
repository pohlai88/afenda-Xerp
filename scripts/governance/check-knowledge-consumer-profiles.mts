#!/usr/bin/env tsx
/**
 * PAS-004C §4.3 — B43: consumer profile projection governance gate.
 *
 * Validates:
 * 1. Five consumer profiles are defined.
 * 2. projectKnowledgeAtom produces JSON-serializable output for ≥3 platform identity atoms.
 * 3. ai profile includes misconceptions + structuredReasoning facets.
 */

import { KNOWLEDGE_CONSUMER_PROFILES } from "../../packages/enterprise-knowledge/src/contracts/knowledge-consumer-profile.contract.ts";
import {
  KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS,
  validateKnowledgeConsumerProfiles,
} from "../../packages/enterprise-knowledge/src/projection/knowledge-consumer.projection.ts";

const errors: string[] = [];

if (KNOWLEDGE_CONSUMER_PROFILES.length !== 5) {
  errors.push(
    `expected 5 consumer profiles, found ${KNOWLEDGE_CONSUMER_PROFILES.length}`
  );
}

if (KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS.length < 3) {
  errors.push(
    `expected at least 3 platform identity evidence atoms, found ${KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS.length}`
  );
}

const policyErrors = validateKnowledgeConsumerProfiles();
for (const error of policyErrors) {
  errors.push(error);
}

if (errors.length > 0) {
  console.error("check:knowledge-consumer-profiles: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

const projectionCount =
  KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS.length *
  KNOWLEDGE_CONSUMER_PROFILES.length;

console.log(
  `check:knowledge-consumer-profiles: PASS — ${KNOWLEDGE_CONSUMER_PROFILES.length} profiles, ${KNOWLEDGE_CONSUMER_PROFILE_EVIDENCE_ATOM_IDS.length} platform identity atoms, ${projectionCount} serializable projections`
);
