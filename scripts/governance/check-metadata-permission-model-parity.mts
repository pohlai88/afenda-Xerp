#!/usr/bin/env tsx
/**
 * PAS-001 §8 — kernel ↔ ERP metadata permission model vocabulary parity.
 * ADR-0027: retired ui-composition mirror; permissions owns evaluation only.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { PERMISSION_ACTIONS } from "../../packages/kernel/src/permission/permission-action.contract.ts";
import { PERMISSION_MODEL_SCOPES } from "../../packages/kernel/src/permission/permission-model-scope.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpMirrorPath = join(
  repoRoot,
  "apps/erp/src/lib/metadata/metadata-permission-vocabulary.contract.ts"
);

const violations: string[] = [];

if (!existsSync(erpMirrorPath)) {
  violations.push(
    "ERP metadata permission vocabulary mirror missing (ADR-0027 consumer attestation)"
  );
} else {
  const erpSource = readFileSync(erpMirrorPath, "utf8");
  if (!erpSource.includes('from "@afenda/kernel"')) {
    violations.push(
      "metadata-permission-vocabulary.contract.ts must import vocabulary from @afenda/kernel"
    );
  }
  if (
    !erpSource.includes(
      "METADATA_RUNTIME_PERMISSION_ACTIONS = PERMISSION_ACTIONS"
    )
  ) {
    violations.push(
      "ERP mirror must assign METADATA_RUNTIME_PERMISSION_ACTIONS from kernel PERMISSION_ACTIONS"
    );
  }
  if (
    !erpSource.includes(
      "METADATA_RUNTIME_PERMISSION_MODEL_SCOPES = PERMISSION_MODEL_SCOPES"
    )
  ) {
    violations.push(
      "ERP mirror must assign METADATA_RUNTIME_PERMISSION_MODEL_SCOPES from kernel PERMISSION_MODEL_SCOPES"
    );
  }
}

const permissionsScopeContract = join(
  repoRoot,
  "packages/permissions/src/scope/permission-scope-context.contract.ts"
);

if (!existsSync(permissionsScopeContract)) {
  violations.push(
    "@afenda/permissions scope contract missing — grant vocabulary consumer attestation failed"
  );
} else {
  const scopeSource = readFileSync(permissionsScopeContract, "utf8");
  if (!scopeSource.includes('from "@afenda/kernel"')) {
    violations.push(
      "permission-scope-context.contract.ts must import grant vocabulary from @afenda/kernel"
    );
  }
  if (/export const PERMISSION_ACTIONS\s*=/.test(scopeSource)) {
    violations.push(
      "@afenda/permissions must not define local PERMISSION_ACTIONS — kernel owns vocabulary"
    );
  }
}

async function loadErpMirror(): Promise<{
  readonly actions: readonly string[];
  readonly scopes: readonly string[];
}> {
  const module = await import(pathToFileURL(erpMirrorPath).href);
  return {
    actions: module.METADATA_RUNTIME_PERMISSION_ACTIONS as readonly string[],
    scopes: module.METADATA_RUNTIME_PERMISSION_MODEL_SCOPES as readonly string[],
  };
}

async function main(): Promise<void> {
  if (violations.length === 0 && existsSync(erpMirrorPath)) {
    const erpMirror = await loadErpMirror();

    if (
      JSON.stringify([...erpMirror.actions]) !==
      JSON.stringify([...PERMISSION_ACTIONS])
    ) {
      violations.push(
        "METADATA_RUNTIME_PERMISSION_ACTIONS must mirror PERMISSION_ACTIONS"
      );
    }

    if (
      JSON.stringify([...erpMirror.scopes]) !==
      JSON.stringify([...PERMISSION_MODEL_SCOPES])
    ) {
      violations.push(
        "METADATA_RUNTIME_PERMISSION_MODEL_SCOPES must mirror PERMISSION_MODEL_SCOPES"
      );
    }
  }

  if (violations.length > 0) {
    console.error("Metadata permission model parity gate failed:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log(
    "Metadata permission model parity gate passed (kernel ↔ ERP metadata, PAS-001 §8)."
  );
}

await main();
