#!/usr/bin/env tsx
/**
 * Multi-tenancy dependency rules gate (multi-tenancy.md §432–445).
 *
 * Authoritative enforcement for dependency ownership, forbidden edges,
 * ERP permission delegation, registry-approved edges, and live architecture
 * validation. Architecture-authority gate handles doc/registry sync only.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { dependencyContract } from "../../packages/architecture-authority/src/index.ts";
import {
  MULTI_TENANCY_AUTHORITY_OWNERS,
  MULTI_TENANCY_DEPENDENCY_DOC_MARKERS,
  MULTI_TENANCY_DEPENDENCY_RULES_SURFACE_RULE,
  MULTI_TENANCY_REQUIRED_APPROVED_RUNTIME_EDGES,
} from "../../packages/architecture-authority/src/surface/index.ts";
import {
  MULTI_TENANCY_DOC_REFERENCE,
  TIP_007_012_DELIVERY_DOC,
} from "./delivery-evidence-surface-registry.mts";
import {
  collectArchitectureAuthorityDistFreshnessViolations,
  collectErpPermissionEngineDuplicationViolations,
  collectForbiddenPackageDependencyViolations,
  collectForbiddenRuntimeEdgeViolations,
  collectLiveArchitectureValidationViolations,
  type DependencyEnforcementViolation,
} from "./lib/multi-tenancy-dependency-enforcement.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const authorityRoot = join(repoRoot, "packages/architecture-authority");
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const deliveryDocPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);
const registrySource = join(
  authorityRoot,
  "src/surface/architecture-authority-surface-registry.ts"
);

export type MultiTenancyDependencyRulesViolation =
  DependencyEnforcementViolation;

function edgeExistsInRegistry(from: string, to: string): boolean {
  return dependencyContract.runtimeEdges.some(
    (edge) => edge.from === from && edge.to === to
  );
}

function edgeApprovedForPackage(from: string, to: string): boolean {
  const approved = dependencyContract.approvedRuntimeByPackage[from];
  return approved?.includes(to) ?? false;
}

export async function checkMultiTenancyDependencyRules(): Promise<
  MultiTenancyDependencyRulesViolation[]
> {
  const violations: MultiTenancyDependencyRulesViolation[] = [];

  violations.push(
    ...collectArchitectureAuthorityDistFreshnessViolations(repoRoot)
  );

  if (!existsSync(registrySource)) {
    violations.push({
      rule: "registry-missing",
      file: registrySource,
      message: "architecture-authority-surface-registry.ts is required",
    });
    return violations;
  }

  const registrySourceText = readFileSync(registrySource, "utf8");
  if (
    !registrySourceText.includes(MULTI_TENANCY_DEPENDENCY_RULES_SURFACE_RULE)
  ) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registrySource,
      message: `${MULTI_TENANCY_DEPENDENCY_RULES_SURFACE_RULE} must be declared in architecture authority surface registry`,
    });
  }

  if (existsSync(multiTenancyDocPath)) {
    const multiTenancyDoc = readFileSync(multiTenancyDocPath, "utf8");
    for (const marker of MULTI_TENANCY_DEPENDENCY_DOC_MARKERS) {
      if (!multiTenancyDoc.includes(marker)) {
        violations.push({
          rule: "multi-tenancy-doc-marker-missing",
          file: multiTenancyDocPath,
          message: `multi-tenancy.md Dependency rules section must include: ${marker}`,
        });
      }
    }
  } else {
    violations.push({
      rule: "multi-tenancy-doc-missing",
      file: multiTenancyDocPath,
      message: `Missing ${MULTI_TENANCY_DOC_REFERENCE}`,
    });
  }

  if (existsSync(deliveryDocPath)) {
    const deliveryDoc = readFileSync(deliveryDocPath, "utf8");

    if (!deliveryDoc.includes("## Dependency decisions")) {
      violations.push({
        rule: "delivery-doc-section-missing",
        file: deliveryDocPath,
        message: "Delivery doc must include ## Dependency decisions",
      });
    }

    for (const owner of MULTI_TENANCY_AUTHORITY_OWNERS) {
      if (!deliveryDoc.includes(owner.owner)) {
        violations.push({
          rule: "delivery-doc-owner-missing",
          file: deliveryDocPath,
          message: `Dependency decisions must document authority owner ${owner.owner}`,
        });
      }
    }

    const dependencyEnforcementMarkers = [
      "check:multi-tenancy-dependency-rules",
      "quality:multi-tenancy-dependency-rules",
      "lib/multi-tenancy-dependency-enforcement.mts",
      "ARCHITECTURE_REGISTRY_DRIFT_SOURCES",
      "No deep imports",
      "No unapproved dependencies",
      "must not duplicate permission engine",
    ] as const;

    for (const marker of dependencyEnforcementMarkers) {
      if (!deliveryDoc.includes(marker)) {
        violations.push({
          rule: "delivery-doc-enforcement-missing",
          file: deliveryDocPath,
          message: `Dependency decisions must document enforcement for: ${marker}`,
        });
      }
    }
  } else {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `Missing ${TIP_007_012_DELIVERY_DOC}`,
    });
  }

  for (const edge of MULTI_TENANCY_REQUIRED_APPROVED_RUNTIME_EDGES) {
    if (!edgeExistsInRegistry(edge.from, edge.to)) {
      violations.push({
        rule: "required-registry-edge-missing",
        file: join(
          repoRoot,
          "packages/architecture-authority/src/data/dependency-registry.data.ts"
        ),
        message: `${edge.from} → ${edge.to} must be in dependency registry runtimeEdges: ${edge.reason}`,
      });
      continue;
    }

    if (!edgeApprovedForPackage(edge.from, edge.to)) {
      violations.push({
        rule: "required-registry-edge-not-approved",
        file: join(
          repoRoot,
          "packages/architecture-authority/src/data/dependency-registry.data.ts"
        ),
        message: `${edge.from} → ${edge.to} must be in approvedRuntimeByPackage[${edge.from}]: ${edge.reason}`,
      });
    }
  }

  violations.push(...collectForbiddenRuntimeEdgeViolations(repoRoot));
  violations.push(...collectForbiddenPackageDependencyViolations(repoRoot));
  violations.push(...collectErpPermissionEngineDuplicationViolations(repoRoot));

  const architectureViolations =
    await collectLiveArchitectureValidationViolations(repoRoot);
  violations.push(...architectureViolations);

  return violations;
}

export function formatMultiTenancyDependencyRulesViolations(
  violations: readonly MultiTenancyDependencyRulesViolation[]
): string {
  if (violations.length === 0) {
    return "Multi-tenancy dependency rules gate passed.";
  }

  return violations
    .map(
      (violation) =>
        `[${violation.rule}] ${violation.file}\n  ${violation.message}`
    )
    .join("\n\n");
}

async function main(): Promise<void> {
  const violations = await checkMultiTenancyDependencyRules();

  if (violations.length > 0) {
    console.error(formatMultiTenancyDependencyRulesViolations(violations));
    process.exitCode = 1;
    return;
  }

  console.log("Multi-tenancy dependency rules gate passed.");
}

await main();
