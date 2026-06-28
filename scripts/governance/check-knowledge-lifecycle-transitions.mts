#!/usr/bin/env tsx

/**
 * PAS-004C §4.8 — B45: lifecycle transition governance gate.
 *
 * Validates:
 * 1. KnowledgeTransitionRule registry defines proposed→accepted, accepted→ratified, ratified→implemented.
 * 2. All 24 atoms pass retrospective lifecycle compliance at current lifecycle.
 * 3. validateKnowledgeLifecycleTransitions() returns empty for full corpus.
 */

import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import { KNOWLEDGE_TRANSITION_RULES } from "../../packages/enterprise-knowledge/src/data/transition-rules.registry.ts";
import { validateKnowledgeLifecycleTransitions } from "../../packages/enterprise-knowledge/src/policy/knowledge-transition.policy.ts";

const errors: string[] = [];

const expectedTransitions = [
  "proposed->accepted",
  "accepted->ratified",
  "ratified->implemented",
] as const;

const definedTransitions = KNOWLEDGE_TRANSITION_RULES.map(
  (rule) => `${rule.from}->${rule.to}`
);

for (const transition of expectedTransitions) {
  if (!definedTransitions.includes(transition)) {
    errors.push(`missing transition rule: ${transition}`);
  }
}

if (ENTERPRISE_KNOWLEDGE_ATOMS.length !== 24) {
  errors.push(
    `expected 24 atoms in corpus, found ${ENTERPRISE_KNOWLEDGE_ATOMS.length}`
  );
}

errors.push(
  ...validateKnowledgeLifecycleTransitions(ENTERPRISE_KNOWLEDGE_ATOMS)
);

if (errors.length > 0) {
  console.error("check:knowledge-lifecycle-transitions: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(
  `check:knowledge-lifecycle-transitions: PASS — ${KNOWLEDGE_TRANSITION_RULES.length} rules, ${ENTERPRISE_KNOWLEDGE_ATOMS.length} atoms validated`
);
