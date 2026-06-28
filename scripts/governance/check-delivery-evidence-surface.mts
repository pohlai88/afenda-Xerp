#!/usr/bin/env tsx
/**
 * Delivery evidence surface gate (multi-tenancy.md).
 *
 * Verifies multi-tenancy architecture doc presence, cross-reference wiring,
 * and governance gate registration after legacy TIP delivery doc retirement.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DELIVERY_EVIDENCE_SURFACE_RULE,
  GOVERNANCE_DIST_BUILD_SCRIPT,
  MULTI_TENANCY_DOC_REFERENCE,
  MULTI_TENANCY_GOVERNANCE_GATES,
  MULTI_TENANCY_DELIVERY_DOC,
  PAS_001A_GOVERNANCE_GATES,
} from "./delivery-evidence-surface-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");
const registryPath = join(
  repoRoot,
  "scripts/governance/delivery-evidence-surface-registry.mts"
);

export interface DeliveryEvidenceSurfaceViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkDeliveryEvidenceSurface(): DeliveryEvidenceSurfaceViolation[] {
  const violations: DeliveryEvidenceSurfaceViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "delivery-evidence-surface-registry.mts is required",
    });
  }

  const registrySource = readText(registryPath);
  if (
    registrySource &&
    !registrySource.includes(DELIVERY_EVIDENCE_SURFACE_RULE)
  ) {
    violations.push({
      rule: "surface-rule-missing",
      file: registryPath,
      message: "Registry must export DELIVERY_EVIDENCE_SURFACE_RULE",
    });
  }

  if (MULTI_TENANCY_DELIVERY_DOC !== MULTI_TENANCY_DOC_REFERENCE) {
    violations.push({
      rule: "delivery-doc-alias",
      file: registryPath,
      message:
        "MULTI_TENANCY_DELIVERY_DOC must alias docs/architecture/multi-tenancy.md after legacy cleanup",
    });
  }

  const multiTenancyContent = readText(multiTenancyDocPath);
  if (multiTenancyContent === null) {
    violations.push({
      rule: "multi-tenancy-doc-missing",
      file: multiTenancyDocPath,
      message: `${MULTI_TENANCY_DOC_REFERENCE} is required`,
    });
  }

  const packageJsonContent = readText(packageJsonPath);
  if (packageJsonContent === null) {
    violations.push({
      rule: "package-json-missing",
      file: packageJsonPath,
      message: "root package.json is required",
    });
  } else {
    for (const gate of MULTI_TENANCY_GOVERNANCE_GATES) {
      if (!packageJsonContent.includes(`"${gate.checkScript}"`)) {
        violations.push({
          rule: "check-script-missing",
          file: packageJsonPath,
          message: `package.json must define script ${gate.checkScript}`,
        });
      }

      if (!packageJsonContent.includes(`"${gate.qualityScript}"`)) {
        violations.push({
          rule: "quality-script-missing",
          file: packageJsonPath,
          message: `package.json must define script ${gate.qualityScript}`,
        });
      }

      const gatePath = join(repoRoot, gate.gateFile);
      if (!existsSync(gatePath)) {
        violations.push({
          rule: "gate-file-missing",
          file: gatePath,
          message: `Governance gate file missing for ${gate.checkScript}`,
        });
      }
    }

    for (const gate of PAS_001A_GOVERNANCE_GATES) {
      if (!packageJsonContent.includes(`"${gate.checkScript}"`)) {
        violations.push({
          rule: "pas001a-check-script-missing",
          file: packageJsonPath,
          message: `package.json must define PAS-001A script ${gate.checkScript}`,
        });
      }

      const gatePath = join(repoRoot, gate.gateFile);
      if (!existsSync(gatePath)) {
        violations.push({
          rule: "pas001a-gate-file-missing",
          file: gatePath,
          message: `PAS-001A governance gate file missing for ${gate.checkScript}`,
        });
      }
    }

    if (!packageJsonContent.includes("quality:delivery-evidence-surface")) {
      violations.push({
        rule: "quality-chain-missing",
        file: packageJsonPath,
        message: "pnpm quality must include quality:delivery-evidence-surface",
      });
    }

    if (!packageJsonContent.includes(`"${GOVERNANCE_DIST_BUILD_SCRIPT}"`)) {
      violations.push({
        rule: "governance-dist-script-missing",
        file: packageJsonPath,
        message: `package.json must define script ${GOVERNANCE_DIST_BUILD_SCRIPT}`,
      });
    }

    const qualityChain =
      packageJsonContent.match(/"quality":\s*"([^"]+)"/)?.[1] ?? "";
    if (!qualityChain.includes(GOVERNANCE_DIST_BUILD_SCRIPT)) {
      violations.push({
        rule: "governance-dist-not-in-quality",
        file: packageJsonPath,
        message: `pnpm quality must run ${GOVERNANCE_DIST_BUILD_SCRIPT} before surface gates`,
      });
    }
  }

  return violations;
}

export function formatDeliveryEvidenceViolations(
  violations: readonly DeliveryEvidenceSurfaceViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkDeliveryEvidenceSurface();
  if (violations.length > 0) {
    console.error(formatDeliveryEvidenceViolations(violations));
    process.exit(1);
  }

  console.log("Delivery evidence surface gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-delivery-evidence-surface.mts")
    );
  } catch {
    return entry.endsWith("check-delivery-evidence-surface.mts");
  }
})();

if (isDirectRun) {
  main();
}
