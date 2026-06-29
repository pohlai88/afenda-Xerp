import { describe, expect, it } from "vitest";

import {
  architectureGovernanceAmendmentRegistry,
  getExtensionBoundaryEntry,
  getSurfaceStabilityEntry,
} from "../data/architecture-governance-amendment.registry.js";
import { packageContract } from "../data/package-registry.data.js";
import { validateArchitectureGovernanceAmendment } from "../validators/validate-architecture-governance-amendment.js";

describe("@afenda/architecture-authority governance amendment registry (PAS-002 B43+)", () => {
  it("covers every active and active-exempt package in all amendment registries", () => {
    const governed = packageContract.packages.filter(
      (pkg) => pkg.lifecycle === "active" || pkg.lifecycle === "active-exempt"
    );

    expect(
      architectureGovernanceAmendmentRegistry.surfaceStability
    ).toHaveLength(governed.length);
    expect(
      architectureGovernanceAmendmentRegistry.extensionBoundaries
    ).toHaveLength(governed.length);
    expect(
      architectureGovernanceAmendmentRegistry.systemMembership
    ).toHaveLength(governed.length);
    expect(architectureGovernanceAmendmentRegistry.targetState).toHaveLength(
      governed.length
    );
    expect(
      architectureGovernanceAmendmentRegistry.goldenPathCatalog
    ).toHaveLength(governed.length);
  });

  it("declares five reference patterns for metadata and bridge guidance", () => {
    expect(
      architectureGovernanceAmendmentRegistry.referencePatterns
    ).toHaveLength(5);
    expect(
      architectureGovernanceAmendmentRegistry.referencePatterns.some(
        (pattern) => pattern.patternId === "metadata-projection"
      )
    ).toBe(true);
  });

  it("marks platform governance packages as platform-only extension boundary", () => {
    const kernel = getExtensionBoundaryEntry("@afenda/kernel");
    const authority = getExtensionBoundaryEntry(
      "@afenda/architecture-authority"
    );

    expect(kernel?.boundaryClass).toBe("platform-only");
    expect(kernel?.partnerExtensible).toBe(false);
    expect(authority?.boundaryClass).toBe("platform-only");
  });

  it("assigns released stability to kernel and architecture authority", () => {
    expect(getSurfaceStabilityEntry("@afenda/kernel")?.stabilityClass).toBe(
      "released"
    );
    expect(
      getSurfaceStabilityEntry("@afenda/architecture-authority")?.stabilityClass
    ).toBe("released");
  });

  it("attests every package.json export for governed packages (B44)", () => {
    const governed = packageContract.packages.filter(
      (pkg) => pkg.lifecycle === "active" || pkg.lifecycle === "active-exempt"
    );

    expect(
      architectureGovernanceAmendmentRegistry.consumerExportAttestation.length
    ).toBeGreaterThan(governed.length);

    for (const pkg of governed) {
      const rows =
        architectureGovernanceAmendmentRegistry.consumerExportAttestation.filter(
          (entry) => entry.packageName === pkg.packageName
        );
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.stabilityClass).toBeTruthy();
        expect(row.exportKind).toBeTruthy();
      }
    }

    const authorityExports =
      architectureGovernanceAmendmentRegistry.consumerExportAttestation.filter(
        (entry) => entry.packageName === "@afenda/architecture-authority"
      );
    expect(authorityExports.map((entry) => entry.exportPath).sort()).toEqual([
      ".",
      "./surface",
    ]);
  });

  it("passes composite governance amendment validation", () => {
    const result = validateArchitectureGovernanceAmendment();
    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });
});
