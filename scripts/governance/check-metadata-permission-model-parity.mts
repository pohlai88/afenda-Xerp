#!/usr/bin/env tsx
/** PAS-001 §8 — metadata/ui-composition permission model vocabulary parity gate. */

import { METADATA_RUNTIME_PERMISSION_ACTIONS } from "../../packages/ui-composition/src/metadata-permission-vocabulary.contract.ts";
import { METADATA_RUNTIME_PERMISSION_MODEL_SCOPES } from "../../packages/ui-composition/src/metadata-permission-vocabulary.contract.ts";
import { PERMISSION_ACTIONS } from "../../packages/kernel/src/permission/permission-action.contract.ts";
import { PERMISSION_MODEL_SCOPES } from "../../packages/kernel/src/permission/permission-model-scope.contract.ts";

const violations: string[] = [];

if (
  JSON.stringify([...METADATA_RUNTIME_PERMISSION_ACTIONS]) !==
  JSON.stringify([...PERMISSION_ACTIONS])
) {
  violations.push(
    "METADATA_RUNTIME_PERMISSION_ACTIONS must mirror PERMISSION_ACTIONS"
  );
}

if (
  JSON.stringify([...METADATA_RUNTIME_PERMISSION_MODEL_SCOPES]) !==
  JSON.stringify([...PERMISSION_MODEL_SCOPES])
) {
  violations.push(
    "METADATA_RUNTIME_PERMISSION_MODEL_SCOPES must mirror PERMISSION_MODEL_SCOPES"
  );
}

if (violations.length > 0) {
  console.error("Metadata permission model parity gate failed:\n");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(
  "Metadata permission model parity gate passed (PAS-001 §8 / ui-composition)."
);
