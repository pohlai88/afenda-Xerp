#!/usr/bin/env tsx
/**
 * PAS-004D — epistemic status + semantic stability facet gate (Domain NS §3.3 · §3.5).
 */

import { validateKnowledgeEpistemicFacets } from "../../packages/enterprise-knowledge/src/policy/knowledge-epistemic.policy.ts";

const errors = validateKnowledgeEpistemicFacets();

if (errors.length > 0) {
  console.error("check:knowledge-epistemic-facets: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("check:knowledge-epistemic-facets: PASS");
