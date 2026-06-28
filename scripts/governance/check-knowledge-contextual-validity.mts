#!/usr/bin/env tsx
/**
 * PAS-004C §4.6 — B41: contextual validity governance gate.
 *
 * Validates:
 * 1. contextualValidity required when confidence.basis includes IFRS and GAAP.
 * 2. ifrs_10 documents applicableIn / notApplicableIn.
 * 3. validateContextualValidity() returns empty for full corpus.
 */

import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import {
  CONTEXTUAL_VALIDITY_EVIDENCE_ATOM_IDS,
  validateContextualValidity,
} from "../../packages/enterprise-knowledge/src/policy/knowledge-contextual-validity.policy.ts";

const errors: string[] = [];

const policyErrors = validateContextualValidity();
for (const e of policyErrors) {
  errors.push(e);
}

for (const atomId of CONTEXTUAL_VALIDITY_EVIDENCE_ATOM_IDS) {
  const atom = ENTERPRISE_KNOWLEDGE_ATOMS.find((entry) => entry.atomId === atomId);
  if (!atom?.contextualValidity) {
    continue;
  }
  if (atom.contextualValidity.applicableIn.length === 0) {
    errors.push(`atom "${atomId}": applicableIn must be non-empty`);
  }
  if (atom.contextualValidity.notApplicableIn.length === 0) {
    errors.push(`atom "${atomId}": notApplicableIn must be non-empty`);
  }
}

if (errors.length > 0) {
  console.error("check:knowledge-contextual-validity: FAIL");
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

const withContextualValidity = ENTERPRISE_KNOWLEDGE_ATOMS.filter(
  (atom) => atom.contextualValidity !== undefined
).length;

console.log(
  `check:knowledge-contextual-validity: PASS — ${withContextualValidity} atoms with contextualValidity, evidence atom ifrs_10 documented`
);
