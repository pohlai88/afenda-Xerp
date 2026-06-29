#!/usr/bin/env tsx
/** PAS-001 §4.9 — metadata/ui-composition policy vocabulary parity gate. */

import { METADATA_RUNTIME_POLICY_DECISION_KINDS } from "../../packages/ui-composition/src/metadata-policy-vocabulary.contract.ts";
import { METADATA_RUNTIME_POLICY_DENIAL_REASONS } from "../../packages/ui-composition/src/metadata-policy-vocabulary.contract.ts";
import { POLICY_DECISION_KINDS } from "../../packages/kernel/src/policy/policy-decision.contract.ts";
import { POLICY_DENIAL_REASONS } from "../../packages/kernel/src/policy/policy-denial-reason.contract.ts";

const violations: string[] = [];

if (
  JSON.stringify([...METADATA_RUNTIME_POLICY_DECISION_KINDS]) !==
  JSON.stringify([...POLICY_DECISION_KINDS])
) {
  violations.push(
    "METADATA_RUNTIME_POLICY_DECISION_KINDS must mirror POLICY_DECISION_KINDS"
  );
}

if (
  JSON.stringify([...METADATA_RUNTIME_POLICY_DENIAL_REASONS]) !==
  JSON.stringify([...POLICY_DENIAL_REASONS])
) {
  violations.push(
    "METADATA_RUNTIME_POLICY_DENIAL_REASONS must mirror POLICY_DENIAL_REASONS"
  );
}

if (violations.length > 0) {
  console.error("Metadata policy parity gate failed:\n");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("Metadata policy parity gate passed (PAS-001 §4.9 / ui-composition).");
