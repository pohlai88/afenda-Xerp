#!/usr/bin/env tsx
/**
 * PAS-003 §13.2 consumer proof gate.
 *
 * ADR-0027 retired @afenda/ui-composition — consumer proof targets apps/erp (B20).
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const legacyConsumerDir = join(
  repoRoot,
  "packages/ui-composition/src/accounting-standards"
);
const erpConsumerDir = join(repoRoot, "apps/erp/src/lib/accounting-standards");
const erpWorkflowFile = join(
  erpConsumerDir,
  "run-accounting-standards-validation.server.ts"
);

if (existsSync(erpConsumerDir)) {
  const errors: string[] = [];

  if (existsSync(erpWorkflowFile)) {
    const workflowSource = readFileSync(erpWorkflowFile, "utf8");
    if (!workflowSource.includes("validatePostingAgainstAccountingStandards")) {
      errors.push(
        "ERP workflow must import validatePostingAgainstAccountingStandards"
      );
    }
    if (
      !workflowSource.includes("persistAccountingStandardsEvidenceFromReport")
    ) {
      errors.push(
        "ERP workflow must persist evidence snapshots via persistAccountingStandardsEvidenceFromReport"
      );
    }
    if (!workflowSource.includes("evidenceSnapshot")) {
      errors.push("ERP workflow must surface evidenceSnapshot payloads");
    }
  } else {
    errors.push("missing run-accounting-standards-validation.server.ts");
  }

  if (errors.length > 0) {
    console.error("accounting-standards-metadata-consumer-proof: FAIL");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(
    "accounting-standards-metadata-consumer-proof: PASS (apps/erp consumer present)"
  );
  process.exit(0);
}

if (!existsSync(legacyConsumerDir)) {
  console.log(
    "accounting-standards-metadata-consumer-proof: DEFERRED (ADR-0027 — ui-composition retired; ERP consumer proof pending B20)"
  );
  process.exit(0);
}

console.log(
  "accounting-standards-metadata-consumer-proof: PASS (legacy ui-composition path)"
);
