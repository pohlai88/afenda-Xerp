import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ACCOUNTING_READINESS_GATE_REQUIREMENTS,
  type AccountingReadinessGateRequirementId,
} from "../accounting-readiness-gate-registry.mts";

export interface AccountingReadinessErpCopyParityViolation {
  readonly id: AccountingReadinessGateRequirementId;
  readonly message: string;
  readonly rule: "erp-copy-parity";
}

export function checkAccountingReadinessErpCopyParity(
  repoRoot: string
): AccountingReadinessErpCopyParityViolation[] {
  const copyPath = join(
    repoRoot,
    "apps/erp/src/lib/system-admin/accounting-readiness-gate.copy.contract.ts"
  );
  const source = readFileSync(copyPath, "utf8");
  const violations: AccountingReadinessErpCopyParityViolation[] = [];

  for (const registryRow of ACCOUNTING_READINESS_GATE_REQUIREMENTS) {
    if (!source.includes(`id: "${registryRow.id}"`)) {
      violations.push({
        rule: "erp-copy-parity",
        id: registryRow.id,
        message: `ERP copy missing requirement id ${registryRow.id}`,
      });
      continue;
    }

    if (!source.includes(`number: ${registryRow.number}`)) {
      violations.push({
        rule: "erp-copy-parity",
        id: registryRow.id,
        message: `ERP copy missing number ${registryRow.number}`,
      });
    }

    if (!source.includes(`requirement: "${registryRow.requirement}"`)) {
      violations.push({
        rule: "erp-copy-parity",
        id: registryRow.id,
        message: "ERP copy missing requirement label",
      });
    }

    for (const gate of registryRow.delegatedGates ?? []) {
      if (!source.includes(`"${gate}"`)) {
        violations.push({
          rule: "erp-copy-parity",
          id: registryRow.id,
          message: `ERP copy missing delegated gate ${gate}`,
        });
      }
    }

    for (const testFile of registryRow.testFiles ?? []) {
      if (!source.includes(testFile)) {
        violations.push({
          rule: "erp-copy-parity",
          id: registryRow.id,
          message: `ERP copy missing test file ${testFile}`,
        });
      }
    }
  }

  return violations;
}
