import type { PackageDefinition } from "../contracts/package.contract.js";
import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import {
  createValidationResult,
  type ValidationResult,
} from "../contracts/validation-result.contract.js";
import { architectureGovernanceAmendmentRegistry } from "../data/architecture-governance-amendment.registry.js";
import { readLivePackageExportPaths } from "../data/export-surface-attestation.build.js";
import { packageContract } from "../data/package-registry.data.js";

const GOVERNANCE_AMENDMENT_GATE = "architecture-governance-amendment" as const;

function isGovernedLifecycle(lifecycle: string): boolean {
  return lifecycle === "active" || lifecycle === "active-exempt";
}

function missingEntryViolations(
  governedPackageNames: readonly string[],
  registryPackageNames: readonly string[],
  registryLabel: string
): ArchitectureViolation[] {
  const registrySet = new Set(registryPackageNames);
  const violations: ArchitectureViolation[] = [];

  for (const packageName of governedPackageNames) {
    if (!registrySet.has(packageName)) {
      violations.push({
        gate: GOVERNANCE_AMENDMENT_GATE,
        packageName,
        message: `${registryLabel} missing entry for governed package ${packageName}`,
      });
    }
  }

  for (const packageName of registryPackageNames) {
    if (!governedPackageNames.includes(packageName)) {
      violations.push({
        gate: GOVERNANCE_AMENDMENT_GATE,
        packageName,
        message: `${registryLabel} has orphan entry ${packageName} — not in governed package registry rows`,
      });
    }
  }

  return violations;
}

function validateConsumerExportSurfaceAttestation(
  governed: readonly PackageDefinition[]
): ArchitectureViolation[] {
  const violations: ArchitectureViolation[] = [];
  const attestationByPackage = new Map<string, Set<string>>();

  for (const entry of architectureGovernanceAmendmentRegistry.consumerExportAttestation) {
    const paths =
      attestationByPackage.get(entry.packageName) ?? new Set<string>();
    paths.add(entry.exportPath);
    attestationByPackage.set(entry.packageName, paths);
  }

  for (const pkg of governed) {
    const liveExports = new Set(readLivePackageExportPaths(pkg.path));
    const attestedExports =
      attestationByPackage.get(pkg.packageName) ?? new Set<string>();

    if (attestedExports.size === 0) {
      violations.push({
        gate: GOVERNANCE_AMENDMENT_GATE,
        packageName: pkg.packageName,
        message:
          "consumer export attestation missing — package.json exports must be attested (B44)",
      });
      continue;
    }

    for (const exportPath of liveExports) {
      if (!attestedExports.has(exportPath)) {
        violations.push({
          gate: GOVERNANCE_AMENDMENT_GATE,
          packageName: pkg.packageName,
          message: `consumer export attestation missing live export ${exportPath}`,
        });
      }
    }

    for (const exportPath of attestedExports) {
      if (!liveExports.has(exportPath)) {
        violations.push({
          gate: GOVERNANCE_AMENDMENT_GATE,
          packageName: pkg.packageName,
          message: `consumer export attestation orphan export ${exportPath} — not in package.json`,
        });
      }
    }
  }

  return violations;
}

export function validateArchitectureGovernanceAmendment(): ValidationResult {
  const governed = packageContract.packages.filter((pkg) =>
    isGovernedLifecycle(pkg.lifecycle)
  );
  const governedNames = governed.map((pkg) => pkg.packageName);

  const violations: ArchitectureViolation[] = [
    ...missingEntryViolations(
      governedNames,
      architectureGovernanceAmendmentRegistry.surfaceStability.map(
        (entry) => entry.packageName
      ),
      "surface-stability registry"
    ),
    ...missingEntryViolations(
      governedNames,
      architectureGovernanceAmendmentRegistry.extensionBoundaries.map(
        (entry) => entry.packageName
      ),
      "extension-boundary registry"
    ),
    ...missingEntryViolations(
      governedNames,
      architectureGovernanceAmendmentRegistry.systemMembership.map(
        (entry) => entry.packageName
      ),
      "architecture-system membership registry"
    ),
    ...missingEntryViolations(
      governedNames,
      architectureGovernanceAmendmentRegistry.targetState.map(
        (entry) => entry.packageName
      ),
      "target-state registry"
    ),
    ...missingEntryViolations(
      governedNames,
      architectureGovernanceAmendmentRegistry.goldenPathCatalog.map(
        (entry) => entry.packageName
      ),
      "golden-path catalog registry"
    ),
  ];

  for (const entry of architectureGovernanceAmendmentRegistry.goldenPathCatalog) {
    if (!entry.catalogComplete) {
      violations.push({
        gate: GOVERNANCE_AMENDMENT_GATE,
        packageName: entry.packageName,
        message:
          "golden-path catalog entry incomplete — requires owner, layer, system, registry row",
      });
    }
  }

  if (architectureGovernanceAmendmentRegistry.referencePatterns.length < 5) {
    violations.push({
      gate: GOVERNANCE_AMENDMENT_GATE,
      message:
        "reference-pattern catalog must declare at least five approved patterns",
    });
  }

  violations.push(...validateConsumerExportSurfaceAttestation(governed));

  return createValidationResult(violations);
}
