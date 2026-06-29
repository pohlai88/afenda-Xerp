/**
 * PAS-002 amendment (B43+) — extension boundary, surface stability, golden-path
 * catalog, target-state, system membership, reference patterns.
 *
 * Derived from package-registry SSOT to prevent registry drift.
 */

import { ARCHITECTURE_BASELINE_FINGERPRINT } from "../contracts/architecture-authority-version.js";
import type {
  ArchitectureGovernanceAmendmentRegistry,
  ArchitectureSystemId,
  ExtensionBoundaryClass,
  ReferencePatternEntry,
  SurfaceStabilityClass,
} from "../contracts/architecture-governance-amendment.contract.js";
import type {
  ArchitectureLayer,
  PackageDefinition,
} from "../contracts/package.contract.js";
import { buildConsumerExportAttestation } from "./export-surface-attestation.build.js";
import { packageContract } from "./package-registry.data.js";

const GOVERNED_LIFECYCLES = new Set<PackageDefinition["lifecycle"]>([
  "active",
  "active-exempt",
]);

const RELEASED_PACKAGES = new Set<string>([
  "@afenda/kernel",
  "@afenda/architecture-authority",
  "@afenda/enterprise-knowledge",
  "@afenda/css-authority",
  "@afenda/ui",
  "@afenda/accounting-standards",
]);

const PROHIBITED_PACKAGES = new Set<string>([
  "@afenda/design-system",
  "@afenda/accounting",
  "@afenda/inventory",
]);

const PLATFORM_ONLY_PACKAGES = new Set<string>([
  "@afenda/kernel",
  "@afenda/architecture-authority",
  "@afenda/ai-governance",
  "@afenda/permissions",
  "@afenda/auth",
  "@afenda/database",
  "@afenda/observability",
]);

function resolveSystemId(layer: ArchitectureLayer): ArchitectureSystemId {
  switch (layer) {
    case "Platform":
      return "platform-governance";
    case "Foundation":
      return "foundation-runtime";
    case "Application":
    case "ERPSpine":
      return "erp-application";
    case "Design":
      return "design-presentation";
    case "Metadata":
      return "metadata-ui";
    case "Integration":
    case "Domain":
      return "integration-tooling";
    default:
      return "integration-tooling";
  }
}

function resolveSurfaceStability(
  pkg: PackageDefinition
): SurfaceStabilityClass {
  if (PROHIBITED_PACKAGES.has(pkg.packageName)) {
    return "prohibited";
  }

  if (RELEASED_PACKAGES.has(pkg.packageName)) {
    return "released";
  }

  if (
    pkg.layer === "Metadata" ||
    pkg.packageName === "@afenda/testing" ||
    pkg.packageName === "@afenda/typescript-config"
  ) {
    return "conditional";
  }

  if (pkg.lifecycle === "deprecated" || pkg.lifecycle === "retired") {
    return "classic";
  }

  return "conditional";
}

function resolveExtensionBoundary(
  pkg: PackageDefinition
): ExtensionBoundaryClass {
  if (PLATFORM_ONLY_PACKAGES.has(pkg.packageName)) {
    return "platform-only";
  }

  if (
    pkg.layer === "Application" ||
    pkg.layer === "ERPSpine" ||
    pkg.packageName === "@afenda/shadcn-studio"
  ) {
    return "on-stack-extensible";
  }

  if (pkg.layer === "Design" || pkg.layer === "Metadata") {
    return "hybrid-extensible";
  }

  return "on-stack-extensible";
}

function buildReferencePatterns(): readonly ReferencePatternEntry[] {
  return [
    {
      patternId: "bridge-module",
      displayName: "Bridge module",
      whenToUse:
        "Connect two packages with minimal explicit dependencies — no shared utility dump",
      examplePackages: ["@afenda/ui-composition"],
    },
    {
      patternId: "contracts-only-platform",
      displayName: "Contracts-only platform package",
      whenToUse:
        "Governance root that records truth without ERP request-time execution",
      examplePackages: ["@afenda/architecture-authority"],
    },
    {
      patternId: "governance-root",
      displayName: "Governance root",
      whenToUse:
        "Package validates structure via registries and gates — never imports governed runtime",
      examplePackages: [
        "@afenda/architecture-authority",
        "@afenda/ai-governance",
      ],
    },
    {
      patternId: "minimal-depends",
      displayName: "Minimal depends",
      whenToUse:
        "Keep dependency fan-out explicit and small — split utilities from bridge modules",
      examplePackages: ["@afenda/kernel"],
    },
    {
      patternId: "metadata-projection",
      displayName: "Metadata projection",
      whenToUse:
        "Render ERP UI from metadata contracts without duplicating business meaning",
      examplePackages: ["@afenda/metadata-ui", "@afenda/ui-composition"],
    },
  ] as const;
}

function buildRegistry(): ArchitectureGovernanceAmendmentRegistry {
  const governed = packageContract.packages.filter((pkg) =>
    GOVERNED_LIFECYCLES.has(pkg.lifecycle)
  );

  const surfaceStability = governed.map((pkg) => ({
    packageName: pkg.packageName,
    stabilityClass: resolveSurfaceStability(pkg),
    primaryExportSurface: pkg.packageName,
    notes: `Layer ${pkg.layer} · ${pkg.purpose.slice(0, 80)}`,
  }));

  const extensionBoundaries = governed.map((pkg) => {
    const boundaryClass = resolveExtensionBoundary(pkg);
    return {
      packageName: pkg.packageName,
      boundaryClass,
      partnerExtensible: boundaryClass !== "platform-only",
      notes: `Owner: ${pkg.publicApiOwner}`,
    };
  });

  const systemMembership = governed.map((pkg) => ({
    packageName: pkg.packageName,
    systemId: resolveSystemId(pkg.layer),
    layer: pkg.layer,
  }));

  const targetState = governed.map((pkg) => ({
    packageName: pkg.packageName,
    membership: "as-built" as const,
    targetNotes: "Registered in package registry — no planned migration",
  }));

  const goldenPathCatalog = governed.map((pkg) => ({
    packageName: pkg.packageName,
    ownerAuthority: pkg.publicApiOwner,
    layer: pkg.layer,
    systemId: resolveSystemId(pkg.layer),
    catalogComplete: Boolean(pkg.registryId && pkg.path && pkg.publicApiOwner),
  }));

  const consumerExportAttestation = buildConsumerExportAttestation(
    governed,
    resolveSurfaceStability
  );

  return {
    fingerprint: `${ARCHITECTURE_BASELINE_FINGERPRINT}-gov-amendment-v2`,
    surfaceStability,
    extensionBoundaries,
    systemMembership,
    targetState,
    goldenPathCatalog,
    referencePatterns: buildReferencePatterns(),
    consumerExportAttestation,
  };
}

export const architectureGovernanceAmendmentRegistry = buildRegistry();

export function getSurfaceStabilityEntry(packageName: string) {
  return architectureGovernanceAmendmentRegistry.surfaceStability.find(
    (entry) => entry.packageName === packageName
  );
}

export function getExtensionBoundaryEntry(packageName: string) {
  return architectureGovernanceAmendmentRegistry.extensionBoundaries.find(
    (entry) => entry.packageName === packageName
  );
}
