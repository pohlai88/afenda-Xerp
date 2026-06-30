#!/usr/bin/env tsx
/**
 * PAS-001 §4.9 — kernel ↔ ERP metadata policy vocabulary parity.
 * ADR-0027: retired ui-composition mirror; @afenda/permissions owns evaluation.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { POLICY_DECISION_KINDS } from "../../packages/kernel/src/policy/policy-decision.contract.ts";
import { POLICY_DENIAL_REASONS } from "../../packages/kernel/src/policy/policy-denial-reason.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpMirrorPath = join(
  repoRoot,
  "apps/erp/src/lib/metadata/metadata-policy-vocabulary.contract.ts"
);

const violations: string[] = [];

if (existsSync(erpMirrorPath)) {
  const erpSource = readFileSync(erpMirrorPath, "utf8");
  if (!erpSource.includes('from "@afenda/kernel"')) {
    violations.push(
      "metadata-policy-vocabulary.contract.ts must import vocabulary from @afenda/kernel"
    );
  }
  if (
    !erpSource.includes(
      "METADATA_RUNTIME_POLICY_DECISION_KINDS = POLICY_DECISION_KINDS"
    )
  ) {
    violations.push(
      "ERP mirror must assign METADATA_RUNTIME_POLICY_DECISION_KINDS from kernel POLICY_DECISION_KINDS"
    );
  }
  if (
    !erpSource.includes(
      "METADATA_RUNTIME_POLICY_DENIAL_REASONS = POLICY_DENIAL_REASONS"
    )
  ) {
    violations.push(
      "ERP mirror must assign METADATA_RUNTIME_POLICY_DENIAL_REASONS from kernel POLICY_DENIAL_REASONS"
    );
  }
} else {
  violations.push(
    "ERP metadata policy vocabulary mirror missing (ADR-0027 consumer attestation)"
  );
}

const permissionsPolicyContract = join(
  repoRoot,
  "packages/permissions/src/policy.contract.ts"
);

if (existsSync(permissionsPolicyContract)) {
  const policySource = readFileSync(permissionsPolicyContract, "utf8");
  if (/POLICY_DECISION_KINDS/.test(policySource)) {
    violations.push(
      "@afenda/permissions must not import kernel POLICY_DECISION_KINDS — runtime PolicyDecision is a separate layer"
    );
  }
  if (/export const POLICY_DENIAL_REASONS\s*=/.test(policySource)) {
    violations.push(
      "@afenda/permissions must not duplicate kernel POLICY_DENIAL_REASONS vocabulary"
    );
  }
} else {
  violations.push(
    "@afenda/permissions policy.contract.ts missing — evaluation owner attestation failed"
  );
}

async function loadErpMirror(): Promise<{
  readonly decisionKinds: readonly string[];
  readonly denialReasons: readonly string[];
}> {
  const module = await import(pathToFileURL(erpMirrorPath).href);
  return {
    decisionKinds:
      module.METADATA_RUNTIME_POLICY_DECISION_KINDS as readonly string[],
    denialReasons:
      module.METADATA_RUNTIME_POLICY_DENIAL_REASONS as readonly string[],
  };
}

async function main(): Promise<void> {
  if (violations.length === 0 && existsSync(erpMirrorPath)) {
    const erpMirror = await loadErpMirror();

    if (
      JSON.stringify([...erpMirror.decisionKinds]) !==
      JSON.stringify([...POLICY_DECISION_KINDS])
    ) {
      violations.push(
        "METADATA_RUNTIME_POLICY_DECISION_KINDS must mirror POLICY_DECISION_KINDS"
      );
    }

    if (
      JSON.stringify([...erpMirror.denialReasons]) !==
      JSON.stringify([...POLICY_DENIAL_REASONS])
    ) {
      violations.push(
        "METADATA_RUNTIME_POLICY_DENIAL_REASONS must mirror POLICY_DENIAL_REASONS"
      );
    }
  }

  if (violations.length > 0) {
    console.error("Metadata policy parity gate failed:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log(
    "Metadata policy parity gate passed (kernel ↔ ERP metadata, PAS-001 §4.9)."
  );
}

await main();
