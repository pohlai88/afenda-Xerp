#!/usr/bin/env tsx
/**
 * PAS-004 — enterprise knowledge registry conformance gate.
 */

import { validateKnowledgeRegistry } from "../../packages/enterprise-knowledge/src/policy/knowledge.policy.ts";

const errors = validateKnowledgeRegistry();

if (errors.length > 0) {
  console.error("knowledge-conformance: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("knowledge-conformance: PASS");
