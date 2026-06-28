#!/usr/bin/env tsx
/**
 * PAS-004C §4.5 — B40: domain-axis governance gate.
 *
 * Validates:
 * 1. All 17 KNOWLEDGE_DOMAINS have domainClass in domains.registry.ts.
 * 2. Required architecture domains (platform, architecture, engineering, api).
 * 3. Required business domains (accounting, hr, finance).
 */

import { KNOWLEDGE_DOMAINS } from "../../packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.ts";
import { KNOWLEDGE_DOMAIN_ENTRIES } from "../../packages/enterprise-knowledge/src/data/domains.registry.ts";
import { validateKnowledgeDomainAxis } from "../../packages/enterprise-knowledge/src/policy/knowledge-domain-axis.policy.ts";

const errors: string[] = [];

const policyErrors = validateKnowledgeDomainAxis();
for (const e of policyErrors) {
  errors.push(e);
}

if (KNOWLEDGE_DOMAIN_ENTRIES.length !== KNOWLEDGE_DOMAINS.length) {
  errors.push(
    `registry count mismatch: ${KNOWLEDGE_DOMAIN_ENTRIES.length} entries vs ${KNOWLEDGE_DOMAINS.length} KNOWLEDGE_DOMAINS`
  );
}

if (errors.length > 0) {
  console.error("check:knowledge-domain-axis: FAIL");
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

const architectureCount = KNOWLEDGE_DOMAIN_ENTRIES.filter(
  (e) => e.domainClass === "architecture"
).length;
const businessCount = KNOWLEDGE_DOMAIN_ENTRIES.filter(
  (e) => e.domainClass === "business"
).length;

console.log(
  `check:knowledge-domain-axis: PASS — ${KNOWLEDGE_DOMAIN_ENTRIES.length} domains (${architectureCount} architecture, ${businessCount} business)`
);
