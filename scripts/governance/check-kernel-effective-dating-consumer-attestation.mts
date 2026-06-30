#!/usr/bin/env tsx
/**
 * PAS-001 amendment — effective-dating consumer attestation gate.
 *
 * Verifies ERP consolidation resolver consumes kernel effective-dating vocabulary
 * at the trust boundary (Blueprint §6 consumer attestation).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpContextRoot = join(repoRoot, "apps/erp/src/lib/context");

export interface EffectiveDatingConsumerAttestationViolation {
  readonly file: string;
  readonly message: string;
}

const REQUIRED_MARKERS: readonly {
  readonly file: string;
  readonly markers: readonly string[];
}[] = [
  {
    file: "consolidation-scope-resolution.server.ts",
    markers: ["isOwnershipInterestEffectiveAt"],
  },
  {
    file: "operating-context.mappers.ts",
    markers: ["effectiveFrom", "effectiveTo"],
  },
  {
    file: "to-ownership-interest-context.ts",
    markers: ["effectiveFrom", "effectiveTo"],
  },
];

export function checkEffectiveDatingConsumerAttestation(): EffectiveDatingConsumerAttestationViolation[] {
  const violations: EffectiveDatingConsumerAttestationViolation[] = [];

  for (const requirement of REQUIRED_MARKERS) {
    const absolutePath = join(erpContextRoot, requirement.file);

    if (!existsSync(absolutePath)) {
      violations.push({
        file: absolutePath,
        message: `Missing ERP context module required for effective-dating attestation: ${requirement.file}`,
      });
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    for (const marker of requirement.markers) {
      if (!source.includes(marker)) {
        violations.push({
          file: absolutePath,
          message: `Missing effective-dating marker "${marker}" in ${requirement.file}`,
        });
      }
    }
  }

  const kernelHelperPath = join(
    repoRoot,
    "packages/kernel/src/context/effective-dating-vocabulary.contract.ts"
  );

  if (!existsSync(kernelHelperPath)) {
    violations.push({
      file: kernelHelperPath,
      message:
        "Missing kernel effective-dating vocabulary contract (PAS-001 amendment).",
    });
  }

  return violations;
}

const violations = checkEffectiveDatingConsumerAttestation();

if (violations.length > 0) {
  for (const violation of violations) {
    process.stderr.write(`${violation.file}: ${violation.message}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  "Kernel effective-dating consumer attestation gate passed (PAS-001 amendment / Blueprint §6).\n"
);
