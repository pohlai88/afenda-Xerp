#!/usr/bin/env tsx
/**
 * Phase 9 Accounting Readiness Gate orchestrator (ADR-0010 / Foundation phase 13).
 *
 * Validates registry structure, evidence files, and delegates to existing
 * governance gates — no duplicate gate logic.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ACCOUNTING_READINESS_GATE_CHECK_SCRIPT,
  ACCOUNTING_READINESS_GATE_PACKAGE_SCRIPT,
  ACCOUNTING_READINESS_GATE_REQUIREMENTS,
  ACCOUNTING_READINESS_GATE_SURFACE_RULE,
  PHASE_9_ROADMAP_DOC,
  ACCOUNTING_READINESS_DELIVERY_DOC,
} from "./accounting-readiness-gate-registry.mts";
import { checkAccountingReadinessErpCopyParity } from "./lib/accounting-readiness-gate-erp-copy-parity.mts";
import { evaluateAccountingReadinessGateLiveStatus } from "./lib/accounting-readiness-gate-live-status.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface AccountingReadinessGateViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

const registryPath = join(
  repoRoot,
  "scripts/governance/accounting-readiness-gate-registry.mts"
);
const gatePath = join(repoRoot, ACCOUNTING_READINESS_GATE_CHECK_SCRIPT);
const packageJsonPath = join(repoRoot, "package.json");
const roadmapDocPath = join(repoRoot, PHASE_9_ROADMAP_DOC);

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

function collectUniqueDelegatedGates(): string[] {
  const gates = new Set<string>();

  for (const requirement of ACCOUNTING_READINESS_GATE_REQUIREMENTS) {
    for (const gate of requirement.delegatedGates ?? []) {
      if (gate === ACCOUNTING_READINESS_GATE_PACKAGE_SCRIPT) {
        continue;
      }
      gates.add(gate);
    }
  }

  return [...gates].toSorted();
}

export function checkAccountingReadinessGateStructure(): AccountingReadinessGateViolation[] {
  const violations: AccountingReadinessGateViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "accounting-readiness-gate-registry.mts is required",
    });
    return violations;
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${ACCOUNTING_READINESS_GATE_CHECK_SCRIPT} is required`,
    });
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (!registrySource.includes(ACCOUNTING_READINESS_GATE_SURFACE_RULE)) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${ACCOUNTING_READINESS_GATE_SURFACE_RULE}`,
    });
  }

  if (ACCOUNTING_READINESS_GATE_REQUIREMENTS.length !== 10) {
    violations.push({
      rule: "requirement-count",
      file: registryPath,
      message:
        "Accounting readiness registry must define exactly 10 requirements",
    });
  }

  const numbers = ACCOUNTING_READINESS_GATE_REQUIREMENTS.map(
    (entry) => entry.number
  );
  const expectedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if (numbers.join(",") !== expectedNumbers.join(",")) {
    violations.push({
      rule: "requirement-numbering",
      file: registryPath,
      message:
        "Accounting readiness requirements must be numbered 1–10 in order",
    });
  }

  for (const requirement of ACCOUNTING_READINESS_GATE_REQUIREMENTS) {
    const hasGate = (requirement.delegatedGates?.length ?? 0) > 0;
    const hasTests = (requirement.testFiles?.length ?? 0) > 0;

    if (!(hasGate || hasTests)) {
      violations.push({
        rule: "requirement-evidence-missing",
        file: registryPath,
        message: `Requirement ${requirement.number} (${requirement.id}) must declare delegatedGates and/or testFiles`,
      });
    }

    for (const testFile of requirement.testFiles ?? []) {
      const absolutePath = join(repoRoot, testFile);
      if (!existsSync(absolutePath)) {
        violations.push({
          rule: "test-file-missing",
          file: absolutePath,
          message: `Missing evidence test file for requirement ${requirement.number}: ${testFile}`,
        });
      }
    }
  }

  const roadmapContent = readText(roadmapDocPath);
  if (roadmapContent === null) {
    violations.push({
      rule: "roadmap-doc-missing",
      file: roadmapDocPath,
      message: `${PHASE_9_ROADMAP_DOC} is required`,
    });
  } else {
    for (const requirement of ACCOUNTING_READINESS_GATE_REQUIREMENTS) {
      if (!roadmapContent.includes(requirement.roadmapMarker)) {
        violations.push({
          rule: "roadmap-marker-missing",
          file: roadmapDocPath,
          message: `Missing Phase 9 roadmap marker: ${requirement.roadmapMarker}`,
        });
      }
    }
  }

  const packageJsonContent = readText(packageJsonPath);
  if (packageJsonContent === null) {
    violations.push({
      rule: "package-json-missing",
      file: packageJsonPath,
      message: "root package.json is required",
    });
  } else if (
    packageJsonContent.includes(`"${ACCOUNTING_READINESS_GATE_PACKAGE_SCRIPT}"`)
  ) {
    for (const gate of collectUniqueDelegatedGates()) {
      if (!packageJsonContent.includes(`"${gate}"`)) {
        violations.push({
          rule: "delegated-gate-script-missing",
          file: packageJsonPath,
          message: `package.json must define delegated gate script: ${gate}`,
        });
      }
    }
  } else {
    violations.push({
      rule: "check-script-missing",
      file: packageJsonPath,
      message: `package.json must define ${ACCOUNTING_READINESS_GATE_PACKAGE_SCRIPT}`,
    });
  }

  const deliveryDocPath = join(repoRoot, ACCOUNTING_READINESS_DELIVERY_DOC);

  if (existsSync(deliveryDocPath)) {
    const deliveryContent = readFileSync(deliveryDocPath, "utf8");
    if (!deliveryContent.includes(ACCOUNTING_READINESS_GATE_SURFACE_RULE)) {
      violations.push({
        rule: "delivery-surface-rule-missing",
        file: deliveryDocPath,
        message: `Delivery doc must document ${ACCOUNTING_READINESS_GATE_SURFACE_RULE}`,
      });
    }
  } else {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: "Phase 9 accounting readiness sign-off doc is required",
    });
  }

  for (const parityViolation of checkAccountingReadinessErpCopyParity(
    repoRoot
  )) {
    violations.push({
      rule: parityViolation.rule,
      file: join(
        repoRoot,
        "apps/erp/src/lib/system-admin/accounting-readiness-gate.copy.contract.ts"
      ),
      message: `[${parityViolation.id}] ${parityViolation.message}`,
    });
  }

  return violations;
}

export function runAccountingReadinessDelegatedGates(): AccountingReadinessGateViolation[] {
  const violations: AccountingReadinessGateViolation[] = [];

  for (const gate of collectUniqueDelegatedGates()) {
    const command = `pnpm ${gate}`;
    const result = spawnSync(command, {
      shell: true,
      cwd: repoRoot,
      encoding: "utf8",
    });

    if (result.status !== 0 || result.error) {
      const output = [result.stdout ?? "", result.stderr ?? ""]
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .join("\n");

      violations.push({
        rule: "delegated-gate-failed",
        file: packageJsonPath,
        message: `${command} failed${output ? `\n${output}` : ""}`,
      });
    }
  }

  return violations;
}

export function checkAccountingReadinessGate(input?: {
  readonly runDelegatedGates?: boolean;
}): AccountingReadinessGateViolation[] {
  const violations = checkAccountingReadinessGateStructure();

  if (violations.length > 0) {
    return violations;
  }

  if (input?.runDelegatedGates === true) {
    violations.push(...runAccountingReadinessDelegatedGates());
  }

  return violations;
}

export {
  type AccountingReadinessGateLiveSnapshot,
  type AccountingReadinessRequirementLiveStatus,
  evaluateAccountingReadinessGateLiveStatus,
  parseAccountingReadinessGateLiveSnapshot,
} from "./lib/accounting-readiness-gate-live-status.mts";

export function formatAccountingReadinessGateViolations(
  violations: readonly AccountingReadinessGateViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map(
      (violation) =>
        `[${violation.rule}] ${violation.file}\n  ${violation.message}`
    )
    .join("\n\n");
}

function main(): void {
  const structureOnly = process.argv.includes("--structure-only");
  const jsonStatus = process.argv.includes("--json-status");

  if (jsonStatus) {
    const structureViolations = checkAccountingReadinessGateStructure();
    const snapshot = evaluateAccountingReadinessGateLiveStatus({
      repoRoot,
      runDelegatedGates: !structureOnly,
      structureViolations,
    });
    console.log(JSON.stringify(snapshot));
    process.exit(snapshot.overallKind === "pass" ? 0 : 1);
  }

  const violations = checkAccountingReadinessGate({
    runDelegatedGates: !structureOnly,
  });

  if (violations.length > 0) {
    console.error(formatAccountingReadinessGateViolations(violations));
    process.exit(1);
  }

  console.log("Accounting readiness gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }

  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-accounting-readiness-gate.mts")
    );
  } catch {
    return entry.endsWith("check-accounting-readiness-gate.mts");
  }
})();

if (isDirectRun) {
  main();
}
